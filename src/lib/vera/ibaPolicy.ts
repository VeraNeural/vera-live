import type { DecisionObject, Tier } from './decisionObject';
import type { Band } from './bands';
import { determineBand, hasAnyCodeInBand } from './bands';
import { detectLoop, userRequestedDirectness } from './detectors';

const DYSREGULATED_STATES = new Set(['dysregulated', 'shutdown', 'dissociated'] as const);

function defaultPolicy(): DecisionObject['routing']['iba_policy'] {
  return {
    tier: 'free',
    challenge: 'none',
    pace: 'normal',
    depth: 'light',
    questions_allowed: 1,
    somatic_allowed: false,
    memory_use: 'session',
    model_override: null,
    notes: 'default policy',
  };
}

function isPersistentTier(tier: Tier): boolean {
  return tier === 'build' || tier === 'sanctuary';
}

function computeReadinessScore(decision: Pick<DecisionObject, 'state' | 'intent'>): number {
  // Optional simplification: confidence dominates, regulated boosts, dissociation/shutdown reduce.
  const base = decision.state.confidence;
  if (decision.state.arousal === 'regulated') return Math.min(1, base + 0.2);
  if (decision.state.arousal === 'activated') return Math.max(0, base - 0.05);
  if (decision.state.arousal === 'dysregulated') return Math.max(0, base - 0.2);
  if (decision.state.arousal === 'shutdown') return Math.max(0, base - 0.25);
  return Math.max(0, base - 0.3);
}

