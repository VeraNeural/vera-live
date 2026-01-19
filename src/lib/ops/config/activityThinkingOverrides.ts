// Internal Ops Activity → Thinking Mode override permissions (read-only)
// Do not wire or execute; reference only.

export const ACTIVITY_THINKING_OVERRIDES: Record<
  string,
  { allowOverride: boolean; allowedOverrides?: string[] }
> = {
  // Communication
  'decode-message': { allowOverride: false },
  respond: { allowOverride: true, allowedOverrides: ['reframe'] },
  boundaries: { allowOverride: true, allowedOverrides: ['reframe'] },

  // Work & Life
  'task-breakdown': { allowOverride: true, allowedOverrides: ['reframe'] },
  'decision-helper': { allowOverride: true, allowedOverrides: ['pros-cons', 'devil-advocate', 'reframe'] },
  planning: { allowOverride: true, allowedOverrides: ['reframe'] },
  career: { allowOverride: true, allowedOverrides: ['pros-cons', 'reframe'] },
  'meeting-prep': { allowOverride: true, allowedOverrides: ['reframe'] },
  'one-on-one': { allowOverride: true, allowedOverrides: ['reframe'] },
  'performance-review': { allowOverride: true, allowedOverrides: ['reframe'] },
  'project-plan': { allowOverride: true, allowedOverrides: ['pros-cons', 'reframe'] },
  'habit-tracker': { allowOverride: true, allowedOverrides: ['reframe'] },
  accountability: { allowOverride: true, allowedOverrides: ['reframe'] },

  // Money
  'budget-check': { allowOverride: true, allowedOverrides: ['pros-cons', 'reframe'] },
  'savings-goal': { allowOverride: true, allowedOverrides: ['pros-cons', 'reframe'] },
  'money-conversations': { allowOverride: true, allowedOverrides: ['reframe'] },
  'investment-basics': { allowOverride: true, allowedOverrides: ['pros-cons', 'reframe'] },
  'expense-review': { allowOverride: true, allowedOverrides: ['pros-cons', 'reframe'] },

  // Thinking & Learning
  brainstorm: { allowOverride: true, allowedOverrides: ['reframe'] },
  summarize: { allowOverride: false },
  'pros-cons': { allowOverride: false },
  'devil-advocate': { allowOverride: false },
  reframe: { allowOverride: false },
  'explain-like': { allowOverride: false },
  'language-learning': { allowOverride: false },
  'study-plan': { allowOverride: true, allowedOverrides: ['reframe'] },
  'skill-roadmap': { allowOverride: true, allowedOverrides: ['reframe'] },
  'book-summary': { allowOverride: false },
  'learning-hack': { allowOverride: true, allowedOverrides: ['reframe'] },
  'knowledge-test': { allowOverride: false },

  // Relationships & Wellness
  'perspective-shift': { allowOverride: true, allowedOverrides: ['reframe'] },
  'vent-session': { allowOverride: false },
  'self-check-in': { allowOverride: false },
  'relationship-help': { allowOverride: true, allowedOverrides: ['reframe'] },
  'conflict-resolution': { allowOverride: true, allowedOverrides: ['reframe'] },
  'relationship-boundary': { allowOverride: true, allowedOverrides: ['reframe'] },
  'meal-plan': { allowOverride: true, allowedOverrides: ['reframe'] },
  'habit-builder': { allowOverride: true, allowedOverrides: ['reframe'] },
  workout: { allowOverride: true, allowedOverrides: ['reframe'] },
  'sleep-routine': { allowOverride: true, allowedOverrides: ['reframe'] },
  'stress-relief': { allowOverride: true, allowedOverrides: ['reframe'] },
  'motivation-boost': { allowOverride: true, allowedOverrides: ['reframe'] },

  // Create
  'write-email': { allowOverride: false },
  'social-post': { allowOverride: false },
  headline: { allowOverride: true, allowedOverrides: ['reframe'] },
  naming: { allowOverride: true, allowedOverrides: ['reframe'] },
  'creative-prompt': { allowOverride: true, allowedOverrides: ['reframe'] },
  'metaphor-maker': { allowOverride: true, allowedOverrides: ['reframe'] },
  'bio-about': { allowOverride: false },
  'creative-writing': { allowOverride: true, allowedOverrides: ['reframe'] },
};
