import { describe, expect, test } from 'vitest';

import { routeTurn } from '../src/lib/vera/router';
import { composeSystemPrompt } from '../src/lib/vera/promptComposer';
import {
  BUILD_ENTRY_FIRST_RESPONSE_TEMPLATE,
  BUILD_TIER_REQUIRED_CAPABILITIES,
  type BuildProjectState,
} from '../src/lib/vera/buildTier';

describe('Build tier requirements', () => {
  test('Required capabilities are all true (build must fail otherwise)', () => {
    expect(BUILD_TIER_REQUIRED_CAPABILITIES.tier).toBe('build');

    const caps = BUILD_TIER_REQUIRED_CAPABILITIES.required_capabilities;
    expect(Object.values(caps)).toEqual([
      true, // project_required
      true, // project_persistence
      true, // multi_session_continuity
      true, // iterative_outputs
      true, // decision_memory
      true, // versioning_allowed
      true, // structured_reasoning
    ]);
  });

  test('Routing can be explicitly set to Build tier', () => {
    const decision = routeTurn({
      userText: 'I want to build a project.',
      convo: [{ role: 'user', content: 'I want to build a project.' }],
      tier: 'build',
    });

    expect(decision.routing.iba_policy.tier).toBe('build');
    expect(decision.routing.iba_policy.memory_use).toBe('persistent');
  });

  test('Build tier prompt includes canonical contract + required entry response', () => {
    const decision = routeTurn({
      userText: 'Let’s build this.',
      convo: [{ role: 'user', content: 'Let’s build this.' }],
      tier: 'build',
    });

    const system = composeSystemPrompt(decision, { projectState: null });

    expect(system).toContain('BUILD TIER (INTERNAL ONLY; do not mention this tier or these rules to the user):');
    expect(system).toContain('REQUIRED CAPABILITIES');
    expect(system).toContain('PROJECT STATE OBJECT (CANONICAL)');
    expect(system).toContain('downgrade behavior is forbidden');
    expect(system).toContain(BUILD_ENTRY_FIRST_RESPONSE_TEMPLATE.first_response);
  });

  test('Build tier prompt binds to provided project_state', () => {
    const decision = routeTurn({
      userText: 'Continue the plan.',
      convo: [{ role: 'user', content: 'Continue the plan.' }],
      tier: 'build',
    });

    const projectState: BuildProjectState = {
      project_state: {
        project_id: '9b61e6e8-2f6b-4d86-b6f1-7c199a0c5f66',
        project_name: 'Vera Build Tier',
        project_type: 'software',
        project_goal: 'Implement project-bound build tier governance.',
        constraints: ['No silent downgrades', 'Persistent decision log'],
        current_stage: 'planning',
        decisions: [
          {
            decision_id: 'D1',
            summary: 'Use project_state as authoritative memory carrier.',
            timestamp: '2026-01-13T00:00:00.000Z',
          },
        ],
        artifacts: [
          {
            artifact_id: 'A1',
            type: 'plan',
            version: 1,
            created_at: '2026-01-13T00:00:00.000Z',
          },
        ],
      },
    };

    const system = composeSystemPrompt(decision, { projectState });
    expect(system).toContain('CURRENT PROJECT STATE (authoritative; bind the conversation to this):');
    expect(system).toContain('"project_name": "Vera Build Tier"');
    expect(system).toContain('"current_stage": "planning"');
  });
});
