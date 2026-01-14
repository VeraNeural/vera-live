import { describe, expect, it } from 'vitest';
import { validateIbaResponseStyle } from '../src/lib/vera/ibaResponseStyle';

describe('IBA response style validator', () => {
  it('accepts a compliant IBA-style response', () => {
    const text = [
      "You're circling the same point.",
      'That usually means something is being avoided.',
      '',
      'What are you protecting by staying here?',
      '',
      'You can switch back at any time.',
    ].join('\n');

    const r = validateIbaResponseStyle(text);
    expect(r.ok).toBe(true);
  });

  it('rejects forbidden LLM markers', () => {
    const text = [
      "It sounds like you're trying to avoid this.",
      '',
      'We can pause here.',
    ].join('\n');

    const r = validateIbaResponseStyle(text);
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.rule === 'forbidden_phrases')).toBe(true);
  });

  it('rejects exclamation points', () => {
    const text = [
      'You already know the next step!',
      '',
      'We can pause here.',
    ].join('\n');

    const r = validateIbaResponseStyle(text);
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.rule === 'forbidden_punctuation')).toBe(true);
  });

  it('rejects more than one question', () => {
    const text = [
      "You're avoiding the decision.",
      '',
      'What do you want?',
      'What are you afraid will happen?',
      '',
      'We can pause here.',
    ].join('\n');

    const r = validateIbaResponseStyle(text);
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.rule === 'max_questions_per_message')).toBe(true);
  });

  it('rejects why-questions', () => {
    const text = [
      'Why are you doing this?',
      '',
      'We can pause here.',
    ].join('\n');

    const r = validateIbaResponseStyle(text);
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.rule === 'forbidden_question_starter')).toBe(true);
  });

  it('rejects how-come questions', () => {
    const text = [
      'How come you keep doing this?',
      '',
      'We can pause here.',
    ].join('\n');

    const r = validateIbaResponseStyle(text);
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.rule === 'forbidden_question_starter')).toBe(true);
  });

  it('rejects unicode ellipsis', () => {
    const text = [
      'You already know the next step…',
      '',
      'We can pause here.',
    ].join('\n');

    const r = validateIbaResponseStyle(text);
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.rule === 'forbidden_punctuation')).toBe(true);
  });

  it('rejects sentences longer than 22 words', () => {
    const text = [
      'You keep circling this because it protects you from committing to a choice that would force you to change your behavior right now.',
      '',
      'We can pause here.',
    ].join('\n');

    const r = validateIbaResponseStyle(text);
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.rule === 'max_words_per_sentence')).toBe(true);
  });

  it('rejects missing required exit line', () => {
    const text = [
      "You're choosing comfort over change.",
      'That choice has a cost.',
    ].join('\n');

    const r = validateIbaResponseStyle(text);
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.rule === 'required_exit_line')).toBe(true);
  });

  it('rejects paragraphs with more than 3 sentences', () => {
    const text = [
      'This is sentence one. This is sentence two. This is sentence three. This is sentence four.',
      '',
      'We can pause here.',
    ].join('\n');

    const r = validateIbaResponseStyle(text);
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.rule === 'max_sentences_per_paragraph')).toBe(true);
  });
});
