'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface LessonProps {
  onBack: () => void;
  onComplete?: () => void;
}

const CONTENT = [
  {
    type: 'title',
    title: 'The Science of Rest',
    subtitle: 'Lesson 2: The Sleep Foundation',
  },
  {
    type: 'text',
    title: 'The Foundation of All Rest',
    content: 'Sleep is the most important form of rest. It\'s when your body and brain do their deepest restoration work. No amount of meditation, vacation, or relaxation can substitute for adequate sleep. It\'s truly foundational.',
  },
  {
    type: 'text',
    title: 'What Happens During Sleep',
    content: 'Sleep isn\'t just "shutting down." Your brain cycles through distinct stages, each with different functions. Some stages consolidate memories, others repair the body, and some process emotions and clear waste from your brain.',
  },
  {
    type: 'visual',
    visual: 'cycles',
    title: 'Sleep Cycles',
    content: 'Each night, you cycle through different sleep stages multiple times. A complete cycle takes about 90 minutes.',
  },
  {
    type: 'text',
    title: 'Light Sleep',
    content: 'Sleep begins with light stages where you can be easily awakened. Your body starts to relax, heart rate slows, and body temperature drops. This is the transition into deeper restoration.',
    highlight: 'Stage 1 & 2: Transition',
  },
  {
    type: 'text',
    title: 'Deep Sleep',
    content: 'Deep sleep (slow-wave sleep) is when your body does most of its physical repair — tissue growth, muscle recovery, immune strengthening. It\'s hardest to wake from and most restorative. Getting enough is crucial.',
    highlight: 'Stage 3: Physical restoration',
  },
  {
    type: 'text',
    title: 'REM Sleep',
    content: 'REM (Rapid Eye Movement) sleep is when most dreaming occurs. Your brain is highly active, processing emotions, consolidating memories, and making creative connections. It\'s essential for mental and emotional health.',
    highlight: 'REM: Mental & emotional processing',
  },
  {
    type: 'text',
    title: 'How Much Sleep?',
    content: 'Most adults need 7-9 hours of sleep. Not just time in bed — actual sleep. Some people genuinely need more or less, but very few truly thrive on less than 7 hours. Be honest about what you need.',
  },
  {
    type: 'insight',
    title: 'You Can\'t "Catch Up"',
    content: 'Sleep debt is real, but you can\'t fully "catch up" on weekends. Chronic sleep deprivation causes cumulative damage that extra sleep doesn\'t completely repair. Consistent, adequate sleep is the goal.',
  },
  {
    type: 'text',
    title: 'Quality Matters Too',
    content: 'Eight hours of fragmented, light sleep isn\'t the same as eight hours of quality sleep with proper cycling through all stages. Both duration and quality matter for feeling truly rested.',
  },
  {
    type: 'practice',
    title: 'Sleep Assessment',
    content: 'For the next week, track: What time do you go to bed? What time do you actually fall asleep? What time do you wake? How do you feel upon waking? This baseline awareness is the first step to better sleep.',
  },
  {
    type: 'summary',
    title: 'Key Takeaways',
    points: [
      'Sleep is the foundation — nothing substitutes for it',
      'Sleep cycles through stages, each with different functions',
      'Most adults need 7-9 hours of quality sleep',
      'Both duration and quality matter for restoration',
    ],
  },
];

