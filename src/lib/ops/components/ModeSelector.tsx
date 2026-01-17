import React from 'react';
import { GenerationMode, AIProvider } from '../types';
import { OpsIcon } from '../icons';

interface ModeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMode: GenerationMode;
  onSelectMode: (mode: GenerationMode) => void;
  selectedProvider: AIProvider;
  onSelectProvider: (provider: AIProvider) => void;
  colors: {
    text: string;
    textMuted: string;
    accent: string;
    cardBorder: string;
  };
  isDark: boolean;
}

const GENERATION_MODES: Record<
  GenerationMode,
  { name: string; description: string; iconType: string }
> = {
  single: { name: 'Single AI', description: 'Pick one AI', iconType: 'mode-single' },
  specialist: {
    name: 'Specialist',
    description: 'Best AI for task',
    iconType: 'mode-specialist',
  },
  consensus: {
    name: 'Consensus',
    description: 'All 3 merge best',
    iconType: 'mode-consensus',
  },
  'review-chain': {
    name: 'Review Chain',
    description: 'Draft → Edit → Polish',
    iconType: 'mode-chain',
  },
  compare: {
    name: 'Compare',
    description: 'See all 3 side-by-side',
    iconType: 'mode-compare',
  },
};

const AI_PROVIDERS: Record<
  AIProvider,
  { name: string; color: string; iconType: string; tagline: string }
> = {
  claude: {
    name: 'Claude',
    color: '#D97706',
    iconType: 'ai-claude',
    tagline: 'Nuanced & Empathetic',
  },
  gpt4: {
    name: 'GPT-4',
    color: '#10B981',
    iconType: 'ai-gpt',
    tagline: 'Precise & Structured',
  },
  grok: {
    name: 'Grok',
    color: '#8B5CF6',
    iconType: 'ai-grok',
    tagline: 'Creative & Edgy',
  },
};

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  isOpen,
  onClose,
  selectedMode,
  onSelectMode,
  selectedProvider,
  onSelectProvider,
  colors,
  isDark,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: isDark ? '#1a1520' : '#fff',
          borderRadius: 20,
          padding: 24,
          maxWidth: 400,
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 22,
            fontWeight: 300,
            color: colors.text,
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          AI Mode
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {(
            Object.entries(GENERATION_MODES) as [
              GenerationMode,
              (typeof GENERATION_MODES)[GenerationMode]
            ][]
          ).map(([mode, info]) => (
            <button
              key={mode}
              onClick={() => onSelectMode(mode)}
              style={{
                padding: '14px 16px',
                borderRadius: 12,
                border: `1px solid ${
                  selectedMode === mode ? colors.accent : colors.cardBorder
                }`,
                background:
                  selectedMode === mode
                    ? isDark
                      ? 'rgba(255, 180, 100, 0.1)'
                      : 'rgba(200, 160, 100, 0.1)'
                    : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background:
                    selectedMode === mode
                      ? isDark
                        ? 'rgba(255, 180, 100, 0.15)'
                        : 'rgba(200, 160, 100, 0.2)'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.05)',
                }}
              >
                <OpsIcon
                  type={info.iconType}
                  color={selectedMode === mode ? colors.accent : colors.textMuted}
                />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>
                  {info.name}
                </div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>
                  {info.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedMode === 'single' && (
          <>
            <h4
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: colors.textMuted,
                marginBottom: 12,
              }}
            >
              Select AI
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(
                Object.entries(AI_PROVIDERS) as [
                  AIProvider,
                  (typeof AI_PROVIDERS)[AIProvider]
                ][]
              ).map(([provider, info]) => (
                <button
                  key={provider}
                  onClick={() => onSelectProvider(provider)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: `1px solid ${
                      selectedProvider === provider ? info.color : colors.cardBorder
                    }`,
                    background:
                      selectedProvider === provider ? info.color + '15' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background:
                        selectedProvider === provider
                          ? info.color + '20'
                          : isDark
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <OpsIcon
                      type={info.iconType}
                      color={
                        selectedProvider === provider ? info.color : colors.textMuted
                      }
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>
                      {info.name}
                    </div>
                    <div style={{ fontSize: 11, color: colors.textMuted }}>
                      {info.tagline}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: 20,
            padding: '14px',
            borderRadius: 50,
            border: 'none',
            background: colors.accent,
            color: 'white',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};
