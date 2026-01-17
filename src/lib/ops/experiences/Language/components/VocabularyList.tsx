'use client';

import React, { useMemo, useState } from 'react';
import type { Language, VocabEntry } from '../types';

type Colors = {
  text: string;
  textMuted: string;
  accent: string;
  cardBg: string;
  cardBorder: string;
};

type Props = {
  vocab: VocabEntry[];
  languages: Language[];
  onSpeak: (text: string, languageCode: string) => Promise<void>;
  onRemove: (id: string) => void;
  colors: Colors;
  isDark: boolean;
};

export default function VocabularyList({ vocab, languages, onSpeak, onRemove, colors, isDark }: Props) {
  const [reviewMode, setReviewMode] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [index, setIndex] = useState(0);

  const grouped = useMemo(() => {
    const byTo = new Map<string, VocabEntry[]>();
    for (const v of vocab) {
      const key = v.to;
      byTo.set(key, [...(byTo.get(key) ?? []), v]);
    }
    return Array.from(byTo.entries()).map(([to, entries]) => ({
      to,
      entries: entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    }));
  }, [vocab]);

  const langLabel = (code: string) => languages.find((l) => l.code === code);

  const cards = vocab;
  const current = cards.length ? cards[Math.max(0, Math.min(index, cards.length - 1))] : null;

  if (!vocab.length) {
    return (
      <div style={{ padding: 16, borderRadius: 16, background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, color: colors.textMuted }}>
        No saved phrases yet. Use Translate → “Save phrase”.
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 300, color: colors.text }}>
            My Vocabulary
          </div>
          <div style={{ fontSize: 13, color: colors.textMuted }}>Keep the phrases you care about.</div>
        </div>

        <button
          onClick={() => {
            setReviewMode((v) => !v);
            setReveal(false);
          }}
          style={{
            padding: '10px 14px',
            borderRadius: 999,
            border: `1px solid ${colors.cardBorder}`,
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
            color: colors.text,
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          {reviewMode ? 'Exit review' : 'Review mode'}
        </button>
      </div>

      {reviewMode && current ? (
        <div style={{ padding: 18, borderRadius: 16, background: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
          <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10 }}>
            Card {index + 1} / {cards.length}
          </div>

          <div style={{ fontSize: 20, fontWeight: 800, color: colors.text, marginBottom: 6 }}>
            {reveal ? current.translated : current.original}
          </div>
          <div style={{ fontSize: 14, color: colors.textMuted, marginBottom: 14 }}>
            {reveal ? current.original : 'Tap reveal when ready'}
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => setReveal((v) => !v)}
              style={{
                padding: '10px 14px',
                borderRadius: 999,
                border: `1px solid ${colors.cardBorder}`,
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
                color: colors.text,
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              {reveal ? 'Hide' : 'Reveal'}
            </button>

            <button
              onClick={() => void onSpeak(current.translated, current.to)}
              style={{
                padding: '10px 14px',
                borderRadius: 999,
                border: 'none',
                background: colors.accent,
                color: 'white',
                cursor: 'pointer',
                fontWeight: 800,
              }}
            >
              Listen
            </button>

            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              style={{
                padding: '10px 14px',
                borderRadius: 999,
                border: `1px solid ${colors.cardBorder}`,
                background: colors.cardBg,
                color: colors.text,
                cursor: index === 0 ? 'default' : 'pointer',
                fontWeight: 700,
              }}
            >
              Prev
            </button>
            <button
              onClick={() => {
                setReveal(false);
                setIndex((i) => Math.min(cards.length - 1, i + 1));
              }}
              disabled={index >= cards.length - 1}
              style={{
                padding: '10px 14px',
                borderRadius: 999,
                border: `1px solid ${colors.cardBorder}`,
                background: colors.cardBg,
                color: colors.text,
                cursor: index >= cards.length - 1 ? 'default' : 'pointer',
                fontWeight: 700,
              }}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {grouped.map((g) => {
            const toLang = langLabel(g.to);
            return (
              <div key={g.to}>
                <div style={{ fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: colors.textMuted, margin: '8px 2px 10px' }}>
                  {toLang ? `${toLang.flag} ${toLang.name}` : g.to}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {g.entries.map((e) => (
                    <div
                      key={e.id}
                      style={{
                        padding: 14,
                        borderRadius: 14,
                        background: colors.cardBg,
                        border: `1px solid ${colors.cardBorder}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>{e.translated}</div>
                      <div style={{ fontSize: 13, color: colors.textMuted }}>{e.original}</div>

                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button
                          onClick={() => void onSpeak(e.translated, e.to)}
                          style={{
                            padding: '9px 12px',
                            borderRadius: 999,
                            border: `1px solid ${colors.cardBorder}`,
                            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
                            color: colors.text,
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          Listen
                        </button>
                        <button
                          onClick={() => onRemove(e.id)}
                          style={{
                            padding: '9px 12px',
                            borderRadius: 999,
                            border: `1px solid ${colors.cardBorder}`,
                            background: colors.cardBg,
                            color: colors.textMuted,
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
