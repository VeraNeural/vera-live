// Internal Ops Activity → default Thinking Mode (read-only)
// Do not wire or execute; reference only.

export const ACTIVITY_DEFAULT_THINKING_MODE: Record<string, string> = {
  // Communication
  'decode-message': 'default',
  respond: 'reframe',
  boundaries: 'reframe',
  'worklife-analysis': 'default',
  'worklife-action': 'default',
  'worklife-clarify': 'default',
  'worklife-sorted': 'default',
  'money-analysis': 'default',
  'money-action': 'default',
  'thinking-detect': 'default',
  'thinking-analysis': 'default',
  'thinking-action': 'default',

  // Work & Life
  'task-breakdown': 'reframe',
  'decision-helper': 'pros-cons',
  planning: 'reframe',
  career: 'pros-cons',
  'meeting-prep': 'reframe',
  'one-on-one': 'reframe',
  'performance-review': 'reframe',
  'project-plan': 'pros-cons',
  'habit-tracker': 'reframe',
  accountability: 'reframe',

  // Money
  'budget-check': 'pros-cons',
  'savings-goal': 'pros-cons',
  'money-conversations': 'reframe',
  'investment-basics': 'pros-cons',
  'expense-review': 'pros-cons',

  // Thinking & Learning
  brainstorm: 'reframe',
  summarize: 'default',
  'pros-cons': 'default',
  'devil-advocate': 'default',
  reframe: 'default',
  'explain-like': 'default',
  'language-learning': 'default',
  'study-plan': 'reframe',
  'skill-roadmap': 'reframe',
  'book-summary': 'default',
  'learning-hack': 'reframe',
  'knowledge-test': 'default',

  // Relationships & Wellness
  'perspective-shift': 'reframe',
  'vent-session': 'default',
  'self-check-in': 'default',
  'relationship-help': 'reframe',
  'conflict-resolution': 'reframe',
  'relationship-boundary': 'reframe',
  'meal-plan': 'reframe',
  'habit-builder': 'reframe',
  workout: 'reframe',
  'sleep-routine': 'reframe',
  'stress-relief': 'reframe',
  'motivation-boost': 'reframe',

  // Create
  'write-email': 'default',
  'social-post': 'default',
  headline: 'reframe',
  naming: 'reframe',
  'creative-prompt': 'reframe',
  'metaphor-maker': 'reframe',
  'bio-about': 'default',
  'creative-writing': 'reframe',

  // Relationships & Wellness Orchestrator
  'wellness-clarify': 'default',
  'wellness-analysis': 'default',
  'wellness-action': 'default',
  'wellness-deeper': 'default',
};
