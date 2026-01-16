// ============================================================================
// DYNAMIC ASSESSMENT VIEWER
// ============================================================================
// Renders assessments stored in Supabase (from admin generator)
// Add to: src/components/sanctuary/DynamicAssessmentViewer.tsx

'use client';

import { useState, useMemo } from 'react';

type AssessmentQuestion = {
  id: string;
  text: string;
  subtext?: string;
  options: { value: number; label: string; description?: string }[];
  category?: string;
};

type AssessmentResultType = {
  id: string;
  name: string;
  description: string;
  signs?: string[];
  strengths?: string[];
  shadow?: string;
  tools?: string[];
  color: string;
};

type DynamicAssessmentProps = {
  assessment: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    questions: AssessmentQuestion[];
    result_types: AssessmentResultType[];
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

export default function DynamicAssessmentViewer({
  assessment,
  onBack,
  onComplete,
  colors,
  isDark
}: DynamicAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const questions = assessment.questions;
  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Calculate result based on answers
  const result = useMemo(() => {
    if (!showResults) return null;

    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const avgScore = totalScore / Object.keys(answers).length;
    
    // Simple algorithm: map average score to result types
    // You can customize this based on your assessment logic
    const resultTypes = assessment.result_types;
    const index = Math.min(
      Math.floor((avgScore / 4) * resultTypes.length),
      resultTypes.length - 1
    );
    
    return resultTypes[index] || resultTypes[0];
  }, [showResults, answers, assessment.result_types]);

  const handleSelectOption = (value: number) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    setAnswers({ ...answers, [question.id]: selectedOption });

    if (isLastQuestion) {
      setShowResults(true);
      onComplete?.();
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[questions[currentQuestion - 1].id] || null);
    }
  };

  // Results Screen
  if (showResults && result) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: colors.bg,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <header style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
            ← Back to Library
          </button>
        </header>

        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <div style={{
            maxWidth: 500,
            width: '100%',
            animation: 'fadeIn 0.5s ease-out',
          }}>
            {/* Result Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: 32,
            }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: result.color + '20',
                border: `2px solid ${result.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <span style={{ fontSize: 32 }}>✨</span>
              </div>

              <p style={{
                fontSize: 14,
                color: colors.textMuted,
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>
                Your Result
              </p>

              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 32,
                fontWeight: 300,
                color: colors.text,
                marginBottom: 12,
              }}>
                {result.name}
              </h1>

              <p style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: colors.textMuted,
              }}>
                {result.description}
              </p>
            </div>

            {/* Signs */}
            {result.signs && result.signs.length > 0 && (
              <div style={{
                marginBottom: 24,
                padding: '20px',
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 16,
              }}>
                <h3 style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.accent,
                  marginBottom: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Signs You Might Notice
                </h3>
                <ul style={{
                  margin: 0,
                  paddingLeft: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}>
                  {result.signs.map((sign, idx) => (
                    <li key={idx} style={{
                      fontSize: 15,
                      color: colors.text,
                      lineHeight: 1.5,
                    }}>
                      {sign}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strengths */}
            {result.strengths && result.strengths.length > 0 && (
              <div style={{
                marginBottom: 24,
                padding: '20px',
                background: isDark ? 'rgba(100, 200, 150, 0.08)' : 'rgba(80, 180, 120, 0.08)',
                border: `1px solid ${isDark ? 'rgba(100, 200, 150, 0.2)' : 'rgba(80, 180, 120, 0.2)'}`,
                borderRadius: 16,
              }}>
                <h3 style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: isDark ? 'rgba(100, 200, 150, 1)' : 'rgba(60, 150, 100, 1)',
                  marginBottom: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Your Strengths
                </h3>
                <ul style={{
                  margin: 0,
                  paddingLeft: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}>
                  {result.strengths.map((strength, idx) => (
                    <li key={idx} style={{
                      fontSize: 15,
                      color: colors.text,
                      lineHeight: 1.5,
                    }}>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Shadow */}
            {result.shadow && (
              <div style={{
                marginBottom: 24,
                padding: '20px',
                background: isDark ? 'rgba(255, 180, 100, 0.08)' : 'rgba(200, 160, 100, 0.08)',
                border: `1px solid ${isDark ? 'rgba(255, 180, 100, 0.2)' : 'rgba(200, 160, 100, 0.2)'}`,
                borderRadius: 16,
              }}>
                <h3 style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.accent,
                  marginBottom: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Watch Out For
                </h3>
                <p style={{
                  fontSize: 15,
                  color: colors.text,
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {result.shadow}
                </p>
              </div>
            )}

            {/* Tools */}
            {result.tools && result.tools.length > 0 && (
              <div style={{
                marginBottom: 24,
                padding: '20px',
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 16,
              }}>
                <h3 style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.accent,
                  marginBottom: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Tools That May Help
                </h3>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  {result.tools.map((tool, idx) => (
                    <span key={idx} style={{
                      padding: '8px 14px',
                      background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                      borderRadius: 20,
                      fontSize: 13,
                      color: colors.text,
                    }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Done Button */}
            <button
              onClick={onBack}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 50,
                border: 'none',
                background: `linear-gradient(135deg, ${colors.accent} 0%, ${isDark ? 'rgba(160, 120, 80, 0.9)' : 'rgba(180, 140, 90, 0.9)'} 100%)`,
                color: 'white',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: 16,
              }}
            >
              Done
            </button>
          </div>
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

  // Question Screen
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
          ← Exit
        </button>
        
        <span style={{
          fontSize: 12,
          color: colors.textMuted,
        }}>
          {currentQuestion + 1} of {questions.length}
        </span>
      </header>

      {/* Progress Bar */}
      <div style={{
        height: 3,
        background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: colors.accent,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Question Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          maxWidth: 500,
          width: '100%',
          animation: 'fadeIn 0.4s ease-out',
        }}>
          {/* Question */}
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 24,
            fontWeight: 400,
            color: colors.text,
            marginBottom: question.subtext ? 12 : 32,
            textAlign: 'center',
            lineHeight: 1.4,
          }}>
            {question.text}
          </h2>

          {question.subtext && (
            <p style={{
              fontSize: 14,
              color: colors.textMuted,
              textAlign: 'center',
              marginBottom: 32,
            }}>
              {question.subtext}
            </p>
          )}

          {/* Options */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelectOption(option.value)}
                style={{
                  padding: '18px 20px',
                  background: selectedOption === option.value
                    ? (isDark ? 'rgba(255, 180, 100, 0.15)' : 'rgba(200, 160, 100, 0.15)')
                    : colors.cardBg,
                  border: `1px solid ${selectedOption === option.value
                    ? colors.accent
                    : colors.cardBorder}`,
                  borderRadius: 14,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: colors.text,
                  marginBottom: option.description ? 4 : 0,
                }}>
                  {option.label}
                </div>
                {option.description && (
                  <div style={{
                    fontSize: 13,
                    color: colors.textMuted,
                  }}>
                    {option.description}
                  </div>
                )}
              </button>
            ))}
          </div>
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
          disabled={currentQuestion === 0}
          style={{
            padding: '12px 24px',
            borderRadius: 50,
            border: `1px solid ${colors.cardBorder}`,
            background: 'transparent',
            color: currentQuestion === 0 ? colors.textMuted : colors.text,
            fontSize: 14,
            cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
            opacity: currentQuestion === 0 ? 0.5 : 1,
          }}
        >
          ← Back
        </button>

        <button
          onClick={handleNext}
          disabled={selectedOption === null}
          style={{
            padding: '12px 32px',
            borderRadius: 50,
            border: 'none',
            background: selectedOption !== null
              ? `linear-gradient(135deg, ${colors.accent} 0%, ${isDark ? 'rgba(160, 120, 80, 0.9)' : 'rgba(180, 140, 90, 0.9)'} 100%)`
              : (isDark ? 'rgba(255, 180, 100, 0.2)' : 'rgba(180, 150, 100, 0.3)'),
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            cursor: selectedOption !== null ? 'pointer' : 'not-allowed',
          }}
        >
          {isLastQuestion ? 'See Results' : 'Continue →'}
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