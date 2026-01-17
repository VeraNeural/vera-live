import { NextResponse } from 'next/server';
import { handleMessage, ChatResult } from '@/lib/vera/core/handleMessage';
import { getOrCreateSession, normalizeConversationId, buildSessionCookie } from '@/lib/vera/auth/sessionManager';
import { resolveTier } from '@/lib/vera/auth/tierResolver';
import { validateMessages } from '@/lib/vera/governance/messageValidator';
import type { ChatRequestBody, ChatContext } from '@/lib/vera/core/types';
import { meteringIdFromSessionId, recordMessage, resolveMeteringIdForClerkUserId } from '@/lib/auth/messageCounter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UNAVAILABLE = 'VERA is temporarily unavailable. Please try again.';

function jsonResponse(
  content: string,
  options?: { status?: number; gate?: string; extras?: Record<string, unknown> }
) {
  const payload: Record<string, unknown> = { content, ...(options?.extras ?? {}) };
  if (options?.gate) payload.gate = options.gate;
  return NextResponse.json(payload, { status: options?.status ?? 200 });
}

export async function POST(req: Request) {
  const startedAt = Date.now();

  try {
    // 1. Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Missing ANTHROPIC_API_KEY');
      return jsonResponse(UNAVAILABLE, { status: 500 });
    }

    // 2. Parse request
    const body: ChatRequestBody = await req.json();
    const { messages, conversationId: bodyConvoId, project_state, sanctuary_state } = body;

    // 3. Session management
    const { sessionId, shouldSetCookie } = await getOrCreateSession();

    // 4. Resolve tier & check limits
    const tierResult = await resolveTier(sessionId);
    if (tierResult.gateResponse) {
      return jsonResponse(tierResult.gateResponse.text, {
        gate: tierResult.gateResponse.gate,
      });
    }

    // 5. Validate messages
    const validation = validateMessages(messages, tierResult.tier);
    if (!validation.valid && validation.error) {
      return jsonResponse(validation.error.text, {
        status: validation.error.status,
      });
    }

    // 6. Build context
    const conversationId =
      normalizeConversationId(bodyConvoId) ??
      normalizeConversationId(req.headers.get('x-vera-conversation-id')) ??
      sessionId;

    const turnId = messages!.filter((m) => m.role === 'user').length;

    const context: ChatContext = {
      sessionId,
      userId: tierResult.userId,
      tier: tierResult.tier as any,
      conversationId,
      turnId,
      startedAt,
      projectState: project_state,
      sanctuaryState: sanctuary_state,
    };

    // 7. Handle message (all logic is in here)
    const result = await handleMessage(messages!, context);

    // 7.5 Record metering for tiers that are limited (best-effort)
    try {
      if (tierResult.tier === 'anonymous') {
        await recordMessage(meteringIdFromSessionId(sessionId), sessionId);
      } else if (tierResult.tier === 'free' && tierResult.userId) {
        const meteringId = await resolveMeteringIdForClerkUserId(tierResult.userId);
        await recordMessage(meteringId, sessionId);
      }
    } catch (e) {
      console.error('CHAT_METERING_RECORD_FAILED:', e);
    }

    // 8. Build response
    const extras: Record<string, unknown> = {};
    if (tierResult.tier === 'anonymous' && tierResult.nudge) {
      extras.nudge = tierResult.nudge;
    }

    const res = jsonResponse(result.content, { gate: result.gate, extras });

    // 9. Set cookies
    if (shouldSetCookie) {
      const cookie = buildSessionCookie(sessionId);
      res.cookies.set(cookie.name, cookie.value, cookie.options);
    }

    return res;

  } catch (err) {
    console.error('CHAT_ROUTE_ERROR:', err);
    return jsonResponse(UNAVAILABLE, { status: 500 });
  }
}
