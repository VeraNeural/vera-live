'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { AssessmentProps, AssessmentResults, Question } from './shared/types';

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
    text: 'How much does physical tension affect your daily life?',
    subtext: 'Shoulders, jaw, back',
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
    text: 'How often does your mind feel "full" or overwhelmed?',
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
    text: 'How difficult is it for you to "switch off" from responsibilities?',
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
    text: 'How much of your day involves managing others\' emotions?',
    type: 'slider',
    category: 'emotional',
    min: 1,
    max: 10,
    minLabel: 'Almost all of it',
    maxLabel: 'Very little',
  },
  {
    id: 'emotional_2',
    text: 'How often can you be completely yourself, without performing?',
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
    text: 'Do you have spaces where you can truly let your guard down?',
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
    text: 'How overwhelmed do you feel by sensory input?',
    subtext: 'Noise, screens, lights, crowds',
    type: 'slider',
    category: 'sensory',
    min: 1,
    max: 10,
    minLabel: 'Very overwhelmed',
    maxLabel: 'Rarely bothered',
  },
  {
    id: 'sensory_2',
    text: 'How much of your day involves screens?',
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
    text: 'How often do you intentionally reduce sensory input?',
    subtext: 'Silence, darkness, nature',
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
    text: 'How much time do you spend with things that inspire you?',
    subtext: 'Nature, art, music, ideas',
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

// ============================================================================
// STYLES
// ============================================================================
const STYLES = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  .assess-option {
    transition: all 0.2s ease;
  }
  .assess-option:hover {
    transform: translateY(-2px);
  }
  .assess-option:active {
    transform: scale(0.98);
  }

  .assess-scroll::-webkit-scrollbar {
    width: 4px;
  }
  .assess-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .assess-scroll::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
  }

  .progress-bar {
    transition: width 0.4s ease;
  }

  .slider-input {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    border-radius: 3px;
    outline: none;
  }
  .slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
  .slider-input::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
