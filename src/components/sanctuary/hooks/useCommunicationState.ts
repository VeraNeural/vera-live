import { useState, useCallback } from 'react';

export interface CommunicationState {
  input: string;
  boundaryInput: string;
  respondIntent: string;
  includeBoundary: boolean;
  decodeOutput: string | null;
  boundaryOutput: string | null;
  respondOutput: string | null;
  decodeGenerating: boolean;
  boundaryGenerating: boolean;
  respondGenerating: boolean;
  boundaryNeeded: boolean;
  boundaryMode: boolean;
  boundaryType: string;
  boundaryTone: string;
  showAnalysis: boolean;
  signalLayer: string;
  coreMove: string;
  timeOrientation: string;
  whatsMissing: string[];
  cleanContrast: string;
  showWhatsMissing: boolean;
  showCleanContrast: boolean;
  decodeEntryType: string;
  respondMode: string;
  respondTone: string;
  boundaryDelivery: string;
  response: string;
  context: string;
  tone: string;
  strategy: string;
  goals: string;
  examples: string;
  feedback: string;
}

export interface CommunicationHandlers {
  setInput: (value: string) => void;
  resetFlow: () => void;
  handleGenerate: () => Promise<void>;
  setResponse: (value: string) => void;
  setContext: (value: string) => void;
  setTone: (value: string) => void;
  setStrategy: (value: string) => void;
  setGoals: (value: string) => void;
  setExamples: (value: string) => void;
  setFeedback: (value: string) => void;
}

export function useCommunicationState(): {
  state: CommunicationState;
  handlers: CommunicationHandlers;
} {
  const [input, setInput] = useState('');
  const [boundaryInput, setBoundaryInput] = useState('');
  const [respondIntent, setRespondIntent] = useState('');
  const [includeBoundary, setIncludeBoundary] = useState(false);
  const [decodeOutput, setDecodeOutput] = useState<string | null>(null);
  const [boundaryOutput, setBoundaryOutput] = useState<string | null>(null);
  const [respondOutput, setRespondOutput] = useState<string | null>(null);
  const [decodeGenerating, setDecodeGenerating] = useState(false);
  const [boundaryGenerating, setBoundaryGenerating] = useState(false);
  const [respondGenerating, setRespondGenerating] = useState(false);
  const [boundaryNeeded, setBoundaryNeeded] = useState(false);
  const [boundaryMode, setBoundaryMode] = useState(false);
  const [boundaryType, setBoundaryType] = useState('boundary-script');
  const [boundaryTone, setBoundaryTone] = useState('gentle');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [signalLayer, setSignalLayer] = useState('');
  const [coreMove, setCoreMove] = useState('');
  const [timeOrientation, setTimeOrientation] = useState('');
  const [whatsMissing, setWhatsMissing] = useState<string[]>([]);
  const [cleanContrast, setCleanContrast] = useState('');
  const [showWhatsMissing, setShowWhatsMissing] = useState(false);
  const [showCleanContrast, setShowCleanContrast] = useState(false);
  const [decodeEntryType, setDecodeEntryType] = useState('text');
  const [respondMode, setRespondMode] = useState('quick');
  const [respondTone, setRespondTone] = useState('neutral');
  const [boundaryDelivery, setBoundaryDelivery] = useState('');
  const [response, setResponse] = useState('');
  const [context, setContext] = useState('');
  const [tone, setTone] = useState('');
  const [strategy, setStrategy] = useState('');
  const [goals, setGoals] = useState('');
  const [examples, setExamples] = useState('');
  const [feedback, setFeedback] = useState('');

  const resetFlow = useCallback(() => {
    setInput('');
    setBoundaryInput('');
    setRespondIntent('');
    setIncludeBoundary(false);
    setDecodeOutput(null);
    setBoundaryOutput(null);
    setRespondOutput(null);
    setDecodeGenerating(false);
    setBoundaryGenerating(false);
    setRespondGenerating(false);
    setBoundaryNeeded(false);
    setBoundaryMode(false);
    setBoundaryType('boundary-script');
    setBoundaryTone('gentle');
    setShowAnalysis(false);
    setSignalLayer('');
    setCoreMove('');
    setTimeOrientation('');
    setWhatsMissing([]);
    setCleanContrast('');
    setShowWhatsMissing(false);
    setShowCleanContrast(false);
    setDecodeEntryType('text');
    setRespondMode('quick');
    setRespondTone('neutral');
    setBoundaryDelivery('');
    setResponse('');
    setContext('');
    setTone('');
    setStrategy('');
    setGoals('');
    setExamples('');
    setFeedback('');
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) return;

    setDecodeGenerating(true);
    setRespondGenerating(true);
    setDecodeOutput(null);
    setRespondOutput(null);
    setBoundaryNeeded(false);
    setSignalLayer('');
    setCoreMove('');
    setTimeOrientation('');
    setWhatsMissing([]);
    setCleanContrast('');
    setShowWhatsMissing(false);
    setShowCleanContrast(false);

    // Simulate async operation
    setTimeout(() => {
      setDecodeOutput('Decoded message');
      setRespondOutput('Generated response');
      setDecodeGenerating(false);
      setRespondGenerating(false);
    }, 2000);
  }, [input]);

  return {
    state: {
      input,
      boundaryInput,
      respondIntent,
      includeBoundary,
      decodeOutput,
      boundaryOutput,
      respondOutput,
      decodeGenerating,
      boundaryGenerating,
      respondGenerating,
      boundaryNeeded,
      boundaryMode,
      boundaryType,
      boundaryTone,
      showAnalysis,
      signalLayer,
      coreMove,
      timeOrientation,
      whatsMissing,
      cleanContrast,
      showWhatsMissing,
      showCleanContrast,
      decodeEntryType,
      respondMode,
      respondTone,
      boundaryDelivery,
      response,
      context,
      tone,
      strategy,
      goals,
      examples,
      feedback,
    },
    handlers: {
      setInput,
      resetFlow,
      handleGenerate,
      setResponse,
      setContext,
      setTone,
      setStrategy,
      setGoals,
      setExamples,
      setFeedback,
    },
  };
}