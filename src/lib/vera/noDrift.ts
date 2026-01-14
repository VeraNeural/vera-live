import type { DecisionObject } from './decisionObject';
import type { ModelSelection } from './modelSelection';

export type NoDriftResult =
  | { ok: true; vera: string; violations: [] }
  | { ok: false; vera: string; violations: string[] };

const INTERNAL_MARKERS = [
  'neural',
  'iba',
  'anthropic',
  'openai',
  'grok',
  'claude',
  'gpt',
  'router',
  'routing',
  'decisionobject',
  'adaptive code',
  'band ',
  'b1',
  'b2',
  'b3',
  'b4',
  'b5',
  'model selection',
  'system prompt',
  '[[neural]]',
  '[[vera]]',
  '[[/neural]]',
  '[[/vera]]',
];

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

function countQuestions(text: string): number {
  return (text.match(/\?/g) ?? []).length;
}

function containsWhyQuestions(text: string): boolean {
  // catches lines like "Why..." or "... why ...?"
  return /\bwhy\b\s*\?/i.test(text) || /\?[^\n]*\bwhy\b/i.test(text);
}

function hasModelOrLayerLeak(text: string): string[] {
  const t = normalize(text);
  const hits: string[] = [];
  for (const marker of INTERNAL_MARKERS) {
    if (t.includes(marker)) hits.push(marker);
  }
  return hits;
}

function hasJsonLookingBlock(text: string): boolean {
  // user-facing content should not be JSON or internal diagnostics.
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return true;
  // heuristic: a lot of JSON-ish punctuation
  const jsonish = (trimmed.match(/[\{\}\[\]:]/g) ?? []).length;
  return jsonish >= 12;
}

function sentenceCount(text: string): number {
  return (text.match(/[.!?]/g) ?? []).length;
}

function looksLikeInsightDelivery(text: string): boolean {
  const t = normalize(text);
  // Keep this narrow to avoid false positives on simple orienting language.
  const markers = ['this means', 'the reason is', 'deep down', 'because you', 'it\u2019s really about', "it's really about", 'underneath that'];
  return markers.some((m) => t.includes(m));
}

function detectSomaticCommands(text: string): boolean {
  // Checklist says: no forced breathing/posture/visualization commands.
  const t = normalize(text);
  return (
    /\b(take|do)\s+(a\s+)?deep\s+breath\b/.test(t) ||
    /\b(breathe\s+in|breathe\s+out|inhale|exhale)\b/.test(t) ||
    /\b(relax\s+your\s+shoulders|unclench\s+your\s+jaw|drop\s+your\s+shoulders)\b/.test(t) ||
    /\b(close\s+your\s+eyes|place\s+your\s+hand\s+on)\b/.test(t) ||
    /\b(visualize|imagine\s+a\s+place|picture\s+yourself)\b/.test(t)
  );
}

export function enforceNoDrift(input: {
  decision: DecisionObject;
  selection: ModelSelection;
  veraText: string;
}): NoDriftResult {
  const violations: string[] = [];
  const vera = (input.veraText ?? '').trim();

  if (!vera) {
    violations.push('empty_output');
  }

  const leaks = hasModelOrLayerLeak(vera);
  if (leaks.length) violations.push(`internal_leak:${leaks.slice(0, 5).join(',')}`);

  if (hasJsonLookingBlock(vera)) violations.push('json_like_output');

  const qCount = countQuestions(vera);
  if (qCount > input.decision.routing.iba_policy.questions_allowed) {
    violations.push(`question_limit_exceeded:${qCount}>${input.decision.routing.iba_policy.questions_allowed}`);
  }

  if (
    (input.decision.state.arousal === 'dysregulated' ||
      input.decision.state.arousal === 'shutdown' ||
      input.decision.state.arousal === 'dissociated') &&
    sentenceCount(vera) >= 3 &&
    looksLikeInsightDelivery(vera)
  ) {
    violations.push('insight_in_fragile_state');
  }

  if (
    (input.decision.state.arousal === 'activated' ||
      input.decision.state.arousal === 'dysregulated' ||
      input.decision.state.arousal === 'shutdown' ||
      input.decision.state.arousal === 'dissociated' ||
      input.decision.adaptive_codes.some((c) => c.band === 'B2' || c.band === 'B3')) &&
    containsWhyQuestions(vera)
  ) {
    violations.push('why_question_disallowed');
  }

  if (!input.decision.routing.iba_policy.somatic_allowed && detectSomaticCommands(vera)) {
    violations.push('somatic_command_disallowed');
  }

  // Model choice must not change identity/voice; we can only enforce via leak checks.
  // Also enforce conservative default: if selection says anthropic safety_fallback true, that's ok.
  if (!input.selection) violations.push('missing_model_selection');

  if (!violations.length) {
    return { ok: true, vera, violations: [] };
  }

  // Hard safety fallback response, VERA voice, minimal, no questions.
  const fallback =
    "I'm here with you. We can go one step at a time. If you tell me what feels most pressing right now, I’ll help you get oriented without pushing.";

  return { ok: false, vera: fallback, violations };
}
