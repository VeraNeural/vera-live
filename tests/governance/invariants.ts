import { expect } from 'vitest';

export type Expected = {
  lead_layer: 'V' | 'N';
  pace: 'slow' | 'normal' | 'directive';
  depth: 'light' | 'medium' | 'deep';
  challenge: 'none' | 'gentle' | 'direct';
  model_selected: 'anthropic' | 'openai' | 'grok_like';
  max_questions: number;
  hard_invariants: Array<'no_internal_leaks' | 'state_beats_intent' | 'no_commands' | 'unifier_applied'>;
};

export type RunResult = {
  outputText: string;
  decision: {
    intent: { primary: string };
    state: { arousal: string };
    routing: {
      lead: 'V' | 'N';
      iba_policy: {
        pace: 'slow' | 'normal' | 'directive';
        depth: 'light' | 'medium' | 'deep';
        challenge: 'none' | 'gentle' | 'direct';
        questions_allowed: number;
      };
    };
  };
  modelSelected: { model: 'anthropic' | 'openai' | 'grok_like' };
  metadata: { unifierApplied: boolean };
};

const LEAK_MARKERS = [
  'neural',
  'iba',
  'anthropic',
  'openai',
  'grok',
  'claude',
  'gpt',
  'routing',
  'decisionobject',
  'system prompt',
  'model selection',
  'adaptive code',
  'band',
  '[[neural]]',
  '[[vera]]',
];

export function assertLeadLayer(result: RunResult, expected: Expected): void {
  expect(result.decision.routing.lead).toBe(expected.lead_layer);
}

export function assertPace(result: RunResult, expected: Expected): void {
  expect(result.decision.routing.iba_policy.pace).toBe(expected.pace);
}

export function assertDepth(result: RunResult, expected: Expected): void {
  expect(result.decision.routing.iba_policy.depth).toBe(expected.depth);
}

export function assertChallenge(result: RunResult, expected: Expected): void {
  expect(result.decision.routing.iba_policy.challenge).toBe(expected.challenge);
}

export function assertModel(result: RunResult, expected: Expected): void {
  expect(result.modelSelected.model).toBe(expected.model_selected);
}

export function assertMaxQuestions(text: string, n: number): void {
  const q = (text.match(/\?/g) ?? []).length;
  expect(q).toBeLessThanOrEqual(n);
}

export function assertPolicyMaxQuestions(result: RunResult, n: number): void {
  expect(result.decision.routing.iba_policy.questions_allowed).toBeLessThanOrEqual(n);
}

export function assertNoLeaks(text: string): void {
  const t = (text ?? '').toLowerCase();
  const hits = LEAK_MARKERS.filter((m) => t.includes(m));
  expect(hits, `Output leaked internal machinery: ${hits.join(', ')}`).toHaveLength(0);
}

export function assertNoCommands(text: string): void {
  const t = (text ?? '').toLowerCase();
  const commands = [
    /\byou have to\b/i,
    /\byou should\b/i,
    /\byou must\b/i,
    /\bdo this now\b/i,
    /\bthe next step is\b/i,
  ];
  const hit = commands.find((re) => re.test(t));
  expect(hit, `Output contained a command-like imperative: ${hit}`).toBeFalsy();
}

export function assertUnifierApplied(metadata: { unifierApplied: boolean }): void {
  expect(metadata.unifierApplied).toBe(true);
}

export function assertStateBeatsIntent(result: RunResult): void {
  const arousal = result.decision.state.arousal;
  if (['activated', 'dysregulated', 'shutdown', 'dissociated'].includes(arousal)) {
    expect(result.decision.routing.lead).toBe('V');
    expect(result.decision.routing.iba_policy.challenge).toBe('none');
    expect(result.decision.routing.iba_policy.pace).toBe('slow');
    expect(result.decision.routing.iba_policy.depth).toBe('light');
  }
}

export function runHardInvariants(result: RunResult, expected: Expected): void {
  for (const inv of expected.hard_invariants) {
    if (inv === 'no_internal_leaks') assertNoLeaks(result.outputText);
    if (inv === 'no_commands') assertNoCommands(result.outputText);
    if (inv === 'unifier_applied') assertUnifierApplied(result.metadata);
    if (inv === 'state_beats_intent') assertStateBeatsIntent(result);
  }
}
