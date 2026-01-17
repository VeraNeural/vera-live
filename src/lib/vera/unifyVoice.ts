import type { DecisionObject, ArousalState, ChallengeAllowance, Pace } from './decisionObject';

const LEAK_FORBIDDEN = [
  'neural',
  'iba',
  'anthropic',
  'openai',
  'grok',
  'claude',
  'gpt',
  'router',
  'routing',
  'policy',
  'band',
  'decisionobject',
  'model selection',
  'system prompt',
  'adaptive code',
  'governance',
];

const FORBIDDEN_PHRASES = [
  'you have to',
  'you should',
  'the problem is',
  'this is why you',
  'deep down',
  'obviously',
  'the truth is',
  'fix',
  'heal',
  'broken',
];

const AGENCY_CLOSINGS = [
  "You don’t have to decide anything right now.",
  'We can take this one step at a time.',
  'Let me know what feels most helpful next.',
  'We can keep this simple and gentle.',
];

export type UnifyResult =
  | {
      ok: true;
      text: string;
      violations: [];
      strictApplied: boolean;
    }
  | {
      ok: false;
      text: string;
      violations: string[];
      strictApplied: boolean;
    };

function normalizeSpaces(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

function stableIndex(seed: string, mod: number): number {
  // Deterministic, non-cryptographic hash for stable “variation” without randomness.
  let h = 5381;
  const s = seed ?? '';
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i);
  }
  const n = Math.abs(h >>> 0);
  return mod <= 0 ? 0 : n % mod;
}

function pickOne<T>(items: readonly T[], seed: string): T {
  if (!items.length) {
    throw new Error('pickOne called with empty array');
  }
  return items[stableIndex(seed, items.length)]!;
}

function stripTaggedBlocks(text: string): string {
  return (text ?? '')
    .replace(/\[\[NEURAL\]\][\s\S]*?\[\[\/NEURAL\]\]/gi, '')
    .replace(/\[\[VERA\]\]/gi, '')
    .replace(/\[\[\/VERA\]\]/gi, '')
    .trim();
}

function splitSentences(text: string): string[] {
  const clean = (text ?? '').trim();
  if (!clean) return [];
  const parts = clean
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : [clean];
}

function joinSentences(sentences: string[]): string {
  return normalizeSpaces(sentences.join(' '));
}

function containsLeak(text: string): string[] {
  const t = (text ?? '').toLowerCase();
  return LEAK_FORBIDDEN.filter((w) => t.includes(w));
}

function isWhyQuestion(sentence: string): boolean {
  return /\bwhy\b/i.test(sentence) && sentence.includes('?');
}

function insightScore(sentence: string): number {
  const s = (sentence ?? '').toLowerCase();
  const markers = [
    'this means',
    'the reason is',
    'one possibility is',
    'what may be happening is',
    "what's happening is",
    'because you',
    'underneath',
    'deep down',
    'it\u2019s really about',
    "it's really about",
  ];
  return markers.reduce((acc, m) => acc + (s.includes(m) ? 1 : 0), 0);
}

function isConfrontational(sentence: string): boolean {
  const s = (sentence ?? '').toLowerCase();
  return [
    "you're avoiding",
    "you are avoiding",
    "what's really stopping you",
    'stop making excuses',
    'no more excuses',
    'be honest with yourself',
  ].some((m) => s.includes(m));
}

function hasUrgencyTone(text: string): boolean {
  const t = (text ?? '').toLowerCase();
  return /(right now|immediately|urgent|asap|do this now)/i.test(t) || t.includes('!');
}

function removeSomaticCommandsAlways(text: string): string {
  // Never allow breathing/posture/forced grounding instructions.
  const sentences = splitSentences(text);
  const blocked = /\b(take|do)\s+(a\s+)?deep\s+breath\b|\b(breathe\s+in|breathe\s+out|inhale|exhale)\b|\b(relax\s+your\s+shoulders|unclench\s+your\s+jaw|drop\s+your\s+shoulders)\b|\b(close\s+your\s+eyes|place\s+your\s+hand\s+on)\b|\b(ground\s+yourself|feet\s+on\s+the\s+floor)\b/i;
  return joinSentences(sentences.filter((s) => !blocked.test(s)));
}

function removeBodyLanguage(text: string): string {
  const sentences = splitSentences(text);
  const body = /\b(body|breath|breathe|inhale|exhale|chest|shoulders|jaw|stomach|heart\s+racing|shaking|trembling|nausea|dizzy|somatic|grounding|nervous\s+system|regulate|regulated)\b/i;
  return joinSentences(sentences.filter((s) => !body.test(s)));
}