export default function ScienceOfRestLesson2({ onBack, onComplete }: LessonProps) {
  const { isDark, colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const current = CONTENT[currentIndex];
  const progress = ((currentIndex + 1) / CONTENT.length) * 100;
  const isLastSlide = currentIndex === CONTENT.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onComplete?.();
      onBack();
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    }
  };

  const bgColor = colors.bg;
  const textColor = colors.text;
  const mutedColor = colors.textMuted;
  const accentColor = colors.accent;
  const cardBg = colors.cardBg;

  const renderVisual = (visual: string) => {
    if (visual === 'cycles') {
      return (
        <svg viewBox="0 0 240 100" className="w-full max-w-sm mx-auto mb-6">
          {/* Background */}
          <rect x="20" y="10" width="200" height="70" rx="8" fill={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'} />
          
          {/* Sleep stage labels */}
          <text x="10" y="25" fontSize="7" fill={mutedColor} textAnchor="end">Awake</text>
          <text x="10" y="40" fontSize="7" fill={mutedColor} textAnchor="end">Light</text>
          <text x="10" y="55" fontSize="7" fill={mutedColor} textAnchor="end">Deep</text>
          <text x="10" y="70" fontSize="7" fill={mutedColor} textAnchor="end">REM</text>
          
          {/* Sleep cycle wave */}
          <path 
            d="M25 20 L35 35 L50 55 L65 35 L75 65 L85 35 L100 55 L115 35 L125 65 L140 35 L155 55 L170 35 L180 65 L195 35 L210 20" 
            fill="none" 
            stroke={accentColor} 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Cycle markers */}
          <text x="60" y="90" fontSize="7" fill={mutedColor} textAnchor="middle">Cycle 1</text>
          <text x="120" y="90" fontSize="7" fill={mutedColor} textAnchor="middle">Cycle 2</text>
          <text x="180" y="90" fontSize="7" fill={mutedColor} textAnchor="middle">Cycle 3</text>
        </svg>
      );
    }
    return null;
  };

  const renderContent = () => {
    switch (current.type) {
      case 'title':
        return (
          <div className="text-center py-12">
            <h1 className="text-3xl font-light mb-3" style={{ color: textColor }}>
              {current.title}
            </h1>
            <p className="text-lg" style={{ color: mutedColor }}>
              {current.subtitle}
            </p>
          </div>
        );

      case 'visual':
        return (
          <div className="py-8">
            {renderVisual(current.visual!)}
            <h2 className="text-xl font-medium mb-4 text-center" style={{ color: textColor }}>
              {current.title}
            </h2>
            <p className="text-base leading-relaxed text-center" style={{ color: mutedColor }}>
              {current.content}
            </p>
          </div>
        );

      case 'insight':
        return (
          <div className="py-6 px-5 rounded-2xl" style={{ backgroundColor: cardBg }}>
            <div className="text-sm uppercase tracking-wide mb-2" style={{ color: accentColor }}>
              Insight
            </div>
            <h2 className="text-xl font-medium mb-3" style={{ color: textColor }}>
              {current.title}
            </h2>
            <p className="text-base leading-relaxed" style={{ color: mutedColor }}>
              {current.content}
            </p>
          </div>
        );

      case 'practice':
        return (
          <div 
            className="py-6 px-5 rounded-2xl border-l-4"
            style={{ backgroundColor: cardBg, borderColor: accentColor }}
          >
            <div className="text-sm uppercase tracking-wide mb-2" style={{ color: accentColor }}>
              Practice
            </div>
            <h2 className="text-xl font-medium mb-3" style={{ color: textColor }}>
              {current.title}
            </h2>
            <p className="text-base leading-relaxed" style={{ color: mutedColor }}>
              {current.content}
            </p>
          </div>
        );

      case 'summary':
        return (
          <div className="py-6">
            <h2 className="text-xl font-medium mb-4 text-center" style={{ color: textColor }}>
              {current.title}
            </h2>
            <ul className="space-y-3">
              {(current as any).points.map((point: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-base" style={{ color: mutedColor }}>
                  <span 
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: accentColor }}
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        );

      default:
        return (
          <div className="py-6">
            <h2 className="text-xl font-medium mb-4" style={{ color: textColor }}>
              {current.title}
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: mutedColor }}>
              {current.content}
            </p>
            {(current as any).highlight && (
              <p className="text-lg italic text-center mt-6" style={{ color: accentColor }}>
                {(current as any).highlight}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: bgColor }}>
      <div className="flex items-center justify-between p-4">
        <button onClick={onBack} className="p-2 rounded-full transition-colors" style={{ color: mutedColor }}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-sm" style={{ color: mutedColor }}>
          {currentIndex + 1} / {CONTENT.length}
        </div>
      </div>

      <div className="px-4">
        <div 
          className="h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
        >
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: accentColor }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-lg mx-auto">
          {renderContent()}
        </div>
      </div>

      <div className="p-4 flex gap-3">
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="flex-1 py-4 rounded-2xl font-medium transition-colors"
            style={{ backgroundColor: cardBg, color: textColor }}
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          className="flex-1 py-4 rounded-2xl font-medium transition-colors text-white"
          style={{ backgroundColor: accentColor }}
        >
          {isLastSlide ? 'Complete' : 'Continue'}
        </button>
      </div>
    </div>
  );
}