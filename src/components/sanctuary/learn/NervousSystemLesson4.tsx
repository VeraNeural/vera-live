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
    title: 'Your Nervous System',
    subtitle: 'Lesson 3: The Window of Tolerance',
  },
  {
    type: 'text',
    title: 'Your Optimal Zone',
    content: 'There\'s a state where you function best — where you can think clearly, feel your emotions without being overwhelmed, and respond flexibly to life\'s demands. Psychologists call this your "window of tolerance."',
  },
  {
    type: 'text',
    title: 'Inside the Window',
    content: 'When you\'re inside your window, you feel present and grounded. You can handle stress without shutting down or exploding. You can connect with others. You can learn, create, and problem-solve. This is where healing and growth happen.',
  },
  {
    type: 'visual',
    visual: 'window',
    title: 'The Three Zones',
    content: 'Your nervous system moves between three zones: hyperarousal (too activated), your window of tolerance (optimal), and hypoarousal (too shut down).',
  },
  {
    type: 'text',
    title: 'Hyperarousal',
    content: 'Above the window is hyperarousal — your sympathetic system in overdrive. Here you might feel anxious, panicked, angry, or overwhelmed. Your thoughts race. You feel on edge, reactive, unable to calm down.',
    highlight: 'Too much activation',
  },
  {
    type: 'text',
    title: 'Signs of Hyperarousal',
    content: 'Racing heart, rapid breathing, muscle tension, difficulty sleeping, irritability, hypervigilance, intrusive thoughts, feeling "wired but tired." Your system is stuck in fight-or-flight mode.',
  },
  {
    type: 'text',
    title: 'Hypoarousal',
    content: 'Below the window is hypoarousal — when your system shuts down. Here you might feel numb, disconnected, exhausted, or frozen. You can\'t think clearly. You feel distant from yourself and others.',
    highlight: 'Too little activation',
  },
  {
    type: 'text',
    title: 'Signs of Hypoarousal',
    content: 'Feeling numb or empty, difficulty concentrating, fatigue, feeling "spaced out," reduced emotional range, social withdrawal, feeling disconnected from your body. Your system has collapsed into freeze mode.',
  },
  {
    type: 'insight',
    title: 'Window Size Varies',
    content: 'Everyone\'s window of tolerance is different, and it changes throughout life. Trauma, chronic stress, and difficult experiences can narrow your window. Safety, healing, and positive experiences can widen it. The goal isn\'t to never leave your window — it\'s to return more easily.',
  },
  {
    type: 'text',
    title: 'Recognizing Your Zone',
    content: 'The first step to regulation is awareness. When you can recognize which zone you\'re in, you can choose appropriate strategies to help yourself return to your window. Different zones need different approaches.',
  },
  {
    type: 'practice',
    title: 'Map Your Window',
    content: 'Think about a recent time you felt calm, present, and capable — that\'s inside your window. Now recall a time you felt anxious or overwhelmed (hyperarousal) and a time you felt numb or shut down (hypoarousal). What were the signs in your body for each state?',
  },
  {
    type: 'summary',
    title: 'Key Takeaways',
    points: [
      'Your window of tolerance is where you function best',
      'Hyperarousal = too activated (anxiety, panic, anger)',
      'Hypoarousal = too shut down (numb, disconnected, frozen)',
      'Awareness of your zone is the first step to regulation',
    ],
  },
];

export default function NervousSystemLesson3({ onBack, onComplete }: LessonProps) {
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
    if (visual === 'window') {
      return (
        <div className="w-full max-w-xs mx-auto mb-6">
          {/* Hyperarousal zone */}
          <div 
            className="h-16 rounded-t-2xl flex items-center justify-center"
            style={{ backgroundColor: isDark ? '#C4707033' : '#C4707022' }}
          >
            <div className="text-center">
              <div className="text-sm font-medium" style={{ color: '#C47070' }}>
                Hyperarousal
              </div>
              <div className="text-xs" style={{ color: mutedColor }}>
                Anxious • Overwhelmed • Reactive
              </div>
            </div>
          </div>
          
          {/* Window of tolerance */}
          <div 
            className="h-20 flex items-center justify-center border-y-2"
            style={{ 
              backgroundColor: isDark ? '#7BA05B33' : '#7BA05B22',
              borderColor: '#7BA05B',
            }}
          >
            <div className="text-center">
              <div className="text-sm font-medium" style={{ color: '#7BA05B' }}>
                Window of Tolerance
              </div>
              <div className="text-xs" style={{ color: mutedColor }}>
                Present • Grounded • Flexible
              </div>
            </div>
          </div>
          
          {/* Hypoarousal zone */}
          <div 
            className="h-16 rounded-b-2xl flex items-center justify-center"
            style={{ backgroundColor: isDark ? '#6B9BC333' : '#6B9BC322' }}
          >
            <div className="text-center">
              <div className="text-sm font-medium" style={{ color: '#6B9BC3' }}>
                Hypoarousal
              </div>
              <div className="text-xs" style={{ color: mutedColor }}>
                Numb • Disconnected • Frozen
              </div>
            </div>
          </div>
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