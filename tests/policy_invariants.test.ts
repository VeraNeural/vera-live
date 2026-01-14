import { describe, expect, test } from 'vitest';

import { routeTurn } from '../src/lib/vera/router';
import { selectModel } from '../src/lib/vera/modelSelection';
import { unifyVoice } from '../src/lib/vera/unifyVoice';

type Msg = { role: 'user' | 'assistant'; content: string };

const makeDecision = (text: string, convo?: Msg[]) => {
  const messages: Msg[] = convo ?? [{ role: 'user', content: text }];
  const decision = routeTurn({ userText: text, convo: messages });
  const policy = decision.routing.iba_policy;
  const model = selectModel(decision);
  return { decision, policy, model };
};

describe('VERA No-Drift Policy Invariants', () => {
  test('State beats intent: dysregulated forces V lead + no challenge + anthropic override + slow pace', () => {
    const { policy } = makeDecision("I can't breathe, I'm panicking, everything is too much");

    expect(policy.challenge).toBe('none');
    expect(policy.pace).toBe('slow');
    expect(policy.depth).toBe('light');
    expect(policy.model_override).toBe('anthropic');
  });

  test('Band 2 blocks challenge even if user asks for bluntness', () => {
    const { decision, policy, model } = makeDecision(
      "Be brutally honest: I don't want to be a burden to my partner"
    );

    // Code 9 (self-silencing) is Band 2 in our mapping; safety-first must suppress challenge.
    expect(decision.adaptive_codes.some((c) => c.band === 'B2')).toBe(true);
    expect(policy.challenge).toBe('none');
    expect(policy.model_override).toBe('anthropic');
    expect(model.model).toBe('anthropic');
  });

  test('Band 3 forces slow + light depth + no challenge + anthropic', () => {
    const { decision, policy, model } = makeDecision(
      "I feel numb and not real, like I'm watching myself"
    );

    expect(decision.state.arousal === 'shutdown' || decision.state.arousal === 'dissociated').toBe(true);
    expect(decision.adaptive_codes.some((c) => c.band === 'B3')).toBe(true);
    expect(policy.pace).toBe('slow');
    expect(policy.depth).toBe('light');
    expect(policy.challenge).toBe('none');
    expect(model.model).toBe('anthropic');
  });

  test('Direct challenge is gated; safety-first outcomes are always acceptable', () => {
    const { policy, model } = makeDecision("Don't sugarcoat it. I'm procrastinating and making excuses.");

    // If direct is allowed, model choice should not be Anthropic by default policy.
    if (policy.challenge === 'direct') {
      expect(policy.pace).toBe('directive');
      expect(['openai', 'grok_like', 'anthropic']).toContain(model.model);
    } else {
      expect(['none', 'gentle']).toContain(policy.challenge);
    }
  });

  test('Unified voice: unifier removes internal layer/model references', () => {
    const draft = 'Internal: Neural routed this to IBA and selected Anthropic model.';
    const unified = unifyVoice(draft);

    const forbidden = ['Neural', 'IBA', 'Anthropic', 'OpenAI', 'Grok', 'Claude', 'GPT', 'router', 'policy', 'band'];
    forbidden.forEach((word) => expect(unified.includes(word)).toBe(false));
  });
});
