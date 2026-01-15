'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface AssessmentProps {
  onBack: () => void;
  onComplete?: (results: AssessmentResults) => void;
}

interface AssessmentResults {
  emotionalAwareness: number;
  emotionalExpression: number;
  emotionalRegulation: number;
  emotionalDepth: number;
  emotionalResilience: number;
  dominantPattern: string;
  secondaryPattern: string;
  insights: string[];
  recommendations: string[];
}

interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: 'scale' | 'choice' | 'slider';
  options?: { value: number; label: string; description?: string }[];
  category: 'awareness' | 'expression' | 'regulation' | 'depth' | 'resilience';
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

const QUESTIONS: Question[] = [
  // Emotional Awareness (5 questions)
  {
    id: 'awareness_1',
    text: 'When you wake up, how often do you notice your emotional state?',
    subtext: 'Before checking your phone or starting your day',
    type: 'scale',
    options: [
      { value: 1, label: 'Rarely', description: 'I usually just start my day' },
      { value: 2, label: 'Sometimes', description: 'When feelings are strong' },
      { value: 3, label: 'Often', description: 'I usually check in' },
      { value: 4, label: 'Almost always', description: 'It\'s part of my routine' },
    ],
    category: 'awareness',
  },
  {
    id: 'awareness_2',
    text: 'How easily can you name what you\'re feeling in any given moment?',
    type: 'slider',
    category: 'awareness',
    min: 1,
    max: 10,
    minLabel: 'I struggle to find words',
    maxLabel: 'I can pinpoint it precisely',
  },
  {
    id: 'awareness_3',
    text: 'When your mood shifts, how quickly do you notice?',
    type: 'scale',
    options: [
      { value: 1, label: 'Much later', description: 'Often only in hindsight' },
      { value: 2, label: 'After a while', description: 'Once it\'s quite strong' },
      { value: 3, label: 'Fairly quickly', description: 'Within minutes' },
      { value: 4, label: 'Almost immediately', description: 'As it\'s happening' },
    ],
    category: 'awareness',
  },
  {
    id: 'awareness_4',
    text: 'How well do you understand the connection between your emotions and physical sensations?',
    subtext: 'For example: anxiety and stomach tension, sadness and heaviness',
    type: 'slider',
    category: 'awareness',
    min: 1,
    max: 10,
    minLabel: 'I rarely notice connections',
    maxLabel: 'I feel them clearly',
  },
  {
    id: 'awareness_5',
    text: 'When someone asks "How are you feeling?", your typical inner response is:',
    type: 'choice',
    options: [
      { value: 1, label: 'Blank — I\'m not sure what I feel' },
      { value: 2, label: 'Generic — "fine" or "okay" covers it' },
      { value: 3, label: 'General sense — I know the broad category' },
      { value: 4, label: 'Specific — I can describe nuanced feelings' },
    ],
    category: 'awareness',
  },

  // Emotional Expression (5 questions)
  {
    id: 'expression_1',
    text: 'How comfortable are you expressing vulnerable emotions to someone you trust?',
    subtext: 'Emotions like fear, sadness, or insecurity',
    type: 'slider',
    category: 'expression',
    min: 1,
    max: 10,
    minLabel: 'Very uncomfortable',
    maxLabel: 'Completely comfortable',
  },
  {
    id: 'expression_2',
    text: 'When you\'re upset, you tend to:',
    type: 'choice',
    options: [
      { value: 1, label: 'Keep it inside — no one would know' },
      { value: 2, label: 'Show small signs — if people pay attention' },
      { value: 3, label: 'Share selectively — with certain people' },
      { value: 4, label: 'Express openly — I don\'t hide my feelings' },
    ],
    category: 'expression',
  },
  {
    id: 'expression_3',
    text: 'How often do you cry when you feel moved or sad?',
    type: 'scale',
    options: [
      { value: 1, label: 'Almost never', description: 'Even when I want to' },
      { value: 2, label: 'Rarely', description: 'Only in extreme situations' },
      { value: 3, label: 'Sometimes', description: 'When feelings are strong' },
      { value: 4, label: 'Freely', description: 'Whenever I need to' },
    ],
    category: 'expression',
  },
  {
    id: 'expression_4',
    text: 'When you feel joy or excitement, how do you typically show it?',
    type: 'choice',
    options: [
      { value: 1, label: 'Internally — I feel it but don\'t show it' },
      { value: 2, label: 'Subtly — a small smile or quiet pleasure' },
      { value: 3, label: 'Moderately — people can tell I\'m happy' },
      { value: 4, label: 'Expressively — I light up visibly' },
    ],
    category: 'expression',
  },
  {
    id: 'expression_5',
    text: 'How do you feel after expressing difficult emotions to someone?',
    type: 'scale',
    options: [
      { value: 1, label: 'Regretful', description: 'I wish I hadn\'t shared' },
      { value: 2, label: 'Vulnerable', description: 'Exposed and uncertain' },
      { value: 3, label: 'Relieved', description: 'Lighter, even if uncomfortable' },
      { value: 4, label: 'Connected', description: 'Closer and more understood' },
    ],
    category: 'expression',
  },

  // Emotional Regulation (5 questions)
  {
    id: 'regulation_1',
    text: 'When intense emotions arise, how well can you stay present without being overwhelmed?',
    type: 'slider',
    category: 'regulation',
    min: 1,
    max: 10,
    minLabel: 'I get swept away',
    maxLabel: 'I can hold steady',
  },
  {
    id: 'regulation_2',
    text: 'How long does it typically take you to recover from a strong emotional experience?',
    type: 'scale',
    options: [
      { value: 1, label: 'Days or longer', description: 'It lingers heavily' },
      { value: 2, label: 'A day or so', description: 'I need significant time' },
      { value: 3, label: 'Several hours', description: 'I process fairly quickly' },
      { value: 4, label: 'An hour or less', description: 'I recover rapidly' },
    ],
    category: 'regulation',
  },
  {
    id: 'regulation_3',
    text: 'Do you have reliable ways to calm yourself when distressed?',
    type: 'choice',
    options: [
      { value: 1, label: 'Not really — I just wait it out' },
      { value: 2, label: 'A few things — but they don\'t always work' },
      { value: 3, label: 'Several strategies — most work well' },
      { value: 4, label: 'A full toolkit — I know what I need' },
    ],
    category: 'regulation',
  },
  {
    id: 'regulation_4',
    text: 'How often do your emotions lead you to say or do things you later regret?',
    type: 'scale',
    options: [
      { value: 4, label: 'Rarely', description: 'I stay in control' },
      { value: 3, label: 'Sometimes', description: 'Occasionally I react' },
      { value: 2, label: 'Often', description: 'More than I\'d like' },
      { value: 1, label: 'Frequently', description: 'It\'s a pattern' },
    ],
    category: 'regulation',
  },
  {
    id: 'regulation_5',
    text: 'When facing a stressful situation, your emotional response typically:',
    type: 'choice',
    options: [
      { value: 1, label: 'Escalates quickly and stays high' },
      { value: 2, label: 'Spikes but slowly comes down' },
      { value: 3, label: 'Rises moderately and settles' },
      { value: 4, label: 'Stays relatively stable throughout' },
    ],
    category: 'regulation',
  },

  // Emotional Depth (5 questions)
  {
    id: 'depth_1',
    text: 'How often do you experience complex, layered emotions?',
    subtext: 'For example: feeling happy and sad simultaneously, or grateful yet grieving',
    type: 'scale',
    options: [
      { value: 1, label: 'Rarely', description: 'My emotions are usually simple' },
      { value: 2, label: 'Sometimes', description: 'In significant moments' },
      { value: 3, label: 'Often', description: 'I notice layers frequently' },
      { value: 4, label: 'Regularly', description: 'Most emotions have depth' },
    ],
    category: 'depth',
  },
  {
    id: 'depth_2',
    text: 'How deeply do you allow yourself to feel positive emotions like joy, love, or awe?',
    type: 'slider',
    category: 'depth',
    min: 1,
    max: 10,
    minLabel: 'I keep them contained',
    maxLabel: 'I let them fill me completely',
  },
  {
    id: 'depth_3',
    text: 'When you encounter beauty — in nature, art, music, or human connection — you:',
    type: 'choice',
    options: [
      { value: 1, label: 'Notice it intellectually but don\'t feel much' },
      { value: 2, label: 'Feel a mild pleasant response' },
      { value: 3, label: 'Feel genuinely moved' },
      { value: 4, label: 'Can be brought to tears or profound feeling' },
    ],
    category: 'depth',
  },
  {
    id: 'depth_4',
    text: 'How connected do you feel to the emotional experiences of others?',
    subtext: 'Their joys, sorrows, fears, and hopes',
    type: 'slider',
    category: 'depth',
    min: 1,
    max: 10,
    minLabel: 'Somewhat distant',
    maxLabel: 'Deeply connected',
  },
  {
    id: 'depth_5',
    text: 'Your emotional life feels:',
    type: 'choice',
    options: [
      { value: 1, label: 'Flat — not much variation or intensity' },
      { value: 2, label: 'Moderate — some ups and downs' },
      { value: 3, label: 'Rich — a full range of experiences' },
      { value: 4, label: 'Vivid — deeply felt and colorful' },
    ],
    category: 'depth',
  },

  // Emotional Resilience (5 questions)
  {
    id: 'resilience_1',
    text: 'After a significant disappointment or loss, you typically:',
    type: 'choice',
    options: [
      { value: 1, label: 'Struggle for a long time to move forward' },
      { value: 2, label: 'Eventually adapt, but it takes significant effort' },
      { value: 3, label: 'Process it and gradually find your footing' },
      { value: 4, label: 'Feel the pain fully, then integrate and grow' },
    ],
    category: 'resilience',
  },
  {
    id: 'resilience_2',
    text: 'How much do difficult emotions interfere with your daily functioning?',
    type: 'slider',
    category: 'resilience',
    min: 1,
    max: 10,
    minLabel: 'They often derail me',
    maxLabel: 'I function well even when struggling',
  },
  {
    id: 'resilience_3',
    text: 'When facing emotional pain, you tend to:',
    type: 'choice',
    options: [
      { value: 1, label: 'Avoid it as much as possible' },
      { value: 2, label: 'Acknowledge it reluctantly' },
      { value: 3, label: 'Face it when necessary' },
      { value: 4, label: 'Welcome it as part of being fully alive' },
    ],
    category: 'resilience',
  },
  {
    id: 'resilience_4',
    text: 'How confident are you in your ability to handle whatever emotions arise?',
    type: 'slider',
    category: 'resilience',
    min: 1,
    max: 10,
    minLabel: 'Not confident',
    maxLabel: 'Very confident',
  },
  {
    id: 'resilience_5',
    text: 'Looking back on difficult emotional experiences in your life:',
    type: 'scale',
    options: [
      { value: 1, label: 'They still weigh heavily on me' },
      { value: 2, label: 'I\'ve survived but carry scars' },
      { value: 3, label: 'I\'ve healed and learned from them' },
      { value: 4, label: 'They\'ve become sources of wisdom and strength' },
    ],
    category: 'resilience',
  },
];

