'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface AssessmentProps {
  onBack: () => void;
  onComplete?: (results: AssessmentResults) => void;
}

interface AssessmentResults {
  activationLevel: number;
  recoveryCapacity: number;
  triggerAwareness: number;
  copingFlexibility: number;
  windowOfTolerance: number;
  stressResponse: string;
  secondaryResponse: string;
  insights: string[];
  recommendations: string[];
  regulationTools: string[];
}

interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: 'scale' | 'choice' | 'slider';
  options?: { value: number; label: string; description?: string }[];
  category: 'activation' | 'recovery' | 'triggers' | 'coping' | 'window';
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

const QUESTIONS: Question[] = [
  // Activation Level (5 questions)
  {
    id: 'activation_1',
    text: 'What is your baseline state most days?',
    subtext: 'Before anything stressful happens',
    type: 'scale',
    options: [
      { value: 1, label: 'Already activated', description: 'Tense, alert, on edge' },
      { value: 2, label: 'Slightly elevated', description: 'A background hum of stress' },
      { value: 3, label: 'Mostly calm', description: 'Generally settled' },
      { value: 4, label: 'Relaxed', description: 'At ease, grounded' },
    ],
    category: 'activation',
  },
  {
    id: 'activation_2',
    text: 'How quickly does your body react to stressful situations?',
    type: 'slider',
    category: 'activation',
    min: 1,
    max: 10,
    minLabel: 'Instant — 0 to 100 immediately',
    maxLabel: 'Gradual — slow to activate',
  },
  {
    id: 'activation_3',
    text: 'When stressed, what happens in your body? (Choose the most prominent)',
    type: 'choice',
    options: [
      { value: 1, label: 'Racing heart, rapid breathing, sweating' },
      { value: 2, label: 'Muscle tension, clenched jaw, tight shoulders' },
      { value: 3, label: 'Stomach issues, nausea, appetite changes' },
      { value: 4, label: 'Fatigue, heaviness, wanting to shut down' },
    ],
    category: 'activation',
  },
  {
    id: 'activation_4',
    text: 'How often do you feel your heart racing or have trouble breathing when not exercising?',
    type: 'scale',
    options: [
      { value: 1, label: 'Daily', description: 'It\'s a regular occurrence' },
      { value: 2, label: 'Several times a week', description: 'Quite often' },
      { value: 3, label: 'Occasionally', description: 'In stressful periods' },
      { value: 4, label: 'Rarely', description: 'Almost never' },
    ],
    category: 'activation',
  },
  {
    id: 'activation_5',
    text: 'Your nervous system right now feels:',
    type: 'choice',
    options: [
      { value: 1, label: 'Wired and exhausted — running on fumes' },
      { value: 2, label: 'On alert — scanning for problems' },
      { value: 3, label: 'Variable — depends on the day' },
      { value: 4, label: 'Settled — generally at ease' },
    ],
    category: 'activation',
  },

  // Recovery Capacity (5 questions)
  {
    id: 'recovery_1',
    text: 'After a stressful event, how long does it take your body to calm down?',
    type: 'scale',
    options: [
      { value: 1, label: 'Hours or days', description: 'I stay activated for a long time' },
      { value: 2, label: 'An hour or more', description: 'Takes significant time' },
      { value: 3, label: '15-30 minutes', description: 'Moderate recovery time' },
      { value: 4, label: 'Minutes', description: 'I settle quickly' },
    ],
    category: 'recovery',
  },
  {
    id: 'recovery_2',
    text: 'How well can you sleep after a stressful day?',
    type: 'slider',
    category: 'recovery',
    min: 1,
    max: 10,
    minLabel: 'Very poorly — mind races',
    maxLabel: 'Well — I can let go',
  },
  {
    id: 'recovery_3',
    text: 'When the stressor is removed, your body:',
    type: 'choice',
    options: [
      { value: 1, label: 'Stays tense — like it\'s waiting for the next threat' },
      { value: 2, label: 'Slowly unwinds — but holds residual tension' },
      { value: 3, label: 'Gradually relaxes — over time' },
      { value: 4, label: 'Releases quickly — returns to baseline' },
    ],
    category: 'recovery',
  },
  {
    id: 'recovery_4',
    text: 'How refreshed do you feel after rest or relaxation activities?',
    type: 'scale',
    options: [
      { value: 1, label: 'Not much different', description: 'Rest doesn\'t seem to help' },
      { value: 2, label: 'Slightly better', description: 'Minor improvement' },
      { value: 3, label: 'Noticeably restored', description: 'Real benefit' },
      { value: 4, label: 'Significantly renewed', description: 'Deep restoration' },
    ],
    category: 'recovery',
  },
  {
    id: 'recovery_5',
    text: 'Your body\'s ability to "complete" stress cycles (fully discharge activation) is:',
    type: 'slider',
    category: 'recovery',
    min: 1,
    max: 10,
    minLabel: 'Poor — stress gets stuck',
    maxLabel: 'Good — I process fully',
  },

  // Trigger Awareness (4 questions)
  {
    id: 'triggers_1',
    text: 'How well do you know your stress triggers?',
    type: 'scale',
    options: [
      { value: 1, label: 'Not well', description: 'Stress seems random' },
      { value: 2, label: 'Somewhat', description: 'I know the obvious ones' },
      { value: 3, label: 'Pretty well', description: 'I can anticipate most' },
      { value: 4, label: 'Very well', description: 'I have a clear map' },
    ],
    category: 'triggers',
  },
  {
    id: 'triggers_2',
    text: 'How early do you notice when stress is building?',
    type: 'slider',
    category: 'triggers',
    min: 1,
    max: 10,
    minLabel: 'Only when overwhelmed',
    maxLabel: 'At the first signs',
  },
  {
    id: 'triggers_3',
    text: 'Are there situations that trigger you more than seems reasonable?',
    subtext: 'Reactions that feel bigger than the situation warrants',
    type: 'scale',
    options: [
      { value: 1, label: 'Frequently', description: 'Many things set me off' },
      { value: 2, label: 'Sometimes', description: 'Certain situations' },
      { value: 3, label: 'Occasionally', description: 'Rare but I notice it' },
      { value: 4, label: 'Rarely', description: 'My reactions match situations' },
    ],
    category: 'triggers',
  },
  {
    id: 'triggers_4',
    text: 'How connected are you to your body\'s stress signals?',
    subtext: 'Noticing physical cues like tension, breathing changes, gut feelings',
    type: 'slider',
    category: 'triggers',
    min: 1,
    max: 10,
    minLabel: 'Disconnected — miss the signs',
    maxLabel: 'Very attuned — feel everything',
  },

  // Coping Flexibility (4 questions)
  {
    id: 'coping_1',
    text: 'How many different strategies do you have for managing stress?',
    type: 'scale',
    options: [
      { value: 1, label: 'Very few', description: 'I mostly just endure' },
      { value: 2, label: 'A couple', description: 'One or two go-tos' },
      { value: 3, label: 'Several', description: 'A decent toolkit' },
      { value: 4, label: 'Many', description: 'A full range of options' },
    ],
    category: 'coping',
  },
  {
    id: 'coping_2',
    text: 'When your usual coping methods don\'t work, you:',
    type: 'choice',
    options: [
      { value: 1, label: 'Feel stuck — don\'t know what else to try' },
      { value: 2, label: 'Push harder — do more of the same' },
      { value: 3, label: 'Eventually try something different' },
      { value: 4, label: 'Adapt flexibly — have backup strategies' },
    ],
    category: 'coping',
  },
  {
    id: 'coping_3',
    text: 'How effective are your current stress management approaches?',
    type: 'slider',
    category: 'coping',
    min: 1,
    max: 10,
    minLabel: 'Not very — I still struggle',
    maxLabel: 'Very — they work well',
  },
  {
    id: 'coping_4',
    text: 'Your coping strategies tend to be:',
    type: 'choice',
    options: [
      { value: 1, label: 'Avoidance-based — distraction, numbing, escaping' },
      { value: 2, label: 'Control-based — overworking, perfectionism, planning' },
      { value: 3, label: 'Mixed — some helpful, some less so' },
      { value: 4, label: 'Regulation-based — presence, processing, body-based' },
    ],
    category: 'coping',
  },

  // Window of Tolerance (5 questions)
  {
    id: 'window_1',
    text: 'How much stress can you handle before feeling overwhelmed?',
    type: 'slider',
    category: 'window',
    min: 1,
    max: 10,
    minLabel: 'Very little — low threshold',
    maxLabel: 'A lot — high capacity',
  },
  {
    id: 'window_2',
    text: 'When you\'re outside your comfort zone, you typically:',
    type: 'choice',
    options: [
      { value: 1, label: 'Panic or shut down quickly' },
      { value: 2, label: 'Get very uncomfortable, struggle to function' },
      { value: 3, label: 'Feel stressed but manage' },
      { value: 4, label: 'Adapt fairly well, stay functional' },
    ],
    category: 'window',
  },
  {
    id: 'window_3',
    text: 'How often do you feel emotionally dysregulated (overwhelmed, numb, or out of control)?',
    type: 'scale',
    options: [
      { value: 1, label: 'Daily', description: 'It\'s my normal state' },
      { value: 2, label: 'Several times a week', description: 'Quite frequently' },
      { value: 3, label: 'Weekly or less', description: 'Occasionally' },
      { value: 4, label: 'Rarely', description: 'I usually stay regulated' },
    ],
    category: 'window',
  },
  {
    id: 'window_4',
    text: 'Your capacity to stay present during difficult conversations or conflict:',
    type: 'slider',
    category: 'window',
    min: 1,
    max: 10,
    minLabel: 'Very low — I check out or explode',
    maxLabel: 'High — I can stay engaged',
  },
  {
    id: 'window_5',
    text: 'Over the past year, your stress tolerance has:',
    type: 'scale',
    options: [
      { value: 1, label: 'Decreased significantly', description: 'I handle less than before' },
      { value: 2, label: 'Decreased somewhat', description: 'Slightly lower capacity' },
      { value: 3, label: 'Stayed about the same', description: 'No major change' },
      { value: 4, label: 'Increased', description: 'I\'ve grown my capacity' },
    ],
    category: 'window',
  },
];

