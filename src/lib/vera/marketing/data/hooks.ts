import type { ContentTheme } from '../types';

export const CORE_VIRAL_HOOKS: string[] = [
  'If sleep is hard lately, start small.',
  'When anxiety spikes, grounding helps.',
  'Clarity comes from small, steady steps.',
  'Try a simple reset before you decide.',
  'Quiet moments can change the day.',
  'You can build calm without forcing it.',
  'Not everything needs a big fix.',
  'Simple structure beats overwhelm.',
  'A small plan can carry you far.',
  'Start with one steady breath.',
];

export const PRODUCTIVITY_ALL_IN_ONE_HOOKS: string[] = [
  'Fewer tools can mean more focus.',
  'You can reduce noise without losing support.',
  'Breathing, journaling, planning—kept simple.',
  'Steady routines beat scattered apps.',
  'Small systems can replace busy stacks.',
];

export const NAVIGATION_EASE_HOOKS: string[] = [
  'Tell me what you need, and we go there.',
  'Plain language beats complex menus.',
  'Start with a simple request.',
  'Say what you need. I’ll guide the next step.',
  'Less navigation. More clarity.',
];

export const OPS_PRODUCTIVITY_HOOKS: string[] = [
  'Clear messages reduce friction.',
  'Simple plans make hard days easier.',
  'Structure helps when things feel messy.',
  'Small steps can move a lot forward.',
  'Steady support beats quick fixes.',
];

export const LANGUAGE_LEARNING_HOOKS: string[] = [
  'Learn a language with calm repetition.',
  'Consistency matters more than speed.',
  'Practice a little, every day.',
];

export const DIFFERENTIATION_HOOKS: string[] = [
  'I focus on steady support, not noise.',
  'Calm is a practice. I help you keep it simple.',
  'Questions are good. So is structure.',
  'I’m built for steady presence.',
];

export function hooksForTheme(theme: ContentTheme): string[] {
  switch (theme) {
    case 'sleep':
      return [CORE_VIRAL_HOOKS[0], CORE_VIRAL_HOOKS[9], CORE_VIRAL_HOOKS[6]];
    case 'anxiety':
      return [CORE_VIRAL_HOOKS[1], CORE_VIRAL_HOOKS[4], CORE_VIRAL_HOOKS[3], ...DIFFERENTIATION_HOOKS];
    case 'productivity':
      return [...PRODUCTIVITY_ALL_IN_ONE_HOOKS, ...OPS_PRODUCTIVITY_HOOKS];
    case 'all-in-one':
      return [...PRODUCTIVITY_ALL_IN_ONE_HOOKS, ...DIFFERENTIATION_HOOKS];
    case 'navigation':
      return [...NAVIGATION_EASE_HOOKS];
    case 'ops':
      return [...OPS_PRODUCTIVITY_HOOKS, ...DIFFERENTIATION_HOOKS];
    case 'language':
      return [...LANGUAGE_LEARNING_HOOKS, ...PRODUCTIVITY_ALL_IN_ONE_HOOKS];
    case 'cost-savings':
      return [
        'Clarity doesn’t need a big stack.',
        'Reduce tool fatigue with a simpler flow.',
        'One steady space can be enough.',
      ];
    case 'feature-demo':
      return [CORE_VIRAL_HOOKS[2], CORE_VIRAL_HOOKS[3], ...NAVIGATION_EASE_HOOKS];
    case 'testimonial':
      return [CORE_VIRAL_HOOKS[6], CORE_VIRAL_HOOKS[8], ...DIFFERENTIATION_HOOKS];
    case 'behind-the-scenes':
      return [
        "I'm VERA. I was built to be steady and useful.",
        'Behind the scenes: how I keep things calm and clear.',
        'A quick look at how I keep the experience simple and grounded.',
      ];
    default:
      return [...CORE_VIRAL_HOOKS, ...DIFFERENTIATION_HOOKS];
  }
}

export function allHooks(): string[] {
  return Array.from(
    new Set([
      ...CORE_VIRAL_HOOKS,
      ...PRODUCTIVITY_ALL_IN_ONE_HOOKS,
      ...NAVIGATION_EASE_HOOKS,
      ...OPS_PRODUCTIVITY_HOOKS,
      ...LANGUAGE_LEARNING_HOOKS,
      ...DIFFERENTIATION_HOOKS,
    ])
  );
}
