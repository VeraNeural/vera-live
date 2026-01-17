'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SUPPORTED_LANGUAGES, SUPPORTED_LANGUAGE_REGIONS } from './data/languages';
import { getLessonsForLanguage } from './data/lessons';
import type { Language, UserProgress, VocabEntry } from './types';
import LanguagePicker from './components/LanguagePicker';
import LessonView from './components/LessonView';
import TranslationTool from './components/TranslationTool';
import QuickTranslate from './components/QuickTranslate';
import VocabularyList from './components/VocabularyList';

type Colors = {
  text: string;
  textMuted: string;
  accent: string;
  cardBg: string;
  cardBorder: string;
  glow?: string;
};

type Props = {
  colors: Colors;
  isDark: boolean;
  onExit: () => void;
};

type TabId = 'learn' | 'translate' | 'vocab';

const STORAGE = {
  lastLanguage: 'vera.ops.language.lastLanguage.v1',
  lastTab: 'vera.ops.language.lastTab.v1',
  progress: 'vera.ops.language.progress.v1',
  vocab: 'vera.ops.language.vocab.v1',
};

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export default function LanguageExperience({ colors, isDark, onExit }: Props) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [tab, setTab] = useState<TabId>('learn');

  const [progressByLang, setProgressByLang] = useState<Record<string, UserProgress[]>>({});
  const [vocab, setVocab] = useState<VocabEntry[]>([]);

  useEffect(() => {
    const lastLang = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE.lastLanguage) : null;
    const lastTab = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE.lastTab) : null;

    const lang = lastLang ? SUPPORTED_LANGUAGES.find((l) => l.code === lastLang) ?? null : null;
    setSelectedLanguage(lang ?? SUPPORTED_LANGUAGES[0] ?? null);

    if (lastTab === 'learn' || lastTab === 'translate' || lastTab === 'vocab') {
      setTab(lastTab);
    }

    const storedProgress = typeof window !== 'undefined' ? safeJsonParse<Record<string, UserProgress[]>>(window.localStorage.getItem(STORAGE.progress)) : null;
    if (storedProgress) setProgressByLang(storedProgress);

    const storedVocab = typeof window !== 'undefined' ? safeJsonParse<VocabEntry[]>(window.localStorage.getItem(STORAGE.vocab)) : null;
    if (storedVocab) setVocab(storedVocab);
  }, []);

  useEffect(() => {
    if (!selectedLanguage) return;
    window.localStorage.setItem(STORAGE.lastLanguage, selectedLanguage.code);
  }, [selectedLanguage]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE.lastTab, tab);
  }, [tab]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE.progress, JSON.stringify(progressByLang));
  }, [progressByLang]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE.vocab, JSON.stringify(vocab));
  }, [vocab]);

  const lessons = useMemo(() => {
    if (!selectedLanguage) return [];
    return getLessonsForLanguage(selectedLanguage.code);
  }, [selectedLanguage]);

  const progress = useMemo(() => {
    if (!selectedLanguage) return [];
    return progressByLang[selectedLanguage.code] ?? [];
  }, [progressByLang, selectedLanguage]);

  const setProgress = useCallback(
    (next: UserProgress[]) => {
      if (!selectedLanguage) return;
      setProgressByLang((prev) => ({ ...prev, [selectedLanguage.code]: next }));
    },
    [selectedLanguage]
  );

  const speak = useCallback(async (text: string, languageCode: string) => {
    const resp = await fetch('/api/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, languageCode }),
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(data?.error || 'Speak failed');

    const audioUrl: string | undefined = data?.audioUrl;
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    await audio.play();
  }, []);

  const saveVocab = useCallback((entry: Omit<VocabEntry, 'id' | 'createdAt'>) => {
    setVocab((prev) => [
      {
        id: randomId('vocab'),
        createdAt: new Date().toISOString(),
        ...entry,
      },
      ...prev,
    ]);
  }, []);

  const removeVocab = useCallback((id: string) => {
    setVocab((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const tabButton = (id: TabId, label: string) => {
    const active = tab === id;
    return (
      <button
        onClick={() => setTab(id)}
        className="tab-btn"
        style={{
          padding: '10px 14px',
          borderRadius: 999,
          border: `1px solid ${active ? colors.accent : colors.cardBorder}`,
          background: active ? (isDark ? 'rgba(255,180,100,0.10)' : 'rgba(200,160,100,0.12)') : colors.cardBg,
          color: active ? colors.accent : colors.text,
          cursor: 'pointer',
          fontWeight: 800,
          fontSize: 13,
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', animation: 'fadeIn 0.35s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 34, fontWeight: 300, color: colors.text }}>
            Language
          </div>
          <div style={{ fontSize: 13, color: colors.textMuted }}>
            Learn phrases that support regulation — and translate gently.
          </div>
        </div>

        <button
          onClick={onExit}
          style={{
            padding: '10px 14px',
            borderRadius: 999,
            border: `1px solid ${colors.cardBorder}`,
            background: colors.cardBg,
            color: colors.textMuted,
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          Back to Ops
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {tabButton('learn', 'Learn')}
          {tabButton('translate', 'Translate')}
          {tabButton('vocab', 'My Vocabulary')}
        </div>

        {selectedLanguage && tab !== 'vocab' && (
          <button
            onClick={() => setSelectedLanguage(null)}
            style={{
              padding: '10px 14px',
              borderRadius: 999,
              border: `1px solid ${colors.cardBorder}`,
              background: colors.cardBg,
              color: colors.text,
              cursor: 'pointer',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {selectedLanguage.flag} {selectedLanguage.name}
            <span style={{ color: colors.textMuted, fontWeight: 700 }}>change</span>
          </button>
        )}
      </div>

      {!selectedLanguage ? (
        <LanguagePicker
          regions={SUPPORTED_LANGUAGE_REGIONS}
          selected={null}
          onSelect={setSelectedLanguage}
          colors={colors}
          isDark={isDark}
        />
      ) : (
        <>
          {tab === 'learn' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <LessonView
                language={selectedLanguage}
                lessons={lessons}
                progress={progress}
                onProgressChange={setProgress}
                onSpeak={speak}
                colors={colors}
                isDark={isDark}
              />
            </div>
          )}

          {tab === 'translate' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <QuickTranslate languages={SUPPORTED_LANGUAGES} onSpeak={speak} colors={colors} isDark={isDark} />
              <TranslationTool
                languages={SUPPORTED_LANGUAGES}
                onSpeak={speak}
                onSaveVocab={saveVocab}
                colors={colors}
                isDark={isDark}
              />
            </div>
          )}

          {tab === 'vocab' && (
            <VocabularyList
              vocab={vocab}
              languages={SUPPORTED_LANGUAGES}
              onSpeak={speak}
              onRemove={removeVocab}
              colors={colors}
              isDark={isDark}
            />
          )}
        </>
      )}
    </div>
  );
}
