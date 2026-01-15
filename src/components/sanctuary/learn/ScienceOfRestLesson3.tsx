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
    subtitle: 'Lesson 3: Types of Rest',
  },
  {
    type: 'text',
    title: 'Rest Is Multidimensional',
    content: 'We often think of rest as simply sleep or doing nothing. But rest is actually multidimensional — we have different kinds of energy that get depleted and need different kinds of restoration. Understanding this helps explain why you can still feel exhausted after a vacation.',
  },
  {
    type: 'text',
    title: 'Seven Types of Rest',
    content: 'Research suggests we need at least seven different types of rest: physical, mental, emotional, social, sensory, creative, and spiritual. Most of us are severely deficient in at least one of these areas.',
  },
  {
    type: 'visual',
    visual: 'types',
    title: 'The Rest Spectrum',
    content: 'Each type of rest addresses a different kind of depletion. Which ones resonate most with you?',
  },
  {
    type: 'text',
    title: 'Physical Rest',
    content: 'This includes both passive rest (sleep, napping) and active rest (yoga, stretching, massage). If you wake still tired or have persistent body aches, you may need more physical rest.',
    highlight: 'Rest for the body',
  },
  {
    type: 'text',
    title: 'Mental Rest',
    content: 'When your mind won\'t stop racing or you can\'t concentrate, you need mental rest. This means giving your thinking brain a break — short breaks during work, stepping away from problem-solving, quieting the mental chatter.',
    highlight: 'Rest for the thinking mind',
  },
  {
    type: 'text',
    title: 'Emotional Rest',
    content: 'This is the freedom to be authentic and stop performing. It means having space to express how you truly feel, not constantly managing others\' emotions or hiding your own. It requires safe relationships.',
    highlight: 'Rest from emotional labor',
  },
  {
    type: 'text',
    title: 'Social Rest',
    content: 'Even positive social interaction takes energy. Social rest means time alone or with people who energize rather than drain you. Introverts need more; extroverts need less — but everyone needs some.',
    highlight: 'Rest from social demands',
  },
  {
    type: 'text',
    title: 'Sensory Rest',
    content: 'We\'re bombarded with stimulation — screens, noise, lights, notifications. Sensory rest means intentionally reducing input. Close your eyes. Silence your devices. Find quiet. Let your senses recover.',
    highlight: 'Rest from stimulation',
  },
  {
    type: 'text',
    title: 'Creative Rest',
    content: 'This is rest for your sense of wonder and inspiration. It comes from experiencing beauty — nature, art, music. When everything feels dull or you\'ve lost your spark, you may need creative rest.',
    highlight: 'Rest that restores wonder',
  },
  {
    type: 'text',
    title: 'Spiritual Rest',
    content: 'This is rest for your sense of meaning and belonging. It comes from connecting to something larger than yourself — community, purpose, nature, the transcendent. It answers the question "why does this matter?"',
    highlight: 'Rest for the soul',
  },
  {
    type: 'insight',
    title: 'Your Rest Deficit',
    content: 'Most people are depleted in multiple areas but keep trying to fix it with the same type of rest (usually physical). If you\'re sleeping enough but still exhausted, you likely have a deficit in another type of rest.',
  },
  {
    type: 'practice',
    title: 'Rest Inventory',
    content: 'Rate each type of rest from 1-10 (how depleted are you?): Physical, Mental, Emotional, Social, Sensory, Creative, Spiritual. Your lowest scores reveal where to focus your rest efforts.',
  },
  {
    type: 'summary',
    title: 'Key Takeaways',
    points: [
      'We need seven different types of rest',
      'Exhaustion despite sleep often means deficits in other areas',
      'Each type addresses different kinds of depletion',
      'Identify your specific rest deficits to restore effectively',
    ],
  },
];

export default function ScienceOfRestLesson3({ onBack, onComplete }: LessonProps) {
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
    if (visual === 'types') {
      const types = [
        { name: 'Physical', color: '#C4956A' },
        { name: 'Mental', color: '#6B9BC3' },
        { name: 'Emotional', color: '#C47070' },
        { name: 'Social', color: '#7BA05B' },
        { name: 'Sensory', color: '#A78BB3' },
        { name: 'Creative', color: '#E8B86D' },
        { name: 'Spiritual', color: '#8B9DC3' },
      ];
      
      return (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {types.map((type, i) => (
            <div 
              key={i}
              className="px-3 py-2 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: isDark ? `${type.color}22` : `${type.color}15`,
                color: type.color,
              }}
            >
              {type.name}
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