export function buildIbaPolicy(input: {
  userText: string;
  convo: Array<{ role: 'user' | 'assistant'; content: string }>;
  intent: DecisionObject['intent'];
  state: DecisionObject['state'];
  adaptive_codes: DecisionObject['adaptive_codes'];
  tier?: Tier;
}): { policy: DecisionObject['routing']['iba_policy']; band: Band; lead: 'N' | 'V' } {
  const band = determineBand(input.adaptive_codes);
  const policy = defaultPolicy();
  if (input.tier) policy.tier = input.tier;
  if (policy.tier === 'sanctuary') {
    policy.memory_use = 'persistent';
    policy.pace = 'slow';
    policy.challenge = 'none';
    policy.questions_allowed = Math.min(policy.questions_allowed, 1);
    policy.notes = 'default sanctuary policy';
  }
  if (policy.tier === 'build') {
    policy.memory_use = 'persistent';
    if (input.state.arousal === 'regulated') {
      policy.depth = 'medium';
      policy.questions_allowed = 2;
    }
  }

  const norm = (s: string) => (s ?? '').toLowerCase();
  const lastAssistant = [...input.convo].reverse().find((m) => m.role === 'assistant')?.content ?? '';
  const userDistress = /(too much|stop|can't breathe|panicking|freaking out|overwhelmed|don't do that)/i.test(input.userText);
  const assistantInsight = /(what may be happening is|one possibility is|the reason is|this means)/i.test(lastAssistant);

  const isFallbackish = (t: string) => /(one step at a time|at your pace|get oriented without pushing|let me know what feels most helpful next)/i.test(t);
  const recentFallbacks = input.convo
    .filter((m) => m.role === 'assistant')
    .slice(-5)
    .filter((m) => isFallbackish(m.content)).length;

  const maxCodeConf = input.adaptive_codes.length ? Math.max(...input.adaptive_codes.map((c) => c.confidence)) : 0;

  // Failure priority: user escalation > post-response distress > state uncertainty > signal ambiguity > repeated fallbacks

  // Unexpected user escalation: route into conservative containment (crisis protocol is a separate spec).
  if (input.intent.primary === 'crisis') {
    const lead: 'N' | 'V' = 'V';
    policy.challenge = 'none';
    policy.pace = 'slow';
    policy.depth = 'light';
    policy.questions_allowed = 0;
    policy.somatic_allowed = false;
    policy.memory_use = isPersistentTier(policy.tier) ? 'persistent' : 'session';
    policy.model_override = 'anthropic';
    policy.notes = 'IBA: user escalation (crisis intent) => VERA-led, slow/light, no questions';
    return { policy, band, lead };
  }

  // Post-response user distress: immediate downshift.
  if (userDistress && assistantInsight) {
    const lead: 'N' | 'V' = 'V';
    policy.challenge = 'none';
    policy.pace = 'slow';
    policy.depth = 'light';
    policy.questions_allowed = 0;
    policy.somatic_allowed = false;
    policy.memory_use = isPersistentTier(policy.tier) ? 'persistent' : 'session';
    policy.model_override = 'anthropic';
    policy.notes = 'IBA: post-response distress => VERA-led, slow/light, no interpretation';
    return { policy, band, lead };
  }

  // Repeated safety fallbacks: lock session into VERA-only + light depth.
  if (recentFallbacks >= 3) {
    const lead: 'N' | 'V' = 'V';
    policy.challenge = 'none';
    policy.pace = 'slow';
    policy.depth = 'light';
    policy.questions_allowed = 0;
    policy.somatic_allowed = false;
    policy.memory_use = isPersistentTier(policy.tier) ? 'persistent' : 'session';
    policy.model_override = 'anthropic';
    policy.notes = 'IBA: repeated fallbacks (>=3 in 5) => lock VERA-only, light depth, no questions';
    return { policy, band, lead };
  }

  // Signal ambiguity: low-confidence state or low-confidence codes => conservative containment.
  if (input.state.confidence < 0.4 || (norm(input.state.signals.join(' ')).includes('state_ambiguous') && maxCodeConf < 0.65)) {
    const lead: 'N' | 'V' = 'V';
    policy.challenge = 'none';
    policy.pace = 'slow';
    policy.depth = 'light';
    policy.questions_allowed = 1;
    policy.somatic_allowed = input.intent.primary === 'somatic' || input.intent.primary === 'emotion';
    policy.memory_use = isPersistentTier(policy.tier) ? 'persistent' : 'session';
    policy.model_override = 'anthropic';
    policy.notes = 'IBA: signal ambiguity => VERA-led, slow/light, no challenge (anthropic)';
    return { policy, band, lead };
  }

  // Contract Rule D is enforced via the failure-mode handlers above.

  // Rule A: State beats intent (lead determination is here so we can enforce it centrally)
  let lead: 'N' | 'V' = 'N';

  if (DYSREGULATED_STATES.has(input.state.arousal as any)) {
    lead = 'V';
    policy.notes = 'state override: dysregulated/shutdown/dissociated => VERA-led';
    policy.model_override = 'anthropic';
  } else if (band === 'B2' || band === 'B3') {
    lead = 'V';
    policy.notes = 'band override: B2/B3 => VERA-led';
    policy.model_override = 'anthropic';
  } else if (band === 'B5' && input.state.arousal === 'activated') {
    lead = 'V';
    policy.notes = 'band+state override: B5 + activated => VERA-led';
    policy.model_override = 'anthropic';
  }

  // IBA Rule 2: State override
  if (DYSREGULATED_STATES.has(input.state.arousal as any)) {
    policy.challenge = 'none';
    policy.pace = 'slow';
    policy.depth = 'light';
    policy.questions_allowed = 1;
    policy.somatic_allowed = true;
    policy.memory_use = isPersistentTier(policy.tier) ? 'persistent' : 'session';
    policy.model_override = 'anthropic';
    policy.notes = 'IBA: state override active; suppress challenge, slow pace, light depth, allow somatic';
    return { policy, band, lead };
  }

  // Activated state: forbid insight pressure and slow down.
  if (input.state.arousal === 'activated') {
    const angerHeatCheck = band === 'B4' || hasAnyCodeInBand(input.adaptive_codes, 'B4');
    const resolvedBand: Band = angerHeatCheck ? 'B4' : band;
    if (angerHeatCheck) {
      lead = 'V';
    }

    policy.challenge = 'none';
    policy.pace = 'slow';
    policy.depth = 'light';
    policy.questions_allowed = 1;
    policy.somatic_allowed = input.intent.primary === 'somatic' || input.intent.primary === 'emotion';
    policy.model_override = 'anthropic';
    policy.notes = angerHeatCheck
      ? 'IBA: anger heat check (B4/anger + activated) => VERA-led, slow/light, no challenge'
      : 'IBA: activated state => no challenge, slow pace, light depth';
    return { policy, band: resolvedBand, lead };
  }

  // IBA Rule 1: No direct challenge in Band 2 or Band 3
  if (band === 'B2' || band === 'B3') {
    policy.challenge = 'none';
    policy.pace = band === 'B3' ? 'slow' : 'normal';
    policy.depth = band === 'B3' ? 'light' : 'medium';
    policy.questions_allowed = 1;
    policy.somatic_allowed = band === 'B3';
    policy.model_override = 'anthropic';
    policy.notes = `IBA: band safety ${band}; suppress challenge; pace/depth constrained`;

    // Rule 6: readiness gating
    const readiness = computeReadinessScore({ state: input.state, intent: input.intent });
    if (readiness < 0.5) {
      policy.depth = 'light';
      policy.questions_allowed = Math.min(policy.questions_allowed, 1);
      policy.notes = `${policy.notes}; readiness<0.5 => light depth`;
    }

    return { policy, band, lead };
  }

  // IBA Rule 5: Anticipation loop sequencing
  if (band === 'B5') {
    // Regulated B5: allow pattern interrupt + plan (gentle/direct gated by loop/directness)
    const loop = detectLoop(input.convo);
    const wantsDirect = userRequestedDirectness(input.userText);
    policy.challenge = loop || wantsDirect ? 'direct' : 'gentle';
    policy.pace = policy.challenge === 'direct' ? 'directive' : 'normal';
    policy.depth = 'medium';
    policy.questions_allowed = 2;
    policy.notes = `IBA: B5 regulated; challenge=${policy.challenge} (loop=${loop}, wantsDirect=${wantsDirect}); medium depth`; 
    return { policy, band, lead };
  }

  // Band 1: Cognitive/Strategic (Neural-first)
  if (band === 'B1') {
    const loop = detectLoop(input.convo);
    const wantsDirect = userRequestedDirectness(input.userText);
    policy.challenge = loop || wantsDirect ? 'direct' : 'gentle';
    policy.pace = policy.challenge === 'direct' ? 'directive' : 'normal';
    policy.depth = 'medium';
    policy.questions_allowed = 2;
    policy.notes = `IBA: B1 cognitive; challenge=${policy.challenge} (loop=${loop}, wantsDirect=${wantsDirect}); medium depth`; 

    // Rule 6: readiness gating
    const readiness = computeReadinessScore({ state: input.state, intent: input.intent });
    if (readiness < 0.5) {
      policy.challenge = 'none';
      policy.pace = 'normal';
      policy.depth = 'light';
      policy.questions_allowed = 1;
      policy.notes = 'IBA: readiness<0.5 => suppress challenge; light depth';
    }

    return { policy, band, lead };
  }

  // Unknown band: safety
  policy.challenge = 'none';
  policy.pace = 'normal';
  policy.depth = 'light';
  policy.questions_allowed = 1;
  policy.somatic_allowed = input.intent.primary === 'somatic';
  policy.model_override = 'anthropic';
  policy.notes = 'IBA: unknown band => safety fallback';

  return { policy, band, lead };
}
