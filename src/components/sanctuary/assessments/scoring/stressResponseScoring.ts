import { Question, AssessmentResults } from '../shared/types';

export const STRESS_RESPONSES = {
  fight: {
    name: 'The Fighter',
    emoji: '⚔️',
    description: 'Your nervous system responds to stress with activation and action. You meet challenges head-on, sometimes with intensity.',
    signs: ['Irritability under stress', 'Urge to take action', 'Frustration with obstacles', 'Tension and restlessness'],
    shadow: 'May become aggressive, controlling, or burn out from constant pushing',
    strengths: ['Takes initiative', 'Protective of others', 'Gets things done', 'Doesn\'t avoid problems'],
    tools: ['Physical exercise', 'Healthy anger expression', 'Channel energy productively', 'Cool-down practices'],
    color: '#C47070',
  },
  flight: {
    name: 'The Flyer',
    emoji: '🦋',
    description: 'Your nervous system responds with urgency to escape or avoid. You\'re highly attuned to threats and skilled at anticipating problems.',
    signs: ['Anxiety and worry', 'Avoidance of conflict', 'Busy-ness and overthinking', 'Difficulty being still'],
    shadow: 'May become anxious, avoidant, or exhaust yourself running from perceived threats',
    strengths: ['Anticipates problems', 'Plans ahead', 'Quick thinking', 'Highly aware'],
    tools: ['Grounding practices', 'Calming breathwork', 'Gradual exposure', 'Settling techniques'],
    color: '#E8B86D',
  },
  freeze: {
    name: 'The Freezer',
    emoji: '🧊',
    description: 'Your nervous system responds by shutting down and conserving energy. This protects you by reducing visibility to threats.',
    signs: ['Numbing out under stress', 'Difficulty taking action', 'Feeling stuck or paralyzed', 'Spacing out'],
    shadow: 'May become depressed, disconnected, or unable to engage with life fully',
    strengths: ['Can endure difficult situations', 'Observant', 'Patient', 'Non-reactive'],
    tools: ['Gentle movement', 'Warmth and safety', 'Small activating steps', 'Connection with safe people'],
    color: '#6B9BC3',
  },
  fawn: {
    name: 'The Connector',
    emoji: '🤝',
    description: 'Your nervous system responds by prioritizing others\' needs. You\'ve learned that safety comes through connection and accommodation.',
    signs: ['People-pleasing under stress', 'Difficulty saying no', 'Hypervigilance to moods', 'Losing yourself'],
    shadow: 'May lose sense of self, enable harmful dynamics, or exhaust yourself caring for others',
    strengths: ['Empathetic', 'Builds relationships', 'Reads people well', 'Creates harmony'],
    tools: ['Boundary setting', 'Self-connection', 'Tolerating others\' discomfort', 'Validating your needs'],
    color: '#A78BB3',
  },
  regulated: {
    name: 'The Balanced',
    emoji: '⚖️',
    description: 'Your nervous system has developed good capacity to move through stress and return to balance. You experience activation but don\'t get stuck.',
    signs: ['Flexible responses', 'Quick recovery', 'Awareness of states', 'Multiple strategies'],
    shadow: 'May still have specific triggers; regulation is a practice, not a destination',
    strengths: ['Resilient', 'Adaptable', 'Self-aware', 'Emotionally intelligent'],
    tools: ['Continue practices', 'Support others', 'Maintain balance', 'Explore growth edges'],
    color: '#7BA05B',
  },
};

export const determineStressResponse = (scores: Record<string, number>, ans: Record<string, number>) => {
  let stressResponse = 'regulated';
  let secondaryResponse = 'flight';

  const bodyResponse = ans['activation_3'] || 1;
  const avgScore = (scores.activationLevel + scores.recoveryCapacity + scores.windowOfTolerance) / 3;

  if (avgScore > 70) {
    stressResponse = 'regulated';
  } else if (bodyResponse === 1) {
    stressResponse = 'flight';
  } else if (bodyResponse === 2) {
    stressResponse = 'fight';
  } else if (bodyResponse === 4 || avgScore < 35) {
    stressResponse = 'freeze';
  } else if (scores.copingFlexibility < 40) {
    stressResponse = 'fawn';
  } else {
    stressResponse = 'flight';
  }

  const responses = ['fight', 'flight', 'freeze', 'fawn'];
  secondaryResponse = responses.find(r => r !== stressResponse) || 'flight';

  return { stressResponse, secondaryResponse };
};

