import type { Activity } from '@/app/sanctuary/ops/consolidatedData';

export const thinkingAction: Activity = {
  id: 'thinking-orchestrator',
  title: 'Clear My Head',
  description: 'Clear thinking. Deep learning. No fluff.',
  icon: 'brain',
  type: 'standalone',
  placeholder: 'What are you trying to think through or understand?',
  systemPrompt: '',
  disclaimer: '',
  allowSave: true,
};

export const wellnessAction: Activity = {
  id: 'wellness-orchestrator',
  title: 'Check In',
  description: 'For your heart, your head, and your habits.',
  icon: 'heart',
  type: 'standalone',
  placeholder: "What's on your mind?",
  systemPrompt: '',
  disclaimer: '',
  allowSave: true,
};

export const appKitAction: Activity = {
  id: 'appkit-orchestrator',
  title: 'Application Kit',
  description: 'Everything you need to land the job',
  icon: 'briefcase',
  type: 'standalone',
  placeholder: 'Build your complete application kit',
  systemPrompt: '',
  disclaimer: 'VERA helps you present your best self. Always review and personalize before sending.',
  allowSave: true
};

export const createSharedAction: Activity = {
  id: 'create',
  title: 'Creative Writing',
  description: 'Stories, poems, and creative expression',
  icon: 'pen-tool',
  type: 'standalone',
  placeholder: 'Genre? Themes? Any starting point?',
  systemPrompt: '',
  disclaimer: '',
  allowSave: true,
};

export const createAction: Activity = {
  id: 'create',
  title: 'Create',
  description: 'Write, post, and express yourself',
  icon: 'sparkles',
  type: 'standalone',
  placeholder: 'What do you want to create?',
  systemPrompt: '',
  disclaimer: '',
  allowSave: true,
};

export const relationshipsAction: Activity = {
  id: 'relationships-wellness',
  title: 'Life Stuff',
  description: 'Emotional clarity and regulation with calm grounding.',
  icon: 'heart',
  type: 'standalone',
  placeholder: 'What situation are you trying to understand or steady?',
  systemPrompt: '',
  disclaimer: '',
  allowSave: true,
};

export const communicationAction: Activity = {
  id: 'communication-orchestrator',
  title: 'Communication Flow',
  description: 'Decode, set boundaries, and respond with focus.',
  icon: 'message-circle',
  type: 'standalone',
  placeholder: 'Paste the message you want to decode...',
  systemPrompt: '',
  disclaimer: '',
  allowSave: true,
};

export const workLifeAction: Activity = {
  id: 'worklife-orchestrator',
  title: 'Get Unstuck',
  description: 'Too much in your head? Let\'s sort it out together.',
  icon: 'clipboard-list',
  type: 'standalone',
  placeholder: 'Describe what you need help with...',
  systemPrompt: '',
  disclaimer: '',
  allowSave: true,
};

export const moneyAction: Activity = {
  id: 'money-orchestrator',
  title: 'Money',
  description: 'Your pocket CFO who tells it like it is',
  icon: 'dollar-sign',
  type: 'standalone',
  placeholder: 'What\'s going on with your money?',
  systemPrompt: '',
  disclaimer: '',
  allowSave: true,
};
