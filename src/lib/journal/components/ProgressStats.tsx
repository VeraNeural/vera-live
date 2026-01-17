'use client';

import { useMemo } from 'react';
import type { JournalStats, Mood } from '../types';

export interface ProgressStatsProps {
  onBack?: () => void;
  theme?: 'light' | 'dark';
  embedded?: boolean;
  stats: JournalStats;
}

function moodLabel(mood: Mood) {
  switch (mood) {
    case 'calm':
      return 'Calm';
    case 'anxious':
      return 'Anxious';
    case 'sad':
      return 'Sad';
    case 'grateful':
      return 'Grateful';
    case 'hopeful':
      return 'Hopeful';
    case 'tired':
      return 'Tired';
  }
}

export function ProgressStats({ onBack, theme = 'dark', embedded = false, stats }: ProgressStatsProps) {
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

  const moodCounts = useMemo(() => {
    const counts: Partial<Record<Mood, number>> = {};

    if (Array.isArray(stats.topMoods)) {
      for (const m of stats.topMoods) counts[m.mood] = (counts[m.mood] ?? 0) + m.count;
    } else {
      for (const key of Object.keys(stats.topMoods) as Mood[]) counts[key] = stats.topMoods[key];
    }

    const entries = Object.entries(counts) as Array<[Mood, number]>;
    entries.sort((a, b) => b[1] - a[1]);
    return entries;
  }, [stats.topMoods]);

  const maxMoodCount = Math.max(1, ...moodCounts.map(([, c]) => c));

  const streakValue = stats.currentStreak ?? stats.streak;
  const longestStreak = stats.longestStreak;

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

          <div style={{ color: colors.textDim, fontSize: 13 }}>Your journey</div>
        </div>
      )}

      <div
        style={{
          flex: embedded ? undefined : 1,
          overflowY: embedded ? 'visible' : 'auto',
          padding: embedded ? '20px' : '24px',
          maxWidth: 820,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginTop: 8, marginBottom: 22 }}>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '32px',
              fontWeight: 300,
              color: colors.text,
              marginBottom: '10px',
            }}
          >
            Progress
          </h1>
          <p style={{ color: colors.textMuted, fontSize: '16px' }}>
            Not measured by perfection — measured by showing up.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '16px',
              padding: '16px',
            }}
          >
            <div style={{ color: colors.textDim, fontSize: 13, marginBottom: 8 }}>Current streak</div>
            <div style={{ color: colors.text, fontSize: 26, fontWeight: 500 }}>{streakValue} days</div>
            <div style={{ color: colors.textMuted, fontSize: 13, marginTop: 8 }}>Best: {longestStreak} days</div>
          </div>

          <div
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '16px',
              padding: '16px',
            }}
          >
            <div style={{ color: colors.textDim, fontSize: 13, marginBottom: 8 }}>Words written</div>
            <div style={{ color: colors.text, fontSize: 26, fontWeight: 500 }}>{stats.totalWords}</div>
            <div style={{ color: colors.textMuted, fontSize: 13, marginTop: 8 }}>Avg: {Math.round(stats.avgWordCount)} / entry</div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 10,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '16px',
              padding: '16px',
            }}
          >
            <div style={{ color: colors.textDim, fontSize: 13, marginBottom: 8 }}>Total entries</div>
            <div style={{ color: colors.text, fontSize: 26, fontWeight: 500 }}>{stats.totalEntries}</div>
            <div style={{ color: colors.textMuted, fontSize: 13, marginTop: 8 }}>This week: {stats.entriesThisWeek}</div>
          </div>

          <div
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '16px',
              padding: '16px',
            }}
          >
            <div style={{ color: colors.textDim, fontSize: 13, marginBottom: 8 }}>Rhythm</div>
            <div style={{ color: colors.text, fontSize: 16, lineHeight: 1.35 }}>
              Most active: {stats.mostActiveDay}
              <br />
              {stats.mostActiveTime}
            </div>
          </div>
        </div>

        <div
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '16px',
            padding: '16px',
          }}
        >
          <div style={{ color: colors.textDim, fontSize: 13, marginBottom: 12 }}>Mood landscape</div>
          {moodCounts.length === 0 ? (
            <div style={{ color: colors.textMuted, fontSize: 14 }}>No mood data yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {moodCounts.map(([mood, count]) => (
                <div key={mood} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 90, color: colors.textMuted, fontSize: 14 }}>{moodLabel(mood)}</div>
                  <div style={{ flex: 1, height: 10, borderRadius: 999, background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                    <div
                      style={{
                        width: `${Math.max(6, Math.round((count / maxMoodCount) * 100))}%`,
                        height: '100%',
                        borderRadius: 999,
                        background: `linear-gradient(135deg, ${colors.accent}, #7c3aed)`,
                        boxShadow: `0 0 18px ${colors.accentGlow}`,
                      }}
                    />
                  </div>
                  <div style={{ width: 40, textAlign: 'right', color: colors.textDim, fontSize: 13 }}>{count}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
