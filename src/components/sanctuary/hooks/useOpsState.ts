import { useState, useCallback } from 'react';

export interface OpsState {
  timeOfDay: string;
  manualTheme: string;
  isLoaded: boolean;
  activeCategory: string | null;
  selectedAction: any | null;
  generationMode: string;
  selectedProvider: string;
  isGenerating: boolean;
}

export interface OpsHandlers {
  setTimeOfDay: (value: string) => void;
  setManualTheme: (value: string) => void;
}

export function useOpsState(): {
  state: OpsState;
  handlers: OpsHandlers;
} {
  const [timeOfDay, setTimeOfDay] = useState('afternoon');
  const [manualTheme, setManualTheme] = useState('auto');
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<any | null>(null);
  const [generationMode, setGenerationMode] = useState('specialist');
  const [selectedProvider, setSelectedProvider] = useState('claude');
  const [isGenerating, setIsGenerating] = useState(false);

  return {
    state: {
      timeOfDay,
      manualTheme,
      isLoaded,
      activeCategory,
      selectedAction,
      generationMode,
      selectedProvider,
      isGenerating,
    },
    handlers: {
      setTimeOfDay,
      setManualTheme,
    },
  };
}