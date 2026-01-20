import type { BuildProjectState } from '@/lib/vera/buildTier';
import type { SanctuaryState } from '@/lib/vera/sanctuaryTier';

// Message types
export type IncomingMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type IncomingImage = {
  base64: string;
  mediaType: string;
};

export type IncomingMessageWithImage = IncomingMessage & {
  image?: IncomingImage;
};

export type MemoryMessage = {
  role: 'user' | 'assistant';
  content: string;
};

// Tier types
export type RoutingTier = 'free' | 'sanctuary' | 'build';

// Model provenance
export type ModelProvenance = {
  provider: 'anthropic' | 'openai' | 'grok' | 'qwen' | 'unknown';
  model_id: string;
  selection_reason: string;
  execution_path: 'planned' | 'fallback' | 'safety';
  finalize_applied: boolean;
  finalize_passed: boolean;
  no_drift_passed: boolean;
};

// Challenge consent types
export type ChallengeChoice = 'challenge_on' | 'challenge_off';
export type ChallengeScope = 'single_turn' | 'none';

// Request body structure
export type ChatRequestBody = {
  messages?: IncomingMessageWithImage[];
  conversationId?: string;
  project_state?: BuildProjectState;
  sanctuary_state?: SanctuaryState;
  meta?: {
    challenge?: {
      policy_id?: string;
      user_choice?: ChallengeChoice;
      scope?: ChallengeScope;
      consent_ts?: string;
    };
    // Legacy (deprecated): kept for compatibility with older UI
    challenge_choice?: ChallengeChoice;
    consent_ts?: string;
    scope?: ChallengeScope;
    prompt_id?: string;
  };
};

// Context structure for chat processing
export type ChatContext = {
  sessionId: string;
  userId: string | null;
  tier: RoutingTier;
  conversationId: string;
  turnId: number;
  startedAt: number;
  projectState?: BuildProjectState | null;
  sanctuaryState?: SanctuaryState | null;
  riskGuidance?: string; // Added riskGuidance property
};
