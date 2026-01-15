'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface AssessmentProps {
  onBack: () => void;
  onComplete?: (results: AssessmentResults) => void;
}

interface AssessmentResults {
  physicalRest: number;
  mentalRest: number;
  emotionalRest: number;
  socialRest: number;
  sensoryRest: number;
  creativeRest: number;
  restStyle: string;
  secondaryStyle: string;
  insights: string[];
  recommendations: string[];
  idealPractices: string[];
}

interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: 'scale' | 'choice' | 'slider' | 'ranking';
  options?: { value: number; label: string; description?: string }[];
  category: 'physical' | 'mental' | 'emotional' | 'social' | 'sensory' | 'creative';
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

const QUESTIONS: Question[] = [
  // Physical Rest (4 questions)
  {
    id: 'physical_1',
    text: 'How does your body typically feel at the end of a normal day?',
    type: 'scale',
    options: [
      { value: 1, label: 'Exhausted', description: 'Completely drained physically' },
      { value: 2, label: 'Tired', description: 'Noticeably fatigued' },
      { value: 3, label: 'Moderately tired', description: 'Ready to wind down' },
      { value: 4, label: 'Still energized', description: 'Could keep going' },
    ],
    category: 'physical',
  },
  {
    id: 'physical_2',
    text: 'How would you rate the quality of your sleep most nights?',
    type: 'slider',
    category: 'physical',
    min: 1,
    max: 10,
    minLabel: 'Poor — restless, broken',
    maxLabel: 'Excellent — deep, restorative',
  },
  {
    id: 'physical_3',
    text: 'How often do you wake up feeling truly rested?',
    type: 'scale',
    options: [
      { value: 1, label: 'Rarely', description: 'Almost never feel rested' },
      { value: 2, label: 'Sometimes', description: 'Maybe once a week' },
      { value: 3, label: 'Often', description: 'Most mornings' },
      { value: 4, label: 'Usually', description: 'I generally wake refreshed' },
    ],
    category: 'physical',
  },
  {
    id: 'physical_4',
    text: 'How much does physical tension (shoulders, jaw, back) affect your daily life?',
    type: 'slider',
    category: 'physical',
    min: 1,
    max: 10,
    minLabel: 'Constantly tense',
    maxLabel: 'Rarely notice tension',
  },

  // Mental Rest (4 questions)
  {
    id: 'mental_1',
    text: 'How often does your mind feel "full" or overwhelmed with thoughts?',
    type: 'scale',
    options: [
      { value: 1, label: 'Constantly', description: 'My mind never stops' },
      { value: 2, label: 'Frequently', description: 'Most of the time' },
      { value: 3, label: 'Sometimes', description: 'During busy periods' },
      { value: 4, label: 'Rarely', description: 'I can usually find mental quiet' },
    ],
    category: 'mental',
  },
  {
    id: 'mental_2',
    text: 'How difficult is it for you to "switch off" from work or responsibilities?',
    type: 'slider',
    category: 'mental',
    min: 1,
    max: 10,
    minLabel: 'Very difficult',
    maxLabel: 'I can disconnect easily',
  },
  {
    id: 'mental_3',
    text: 'When you have free time, your mind typically:',
    type: 'choice',
    options: [
      { value: 1, label: 'Races with to-do lists and worries' },
      { value: 2, label: 'Drifts to problems and planning' },
      { value: 3, label: 'Gradually settles after a while' },
      { value: 4, label: 'Relaxes into the present moment' },
    ],
    category: 'mental',
  },
  {
    id: 'mental_4',
    text: 'How often do you experience mental fatigue or "brain fog"?',
    type: 'scale',
    options: [
      { value: 1, label: 'Daily', description: 'It\'s a constant companion' },
      { value: 2, label: 'Several times a week', description: 'More often than I\'d like' },
      { value: 3, label: 'Occasionally', description: 'After intense periods' },
      { value: 4, label: 'Rarely', description: 'My mind usually feels clear' },
    ],
    category: 'mental',
  },

  // Emotional Rest (4 questions)
  {
    id: 'emotional_1',
    text: 'How much of your day involves managing other people\'s emotions or needs?',
    type: 'slider',
    category: 'emotional',
    min: 1,
    max: 10,
    minLabel: 'Almost all of it',
    maxLabel: 'Very little',
  },
  {
    id: 'emotional_2',
    text: 'How often do you feel you can be completely yourself, without performing or filtering?',
    type: 'scale',
    options: [
      { value: 1, label: 'Rarely', description: 'I\'m always "on"' },
      { value: 2, label: 'Sometimes', description: 'With certain people' },
      { value: 3, label: 'Often', description: 'In most situations' },
      { value: 4, label: 'Usually', description: 'I feel authentic most of the time' },
    ],
    category: 'emotional',
  },
  {
    id: 'emotional_3',
    text: 'How drained do you feel after social or emotional interactions?',
    type: 'choice',
    options: [
      { value: 1, label: 'Completely depleted — need major recovery' },
      { value: 2, label: 'Noticeably tired — need quiet time after' },
      { value: 3, label: 'Mildly tired — brief rest helps' },
      { value: 4, label: 'Energized or neutral — depends on the interaction' },
    ],
    category: 'emotional',
  },
  {
    id: 'emotional_4',
    text: 'Do you have spaces or relationships where you can truly let your guard down?',
    type: 'scale',
    options: [
      { value: 1, label: 'Not really', description: 'I\'m always somewhat guarded' },
      { value: 2, label: 'One or two', description: 'Limited safe spaces' },
      { value: 3, label: 'Several', description: 'A good support network' },
      { value: 4, label: 'Many', description: 'I feel safe in most close relationships' },
    ],
    category: 'emotional',
  },

  // Social Rest (3 questions)
  {
    id: 'social_1',
    text: 'After a day of social interaction, you typically need:',
    type: 'choice',
    options: [
      { value: 4, label: 'Extended alone time — hours or even a full day' },
      { value: 3, label: 'Significant quiet — an evening to yourself' },
      { value: 2, label: 'Some space — an hour or two' },
      { value: 1, label: 'Not much — I recharge around others' },
    ],
    category: 'social',
  },
  {
    id: 'social_2',
    text: 'How often do you feel "peopled out" or socially depleted?',
    type: 'scale',
    options: [
      { value: 4, label: 'Very often', description: 'Most days' },
      { value: 3, label: 'Frequently', description: 'Several times a week' },
      { value: 2, label: 'Sometimes', description: 'After big social events' },
      { value: 1, label: 'Rarely', description: 'Social time energizes me' },
    ],
    category: 'social',
  },
  {
    id: 'social_3',
    text: 'Your ideal weekend involves:',
    type: 'choice',
    options: [
      { value: 4, label: 'Mostly solitude with minimal obligations' },
      { value: 3, label: 'Quiet time with one or two close people' },
      { value: 2, label: 'A mix of social plans and downtime' },
      { value: 1, label: 'Lots of activities and connection with others' },
    ],
    category: 'social',
  },

  // Sensory Rest (3 questions)
  {
    id: 'sensory_1',
    text: 'How overwhelmed do you feel by sensory input (noise, screens, lights, crowds)?',
    type: 'slider',
    category: 'sensory',
    min: 1,
    max: 10,
    minLabel: 'Very overwhelmed',
    maxLabel: 'Rarely bothered',
  },
  {
    id: 'sensory_2',
    text: 'How much of your day involves screens (phone, computer, TV)?',
    type: 'scale',
    options: [
      { value: 1, label: 'Almost all of it', description: '10+ hours' },
      { value: 2, label: 'Most of it', description: '6-10 hours' },
      { value: 3, label: 'A moderate amount', description: '3-6 hours' },
      { value: 4, label: 'Limited', description: 'Under 3 hours' },
    ],
    category: 'sensory',
  },
  {
    id: 'sensory_3',
    text: 'How often do you intentionally reduce sensory input (silence, darkness, nature)?',
    type: 'scale',
    options: [
      { value: 1, label: 'Rarely', description: 'Almost never' },
      { value: 2, label: 'Sometimes', description: 'When I remember' },
      { value: 3, label: 'Regularly', description: 'Part of my routine' },
      { value: 4, label: 'Daily', description: 'I prioritize sensory rest' },
    ],
    category: 'sensory',
  },

  // Creative Rest (3 questions)
  {
    id: 'creative_1',
    text: 'How often do you experience a sense of wonder or awe?',
    type: 'scale',
    options: [
      { value: 1, label: 'Rarely', description: 'Life feels routine' },
      { value: 2, label: 'Sometimes', description: 'Occasionally something moves me' },
      { value: 3, label: 'Often', description: 'I notice beauty regularly' },
      { value: 4, label: 'Frequently', description: 'Wonder is part of my life' },
    ],
    category: 'creative',
  },
  {
    id: 'creative_2',
    text: 'How much time do you spend with things that inspire you (nature, art, music, ideas)?',
    type: 'slider',
    category: 'creative',
    min: 1,
    max: 10,
    minLabel: 'Very little',
    maxLabel: 'Abundant time',
  },
  {
    id: 'creative_3',
    text: 'Your creative energy and inspiration currently feels:',
    type: 'choice',
    options: [
      { value: 1, label: 'Depleted — I feel creatively dry' },
      { value: 2, label: 'Low — sparks are rare' },
      { value: 3, label: 'Moderate — comes and goes' },
      { value: 4, label: 'Alive — I feel inspired regularly' },
    ],
    category: 'creative',
  },
];

