import type { ArousalState, PrimaryIntent } from './decisionObject';

export type DetectorIntent = {
  primary: PrimaryIntent;
  secondary: string[];
};

export type DetectorState = {
  arousal: ArousalState;
  confidence: number;
  signals: string[];
};

type ConversationMessage = { role: 'user' | 'assistant'; content: string };

const RX = {
  crisis: /(suicide|kill myself|end it all|self harm|hurt myself|want to die)/i,
  panic: /(panic|can't breathe|heart racing|terrified|freaking out)/i,
  overwhelm: /(overwhelmed|too much|can't cope|falling apart|spiraling)/i,
  dissociation: /(numb|nothing feels real|unreal|detached|dissociat|shutdown|can't feel)/i,
  shame: /(i'm a failure|i hate myself|i'm worthless|i'm broken|so ashamed)/i,
  anger: /(furious|rage|so mad|pissed|angry)/i,
  somatic: /(tight chest|shaking|trembling|nausea|dizzy|sweating|can't sleep|insomnia)/i,
  identity: /(who am i|what's wrong with me|i am not enough|i don't matter)/i,
  relationship: /(my partner|my boyfriend|my girlfriend|my husband|my wife|friend|family|mom|dad)/i,
  visibility: /(post|public|share this|audience|followers|twitter|instagram|tiktok|linkedin)/i,
};

export function classifyIntent(userText: string): DetectorIntent {
  const text = userText.trim();

  if (RX.crisis.test(text)) return { primary: 'crisis', secondary: [] };
  if (RX.somatic.test(text)) return { primary: 'somatic', secondary: [] };
  if (RX.identity.test(text)) return { primary: 'identity', secondary: [] };
  if (RX.relationship.test(text)) return { primary: 'relationship', secondary: [] };
  if (RX.visibility.test(text)) return { primary: 'visibility', secondary: ['public_post'] };

  // Heuristic: emotion vs task/meaning
  if (RX.shame.test(text) || RX.anger.test(text) || RX.panic.test(text) || RX.overwhelm.test(text)) {
    return { primary: 'emotion', secondary: [] };
  }

  // Task signals
  const taskSecondary: string[] = [];
  if (/(resume|cv|cover letter)/i.test(text)) taskSecondary.push('resume');
  if (/(email|reply|respond|message)/i.test(text)) taskSecondary.push('email');
  if (/(job|interview|apply|application)/i.test(text)) taskSecondary.push('job_search');
  if (/(decision|choose|pick|should i)/i.test(text)) taskSecondary.push('decision');
  if (/(boundary|boundaries|say no)/i.test(text)) taskSecondary.push('boundaries');
  if (/(write|draft|edit)/i.test(text)) taskSecondary.push('writing');

  if (taskSecondary.length) return { primary: 'task', secondary: taskSecondary };

  return { primary: 'meaning', secondary: [] };
}

export function inferState(userText: string, convo: ConversationMessage[]): DetectorState {
  return inferStateCore(userText, convo, true);
}

function inferStateCore(userText: string, convo: ConversationMessage[], applyDecay: boolean): DetectorState {
  const raw = userText ?? '';
  const text = raw.trim();
  const signals: string[] = [];

  const qCount = (raw.match(/\?/g) ?? []).length;
  const wordCount = (text.match(/\b\w+\b/g) ?? []).length;
  const sentenceCount = Math.max(1, (raw.match(/[.!?]+/g) ?? []).length);
  const avgWordsPerSentence = wordCount / sentenceCount;

  // Linguistic + somatic proxy signals
  const speed = /(i need this now|right now|immediately|urgent|asap|quickly)/i.test(text) || qCount >= 3;
  const overload = RX.overwhelm.test(text) || /(too much|can'?t handle|can'?t cope|flooded)/i.test(text);
  const panic = RX.panic.test(text);
  const collapse = /(what'?s the point|nothing matters|i give up|no energy|can'?t do anything|hopeless)/i.test(text);
  const detachment = RX.dissociation.test(text) || /(not real|unreal|detached|outside my body|watching myself|disconnected)/i.test(text);
  const somaticProxy = /(can'?t breathe|frozen|heavy|numb|disconnected|shaking|trembling|tight chest)/i.test(text);

  // Structural signals (simple + safe)
  const fragmentation = avgWordsPerSentence <= 6 || /\.{3,}|\n{2,}/.test(raw);
  const topicSwitch = /(anyway|suddenly|i don'?t know|wait|nevermind)/i.test(text) && sentenceCount >= 3;
  const circular = convo
    .filter((m) => m.role === 'user')
    .slice(-4)
    .some((m) => /(what if|but what if|i don't know|i dont know)/i.test(m.content));

  if (speed) signals.push('speed');
  if (overload) signals.push('overload');
  if (panic) signals.push('panic_language');
  if (collapse) signals.push('collapse');
  if (detachment) signals.push('detachment');
  if (somaticProxy) signals.push('somatic_proxy');
  if (fragmentation) signals.push('fragmentation');
  if (topicSwitch) signals.push('topic_switching');
  if (circular) signals.push('circular_reasoning');

  // Score each state 0..1 (multiple can score).
  // Keep scoring conservative; governance uses protective precedence.
  const scores: Record<ArousalState, number> = {
    regulated: 0.25,
    activated: 0.1,
    dysregulated: 0.05,
    shutdown: 0.05,
    dissociated: 0.05,
  };

  // Regulated
  const calmAsk = /(please|can you|help me|i want to|could you)/i.test(text);
  const notDistressed = !panic && !overload && !collapse && !detachment;
  scores.regulated = Math.min(1, scores.regulated + (calmAsk ? 0.25 : 0) + (notDistressed ? 0.25 : 0));

  // Activated (oriented but pressured)
  const anxiousLanguage = /(anxious|stressed|worried|on edge|pressure)/i.test(text);
  if (speed) scores.activated += 0.35;
  if (anxiousLanguage) {
    scores.activated += 0.25;
    signals.push('anxiety');
  }
  if (circular) scores.activated += 0.12;
  if (qCount >= 2) scores.activated += 0.12;
  scores.activated = Math.min(1, scores.activated);

  // Dysregulated (overwhelmed/flooding)
  if (panic) scores.dysregulated += 0.55;
  if (overload) scores.dysregulated += 0.35;
  if (somaticProxy) scores.dysregulated += 0.12;
  if (fragmentation) scores.dysregulated += 0.08;
  scores.dysregulated = Math.min(1, scores.dysregulated);

  // Shutdown (collapse/hopeless)
  if (collapse) scores.shutdown += 0.65;
  if (/\b(empty|flat|numb)\b/i.test(text)) scores.shutdown += 0.12;
  if (wordCount <= 6 && collapse) scores.shutdown += 0.1;
  scores.shutdown = Math.min(1, scores.shutdown);

  // Dissociated (detachment/unreal)
  if (detachment) scores.dissociated += 0.7;
  if (fragmentation) scores.dissociated += 0.15;
  if (/\b(not here|checked out|spaced out)\b/i.test(text)) scores.dissociated += 0.15;
  scores.dissociated = Math.min(1, scores.dissociated);

  // Precedence rules (most fragile wins): dissociated > shutdown > dysregulated > activated > regulated
  const precedence: ArousalState[] = ['dissociated', 'shutdown', 'dysregulated', 'activated', 'regulated'];
  const byScore = (a: ArousalState, b: ArousalState) => (scores[b] - scores[a]) || (precedence.indexOf(a) - precedence.indexOf(b));
  const ordered = [...precedence].sort(byScore);
  const top = ordered[0];
  const second = ordered[1];
  const tieWindow = 0.08;
  const ambiguityWindow = 0.05;

  let arousal: ArousalState = top;

  // If top two are close, choose the more protective (higher precedence).
  if (scores[top] - scores[second] < tieWindow) {
    const moreProtective = precedence.indexOf(top) < precedence.indexOf(second) ? top : second;
    arousal = moreProtective;
  }

  if (scores[top] - scores[second] <= ambiguityWindow) {
    signals.push('state_ambiguous');
  }

  // Absolute overrides (dissociation overrides all when meaningfully present).
  if (scores.dissociated >= 0.6) arousal = 'dissociated';
  else if (scores.shutdown >= 0.6) arousal = 'shutdown';
  else if (scores.dysregulated >= 0.6 && scores.dysregulated >= scores.activated - tieWindow) arousal = 'dysregulated';

  // State decay: no sudden jumps from fragile -> regulated.
  // Use the previous user turn (if present) as a proxy for last inferred state.
  const recentUsers = convo.filter((m) => m.role === 'user').map((m) => m.content);
  if (applyDecay && recentUsers.length >= 2) {
    const prevText = recentUsers[recentUsers.length - 2];
    const prev = inferStateCore(prevText, convo.slice(0, Math.max(0, convo.length - 1)), false);
    const rank: Record<ArousalState, number> = {
      regulated: 0,
      activated: 1,
      dysregulated: 2,
      shutdown: 3,
      dissociated: 4,
    };
    const invRank: Record<number, ArousalState> = {
      0: 'regulated',
      1: 'activated',
      2: 'dysregulated',
      3: 'shutdown',
      4: 'dissociated',
    };

    const prevRank = rank[prev.arousal];
    const curRank = rank[arousal];

    // If current inference is a big improvement, clamp to at most one step.
    if (prevRank - curRank >= 2) {
      arousal = invRank[Math.max(0, prevRank - 1)];
      signals.push('decay_clamp');
    }
  }

  // Confidence: reflect winning score, but keep a small minimum to avoid zeros.
  let confidence = Math.min(1, Math.max(0.2, scores[arousal]));
  if (signals.includes('state_ambiguous')) {
    confidence = Math.min(confidence, 0.35);
  }

  // Keep legacy signal names used by other modules.
  if (arousal === 'shutdown') signals.push('shutdown_language');
  if (arousal === 'dissociated') signals.push('numbness');
  if (RX.shame.test(text)) signals.push('shame_spiral');
  if (RX.anger.test(text)) signals.push('anger');

  return { arousal, confidence, signals };
}

export function userRequestedDirectness(userText: string): boolean {
  return /(be direct|be blunt|tell me the truth|no sugarcoat|don't coddle)/i.test(userText);
}

export function detectLoop(convo: ConversationMessage[]): boolean {
  const userTurns = convo.filter((m) => m.role === 'user').slice(-6);
  if (userTurns.length < 3) return false;

  const joined = userTurns.map((t) => t.content.toLowerCase());

  const dontKnowCount = joined.filter((t) => t.includes("i don't know") || t.includes('i dont know')).length;
  const hypotheticalCount = joined.filter((t) => t.includes('what if') || t.includes('if i') || t.includes('if we')).length;
  const reassuranceCount = joined.filter((t) => /(is this ok|am i okay|do you think|can you tell me)/i.test(t)).length;

  if (dontKnowCount >= 2 && hypotheticalCount >= 2) return true;
  if (hypotheticalCount >= 3) return true;
  if (reassuranceCount >= 3) return true;

  // Repeated question rephrasing (very rough): many question marks + similar first 30 chars
  const questions = joined.filter((t) => t.includes('?'));
  if (questions.length >= 3) {
    const head = questions[0].slice(0, 30);
    const similar = questions.filter((q) => q.slice(0, 30) === head).length;
    if (similar >= 2) return true;
  }

  return false;
}
