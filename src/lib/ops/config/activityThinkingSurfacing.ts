// Internal Ops Activity → Thinking Mode surfacing policy (read-only)
// Do not wire or execute; reference only.

export const ACTIVITY_THINKING_SURFACING: Record<string, { surfacing: 'hidden' | 'implicit' | 'explicit' }> = {
  // Communication
  'decode-message': { surfacing: 'hidden' },
  respond: { surfacing: 'implicit' },
  boundaries: { surfacing: 'implicit' },

  // Work & Life
  'task-breakdown': { surfacing: 'implicit' },
  'decision-helper': { surfacing: 'explicit' },
  planning: { surfacing: 'implicit' },
  career: { surfacing: 'implicit' },
  'meeting-prep': { surfacing: 'implicit' },
  'one-on-one': { surfacing: 'implicit' },
  'performance-review': { surfacing: 'implicit' },
  'project-plan': { surfacing: 'explicit' },
  'habit-tracker': { surfacing: 'implicit' },
  accountability: { surfacing: 'implicit' },

  // Money
  'budget-check': { surfacing: 'explicit' },
  'savings-goal': { surfacing: 'explicit' },
  'money-conversations': { surfacing: 'implicit' },
  'investment-basics': { surfacing: 'explicit' },
  'expense-review': { surfacing: 'explicit' },

  // Thinking & Learning
  brainstorm: { surfacing: 'explicit' },
  summarize: { surfacing: 'hidden' },
  'pros-cons': { surfacing: 'explicit' },
  'devil-advocate': { surfacing: 'explicit' },
  reframe: { surfacing: 'explicit' },
  'explain-like': { surfacing: 'hidden' },
  'language-learning': { surfacing: 'hidden' },
  'study-plan': { surfacing: 'implicit' },
  'skill-roadmap': { surfacing: 'implicit' },
  'book-summary': { surfacing: 'hidden' },
  'learning-hack': { surfacing: 'implicit' },
  'knowledge-test': { surfacing: 'hidden' },

  // Relationships & Wellness
  'perspective-shift': { surfacing: 'explicit' },
  'vent-session': { surfacing: 'hidden' },
  'self-check-in': { surfacing: 'hidden' },
  'relationship-help': { surfacing: 'implicit' },
  'conflict-resolution': { surfacing: 'implicit' },
  'relationship-boundary': { surfacing: 'implicit' },
  'meal-plan': { surfacing: 'implicit' },
  'habit-builder': { surfacing: 'implicit' },
  workout: { surfacing: 'implicit' },
  'sleep-routine': { surfacing: 'implicit' },
  'stress-relief': { surfacing: 'implicit' },
  'motivation-boost': { surfacing: 'implicit' },

  // Create
  'write-email': { surfacing: 'hidden' },
  'social-post': { surfacing: 'hidden' },
  headline: { surfacing: 'implicit' },
  naming: { surfacing: 'implicit' },
  'creative-prompt': { surfacing: 'explicit' },
  'metaphor-maker': { surfacing: 'explicit' },
  'bio-about': { surfacing: 'hidden' },
  'creative-writing': { surfacing: 'implicit' },
};
