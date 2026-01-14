import { describe, expect, it } from 'vitest';
import { evaluateSignalIntegrity } from '../src/lib/sim/evaluateSignalIntegrity';

describe('SIM shadow mode: evaluateSignalIntegrity()', () => {
  it('caps free tier to strained when not crisis', () => {
    const d = evaluateSignalIntegrity({
      tier: 'free',
      recent_messages: 10,
      emotional_density: 0.9,
      dependency_markers: true,
      crisis_markers: false,
      upgrade_pressure: true,
      current_sim_state: 'stable',
    });

    expect(d.next_sim_state).toBe('strained');
  });

  it('forces protected on crisis markers', () => {
    const d = evaluateSignalIntegrity({
      tier: 'sanctuary',
      recent_messages: 1,
      emotional_density: 0.1,
      dependency_markers: false,
      crisis_markers: true,
      upgrade_pressure: false,
      current_sim_state: 'stable',
    });

    expect(d.next_sim_state).toBe('protected');
    expect(d.force_model).toBe('safety_high');
    expect(d.allow_upgrade_invite).toBe(false);
  });
});
