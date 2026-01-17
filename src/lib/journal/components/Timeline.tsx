'use client';

import { useMemo, useState } from 'react';
import type { CheckIn, JournalEntry, Mood } from '../types';

export interface TimelineProps {
  onBack?: () => void;
  theme?: 'light' | 'dark';
  embedded?: boolean;
  entries: JournalEntry[];
  checkIns?: CheckIn[];
  onSelectEntry?: (entryId: string) => void;
  onSelectCheckIn?: (checkInId: string) => void;
}

type TimelineItem =
  | { kind: 'entry'; id: string; at: Date; entry: JournalEntry }
  | { kind: 'checkin'; id: string; at: Date; checkIn: CheckIn };

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function diffDays(a: Date, b: Date) {
  const ms = startOfDay(a).getTime() - startOfDay(b).getTime();
  return Math.round(ms / 86400000);
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

export function Timeline({
  onBack,
  theme = 'dark',
  embedded = false,
  entries,
  checkIns,
  onSelectEntry,
  onSelectCheckIn,
}: TimelineProps) {
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

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const items = useMemo(() => {
    const out: TimelineItem[] = [];

    for (const entry of entries) {
      out.push({ kind: 'entry', id: entry.id, at: entry.createdAt, entry });
    }

    for (const c of checkIns ?? []) {
      out.push({ kind: 'checkin', id: c.id, at: c.createdAt, checkIn: c });
    }

    return out.sort((a, b) => b.at.getTime() - a.at.getTime());
  }, [entries, checkIns]);

  const groups = useMemo(() => {
    const today = new Date();
    const g: Record<'Today' | 'Yesterday' | 'This Week' | 'Earlier', TimelineItem[]> = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      Earlier: [],
    };

    for (const item of items) {
      const daysAgo = diffDays(today, item.at);
      if (daysAgo === 0) g.Today.push(item);
      else if (daysAgo === 1) g.Yesterday.push(item);
      else if (daysAgo >= 2 && daysAgo <= 6) g['This Week'].push(item);
      else g.Earlier.push(item);
    }

    return g;
  }, [items]);

  const toggle = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

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

          <div style={{ color: colors.textDim, fontSize: 13 }}>{items.length} moments</div>
        </div>
      )}

      <div
        style={{
          flex: embedded ? undefined : 1,
          overflowY: embedded ? 'visible' : 'auto',
          padding: embedded ? '20px' : '24px',
          maxWidth: 760,
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
            Timeline
          </h1>
          <p style={{ color: colors.textMuted, fontSize: '16px' }}>
            Entries and check-ins, in one place.
          </p>
        </div>

        {items.length === 0 && (
          <div
            style={{
              background: colors.cardBg,
              border: `1px dashed ${colors.cardBorder}`,
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              color: colors.textMuted,
            }}
          >
            Nothing here yet.
          </div>
        )}

        {(['Today', 'Yesterday', 'This Week', 'Earlier'] as const).map((label) => {
          const section = groups[label];
          if (section.length === 0) return null;

          return (
            <div key={label} style={{ marginBottom: 18 }}>
              <div style={{ color: colors.textDim, fontSize: 13, marginBottom: 10, paddingLeft: 4 }}>{label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {section.map((item) => {
                  const isOpen = !!expanded[item.id];

                  const title =
                    item.kind === 'entry'
                      ? item.entry.title
                      : `Daily Check-In · ${moodLabel(item.checkIn.mood)} · Energy ${item.checkIn.energy}/5`;

                  const subtitle = item.at.toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  });

                  const body =
                    item.kind === 'entry'
                      ? item.entry.content
                      : item.checkIn.note || 'No note.';

                  return (
                    <div
                      key={item.id}
                      style={{
                        background: colors.cardBg,
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: '16px',
                        padding: '16px 16px',
                      }}
                    >
                      <button
                        onClick={() => toggle(item.id)}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ color: colors.text, fontSize: 16, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
                            <div style={{ color: colors.textDim, fontSize: 13 }}>{subtitle}</div>
                          </div>
                          <div style={{ color: colors.textDim, fontSize: 14, paddingTop: 2 }}>{isOpen ? '–' : '+'}</div>
                        </div>
                      </button>

                      <div
                        style={{
                          marginTop: 12,
                          color: isOpen ? colors.textMuted : colors.textDim,
                          fontSize: 14,
                          lineHeight: 1.55,
                          display: '-webkit-box',
                          WebkitLineClamp: isOpen ? 'unset' : 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {body}
                      </div>

                      {(onSelectEntry || onSelectCheckIn) && (
                        <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
                          <button
                            onClick={() => {
                              if (item.kind === 'entry') onSelectEntry?.(item.entry.id);
                              else onSelectCheckIn?.(item.checkIn.id);
                            }}
                            style={{
                              background: `linear-gradient(135deg, ${colors.accent}, #7c3aed)`,
                              border: 'none',
                              borderRadius: '12px',
                              padding: '10px 14px',
                              color: '#fff',
                              fontSize: 14,
                              cursor: 'pointer',
                            }}
                          >
                            Open
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
