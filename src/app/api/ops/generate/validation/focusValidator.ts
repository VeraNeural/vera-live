import { diagnosticWords, emotionLabels, authorityLanguage, instructionalVerbs } from './wordLists';

// ============================================================================
// FOCUS VALIDATOR
// ============================================================================

// Validator trigger tracking
const validatorStats: Record<string, { total: number; violations: { diagnostic: number; emotions: number; authority: number; instructions: number; formatting: number } }> = {};

function trackValidatorTrigger(activityId: string, violationType: string) {
  if (!validatorStats[activityId]) {
    validatorStats[activityId] = {
      total: 0,
      violations: { diagnostic: 0, emotions: 0, authority: 0, instructions: 0, formatting: 0 }
    };
  }
  
  validatorStats[activityId].total++;
  if (violationType in validatorStats[activityId].violations) {
    (validatorStats[activityId].violations as any)[violationType]++;
  }
  
  // Log to console for monitoring (can be removed in production)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Validator] ${activityId}: ${violationType} violation (${validatorStats[activityId].total} total violations)`);
  }
  
  // Log summary every 10 violations for any activity
  if (validatorStats[activityId].total % 10 === 0) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Validator Stats] ${activityId}:`, validatorStats[activityId]);
    }
  }
}

// Silent validator - blocks outputs that violate Focus contract
export function validateFocusOutput(output: string, activityId?: string): boolean {
  // Check for structured formatting
  const hasStructuredFormatting = /^[\s]*[-•*]\s|^\s*\d+\.\s|^\s*#{1,6}\s|\*\*.*\*\*|__.*__|`.*`|:.*:/m.test(output);

  // Check for violations
  const lowerOutput = output.toLowerCase();
  
  const hasDiagnostic = diagnosticWords.some(word => lowerOutput.includes(word.toLowerCase()));
  const hasEmotionLabels = emotionLabels.some(word => lowerOutput.includes(word.toLowerCase()));
  const hasAuthority = authorityLanguage.some(phrase => lowerOutput.includes(phrase.toLowerCase()));
  const hasInstructions = instructionalVerbs.some(phrase => lowerOutput.includes(phrase.toLowerCase()));

  // Track violations if activityId provided
  if (activityId && (hasDiagnostic || hasEmotionLabels || hasAuthority || hasInstructions || hasStructuredFormatting)) {
    if (hasDiagnostic) trackValidatorTrigger(activityId, 'diagnostic');
    if (hasEmotionLabels) trackValidatorTrigger(activityId, 'emotions');
    if (hasAuthority) trackValidatorTrigger(activityId, 'authority');
    if (hasInstructions) trackValidatorTrigger(activityId, 'instructions');
    if (hasStructuredFormatting) trackValidatorTrigger(activityId, 'formatting');
  }

  return !(hasDiagnostic || hasEmotionLabels || hasAuthority || hasInstructions || hasStructuredFormatting);
}

// Function to get validator statistics (for monitoring/debugging)
export function getValidatorStats() {
  return validatorStats;
}

// Function to reset validator statistics
export function resetValidatorStats() {
  Object.keys(validatorStats).forEach(key => delete validatorStats[key]);
}
