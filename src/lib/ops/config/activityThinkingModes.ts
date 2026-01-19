// Internal mapping of Ops activities to allowed Thinking Modes (not rendered by default)
// Used only for optional UI exposure in Advanced Thinking.

export const ACTIVITY_THINKING_MODES: Record<string, string[]> = {
  'decision-helper': ['pros-cons', 'devil-advocate', 'reframe', 'persona'],
  planning: ['pros-cons', 'reframe', 'persona'],
  'money-conversations': ['pros-cons', 'reframe'],
  career: ['pros-cons', 'reframe', 'persona'],
  brainstorm: ['devil-advocate', 'reframe', 'persona'],
  summarize: ['reframe'],
  'explain-like': ['reframe', 'persona'],
  'task-breakdown': ['reframe'],
};
