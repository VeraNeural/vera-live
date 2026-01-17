export type PracticeId = 'breathe' | 'orient' | 'shake' | 'ground';

export type Mode = 'select' | 'practice-select' | 'active' | 'complete';

export type Practice = {
  id: PracticeId;
  name: string;
  icon: string;
  description: string;
};

export type BreathingPhase = {
  name: string;
  duration: number;
};

export type BreathingPattern = {
  name: string;
  description: string;
  phases: BreathingPhase[];
};

export type OrientPrompt = {
  instruction: string;
  duration: number;
};

export type ShakePhase = {
  instruction: string;
  subtext: string;
  duration: number;
};

export type GroundStep = {
  sense: string;
  instruction: string;
  count: number;
  duration: number;
};

export type ZenSession = {
  id: string;
  odoe: PracticeId;
  completedAt: string;
  duration: number;
  cyclesCompleted?: number;
};

export type SessionStats = {
  totalSessions: number;
  totalMinutes: number;
  streak: number;
  favoriteExercise: PracticeId;
};

export type PhaseState = {
  currentPhaseIndex: number;
  phaseProgress: number;
  timeRemaining: number;
};

export type PracticeProgress = {
  practiceId: PracticeId;
  orientIndex?: number;
  shakePhaseIndex?: number;
  groundStepIndex?: number;
  cycleCount?: number;
};

export type PracticeInsight = {
  sessionId: string;
  insight: string;
  generatedAt: string;
  source: 'vera';
};