function applyCertaintyDeflation(text: string): string {
  let out = text;

  const replacements: Array<[RegExp, string]> = [
    [/\bthis means you are\b/gi, 'this can show up when'],
    [/\bthe reason is\b/gi, 'one possibility is'],
    [/\byou always\b/gi, 'this pattern can'],
    [/\bthe truth is\b/gi, 'what may be happening is'],
    [/\bdeep down\b/gi, 'at a deeper level'],
    [/\bobviously\b/gi, 'it may be'],
    [/\bthe problem is\b/gi, 'one friction point is'],
  ];

  for (const [re, rep] of replacements) out = out.replace(re, rep);

  // Mechanically neutralize forbidden phrases where possible.
  out = out.replace(/\byou have to\b/gi, 'you may want to');
  out = out.replace(/\byou should\b/gi, 'you could');
  out = out.replace(/\bfix\b/gi, 'address');
  out = out.replace(/\bheal\b/gi, 'recover');
  out = out.replace(/\bbroken\b/gi, 'hurting');

  return normalizeSpaces(out);
}

function maxCapsForState(state: ArousalState): { maxSentences: number; maxInsights: number } {
  switch (state) {
    case 'regulated':
      return { maxSentences: 10, maxInsights: 2 };
    case 'activated':
      return { maxSentences: 6, maxInsights: 1 };
    case 'dysregulated':
      return { maxSentences: 4, maxInsights: 1 };
    case 'shutdown':
      return { maxSentences: 3, maxInsights: 0 };
    case 'dissociated':
      return { maxSentences: 3, maxInsights: 0 };
  }
}

function enforceDepthAndLength(text: string, state: ArousalState, strict: boolean): { text: string; insightCount: number; sentenceCount: number } {
  const caps = maxCapsForState(state);
  const maxSentences = strict ? Math.max(2, caps.maxSentences - 1) : caps.maxSentences;
  const maxInsights = strict
    ? state === 'regulated'
      ? Math.max(0, caps.maxInsights - 1)
      : 0
    : caps.maxInsights;

  let sentences = splitSentences(text);

  // Remove excess insight sentences from the bottom first.
  const insightFlags = sentences.map((s) => insightScore(s) > 0);
  let insightCount = insightFlags.filter(Boolean).length;
  if (insightCount > maxInsights) {
    for (let i = sentences.length - 1; i >= 0 && insightCount > maxInsights; i--) {
      if (insightFlags[i]) {
        sentences.splice(i, 1);
        insightFlags.splice(i, 1);
        insightCount--;
      }
    }
  }

  // Truncate from bottom for sentence caps.
  if (sentences.length > maxSentences) {
    sentences = sentences.slice(0, maxSentences);
  }

  // Recompute insights after truncation.
  insightCount = sentences.filter((s) => insightScore(s) > 0).length;

  return {
    text: joinSentences(sentences),
    insightCount,
    sentenceCount: sentences.length,
  };
}

function enforceChallenge(text: string, challenge: ChallengeAllowance, strict: boolean): string {
  let sentences = splitSentences(text);

  if (challenge === 'none') {
    sentences = sentences.filter((s) => !isConfrontational(s));
    // Remove any residual pressure phrases.
    sentences = sentences.map((s) => s.replace(/\b(no excuses|stop|must)\b/gi, '').trim()).filter(Boolean);
    return joinSentences(sentences);
  }

  if (challenge === 'gentle') {
    sentences = sentences.filter((s) => !isConfrontational(s));
    // Soft naming allowed; strip imperative pressure.
    sentences = sentences
      .map((s) => s.replace(/\b(you need to|you must|do this now)\b/gi, '').trim())
      .filter(Boolean);
    return joinSentences(sentences);
  }

  // direct
  // Allow at most one direct/confrontational-ish sentence; prefer first.
  const directIdx = sentences.findIndex((s) => isConfrontational(s));
  if (directIdx >= 0) {
    for (let i = sentences.length - 1; i >= 0; i--) {
      if (i !== directIdx && isConfrontational(sentences[i])) sentences.splice(i, 1);
    }
  }

  // In strict mode, even direct stays non-aggressive.
  if (strict) sentences = sentences.filter((s) => !isConfrontational(s));

  return joinSentences(sentences);
}

