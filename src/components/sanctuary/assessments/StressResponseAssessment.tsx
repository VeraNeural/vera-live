'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { AssessmentProps, AssessmentResults } from './shared/types';
import { STRESS_RESPONSE_QUESTIONS as QUESTIONS } from './data/stressResponseQuestions';
import { STRESS_RESPONSES, calculateResults } from './scoring/stressResponseScoring';

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
`;

export default function StressResponseAssessment({ onBack, onComplete }: AssessmentProps) {
  const { isDark, colors } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<'intro' | 'questions' | 'report'>('intro');
  const [results, setResults] = useState<AssessmentResults | null>(null);

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
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 250);
    } else {
      const calculated = calculateResults(newAnswers, QUESTIONS);
      setResults(calculated);
      setPhase('report');
      onComplete?.(calculated);
    }
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
              fontSize: 36,
            }}>
              ⚡
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 32,
              fontWeight: 300,
              color: textColor,
              marginBottom: 8,
            }}>
              Stress Response
            </h1>

            <p style={{
              fontSize: 16,
              color: accentColor,
              marginBottom: 16,
            }}>
              Your Body's Patterns
            </p>

            <p style={{
              fontSize: 15,
              color: mutedColor,
              maxWidth: 320,
              lineHeight: 1.6,
              marginBottom: 32,
            }}>
              Understand how your nervous system responds to pressure — and discover regulation strategies that work for you.
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
                <div style={{ fontSize: 15, color: textColor, fontWeight: 500 }}>~5 min</div>
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

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {question.options?.map((option, i) => (
                <button
                  key={i}
                  className="assess-option"
                  onClick={() => handleAnswer(option.value)}
                  style={{
                    padding: '18px 20px',
                    background: cardBg,
                    border: `1px solid ${cardBorder}`,
                    borderRadius: 16,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: textColor,
                    marginBottom: option.description ? 4 : 0,
                  }}>
                    {option.label}
                  </div>
                  {option.description && (
                    <div style={{ fontSize: 13, color: mutedColor }}>
                      {option.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ============================================================================
  // REPORT SCREEN
  // ============================================================================
  if (phase === 'report' && results) {
    const primary = STRESS_RESPONSES[results.stressResponse as keyof typeof STRESS_RESPONSES];
    const secondary = STRESS_RESPONSES[results.secondaryResponse as keyof typeof STRESS_RESPONSES];

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
              {/* Primary Response Card */}
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
                    fontSize: 28,
                  }}>
                    {primary.emoji}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: primary.color, marginBottom: 2 }}>
                      Your Primary Response
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

              {/* Signs */}
              <div style={{
                padding: 20,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 16,
                marginBottom: 16,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 12 }}>
                  Signs of Your Response
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

              {/* Nervous System Scores */}
              <div style={{
                padding: 20,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 16,
                marginBottom: 16,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 16 }}>
                  Your Nervous System Profile
                </h3>
                {[
                  { label: 'Baseline Regulation', value: results.activationLevel as number, color: '#7BA05B' },
                  { label: 'Recovery Capacity', value: results.recoveryCapacity as number, color: '#6B9BC3' },
                  { label: 'Trigger Awareness', value: results.triggerAwareness as number, color: '#E8B86D' },
                  { label: 'Coping Flexibility', value: results.copingFlexibility as number, color: '#A78BB3' },
                  { label: 'Window of Tolerance', value: results.windowOfTolerance as number, color: '#C4956A' },
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
                  Your Regulation Path
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

              {/* Tools */}
              <div style={{
                padding: 20,
                background: `linear-gradient(135deg, ${primary.color}10 0%, transparent 100%)`,
                border: `1px solid ${primary.color}25`,
                borderRadius: 16,
                marginBottom: 24,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 12 }}>
                  Your Regulation Toolkit
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