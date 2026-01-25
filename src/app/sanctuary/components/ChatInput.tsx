'use client';

import React from 'react';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onVoiceClick: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  colors: {
    inputBg: string;
    cardBorder: string;
    textMuted: string;
    text: string;
    accent: string;
  };
  isDark: boolean;
  isGated?: boolean;
  placeholder?: string;
}

export function ChatInput({
  inputValue,
  setInputValue,
  onSend,
  onKeyDown,
  onVoiceClick,
  inputRef,
  fileInputRef,
  colors,
  isDark,
  isGated = false,
  placeholder = "Share what's on your mind...",
}: ChatInputProps) {
  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      background: colors.inputBg,
      border: `2px solid ${colors.cardBorder}`, // Thicker border
      borderRadius: 28,
      padding: '10px 18px',
      gap: 8,
      boxShadow: isDark 
        ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
        : '0 4px 20px rgba(0, 0, 0, 0.1)', // More visible shadow
      transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
    }}>
      
      {/* Paperclip Attachment Button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        aria-label="Attach image or file"
        style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: 'none',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: colors.textMuted,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = colors.text;
          e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = colors.textMuted;
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
        </svg>
      </button>

      {/* Microphone Voice Button */}
      <button
        type="button"
        onClick={onVoiceClick}
        aria-label="Start voice session"
        style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: 'none',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: colors.textMuted,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = colors.text;
          e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = colors.textMuted;
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M12 1a4 4 0 00-4 4v7a4 4 0 008 0V5a4 4 0 00-4-4z" />
          <path d="M19 10v2a7 7 0 01-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </button>

      {/* Text Input */}
      <textarea
        ref={inputRef}
        className="input-field"
        aria-label="Message to VERA"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={isGated}
        rows={1}
        style={{
          flex: 1,
          border: 'none',
          background: 'transparent',
          color: colors.text,
          fontSize: 16,
          lineHeight: 1.5,
          resize: 'none',
          maxHeight: 200,
          minHeight: 24,
          overflow: 'hidden',
          opacity: isGated ? 0.6 : 1,
        }}
      />

      {/* Send Button */}
      <button
        type="button"
        onClick={onSend}
        disabled={isGated || !inputValue.trim()}
        aria-label="Send message"
        onMouseEnter={(e) => {
          if (inputValue.trim()) {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = isDark
              ? '0 4px 12px rgba(176, 137, 104, 0.4)'
              : '0 4px 12px rgba(176, 137, 104, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          border: 'none',
          background: inputValue.trim() ? colors.accent : 'transparent',
          cursor: !isGated && inputValue.trim() ? 'pointer' : 'default',
          opacity: !isGated && inputValue.trim() ? 1 : 0.3,
          color: inputValue.trim() 
            ? (isDark ? '#1a1520' : '#fffbf5')
            : colors.textMuted,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          transition: 'all 0.2s ease',
        }}
      >
        <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
}