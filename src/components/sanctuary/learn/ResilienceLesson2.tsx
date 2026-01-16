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

// ============================================================================
// STYLES
// ============================================================================
const STYLES = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  .lesson-scroll::-webkit-scrollbar {
    width: 4px;
  }
  .lesson-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .lesson-scroll::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
  }

  .lesson-btn {
    transition: all 0.2s ease;
  }
  .lesson-btn:active {
    transform: scale(0.98);
  }

  .progress-bar {
    transition: width 0.4s ease;
  }
`;

export default function ResilienceLesson2({ onBack, onComplete }: LessonProps) {
  const { isDark, colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const current = CONTENT[currentIndex];
  const progress = ((currentIndex + 1) / CONTENT.length) * 100;
  const isLastSlide = currentIndex === CONTENT.length - 1;

  const bgColor = colors.bg;
  const textColor = colors.text;
  const mutedColor = colors.textMuted;
  const accentColor = colors.accent;
  const cardBg = colors.cardBg;
  const cardBorder = colors.cardBorder;

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

  // ============================================================================
  // RENDER VISUAL
  // ============================================================================
  const renderVisual = (visual: string) => {
    if (visual === 'spectrum') {
      return (
        <div style={{
          width: '100%',
          maxWidth: 280,
          margin: '0 auto 24px',
        }}>
          <div style={{
            position: 'relative',
            height: 64,
            borderRadius: 50,
            overflow: 'hidden',
            marginBottom: 16,
            background: `linear-gradient(90deg, 
              ${isDark ? '#3B5249' : '#90B89B'} 0%, 
              ${isDark ? '#5B7B4A' : '#7BA05B'} 35%, 
              ${isDark ? '#7B5B3A' : '#C4956A'} 65%, 
              ${isDark ? '#6B3B3B' : '#C47070'} 100%)`,
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '0 8px',
            }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'white', opacity: 0.9 }}>Comfort</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'white' }}>Growth</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'white', opacity: 0.9 }}>Overwhelm</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span style={{ fontSize: 18, color: accentColor }}>↓</span>
          </div>
          <p style={{ textAlign: 'center', fontSize: 13, marginTop: 8, color: mutedColor }}>
            Sweet spot for growth
          </p>
        </div>
      );
    }
    return null;
  };

  // ============================================================================
  // RENDER CONTENT
  // ============================================================================
  const renderContent = () => {
    switch (current.type) {
      case 'title':
        return (
          <div style={{
            textAlign: 'center',
            padding: '60px 0',
            animation: 'fadeInScale 0.5s ease',
          }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: `${accentColor}22`,
              border: `1px solid ${accentColor}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: 28,
              color: accentColor,
            }}>
              ◈
            </div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 32,
              fontWeight: 300,
              color: textColor,
              marginBottom: 12,
            }}>
              {current.title}
            </h1>
            <p style={{ fontSize: 16, color: accentColor }}>
              {current.subtitle}
            </p>
          </div>
        );

      case 'visual':
        return (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            {renderVisual(current.visual!)}
            <h2 style={{
              fontSize: 22,
              fontWeight: 500,
              color: textColor,
              marginBottom: 16,
              textAlign: 'center',
            }}>
              {current.title}
            </h2>
            <p style={{
              fontSize: 16,
              color: mutedColor,
              lineHeight: 1.7,
              textAlign: 'center',
            }}>
              {current.content}
            </p>
          </div>
        );

      case 'insight':
        return (
          <div style={{
            padding: 24,
            background: `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}08 100%)`,
            border: `1px solid ${accentColor}33`,
            borderRadius: 20,
            animation: 'fadeIn 0.4s ease',
          }}>
            <div style={{
              fontSize: 12,
              fontWeight: 600,
              color: accentColor,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>◇</span> Insight
            </div>
            <h2 style={{
              fontSize: 22,
              fontWeight: 500,
              color: textColor,
              marginBottom: 12,
            }}>
              {current.title}
            </h2>
            <p style={{
              fontSize: 16,
              color: mutedColor,
              lineHeight: 1.7,
            }}>
              {current.content}
            </p>
          </div>
        );

      case 'practice':
        return (
          <div style={{
            padding: 24,
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            borderLeft: `4px solid ${accentColor}`,
            borderRadius: 16,
            animation: 'fadeIn 0.4s ease',
          }}>
            <div style={{
              fontSize: 12,
              fontWeight: 600,
              color: accentColor,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>○</span> Practice
            </div>
            <h2 style={{
              fontSize: 22,
              fontWeight: 500,
              color: textColor,
              marginBottom: 12,
            }}>
              {current.title}
            </h2>
            <p style={{
              fontSize: 16,
              color: mutedColor,
              lineHeight: 1.7,
            }}>
              {current.content}
            </p>
          </div>
        );

      case 'summary':
        return (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: `${accentColor}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: 20,
              color: accentColor,
            }}>
              ✓
            </div>
            <h2 style={{
              fontSize: 24,
              fontWeight: 500,
              color: textColor,
              marginBottom: 24,
              textAlign: 'center',
            }}>
              {current.title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(current as any).points.map((point: string, i: number) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: 16,
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: 12,
                }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: `${accentColor}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 12, color: accentColor }}>{i + 1}</span>
                  </div>
                  <span style={{ fontSize: 15, color: textColor, lineHeight: 1.5 }}>
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      default: // 'text' type
        return (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{
              fontSize: 24,
              fontWeight: 500,
              color: textColor,
              marginBottom: 16,
            }}>
              {current.title}
            </h2>
            <p style={{
              fontSize: 17,
              color: mutedColor,
              lineHeight: 1.8,
              marginBottom: (current as any).highlight ? 24 : 0,
            }}>
              {current.content}
            </p>
            {(current as any).highlight && (
              <div style={{
                padding: '16px 20px',
                background: `${accentColor}15`,
                border: `1px solid ${accentColor}25`,
                borderRadius: 12,
                textAlign: 'center',
              }}>
                <span style={{
                  fontSize: 18,
                  fontStyle: 'italic',
                  color: accentColor,
                }}>
                  "{(current as any).highlight}"
                </span>
              </div>
            )}
          </div>
        );
    }
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <>
      <style>{STYLES}</style>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: bgColor,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <header style={{
          padding: '16px',
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <button
            onClick={onBack}
            style={{
              padding: '8px 14px',
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: 50,
              cursor: 'pointer',
              fontSize: 18,
              color: mutedColor,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
          <span style={{ fontSize: 13, color: mutedColor }}>
            {currentIndex + 1} / {CONTENT.length}
          </span>
          <div style={{ width: 50 }} />
        </header>

        {/* Progress Bar */}
        <div style={{ padding: '0 20px', marginBottom: 8 }}>
          <div style={{
            height: 4,
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            borderRadius: 4,
            overflow: 'hidden',
          }}>
            <div
              className="progress-bar"
              style={{
                height: '100%',
                width: `${progress}%`,
                background: accentColor,
                borderRadius: 4,
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div
          className="lesson-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
          }}
        >
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            {renderContent()}
          </div>
        </div>

        {/* Navigation */}
        <div style={{
          padding: '16px 24px',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          display: 'flex',
          gap: 12,
        }}>
          {currentIndex > 0 && (
            <button
              className="lesson-btn"
              onClick={handlePrev}
              style={{
                flex: 1,
                padding: '16px',
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 50,
                color: textColor,
                fontSize: 16,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Back
            </button>
          )}
          <button
            className="lesson-btn"
            onClick={handleNext}
            style={{
              flex: currentIndex > 0 ? 1 : undefined,
              width: currentIndex > 0 ? undefined : '100%',
              padding: '16px 32px',
              background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
              border: 'none',
              borderRadius: 50,
              color: '#fff',
              fontSize: 16,
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: `0 4px 16px ${accentColor}44`,
            }}
          >
            {isLastSlide ? 'Complete' : 'Continue'}
          </button>
        </div>
      </div>
    </>
  );
}