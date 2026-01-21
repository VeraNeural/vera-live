'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { AssessmentProps, AssessmentResults, Question } from './shared/types';

const QUESTIONS: Question[] = [
  {
    id: 'activation_1',
    text: 'What is your baseline state most days?',
    subtext: 'Before anything stressful happens',
    options: [
      { value: 1, label: 'Already activated', description: 'Tense, alert, on edge' },
      { value: 2, label: 'Slightly elevated', description: 'A background hum of stress' },
      { value: 3, label: 'Mostly calm', description: 'Generally settled' },
      { value: 4, label: 'Relaxed', description: 'At ease, grounded' },
    ],
    category: 'activation',
  },
  {
    id: 'activation_2',
    text: 'How quickly does your body react to stress?',
    options: [
      { value: 1, label: 'Instant', description: '0 to 100 immediately' },
      { value: 2, label: 'Fast', description: 'Within seconds' },
      { value: 3, label: 'Moderate', description: 'Builds over minutes' },
      { value: 4, label: 'Gradual', description: 'Slow to activate' },
    ],
    category: 'activation',
  },
  {
    id: 'activation_3',
    text: 'When stressed, what happens in your body?',
    subtext: 'Choose the most prominent',
    options: [
      { value: 1, label: 'Racing heart & rapid breathing', description: 'Panic-like symptoms' },
      { value: 2, label: 'Muscle tension', description: 'Clenched jaw, tight shoulders' },
      { value: 3, label: 'Stomach issues', description: 'Nausea, appetite changes' },
      { value: 4, label: 'Fatigue & heaviness', description: 'Wanting to shut down' },
    ],
    category: 'activation',
  },
  {
    id: 'recovery_1',
    text: 'After stress, how long to calm down?',
    options: [
      { value: 1, label: 'Hours or days', description: 'I stay activated a long time' },
      { value: 2, label: 'An hour or more', description: 'Takes significant time' },
      { value: 3, label: '15-30 minutes', description: 'Moderate recovery' },
      { value: 4, label: 'Minutes', description: 'I settle quickly' },
    ],
    category: 'recovery',
  },
  {
    id: 'recovery_2',
    text: 'How well can you sleep after a stressful day?',
    options: [
      { value: 1, label: 'Very poorly', description: 'Mind races for hours' },
      { value: 2, label: 'With difficulty', description: 'Takes a long time' },
      { value: 3, label: 'Usually okay', description: 'Some delay but manageable' },
      { value: 4, label: 'Well', description: 'I can let go' },
    ],
    category: 'recovery',
  },
  {
    id: 'recovery_3',
    text: 'When the stressor is removed, your body:',
    options: [
      { value: 1, label: 'Stays tense', description: 'Like waiting for the next threat' },
      { value: 2, label: 'Slowly unwinds', description: 'Holds residual tension' },
      { value: 3, label: 'Gradually relaxes', description: 'Over time' },
      { value: 4, label: 'Releases quickly', description: 'Returns to baseline' },
    ],
    category: 'recovery',
  },
  {
    id: 'triggers_1',
    text: 'How well do you know your stress triggers?',
    options: [
      { value: 1, label: 'Not well', description: 'Stress seems random' },
      { value: 2, label: 'Somewhat', description: 'I know the obvious ones' },
      { value: 3, label: 'Pretty well', description: 'I can anticipate most' },
      { value: 4, label: 'Very well', description: 'I have a clear map' },
    ],
    category: 'triggers',
  },
  {
    id: 'triggers_2',
    text: 'How early do you notice stress building?',
    options: [
      { value: 1, label: 'Only when overwhelmed', description: 'Too late to intervene' },
      { value: 2, label: 'When it\'s strong', description: 'Mid-activation' },
      { value: 3, label: 'Fairly early', description: 'With some buildup' },
      { value: 4, label: 'At the first signs', description: 'Very attuned' },
    ],
    category: 'triggers',
  },
  {
    id: 'coping_1',
    text: 'How many strategies do you have for stress?',
    options: [
      { value: 1, label: 'Very few', description: 'I mostly just endure' },
      { value: 2, label: 'A couple', description: 'One or two go-tos' },
      { value: 3, label: 'Several', description: 'A decent toolkit' },
      { value: 4, label: 'Many', description: 'A full range of options' },
    ],
    category: 'coping',
  },
  {
    id: 'coping_2',
    text: 'When your usual coping methods don\'t work:',
    options: [
      { value: 1, label: 'Feel stuck', description: 'Don\'t know what else to try' },
      { value: 2, label: 'Push harder', description: 'Do more of the same' },
      { value: 3, label: 'Eventually adapt', description: 'Try something different' },
      { value: 4, label: 'Flexibly adjust', description: 'Have backup strategies' },
    ],
    category: 'coping',
  },
  {
    id: 'window_1',
    text: 'How much stress before feeling overwhelmed?',
    options: [
      { value: 1, label: 'Very little', description: 'Low threshold' },
      { value: 2, label: 'Moderate amount', description: 'Average capacity' },
      { value: 3, label: 'Quite a bit', description: 'Good tolerance' },
      { value: 4, label: 'A lot', description: 'High capacity' },
    ],
    category: 'window',
  },
  {
    id: 'window_2',
    text: 'How often do you feel emotionally dysregulated?',
    subtext: 'Overwhelmed, numb, or out of control',
    options: [
      { value: 1, label: 'Daily', description: 'It\'s my normal state' },
      { value: 2, label: 'Several times a week', description: 'Quite frequently' },
      { value: 3, label: 'Weekly or less', description: 'Occasionally' },
      { value: 4, label: 'Rarely', description: 'I usually stay regulated' },
    ],
    category: 'window',
  },
];

