import { useState, useCallback } from 'react';

export interface WellnessState {
  input: string;
  analysisOutput: string | null;
  actionOutput: string | null;
  mode: 'relationship' | 'self-care' | null;
  stage: 'input' | 'clarify' | 'result';
  clarifyQuestion: string;
  clarifyOptions: string[];
}

export interface WellnessHandlers {
  setInput: (value: string) => void;
  resetFlow: () => void;
}

export function useWellnessState(): {
  state: WellnessState;
  handlers: WellnessHandlers;
} {
  const [input, setInput] = useState('');
  const [analysisOutput, setAnalysisOutput] = useState<string | null>(null);
  const [actionOutput, setActionOutput] = useState<string | null>(null);
  const [mode, setMode] = useState<'relationship' | 'self-care' | null>(null);
  const [stage, setStage] = useState<'input' | 'clarify' | 'result'>('input');
  const [clarifyQuestion, setClarifyQuestion] = useState('');
  const [clarifyOptions, setClarifyOptions] = useState<string[]>([]);

  const resetFlow = useCallback(() => {
    setInput('');
    setAnalysisOutput(null);
    setActionOutput(null);
    setMode(null);
    setStage('input');
    setClarifyQuestion('');
    setClarifyOptions([]);
  }, []);

  return {
    state: {
      input,
      analysisOutput,
      actionOutput,
      mode,
      stage,
      clarifyQuestion,
      clarifyOptions,
    },
    handlers: {
      setInput,
      resetFlow,
    },
  };
}