'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { AssessmentProps, AssessmentResults } from './shared/types';
import QuestionRenderer from './shared/QuestionRenderer';
import { CONNECTION_STYLE_QUESTIONS as QUESTIONS } from './data/connectionStyleQuestions';
import { CONNECTION_STYLES, calculateResults } from './scoring/connectionStyleScoring';

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
  
  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  .assess-option {
    transition: all 0.2s ease;
  }
  .assess-option:hover {
    transform: translateY(-2px);
  }
  .assess-option:active {
    transform: scale(0.98);
  }

  .assess-scroll::-webkit-scrollbar {
    width: 4px;
  }
  .assess-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .assess-scroll::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
  }

  .progress-bar {
    transition: width 0.4s ease;
  }

  .slider-input {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    border-radius: 3px;
    outline: none;
  }
  .slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
  .slider-input::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
`;

export default function ConnectionStyleAssessment({ onBack, onComplete }: AssessmentProps) {
  const { isDark, colors } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<'intro' | 'questions' | 'report'>('intro');
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [sliderValue, setSliderValue] = useState(5);

  const bgColor = colors.bg;
  const textColor = colors.text;
  const mutedColor = colors.textMuted;
  const accentColor = colors.accent;
  const cardBg = colors.cardBg;
  const cardBorder = colors.cardBorder;

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSliderValue(5);
      }, 250);
    } else {
      const calculated = calculateResults(newAnswers, QUESTIONS);
      setResults(calculated);
      setPhase('report');
      onComplete?.(calculated);
    }
  };

  const handleSliderSubmit = () => {
    handleAnswer(sliderValue);
  };

  // ============================================================================
  // INTRO SCREEN
  // ============================================================================
  if (phase === 'intro') {
    return (
      <>
        <style>{STYLES}</style>
        <div style={{
          position: 'fixed',
          inset: 0,
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
          }}>
            <button
              onClick={onBack}
              style={{
                padding: '10px 18px',
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 50,
                cursor: 'pointer',
                fontSize: 14,
                color: mutedColor,
              }}
            >
              ← Back
            </button>
          </header>

          {/* Content */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
            animation: 'fadeIn 0.5s ease',
          }}>
            {/* Icon */}
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${accentColor}22 0%, ${accentColor}11 100%)`,
              border: `1px solid ${accentColor}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}>
              <svg viewBox="0 0 48 48" style={{ width: 40, height: 40 }}>
                <circle cx="18" cy="20" r="8" fill="none" stroke={accentColor} strokeWidth="1.5" />
                <circle cx="30" cy="20" r="8" fill="none" stroke={accentColor} strokeWidth="1.5" />
                <path d="M24 14 L24 26" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                <path d="M18 32 C18 36 24 40 24 40 C24 40 30 36 30 32" stroke={accentColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 32,
              fontWeight: 300,
              color: textColor,
              marginBottom: 8,
            }}>
              Connection Style
            </h1>

            <p style={{
              fontSize: 16,
              color: accentColor,
              marginBottom: 16,
            }}>
              Relationships & Boundaries
            </p>

            <p style={{
              fontSize: 15,
              color: mutedColor,
              maxWidth: 320,
              lineHeight: 1.6,
              marginBottom: 32,
            }}>
              Explore how you connect with others — your needs, your patterns, and what helps you thrive in relationships.
            </p>

            {/* Info Cards */}
            <div style={{
              display: 'flex',
              gap: 12,
              marginBottom: 40,
            }}>
              <div style={{
                padding: '12px 20px',
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 12,
              }}>
                <div style={{ fontSize: 13, color: mutedColor }}>Duration</div>
                <div style={{ fontSize: 15, color: textColor, fontWeight: 500 }}>~12 min</div>
              </div>
              <div style={{
                padding: '12px 20px',
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 12,
              }}>
                <div style={{ fontSize: 13, color: mutedColor }}>Questions</div>
                <div style={{ fontSize: 15, color: textColor, fontWeight: 500 }}>{QUESTIONS.length}</div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => setPhase('questions')}
              style={{
                padding: '16px 48px',
                background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
                border: 'none',
                borderRadius: 50,
                color: '#fff',
                fontSize: 16,
                fontWeight: 500,
                cursor: 'pointer',
                boxShadow: `0 4px 20px ${accentColor}44`,
              }}
            >
              Begin Assessment
            </button>
          </div>
        </div>
      </>
    );
  }

  // ============================================================================
  // QUESTIONS SCREEN
  // ============================================================================
  if (phase === 'questions') {
    return (
      <>
        <style>{STYLES}</style>
        <div style={{
          position: 'fixed',
          inset: 0,
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
                fontSize: 13,
                color: mutedColor,
              }}
            >
              ✕
            </button>
            <span style={{ fontSize: 13, color: mutedColor }}>
              {currentQuestion + 1} of {QUESTIONS.length}
            </span>
            <div style={{ width: 50 }} />
          </header>

          {/* Progress Bar */}
          <div style={{ padding: '0 20px', marginBottom: 24 }}>
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

          {/* Question */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '0 24px',
            animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{
                fontSize: 22,
                fontWeight: 500,
                color: textColor,
                lineHeight: 1.4,
                marginBottom: question.subtext ? 8 : 0,
              }}>
                {question.text}
              </h2>
              {question.subtext && (
                <p style={{ fontSize: 14, color: mutedColor }}>
                  {question.subtext}
                </p>
              )}
            </div>

            {/* Render Question using QuestionRenderer component */}
            <QuestionRenderer question={question} handleAnswer={handleAnswer} />
          </div>
        </div>
      </>
    );
  }

  // ============================================================================
  // REPORT SCREEN
  // ============================================================================
  if (phase === 'report' && results) {
    const primary = CONNECTION_STYLES[results.connectionStyle as keyof typeof CONNECTION_STYLES];
    const secondary = CONNECTION_STYLES[results.secondaryStyle as keyof typeof CONNECTION_STYLES];

    return (
      <>
        <style>{STYLES}</style>
        <div style={{
          position: 'fixed',
          inset: 0,
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
                padding: '10px 18px',
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 50,
                cursor: 'pointer',
                fontSize: 14,
                color: mutedColor,
              }}
            >
              ← Back
            </button>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: mutedColor,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Your Results
            </span>
            <div style={{ width: 80 }} />
          </header>

          {/* Scrollable Content */}
          <div
            className="assess-scroll"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px',
              paddingBottom: 'max(40px, env(safe-area-inset-bottom))',
            }}
          >
            <div style={{ maxWidth: 500, margin: '0 auto' }}>
              {/* Primary Style Card */}
              <div style={{
                padding: 24,
                background: `linear-gradient(135deg, ${primary.color}15 0%, ${primary.color}08 100%)`,
                border: `1px solid ${primary.color}33`,
                borderRadius: 20,
                marginBottom: 20,
                animation: 'fadeInScale 0.5s ease',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 16,
                }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: `${primary.color}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg viewBox="0 0 32 32" style={{ width: 28, height: 28 }}>
                      <circle cx="12" cy="14" r="5" fill="none" stroke={primary.color} strokeWidth="1.5" />
                      <circle cx="20" cy="14" r="5" fill="none" stroke={primary.color} strokeWidth="1.5" />
                      <path d="M12 22 C12 25 16 28 16 28 C16 28 20 25 20 22" stroke={primary.color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: primary.color, marginBottom: 2 }}>
                      Your Primary Style
                    </div>
                    <div style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 26,
                      fontWeight: 400,
                      color: textColor,
                    }}>
                      {primary.name}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 15, color: mutedColor, lineHeight: 1.6 }}>
                  {primary.description}
                </p>
              </div>

              {/* What You Need */}
              <div style={{
                padding: 16,
                background: `${primary.color}15`,
                border: `1px solid ${primary.color}25`,
                borderRadius: 12,
                marginBottom: 16,
              }}>
                <div style={{ fontSize: 12, color: primary.color, marginBottom: 4, fontWeight: 600 }}>What You Need From Others</div>
                <div style={{ fontSize: 14, color: textColor, lineHeight: 1.5 }}>{primary.needsFromOthers}</div>
              </div>

              {/* Signs */}
              <div style={{
                padding: 20,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 16,
                marginBottom: 16,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 12 }}>
                  Signs of Your Style
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {primary.signs.map((sign, i) => (
                    <span key={i} style={{
                      padding: '8px 14px',
                      background: `${primary.color}15`,
                      border: `1px solid ${primary.color}25`,
                      borderRadius: 20,
                      fontSize: 13,
                      color: textColor,
                    }}>
                      {sign}
                    </span>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div style={{
                padding: 20,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 16,
                marginBottom: 16,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 12 }}>
                  Your Strengths
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {primary.strengths.map((s, i) => (
                    <span key={i} style={{
                      padding: '8px 14px',
                      background: '#7BA05B15',
                      border: '1px solid #7BA05B25',
                      borderRadius: 20,
                      fontSize: 13,
                      color: textColor,
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Profile Scores */}
              <div style={{
                padding: 20,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 16,
                marginBottom: 16,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 16 }}>
                  Your Relationship Profile
                </h3>
                {[
                  { label: 'Attachment Security', value: results.attachmentSecurity as number, color: '#7BA05B' },
                  { label: 'Boundary Clarity', value: results.boundaryClarity as number, color: '#C4956A' },
                  { label: 'Intimacy Comfort', value: results.intimacyComfort as number, color: '#A78BB3' },
                  { label: 'Independence Need', value: results.independenceNeed as number, color: '#6B9BC3' },
                  { label: 'Conflict Capacity', value: results.conflictStyle as number, color: '#E8B86D' },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: i < 4 ? 16 : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 14, color: textColor }}>{item.label}</span>
                      <span style={{ fontSize: 14, color: item.value < 50 ? '#C47070' : item.color }}>
                        {item.value}%
                      </span>
                    </div>
                    <div style={{
                      height: 6,
                      background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${item.value}%`,
                        background: item.value < 50 ? '#C47070' : item.color,
                        borderRadius: 3,
                        transition: 'width 1s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Insights */}
              <div style={{
                padding: 20,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 16,
                marginBottom: 16,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 16 }}>
                  Key Insights
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {results.insights.map((insight, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12 }}>
                      <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: `${accentColor}22`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                      }}>
                        <span style={{ fontSize: 12, color: accentColor }}>{i + 1}</span>
                      </div>
                      <p style={{ fontSize: 14, color: mutedColor, lineHeight: 1.6 }}>
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div style={{
                padding: 20,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 16,
                marginBottom: 16,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 16 }}>
                  Your Growth Path
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {results.recommendations.map((rec, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12 }}>
                      <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: `${primary.color}22`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                      }}>
                        <span style={{ fontSize: 14, color: primary.color }}>→</span>
                      </div>
                      <p style={{ fontSize: 14, color: mutedColor, lineHeight: 1.6 }}>
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toolkit */}
              <div style={{
                padding: 20,
                background: `linear-gradient(135deg, ${primary.color}10 0%, transparent 100%)`,
                border: `1px solid ${primary.color}25`,
                borderRadius: 16,
                marginBottom: 16,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 12 }}>
                  Your Connection Toolkit
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {primary.tools.map((tool, i) => (
                    <span key={i} style={{
                      padding: '10px 16px',
                      background: `${primary.color}20`,
                      border: `1px solid ${primary.color}30`,
                      borderRadius: 20,
                      fontSize: 14,
                      color: textColor,
                    }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Secondary Style */}
              {secondary && (
                <div style={{
                  padding: 20,
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: 16,
                  marginBottom: 24,
                }}>
                  <div style={{ fontSize: 12, color: secondary.color, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Secondary Influence
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 500, color: textColor, marginBottom: 8 }}>
                    {secondary.name}
                  </h3>
                  <p style={{ fontSize: 14, color: mutedColor, lineHeight: 1.6 }}>
                    This style also shapes how you connect. Draw on its strengths when your primary pattern needs balance.
                  </p>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={onBack}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
                  border: 'none',
                  borderRadius: 50,
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Return to Library
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}