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
    title: 'Building Resilience',
    subtitle: 'Lesson 3: Practices That Build Resilience',
  },
  {
    type: 'text',
    title: 'Daily Building Blocks',
    content: 'Resilience isn\'t built in dramatic moments — it\'s cultivated through small, consistent practices woven into daily life. These practices strengthen your nervous system, build inner resources, and create the foundation you\'ll draw on when challenges arise.',
  },
  {
    type: 'visual',
    visual: 'pillars',
    title: 'The Four Pillars of Practice',
    content: 'Research points to four key areas that build resilience: body practices, mind practices, connection practices, and meaning practices. Strength in all four creates robust resilience.',
  },
  {
    type: 'text',
    title: 'Body Practices',
    content: 'Your body is the foundation. Regular movement, adequate sleep, nourishing food, and time in nature all build physical resilience. Even simple practices like deep breathing or a short walk can shift your nervous system toward regulation.',
    highlight: 'The body keeps the score',
  },
  {
    type: 'text',
    title: 'Mind Practices',
    content: 'How we relate to our thoughts matters enormously. Practices like mindfulness, journaling, or simply pausing before reacting help create space between stimulus and response. This space is where resilience lives.',
    highlight: 'Space between stimulus and response',
  },
  {
    type: 'text',
    title: 'Connection Practices',
    content: 'Humans are social creatures. Regular contact with supportive people, acts of kindness, asking for help when needed, and being present for others all strengthen our relational resilience. We regulate together.',
    highlight: 'We heal in relationship',
  },
  {
    type: 'text',
    title: 'Meaning Practices',
    content: 'Connecting with what matters most to you — through reflection, creativity, service, or spiritual practice — builds the kind of resilience that helps you endure difficulty without losing yourself.',
    highlight: 'Purpose carries us through',
  },
  {
    type: 'insight',
    title: 'Consistency Over Intensity',
    content: 'A few minutes of practice every day does more for resilience than an hour once a month. Your nervous system learns through repetition. Small, sustainable practices compound over time into remarkable strength.',
  },
  {
    type: 'text',
    title: 'Micro-Practices',
    content: 'Even the smallest practices count: three deep breaths before a meeting, a moment of gratitude before sleep, really listening to someone for two minutes, stepping outside for fresh air. These micro-moments add up.',
  },
  {
    type: 'text',
    title: 'Building Before You Need It',
    content: 'The best time to build resilience is before you need it. Like saving money before an emergency, developing these practices during calm times means they\'ll be there when storms come. You can\'t build a boat during a flood.',
  },
  {
    type: 'practice',
    title: 'Choose One Practice',
    content: 'Pick one small practice from one of the four pillars that you could realistically do daily. Maybe it\'s five minutes of stretching, one minute of mindful breathing, texting a friend good morning, or writing one sentence of gratitude. Start impossibly small. Consistency is everything.',
  },
  {
    type: 'summary',
    title: 'Key Takeaways',
    points: [
      'Resilience is built through daily practices, not dramatic moments',
      'Four pillars: body, mind, connection, and meaning',
      'Consistency matters more than intensity',
      'Build your practices before you need them',
    ],
  },
];

export default function ResilienceLesson3({ onBack, onComplete }: LessonProps) {
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
    if (visual === 'pillars') {
      return (
        <div className="flex justify-center gap-4 mb-6">
          {[
            { label: 'Body', icon: '◯', color: '#7BA05B' },
            { label: 'Mind', icon: '◇', color: '#6B9BC3' },
            { label: 'Connect', icon: '♡', color: '#C4956A' },
            { label: 'Meaning', icon: '☆', color: '#A78BB3' },
          ].map((pillar, i) => (
            <div key={i} className="flex flex-col items-center">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-2"
                style={{ 
                  backgroundColor: isDark ? `${pillar.color}33` : `${pillar.color}22`,
                  color: pillar.color,
                }}
              >
                {pillar.icon}
              </div>
              <span 
                className="text-xs font-medium"
                style={{ color: mutedColor }}
              >
                {pillar.label}
              </span>
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
            <h1 
              className="text-3xl font-light mb-3"
              style={{ color: textColor }}
            >
              {current.title}
            </h1>
            <p 
              className="text-lg"
              style={{ color: mutedColor }}
            >
              {current.subtitle}
            </p>
          </div>
        );

      case 'visual':
        return (
          <div className="py-8">
            {renderVisual(current.visual!)}
            <h2 
              className="text-xl font-medium mb-4 text-center"
              style={{ color: textColor }}
            >
              {current.title}
            </h2>
            <p 
              className="text-base leading-relaxed text-center"
              style={{ color: mutedColor }}
            >
              {current.content}
            </p>
          </div>
        );

      case 'insight':
        return (
          <div 
            className="py-6 px-5 rounded-2xl"
            style={{ backgroundColor: cardBg }}
          >
            <div 
              className="text-sm uppercase tracking-wide mb-2"
              style={{ color: accentColor }}
            >
              Insight
            </div>
            <h2 
              className="text-xl font-medium mb-3"
              style={{ color: textColor }}
            >
              {current.title}
            </h2>
            <p 
              className="text-base leading-relaxed"
              style={{ color: mutedColor }}
            >
              {current.content}
            </p>
          </div>
        );

      case 'practice':
        return (
          <div 
            className="py-6 px-5 rounded-2xl border-l-4"
            style={{ 
              backgroundColor: cardBg,
              borderColor: accentColor,
            }}
          >
            <div 
              className="text-sm uppercase tracking-wide mb-2"
              style={{ color: accentColor }}
            >
              Practice
            </div>
            <h2 
              className="text-xl font-medium mb-3"
              style={{ color: textColor }}
            >
              {current.title}
            </h2>
            <p 
              className="text-base leading-relaxed"
              style={{ color: mutedColor }}
            >
              {current.content}
            </p>
          </div>
        );

      case 'summary':
        return (
          <div className="py-6">
            <h2 
              className="text-xl font-medium mb-4 text-center"
              style={{ color: textColor }}
            >
              {current.title}
            </h2>
            <ul className="space-y-3">
              {(current as any).points.map((point: string, i: number) => (
                <li 
                  key={i}
                  className="flex items-start gap-3 text-base"
                  style={{ color: mutedColor }}
                >
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
            <h2 
              className="text-xl font-medium mb-4"
              style={{ color: textColor }}
            >
              {current.title}
            </h2>
            <p 
              className="text-base leading-relaxed mb-4"
              style={{ color: mutedColor }}
            >
              {current.content}
            </p>
            {(current as any).highlight && (
              <p 
                className="text-lg italic text-center mt-6"
                style={{ color: accentColor }}
              >
                {(current as any).highlight}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: bgColor }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={onBack}
          className="p-2 rounded-full transition-colors"
          style={{ color: mutedColor }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-sm" style={{ color: mutedColor }}>
          {currentIndex + 1} / {CONTENT.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4">
        <div 
          className="h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
        >
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ 
              width: `${progress}%`,
              backgroundColor: accentColor,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-lg mx-auto">
          {renderContent()}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 flex gap-3">
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="flex-1 py-4 rounded-2xl font-medium transition-colors"
            style={{ 
              backgroundColor: cardBg,
              color: textColor,
            }}
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