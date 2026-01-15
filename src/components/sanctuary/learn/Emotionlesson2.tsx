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
    title: 'Understanding Emotions',
    subtitle: 'Lesson 1: What Are Emotions?',
  },
  {
    type: 'text',
    title: 'More Than Just Feelings',
    content: 'Emotions are often dismissed as irrational or inconvenient. But they\'re actually sophisticated information systems — your body\'s way of making sense of the world and guiding your actions. They\'ve evolved over millions of years for good reason.',
  },
  {
    type: 'text',
    title: 'A Full-Body Experience',
    content: 'Emotions aren\'t just in your head. They\'re whole-body experiences involving your brain, nervous system, hormones, muscles, and organs. That\'s why you feel fear in your stomach, grief in your chest, and joy throughout your entire being.',
  },
  {
    type: 'visual',
    visual: 'components',
    title: 'The Three Components',
    content: 'Every emotion has three interconnected components: physical sensations in your body, thoughts and interpretations in your mind, and action urges that motivate behavior.',
  },
  {
    type: 'text',
    title: 'Body Sensations',
    content: 'Each emotion has a unique physical signature. Anger might feel hot and tight. Sadness might feel heavy and slow. Fear might feel cold and fluttery. Learning to recognize these sensations helps you identify emotions earlier.',
    highlight: 'Emotions live in the body',
  },
  {
    type: 'text',
    title: 'Thoughts & Interpretations',
    content: 'Emotions are shaped by how we interpret situations. The same event can trigger different emotions depending on what we think it means. This is both the challenge and the opportunity — our thoughts influence our feelings.',
    highlight: 'Meaning shapes emotion',
  },
  {
    type: 'text',
    title: 'Action Urges',
    content: 'Every emotion comes with an urge to act. Fear urges us to flee or freeze. Anger urges us to fight or assert. Sadness urges us to withdraw and process. These urges aren\'t commands — but they are information.',
    highlight: 'Emotions prepare us to act',
  },
  {
    type: 'insight',
    title: 'Emotions Are Information',
    content: 'Your emotions are trying to tell you something important. Fear says "this might be dangerous." Anger says "a boundary has been crossed." Sadness says "something meaningful has been lost." Learning to listen to this information is emotional intelligence.',
  },
  {
    type: 'text',
    title: 'No "Bad" Emotions',
    content: 'We often label emotions as good or bad, but all emotions serve a purpose. Even uncomfortable ones like fear, anger, and sadness have evolved because they help us survive and thrive. The goal isn\'t to eliminate emotions — it\'s to understand them.',
  },
  {
    type: 'text',
    title: 'Emotions vs. Moods',
    content: 'Emotions are relatively brief responses to specific triggers. Moods are longer-lasting background states. Understanding this distinction helps you recognize what you\'re experiencing and respond appropriately.',
  },
  {
    type: 'practice',
    title: 'Notice Right Now',
    content: 'Pause and check in with yourself. What emotion are you experiencing right now? Where do you feel it in your body? What thoughts are connected to it? What action urge, if any, do you notice? This simple practice builds emotional awareness.',
  },
  {
    type: 'summary',
    title: 'Key Takeaways',
    points: [
      'Emotions are sophisticated information systems',
      'They have three components: body, thoughts, and action urges',
      'All emotions serve a purpose — none are "bad"',
      'Emotional intelligence means learning to listen',
    ],
  },
];

export default function EmotionsLesson1({ onBack, onComplete }: LessonProps) {
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
    if (visual === 'components') {
      return (
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="flex flex-col items-center">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: isDark ? '#C4956A33' : '#C4956A22' }}
            >
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <ellipse cx="20" cy="22" rx="12" ry="15" fill="#C4956A" opacity="0.6" />
                <circle cx="20" cy="12" r="8" fill="#C4956A" opacity="0.8" />
              </svg>
            </div>
            <span className="text-xs font-medium" style={{ color: '#C4956A' }}>Body</span>
          </div>
          
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            <path d="M8 12h8M12 8v8" stroke={mutedColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          </svg>
          
          <div className="flex flex-col items-center">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: isDark ? '#6B9BC333' : '#6B9BC322' }}
            >
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <circle cx="20" cy="20" r="12" fill="none" stroke="#6B9BC3" strokeWidth="2" />
                <circle cx="20" cy="20" r="6" fill="#6B9BC3" opacity="0.6" />
                <path d="M20 8 L20 4 M20 36 L20 32 M8 20 L4 20 M36 20 L32 20" stroke="#6B9BC3" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="text-xs font-medium" style={{ color: '#6B9BC3' }}>Thoughts</span>
          </div>
          
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            <path d="M8 12h8M12 8v8" stroke={mutedColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          </svg>
          
          <div className="flex flex-col items-center">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: isDark ? '#7BA05B33' : '#7BA05B22' }}
            >
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <path d="M10 25 L20 10 L30 25" fill="none" stroke="#7BA05B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="20" cy="28" r="4" fill="#7BA05B" opacity="0.6" />
              </svg>
            </div>
            <span className="text-xs font-medium" style={{ color: '#7BA05B' }}>Action</span>
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
      {/* Header */}
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

      {/* Progress bar */}
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