const REST_STYLES = {
  sanctuary: {
    name: 'The Sanctuary Seeker',
    description: 'You restore best through solitude, quiet, and protected space. Your nervous system craves refuge from the world\'s demands.',
    practices: ['Solo nature walks', 'Quiet mornings', 'Reading in silence', 'Baths or spa time', 'Screen-free evenings'],
    environment: 'Calm, quiet, private spaces with minimal stimulation',
    color: '#6B9BC3',
  },
  mover: {
    name: 'The Active Restorer',
    description: 'You paradoxically recharge through gentle movement. Stillness can feel restless; your body needs to move to release.',
    practices: ['Gentle yoga', 'Walking', 'Swimming', 'Stretching', 'Gardening', 'Tai chi'],
    environment: 'Space for movement, ideally outdoors or with natural light',
    color: '#7BA05B',
  },
  connector: {
    name: 'The Connected Restorer',
    description: 'You restore through meaningful connection with select people. The right company doesn\'t drain you — it fills you up.',
    practices: ['Deep conversations', 'Quiet time with loved ones', 'Co-regulating with pets', 'Gentle social rituals'],
    environment: 'Intimate settings with trusted people, low-pressure gatherings',
    color: '#E8B86D',
  },
  creator: {
    name: 'The Creative Restorer',
    description: 'You recharge through beauty, inspiration, and creative expression. Making or experiencing art restores your spirit.',
    practices: ['Making art', 'Playing music', 'Visiting museums', 'Photography', 'Crafts', 'Writing'],
    environment: 'Inspiring spaces, access to creative materials, beauty in surroundings',
    color: '#A78BB3',
  },
  naturalist: {
    name: 'The Nature Restorer',
    description: 'You find your deepest rest in the natural world. Trees, water, sky, and earth speak to something essential in you.',
    practices: ['Forest bathing', 'Sitting by water', 'Stargazing', 'Hiking', 'Beach time', 'Gardening'],
    environment: 'Natural settings, outdoor access, plants and natural elements indoors',
    color: '#8B9B7A',
  },
  ritualist: {
    name: 'The Ritual Restorer',
    description: 'You restore through consistent practices and rhythms. Routine isn\'t boring to you — it\'s grounding and restorative.',
    practices: ['Morning routines', 'Tea ceremonies', 'Evening rituals', 'Regular sleep schedule', 'Weekly rhythms'],
    environment: 'Predictable, orderly spaces that support your routines',
    color: '#C4956A',
  },
};

