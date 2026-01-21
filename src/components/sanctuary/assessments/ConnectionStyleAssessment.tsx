'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { AssessmentProps, AssessmentResults, Question } from './shared/types';
import QuestionRenderer from './shared/QuestionRenderer';

const QUESTIONS: Question[] = [
  // Attachment Security (5 questions)
  {
    id: 'attachment_1',
    text: 'How comfortable are you depending on others?',
    type: 'slider',
    category: 'attachment',
    min: 1,
    max: 10,
    minLabel: 'Very uncomfortable',
    maxLabel: 'Completely comfortable',
  },
  {
    id: 'attachment_2',
    text: 'When someone close to you is unavailable, you typically:',
    type: 'choice',
    options: [
      { value: 1, label: 'Feel anxious or abandoned — need reassurance' },
      { value: 2, label: 'Feel hurt but try not to show it' },
      { value: 3, label: 'Feel disappointed but manage okay' },
      { value: 4, label: "Feel fine — trust they'll be back" },
    ],
    category: 'attachment',
  },
  {
    id: 'attachment_3',
    text: 'How secure do you feel in your closest relationships?',
    type: 'scale',
    options: [
      { value: 1, label: 'Often insecure', description: 'Worry about being left or rejected' },
      { value: 2, label: 'Sometimes insecure', description: 'Depends on the relationship' },
      { value: 3, label: 'Mostly secure', description: 'Generally feel stable' },
      { value: 4, label: 'Very secure', description: 'Trust in my connections' },
    ],
    category: 'attachment',
  },
  {
    id: 'attachment_4',
    text: 'Your belief about whether people will be there for you:',
    type: 'choice',
    options: [
      { value: 1, label: 'People usually let me down eventually' },
      { value: 2, label: "I'm not sure — it varies a lot" },
      { value: 3, label: 'Most people are reliable if I choose well' },
      { value: 4, label: 'I trust that people who love me will show up' },
    ],
    category: 'attachment',
  },
  {
    id: 'attachment_5',
    text: 'How easily do you trust new people?',
    type: 'slider',
    category: 'attachment',
    min: 1,
    max: 10,
    minLabel: 'Very slowly — trust is earned',
    maxLabel: 'Fairly easily — open by default',
  },

  // Boundary Clarity (4 questions)
  {
    id: 'boundaries_1',
    text: 'How clear are you about your own boundaries?',
    type: 'scale',
    options: [
      { value: 1, label: 'Unclear', description: "I'm not sure what my limits are" },
      { value: 2, label: 'Somewhat clear', description: 'I know some but not all' },
      { value: 3, label: 'Mostly clear', description: 'I generally know my limits' },
      { value: 4, label: 'Very clear', description: 'I have a strong sense of my boundaries' },
    ],
    category: 'boundaries',
  },
  {
    id: 'boundaries_2',
    text: 'How comfortable are you saying "no" to people you care about?',
    type: 'slider',
    category: 'boundaries',
    min: 1,
    max: 10,
    minLabel: 'Very difficult',
    maxLabel: 'Comfortable when needed',
  },
  {
    id: 'boundaries_3',
    text: 'When someone crosses a boundary, you typically:',
    type: 'choice',
    options: [
      { value: 1, label: 'Say nothing — avoid conflict' },
      { value: 2, label: 'Hint at it — hope they notice' },
      { value: 3, label: 'Address it eventually — after building courage' },
      { value: 4, label: 'Speak up clearly — in the moment or soon after' },
    ],
    category: 'boundaries',
  },
  {
    id: 'boundaries_4',
    text: "How often do you feel responsible for other people's emotions?",
    type: 'scale',
    options: [
      { value: 1, label: 'Almost always', description: 'I feel I need to fix their feelings' },
      { value: 2, label: 'Often', description: 'Frequently take on their emotions' },
      { value: 3, label: 'Sometimes', description: 'With certain people' },
      { value: 4, label: 'Rarely', description: 'I can separate their feelings from mine' },
    ],
    category: 'boundaries',
  },

  // Intimacy Comfort (4 questions)
  {
    id: 'intimacy_1',
    text: 'How comfortable are you with emotional closeness?',
    type: 'slider',
    category: 'intimacy',
    min: 1,
    max: 10,
    minLabel: 'Uncomfortable — feels vulnerable',
    maxLabel: 'Very comfortable — I seek it',
  },
  {
    id: 'intimacy_2',
    text: 'When a relationship starts getting close, you:',
    type: 'choice',
    options: [
      { value: 1, label: 'Pull back — it feels too intense' },
      { value: 2, label: 'Get nervous — worry about getting hurt' },
      { value: 3, label: 'Proceed cautiously — but stay open' },
      { value: 4, label: 'Lean in — closeness is what I want' },
    ],
    category: 'intimacy',
  },
  {
    id: 'intimacy_3',
    text: 'How much do you share your inner world with close others?',
    type: 'scale',
    options: [
      { value: 1, label: 'Very little', description: 'I keep most things private' },
      { value: 2, label: 'Some things', description: 'Surface level mostly' },
      { value: 3, label: 'A fair amount', description: 'The important things' },
      { value: 4, label: 'Most everything', description: "I'm an open book with trusted people" },
    ],
    category: 'intimacy',
  },
  {
    id: 'intimacy_4',
    text: 'Physical affection in close relationships feels:',
    type: 'choice',
    options: [
      { value: 1, label: "Uncomfortable — I'm not very physical" },
      { value: 2, label: 'Okay in small doses — but not too much' },
      { value: 3, label: 'Good — I enjoy appropriate affection' },
      { value: 4, label: 'Essential — touch is important to me' },
    ],
    category: 'intimacy',
  },

  // Independence Need (4 questions)
  {
    id: 'independence_1',
    text: 'How much alone time do you need to feel like yourself?',
    type: 'slider',
    category: 'independence',
    min: 1,
    max: 10,
    minLabel: 'Very little — I prefer company',
    maxLabel: 'A lot — solitude is essential',
  },
  {
    id: 'independence_2',
    text: 'In relationships, you tend to:',
    type: 'choice',
    options: [
      { value: 4, label: 'Merge — we become "we"' },
      { value: 3, label: 'Stay close — but maintain some separateness' },
      { value: 2, label: 'Keep space — togetherness can feel suffocating' },
      { value: 1, label: "Stay independent — relationships shouldn't change who I am" },
    ],
    category: 'independence',
  },
  {
    id: 'independence_3',
    text: 'How do you feel when a partner or close friend wants more time together?',
    type: 'scale',
    options: [
      { value: 1, label: 'Overwhelmed', description: 'I need my space' },
      { value: 2, label: 'Slightly pressured', description: 'But I can accommodate' },
      { value: 3, label: 'Generally positive', description: 'Nice to be wanted' },
      { value: 4, label: 'Happy', description: 'I love spending time together' },
    ],
    category: 'independence',
  },
  {
    id: 'independence_4',
    text: 'Your ideal relationship balance is:',
    type: 'choice',
    options: [
      { value: 1, label: 'Mostly independent — occasional togetherness' },
      { value: 2, label: 'Balanced independence — regular but not constant contact' },
      { value: 3, label: 'Balanced closeness — frequent connection with some space' },
      { value: 4, label: 'Very close — as much togetherness as possible' },
    ],
    category: 'independence',
  },

  // Conflict Style (4 questions)
  {
    id: 'conflict_1',
    text: 'When conflict arises in a relationship, your instinct is to:',
    type: 'choice',
    options: [
      { value: 1, label: 'Avoid — hope it goes away' },
      { value: 2, label: 'Accommodate — give in to keep peace' },
      { value: 3, label: "Discuss — when I've calmed down" },
      { value: 4, label: 'Address — talk it through directly' },
    ],
    category: 'conflict',
  },
  {
    id: 'conflict_2',
    text: 'How comfortable are you expressing anger or frustration to loved ones?',
    type: 'slider',
    category: 'conflict',
    min: 1,
    max: 10,
    minLabel: 'Very uncomfortable',
    maxLabel: 'Comfortable when appropriate',
  },
  {
    id: 'conflict_3',
    text: 'After an argument with someone close, you typically:',
    type: 'scale',
    options: [
      { value: 1, label: 'Ruminate', description: "Can't stop thinking about it" },
      { value: 2, label: 'Withdraw', description: 'Need significant time alone' },
      { value: 3, label: 'Process', description: 'Think it through, then reconnect' },
      { value: 4, label: 'Repair quickly', description: 'Want to resolve and reconnect' },
    ],
    category: 'conflict',
  },
  {
    id: 'conflict_4',
    text: 'Your relationship to conflict is:',
    type: 'choice',
    options: [
      { value: 1, label: 'Conflict is dangerous — avoid at all costs' },
      { value: 2, label: 'Conflict is uncomfortable — minimize when possible' },
      { value: 3, label: 'Conflict is normal — handle it when needed' },
      { value: 4, label: 'Conflict can be growth — sometimes necessary and valuable' },
    ],
    category: 'conflict',
  },
];

