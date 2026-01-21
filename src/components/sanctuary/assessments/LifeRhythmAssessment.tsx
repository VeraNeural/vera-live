'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { AssessmentProps, AssessmentResults } from './shared/types';
import { LIFE_RHYTHM_QUESTIONS as QUESTIONS } from './data/lifeRhythmQuestions';

const LIFE_RHYTHMS = {
  earlyBird: {
    name: 'The Early Bird',
    description: "Your energy rises with the sun. Mornings are your magic time — you're sharp, creative, and motivated before most people have had coffee. Honor this gift by protecting your mornings.",
    signs: ['Natural early wake-ups', 'Mental clarity before noon', 'Evening sleepiness', 'Best focus at dawn'],
    shadow: 'May feel out of sync with late-night culture or evening demands',
    strengths: ['Decisive mornings', 'Consistent early momentum', 'Strong daily structure', 'Clear start-of-day focus'],
    tools: ['Protect morning hours', 'Early movement', 'Evening wind-down', 'Consistent bedtime'],
    peakTime: 'Early morning (5am - 10am)',
    bestFor: ['Deep work first thing', 'Exercise in morning', 'Important meetings before noon', 'Early bedtime'],
    color: '#E8B86D',
  },
  nightOwl: {
    name: 'The Night Owl',
    description: "You come alive when the world quiets down. Evening and night are when your mind is sharpest and creativity flows. Society may not understand, but your rhythm is valid.",
    signs: ['Late-night clarity', 'Slow morning start', 'Energy rising after 5pm', 'Deep focus in quiet hours'],
    shadow: 'May feel pressured by early schedules or morning-first norms',
    strengths: ['Creative late focus', 'Strong evening flow', 'Adaptable night energy', 'Quiet-hour productivity'],
    tools: ['Negotiate later starts', 'Protect sleep window', 'Evening deep work', 'Gentle morning ramp'],
    peakTime: 'Evening to night (6pm - 2am)',
    bestFor: ['Creative work at night', 'Flexible schedules', 'Second-shift energy', 'Deep night focus'],
    color: '#6B9BC3',
  },
  balanced: {
    name: 'The Steady Rhythm',
    description: "You have a balanced energy pattern without extreme peaks or valleys. Mid-morning and early afternoon tend to be your best times. You're adaptable but still benefit from routine.",
    signs: ['Even energy baseline', 'Moderate daily peaks', 'Good schedule fit', 'Benefits from routine'],
    shadow: 'May drift into gradual depletion without noticing early signals',
    strengths: ['Reliable capacity', 'Adaptable pacing', 'Sustainable routines', 'Balanced productivity'],
    tools: ['Keep consistent rhythms', 'Midday resets', 'Protect breaks', 'Steady sleep window'],
    peakTime: 'Mid-morning to early afternoon (9am - 2pm)',
    bestFor: ['Standard schedules', 'Consistent daily rhythms', 'Moderate flexibility', 'Balanced productivity'],
    color: '#7BA05B',
  },
  waveRider: {
    name: 'The Wave Rider',
    description: "Your energy comes in waves — high intensity periods followed by necessary recovery. This isn't a flaw; it's your rhythm. Working with these waves, not against them, is key.",
    signs: ['High-intensity bursts', 'Recovery needs after effort', 'Variable daily output', 'Cyclical motivation'],
    shadow: "May overcommit during peaks and crash if recovery isn't protected",
    strengths: ['Powerful creative surges', 'Project-based intensity', 'Strong momentum in peaks', 'Clear recovery wisdom'],
    tools: ['Track waves', 'Buffer commitments', 'Plan recovery', 'Honor low-energy periods'],
    peakTime: 'Variable — ride the waves when they come',
    bestFor: ['Project-based work', 'Intense creative bursts', 'Flexible deadlines', 'Built-in recovery periods'],
    color: '#A78BB3',
  },
  seasonalShifter: {
    name: 'The Seasonal Shifter',
    description: "You're deeply connected to natural cycles. Your energy, mood, and needs shift significantly with the seasons. This ancient rhythm connects you to the earth but requires honoring.",
    signs: ['Energy shifts by season', 'Winter contraction needs', 'Summer expansion energy', 'High nature sensitivity'],
    shadow: 'May struggle in year-round uniform environments or expectations',
    strengths: ['Strong natural attunement', 'Seasonal planning wisdom', 'Deep restorative capacity', 'Connection to cycles'],
    tools: ['Seasonal planning', 'Light + nature', 'Adjust expectations', 'Cycle-aligned goals'],
    peakTime: 'Varies by season — summer expansion, winter contraction',
    bestFor: ['Seasonal planning', 'Aligning work with energy cycles', 'Nature connection', 'Flexible annual rhythms'],
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

export default function LifeRhythmAssessment({ onBack, onComplete }: AssessmentProps) {
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
      chronotype: [] as number[],
      energy: [] as number[],
      seasonal: [] as number[],
      alignment: [] as number[],
      recovery: [] as number[],
    };

    QUESTIONS.forEach((q) => {
      if (allAnswers[q.id]) {
        categories[q.category as keyof typeof categories].push(allAnswers[q.id]);
      }
    });

    const normalize = (arr: number[]) => {
      if (arr.length === 0) return 50;
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
      const maxPossible = arr.some((v) => v > 4) ? 10 : 4;
      return Math.round((avg / maxPossible) * 100);
    };

    const scores = {
      chronotype: normalize(categories.chronotype),
      energyStability: normalize(categories.energy),
      seasonalSensitivity: normalize(categories.seasonal),
      rhythmAlignment: normalize(categories.alignment),
      recoveryPattern: normalize(categories.recovery),
    };

    const { lifeRhythm, secondaryRhythm, peakHours } = determineLifeRhythm(scores);
    const insights = generateInsights(scores, lifeRhythm);
    const recommendations = generateRecommendations(scores, lifeRhythm);
    const optimalPractices = LIFE_RHYTHMS[lifeRhythm as keyof typeof LIFE_RHYTHMS]?.bestFor || [];

    return {
      ...scores,
      lifeRhythm,
      secondaryRhythm,
      peakHours,
      insights,
      recommendations,
      optimalPractices,
    };
  };

  const determineLifeRhythm = (scores: Record<string, number>) => {
    let lifeRhythm = 'balanced';
    let secondaryRhythm = 'waveRider';
    let peakHours = 'Mid-morning to early afternoon';

    const chronotypeScore = scores.chronotype;
    const seasonalScore = scores.seasonalSensitivity;
    const energyStability = scores.energyStability;
    const recoveryPattern = scores.recoveryPattern;

    if (chronotypeScore > 70) {
      lifeRhythm = 'earlyBird';
      peakHours = 'Early morning (5am - 10am)';
    } else if (chronotypeScore < 40) {
      lifeRhythm = 'nightOwl';
      peakHours = 'Evening to night (6pm - 2am)';
    }

    if (seasonalScore > 70) {
      if (lifeRhythm === 'balanced') {
        lifeRhythm = 'seasonalShifter';
      } else {
        secondaryRhythm = 'seasonalShifter';
      }
      peakHours = 'Varies by season';
    }

    if (energyStability < 40 || recoveryPattern < 40) {
      if (lifeRhythm === 'balanced') {
        lifeRhythm = 'waveRider';
        peakHours = 'Variable — ride the waves';
      } else {
        secondaryRhythm = 'waveRider';
      }
    }

    if (lifeRhythm === 'earlyBird') {
      secondaryRhythm = seasonalScore > 50 ? 'seasonalShifter' : 'balanced';
    } else if (lifeRhythm === 'nightOwl') {
      secondaryRhythm = energyStability < 50 ? 'waveRider' : 'balanced';
    } else if (lifeRhythm === 'seasonalShifter') {
      secondaryRhythm = chronotypeScore > 60 ? 'earlyBird' : chronotypeScore < 40 ? 'nightOwl' : 'balanced';
    } else if (lifeRhythm === 'waveRider') {
      secondaryRhythm = seasonalScore > 50 ? 'seasonalShifter' : 'balanced';
    }

    return { lifeRhythm, secondaryRhythm, peakHours };
  };

  const generateInsights = (scores: Record<string, number>, rhythm: string): string[] => {
    const insights: string[] = [];

    const rhythmData = LIFE_RHYTHMS[rhythm as keyof typeof LIFE_RHYTHMS];
    if (rhythmData) {
      insights.push(`You are ${rhythmData.name}. ${rhythmData.description}`);
    }

    if (scores.rhythmAlignment < 40) {
      insights.push("You're currently living out of sync with your natural rhythms. This misalignment is likely costing you energy, mood, and wellbeing.");
    } else if (scores.rhythmAlignment > 70) {
      insights.push("You're living in good alignment with your natural rhythms. This is a significant factor in your overall wellbeing.");
    }

    if (scores.energyStability < 40) {
      insights.push('Your energy fluctuates significantly. Understanding these patterns rather than fighting them will help you work with your natural waves.');
    }

    if (scores.seasonalSensitivity > 70) {
      insights.push("You're highly sensitive to seasonal changes. This isn't weakness — it's attunement to natural cycles. Plan your year accordingly.");
    }

    if (scores.recoveryPattern < 40) {
      insights.push("You need more recovery time than average. This isn't laziness — it's your system's requirement.");
    }

    return insights.slice(0, 4);
  };

  const generateRecommendations = (scores: Record<string, number>, rhythm: string): string[] => {
    const recs: string[] = [];

    switch (rhythm) {
      case 'earlyBird':
        recs.push('Protect your mornings fiercely. Schedule your most important work before noon.');
        recs.push('Create an evening wind-down routine that starts by 8pm. Your body wants to sleep early — honor it.');
        break;
      case 'nightOwl':
        recs.push('If possible, negotiate a later start time. Even one hour can make a significant difference.');
        recs.push('Use your night hours wisely — this is your peak time. Do creative and deep work when the world is quiet.');
        break;
      case 'balanced':
        recs.push("Maintain your steady rhythms — they're an asset. Consistent sleep, meals, and activity times keep you humming.");
        recs.push('Schedule demanding work in your mid-morning peak window.');
        break;
      case 'waveRider':
        recs.push('Track your energy waves to find patterns. When high energy comes, ride it. When low energy comes, rest.');
        recs.push("Build buffer time into your commitments. Your waves don't follow external schedules.");
        break;
      case 'seasonalShifter':
        recs.push('Plan your year seasonally. Big projects in high-energy season. More rest in low season.');
        recs.push('In winter, use light therapy, get outside midday, and reduce expectations.');
        break;
    }

    if (scores.rhythmAlignment < 50) {
      recs.push('Start with one small alignment change: adjust your sleep time by 30 minutes toward your natural rhythm.');
    }

    if (scores.recoveryPattern < 50) {
      recs.push("Build recovery into your schedule proactively. Plan rest before you're exhausted.");
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
                <circle cx="24" cy="24" r="16" fill="none" stroke={accentColor} strokeWidth="1.5" />
                <circle cx="24" cy="24" r="3" fill={accentColor} opacity="0.6" />
                <path d="M24 8 L24 14" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M24 34 L24 40" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 24 L14 24" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M34 24 L40 24" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M24 24 L24 16" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
                <path d="M24 24 L30 24" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 32,
              fontWeight: 300,
              color: textColor,
              marginBottom: 8,
            }}>
              Life Rhythm
            </h1>

            <p style={{
              fontSize: 16,
              color: accentColor,
              marginBottom: 16,
            }}>
              Energy & Natural Cycles
            </p>

            <p style={{
              fontSize: 15,
              color: mutedColor,
              maxWidth: 320,
              lineHeight: 1.6,
              marginBottom: 32,
            }}>
              Discover your natural energy patterns — when you peak, how you flow with seasons, and how to design your life around your unique rhythm.
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
                <div style={{ fontSize: 15, color: textColor, fontWeight: 500 }}>~10 min</div>
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
    const primary = LIFE_RHYTHMS[results.lifeRhythm as keyof typeof LIFE_RHYTHMS];
    const secondary = LIFE_RHYTHMS[results.secondaryRhythm as keyof typeof LIFE_RHYTHMS];

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
              {/* Primary Rhythm Card */}
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
                      <circle cx="16" cy="16" r="10" fill="none" stroke={primary.color} strokeWidth="1.5" />
                      <circle cx="16" cy="16" r="2" fill={primary.color} opacity="0.6" />
                      <path d="M16 6 L16 10" stroke={primary.color} strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M16 22 L16 26" stroke={primary.color} strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M6 16 L10 16" stroke={primary.color} strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M22 16 L26 16" stroke={primary.color} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: primary.color, marginBottom: 2 }}>
                      Your Primary Rhythm
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

              {/* Peak Hours */}
              <div style={{
                padding: 16,
                background: `${primary.color}15`,
                border: `1px solid ${primary.color}25`,
                borderRadius: 12,
                marginBottom: 16,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 12, color: primary.color, marginBottom: 4 }}>Your Peak Time</div>
                <div style={{ fontSize: 16, fontWeight: 500, color: textColor }}>{results.peakHours}</div>
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
                  Signs of Your Rhythm
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

              {/* Rhythm Profile Scores */}
              <div style={{
                padding: 20,
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 16,
                marginBottom: 16,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 16 }}>
                  Your Rhythm Profile
                </h3>
                {[
                  { label: 'Chronotype (Morning-Evening)', value: results.chronotype as number, color: '#E8B86D' },
                  { label: 'Energy Stability', value: results.energyStability as number, color: '#7BA05B' },
                  { label: 'Seasonal Sensitivity', value: results.seasonalSensitivity as number, color: '#C4956A' },
                  { label: 'Rhythm Alignment', value: results.rhythmAlignment as number, color: '#6B9BC3' },
                  { label: 'Recovery Capacity', value: results.recoveryPattern as number, color: '#A78BB3' },
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
                  Your Alignment Path
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

              {/* Rhythm Toolkit */}
              <div style={{
                padding: 20,
                background: `linear-gradient(135deg, ${primary.color}10 0%, transparent 100%)`,
                border: `1px solid ${primary.color}25`,
                borderRadius: 16,
                marginBottom: 16,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 12 }}>
                  Your Rhythm Toolkit
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

              {/* Secondary Rhythm */}
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
                    This rhythm also shapes your energy patterns. Consider its tools when your primary rhythm needs support.
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