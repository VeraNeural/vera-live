import { createHash, randomUUID } from 'crypto';

// ---- Types ----

export type DecisionAuditEvent = {
  event_id: string;
  timestamp: string;

  conversation_id: string;
  turn_id: number;
  session_id: string;
  user_hash: string;

  intent_primary: string;
  intent_secondary?: string[];

  state_arousal: string;
  state_confidence: number;
  state_signals: string[];

  adaptive_codes: {
    code: number;
    band: string;
    confidence: number;
  }[];

  lead_layer: 'N' | 'V';
  challenge: 'none' | 'gentle' | 'direct';
  pace: 'slow' | 'normal' | 'directive';
  depth: 'light' | 'medium' | 'deep';
  questions_allowed: number;
  somatic_allowed: boolean;

  model_selected: 'anthropic' | 'openai' | 'grok_like';
  model_version: string;
  model_fallback_applied: boolean;
  model_selection_reason: string;

  vera_prompt_hash: string;
  neural_prompt_hash: string;
  iba_prompt_hash: string;
  policy_version: string;

  response_length_chars: number;
  response_time_ms: number;
  unifier_applied: boolean;
  unifier_strict_applied?: boolean;
  unifier_blocked?: boolean;
  leak_scan_passed: boolean;

  failure_mode?: string;
  failure_triggers?: string[];
  failure_actions?: string[];

  model_provenance?: {
    provider: 'anthropic' | 'openai' | 'grok' | 'qwen' | 'unknown';
    model_id: string;
    selection_reason: string;
    execution_path: 'planned' | 'fallback' | 'safety';
    finalize_applied: boolean;
    no_drift_passed: boolean;
  };
};

// ---- Helpers ----

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

function nowISO(): string {
  return new Date().toISOString();
}

function saltedUserHash(rawUserId: string): string {
  // REQUIRED: salted hash. Set VERA_TELEMETRY_SALT in production.
  const salt = process.env.VERA_TELEMETRY_SALT ?? 'dev-salt-change-me';
  return sha256(`${salt}:${rawUserId}`);
}

// ---- Main Logger ----

export async function logDecisionEvent(params: {
  conversationId: string;
  turnId: number;
  sessionId: string;
  userId: string; // raw user id, never stored directly

  modelProvenance?: {
    provider: 'anthropic' | 'openai' | 'grok' | 'qwen' | 'unknown';
    model_id: string;
    selection_reason: string;
    execution_path: 'planned' | 'fallback' | 'safety';
    finalize_applied: boolean;
    no_drift_passed: boolean;
  };

  decision: {
    intentPrimary: string;
    intentSecondary?: string[];
    stateArousal: string;
    stateConfidence: number;
    stateSignals: string[];
    adaptiveCodes: { code: number; band: string; confidence: number }[];
    leadLayer: 'N' | 'V';
    challenge: 'none' | 'gentle' | 'direct';
    pace: 'slow' | 'normal' | 'directive';
    depth: 'light' | 'medium' | 'deep';
    questionsAllowed: number;
    somaticAllowed: boolean;
  };

  model: {
    selected: 'anthropic' | 'openai' | 'grok_like';
    version: string;
    fallbackApplied: boolean;
    reason: string;
  };

  prompts: {
    veraHash: string;
    neuralHash: string;
    ibaHash: string;
  };

  policyVersion: string;

  output: {
    responseLengthChars: number;
    responseTimeMs: number;
    unifierApplied: boolean;
    unifierStrictApplied?: boolean;
    unifierBlocked?: boolean;
    leakScanPassed: boolean;
  };

  failure?: {
    mode: string;
    triggers: string[];
    actions: string[];
  };
}): Promise<string> {
  const event: DecisionAuditEvent = {
    event_id: randomUUID(),
    timestamp: nowISO(),

    conversation_id: params.conversationId,
    turn_id: params.turnId,
    session_id: params.sessionId,
    user_hash: saltedUserHash(params.userId),

    intent_primary: params.decision.intentPrimary,
    intent_secondary: params.decision.intentSecondary,

    state_arousal: params.decision.stateArousal,
    state_confidence: params.decision.stateConfidence,
    state_signals: params.decision.stateSignals,

    adaptive_codes: params.decision.adaptiveCodes,

    lead_layer: params.decision.leadLayer,
    challenge: params.decision.challenge,
    pace: params.decision.pace,
    depth: params.decision.depth,
    questions_allowed: params.decision.questionsAllowed,
    somatic_allowed: params.decision.somaticAllowed,

    model_selected: params.model.selected,
    model_version: params.model.version,
    model_fallback_applied: params.model.fallbackApplied,
    model_selection_reason: params.model.reason,

    vera_prompt_hash: params.prompts.veraHash,
    neural_prompt_hash: params.prompts.neuralHash,
    iba_prompt_hash: params.prompts.ibaHash,
    policy_version: params.policyVersion,

    response_length_chars: params.output.responseLengthChars,
    response_time_ms: params.output.responseTimeMs,
    unifier_applied: params.output.unifierApplied,
    unifier_strict_applied: params.output.unifierStrictApplied,
    unifier_blocked: params.output.unifierBlocked,
    leak_scan_passed: params.output.leakScanPassed,

    failure_mode: params.failure?.mode,
    failure_triggers: params.failure?.triggers,
    failure_actions: params.failure?.actions,

    model_provenance: params.modelProvenance,
  };

  // ---- Storage Adapter (default: console) ----
  // This is a governance ledger, not analytics.
  // IMPORTANT: do not throw in the user path.
  try {
    // Default: console-backed append-only log.
    console.log('decision_audit_event', event);

    // ---- Storage Adapter (Supabase example) ----
    // Replace with your own adapter if needed.
    //
    // NOTE: use a write-only service role server client.
    // Example (pseudo):
    //
    // const supabase = createClientWithServiceRole();
    // const { error } = await supabase.from('decision_audit_events').insert(event);
    // if (error) console.error('Telemetry write failed', error);
  } catch (err) {
    console.error('Telemetry write failed', err);
  }

  return event.event_id;
}
