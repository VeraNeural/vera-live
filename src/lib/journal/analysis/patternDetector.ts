import type { JournalEntry, JournalPattern, PatternAlert } from '../types';

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function getEntryDate(entry: JournalEntry): Date {
  // JournalEntry.createdAt is already Date in our types.
  return entry.createdAt instanceof Date ? entry.createdAt : new Date(entry.createdAt);
}

export function detectMoodPatterns(entries: JournalEntry[]): JournalPattern[] {
  // Placeholder heuristic: if a mood appears frequently across entries, emit a pattern.
  const withMood = entries.filter((e) => !!e.mood);
  if (withMood.length === 0) return [];

  const counts = new Map<string, { count: number; entryIds: string[]; first: Date; last: Date }>();

  for (const e of withMood) {
    const mood = e.mood as string;
    const d = getEntryDate(e);
    const existing = counts.get(mood);
    if (!existing) {
      counts.set(mood, { count: 1, entryIds: [e.id], first: d, last: d });
    } else {
      existing.count += 1;
      existing.entryIds.push(e.id);
      if (d < existing.first) existing.first = d;
      if (d > existing.last) existing.last = d;
    }
  }

  const patterns: JournalPattern[] = [];
  for (const [mood, info] of counts.entries()) {
    if (info.count < 3) continue;

    patterns.push({
      id: createId('pattern_mood'),
      type: 'mood',
      description: `Your entries often reflect a ${mood} mood.`,
      frequency: info.count,
      firstSeen: info.first,
      lastSeen: info.last,
      entries: info.entryIds,
      relatedEntries: info.entryIds,
      confidence: Math.min(1, 0.35 + info.count * 0.08),
    });
  }

  return patterns;
}

export function detectTopicPatterns(entries: JournalEntry[]): JournalPattern[] {
  // Placeholder heuristic: detect repeated keyword "topics" from titles and content.
  // This is intentionally lightweight until VERA NLP is integrated.
  const TOPICS = ['work', 'family', 'sleep', 'health', 'relationship', 'money', 'school', 'stress', 'anxiety'];

  const buckets = new Map<string, { count: number; entryIds: string[]; first: Date; last: Date }>();

  for (const e of entries) {
    const text = `${e.title ?? ''} ${e.content ?? ''}`.toLowerCase();
    const d = getEntryDate(e);

    for (const topic of TOPICS) {
      if (!text.includes(topic)) continue;
      const existing = buckets.get(topic);
      if (!existing) {
        buckets.set(topic, { count: 1, entryIds: [e.id], first: d, last: d });
      } else {
        existing.count += 1;
        existing.entryIds.push(e.id);
        if (d < existing.first) existing.first = d;
        if (d > existing.last) existing.last = d;
      }
    }
  }

  const patterns: JournalPattern[] = [];
  for (const [topic, info] of buckets.entries()) {
    if (info.count < 2) continue;

    patterns.push({
      id: createId('pattern_topic'),
      type: 'topic',
      description: `A recurring theme in your journal is “${topic}”.`,
      frequency: info.count,
      firstSeen: info.first,
      lastSeen: info.last,
      entries: info.entryIds,
      relatedEntries: info.entryIds,
      confidence: Math.min(1, 0.25 + info.count * 0.12),
    });
  }

  return patterns;
}

export function generatePatternAlert(pattern: JournalPattern): PatternAlert {
  // Placeholder severity based on pattern frequency.
  const severity: PatternAlert['severity'] =
    typeof pattern.frequency === 'number' && pattern.frequency >= 6
      ? 'attention'
      : typeof pattern.frequency === 'number' && pattern.frequency >= 3
        ? 'gentle'
        : 'info';

  return {
    patternId: pattern.id,
    message: `Noticing a pattern: ${pattern.description}`,
    severity,
    dismissed: false,
  };
}
