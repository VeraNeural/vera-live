import type { DecisionObject } from './decisionObject';

export type TaggedBlocks = { vera?: string; neural?: string };

export type InterLayerContractResult =
  | {
      ok: true;
      violations: [];
      vera: string;
      neuralJson?: unknown;
    }
  | {
      ok: false;
      violations: string[];
      veraFallback: string;
    };

function safeFallback(): string {
  return "I'm here with you. We can go one step at a time. Tell me what feels most pressing right now, and I’ll help you get oriented without pushing.";
}

function looksLikeUserFacingProse(text: string): boolean {
  // Heuristic only: long sentences + punctuation + lots of words.
  const t = (text ?? '').trim();
  if (!t) return false;
  const wordCount = (t.match(/\b\w+\b/g) ?? []).length;
  if (wordCount < 12) return false;
  const sentencePunct = (t.match(/[.!?]/g) ?? []).length;
  return sentencePunct >= 2;
}

function tryParseJson(text: string): { ok: true; value: unknown } | { ok: false } {
  try {
    const value = JSON.parse(text);
    return { ok: true, value };
  } catch {
    return { ok: false };
  }
}

export function enforceInterLayerContract(input: {
  decision: DecisionObject;
  tagged: TaggedBlocks;
}): InterLayerContractResult {
  const violations: string[] = [];

  const lead = input.decision.routing.lead;
  const neural = input.tagged.neural?.trim();
  const vera = input.tagged.vera?.trim();

  if (lead === 'V') {
    if (neural) violations.push('V_lead_neural_block_present');
    if (!vera) violations.push('V_lead_missing_vera_block');
    if (violations.length) return { ok: false, violations, veraFallback: safeFallback() };
    return { ok: true, violations: [], vera: vera! };
  }

  // lead === 'N'
  if (!neural) violations.push('N_lead_missing_neural_block');
  if (!vera) violations.push('N_lead_missing_vera_block');

  let neuralJson: unknown | undefined;
  if (neural) {
    const parsed = tryParseJson(neural);
    if (!parsed.ok) violations.push('neural_block_not_json');
    else neuralJson = parsed.value;

    // Extra defense: Neural should not be prose.
    if (looksLikeUserFacingProse(neural)) violations.push('neural_block_looks_like_prose');
  }

  if (violations.length) return { ok: false, violations, veraFallback: safeFallback() };

  return { ok: true, violations: [], vera: vera!, neuralJson };
}
