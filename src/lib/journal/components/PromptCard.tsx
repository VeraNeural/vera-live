// ============================================================================
// PROMPT CARD COMPONENT
// ============================================================================
// Writing prompt display with refresh and "use as title" actions

import React from 'react';

export interface PromptCardProps {
  currentPrompt: string;
  onRefresh: () => void;
  onUseAsTitle: () => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  currentPrompt,
  onRefresh,
  onUseAsTitle,
}) => {
  return (
    <div
      style={{
        padding: 'clamp(14px, 4vw, 24px)',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(200, 175, 140, 0.18)',
        borderRadius: 'clamp(10px, 2.5vw, 16px)',
        marginBottom: 'clamp(12px, 3.5vw, 18px)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: 'clamp(8px, 2.2vw, 10px)',
          color: 'rgba(200, 175, 140, 0.7)',
          letterSpacing: '0.18em',
          marginBottom: 'clamp(7px, 2vw, 12px)',
          textTransform: 'uppercase',
        }}
      >
        Writing Prompt
      </div>
      <p
        style={{
          fontSize: 'clamp(15px, 4vw, 19px)',
          fontStyle: 'italic',
          color: 'rgba(255, 250, 240, 0.85)',
          marginBottom: 'clamp(10px, 3vw, 16px)',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          lineHeight: 1.45,
        }}
      >
        "{currentPrompt}"
      </p>
      <div
        style={{
          display: 'flex',
          gap: 'clamp(7px, 2vw, 11px)',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={onRefresh}
          className="prompt-btn"
          style={{
            padding: 'clamp(7px, 2vw, 11px) clamp(14px, 3.5vw, 20px)',
            background: 'transparent',
            border: '1px solid rgba(200, 175, 140, 0.28)',
            borderRadius: 25,
            color: 'rgba(255, 250, 240, 0.6)',
            fontSize: 'clamp(11px, 2.8vw, 13px)',
          }}
        >
          Different prompt
        </button>
        <button
          onClick={onUseAsTitle}
          className="prompt-btn"
          style={{
            padding: 'clamp(7px, 2vw, 11px) clamp(14px, 3.5vw, 20px)',
            background: 'rgba(200, 175, 140, 0.15)',
            border: '1px solid rgba(200, 175, 140, 0.35)',
            borderRadius: 25,
            color: 'rgba(220, 200, 170, 0.95)',
            fontSize: 'clamp(11px, 2.8vw, 13px)',
            fontWeight: 500,
          }}
        >
          Use this
        </button>
      </div>
    </div>
  );
};
