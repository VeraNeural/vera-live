import { CALIBRATION_BASE_PROMPT } from '../prompts';

// ============================================================================
// CALIBRATION LOGIC
// ============================================================================

export type CalibrationLevel = 'gentle' | 'neutral' | 'sharp';

export function getCalibrationPrompt(level: CalibrationLevel, content: string): string {
  switch (level) {
    case 'gentle':
      return `${CALIBRATION_BASE_PROMPT}

Make it gentler with:
- Softer phrasing
- More space between ideas  
- Less compression
- Suitable for relational or vulnerable content

Content to adjust: ${content}`;
    
    case 'sharp':
      return `${CALIBRATION_BASE_PROMPT}

Make it sharper with:
- Shorter sentences
- Tighter language
- More direct
- Suitable for work, money, decisions

Content to adjust: ${content}`;
    
    case 'neutral':
    default:
      return content; // No adjustment needed
  }
}

export function determineCalibrationLevel(activityId: string, content: string): CalibrationLevel {
  // Sharp for work/money/decision activities
  if (['task-breakdown', 'decision-helper', 'budget-check', 'savings-goal', 'salary-negotiation', 'negotiate-bill'].includes(activityId)) {
    return 'sharp';
  }
  
  // Gentle for relationship/vulnerable content
  if (['vent-session', 'self-check-in', 'relationship-help', 'boundaries', 'perspective-shift'].includes(activityId)) {
    return 'gentle';
  }
  
  // Neutral for everything else
  return 'neutral';
}
