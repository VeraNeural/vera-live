import { Question, AssessmentResults } from '../shared/types';

export const PATTERNS = {
  guardian: {
    name: 'The Guardian',
    description: 'You approach emotions with careful protection, keeping vulnerable feelings safely contained while maintaining stability for yourself and others.',
    signs: ['Stable under pressure', 'Selective vulnerability', 'Protective instincts', 'Keeps things contained'],
    strengths: ['Emotional stability', 'Reliability under pressure', 'Protecting others'],
    growthAreas: ['Allowing vulnerability', 'Expressing needs', 'Receiving support'],
    shadow: 'May over-control emotions, limiting intimacy and support',
    tools: ['Safe vulnerability', 'Ask for support', 'Name needs clearly', 'Gentle expression'],
    color: '#6B9BC3',
  },
  feeler: {
    name: 'The Deep Feeler',
    description: "You experience emotions with remarkable depth and richness, feeling life's joys and sorrows with full intensity.",
    signs: ['Strong emotional intensity', 'Deep empathy', 'Sensitive to beauty/pain', 'Feels life fully'],
    strengths: ['Emotional depth', 'Empathy', 'Authentic connection', 'Appreciating beauty'],
    growthAreas: ['Boundaries', "Not absorbing others' emotions", 'Self-protection'],
    shadow: "May become overwhelmed or absorb emotions that aren't yours",
    tools: ['Boundaries', 'Grounding', 'Somatic settling', 'Emotional labeling'],
    color: '#A78BB3',
  },
  processor: {
    name: 'The Processor',
    description: 'You engage with emotions thoughtfully and analytically, seeking to understand and make meaning from your inner experiences.',
    signs: ['Makes meaning through thinking', 'Reflective', 'Seeks patterns', 'Analyzes feelings'],
    strengths: ['Self-reflection', 'Emotional insight', 'Learning from experience'],
    growthAreas: ['Spontaneous expression', 'Feeling without analyzing', 'Being in the moment'],
    shadow: 'May stay in analysis to avoid fully feeling',
    tools: ['Name + feel', 'Body tracking', 'Time-limited analysis', 'Present-moment practice'],
    color: '#7BA05B',
  },
  expresser: {
    name: 'The Expresser',
    description: 'You live your emotional life out loud, sharing your inner world freely and inviting others into authentic connection.',
    signs: ['Shares openly', 'Invites intimacy', 'Emotionally direct', 'Expressive energy'],
    strengths: ['Authentic expression', 'Emotional honesty', 'Creating intimacy'],
    growthAreas: ['Selective sharing', 'Containing when needed', 'Reading the room'],
    shadow: 'May share faster than a space can hold, risking regret',
    tools: ['Pause before sharing', 'Consent check-ins', 'Containment', 'Right-person sharing'],
    color: '#E8B86D',
  },
  navigator: {
    name: 'The Navigator',
    description: 'You move through emotional experiences with skill and awareness, neither avoiding nor being overwhelmed by what you feel.',
    signs: ['Balanced awareness', 'Flexible responding', 'Recovers well', 'Uses tools effectively'],
    strengths: ['Emotional intelligence', 'Balanced responding', 'Adaptive capacity'],
    growthAreas: ['Continued growth', 'Helping others navigate', 'Deeper exploration'],
    shadow: "May assume you're \"done\" growing; regulation is ongoing practice",
    tools: ['Maintain practices', 'Supportive reflection', 'Growth edges', 'Deepening capacity'],
    color: '#C4956A',
  },
};

export const determinePatterns = (scores: Record<string, number>) => {
  let dominant = 'navigator';
  let secondary = 'processor';

  const { emotionalAwareness, emotionalExpression, emotionalRegulation, emotionalDepth, emotionalResilience } = scores;

  if (emotionalRegulation > 70 && emotionalExpression < 50) {
    dominant = 'guardian';
  } else if (emotionalDepth > 70 && emotionalAwareness > 60) {
    dominant = 'feeler';
  } else if (emotionalExpression > 70) {
    dominant = 'expresser';
  } else if (emotionalAwareness > 70 && emotionalExpression < 60) {
    dominant = 'processor';
  } else if (Object.values(scores).every((s) => s > 55)) {
    dominant = 'navigator';
  }

  if (dominant === 'guardian' && emotionalDepth > 50) secondary = 'feeler';
  else if (dominant === 'feeler' && emotionalRegulation > 50) secondary = 'navigator';
  else if (dominant === 'expresser' && emotionalAwareness > 60) secondary = 'processor';
  else if (dominant === 'processor' && emotionalDepth > 60) secondary = 'feeler';
  else secondary = dominant === 'navigator' ? 'processor' : 'navigator';

  return { dominantPattern: dominant, secondaryPattern: secondary };
};

