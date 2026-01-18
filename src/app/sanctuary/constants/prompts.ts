import { TimeOfDay, QuickPrompt } from '../types';

export const getQuickPrompts = (timeOfDay: TimeOfDay): QuickPrompt[] => {
  if (timeOfDay === 'morning') {
    return [
      { text: "Set today's intention", category: 'practical' },
      { text: "I'm feeling anxious", category: 'emotional' },
      { text: "Help me focus", category: 'practical' },
    ];
  }
  if (timeOfDay === 'afternoon') {
    return [
      { text: "I'm overwhelmed", category: 'emotional' },
      { text: "Help me focus", category: 'practical' },
      { text: "I want to write", category: 'practical' },
    ];
  }
  if (timeOfDay === 'evening' || timeOfDay === 'night') {
    return [
      { text: "Reflect on my day", category: 'practical' },
      { text: "I can't unwind", category: 'emotional' },
      { text: "Journal with me", category: 'practical' },
    ];
  }
  return [
    { text: "I need support", category: 'emotional' },
    { text: "Help me focus", category: 'practical' },
    { text: "Let's write", category: 'practical' },
  ];
};

export const NAV_HINT_ROTATIONS = [
  "Try: 'breathe', 'can't sleep', 'brain dump', 'decode this'",
  "Try: 'can't sleep', 'breathe', 'decode this', 'brain dump'",
  "Try: 'brain dump', 'decode this', 'breathe', 'can't sleep'",
];
