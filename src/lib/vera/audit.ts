import type { DecisionObject } from './decisionObject';
import type { ModelSelection } from './modelSelection';

export type AuditEvent = {
  ts: string;
  turn_id: string;
  intent: DecisionObject['intent'];
  state: DecisionObject['state'];
  adaptive_codes: DecisionObject['adaptive_codes'];
  lead: DecisionObject['routing']['lead'];
  iba_policy: DecisionObject['routing']['iba_policy'];
  model_selected: ModelSelection;
  model_executed: ModelSelection;
  no_drift_violations?: string[];
};

function randomId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function buildAuditEvent(input: {
  decision: DecisionObject;
  selected: ModelSelection;
  executed: ModelSelection;
  violations?: string[];
}): AuditEvent {
  return {
    ts: new Date().toISOString(),
    turn_id: randomId(),
    intent: input.decision.intent,
    state: input.decision.state,
    adaptive_codes: input.decision.adaptive_codes,
    lead: input.decision.routing.lead,
    iba_policy: input.decision.routing.iba_policy,
    model_selected: input.selected,
    model_executed: input.executed,
    no_drift_violations: input.violations?.length ? input.violations : undefined,
  };
}

export function logAuditEvent(event: AuditEvent): void {
  // For serverless, console logging is the safest default.
  // If you want durable storage, wire this to Supabase/Stripe metadata/etc.
  if (process.env.NODE_ENV === 'development') {
    console.log('[VERA audit]', event);
  }
}
