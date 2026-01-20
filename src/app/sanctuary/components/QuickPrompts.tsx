'use client';

import React from 'react';
import { QuickPrompt } from '../types';

interface QuickPromptsProps {
  prompts: QuickPrompt[];
  onSelect: (text: string) => void;
  colors: {
    cardBg: string;
    cardBorder: string;
    text: string;
    accent: string;
  };
  isDark: boolean;
}

export function QuickPrompts({ prompts, onSelect, colors, isDark }: QuickPromptsProps) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 8,
      maxWidth: '100%',
    }}>
      {prompts.map((prompt, index) => (
        <button
          key={index}
          className="prompt-btn"
          onClick={() => onSelect(prompt.text)}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #d1d5db',
            borderRadius: '50px',
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#6b7280',
            fontSize: 13,
            fontWeight: 400,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = isDark ? 'rgba(251, 191, 36, 0.6)' : '#fbbf24';
            e.currentTarget.style.color = isDark ? 'rgba(251, 191, 36, 0.9)' : '#d97706';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db';
            e.currentTarget.style.color = isDark ? 'rgba(255, 255, 255, 0.7)' : '#6b7280';
          }}
        >
          {prompt.text}
        </button>
      ))}
    </div>
  );
}