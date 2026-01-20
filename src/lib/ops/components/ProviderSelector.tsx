import React from 'react';
import { GenerationMode, AIProvider } from '../types';
import { OpsIcon } from '../icons';

interface ProviderSelectorProps {
  selectedMode: GenerationMode;
  selectedProvider: AIProvider;
  onOpenModeSelector: () => void;
  colors: {
    text: string;
    accent: string;
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
  'vera-neural': {
    name: 'VERA Neural',
    color: '#8B5CF6',
    iconType: 'brain',
    tagline: 'Your AI nervous system',
  },
};

export const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  selectedMode,
  selectedProvider,
  onOpenModeSelector,
  colors,
  isDark,
}) => {
  return (
    <button
      onClick={onOpenModeSelector}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px',
        marginBottom: 20,
        background: isDark
          ? 'rgba(255, 180, 100, 0.1)'
          : 'rgba(200, 160, 100, 0.15)',
        border: `1px solid ${
          isDark ? 'rgba(255, 180, 100, 0.2)' : 'rgba(200, 160, 100, 0.25)'
        }`,
        borderRadius: 50,
        cursor: 'pointer',
        fontSize: 13,
        color: colors.text,
      }}
    >
      <OpsIcon type={GENERATION_MODES[selectedMode].iconType} color={colors.accent} />
      <span>{GENERATION_MODES[selectedMode].name}</span>
      {selectedMode === 'single' && (
        <span style={{ color: AI_PROVIDERS[selectedProvider].color }}>
          ({AI_PROVIDERS[selectedProvider].name})
        </span>
      )}
    </button>
  );
};
