'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface AssessmentProps {
  onBack: () => void;
  onComplete?: (results: AssessmentResults) => void;
}

interface AssessmentResults {
  emotionalAwareness: number;
  emotionalExpression: number;
  emotionalRegulation: number;
  emotionalDepth: number;
  emotionalResilience: number;
  dominantPattern: string;
  secondaryPattern: string;
  insights: string[];
  recommendations: string[];
}

interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: 'scale' | 'choice' | 'slider';
  options?: { value: number; label: string; description?: string }[];
  category: 'awareness' | 'expression' | 'regulation' | 'depth' | 'resilience';
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

const QUESTIONS: Question[] = [
  // Emotional Awareness
  {
    id: 'awareness_1',
    text: 'When you wake up, how often do you notice your emotional state?',
    subtext: 'Before checking your phone or starting your day',
    type: 'scale',
    options: [
      { value: 1, label: 'Rarely', description: 'I usually start on autopilot' },
      { value: 2, label: 'Sometimes', description: 'I notice it once I get going' },
      { value: 3, label: 'Often', description: 'I check in most mornings' },
      { value: 4, label: 'Almost always', description: 'I notice it quickly and clearly' },
    ],
    category: 'awareness',
  },

  // Emotional Depth
  {
    id: 'depth_1',
    text: 'How often do you experience complex, layered emotions?',
    subtext: 'For example: feeling happy and sad simultaneously',
    type: 'scale',
    options: [
      { value: 1, label: 'Rarely', description: 'My emotions are usually simple' },
      { value: 2, label: 'Sometimes', description: 'In significant moments' },
      { value: 3, label: 'Often', description: 'I notice layers frequently' },
      { value: 4, label: 'Regularly', description: 'Most emotions have depth' },
    ],
    category: 'depth',
  },
  {
    id: 'depth_2',
    text: 'How deeply do you allow yourself to feel positive emotions?',
    subtext: 'Joy, love, awe, gratitude',
    type: 'slider',
    category: 'depth',
    min: 1,
    max: 10,
    minLabel: 'I keep them contained',
    maxLabel: 'I let them fill me completely',
  },
  {
    id: 'depth_3',
    text: 'When you encounter beauty — in nature, art, music, or connection — you:',
    type: 'choice',
    options: [
      { value: 1, label: "Notice it intellectually but don't feel much" },
      { value: 2, label: 'Feel a mild pleasant response' },
      { value: 3, label: 'Feel genuinely moved' },
      { value: 4, label: 'Can be brought to tears or profound feeling' },
    ],
    category: 'depth',
  },
  {
    id: 'depth_4',
    text: 'How connected do you feel to the emotional experiences of others?',
    subtext: 'Their joys, sorrows, fears, and hopes',
    type: 'slider',
    category: 'depth',
    min: 1,
    max: 10,
    minLabel: 'Somewhat distant',
    maxLabel: 'Deeply connected',
  },
  {
    id: 'depth_5',
    text: 'Your emotional life feels:',
    type: 'choice',
    options: [
      { value: 1, label: 'Flat — not much variation or intensity' },
      { value: 2, label: 'Moderate — some ups and downs' },
      { value: 3, label: 'Rich — a full range of experiences' },
      { value: 4, label: 'Vivid — deeply felt and colorful' },
    ],
    category: 'depth',
  },

  // Emotional Resilience
  {
    id: 'resilience_1',
    text: 'After a significant disappointment or loss, you typically:',
    type: 'choice',
    options: [
      { value: 1, label: 'Struggle for a long time to move forward' },
      { value: 2, label: 'Eventually adapt, but it takes significant effort' },
      { value: 3, label: 'Process it and gradually find your footing' },
      { value: 4, label: 'Feel the pain fully, then integrate and grow' },
    ],
    category: 'resilience',
  },
  {
    id: 'resilience_2',
    text: 'How much do difficult emotions interfere with your daily functioning?',
    type: 'slider',
    category: 'resilience',
    min: 1,
    max: 10,
    minLabel: 'They often derail me',
    maxLabel: 'I function well even when struggling',
  },
  {
    id: 'resilience_3',
    text: 'When facing emotional pain, you tend to:',
    type: 'choice',
    options: [
      { value: 1, label: 'Avoid it as much as possible' },
      { value: 2, label: 'Acknowledge it reluctantly' },
      { value: 3, label: 'Face it when necessary' },
      { value: 4, label: 'Welcome it as part of being fully alive' },
    ],
    category: 'resilience',
  },
  {
    id: 'resilience_4',
    text: 'How confident are you in your ability to handle whatever emotions arise?',
    type: 'slider',
    category: 'resilience',
    min: 1,
    max: 10,
    minLabel: 'Not confident',
    maxLabel: 'Very confident',
  },
  {
    id: 'resilience_5',
    text: 'Looking back on difficult emotional experiences in your life:',
    type: 'scale',
    options: [
      { value: 1, label: 'They still weigh heavily on me' },
      { value: 2, label: "I've survived but carry scars" },
      { value: 3, label: "I've healed and learned from them" },
      { value: 4, label: "They've become sources of wisdom and strength" },
    ],
    category: 'resilience',
  },
];

