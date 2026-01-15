'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface AssessmentProps {
  onBack: () => void;
  onComplete?: (results: AssessmentResults) => void;
}

interface AssessmentResults {
  attachmentSecurity: number;
  boundaryClarity: number;
  intimacyComfort: number;
  independenceNeed: number;
  conflictStyle: number;
  connectionStyle: string;
  secondaryStyle: string;
  insights: string[];
  recommendations: string[];
  relationshipStrengths: string[];
}

interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: 'scale' | 'choice' | 'slider';
  options?: { value: number; label: string; description?: string }[];
  category: 'attachment' | 'boundaries' | 'intimacy' | 'independence' | 'conflict';
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

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
      { value: 4, label: 'Feel fine — trust they\'ll be back' },
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
      { value: 2, label: 'I\'m not sure — it varies a lot' },
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
      { value: 1, label: 'Unclear', description: 'I\'m not sure what my limits are' },
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
    text: 'How often do you feel responsible for other people\'s emotions?',
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
      { value: 4, label: 'Most everything', description: 'I\'m an open book with trusted people' },
    ],
    category: 'intimacy',
  },
  {
    id: 'intimacy_4',
    text: 'Physical affection in close relationships feels:',
    type: 'choice',
    options: [
      { value: 1, label: 'Uncomfortable — I\'m not very physical' },
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
      { value: 1, label: 'Stay independent — relationships shouldn\'t change who I am' },
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
      { value: 3, label: 'Discuss — when I\'ve calmed down' },
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
      { value: 1, label: 'Ruminate', description: 'Can\'t stop thinking about it' },
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
    strengths: ['Comfortable with intimacy and independence', 'Clear communication', 'Healthy boundaries', 'Trust in self and others'],
    challenges: ['May not understand others\' attachment struggles', 'Could be thrown by very anxious or avoidant partners'],
    needsFromOthers: 'Consistency, honesty, mutual respect, and shared vulnerability',
    color: '#7BA05B',
  },
  anxious: {
    name: 'The Seeking Connector',
    description: 'You crave closeness and connection deeply. You\'re attuned to relationships and highly responsive to others, though you may worry about abandonment or not being enough.',
    strengths: ['Deeply caring', 'Emotionally attuned', 'Committed to relationships', 'Willing to work on connection'],
    challenges: ['Fear of abandonment', 'May need frequent reassurance', 'Can lose yourself in relationships'],
    needsFromOthers: 'Consistent reassurance, reliability, clear communication about feelings, patience with your needs',
    color: '#E8B86D',
  },
  avoidant: {
    name: 'The Independent Connector',
    description: 'You value your autonomy and self-sufficiency. You connect best when you don\'t feel pressured, and you need significant space to feel like yourself.',
    strengths: ['Self-reliant', 'Calm under pressure', 'Respects others\' space', 'Emotionally stable'],
    challenges: ['May seem distant or unavailable', 'Difficulty with vulnerability', 'Can push people away when they get close'],
    needsFromOthers: 'Space and patience, respect for your independence, low-pressure invitations to connect',
    color: '#6B9BC3',
  },
  anxiousAvoidant: {
    name: 'The Conflicted Connector',
    description: 'You experience a push-pull in relationships — wanting closeness but fearing it too. This can create confusion for you and others as you move toward and away.',
    strengths: ['Deep capacity for connection', 'Self-awareness about patterns', 'Resilience through difficulty'],
    challenges: ['Mixed signals', 'Fear of both abandonment and engulfment', 'Relationships can feel chaotic'],
    needsFromOthers: 'Extraordinary patience, consistent safety, slow building of trust, acceptance of your complexity',
    color: '#A78BB3',
  },
  boundaried: {
    name: 'The Boundaried Connector',
    description: 'You have strong clarity about where you end and others begin. You connect meaningfully while maintaining a clear sense of self.',
    strengths: ['Clear boundaries', 'Healthy self-concept', 'Can say no', 'Doesn\'t lose self in relationships'],
    challenges: ['May seem guarded', 'Others might want more access', 'Can prioritize boundaries over connection'],
    needsFromOthers: 'Respect for your limits, no pressure to merge, appreciation of your clarity',
    color: '#C4956A',
  },
};