export const generateInsights = (scores: Record<string, number>, response: string): string[] => {
  const insights: string[] = [];
  const data = STRESS_RESPONSES[response as keyof typeof STRESS_RESPONSES];
  
  if (data) {
    insights.push(`Your primary stress response is ${data.name}. ${data.description}`);
  }

  if (scores.activationLevel < 40) {
    insights.push('Your baseline nervous system state is elevated. You may be living with chronic activation that feels "normal" but is taxing your system.');
  } else if (scores.activationLevel > 70) {
    insights.push('You have a calm baseline state. Your nervous system starts from a regulated place, which gives you more capacity to handle stress.');
  }

  if (scores.recoveryCapacity < 40) {
    insights.push('Your recovery capacity needs attention. Your system has difficulty completing stress cycles, which means activation accumulates.');
  } else if (scores.recoveryCapacity > 70) {
    insights.push('You recover well from stress. Your nervous system knows how to return to baseline, which is a significant strength.');
  }

  if (scores.windowOfTolerance < 40) {
    insights.push('Your window of tolerance is narrower than ideal. You may move into overwhelm or shutdown more easily than you\'d like.');
  }

  return insights.slice(0, 4);
};

export const generateRecommendations = (scores: Record<string, number>, response: string): string[] => {
  const recs: string[] = [];
  const data = STRESS_RESPONSES[response as keyof typeof STRESS_RESPONSES];

  if (data) {
    recs.push(`As ${data.name}, focus on: ${data.tools.slice(0, 2).join(' and ')}.`);
  }

  if (scores.recoveryCapacity < 50) {
    recs.push('Build recovery rituals into your day — transition practices, wind-down routines, and completion rituals for stressful tasks.');
  }

  if (scores.windowOfTolerance < 50) {
    recs.push('Work on expanding your window of tolerance through small challenges followed by successful regulation.');
  }

  if (scores.triggerAwareness < 50) {
    recs.push('Practice noticing your body\'s early warning signs. Catching stress early gives you more options.');
  }

  if (scores.copingFlexibility < 50) {
    recs.push('Expand your coping toolkit. Different situations call for different strategies.');
  }

  return recs.slice(0, 4);
};

export const calculateResults = (allAnswers: Record<string, number>, questions: Question[]): AssessmentResults => {
  const categories = {
    activation: [] as number[],
    recovery: [] as number[],
    triggers: [] as number[],
    coping: [] as number[],
    window: [] as number[],
  };

  questions.forEach((q) => {
    if (allAnswers[q.id]) {
      categories[q.category as keyof typeof categories].push(allAnswers[q.id]);
    }
  });

  const normalize = (arr: number[]) => {
    if (arr.length === 0) return 50;
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    return Math.round((avg / 4) * 100);
  };

  const scores = {
    activationLevel: normalize(categories.activation),
    recoveryCapacity: normalize(categories.recovery),
    triggerAwareness: normalize(categories.triggers),
    copingFlexibility: normalize(categories.coping),
    windowOfTolerance: normalize(categories.window),
  };

  const { stressResponse, secondaryResponse } = determineStressResponse(scores, allAnswers);
  const insights = generateInsights(scores, stressResponse);
  const recommendations = generateRecommendations(scores, stressResponse);
  const regulationTools = STRESS_RESPONSES[stressResponse as keyof typeof STRESS_RESPONSES]?.tools || [];

  return { ...scores, stressResponse, secondaryResponse, insights, recommendations, regulationTools };
};
