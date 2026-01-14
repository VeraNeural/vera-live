import { describe, expect, it } from 'vitest';
import type { TelemetryEvent } from '../src/lib/telemetry/logTelemetry';
import { validateTelemetryEventForCI } from '../src/lib/telemetry/ciAssertions';

function baseEvent(overrides?: Partial<TelemetryEvent>): TelemetryEvent {
  return {
    session_id: '00000000-0000-0000-0000-000000000000',
    user_id: '00000000-0000-0000-0000-000000000000',

    tier: 'free',
    model_used: 'none',

    tokens_used: 0,
    latency_ms: 1,

    response_tags: ['summary'],
    reflection_layers: 2,
    abstraction_level: 'thematic',
    followup_count: 0,

    sim_state: 'stable',
    sim_interventions: [],
    sim_upgrade_suppressed: true,
    sim_model_rerouted: false,

    tier_behavior_violation: false,
    forbidden_behavior_triggered: false,
    auto_correction_applied: false,

    invitation_shown: false,

    state_snapshot: {},
    ...overrides,
  };
}

describe('CI telemetry assertions', () => {
  it('passes CI-CHALLENGE-001 when consent precedes apply and iba_active=true', () => {
    const evt = baseEvent({
      sim_state: 'stable',
      response_tags: ['summary', 'iba_active'],
      state_snapshot: {
        challenge: {
          prompt_shown: true,
          prompt_id: 'VERA-UI-CHALLENGE-CONSENT-001',
          prompt_ts: '2026-01-13T16:24:11.210Z',
          user_choice: 'challenge_on',
          consent_ts: '2026-01-13T16:24:15.901Z',
          scope: 'single_turn',
          applied_ts: '2026-01-13T16:24:16.102Z',
          iba_active: true,
          sim_state_at_apply: 'stable',
          prompt_count_in_session: 1,
        },
      },
    });

    const r = validateTelemetryEventForCI(evt);
    expect(r.ok).toBe(true);
  });

  it('fails CI-CHALLENGE-001 when consent_ts is after applied_ts', () => {
    const evt = baseEvent({
      sim_state: 'stable',
      response_tags: ['summary', 'iba_active'],
      state_snapshot: {
        challenge: {
          user_choice: 'challenge_on',
          consent_ts: '2026-01-13T16:24:17.901Z',
          scope: 'single_turn',
          applied_ts: '2026-01-13T16:24:16.102Z',
          iba_active: true,
          sim_state_at_apply: 'stable',
        },
      },
    });

    const r = validateTelemetryEventForCI(evt);
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.ci_rule_id === 'CI-CHALLENGE-001')).toBe(true);
  });

  it('fails CI-CHALLENGE-002 when sim_state is not stable but iba_active=true', () => {
    const evt = baseEvent({
      sim_state: 'strained',
      response_tags: ['summary', 'iba_active'],
      state_snapshot: {
        challenge: {
          iba_active: true,
          user_choice: 'challenge_on',
          consent_ts: '2026-01-13T16:24:15.901Z',
          scope: 'single_turn',
          applied_ts: '2026-01-13T16:24:16.102Z',
          sim_state_at_apply: 'stable',
        },
      },
    });

    const r = validateTelemetryEventForCI(evt);
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.ci_rule_id === 'CI-CHALLENGE-002')).toBe(true);
  });

  it('warns CI-CHALLENGE-003 when prompt_count_in_session exceeds max, without failing ok', () => {
    const evt = baseEvent({
      sim_state: 'stable',
      state_snapshot: {
        challenge: {
          prompt_shown: true,
          prompt_count_in_session: 3,
        },
      },
    });

    const r = validateTelemetryEventForCI(evt);
    expect(r.ok).toBe(true);
    expect(r.warnings.some((w) => w.ci_rule_id === 'CI-CHALLENGE-003')).toBe(true);
  });

  it('passes CI-IBA-STYLE-001 when iba_style snapshot fields are compliant', () => {
    const evt = baseEvent({
      sim_state: 'stable',
      response_tags: ['summary', 'iba_active'],
      state_snapshot: {
        iba_style: {
          active: true,
          questions_count: 1,
          max_sentences_per_paragraph: 3,
          reflection_layers_used: 2,
          abstraction_level_used: 'thematic',
          pressure_level: 2,
          user_exit_available: true,
          forbidden_phrase_hits: [],
          forbidden_punctuation_hits: [],
          has_emoji: false,
          has_required_exit_line: true,
          why_question_used: false,
        },
      },
    });

    const r = validateTelemetryEventForCI(evt);
    expect(r.ok).toBe(true);
  });

  it('fails CI-IBA-STYLE-001 when iba_style violates max questions', () => {
    const evt = baseEvent({
      sim_state: 'stable',
      response_tags: ['summary', 'iba_active'],
      state_snapshot: {
        iba_style: {
          active: true,
          questions_count: 2,
          max_sentences_per_paragraph: 2,
          reflection_layers_used: 2,
          abstraction_level_used: 'thematic',
          pressure_level: 2,
          user_exit_available: true,
          forbidden_phrase_hits: [],
          forbidden_punctuation_hits: [],
          has_emoji: false,
          has_required_exit_line: true,
          why_question_used: false,
        },
      },
    });

    const r = validateTelemetryEventForCI(evt);
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.ci_rule_id === 'CI-IBA-STYLE-001')).toBe(true);
  });

  it('passes CI-THIRD-MSG-001 when third snapshot fields are compliant', () => {
    const evt = baseEvent({
      state_snapshot: {
        third_message: {
          stage: 'third_assistant_message',
          questions_count: 1,
          solutions_provided: false,
          frameworks_used: false,
          tier_mentioned: false,
          upgrade_language_used: false,
        },
      },
    });

    const r = validateTelemetryEventForCI(evt);
    expect(r.ok).toBe(true);
  });

  it('fails CI-THIRD-MSG-001 when third message has too many questions', () => {
    const evt = baseEvent({
      state_snapshot: {
        third_message: {
          stage: 'third_assistant_message',
          questions_count: 2,
          solutions_provided: false,
          frameworks_used: false,
          tier_mentioned: false,
          upgrade_language_used: false,
        },
      },
    });

    const r = validateTelemetryEventForCI(evt);
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.ci_rule_id === 'CI-THIRD-MSG-001')).toBe(true);
  });

  it('passes CI-FOURTH-MSG-002 when escalation respects SIM caps', () => {
    const evt = baseEvent({
      tier: 'sanctuary',
      abstraction_level: 'thematic',
      state_snapshot: {
        fourth_message: {
          stage: 'fourth_assistant_message',
          reflection_layers_used: 2,
          max_reflection_layers_from_SIM: 2,
          abstraction_level_used: 'thematic',
          max_abstraction_level_from_SIM: 'thematic',
          sim_state: 'strained',
          analysis_used: true,
        },
      },
    });

    const r = validateTelemetryEventForCI(evt);
    expect(r.ok).toBe(true);
  });

  it('fails CI-FOURTH-MSG-002 when overloaded but analysis_used=true', () => {
    const evt = baseEvent({
      tier: 'sanctuary',
      abstraction_level: 'situational',
      state_snapshot: {
        fourth_message: {
          stage: 'fourth_assistant_message',
          reflection_layers_used: 1,
          max_reflection_layers_from_SIM: 1,
          abstraction_level_used: 'situational',
          max_abstraction_level_from_SIM: 'situational',
          sim_state: 'overloaded',
          analysis_used: true,
        },
      },
    });

    const r = validateTelemetryEventForCI(evt);
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.ci_rule_id === 'CI-FOURTH-MSG-002')).toBe(true);
  });

  it('fails CI-UPGRADE-001 if invitation_shown during protected/overloaded', () => {
    const evt = baseEvent({
      invitation_shown: true,
      sim_state_at_invite: 'protected',
    });

    const r = validateTelemetryEventForCI(evt);
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.ci_rule_id === 'CI-UPGRADE-001')).toBe(true);
  });

  it('fails CI-TIER-001 if free tier uses structural abstraction', () => {
    const evt = baseEvent({
      tier: 'free',
      abstraction_level: 'structural',
    });

    const r = validateTelemetryEventForCI(evt);
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.ci_rule_id === 'CI-TIER-001')).toBe(true);
  });
});
