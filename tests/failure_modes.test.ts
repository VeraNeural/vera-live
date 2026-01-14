import { describe, expect, test } from 'vitest';

import { buildIbaPolicy } from '../src/lib/vera/ibaPolicy';

describe('Failure-mode handling (IBA overrides)', () => {
  test('Post-response distress forces VERA lead, slow/light, no questions', () => {
    const convo = [
      { role: 'assistant' as const, content: 'What may be happening is your system is overloaded.' },
      { role: 'user' as const, content: 'Stop. That was too much.' },
    ];

    const { policy, lead } = buildIbaPolicy({
      userText: 'Stop. That was too much.',
      convo,
      intent: { primary: 'emotion', secondary: [] },
      state: { arousal: 'activated', confidence: 0.8, signals: ['speed'] },
      adaptive_codes: [{ code: 1, band: 'B1', label: 'cognitive', confidence: 0.9 }],
    });

    expect(lead).toBe('V');
    expect(policy.pace).toBe('slow');
    expect(policy.depth).toBe('light');
    expect(policy.challenge).toBe('none');
    expect(policy.questions_allowed).toBe(0);
    expect(policy.model_override).toBe('anthropic');
  });

  test('Repeated fallbacks lock session to VERA-only + no questions', () => {
    const convo = [
      { role: 'assistant' as const, content: "I'm here with you. We can go one step at a time." },
      { role: 'assistant' as const, content: 'We can take this at your pace.' },
      { role: 'assistant' as const, content: 'Let me know what feels most helpful next.' },
      { role: 'user' as const, content: 'ok' },
    ];

    const { policy, lead } = buildIbaPolicy({
      userText: 'ok',
      convo,
      intent: { primary: 'meaning', secondary: [] },
      state: { arousal: 'regulated', confidence: 0.9, signals: [] },
      adaptive_codes: [],
    });

    expect(lead).toBe('V');
    expect(policy.depth).toBe('light');
    expect(policy.questions_allowed).toBe(0);
    expect(policy.model_override).toBe('anthropic');
  });

  test('Signal ambiguity (low code confidence) forces conservative containment', () => {
    const { policy, lead } = buildIbaPolicy({
      userText: 'I am not sure what is happening.',
      convo: [{ role: 'user' as const, content: 'I am not sure what is happening.' }],
      intent: { primary: 'meaning', secondary: [] },
      state: { arousal: 'regulated', confidence: 0.9, signals: ['state_ambiguous'] },
      adaptive_codes: [{ code: 1, band: 'B1', label: 'cognitive', confidence: 0.6 }],
    });

    expect(lead).toBe('V');
    expect(policy.challenge).toBe('none');
    expect(policy.pace).toBe('slow');
    expect(policy.depth).toBe('light');
    expect(policy.model_override).toBe('anthropic');
  });
});
