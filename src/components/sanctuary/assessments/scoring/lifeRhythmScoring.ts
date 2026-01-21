import { Question, AssessmentResults } from '../shared/types';

export const LIFE_RHYTHMS = {
  earlyBird: {
    name: 'The Early Bird',
    description: "Your energy rises with the sun. Mornings are your magic time — you're sharp, creative, and motivated before most people have had coffee. Honor this gift by protecting your mornings.",
    signs: ['Natural early wake-ups', 'Mental clarity before noon', 'Evening sleepiness', 'Best focus at dawn'],
    shadow: 'May feel out of sync with late-night culture or evening demands',
    strengths: ['Decisive mornings', 'Consistent early momentum', 'Strong daily structure', 'Clear start-of-day focus'],
    tools: ['Protect morning hours', 'Early movement', 'Evening wind-down', 'Consistent bedtime'],
    peakTime: 'Early morning (5am - 10am)',
    bestFor: ['Deep work first thing', 'Exercise in morning', 'Important meetings before noon', 'Early bedtime'],
    color: '#E8B86D',
  },
  nightOwl: {
    name: 'The Night Owl',
    description: "You come alive when the world quiets down. Evening and night are when your mind is sharpest and creativity flows. Society may not understand, but your rhythm is valid.",
    signs: ['Late-night clarity', 'Slow morning start', 'Energy rising after 5pm', 'Deep focus in quiet hours'],
    shadow: 'May feel pressured by early schedules or morning-first norms',
    strengths: ['Creative late focus', 'Strong evening flow', 'Adaptable night energy', 'Quiet-hour productivity'],
    tools: ['Negotiate later starts', 'Protect sleep window', 'Evening deep work', 'Gentle morning ramp'],
    peakTime: 'Evening to night (6pm - 2am)',
    bestFor: ['Creative work at night', 'Flexible schedules', 'Second-shift energy', 'Deep night focus'],
    color: '#6B9BC3',
  },
  balanced: {
    name: 'The Steady Rhythm',
    description: "You have a balanced energy pattern without extreme peaks or valleys. Mid-morning and early afternoon tend to be your best times. You're adaptable but still benefit from routine.",
    signs: ['Even energy baseline', 'Moderate daily peaks', 'Good schedule fit', 'Benefits from routine'],
    shadow: 'May drift into gradual depletion without noticing early signals',
    strengths: ['Reliable capacity', 'Adaptable pacing', 'Sustainable routines', 'Balanced productivity'],
    tools: ['Keep consistent rhythms', 'Midday resets', 'Protect breaks', 'Steady sleep window'],
    peakTime: 'Mid-morning to early afternoon (9am - 2pm)',
    bestFor: ['Standard schedules', 'Consistent daily rhythms', 'Moderate flexibility', 'Balanced productivity'],
    color: '#7BA05B',
  },
  waveRider: {
    name: 'The Wave Rider',
    description: "Your energy comes in waves — high intensity periods followed by necessary recovery. This isn't a flaw; it's your rhythm. Working with these waves, not against them, is key.",
    signs: ['High-intensity bursts', 'Recovery needs after effort', 'Variable daily output', 'Cyclical motivation'],
    shadow: "May overcommit during peaks and crash if recovery isn't protected",
    strengths: ['Powerful creative surges', 'Project-based intensity', 'Strong momentum in peaks', 'Clear recovery wisdom'],
    tools: ['Track waves', 'Buffer commitments', 'Plan recovery', 'Honor low-energy periods'],
    peakTime: 'Variable — ride the waves when they come',
    bestFor: ['Project-based work', 'Intense creative bursts', 'Flexible deadlines', 'Built-in recovery periods'],
    color: '#A78BB3',
  },
  seasonalShifter: {
    name: 'The Seasonal Shifter',
    description: "You're deeply connected to natural cycles. Your energy, mood, and needs shift significantly with the seasons. This ancient rhythm connects you to the earth but requires honoring.",
    signs: ['Energy shifts by season', 'Winter contraction needs', 'Summer expansion energy', 'High nature sensitivity'],
    shadow: 'May struggle in year-round uniform environments or expectations',
    strengths: ['Strong natural attunement', 'Seasonal planning wisdom', 'Deep restorative capacity', 'Connection to cycles'],
    tools: ['Seasonal planning', 'Light + nature', 'Adjust expectations', 'Cycle-aligned goals'],
    peakTime: 'Varies by season — summer expansion, winter contraction',
    bestFor: ['Seasonal planning', 'Aligning work with energy cycles', 'Nature connection', 'Flexible annual rhythms'],
    color: '#C4956A',
  },
};

