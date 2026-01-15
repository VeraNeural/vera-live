'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface AssessmentProps {
  onBack: () => void;
  onComplete?: (results: AssessmentResults) => void;
}

interface AssessmentResults {
  chronotype: number;
  energyStability: number;
  seasonalSensitivity: number;
  rhythmAlignment: number;
  recoveryPattern: number;
  lifeRhythm: string;
  secondaryRhythm: string;
  peakHours: string;
  insights: string[];
  recommendations: string[];
  optimalPractices: string[];
}

interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: 'scale' | 'choice' | 'slider';
  options?: { value: number; label: string; description?: string }[];
  category: 'chronotype' | 'energy' | 'seasonal' | 'alignment' | 'recovery';
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

const QUESTIONS: Question[] = [
  {
    id: 'chronotype_1',
    text: 'If you could structure your day with no obligations, when would you naturally wake up?',
    type: 'choice',
    options: [
      { value: 4, label: 'Before 6am', description: "I'm an early riser" },
      { value: 3, label: '6am - 8am', description: 'Morning person' },
      { value: 2, label: '8am - 10am', description: 'Mid-morning' },
      { value: 1, label: 'After 10am', description: "I'm a night owl" },
    ],
    category: 'chronotype',
  },
  {
    id: 'chronotype_2',
    text: 'When do you feel most mentally sharp and creative?',
    type: 'choice',
    options: [
      { value: 4, label: 'Early morning (5am - 9am)' },
      { value: 3, label: 'Late morning (9am - 12pm)' },
      { value: 2, label: 'Afternoon (12pm - 5pm)' },
      { value: 1, label: 'Evening or night (after 5pm)' },
    ],
    category: 'chronotype',
  },
  {
    id: 'chronotype_3',
    text: 'If you had an important task requiring deep focus, when would you schedule it?',
    type: 'choice',
    options: [
      { value: 4, label: 'First thing in the morning' },
      { value: 3, label: 'Mid-morning' },
      { value: 2, label: 'Early afternoon' },
      { value: 1, label: 'Evening or late night' },
    ],
    category: 'chronotype',
  },
  {
    id: 'chronotype_4',
    text: 'How do you feel about early morning commitments (before 8am)?',
    type: 'scale',
    options: [
      { value: 4, label: 'Love them', description: "I'm at my best early" },
      { value: 3, label: 'Fine with them', description: 'No problem' },
      { value: 2, label: 'Tolerate them', description: "I manage but it's hard" },
      { value: 1, label: 'Dread them', description: 'They wreck my day' },
    ],
    category: 'chronotype',
  },
  {
    id: 'chronotype_5',
    text: 'What time do you naturally start feeling sleepy?',
    type: 'choice',
    options: [
      { value: 4, label: 'Before 9pm' },
      { value: 3, label: '9pm - 10:30pm' },
      { value: 2, label: '10:30pm - midnight' },
      { value: 1, label: 'After midnight' },
    ],
    category: 'chronotype',
  },
  {
    id: 'energy_1',
    text: 'How stable is your energy throughout a typical day?',
    type: 'slider',
    category: 'energy',
    min: 1,
    max: 10,
    minLabel: 'Very variable — peaks and crashes',
    maxLabel: 'Very stable — consistent all day',
  },
  {
    id: 'energy_2',
    text: 'Do you experience a significant afternoon energy dip?',
    type: 'scale',
    options: [
      { value: 1, label: 'Yes, severe', description: 'I can barely function' },
      { value: 2, label: 'Yes, noticeable', description: 'Definitely slowed down' },
      { value: 3, label: 'Mild', description: 'Slight dip but manageable' },
      { value: 4, label: 'Not really', description: 'Pretty steady' },
    ],
    category: 'energy',
  },
  {
    id: 'energy_3',
    text: 'How predictable is your energy from day to day?',
    type: 'slider',
    category: 'energy',
    min: 1,
    max: 10,
    minLabel: "Unpredictable — never know what I'll get",
    maxLabel: 'Very predictable — I know my patterns',
  },
  {
    id: 'energy_4',
    text: 'Your energy is most affected by:',
    type: 'choice',
    options: [
      { value: 1, label: 'Sleep — everything depends on how I slept' },
      { value: 2, label: 'Food — eating patterns strongly affect me' },
      { value: 3, label: 'Activity — movement and rest balance' },
      { value: 4, label: 'Multiple factors in balance' },
    ],
    category: 'energy',
  },
  {
    id: 'seasonal_1',
    text: 'How much do seasonal changes affect your mood and energy?',
    type: 'slider',
    category: 'seasonal',
    min: 1,
    max: 10,
    minLabel: "Not much — I'm consistent year-round",
    maxLabel: 'Significantly — seasons really affect me',
  },
  {
    id: 'seasonal_2',
    text: 'Which season do you feel most alive and energized?',
    type: 'choice',
    options: [
      { value: 1, label: 'Winter', description: 'Cozy, reflective energy' },
      { value: 2, label: 'Spring', description: 'Fresh, renewal energy' },
      { value: 3, label: 'Summer', description: 'Expansive, active energy' },
      { value: 4, label: 'Autumn', description: 'Grounded, harvest energy' },
    ],
    category: 'seasonal',
  },
  {
    id: 'seasonal_3',
    text: 'How does reduced daylight in winter affect you?',
    type: 'scale',
    options: [
      { value: 1, label: 'Strongly', description: 'I struggle significantly' },
      { value: 2, label: 'Noticeably', description: 'Definitely lower energy/mood' },
      { value: 3, label: 'Mildly', description: 'Some effect but manageable' },
      { value: 4, label: 'Minimally', description: "Doesn't really bother me" },
    ],
    category: 'seasonal',
  },
  {
    id: 'seasonal_4',
    text: 'Do you naturally want to do less and rest more in winter?',
    type: 'scale',
    options: [
      { value: 4, label: 'Strongly yes', description: 'I crave hibernation' },
      { value: 3, label: 'Somewhat', description: 'I slow down a bit' },
      { value: 2, label: 'Not really', description: 'Pretty consistent' },
      { value: 1, label: 'Opposite', description: "I'm more active in winter" },
    ],
    category: 'seasonal',
  },
  {
    id: 'alignment_1',
    text: 'How well does your current schedule align with your natural rhythms?',
    type: 'slider',
    category: 'alignment',
    min: 1,
    max: 10,
    minLabel: 'Poorly — constantly fighting my nature',
    maxLabel: 'Well — I live in sync with my rhythms',
  },
  {
    id: 'alignment_2',
    text: "How often do you override your body's signals (pushing through tiredness, ignoring hunger, etc.)?",
    type: 'scale',
    options: [
      { value: 1, label: 'Constantly', description: "It's my default mode" },
      { value: 2, label: 'Often', description: 'More than I should' },
      { value: 3, label: 'Sometimes', description: 'When necessary' },
      { value: 4, label: 'Rarely', description: 'I try to honor my body' },
    ],
    category: 'alignment',
  },
  {
    id: 'alignment_3',
    text: 'Do you have regular daily rhythms (consistent sleep, meals, activities)?',
    type: 'scale',
    options: [
      { value: 1, label: 'Very irregular', description: 'Every day is different' },
      { value: 2, label: 'Somewhat irregular', description: 'Some routine, lots of variation' },
      { value: 3, label: 'Mostly regular', description: 'General patterns with flexibility' },
      { value: 4, label: 'Very regular', description: 'Consistent daily rhythms' },
    ],
    category: 'alignment',
  },
  {
    id: 'alignment_4',
    text: 'How does it feel when your schedule is disrupted (travel, late nights, irregular meals)?',
    type: 'choice',
    options: [
      { value: 4, label: 'Very difficult — takes days to recover' },
      { value: 3, label: 'Challenging — noticeable impact' },
      { value: 2, label: 'Manageable — some adjustment needed' },
      { value: 1, label: "Easy — I'm very adaptable" },
    ],
    category: 'alignment',
  },
  {
    id: 'recovery_1',
    text: 'After an intense period (busy week, travel, emotional stress), how long do you need to recover?',
    type: 'scale',
    options: [
      { value: 1, label: 'Several days to a week', description: 'I need significant recovery' },
      { value: 2, label: 'A day or two', description: 'Moderate recovery time' },
      { value: 3, label: "A good night's sleep", description: 'Quick bounce back' },
      { value: 4, label: 'I recover quickly', description: 'Minimal downtime needed' },
    ],
    category: 'recovery',
  },
  {
    id: 'recovery_2',
    text: 'Your ideal work-rest rhythm is:',
    type: 'choice',
    options: [
      { value: 1, label: 'Intense bursts with long recovery periods' },
      { value: 2, label: 'Moderate effort with regular rest days' },
      { value: 3, label: 'Steady pace with short daily recovery' },
      { value: 4, label: 'Consistent low-intensity with minimal recovery needed' },
    ],
    category: 'recovery',
  },
  {
    id: 'recovery_3',
    text: 'How well do you pace yourself to avoid burnout?',
    type: 'slider',
    category: 'recovery',
    min: 1,
    max: 10,
    minLabel: 'Poorly — I often push to exhaustion',
    maxLabel: 'Well — I maintain sustainable rhythms',
  },
  {
    id: 'recovery_4',
    text: 'Do you tend to:',
    type: 'choice',
    options: [
      { value: 1, label: 'Sprint and crash — go hard then collapse' },
      { value: 2, label: 'Push too long — miss early warning signs' },
      { value: 3, label: 'Pace reasonably — mostly sustainable' },
      { value: 4, label: 'Maintain steadily — consistent energy management' },
    ],
    category: 'recovery',
  },
];

