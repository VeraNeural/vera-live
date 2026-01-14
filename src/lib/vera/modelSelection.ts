import type { DecisionObject } from './decisionObject';

export type ModelSelection = {
  model: 'anthropic' | 'openai' | 'grok_like';
  reason: string;
  safety_fallback: boolean;
};

function anthropic(reason: string, safety_fallback: boolean): ModelSelection {
  return { model: 'anthropic', reason, safety_fallback };
}

function openai(reason: string): ModelSelection {
  return { model: 'openai', reason, safety_fallback: false };
}

function grokLike(reason: string): ModelSelection {
  return { model: 'grok_like', reason, safety_fallback: false };
}

function hasAnyBand(decision: DecisionObject, bands: Array<'B1' | 'B2' | 'B3' | 'B4' | 'B5'>): boolean {
  const set = new Set(bands);
  return decision.adaptive_codes.some((c) => set.has(c.band as any));
}

function allBandsAre(decision: DecisionObject, band: 'B1' | 'B2' | 'B3' | 'B4' | 'B5'): boolean {
  // If there are no codes, this is false for safety.
  if (!decision.adaptive_codes.length) return false;
  return decision.adaptive_codes.every((c) => c.band === band);
}

// Deterministic, safety-first model selection policy.
// Routing decides what must happen; selection decides which model can safely do it.
export function selectModel(decision: DecisionObject | undefined | null): ModelSelection {
  // Rule 0 — Safety Default
  if (!decision || !decision.routing) {
    return anthropic('ambiguous decision object', true);
  }

  // IBA model override (conservative):
  // - Always allow override to Anthropic.
  // - Only allow override to OpenAI when Neural-led and challenge is none/gentle.
  // - Only allow override to Grok-class when the normal Grok conditions are satisfied.
  const override = decision.routing.iba_policy.model_override;
  if (override === 'anthropic') {
    return anthropic('IBA model override: force anthropic', false);
  }

  // Rule 1 — VERA-Led Always Uses Anthropic
  if (decision.routing.lead === 'V') {
    return anthropic('VERA-led: regulation and safety required', false);
  }

  // Rule 2 — Dysregulated or Dissociative State Forces Anthropic
  if (['dysregulated', 'shutdown', 'dissociated'].includes(decision.state.arousal)) {
    return anthropic('state override: nervous system safety', false);
  }

  // Rule 3 — Band 2 or Band 3 Codes Force Anthropic
  if (hasAnyBand(decision, ['B2', 'B3'])) {
    return anthropic('adaptive code safety band', false);
  }

  // Rule 4 — Neural-Led + No Challenge → OpenAI
  if (decision.routing.lead === 'N' && decision.routing.iba_policy.challenge === 'none') {
    if (override === 'openai') return openai('IBA model override: openai');
    return openai('Neural-led cognitive clarity without pressure');
  }

  // Rule 5 — Gentle Challenge → OpenAI (not Grok)
  if (decision.routing.lead === 'N' && decision.routing.iba_policy.challenge === 'gentle') {
    if (override === 'openai') return openai('IBA model override: openai');
    return openai('gentle challenge within cognitive safety');
  }

  // Rule 6 — Direct Challenge Allowed → Grok-Class (Guarded)
  if (
    decision.routing.lead === 'N' &&
    decision.routing.iba_policy.challenge === 'direct' &&
    decision.state.arousal === 'regulated' &&
    allBandsAre(decision, 'B1')
  ) {
    if (override === 'grok_like') return grokLike('IBA model override: grok_like');
    return grokLike('direct truth-pressure approved by IBA');
  }

  // If an unsafe override was requested, ignore and fall through to safety.

  // Rule 7 — Automatic Fallback to Anthropic
  return anthropic('fallback safety selection', true);
}
