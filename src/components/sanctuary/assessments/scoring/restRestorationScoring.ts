import { Question, AssessmentResults } from '../shared/types';

export const REST_STYLES = {
  sanctuary: {
    name: 'The Sanctuary Seeker',
    description: 'You restore best through solitude, quiet, and protected space. Your nervous system craves refuge from the world\'s demands.',
    practices: ['Solo nature walks', 'Quiet mornings', 'Reading in silence', 'Baths or spa time', 'Screen-free evenings'],
    environment: 'Calm, quiet, private spaces with minimal stimulation',
    signs: ['Need for solitude', 'Sensitivity to noise', 'Value of privacy', 'Craving silence'],
    strengths: ['Self-sufficient', 'Introspective', 'Independent', 'Deeply restorative'],
    color: '#6B9BC3',
  },
  mover: {
    name: 'The Active Restorer',
    description: 'You paradoxically recharge through gentle movement. Stillness can feel restless; your body needs to move to release.',
    practices: ['Gentle yoga', 'Walking', 'Swimming', 'Stretching', 'Gardening', 'Tai chi'],
    environment: 'Space for movement, ideally outdoors or with natural light',
    signs: ['Restlessness when still', 'Energy through motion', 'Physical release needs', 'Body awareness'],
    strengths: ['Embodied', 'Active recovery', 'Physical wisdom', 'Motion-oriented'],
    color: '#7BA05B',
  },
  connector: {
    name: 'The Connected Restorer',
    description: 'You restore through meaningful connection with select people. The right company doesn\'t drain you — it fills you up.',
    practices: ['Deep conversations', 'Quiet time with loved ones', 'Co-regulating with pets', 'Gentle social rituals'],
    environment: 'Intimate settings with trusted people, low-pressure gatherings',
    signs: ['Selective socializing', 'Deep connection needs', 'Quality over quantity', 'Relational energy'],
    strengths: ['Empathetic', 'Relationship-oriented', 'Deeply connecting', 'Supportive'],
    color: '#E8B86D',
  },
  creator: {
    name: 'The Creative Restorer',
    description: 'You recharge through beauty, inspiration, and creative expression. Making or experiencing art restores your spirit.',
    practices: ['Making art', 'Playing music', 'Visiting museums', 'Photography', 'Crafts', 'Writing'],
    environment: 'Inspiring spaces, access to creative materials, beauty in surroundings',
    signs: ['Creative urges', 'Beauty sensitivity', 'Artistic needs', 'Inspiration seeking'],
    strengths: ['Imaginative', 'Expressive', 'Aesthetically attuned', 'Generative'],
    color: '#A78BB3',
  },
  naturalist: {
    name: 'The Nature Restorer',
    description: 'You find your deepest rest in the natural world. Trees, water, sky, and earth speak to something essential in you.',
    practices: ['Forest bathing', 'Sitting by water', 'Stargazing', 'Hiking', 'Beach time', 'Gardening'],
    environment: 'Natural settings, outdoor access, plants and natural elements indoors',
    signs: ['Nature affinity', 'Outdoor longing', 'Element connection', 'Seasonal attunement'],
    strengths: ['Grounded', 'Elemental', 'Earth-connected', 'Naturally attuned'],
    color: '#8B9B7A',
  },
  ritualist: {
    name: 'The Ritual Restorer',
    description: 'You restore through consistent practices and rhythms. Routine isn\'t boring to you — it\'s grounding and restorative.',
    practices: ['Morning routines', 'Tea ceremonies', 'Evening rituals', 'Regular sleep schedule', 'Weekly rhythms'],
    environment: 'Predictable, orderly spaces that support your routines',
    signs: ['Routine preference', 'Rhythm sensitivity', 'Structure needs', 'Consistency craving'],
    strengths: ['Disciplined', 'Consistent', 'Grounded', 'Rhythmically attuned'],
    color: '#C4956A',
  },
};

export const determineRestStyle = (scores: Record<string, number>, ans: Record<string, number>) => {
  let restStyle = 'sanctuary';
  let secondaryStyle = 'ritualist';

  const socialNeed = ans['social_1'] || 2;
  const sensoryOverwhelm = ans['sensory_1'] || 5;
  const creativeLife = ans['creative_1'] || 2;
  const physicalTension = ans['physical_4'] || 5;

  if (socialNeed >= 3 && sensoryOverwhelm <= 4) {
    restStyle = 'sanctuary';
  } else if (physicalTension <= 4 && scores.physicalRest < 50) {
    restStyle = 'mover';
  } else if (socialNeed <= 2 && scores.emotionalRest > 50) {
    restStyle = 'connector';
  } else if (creativeLife >= 3 && scores.creativeRest > 50) {
    restStyle = 'creator';
  } else if (sensoryOverwhelm <= 5) {
    restStyle = 'naturalist';
  } else {
    restStyle = 'ritualist';
  }

  if (restStyle === 'sanctuary') secondaryStyle = scores.creativeRest > 50 ? 'creator' : 'naturalist';
  else if (restStyle === 'mover') secondaryStyle = 'naturalist';
  else if (restStyle === 'connector') secondaryStyle = 'ritualist';
  else if (restStyle === 'creator') secondaryStyle = 'sanctuary';
  else if (restStyle === 'naturalist') secondaryStyle = 'sanctuary';
  else secondaryStyle = 'sanctuary';

  return { restStyle, secondaryStyle };
};

