// Focus → Emphasis Mapping Contract (AM-03)
// Declarative only; do not wire or execute.

export const FOCUS_EMPHASIS_CONTRACT = {
  rules: [
    'Focus affects emphasis only',
    'Focus cannot change structure, output type, or completion criteria',
    'Focus is applied after Thinking Mode and before Tone',
  ],
  disallowed: [
    'Focus cannot infer intent or add instructions',
    'Focus cannot change activity scope',
    'Focus cannot modify safety posture',
    'Focus cannot override activity contracts',
  ],
} as const;
