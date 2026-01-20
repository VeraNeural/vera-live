import { TimeOfDay, QuickPrompt } from '../types';

export const getQuickPrompts = (timeOfDay: TimeOfDay): QuickPrompt[] => {
  return [
    { text: "I just need to talk", category: 'emotional' },
    { text: "I'm overwhelmed", category: 'emotional' },
    { text: "Help me respond to something", category: 'practical' },
    { text: "Something's on my mind", category: 'emotional' },
    { text: "I'm applying for jobs", category: 'practical' },
  ];
};

export const NAV_HINT_ROTATIONS = [
  "Try: 'breathe', 'can't sleep', 'brain dump', 'decode this'",
  "Try: 'can't sleep', 'breathe', 'decode this', 'brain dump'",
  "Try: 'brain dump', 'decode this', 'breathe', 'can't sleep'",
];
