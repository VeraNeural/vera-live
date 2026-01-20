import { useState, useCallback } from 'react';

export interface WorkLifeState {
  input: string;
  analysisOutput: string | null;
  actionOutput: string | null;
  stage: 'input' | 'clarify' | 'result';
  clarifyQuestion: string;
  clarifyOptions: string[];
  userChoice: string;
  dumpInput: string;
  sortedOutput: string | null;
  sortedGenerating: boolean;
}

export interface WorkLifeHandlers {
  setInput: (value: string) => void;
  resetFlow: () => void;
}

export function useWorkLifeState(): {
  state: WorkLifeState;
  handlers: WorkLifeHandlers;
} {
  const [input, setInput] = useState('');
  const [analysisOutput, setAnalysisOutput] = useState<string | null>(null);
  const [actionOutput, setActionOutput] = useState<string | null>(null);
  const [stage, setStage] = useState<'input' | 'clarify' | 'result'>('input');
  const [clarifyQuestion, setClarifyQuestion] = useState('');
  const [clarifyOptions, setClarifyOptions] = useState<string[]>([]);
  const [userChoice, setUserChoice] = useState('');
  const [dumpInput, setDumpInput] = useState('');
  const [sortedOutput, setSortedOutput] = useState<string | null>(null);
  const [sortedGenerating, setSortedGenerating] = useState(false);

  const resetFlow = useCallback(() => {
    setInput('');
    setAnalysisOutput(null);
    setActionOutput(null);
    setStage('input');
    setClarifyQuestion('');
    setClarifyOptions([]);
    setUserChoice('');
    setDumpInput('');
    setSortedOutput(null);
    setSortedGenerating(false);
  }, []);

  return {
    state: {
      input,
      analysisOutput,
      actionOutput,
      stage,
      clarifyQuestion,
      clarifyOptions,
      userChoice,
      dumpInput,
      sortedOutput,
      sortedGenerating,
    },
    handlers: {
      setInput,
      resetFlow,
    },
  };
}