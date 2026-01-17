import type {
  CheckIn,
  GeneratedPrompt,
  JournalEntry,
  JournalPattern,
  JournalStats,
  Mood,
} from '../types';

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function last<T>(arr: T[]): T | undefined {
  return arr.length ? arr[arr.length - 1] : undefined;
}

function formatMood(mood: Mood | null | undefined): string {
  return mood ? mood : 'unclear';
}

export function generateDailyInsight(entries: JournalEntry[], checkIns: CheckIn[]): string {
  // Placeholder: surface a simple reflection based on the latest entry and check-in.
  const latestEntry = [...entries].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)).at(-1);
  const latestCheckIn = [...checkIns]
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
    .at(-1);

  if (!latestEntry && !latestCheckIn) {
    return "No insights yet — write an entry or do a check-in to begin.";
  }

  const moodFromEntry = latestEntry?.mood ?? null;
  const moodFromCheckIn = latestCheckIn?.mood;
  const energy = latestCheckIn?.energy;

  if (latestEntry && latestCheckIn) {
    return `Today’s snapshot: your journal felt ${formatMood(moodFromEntry)}, and your check-in mood was ${formatMood(moodFromCheckIn)} (energy ${energy}/5). One small step: name what you need most right now.`;
  }

  if (latestEntry) {
    return `From your latest entry, your mood reads as ${formatMood(moodFromEntry)}. Consider writing one sentence about what helped (or what you wish had helped).`;
  }

  return `From your latest check-in, your mood was ${formatMood(moodFromCheckIn)} (energy ${energy}/5). Consider writing a short note about what contributed to that state.`;
}

export function generateWeeklyInsight(patterns: JournalPattern[], stats: JournalStats): string {
  // Placeholder: summarize one dominant pattern and basic activity stats.
  const totalEntries = stats.totalEntries;
  const totalWords = stats.totalWords;

  const topPattern = [...patterns].sort((a, b) => {
    const af = typeof a.frequency === 'number' ? a.frequency : 0;
    const bf = typeof b.frequency === 'number' ? b.frequency : 0;
    return bf - af;
  })[0];

  if (!topPattern) {
    return `This week: ${totalEntries} entries (${totalWords} words). Keep going — patterns will appear as your journal grows.`;
  }

  const freq = typeof topPattern.frequency === 'number' ? topPattern.frequency : 0;
  return `This week: ${totalEntries} entries (${totalWords} words). A recurring pattern showed up (${freq}x): ${topPattern.description}`;
}

export function suggestPromptFromPatterns(patterns: JournalPattern[]): GeneratedPrompt {
  // Placeholder: turn the strongest available pattern into a prompt suggestion.
  const strongest = [...patterns].sort((a, b) => {
    const ac = a.confidence ?? 0;
    const bc = b.confidence ?? 0;
    return bc - ac;
  })[0];

  if (!strongest) {
    return {
      id: createId('prompt'),
      text: 'What are you feeling right now — and what might your body be asking for?',
      basedOn: 'random',
      generatedAt: new Date(),
      used: false,
    };
  }

  const basedOn: GeneratedPrompt['basedOn'] = strongest.type === 'mood' ? 'mood' : 'pattern';

  return {
    id: createId('prompt'),
    text: `You’ve had a recurring theme lately: ${strongest.description} What do you want to try differently (even 1%) next time?`,
    basedOn,
    relatedPatternId: strongest.id,
    generatedAt: new Date(),
    used: false,
  };
}
