'use client';

import React, { useCallback, useMemo, useState } from 'react';
import type { Language, VocabEntry } from '../types';

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
  onSaveVocab: (entry: Omit<VocabEntry, 'id' | 'createdAt'>) => void;
  colors: Colors;
  isDark: boolean;
};

export default function TranslationTool({ languages, onSpeak, onSaveVocab, colors, isDark }: Props) {
  const [from, setFrom] = useState(languages.find((l) => l.code === 'es') ?? languages[0]);
  const [to, setTo] = useState(languages.find((l) => l.code === 'fr') ?? languages[1] ?? languages[0]);
  const [text, setText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const canTranslate = useMemo(() => !!text.trim() && !!from && !!to && from.code !== to.code, [text, from, to]);

  const handleTranslate = useCallback(async () => {
    if (!canTranslate) return;
    setIsLoading(true);
    setResult(null);
    try {
      const resp = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), from: from.code, to: to.code }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data?.error || 'Translation failed');
      setResult(typeof data?.translatedText === 'string' ? data.translatedText : null);
    } catch (e) {
      setResult('Sorry — I could not translate that right now.');
    } finally {
      setIsLoading(false);
    }
  }, [canTranslate, text, from, to]);

  const handleSpeak = useCallback(async () => {
    if (!result) return;
    setIsSpeaking(true);
    try {
      await onSpeak(result, to.code);
    } finally {
      setIsSpeaking(false);
    }
  }, [result, onSpeak, to.code]);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 300, color: colors.text }}>
            Translate
          </div>
          <div style={{ fontSize: 13, color: colors.textMuted }}>Clean, calm translations — with optional voice.</div>
        </div>
      </div>

      <div
        style={{
          padding: 16,
          borderRadius: 16,
          background: colors.cardBg,
          border: `1px solid ${colors.cardBorder}`,
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 6 }}>From</div>
            <select
              className="input-field"
              value={from.code}
              onChange={(e) => setFrom(languages.find((l) => l.code === e.target.value) ?? from)}
              style={{
                width: '100%',
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 12,
                padding: '10px 12px',
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

          <div>
            <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 6 }}>To</div>
            <select
              className="input-field"
              value={to.code}
              onChange={(e) => setTo(languages.find((l) => l.code === e.target.value) ?? to)}
              style={{
                width: '100%',
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 12,
                padding: '10px 12px',
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
        </div>

        <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 6 }}>Enter text to translate</div>
        <textarea
          className="input-field"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Enter text to translate…"
          style={{
            width: '100%',
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: 14,
            padding: '12px 12px',
            color: colors.text,
            fontSize: 14,
            resize: 'vertical',
          }}
        />

        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
          <button
            onClick={handleTranslate}
            disabled={!canTranslate || isLoading}
            style={{
              padding: '12px 16px',
              borderRadius: 999,
              border: 'none',
              background: colors.accent,
              color: 'white',
              fontWeight: 700,
              cursor: !canTranslate || isLoading ? 'default' : 'pointer',
            }}
          >
            {isLoading ? 'Translating…' : 'Translate'}
          </button>

          {result && (
            <>
              <button
                onClick={handleSpeak}
                disabled={isSpeaking}
                style={{
                  padding: '12px 16px',
                  borderRadius: 999,
                  border: `1px solid ${colors.cardBorder}`,
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
                  color: colors.text,
                  fontWeight: 700,
                  cursor: isSpeaking ? 'default' : 'pointer',
                }}
              >
                {isSpeaking ? 'Speaking…' : 'Listen'}
              </button>

              <button
                onClick={() => {
                  if (!result) return;
                  onSaveVocab({ from: from.code, to: to.code, original: text.trim(), translated: result });
                }}
                style={{
                  padding: '12px 16px',
                  borderRadius: 999,
                  border: `1px solid ${colors.cardBorder}`,
                  background: colors.cardBg,
                  color: colors.text,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Save phrase
              </button>
            </>
          )}
        </div>
      </div>

      {result && (
        <div
          style={{
            padding: 16,
            borderRadius: 16,
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
          }}
        >
          <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>Result</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: colors.text, whiteSpace: 'pre-wrap' }}>{result}</div>
        </div>
      )}
    </div>
  );
}
