// Constants extracted from OpsRoom.tsx

export const GENERATION_MODES = {
  single: { name: 'Single AI' },
  specialist: { name: 'Specialist' },
  consensus: { name: 'Consensus' },
  'review-chain': { name: 'Review Chain' },
  compare: { name: 'Compare' },
} as const;

export const AI_PROVIDERS = {
  claude: { name: 'Claude', color: '#D97706' },
  gpt4: { name: 'GPT-4', color: '#10B981' },
  grok: { name: 'Grok', color: '#8B5CF6' },
} as const;

export const SPACES = [
  'Personal',
  'Work',
  'Relationships',
  'Legal / Financial',
  'General',
] as const;