import type { Command } from './types';

export const COMMAND_REGISTRY: Command[] = [
  // Zen commands
  {
    id: 'zen-breathe',
    phrases: ['breathe', 'breathing', 'need to breathe', 'calm down', 'anxious', 'panic', "can't breathe", 'chest tight'],
    route: { room: 'zen', view: 'breathe' },
    voiceResponse: "Let's slow down together. Taking you to breathing.",
  },
  {
    id: 'zen-ground',
    phrases: ['ground', 'grounding', '5-4-3-2-1', 'dissociating', 'not present', 'floating'],
    route: { room: 'zen', view: 'ground' },
    voiceResponse: "Let's get grounded. I'll guide you.",
  },
  {
    id: 'zen-shake',
    phrases: ['shake', 'shake it off', 'tense', 'stuck energy', 'need to move'],
    route: { room: 'zen', view: 'shake' },
    voiceResponse: "Let's shake it out together.",
  },
  {
    id: 'zen-orient',
    phrases: ['orient', 'look around', 'where am i'],
    route: { room: 'zen', view: 'orient' },
    voiceResponse: "Let's orient to the space around you.",
  },

  // Rest commands
  {
    id: 'rest-sleep',
    phrases: ["can't sleep", 'sleep', 'insomnia', 'bedtime', 'tired'],
    route: { room: 'rest', view: 'sleep-stories' },
    voiceResponse: "Let's help you wind down. Here are some sleep stories.",
  },
  {
    id: 'rest-sounds',
    phrases: ['play sounds', 'rain', 'ocean', 'nature sounds', 'white noise', 'soundscape'],
    route: { room: 'rest', view: 'soundscapes' },
    voiceResponse: 'Opening soundscapes for you.',
  },
  {
    id: 'rest-story',
    phrases: ['read me a story', 'bedtime story', 'sleep story', 'tell me a story'],
    route: { room: 'rest', view: 'sleep-stories' },
    voiceResponse: "I'll read you a story. Get comfortable.",
  },
  {
    id: 'rest-meditate',
    phrases: ['meditation', 'meditate', 'guided meditation'],
    route: { room: 'rest', view: 'meditations' },
    voiceResponse: 'Opening meditations.',
  },

  // Studio commands
  {
    id: 'studio-dump',
    phrases: ['brain dump', 'vent', 'get it out', 'dump my thoughts', 'need to vent'],
    route: { room: 'studio', view: 'brain-dump' },
    voiceResponse: "Let's get it all out. Opening brain dump.",
  },
  {
    id: 'studio-letter',
    phrases: ['unsent letter', 'write a letter', 'letter to', "things i can't say"],
    route: { room: 'studio', view: 'unsent-letter' },
    voiceResponse: 'Opening unsent letter. Say what you need to say.',
  },
  {
    id: 'studio-burn',
    phrases: ['burn list', 'burn it', 'let go of', 'release'],
    route: { room: 'studio', view: 'burn-list' },
    voiceResponse: "Let's release what's weighing on you.",
  },
  {
    id: 'studio-ambient',
    phrases: ['ambient', 'create sounds', 'mix sounds', 'sound mixer'],
    route: { room: 'studio', view: 'ambient-creator' },
    voiceResponse: 'Opening ambient creator.',
  },
  {
    id: 'studio-hum',
    phrases: ['hum', 'tone', 'humming', 'vocal'],
    route: { room: 'studio', view: 'hum-and-tone' },
    voiceResponse: "Let's use your voice to regulate.",
  },

  // Journal commands
  {
    id: 'journal-write',
    phrases: ['journal', 'write', 'diary', 'entry', 'write something'],
    route: { room: 'journal', view: 'write' },
    voiceResponse: 'Opening your journal.',
  },
  {
    id: 'journal-entries',
    phrases: ['my entries', 'past entries', 'journal history', 'what have i written'],
    route: { room: 'journal', view: 'entries' },
    voiceResponse: 'Here are your entries.',
  },
  {
    id: 'journal-checkin',
    phrases: ['check in', 'check-in', 'daily check', 'how am i feeling'],
    route: { room: 'journal', view: 'check-in' },
    voiceResponse: "Let's do a quick check-in.",
  },
  {
    id: 'journal-patterns',
    phrases: ['patterns', 'insights', 'what have you noticed', 'any patterns'],
    route: { room: 'journal', view: 'patterns' },
    voiceResponse: "Here's what I've noticed in your patterns.",
  },
  {
    id: 'journal-progress',
    phrases: ['progress', 'stats', 'how am i doing', 'my journey', 'my progress'],
    route: { room: 'journal', view: 'progress' },
    voiceResponse: "Let's look at your journey.",
  },

  // Ops commands
  {
    id: 'ops-decode',
    phrases: ['decode', 'decode message', 'what does this mean', 'analyze message', 'decode this'],
    route: { room: 'ops', view: 'communication' },
    voiceResponse: "Let's decode that message together.",
  },
  {
    id: 'ops-draft',
    phrases: ['draft', 'write email', 'help me respond', 'compose', 'draft email'],
    route: { room: 'ops', view: 'communication' },
    voiceResponse: "I'll help you draft a response.",
  },
  {
    id: 'ops-work',
    phrases: ['work stress', 'career', 'job', 'boss', 'coworker', 'work problem'],
    route: { room: 'ops', view: 'work-career' },
    voiceResponse: "Let's work through this together.",
  },
  {
    id: 'ops-money',
    phrases: ['money', 'budget', 'finance', 'spending', 'financial'],
    route: { room: 'ops', view: 'money-finance' },
    voiceResponse: 'Opening money and finance tools.',
  },
  {
    id: 'ops-plan',
    phrases: ['plan', 'goals', 'planning', 'organize', 'set goals'],
    route: { room: 'ops', view: 'planning-goals' },
    voiceResponse: "Let's plan and set some goals.",
  },
  {
    id: 'ops-reflect',
    phrases: ['end of day', 'reflect', 'daily reflection', 'how was today', 'reflect on today'],
    route: { room: 'ops', view: 'reflect-connect' },
    voiceResponse: "Let's reflect on your day.",
  },
  {
    id: 'ops-learn-language',
    phrases: ['learn language', 'language learning', 'teach me spanish', 'learn spanish', 'learn french', 'learn macedonian'],
    route: { room: 'ops', view: 'learning-growth' },
    voiceResponse: "Opening language learning.",
  },
  {
    id: 'ops-translate',
    phrases: ['translate', 'translation', 'how do i say', 'translate this', 'say this in'],
    route: { room: 'ops', view: 'translate' },
    voiceResponse: 'Opening translation tools.',
  },

  // Library commands
  {
    id: 'library-learn',
    phrases: ['teach me', 'learn about', 'what is', 'explain', 'educate me'],
    route: { room: 'library', view: 'learn' },
    voiceResponse: 'Let me teach you about that.',
  },
  {
    id: 'library-stories',
    phrases: ['story', 'stories', 'read to me'],
    route: { room: 'library', view: 'stories' },
    voiceResponse: 'Opening stories.',
  },

  // Navigation commands
  {
    id: 'nav-home',
    phrases: ['home', 'go home', 'main', 'sanctuary', 'back to start'],
    route: { room: 'sanctuary' },
    voiceResponse: 'Taking you home.',
  },
  {
    id: 'nav-back',
    phrases: ['back', 'go back', 'previous'],
    route: { room: 'back' },
    voiceResponse: 'Going back.',
  },
];

export function findMatchingCommand(userMessage: string): Command | null {
  const message = (userMessage || '').toLowerCase();

  for (const command of COMMAND_REGISTRY) {
    for (const phrase of command.phrases) {
      if (!phrase) continue;
      if (message.includes(phrase.toLowerCase())) {
        return command;
      }
    }
  }

  return null;
}
