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
    subtitle: 'Lesson 4: Integration and Growth',
  },
  {
    type: 'text',
    title: 'Bringing It All Together',
    content: 'You\'ve learned what resilience really is, how adversity can be a teacher, and practices that build your capacity. Now it\'s time to integrate these insights into a sustainable way of living — not as a burden, but as a natural rhythm.',
  },
  {
    type: 'text',
    title: 'Resilience as a Way of Being',
    content: 'True resilience isn\'t a destination you arrive at — it\'s a way of moving through life. It\'s about developing habits of heart and mind that help you navigate whatever comes, while staying connected to what matters most.',
  },
  {
    type: 'visual',
    visual: 'cycle',
    title: 'The Resilience Cycle',
    content: 'Resilience isn\'t static. It\'s a dynamic cycle of challenge, response, recovery, and growth — repeated again and again throughout life.',
  },
  {
    type: 'text',
    title: 'Challenge',
    content: 'Life will continue to present challenges. This is certain. With each challenge comes an invitation — not to suffer, but to discover what you\'re capable of. Challenges reveal both our vulnerabilities and our hidden strengths.',
    highlight: 'Challenges are invitations',
  },
  {
    type: 'text',
    title: 'Response',
    content: 'How you respond to challenge matters enormously. Will you reach for your tools? Ask for support? Stay present with difficulty? Each response is a choice, and the more you practice conscious responding, the more natural it becomes.',
    highlight: 'Response is a choice',
  },
  {
    type: 'text',
    title: 'Recovery',
    content: 'After every challenge, recovery is essential. This isn\'t weakness — it\'s wisdom. Allow yourself to rest, to process, to be held by your support system. Recovery isn\'t optional; it\'s part of the cycle.',
    highlight: 'Recovery is essential',
  },
  {
    type: 'text',
    title: 'Growth',
    content: 'When we meet challenges with presence and allow full recovery, we grow. Not always in the ways we expect. Sometimes growth is quiet — a deeper trust in ourselves, a greater capacity to be present, more compassion for others.',
    highlight: 'Growth emerges naturally',
  },
  {
    type: 'insight',
    title: 'Post-Traumatic Growth',
    content: 'Research shows that many people who face significant adversity report profound positive changes: deeper relationships, greater appreciation for life, increased personal strength, new possibilities, and spiritual growth. Difficulty can catalyze transformation.',
  },
  {
    type: 'text',
    title: 'Self-Compassion Is Key',
    content: 'Perhaps the most important resilience tool is self-compassion. When you stumble — and you will — can you treat yourself with the same kindness you would offer a good friend? Self-criticism depletes resilience; self-compassion builds it.',
  },
  {
    type: 'text',
    title: 'The Long View',
    content: 'Building resilience is a lifelong journey. Some days you\'ll feel strong; others you\'ll struggle. This is normal. What matters is the general direction — are you tending to your roots, your connections, your practices? The rest takes care of itself.',
  },
  {
    type: 'practice',
    title: 'Your Resilience Commitment',
    content: 'As you complete this course, consider: What one insight will you carry forward? What one practice will you commit to? Who can support you on this journey? Write these down. Small, sustained commitments create lasting change.',
  },
  {
    type: 'summary',
    title: 'Course Complete',
    points: [
      'Resilience is a dynamic cycle: challenge, response, recovery, growth',
      'How you respond to difficulty is a choice you can practice',
      'Self-compassion is the foundation of lasting resilience',
      'Small, sustained practices compound into remarkable strength',
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

export default function ResilienceLesson4({ onBack, onComplete }: LessonProps) {
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
    if (visual === 'cycle') {
      const steps = [
        { label: 'Challenge', color: '#C47070' },
        { label: 'Response', color: '#C4956A' },
        { label: 'Recovery', color: '#6B9BC3' },
        { label: 'Growth', color: '#7BA05B' },
      ];
      
      return (
        <div style={{
          position: 'relative',
          width: 200,
          height: 200,
          margin: '0 auto 24px',
        }}>
          {/* Circle */}
          <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke={`${accentColor}22`}
              strokeWidth="2"
            />
            {/* Arrows */}
            <path
              d="M100 20 A80 80 0 0 1 180 100"
              fill="none"
              stroke={steps[0].color}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M180 100 A80 80 0 0 1 100 180"
              fill="none"
              stroke={steps[1].color}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M100 180 A80 80 0 0 1 20 100"
              fill="none"
              stroke={steps[2].color}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M20 100 A80 80 0 0 1 100 20"
              fill="none"
              stroke={steps[3].color}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Labels */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%) translateY(-8px)',
            fontSize: 11,
            fontWeight: 500,
            color: steps[0].color,
          }}>
            Challenge
          </div>
          <div style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%) translateX(8px)',
            fontSize: 11,
            fontWeight: 500,
            color: steps[1].color,
          }}>
            Response
          </div>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%) translateY(8px)',
            fontSize: 11,
            fontWeight: 500,
            color: steps[2].color,
          }}>
            Recovery
          </div>
          <div style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%) translateX(-8px)',
            fontSize: 11,
            fontWeight: 500,
            color: steps[3].color,
          }}>
            Growth
          </div>
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
              ∞
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
              background: `linear-gradient(135deg, ${accentColor}44 0%, ${accentColor}22 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: 20,
              color: accentColor,
            }}>
              ✦
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
                    <span style={{ fontSize: 12, color: accentColor }}>✓</span>
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
            {isLastSlide ? 'Complete Course' : 'Continue'}
          </button>
        </div>
      </div>
    </>
  );
}