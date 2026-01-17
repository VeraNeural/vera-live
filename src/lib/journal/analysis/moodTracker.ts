import type { CheckIn, JournalEntry, Mood } from '../types';

function moodToScore(mood: Mood): number {
  // Placeholder: map moods to a rough valence score for trend estimation.
  switch (mood) {
    case 'grateful':
      return 5;
    case 'hopeful':
      return 4;
    case 'calm':
      return 3;
    case 'tired':
      return 2;
    case 'sad':
      return 1;
    case 'anxious':
      return 1;
    default:
      return 3;
  }
}

export function calculateMoodTrend(
  checkIns: CheckIn[],
  days: number,
): { trend: 'up' | 'down' | 'stable'; data: number[] } {
  // Placeholder: build a daily series using the last check-in per day.
  // Data points are derived from mood score (primary) + energy (secondary).
  const byDay = new Map<string, CheckIn>();

  for (const c of checkIns) {
    const d = c.date instanceof Date ? c.date : new Date(c.date);
    const key = d.toISOString().slice(0, 10);
    const existing = byDay.get(key);
    if (!existing) {
      byDay.set(key, c);
    } else {
      const existingCreated = existing.createdAt instanceof Date ? existing.createdAt : new Date(existing.createdAt);
      const created = c.createdAt instanceof Date ? c.createdAt : new Date(c.createdAt);
      if (created > existingCreated) byDay.set(key, c);
    }
  }

  const today = new Date();
  const data: number[] = [];

  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const checkIn = byDay.get(key);

    if (!checkIn) {
      data.push(0);
      continue;
    }

    const moodScore = moodToScore(checkIn.mood);
    const energyScore = checkIn.energy;
    // Normalize to 0..10-ish for simple trend.
    data.push(moodScore + energyScore / 2);
  }

  const nonZero = data.filter((v) => v > 0);
  if (nonZero.length < 3) return { trend: 'stable', data };

  const first = nonZero[0];
  const last = nonZero[nonZero.length - 1];
  const delta = last - first;

  const trend: 'up' | 'down' | 'stable' = delta > 0.75 ? 'up' : delta < -0.75 ? 'down' : 'stable';
  return { trend, data };
}

export function getMoodDistribution(entries: JournalEntry[]): Record<Mood, number> {
  const distribution: Record<Mood, number> = {
    calm: 0,
    anxious: 0,
    sad: 0,
    grateful: 0,
    hopeful: 0,
    tired: 0,
  };

  for (const e of entries) {
    if (!e.mood) continue;
    distribution[e.mood] = (distribution[e.mood] ?? 0) + 1;
  }

  return distribution;
}
