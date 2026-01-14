import { describe, expect, test } from 'vitest';

import type { DecisionObject } from '../src/lib/vera/decisionObject';
import { composeSystemPrompt } from '../src/lib/vera/promptComposer';
import { enforceInterLayerContract } from '../src/lib/vera/interLayerContract';

function makeDecision(lead: 'N' | 'V'): DecisionObject {
  return {
    intent: { primary: 'task', secondary: [] },
    state: { arousal: 'regulated', confidence: 0.9, signals: ['clear'] },
    adaptive_codes: [{ code: 1, band: 'B1', label: 'cognitive', confidence: 0.9 }],
    routing: {
      lead,
      support: lead === 'N' ? ['V'] : ['N'],
      iba_policy: {
        tier: 'free',
        challenge: 'none',
        pace: lead === 'V' ? 'slow' : 'normal',
        depth: 'light',
        questions_allowed: 1,
        somatic_allowed: false,
        memory_use: 'session',
        model_override: 'anthropic',
        notes: 'test',
      },
    },
  };
}

describe('Inter-layer contract', () => {
  test('Neural-led prompt requires two blocks in order', () => {
    const decision = makeDecision('N');
    const system = composeSystemPrompt(decision);

    expect(system).toContain('Your output MUST be two blocks in this exact order:');
    expect(system).toContain('1) [[NEURAL]]');
    expect(system).toContain('2) [[VERA]]');
    expect(system).toContain('The NEURAL block may contain JSON only.');
  });

  test('VERA-led prompt requires VERA-only output', () => {
    const decision = makeDecision('V');
    const system = composeSystemPrompt(decision);

    expect(system).toContain('Return only one block: [[VERA]]...[[/VERA]]');
    expect(system).toContain('Do not include any NEURAL block when VERA is leading.');
  });

  test('Contract: V-lead rejects NEURAL block', () => {
    const decision = makeDecision('V');
    const res = enforceInterLayerContract({
      decision,
      tagged: { vera: 'Hello.', neural: '{"obs":[]}' },
    });

    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.violations).toContain('V_lead_neural_block_present');
  });

  test('Contract: N-lead requires NEURAL JSON + VERA', () => {
    const decision = makeDecision('N');

    const missing = enforceInterLayerContract({ decision, tagged: { vera: 'Hi.' } });
    expect(missing.ok).toBe(false);

    const badJson = enforceInterLayerContract({ decision, tagged: { neural: 'not json', vera: 'Hi.' } });
    expect(badJson.ok).toBe(false);

    const ok = enforceInterLayerContract({
      decision,
      tagged: { neural: '{"observations":["x"],"hypotheses":[]}', vera: 'Hi.' },
    });
    expect(ok.ok).toBe(true);
  });
});
