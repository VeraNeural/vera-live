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
    subtitle: 'Lesson 1: The Basics',
  },
  {
    type: 'text',
    title: 'Your Body\'s Communication Network',
    content: 'Your nervous system is like the internet of your body — a vast network that carries messages between your brain and every other part of you. It\'s always working, even when you\'re asleep, keeping you alive and helping you respond to the world around you.',
  },
  {
    type: 'text',
    title: 'Two Main Divisions',
    content: 'Your nervous system has two main parts: the central nervous system (your brain and spinal cord) and the peripheral nervous system (all the nerves that branch out to the rest of your body). Together, they form an integrated whole.',
  },
  {
    type: 'visual',
    visual: 'branches',
    title: 'The Autonomic System',
    content: 'The part we\'ll focus on is your autonomic nervous system — the "automatic" system that runs without your conscious control. It has two main branches that work like a gas pedal and a brake pedal.',
  },
  {
    type: 'text',
    title: 'The Sympathetic System',
    content: 'This is your "gas pedal" — it speeds things up when you need to respond to challenges. It triggers your fight-or-flight response, increasing your heart rate, sharpening your focus, and preparing your body for action.',
    highlight: 'Fight or Flight',
  },
  {
    type: 'text',
    title: 'The Parasympathetic System',
    content: 'This is your "brake pedal" — it slows things down when you\'re safe. It activates your rest-and-digest response, lowering your heart rate, promoting digestion, and helping your body recover and restore.',
    highlight: 'Rest and Digest',
  },
  {
    type: 'text',
    title: 'A Constant Dance',
    content: 'These two systems aren\'t opposites that fight each other — they\'re partners in a constant dance, always adjusting to help you meet life\'s demands. Health isn\'t about one dominating the other; it\'s about flexible, appropriate responses.',
  },
  {
    type: 'insight',
    title: 'Always On, Always Adapting',
    content: 'Your autonomic nervous system never turns off. Right now, as you read this, it\'s adjusting your heart rate, your breathing, your digestion. It\'s constantly reading your environment and your internal state, making thousands of micro-adjustments to keep you functioning.',
  },
  {
    type: 'text',
    title: 'Why This Matters',
    content: 'Understanding your nervous system gives you a new lens for understanding yourself. That anxiety before a presentation? That\'s your sympathetic system preparing you. That sleepiness after a big meal? That\'s your parasympathetic system at work.',
  },
  {
    type: 'practice',
    title: 'Notice Right Now',
    content: 'Take a moment to tune into your body. Is your breathing fast or slow? Is your heart rate elevated or calm? Do you feel alert or relaxed? You\'re getting a glimpse of which branch of your autonomic nervous system is more active right now.',
  },
  {
    type: 'summary',
    title: 'Key Takeaways',
    points: [
      'Your nervous system is your body\'s communication network',
      'The autonomic system runs automatically, without conscious control',
      'Sympathetic = gas pedal (fight-or-flight)',
      'Parasympathetic = brake pedal (rest-and-digest)',
    ],
  },
];

export default function NervousSystemLesson1({ onBack, onComplete }: LessonProps) {
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
    if (visual === 'branches') {
      return (
        <svg viewBox="0 0 200 160" className="w-48 h-36 mx-auto mb-4">
          {/* Central line (spine) */}
          <line x1="100" y1="20" x2="100" y2="140" stroke={accentColor} strokeWidth="4" strokeLinecap="round" />
          
          {/* Brain circle */}
          <circle cx="100" cy="20" r="15" fill={isDark ? '#6B9BC3' : '#89B4D4'} opacity="0.8" />
          <text x="100" y="24" textAnchor="middle" fontSize="8" fill="white" fontWeight="500">Brain</text>
          
          {/* Sympathetic branch (left) */}
          <path d="M100 50 Q60 50 40 70" stroke="#C47070" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M100 80 Q60 80 40 100" stroke="#C47070" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="35" cy="75" r="12" fill="#C47070" opacity="0.2" />
          <circle cx="35" cy="105" r="12" fill="#C47070" opacity="0.2" />
          
          {/* Parasympathetic branch (right) */}
          <path d="M100 50 Q140 50 160 70" stroke="#7BA05B" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M100 80 Q140 80 160 100" stroke="#7BA05B" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="165" cy="75" r="12" fill="#7BA05B" opacity="0.2" />
          <circle cx="165" cy="105" r="12" fill="#7BA05B" opacity="0.2" />
          
          {/* Labels */}
          <text x="30" y="145" textAnchor="middle" fontSize="9" fill="#C47070" fontWeight="500">Sympathetic</text>
          <text x="30" y="155" textAnchor="middle" fontSize="7" fill={mutedColor}>(Gas Pedal)</text>
          <text x="170" y="145" textAnchor="middle" fontSize="9" fill="#7BA05B" fontWeight="500">Parasympathetic</text>
          <text x="170" y="155" textAnchor="middle" fontSize="7" fill={mutedColor}>(Brake)</text>
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