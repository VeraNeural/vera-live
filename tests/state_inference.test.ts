import { describe, expect, test } from 'vitest';

import { inferState } from '../src/lib/vera/detectors';

type Msg = { role: 'user' | 'assistant'; content: string };

describe('State inference spec (scored + protective)', () => {
  test('Activated: urgency + anxiety, still oriented', () => {
    const convo: Msg[] = [{ role: 'user', content: 'I need this now. I feel anxious. Can you answer quickly?' }];
    const s = inferState(convo[0].content, convo);
    expect(s.arousal).toBe('activated');
  });

  test('Dysregulated: panic/overload beats activated', () => {
    const text = "I need this now, it's too much. I can't breathe. I'm panicking.";
    const s = inferState(text, [{ role: 'user', content: text }]);
    expect(s.arousal).toBe('dysregulated');
  });

  test('Shutdown: collapse language', () => {
    const text = "What's the point. I give up. No energy.";
    const s = inferState(text, [{ role: 'user', content: text }]);
    expect(s.arousal).toBe('shutdown');
  });

  test('Dissociated: detachment overrides all', () => {
    const text = "Nothing feels real. I'm detached and numb, like I'm watching myself.";
    const s = inferState(text, [{ role: 'user', content: text }]);
    expect(s.arousal).toBe('dissociated');
  });

  test('Decay: no sudden jump from dissociated to regulated', () => {
    const convo: Msg[] = [
      { role: 'user', content: "I don't feel real. I'm detached." },
      { role: 'assistant', content: 'Okay.' },
      { role: 'user', content: 'Can you help me plan my day?' },
    ];

    const s = inferState(convo[2].content, convo);
    expect(s.arousal).not.toBe('regulated');
  });
});