const STRESS_RESPONSES = {
  fight: {
    name: 'The Fighter',
    description: 'Your nervous system responds to stress with activation and action. You meet challenges head-on, sometimes with intensity that can overwhelm yourself or others.',
    signs: ['Irritability under stress', 'Urge to take action', 'Frustration with obstacles', 'Tension and restlessness'],
    shadow: 'May become aggressive, controlling, or burn out from constant pushing',
    tools: ['Physical discharge (exercise, movement)', 'Healthy anger expression', 'Channel energy into productive action', 'Cool-down practices'],
    color: '#C47070',
  },
  flight: {
    name: 'The Flyer',
    description: 'Your nervous system responds to stress with urgency to escape or avoid. You\'re highly attuned to threats and skilled at anticipating problems before they arrive.',
    signs: ['Anxiety and worry', 'Avoidance of conflict', 'Busy-ness and overthinking', 'Difficulty being still'],
    shadow: 'May become anxious, avoidant, or exhaust yourself running from perceived threats',
    tools: ['Grounding practices', 'Anxiety-reducing breathwork', 'Gradual exposure to fears', 'Settling the nervous system'],
    color: '#E8B86D',
  },
  freeze: {
    name: 'The Freezer',
    description: 'Your nervous system responds to stress by shutting down and conserving energy. This ancient survival response protects you by reducing your visibility to threats.',
    signs: ['Numbing out under stress', 'Difficulty taking action', 'Feeling stuck or paralyzed', 'Dissociation or spacing out'],
    shadow: 'May become depressed, disconnected, or unable to engage with life fully',
    tools: ['Gentle activation (tiny movements)', 'Warmth and safety', 'Pendulation between stillness and movement', 'Connection with safe others'],
    color: '#6B9BC3',
  },
  fawn: {
    name: 'The Fawner',
    description: 'Your nervous system responds to stress by appeasing and prioritizing others\' needs. You\'ve learned that safety comes through connection and accommodation.',
    signs: ['People-pleasing under stress', 'Difficulty saying no', 'Hypervigilance to others\' moods', 'Losing yourself in relationships'],
    shadow: 'May lose sense of self, enable harmful dynamics, or exhaust yourself caring for others',
    tools: ['Boundary setting practice', 'Self-connection exercises', 'Learning to tolerate others\' discomfort', 'Validating your own needs'],
    color: '#A78BB3',
  },
  regulated: {
    name: 'The Regulator',
    description: 'Your nervous system has developed good capacity to move through stress responses and return to balance. You experience activation but don\'t get stuck.',
    signs: ['Flexible responses to stress', 'Quick recovery time', 'Awareness of internal states', 'Access to multiple strategies'],
    shadow: 'May still have specific triggers; regulation is a practice, not a destination',
    tools: ['Continue building your toolkit', 'Support others in regulation', 'Maintain practices that keep you balanced', 'Stay curious about growth edges'],
    color: '#7BA05B',
  },
};

