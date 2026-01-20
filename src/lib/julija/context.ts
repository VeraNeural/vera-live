/**
 * Evaluates the session context for authorization.
 * @param sessionHistory - The history of the session
 * @returns The context evaluation
 */
export interface ContextEvaluation {
  messageCount: number;
  emotionalTrajectory: 'stable' | 'escalating' | 'de-escalating';
  crisisIndicators: boolean;
  previousRiskBands: string[];
  timeSinceLastMessage: number;
}

export type SessionMessage = Record<string, unknown> & {
  sessionId?: string;
  timestamp?: string;
  riskBand?: string;
};

export function evaluateContext(sessionHistory: SessionMessage[]): ContextEvaluation {
  const lastTimestamp = sessionHistory[sessionHistory.length - 1]?.timestamp;
  const lastTimeMs = lastTimestamp ? Date.parse(lastTimestamp) : NaN;
  const timeSinceLastMessage = Number.isFinite(lastTimeMs) ? Date.now() - lastTimeMs : 0;

  return {
    messageCount: sessionHistory.length,
    emotionalTrajectory: 'stable', // Placeholder logic
    crisisIndicators: false, // Placeholder logic
    previousRiskBands: sessionHistory.map((s) => s.riskBand).filter((band): band is string => typeof band === 'string'),
    timeSinceLastMessage,
  };
}