const PATTERNS = {
  guardian: {
    name: 'The Guardian',
    description: 'You approach emotions with careful protection, keeping vulnerable feelings safely contained while maintaining stability for yourself and others.',
    signs: ['Stable under pressure', 'Selective vulnerability', 'Protective instincts', 'Keeps things contained'],
    strengths: ['Emotional stability', 'Reliability under pressure', 'Protecting others'],
    growthAreas: ['Allowing vulnerability', 'Expressing needs', 'Receiving support'],
    shadow: 'May over-control emotions, limiting intimacy and support',
    tools: ['Safe vulnerability', 'Ask for support', 'Name needs clearly', 'Gentle expression'],
    color: '#6B9BC3',
  },
  feeler: {
    name: 'The Deep Feeler',
    description: "You experience emotions with remarkable depth and richness, feeling life's joys and sorrows with full intensity.",
    signs: ['Strong emotional intensity', 'Deep empathy', 'Sensitive to beauty/pain', 'Feels life fully'],
    strengths: ['Emotional depth', 'Empathy', 'Authentic connection', 'Appreciating beauty'],
    growthAreas: ['Boundaries', "Not absorbing others' emotions", 'Self-protection'],
    shadow: "May become overwhelmed or absorb emotions that aren't yours",
    tools: ['Boundaries', 'Grounding', 'Somatic settling', 'Emotional labeling'],
    color: '#A78BB3',
  },
  processor: {
    name: 'The Processor',
    description: 'You engage with emotions thoughtfully and analytically, seeking to understand and make meaning from your inner experiences.',
    signs: ['Makes meaning through thinking', 'Reflective', 'Seeks patterns', 'Analyzes feelings'],
    strengths: ['Self-reflection', 'Emotional insight', 'Learning from experience'],
    growthAreas: ['Spontaneous expression', 'Feeling without analyzing', 'Being in the moment'],
    shadow: 'May stay in analysis to avoid fully feeling',
    tools: ['Name + feel', 'Body tracking', 'Time-limited analysis', 'Present-moment practice'],
    color: '#7BA05B',
  },
  expresser: {
    name: 'The Expresser',
    description: 'You live your emotional life out loud, sharing your inner world freely and inviting others into authentic connection.',
    signs: ['Shares openly', 'Invites intimacy', 'Emotionally direct', 'Expressive energy'],
    strengths: ['Authentic expression', 'Emotional honesty', 'Creating intimacy'],
    growthAreas: ['Selective sharing', 'Containing when needed', 'Reading the room'],
    shadow: 'May share faster than a space can hold, risking regret',
    tools: ['Pause before sharing', 'Consent check-ins', 'Containment', 'Right-person sharing'],
    color: '#E8B86D',
  },
  navigator: {
    name: 'The Navigator',
    description: 'You move through emotional experiences with skill and awareness, neither avoiding nor being overwhelmed by what you feel.',
    signs: ['Balanced awareness', 'Flexible responding', 'Recovers well', 'Uses tools effectively'],
    strengths: ['Emotional intelligence', 'Balanced responding', 'Adaptive capacity'],
    growthAreas: ['Continued growth', 'Helping others navigate', 'Deeper exploration'],
    shadow: "May assume you're \"done\" growing; regulation is ongoing practice",
    tools: ['Maintain practices', 'Supportive reflection', 'Growth edges', 'Deepening capacity'],
    color: '#C4956A',
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

export default function InnerLandscapeAssessment({ onBack, onComplete }: AssessmentProps) {
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
      const calculated = calculateResults(newAnswers);
      setResults(calculated);
      setPhase('report');
      onComplete?.(calculated);
    }
  };

  const handleSliderSubmit = () => {
    handleAnswer(sliderValue);
  };

  const calculateResults = (allAnswers: Record<string, number>): AssessmentResults => {
    const categories = {
      awareness: [] as number[],
      expression: [] as number[],
      regulation: [] as number[],
      depth: [] as number[],
      resilience: [] as number[],
    };

    QUESTIONS.forEach((q) => {
      if (allAnswers[q.id]) {
        categories[q.category].push(allAnswers[q.id]);
      }
    });

    const normalize = (arr: number[]) => {
      if (arr.length === 0) return 50;
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
      const maxPossible = arr.some((v) => v > 4) ? 10 : 4;
      return Math.round((avg / maxPossible) * 100);
    };

    const scores = {
      emotionalAwareness: normalize(categories.awareness),
      emotionalExpression: normalize(categories.expression),
      emotionalRegulation: normalize(categories.regulation),
      emotionalDepth: normalize(categories.depth),
      emotionalResilience: normalize(categories.resilience),
    };

    const { dominantPattern, secondaryPattern } = determinePatterns(scores);
    const insights = generateInsights(scores, dominantPattern);
    const recommendations = generateRecommendations(scores, dominantPattern);

    return {
      ...scores,
      dominantPattern,
      secondaryPattern,
      insights,
      recommendations,
    };
  };

  const determinePatterns = (scores: Record<string, number>) => {
    let dominant = 'navigator';
    let secondary = 'processor';

    const { emotionalAwareness, emotionalExpression, emotionalRegulation, emotionalDepth, emotionalResilience } = scores;

    if (emotionalRegulation > 70 && emotionalExpression < 50) {
      dominant = 'guardian';
    } else if (emotionalDepth > 70 && emotionalAwareness > 60) {
      dominant = 'feeler';
    } else if (emotionalExpression > 70) {
      dominant = 'expresser';
    } else if (emotionalAwareness > 70 && emotionalExpression < 60) {
      dominant = 'processor';
    } else if (Object.values(scores).every((s) => s > 55)) {
      dominant = 'navigator';
    }

    if (dominant === 'guardian' && emotionalDepth > 50) secondary = 'feeler';
    else if (dominant === 'feeler' && emotionalRegulation > 50) secondary = 'navigator';
    else if (dominant === 'expresser' && emotionalAwareness > 60) secondary = 'processor';
    else if (dominant === 'processor' && emotionalDepth > 60) secondary = 'feeler';
    else secondary = dominant === 'navigator' ? 'processor' : 'navigator';

    return { dominantPattern: dominant, secondaryPattern: secondary };
  };

  const generateInsights = (scores: Record<string, number>, pattern: string): string[] => {
    const insights: string[] = [];

    const patternData = PATTERNS[pattern as keyof typeof PATTERNS];
    if (patternData) {
      insights.push(`As ${patternData.name}, ${patternData.description.toLowerCase()}`);
    }

    if (scores.emotionalAwareness > 70) {
      insights.push('You possess a refined ability to notice and name your emotional states — a foundation for all emotional intelligence.');
    } else if (scores.emotionalAwareness < 40) {
      insights.push('Your emotional awareness is an area ripe for development. Building this skill will unlock deeper self-understanding.');
    }

    if (scores.emotionalDepth > 70) {
      insights.push('You experience life with remarkable emotional richness. This depth allows for profound connection and appreciation of beauty.');
    }

    if (scores.emotionalRegulation > 70) {
      insights.push("You have strong capacity to navigate intense emotions without being overwhelmed — a powerful resource for life's challenges.");
    } else if (scores.emotionalRegulation < 40) {
      insights.push('Building your emotional regulation toolkit could help you feel more stable and confident when strong feelings arise.');
    }

    if (scores.emotionalExpression < 40 && scores.emotionalDepth > 50) {
      insights.push('You feel deeply but express selectively. While this protects you, it may also limit the intimacy available in your relationships.');
    }

    if (scores.emotionalResilience > 70) {
      insights.push("You've developed remarkable resilience — the ability to experience pain fully while continuing to grow and move forward.");
    }

    return insights.slice(0, 4);
  };

  const generateRecommendations = (scores: Record<string, number>, pattern: string): string[] => {
    const recs: string[] = [];

    const patternData = PATTERNS[pattern as keyof typeof PATTERNS];
    if (patternData && patternData.growthAreas.length > 0) {
      recs.push(`Focus on ${patternData.growthAreas[0].toLowerCase()} as your next growth edge.`);
    }

    if (scores.emotionalAwareness < 60) {
      recs.push('Practice daily emotional check-ins: pause three times a day to ask "What am I feeling right now?" and name it specifically.');
    }

    if (scores.emotionalExpression < 50) {
      recs.push('Experiment with sharing one vulnerable feeling per week with someone you trust. Start small and notice what happens.');
    }

    if (scores.emotionalRegulation < 50) {
      recs.push('Build your regulation toolkit: try breath work, grounding exercises, or body-based practices when emotions feel intense.');
    }

    if (scores.emotionalDepth < 50) {
      recs.push('Create space for emotional depth: spend time in nature, with art, or in meaningful conversation without rushing.');
    }

    if (scores.emotionalResilience < 50) {
      recs.push('Practice self-compassion when facing difficulty. Speak to yourself as you would to a dear friend who is struggling.');
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
            }}>
              <svg viewBox="0 0 48 48" style={{ width: 40, height: 40 }}>
                <path 
                  d="M24 6 C18 6 12 10 12 18 C12 26 18 34 24 42 C30 34 36 26 36 18 C36 10 30 6 24 6" 
                  fill="none" 
                  stroke={accentColor} 
                  strokeWidth="1.5" 
                />
                <circle cx="24" cy="18" r="4" fill={accentColor} opacity="0.5" />
                <path d="M24 22 L24 30" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                <path d="M20 26 L24 30 L28 26" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
              </svg>
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 32,
              fontWeight: 300,
              color: textColor,
              marginBottom: 8,
            }}>
              Inner Landscape
            </h1>

            <p style={{
              fontSize: 16,
              color: accentColor,
              marginBottom: 16,
            }}>
              Emotional Patterns
            </p>

            <p style={{
              fontSize: 15,
              color: mutedColor,
              maxWidth: 320,
              lineHeight: 1.6,
              marginBottom: 32,
            }}>
              A gentle exploration of your emotional world — how you experience, express, and navigate your inner life.
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
                <div style={{ fontSize: 15, color: textColor, fontWeight: 500 }}>~8 min</div>
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

            {/* Scale/Choice Options */}
            {(question.type === 'scale' || question.type === 'choice') && question.options && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {question.options.map((option, i) => (
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
            )}

            {/* Slider */}
            {question.type === 'slider' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ padding: '0 8px' }}>
                  <input
                    type="range"
                    min={question.min || 1}
                    max={question.max || 10}
                    value={sliderValue}
                    onChange={(e) => setSliderValue(parseInt(e.target.value))}
                    className="slider-input"
                    style={{
                      width: '100%',
                      background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${((sliderValue - 1) / 9) * 100}%, ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'} ${((sliderValue - 1) / 9) * 100}%, ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'} 100%)`,
                      cursor: 'pointer',
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginTop: 16,
                  }}>
                    <span style={{ fontSize: 12, color: mutedColor, maxWidth: '35%' }}>
                      {question.minLabel}
                    </span>
                    <span style={{
                      fontSize: 32,
                      fontWeight: 300,
                      color: accentColor,
                      lineHeight: 1,
                    }}>
                      {sliderValue}
                    </span>
                    <span style={{ fontSize: 12, color: mutedColor, maxWidth: '35%', textAlign: 'right' }}>
                      {question.maxLabel}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSliderSubmit}
                  style={{
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
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // ============================================================================
  // REPORT SCREEN
  // ============================================================================
  if (phase === 'report' && results) {
    const primary = PATTERNS[results.dominantPattern as keyof typeof PATTERNS];
    const secondary = PATTERNS[results.secondaryPattern as keyof typeof PATTERNS];

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
              {/* Primary Pattern Card */}
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
                      <path 
                        d="M16 4 C12 4 8 7 8 12 C8 17 12 22 16 28 C20 22 24 17 24 12 C24 7 20 4 16 4" 
                        fill="none" 
                        stroke={primary.color} 
                        strokeWidth="1.5" 
                      />
                      <circle cx="16" cy="12" r="3" fill={primary.color} opacity="0.5" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: primary.color, marginBottom: 2 }}>
                      Your Primary Pattern
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
                  Signs of Your Pattern
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

              {/* Emotional Profile Scores */}
              <div style={{
                padding: 20,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 16,
                marginBottom: 16,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 16 }}>
                  Your Emotional Profile
                </h3>
                {[
                  { label: 'Awareness', value: results.emotionalAwareness, color: '#6B9BC3' },
                  { label: 'Expression', value: results.emotionalExpression, color: '#E8B86D' },
                  { label: 'Regulation', value: results.emotionalRegulation, color: '#7BA05B' },
                  { label: 'Depth', value: results.emotionalDepth, color: '#A78BB3' },
                  { label: 'Resilience', value: results.emotionalResilience, color: '#C4956A' },
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
                  Your Toolkit
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

              {/* Secondary Pattern */}
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
                    This pattern also shapes how you relate to your emotional world. Draw on its strengths when your primary pattern needs balance.
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