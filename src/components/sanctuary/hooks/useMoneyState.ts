import { useState, useCallback } from 'react';

export interface MoneyState {
  input: string;
  analysisOutput: string | null;
  actionOutput: string | null;
  dumpInput: string;
  sortedOutput: string | null;
  sorting: boolean;
}

export interface MoneyHandlers {
  setInput: (value: string) => void;
  resetFlow: () => void;
}

export function useMoneyState(): {
  state: MoneyState;
  handlers: MoneyHandlers;
} {
  const [input, setInput] = useState('');
  const [analysisOutput, setAnalysisOutput] = useState<string | null>(null);
  const [actionOutput, setActionOutput] = useState<string | null>(null);
  const [dumpInput, setDumpInput] = useState('');
  const [sortedOutput, setSortedOutput] = useState<string | null>(null);
  const [sorting, setSorting] = useState(false);

  const resetFlow = useCallback(() => {
    setInput('');
    setAnalysisOutput(null);
    setActionOutput(null);
    setDumpInput('');
    setSortedOutput(null);
    setSorting(false);
  }, []);

  return {
    state: {
      input,
      analysisOutput,
      actionOutput,
      dumpInput,
      sortedOutput,
      sorting,
    },
    handlers: {
      setInput,
      resetFlow,
    },
  };
}