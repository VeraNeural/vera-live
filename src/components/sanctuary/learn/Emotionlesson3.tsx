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
    subtitle: 'Lesson 3: Working With Difficult Emotions',
  },
  {
    type: 'text',
    title: 'The Challenge of Hard Feelings',
    content: 'Some emotions feel unbearable. We\'ll do almost anything to avoid them — distract, numb, escape, suppress. But avoiding emotions doesn\'t make them go away. They often grow stronger or leak out in unexpected ways.',
  },
  {
    type: 'text',
    title: 'What We Resist Persists',
    content: 'When we push emotions away, they don\'t disappear. They get stored in our bodies, shape our behaviors, and influence our relationships. The energy we spend avoiding them depletes us. Paradoxically, turning toward difficult emotions often reduces their power.',
  },
  {
    type: 'visual',
    visual: 'waves',
    title: 'Emotions Are Like Waves',
    content: 'Emotions naturally rise, peak, and fall — like waves. When we fight them, we extend their duration. When we allow them, they move through us more quickly. No emotion lasts forever.',
  },
  {
    type: 'text',
    title: 'The RAIN Approach',
    content: 'A powerful framework for working with difficult emotions: Recognize what you\'re feeling, Allow it to be there, Investigate with kindness, and Nurture yourself with compassion. This isn\'t about fixing — it\'s about being with.',
    highlight: 'Recognize • Allow • Investigate • Nurture',
  },
  {
    type: 'text',
    title: 'Recognize',
    content: 'Name what you\'re feeling. "This is anxiety." "This is grief." Simply naming an emotion can reduce its intensity by engaging your thinking brain. You can\'t work with what you can\'t see.',
    highlight: 'Name it to tame it',
  },
  {
    type: 'text',
    title: 'Allow',
    content: 'Let the emotion be present without trying to fix, change, or escape it. This doesn\'t mean you like it or want it — just that you\'re not fighting it. "This is here. I can let it be here."',
    highlight: 'Let it be',
  },
  {
    type: 'text',
    title: 'Investigate',
    content: 'Get curious about the emotion. Where do you feel it in your body? What triggered it? What is it trying to tell you? What does this part of you need? Approach yourself like a caring friend.',
    highlight: 'Curiosity over judgment',
  },
  {
    type: 'text',
    title: 'Nurture',
    content: 'Offer yourself kindness. What would you say to a good friend feeling this way? Can you offer that same compassion to yourself? Sometimes just placing a hand on your heart can help.',
    highlight: 'Self-compassion heals',
  },
  {
    type: 'insight',
    title: 'You Are Not Your Emotions',
    content: 'There\'s a difference between "I am angry" and "I notice anger is present." You are the one experiencing the emotion — you are not the emotion itself. This small shift creates space and choice.',
  },
  {
    type: 'practice',
    title: 'Try RAIN',
    content: 'Think of a mildly difficult emotion you\'re experiencing (start small). Walk through RAIN: Recognize and name it. Allow it to be there. Investigate where you feel it and what it needs. Nurture yourself with a kind word or gesture.',
  },
  {
    type: 'summary',
    title: 'Key Takeaways',
    points: [
      'Avoiding emotions often makes them stronger',
      'Emotions are like waves — they rise, peak, and fall',
      'RAIN: Recognize, Allow, Investigate, Nurture',
      'You are not your emotions — you experience them',
    ],
  },
];

export default function EmotionsLesson3({ onBack, onComplete }: LessonProps) {
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
    if (visual === 'waves') {
      return (
        <svg viewBox="0 0 200 80" className="w-full max-w-xs mx-auto mb-6">
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
              <stop offset="50%" stopColor={accentColor} stopOpacity="0.7" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* Wave path */}
          <path 
            d="M0 60 Q25 60 50 40 T100 20 T150 40 T200 60" 
            fill="none" 
            stroke="url(#waveGrad)" 
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Labels */}
          <text x="25" y="75" fontSize="8" fill={mutedColor} textAnchor="middle">Rise</text>
          <text x="100" y="12" fontSize="8" fill={accentColor} textAnchor="middle" fontWeight="500">Peak</text>
          <text x="175" y="75" fontSize="8" fill={mutedColor} textAnchor="middle">Fall</text>
          {/* Dot at peak */}
          <circle cx="100" cy="20" r="4" fill={accentColor} />
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