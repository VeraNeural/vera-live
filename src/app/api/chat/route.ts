import { NextResponse } from 'next/server';
import { handleMessage, ChatResult } from '@/lib/vera/core/handleMessage';
import { getOrCreateSession, normalizeConversationId, buildSessionCookie } from '@/lib/vera/auth/sessionManager';
import { resolveTier } from '@/lib/vera/auth/tierResolver';
import { validateMessages } from '@/lib/vera/governance/messageValidator';
import type { ChatRequestBody, ChatContext, RoutingTier } from '@/lib/vera/core/types';
import { meteringIdFromSessionId, recordMessage, resolveMeteringIdForClerkUserId } from '@/lib/auth/messageCounter';
import { authorize } from '@/lib/julija';

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

    // ============================================
    // JULIJA AUTHORIZATION LAYER
    // ============================================
    const authResult = await authorize({
      userId: tierResult.userId || 'anonymous',
      userTier: tierResult.tier || 'anonymous',
      userEmail: tierResult.userEmail || '',
      messageContent: messages?.[messages.length - 1]?.content || '',
      sessionContext: messages || [],
    });

    // Log authorization for audit trail (dev only)
    if (process.env.NODE_ENV === 'development') {
      console.log('[JULIJA]', {
        authorized: authResult.authorized,
        riskBand: authResult.riskBand,
        reason: authResult.reason,
      });
    }

    // If not authorized, return appropriate response
    if (!authResult.authorized) {
      return NextResponse.json({
        error: 'Access restricted',
        reason: authResult.reason,
        upgradeRequired: authResult.riskBand === 'orange' || authResult.riskBand === 'red',
      }, { status: 403 });
    }

    // Extract risk band for response shaping
    const riskBand = authResult.riskBand;

    // Log for monitoring (dev only)
    if (process.env.NODE_ENV === 'development') {
      console.log('[JULIJA] Authorization:', {
        authorized: authResult.authorized,
        riskBand,
        userId: tierResult.userId,
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

    const routingTier: RoutingTier =
      tierResult.tier === 'anonymous' ? 'free' : tierResult.tier;

    const context: ChatContext = {
      sessionId,
      userId: tierResult.userId,
      tier: routingTier,
      conversationId,
      turnId,
      startedAt,
      projectState: project_state,
      sanctuaryState: sanctuary_state,
      riskGuidance: '', // Initialize riskGuidance
    };

    // Add to system prompt based on risk band
    let riskGuidance = '';
    if (riskBand === 'yellow') {
      riskGuidance = '\n\nThe user may be experiencing stress. Use warm, empathetic language. Check in on how they are feeling.';
    } else if (riskBand === 'orange') {
      riskGuidance = '\n\nThe user may be in distress. Be gentle and grounding. Offer supportive presence. If appropriate, gently mention that support resources exist.';
    } else if (riskBand === 'red') {
      riskGuidance = '\n\nPRIORITY: User safety. Be present, calm, and supportive. Do not abandon. Provide crisis resources if appropriate (988 Suicide & Crisis Lifeline). Focus on immediate emotional safety.';
    }

    context.riskGuidance = riskGuidance; // Set riskGuidance in context

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