export const determineLifeRhythm = (scores: Record<string, number>) => {
  let lifeRhythm = 'balanced';
  let secondaryRhythm = 'waveRider';
  let peakHours = 'Mid-morning to early afternoon';

  const chronotypeScore = scores.chronotype;
  const seasonalScore = scores.seasonalSensitivity;
  const energyStability = scores.energyStability;
  const recoveryPattern = scores.recoveryPattern;

  if (chronotypeScore > 70) {
    lifeRhythm = 'earlyBird';
    peakHours = 'Early morning (5am - 10am)';
  } else if (chronotypeScore < 40) {
    lifeRhythm = 'nightOwl';
    peakHours = 'Evening to night (6pm - 2am)';
  }

  if (seasonalScore > 70) {
    if (lifeRhythm === 'balanced') {
      lifeRhythm = 'seasonalShifter';
    } else {
      secondaryRhythm = 'seasonalShifter';
    }
    peakHours = 'Varies by season';
  }

  if (energyStability < 40 || recoveryPattern < 40) {
    if (lifeRhythm === 'balanced') {
      lifeRhythm = 'waveRider';
      peakHours = 'Variable — ride the waves';
    } else {
      secondaryRhythm = 'waveRider';
    }
  }

  if (lifeRhythm === 'earlyBird') {
    secondaryRhythm = seasonalScore > 50 ? 'seasonalShifter' : 'balanced';
  } else if (lifeRhythm === 'nightOwl') {
    secondaryRhythm = energyStability < 50 ? 'waveRider' : 'balanced';
  } else if (lifeRhythm === 'seasonalShifter') {
    secondaryRhythm = chronotypeScore > 60 ? 'earlyBird' : chronotypeScore < 40 ? 'nightOwl' : 'balanced';
  } else if (lifeRhythm === 'waveRider') {
    secondaryRhythm = seasonalScore > 50 ? 'seasonalShifter' : 'balanced';
  }

  return { lifeRhythm, secondaryRhythm, peakHours };
};

export const generateInsights = (scores: Record<string, number>, rhythm: string): string[] => {
  const insights: string[] = [];

  const rhythmData = LIFE_RHYTHMS[rhythm as keyof typeof LIFE_RHYTHMS];
  if (rhythmData) {
    insights.push(`You are ${rhythmData.name}. ${rhythmData.description}`);
  }

  if (scores.rhythmAlignment < 40) {
    insights.push("You're currently living out of sync with your natural rhythms. This misalignment is likely costing you energy, mood, and wellbeing.");
  } else if (scores.rhythmAlignment > 70) {
    insights.push("You're living in good alignment with your natural rhythms. This is a significant factor in your overall wellbeing.");
  }

  if (scores.energyStability < 40) {
    insights.push('Your energy fluctuates significantly. Understanding these patterns rather than fighting them will help you work with your natural waves.');
  }

  if (scores.seasonalSensitivity > 70) {
    insights.push("You're highly sensitive to seasonal changes. This isn't weakness — it's attunement to natural cycles. Plan your year accordingly.");
  }

  if (scores.recoveryPattern < 40) {
    insights.push("You need more recovery time than average. This isn't laziness — it's your system's requirement.");
  }

  return insights.slice(0, 4);
};

export const generateRecommendations = (scores: Record<string, number>, rhythm: string): string[] => {
  const recs: string[] = [];

  switch (rhythm) {
    case 'earlyBird':
      recs.push('Protect your mornings fiercely. Schedule your most important work before noon.');
      recs.push('Create an evening wind-down routine that starts by 8pm. Your body wants to sleep early — honor it.');
      break;
    case 'nightOwl':
      recs.push('If possible, negotiate a later start time. Even one hour can make a significant difference.');
      recs.push('Use your night hours wisely — this is your peak time. Do creative and deep work when the world is quiet.');
      break;
    case 'balanced':
      recs.push("Maintain your steady rhythms — they're an asset. Consistent sleep, meals, and activity times keep you humming.");
      recs.push('Schedule demanding work in your mid-morning peak window.');
      break;
    case 'waveRider':
      recs.push('Track your energy waves to find patterns. When high energy comes, ride it. When low energy comes, rest.');
      recs.push("Build buffer time into your commitments. Your waves don't follow external schedules.");
      break;
    case 'seasonalShifter':
      recs.push('Plan your year seasonally. Big projects in high-energy season. More rest in low season.');
      recs.push('In winter, use light therapy, get outside midday, and reduce expectations.');
      break;
  }

  if (scores.rhythmAlignment < 50) {
    recs.push('Start with one small alignment change: adjust your sleep time by 30 minutes toward your natural rhythm.');
  }

  if (scores.recoveryPattern < 50) {
    recs.push("Build recovery into your schedule proactively. Plan rest before you're exhausted.");
  }

  return recs.slice(0, 4);
};

export const calculateResults = (allAnswers: Record<string, number>, questions: Question[]): AssessmentResults => {
  const categories = {
    chronotype: [] as number[],
    energy: [] as number[],
    seasonal: [] as number[],
    alignment: [] as number[],
    recovery: [] as number[],
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
    chronotype: normalize(categories.chronotype),
    energyStability: normalize(categories.energy),
    seasonalSensitivity: normalize(categories.seasonal),
    rhythmAlignment: normalize(categories.alignment),
    recoveryPattern: normalize(categories.recovery),
  };

  const { lifeRhythm, secondaryRhythm, peakHours } = determineLifeRhythm(scores);
  const insights = generateInsights(scores, lifeRhythm);
  const recommendations = generateRecommendations(scores, lifeRhythm);
  const optimalPractices = LIFE_RHYTHMS[lifeRhythm as keyof typeof LIFE_RHYTHMS]?.bestFor || [];

  return {
    ...scores,
    lifeRhythm,
    secondaryRhythm,
    peakHours,
    insights,
    recommendations,
    optimalPractices,
  };
};
