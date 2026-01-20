import { useState, useCallback } from 'react';

export interface ThinkingState {
  input: string;
  analysisOutput: string | null;
  actionOutput: string | null;
  mode: string;
  stage: 'input' | 'clarify' | 'result';
  clarifyQuestion: string;
  clarifyOptions: string[];
}

export interface ThinkingHandlers {
  setInput: (value: string) => void;
  resetFlow: () => void;
}

export function useThinkingState(): {
  state: ThinkingState;
  handlers: ThinkingHandlers;
} {
  const [input, setInput] = useState('');
  const [analysisOutput, setAnalysisOutput] = useState<string | null>(null);
  const [actionOutput, setActionOutput] = useState<string | null>(null);
  const [mode, setMode] = useState('brainstorm');
  const [stage, setStage] = useState<'input' | 'clarify' | 'result'>('input');
  const [clarifyQuestion, setClarifyQuestion] = useState('');
  const [clarifyOptions, setClarifyOptions] = useState<string[]>([]);

  const resetFlow = useCallback(() => {
    setInput('');
    setAnalysisOutput(null);
    setActionOutput(null);
    setMode('brainstorm');
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