function enforcePace(text: string, pace: Pace, strict: boolean): string {
  const maxWords = pace === 'slow' ? 18 : 24;
  let sentences = splitSentences(text);

  if (pace === 'slow') {
    // Remove long lists (>3 items)
    const lines = (text ?? '').split(/\r?\n/);
    const listLines = lines.filter((l) => /^\s*([-*]|\d+\.)\s+/.test(l));
    if (listLines.length > 3) {
      const kept = listLines.slice(0, 3);
      const nonList = lines.filter((l) => !/^\s*([-*]|\d+\.)\s+/.test(l));
      sentences = splitSentences([...nonList, ...kept].join('\n'));
    }
  }

  sentences = sentences.map((s) => {
    const words = (s.match(/\b\w+\b/g) ?? []);
    const limit = strict && pace === 'slow' ? Math.max(12, maxWords - 4) : maxWords;
    if (words.length <= limit) return s;
    const truncated = words.slice(0, limit).join(' ');
    return truncated.endsWith('.') || truncated.endsWith('!') || truncated.endsWith('?') ? truncated : `${truncated}.`;
  });

  // Slow pace: avoid stacked clauses.
  if (pace === 'slow') {
    sentences = sentences.map((s) => s.replace(/,\s*and\s+/gi, '. ').replace(/;\s*/g, '. ').trim());
    sentences = splitSentences(joinSentences(sentences));
  }

  return joinSentences(sentences);
}

function enforceQuestions(text: string, allowed: number, state: ArousalState, strict: boolean): string {
  let sentences = splitSentences(text);

  // No multi-question sentences.
  sentences = sentences.map((s) => {
    const q = (s.match(/\?/g) ?? []).length;
    if (q <= 1) return s;
    return s.split('?')[0].trim() + '?';
  });

  // Remove or convert disallowed questions.
  const keep: string[] = [];
  let used = 0;
  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i];
    const isQ = s.includes('?');

    if (!isQ) {
      keep.push(s);
      continue;
    }

    if (isWhyQuestion(s) && state !== 'regulated') {
      // Convert to non-question reflective statement.
      keep.push('We don’t need to answer that right now.');
      continue;
    }

    if (allowed <= 0 || (strict && state !== 'regulated')) {
      keep.push(s.replace(/\?+\s*$/, '.'));
      continue;
    }

    if (used < allowed) {
      keep.push(s);
      used++;
    }
    // else drop the question
  }

  // If we still exceeded allowed (e.g., converted questions kept), trim from end.
  if (allowed <= 0) {
    return joinSentences(keep.map((s) => s.replace(/\?+\s*$/, '.')));
  }

  let out = keep;
  let qCount = out.reduce((acc, s) => acc + ((s.match(/\?/g) ?? []).length > 0 ? 1 : 0), 0);
  while (qCount > allowed) {
    const idx = out.map((s) => s.includes('?')).lastIndexOf(true);
    if (idx < 0) break;
    out.splice(idx, 1);
    qCount--;
  }

  return joinSentences(out);
}

function ensureAgencyEnding(text: string, opts: { strict: boolean; maxSentences: number }): string {
  const t = (text ?? '').trim();
  if (!t) return pickOne(AGENCY_CLOSINGS, 'empty');
  const endings = AGENCY_CLOSINGS.map((s) => s.toLowerCase());
  const lower = t.toLowerCase();
  if (endings.some((e) => lower.endsWith(e.toLowerCase().replace(/\.$/, '')) || lower.endsWith(e))) {
    return t;
  }

  // Avoid adding a whole new sentence if we're already at the cap.
  if (splitSentences(t).length >= opts.maxSentences) {
    return t;
  }

  const last = splitSentences(t).slice(-1)[0]?.toLowerCase() ?? '';
  const alreadyInvitesAgency = /(let me know|most helpful next|you don\u2019t have to decide|your choice|we can keep this simple)/i.test(last);
  if (!opts.strict && alreadyInvitesAgency) {
    return t;
  }

  const closing = pickOne(AGENCY_CLOSINGS, t);
  return normalizeSpaces(`${t} ${closing}`);
}

function hasIdentityLabel(text: string): boolean {
  const t = (text ?? '').toLowerCase();
  return /\byou (are|re) (a|an)\s+(narcissist|bipolar|schizophrenic|autistic|adhd|depressed|borderline)\b/i.test(t);
}

