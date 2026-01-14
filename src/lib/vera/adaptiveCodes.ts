import type { DetectorState } from './detectors';
import { bandForCode, type Band } from './bands';

export type AdaptiveCodeHit = {
  code: number;
  label: string;
  band: Band;
  confidence: number;
};

export type ConversationMessage = { role: 'user' | 'assistant'; content: string };

type Signals = {
  text: string;
  wordCount: number;
  sentenceCount: number;
  futureDensity: number;
  conditionalCount: number;
  apologyCount: number;
  minimizingCount: number;
  absoluteCount: number;
  selfBlameCount: number;
  permissionSeekingCount: number;
  reassuranceLoop: boolean;
  repeatedTopic: boolean;
  rephrasingLoop: boolean;
  angerWords: number;
  shameWords: number;
  numbFreezeWords: number;
  humorDeflect: boolean;
};

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function countMatches(text: string, re: RegExp): number {
  const m = text.match(re);
  return m ? m.length : 0;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[\u2019]/g, "'")
    .trim();
}

// Stage 1 — Signal Extraction (observable only)
function extractSignals(userText: string, convo: ConversationMessage[]): Signals {
  const text = normalize(userText);
  const words = text ? text.split(/\s+/) : [];

  const sentenceCount = Math.max(1, countMatches(userText, /[.!?]+/g));
  const wordCount = words.length;

  const futureCount = countMatches(text, /\b(will|going to|gonna|later|tomorrow|next|in the future|eventually)\b/g);
  const futureDensity = wordCount ? futureCount / wordCount : 0;

  const conditionalCount = countMatches(text, /\b(if|what if|unless|in case)\b/g);
  const apologyCount = countMatches(text, /\b(sorry|i\s*apologize|my\s*bad)\b/g);
  const minimizingCount = countMatches(text, /\b(it'?s\s*not\s*a\s*big\s*deal|it'?s\s*fine|doesn'?t\s*matter|whatever|i\s*guess|maybe\s*i'?m\s*overreacting)\b/g);
  const absoluteCount = countMatches(text, /\b(always|never|everyone|no\s*one|nothing|everything)\b/g);
  const selfBlameCount = countMatches(text, /\b(it'?s\s*my\s*fault|i\s*ruined|i\s*messed\s*up|i\s*am\s*a\s*failure|i\s*hate\s*myself)\b/g);
  const permissionSeekingCount = countMatches(text, /\b(is\s*it\s*ok\s*if|can\s*i\s*ask|do\s*you\s*mind\s*if|should\s*i\s*even|am\s*i\s*allowed)\b/g);
  const angerWords = countMatches(text, /\b(angry|furious|rage|pissed|mad|livid)\b/g);
  const shameWords = countMatches(text, /\b(ashamed|embarrassed|humiliated|worthless|pathetic)\b/g);
  const numbFreezeWords = countMatches(text, /\b(numb|frozen|blank|can'?t\s*feel|not\s*here|dissociated|shutdown)\b/g);
  const humorDeflect = /\b(lol|lmao|haha|just kidding)\b/.test(text);

  const lastAssistant = [...convo].reverse().find((m) => m.role === 'assistant')?.content ?? '';
  const reassuranceLoop = /(are you sure|tell me i'm|reassure|i need you to confirm|please say it will be ok)/i.test(userText) ||
    (/it will be ok|you're safe|it’s going to be ok/i.test(lastAssistant) && /(but what if|still|i'm not sure)/i.test(userText));

  // crude repetition: same key phrase across recent user turns
  const recentUser = [...convo].reverse().filter((m) => m.role === 'user').slice(0, 4).map((m) => normalize(m.content));
  const repeatedTopic = recentUser.slice(1).some((prev) => prev && text && (prev.includes(text.slice(0, Math.min(24, text.length))) || text.includes(prev.slice(0, Math.min(24, prev.length)))));

  // rephrasing loop: many question marks and repeating keywords
  const questionMarks = countMatches(userText, /\?/g);
  const rephrasingLoop = questionMarks >= 2 || (repeatedTopic && wordCount >= 40);

  return {
    text,
    wordCount,
    sentenceCount,
    futureDensity: clamp01(futureDensity * 5),
    conditionalCount,
    apologyCount,
    minimizingCount,
    absoluteCount,
    selfBlameCount,
    permissionSeekingCount,
    reassuranceLoop,
    repeatedTopic,
    rephrasingLoop,
    angerWords,
    shameWords,
    numbFreezeWords,
    humorDeflect,
  };
}

// Stage 2 — Candidate Code Scoring (deterministic)
type Detector = {
  code: number;
  label: string;
  state_affinity: DetectorState['arousal'][];
  score: (signals: Signals, state: DetectorState) => number; // 0..1
};

const DETECTORS: Detector[] = [
  {
    code: 8,
    label: 'Prediction to Prevent Pain',
    state_affinity: ['regulated', 'activated', 'dysregulated'],
    score: (s, st) => {
      const future = s.futureDensity;
      const whatIf = Math.min(1, s.conditionalCount / 3);
      const rehearsing = /(rehears|practice it in my head|script it|running it over and over|plan for every scenario)/i.test(s.text) ? 1 : 0;
      const anxiety = st.signals.includes('anxiety') ? 1 : 0;
      const base = 0.25 + 0.35 * future + 0.25 * whatIf + 0.15 * rehearsing + 0.1 * anxiety;
      return clamp01(base);
    },
  },
  {
    code: 36,
    label: 'Future Tripping to Pre-Regulate Uncertainty',
    state_affinity: ['regulated', 'activated'],
    score: (s, st) => {
      const future = s.futureDensity;
      const whatIf = Math.min(1, s.conditionalCount / 4);
      const uncertainty = /(uncertain|uncertainty|i don't know|can't know|unknown)/i.test(s.text) ? 1 : 0;
      const loop = s.rephrasingLoop ? 1 : 0;
      const base = 0.18 + 0.3 * future + 0.25 * whatIf + 0.17 * uncertainty + 0.1 * loop + (st.arousal === 'activated' ? 0.05 : 0);
      return clamp01(base);
    },
  },
  {
    code: 72,
    label: 'Rehearsal Loop',
    state_affinity: ['regulated', 'activated'],
    score: (s) => {
      const rehearsing = /(rehears|practice it in my head|script it|running it over and over)/i.test(s.text) ? 1 : 0;
      const loop = s.rephrasingLoop ? 1 : 0;
      const base = 0.2 + 0.5 * rehearsing + 0.25 * loop;
      return clamp01(base);
    },
  },
  {
    code: 9,
    label: 'Self-Silencing to Preserve Relationship',
    state_affinity: ['activated', 'shutdown', 'dysregulated'],
    score: (s, st) => {
      const minimize = Math.min(1, s.minimizingCount / 2);
      const apologize = Math.min(1, s.apologyCount / 2);
      const burden = /(don't want to be a burden|don't want to bother you|i shouldn't say anything)/i.test(s.text) ? 1 : 0;
      const relationship = /(they|he|she|my partner|my friend|my boss|my mom|my dad)/i.test(s.text) ? 0.4 : 0;
      const shame = s.shameWords > 0 || st.signals.includes('shame_spiral') ? 0.6 : 0;
      const base = 0.15 + 0.3 * minimize + 0.25 * apologize + 0.2 * burden + relationship + 0.1 * shame;
      return clamp01(base);
    },
  },
  {
    code: 10,
    label: 'Shame / Identity Threat',
    state_affinity: ['activated', 'dysregulated', 'shutdown'],
    score: (s, st) => {
      const shame = Math.min(1, s.shameWords / 2) + (st.signals.includes('shame_spiral') ? 0.4 : 0);
      const selfBlame = Math.min(1, s.selfBlameCount / 2);
      const absolute = Math.min(1, s.absoluteCount / 3);
      const base = 0.2 + 0.35 * shame + 0.25 * selfBlame + 0.12 * absolute;
      return clamp01(base);
    },
  },
  {
    code: 60,
    label: 'Boundary Heat / Anger',
    state_affinity: ['activated', 'regulated', 'dysregulated'],
    score: (s, st) => {
      const anger = Math.min(1, s.angerWords / 2) + (st.signals.includes('anger') ? 0.4 : 0);
      const boundary = /(not ok|crossed a line|disrespect|can't let that slide|boundary)/i.test(s.text) ? 0.4 : 0;
      const base = 0.18 + 0.45 * anger + boundary;
      return clamp01(base);
    },
  },
  {
    code: 28,
    label: 'Dissociate to Reduce Sensory Load',
    state_affinity: ['shutdown', 'dissociated'],
    score: (s, st) => {
      const numb = Math.min(1, s.numbFreezeWords / 2);
      const detached = /(not really here|outside my body|watching myself|can't access feelings)/i.test(s.text) ? 0.7 : 0;
      const base = 0.25 + 0.35 * numb + 0.25 * detached + (st.arousal === 'dissociated' ? 0.15 : 0.05);
      return clamp01(base);
    },
  },
  {
    code: 27,
    label: 'Freeze / Dissociation Dominant',
    state_affinity: ['shutdown', 'dissociated'],
    score: (s, st) => {
      const freeze = /(frozen|stuck|can't move|can't act)/i.test(s.text) ? 0.8 : 0;
      const numb = Math.min(1, s.numbFreezeWords / 2);
      const base = 0.25 + 0.3 * numb + 0.3 * freeze + (st.arousal === 'shutdown' ? 0.15 : st.arousal === 'dissociated' ? 0.2 : 0);
      return clamp01(base);
    },
  },
];

function scoreCandidates(userText: string, state: DetectorState, convo: ConversationMessage[]): AdaptiveCodeHit[] {
  const signals = extractSignals(userText, convo);

  const candidates: AdaptiveCodeHit[] = DETECTORS.map((d) => {
    const affinityBonus = d.state_affinity.includes(state.arousal) ? 0.05 : -0.05;
    const confidence = clamp01(d.score(signals, state) + affinityBonus);
    return {
      code: d.code,
      label: d.label,
      band: bandForCode(d.code),
      confidence,
    };
  });

  // Only consider plausible candidates, but keep safety later.
  return candidates.filter((c) => c.confidence >= 0.55);
}

// Stage 3 — Band Safety Resolution (safety-first)
function resolveBands(hits: AdaptiveCodeHit[], state: DetectorState): AdaptiveCodeHit[] {
  const sorted = [...hits].sort((a, b) => (b.confidence - a.confidence) || (a.code - b.code));
  const top = sorted.slice(0, 6);

  const hasB3 = top.some((c) => c.band === 'B3');
  const hasB2 = top.some((c) => c.band === 'B2');
  const hasB4 = top.some((c) => c.band === 'B4');
  const hasB5 = top.some((c) => c.band === 'B5');

  let filtered = top;

  // If any B3 appears in top candidates, drop B1 unless very strong.
  if (hasB3) {
    filtered = filtered.filter((c) => c.band !== 'B1' || c.confidence > 0.85);
  }

  // If B2 + B1 conflict, prefer B2.
  if (hasB2) {
    filtered = filtered.filter((c) => c.band !== 'B1' || c.confidence > 0.85);
  }

  // If Band 4 present + activated state, treat as Band 2 for safety.
  if (hasB4 && state.arousal === 'activated') {
    filtered = filtered.map((c) => (c.band === 'B4' ? { ...c, band: 'B2' as Band } : c));
  }

  // If Band 5 present, state determines handling; in activated state, downweight B5 slightly.
  if (hasB5 && state.arousal === 'activated') {
    filtered = filtered.map((c) => (c.band === 'B5' ? { ...c, confidence: clamp01(c.confidence - 0.08) } : c));
  }

  return filtered;
}

// Stage 4 — Top Code Selection (top 1–3)
function selectTop(hits: AdaptiveCodeHit[]): AdaptiveCodeHit[] {
  const sorted = [...hits].sort((a, b) => (b.confidence - a.confidence) || (a.code - b.code));
  return sorted.slice(0, 3);
}

// Decay & update rules: older turns contribute with ~15–20% decay per turn.
function applyConversationDecay(base: AdaptiveCodeHit[], convo: ConversationMessage[], state: DetectorState): AdaptiveCodeHit[] {
  const decay = 0.82;
  const userTurns = [...convo].filter((m) => m.role === 'user').map((m) => m.content);

  // Aggregate older signals (excluding current userText, which is handled separately).
  const aggregated = new Map<number, AdaptiveCodeHit>();
  for (const c of base) aggregated.set(c.code, { ...c });

  // Walk older turns from newest->oldest, apply decay.
  const older = userTurns.slice(0, Math.max(0, userTurns.length - 1)).reverse();
  for (let i = 0; i < older.length; i++) {
    const weight = Math.pow(decay, i + 1);
    if (weight < 0.15) break;
    const olderHits = scoreCandidates(older[i], state, convo).slice(0, 3);
    for (const h of olderHits) {
      const existing = aggregated.get(h.code);
      if (!existing) {
        aggregated.set(h.code, { ...h, confidence: clamp01(h.confidence * weight) });
      } else {
        existing.confidence = clamp01(existing.confidence + h.confidence * weight * 0.35);
      }
    }
  }

  return [...aggregated.values()];
}

export function detectAdaptiveCodes(
  userText: string,
  state: DetectorState,
  convo: ConversationMessage[]
): AdaptiveCodeHit[] {
  const candidatesNow = scoreCandidates(userText, state, convo);
  const withDecay = applyConversationDecay(candidatesNow, convo, state);
  const resolved = resolveBands(withDecay, state);
  return selectTop(resolved);
}
