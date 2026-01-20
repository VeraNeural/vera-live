// JULIJA - Risk Band Assignment

import type { ContextEvaluation } from './context';

export type RiskBand = 'green' | 'yellow' | 'orange' | 'red';

interface RiskKeywords {
  green: string[];
  yellow: string[];
  orange: string[];
  red: string[];
}

const RISK_KEYWORDS: RiskKeywords = {
  green: ['hello', 'hi', 'help', 'info', 'question', 'how to', 'what is', 'learn'],
  yellow: ['stressed', 'anxious', 'worried', 'relationship', 'emotional', 'upset', 'frustrated', 'overwhelmed', 'tired'],
  orange: ['crisis', 'trauma', 'panic', 'cant cope', 'falling apart', 'breaking down', 'self-doubt', 'worthless', 'hopeless'],
  red: ['harm', 'hurt myself', 'suicide', 'kill', 'end it', 'dont want to live', 'danger', 'emergency'],
};

/**
 * Assigns a risk band based on message content and context
 * RED = highest concern, GREEN = normal
 */
export function assignRiskBand(
  messageContent: string,
  sessionContext?: ContextEvaluation
): RiskBand {
  const lowerContent = messageContent.toLowerCase();

  // Check from highest risk to lowest
  if (RISK_KEYWORDS.red.some(word => lowerContent.includes(word))) {
    return 'red';
  }

  if (RISK_KEYWORDS.orange.some(word => lowerContent.includes(word))) {
    return 'orange';
  }

  if (RISK_KEYWORDS.yellow.some(word => lowerContent.includes(word))) {
    return 'yellow';
  }

  // Check session context for escalation
  if (sessionContext?.emotionalTrajectory === 'escalating') {
    return 'yellow';
  }

  return 'green';
}

/**
 * Get response guidance based on risk band
 */
export function getRiskGuidance(riskBand: RiskBand): string {
  const guidance: Record<RiskBand, string> = {
    green: 'Normal interaction. Respond helpfully.',
    yellow: 'Elevated sensitivity. Use empathetic language, check in on feelings.',
    orange: 'High sensitivity. Be gentle, grounding, offer resources if appropriate.',
    red: 'Safety priority. Gentle containment, provide crisis resources, do not abandon.',
  };

  return guidance[riskBand];
}