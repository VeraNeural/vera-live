// ============================================================================
// JOURNAL PROMPTS & MOOD OPTIONS
// ============================================================================
// Writing prompts and mood selection data for JournalRoom

import type { MoodOption } from '../types';

// ============================================================================
// WRITING PROMPTS
// ============================================================================

export const JOURNAL_PROMPTS: string[] = [
  "What's weighing on your mind right now?",
  "What are you grateful for today?",
  "Describe a moment that made you smile recently.",
  "What would you tell your younger self?",
  "What's one thing you're looking forward to?",
  "How are you really feeling today?",
  "What do you need to let go of?",
  "What brought you peace this week?",
  "What's a small victory you achieved recently?",
  "If you could change one thing about today, what would it be?",
  "What does self-care look like for you right now?",
  "Write about a person who made a difference in your life.",
];

// ============================================================================
// MOOD OPTIONS
// ============================================================================

export const MOOD_OPTIONS: MoodOption[] = [
  { id: 'calm', label: 'Calm', color: '#6ee7b7', emoji: '😌' },
  { id: 'anxious', label: 'Anxious', color: '#fcd34d', emoji: '😰' },
  { id: 'sad', label: 'Sad', color: '#93c5fd', emoji: '😢' },
  { id: 'grateful', label: 'Grateful', color: '#c4b5fd', emoji: '🙏' },
  { id: 'hopeful', label: 'Hopeful', color: '#f9a8d4', emoji: '✨' },
  { id: 'tired', label: 'Tired', color: '#a1a1aa', emoji: '😴' },
];
