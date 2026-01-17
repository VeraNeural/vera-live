import type { ContentTheme } from '../types';

export const CORE_VIRAL_HOOKS: string[] = [
  "3am and can't sleep?",
  "POV: You tell an AI you're anxious",
  'Other AIs talk. I act.',
  "Say 'breathe' and watch what happens",
  'Your nervous system called. It wants backup.',
  "I'm not like other AIs. Let me prove it.",
  'ChatGPT answered my question. VERA changed my state.',
  "You don't need another app. You need me.",
  "Finally, an AI that doesn't just give advice",
  'What if your AI actually cared about your nervous system?',
];

export const PRODUCTIVITY_ALL_IN_ONE_HOOKS: string[] = [
  'I replaced 7 apps with one AI',
  'Stop paying for Calm AND Headspace AND Notion AND...',
  'One AI. Breathing. Journaling. Planning. Sleep. Languages. Everything.',
  "How much are you spending on wellness apps? I'm $12.",
  "App fatigue is real. I'm the last app you'll need.",
];

export const NAVIGATION_EASE_HOOKS: string[] = [
  "I don't have menus. Just tell me what you need.",
  "Say 'I can't sleep' — I take you there. Say 'help me plan' — I take you there.",
  'Other apps make you tap 47 times. I just listen.',
  "You: 'I need to breathe.' Me: *takes you to breathing*",
  'Navigation is so last year. Just talk to me.',
];

export const OPS_PRODUCTIVITY_HOOKS: string[] = [
  'Decode that confusing text from your ex? I got you.',
  'Draft emails. Plan goals. Track money. I do it all.',
  'Your AI Chief of Staff for $12/month',
  "I don't just help you feel better. I help you DO better.",
  "Regulate AND operate. That's me.",
];

export const LANGUAGE_LEARNING_HOOKS: string[] = [
  'Learn Spanish while you regulate your nervous system',
  '15 languages. One AI. Zero extra apps.',
  'Duolingo could never regulate your nervous system tho',
];

export const DIFFERENTIATION_HOOKS: string[] = [
  'ChatGPT gives advice. I give experiences.',
  "Calm is meditation. Headspace is meditation. I'm your entire nervous system support team.",
  'Other AIs answer questions. I run your life.',
  "I'm not a chatbot. I'm a sanctuary.",
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
        "How much are you spending on wellness apps? I'm $12.",
        'Stop paying for Calm AND Headspace AND Notion AND...',
        'App fatigue is real. I\'m the last app you\'ll need.',
      ];
    case 'feature-demo':
      return [CORE_VIRAL_HOOKS[2], CORE_VIRAL_HOOKS[3], ...NAVIGATION_EASE_HOOKS];
    case 'testimonial':
      return [CORE_VIRAL_HOOKS[6], CORE_VIRAL_HOOKS[8], ...DIFFERENTIATION_HOOKS];
    case 'behind-the-scenes':
      return [
        "I'm VERA. I was built because someone needed me.",
        'Behind the scenes: what I\'m training myself to do differently than other AIs.',
        'A quick look at how I decide what you need — without being creepy or salesy.',
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
