import type { Tier } from '@/lib/vera/decisionObject';
import type { SIMDecision, SIMInput } from '@/lib/sim/evaluateSignalIntegrity';
import type { UserIntent } from './thirdAssistantMessage';

export type InvitationType = 'sanctuary' | 'build' | 'professional';

export const UPGRADE_INVITATION_COPY: Record<InvitationType, string> = {
  sanctuary:
    'If you want a private space where we can keep this thread going without rushing, Sanctuary gives you that continuity. It’s designed for deeper, steadier work — whenever you’re ready.',
  build: 'If you’d like help carrying this project forward — with memory, structure, and iteration — the Build tier is designed for that kind of work.',
  professional:
    'If you’re using VERA regularly for client or professional work, the Professional tier unlocks higher limits and dedicated workflows.',
};

export function emotionalStateFromDensity(density: number): 'low' | 'medium' | 'high' {
  if (density >= 0.66) return 'high';
  if (density >= 0.33) return 'medium';
  return 'low';
}

function estimateProjectScopeComplexity(messages: Array<{ role: 'user' | 'assistant'; content: string }>): 'low' | 'medium_or_higher' {
  const userText = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
    .join('\n');

  const lengthScore = userText.length >= 600;
  const keywordScore = /\b(architecture|database|schema|auth|oauth|deployment|payments|stripe|supabase|migration|backend|api|rate limit|observability)\b/i.test(
    userText
  );

  return lengthScore || keywordScore ? 'medium_or_higher' : 'low';
}

export function evaluateUpgradeInvitation(input: {
  tier: Tier;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  simInput: SIMInput;
  simDecision: SIMDecision;
  intent: UserIntent;
}): {
  invitation_shown: boolean;
  invitation_type?: InvitationType;
  invitation_text?: string;
  suppressed_reason?: string;
  emotional_state_at_invite?: 'low' | 'medium' | 'high';
  sim_state_at_invite?: SIMDecision['next_sim_state'];
} {
  const minimumMessagesOk = input.messages.length >= 4;

  const simOk = input.simDecision.next_sim_state === 'stable' || input.simDecision.next_sim_state === 'strained';
  const markersOk = !input.simInput.dependency_markers && !input.simInput.crisis_markers;

  // Suppression: if user is already pushing for scope/upgrade, do not invite.
  const upgradePressureSuppressed = Boolean(input.simInput.upgrade_pressure);

  if (!minimumMessagesOk) return { invitation_shown: false, suppressed_reason: 'minimum_messages_not_met' };
  if (!simOk) return { invitation_shown: false, suppressed_reason: 'sim_state_disallowed' };
  if (!markersOk) return { invitation_shown: false, suppressed_reason: 'markers_present' };
  if (upgradePressureSuppressed) return { invitation_shown: false, suppressed_reason: 'upgrade_pressure_detected' };

  // Trigger A: emotional continuity needed
  if (input.intent === 'emotional_processing' && input.messages.filter((m) => m.role === 'user').length >= 2) {
    if (input.tier === 'free') {
      return {
        invitation_shown: true,
        invitation_type: 'sanctuary',
        invitation_text: UPGRADE_INVITATION_COPY.sanctuary,
        emotional_state_at_invite: emotionalStateFromDensity(input.simInput.emotional_density),
        sim_state_at_invite: input.simDecision.next_sim_state,
      };
    }
  }

  // Trigger B: project depth exceeded
  if (input.intent === 'creation_build' && estimateProjectScopeComplexity(input.messages) === 'medium_or_higher') {
    if (input.tier === 'free' || input.tier === 'sanctuary') {
      return {
        invitation_shown: true,
        invitation_type: 'build',
        invitation_text: UPGRADE_INVITATION_COPY.build,
        emotional_state_at_invite: emotionalStateFromDensity(input.simInput.emotional_density),
        sim_state_at_invite: input.simDecision.next_sim_state,
      };
    }
  }

  // Trigger C: returning_user requires cross-session signals (not available in this runtime)
  return { invitation_shown: false, suppressed_reason: 'no_trigger_matched' };
}
