import { describe, expect, it } from 'vitest';
import { validateRuntimeLog } from '../src/lib/vera/runtimeLog';

// CI CHECKS — RUNTIME VALIDATION
// Required runtime log shape:
// {
//   "runtime_log": {
//     "tier": "free | sanctuary | build",
//     "model_used": "string",
//     "tokens_used": "number",
//     "response_tags": ["reflection", "question", "action", "summary"],
//     "state_snapshot": {}
//   }
// }
//
// This spec enforces the canonical assertions provided in /specs/model_routing_policy.json
// and the tier-specific tag/state constraints described in the conversation.

describe('CI runtime validation: vera runtime_log', () => {
  it('accepts a valid free runtime_log', () => {
    const result = validateRuntimeLog({
      runtime_log: {
        tier: 'free',
        model_used: 'claude-haiku',
        tokens_used: 120,
        response_tags: ['summary'],
        state_snapshot: {},
      },
    });
    expect(result.ok).toBe(true);
  });

  it('accepts a valid sanctuary runtime_log (>=2 sanctuary tags)', () => {
    const result = validateRuntimeLog({
      runtime_log: {
        tier: 'sanctuary',
        model_used: 'claude-sonnet',
        tokens_used: 300,
        response_tags: ['reflection', 'pacing'],
        state_snapshot: { sanctuary_state: { user_id: '00000000-0000-0000-0000-000000000000' } },
      },
    });
    expect(result.ok).toBe(true);
  });

  it('accepts a valid build runtime_log (project_state required + action tag)', () => {
    const result = validateRuntimeLog({
      runtime_log: {
        tier: 'build',
        model_used: 'claude-opus',
        tokens_used: 800,
        response_tags: ['action'],
        state_snapshot: { project_state: { project_id: 'p' } },
      },
    });
    expect(result.ok).toBe(true);
  });

  it('rejects sanctuary runtime_log if fewer than two sanctuary tags present', () => {
    const result = validateRuntimeLog({
      runtime_log: {
        tier: 'sanctuary',
        model_used: 'claude-sonnet',
        tokens_used: 100,
        response_tags: ['reflection'],
        state_snapshot: {},
      },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain('sanctuary_tags_missing_minimum');
    }
  });

  it('rejects build runtime_log if project_state is missing', () => {
    const result = validateRuntimeLog({
      runtime_log: {
        tier: 'build',
        model_used: 'claude-opus',
        tokens_used: 100,
        response_tags: ['action'],
        state_snapshot: {},
      },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain('build_missing_project_state');
    }
  });

  it('rejects when model is not allowed for tier', () => {
    const result = validateRuntimeLog({
      runtime_log: {
        tier: 'free',
        model_used: 'claude-opus',
        tokens_used: 100,
        response_tags: ['summary'],
        state_snapshot: {},
      },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain('model_not_allowed_for_tier');
    }
  });
});
