import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { cookies } from 'next/headers';
import { createHash, randomUUID } from 'crypto';
import { buildMemoryPrompt, getUserMemory, saveConversation, updateConversation, updateUserMemory } from '@/lib/memory';
import { extractMemoryFromConversation } from '@/lib/memoryExtractor';
import { routeTurn } from '@/lib/vera/router';
import { composeSystemPrompt } from '@/lib/vera/promptComposer';
import { selectModel } from '@/lib/vera/modelSelection';
import { enforceNoDrift } from '@/lib/vera/noDrift';
import { buildAuditEvent, logAuditEvent } from '@/lib/vera/audit';
import { unifyVeraResponse } from '@/lib/vera/unifyVoice';
import { enforceInterLayerContract } from '@/lib/vera/interLayerContract';
import { detectFailureMode } from '@/lib/vera/failureModes';
import { logDecisionEvent } from '@/core/telemetry/logDecisionEvent';
import { finalizeResponse } from '@/lib/vera/finalizeResponse';
import { NEURAL_INTERNAL_SYSTEM_PROMPT } from '@/lib/vera/neuralPrompt';
import { IBA_INTERNAL_SYSTEM_PROMPT } from '@/lib/vera/ibaPrompt';
import { VERA_POLICY_VERSION } from '@/lib/vera/policyVersion';
import type { MemoryUse, Tier } from '@/lib/vera/decisionObject';
import { auth } from '@clerk/nextjs/server';
import { getUserAccessState } from '@/lib/auth/accessState';
import {
  checkMessageLimit,
  meteringIdFromSessionId,
  recordMessage,
  resolveMeteringIdForClerkUserId,
} from '@/lib/auth/messageCounter';
import type { Tier as AuthTier } from '@/lib/auth/tiers';
import type { BuildProjectState } from '@/lib/vera/buildTier';
import { isValidBuildProjectState, BUILD_ENTRY_FIRST_RESPONSE_TEMPLATE } from '@/lib/vera/buildTier';
import type { SanctuaryState } from '@/lib/vera/sanctuaryTier';
import { isValidSanctuaryState, SANCTUARY_ENTRY_FIRST_RESPONSE_TEMPLATE } from '@/lib/vera/sanctuaryTier';
import { evaluateSignalIntegrity } from '@/lib/sim/evaluateSignalIntegrity';
import { logTelemetry } from '@/lib/telemetry/logTelemetry';
import { buildThirdAssistantMessage, classifyUserIntent } from '@/lib/vera/thirdAssistantMessage';
import { buildFourthMessageEscalationOverlay } from '@/lib/vera/fourthAssistantEscalation';
import { evaluateUpgradeInvitation } from '@/lib/vera/upgradeInvitationGate';
import { validateIbaResponseStyle } from '@/lib/vera/ibaResponseStyle';
import { detectLoop } from '@/lib/vera/detectors';
import {
  canOfferChallengeConsent,
  decodeChallengeCookieState,
  encodeChallengeCookieState,
  nextChallengeCookieStateOnDecline,
  nextChallengeCookieStateOnPromptShown,
} from '@/lib/vera/challengeConsent';
import { computeDirectiveMode } from '@/lib/vera/chatEnvelope';
import challengeConsentPolicy from '../../../../policies/challenge_consent_policy.json';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UNAVAILABLE_CONTENT = 'VERA is temporarily unavailable. Please try again.';

const CHAT_MODEL_TIMEOUT_MS = 12_000;

function jsonContent(content: string, init?: ResponseInit): NextResponse {
  const payload: Record<string, unknown> = { content };
  assertSanctuaryCapabilityOnly(payload);
  return NextResponse.json(payload, init);
}

function assertSanctuaryCapabilityOnly(payload: Record<string, unknown>): void {
  // Guardrail: Sanctuary is a server-enforced capability state, not a client surface.
  // This assertion is about response *shape/semantics* only (not gating).
  const sanctuaryTokens = new Set(['sanctuary', '/sanctuary']);
  const forbiddenKeys = ['destination', 'surface', 'route', 'page', 'mode'];

  for (const key of forbiddenKeys) {
    const value = payload[key];
    if (typeof value === 'string' && sanctuaryTokens.has(value.trim().toLowerCase())) {
      throw new Error(`Sanctuary surface invariant violated: response includes ${key}=${JSON.stringify(value)}`);
    }
  }

  if (typeof payload.gate === 'string' && payload.gate.trim().toLowerCase() === 'sanctuary') {
    throw new Error('Sanctuary surface invariant violated: response includes gate="sanctuary"');
  }
}

function finalizeAndReturnText(input: {
  text: string;
  gate?: string;
  init?: ResponseInit;
  finalize?: { iba_active: boolean; sim_state: import('@/lib/vera/finalizeResponse').FinalizeSimState };
}): NextResponse {
  try {
    const finalized = finalizeResponse({
      text: typeof input.text === 'string' ? input.text : '',
      iba_active: Boolean(input.finalize?.iba_active),
      sim_state: (input.finalize?.sim_state ?? 'stable') as import('@/lib/vera/finalizeResponse').FinalizeSimState,
    });
    const payload: any = { content: finalized.text };
    if (input.gate) payload.gate = input.gate;
    assertSanctuaryCapabilityOnly(payload);
    return NextResponse.json(payload, input.init);
  } catch {
    const payload: any = { content: typeof input.text === 'string' ? input.text : '' };
    if (input.gate) payload.gate = input.gate;
    assertSanctuaryCapabilityOnly(payload);
    return NextResponse.json(payload, input.init);
  }
}

type IncomingMessage = { role: 'user' | 'assistant'; content: string };

type IncomingImage = {
  base64: string;
  mediaType: string;
};

type IncomingMessageWithImage = IncomingMessage & {
  image?: IncomingImage;
};

type RoutingTier = 'free' | 'sanctuary' | 'build';

type MemoryMessage = { role: 'user' | 'assistant'; content: string };

type ModelProvenance = {
  provider: 'anthropic' | 'openai' | 'grok' | 'qwen' | 'unknown';
  model_id: string;
  selection_reason: string;
  execution_path: 'planned' | 'fallback' | 'safety';
  finalize_applied: boolean;
  finalize_passed: boolean;
  no_drift_passed: boolean;
};

const SIM_ACTIVE = process.env.SIM_ACTIVE === 'true';

// Phased rollout: when IBA style is planned but SIM is not stable or the rubric fails,
// serve a conservative VERA fallback for a small percentage of sessions.
// Example: IBA_DRYRUN_FALLBACK_PCT=2 means 2% of sessions.
const IBA_DRYRUN_FALLBACK_PCT = Number.parseFloat(process.env.IBA_DRYRUN_FALLBACK_PCT ?? '0');

const CHALLENGE_POLICY_ID: string = (challengeConsentPolicy as any)?.policy_id ?? 'VERA-UI-CHALLENGE-CONSENT-001';
const CHALLENGE_ON_TEXT = 'Challenge mode: On (this message only)';
const CHALLENGE_OFF_TEXT = 'Challenge mode: Off';

type ChallengeChoice = 'challenge_on' | 'challenge_off';
type ChallengeScope = 'single_turn' | 'none';

type ChallengeCookieState = import('@/lib/vera/challengeConsent').ChallengeCookieState;

const SECOND_ASSISTANT_ANCHOR =
  "I'm here with you.\n\nWe can take this one step at a time — whether you want to think something through, build something concrete, or just get things out of your head.\n\nWhat would be most helpful right now?";

