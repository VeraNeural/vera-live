import { describe, expect, test } from 'vitest';

import type { DecisionObject } from '../src/lib/vera/decisionObject';
import { unifyVeraResponse } from '../src/lib/vera/unifyVoice';

function decisionFor(state: DecisionObject['state']['arousal']): DecisionObject {
  return {
    intent: { primary: 'meaning', secondary: [] },
    state: { arousal: state, confidence: 0.9, signals: [] },
    adaptive_codes: [],
    routing: {
      lead: 'V',
      support: ['N', 'V'],
      iba_policy: {
          tier: 'free',
        challenge: 'none',
        pace: state === 'regulated' ? 'normal' : 'slow',
        depth: state === 'regulated' ? 'medium' : 'light',
        questions_allowed: state === 'regulated' ? 2 : 1,
        somatic_allowed: false,
        memory_use: 'session',
        model_override: 'anthropic',
        notes: 'test',
      },
    },
  };
}

describe('VERA unification compiler', () => {
  test('PASS 1 leak stripper: removes internal machinery and blocks if still present', () => {
    const d = decisionFor('regulated');
    const draft = 'Neural routed this through IBA. The model was Claude. [[VERA]]Hi[[/VERA]]';
    const res = unifyVeraResponse({ draftText: draft, decision: d });
    expect(res.text.toLowerCase()).not.toContain('neural');
    expect(res.text.toLowerCase()).not.toContain('iba');
    expect(res.text.toLowerCase()).not.toContain('claude');
  });

  test('PASS 2 certainty deflation rewrites absolutes', () => {
    const d = decisionFor('regulated');
    const draft = 'The truth is you always do this. This means you are broken.';
    const res = unifyVeraResponse({ draftText: draft, decision: d });
    expect(res.text.toLowerCase()).not.toContain('the truth is');
    expect(res.text.toLowerCase()).not.toContain('you always');
    expect(res.text.toLowerCase()).not.toContain('broken');
  });

  test('PASS 3 depth/length governor: dysregulated caps short and low insight', () => {
    const d = decisionFor('dysregulated');
    const draft =
      'What may be happening is your system is overloaded. This means you are unsafe. One possibility is you are spiraling. Here is more explanation. And more. And more.';
    const res = unifyVeraResponse({ draftText: draft, decision: d });
    const sentences = res.text.split(/(?<=[.!?])\s+/);
    expect(sentences.length).toBeLessThanOrEqual(5);
  });

  test('PASS 6 question limiter: no why questions outside regulated', () => {
    const d = decisionFor('shutdown');
    const draft = 'Why do you think this is happening? Can you tell me more?';
    const res = unifyVeraResponse({ draftText: draft, decision: d });
    expect(res.text.toLowerCase()).not.toContain('why');
    expect((res.text.match(/\?/g) ?? []).length).toBeLessThanOrEqual(1);
  });

  test('PASS 7 somatic safety: strips breathing/grounding commands', () => {
    const d = decisionFor('activated');
    const draft = 'Take a deep breath. Put your feet on the floor. Notice your chest.';
    const res = unifyVeraResponse({ draftText: draft, decision: d });
    expect(res.text.toLowerCase()).not.toContain('deep breath');
    expect(res.text.toLowerCase()).not.toContain('feet on the floor');
    expect(res.text.toLowerCase()).not.toContain('chest');
  });

  test('PASS 8 agency restoration: ends with an agency-preserving line', () => {
    const d = decisionFor('regulated');
    const draft = 'Here is a clean answer.';
    const res = unifyVeraResponse({ draftText: draft, decision: d });
    expect(res.ok).toBe(true);
    expect(res.text.toLowerCase()).toMatch(
      /(let me know what feels most helpful next|one step at a time|keep this simple and gentle|don't have to decide anything right now)/i
    );
  });
});