const LIFE_RHYTHMS = {
  earlyBird: {
    name: 'The Early Bird',
    description: "Your energy rises with the sun. Mornings are your magic time — you're sharp, creative, and motivated before most people have had coffee. Honor this gift by protecting your mornings.",
    peakTime: 'Early morning (5am - 10am)',
    bestFor: ['Deep work first thing', 'Exercise in morning', 'Important meetings before noon', 'Early bedtime'],
    challenges: ['Evening social events', 'Late-night demands', 'Night owl partners/colleagues'],
    seasonalNote: 'You may struggle more in winter when mornings are dark. Light therapy can help.',
    color: '#E8B86D',
  },
  nightOwl: {
    name: 'The Night Owl',
    description: "You come alive when the world quiets down. Evening and night are when your mind is sharpest and creativity flows. Society may not understand, but your rhythm is valid.",
    peakTime: 'Evening to night (6pm - 2am)',
    bestFor: ['Creative work at night', 'Flexible schedules', 'Second-shift energy', 'Deep night focus'],
    challenges: ['Early morning requirements', 'Traditional work schedules', 'Morning person partners'],
    seasonalNote: "Summer's long days may feel too bright. Winter's early darkness might suit you better.",
    color: '#6B9BC3',
  },
  balanced: {
    name: 'The Steady Rhythm',
    description: "You have a balanced energy pattern without extreme peaks or valleys. Mid-morning and early afternoon tend to be your best times. You're adaptable but still benefit from routine.",
    peakTime: 'Mid-morning to early afternoon (9am - 2pm)',
    bestFor: ['Standard schedules', 'Consistent daily rhythms', 'Moderate flexibility', 'Balanced productivity'],
    challenges: ['May lack extreme peak energy', 'Need to protect against gradual depletion'],
    seasonalNote: 'You likely adapt to seasonal changes better than most, but still benefit from light and nature.',
    color: '#7BA05B',
  },
  waveRider: {
    name: 'The Wave Rider',
    description: "Your energy comes in waves — high intensity periods followed by necessary recovery. This isn't a flaw; it's your rhythm. Working with these waves, not against them, is key.",
    peakTime: 'Variable — ride the waves when they come',
    bestFor: ['Project-based work', 'Intense creative bursts', 'Flexible deadlines', 'Built-in recovery periods'],
    challenges: ['Steady-state demands', 'Unpredictable scheduling', 'Others not understanding your rhythm'],
    seasonalNote: 'Your waves may align with seasons — bigger energy in summer, more rest needed in winter.',
    color: '#A78BB3',
  },
  seasonalShifter: {
    name: 'The Seasonal Shifter',
    description: "You're deeply connected to natural cycles. Your energy, mood, and needs shift significantly with the seasons. This ancient rhythm connects you to the earth but requires honoring.",
    peakTime: 'Varies by season — summer expansion, winter contraction',
    bestFor: ['Seasonal planning', 'Aligning work with energy cycles', 'Nature connection', 'Flexible annual rhythms'],
    challenges: ['Year-round consistent demands', 'Indoor/artificial environments', 'Ignoring seasonal needs'],
    seasonalNote: 'You need to plan your year around seasons. Big projects in high-energy seasons, rest and reflection in low.',
    color: '#C4956A',
  },
};