const PATTERNS = {
  guardian: {
    name: 'The Guardian',
    description: 'You approach emotions with careful protection, keeping vulnerable feelings safely contained while maintaining stability for yourself and others.',
    strengths: ['Emotional stability', 'Reliability under pressure', 'Protecting others'],
    growthAreas: ['Allowing vulnerability', 'Expressing needs', 'Receiving support'],
    color: '#6B9BC3',
  },
  feeler: {
    name: 'The Deep Feeler',
    description: 'You experience emotions with remarkable depth and richness, feeling life\'s joys and sorrows with full intensity.',
    strengths: ['Emotional depth', 'Empathy', 'Authentic connection', 'Appreciating beauty'],
    growthAreas: ['Boundaries', 'Not absorbing others\' emotions', 'Self-protection'],
    color: '#A78BB3',
  },
  processor: {
    name: 'The Processor',
    description: 'You engage with emotions thoughtfully and analytically, seeking to understand and make meaning from your inner experiences.',
    strengths: ['Self-reflection', 'Emotional insight', 'Learning from experience'],
    growthAreas: ['Spontaneous expression', 'Feeling without analyzing', 'Being in the moment'],
    color: '#7BA05B',
  },
  expresser: {
    name: 'The Expresser',
    description: 'You live your emotional life out loud, sharing your inner world freely and inviting others into authentic connection.',
    strengths: ['Authentic expression', 'Emotional honesty', 'Creating intimacy'],
    growthAreas: ['Selective sharing', 'Containing when needed', 'Reading the room'],
    color: '#E8B86D',
  },
  navigator: {
    name: 'The Navigator',
    description: 'You move through emotional experiences with skill and awareness, neither avoiding nor being overwhelmed by what you feel.',
    strengths: ['Emotional intelligence', 'Balanced responding', 'Adaptive capacity'],
    growthAreas: ['Continued growth', 'Helping others navigate', 'Deeper exploration'],
    color: '#C4956A',
  },
};

