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
      gap: 12,
      maxWidth: '100%',
    }}>
      {prompts.map((prompt, index) => (
        <button
          key={index}
          className="prompt-btn"
          onClick={() => onSelect(prompt.text)}
          style={{
            padding: '12px 20px',
            background: isDark ? 'rgba(255, 255, 255, 0.08)' : colors.cardBg,
            border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : `1px solid ${colors.cardBorder}`,
            borderRadius: 50,
            color: isDark ? 'rgba(255, 255, 255, 0.85)' : colors.text,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            whiteSpace: 'nowrap',
            boxShadow: isDark
              ? '0 2px 8px rgba(0, 0, 0, 0.2)'
              : '0 2px 8px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = isDark
              ? '0 4px 12px rgba(0, 0, 0, 0.3)'
              : '0 4px 12px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = colors.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = isDark
              ? '0 2px 8px rgba(0, 0, 0, 0.2)'
              : '0 2px 8px rgba(0, 0, 0, 0.06)';
            e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.15)' : colors.cardBorder;
          }}
        >
          {prompt.text}
        </button>
      ))}
    </div>
  );
}