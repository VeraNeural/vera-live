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
    subtitle: 'Lesson 2: The Stress Response',
  },
  {
    type: 'text',
    title: 'An Ancient Survival System',
    content: 'Your stress response is one of evolution\'s greatest achievements. It\'s a lightning-fast system designed to keep you alive in the face of danger. When your brain perceives a threat, it triggers a cascade of changes throughout your body in milliseconds.',
  },
  {
    type: 'text',
    title: 'The Alarm Goes Off',
    content: 'It starts in a tiny brain structure called the amygdala — your internal alarm system. When it detects danger (real or perceived), it sends an urgent message to your hypothalamus, which then activates your sympathetic nervous system.',
  },
  {
    type: 'visual',
    visual: 'cascade',
    title: 'The Stress Cascade',
    content: 'Within seconds, your body undergoes dramatic changes — all designed to help you fight, flee, or freeze in the face of danger.',
  },
  {
    type: 'text',
    title: 'Heart and Lungs',
    content: 'Your heart rate increases and your breathing quickens. Blood pressure rises. More oxygen floods your system. Your body is preparing to either fight off a threat or run from it.',
    highlight: 'Preparing for action',
  },
  {
    type: 'text',
    title: 'Blood Flow Shifts',
    content: 'Blood is redirected away from your digestive system and toward your large muscles. This is why you might feel butterflies in your stomach or lose your appetite when stressed — digestion becomes low priority.',
    highlight: 'Redirecting resources',
  },
  {
    type: 'text',
    title: 'Senses Sharpen',
    content: 'Your pupils dilate to take in more light. Your hearing becomes more acute. Your attention narrows and focuses on the threat. You become hyperaware of your environment.',
    highlight: 'Heightened awareness',
  },
  {
    type: 'text',
    title: 'Stress Hormones Flood',
    content: 'Adrenaline and cortisol surge through your bloodstream. Adrenaline provides immediate energy; cortisol sustains the response over time. These hormones affect nearly every system in your body.',
  },
  {
    type: 'insight',
    title: 'Designed for Short Bursts',
    content: 'Here\'s the key: this system evolved for acute, short-term threats — a predator, a rival, a sudden danger. It was meant to activate quickly, help you survive, and then turn off. It wasn\'t designed to run constantly.',
  },
  {
    type: 'text',
    title: 'The Modern Problem',
    content: 'Today, many of us live with chronic stress — ongoing work pressure, financial worries, relationship difficulties. Our ancient stress response can\'t tell the difference between a tiger and a deadline. It keeps activating, again and again.',
  },
  {
    type: 'text',
    title: 'The Cost of Chronic Stress',
    content: 'When the stress response stays on too long, it takes a toll: disrupted sleep, digestive issues, weakened immunity, difficulty concentrating, emotional exhaustion. Your body is paying the price of constant vigilance.',
  },
  {
    type: 'practice',
    title: 'Recognize Your Signals',
    content: 'What are your body\'s early warning signs of stress? Perhaps it\'s tension in your shoulders, a clenched jaw, shallow breathing, or a racing mind. Learning to recognize these signals early gives you a chance to respond before stress escalates.',
  },
  {
    type: 'summary',
    title: 'Key Takeaways',
    points: [
      'The stress response is a survival system that activates in milliseconds',
      'It causes dramatic changes in heart, breathing, blood flow, and hormones',
      'It was designed for short-term threats, not chronic stress',
      'Recognizing early warning signs helps you respond sooner',
    ],
  },
];

export default function NervousSystemLesson2({ onBack, onComplete }: LessonProps) {
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
    if (visual === 'cascade') {
      return (
        <div className="flex flex-col items-center gap-3 mb-6">
          {[
            { label: 'Threat Detected', color: '#C47070', icon: '⚡' },
            { label: 'Amygdala Activates', color: '#C4956A', icon: '🔔' },
            { label: 'Hormones Release', color: '#B8A060', icon: '💧' },
            { label: 'Body Responds', color: '#7BA05B', icon: '💪' },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: `${step.color}22` }}
              >
                {step.icon}
              </div>
              <div 
                className="text-sm font-medium"
                style={{ color: step.color }}
              >
                {step.label}
              </div>
              {i < 3 && (
                <svg className="w-4 h-4 absolute ml-3 mt-12" style={{ color: mutedColor }}>
                  <path d="M2 0 L2 8 L0 6 M2 8 L4 6" stroke="currentColor" strokeWidth="1" fill="none" />
                </svg>
              )}
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