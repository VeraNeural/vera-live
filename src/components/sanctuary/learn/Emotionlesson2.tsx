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
    subtitle: 'Lesson 2: The Emotion Cycle',
  },
  {
    type: 'text',
    title: 'Emotions Have a Lifespan',
    content: 'Every emotion follows a predictable pattern: it rises, peaks, and fades. Understanding this cycle helps you ride the wave rather than being overwhelmed by it. No emotion lasts forever — even the most intense feelings will pass.',
  },
  {
    type: 'text',
    title: 'The Trigger',
    content: 'Emotions begin with a trigger — something you perceive in your environment, a thought, a memory, or even a physical sensation. The trigger itself is neutral; it\'s your interpretation that sparks the emotional response.',
  },
  {
    type: 'visual',
    visual: 'cycle',
    title: 'The Emotion Wave',
    content: 'Emotions typically rise over seconds to minutes, reach a peak intensity, then gradually subside over 20-90 minutes if we don\'t feed them with more thoughts or resistance.',
  },
  {
    type: 'text',
    title: 'The Rising Phase',
    content: 'As an emotion builds, you\'ll notice increasing physical sensations and stronger urges to act. This is when we\'re most likely to react impulsively. Learning to recognize this phase gives you a window to choose your response.',
    highlight: 'Awareness creates choice',
  },
  {
    type: 'text',
    title: 'The Peak',
    content: 'At the peak, the emotion feels most intense and urgent. It can seem like it will last forever or that you must act immediately. But this is actually the turning point — intensity naturally begins to decrease from here.',
    highlight: 'The peak is the turning point',
  },
  {
    type: 'text',
    title: 'The Falling Phase',
    content: 'After the peak, emotions naturally begin to subside. Physical sensations calm, thoughts become clearer, and urges lose their power. This is when reflection and learning become possible.',
    highlight: 'Clarity returns as emotions settle',
  },
  {
    type: 'insight',
    title: 'Surf, Don\'t Fight',
    content: 'Resisting or suppressing emotions often prolongs them. Fighting the wave exhausts you. Instead, try surfing — acknowledge the emotion, let it move through you, and trust that it will pass. This is the essence of emotional regulation.',
  },
  {
    type: 'text',
    title: 'What Prolongs Emotions',
    content: 'Rumination (replaying events), resistance (fighting the feeling), and secondary emotions (feeling bad about feeling bad) can all extend the emotion cycle. Notice when you\'re doing these and gently redirect.',
  },
  {
    type: 'text',
    title: 'What Helps Emotions Pass',
    content: 'Acceptance, physical movement, deep breathing, and shifting attention can all support the natural completion of the emotion cycle. These aren\'t about avoiding feelings — they\'re about allowing them to complete their journey.',
  },
  {
    type: 'practice',
    title: 'Track the Wave',
    content: 'Next time you feel a strong emotion, try to notice where you are in the cycle. Is it rising, peaking, or falling? Just this simple awareness can help you feel less overwhelmed and more confident that the intensity will pass.',
  },
  {
    type: 'summary',
    title: 'Key Takeaways',
    points: [
      'All emotions follow a cycle: rise, peak, fall',
      'The peak feels endless but is actually the turning point',
      'Resistance prolongs emotions; acceptance lets them pass',
      'Tracking the wave builds emotional confidence',
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

export default function EmotionsLesson2({ onBack, onComplete }: LessonProps) {
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
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}>
          {[
            { label: 'Rise', color: '#C4956A', icon: '↗' },
            { label: 'Peak', color: '#6B9BC3', icon: '◆' },
            { label: 'Fall', color: '#7BA05B', icon: '↘' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: `${item.color}22`,
                border: `2px solid ${item.color}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
                fontSize: 24,
                color: item.color,
              }}>
                {item.icon}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: item.color }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      );
    }
    if (visual === 'components') {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}>
          {[
            { label: 'Body', color: '#C4956A', icon: '◉' },
            { label: 'Thoughts', color: '#6B9BC3', icon: '◎' },
            { label: 'Action', color: '#7BA05B', icon: '△' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: `${item.color}22`,
                border: `2px solid ${item.color}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
                fontSize: 24,
                color: item.color,
              }}>
                {item.icon}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: item.color }}>
                {item.label}
              </span>
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
              fontSize: 32,
            }}>
              💭
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
            }}>
              💡 Insight
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
            }}>
              🎯 Practice
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
              fontSize: 24,
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