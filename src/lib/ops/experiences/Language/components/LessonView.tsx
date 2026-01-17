'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { Language, Lesson, Phrase, UserProgress } from '../types';

type Colors = {
  text: string;
  textMuted: string;
  accent: string;
  cardBg: string;
  cardBorder: string;
};

type Props = {
  language: Language;
  lessons: Lesson[];
  progress: UserProgress[];
  onProgressChange: (next: UserProgress[]) => void;
  onSpeak: (text: string, languageCode: string) => Promise<void>;
  colors: Colors;
  isDark: boolean;
};

function progressForLesson(progress: UserProgress[], lessonId: string) {
  return progress.find((p) => p.lessonId === lessonId) ?? { lessonId, completed: false };
}

export default function LessonView({
  language,
  lessons,
  progress,
  onProgressChange,
  onSpeak,
  colors,
  isDark,
}: Props) {
  const [activeLessonId, setActiveLessonId] = useState<string>(lessons[0]?.id ?? '');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  const activeLesson = useMemo(() => lessons.find((l) => l.id === activeLessonId) ?? lessons[0], [lessons, activeLessonId]);
  const phrases = activeLesson?.phrases ?? [];
  const clampedIndex = Math.max(0, Math.min(phraseIndex, Math.max(0, phrases.length - 1)));
  const currentPhrase: Phrase | undefined = phrases[clampedIndex];

  useEffect(() => {
    setPhraseIndex(0);
  }, [activeLessonId]);

  const markCompleted = useCallback(() => {
    if (!activeLesson) return;
    const next = [...progress];
    const idx = next.findIndex((p) => p.lessonId === activeLesson.id);
    const updated: UserProgress = { lessonId: activeLesson.id, completed: true };
    if (idx === -1) next.push(updated);
    else next[idx] = { ...next[idx], ...updated };
    onProgressChange(next);
  }, [activeLesson, progress, onProgressChange]);

  const handleSpeak = useCallback(
    async (text: string) => {
      const key = `${activeLessonId}:${clampedIndex}`;
      setSpeakingKey(key);
      try {
        await onSpeak(text, language.code);
      } finally {
        setSpeakingKey(null);
      }
    },
    [activeLessonId, clampedIndex, onSpeak, language.code]
  );

  if (!activeLesson) {
    return (
      <div style={{ padding: 16, color: colors.textMuted }}>
        No lessons yet for {language.name}. Start with Spanish, French, or Macedonian.
      </div>
    );
  }

  const lessonProgress = progressForLesson(progress, activeLesson.id);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 13, color: colors.textMuted }}>{language.flag} {language.name}</div>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 300, color: colors.text }}>
            {activeLesson.title}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            className="input-field"
            value={activeLessonId}
            onChange={(e) => setActiveLessonId(e.target.value)}
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 12,
              padding: '10px 12px',
              color: colors.text,
              fontSize: 13,
              minWidth: 200,
            }}
          >
            {lessons.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title} · {l.level}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: colors.textMuted }}>
          Phrase {clampedIndex + 1} of {phrases.length}
        </div>
        <div style={{
          fontSize: 12,
          padding: '6px 10px',
          borderRadius: 999,
          background: lessonProgress.completed
            ? (isDark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.10)')
            : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)'),
          border: `1px solid ${lessonProgress.completed ? 'rgba(16,185,129,0.35)' : colors.cardBorder}`,
          color: lessonProgress.completed ? 'rgba(16,185,129,0.95)' : colors.textMuted,
        }}>
          {lessonProgress.completed ? 'Completed' : 'In progress'}
        </div>
      </div>

      <div
        style={{
          padding: 18,
          borderRadius: 16,
          background: colors.cardBg,
          border: `1px solid ${colors.cardBorder}`,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 6 }}>
          {currentPhrase?.original}
        </div>
        <div style={{ fontSize: 14, color: colors.textMuted, marginBottom: 10 }}>
          {currentPhrase?.translated}
        </div>
        {currentPhrase?.pronunciation && (
          <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 14 }}>
            Pronunciation: <span style={{ color: colors.text }}>{currentPhrase.pronunciation}</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => currentPhrase && handleSpeak(currentPhrase.original)}
            disabled={!currentPhrase || speakingKey !== null}
            style={{
              padding: '10px 14px',
              borderRadius: 999,
              border: `1px solid ${colors.cardBorder}`,
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
              cursor: !currentPhrase || speakingKey !== null ? 'default' : 'pointer',
              color: colors.text,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {speakingKey ? 'Listening…' : 'Listen'}
          </button>

          <button
            onClick={markCompleted}
            style={{
              padding: '10px 14px',
              borderRadius: 999,
              border: 'none',
              background: colors.accent,
              color: 'white',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Mark complete
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <button
          onClick={() => setPhraseIndex((i) => Math.max(0, i - 1))}
          disabled={clampedIndex === 0}
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: 14,
            border: `1px solid ${colors.cardBorder}`,
            background: colors.cardBg,
            cursor: clampedIndex === 0 ? 'default' : 'pointer',
            color: colors.text,
            fontWeight: 600,
          }}
        >
          Previous
        </button>
        <button
          onClick={() => setPhraseIndex((i) => Math.min(phrases.length - 1, i + 1))}
          disabled={clampedIndex >= phrases.length - 1}
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: 14,
            border: `1px solid ${colors.cardBorder}`,
            background: colors.cardBg,
            cursor: clampedIndex >= phrases.length - 1 ? 'default' : 'pointer',
            color: colors.text,
            fontWeight: 600,
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
