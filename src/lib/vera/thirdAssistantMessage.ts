export type UserIntent =
  | 'emotional_processing'
  | 'cognitive_clarity'
  | 'creation_build'
  | 'learning_exploration'
  | 'decision_support'
  | 'open_ended_presence';

export interface IntentClassification {
  intent: UserIntent;
  confidence: number; // 0..1
}

export const THIRD_MESSAGE_TEMPLATES: Record<UserIntent, { id: string; text: string }> = {
  emotional_processing: {
    id: 'third_v1_emotional_processing',
    text:
      'Thank you for saying that.\n\nBefore we try to fix or decide anything, let’s slow this down just enough so we understand what you’re actually carrying.\n\nWhat feels heaviest right now — the situation itself, or how it’s affecting you?',
  },
  cognitive_clarity: {
    id: 'third_v1_cognitive_clarity',
    text: 'Let’s get clear before we go deep.\n\nIf you had to name the one thing that feels most unclear or tangled right now, what would it be?',
  },
  creation_build: {
    id: 'third_v1_creation_build',
    text: 'Got it — we can build this together.\n\nTo start cleanly: what are you trying to create, and who is it for?',
  },
  learning_exploration: {
    id: 'third_v1_learning_exploration',
    text:
      'Happy to explore this with you.\n\nAre you looking to understand this at a high level, or do you want something practical you can use right away?',
  },
  decision_support: {
    id: 'third_v1_decision_support',
    text:
      'Decisions get heavy when too many things are competing at once.\n\nWhat feels more urgent here: making the right choice, or avoiding a bad one?',
  },
  open_ended_presence: {
    id: 'third_v1_open_ended_presence',
    text: 'That’s okay — we don’t need a plan yet.\n\nI’m here. What’s been taking up space in your head lately?',
  },
};

function scoreAny(text: string, patterns: RegExp[]): number {
  return patterns.some((p) => p.test(text)) ? 1 : 0;
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

// Soft, non-clinical classification.
// - Exactly one primary intent
// - Probabilistic (confidence is a heuristic)
// - No user-facing labels (labels remain server-side)
export function classifyUserIntent(userTextRaw: string): IntentClassification {
  const text = (userTextRaw ?? '').trim().toLowerCase();
  if (!text) return { intent: 'open_ended_presence', confidence: 0.5 };

  const containsDontKnowWhatToDo = /\b(i don\'t know what to do|i don’t know what to do)\b/i.test(text);

  const emotional =
    0.65 * scoreAny(text, [
      /\b(i feel|i’m feeling|im feeling|feelings?)\b/i,
      /\b(overwhelmed|scared|afraid|sad|hurt|lonely|anxious|stressed|panic|panicking|numb|confused)\b/i,
      /\b(i don\'t know what to do|i don’t know what to do)\b/i,
    ]) +
    0.35 * scoreAny(text, [/\b(my partner|my friend|my mom|my dad|my boss|my therapist|my family)\b/i]);

  const cognitive =
    0.7 * scoreAny(text, [
      /\b(trying to understand|trying to figure out|make sense of)\b/i,
      /\b(unclear|tangled|confusing|messy in my head)\b/i,
      /\b(looping|ruminating|overthinking|can\'t stop thinking|can’t stop thinking)\b/i,
    ]) +
    0.3 * scoreAny(text, [/\b(clarity|clear head|untangle)\b/i]);

  const creation =
    0.75 * scoreAny(text, [/\b(i want to build|let\'s build|lets build|build|create|project|app|prototype|launch)\b/i]) +
    0.25 * scoreAny(text, [/\b(write|draft|edit|outline|design|structure)\b/i]);

  const learning =
    0.75 * scoreAny(text, [/\b(learn|understand|explain|how does|what is|why does|curious|research)\b/i]) +
    0.25 * scoreAny(text, [/\b(high level|overview|deep dive|practical)\b/i]);

  const decision =
    0.8 * scoreAny(text, [/\b(should i|should we|do i|do we|decide|decision|choice|torn|which one)\b/i]) +
    0.2 * scoreAny(text, [/\b(pros and cons|tradeoff|trade-off)\b/i]);

  const openEnded =
    0.8 * scoreAny(text, [/\b(i don\'t know|i don’t know|not sure|nothing specific|just talk|no clear goal)\b/i]) +
    0.2 * (text.length < 20 ? 1 : 0);

  // Disambiguation: “I don’t know what to do” tends to be an emotional-processing signal, not open-ended chatting.
  const openEndedAdjusted = containsDontKnowWhatToDo ? 0 : openEnded;

  const scored: Array<[UserIntent, number]> = [
    ['emotional_processing', clamp01(emotional)],
    ['cognitive_clarity', clamp01(cognitive)],
    ['creation_build', clamp01(creation)],
    ['learning_exploration', clamp01(learning)],
    ['decision_support', clamp01(decision)],
    ['open_ended_presence', clamp01(openEndedAdjusted)],
  ];

  scored.sort((a, b) => b[1] - a[1]);
  const [topIntent, topScore] = scored[0];

  // Confidence is not absolute; treat as a soft gating signal.
  // If we can't clear the threshold, fall back to open-ended presence.
  const confidence = clamp01(topScore);
  if (confidence < 0.5) return { intent: 'open_ended_presence', confidence: 0.5 };

  return { intent: topIntent, confidence };
}

export function buildThirdAssistantMessage(input: { intent: UserIntent }): {
  templateId: string;
  text: string;
} {
  const template = THIRD_MESSAGE_TEMPLATES[input.intent];
  return { templateId: template.id, text: template.text };
}
