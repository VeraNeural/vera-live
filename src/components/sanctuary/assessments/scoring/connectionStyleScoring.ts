import { Question, AssessmentResults } from '../shared/types';

/**
 * Connection style definitions with metadata
 */
export const CONNECTION_STYLES = {
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

/**
 * Determine primary and secondary connection styles from scores
 */
export function determineConnectionStyle(scores: Record<string, number>): { connectionStyle: string; secondaryStyle: string } {
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
}

/**
 * Generate insights based on scores and connection style
 */
export function generateInsights(scores: Record<string, number>, style: string): string[] {
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
}

/**
 * Generate recommendations based on scores and connection style
 */
export function generateRecommendations(scores: Record<string, number>, style: string): string[] {
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
}

/**
 * Calculate full assessment results from answers
 */
export function calculateResults(allAnswers: Record<string, number>, questions: Question[]): AssessmentResults {
  const categories = {
    attachment: [] as number[],
    boundaries: [] as number[],
    intimacy: [] as number[],
    independence: [] as number[],
    conflict: [] as number[],
  };

  questions.forEach((q) => {
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
}