const STRESS_RESPONSES = {
  fight: {
    name: 'The Fighter',
    emoji: '⚔️',
    description: 'Your nervous system responds to stress with activation and action. You meet challenges head-on, sometimes with intensity.',
    signs: ['Irritability under stress', 'Urge to take action', 'Frustration with obstacles', 'Tension and restlessness'],
    shadow: 'May become aggressive, controlling, or burn out from constant pushing',
    strengths: ['Takes initiative', 'Protective of others', 'Gets things done', 'Doesn\'t avoid problems'],
    tools: ['Physical exercise', 'Healthy anger expression', 'Channel energy productively', 'Cool-down practices'],
    color: '#C47070',
  },
  flight: {
    name: 'The Flyer',
    emoji: '🦋',
    description: 'Your nervous system responds with urgency to escape or avoid. You\'re highly attuned to threats and skilled at anticipating problems.',
    signs: ['Anxiety and worry', 'Avoidance of conflict', 'Busy-ness and overthinking', 'Difficulty being still'],
    shadow: 'May become anxious, avoidant, or exhaust yourself running from perceived threats',
    strengths: ['Anticipates problems', 'Plans ahead', 'Quick thinking', 'Highly aware'],
    tools: ['Grounding practices', 'Calming breathwork', 'Gradual exposure', 'Settling techniques'],
    color: '#E8B86D',
  },
  freeze: {
    name: 'The Freezer',
    emoji: '🧊',
    description: 'Your nervous system responds by shutting down and conserving energy. This protects you by reducing visibility to threats.',
    signs: ['Numbing out under stress', 'Difficulty taking action', 'Feeling stuck or paralyzed', 'Spacing out'],
    shadow: 'May become depressed, disconnected, or unable to engage with life fully',
    strengths: ['Can endure difficult situations', 'Observant', 'Patient', 'Non-reactive'],
    tools: ['Gentle movement', 'Warmth and safety', 'Small activating steps', 'Connection with safe people'],
    color: '#6B9BC3',
  },
  fawn: {
    name: 'The Connector',
    emoji: '🤝',
    description: 'Your nervous system responds by prioritizing others\' needs. You\'ve learned that safety comes through connection and accommodation.',
    signs: ['People-pleasing under stress', 'Difficulty saying no', 'Hypervigilance to moods', 'Losing yourself'],
    shadow: 'May lose sense of self, enable harmful dynamics, or exhaust yourself caring for others',
    strengths: ['Empathetic', 'Builds relationships', 'Reads people well', 'Creates harmony'],
    tools: ['Boundary setting', 'Self-connection', 'Tolerating others\' discomfort', 'Validating your needs'],
    color: '#A78BB3',
  },
  regulated: {
    name: 'The Balanced',
    emoji: '⚖️',
    description: 'Your nervous system has developed good capacity to move through stress and return to balance. You experience activation but don\'t get stuck.',
    signs: ['Flexible responses', 'Quick recovery', 'Awareness of states', 'Multiple strategies'],
    shadow: 'May still have specific triggers; regulation is a practice, not a destination',
    strengths: ['Resilient', 'Adaptable', 'Self-aware', 'Emotionally intelligent'],
    tools: ['Continue practices', 'Support others', 'Maintain balance', 'Explore growth edges'],
    color: '#7BA05B',
  },
};

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
      const calculated = calculateResults(newAnswers);
      setResults(calculated);
      setPhase('report');
      onComplete?.(calculated);
    }
  };

  const calculateResults = (allAnswers: Record<string, number>): AssessmentResults => {
    const categories = {
      activation: [] as number[],
      recovery: [] as number[],
      triggers: [] as number[],
      coping: [] as number[],
      window: [] as number[],
    };

    QUESTIONS.forEach((q) => {
      if (allAnswers[q.id]) {
        categories[q.category as keyof typeof categories].push(allAnswers[q.id]);
      }
    });

    const normalize = (arr: number[]) => {
      if (arr.length === 0) return 50;
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
      return Math.round((avg / 4) * 100);
    };

    const scores = {
      activationLevel: normalize(categories.activation),
      recoveryCapacity: normalize(categories.recovery),
      triggerAwareness: normalize(categories.triggers),
      copingFlexibility: normalize(categories.coping),
      windowOfTolerance: normalize(categories.window),
    };

    const { stressResponse, secondaryResponse } = determineStressResponse(scores, allAnswers);
    const insights = generateInsights(scores, stressResponse);
    const recommendations = generateRecommendations(scores, stressResponse);
    const regulationTools = STRESS_RESPONSES[stressResponse as keyof typeof STRESS_RESPONSES]?.tools || [];

    return { ...scores, stressResponse, secondaryResponse, insights, recommendations, regulationTools };
  };

  const determineStressResponse = (scores: Record<string, number>, ans: Record<string, number>) => {
    let stressResponse = 'regulated';
    let secondaryResponse = 'flight';

    const bodyResponse = ans['activation_3'] || 1;
    const avgScore = (scores.activationLevel + scores.recoveryCapacity + scores.windowOfTolerance) / 3;

    if (avgScore > 70) {
      stressResponse = 'regulated';
    } else if (bodyResponse === 1) {
      stressResponse = 'flight';
    } else if (bodyResponse === 2) {
      stressResponse = 'fight';
    } else if (bodyResponse === 4 || avgScore < 35) {
      stressResponse = 'freeze';
    } else if (scores.copingFlexibility < 40) {
      stressResponse = 'fawn';
    } else {
      stressResponse = 'flight';
    }

    const responses = ['fight', 'flight', 'freeze', 'fawn'];
    secondaryResponse = responses.find(r => r !== stressResponse) || 'flight';

    return { stressResponse, secondaryResponse };
  };

  const generateInsights = (scores: Record<string, number>, response: string): string[] => {
    const insights: string[] = [];
    const data = STRESS_RESPONSES[response as keyof typeof STRESS_RESPONSES];
    
    if (data) {
      insights.push(`Your primary stress response is ${data.name}. ${data.description}`);
    }

    if (scores.activationLevel < 40) {
      insights.push('Your baseline nervous system state is elevated. You may be living with chronic activation that feels "normal" but is taxing your system.');
    } else if (scores.activationLevel > 70) {
      insights.push('You have a calm baseline state. Your nervous system starts from a regulated place, which gives you more capacity to handle stress.');
    }

    if (scores.recoveryCapacity < 40) {
      insights.push('Your recovery capacity needs attention. Your system has difficulty completing stress cycles, which means activation accumulates.');
    } else if (scores.recoveryCapacity > 70) {
      insights.push('You recover well from stress. Your nervous system knows how to return to baseline, which is a significant strength.');
    }

    if (scores.windowOfTolerance < 40) {
      insights.push('Your window of tolerance is narrower than ideal. You may move into overwhelm or shutdown more easily than you\'d like.');
    }

    return insights.slice(0, 4);
  };

  const generateRecommendations = (scores: Record<string, number>, response: string): string[] => {
    const recs: string[] = [];
    const data = STRESS_RESPONSES[response as keyof typeof STRESS_RESPONSES];

    if (data) {
      recs.push(`As ${data.name}, focus on: ${data.tools.slice(0, 2).join(' and ')}.`);
    }

    if (scores.recoveryCapacity < 50) {
      recs.push('Build recovery rituals into your day — transition practices, wind-down routines, and completion rituals for stressful tasks.');
    }

    if (scores.windowOfTolerance < 50) {
      recs.push('Work on expanding your window of tolerance through small challenges followed by successful regulation.');
    }

    if (scores.triggerAwareness < 50) {
      recs.push('Practice noticing your body\'s early warning signs. Catching stress early gives you more options.');
    }

    if (scores.copingFlexibility < 50) {
      recs.push('Expand your coping toolkit. Different situations call for different strategies.');
    }

    return recs.slice(0, 4);
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