export const generateInsights = (scores: Record<string, number>, style: string): string[] => {
  const insights: string[] = [];
  const sortedScores = Object.entries(scores).sort((a, b) => a[1] - b[1]);
  const biggestDeficit = sortedScores[0];
  const secondDeficit = sortedScores[1];

  const deficitNames: Record<string, string> = {
    physicalRest: 'physical rest',
    mentalRest: 'mental rest',
    emotionalRest: 'emotional rest',
    socialRest: 'social rest',
    sensoryRest: 'sensory rest',
    creativeRest: 'creative rest',
  };

  const styleData = REST_STYLES[style as keyof typeof REST_STYLES];
  if (styleData) {
    insights.push(`As ${styleData.name}, ${styleData.description.toLowerCase()}`);
  }

  if (biggestDeficit[1] < 40) {
    insights.push(`Your greatest rest deficit is ${deficitNames[biggestDeficit[0]]}. This is likely affecting your overall energy and wellbeing more than you realize.`);
  }

  if (secondDeficit[1] < 50) {
    insights.push(`${deficitNames[secondDeficit[0]].charAt(0).toUpperCase() + deficitNames[secondDeficit[0]].slice(1)} is also an area that needs attention in your restoration practice.`);
  }

  if (scores.mentalRest < 40 && scores.sensoryRest < 40) {
    insights.push('Your mind and senses are both overstimulated. You may be running on a nervous system that rarely gets to fully settle.');
  }

  if (scores.emotionalRest < 40) {
    insights.push('You\'re likely carrying significant emotional labor. Finding spaces where you can drop the mask is essential for your recovery.');
  }

  if (scores.physicalRest < 40) {
    insights.push('Your body is asking for attention. Physical rest isn\'t laziness — it\'s necessary maintenance for your whole system.');
  }

  return insights.slice(0, 4);
};

export const generateRecommendations = (scores: Record<string, number>): string[] => {
  const recs: string[] = [];
  const deficits = Object.entries(scores).sort((a, b) => a[1] - b[1]);

  deficits.slice(0, 3).forEach(([key, value]) => {
    if (value < 60) {
      switch (key) {
        case 'physicalRest':
          recs.push('Prioritize sleep hygiene: consistent bedtime, dark room, no screens an hour before bed. Your body needs this foundation.');
          break;
        case 'mentalRest':
          recs.push('Schedule "thinking breaks" — short periods where you\'re not solving problems or consuming information. Let your mind wander.');
          break;
        case 'emotionalRest':
          recs.push('Identify one relationship or space where you can be completely yourself. Invest time there. Authenticity is restorative.');
          break;
        case 'socialRest':
          recs.push('Protect your solitude fiercely. Block time in your calendar for alone time and treat it as non-negotiable.');
          break;
        case 'sensoryRest':
          recs.push('Create a daily "sensory sunset" — 30 minutes of reduced stimulation. Dim lights, silence devices, rest your senses.');
          break;
        case 'creativeRest':
          recs.push('Schedule weekly time with beauty — nature, art, music. Not to produce anything, just to receive and be inspired.');
          break;
      }
    }
  });

  recs.push('Build rest into your daily rhythm rather than waiting until you\'re depleted. Small, consistent restoration prevents burnout.');

  return recs.slice(0, 4);
};

export const calculateResults = (allAnswers: Record<string, number>, questions: Question[]): AssessmentResults => {
  const categories = {
    physical: [] as number[],
    mental: [] as number[],
    emotional: [] as number[],
    social: [] as number[],
    sensory: [] as number[],
    creative: [] as number[],
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
    physicalRest: normalize(categories.physical),
    mentalRest: normalize(categories.mental),
    emotionalRest: normalize(categories.emotional),
    socialRest: normalize(categories.social),
    sensoryRest: normalize(categories.sensory),
    creativeRest: normalize(categories.creative),
  };

  const { restStyle, secondaryStyle } = determineRestStyle(scores, allAnswers);
  const insights = generateInsights(scores, restStyle);
  const recommendations = generateRecommendations(scores);
  const idealPractices = REST_STYLES[restStyle as keyof typeof REST_STYLES]?.practices || [];

  return {
    ...scores,
    restStyle,
    secondaryStyle,
    insights,
    recommendations,
    idealPractices,
  };
};