export const generateInsights = (scores: Record<string, number>, pattern: string): string[] => {
  const insights: string[] = [];

  const patternData = PATTERNS[pattern as keyof typeof PATTERNS];
  if (patternData) {
    insights.push(`As ${patternData.name}, ${patternData.description.toLowerCase()}`);
  }

  if (scores.emotionalAwareness > 70) {
    insights.push('You possess a refined ability to notice and name your emotional states — a foundation for all emotional intelligence.');
  } else if (scores.emotionalAwareness < 40) {
    insights.push('Your emotional awareness is an area ripe for development. Building this skill will unlock deeper self-understanding.');
  }

  if (scores.emotionalDepth > 70) {
    insights.push('You experience life with remarkable emotional richness. This depth allows for profound connection and appreciation of beauty.');
  }

  if (scores.emotionalRegulation > 70) {
    insights.push("You have strong capacity to navigate intense emotions without being overwhelmed — a powerful resource for life's challenges.");
  } else if (scores.emotionalRegulation < 40) {
    insights.push('Building your emotional regulation toolkit could help you feel more stable and confident when strong feelings arise.');
  }

  if (scores.emotionalExpression < 40 && scores.emotionalDepth > 50) {
    insights.push('You feel deeply but express selectively. While this protects you, it may also limit the intimacy available in your relationships.');
  }

  if (scores.emotionalResilience > 70) {
    insights.push("You've developed remarkable resilience — the ability to experience pain fully while continuing to grow and move forward.");
  }

  return insights.slice(0, 4);
};

export const generateRecommendations = (scores: Record<string, number>, pattern: string): string[] => {
  const recs: string[] = [];

  const patternData = PATTERNS[pattern as keyof typeof PATTERNS];
  if (patternData && patternData.growthAreas.length > 0) {
    recs.push(`Focus on ${patternData.growthAreas[0].toLowerCase()} as your next growth edge.`);
  }

  if (scores.emotionalAwareness < 60) {
    recs.push('Practice daily emotional check-ins: pause three times a day to ask "What am I feeling right now?" and name it specifically.');
  }

  if (scores.emotionalExpression < 50) {
    recs.push('Experiment with sharing one vulnerable feeling per week with someone you trust. Start small and notice what happens.');
  }

  if (scores.emotionalRegulation < 50) {
    recs.push('Build your regulation toolkit: try breath work, grounding exercises, or body-based practices when emotions feel intense.');
  }

  if (scores.emotionalDepth < 50) {
    recs.push('Create space for emotional depth: spend time in nature, with art, or in meaningful conversation without rushing.');
  }

  if (scores.emotionalResilience < 50) {
    recs.push('Practice self-compassion when facing difficulty. Speak to yourself as you would to a dear friend who is struggling.');
  }

  return recs.slice(0, 4);
};

export const calculateResults = (allAnswers: Record<string, number>, questions: Question[]): AssessmentResults => {
  const categories = {
    awareness: [] as number[],
    expression: [] as number[],
    regulation: [] as number[],
    depth: [] as number[],
    resilience: [] as number[],
  };

  questions.forEach((q) => {
    if (allAnswers[q.id]) {
      categories[q.category as keyof typeof categories].push(allAnswers[q.id]);
    }
  });

  const normalize = (arr: number[]) => {
    if (arr.length === 0) return 50;
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    const maxPossible = arr.some((v) => v > 4) ? 10 : 4;
    return Math.round((avg / maxPossible) * 100);
  };

  const scores = {
    emotionalAwareness: normalize(categories.awareness),
    emotionalExpression: normalize(categories.expression),
    emotionalRegulation: normalize(categories.regulation),
    emotionalDepth: normalize(categories.depth),
    emotionalResilience: normalize(categories.resilience),
  };

  const { dominantPattern, secondaryPattern } = determinePatterns(scores);
  const insights = generateInsights(scores, dominantPattern);
  const recommendations = generateRecommendations(scores, dominantPattern);

  return {
    ...scores,
    dominantPattern,
    secondaryPattern,
    insights,
    recommendations,
  };
};
