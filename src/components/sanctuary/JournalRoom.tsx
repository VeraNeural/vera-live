'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme, ThemeToggle } from '@/contexts/ThemeContext';

import type { CheckIn, JournalEntry, JournalPattern, JournalStats, Mood, PatternAlert, Tab } from '@/lib/journal/types';
import { GLOBAL_STYLES } from '@/lib/journal/theme';
import * as JournalIcons from '@/lib/journal/icons';
import { JOURNAL_PROMPTS } from '@/lib/journal/data/prompts';
import { EntryEditor } from '@/lib/journal/components/EntryEditor';
import { MoodSelector } from '@/lib/journal/components/MoodSelector';
import { PromptCard } from '@/lib/journal/components/PromptCard';

import { DailyCheckIn } from '@/lib/journal/components/DailyCheckIn';
import { Timeline } from '@/lib/journal/components/Timeline';
import { PatternView } from '@/lib/journal/components/PatternView';
import { ProgressStats } from '@/lib/journal/components/ProgressStats';
import { ExportModal } from '@/lib/journal/components/ExportModal';

import { detectMoodPatterns, detectTopicPatterns, generatePatternAlert } from '@/lib/journal/analysis/patternDetector';
import { getMoodDistribution } from '@/lib/journal/analysis/moodTracker';

interface JournalNookProps {
  onBack: () => void;
  initialView?: string;
}

