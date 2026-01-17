import { extractTopics } from '../../vera/knowledge/veraKnowledge';

export type VeraWatchResult = {
  intervene: boolean;
  response?: string;
};

// Frustration/burnout signals
const FRUSTRATION_PATTERNS = /\b(this is impossible|i give up|fuck this|this sucks|i cant|i can't|ugh|forget it|nothing works|im stuck|i'm stuck|hate this|so frustrated|waste of time)\b/i;

const BURNOUT_PATTERNS = /\b(been at this for hours|can't think anymore|exhausted|so tired|my brain|fried|burnt out|burned out|need a break|too much)\b/i;

const SPIRAL_THRESHOLD = 3; // Same question asked 3+ times

export function veraWatch(input: {
  userText: string;
  messageHistory?: string[];
  sessionDuration?: number; // minutes
}): VeraWatchResult {
  const { userText, messageHistory = [], sessionDuration = 0 } = input;
  
  // Check frustration
  if (FRUSTRATION_PATTERNS.test(userText)) {
    return {
      intervene: true,
      response: "You're hitting a wall. Step back — what's the one actual next step?",
    };
  }
  
  // Check burnout
  if (BURNOUT_PATTERNS.test(userText)) {
    return {
      intervene: true,
      response: "You've been pushing hard. Finish this one thing, then step away. Your brain needs a break to work properly.",
    };
  }
  
  // Check session length (over 45 min)
  if (sessionDuration > 45) {
    return {
      intervene: true,
      response: "You've been at this a while. Good progress. Want to wrap up or take a quick reset?",
    };
  }
  
  // Check for spiral (same topic repeated)
  // TODO: Implement similarity check on messageHistory
  
  // No intervention needed
  return { intervene: false };
}
