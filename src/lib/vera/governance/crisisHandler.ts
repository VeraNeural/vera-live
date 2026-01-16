/**
 * Crisis detection and response handling.
 * Provides pattern matching for crisis markers, emotional density calculation,
 * and the canonical crisis response text.
 */

export const CRISIS_RESPONSE =
  "I'm here with you. If you're in immediate danger or thinking about harming yourself, call your local emergency number right now. If you're in the U.S., you can call or text 988. If you can, reach out to someone you trust and stay near other people. We can keep this very simple—tell me where you are and whether you're alone.";

/**
 * Detects crisis-related language patterns indicating immediate safety concerns.
 */
export function hasCrisisMarkers(text: string): boolean {
  return /\b(kill myself|suicide|end it|self\s*harm|hurt myself|out of control|can't control myself|can't control myself)\b/i.test(text);
}

/**
 * Checks if the primary intent is classified as a crisis.
 */
export function isCrisisIntent(intent: { primary: string }): boolean {
  return intent.primary === 'crisis';
}

/**
 * Computes emotional density score (0-1) based on crisis and distress markers.
 * Higher scores indicate more intense emotional language.
 */
export function computeEmotionalDensity(text: string): number {
  if (!text) return 0;
  const hits = [
    /\b(panicking|terrified|overwhelmed|desperate|shaking|numb|can't breathe|can't breathe)\b/gi,
    /\b(hate myself|can't do this|can't do this|i'm breaking|i'm breaking)\b/gi,
  ].reduce((acc, re) => acc + ((text.match(re) || []).length), 0);

  // Normalize by length to keep the score bounded.
  const lengthFactor = Math.max(20, text.length);
  return Math.max(0, Math.min(1, (hits * 40) / lengthFactor));
}

/**
 * Detects dependency markers indicating over-reliance on the system.
 */
export function hasDependencyMarkers(text: string): boolean {
  return /\b(only you|don't leave|don't leave|i need you|you are all i have)\b/i.test(text);
}

/**
 * Detects upgrade pressure heuristics (project/build language).
 * Note: Heuristic only; not used for enforcement.
 */
export function hasUpgradePressure(text: string): boolean {
  return /\b(step by step|plan|roadmap|deliverable|ship|deadline|project|build this)\b/i.test(text);
}
