import type { DecisionObject } from './decisionObject';

export type FailureMode =
  | 'signal_ambiguity'
  | 'state_uncertainty'
  | 'code_conflict'
  | 'layer_disagreement'
  | 'model_disagreement'
  | 'output_risk'
  | 'post_response_distress'
  | 'repeated_fallbacks'
  | 'unification_failure'
  | 'user_escalation';

export type FailureEvent = {
  mode: FailureMode;
  triggers: string[];
  actions: string[];
};

type Msg = { role: 'user' | 'assistant'; content: string };

function normalize(s: string): string {
  return (s ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function containsAny(text: string, needles: string[]): boolean {
  const t = normalize(text);
  return needles.some((n) => t.includes(n));
}

function lastAssistant(convo: Msg[]): string {
  return [...convo].reverse().find((m) => m.role === 'assistant')?.content ?? '';
}

function userDistressSignal(text: string): boolean {
  return containsAny(text, ['too much', 'stop', 'can\'t breathe', 'panicking', 'freaking out', 'overwhelmed', 'don\'t do that']);
}

function assistantLikelyDeliveredInsight(text: string): boolean {
  const t = normalize(text);
  return (
    t.includes('what may be happening is') ||
    t.includes('one possibility is') ||
    t.includes('the reason is') ||
    t.includes('this means')
  );
}

function isFallbackishAssistantText(text: string): boolean {
  const t = normalize(text);
  return (
    t.includes('one step at a time') ||
    t.includes('at your pace') ||
    t.includes('get oriented without pushing') ||
    t.includes('let me know what feels most helpful next')
  );
}

function countRecentFallbacks(convo: Msg[], windowTurns: number): number {
  const assistants = convo.filter((m) => m.role === 'assistant').slice(-windowTurns);
  return assistants.filter((m) => isFallbackishAssistantText(m.content)).length;
}

function hasCodeConflict(decision: DecisionObject): boolean {
  const hi = decision.adaptive_codes.filter((c) => c.confidence >= 0.75);
  const hasB1 = hi.some((c) => c.band === 'B1');
  const hasB23 = hi.some((c) => c.band === 'B2' || c.band === 'B3');
  return hasB1 && hasB23;
}

function maxAdaptiveCodeConfidence(decision: DecisionObject): number {
  if (!decision.adaptive_codes.length) return 0;
  return Math.max(...decision.adaptive_codes.map((c) => c.confidence));
}

export function detectFailureMode(input: {
  userText: string;
  convo: Msg[];
  decision: DecisionObject;
  unifier: { ok: boolean; strictApplied: boolean; violations?: string[] };
  noDrift: { ok: boolean; violations?: string[] };
  contractOk: boolean;
  contractViolations?: string[];
  modelCallFailed: boolean;
}): FailureEvent | null {
  const triggers: string[] = [];

  // Priority order (per spec): user escalation -> post-response distress -> state uncertainty -> unification failure -> output risk -> ...

  if (input.decision.intent.primary === 'crisis') {
    return {
      mode: 'user_escalation',
      triggers: ['intent=crisis'],
      actions: ['override_to_crisis_protocol', 'vera_lead', 'slow', 'light', 'no_challenge', 'anthropic'],
    };
  }

  if (userDistressSignal(input.userText) && assistantLikelyDeliveredInsight(lastAssistant(input.convo))) {
    triggers.push('user_distress_after_insight');
    return {
      mode: 'post_response_distress',
      triggers,
      actions: ['downshift_next_turn', 'vera_lead', 'slow', 'light', 'no_interpretation'],
    };
  }

  if (input.decision.state.signals.includes('state_ambiguous') || input.decision.state.signals.includes('decay_clamp')) {
    triggers.push('state_uncertainty_signal');
    return {
      mode: 'state_uncertainty',
      triggers,
      actions: ['treat_as_most_fragile', 'suppress_insight', 'vera_lead', 'slow', 'light', 'no_challenge'],
    };
  }

  if (!input.contractOk) {
    return {
      mode: 'layer_disagreement',
      triggers: (input.contractViolations ?? []).length ? input.contractViolations! : ['inter_layer_contract_violation'],
      actions: ['suppress_neural', 'fallback_response', 'log_violation'],
    };
  }

  if (!input.unifier.ok) {
    return {
      mode: 'unification_failure',
      triggers: (input.unifier.violations ?? []).length ? input.unifier.violations! : ['unifier_blocked'],
      actions: ['block_output', 'fallback_response', 'rerun_stricter_reduction'],
    };
  }

  if (!input.noDrift.ok) {
    return {
      mode: 'output_risk',
      triggers: (input.noDrift.violations ?? []).length ? input.noDrift.violations! : ['no_drift_blocked'],
      actions: ['block_or_replace_output', 'fallback_response'],
    };
  }

  if (countRecentFallbacks(input.convo, 5) >= 3) {
    return {
      mode: 'repeated_fallbacks',
      triggers: ['fallbacks>=3_in_5'],
      actions: ['lock_session_vera_only', 'anthropic_only', 'light_depth', 'stop_insight'],
    };
  }

  if (hasCodeConflict(input.decision)) {
    return {
      mode: 'code_conflict',
      triggers: ['high_conf_b1_and_b2or3'],
      actions: ['resolve_to_protective_band', 'block_challenge', 'observe_over_turns'],
    };
  }

  // Signal ambiguity: inconclusive state + low code confidence.
  const maxCode = maxAdaptiveCodeConfidence(input.decision);
  if (input.decision.state.confidence < 0.4 || (input.decision.state.signals.includes('state_ambiguous') && maxCode < 0.65)) {
    return {
      mode: 'signal_ambiguity',
      triggers: ['state_low_conf_or_ambiguous', `max_code_conf=${maxCode.toFixed(2)}`],
      actions: ['force_vera_lead', 'slow', 'light', 'no_challenge', 'anthropic'],
    };
  }

  // Model disagreement is not applicable in the current single-draft execution.
  if (input.modelCallFailed) {
    return {
      mode: 'output_risk',
      triggers: ['model_call_failed'],
      actions: ['fallback_response'],
    };
  }

  return null;
}
