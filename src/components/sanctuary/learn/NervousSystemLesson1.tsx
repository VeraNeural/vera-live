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
    subtitle: 'Lesson 1: The Basics',
  },
  {
    type: 'text',
    title: 'Your Body\'s Communication Network',
    content: 'Your nervous system is like the internet of your body — a vast network that carries messages between your brain and every other part of you. It\'s always working, even when you\'re asleep, keeping you alive and helping you respond to the world around you.',
  },
  {
    type: 'text',
    title: 'Two Main Divisions',
    content: 'Your nervous system has two main parts: the central nervous system (your brain and spinal cord) and the peripheral nervous system (all the nerves that branch out to the rest of your body). Together, they form an integrated whole.',
  },
  {
    type: 'visual',
    visual: 'branches',
    title: 'The Autonomic System',
    content: 'The part we\'ll focus on is your autonomic nervous system — the "automatic" system that runs without your conscious control. It has two main branches that work like a gas pedal and a brake pedal.',
  },
  {
    type: 'text',
    title: 'The Sympathetic System',
    content: 'This is your "gas pedal" — it speeds things up when you need to respond to challenges. It triggers your fight-or-flight response, increasing your heart rate, sharpening your focus, and preparing your body for action.',
    highlight: 'Fight or Flight',
  },
  {
    type: 'text',
    title: 'The Parasympathetic System',
    content: 'This is your "brake pedal" — it slows things down when you\'re safe. It activates your rest-and-digest response, lowering your heart rate, promoting digestion, and helping your body recover and restore.',
    highlight: 'Rest and Digest',
  },
  {
    type: 'text',
    title: 'A Constant Dance',
    content: 'These two systems aren\'t opposites that fight each other — they\'re partners in a constant dance, always adjusting to help you meet life\'s demands. Health isn\'t about one dominating the other; it\'s about flexible, appropriate responses.',
  },
  {
    type: 'insight',
    title: 'Always On, Always Adapting',
    content: 'Your autonomic nervous system never turns off. Right now, as you read this, it\'s adjusting your heart rate, your breathing, your digestion. It\'s constantly reading your environment and your internal state, making thousands of micro-adjustments to keep you functioning.',
  },
  {
    type: 'text',
    title: 'Why This Matters',
    content: 'Understanding your nervous system gives you a new lens for understanding yourself. That anxiety before a presentation? That\'s your sympathetic system preparing you. That sleepiness after a big meal? That\'s your parasympathetic system at work.',
  },
  {
    type: 'practice',
    title: 'Notice Right Now',
    content: 'Take a moment to tune into your body. Is your breathing fast or slow? Is your heart rate elevated or calm? Do you feel alert or relaxed? You\'re getting a glimpse of which branch of your autonomic nervous system is more active right now.',
  },
  {
    type: 'summary',
    title: 'Key Takeaways',
    points: [
      'Your nervous system is your body\'s communication network',
      'The autonomic system runs automatically, without conscious control',
      'Sympathetic = gas pedal (fight-or-flight)',
      'Parasympathetic = brake pedal (rest-and-digest)',
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

export default function NervousSystemLesson1({ onBack, onComplete }: LessonProps) {
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
    if (visual === 'branches') {
      return (
        <div style={{ marginBottom: 24 }}>
          <svg viewBox="0 0 200 160" style={{ width: 192, height: 144, margin: '0 auto', display: 'block' }}>
            {/* Central line (spine) */}
            <line x1="100" y1="20" x2="100" y2="140" stroke={accentColor} strokeWidth="4" strokeLinecap="round" />
            
            {/* Brain circle */}
            <circle cx="100" cy="20" r="15" fill="#6B9BC3" opacity="0.8" />
            <text x="100" y="24" textAnchor="middle" fontSize="8" fill="white" fontWeight="500">Brain</text>
            
            {/* Sympathetic branch (left) */}
            <path d="M100 50 Q60 50 40 70" stroke="#C47070" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M100 80 Q60 80 40 100" stroke="#C47070" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="35" cy="75" r="12" fill="#C47070" opacity="0.2" />
            <circle cx="35" cy="105" r="12" fill="#C47070" opacity="0.2" />
            
            {/* Parasympathetic branch (right) */}
            <path d="M100 50 Q140 50 160 70" stroke="#7BA05B" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M100 80 Q140 80 160 100" stroke="#7BA05B" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="165" cy="75" r="12" fill="#7BA05B" opacity="0.2" />
            <circle cx="165" cy="105" r="12" fill="#7BA05B" opacity="0.2" />
            
            {/* Labels */}
            <text x="30" y="145" textAnchor="middle" fontSize="9" fill="#C47070" fontWeight="500">Sympathetic</text>
            <text x="30" y="155" textAnchor="middle" fontSize="7" fill={mutedColor}>(Gas Pedal)</text>
            <text x="170" y="145" textAnchor="middle" fontSize="9" fill="#7BA05B" fontWeight="500">Parasympathetic</text>
            <text x="170" y="155" textAnchor="middle" fontSize="7" fill={mutedColor}>(Brake)</text>
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
              fontSize: 32,
            }}>
              🧠
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