function runCompiler(draftText: string, decision: DecisionObject, strict: boolean): { text: string; violations: string[] } {
  const violations: string[] = [];

  const state = decision.state.arousal;
  const policy = decision.routing.iba_policy;
  const caps = maxCapsForState(state);
  const maxSentences = strict ? Math.max(2, caps.maxSentences - 1) : caps.maxSentences;

  // PASS 0 — remove tags and internal blocks (hard)
  let out = stripTaggedBlocks(draftText);

  // PASS 1 — leak stripper (hard filter): remove sentences containing leaks
  const sentences = splitSentences(out);
  out = joinSentences(
    sentences.filter((s) => {
      const lower = s.toLowerCase();
      return !LEAK_FORBIDDEN.some((w) => lower.includes(w));
    })
  );

  // Re-check leaks after removal
  const leaks = containsLeak(out);
  if (leaks.length) violations.push(`leak_postpass:${leaks.slice(0, 5).join(',')}`);

  // PASS 2 — certainty deflation + forbidden phrase neutralization
  out = applyCertaintyDeflation(out);
  // Remove any remaining forbidden phrases we didn't rewrite cleanly.
  for (const p of FORBIDDEN_PHRASES) {
    if (out.toLowerCase().includes(p)) out = out.replace(new RegExp(p, 'gi'), '');
  }
  out = normalizeSpaces(out);

  // PASS 7 (always) — never allow breathing/posture/forced grounding
  out = removeSomaticCommandsAlways(out);
  if (!policy.somatic_allowed) out = removeBodyLanguage(out);

  // PASS 4 — challenge enforcer
  out = enforceChallenge(out, policy.challenge, strict);

  // PASS 5 — pace normalizer
  out = enforcePace(out, policy.pace, strict);

  // PASS 6 — question limiter
  out = enforceQuestions(out, policy.questions_allowed, state, strict);

  // PASS 3 — depth & length governor
  const governed = enforceDepthAndLength(out, state, strict);
  out = governed.text;

  // PASS 8 — agency restoration
  out = ensureAgencyEnding(out, { strict, maxSentences });

  // Failure checks (hard fail)
  const postLeaks = containsLeak(out);
  if (postLeaks.length) violations.push(`leak_final:${postLeaks.slice(0, 5).join(',')}`);
  if (hasIdentityLabel(out)) violations.push('identity_label_or_diagnosis');
  if (policy.challenge === 'none' && isConfrontational(out)) violations.push('challenge_slip');

  const finalSentenceCount = splitSentences(out).length;
  if (finalSentenceCount > maxSentences) violations.push('length_exceeds_state_cap');

  const insightCount = splitSentences(out).filter((s) => insightScore(s) > 0).length;
  if (state !== 'regulated' && insightCount > 1) violations.push('too_many_insights_non_regulated');
  if ((state === 'shutdown' || state === 'dissociated') && insightCount > 0) violations.push('insight_in_shutdown_or_dissociation');

  if (state === 'activated' && hasUrgencyTone(out)) violations.push('urgency_in_activation');

  return { text: out, violations };
}

// Main mechanical compiler pass (non-negotiable): draft -> single coherent VERA output.
// Does not accept model identity or internal reasoning.
export function unifyVeraResponse(input: { draftText: string; decision: DecisionObject }): UnifyResult {
  const first = runCompiler(input.draftText, input.decision, false);
  if (!first.violations.length && first.text.trim()) {
    return { ok: true, text: first.text, violations: [], strictApplied: false };
  }

  // Re-run with stricter reduction.
  const strict = runCompiler(input.draftText, input.decision, true);
  if (!strict.violations.length && strict.text.trim()) {
    return { ok: true, text: strict.text, violations: [], strictApplied: true };
  }

  // Block output (fallback) — do not revise further.
  const fallbackOptions = [
    "I'm here with you. We can take this one step at a time.",
    "I'm here with you. We can keep this simple and gentle.",
    "I'm with you. You don’t have to decide anything right now.",
  ] as const;

  const mergedViolations = [...new Set([...first.violations, ...strict.violations])];
  const fallback = pickOne(fallbackOptions, `${input.draftText}|${mergedViolations.join('|')}`);
  return {
    ok: false,
    text: fallback,
    violations: mergedViolations,
    strictApplied: true,
  };
}

// Backwards-compatible helper (used by older tests). Uses a conservative default decision.
export function unifyVoice(draft: string): string {
  const decision: DecisionObject = {
    intent: { primary: 'meaning', secondary: [] },
    state: { arousal: 'regulated', confidence: 0.7, signals: [] },
    adaptive_codes: [],
    routing: {
      lead: 'V',
      support: ['N', 'V'],
      iba_policy: {
        tier: 'free',
        challenge: 'none',
        pace: 'normal',
        depth: 'medium',
        questions_allowed: 1,
        somatic_allowed: false,
        memory_use: 'session',
        model_override: 'anthropic',
        notes: 'default unifier wrapper',
      },
    },
  };

  return unifyVeraResponse({ draftText: draft, decision }).text;
}
