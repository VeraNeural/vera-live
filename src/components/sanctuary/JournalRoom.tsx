'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme, ThemeToggle } from '@/contexts/ThemeContext';

import type { JournalEntry, Mood, Tab } from '@/lib/journal/types';
import { GLOBAL_STYLES } from '@/lib/journal/theme';
import * as JournalIcons from '@/lib/journal/icons';
import { JOURNAL_PROMPTS, MOOD_OPTIONS } from '@/lib/journal/data/prompts';
import { EntryEditor } from '@/lib/journal/components/EntryEditor';
import { EntriesList } from '@/lib/journal/components/EntriesList';
import { MoodSelector } from '@/lib/journal/components/MoodSelector';
import { PromptCard } from '@/lib/journal/components/PromptCard';

interface JournalNookProps {
  onBack: () => void;
}

export default function JournalNook({ onBack }: JournalNookProps) {
  const { colors } = useTheme();

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

  useEffect(() => {
    setMounted(true);
    setCurrentPrompt(JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]);

    const preventOverscroll = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const scrollable = target.closest('.journal-scroll');
      if (!scrollable) e.preventDefault();
    };

    document.addEventListener('touchmove', preventOverscroll, { passive: false });
    return () => document.removeEventListener('touchmove', preventOverscroll);
  }, []);

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
            style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.2vw, 10px)', padding: 'clamp(7px, 1.8vw, 11px) clamp(11px, 2.8vw, 16px)', background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 50, fontSize: 'clamp(11px, 2.8vw, 13px)', fontWeight: 450, color: colors.textMuted, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
          >
            <JournalIcons.BackArrowIcon size={16} color={colors.textMuted} />
            <span>Sanctuary</span>
          </button>

          <ThemeToggle />
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

            <nav style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(5px, 1.8vw, 9px)', marginBottom: 'clamp(14px, 4vw, 24px)' }}>
              {(['write', 'entries'] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  className="tab-btn"
                  onClick={() => setActiveTab(tab)}
                  aria-selected={activeTab === tab}
                  style={{ padding: 'clamp(9px, 2.2vw, 13px) clamp(18px, 4.5vw, 26px)', background: activeTab === tab ? 'rgba(200, 175, 140, 0.15)' : 'transparent', border: `1px solid ${activeTab === tab ? 'rgba(200, 175, 140, 0.35)' : 'rgba(255, 255, 255, 0.1)'}` , borderRadius: 30, color: activeTab === tab ? 'rgba(220, 200, 170, 0.95)' : 'rgba(255, 255, 255, 0.5)', fontSize: 'clamp(12px, 3vw, 14px)', fontWeight: activeTab === tab ? 500 : 400 }}
                >
                  {tab === 'entries' ? 'Past Entries' : 'Write'}
                </button>
              ))}
            </nav>

            {activeTab === 'write' && (
              <EntryEditor PromptCardComponent={PromptCard} MoodSelectorComponent={MoodSelector} currentPrompt={currentPrompt} onRefreshPrompt={getNewPrompt} onUsePromptAsTitle={usePromptAsTitle} title={title} onTitleChange={setTitle} isTitleFocused={isTitleFocused} onTitleFocus={() => setIsTitleFocused(true)} onTitleBlur={() => setIsTitleFocused(false)} content={content} onContentChange={setContent} isContentFocused={isContentFocused} onContentFocus={() => setIsContentFocused(true)} onContentBlur={() => setIsContentFocused(false)} selectedMood={selectedMood} onMoodSelect={handleMoodSelect} onSave={handleSaveEntry} saveStatus={saveStatus} wordCount={wordCount} />
            )}

            {activeTab === 'entries' && <EntriesList entries={entries} moodOptions={MOOD_OPTIONS} />}
          </div>
        </main>
      </div>
    </>
  );
}
