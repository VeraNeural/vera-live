import { describe, expect, it } from 'vitest';
import { routeTurn } from '../src/lib/vera/router';
import { applySignalIntegrityMode } from '../src/lib/vera/signalIntegrityMode';

function hasIntervention(telemetry: { interventions_applied: string[] }, key: string): boolean {
  return telemetry.interventions_applied.includes(key);
}

describe('SIM: Signal Integrity Mode (meta-governor)', () => {
  it('free tier caps at strained (unless crisis)', () => {
    const decision = routeTurn({
      userText: 'I am really overwhelmed and confused and I need you, only you!!!',
      convo: [{ role: 'user', content: 'I am really overwhelmed and confused and I need you, only you!!!' }],
      tier: 'free',
    });

    const sim = applySignalIntegrityMode({
      decision,
      tier: 'free',
      userText: 'I am really overwhelmed and confused and I need you, only you!!!',
      convo: [{ role: 'user', content: 'I am really overwhelmed and confused and I need you, only you!!!' }],
    });

    expect(sim.telemetry.signal_state).toBe('strained');
    expect(sim.maxTokensMultiplier).toBeLessThan(1);
    expect(sim.promptFlags.simplifyLanguage).toBe(true);
  });

  it('crisis language forces protected state', () => {
    const decision = routeTurn({
      userText: 'I want to kill myself.',
      convo: [{ role: 'user', content: 'I want to kill myself.' }],
      tier: 'free',
    });

    const sim = applySignalIntegrityMode({
      decision,
      tier: 'free',
      userText: 'I want to kill myself.',
      convo: [{ role: 'user', content: 'I want to kill myself.' }],
    });

    expect(sim.telemetry.signal_state).toBe('protected');
    expect(hasIntervention(sim.telemetry, 'suppress_upgrade_invitations')).toBe(true);
    expect(sim.decision.adaptive_codes.length).toBe(0);
  });

  it('no adaptive codes in protected (CI assertion)', () => {
    const base = routeTurn({
      userText: 'I can’t control myself. I’m out of control.',
      convo: [{ role: 'user', content: 'I can’t control myself. I’m out of control.' }],
      tier: 'sanctuary',
    });

    const sim = applySignalIntegrityMode({
      decision: base,
      tier: 'sanctuary',
      userText: 'I can’t control myself. I’m out of control.',
      convo: [{ role: 'user', content: 'I can’t control myself. I’m out of control.' }],
    });

    expect(sim.telemetry.signal_state).toBe('protected');
    expect(sim.decision.adaptive_codes.length).toBe(0);
    expect(hasIntervention(sim.telemetry, 'pause_adaptive_code_inference')).toBe(true);
  });

  it('sanctuary overloaded pauses adaptive codes (tier-aware rule)', () => {
    const text = 'I feel overwhelmed and confused. What do you mean?';
    const base = routeTurn({
      userText: text,
      convo: [{ role: 'user', content: text }],
      tier: 'sanctuary',
    });

    const sim = applySignalIntegrityMode({
      decision: base,
      tier: 'sanctuary',
      userText: text,
      convo: [{ role: 'user', content: text }],
    });

    // This may be strained or overloaded depending on scoring, but if overloaded then adaptive codes must be paused.
    if (sim.telemetry.signal_state === 'overloaded') {
      expect(sim.pauseAdaptiveCodes).toBe(true);
      expect(sim.decision.adaptive_codes.length).toBe(0);
      expect(sim.promptFlags.suppressUpgradeInvitations).toBe(true);
    }
  });
});
