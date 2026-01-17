// ============================================================================
// ENTRY EDITOR COMPONENT
// ============================================================================
// Write tab UI with title/content inputs, word count, and save button

import React from 'react';
import type { Mood } from '../types';
import type { PromptCardProps } from './PromptCard';
import type { MoodSelectorProps } from './MoodSelector';

interface EntryEditorProps {
  PromptCardComponent: React.ComponentType<PromptCardProps>;
  MoodSelectorComponent: React.ComponentType<MoodSelectorProps>;

  // Prompt
  currentPrompt: string;
  onRefreshPrompt: () => void;
  onUsePromptAsTitle: () => void;
  
  // Title
  title: string;
  onTitleChange: (title: string) => void;
  isTitleFocused: boolean;
  onTitleFocus: () => void;
  onTitleBlur: () => void;
  
  // Content
  content: string;
  onContentChange: (content: string) => void;
  isContentFocused: boolean;
  onContentFocus: () => void;
  onContentBlur: () => void;
  
  // Mood
  selectedMood: Mood | null;
  onMoodSelect: (mood: Mood) => void;
  
  // Save
  onSave: () => void;
  saveStatus: 'idle' | 'saving' | 'saved';
  wordCount: number;
}

export const EntryEditor: React.FC<EntryEditorProps> = ({
  PromptCardComponent,
  MoodSelectorComponent,
  currentPrompt,
  onRefreshPrompt,
  onUsePromptAsTitle,
  title,
  onTitleChange,
  isTitleFocused,
  onTitleFocus,
  onTitleBlur,
  content,
  onContentChange,
  isContentFocused,
  onContentFocus,
  onContentBlur,
  selectedMood,
  onMoodSelect,
  onSave,
  saveStatus,
  wordCount,
}) => {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {/* Writing Prompt Card */}
      <PromptCardComponent
        currentPrompt={currentPrompt}
        onRefresh={onRefreshPrompt}
        onUseAsTitle={onUsePromptAsTitle}
      />

      {/* Title Input */}
      <input
        type="text"
        className="journal-input"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        onFocus={onTitleFocus}
        onBlur={onTitleBlur}
        placeholder="Give this entry a title..."
        aria-label="Entry title"
        style={{
          width: '100%',
          padding: 'clamp(12px, 3.5vw, 16px) clamp(14px, 3.8vw, 20px)',
          background: isTitleFocused 
            ? 'rgba(255, 248, 235, 0.06)' 
            : 'rgba(255, 255, 255, 0.03)',
          border: `1px solid ${isTitleFocused ? 'rgba(220, 190, 140, 0.45)' : 'rgba(200, 175, 140, 0.15)'}`,
          borderRadius: 'clamp(9px, 2.2vw, 13px)',
          color: 'rgba(255, 250, 240, 0.95)',
          fontSize: 'clamp(13px, 3.5vw, 15px)',
          marginBottom: 'clamp(10px, 2.8vw, 14px)',
          fontFamily: 'inherit',
          transition: 'all 0.25s ease',
          boxShadow: isTitleFocused 
            ? '0 0 0 3px rgba(220, 190, 140, 0.12), 0 4px 20px rgba(200, 160, 100, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.03)' 
            : '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      />

      {/* Content Textarea */}
      <textarea
        className="journal-input"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        onFocus={onContentFocus}
        onBlur={onContentBlur}
        placeholder="Begin writing... let your thoughts flow freely."
        aria-label="Journal entry content"
        style={{
          width: '100%',
          minHeight: 'clamp(140px, 35vw, 200px)',
          padding: 'clamp(14px, 3.8vw, 20px)',
          background: isContentFocused 
            ? 'linear-gradient(180deg, rgba(255, 250, 240, 0.07) 0%, rgba(255, 248, 235, 0.04) 100%)' 
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.02) 100%)',
          border: `1px solid ${isContentFocused ? 'rgba(220, 190, 140, 0.45)' : 'rgba(200, 175, 140, 0.15)'}`,
          borderRadius: 'clamp(10px, 2.5vw, 15px)',
          color: 'rgba(255, 250, 240, 0.92)',
          fontSize: 'clamp(13px, 3.5vw, 15px)',
          lineHeight: 1.75,
          resize: 'vertical',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: 'italic',
          transition: 'all 0.25s ease',
          boxShadow: isContentFocused 
            ? '0 0 0 3px rgba(220, 190, 140, 0.12), 0 8px 32px rgba(200, 160, 100, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.04)' 
            : '0 2px 12px rgba(0, 0, 0, 0.12)',
        }}
      />

      {/* Mood Selector */}
      <MoodSelectorComponent
        selectedMood={selectedMood}
        onMoodSelect={onMoodSelect}
      />

      {/* Footer with Word Count & Save Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'clamp(18px, 5vw, 28px)',
        }}
      >
        <span
          style={{
            color: 'rgba(255, 250, 240, 0.35)',
            fontSize: 'clamp(11px, 2.8vw, 13px)',
          }}
        >
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
        <button
          className="journal-btn"
          onClick={onSave}
          disabled={!content.trim() || saveStatus === 'saving'}
          style={{
            padding: 'clamp(11px, 3vw, 15px) clamp(22px, 5.5vw, 30px)',
            background: !content.trim()
              ? 'rgba(100, 90, 80, 0.3)'
              : saveStatus === 'saved'
              ? 'linear-gradient(135deg, #6ee7b7 0%, #4ade80 100%)'
              : 'linear-gradient(135deg, #c4a87c 0%, #9a8058 100%)',
            border: 'none',
            borderRadius: 30,
            color: '#fff',
            fontSize: 'clamp(13px, 3.2vw, 15px)',
            fontWeight: 500,
            boxShadow: content.trim() ? '0 4px 18px rgba(180, 150, 100, 0.28)' : 'none',
            opacity: !content.trim() ? 0.5 : 1,
            cursor: !content.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved ✓' : 'Save Entry'}
        </button>
      </div>
    </div>
  );
};
