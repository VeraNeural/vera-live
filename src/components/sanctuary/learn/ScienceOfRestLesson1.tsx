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
    subtitle: 'Lesson 1: Why Rest Matters',
  },
  {
    type: 'text',
    title: 'Not a Luxury — A Necessity',
    content: 'In our productivity-obsessed culture, rest is often seen as laziness or wasted time. But science tells a different story: rest isn\'t the opposite of productivity — it\'s the foundation of it. Without adequate rest, everything else suffers.',
  },
  {
    type: 'text',
    title: 'What Happens When We Rest',
    content: 'Rest isn\'t just the absence of activity. It\'s an active process where your body repairs tissues, consolidates memories, processes emotions, and restores depleted resources. It\'s when some of your most important biological work happens.',
  },
  {
    type: 'visual',
    visual: 'restoration',
    title: 'Rest Restores',
    content: 'During rest, your body and mind undergo essential restoration processes that can\'t happen when you\'re active.',
  },
  {
    type: 'text',
    title: 'Physical Restoration',
    content: 'During rest, your body repairs muscle tissue, releases growth hormones, strengthens your immune system, and regulates metabolism. Athletes know this — gains happen during recovery, not during the workout itself.',
    highlight: 'The body rebuilds during rest',
  },
  {
    type: 'text',
    title: 'Mental Restoration',
    content: 'Your brain uses rest periods to consolidate learning, process information, and clear metabolic waste. Sleep deprivation impairs memory, decision-making, and creativity. Your mind needs downtime to function well.',
    highlight: 'The mind processes during rest',
  },
  {
    type: 'text',
    title: 'Emotional Restoration',
    content: 'Rest helps regulate emotions and process experiences. Without it, emotional reactivity increases and resilience decreases. Ever noticed how everything feels harder when you\'re exhausted? That\'s not weakness — it\'s biology.',
    highlight: 'Emotions stabilize during rest',
  },
  {
    type: 'insight',
    title: 'The Cost of Rest Deprivation',
    content: 'Chronic rest deprivation is linked to anxiety, depression, weakened immunity, weight gain, cardiovascular disease, and cognitive decline. It\'s not just that you feel tired — your entire system is compromised. Rest is healthcare.',
  },
  {
    type: 'text',
    title: 'Rest Is Active',
    content: 'Scrolling your phone isn\'t rest. Neither is worrying about tomorrow while lying in bed. True rest requires disengaging from stimulation and stress. It\'s an active practice of allowing your system to restore.',
  },
  {
    type: 'text',
    title: 'Permission to Rest',
    content: 'Many of us carry guilt around resting. We feel we should always be doing more. But resting isn\'t selfish — it\'s sustainable. You can\'t pour from an empty cup. Rest is how you refill.',
  },
  {
    type: 'practice',
    title: 'Rest Audit',
    content: 'Honestly assess your rest: How many hours of sleep do you get? Do you take breaks during the day? When did you last have a truly restful day? Notice any resistance to these questions — that\'s information too.',
  },
  {
    type: 'summary',
    title: 'Key Takeaways',
    points: [
      'Rest is essential biology, not optional luxury',
      'Physical, mental, and emotional restoration happen during rest',
      'Chronic rest deprivation has serious health consequences',
      'True rest is an active practice of allowing restoration',
    ],
  },
];

export default function ScienceOfRestLesson1({ onBack, onComplete }: LessonProps) {
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
    if (visual === 'restoration') {
      return (
        <div className="flex justify-center gap-6 mb-6">
          {[
            { label: 'Body', icon: '◯', desc: 'Repairs & rebuilds' },
            { label: 'Mind', icon: '◇', desc: 'Processes & clears' },
            { label: 'Heart', icon: '♡', desc: 'Stabilizes & heals' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2 mx-auto"
                style={{ backgroundColor: isDark ? `${accentColor}33` : `${accentColor}22` }}
              >
                <span style={{ color: accentColor }}>{item.icon}</span>
              </div>
              <div className="text-sm font-medium mb-1" style={{ color: textColor }}>
                {item.label}
              </div>
              <div className="text-xs" style={{ color: mutedColor }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
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