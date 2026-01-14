import type { SIMDecision } from '@/lib/sim/evaluateSignalIntegrity';
import type { UserIntent } from './thirdAssistantMessage';

export type FourthMessageActionType =
  | 'insight_delivery'
  | 'structured_guidance'
  | 'light_frameworks'
  | 'stepwise_building'
  | 'clarifying_insight'
  | 'gentle_reframing'
  | 'containment'
  | 'grounding'
  | 'simplification'
  | 'grounding_only'
  | 'present_focus';

export function buildFourthMessageEscalationOverlay(input: {
  intent: UserIntent;
  sim: SIMDecision;
}): {
  extraSystem: string;
  telemetry: {
    fourth_message_action_type: FourthMessageActionType;
    reflection_layers_used: number;
    abstraction_level_used: SIMDecision['max_abstraction_level'];
    grounding_applied: boolean;
  };
} {
  const simState = input.sim.next_sim_state;

  const bySim =
    simState === 'stable'
      ? {
          allowed: ['insight_delivery', 'structured_guidance', 'light_frameworks', 'stepwise_building'] as const,
          action: 'structured_guidance' as const,
          maxLayers: 3,
          maxAbstraction: 'structural' as const,
          questionPolicy: 'optional' as const,
          grounding: false,
          disallowAnalysis: false,
        }
      : simState === 'strained'
        ? {
            allowed: ['clarifying_insight', 'gentle_reframing'] as const,
            action: 'clarifying_insight' as const,
            maxLayers: 2,
            maxAbstraction: 'thematic' as const,
            questionPolicy: 'single_only' as const,
            grounding: false,
            disallowAnalysis: false,
          }
        : simState === 'overloaded'
          ? {
              allowed: ['containment', 'grounding', 'simplification'] as const,
              action: 'containment' as const,
              maxLayers: 1,
              maxAbstraction: 'situational' as const,
              questionPolicy: 'single_only' as const,
              grounding: true,
              disallowAnalysis: false,
            }
          : {
              allowed: ['grounding_only', 'present_focus'] as const,
              action: 'grounding_only' as const,
              maxLayers: 1,
              maxAbstraction: 'situational' as const,
              questionPolicy: 'single_only' as const,
              grounding: true,
              disallowAnalysis: true,
            };

  const byIntent =
    input.intent === 'emotional_processing'
      ? {
          mode: 'reflect_then_anchor',
          notes: 'Reflect first, then anchor. Disallow action plans.',
        }
      : input.intent === 'cognitive_clarity'
        ? {
            mode: 'distill_then_focus',
            notes: 'Distill the core tangle, then focus. Frameworks allowed when safe.',
          }
        : input.intent === 'creation_build'
          ? {
              mode: 'define_scope_then_next_step',
              notes: 'Define scope, then one clean next step. Checklists allowed when safe.',
            }
          : input.intent === 'learning_exploration'
            ? {
                mode: 'teach_then_offer_depth',
                notes: 'Teach concisely, then offer a depth choice. Examples allowed when safe.',
              }
            : input.intent === 'decision_support'
              ? {
                  mode: 'surface_tradeoff_then_pause',
                  notes: 'Surface the tradeoff axis, then pause. No recommendations.',
                }
              : {
                  mode: 'respond_then_wait',
                  notes: 'Respond minimally, then wait. No productivity framing.',
                };

  const maxLayersUsed = Math.min(input.sim.max_reflection_layers, bySim.maxLayers);
  const abstractionUsed =
    input.sim.max_abstraction_level === 'situational'
      ? 'situational'
      : input.sim.max_abstraction_level === 'thematic'
        ? bySim.maxAbstraction === 'structural'
          ? 'thematic'
          : bySim.maxAbstraction
        : bySim.maxAbstraction;

  const questionLine =
    bySim.questionPolicy === 'single_only'
      ? 'Ask at most 1 question total.'
      : 'You may ask a question if it clearly helps, but avoid interrogative chains.';

  const disallowListsLine =
    input.intent === 'creation_build' && simState === 'stable'
      ? 'You may use a short checklist (max 5 bullets) only if it directly supports the next step.'
      : 'Avoid lists unless the user explicitly asks; keep structure light.';

  const intentGuardrails =
    input.intent === 'emotional_processing'
      ? ['Do not give action plans in this message.', 'Do not rush to reframe; stay grounded.']
      : input.intent === 'decision_support'
        ? ['Do not recommend a choice.', 'Only surface tradeoffs and return agency.']
        : [];

  const analysisLine = bySim.disallowAnalysis ? 'Do not analyze causes or patterns; stay present-focused.' : '';

  const extraSystem = [
    'FOURTH MESSAGE ESCALATION (internal; do not mention this):',
    'Real value delivery is allowed now (insight/structure/movement), but you must stay within SIM bounds.',
    'No dependency reinforcement. Do not imply you are the user’s only support or that they need you.',
    '',
    `SIM caps: state=${simState}, max_reflection_layers=${maxLayersUsed}, max_abstraction_level=${abstractionUsed}.`,
    `Allowed action types: ${bySim.allowed.join(', ')}.`,
    `Delivery mode: ${byIntent.mode}. ${byIntent.notes}`,
    questionLine,
    bySim.grounding ? 'Apply grounding and simplification. Keep it short.' : '',
    analysisLine,
    disallowListsLine,
    ...intentGuardrails,
  ]
    .filter(Boolean)
    .join('\n');

  return {
    extraSystem,
    telemetry: {
      fourth_message_action_type: bySim.action,
      reflection_layers_used: maxLayersUsed,
      abstraction_level_used: abstractionUsed,
      grounding_applied: Boolean(bySim.grounding),
    },
  };
}