`;

export default function RestRestorationAssessment({ onBack, onComplete }: AssessmentProps) {
  const { isDark, colors } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<'intro' | 'questions' | 'report'>('intro');
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [sliderValue, setSliderValue] = useState(5);

  const bgColor = colors.bg;
  const textColor = colors.text;
  const mutedColor = colors.textMuted;
  const accentColor = colors.accent;
  const cardBg = colors.cardBg;
  const cardBorder = colors.cardBorder;

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSliderValue(5);
      }, 250);
    } else {
      const calculated = calculateResults(newAnswers);
      setResults(calculated);
      setPhase('report');
      onComplete?.(calculated);
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

  const determineRestStyle = (scores: Record<string, number>, ans: Record<string, number>) => {
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

  const generateInsights = (scores: Record<string, number>, style: string): string[] => {
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

  const generateRecommendations = (scores: Record<string, number>): string[] => {
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

  // ============================================================================
  // INTRO SCREEN
  // ============================================================================
  if (phase === 'intro') {
    return (
      <>
        <style>{STYLES}</style>
        <div style={{
          position: 'fixed',
          inset: 0,
          background: bgColor,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <header style={{
            padding: '16px',
            paddingTop: 'max(16px, env(safe-area-inset-top))',
            display: 'flex',
            alignItems: 'center',
          }}>
            <button
              onClick={onBack}
              style={{
                padding: '10px 18px',
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 50,
                cursor: 'pointer',
                fontSize: 14,
                color: mutedColor,
              }}
            >
              ← Back
            </button>
          </header>

          {/* Content */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
            animation: 'fadeIn 0.5s ease',
          }}>
            {/* Icon */}
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${accentColor}22 0%, ${accentColor}11 100%)`,
              border: `1px solid ${accentColor}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}>
              <svg viewBox="0 0 48 48" style={{ width: 40, height: 40 }}>
                <path 
                  d="M24 8 C16 8 10 14 10 22 C10 30 16 38 24 42 C32 38 38 30 38 22 C38 14 32 8 24 8" 
                  fill="none" 
                  stroke={accentColor} 
                  strokeWidth="1.5" 
                />
                <circle cx="24" cy="22" r="6" fill={accentColor} opacity="0.5" />
                <path d="M24 28 L24 36" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 32,
              fontWeight: 300,
              color: textColor,
              marginBottom: 8,
            }}>
              Rest & Restoration
            </h1>

            <p style={{
              fontSize: 16,
              color: accentColor,
              marginBottom: 16,
            }}>
              How You Recharge
            </p>

            <p style={{
              fontSize: 15,
              color: mutedColor,
              maxWidth: 320,
              lineHeight: 1.6,
              marginBottom: 32,
            }}>
              Discover your unique restoration needs and the practices that will most effectively replenish your energy.
            </p>

            {/* Info Cards */}
            <div style={{
              display: 'flex',
              gap: 12,
              marginBottom: 40,
            }}>
              <div style={{
                padding: '12px 20px',
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 12,
              }}>
                <div style={{ fontSize: 13, color: mutedColor }}>Duration</div>
                <div style={{ fontSize: 15, color: textColor, fontWeight: 500 }}>~12 min</div>
              </div>
              <div style={{
                padding: '12px 20px',
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 12,
              }}>
                <div style={{ fontSize: 13, color: mutedColor }}>Questions</div>
                <div style={{ fontSize: 15, color: textColor, fontWeight: 500 }}>{QUESTIONS.length}</div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => setPhase('questions')}
              style={{
                padding: '16px 48px',
                background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
                border: 'none',
                borderRadius: 50,
                color: '#fff',
                fontSize: 16,
                fontWeight: 500,
                cursor: 'pointer',
                boxShadow: `0 4px 20px ${accentColor}44`,
              }}
            >
              Begin Discovery
            </button>
          </div>
        </div>
      </>
    );
  }

  // ============================================================================
  // QUESTIONS SCREEN
  // ============================================================================
  if (phase === 'questions') {
    return (
      <>
        <style>{STYLES}</style>
        <div style={{
          position: 'fixed',
          inset: 0,
          background: bgColor,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <header style={{
            padding: '16px',
            paddingTop: 'max(16px, env(safe-area-inset-top))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <button
              onClick={onBack}
              style={{
                padding: '8px 14px',
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 50,
                cursor: 'pointer',
                fontSize: 13,
                color: mutedColor,
              }}
            >
              ✕
            </button>
            <span style={{ fontSize: 13, color: mutedColor }}>
              {currentQuestion + 1} of {QUESTIONS.length}
            </span>
            <div style={{ width: 50 }} />
          </header>

          {/* Progress Bar */}
          <div style={{ padding: '0 20px', marginBottom: 24 }}>
            <div style={{
              height: 4,
              background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              <div
                className="progress-bar"
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: accentColor,
                  borderRadius: 4,
                }}
              />
            </div>
          </div>

          {/* Question */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '0 24px',
            animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{
                fontSize: 22,
                fontWeight: 500,
                color: textColor,
                lineHeight: 1.4,
                marginBottom: question.subtext ? 8 : 0,
              }}>
                {question.text}
              </h2>
              {question.subtext && (
                <p style={{ fontSize: 14, color: mutedColor }}>
                  {question.subtext}
                </p>
              )}
            </div>

            {/* Scale/Choice Options */}
            {(question.type === 'scale' || question.type === 'choice') && question.options && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {question.options.map((option, i) => (
                  <button
                    key={i}
                    className="assess-option"
                    onClick={() => handleAnswer(option.value)}
                    style={{
                      padding: '18px 20px',
                      background: cardBg,
                      border: `1px solid ${cardBorder}`,
                      borderRadius: 16,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: textColor,
                      marginBottom: option.description ? 4 : 0,
                    }}>
                      {option.label}
                    </div>
                    {option.description && (
                      <div style={{ fontSize: 13, color: mutedColor }}>
                        {option.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Slider */}
            {question.type === 'slider' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ padding: '0 8px' }}>
                  <input
                    type="range"
                    min={question.min || 1}
                    max={question.max || 10}
                    value={sliderValue}
                    onChange={(e) => setSliderValue(parseInt(e.target.value))}
                    className="slider-input"
                    style={{
                      width: '100%',
                      background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${((sliderValue - 1) / 9) * 100}%, ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'} ${((sliderValue - 1) / 9) * 100}%, ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'} 100%)`,
                      cursor: 'pointer',
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginTop: 16,
                  }}>
                    <span style={{ fontSize: 12, color: mutedColor, maxWidth: '35%' }}>
                      {question.minLabel}
                    </span>
                    <span style={{
                      fontSize: 32,
                      fontWeight: 300,
                      color: accentColor,
                      lineHeight: 1,
                    }}>
                      {sliderValue}
                    </span>
                    <span style={{ fontSize: 12, color: mutedColor, maxWidth: '35%', textAlign: 'right' }}>
                      {question.maxLabel}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSliderSubmit}
                  style={{
                    padding: '16px',
                    background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
                    border: 'none',
                    borderRadius: 50,
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // ============================================================================
  // REPORT SCREEN
  // ============================================================================
  if (phase === 'report' && results) {
    const primary = REST_STYLES[results.restStyle as keyof typeof REST_STYLES];
    const secondary = REST_STYLES[results.secondaryStyle as keyof typeof REST_STYLES];

    return (
      <>
        <style>{STYLES}</style>
        <div style={{
          position: 'fixed',
          inset: 0,
          background: bgColor,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <header style={{
            padding: '16px',
            paddingTop: 'max(16px, env(safe-area-inset-top))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <button
              onClick={onBack}
              style={{
                padding: '10px 18px',
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 50,
                cursor: 'pointer',
                fontSize: 14,
                color: mutedColor,
              }}
            >
              ← Back
            </button>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: mutedColor,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Your Results
            </span>
            <div style={{ width: 80 }} />
          </header>

          {/* Scrollable Content */}
          <div
            className="assess-scroll"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px',
              paddingBottom: 'max(40px, env(safe-area-inset-bottom))',
            }}
          >
            <div style={{ maxWidth: 500, margin: '0 auto' }}>
              {/* Primary Rest Style Card */}
              <div style={{
                padding: 24,
                background: `linear-gradient(135deg, ${primary.color}15 0%, ${primary.color}08 100%)`,
                border: `1px solid ${primary.color}33`,
                borderRadius: 20,
                marginBottom: 20,
                animation: 'fadeInScale 0.5s ease',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 16,
                }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: `${primary.color}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg viewBox="0 0 32 32" style={{ width: 28, height: 28 }}>
                      <circle cx="16" cy="16" r="12" fill="none" stroke={primary.color} strokeWidth="1.5" />
                      <circle cx="16" cy="16" r="5" fill={primary.color} opacity="0.5" />
                      <path d="M16 4 L16 8 M16 24 L16 28 M4 16 L8 16 M24 16 L28 16" stroke={primary.color} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: primary.color, marginBottom: 2 }}>
                      Your Rest Style
                    </div>
                    <div style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 26,
                      fontWeight: 400,
                      color: textColor,
                    }}>
                      {primary.name}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 15, color: mutedColor, lineHeight: 1.6 }}>
                  {primary.description}
                </p>
              </div>

              {/* Signs */}
              <div style={{
                padding: 20,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 16,
                marginBottom: 16,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 12 }}>
                  Signs of Your Style
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {primary.signs.map((sign, i) => (
                    <span key={i} style={{
                      padding: '8px 14px',
                      background: `${primary.color}15`,
                      border: `1px solid ${primary.color}25`,
                      borderRadius: 20,
                      fontSize: 13,
                      color: textColor,
                    }}>
                      {sign}
                    </span>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div style={{
                padding: 20,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 16,
                marginBottom: 16,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 12 }}>
                  Your Strengths
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {primary.strengths.map((s, i) => (
                    <span key={i} style={{
                      padding: '8px 14px',
                      background: '#7BA05B15',
                      border: '1px solid #7BA05B25',
                      borderRadius: 20,
                      fontSize: 13,
                      color: textColor,
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rest Levels */}
              <div style={{
                padding: 20,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 16,
                marginBottom: 16,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 16 }}>
                  Your Rest Levels
                </h3>
                <p style={{ fontSize: 12, color: mutedColor, marginBottom: 16 }}>
                  Lower scores indicate greater need for this type of rest
                </p>
                {[
                  { label: 'Physical Rest', value: results.physicalRest as number, color: '#C4956A' },
                  { label: 'Mental Rest', value: results.mentalRest as number, color: '#6B9BC3' },
                  { label: 'Emotional Rest', value: results.emotionalRest as number, color: '#C47070' },
                  { label: 'Social Rest', value: results.socialRest as number, color: '#7BA05B' },
                  { label: 'Sensory Rest', value: results.sensoryRest as number, color: '#A78BB3' },
                  { label: 'Creative Rest', value: results.creativeRest as number, color: '#E8B86D' },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: i < 5 ? 16 : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 14, color: textColor }}>{item.label}</span>
                      <span style={{ fontSize: 14, color: item.value < 50 ? '#C47070' : item.color }}>
                        {item.value < 40 ? 'Depleted' : item.value < 60 ? 'Low' : item.value < 75 ? 'Moderate' : 'Good'}
                      </span>
                    </div>
                    <div style={{
                      height: 6,
                      background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${item.value}%`,
                        background: item.value < 50 ? '#C47070' : item.color,
                        borderRadius: 3,
                        transition: 'width 1s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Insights */}
              <div style={{
                padding: 20,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 16,
                marginBottom: 16,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 16 }}>
                  Key Insights
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {results.insights.map((insight, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12 }}>
                      <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: `${accentColor}22`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                      }}>
                        <span style={{ fontSize: 12, color: accentColor }}>{i + 1}</span>
                      </div>
                      <p style={{ fontSize: 14, color: mutedColor, lineHeight: 1.6 }}>
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div style={{
                padding: 20,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 16,
                marginBottom: 16,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 16 }}>
                  Your Rest Prescription
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {results.recommendations.map((rec, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12 }}>
                      <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: `${primary.color}22`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                      }}>
                        <span style={{ fontSize: 14, color: primary.color }}>→</span>
                      </div>
                      <p style={{ fontSize: 14, color: mutedColor, lineHeight: 1.6 }}>
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ideal Practices */}
              <div style={{
                padding: 20,
                background: `linear-gradient(135deg, ${primary.color}10 0%, transparent 100%)`,
                border: `1px solid ${primary.color}25`,
                borderRadius: 16,
                marginBottom: 16,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 12 }}>
                  Your Ideal Practices
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(results.idealPractices as string[]).map((practice, i) => (
                    <span key={i} style={{
                      padding: '10px 16px',
                      background: `${primary.color}20`,
                      border: `1px solid ${primary.color}30`,
                      borderRadius: 20,
                      fontSize: 14,
                      color: textColor,
                    }}>
                      {practice}
                    </span>
                  ))}
                </div>
              </div>

              {/* Secondary Style */}
              <div style={{
                padding: 20,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 16,
                marginBottom: 24,
              }}>
                <div style={{ fontSize: 12, color: secondary.color, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Secondary Style
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 500, color: textColor, marginBottom: 8 }}>
                  {secondary.name}
                </h3>
                <p style={{ fontSize: 14, color: mutedColor, lineHeight: 1.6 }}>
                  This style also resonates with you. Mix these practices in for variety.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={onBack}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
                  border: 'none',
                  borderRadius: 50,
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Return to Library
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}