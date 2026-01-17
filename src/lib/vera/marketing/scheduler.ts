import { randomUUID } from 'crypto';
import type { ContentTheme, DailyPlan, Platform, Post } from './types';
import { allHooks, hooksForTheme } from './data/hooks';

const POSTING_TIMES: Record<Platform, string[]> = {
  instagram: ['09:00', '18:00'],
  twitter: ['08:00', '12:00', '17:00'],
  tiktok: ['19:00', '21:00'],
  linkedin: ['09:00'],
};

const THEMES_WEEK: ContentTheme[] = [
  'sleep',
  'anxiety',
  'productivity',
  'all-in-one',
  'navigation',
  'ops',
  'language',
  'cost-savings',
  'feature-demo',
  'testimonial',
  'behind-the-scenes',
];

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

function atLocalTime(date: Date, hhmm: string): Date {
  const [hh, mm] = hhmm.split(':').map((x) => parseInt(x, 10));
  const out = new Date(date);
  out.setHours(hh || 0, mm || 0, 0, 0);
  return out;
}

function pickTheme(dayIndex: number): ContentTheme {
  return THEMES_WEEK[dayIndex % THEMES_WEEK.length] || 'sleep';
}

function chooseHook(theme: ContentTheme, usedThisWeek: Set<string>): string {
  const pool = hooksForTheme(theme);
  const candidates = (pool.length ? pool : allHooks()).filter((h) => !usedThisWeek.has(h));
  const chosen = candidates[Math.floor(Math.random() * candidates.length)] || (pool[0] ?? allHooks()[0] ?? '');
  if (chosen) usedThisWeek.add(chosen);
  return chosen;
}

export function createDailyPlan(input?: { date?: Date; platformMix?: Platform[] }): DailyPlan {
  const date = input?.date ? new Date(input.date) : new Date();
  const theme = pickTheme(date.getDay());

  const platforms: Platform[] = input?.platformMix ?? ['instagram', 'twitter', 'tiktok'];
  const usedHooks = new Set<string>();

  const posts: Post[] = [];
  for (const platform of platforms) {
    const times = POSTING_TIMES[platform] ?? ['09:00'];
    const scheduledFor = atLocalTime(date, times[0] || '09:00');
    posts.push({
      id: randomUUID(),
      platform,
      theme,
      hook: chooseHook(theme, usedHooks),
      content: '',
      caption: '',
      hashtags: [],
      cta: '',
      status: 'draft',
      scheduledFor,
    });
  }

  return { date, posts, theme };
}

export function generateWeeklyCalendar(start?: Date): DailyPlan[] {
  const startDate = start ? new Date(start) : new Date();
  const usedHooks = new Set<string>();

  const days: DailyPlan[] = [];
  for (let i = 0; i < 7; i++) {
    const date = addDays(startDate, i);
    const theme = pickTheme(i);

    const posts: Post[] = [];
    const platforms: Platform[] = ['instagram', 'twitter', 'tiktok', 'linkedin'];

    for (const platform of platforms) {
      const times = POSTING_TIMES[platform] ?? ['09:00'];
      for (const hhmm of times) {
        posts.push({
          id: randomUUID(),
          platform,
          theme,
          hook: chooseHook(theme, usedHooks),
          content: '',
          caption: '',
          hashtags: [],
          cta: '',
          status: 'draft',
          scheduledFor: atLocalTime(date, hhmm),
        });
      }
    }

    days.push({ date, posts, theme });
  }

  return days;
}