const CONNECTION_STYLES = {
  secure: {
    name: 'The Secure Connector',
    description: 'You approach relationships from a foundation of trust and worthiness. You can be close without losing yourself, and independent without pushing others away.',
    signs: ['Comfortable with closeness', 'Steady communication', 'Healthy boundaries', 'Trust in repair'],
    strengths: ['Comfortable with intimacy and independence', 'Clear communication', 'Healthy boundaries', 'Trust in self and others'],
    challenges: ["May not understand others' attachment struggles", 'Could be thrown by very anxious or avoidant partners'],
    shadow: 'May overlook how dysregulating inconsistency can feel for others',
    needsFromOthers: 'Consistency, honesty, mutual respect, and shared vulnerability',
    tools: ['Direct communication', 'Repair after rupture', 'Boundary maintenance', 'Mutual vulnerability'],
    color: '#7BA05B',
  },
  anxious: {
    name: 'The Seeking Connector',
    description: "You crave closeness and connection deeply. You're attuned to relationships and highly responsive to others, though you may worry about abandonment or not being enough.",
    signs: ['High attunement to shifts', 'Strong desire for closeness', 'Needs reassurance', 'Sensitive to distance'],
    strengths: ['Deeply caring', 'Emotionally attuned', 'Committed to relationships', 'Willing to work on connection'],
    challenges: ['Fear of abandonment', 'May need frequent reassurance', 'Can lose yourself in relationships'],
    shadow: 'May interpret distance as rejection, creating protest cycles',
    needsFromOthers: 'Consistent reassurance, reliability, clear communication about feelings, patience with your needs',
    tools: ['Self-soothing', 'Naming needs clearly', 'Reality-checking stories', 'Secure supports'],
    color: '#E8B86D',
  },
  avoidant: {
    name: 'The Independent Connector',
    description: "You value your autonomy and self-sufficiency. You connect best when you don't feel pressured, and you need significant space to feel like yourself.",
    signs: ['Needs space to regulate', 'Slow to trust vulnerability', 'Values autonomy', 'Withdraws under pressure'],
    strengths: ['Self-reliant', 'Calm under pressure', "Respects others' space", 'Emotionally stable'],
    challenges: ['May seem distant or unavailable', 'Difficulty with vulnerability', 'Can push people away when they get close'],
    shadow: 'May confuse independence with disconnection, missing support',
    needsFromOthers: 'Space and patience, respect for your independence, low-pressure invitations to connect',
    tools: ['Small vulnerability reps', 'Stay present in discomfort', 'Warm re-connection rituals', 'Gentle bids for closeness'],
    color: '#6B9BC3',
  },
  anxiousAvoidant: {
    name: 'The Conflicted Connector',
    description: 'You experience a push-pull in relationships — wanting closeness but fearing it too. This can create confusion for you and others as you move toward and away.',
    signs: ['Push-pull dynamics', 'Mixed signals', 'Closeness feels unsafe', 'Distance feels unsafe'],
    strengths: ['Deep capacity for connection', 'Self-awareness about patterns', 'Resilience through difficulty'],
    challenges: ['Mixed signals', 'Fear of both abandonment and engulfment', 'Relationships can feel chaotic'],
    shadow: 'May repeat intensity cycles that mimic early attachment wounds',
    needsFromOthers: 'Extraordinary patience, consistent safety, slow building of trust, acceptance of your complexity',
    tools: ['Track triggers', 'Slow the pace', 'Clear agreements', 'Repair and reflection'],
    color: '#A78BB3',
  },
  boundaried: {
    name: 'The Boundaried Connector',
    description: 'You have strong clarity about where you end and others begin. You connect meaningfully while maintaining a clear sense of self.',
    signs: ['Clear limits', 'Strong self-definition', 'Says no when needed', 'Protects energy'],
    strengths: ['Clear boundaries', 'Healthy self-concept', 'Can say no', "Doesn't lose self in relationships"],
    challenges: ['May seem guarded', 'Others might want more access', 'Can prioritize boundaries over connection'],
    shadow: 'May protect so well that intimacy can feel out of reach',
    needsFromOthers: 'Respect for your limits, no pressure to merge, appreciation of your clarity',
    tools: ['Boundaries + warmth', 'Selective intimacy', 'Values-based yes/no', 'Reassurance through consistency'],
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
      attachment: [] as number[],
      boundaries: [] as number[],
      intimacy: [] as number[],
      independence: [] as number[],
      conflict: [] as number[],
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
      attachmentSecurity: normalize(categories.attachment),
      boundaryClarity: normalize(categories.boundaries),
      intimacyComfort: normalize(categories.intimacy),
      independenceNeed: normalize(categories.independence),
      conflictStyle: normalize(categories.conflict),
    };

    const { connectionStyle, secondaryStyle } = determineConnectionStyle(scores);
    const insights = generateInsights(scores, connectionStyle);
    const recommendations = generateRecommendations(scores, connectionStyle);
    const relationshipStrengths = CONNECTION_STYLES[connectionStyle as keyof typeof CONNECTION_STYLES]?.strengths || [];

    return {
      ...scores,
      connectionStyle,
      secondaryStyle,
      insights,
      recommendations,
      relationshipStrengths,
    };
  };

  const determineConnectionStyle = (scores: Record<string, number>) => {
    let connectionStyle = 'secure';
    let secondaryStyle = 'boundaried';

    const { attachmentSecurity, boundaryClarity, intimacyComfort, independenceNeed } = scores;

    if (attachmentSecurity > 65 && boundaryClarity > 60 && intimacyComfort > 55) {
      connectionStyle = 'secure';
      secondaryStyle = boundaryClarity > 70 ? 'boundaried' : 'anxious';
    } else if (attachmentSecurity < 50 && intimacyComfort > 50 && independenceNeed < 60) {
      connectionStyle = 'anxious';
      secondaryStyle = boundaryClarity < 50 ? 'anxiousAvoidant' : 'secure';
    } else if (intimacyComfort < 50 && independenceNeed > 60) {
      connectionStyle = 'avoidant';
      secondaryStyle = attachmentSecurity < 50 ? 'anxiousAvoidant' : 'boundaried';
    } else if (attachmentSecurity < 45 && ((intimacyComfort < 50 && independenceNeed < 50) || (intimacyComfort > 50 && independenceNeed > 50))) {
      connectionStyle = 'anxiousAvoidant';
      secondaryStyle = intimacyComfort > independenceNeed ? 'anxious' : 'avoidant';
    } else if (boundaryClarity > 70) {
      connectionStyle = 'boundaried';
      secondaryStyle = attachmentSecurity > 60 ? 'secure' : 'avoidant';
    } else {
      if (independenceNeed > intimacyComfort) {
        connectionStyle = 'avoidant';
        secondaryStyle = 'boundaried';
      } else {
        connectionStyle = 'anxious';
        secondaryStyle = 'secure';
      }
    }

    return { connectionStyle, secondaryStyle };
  };

  const generateInsights = (scores: Record<string, number>, style: string): string[] => {
    const insights: string[] = [];

    const styleData = CONNECTION_STYLES[style as keyof typeof CONNECTION_STYLES];
    if (styleData) {
      insights.push(`As ${styleData.name}, ${styleData.description.toLowerCase()}`);
    }

    if (scores.attachmentSecurity < 45) {
      insights.push("Your attachment security is an area for growth. Past experiences may have taught you that relationships aren't safe, but this can change with awareness and the right connections.");
    } else if (scores.attachmentSecurity > 70) {
      insights.push('You have a strong foundation of attachment security. This allows you to navigate relationships with confidence and resilience.');
    }

    if (scores.boundaryClarity < 45) {
      insights.push("Clarifying your boundaries is essential for healthier relationships. When you don't know your limits, others can't respect them.");
    } else if (scores.boundaryClarity > 70) {
      insights.push('Your boundary clarity is a significant strength. You know where you end and others begin, which protects your wellbeing.');
    }

    if (scores.intimacyComfort < 45 && scores.independenceNeed > 60) {
      insights.push('You prioritize independence over intimacy. While self-reliance is valuable, consider whether fear might be limiting the closeness available to you.');
    }

    if (scores.intimacyComfort > 70 && scores.boundaryClarity < 50) {
      insights.push('Your openness to intimacy is beautiful, but without clear boundaries, you may lose yourself in relationships or attract those who take advantage.');
    }

    if (scores.conflictStyle < 45) {
      insights.push("Your relationship with conflict is an edge for growth. Avoiding disagreement doesn't make it disappear — it often makes things worse over time.");
    }

    return insights.slice(0, 4);
  };

  const generateRecommendations = (scores: Record<string, number>, style: string): string[] => {
    const recs: string[] = [];

    switch (style) {
      case 'secure':
        recs.push('Continue building on your secure foundation. Model healthy relating for others and choose partners who can meet your capacity for intimacy.');
        recs.push('Use your security to support others who struggle with attachment. Your steadiness can be healing for those with insecure patterns.');
        break;
      case 'anxious':
        recs.push('Practice self-soothing when anxiety arises. Before seeking reassurance from others, try giving yourself the comfort you need.');
        recs.push('Work on tolerating uncertainty in relationships. Not every moment of distance means something is wrong.');
        recs.push('Choose partners who are consistent and communicative. Avoidant partners will trigger your deepest fears.');
        break;
      case 'avoidant':
        recs.push('Practice staying present when intimacy increases, even when you feel the urge to pull away. Notice the discomfort without acting on it.');
        recs.push('Share something vulnerable with a trusted person this week. Small acts of openness can gradually expand your comfort zone.');
        recs.push("Recognize that needing others isn't weakness. Interdependence is healthy and human.");
        break;
      case 'anxiousAvoidant':
        recs.push('Therapy or coaching can be especially valuable for your pattern. The push-pull dynamic often has roots that benefit from professional support.');
        recs.push("Practice noticing when you're moving toward or away from connection. Awareness is the first step to choice.");
        recs.push('Seek extraordinarily patient, secure partners who can hold steady while you learn to trust.');
        break;
      case 'boundaried':
        recs.push('Ensure your boundaries serve connection, not just protection. Sometimes letting people in requires softening your edges.');
        recs.push('Practice saying yes to intimacy even when it feels vulnerable. Your boundaries will still be there if you need them.');
        break;
    }

    if (scores.conflictStyle < 50) {
      recs.push('Practice expressing small disagreements. Building your conflict muscle with low-stakes issues prepares you for bigger ones.');
    }

    if (scores.boundaryClarity < 50) {
      recs.push("Spend time clarifying your boundaries. Journal about what feels okay and not okay in relationships. Clarity precedes communication.");
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