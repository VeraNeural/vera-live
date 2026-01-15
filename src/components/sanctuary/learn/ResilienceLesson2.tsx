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
    subtitle: 'Lesson 2: The Role of Adversity',
  },
  {
    type: 'text',
    title: 'The Paradox of Difficulty',
    content: 'Here\'s a truth that can be hard to accept: we often grow most through our struggles. Not because suffering is good, but because challenge creates the conditions for growth. The question isn\'t whether we\'ll face adversity — it\'s how we\'ll meet it.',
  },
  {
    type: 'text',
    title: 'Stress and Strength',
    content: 'Just as muscles grow stronger through the stress of exercise, our psychological resilience develops through manageable challenges. The key word is manageable — too little challenge and we don\'t grow; too much and we become overwhelmed.',
  },
  {
    type: 'visual',
    visual: 'spectrum',
    title: 'The Challenge Spectrum',
    content: 'There\'s a sweet spot between too little and too much challenge — what researchers call the "zone of proximal development." This is where growth happens.',
  },
  {
    type: 'text',
    title: 'Comfort Zone',
    content: 'In our comfort zone, everything feels safe and familiar. We know what to expect. While this isn\'t bad — we all need rest and safety — staying here permanently means missing opportunities to grow.',
    highlight: 'Safety without growth',
  },
  {
    type: 'text',
    title: 'Growth Zone',
    content: 'Just beyond comfort lies the growth zone. Things feel challenging but manageable. We\'re stretched, maybe uncomfortable, but not overwhelmed. This is where resilience is built, skill by skill, challenge by challenge.',
    highlight: 'Challenge with capacity',
  },
  {
    type: 'text',
    title: 'Overwhelm Zone',
    content: 'Too far beyond our capacity and we enter overwhelm. Our nervous system goes into survival mode. Learning shuts down. Instead of building resilience, we risk trauma. Recognizing this zone is crucial.',
    highlight: 'Too much, too fast',
  },
  {
    type: 'insight',
    title: 'The Window Can Expand',
    content: 'The beautiful thing about resilience is that your "window of tolerance" — the range of challenges you can handle — can expand over time. What once overwhelmed you may become manageable. What was once your edge becomes your new normal.',
  },
  {
    type: 'text',
    title: 'Small Steps Matter',
    content: 'You don\'t build resilience through one heroic effort. It\'s built through countless small moments of meeting difficulty with presence, making it through, and recognizing that you survived. Each small success builds confidence for the next challenge.',
  },
  {
    type: 'text',
    title: 'Support Makes the Difference',
    content: 'Facing challenges with support is completely different from facing them alone. A difficult experience with someone beside you — literally or figuratively — builds resilience. The same experience in isolation can cause harm. Community isn\'t optional.',
  },
  {
    type: 'practice',
    title: 'Map Your Zones',
    content: 'Consider a current challenge in your life. Does it feel like comfort zone (too easy), growth zone (challenging but manageable), or overwhelm zone (too much)? If you\'re in overwhelm, what support might help you move back to growth? If you\'re stuck in comfort, what small step might stretch you?',
  },
  {
    type: 'summary',
    title: 'Key Takeaways',
    points: [
      'Challenge creates conditions for growth',
      'The growth zone is between comfort and overwhelm',
      'Your capacity can expand over time',
      'Support transforms how we experience difficulty',
    ],
  },
];

export default function ResilienceLesson2({ onBack, onComplete }: LessonProps) {
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
    if (visual === 'spectrum') {
      return (
        <div className="w-full max-w-xs mx-auto mb-6">
          <div className="relative h-16 rounded-full overflow-hidden mb-4"
            style={{
              background: `linear-gradient(90deg, 
                ${isDark ? '#3B5249' : '#90B89B'} 0%, 
                ${isDark ? '#5B7B4A' : '#7BA05B'} 35%, 
                ${isDark ? '#7B5B3A' : '#C4956A'} 65%, 
                ${isDark ? '#6B3B3B' : '#C47070'} 100%)`
            }}
          >
            <div className="absolute inset-0 flex items-center justify-around text-xs font-medium text-white px-2">
              <span className="opacity-90">Comfort</span>
              <span className="opacity-100">Growth</span>
              <span className="opacity-90">Overwhelm</span>
            </div>
          </div>
          <div className="flex justify-center">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12l7 7 7-7" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-center text-sm mt-2" style={{ color: mutedColor }}>
            Sweet spot for growth
          </p>
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