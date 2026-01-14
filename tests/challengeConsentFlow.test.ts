import { describe, expect, test } from 'vitest';
import {
  canOfferChallengeConsent,
  decodeChallengeCookieState,
  encodeChallengeCookieState,
  nextChallengeCookieStateOnDecline,
  nextChallengeCookieStateOnPromptShown,
} from '../src/lib/vera/challengeConsent';
import { validateTelemetryEventForCI } from '../src/lib/telemetry/ciAssertions';

function baseCookie() {
  return decodeChallengeCookieState(undefined);
}

describe('challenge consent flow', () => {
  test('challenge offered only when SIM=stable', () => {
    const okStable = canOfferChallengeConsent({
      sim_state: 'stable',
      crisis_markers: false,
      dependency_markers: false,
      upgrade_pressure: false,
      loop_detected: true,
      turn_id: 5,
      cookie: baseCookie(),
      min_turns_before_repeat: 12,
      max_prompts_per_session: 2,
      challenge_consent_already_asked: false,
    });
    expect(okStable).toBe(true);

    const notStable = canOfferChallengeConsent({
      sim_state: 'strained',
      crisis_markers: false,
      dependency_markers: false,
      upgrade_pressure: false,
      loop_detected: true,
      turn_id: 5,
      cookie: baseCookie(),
      min_turns_before_repeat: 12,
      max_prompts_per_session: 2,
      challenge_consent_already_asked: false,
    });
    expect(notStable).toBe(false);
  });

  test('challenge blocked during crisis', () => {
    const blocked = canOfferChallengeConsent({
      sim_state: 'stable',
      crisis_markers: true,
      dependency_markers: false,
      upgrade_pressure: false,
      loop_detected: true,
      turn_id: 5,
      cookie: baseCookie(),
      min_turns_before_repeat: 12,
      max_prompts_per_session: 2,
      challenge_consent_already_asked: false,
    });
    expect(blocked).toBe(false);
  });

  test('re-prompt suppressed after decline', () => {
    const turnId = 10;
    const suppressed = nextChallengeCookieStateOnDecline({
      cookie: baseCookie(),
      turn_id: turnId,
      suppress_reprompt_for_turns: 12,
    });

    const canOfferNow = canOfferChallengeConsent({
      sim_state: 'stable',
      crisis_markers: false,
      dependency_markers: false,
      upgrade_pressure: false,
      loop_detected: true,
      turn_id: turnId + 1,
      cookie: suppressed,
      min_turns_before_repeat: 12,
      max_prompts_per_session: 2,
      challenge_consent_already_asked: false,
    });

    expect(canOfferNow).toBe(false);
  });

  test('cookie state encodes/decodes', () => {
    const s1 = nextChallengeCookieStateOnPromptShown({ cookie: baseCookie(), turn_id: 3, prompt_ts: '2026-01-01T00:00:00.000Z' });
    const encoded = encodeChallengeCookieState(s1);
    const s2 = decodeChallengeCookieState(encoded);
    expect(s2.prompt_count).toBe(1);
    expect(s2.last_prompt_turn).toBe(3);
    expect(s2.last_prompt_ts).toBe('2026-01-01T00:00:00.000Z');
  });

  test('challenge response without consent fails CI', () => {
    const evt: any = {
      tier: 'free',
      model_used: 'test',
      tokens_used: 0,
      latency_ms: 0,
      response_tags: ['iba_active'],
      reflection_layers: 1,
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
      state_snapshot: {
        challenge: {
          prompt_shown: true,
          prompt_id: 'VERA-UI-CHALLENGE-CONSENT-001',
          prompt_ts: '2026-01-01T00:00:00.000Z',
          user_choice: 'challenge_off',
          consent_ts: '2026-01-01T00:00:00.000Z',
          scope: 'none',
          applied_ts: '2026-01-01T00:00:01.000Z',
          iba_active: true,
          sim_state_at_apply: 'stable',
          prompt_count_in_session: 1,
        },
      },
    };

    const r = validateTelemetryEventForCI(evt);
    expect(r.ok).toBe(false);
    expect(r.violations.some((v) => v.ci_rule_id === 'CI-CHALLENGE-001')).toBe(true);
  });

  test('consent timestamps precede challenge application (CI)', () => {
    const evt: any = {
      tier: 'free',
      model_used: 'test',
      tokens_used: 0,
      latency_ms: 0,
      response_tags: ['iba_active'],
      reflection_layers: 1,
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
      state_snapshot: {
        challenge: {
          prompt_shown: true,
          prompt_id: 'VERA-UI-CHALLENGE-CONSENT-001',
          prompt_ts: '2026-01-01T00:00:00.000Z',
          user_choice: 'challenge_on',
          consent_ts: '2026-01-01T00:00:01.000Z',
          scope: 'single_turn',
          applied_ts: '2026-01-01T00:00:02.000Z',
          iba_active: true,
          sim_state_at_apply: 'stable',
          prompt_count_in_session: 1,
        },
      },
    };

    const r = validateTelemetryEventForCI(evt);
    expect(r.ok).toBe(true);
  });
});
