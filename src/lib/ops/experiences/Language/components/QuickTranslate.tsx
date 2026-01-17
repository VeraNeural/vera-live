'use client';

import React, { useCallback, useMemo, useState } from 'react';
import type { Language } from '../types';

type Colors = {
  text: string;
  textMuted: string;
  accent: string;
  cardBg: string;
  cardBorder: string;
};

type Props = {
  languages: Language[];
  onSpeak: (text: string, languageCode: string) => Promise<void>;
  colors: Colors;
  isDark: boolean;
};

export default function QuickTranslate({ languages, onSpeak, colors, isDark }: Props) {
  const [target, setTarget] = useState(languages.find((l) => l.code === 'es') ?? languages[0]);
  const [text, setText] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const canRun = useMemo(() => !!text.trim() && !!target, [text, target]);

  const run = useCallback(async () => {
    if (!canRun) return;
    setIsLoading(true);
    setAnswer(null);
    try {
      // Quick mode: assume source language is the user's input language.
      // We still require a from-code for the API; use target as a fallback to avoid same-language.
      const from = languages.find((l) => l.code !== target.code) ?? target;

      const resp = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), from: from.code, to: target.code }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data?.error || 'Translation failed');
      const translated = typeof data?.translatedText === 'string' ? data.translatedText : '';
      setAnswer(translated || '');

      if (translated) {
        void onSpeak(translated, target.code);
      }
    } catch {
      setAnswer('Sorry — I could not translate that right now.');
    } finally {
      setIsLoading(false);
    }
  }, [canRun, text, target, languages, onSpeak]);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 300, color: colors.text, marginBottom: 8 }}>
        Quick translate
      </div>

      <div style={{
        padding: 16,
        borderRadius: 16,
        background: colors.cardBg,
        border: `1px solid ${colors.cardBorder}`,
        marginBottom: 12,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 10 }}>
          <input
            className="input-field"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="How do I say ___ in ___?"
            style={{
              width: '100%',
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 12,
              padding: '12px 12px',
              color: colors.text,
              fontSize: 14,
            }}
          />

          <select
            className="input-field"
            value={target.code}
            onChange={(e) => setTarget(languages.find((l) => l.code === e.target.value) ?? target)}
            style={{
              width: '100%',
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 12,
              padding: '12px 12px',
              color: colors.text,
              fontSize: 13,
            }}
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <button
            onClick={run}
            disabled={!canRun || isLoading}
            style={{
              padding: '10px 14px',
              borderRadius: 999,
              border: 'none',
              background: colors.accent,
              color: 'white',
              fontWeight: 700,
              cursor: !canRun || isLoading ? 'default' : 'pointer',
            }}
          >
            {isLoading ? '…' : 'Translate'}
          </button>
        </div>
      </div>

      {answer !== null && (
        <div style={{ padding: 16, borderRadius: 16, background: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
          <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>Result</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: colors.text, whiteSpace: 'pre-wrap' }}>{answer}</div>
        </div>
      )}
    </div>
  );
}
