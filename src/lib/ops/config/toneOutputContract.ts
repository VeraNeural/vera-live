// Tone → Output Modulation Contract (AM-02)
// Declarative only; do not wire or execute.

export const TONE_OUTPUT_CONTRACT = {
  rules: [
    'Tone is presentation-only',
    'Tone is applied after Thinking Mode and Focus',
    'Tone cannot modify structure, reasoning, or completion criteria',
  ],
  disallowed: [
    'Tone cannot change intent or meaning',
    'Tone cannot add or remove content',
    'Tone cannot change output type',
    'Tone cannot override activity contracts',
    'Tone cannot override focus or thinking mode constraints',
  ],
} as const;
