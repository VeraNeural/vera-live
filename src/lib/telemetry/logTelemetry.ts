export type Tier =
  | 'free'
  | 'sanctuary'
  | 'build'
  | 'professional';

export type SIMState =
  | 'stable'
  | 'strained'
  | 'overloaded'
  | 'protected';

export type AbstractionLevel =
  | 'situational'
  | 'thematic'
  | 'structural';

export type InvitationType =
  | 'sanctuary'
  | 'build'
  | 'professional';

export type InvitationResponse =
  | 'accepted'
  | 'dismissed'
  | 'deferred';

export type EmotionalState =
  | 'low'
  | 'medium'
  | 'high';

export interface TelemetryEvent {
  // identity
  session_id: string; // UUID
  user_id?: string;  // UUID | undefined

  // tier + model
  tier: Tier;
  model_used: string;

  // cost + performance
  tokens_used: number;
  latency_ms: number;

  // behavioral depth
  response_tags?: string[];
  reflection_layers: number;
  abstraction_level: AbstractionLevel;
  followup_count: number;

  // SIM
  sim_state: SIMState;
  sim_interventions?: string[];
  sim_upgrade_suppressed: boolean;
  sim_model_rerouted: boolean;

  // integrity
  tier_behavior_violation: boolean;
  forbidden_behavior_triggered: boolean;
  auto_correction_applied: boolean;
  ci_rule_id?: string;

  // upgrade invitations
  invitation_shown: boolean;
  invitation_type?: InvitationType;
  invitation_user_response?: InvitationResponse;
  emotional_state_at_invite?: EmotionalState;
  sim_state_at_invite?: SIMState;

  // snapshots (opaque to DB)
  state_snapshot?: Record<string, unknown>;
}

// Storage adapter (default: console).
// IMPORTANT: This must never throw in the user path.
export async function logTelemetry(event: TelemetryEvent): Promise<void> {
  try {
    console.log('telemetry_event', event);
  } catch (err) {
    console.error('Telemetry write failed', err);
  }
}
