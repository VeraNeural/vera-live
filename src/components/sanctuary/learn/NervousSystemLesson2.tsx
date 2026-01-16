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

export default function NervousSystemLesson2({ onBack, onComplete }: LessonProps) {
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
    if (visual === 'cascade') {
      const steps = [
        { label: 'Threat Detected', color: '#C47070', symbol: '◈' },
        { label: 'Amygdala Activates', color: '#C4956A', symbol: '◉' },
        { label: 'Hormones Release', color: '#B8A060', symbol: '◎' },
        { label: 'Body Responds', color: '#7BA05B', symbol: '△' },
      ];
      
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          marginBottom: 24,
        }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: `${step.color}22`,
                  border: `1px solid ${step.color}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  color: step.color,
                }}>
                  {step.symbol}
                </div>
                <span style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: step.color,
                  minWidth: 140,
                }}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  width: 1,
                  height: 16,
                  background: `linear-gradient(180deg, ${step.color}66 0%, ${steps[i + 1].color}66 100%)`,
                  marginLeft: -80,
                }} />
              )}
            </div>
          ))}
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