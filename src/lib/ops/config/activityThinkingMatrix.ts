// Internal Ops Activity → Thinking Mode compatibility matrix (read-only)
// Do not wire or execute; reference only.

export const ACTIVITY_THINKING_MATRIX: Record<string, { allowedThinkingModes: string[] }> = {
  // Communication
  'decode-message': { allowedThinkingModes: [] },
  respond: { allowedThinkingModes: ['reframe'] },
  boundaries: { allowedThinkingModes: ['reframe'] },

  // Work & Life
  'task-breakdown': { allowedThinkingModes: ['reframe'] },
  'decision-helper': { allowedThinkingModes: ['pros-cons', 'devil-advocate', 'reframe'] },
  planning: { allowedThinkingModes: ['reframe'] },
  career: { allowedThinkingModes: ['pros-cons', 'reframe'] },
  'meeting-prep': { allowedThinkingModes: ['reframe'] },
  'one-on-one': { allowedThinkingModes: ['reframe'] },
  'performance-review': { allowedThinkingModes: ['reframe'] },
  'project-plan': { allowedThinkingModes: ['pros-cons', 'reframe'] },
  'habit-tracker': { allowedThinkingModes: ['reframe'] },
  accountability: { allowedThinkingModes: ['reframe'] },

  // Money
  'budget-check': { allowedThinkingModes: ['pros-cons', 'reframe'] },
  'savings-goal': { allowedThinkingModes: ['pros-cons', 'reframe'] },
  'money-conversations': { allowedThinkingModes: ['reframe'] },
  'investment-basics': { allowedThinkingModes: ['pros-cons', 'reframe'] },
  'expense-review': { allowedThinkingModes: ['pros-cons', 'reframe'] },

  // Thinking & Learning
  brainstorm: { allowedThinkingModes: ['reframe'] },
  summarize: { allowedThinkingModes: [] },
  'pros-cons': { allowedThinkingModes: [] },
  'devil-advocate': { allowedThinkingModes: [] },
  reframe: { allowedThinkingModes: [] },
  'explain-like': { allowedThinkingModes: [] },
  'language-learning': { allowedThinkingModes: [] },
  'study-plan': { allowedThinkingModes: ['reframe'] },
  'skill-roadmap': { allowedThinkingModes: ['reframe'] },
  'book-summary': { allowedThinkingModes: [] },
  'learning-hack': { allowedThinkingModes: ['reframe'] },
  'knowledge-test': { allowedThinkingModes: [] },

  // Relationships & Wellness
  'perspective-shift': { allowedThinkingModes: ['reframe'] },
  'vent-session': { allowedThinkingModes: [] },
  'self-check-in': { allowedThinkingModes: [] },
  'relationship-help': { allowedThinkingModes: ['reframe'] },
  'conflict-resolution': { allowedThinkingModes: ['reframe'] },
  'relationship-boundary': { allowedThinkingModes: ['reframe'] },
  'meal-plan': { allowedThinkingModes: ['reframe'] },
  'habit-builder': { allowedThinkingModes: ['reframe'] },
  workout: { allowedThinkingModes: ['reframe'] },
  'sleep-routine': { allowedThinkingModes: ['reframe'] },
  'stress-relief': { allowedThinkingModes: ['reframe'] },
  'motivation-boost': { allowedThinkingModes: ['reframe'] },

  // Create
  'write-email': { allowedThinkingModes: [] },
  'social-post': { allowedThinkingModes: [] },
  headline: { allowedThinkingModes: ['reframe'] },
  naming: { allowedThinkingModes: ['reframe'] },
  'creative-prompt': { allowedThinkingModes: ['reframe'] },
  'metaphor-maker': { allowedThinkingModes: ['reframe'] },
  'bio-about': { allowedThinkingModes: [] },
  'creative-writing': { allowedThinkingModes: ['reframe'] },
};
