'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CheckIn, Mood } from '../types';

export interface DailyCheckInProps {
  onBack?: () => void;
  onSaved?: (checkIn: CheckIn) => void;
  theme?: 'light' | 'dark';
  storageKey?: string;
  embedded?: boolean;
}

type StoredCheckIn = Omit<CheckIn, 'date' | 'createdAt'> & {
  date: string;
  createdAt: string;
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toDayKey(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function loadCheckIns(storageKey: string): CheckIn[] {
  try {
    const raw = localStorage.getItem(storageKey);
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
}

function saveCheckIns(storageKey: string, checkIns: CheckIn[]) {
  const stored: StoredCheckIn[] = checkIns.map((c) => ({
    ...c,
    date: c.date.toISOString(),
    createdAt: c.createdAt.toISOString(),
  }));
  localStorage.setItem(storageKey, JSON.stringify(stored));
}

function computeStreaks(checkIns: CheckIn[]) {
  const uniqueDays = Array.from(
    new Set(checkIns.map((c) => toDayKey(startOfDay(c.date))))
  )
    .sort()
    .map((k) => new Date(`${k}T00:00:00.000Z`));

  let longest = 0;
  let currentRun = 0;

  for (let i = 0; i < uniqueDays.length; i++) {
    if (i === 0) {
      currentRun = 1;
    } else {
      const prev = uniqueDays[i - 1];
      const cur = uniqueDays[i];
      const diffDays = Math.round((cur.getTime() - prev.getTime()) / 86400000);
      currentRun = diffDays === 1 ? currentRun + 1 : 1;
    }
    longest = Math.max(longest, currentRun);
  }

  const todayKey = toDayKey(startOfDay(new Date()));
  const hasToday = uniqueDays.some((d) => toDayKey(d) === todayKey);

  let current = 0;
  if (hasToday) {
    // Walk backward from today.
    const daySet = new Set(uniqueDays.map((d) => toDayKey(d)));
    let cursor = startOfDay(new Date());
    while (daySet.has(toDayKey(cursor))) {
      current++;
      cursor = new Date(cursor.getTime() - 86400000);
    }
  }

  const last = checkIns
    .slice()
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]?.createdAt;

  return {
    currentStreak: current,
    longestStreak: longest,
    lastCheckIn: last ?? null,
  };
}

export function DailyCheckIn({
  onBack,
  onSaved,
  theme = 'dark',
  storageKey = 'vera.journal.checkins.v1',
  embedded = false,
}: DailyCheckInProps) {
  const colors = theme === 'dark'
    ? {
        bg: '#0f0d15',
        bgGradient: 'linear-gradient(to bottom, #0f0d15 0%, #1a1625 100%)',
        text: '#e8e6f0',
        textMuted: 'rgba(232, 230, 240, 0.6)',
        textDim: 'rgba(232, 230, 240, 0.4)',
        cardBg: 'rgba(255, 255, 255, 0.03)',
        cardBorder: 'rgba(255, 255, 255, 0.06)',
        accent: '#a855f7',
        accentGlow: 'rgba(168, 85, 247, 0.15)',
      }
    : {
        bg: '#faf9fc',
        bgGradient: 'linear-gradient(to bottom, #faf9fc 0%, #f3f1f8 100%)',
        text: '#1a1625',
        textMuted: 'rgba(26, 22, 37, 0.6)',
        textDim: 'rgba(26, 22, 37, 0.4)',
        cardBg: 'rgba(0, 0, 0, 0.02)',
        cardBorder: 'rgba(0, 0, 0, 0.06)',
        accent: '#9333ea',
        accentGlow: 'rgba(147, 51, 234, 0.1)',
      };

  const moodOptions: Array<{ id: Mood; label: string; emoji: string }> = [
    { id: 'calm', label: 'Calm', emoji: '😌' },
    { id: 'anxious', label: 'Anxious', emoji: '😟' },
    { id: 'sad', label: 'Sad', emoji: '😔' },
    { id: 'grateful', label: 'Grateful', emoji: '🙏' },
    { id: 'hopeful', label: 'Hopeful', emoji: '🌤️' },
    { id: 'tired', label: 'Tired', emoji: '😴' },
  ];

  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [mood, setMood] = useState<Mood>('calm');
  const [energy, setEnergy] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const todayKey = useMemo(() => toDayKey(startOfDay(new Date())), []);
  const todaysCheckIn = useMemo(() => {
    return checkIns
      .slice()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .find((c) => toDayKey(startOfDay(c.date)) === todayKey) ?? null;
  }, [checkIns, todayKey]);

  const streaks = useMemo(() => computeStreaks(checkIns), [checkIns]);

  useEffect(() => {
    const loaded = loadCheckIns(storageKey);
    setCheckIns(loaded);
  }, [storageKey]);

  useEffect(() => {
    if (!todaysCheckIn) return;
    setMood(todaysCheckIn.mood);
    setEnergy(todaysCheckIn.energy);
    setNote(todaysCheckIn.note ?? '');
  }, [todaysCheckIn]);

  const save = () => {
    setStatus('saving');

    const now = new Date();
    const base: CheckIn = {
      id: todaysCheckIn?.id ?? `checkin-${Date.now()}`,
      date: startOfDay(now),
      mood,
      energy,
      note: note.trim() ? note.trim() : undefined,
      createdAt: now,
    };

    const next = checkIns.filter((c) => toDayKey(startOfDay(c.date)) !== todayKey);
    next.unshift(base);

    setTimeout(() => {
      setCheckIns(next);
      saveCheckIns(storageKey, next);
      setStatus('saved');
      onSaved?.(base);
      setTimeout(() => setStatus('idle'), 1200);
    }, 350);
  };

  return (
    <div
      style={{
        position: embedded ? 'relative' : 'fixed',
        inset: embedded ? undefined : 0,
        background: colors.bgGradient,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        borderRadius: embedded ? 20 : undefined,
        border: embedded ? `1px solid ${colors.cardBorder}` : undefined,
        overflow: embedded ? 'hidden' : undefined,
      }}
    >
      {!embedded && (
        <div
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${colors.cardBorder}`,
          }}
        >
          <button
            onClick={onBack}
            disabled={!onBack}
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '12px',
              padding: '10px 16px',
              color: colors.textMuted,
              fontSize: '14px',
              cursor: onBack ? 'pointer' : 'default',
              opacity: onBack ? 1 : 0.6,
            }}
          >
            ← Back
          </button>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div
              style={{
                padding: '8px 12px',
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '12px',
                color: colors.textMuted,
                fontSize: '13px',
              }}
            >
              Streak: <span style={{ color: colors.text }}>{streaks.currentStreak}</span>
            </div>
            <div
              style={{
                padding: '8px 12px',
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '12px',
                color: colors.textMuted,
                fontSize: '13px',
              }}
            >
              Best: <span style={{ color: colors.text }}>{streaks.longestStreak}</span>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          flex: embedded ? undefined : 1,
          overflowY: embedded ? 'visible' : 'auto',
          padding: embedded ? '20px' : '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          maxWidth: 720,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '32px',
              fontWeight: 300,
              color: colors.text,
              marginBottom: '10px',
            }}
          >
            Daily Check-In
          </h1>
          <p style={{ color: colors.textMuted, fontSize: '16px' }}>
            A small moment of honesty — just for you.
          </p>
        </div>

        <div
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '16px',
            padding: '18px',
          }}
        >
          <p style={{ color: colors.textDim, fontSize: '14px', marginBottom: 12 }}>How are you feeling?</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '10px',
            }}
          >
            {moodOptions.map((opt) => {
              const active = opt.id === mood;
              return (
                <button
                  key={opt.id}
                  onClick={() => setMood(opt.id)}
                  style={{
                    background: active
                      ? `linear-gradient(135deg, ${colors.accentGlow}, rgba(255,255,255,0))`
                      : colors.cardBg,
                    border: `1px solid ${active ? colors.accent : colors.cardBorder}`,
                    borderRadius: '12px',
                    padding: '14px 14px',
                    color: active ? colors.text : colors.textMuted,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}
                >
                  <span style={{ fontSize: 16 }}>{opt.label}</span>
                  <span style={{ fontSize: 18 }}>{opt.emoji}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '16px',
            padding: '18px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <p style={{ color: colors.textDim, fontSize: '14px' }}>Energy</p>
            <p style={{ color: colors.textMuted, fontSize: '14px' }}>{energy}/5</p>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
            style={{ width: '100%' }}
            aria-label="Energy level"
          />
        </div>

        <div
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '16px',
            padding: '18px',
          }}
        >
          <p style={{ color: colors.textDim, fontSize: '14px', marginBottom: 10 }}>Anything you want to add?</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="A sentence or two…"
            style={{
              width: '100%',
              minHeight: 90,
              background: 'transparent',
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '12px',
              padding: '12px 14px',
              color: colors.text,
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '16px',
              lineHeight: 1.5,
              resize: 'vertical',
            }}
          />
        </div>

        <button
          onClick={save}
          disabled={status === 'saving'}
          style={{
            background: `linear-gradient(135deg, ${colors.accent}, #7c3aed)`,
            border: 'none',
            borderRadius: '12px',
            padding: '16px 24px',
            color: '#fff',
            fontSize: '16px',
            cursor: status === 'saving' ? 'default' : 'pointer',
            opacity: status === 'saving' ? 0.8 : 1,
          }}
        >
          {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : todaysCheckIn ? 'Update Check-In' : 'Check In'}
        </button>

        <div style={{ textAlign: 'center', color: colors.textDim, fontSize: '13px', paddingBottom: 10 }}>
          {todaysCheckIn
            ? 'You already checked in today. You can update it anytime.'
            : 'Checking in builds clarity over time.'}
        </div>
      </div>
    </div>
  );
}
