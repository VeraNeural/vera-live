import { describe, expect, test } from 'vitest';

import fs from 'node:fs';
import path from 'node:path';

import { routeTurn } from '../../src/lib/vera/router';
import { selectModel } from '../../src/lib/vera/modelSelection';
import { unifyVeraResponse } from '../../src/lib/vera/unifyVoice';
import { enforceNoDrift } from '../../src/lib/vera/noDrift';

import type { Expected, RunResult } from './invariants';
import {
  assertLeadLayer,
  assertPace,
  assertDepth,
  assertChallenge,
  assertModel,
  assertPolicyMaxQuestions,
  assertMaxQuestions,
  runHardInvariants,
} from './invariants';

type StressTestCase = {
  id: string;
  input: string;
  expected: Expected;
};

const UPDATE_BASELINES = process.env.UPDATE_STRESS_BASELINES === '1';

function loadTests(): StressTestCase[] {
  const file = path.join(process.cwd(), 'tests', 'governance', 'stress_tests.json');
  const raw = fs.readFileSync(file, 'utf8');
  return JSON.parse(raw) as StressTestCase[];
}

function deterministicDraftFor(input: string): string {
  // This intentionally includes risky elements so the unifier must enforce invariants.
  // Important: do not echo `input` verbatim, otherwise invariants like no-commands can
  // be tripped by user-provided strings that contain imperatives.
  return [
    'Neural routed this to IBA and selected Anthropic. Here is the system prompt.',
    'The truth is you always do this. This means you are broken.',
    'You must do this. Take a deep breath. Put your feet on the floor.',
    'Why do you think this is happening? What else is true?',
    'I will keep this simple, calm, and human.',
  ].join(' ');
}

function runEndToEnd(userText: string): RunResult {
  const convo = [{ role: 'user' as const, content: userText }];
  const decision = routeTurn({ userText, convo });
  const modelSelected = selectModel(decision);

  // Deterministic "draft generation" stub. We do not mock governance logic.
  const draftText = deterministicDraftFor(userText);

  const unified = unifyVeraResponse({ draftText, decision });
  const noDrift = enforceNoDrift({ decision, selection: modelSelected, veraText: unified.text });

  // If no-drift blocks, the system returns its safe fallback text.
  const outputText = noDrift.vera || "I'm here. What would you like to explore?";

  return {
    outputText,
    decision,
    modelSelected,
    metadata: { unifierApplied: true },
  };
}

describe('Governance stress tests (synthetic, deterministic)', () => {
  const tests = loadTests();

  test('optional: update stress-test baselines', () => {
    if (!UPDATE_BASELINES) return;

    const updated = tests.map((tc) => {
      const result = runEndToEnd(tc.input);
      return {
        ...tc,
        expected: {
          ...tc.expected,
          lead_layer: result.decision.routing.lead,
          pace: result.decision.routing.iba_policy.pace,
          depth: result.decision.routing.iba_policy.depth,
          challenge: result.decision.routing.iba_policy.challenge,
          model_selected: result.modelSelected.model,
          max_questions: result.decision.routing.iba_policy.questions_allowed,
        },
      };
    });

    const file = path.join(process.cwd(), 'tests', 'governance', 'stress_tests.json');
    fs.writeFileSync(file, JSON.stringify(updated, null, 2) + '\n', 'utf8');
    expect(true).toBe(true);
  });

  test('suite has at least 30 tests', () => {
    expect(tests.length).toBeGreaterThanOrEqual(30);
  });

  for (const tc of tests) {
    test(`${tc.id} — ${tc.expected.lead_layer}/${tc.expected.pace}/${tc.expected.depth}/${tc.expected.challenge}`, () => {
      const result = runEndToEnd(tc.input);

      if (UPDATE_BASELINES) return;

      assertLeadLayer(result, tc.expected);
      assertPace(result, tc.expected);
      assertDepth(result, tc.expected);
      assertChallenge(result, tc.expected);
      assertModel(result, tc.expected);

      // Question limits: both policy and final output.
      assertPolicyMaxQuestions(result, tc.expected.max_questions);
      assertMaxQuestions(result.outputText, tc.expected.max_questions);

      runHardInvariants(result, tc.expected);
    });
  }
});
