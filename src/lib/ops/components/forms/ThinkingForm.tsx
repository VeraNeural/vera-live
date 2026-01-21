import React, { useState, useEffect } from 'react';
import { FlexibleAction } from './shared/types';

interface ThinkingFormProps {
  action: FlexibleAction;
  thinkingMode?: string;
  onThinkingModeChange: (mode: string) => void;
  thinkingStyle?: string;
  onThinkingStyleChange?: (style: string) => void;
  thinkingDepth?: string;
  onThinkingDepthChange?: (depth: string) => void;
  thinkingSecondaryMode?: string;
  onThinkingSecondaryModeChange?: (mode: string) => void;
  colors: {
    accent: string;
    text: string;
    textMuted: string;
  };
  isDark: boolean;
  inputBorder: string;
  layerCardStyle: React.CSSProperties;
  sectionLabelStyle: React.CSSProperties;
}

export const ThinkingForm: React.FC<ThinkingFormProps> = ({
  action,
  thinkingMode,
  onThinkingModeChange,
  onThinkingStyleChange,
  onThinkingDepthChange,
  onThinkingSecondaryModeChange,
  colors,
  isDark,
  inputBorder,
  layerCardStyle,
  sectionLabelStyle,
}) => {
  const [showMoreThinkingModes, setShowMoreThinkingModes] = useState(false);

  const thinkingPrimaryModes = [
    { id: 'brainstorm', label: 'Brainstorm' },
    { id: 'summarize', label: 'Summarize' },
    { id: 'explain-like', label: 'Explain Like…' },
    { id: 'perspective-shift', label: 'Perspective Shift' },
  ];

  const thinkingSecondaryModes = [
    { id: 'compare-ideas', label: 'Compare Ideas' },
    { id: 'clarify-thinking', label: 'Clarify Thinking' },
    { id: 'reduce-complexity', label: 'Reduce Complexity' },
    { id: 'expand-options', label: 'Expand Options' },
    { id: 'mental-model', label: 'Mental Model' },
  ];

  // Initialize on mount
  useEffect(() => {
    setShowMoreThinkingModes(false);
    onThinkingModeChange('brainstorm');
    onThinkingStyleChange?.('simple');
    onThinkingDepthChange?.('short');
    onThinkingSecondaryModeChange?.('');
  }, [action.id]);

  const handleModeChange = (modeId: string) => {
    onThinkingModeChange(modeId);
    setShowMoreThinkingModes(false);
  };

  return (
    <>
      <div style={sectionLabelStyle}>Activity</div>
      <div style={layerCardStyle}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {thinkingPrimaryModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              style={{
                padding: '8px 12px',
                borderRadius: 999,
                border: `1px solid ${mode.id === thinkingMode ? colors.accent : inputBorder}`,
                background: 'transparent',
                color: mode.id === thinkingMode ? colors.text : colors.textMuted,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
