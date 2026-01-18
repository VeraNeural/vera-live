import { TimeOfDay } from '../types';

export const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

export const getGreeting = (time: TimeOfDay): string => {
  switch (time) {
    case 'morning': return 'Good morning';
    case 'afternoon': return 'Good afternoon';
    case 'evening': return 'Good evening';
    case 'night': return 'Welcome back';
  }
};

export const getVeraGreeting = (time: TimeOfDay): string => {
  const greetings = {
    morning: [
      "Ready to start fresh?",
      "What's on your mind today?",
      "Let's make today count.",
      "How can I help you this morning?",
      "A new day awaits.",
    ],
    afternoon: [
      "How's your day unfolding?",
      "Taking a moment for yourself?",
      "What's on your mind?",
      "Need a thought partner?",
      "I'm here when you need me.",
    ],
    evening: [
      "How was your day?",
      "Time to decompress?",
      "What's lingering on your mind?",
      "Ready to wind down?",
      "Let's reflect together.",
    ],
    night: [
      "Can't sleep?",
      "I'm here with you.",
      "What's keeping you up?",
      "Need some quiet company?",
      "Let's talk it through.",
    ],
  };
  
  const options = greetings[time];
  return options[Math.floor(Math.random() * options.length)];
};
