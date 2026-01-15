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
    subtitle: 'Lesson 4: Creating a Rest Practice',
  },
  {
    type: 'text',
    title: 'From Knowledge to Practice',
    content: 'Understanding the science of rest is one thing. Actually resting is another. In a world that glorifies busyness, rest often requires intention, planning, and even courage. It\'s time to make rest a real practice in your life.',
  },
  {
    type: 'text',
    title: 'Rest Requires Protection',
    content: 'Rest won\'t just happen on its own. Work expands to fill available time. Demands are endless. You have to actively protect time for rest — schedule it, defend it, and treat it as non-negotiable.',
  },
  {
    type: 'visual',
    visual: 'rhythm',
    title: 'Build Rest Into Your Rhythm',
    content: 'Rest works best when it\'s woven into the natural rhythms of your day, week, and year — not just saved for emergencies.',
  },
  {
    type: 'text',
    title: 'Daily Rest',
    content: 'Build small pockets of rest into each day: morning quiet before the rush begins, short breaks during work, a wind-down ritual before bed. These micro-rests prevent accumulation of exhaustion.',
    highlight: 'Small pockets, big impact',
  },
  {
    type: 'text',
    title: 'Weekly Rest',
    content: 'Protect at least part of one day each week for deeper rest — a real Sabbath, whatever that means for you. A day with fewer obligations, more space, more restoration. This rhythm has ancient wisdom behind it.',
    highlight: 'One day for deeper restoration',
  },
  {
    type: 'text',
    title: 'Seasonal Rest',
    content: 'Plan for longer periods of rest throughout the year — vacations, retreats, or extended breaks. These allow for deeper restoration that can\'t happen in a single day. They\'re investments, not indulgences.',
    highlight: 'Longer periods for deep renewal',
  },
  {
    type: 'text',
    title: 'Sleep Hygiene Basics',
    content: 'Prioritize sleep: keep a consistent schedule, create a dark quiet room, avoid screens before bed, limit caffeine after noon, develop a wind-down routine. Small changes in sleep habits can transform your rest.',
  },
  {
    type: 'insight',
    title: 'Rest Is Countercultural',
    content: 'In a culture addicted to productivity, choosing rest is a radical act. You may face resistance — from others and from yourself. Remember: you are not a machine. Rest is not a bug in the system; it\'s a feature of being human.',
  },
  {
    type: 'text',
    title: 'Start Where You Are',
    content: 'Don\'t try to overhaul everything at once. Pick one area — maybe improving sleep, maybe adding a daily rest break, maybe protecting weekly downtime. Small, sustainable changes compound over time.',
  },
  {
    type: 'text',
    title: 'Notice the Resistance',
    content: 'Pay attention to what arises when you try to rest: guilt, anxiety, boredom, restlessness. These feelings are information about your relationship with rest. Be curious about them. They often soften with practice.',
  },
  {
    type: 'practice',
    title: 'Your Rest Commitment',
    content: 'Choose one concrete rest practice to implement this week. Make it specific: "I will take a 10-minute break at 2pm daily" or "I will be in bed by 10:30pm." Write it down. Tell someone. Start small and build from there.',
  },
  {
    type: 'summary',
    title: 'Key Takeaways',
    points: [
      'Rest requires intention and protection',
      'Build rest into daily, weekly, and seasonal rhythms',
      'Start small with one sustainable change',
      'Rest is countercultural — and essential',
    ],
  },
];

export default function ScienceOfRestLesson4({ onBack, onComplete }: LessonProps) {
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
    if (visual === 'rhythm') {
      return (
        <div className="flex justify-center items-end gap-6 mb-6">
          {[
            { label: 'Daily', height: 40, desc: 'Micro-rests' },
            { label: 'Weekly', height: 60, desc: 'Sabbath' },
            { label: 'Seasonal', height: 80, desc: 'Deep renewal' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div 
                className="w-16 rounded-t-lg mb-2"
                style={{ 
                  height: item.height,
                  backgroundColor: isDark ? `${accentColor}44` : `${accentColor}33`,
                }}
              />
              <div className="text-sm font-medium" style={{ color: textColor }}>
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