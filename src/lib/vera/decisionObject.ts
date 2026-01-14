export type PrimaryIntent =
  | 'task'
  | 'meaning'
  | 'emotion'
  | 'identity'
  | 'visibility'
  | 'relationship'
  | 'somatic'
  | 'crisis';

export type ArousalState =
  | 'regulated'
  | 'activated'
  | 'dysregulated'
  | 'shutdown'
  | 'dissociated';

export type ChallengeAllowance = 'none' | 'gentle' | 'direct';
export type Pace = 'slow' | 'normal' | 'directive';
export type Depth = 'light' | 'medium' | 'deep';
export type MemoryUse = 'none' | 'session' | 'profile' | 'persistent';
export type ModelName = 'anthropic' | 'openai' | 'grok_like';

export type Tier = 'free' | 'sanctuary' | 'build';

export type Layer = 'N' | 'V';

export type DecisionObject = {
  intent: {
    primary: PrimaryIntent;
    secondary: string[];
  };
  state: {
    arousal: ArousalState;
    confidence: number;
    signals: string[];
  };
  adaptive_codes: Array<{ code: number; band: 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'UNKNOWN'; label: string; confidence: number }>;
  routing: {
    lead: Layer;
    support: Array<'N' | 'V'>;
    iba_policy: {
      tier: Tier;
      challenge: ChallengeAllowance;
      pace: Pace;
      depth: Depth;
      questions_allowed: number;
      somatic_allowed: boolean;
      memory_use: MemoryUse;
      model_override: ModelName | null;
      notes: string;
    };
  };
};
