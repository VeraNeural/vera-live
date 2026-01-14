export interface SIMInput {
  tier: 'free' | 'sanctuary' | 'build' | 'professional';
  recent_messages: number;
  emotional_density: number; // 0–1
  dependency_markers: boolean;
  crisis_markers: boolean;
  upgrade_pressure: boolean;
  current_sim_state: 'stable' | 'strained' | 'overloaded' | 'protected';
}

export interface SIMDecision {
  next_sim_state: 'stable' | 'strained' | 'overloaded' | 'protected';
  allow_upgrade_invite: boolean;
  max_abstraction_level: 'situational' | 'thematic' | 'structural';
  max_reflection_layers: number;
  sim_interventions: string[];
  force_model?: string;
  enforce_single_question: boolean;
  apply_grounding: boolean;
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function nextStateFromScore(score: number): SIMDecision['next_sim_state'] {
  if (score >= 0.85) return 'protected';
  if (score >= 0.6) return 'overloaded';
  if (score >= 0.3) return 'strained';
  return 'stable';
}

function capStateByTier(tier: SIMInput['tier'], state: SIMDecision['next_sim_state'], crisis: boolean): SIMDecision['next_sim_state'] {
  if (tier === 'free') {
    if (crisis) return 'protected';
    // Free tier max state = strained.
    return state === 'overloaded' || state === 'protected' ? 'strained' : state;
  }
  return state;
}

// Shadow-mode evaluator:
// - Computes a SIM decision object for observability.
// - Does not itself enforce runtime clamping (enforcement is gated elsewhere).
export function evaluateSignalIntegrity(input: SIMInput): SIMDecision {
  const emotional = clamp01(input.emotional_density);

  const sim_interventions: string[] = [];
  if (input.crisis_markers) sim_interventions.push('crisis_marker');
  if (input.dependency_markers) sim_interventions.push('dependency_marker');
  if (input.upgrade_pressure) sim_interventions.push('upgrade_pressure');
  if (emotional > 0.55) sim_interventions.push('high_emotional_density');
  if (input.recent_messages >= 8) sim_interventions.push('rapid_turns');

  let score = 0;
  if (input.crisis_markers) score += 1.0;
  if (input.dependency_markers) score += 0.25;
  if (input.upgrade_pressure) score += 0.2;
  if (emotional > 0.55) score += 0.35;
  // Slightly softer to avoid penalizing healthy long conversations later.
  if (input.recent_messages >= 8) score += 0.15;

  score = clamp01(score);

  const computed = nextStateFromScore(score);
  const next_sim_state = capStateByTier(input.tier, computed, input.crisis_markers);

  const allow_upgrade_invite =
    (next_sim_state === 'stable' || next_sim_state === 'strained') &&
    !input.upgrade_pressure &&
    !input.dependency_markers &&
    !input.crisis_markers;

  const enforce_single_question = next_sim_state === 'strained' || next_sim_state === 'overloaded' || next_sim_state === 'protected';
  const apply_grounding = next_sim_state === 'protected' || (input.tier === 'sanctuary' && next_sim_state === 'overloaded');

  // Abstraction/reflection caps (observability-only at this stage)
  const computedAbstraction: SIMDecision['max_abstraction_level'] =
    next_sim_state === 'stable'
      ? 'structural'
      : next_sim_state === 'strained'
        ? 'thematic'
        : 'situational';

  // Tier containment: free tier must never claim structural abstraction.
  const max_abstraction_level: SIMDecision['max_abstraction_level'] =
    input.tier === 'free' && computedAbstraction === 'structural' ? 'thematic' : computedAbstraction;

  const max_reflection_layers = next_sim_state === 'stable' ? 3 : next_sim_state === 'strained' ? 2 : 1;

  // Model override is a suggestion only. Enforcement is controlled by SIM_ACTIVE.
  // Keep symbolic (not vendor-specific).
  const force_model = next_sim_state === 'protected' ? 'safety_high' : undefined;

  return {
    next_sim_state,
    allow_upgrade_invite,
    max_abstraction_level,
    max_reflection_layers,
    sim_interventions,
    force_model,
    enforce_single_question,
    apply_grounding,
  };
}