export default function StressResponseAssessment({ onBack, onComplete }: AssessmentProps) {
  const { isDark, colors } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showIntro, setShowIntro] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [sliderValue, setSliderValue] = useState(5);

  const bgColor = isDark ? colors.bg.primary : '#FDFBF7';
  const textColor = isDark ? colors.text.primary : '#2D2A24';
  const mutedColor = isDark ? colors.text.muted : '#6B6560';
  const accentColor = isDark ? '#A78B71' : '#8B7355';
  const cardBg = isDark ? colors.bg.secondary : '#FAF7F2';

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
      activation: [] as number[],
      recovery: [] as number[],
      triggers: [] as number[],
      coping: [] as number[],
      window: [] as number[],
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
      activationLevel: normalize(categories.activation),
      recoveryCapacity: normalize(categories.recovery),
      triggerAwareness: normalize(categories.triggers),
      copingFlexibility: normalize(categories.coping),
      windowOfTolerance: normalize(categories.window),
    };

    const { stressResponse, secondaryResponse } = determineStressResponse(scores, allAnswers);
    const insights = generateInsights(scores, stressResponse, allAnswers);
    const recommendations = generateRecommendations(scores, stressResponse);
    const regulationTools = STRESS_RESPONSES[stressResponse as keyof typeof STRESS_RESPONSES]?.tools || [];

    return {
      ...scores,
      stressResponse,
      secondaryResponse,
      insights,
      recommendations,
      regulationTools,
    };
  };

  const determineStressResponse = (scores: Record<string, number>, answers: Record<string, number>) => {
    let stressResponse = 'regulated';
    let secondaryResponse = 'flight';

    const bodyResponse = answers['activation_3'] || 1;
    const copingStyle = answers['coping_4'] || 3;
    const windowSize = scores.windowOfTolerance;
    const activationLevel = scores.activationLevel;

    // Determine primary response based on body response and patterns
    if (bodyResponse === 1 && activationLevel < 50) {
      // Racing heart, rapid breathing = Flight
      stressResponse = 'flight';
    } else if (bodyResponse === 2 && activationLevel < 50) {
      // Muscle tension = Fight
      stressResponse = 'fight';
    } else if (bodyResponse === 4 || (activationLevel < 30 && scores.recoveryCapacity < 40)) {
      // Fatigue, shutdown = Freeze
      stressResponse = 'freeze';
    } else if (copingStyle === 1 && scores.copingFlexibility < 50) {
      // Avoidance-based coping = could be Flight or Freeze
      stressResponse = activationLevel < 40 ? 'freeze' : 'flight';
    } else if (copingStyle === 2) {
      // Control-based = Fight
      stressResponse = 'fight';
    } else if (windowSize > 65 && scores.copingFlexibility > 60 && scores.recoveryCapacity > 60) {
      // Good regulation
      stressResponse = 'regulated';
    }

    // Check for fawn response
    if (copingStyle === 1 && scores.triggerAwareness > 60) {
      // High awareness of others + avoidance might indicate fawn
      stressResponse = 'fawn';
    }

    // Determine secondary
    if (stressResponse === 'fight') secondaryResponse = activationLevel < 50 ? 'flight' : 'freeze';
    else if (stressResponse === 'flight') secondaryResponse = 'freeze';
    else if (stressResponse === 'freeze') secondaryResponse = 'fawn';
    else if (stressResponse === 'fawn') secondaryResponse = 'freeze';
    else secondaryResponse = 'flight';

    return { stressResponse, secondaryResponse };
  };

  const generateInsights = (scores: Record<string, number>, response: string, answers: Record<string, number>): string[] => {
    const insights: string[] = [];

    const responseData = STRESS_RESPONSES[response as keyof typeof STRESS_RESPONSES];
    if (responseData) {
      insights.push(`Your primary stress response is ${responseData.name}. ${responseData.description}`);
    }

    if (scores.activationLevel < 40) {
      insights.push('Your baseline nervous system state is elevated. You may be living with chronic activation that feels "normal" but is actually taxing your system.');
    }

    if (scores.recoveryCapacity < 40) {
      insights.push('Your recovery capacity is compromised. Your nervous system has difficulty completing stress cycles, which means activation accumulates over time.');
    }

    if (scores.windowOfTolerance < 40) {
      insights.push('Your window of tolerance is narrower than ideal. This means you may move into overwhelm or shutdown more easily than you\'d like.');
    }

    if (scores.triggerAwareness > 70) {
      insights.push('You have strong awareness of your triggers and body signals. This self-knowledge is a powerful foundation for regulation.');
    } else if (scores.triggerAwareness < 40) {
      insights.push('Building awareness of your stress triggers and body signals would help you catch activation earlier, when it\'s easier to regulate.');
    }

    if (scores.copingFlexibility < 40) {
      insights.push('Expanding your coping toolkit would give you more options when stress hits. Different situations call for different strategies.');
    }

    return insights.slice(0, 4);
  };

  const generateRecommendations = (scores: Record<string, number>, response: string): string[] => {
    const recs: string[] = [];

    // Response-specific recommendations
    switch (response) {
      case 'fight':
        recs.push('Channel your activation energy through physical exercise, especially activities that feel like "fighting" (boxing, intense workouts, competitive sports).');
        recs.push('Practice the pause — when you notice anger rising, take 3 breaths before responding. The space between trigger and response is where choice lives.');
        break;
      case 'flight':
        recs.push('Ground yourself when anxiety rises: feel your feet, notice 5 things you can see, breathe slowly. These practices tell your nervous system you\'re safe.');
        recs.push('Practice staying present with discomfort in small doses. Your system needs to learn that you can handle stress without running.');
        break;
      case 'freeze':
        recs.push('Start with the smallest possible movements when you notice shutdown — wiggle your fingers, roll your shoulders. Tiny activation can unthaw freeze.');
        recs.push('Seek warmth and connection. Your nervous system froze to survive; it needs safety signals to come back online.');
        break;
      case 'fawn':
        recs.push('Practice noticing your own needs before attending to others. Ask yourself "What do I want?" multiple times daily.');
        recs.push('Start setting small boundaries and tolerate the discomfort of others\' reactions. Your needs matter as much as theirs.');
        break;
      case 'regulated':
        recs.push('Continue your practices — regulation is maintained through consistent effort. Notice what\'s working and do more of it.');
        recs.push('Consider how you might support others in their regulation. Teaching and modeling can deepen your own skills.');
        break;
    }

    // Score-based recommendations
    if (scores.recoveryCapacity < 50) {
      recs.push('Build recovery rituals into your daily life — transition practices between activities, wind-down routines, and completion rituals for stressful tasks.');
    }

    if (scores.windowOfTolerance < 50) {
      recs.push('Work on gradually expanding your window of tolerance through titrated exposure — small challenges followed by successful regulation.');
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
              <path d="M24 8 L24 24 L36 32" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="24" cy="24" r="18" fill="none" stroke={accentColor} strokeWidth="1.5" />
              <circle cx="24" cy="24" r="3" fill={accentColor} opacity="0.6" />
            </svg>
          </div>

          <h1 className="text-3xl font-light mb-3" style={{ color: textColor }}>
            Stress Response
          </h1>
          <p className="text-lg mb-2" style={{ color: accentColor }}>
            Your Body's Patterns
          </p>
          <p className="text-base mb-8 max-w-md" style={{ color: mutedColor }}>
            Understand how your nervous system responds to pressure — and discover the regulation strategies that will work best for you.
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
              <span style={{ color: textColor }}>23 body-based questions</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span style={{ color: textColor }}>Your personalized regulation toolkit</span>
            </div>
          </div>

          <p className="text-sm mb-8 max-w-md" style={{ color: mutedColor }}>
            Your body has wisdom. Answer based on what you actually experience, not what you think you should feel.
          </p>

          <button
            onClick={() => setShowIntro(false)}
            className="px-8 py-4 rounded-2xl font-medium text-white"
            style={{ backgroundColor: accentColor }}
          >
            Begin Assessment
          </button>
        </div>
      </div>
    );
  }

  // REPORT SCREEN
  if (showReport && results) {
    const responseData = STRESS_RESPONSES[results.stressResponse as keyof typeof STRESS_RESPONSES];
    const secondaryData = STRESS_RESPONSES[results.secondaryResponse as keyof typeof STRESS_RESPONSES];

    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: bgColor }}>
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="p-2 rounded-full" style={{ color: mutedColor }}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-sm" style={{ color: mutedColor }}>Your Stress Profile</span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-lg mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-light mb-2" style={{ color: textColor }}>
                Your Stress Response Map
              </h1>
              <p className="text-sm" style={{ color: mutedColor }}>
                Understanding how your body navigates pressure
              </p>
            </div>

            {/* Primary Response */}
            <div 
              className="p-6 rounded-2xl mb-6"
              style={{ 
                backgroundColor: isDark ? `${responseData.color}22` : `${responseData.color}15`,
                borderLeft: `4px solid ${responseData.color}`,
              }}
            >
              <div className="text-sm uppercase tracking-wide mb-1" style={{ color: responseData.color }}>
                Your Primary Response
              </div>
              <h2 className="text-2xl font-medium mb-3" style={{ color: textColor }}>
                {responseData.name}
              </h2>
              <p className="text-base leading-relaxed" style={{ color: mutedColor }}>
                {responseData.description}
              </p>
            </div>

            {/* Response Signs */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <h3 className="text-lg font-medium mb-3" style={{ color: textColor }}>
                Signs of Your Response
              </h3>
              <div className="space-y-2">
                {responseData.signs.map((sign, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: responseData.color }}
                    />
                    <span className="text-sm" style={{ color: mutedColor }}>{sign}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nervous System Scores */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <h3 className="text-lg font-medium mb-4" style={{ color: textColor }}>
                Your Nervous System Profile
              </h3>
              
              {[
                { label: 'Baseline Regulation', value: results.activationLevel, color: '#7BA05B', lowLabel: 'Chronically activated' },
                { label: 'Recovery Capacity', value: results.recoveryCapacity, color: '#6B9BC3', lowLabel: 'Slow to recover' },
                { label: 'Trigger Awareness', value: results.triggerAwareness, color: '#E8B86D', lowLabel: 'Limited awareness' },
                { label: 'Coping Flexibility', value: results.copingFlexibility, color: '#A78BB3', lowLabel: 'Limited strategies' },
                { label: 'Window of Tolerance', value: results.windowOfTolerance, color: '#C4956A', lowLabel: 'Narrow window' },
              ].map((item, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm" style={{ color: textColor }}>{item.label}</span>
                    <span className="text-sm" style={{ color: item.value < 50 ? '#C47070' : item.color }}>
                      {item.value < 40 ? item.lowLabel : item.value < 60 ? 'Developing' : item.value < 75 ? 'Good' : 'Strong'}
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

            {/* Shadow Side */}
            <div 
              className="p-5 rounded-2xl mb-6"
              style={{ 
                backgroundColor: isDark ? 'rgba(196, 112, 112, 0.15)' : 'rgba(196, 112, 112, 0.1)',
              }}
            >
              <h3 className="text-lg font-medium mb-2" style={{ color: textColor }}>
                The Shadow Side
              </h3>
              <p className="text-sm" style={{ color: mutedColor }}>
                {responseData.shadow}
              </p>
            </div>

            {/* Secondary Response */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <div className="text-sm uppercase tracking-wide mb-1" style={{ color: secondaryData.color }}>
                Secondary Response
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: textColor }}>
                {secondaryData.name}
              </h3>
              <p className="text-sm" style={{ color: mutedColor }}>
                When your primary response doesn't work or isn't available, you may shift to this pattern.
              </p>
            </div>

            {/* Regulation Tools */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <h3 className="text-lg font-medium mb-3" style={{ color: textColor }}>
                Your Regulation Toolkit
              </h3>
              <p className="text-xs mb-3" style={{ color: mutedColor }}>
                Tools specifically matched to your stress response pattern
              </p>
              <div className="flex flex-wrap gap-2">
                {results.regulationTools.map((tool, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1.5 rounded-full text-sm"
                    style={{ 
                      backgroundColor: isDark ? `${responseData.color}33` : `${responseData.color}22`,
                      color: responseData.color,
                    }}
                  >
                    {tool}
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
                Your Regulation Path
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
                Your stress response isn't a flaw — it's how your nervous system learned to protect you. Now you can work with it, not against it.
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