export default function JournalNook({ onBack, initialView }: JournalNookProps) {
  const { colors, isDark } = useTheme();
  const theme: 'light' | 'dark' = isDark ? 'dark' : 'light';

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('write');
  const [currentPrompt, setCurrentPrompt] = useState<string>(JOURNAL_PROMPTS[0]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isContentFocused, setIsContentFocused] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showExportModal, setShowExportModal] = useState(false);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);

  type StoredCheckIn = Omit<CheckIn, 'date' | 'createdAt'> & {
    date: string;
    createdAt: string;
  };

  const CHECKINS_STORAGE_KEY = 'vera.journal.checkins.v1';

  const loadCheckIns = useCallback((): CheckIn[] => {
    try {
      const raw = localStorage.getItem(CHECKINS_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as StoredCheckIn[];
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((c) => ({
          ...c,
          date: new Date(c.date),
          createdAt: new Date(c.createdAt),
        }))
        .filter((c) => !Number.isNaN(c.date.getTime()) && !Number.isNaN(c.createdAt.getTime()));
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    setCurrentPrompt(JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]);
    setCheckIns(loadCheckIns());

    const preventOverscroll = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const scrollable = target.closest('.journal-scroll');
      if (!scrollable) e.preventDefault();
    };

    document.addEventListener('touchmove', preventOverscroll, { passive: false });
    return () => document.removeEventListener('touchmove', preventOverscroll);
  }, [loadCheckIns]);

  const patterns = useMemo<JournalPattern[]>(() => {
    const moodPatterns = detectMoodPatterns(entries);
    const topicPatterns = detectTopicPatterns(entries);
    return [...moodPatterns, ...topicPatterns];
  }, [entries]);

  const alerts = useMemo<PatternAlert[]>(() => patterns.map(generatePatternAlert), [patterns]);

  const stats = useMemo<JournalStats>(() => {
    const now = new Date();
    const totalEntries = entries.length;
    const totalWords = entries.reduce((acc, e) => acc + (e.wordCount ?? 0), 0);
    const avgWordCount = totalEntries ? totalWords / totalEntries : 0;

    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const toDayKey = (d: Date) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    const dayKeys = (checkIns.length ? checkIns.map((c) => c.date) : entries.map((e) => e.createdAt))
      .map((d) => toDayKey(startOfDay(d)));

    const uniqueDays = Array.from(new Set(dayKeys))
      .sort()
      .map((k) => new Date(`${k}T00:00:00.000Z`));

    let longestStreak = 0;
    let run = 0;
    for (let i = 0; i < uniqueDays.length; i += 1) {
      if (i === 0) {
        run = 1;
      } else {
        const diff = Math.round((uniqueDays[i].getTime() - uniqueDays[i - 1].getTime()) / 86400000);
        run = diff === 1 ? run + 1 : 1;
      }
      longestStreak = Math.max(longestStreak, run);
    }

    const todayKey = toDayKey(startOfDay(now));
    const daySet = new Set(uniqueDays.map((d) => toDayKey(d)));
    let currentStreak = 0;
    if (daySet.has(todayKey)) {
      let cursor = startOfDay(now);
      while (daySet.has(toDayKey(cursor))) {
        currentStreak += 1;
        cursor = new Date(cursor.getTime() - 86400000);
      }
    }

    const inLastNDays = (d: Date, n: number) => {
      const diffDays = Math.round((startOfDay(now).getTime() - startOfDay(d).getTime()) / 86400000);
      return diffDays >= 0 && diffDays < n;
    };

    const entriesThisWeek = entries.filter((e) => inLastNDays(e.createdAt, 7)).length;
    const entriesThisMonth = entries.filter((e) => inLastNDays(e.createdAt, 30)).length;

    const dowCounts: Record<string, number> = {};
    const hourCounts: Record<string, number> = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };

    for (const e of entries) {
      const d = e.createdAt;
      const dow = d.toLocaleDateString(undefined, { weekday: 'long' });
      dowCounts[dow] = (dowCounts[dow] ?? 0) + 1;

      const h = d.getHours();
      const bucket = h >= 5 && h < 12 ? 'Morning' : h >= 12 && h < 17 ? 'Afternoon' : h >= 17 && h < 21 ? 'Evening' : 'Night';
      hourCounts[bucket] = (hourCounts[bucket] ?? 0) + 1;
    }

    const mostActiveDay = Object.entries(dowCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
    const mostActiveTime = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

    return {
      totalEntries,
      streak: currentStreak,
      longestStreak,
      topMoods: getMoodDistribution(entries),
      avgWordCount,
      totalWords,
      entriesThisWeek,
      entriesThisMonth,
      mostActiveDay,
      mostActiveTime,
      currentStreak,
    };
  }, [entries, checkIns]);

  const wordCount = useMemo(() => (content.trim() ? content.trim().split(/\s+/).length : 0), [content]);

  const getNewPrompt = useCallback(() => {
    const availablePrompts = JOURNAL_PROMPTS.filter((p) => p !== currentPrompt);
    setCurrentPrompt(availablePrompts[Math.floor(Math.random() * availablePrompts.length)]);
  }, [currentPrompt]);

  const usePromptAsTitle = useCallback(() => {
    setTitle(currentPrompt);
  }, [currentPrompt]);

  const handleMoodSelect = useCallback((mood: Mood) => {
    setSelectedMood((prev) => (prev === mood ? null : mood));
  }, []);

  useEffect(() => {
    const v = (initialView || '').toLowerCase().trim();
    const allowed: Tab[] = ['write', 'entries', 'check-in', 'patterns', 'progress'];
    if ((allowed as string[]).includes(v)) {
      setActiveTab(v as Tab);
    }
  }, [initialView]);

  const handleSaveEntry = useCallback(() => {
    if (!content.trim()) return;

    setSaveStatus('saving');

    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      title: title.trim() || 'Untitled Entry',
      content: content.trim(),
      mood: selectedMood,
      prompt: currentPrompt,
      createdAt: new Date(),
      wordCount: content.trim().split(/\s+/).length,
    };

    setTimeout(() => {
      setEntries((prev) => [newEntry, ...prev]);
      setTitle('');
      setContent('');
      setSelectedMood(null);
      setSaveStatus('saved');

      setTimeout(() => {
        setSaveStatus('idle');
        getNewPrompt();
      }, 1500);
    }, 500);
  }, [content, title, selectedMood, currentPrompt, getNewPrompt]);

  if (!mounted) {
    return (
      <div style={{ position: 'fixed', inset: 0, minHeight: '100dvh', minWidth: '100vw', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${colors.cardBorder}`, borderTopColor: colors.accent, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const tabs: Array<{ id: Tab; label: string; Icon: React.FC<JournalIcons.IconProps> }> = [
    { id: 'write', label: 'Write', Icon: JournalIcons.PenIcon },
    { id: 'entries', label: 'Timeline', Icon: JournalIcons.BookIcon },
    { id: 'check-in', label: 'Check-In', Icon: JournalIcons.CalendarCheckIcon },
    { id: 'patterns', label: 'Patterns', Icon: JournalIcons.SparklesIcon },
    { id: 'progress', label: 'Progress', Icon: JournalIcons.TrendingUpIcon },
  ];

  return (
    <>
      <style jsx global>{GLOBAL_STYLES}</style>
      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100dvh', minHeight: '-webkit-fill-available', background: colors.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header className="safe-area-top" style={{ padding: 'clamp(10px, 2.5vw, 14px)', paddingTop: 'max(clamp(10px, 2.5vw, 14px), env(safe-area-inset-top, 10px))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50, position: 'relative' }}>
          <button
            onClick={onBack}
            className="prompt-btn"
            style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.2vw, 10px)', padding: 'clamp(7px, 1.8vw, 11px) clamp(11px, 2.8vw, 16px)', minHeight: 44, background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 50, fontSize: 'clamp(11px, 2.8vw, 13px)', fontWeight: 450, color: colors.textMuted, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
          >
            <JournalIcons.BackArrowIcon size={16} color={colors.textMuted} />
            <span>Sanctuary</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setShowExportModal(true)}
              aria-label="Export"
              className="prompt-btn"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(8px, 2vw, 11px)', background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 50, color: colors.textMuted, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
            >
              <JournalIcons.DownloadIcon size={16} color={colors.textMuted} />
            </button>
            <ThemeToggle />
          </div>
        </header>

        <main className="journal-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0 clamp(10px, 3.5vw, 18px)', paddingBottom: 'clamp(40px, 8vh, 90px)', position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: 580, margin: '0 auto', width: '100%' }}>
            <header style={{ textAlign: 'center', marginBottom: 'clamp(14px, 4vw, 24px)' }}>
              <h1
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(26px, 7vw, 40px)', fontWeight: 300, marginBottom: 'clamp(3px, 0.8vw, 6px)', color: 'rgba(255, 250, 240, 0.9)', letterSpacing: '-0.01em' }}
              >
                Journal Nook
              </h1>
              <p
                style={{ color: 'rgba(255, 250, 240, 0.4)', fontSize: 'clamp(11px, 3vw, 14px)', letterSpacing: '0.03em' }}
              >
                A quiet space for reflection
              </p>
            </header>

            <nav style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(5px, 1.6vw, 9px)', marginBottom: 'clamp(14px, 4vw, 24px)', flexWrap: 'wrap' }}>
              {tabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  className="tab-btn"
                  onClick={() => setActiveTab(id)}
                  aria-selected={activeTab === id}
                  style={{
                    padding: 'clamp(9px, 2.2vw, 13px) clamp(14px, 3.8vw, 20px)',
                    background: activeTab === id ? 'rgba(200, 175, 140, 0.15)' : 'transparent',
                    border: `1px solid ${activeTab === id ? 'rgba(200, 175, 140, 0.35)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: 30,
                    color: activeTab === id ? 'rgba(220, 200, 170, 0.95)' : 'rgba(255, 255, 255, 0.5)',
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    fontWeight: activeTab === id ? 500 : 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Icon size={16} color={activeTab === id ? 'rgba(220, 200, 170, 0.95)' : 'rgba(255, 255, 255, 0.5)'} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            {activeTab === 'write' && (
              <EntryEditor PromptCardComponent={PromptCard} MoodSelectorComponent={MoodSelector} currentPrompt={currentPrompt} onRefreshPrompt={getNewPrompt} onUsePromptAsTitle={usePromptAsTitle} title={title} onTitleChange={setTitle} isTitleFocused={isTitleFocused} onTitleFocus={() => setIsTitleFocused(true)} onTitleBlur={() => setIsTitleFocused(false)} content={content} onContentChange={setContent} isContentFocused={isContentFocused} onContentFocus={() => setIsContentFocused(true)} onContentBlur={() => setIsContentFocused(false)} selectedMood={selectedMood} onMoodSelect={handleMoodSelect} onSave={handleSaveEntry} saveStatus={saveStatus} wordCount={wordCount} />
            )}

            {activeTab === 'entries' && (
              <Timeline embedded theme={theme} entries={entries} checkIns={checkIns} />
            )}

            {activeTab === 'check-in' && (
              <DailyCheckIn
                embedded
                theme={theme}
                onSaved={() => setCheckIns(loadCheckIns())}
              />
            )}

            {activeTab === 'patterns' && (
              <PatternView embedded theme={theme} patterns={patterns} alerts={alerts} />
            )}

            {activeTab === 'progress' && (
              <ProgressStats embedded theme={theme} stats={stats} />
            )}
          </div>
        </main>

        <ExportModal
          open={showExportModal}
          onClose={() => setShowExportModal(false)}
          theme={theme}
          data={{ entries, checkIns, patterns }}
        />
      </div>
    </>
  );
}
