import type { DecisionObject, Tier } from './decisionObject';

export type SIMSignalState = 'stable' | 'strained' | 'overloaded' | 'protected';

export type SignalIntegrityTelemetry = {
  signal_state: SIMSignalState;
  interventions_applied: string[];
  duration_in_state_ms: number;
  upgrade_suppressed: boolean;
  model_rerouted: boolean;
};

export type ApplySimResult = {
  decision: DecisionObject;
  telemetry: SignalIntegrityTelemetry;
  promptFlags: {
    simplifyLanguage: boolean;
    suppressUpgradeInvitations: boolean;
  };
  maxTokensMultiplier: number;
  pauseAdaptiveCodes: boolean;
};

type SimInputs = {
  tier: Tier;
  userText: string;
  convo: Array<{ role: 'user' | 'assistant'; content: string }>;
  tokensUsed?: number;
  latencyMs?: number;
};

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function containsAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

function detectCrisisLanguage(text: string): boolean {
  return containsAny(text, [
    /\b(kill myself|suicide|end it|self\s*harm|hurt myself)\b/i,
    /\b(can't control myself|out of control|going to do something bad)\b/i,
  ]);
}

function detectConfusionMarkers(text: string): boolean {
  return containsAny(text, [/\b(i don't understand|confused|what do you mean|doesn't make sense)\b/i]);
}

function detectDependencyLanguage(text: string): boolean {
  return containsAny(text, [/\b(only you|don't leave|i need you|you are all i have)\b/i]);
}

function detectEmotionalDensity(text: string): boolean {
  // Heuristic: lots of affect terms or repeated intensifiers.
  return containsAny(text, [
    /\b(panicking|terrified|overwhelmed|desperate|shaking|numb|can't breathe)\b/i,
    /(!!!|\bso\s+much\b|\breally\s+really\b)/i,
  ]);
}

function detectTierBoundaryPressure(tier: Tier, userText: string): boolean {
  if (tier === 'sanctuary') {
    return /\b(step by step|plan|roadmap|deliverable|ship|deadline|project)\b/i.test(userText);
  }
  if (tier === 'build') {
    return /\b(trauma|therapy|hold me|comfort me|i can't cope|i need emotional support)\b/i.test(userText);
  }
  return false;
}

function computeSimState(inputs: SimInputs): { state: SIMSignalState; score: number; crisis: boolean } {
  const text = inputs.userText || '';
  const crisis = detectCrisisLanguage(text);

  // Score is intentionally conservative and content-light.
  let score = 0;

  if (detectEmotionalDensity(text)) score += 0.35;
  if (detectConfusionMarkers(text)) score += 0.2;
  if (detectDependencyLanguage(text)) score += 0.25;
  if (detectTierBoundaryPressure(inputs.tier, text)) score += 0.2;

  // System signals (optional)
  if (typeof inputs.tokensUsed === 'number' && inputs.tokensUsed > 900) score += 0.2;
  if (typeof inputs.latencyMs === 'number' && inputs.latencyMs > 3500) score += 0.2;

  score = clamp(score, 0, 1);

  if (crisis) {
    return { state: 'protected', score: 1, crisis };
  }

  if (score >= 0.85) return { state: 'protected', score, crisis };
  if (score >= 0.6) return { state: 'overloaded', score, crisis };
  if (score >= 0.3) return { state: 'strained', score, crisis };
  return { state: 'stable', score, crisis };
}

function capStateByTier(tier: Tier, computed: SIMSignalState, crisis: boolean): SIMSignalState {
  if (tier === 'free') {
    if (crisis) return 'protected';
    // Free tier max state is strained.
    return computed === 'protected' || computed === 'overloaded' ? 'strained' : computed;
  }
  return computed;
}

function applyPolicyModulations(decision: DecisionObject, simState: SIMSignalState): { decision: DecisionObject; interventions: string[]; flags: ApplySimResult['promptFlags']; maxTokensMultiplier: number; pauseAdaptiveCodes: boolean } {
  const next: DecisionObject = structuredClone(decision);
  const interventions: string[] = [];

  let simplifyLanguage = false;
  let suppressUpgradeInvitations = false;
  let maxTokensMultiplier = 1;
  let pauseAdaptiveCodes = false;

  // SIM cannot introduce new content; it can only constrain.
  if (simState === 'stable') {
    return {
      decision: next,
      interventions,
      flags: { simplifyLanguage, suppressUpgradeInvitations },
      maxTokensMultiplier,
      pauseAdaptiveCodes,
    };
  }

  // strained: gentle modulation
  if (simState === 'strained') {
    interventions.push('simplify_language', 'reduce_response_length', 'enforce_single_question');
    simplifyLanguage = true;
    maxTokensMultiplier = 0.75;
    next.routing.iba_policy.depth = 'light';
    next.routing.iba_policy.questions_allowed = Math.min(next.routing.iba_policy.questions_allowed, 1);
    return {
      decision: next,
      interventions,
      flags: { simplifyLanguage, suppressUpgradeInvitations },
      maxTokensMultiplier,
      pauseAdaptiveCodes,
    };
  }

  // overloaded: active intervention
  if (simState === 'overloaded') {
    interventions.push('slow_pacing', 'simplify_language', 'reduce_response_length', 'suppress_upgrade_invitations', 'enforce_single_question');
    simplifyLanguage = true;
    suppressUpgradeInvitations = true;
    maxTokensMultiplier = 0.55;

    next.routing.lead = 'V';
    next.routing.support = ['N', 'V'];
    next.routing.iba_policy.pace = 'slow';
    next.routing.iba_policy.depth = 'light';
    next.routing.iba_policy.challenge = 'none';
    next.routing.iba_policy.questions_allowed = Math.min(next.routing.iba_policy.questions_allowed, 1);

    // Sanctuary rule: pause adaptive code inference when overloaded.
    if (next.routing.iba_policy.tier === 'sanctuary') {
      interventions.push('pause_adaptive_code_inference');
      pauseAdaptiveCodes = true;
    }

    return {
      decision: next,
      interventions,
      flags: { simplifyLanguage, suppressUpgradeInvitations },
      maxTokensMultiplier,
      pauseAdaptiveCodes,
    };
  }

  // protected: take control
  interventions.push(
    'insert_grounding_response',
    'slow_pacing',
    'simplify_language',
    'reduce_response_length',
    'suppress_upgrade_invitations',
    'pause_adaptive_code_inference',
    'reroute_model',
    'enforce_single_question'
  );

  simplifyLanguage = true;
  suppressUpgradeInvitations = true;
  maxTokensMultiplier = 0.4;
  pauseAdaptiveCodes = true;

  next.routing.lead = 'V';
  next.routing.support = ['N', 'V'];
  next.routing.iba_policy.pace = 'slow';
  next.routing.iba_policy.depth = 'light';
  next.routing.iba_policy.challenge = 'none';
  next.routing.iba_policy.questions_allowed = 0;
  next.routing.iba_policy.somatic_allowed = false;
  next.routing.iba_policy.model_override = 'anthropic';

  // Protected state: no adaptive codes are permitted.
  next.adaptive_codes = [];

  return {
    decision: next,
    interventions,
    flags: { simplifyLanguage, suppressUpgradeInvitations },
    maxTokensMultiplier,
    pauseAdaptiveCodes,
  };
}

export function applySignalIntegrityMode(input: {
  decision: DecisionObject;
  tier: Tier;
  userText: string;
  convo: Array<{ role: 'user' | 'assistant'; content: string }>;
  tokensUsed?: number;
  latencyMs?: number;
}): ApplySimResult {
  const computed = computeSimState({
    tier: input.tier,
    userText: input.userText,
    convo: input.convo,
    tokensUsed: input.tokensUsed,
    latencyMs: input.latencyMs,
  });

  const finalState = capStateByTier(input.tier, computed.state, computed.crisis);

  const mod = applyPolicyModulations(input.decision, finalState);

  // Apply pause-adaptive-codes outside the policy helper so tests can assert.
  const patchedDecision = mod.decision;
  if (mod.pauseAdaptiveCodes && finalState !== 'protected') {
    patchedDecision.adaptive_codes = [];
  }

  const telemetry: SignalIntegrityTelemetry = {
    signal_state: finalState,
    interventions_applied: mod.interventions,
    duration_in_state_ms: 0,
    upgrade_suppressed: mod.flags.suppressUpgradeInvitations,
    model_rerouted: mod.interventions.includes('reroute_model') || patchedDecision.routing.iba_policy.model_override === 'anthropic',
  };

  return {
    decision: patchedDecision,
    telemetry,
    promptFlags: mod.flags,
    maxTokensMultiplier: mod.maxTokensMultiplier,
    pauseAdaptiveCodes: mod.pauseAdaptiveCodes,
  };
}