export default function InnerLandscapeAssessment({ onBack, onComplete }: AssessmentProps) {
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
      // Calculate results
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
      awareness: [] as number[],
      expression: [] as number[],
      regulation: [] as number[],
      depth: [] as number[],
      resilience: [] as number[],
    };

    // Group answers by category
    QUESTIONS.forEach((q) => {
      if (allAnswers[q.id]) {
        categories[q.category].push(allAnswers[q.id]);
      }
    });

    // Calculate averages (normalized to 0-100)
    const normalize = (arr: number[]) => {
      if (arr.length === 0) return 50;
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
      // Questions are scored 1-4 or 1-10, normalize to 0-100
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

    // Determine dominant pattern
    const { dominantPattern, secondaryPattern } = determinePatterns(scores);

    // Generate insights
    const insights = generateInsights(scores, dominantPattern);

    // Generate recommendations
    const recommendations = generateRecommendations(scores, dominantPattern);

    return {
      ...scores,
      dominantPattern,
      secondaryPattern,
      insights,
      recommendations,
    };
  };

  const determinePatterns = (scores: Record<string, number>) => {
    let dominant = 'navigator';
    let secondary = 'processor';

    const { emotionalAwareness, emotionalExpression, emotionalRegulation, emotionalDepth, emotionalResilience } = scores;

    // Guardian: High regulation, lower expression
    if (emotionalRegulation > 70 && emotionalExpression < 50) {
      dominant = 'guardian';
    }
    // Deep Feeler: High depth, high awareness
    else if (emotionalDepth > 70 && emotionalAwareness > 60) {
      dominant = 'feeler';
    }
    // Expresser: High expression
    else if (emotionalExpression > 70) {
      dominant = 'expresser';
    }
    // Processor: High awareness, moderate others
    else if (emotionalAwareness > 70 && emotionalExpression < 60) {
      dominant = 'processor';
    }
    // Navigator: Balanced high scores
    else if (Object.values(scores).every((s) => s > 55)) {
      dominant = 'navigator';
    }

    // Determine secondary
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    if (dominant === 'guardian' && emotionalDepth > 50) secondary = 'feeler';
    else if (dominant === 'feeler' && emotionalRegulation > 50) secondary = 'navigator';
    else if (dominant === 'expresser' && emotionalAwareness > 60) secondary = 'processor';
    else if (dominant === 'processor' && emotionalDepth > 60) secondary = 'feeler';
    else secondary = dominant === 'navigator' ? 'processor' : 'navigator';

    return { dominantPattern: dominant, secondaryPattern: secondary };
  };

  const generateInsights = (scores: Record<string, number>, pattern: string): string[] => {
    const insights: string[] = [];

    if (scores.emotionalAwareness > 70) {
      insights.push('You possess a refined ability to notice and name your emotional states — a foundation for all emotional intelligence.');
    } else if (scores.emotionalAwareness < 40) {
      insights.push('Your emotional awareness is an area ripe for development. Building this skill will unlock deeper self-understanding.');
    }

    if (scores.emotionalDepth > 70) {
      insights.push('You experience life with remarkable emotional richness. This depth allows for profound connection and appreciation of beauty.');
    }

    if (scores.emotionalRegulation > 70) {
      insights.push('You have strong capacity to navigate intense emotions without being overwhelmed — a powerful resource for life\'s challenges.');
    } else if (scores.emotionalRegulation < 40) {
      insights.push('Building your emotional regulation toolkit could help you feel more stable and confident when strong feelings arise.');
    }

    if (scores.emotionalExpression < 40 && scores.emotionalDepth > 50) {
      insights.push('You feel deeply but express selectively. While this protects you, it may also limit the intimacy available in your relationships.');
    }

    if (scores.emotionalResilience > 70) {
      insights.push('You\'ve developed remarkable resilience — the ability to experience pain fully while continuing to grow and move forward.');
    }

    // Add pattern-specific insight
    const patternData = PATTERNS[pattern as keyof typeof PATTERNS];
    if (patternData) {
      insights.push(`As ${patternData.name}, ${patternData.description.toLowerCase()}`);
    }

    return insights.slice(0, 4);
  };

  const generateRecommendations = (scores: Record<string, number>, pattern: string): string[] => {
    const recs: string[] = [];

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

    // Pattern-specific recommendations
    const patternData = PATTERNS[pattern as keyof typeof PATTERNS];
    if (patternData && patternData.growthAreas.length > 0) {
      recs.push(`Focus on ${patternData.growthAreas[0].toLowerCase()} as your next growth edge.`);
    }

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
              <circle cx="24" cy="24" r="18" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.5" />
              <circle cx="24" cy="24" r="12" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.7" />
              <circle cx="24" cy="24" r="6" fill={accentColor} opacity="0.9" />
            </svg>
          </div>

          <h1 className="text-3xl font-light mb-3" style={{ color: textColor }}>
            Inner Landscape
          </h1>
          <p className="text-lg mb-2" style={{ color: accentColor }}>
            Emotional Patterns Assessment
          </p>
          <p className="text-base mb-8 max-w-md" style={{ color: mutedColor }}>
            A gentle exploration of your emotional world — how you experience, express, and navigate your inner life.
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
              <span style={{ color: textColor }}>About 15 minutes</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span style={{ color: textColor }}>25 thoughtful questions</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span style={{ color: textColor }}>Personalized insights report</span>
            </div>
          </div>

          <p className="text-sm mb-8 max-w-md" style={{ color: mutedColor }}>
            Answer honestly — there are no right or wrong responses. This is simply a mirror for self-understanding.
          </p>

          <button
            onClick={() => setShowIntro(false)}
            className="px-8 py-4 rounded-2xl font-medium text-white"
            style={{ backgroundColor: accentColor }}
          >
            Begin Exploration
          </button>
        </div>
      </div>
    );
  }

  // REPORT SCREEN
  if (showReport && results) {
    const dominantPatternData = PATTERNS[results.dominantPattern as keyof typeof PATTERNS];
    const secondaryPatternData = PATTERNS[results.secondaryPattern as keyof typeof PATTERNS];

    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: bgColor }}>
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="p-2 rounded-full" style={{ color: mutedColor }}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-sm" style={{ color: mutedColor }}>Your Results</span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-lg mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-light mb-2" style={{ color: textColor }}>
                Your Inner Landscape
              </h1>
              <p className="text-sm" style={{ color: mutedColor }}>
                A portrait of your emotional world
              </p>
            </div>

            {/* Primary Pattern */}
            <div 
              className="p-6 rounded-2xl mb-6"
              style={{ 
                backgroundColor: isDark ? `${dominantPatternData.color}22` : `${dominantPatternData.color}15`,
                borderLeft: `4px solid ${dominantPatternData.color}`,
              }}
            >
              <div className="text-sm uppercase tracking-wide mb-1" style={{ color: dominantPatternData.color }}>
                Your Primary Pattern
              </div>
              <h2 className="text-2xl font-medium mb-3" style={{ color: textColor }}>
                {dominantPatternData.name}
              </h2>
              <p className="text-base leading-relaxed" style={{ color: mutedColor }}>
                {dominantPatternData.description}
              </p>
            </div>

            {/* Score Visualization */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <h3 className="text-lg font-medium mb-4" style={{ color: textColor }}>
                Your Emotional Profile
              </h3>
              
              {[
                { label: 'Awareness', value: results.emotionalAwareness, color: '#6B9BC3' },
                { label: 'Expression', value: results.emotionalExpression, color: '#E8B86D' },
                { label: 'Regulation', value: results.emotionalRegulation, color: '#7BA05B' },
                { label: 'Depth', value: results.emotionalDepth, color: '#A78BB3' },
                { label: 'Resilience', value: results.emotionalResilience, color: '#C4956A' },
              ].map((item, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm" style={{ color: textColor }}>{item.label}</span>
                    <span className="text-sm font-medium" style={{ color: item.color }}>{item.value}%</span>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Secondary Pattern */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <div className="text-sm uppercase tracking-wide mb-1" style={{ color: secondaryPatternData.color }}>
                Secondary Influence
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: textColor }}>
                {secondaryPatternData.name}
              </h3>
              <p className="text-sm" style={{ color: mutedColor }}>
                This pattern also shapes how you experience your emotional world, adding nuance to your primary style.
              </p>
            </div>

            {/* Strengths */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <h3 className="text-lg font-medium mb-3" style={{ color: textColor }}>
                Your Emotional Strengths
              </h3>
              <div className="flex flex-wrap gap-2">
                {dominantPatternData.strengths.map((strength, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1.5 rounded-full text-sm"
                    style={{ 
                      backgroundColor: isDark ? `${dominantPatternData.color}33` : `${dominantPatternData.color}22`,
                      color: dominantPatternData.color,
                    }}
                  >
                    {strength}
                  </span>
                ))}
              </div>
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
                Pathways for Growth
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
                This is a snapshot, not a permanent portrait. Your inner landscape is always evolving.
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
      {/* Header */}
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

      {/* Progress bar */}
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

      {/* Question */}
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

          {/* Scale or Choice Options */}
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

          {/* Slider */}
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
                  <span 
                    className="text-2xl font-light"
                    style={{ color: accentColor }}
                  >
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