function isSecondAssistantAnchor(content: string | undefined): boolean {
  return (content ?? '').trim() === SECOND_ASSISTANT_ANCHOR.trim();
}

function isThirdAssistantMessageStage(messages: IncomingMessage[]): boolean {
  const userCount = messages.filter((m) => m.role === 'user').length;
  const assistantCount = messages.filter((m) => m.role === 'assistant').length;
  if (userCount !== 1 || assistantCount !== 1) return false;
  const assistant = messages.find((m) => m.role === 'assistant');
  return isSecondAssistantAnchor(assistant?.content);
}

function isFourthAssistantMessageStage(messages: IncomingMessage[]): boolean {
  const userCount = messages.filter((m) => m.role === 'user').length;
  const assistantMessages = messages.filter((m) => m.role === 'assistant');
  if (userCount !== 2 || assistantMessages.length !== 2) return false;

  const hasAnchor = assistantMessages.some((m) => isSecondAssistantAnchor(m.content));
  const hasThird = assistantMessages.some((m) =>
    m.content &&
    [
      "Thank you for saying that.\n\nBefore we try to fix or decide anything, let's slow this down just enough so we understand what you're actually carrying.\n\nWhat feels heaviest right now — the situation itself, or how it's affecting you?",
      "Let's get clear before we go deep.\n\nIf you had to name the one thing that feels most unclear or tangled right now, what would it be?",
      "Got it — we can build this together.\n\nTo start cleanly: what are you trying to create, and who is it for?",
      "Happy to explore this with you.\n\nAre you looking to understand this at a high level, or do you want something practical you can use right away?",
      "Decisions get heavy when too many things are competing at once.\n\nWhat feels more urgent here: making the right choice, or avoiding a bad one?",
      "That's okay — we don't need a plan yet.\n\nI'm here. What's been taking up space in your head lately?",
    ].some((t) => (m.content ?? '').trim() === t.trim())
  );

  return hasAnchor && hasThird;
}

function computeEmotionalDensity(text: string): number {
  if (!text) return 0;
  const hits = [
    /\b(panicking|terrified|overwhelmed|desperate|shaking|numb|can't breathe|can't breathe)\b/gi,
    /\b(hate myself|can't do this|can't do this|i'm breaking|i'm breaking)\b/gi,
  ].reduce((acc, re) => acc + ((text.match(re) || []).length), 0);

  // Normalize by length to keep the score bounded.
  const lengthFactor = Math.max(20, text.length);
  return Math.max(0, Math.min(1, (hits * 40) / lengthFactor));
}

function hasDependencyMarkers(text: string): boolean {
  return /\b(only you|don't leave|don't leave|i need you|you are all i have)\b/i.test(text);
}

function hasCrisisMarkers(text: string): boolean {
  return /\b(kill myself|suicide|end it|self\s*harm|hurt myself|out of control|can't control myself|can't control myself)\b/i.test(text);
}

function hasUpgradePressure(text: string): boolean {
  // Heuristic only; not enforcement.
  return /\b(step by step|plan|roadmap|deliverable|ship|deadline|project|build this)\b/i.test(text);
}

function resolveAnthropicByTier(tier: RoutingTier): {
  canonical: string;
  apiModel: string;
  maxTokens: number;
} {
  // Canonical names must match specs/model_routing_policy.json preferred_models.
  if (tier === 'free') {
    return { canonical: 'claude-haiku', apiModel: 'claude-3-5-haiku-20241022', maxTokens: 400 };
  }
  if (tier === 'build') {
    return { canonical: 'claude-opus', apiModel: 'claude-3-opus-20240229', maxTokens: 2000 };
  }
  return { canonical: 'claude-sonnet', apiModel: 'claude-3-5-sonnet-20241022', maxTokens: 900 };
}

function deriveRuntimeTags(input: {
  tier: RoutingTier;
  responseText: string;
  stateSnapshot: { project_state?: unknown; sanctuary_state?: unknown };
}): string[] {
  const tags = new Set<string>();
  const text = input.responseText || '';

  // Generic, low-risk tags.
  if (text.includes('?')) tags.add('question');
  if (/\b(summary|in short|to recap)\b/i.test(text)) tags.add('summary');
  if (/(\n- |\n\d+\.|\bstep\b)/i.test(text)) tags.add('action');

  if (input.tier === 'sanctuary') {
    tags.add('reflection');
    tags.add('pacing');
    // Theme tracking is grounded in state presence (not raw text).
    if (input.stateSnapshot.sanctuary_state) tags.add('theme_tracking');
  }

  if (input.tier === 'build') {
    tags.add('action');
  }

  if (input.tier === 'free') {
    // Explicitly ensure we never tag project management in free.
    tags.delete('project_management');
  }

  if (!tags.size) tags.add('summary');
  return [...tags];
}

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

function isChallengeChoiceMessage(content: string | undefined): boolean {
  const t = (content ?? '').trim();
  return t === CHALLENGE_ON_TEXT || t === CHALLENGE_OFF_TEXT;
}

function choiceFromContent(content: string | undefined): ChallengeChoice | null {
  const t = (content ?? '').trim();
  if (t === CHALLENGE_ON_TEXT) return 'challenge_on';
  if (t === CHALLENGE_OFF_TEXT) return 'challenge_off';
  return null;
}

function rolloutEnabledBySession(sessionId: string, pct: number): boolean {
  if (!Number.isFinite(pct) || pct <= 0) return false;
  const clamped = Math.max(0, Math.min(100, pct));
  // Deterministic assignment by session id.
  const hex = sha256(sessionId).slice(0, 8);
  const n = Number.parseInt(hex, 16);
  if (!Number.isFinite(n)) return false;
  const bucket = n % 10000;
  return bucket < Math.floor((clamped / 100) * 10000);
}

function buildConservativeVeraFallback(): string {
  // Conservative, non-escalatory, single-question max, always soft-exitable.
  return [
    "Let's slow this down.",
    '',
    'What feels most important to name first?',
    '',
    'If this feels like too much, we can slow it down.',
  ].join('\n');
}

async function ensureSessionId(): Promise<{ sessionId: string; shouldSetCookie: boolean }> {
  const store = await cookies();
  const existing = store.get('vera_sid')?.value;
  if (existing) return { sessionId: existing, shouldSetCookie: false };
  return { sessionId: randomUUID(), shouldSetCookie: true };
}

function normalizeConversationId(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (trimmed.length > 128) return null;
  // Accept only simple identifier characters to avoid header/body injection.
  if (!/^[A-Za-z0-9_-]+$/.test(trimmed)) return null;
  return trimmed;
}

function extractTaggedBlocks(text: string): { vera?: string; neural?: string } {
  const veraMatch = text.match(/\[\[VERA\]\]([\s\S]*?)\[\[\/VERA\]\]/i);
  const neuralMatch = text.match(/\[\[NEURAL\]\]([\s\S]*?)\[\[\/NEURAL\]\]/i);

  const vera = veraMatch?.[1]?.trim();
  const neural = neuralMatch?.[1]?.trim();

  return { vera, neural };
}

function stripNeuralBlocks(text: string): string {
  return text
    .replace(/\[\[NEURAL\]\][\s\S]*?\[\[\/NEURAL\]\]/gi, '')
    .replace(/\[\[VERA\]\]/gi, '')
    .replace(/\[\[\/VERA\]\]/gi, '')
    .trim();
}

// FIX: Always return full messages array to preserve conversation history
// The memory_use policy should only affect the system prompt behavior, not message filtering
function selectMessagesForModel(
  messages: IncomingMessage[],
  memoryUse: MemoryUse
): IncomingMessage[] {
  return messages;
}

