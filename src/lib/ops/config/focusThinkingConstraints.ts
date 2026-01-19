// Focus × Thinking Mode constraints (read-only contract)
// Declarative only; do not wire or execute.

export const FOCUS_THINKING_CONSTRAINTS = {
  order: 'Focus applies after Thinking Mode resolution',
  scope: 'Focus affects emphasis and scoping only',
  rules: [
    'Focus must NEVER change Thinking Mode',
    'Focus is applied only AFTER mode resolution',
    'Focus effects are limited to emphasis and scoping',
  ],
  disallowed: [
    'Focus cannot select or override Thinking Mode',
    'Focus cannot infer user intent',
    'Focus cannot modify safety posture',
  ],
} as const;
