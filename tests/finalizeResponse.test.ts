import { describe, expect, it } from 'vitest';
import { finalizeResponse } from '../src/lib/vera/finalizeResponse';

describe('finalizeResponse', () => {
  it('never throws', () => {
    expect(() =>
      finalizeResponse({
        text: '' as any,
        iba_active: false as any,
        sim_state: 'stable' as any,
      })
    ).not.toThrow();

    expect(() =>
      finalizeResponse({
        text: null as any,
        iba_active: true as any,
        sim_state: 'overloaded' as any,
      })
    ).not.toThrow();
  });

  it('strips internal tags and blocks', () => {
    const r = finalizeResponse({
      text: [
        '[[NEURAL]]',
        '{"handoff":true}',
        '[[/NEURAL]]',
        '[[VERA]]',
        'Hello there.',
        '[[/VERA]]',
      ].join('\n'),
      iba_active: false,
      sim_state: 'stable',
    });

    expect(r.finalize_passed).toBe(true);
    expect(r.text).toBe('Hello there.');
    expect(r.text.includes('[[NEURAL]]')).toBe(false);
    expect(r.text.includes('[[VERA]]')).toBe(false);
  });

  it('enforces required exit line when iba_active=true', () => {
    const r = finalizeResponse({
      text: "You're avoiding the decision.",
      iba_active: true,
      sim_state: 'stable',
    });

    expect(r.finalize_passed).toBe(false);
    expect(Array.isArray(r.finalize_violations)).toBe(true);

    const lastLine = r.text
      .split(/\n+/g)
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(-1)[0];

    expect(lastLine).toBe('You can switch back at any time.');
  });
});
