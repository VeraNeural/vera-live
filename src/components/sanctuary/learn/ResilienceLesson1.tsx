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
    highlight: 'We need each other',
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

export default function ResilienceLesson1({ onBack, onComplete }: LessonProps) {
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
    if (visual === 'tree') {
      return (
        <div style={{ marginBottom: 24 }}>
          <svg viewBox="0 0 200 200" style={{ width: 128, height: 128, margin: '0 auto', display: 'block' }}>
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
              ❦
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