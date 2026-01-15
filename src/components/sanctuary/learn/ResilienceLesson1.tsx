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
    subtitle: 'Lesson 1: What Is Resilience?',
  },
  {
    type: 'text',
    title: 'More Than Bouncing Back',
    content: 'Resilience is often described as the ability to "bounce back" from adversity. But that definition misses something important. True resilience isn\'t about returning to who you were before — it\'s about integrating difficult experiences and continuing to grow.',
  },
  {
    type: 'text',
    title: 'A Living Quality',
    content: 'Resilience isn\'t a fixed trait you either have or don\'t. It\'s a dynamic quality that can be developed, strengthened, and nurtured throughout your life. Like a muscle, it grows stronger with use — and like a garden, it needs tending.',
  },
  {
    type: 'visual',
    visual: 'tree',
    title: 'The Resilient Tree',
    content: 'Think of a tree that bends in strong winds rather than breaking. Its flexibility comes from deep roots, a strong trunk, and branches that can move. Resilience works the same way — it\'s built on multiple interconnected strengths.',
  },
  {
    type: 'text',
    title: 'The Three Pillars',
    content: 'Research shows resilience rests on three main pillars: connection (relationships that support us), competence (skills and abilities we can rely on), and meaning (a sense of purpose that carries us through difficulty).',
  },
  {
    type: 'text',
    title: 'Connection',
    content: 'Humans are wired for connection. Having even one person who truly sees and supports you can make an enormous difference in how you weather life\'s storms. Resilience is rarely a solo journey.',
    highlight: '"We need each other"',
  },
  {
    type: 'text',
    title: 'Competence',
    content: 'Knowing you have skills and abilities you can count on builds confidence. This doesn\'t mean being perfect — it means trusting that you can figure things out, ask for help, and take meaningful action.',
  },
  {
    type: 'text',
    title: 'Meaning',
    content: 'When we understand why something matters, we can endure almost any how. Purpose doesn\'t have to be grand — it can be as simple as being present for your children, creating something beautiful, or helping others.',
  },
  {
    type: 'insight',
    title: 'Resilience Is Not Numbing',
    content: 'Being resilient doesn\'t mean not feeling pain. It doesn\'t mean pushing through without stopping, or pretending everything is fine. True resilience includes allowing yourself to feel, to grieve, to rest. It\'s about moving through difficulty, not around it.',
  },
  {
    type: 'practice',
    title: 'Your Resilience Inventory',
    content: 'Take a moment to consider: Who are the people in your life who truly support you? What skills or abilities do you trust in yourself? What gives your life meaning, even in small ways? These are the foundations of your resilience.',
  },
  {
    type: 'summary',
    title: 'Key Takeaways',
    points: [
      'Resilience is about growth, not just recovery',
      'It can be developed and strengthened over time',
      'Three pillars: connection, competence, and meaning',
      'True resilience includes feeling, not numbing',
    ],
  },
];

export default function ResilienceLesson1({ onBack, onComplete }: LessonProps) {
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
    if (visual === 'tree') {
      return (
        <svg viewBox="0 0 200 200" className="w-32 h-32 mx-auto mb-4">
          <defs>
            <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B7355" />
              <stop offset="100%" stopColor="#6B5344" />
            </linearGradient>
            <linearGradient id="leavesGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7BA05B" />
              <stop offset="100%" stopColor="#5B8B3B" />
            </linearGradient>
          </defs>
          {/* Roots */}
          <path d="M85 170 Q70 180 60 190" stroke="#6B5344" strokeWidth="4" fill="none" opacity="0.6" />
          <path d="M100 175 Q100 185 100 195" stroke="#6B5344" strokeWidth="4" fill="none" opacity="0.6" />
          <path d="M115 170 Q130 180 140 190" stroke="#6B5344" strokeWidth="4" fill="none" opacity="0.6" />
          {/* Trunk */}
          <path d="M90 170 Q95 140 100 100 Q105 140 110 170 Z" fill="url(#trunkGrad)" />
          {/* Branches */}
          <path d="M100 100 Q70 90 50 70" stroke="#8B7355" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M100 100 Q130 90 150 70" stroke="#8B7355" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M100 85 Q85 70 70 50" stroke="#8B7355" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M100 85 Q115 70 130 50" stroke="#8B7355" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Leaves */}
          <ellipse cx="50" cy="60" rx="25" ry="20" fill="url(#leavesGrad)" opacity="0.9" />
          <ellipse cx="150" cy="60" rx="25" ry="20" fill="url(#leavesGrad)" opacity="0.9" />
          <ellipse cx="70" cy="40" rx="20" ry="18" fill="url(#leavesGrad)" opacity="0.85" />
          <ellipse cx="130" cy="40" rx="20" ry="18" fill="url(#leavesGrad)" opacity="0.85" />
          <ellipse cx="100" cy="30" rx="30" ry="25" fill="url(#leavesGrad)" opacity="0.95" />
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