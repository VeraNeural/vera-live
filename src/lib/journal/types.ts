// ============================================================================
// JOURNAL ROOM TYPE DEFINITIONS
// ============================================================================

export interface JournalNookProps {
  onBack: () => void;
}

// ============================================================================
// CORE TYPES
// ============================================================================

export type Tab = 'write' | 'entries' | 'check-in' | 'patterns' | 'progress';

export type Mood = 'calm' | 'anxious' | 'sad' | 'grateful' | 'hopeful' | 'tired';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: Mood | null;
  prompt: string | null;
  createdAt: Date;
  wordCount: number;
}

export interface MoodOption {
  id: Mood;
  label: string;
  color: string;
  emoji: string;
}

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

export interface BookData {
  width: number;
  height: number;
  color: string;
}

export interface StarData {
  top: string;
  left: string;
  size: number;
  delay: number;
}

export interface LeafData {
  height: number;
  rotation: number;
  offsetX: number;
}

// ============================================================================
// VERA INTEGRATION TYPES (AI-Enhanced Journaling)
// ============================================================================

// Daily Check-ins
export interface CheckIn {
  id: string;
  date: Date;
  mood: Mood;
  energy: 1 | 2 | 3 | 4 | 5;
  note?: string;
  createdAt: Date;
}

export interface CheckInStreak {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: Date;
}

// Conversation Saves
export interface ConversationSave {
  id: string;
  conversationId: string;
  highlight: string;
  context: string;
  savedAt: Date;
  tags?: string[];
}

// Pattern Recognition
export interface PatternAlert {
  patternId: string;
  message: string;
  severity: 'info' | 'gentle' | 'attention';
  dismissed: boolean;
}

/**
 * Journal prompt with source tracking
 */
export interface JournalPrompt {
  id: string;
  text: string;
  category: 'reflection' | 'gratitude' | 'emotional' | 'goal-setting' | 'mindfulness' | string;
  source: 'static' | 'vera_generated';
  generatedAt?: Date;
  userId?: string;
}

export interface GeneratedPrompt {
  id: string;
  text: string;
  basedOn: 'pattern' | 'mood' | 'time' | 'random';
  relatedPatternId?: string;
  generatedAt: Date;
  used: boolean;
}

/**
 * AI-detected mood analysis from entry content
 */
export interface MoodAnalysis {
  detected: Mood;
  confidence: number; // 0-1
  patterns: string[]; // e.g., ["rumination", "positive language", "future focus"]
  suggestedPrompts?: string[];
}

/**
 * AI-generated insight about a journal entry
 */
export interface EntryInsight {
  entryId: string;
  insight: string;
  type: 'pattern' | 'progress' | 'suggestion' | 'reflection';
  generatedAt: Date;
  relevance: number; // 0-1
}

/**
 * Detected patterns across journal entries
 */
export interface JournalPattern {
  id: string;
  type:
    | 'emotional_cycle'
    | 'trigger'
    | 'coping_strategy'
    | 'growth_indicator'
    | 'stress_signal'
    | 'mood'
    | 'topic'
    | 'time';
  description: string;
  frequency: 'daily' | 'weekly' | 'occasional' | 'rare' | number;
  firstSeen: Date;
  lastSeen: Date;
  entries: string[]; // entry IDs
  relatedEntries?: string[];
  confidence: number; // 0-1
}

/**
 * Aggregate statistics about journaling habits
 */
export interface JournalStats {
  totalEntries: number;
  streak: number; // consecutive days
  longestStreak: number;
  topMoods: Array<{ mood: Mood; count: number }> | Record<Mood, number>;
  avgWordCount: number;
  totalWords: number;
  entriesThisWeek: number;
  entriesThisMonth: number;
  mostActiveDay: string; // day of week
  mostActiveTime: string; // time of day

  // Expanded stats (VERA integration)
  currentStreak?: number;
  weeklyAvg?: number;
  monthlyAvg?: number;
}

// Exports
export interface ExportOptions {
  format: 'pdf' | 'markdown' | 'json';
  dateRange: { from: Date; to: Date };
  includeAnalysis: boolean;
}

/**
 * Supabase-stored journal entry (extended with AI fields)
 */
export interface DBJournalEntry extends Omit<JournalEntry, 'createdAt'> {
  user_id: string;
  created_at: string;
  updated_at: string;
  mood_analysis?: MoodAnalysis;
  insights?: EntryInsight[];
  tags?: string[];
  is_favorite?: boolean;
}