export default function LifeRhythmAssessment({ onBack, onComplete }: AssessmentProps) {
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
      chronotype: [] as number[],
      energy: [] as number[],
      seasonal: [] as number[],
      alignment: [] as number[],
      recovery: [] as number[],
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

  const determineLifeRhythm = (scores: Record<string, number>) => {
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

  const generateInsights = (scores: Record<string, number>, rhythm: string): string[] => {
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

  const generateRecommendations = (scores: Record<string, number>, rhythm: string): string[] => {
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
              <circle cx="24" cy="24" r="16" fill="none" stroke={accentColor} strokeWidth="1.5" />
              <circle cx="24" cy="24" r="3" fill={accentColor} />
              <path d="M24 11 L24 8" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M24 40 L24 37" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M11 24 L8 24" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M40 24 L37 24" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M24 24 L32 16" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="text-3xl font-light mb-3" style={{ color: textColor }}>
            Life Rhythm
          </h1>
          <p className="text-lg mb-2" style={{ color: accentColor }}>
            Energy & Natural Cycles
          </p>
          <p className="text-base mb-8 max-w-md" style={{ color: mutedColor }}>
            Discover your natural energy patterns — when you peak, how you flow with seasons, and how to design your life
            around your unique rhythm.
          </p>

          <div className="w-full max-w-sm p-5 rounded-2xl mb-8" style={{ backgroundColor: cardBg }}>
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span style={{ color: textColor }}>About 10 minutes</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span style={{ color: textColor }}>21 rhythm questions</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span style={{ color: textColor }}>Your personalized rhythm map</span>
            </div>
          </div>

          <p className="text-sm mb-8 max-w-md" style={{ color: mutedColor }}>
            Think about your natural preferences — not what your schedule demands, but what your body actually wants.
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

  if (showReport && results) {
    const rhythmData = LIFE_RHYTHMS[results.lifeRhythm as keyof typeof LIFE_RHYTHMS];
    const secondaryData = LIFE_RHYTHMS[results.secondaryRhythm as keyof typeof LIFE_RHYTHMS];

    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: bgColor }}>
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="p-2 rounded-full" style={{ color: mutedColor }}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-sm" style={{ color: mutedColor }}>
            Your Rhythm Profile
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-light mb-2" style={{ color: textColor }}>
                Your Life Rhythm
              </h1>
              <p className="text-sm" style={{ color: mutedColor }}>
                Your natural energy patterns and cycles
              </p>
            </div>

            <div
              className="p-6 rounded-2xl mb-6"
              style={{
                backgroundColor: isDark ? `${rhythmData.color}22` : `${rhythmData.color}15`,
                borderLeft: `4px solid ${rhythmData.color}`,
              }}
            >
              <div className="text-sm uppercase tracking-wide mb-1" style={{ color: rhythmData.color }}>
                Your Life Rhythm
              </div>
              <h2 className="text-2xl font-medium mb-3" style={{ color: textColor }}>
                {rhythmData.name}
              </h2>
              <p className="text-base leading-relaxed" style={{ color: mutedColor }}>
                {rhythmData.description}
              </p>
            </div>

            <div
              className="p-5 rounded-2xl mb-6 text-center"
              style={{ backgroundColor: isDark ? `${rhythmData.color}15` : `${rhythmData.color}10` }}
            >
              <div className="text-sm uppercase tracking-wide mb-1" style={{ color: rhythmData.color }}>
                Your Peak Energy Time
              </div>
              <div className="text-xl font-medium" style={{ color: textColor }}>
                {results.peakHours}
              </div>
            </div>

            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <h3 className="text-lg font-medium mb-4" style={{ color: textColor }}>
                Your Energy Profile
              </h3>

              {[
                { label: 'Chronotype', value: results.chronotype, color: '#E8B86D', lowLabel: 'Night Owl', highLabel: 'Early Bird' },
                { label: 'Energy Stability', value: results.energyStability, color: '#7BA05B', lowLabel: 'Variable', highLabel: 'Stable' },
                { label: 'Seasonal Sensitivity', value: results.seasonalSensitivity, color: '#C4956A', lowLabel: 'Low', highLabel: 'High' },
                { label: 'Rhythm Alignment', value: results.rhythmAlignment, color: '#6B9BC3', lowLabel: 'Misaligned', highLabel: 'Aligned' },
                { label: 'Recovery Capacity', value: results.recoveryPattern, color: '#A78BB3', lowLabel: 'Needs more', highLabel: 'Quick' },
              ].map((item, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm" style={{ color: textColor }}>
                      {item.label}
                    </span>
                    <span className="text-xs" style={{ color: mutedColor }}>
                      {item.value < 40 ? item.lowLabel : item.value > 70 ? item.highLabel : 'Moderate'}
                    </span>
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

            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <h3 className="text-lg font-medium mb-3" style={{ color: textColor }}>
                Optimal For You
              </h3>
              <div className="flex flex-wrap gap-2">
                {results.optimalPractices.map((practice, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-sm"
                    style={{
                      backgroundColor: isDark ? `${rhythmData.color}33` : `${rhythmData.color}22`,
                      color: rhythmData.color,
                    }}
                  >
                    {practice}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <h3 className="text-lg font-medium mb-3" style={{ color: textColor }}>
                Watch Out For
              </h3>
              <div className="space-y-2">
                {rhythmData.challenges.map((challenge, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: mutedColor }} />
                    <span className="text-sm" style={{ color: mutedColor }}>
                      {challenge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="p-5 rounded-2xl mb-6"
              style={{ backgroundColor: isDark ? 'rgba(196, 149, 106, 0.15)' : 'rgba(196, 149, 106, 0.1)' }}
            >
              <h3 className="text-lg font-medium mb-2" style={{ color: textColor }}>
                Seasonal Note
              </h3>
              <p className="text-sm" style={{ color: mutedColor }}>
                {rhythmData.seasonalNote}
              </p>
            </div>

            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <div className="text-sm uppercase tracking-wide mb-1" style={{ color: secondaryData.color }}>
                Secondary Rhythm
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: textColor }}>
                {secondaryData.name}
              </h3>
              <p className="text-sm" style={{ color: mutedColor }}>
                This rhythm also influences your energy patterns, especially during certain seasons or life phases.
              </p>
            </div>

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
                      <span className="text-xs" style={{ color: accentColor }}>
                        {i + 1}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: mutedColor }}>
                      {insight}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <h3 className="text-lg font-medium mb-4" style={{ color: textColor }}>
                Living In Rhythm
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

            <div className="text-center py-6">
              <p className="text-sm mb-6" style={{ color: mutedColor }}>
                Your rhythm is not a limitation — it's wisdom. Living in alignment with your natural cycles is one of the
                most powerful things you can do for your wellbeing.
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