export async function POST(req: Request) {
  try {
    const startedAt = Date.now();

    const body = (await req.json()) as {
      messages?: IncomingMessageWithImage[];
      conversationId?: string;
      project_state?: BuildProjectState;
      sanctuary_state?: SanctuaryState;
      meta?: {
        challenge?: {
          policy_id?: string;
          user_choice?: ChallengeChoice;
          scope?: ChallengeScope;
          consent_ts?: string;
        };

        // Legacy (deprecated): kept for compatibility with older UI.
        challenge_choice?: ChallengeChoice;
        consent_ts?: string;
        scope?: ChallengeScope;
        prompt_id?: string;
      };
    };

    const { messages, conversationId: conversationIdFromBody, project_state, sanctuary_state } = body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return finalizeAndReturnText({
        text: UNAVAILABLE_CONTENT,
        init: { status: 500 },
        finalize: { iba_active: false, sim_state: 'stable' },
      });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return finalizeAndReturnText({
        text: 'Please send at least one message.',
        init: { status: 400 },
        finalize: { iba_active: false, sim_state: 'stable' },
      });
    }

    const { sessionId, shouldSetCookie } = await ensureSessionId();

    // Clerk is the only identity source.
    const { userId } = await auth();

    let entitlementTier: AuthTier = 'free';

    // Anonymous 5th response includes a soft invite.
    let anonymousSoftInvite = false;

    // Memory is Sanctuary-only (persistent). Loaded only for authenticated Sanctuary users.
    let memoryContext: Awaited<ReturnType<typeof getUserMemory>> | null = null;
    let memoryPrompt = '';

    const userIdForMetering: string | null = userId ?? null;

    // Access state is derived server-side from user_entitlements.
    const access = await getUserAccessState(userId ?? undefined);
    entitlementTier = access.state;

    // Access control MUST happen before governance.
    if (entitlementTier === 'anonymous') {
      const anonMeteringId = meteringIdFromSessionId(sessionId);
      const limitCheck = await checkMessageLimit({ tier: 'anonymous', meteringId: anonMeteringId });
      if (!limitCheck.allowed) {
        return finalizeAndReturnText({
          gate: 'signup_required',
          text: "I'm really enjoying our conversation. Sign up free to keep chatting — it only takes a second.",
          finalize: { iba_active: false, sim_state: 'stable' },
        });
      }
      if (limitCheck.count === 4) {
        anonymousSoftInvite = true;
      }
    }

    if (entitlementTier === 'free' && userIdForMetering) {
      const freeMeteringId = await resolveMeteringIdForClerkUserId(userIdForMetering);
      const limitCheck = await checkMessageLimit({ tier: 'free', meteringId: freeMeteringId });
      if (!limitCheck.allowed) {
        return finalizeAndReturnText({
          gate: 'upgrade_required',
          text:
            "You've been busy today! Join Sanctuary for unlimited conversations with me — plus voice, images, and I'll remember our chats.",
          finalize: { iba_active: false, sim_state: 'stable' },
        });
      }
    }

    if (entitlementTier === 'sanctuary' && userIdForMetering) {
      memoryContext = await getUserMemory(userIdForMetering);
      memoryPrompt = buildMemoryPrompt(memoryContext);
    }

    const incomingChallenge = body.meta?.challenge ??
      (body.meta?.challenge_choice
        ? {
            policy_id: body.meta.prompt_id,
            user_choice: body.meta.challenge_choice,
            consent_ts: body.meta.consent_ts,
            scope: body.meta.scope,
          }
        : undefined);

    const allowedVisionMediaTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
    const hasAnyImage = messages.some(
      (m) =>
        m.role === 'user' &&
        Boolean(m.image && typeof m.image.base64 === 'string' && typeof m.image.mediaType === 'string')
    );

    if (hasAnyImage) {
      // Server enforcement (UI also hides the button).
      if (entitlementTier !== 'sanctuary') {
        return finalizeAndReturnText({
          text: 'Image attachments are available for Sanctuary members.',
          init: { status: 403 },
          finalize: { iba_active: false, sim_state: 'stable' },
        });
      }

      for (const m of messages) {
        if (m.role !== 'user' || !m.image) continue;
        if (!allowedVisionMediaTypes.has(m.image.mediaType)) {
          return finalizeAndReturnText({
            text: 'Unsupported image type. Please use JPG, PNG, WebP, or GIF.',
            init: { status: 400 },
            finalize: { iba_active: false, sim_state: 'stable' },
          });
        }
        if (!m.image.base64 || m.image.base64.length < 8) {
          return finalizeAndReturnText({
            text: 'Invalid image payload.',
            init: { status: 400 },
            finalize: { iba_active: false, sim_state: 'stable' },
          });
        }
      }
    }

    const lastUserNonChoice = [...messages].reverse().find((m) => m.role === 'user' && !isChallengeChoiceMessage(m.content));
    const userText = lastUserNonChoice?.content ?? '';

    const incomingChoice: ChallengeChoice | null =
      incomingChallenge?.user_choice === 'challenge_on' || incomingChallenge?.user_choice === 'challenge_off'
        ? incomingChallenge.user_choice
        : null;

    // Sanctuary-tier requires an explicit sanctuary_state. Downgrade behavior is forbidden.
    if (entitlementTier === 'sanctuary' && !isValidSanctuaryState(sanctuary_state)) {
      const res = finalizeAndReturnText({
        text: SANCTUARY_ENTRY_FIRST_RESPONSE_TEMPLATE.first_response,
        finalize: { iba_active: false, sim_state: 'stable' },
      });
      if (shouldSetCookie) {
        res.cookies.set('vera_sid', sessionId, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        });
      }
      return res;
    }

    // Reduce client-influenced branching: downstream logic treats sanctuary_state as optional intent/context only.
    // For Sanctuary tier, the gate above ensures validity.
    const sanctuaryStateSafe: SanctuaryState | null = isValidSanctuaryState(sanctuary_state) ? sanctuary_state : null;
    const conversationId =
      normalizeConversationId(conversationIdFromBody) ||
      normalizeConversationId(req.headers.get('x-vera-conversation-id')) ||
      sessionId;
    const turnId = messages.filter((m) => m.role === 'user').length;

    const cookieStore = await cookies();
    const chalCookieRaw = cookieStore.get('vera_chal')?.value;
    const chalState = decodeChallengeCookieState(chalCookieRaw, { session_id: sessionId });
    let chalStateNext: ChallengeCookieState = { ...chalState };

    const tierResolved = (entitlementTier === 'sanctuary' ? 'sanctuary' : 'free') as Tier;

    // SHADOW MODE: evaluate SIM before the model call (observability only).
    // IMPORTANT: No throttling, no suppression, no pacing changes unless SIM_ACTIVE is explicitly enabled.
    const simInput = {
      tier: tierResolved,
      recent_messages: Array.isArray(messages) ? messages.length : 0,
      emotional_density: computeEmotionalDensity(userText),
      dependency_markers: hasDependencyMarkers(userText),
      crisis_markers: hasCrisisMarkers(userText),
      upgrade_pressure: hasUpgradePressure(userText),
      current_sim_state: 'stable' as const,
    };

    const simDecision = evaluateSignalIntegrity(simInput);

    // Challenge consent prompt eligibility (policy-controlled).
    const eligibility = (challengeConsentPolicy as any)?.eligibility ?? {};
    const minTurnsBeforeRepeat = typeof eligibility.min_turns_before_repeat === 'number' ? eligibility.min_turns_before_repeat : 12;
    const maxPromptsPerSession = typeof eligibility.max_prompts_per_session === 'number' ? eligibility.max_prompts_per_session : 2;
    const disallow = eligibility.disallow_if ?? {};

    const disallowedByMarkers =
      (disallow.crisis_markers === true && simInput.crisis_markers) ||
      (disallow.dependency_markers === true && simInput.dependency_markers) ||
      (disallow.upgrade_pressure === true && simInput.upgrade_pressure);

    // Remove consent-chip messages from governance reasoning.
    const governanceConvo = messages.filter((m) => !(m.role === 'user' && isChallengeChoiceMessage(m.content)));
    const loopDetected = detectLoop(governanceConvo);

    const challengeConsentAlreadyAsked = chalState.last_prompt_turn === turnId;

    const canOfferChallenge = canOfferChallengeConsent({
      sim_state: simDecision.next_sim_state,
      crisis_markers: Boolean(simInput.crisis_markers),
      dependency_markers: Boolean(simInput.dependency_markers),
      upgrade_pressure: Boolean(simInput.upgrade_pressure),
      loop_detected: loopDetected,
      turn_id: turnId,
      cookie: chalState,
      min_turns_before_repeat: minTurnsBeforeRepeat,
      max_prompts_per_session: maxPromptsPerSession,
      challenge_consent_already_asked: challengeConsentAlreadyAsked,
    });

    const canShowChallengePrompt = canOfferChallenge && !disallowedByMarkers && incomingChoice == null && !chalStateNext.consent;
    const policyUi = (challengeConsentPolicy as any)?.ui ?? {};
    const challengePromptTs = canShowChallengePrompt ? new Date().toISOString() : null;

    const shouldShowConsentChip = Boolean(canShowChallengePrompt && challengePromptTs);
    if (shouldShowConsentChip && challengePromptTs) {
      chalStateNext = nextChallengeCookieStateOnPromptShown({
        cookie: chalStateNext,
        turn_id: turnId,
        prompt_ts: challengePromptTs,
      });
    }

    // Persist incoming consent meta into session state (cookie). Do not treat as a user message.
    const incomingConsentTs = typeof incomingChallenge?.consent_ts === 'string' ? incomingChallenge.consent_ts : null;
    const incomingConsentPolicyId = typeof incomingChallenge?.policy_id === 'string' ? incomingChallenge.policy_id : null;
    const incomingConsentScope: ChallengeScope | null =
      incomingChallenge?.scope === 'single_turn' || incomingChallenge?.scope === 'none' ? incomingChallenge.scope : null;

    if (
      incomingChoice &&
      incomingConsentTs &&
      Number.isFinite(Date.parse(incomingConsentTs)) &&
      incomingConsentPolicyId === CHALLENGE_POLICY_ID &&
      incomingConsentScope
    ) {
      const consentTs = incomingConsentTs!;
      chalStateNext = {
        ...chalStateNext,
        consent: {
          policy_id: incomingConsentPolicyId,
          user_choice: incomingChoice,
          scope: incomingConsentScope,
          consent_ts: consentTs,
        },
      };
    }

    // If the user explicitly declines, respond with the canonical acknowledgement and suppress reprompting.
    const declineAck: string =
      typeof (challengeConsentPolicy as any)?.response_rules?.on_declined?.assistant_ack === 'string'
        ? (challengeConsentPolicy as any).response_rules.on_declined.assistant_ack
        : "Got it. We'll keep this steady and supportive.";

    const suppressTurns: number =
      typeof (challengeConsentPolicy as any)?.response_rules?.on_declined?.suppress_reprompt_for_turns === 'number'
        ? (challengeConsentPolicy as any).response_rules.on_declined.suppress_reprompt_for_turns
        : 12;

    if (incomingChoice === 'challenge_off') {
      const appliedTs = new Date().toISOString();
      const consentTs = incomingConsentTs ?? appliedTs;
      const nextState = nextChallengeCookieStateOnDecline({
        cookie: chalState,
        turn_id: turnId,
        suppress_reprompt_for_turns: suppressTurns,
      });

      await logTelemetry({
        session_id: sessionId,
        user_id: sessionId,
        tier: tierResolved,
        model_used: 'none_challenge_decline_ack',
        tokens_used: 0,
        latency_ms: Date.now() - startedAt,
        response_tags: deriveRuntimeTags({
          tier: (tierResolved === 'build' || tierResolved === 'sanctuary' ? tierResolved : 'free') as RoutingTier,
          responseText: declineAck,
          stateSnapshot: {
            project_state: project_state ?? null,
            sanctuary_state: sanctuaryStateSafe,
          },
        }),
        reflection_layers: simDecision.max_reflection_layers,
        abstraction_level: simDecision.max_abstraction_level,
        followup_count: Math.max(0, turnId - 1),
        sim_state: simDecision.next_sim_state,
        sim_interventions: simDecision.sim_interventions,
        sim_upgrade_suppressed: !simDecision.allow_upgrade_invite,
        sim_model_rerouted: Boolean(simDecision.force_model),
        tier_behavior_violation: false,
        forbidden_behavior_triggered: false,
        auto_correction_applied: false,
        invitation_shown: false,
        state_snapshot: {
          challenge: {
            prompt_shown: false,
            prompt_id: CHALLENGE_POLICY_ID,
            prompt_ts: chalState.last_prompt_ts ?? null,
            user_choice: 'challenge_off',
            consent_ts: consentTs,
            scope: 'none',
            applied_ts: appliedTs,
            iba_active: false,
            sim_state_at_apply: simDecision.next_sim_state,
            prompt_count_in_session: chalState.prompt_count,
          },
        } as any,
      });

      const res = finalizeAndReturnText({
        text: declineAck,
        finalize: { iba_active: false, sim_state: simDecision.next_sim_state },
      });
      if (shouldSetCookie) {
        res.cookies.set('vera_sid', sessionId, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        });
      }
      res.cookies.set('vera_chal', encodeChallengeCookieState(nextState, { session_id: sessionId }), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
      return res;
    }

    // For intent-based escalation and upgrade gating, use the first user input as the primary intent anchor.
    const firstUserText = governanceConvo.find((m) => m.role === 'user')?.content ?? '';
    const anchoredIntent = classifyUserIntent(firstUserText).intent;

    const isFourthStage = isFourthAssistantMessageStage(messages);
    const fourthOverlay = isFourthStage
      ? buildFourthMessageEscalationOverlay({ intent: anchoredIntent, sim: simDecision })
      : null;

    // THIRD ASSISTANT MESSAGE (first intelligent move):
    // - Intent classification (soft)
    // - SIM shadow-mode overlay (constraints only)
    // - Orientation-only response (no solutions)
    if (!hasCrisisMarkers(userText) && isThirdAssistantMessageStage(messages)) {
      const classification = classifyUserIntent(userText);
      const third = buildThirdAssistantMessage({ intent: classification.intent });

      const thirdQuestionsCount = (third.text.match(/\?/g) ?? []).length;
      const thirdTierMentioned = /\b(tier|free|sanctuary|build|professional)\b/i.test(third.text);
      const thirdUpgradeLanguageUsed = /\bupgrade\b/i.test(third.text);
      // These are templates: we assert the strict contract is satisfied.
      const thirdSolutionsProvided = false;
      const thirdFrameworksUsed = false;

      // Telemetry (server-only). Never includes raw user text.
      await logTelemetry({
        session_id: sessionId,
        user_id: sessionId,

        tier: tierResolved,
        model_used: 'none_third_message_template',

        tokens_used: 0,
        latency_ms: Date.now() - startedAt,

        response_tags: deriveRuntimeTags({
          tier: (tierResolved === 'build' || tierResolved === 'sanctuary' ? tierResolved : 'free') as RoutingTier,
          responseText: third.text,
          stateSnapshot: {
            project_state: project_state ?? null,
            sanctuary_state: sanctuaryStateSafe,
          },
        }),
        reflection_layers: simDecision.max_reflection_layers,
        abstraction_level: simDecision.max_abstraction_level,
        followup_count: 0,

        sim_state: simDecision.next_sim_state,
        sim_interventions: simDecision.sim_interventions,
        sim_upgrade_suppressed: !simDecision.allow_upgrade_invite,
        sim_model_rerouted: Boolean(simDecision.force_model),

        tier_behavior_violation: false,
        forbidden_behavior_triggered: false,
        auto_correction_applied: false,

        invitation_shown: false,

        state_snapshot: {
          third_message: {
            stage: 'third_assistant_message',
            intent_selected: classification.intent,
            intent_confidence: classification.confidence,
            response_template_id: third.templateId,
            ci_rule_id: 'CI-THIRD-MSG-001',
            questions_count: thirdQuestionsCount,
            solutions_provided: thirdSolutionsProvided,
            frameworks_used: thirdFrameworksUsed,
            tier_mentioned: thirdTierMentioned,
            upgrade_language_used: thirdUpgradeLanguageUsed,
            sim_state_before: simInput.current_sim_state,
            sim_state_after: simDecision.next_sim_state,
            abstraction_level_used: simDecision.max_abstraction_level,
            reflection_layers_used: simDecision.max_reflection_layers,
          },
        },
      });

      const res = finalizeAndReturnText({
        text: third.text,
        finalize: { iba_active: false, sim_state: simDecision.next_sim_state },
      });
      if (shouldSetCookie) {
        res.cookies.set('vera_sid', sessionId, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        });
      }
      return res;
    }

    const decision = routeTurn({ userText, convo: governanceConvo, tier: tierResolved });

    // Challenge consent gating:
    // - API contract: ui_directive.mode='challenge' is only allowed when prior consent exists in session state.
    // - If challenge is planned but consent is missing, downshift silently to conversation and mark auto-correction in telemetry.
    const requiredPreface: string =
      typeof (challengeConsentPolicy as any)?.response_rules?.on_granted?.required_preface === 'string'
        ? (challengeConsentPolicy as any).response_rules.on_granted.required_preface
        : "I'll be direct and grounded — not harsh. If it's too much, tell me.";

    const plannedChallenge = decision.routing.iba_policy.challenge === 'direct';

    const storedConsent = chalStateNext.consent;
    const storedConsentTsRaw = typeof storedConsent?.consent_ts === 'string' ? storedConsent.consent_ts : null;
    const storedConsentTsParsed = storedConsentTsRaw ? Date.parse(storedConsentTsRaw) : NaN;
    const storedConsentOk =
      storedConsent?.policy_id === CHALLENGE_POLICY_ID &&
      storedConsent?.user_choice === 'challenge_on' &&
      storedConsent?.scope === 'single_turn' &&
      Number.isFinite(storedConsentTsParsed);

    const promptWasShown = typeof chalStateNext.last_prompt_ts === 'string' && chalStateNext.last_prompt_ts.length > 0;
    const consentEligible =
      plannedChallenge &&
      storedConsentOk &&
      promptWasShown &&
      simDecision.next_sim_state === 'stable' &&
      loopDetected &&
      !disallowedByMarkers;

    const consentAttemptedButInvalid = incomingChoice === 'challenge_on' && !consentEligible;

    const directiveMode = computeDirectiveMode({
      challengePlanned: plannedChallenge,
      consentPresent: consentEligible,
    });

    if (directiveMode.autoCorrectionApplied) {
      decision.routing.iba_policy.challenge = 'gentle';
      decision.routing.iba_policy.notes = `${decision.routing.iba_policy.notes}; planned challenge but consent missing => auto-correct to conversation`;
    }

    const consentGrantedThisTurn = directiveMode.mode === 'challenge';

    // Consent prompt (chip-only) response: no model call.
    if (plannedChallenge && !consentEligible && shouldShowConsentChip && incomingChoice == null) {
      await logTelemetry({
        session_id: sessionId,
        user_id: sessionId,
        tier: tierResolved,
        model_used: 'none_challenge_consent_prompt',
        tokens_used: 0,
        latency_ms: Date.now() - startedAt,
        response_tags: deriveRuntimeTags({
          tier: (tierResolved === 'build' || tierResolved === 'sanctuary' ? tierResolved : 'free') as RoutingTier,
          responseText: '',
          stateSnapshot: {
            project_state: project_state ?? null,
            sanctuary_state: sanctuaryStateSafe,
          },
        }),
        reflection_layers: simDecision.max_reflection_layers,
        abstraction_level: simDecision.max_abstraction_level,
        followup_count: Math.max(0, turnId - 1),
        sim_state: simDecision.next_sim_state,
        sim_interventions: simDecision.sim_interventions,
        sim_upgrade_suppressed: !simDecision.allow_upgrade_invite,
        sim_model_rerouted: Boolean(simDecision.force_model),
        tier_behavior_violation: false,
        forbidden_behavior_triggered: false,
        auto_correction_applied: true,
        invitation_shown: false,
        state_snapshot: {
          challenge: {
            prompt_shown: true,
            prompt_id: CHALLENGE_POLICY_ID,
            prompt_ts: challengePromptTs ?? chalStateNext.last_prompt_ts ?? null,
            user_choice: null,
            consent_ts: storedConsentTsRaw,
            scope: 'none',
            applied_ts: null,
            iba_active: false,
            sim_state_at_apply: simDecision.next_sim_state,
            prompt_count_in_session: chalStateNext.prompt_count,
          },
        } as any,
      });

      const consentPrompt = [
        typeof (policyUi as any)?.prompt === 'string' ? (policyUi as any).prompt : 'Want a more direct take?',
        typeof (policyUi as any)?.subtext === 'string' ? (policyUi as any).subtext : 'Direct and grounded, never harsh.',
      ].join('\n');
      const res = finalizeAndReturnText({
        text: consentPrompt,
        finalize: { iba_active: false, sim_state: simDecision.next_sim_state },
      });
      if (shouldSetCookie) {
        res.cookies.set('vera_sid', sessionId, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        });
      }
      res.cookies.set('vera_chal', encodeChallengeCookieState(chalStateNext, { session_id: sessionId }), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
      return res;
    }

    // Telemetry hint is always returned in the response envelope.
    const telemetryHint = {
      consent_required: plannedChallenge && !consentEligible,
      challenge_planned: plannedChallenge,
    };

    const simPromptFlags = {
      simplifyLanguage: simDecision.next_sim_state !== 'stable',
      suppressUpgradeInvitations: !simDecision.allow_upgrade_invite,
    };

    const system = composeSystemPrompt(decision, {
      projectState: project_state ?? null,
      sanctuaryState: sanctuaryStateSafe,
      sim: SIM_ACTIVE ? simPromptFlags : undefined,
      // Fourth-message escalation is a backend-first rule; apply even when SIM_ACTIVE=false.
      // Memory prompt is Sanctuary-only.
      extraSystem: [memoryPrompt, fourthOverlay?.extraSystem].filter(Boolean).join('\n\n'),
    });

    // User escalation (crisis intent) is handled without model generation.
    if (decision.intent.primary === 'crisis') {
      const crisisText =
        "I'm here with you. If you're in immediate danger or thinking about harming yourself, call your local emergency number right now. If you're in the U.S., you can call or text 988. If you can, reach out to someone you trust and stay near other people. We can keep this very simple—tell me where you are and whether you're alone.";

      const responseTimeMs = Date.now() - startedAt;

      const failure = detectFailureMode({
        userText,
        convo: messages,
        decision,
        unifier: { ok: true, strictApplied: false },
        noDrift: { ok: true },
        contractOk: true,
        modelCallFailed: false,
      });

      await logDecisionEvent({
        conversationId,
        turnId,
        sessionId,
        userId: sessionId,
        decision: {
          intentPrimary: decision.intent.primary,
          intentSecondary: decision.intent.secondary,
          stateArousal: decision.state.arousal,
          stateConfidence: decision.state.confidence,
          stateSignals: decision.state.signals,
          adaptiveCodes: decision.adaptive_codes.map((c) => ({
            code: c.code,
            band: c.band,
            confidence: c.confidence,
          })),
          leadLayer: decision.routing.lead,
          challenge: decision.routing.iba_policy.challenge,
          pace: decision.routing.iba_policy.pace,
          depth: decision.routing.iba_policy.depth,
          questionsAllowed: decision.routing.iba_policy.questions_allowed,
          somaticAllowed: decision.routing.iba_policy.somatic_allowed,
        },
        model: {
          selected: 'anthropic',
          version: 'crisis_no_model',
          fallbackApplied: true,
          reason: 'user_escalation',
        },
        prompts: {
          veraHash: sha256(system),
          neuralHash: sha256(NEURAL_INTERNAL_SYSTEM_PROMPT),
          ibaHash: sha256(IBA_INTERNAL_SYSTEM_PROMPT),
        },
        policyVersion: VERA_POLICY_VERSION,
        output: {
          responseLengthChars: crisisText.length,
          responseTimeMs,
          unifierApplied: true,
          unifierStrictApplied: false,
          unifierBlocked: false,
          leakScanPassed: true,
        },
        failure: failure
          ? { mode: failure.mode, triggers: failure.triggers, actions: failure.actions }
          : undefined,
      });

      const res = finalizeAndReturnText({
        text: crisisText,
        finalize: { iba_active: false, sim_state: simDecision.next_sim_state },
      });
      if (shouldSetCookie) {
        res.cookies.set('vera_sid', sessionId, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        });
      }
      return res;
    }

    const selection = selectModel(decision);
    const execution =
      selection.model === 'anthropic'
        ? selection
        : {
            model: 'anthropic' as const,
            reason: `provider ${selection.model} not wired; safety fallback to anthropic`,
            safety_fallback: true,
          };

    // Internal logging only (never returned to the client)
    console.log('[VERA decision]', {
      intent: decision.intent,
      state: decision.state,
      adaptive_codes: decision.adaptive_codes,
      routing: decision.routing,
    });
    console.log('[IBA policy]', {
      model_override: decision.routing.iba_policy.model_override,
      notes: decision.routing.iba_policy.notes,
    });
    console.log('[VERA model]', { selected: selection, executed: execution });

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // Always use full message history for conversation continuity.
    // (Bypass memory_use filtering)
    const modelMessages = messages;

    const resolvedTier = (decision.routing.iba_policy.tier ?? 'free') as RoutingTier;
    const anthropicTier = resolveAnthropicByTier(resolvedTier);
    const executedModelVersion = anthropicTier.apiModel;
    const runtimeModelUsed = anthropicTier.canonical;

    // Response generation reads SIM decision (even when permissive).
    // In shadow mode (SIM_ACTIVE=false), these do not change runtime behavior.
    const modelOverrideFromSim = SIM_ACTIVE && simDecision.force_model ? simDecision.force_model : null;
    const effectiveExecutedModelVersion = modelOverrideFromSim ? executedModelVersion : executedModelVersion;
    const effectiveMaxTokens = SIM_ACTIVE
      ? anthropicTier.maxTokens
      : anthropicTier.maxTokens;

    let content = '';
    let modelCallFailed = false;
    let outputTokensUsed = 0;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), CHAT_MODEL_TIMEOUT_MS);

      try {
        const result = await client.messages.create({
          model: effectiveExecutedModelVersion,
          max_tokens: effectiveMaxTokens,
          system,
          messages: modelMessages.map((m) => {
          if (m.role === 'user' && m.image?.base64 && m.image?.mediaType) {
            return {
              role: m.role,
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: m.image.mediaType,
                    data: m.image.base64,
                  },
                },
                { type: 'text', text: m.content },
              ],
            };
          }

          return {
            role: m.role,
            content: m.content,
          };
          }) as any,
          signal: controller.signal,
        } as any);

        outputTokensUsed = (result as any)?.usage?.output_tokens ?? 0;

        content = result.content
          .filter((block) => block.type === 'text')
          .map((block) => block.text)
          .join('\n')
          .trim();
      } finally {
        clearTimeout(timeout);
      }
    } catch (modelErr) {
      modelCallFailed = true;
      console.error('[MODEL] execution failed', modelErr);
      content = "[[VERA]]I'm having trouble connecting right now. Please try again in a moment.[[/VERA]]";
    }

    const rawVeraCandidate = stripNeuralBlocks(content);
    let tagged = extractTaggedBlocks(content);

    // Resilience: if the model forgets [[VERA]] tags, treat the whole output as VERA.
    // This prevents the inter-layer contract from collapsing into the static safeFallback.
    if (!tagged.vera && rawVeraCandidate) {
      tagged = { ...tagged, vera: rawVeraCandidate };
    }

    // If Neural is leading but the model forgot the [[NEURAL]] JSON block,
    // do not collapse into the static safeFallback. Proceed with the VERA text
    // and synthesize an empty JSON handoff so the contract can pass.
    if (decision.routing.lead === 'N' && !tagged.neural && tagged.vera) {
      console.warn('[NEURAL handoff] missing; proceeding with VERA-only output');
      tagged = { ...tagged, neural: '{}' };
    }

    // VERA-leading turns must not include a NEURAL block; ignore if present.
    if (decision.routing.lead === 'V' && tagged.neural) {
      tagged = { ...tagged, neural: undefined };
    }

    if (tagged.neural) {
      console.log('[NEURAL handoff]', tagged.neural);
    }

    const contract = enforceInterLayerContract({ decision, tagged });
    if (!contract.ok) {
      console.warn('[INTER-LAYER CONTRACT] violation', { violations: contract.violations });
    }

    const veraCandidate = contract.ok ? contract.vera : contract.veraFallback;
    const unifiedResult = unifyVeraResponse({ draftText: veraCandidate, decision });
    if (!unifiedResult.ok) {
      console.warn('[UNIFIER] blocked response', { violations: unifiedResult.violations });
    }
    const unified = unifiedResult.text;
    const unifiedWithChallengePreface = consentGrantedThisTurn
      ? [requiredPreface, '', unified].join('\n')
      : unified;

    const upgrade = evaluateUpgradeInvitation({
      tier: tierResolved,
      messages,
      simInput,
      simDecision,
      intent: anchoredIntent,
    });

    // IBA style rubric auditing (governance-only) + phased dual-path dry-run.
    // - "planned" means the policy asked for direct challenge.
    // - "eligible" means SIM is stable (rubric forbids IBA style in non-stable).
    // - "active" means eligible + rubric passes AND we actually serve the planned response.
    // When not eligible or rubric fails, we also generate a conservative VERA fallback.
    // Under a low-percentage feature flag, we serve the fallback (validation phase).
    const ibaActiveCandidate = consentGrantedThisTurn && decision.routing.iba_policy.challenge === 'direct';
    const ibaStyleEligible = ibaActiveCandidate && simDecision.next_sim_state === 'stable';
    const ibaStyleValidation = ibaActiveCandidate ? validateIbaResponseStyle(unifiedWithChallengePreface) : null;
    const ibaRubricOk = Boolean(ibaStyleValidation?.ok);
    const ibaNeedsFallback = Boolean(ibaActiveCandidate && (!ibaStyleEligible || !ibaRubricOk));
    const fallbackCandidate = ibaNeedsFallback ? buildConservativeVeraFallback() : null;
    const serveFallback = ibaNeedsFallback && rolloutEnabledBySession(sessionId, IBA_DRYRUN_FALLBACK_PCT);
    const servedTextCandidateBase = serveFallback && fallbackCandidate ? fallbackCandidate : unifiedWithChallengePreface;
    const servedTextCandidate = anonymousSoftInvite
      ? `${servedTextCandidateBase}\n\n—\n\nI'm really enjoying our conversation. Sign up free to keep chatting — it only takes a second.`
      : servedTextCandidateBase;
    const servedPath: 'planned' | 'fallback' = serveFallback ? 'fallback' : 'planned';

    const noDrift = enforceNoDrift({ decision, selection, veraText: servedTextCandidate });
    const finalized = finalizeResponse({
      text: noDrift.vera,
      iba_active: ibaActiveCandidate,
      sim_state: simDecision.next_sim_state,
    });
    const servedText = finalized.text;

    const ibaTagActive = Boolean(ibaStyleEligible && ibaRubricOk && servedPath === 'planned' && noDrift.ok);
    const ibaStyleActive = ibaTagActive;

    const stateSnapshot: { project_state?: unknown; sanctuary_state?: unknown; sim?: unknown } = {};
    if (resolvedTier === 'build') stateSnapshot.project_state = project_state ?? null;
    if (resolvedTier === 'sanctuary') stateSnapshot.sanctuary_state = sanctuaryStateSafe;
    stateSnapshot.sim = {
      sim_active: SIM_ACTIVE,
      sim_input: {
        tier: simInput.tier,
        recent_messages: simInput.recent_messages,
        emotional_density: simInput.emotional_density,
        dependency_markers: simInput.dependency_markers,
        crisis_markers: simInput.crisis_markers,
        upgrade_pressure: simInput.upgrade_pressure,
        current_sim_state: simInput.current_sim_state,
      },
      sim_decision: simDecision,
    };

    if (ibaActiveCandidate && ibaStyleValidation) {
      (stateSnapshot as any).iba_style = {
        planned: true,
        eligible: ibaStyleEligible,
        active: ibaStyleActive,
        pressure_level: 2,
        reflection_layers_used: simDecision.max_reflection_layers,
        abstraction_level_used: simDecision.max_abstraction_level,
        user_exit_available: ibaStyleValidation.analysis.has_required_exit_line,
        ...ibaStyleValidation.analysis,
      };
    }

    if (ibaNeedsFallback) {
      (stateSnapshot as any).iba_dryrun = {
        stage: 'iba_style_dual_path_dryrun',
        ci_rule_id: 'CI-IBA-STYLE-001',
        served_path: servedPath,
        rollout_pct: IBA_DRYRUN_FALLBACK_PCT,
        planned_response: {
          hash: sha256(unifiedWithChallengePreface),
          length_chars: unifiedWithChallengePreface.length,
          eligible: ibaStyleEligible,
          rubric_ok: ibaRubricOk,
        },
        fallback_response: fallbackCandidate
          ? {
              hash: sha256(fallbackCandidate),
              length_chars: fallbackCandidate.length,
            }
          : null,
      };
    }

    const appliedTs = ibaTagActive ? new Date().toISOString() : null;
    (stateSnapshot as any).challenge = {
      prompt_shown: false,
      prompt_id: CHALLENGE_POLICY_ID,
      prompt_ts: (chalStateNext.last_prompt_ts ?? null) as string | null,
      user_choice: consentGrantedThisTurn ? 'challenge_on' : incomingChoice,
      consent_ts: storedConsentTsRaw,
      scope: consentGrantedThisTurn ? 'single_turn' : 'none',
      applied_ts: appliedTs,
      iba_active: ibaTagActive,
      sim_state_at_apply: simDecision.next_sim_state,
      prompt_count_in_session: chalStateNext.prompt_count,
    };

    if (fourthOverlay) {
      (stateSnapshot as any).fourth_message = {
        stage: 'fourth_assistant_message',
        ci_rule_id: 'CI-FOURTH-MSG-002',
        intent_selected: anchoredIntent,
        fourth_message_action_type: fourthOverlay.telemetry.fourth_message_action_type,
        reflection_layers_used: fourthOverlay.telemetry.reflection_layers_used,
        abstraction_level_used: fourthOverlay.telemetry.abstraction_level_used,
        grounding_applied: fourthOverlay.telemetry.grounding_applied,
        max_reflection_layers_from_SIM: simDecision.max_reflection_layers,
        max_abstraction_level_from_SIM: simDecision.max_abstraction_level,
        sim_state: simDecision.next_sim_state,
        analysis_used: simDecision.next_sim_state === 'overloaded' || simDecision.next_sim_state === 'protected' ? false : true,
      };
    }

    const runtime_log = {
      tier: resolvedTier,
      model_used: runtimeModelUsed,
      tokens_used: outputTokensUsed,
      response_tags: (() => {
        const base = deriveRuntimeTags({ tier: resolvedTier, responseText: servedText, stateSnapshot });
        if (!ibaTagActive) return base;
        const set = new Set(base);
        set.add('iba_active');
        return [...set];
      })(),
      state_snapshot: stateSnapshot,
    };
    console.log('[VERA runtime_log]', runtime_log);

    // Shadow-mode SIM telemetry (server-only). No raw user text.
    // Keep interventions minimal and marker-based per spec.
    const simInterventions: string[] = Array.isArray((simDecision as any).sim_interventions)
      ? (simDecision as any).sim_interventions
      : [];

    const modelProvenance = buildModelProvenance({
      effectiveExecutedModelVersion,
      selectionReason: modelCallFailed ? 'model_call_failed' : selection.reason,
      modelCallFailed,
      finalizePassed: finalized.finalize_passed,
      noDriftOk: noDrift.ok,
    });

    await logTelemetry({
      session_id: sessionId,
      user_id: sessionId,

      tier: tierResolved,
      model_used: runtimeModelUsed,

      tokens_used: outputTokensUsed,
      latency_ms: Date.now() - startedAt,

      response_tags: runtime_log.response_tags,
      reflection_layers: simDecision.max_reflection_layers,
      abstraction_level: simDecision.max_abstraction_level,
      followup_count: Math.max(0, turnId - 1),

      sim_state: simDecision.next_sim_state,
      sim_interventions: simInterventions,
      sim_upgrade_suppressed: !simDecision.allow_upgrade_invite,
      sim_model_rerouted: Boolean(simDecision.force_model),

      tier_behavior_violation: false,
      forbidden_behavior_triggered: false,
      auto_correction_applied:
        servedPath === 'fallback' ||
        !noDrift.ok ||
        consentAttemptedButInvalid ||
        (telemetryHint.challenge_planned && telemetryHint.consent_required),

      invitation_shown: Boolean(upgrade.invitation_shown),
      invitation_type: upgrade.invitation_type,
      emotional_state_at_invite: upgrade.emotional_state_at_invite,
      sim_state_at_invite: upgrade.sim_state_at_invite,

      // This runtime does not yet collect explicit user responses to invitations.

      state_snapshot: {
        ...(stateSnapshot as any),
        model_provenance: modelProvenance,
      } as any,
    });

    const failure = detectFailureMode({
      userText,
      convo: messages,
      decision,
      unifier: { ok: unifiedResult.ok, strictApplied: unifiedResult.strictApplied, violations: unifiedResult.ok ? undefined : unifiedResult.violations },
      noDrift: { ok: noDrift.ok, violations: noDrift.ok ? undefined : noDrift.violations },
      contractOk: contract.ok,
      contractViolations: contract.ok ? undefined : contract.violations,
      modelCallFailed,
    });

    const responseTimeMs = Date.now() - startedAt;
    const violations = noDrift.ok ? [] : noDrift.violations;
    const leakScanPassed = !violations.some((v) => v.startsWith('internal_leak:'));

    // Tier-1 telemetry (server-only). Never includes raw user text.
    await logDecisionEvent({
      conversationId,
      turnId,
      sessionId,
      userId: sessionId,
      modelProvenance,
      decision: {
        intentPrimary: decision.intent.primary,
        intentSecondary: decision.intent.secondary,
        stateArousal: decision.state.arousal,
        stateConfidence: decision.state.confidence,
        stateSignals: decision.state.signals,
        adaptiveCodes: decision.adaptive_codes.map((c) => ({
          code: c.code,
          band: c.band,
          confidence: c.confidence,
        })),
        leadLayer: decision.routing.lead,
        challenge: decision.routing.iba_policy.challenge,
        pace: decision.routing.iba_policy.pace,
        depth: decision.routing.iba_policy.depth,
        questionsAllowed: decision.routing.iba_policy.questions_allowed,
        somaticAllowed: decision.routing.iba_policy.somatic_allowed,
      },
      model: {
        selected: selection.model,
        version: executedModelVersion,
        fallbackApplied: modelCallFailed || execution.model !== selection.model || execution.safety_fallback,
        reason: modelCallFailed ? 'model_call_failed' : selection.reason,
      },
      prompts: {
        veraHash: sha256(system),
        neuralHash: sha256(NEURAL_INTERNAL_SYSTEM_PROMPT),
        ibaHash: sha256(IBA_INTERNAL_SYSTEM_PROMPT),
      },
      policyVersion: VERA_POLICY_VERSION,
      output: {
        responseLengthChars: (servedText || '').length,
        responseTimeMs,
        unifierApplied: true,
        unifierStrictApplied: unifiedResult.strictApplied,
        unifierBlocked: !unifiedResult.ok,
        leakScanPassed,
      },
      failure: failure ? { mode: failure.mode, triggers: failure.triggers, actions: failure.actions } : undefined,
    });

    // Structured audit log (server-only)
    logAuditEvent(
      buildAuditEvent({
        decision,
        selected: selection,
        executed: execution,
        violations: noDrift.ok ? undefined : noDrift.violations,
      })
    );

    if (!noDrift.ok) {
      console.warn('[NO-DRIFT] blocked response', { violations: noDrift.violations });
    }

    // Consume single-turn consent after applying (or after an attempted grant).
    if (incomingChoice === 'challenge_on' || consentGrantedThisTurn) {
      chalStateNext = { ...chalStateNext, consent: undefined };
    }

    const responseMode = consentGrantedThisTurn ? 'challenge' : 'conversation';
    const finalContent = modelCallFailed ? UNAVAILABLE_CONTENT : servedText;

    // Fire-and-forget memory update (Sanctuary only). Never blocks the response.
    if (userIdForMetering && entitlementTier === 'sanctuary') {
      const transcript: MemoryMessage[] = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }));

      void updateMemoryInBackground({
        userId: userIdForMetering,
        conversationId,
        messages: [...transcript, { role: 'assistant', content: finalContent }],
        existingMemory: memoryContext?.memory,
      });
    }

    if (entitlementTier === 'anonymous') {
      const anonMeteringId = meteringIdFromSessionId(sessionId);
      await recordMessage(anonMeteringId);
    }

    if (userIdForMetering && entitlementTier === 'free') {
      const freeMeteringId = await resolveMeteringIdForClerkUserId(userIdForMetering);
      await recordMessage(freeMeteringId);
    }

    const res = finalizeAndReturnText({
      text: finalContent,
      finalize: {
        iba_active: Boolean(!modelCallFailed && ibaActiveCandidate),
        sim_state: simDecision.next_sim_state,
      },
    });
    if (shouldSetCookie) {
      res.cookies.set('vera_sid', sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    res.cookies.set('vera_chal', encodeChallengeCookieState(chalStateNext, { session_id: sessionId }), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err) {
    console.error('Chat route error:', err);
    return finalizeAndReturnText({
      text: UNAVAILABLE_CONTENT,
      init: { status: 500 },
      finalize: { iba_active: false, sim_state: 'stable' },
    });
  }
}

async function updateMemoryInBackground(input: {
  userId: string;
  conversationId?: string;
  messages: MemoryMessage[];
  existingMemory: { name?: string; key_facts?: string[] } | undefined;
}) {
  try {
    // Extract memory conservatively every 5 messages early on, then periodically.
    if (input.messages.length % 5 !== 0 && input.messages.length < 10) {
      return;
    }

    const extracted = await extractMemoryFromConversation(input.messages, input.existingMemory);
    if (!extracted) return;

    const memoryUpdates: Record<string, unknown> = {};
    if (extracted.name) {
      memoryUpdates.name = extracted.name;
    }

    if (extracted.key_facts && extracted.key_facts.length > 0) {
      const existingFacts = input.existingMemory?.key_facts || [];
      const allFacts = [...new Set([...existingFacts, ...extracted.key_facts])];
      memoryUpdates.key_facts = allFacts.slice(-20);
    }

    if (Object.keys(memoryUpdates).length > 0) {
      await updateUserMemory(input.userId, memoryUpdates as any);
    }

    if (input.conversationId) {
      await updateConversation(input.conversationId, input.messages, extracted.summary);
    } else if (input.messages.length >= 4) {
      await saveConversation(input.userId, input.messages, undefined, extracted.summary);
    }
  } catch (err) {
    console.error('[Memory Background Update] Error:', err);
  }
}

function buildModelProvenance(input: {
  effectiveExecutedModelVersion: string;
  selectionReason: string;
  modelCallFailed: boolean;
  finalizePassed: boolean;
  noDriftOk: boolean;
}): ModelProvenance {
  try {
    return {
      provider: 'anthropic',
      model_id: String(input.effectiveExecutedModelVersion ?? ''),
      selection_reason: String(input.selectionReason ?? ''),
      execution_path: input.modelCallFailed ? 'fallback' : 'planned',
      finalize_applied: true,
      finalize_passed: Boolean(input.finalizePassed),
      no_drift_passed: Boolean(input.noDriftOk),
    };
  } catch {
    return {
      provider: 'anthropic',
      model_id: 'unknown',
      selection_reason: 'unknown',
      execution_path: 'planned',
      finalize_applied: true,
      finalize_passed: false,
      no_drift_passed: false,
    };
  }
}