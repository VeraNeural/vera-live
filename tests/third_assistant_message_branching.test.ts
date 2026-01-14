import { describe, expect, it } from 'vitest';
import { buildThirdAssistantMessage, classifyUserIntent, THIRD_MESSAGE_TEMPLATES } from '../src/lib/vera/thirdAssistantMessage';

function assertThirdMessageConstraints(text: string) {
  // No lists
  expect(/\n-\s/.test(text)).toBe(false);
  expect(/\n\d+\./.test(text)).toBe(false);

  // Exactly one question (max 1)
  const questions = (text.match(/\?/g) ?? []).length;
  expect(questions).toBeLessThanOrEqual(1);

  // No tier mentions / upgrade language
  expect(/\b(tier|free|sanctuary|professional)\b/i.test(text)).toBe(false);
  expect(/\bupgrade\b/i.test(text)).toBe(false);
}

describe('third assistant message branching (v1)', () => {
  it('classifies emotional_processing', () => {
    const c = classifyUserIntent("I feel overwhelmed and I don't know what to do.");
    expect(c.intent).toBe('emotional_processing');
    expect(c.confidence).toBeGreaterThanOrEqual(0.5);
  });

  it('classifies cognitive_clarity', () => {
    const c = classifyUserIntent('I keep looping on this and it feels tangled in my head.');
    expect(c.intent).toBe('cognitive_clarity');
  });

  it('classifies creation_build', () => {
    const c = classifyUserIntent('I want to build an app for my team.');
    expect(c.intent).toBe('creation_build');
  });

  it('classifies learning_exploration', () => {
    const c = classifyUserIntent('Can you explain how this works at a high level?');
    expect(c.intent).toBe('learning_exploration');
  });

  it('classifies decision_support', () => {
    const c = classifyUserIntent('Should I take the offer or stay where I am?');
    expect(c.intent).toBe('decision_support');
  });

  it('falls back to open_ended_presence when unclear', () => {
    const c = classifyUserIntent('Hey.');
    expect(c.intent).toBe('open_ended_presence');
  });

  it('returns exact template text per intent and enforces global constraints', () => {
    const intents = Object.keys(THIRD_MESSAGE_TEMPLATES) as Array<keyof typeof THIRD_MESSAGE_TEMPLATES>;
    for (const intent of intents) {
      const third = buildThirdAssistantMessage({ intent });
      expect(third.text).toBe(THIRD_MESSAGE_TEMPLATES[intent].text);
      assertThirdMessageConstraints(third.text);
    }
  });
});