export default function RestRestorationAssessment({ onBack, onComplete }: AssessmentProps) {
  const { isDark, colors } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showIntro, setShowIntro] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [sliderValue, setSliderValue] = useState(5);

  const bgColor = colors.bg;
  const textColor = colors.text;
  const mutedColor = colors.textMuted;
  const accentColor = colors.accent;
  const cardBg = colors.cardBg;

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSliderValue(5);
      }, 300);
    } else {
      const calculatedResults = calculateResults(newAnswers);
      setResults(calculatedResults);
      setShowReport(true);
      onComplete?.(calculatedResults);
    }
  };

  const handleSliderSubmit = () => {
    handleAnswer(sliderValue);
  };

  const calculateResults = (allAnswers: Record<string, number>): AssessmentResults => {
    const categories = {
      physical: [] as number[],
      mental: [] as number[],
      emotional: [] as number[],
      social: [] as number[],
      sensory: [] as number[],
      creative: [] as number[],
    };

    QUESTIONS.forEach((q) => {
      if (allAnswers[q.id]) {
        categories[q.category].push(allAnswers[q.id]);
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

    // Determine deficit areas (lower scores = more need)
    const deficits = Object.entries(scores).sort((a, b) => a[1] - b[1]);
    
    const { restStyle, secondaryStyle } = determineRestStyle(scores, allAnswers);
    const insights = generateInsights(scores, restStyle);
    const recommendations = generateRecommendations(scores, deficits);
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

  const determineRestStyle = (scores: Record<string, number>, answers: Record<string, number>) => {
    let restStyle = 'sanctuary';
    let secondaryStyle = 'ritualist';

    const socialNeed = answers['social_1'] || 2;
    const sensoryOverwhelm = answers['sensory_1'] || 5;
    const creativeLife = answers['creative_1'] || 2;
    const physicalTension = answers['physical_4'] || 5;

    // High social rest need + sensory sensitivity = Sanctuary
    if (socialNeed >= 3 && sensoryOverwhelm <= 4) {
      restStyle = 'sanctuary';
    }
    // Physical tension + movement preference
    else if (physicalTension <= 4 && scores.physicalRest < 50) {
      restStyle = 'mover';
    }
    // Low social need + emotional connection
    else if (socialNeed <= 2 && scores.emotionalRest > 50) {
      restStyle = 'connector';
    }
    // High creative life
    else if (creativeLife >= 3 && scores.creativeRest > 50) {
      restStyle = 'creator';
    }
    // Sensory sensitivity + nature preference
    else if (sensoryOverwhelm <= 5) {
      restStyle = 'naturalist';
    }
    // Default to ritualist for balanced profiles
    else {
      restStyle = 'ritualist';
    }

    // Determine secondary
    const styles = ['sanctuary', 'mover', 'connector', 'creator', 'naturalist', 'ritualist'];
    secondaryStyle = styles.find(s => s !== restStyle) || 'ritualist';
    
    if (restStyle === 'sanctuary') secondaryStyle = scores.creativeRest > 50 ? 'creator' : 'naturalist';
    else if (restStyle === 'mover') secondaryStyle = 'naturalist';
    else if (restStyle === 'connector') secondaryStyle = 'ritualist';
    else if (restStyle === 'creator') secondaryStyle = 'sanctuary';
    else if (restStyle === 'naturalist') secondaryStyle = 'sanctuary';

    return { restStyle, secondaryStyle };
  };

  const generateInsights = (scores: Record<string, number>, style: string): string[] => {
    const insights: string[] = [];

    // Find biggest deficits
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

    const styleData = REST_STYLES[style as keyof typeof REST_STYLES];
    if (styleData) {
      insights.push(`As ${styleData.name}, ${styleData.description.toLowerCase()}`);
    }

    return insights.slice(0, 4);
  };

  const generateRecommendations = (scores: Record<string, number>, deficits: [string, number][]): string[] => {
    const recs: string[] = [];

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

  // INTRO SCREEN
  if (showIntro) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: bgColor }}>
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="p-2 rounded-full" style={{ color: mutedColor }}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div 
            className="w-24 h-24 rounded-full mb-8 flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}22` }}
          >
            <svg viewBox="0 0 48 48" className="w-12 h-12">
              <path d="M24 8 C16 8 10 14 10 22 C10 30 16 38 24 42 C32 38 38 30 38 22 C38 14 32 8 24 8" fill="none" stroke={accentColor} strokeWidth="1.5" />
              <circle cx="24" cy="22" r="6" fill={accentColor} opacity="0.6" />
              <path d="M24 28 L24 36" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="text-3xl font-light mb-3" style={{ color: textColor }}>
            Rest & Restoration
          </h1>
          <p className="text-lg mb-2" style={{ color: accentColor }}>
            How You Recharge
          </p>
          <p className="text-base mb-8 max-w-md" style={{ color: mutedColor }}>
            Discover your unique restoration needs and the practices that will most effectively replenish your energy.
          </p>

          <div 
            className="w-full max-w-sm p-5 rounded-2xl mb-8"
            style={{ backgroundColor: cardBg }}
          >
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span style={{ color: textColor }}>About 12 minutes</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span style={{ color: textColor }}>21 reflective questions</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span style={{ color: textColor }}>Personalized rest prescription</span>
            </div>
          </div>

          <p className="text-sm mb-8 max-w-md" style={{ color: mutedColor }}>
            Be honest about how you actually rest, not how you think you should. There are no wrong answers.
          </p>

          <button
            onClick={() => setShowIntro(false)}
            className="px-8 py-4 rounded-2xl font-medium text-white"
            style={{ backgroundColor: accentColor }}
          >
            Begin Discovery
          </button>
        </div>
      </div>
    );
  }

  // REPORT SCREEN
  if (showReport && results) {
    const restStyleData = REST_STYLES[results.restStyle as keyof typeof REST_STYLES];
    const secondaryStyleData = REST_STYLES[results.secondaryStyle as keyof typeof REST_STYLES];

    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: bgColor }}>
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="p-2 rounded-full" style={{ color: mutedColor }}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-sm" style={{ color: mutedColor }}>Your Rest Profile</span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-lg mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-light mb-2" style={{ color: textColor }}>
                Your Restoration Blueprint
              </h1>
              <p className="text-sm" style={{ color: mutedColor }}>
                How to replenish your unique energy
              </p>
            </div>

            {/* Primary Rest Style */}
            <div 
              className="p-6 rounded-2xl mb-6"
              style={{ 
                backgroundColor: isDark ? `${restStyleData.color}22` : `${restStyleData.color}15`,
                borderLeft: `4px solid ${restStyleData.color}`,
              }}
            >
              <div className="text-sm uppercase tracking-wide mb-1" style={{ color: restStyleData.color }}>
                Your Rest Style
              </div>
              <h2 className="text-2xl font-medium mb-3" style={{ color: textColor }}>
                {restStyleData.name}
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: mutedColor }}>
                {restStyleData.description}
              </p>
              <div className="text-sm" style={{ color: mutedColor }}>
                <strong style={{ color: textColor }}>Ideal environment:</strong> {restStyleData.environment}
              </div>
            </div>

            {/* Rest Deficit Scores */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <h3 className="text-lg font-medium mb-4" style={{ color: textColor }}>
                Your Rest Levels
              </h3>
              <p className="text-xs mb-4" style={{ color: mutedColor }}>
                Lower scores indicate greater need for this type of rest
              </p>
              
              {[
                { label: 'Physical Rest', value: results.physicalRest, color: '#C4956A' },
                { label: 'Mental Rest', value: results.mentalRest, color: '#6B9BC3' },
                { label: 'Emotional Rest', value: results.emotionalRest, color: '#C47070' },
                { label: 'Social Rest', value: results.socialRest, color: '#7BA05B' },
                { label: 'Sensory Rest', value: results.sensoryRest, color: '#A78BB3' },
                { label: 'Creative Rest', value: results.creativeRest, color: '#E8B86D' },
              ].map((item, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm" style={{ color: textColor }}>{item.label}</span>
                    <span className="text-sm font-medium" style={{ color: item.value < 50 ? '#C47070' : item.color }}>
                      {item.value < 40 ? 'Depleted' : item.value < 60 ? 'Low' : item.value < 75 ? 'Moderate' : 'Good'}
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${item.value}%`, backgroundColor: item.value < 50 ? '#C47070' : item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Ideal Practices */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <h3 className="text-lg font-medium mb-3" style={{ color: textColor }}>
                Your Ideal Rest Practices
              </h3>
              <div className="flex flex-wrap gap-2">
                {results.idealPractices.map((practice, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1.5 rounded-full text-sm"
                    style={{ 
                      backgroundColor: isDark ? `${restStyleData.color}33` : `${restStyleData.color}22`,
                      color: restStyleData.color,
                    }}
                  >
                    {practice}
                  </span>
                ))}
              </div>
            </div>

            {/* Secondary Style */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <div className="text-sm uppercase tracking-wide mb-1" style={{ color: secondaryStyleData.color }}>
                Secondary Style
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: textColor }}>
                {secondaryStyleData.name}
              </h3>
              <p className="text-sm" style={{ color: mutedColor }}>
                This style also resonates with you. Mix these practices in for variety.
              </p>
            </div>

            {/* Insights */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <h3 className="text-lg font-medium mb-4" style={{ color: textColor }}>
                Insights
              </h3>
              <div className="space-y-4">
                {results.insights.map((insight, i) => (
                  <div key={i} className="flex gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${accentColor}22` }}
                    >
                      <span className="text-xs" style={{ color: accentColor }}>{i + 1}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: mutedColor }}>
                      {insight}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <h3 className="text-lg font-medium mb-4" style={{ color: textColor }}>
                Your Rest Prescription
              </h3>
              <div className="space-y-4">
                {results.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${accentColor}22` }}
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="3">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: mutedColor }}>
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Closing */}
            <div className="text-center py-6">
              <p className="text-sm mb-6" style={{ color: mutedColor }}>
                Rest is not a reward for productivity. It's a prerequisite for living fully.
              </p>
              <button
                onClick={onBack}
                className="px-8 py-4 rounded-2xl font-medium text-white"
                style={{ backgroundColor: accentColor }}
              >
                Return to Library
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // QUESTION SCREEN
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: bgColor }}>
      <div className="flex items-center justify-between p-4">
        <button onClick={onBack} className="p-2 rounded-full" style={{ color: mutedColor }}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span className="text-sm" style={{ color: mutedColor }}>
          {currentQuestion + 1} of {QUESTIONS.length}
        </span>
      </div>

      <div className="px-4">
        <div 
          className="h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
        >
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: accentColor }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="max-w-lg mx-auto w-full">
          <h2 className="text-xl font-medium mb-2 leading-relaxed" style={{ color: textColor }}>
            {question.text}
          </h2>
          {question.subtext && (
            <p className="text-sm mb-8" style={{ color: mutedColor }}>
              {question.subtext}
            </p>
          )}
          {!question.subtext && <div className="mb-8" />}

          {(question.type === 'scale' || question.type === 'choice') && question.options && (
            <div className="space-y-3">
              {question.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full p-4 rounded-xl text-left transition-all hover:scale-[1.02]"
                  style={{ 
                    backgroundColor: cardBg,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  }}
                >
                  <div className="font-medium mb-1" style={{ color: textColor }}>
                    {option.label}
                  </div>
                  {option.description && (
                    <div className="text-sm" style={{ color: mutedColor }}>
                      {option.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {question.type === 'slider' && (
            <div className="space-y-6">
              <div className="px-2">
                <input
                  type="range"
                  min={question.min || 1}
                  max={question.max || 10}
                  value={sliderValue}
                  onChange={(e) => setSliderValue(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ 
                    background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${((sliderValue - 1) / 9) * 100}%, ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'} ${((sliderValue - 1) / 9) * 100}%, ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'} 100%)`,
                  }}
                />
                <div className="flex justify-between mt-3">
                  <span className="text-xs max-w-[40%]" style={{ color: mutedColor }}>
                    {question.minLabel}
                  </span>
                  <span className="text-2xl font-light" style={{ color: accentColor }}>
                    {sliderValue}
                  </span>
                  <span className="text-xs max-w-[40%] text-right" style={{ color: mutedColor }}>
                    {question.maxLabel}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleSliderSubmit}
                className="w-full py-4 rounded-2xl font-medium text-white"
                style={{ backgroundColor: accentColor }}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}