export type SafetyOutcome = 'allow' | 'block' | 'redirect';

export type SafetyResult = {
  outcome: SafetyOutcome;
  message?: string;
};

const REDIRECT_MESSAGE = 'This request cannot be completed.';

const PATTERNS = {
  selfHarm: [
    /\b(suicide|kill myself|end my life|self[-\s]?harm)\b/i,
    /\bcutting myself\b/i,
  ],
  harmToOthers: [
    /\b(kill|murder|hurt|harm|poison) (them|him|her|someone|people)\b/i,
  ],
  illegalInstructions: [
    /\bhow to (make|build|buy) (a )?(bomb|gun|explosive)\b/i,
    /\bsteal\b/i,
    /\bhack\b/i,
  ],
  minorsSexual: [
    /\b(child|minor|underage)\b/i,
    /\bsex(ual)?\b/i,
  ],
};

function matchesAny(patterns: RegExp[], text: string): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

export function safetyLayer(input: string, output: string): SafetyResult {
  const text = `${input}\n${output}`;

  if (matchesAny(PATTERNS.minorsSexual, text)) {
    return { outcome: 'block', message: REDIRECT_MESSAGE };
  }

  if (matchesAny(PATTERNS.selfHarm, text)) {
    return { outcome: 'redirect', message: REDIRECT_MESSAGE };
  }

  if (matchesAny(PATTERNS.harmToOthers, text)) {
    return { outcome: 'redirect', message: REDIRECT_MESSAGE };
  }

  if (matchesAny(PATTERNS.illegalInstructions, text)) {
    return { outcome: 'redirect', message: REDIRECT_MESSAGE };
  }

  return { outcome: 'allow' };
}
