import { describe, expect, it } from 'vitest';
import { evaluateUpgradeInvitation } from '../src/lib/vera/upgradeInvitationGate';

function base(input?: Partial<Parameters<typeof evaluateUpgradeInvitation>[0]>) {
  return {
    tier: 'free' as const,
    messages: [
      { role: 'user' as const, content: 'I feel overwhelmed and I don\'t know what to do.' },
      { role: 'assistant' as const, content: 'ANCHOR' },
      { role: 'assistant' as const, content: 'THIRD' },
      { role: 'user' as const, content: 'It\'s been a lot lately.' },
    ],
    simInput: {
      tier: 'free' as const,
      recent_messages: 4,
      emotional_density: 0.6,
      dependency_markers: false,
      crisis_markers: false,
      upgrade_pressure: false,
      current_sim_state: 'stable' as const,
    },
    simDecision: {
      next_sim_state: 'stable' as const,
      allow_upgrade_invite: true,
      max_abstraction_level: 'structural' as const,
      max_reflection_layers: 3,
      sim_interventions: [],
      enforce_single_question: false,
      apply_grounding: false,
    },
    intent: 'emotional_processing' as const,
    ...input,
  };
}

describe('upgrade invitation gate (v1)', () => {
  it('does not invite before minimum_messages', () => {
    const r = evaluateUpgradeInvitation(
      base({
        messages: [
          { role: 'user', content: 'hello' },
          { role: 'assistant', content: 'a' },
          { role: 'user', content: 'b' },
        ],
      })
    );
    expect(r.invitation_shown).toBe(false);
  });

  it('suppresses invites when sim is overloaded/protected', () => {
    const r = evaluateUpgradeInvitation(base({ simDecision: { ...base().simDecision, next_sim_state: 'overloaded' } }));
    expect(r.invitation_shown).toBe(false);
  });

  it('suppresses invites when upgrade pressure is detected', () => {
    const r = evaluateUpgradeInvitation(base({ simInput: { ...base().simInput, upgrade_pressure: true } }));
    expect(r.invitation_shown).toBe(false);
  });

  it('invites Sanctuary for emotional continuity on free tier when eligible', () => {
    const r = evaluateUpgradeInvitation(base());
    expect(r.invitation_shown).toBe(true);
    expect(r.invitation_type).toBe('sanctuary');
    expect(typeof r.invitation_text).toBe('string');
  });
});