export default function ConnectionStyleAssessment({ onBack, onComplete }: AssessmentProps) {
  const { isDark, colors } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showIntro, setShowIntro] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [sliderValue, setSliderValue] = useState(5);

  const bgColor = colors.bg;
  const textColor = colors.text;
  const mutedColor = colors.textMuted;
  const accentColor = colors.accent;
  const cardBg = colors.cardBg;

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSliderValue(5);
      }, 300);
    } else {
      const calculatedResults = calculateResults(newAnswers);
      setResults(calculatedResults);
      setShowReport(true);
      onComplete?.(calculatedResults);
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
      attachmentSecurity: normalize(categories.attachment),
      boundaryClarity: normalize(categories.boundaries),
      intimacyComfort: normalize(categories.intimacy),
      independenceNeed: normalize(categories.independence),
      conflictStyle: normalize(categories.conflict),
    };

    const { connectionStyle, secondaryStyle } = determineConnectionStyle(scores, allAnswers);
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

  const determineConnectionStyle = (scores: Record<string, number>, answers: Record<string, number>) => {
    let connectionStyle = 'secure';
    let secondaryStyle = 'boundaried';

    const { attachmentSecurity, boundaryClarity, intimacyComfort, independenceNeed } = scores;

    // High security across the board = Secure
    if (attachmentSecurity > 65 && boundaryClarity > 60 && intimacyComfort > 55) {
      connectionStyle = 'secure';
      secondaryStyle = boundaryClarity > 70 ? 'boundaried' : 'anxious';
    }
    // Low attachment security + high intimacy desire = Anxious
    else if (attachmentSecurity < 50 && intimacyComfort > 50 && independenceNeed < 60) {
      connectionStyle = 'anxious';
      secondaryStyle = boundaryClarity < 50 ? 'anxiousAvoidant' : 'secure';
    }
    // Low intimacy comfort + high independence = Avoidant
    else if (intimacyComfort < 50 && independenceNeed > 60) {
      connectionStyle = 'avoidant';
      secondaryStyle = attachmentSecurity < 50 ? 'anxiousAvoidant' : 'boundaried';
    }
    // Low attachment + mixed intimacy/independence = Anxious-Avoidant
    else if (attachmentSecurity < 45 && ((intimacyComfort < 50 && independenceNeed < 50) || (intimacyComfort > 50 && independenceNeed > 50))) {
      connectionStyle = 'anxiousAvoidant';
      secondaryStyle = intimacyComfort > independenceNeed ? 'anxious' : 'avoidant';
    }
    // High boundaries = Boundaried
    else if (boundaryClarity > 70) {
      connectionStyle = 'boundaried';
      secondaryStyle = attachmentSecurity > 60 ? 'secure' : 'avoidant';
    }
    // Default based on strongest trait
    else {
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
      insights.push('Your attachment security is an area for growth. Past experiences may have taught you that relationships aren\'t safe, but this can change with awareness and the right connections.');
    } else if (scores.attachmentSecurity > 70) {
      insights.push('You have a strong foundation of attachment security. This allows you to navigate relationships with confidence and resilience.');
    }

    if (scores.boundaryClarity < 45) {
      insights.push('Clarifying your boundaries is essential for healthier relationships. When you don\'t know your limits, others can\'t respect them.');
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
      insights.push('Your relationship with conflict is an edge for growth. Avoiding disagreement doesn\'t make it disappear — it often makes things worse over time.');
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
        recs.push('Recognize that needing others isn\'t weakness. Interdependence is healthy and human.');
        break;
      case 'anxiousAvoidant':
        recs.push('Therapy or coaching can be especially valuable for your pattern. The push-pull dynamic often has roots that benefit from professional support.');
        recs.push('Practice noticing when you\'re moving toward or away from connection. Awareness is the first step to choice.');
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
      recs.push('Spend time clarifying your boundaries. Journal about what feels okay and not okay in relationships. Clarity precedes communication.');
    }

    return recs.slice(0, 4);
  };

  // INTRO SCREEN
  if (showIntro) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: bgColor }}>
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="p-2 rounded-full" style={{ color: mutedColor }}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div 
            className="w-24 h-24 rounded-full mb-8 flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}22` }}
          >
            <svg viewBox="0 0 48 48" className="w-12 h-12">
              <circle cx="16" cy="20" r="8" fill="none" stroke={accentColor} strokeWidth="1.5" />
              <circle cx="32" cy="20" r="8" fill="none" stroke={accentColor} strokeWidth="1.5" />
              <path d="M16 28 C16 34 24 38 24 38 C24 38 32 34 32 28" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="text-3xl font-light mb-3" style={{ color: textColor }}>
            Connection Style
          </h1>
          <p className="text-lg mb-2" style={{ color: accentColor }}>
            Relationships & Boundaries
          </p>
          <p className="text-base mb-8 max-w-md" style={{ color: mutedColor }}>
            Explore how you connect with others — your needs, your patterns, and what helps you thrive in relationships.
          </p>

          <div 
            className="w-full max-w-sm p-5 rounded-2xl mb-8"
            style={{ backgroundColor: cardBg }}
          >
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span style={{ color: textColor }}>About 12 minutes</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span style={{ color: textColor }}>21 relationship questions</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span style={{ color: textColor }}>Your connection profile</span>
            </div>
          </div>

          <p className="text-sm mb-8 max-w-md" style={{ color: mutedColor }}>
            Think about your closest relationships — romantic, friendships, family. Answer based on your patterns, not just one relationship.
          </p>

          <button
            onClick={() => setShowIntro(false)}
            className="px-8 py-4 rounded-2xl font-medium text-white"
            style={{ backgroundColor: accentColor }}
          >
            Begin Exploration
          </button>
        </div>
      </div>
    );
  }

  // REPORT SCREEN
  if (showReport && results) {
    const styleData = CONNECTION_STYLES[results.connectionStyle as keyof typeof CONNECTION_STYLES];
    const secondaryData = CONNECTION_STYLES[results.secondaryStyle as keyof typeof CONNECTION_STYLES];

    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: bgColor }}>
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="p-2 rounded-full" style={{ color: mutedColor }}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-sm" style={{ color: mutedColor }}>Your Connection Profile</span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-lg mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-light mb-2" style={{ color: textColor }}>
                Your Connection Style
              </h1>
              <p className="text-sm" style={{ color: mutedColor }}>
                How you relate and what you need from others
              </p>
            </div>

            {/* Primary Style */}
            <div 
              className="p-6 rounded-2xl mb-6"
              style={{ 
                backgroundColor: isDark ? `${styleData.color}22` : `${styleData.color}15`,
                borderLeft: `4px solid ${styleData.color}`,
              }}
            >
              <div className="text-sm uppercase tracking-wide mb-1" style={{ color: styleData.color }}>
                Your Connection Style
              </div>
              <h2 className="text-2xl font-medium mb-3" style={{ color: textColor }}>
                {styleData.name}
              </h2>
              <p className="text-base leading-relaxed" style={{ color: mutedColor }}>
                {styleData.description}
              </p>
            </div>

            {/* Connection Scores */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <h3 className="text-lg font-medium mb-4" style={{ color: textColor }}>
                Your Relationship Profile
              </h3>
              
              {[
                { label: 'Attachment Security', value: results.attachmentSecurity, color: '#7BA05B' },
                { label: 'Boundary Clarity', value: results.boundaryClarity, color: '#C4956A' },
                { label: 'Intimacy Comfort', value: results.intimacyComfort, color: '#A78BB3' },
                { label: 'Independence Need', value: results.independenceNeed, color: '#6B9BC3' },
                { label: 'Conflict Capacity', value: results.conflictStyle, color: '#E8B86D' },
              ].map((item, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm" style={{ color: textColor }}>{item.label}</span>
                    <span className="text-sm font-medium" style={{ color: item.color }}>
                      {item.value}%
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Strengths */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <h3 className="text-lg font-medium mb-3" style={{ color: textColor }}>
                Your Relationship Strengths
              </h3>
              <div className="flex flex-wrap gap-2">
                {results.relationshipStrengths.map((strength, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1.5 rounded-full text-sm"
                    style={{ 
                      backgroundColor: isDark ? `${styleData.color}33` : `${styleData.color}22`,
                      color: styleData.color,
                    }}
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </div>

            {/* Challenges */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <h3 className="text-lg font-medium mb-3" style={{ color: textColor }}>
                Growth Edges
              </h3>
              <div className="space-y-2">
                {styleData.challenges.map((challenge, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div 
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: mutedColor }}
                    />
                    <span className="text-sm" style={{ color: mutedColor }}>{challenge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What You Need */}
            <div 
              className="p-5 rounded-2xl mb-6"
              style={{ 
                backgroundColor: isDark ? `${styleData.color}15` : `${styleData.color}10`,
              }}
            >
              <h3 className="text-lg font-medium mb-2" style={{ color: textColor }}>
                What You Need From Others
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: mutedColor }}>
                {styleData.needsFromOthers}
              </p>
            </div>

            {/* Secondary Style */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <div className="text-sm uppercase tracking-wide mb-1" style={{ color: secondaryData.color }}>
                Secondary Influence
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: textColor }}>
                {secondaryData.name}
              </h3>
              <p className="text-sm" style={{ color: mutedColor }}>
                This style also shapes how you connect, especially under stress or in certain relationships.
              </p>
            </div>

            {/* Insights */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <h3 className="text-lg font-medium mb-4" style={{ color: textColor }}>
                Insights
              </h3>
              <div className="space-y-4">
                {results.insights.map((insight, i) => (
                  <div key={i} className="flex gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${accentColor}22` }}
                    >
                      <span className="text-xs" style={{ color: accentColor }}>{i + 1}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: mutedColor }}>
                      {insight}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: cardBg }}>
              <h3 className="text-lg font-medium mb-4" style={{ color: textColor }}>
                Pathways for Growth
              </h3>
              <div className="space-y-4">
                {results.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${accentColor}22` }}
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="3">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: mutedColor }}>
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Closing */}
            <div className="text-center py-6">
              <p className="text-sm mb-6" style={{ color: mutedColor }}>
                Your connection style isn't fixed — it can evolve with awareness, healing, and relationships that help you grow.
              </p>
              <button
                onClick={onBack}
                className="px-8 py-4 rounded-2xl font-medium text-white"
                style={{ backgroundColor: accentColor }}
              >
                Return to Library
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // QUESTION SCREEN
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: bgColor }}>
      <div className="flex items-center justify-between p-4">
        <button onClick={onBack} className="p-2 rounded-full" style={{ color: mutedColor }}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span className="text-sm" style={{ color: mutedColor }}>
          {currentQuestion + 1} of {QUESTIONS.length}
        </span>
      </div>

      <div className="px-4">
        <div 
          className="h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
        >
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: accentColor }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="max-w-lg mx-auto w-full">
          <h2 className="text-xl font-medium mb-2 leading-relaxed" style={{ color: textColor }}>
            {question.text}
          </h2>
          {question.subtext && (
            <p className="text-sm mb-8" style={{ color: mutedColor }}>
              {question.subtext}
            </p>
          )}
          {!question.subtext && <div className="mb-8" />}

          {(question.type === 'scale' || question.type === 'choice') && question.options && (
            <div className="space-y-3">
              {question.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full p-4 rounded-xl text-left transition-all hover:scale-[1.02]"
                  style={{ 
                    backgroundColor: cardBg,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  }}
                >
                  <div className="font-medium mb-1" style={{ color: textColor }}>
                    {option.label}
                  </div>
                  {option.description && (
                    <div className="text-sm" style={{ color: mutedColor }}>
                      {option.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {question.type === 'slider' && (
            <div className="space-y-6">
              <div className="px-2">
                <input
                  type="range"
                  min={question.min || 1}
                  max={question.max || 10}
                  value={sliderValue}
                  onChange={(e) => setSliderValue(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ 
                    background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${((sliderValue - 1) / 9) * 100}%, ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'} ${((sliderValue - 1) / 9) * 100}%, ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'} 100%)`,
                  }}
                />
                <div className="flex justify-between mt-3">
                  <span className="text-xs max-w-[40%]" style={{ color: mutedColor }}>
                    {question.minLabel}
                  </span>
                  <span className="text-2xl font-light" style={{ color: accentColor }}>
                    {sliderValue}
                  </span>
                  <span className="text-xs max-w-[40%] text-right" style={{ color: mutedColor }}>
                    {question.maxLabel}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleSliderSubmit}
                className="w-full py-4 rounded-2xl font-medium text-white"
                style={{ backgroundColor: accentColor }}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}