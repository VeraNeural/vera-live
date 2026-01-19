// Input ordering & precedence contract (read-only)
// Declarative only; do not wire or execute.

export const INPUT_PRECEDENCE_CONTRACT = {
  rules: [
    'User input is always first and authoritative',
    'Input is captured raw and immutable',
    'Thinking Mode cannot reinterpret or rewrite input',
    'Focus cannot alter input meaning',
    'Generation cannot run without user input',
  ],
} as const;
