import type { DecisionObject } from './decisionObject';
import type { Tier } from './decisionObject';
import { classifyIntent, inferState } from './detectors';
import { detectAdaptiveCodes } from './adaptiveCodes';
import { buildIbaPolicy } from './ibaPolicy';

export type ConversationMessage = { role: 'user' | 'assistant'; content: string };

export function routeTurn(input: {
  userText: string;
  convo: ConversationMessage[];
  tier?: Tier;
}): DecisionObject {
  const intent = classifyIntent(input.userText);
  const state = inferState(input.userText, input.convo);
  const adaptive_codes = detectAdaptiveCodes(input.userText, state, input.convo);

  const { policy, lead } = buildIbaPolicy({
    userText: input.userText,
    convo: input.convo,
    intent,
    state,
    adaptive_codes,
    tier: input.tier,
  });

  // Free-tier should retain session continuity by default.
  // This guards against any upstream policy returning memory_use='none'
  // which would cause the API to strip history.
  const memory_use = policy.tier === 'free' && policy.memory_use === 'none' ? 'session' : policy.memory_use;

  const support: Array<'N' | 'V'> = lead === 'N' ? ['V', 'N'] : ['N', 'V'];

  return {
    intent,
    state,
    adaptive_codes,
    routing: {
      lead,
      support,
      iba_policy: {
        ...policy,
        memory_use,
        // hard clamp
        questions_allowed: Math.max(0, Math.min(policy.questions_allowed, 3)),
      },
    },
  };
}
