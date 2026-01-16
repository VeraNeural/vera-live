// ============================================================================
// DYNAMIC LESSON VIEWER
// ============================================================================
// Renders lessons stored in Supabase (from admin generator)
// Add to: src/components/sanctuary/DynamicLessonViewer.tsx

'use client';

import { useState } from 'react';

type LessonSlide = {
  type: 'title' | 'text' | 'visual' | 'insight' | 'practice' | 'summary';
  title?: string;
  subtitle?: string;
  content?: string;
  highlight?: string;
  points?: string[];
  visual?: string;
};

type DynamicLessonProps = {
  lesson: {
    id: string;
    title: string;
    description: string;
    content: LessonSlide[];
  };
  onBack: () => void;
  onComplete?: () => void;
  colors: {
    bg: string;
    text: string;
    textMuted: string;
    cardBg: string;
    cardBorder: string;
    accent: string;
  };
  isDark: boolean;
};

export default function DynamicLessonViewer({ 
  lesson, 
  onBack, 
  onComplete, 
  colors,
  isDark 
}: DynamicLessonProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!lesson?.content?.length) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: colors.text }}>
        <p>This lesson has no content yet.</p>
        <button onClick={onBack} style={{ marginTop: 16, color: colors.accent }}>
          ← Go Back
        </button>
      </div>
    );
  }
  
  const slides = lesson.content;
  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onComplete?.();
      onBack();
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: colors.bg,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${colors.cardBorder}`,
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: colors.accent,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
        
        <span style={{
          fontSize: 12,
          color: colors.textMuted,
        }}>
          {currentSlide + 1} / {slides.length}
        </span>
      </header>

      {/* Progress Bar */}
      <div style={{
        height: 3,
        background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      }}>
        <div style={{
          height: '100%',
          width: `${((currentSlide + 1) / slides.length) * 100}%`,
          background: colors.accent,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          maxWidth: 500,
          width: '100%',
          animation: 'fadeIn 0.4s ease-out',
        }}>
          {/* Title Slide */}
          {slide.type === 'title' && (
            <div style={{ textAlign: 'center' }}>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 32,
                fontWeight: 300,
                color: colors.text,
                marginBottom: 12,
              }}>
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p style={{
                  fontSize: 16,
                  color: colors.textMuted,
                }}>
                  {slide.subtitle}
                </p>
              )}
            </div>
          )}

          {/* Text Slide */}
          {slide.type === 'text' && (
            <div>
              {slide.title && (
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 24,
                  fontWeight: 400,
                  color: colors.text,
                  marginBottom: 20,
                }}>
                  {slide.title}
                </h2>
              )}
              <p style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: colors.text,
              }}>
                {slide.content}
              </p>
              {slide.highlight && (
                <div style={{
                  marginTop: 24,
                  padding: '16px 20px',
                  background: isDark ? 'rgba(255,180,100,0.1)' : 'rgba(200,160,100,0.1)',
                  borderLeft: `3px solid ${colors.accent}`,
                  borderRadius: 8,
                }}>
                  <p style={{
                    fontSize: 15,
                    fontStyle: 'italic',
                    color: colors.accent,
                    margin: 0,
                  }}>
                    "{slide.highlight}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Visual Slide */}
          {slide.type === 'visual' && (
            <div>
              {slide.title && (
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 24,
                  fontWeight: 400,
                  color: colors.text,
                  marginBottom: 20,
                  textAlign: 'center',
                }}>
                  {slide.title}
                </h2>
              )}
              {/* Visual placeholder - you can add actual visuals here */}
              <div style={{
                padding: 40,
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                borderRadius: 16,
                textAlign: 'center',
                marginBottom: 20,
              }}>
                <div style={{
                  fontSize: 48,
                  marginBottom: 16,
                }}>
                  {slide.visual === 'breathing' ? '🌬️' : 
                   slide.visual === 'body' ? '🧘' :
                   slide.visual === 'brain' ? '🧠' :
                   slide.visual === 'heart' ? '❤️' : '✨'}
                </div>
                <p style={{
                  fontSize: 14,
                  color: colors.textMuted,
                }}>
                  {slide.visual}
                </p>
              </div>
              {slide.content && (
                <p style={{
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: colors.text,
                }}>
                  {slide.content}
                </p>
              )}
            </div>
          )}

          {/* Insight Slide */}
          {slide.type === 'insight' && (
            <div style={{
              padding: '32px 24px',
              background: isDark ? 'rgba(255,180,100,0.08)' : 'rgba(200,160,100,0.08)',
              borderRadius: 16,
              border: `1px solid ${isDark ? 'rgba(255,180,100,0.15)' : 'rgba(200,160,100,0.2)'}`,
            }}>
              <div style={{
                fontSize: 32,
                textAlign: 'center',
                marginBottom: 16,
              }}>
                💡
              </div>
              {slide.title && (
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 22,
                  fontWeight: 400,
                  color: colors.accent,
                  marginBottom: 16,
                  textAlign: 'center',
                }}>
                  {slide.title}
                </h2>
              )}
              <p style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: colors.text,
                textAlign: 'center',
              }}>
                {slide.content}
              </p>
            </div>
          )}

          {/* Practice Slide */}
          {slide.type === 'practice' && (
            <div>
              <div style={{
                fontSize: 32,
                textAlign: 'center',
                marginBottom: 16,
              }}>
                🎯
              </div>
              {slide.title && (
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 24,
                  fontWeight: 400,
                  color: colors.text,
                  marginBottom: 20,
                  textAlign: 'center',
                }}>
                  {slide.title}
                </h2>
              )}
              <div style={{
                padding: '24px',
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 16,
              }}>
                <p style={{
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: colors.text,
                }}>
                  {slide.content}
                </p>
              </div>
            </div>
          )}

          {/* Summary Slide */}
          {slide.type === 'summary' && (
            <div>
              {slide.title && (
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 24,
                  fontWeight: 400,
                  color: colors.text,
                  marginBottom: 24,
                  textAlign: 'center',
                }}>
                  {slide.title}
                </h2>
              )}
              {slide.points && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}>
                  {slide.points.map((point, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        padding: '16px',
                        background: colors.cardBg,
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: 12,
                      }}
                    >
                      <span style={{
                        color: colors.accent,
                        fontWeight: 600,
                      }}>
                        {idx + 1}.
                      </span>
                      <p style={{
                        fontSize: 15,
                        lineHeight: 1.6,
                        color: colors.text,
                        margin: 0,
                      }}>
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        padding: '20px 24px',
        paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: `1px solid ${colors.cardBorder}`,
      }}>
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          style={{
            padding: '12px 24px',
            borderRadius: 50,
            border: `1px solid ${colors.cardBorder}`,
            background: 'transparent',
            color: currentSlide === 0 ? colors.textMuted : colors.text,
            fontSize: 14,
            cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
            opacity: currentSlide === 0 ? 0.5 : 1,
          }}
        >
          ← Previous
        </button>

        <button
          onClick={handleNext}
          style={{
            padding: '12px 32px',
            borderRadius: 50,
            border: 'none',
            background: `linear-gradient(135deg, ${colors.accent} 0%, ${isDark ? 'rgba(160, 120, 80, 0.9)' : 'rgba(180, 140, 90, 0.9)'} 100%)`,
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isLastSlide ? 'Complete ✓' : 'Next →'}
        </button>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}