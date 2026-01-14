import type { TelemetryEvent, AbstractionLevel, SIMState } from './logTelemetry';

export type CiViolation = { ci_rule_id: string; message: string };

export type CiAssertionResult = {
  ok: boolean;
  violations: CiViolation[];
  warnings: CiViolation[];
};

function abstractionRank(level: AbstractionLevel | string | undefined): number {
  switch (level) {
    case 'situational':
      return 0;
    case 'thematic':
      return 1;
    case 'structural':
      return 2;
    default:
      return -1;
  }
}

function isOverloadedOrProtected(state: SIMState | string | undefined): boolean {
  return state === 'overloaded' || state === 'protected';
}

export function validateTelemetryEventForCI(event: TelemetryEvent): CiAssertionResult {
  const violations: CiViolation[] = [];
  const warnings: CiViolation[] = [];
  const snapshot = (event.state_snapshot ?? {}) as Record<string, any>;

  // IBA response style (optional snapshot).
  // This does not imply IBA is user-facing; it is an internal style envelope that may be applied
  // during direct-challenge constraints. When present, it must satisfy the style rules.
  const ibaStyle = snapshot.iba_style as any | undefined;
  if (ibaStyle?.active === true) {
    // SIM constraints: IBA style is only allowed in stable.
    if (event.sim_state !== 'stable') {
      violations.push({
        ci_rule_id: 'CI-IBA-STYLE-001',
        message: `iba_style active while sim_state=${event.sim_state} (must be stable)`,
      });
    }

    // Telemetry requirements.
    const tags = Array.isArray(event.response_tags) ? event.response_tags : [];
    if (!tags.includes('iba_active')) {
      violations.push({
        ci_rule_id: 'CI-IBA-STYLE-001',
        message: 'response_tags must include iba_active when iba_style.active=true',
      });
    }

    const pressure = typeof ibaStyle.pressure_level === 'number' ? ibaStyle.pressure_level : null;
    if (pressure == null || ![1, 2, 3].includes(pressure)) {
      violations.push({
        ci_rule_id: 'CI-IBA-STYLE-001',
        message: `pressure_level must be 1|2|3 (got ${pressure})`,
      });
    }

    if (ibaStyle.user_exit_available !== true) {
      violations.push({
        ci_rule_id: 'CI-IBA-STYLE-001',
        message: 'user_exit_available must be true',
      });
    }

    if (typeof ibaStyle.reflection_layers_used !== 'number') {
      violations.push({
        ci_rule_id: 'CI-IBA-STYLE-001',
        message: 'reflection_layers_used must be present',
      });
    }
    if (typeof ibaStyle.abstraction_level_used !== 'string') {
      violations.push({
        ci_rule_id: 'CI-IBA-STYLE-001',
        message: 'abstraction_level_used must be present',
      });
    }

    const maxSent = typeof ibaStyle.max_sentences_per_paragraph === 'number' ? ibaStyle.max_sentences_per_paragraph : 999;
    if (maxSent > 3) {
      violations.push({
        ci_rule_id: 'CI-IBA-STYLE-001',
        message: `max_sentences_per_paragraph=${maxSent} > 3`,
      });
    }

    const q = typeof ibaStyle.questions_count === 'number' ? ibaStyle.questions_count : 999;
    if (q > 1) {
      violations.push({
        ci_rule_id: 'CI-IBA-STYLE-001',
        message: `questions_count=${q} > 1`,
      });
    }

    if (ibaStyle.why_question_used === true) {
      violations.push({
        ci_rule_id: 'CI-IBA-STYLE-001',
        message: 'why_question_used must be false',
      });
    }

    const forbiddenHits = Array.isArray(ibaStyle.forbidden_phrase_hits) ? ibaStyle.forbidden_phrase_hits : [];
    if (forbiddenHits.length > 0) {
      violations.push({
        ci_rule_id: 'CI-IBA-STYLE-001',
        message: `forbidden_phrase_hits must be empty (got ${forbiddenHits.join('|')})`,
      });
    }

    const punctHits = Array.isArray(ibaStyle.forbidden_punctuation_hits) ? ibaStyle.forbidden_punctuation_hits : [];
    if (punctHits.includes('!') || punctHits.includes('…')) {
      violations.push({
        ci_rule_id: 'CI-IBA-STYLE-001',
        message: 'forbidden_punctuation_hits must not include forbidden characters (!, …)',
      });
    }

    if (ibaStyle.has_emoji === true) {
      violations.push({
        ci_rule_id: 'CI-IBA-STYLE-001',
        message: 'has_emoji must be false',
      });
    }

    if (ibaStyle.has_required_exit_line !== true) {
      violations.push({
        ci_rule_id: 'CI-IBA-STYLE-001',
        message: 'has_required_exit_line must be true',
      });
    }
  }

  // Challenge consent proof (consent precedes directness).
  const challenge = snapshot.challenge as any | undefined;
  if (challenge && typeof challenge === 'object') {
    const tags = Array.isArray(event.response_tags) ? event.response_tags : [];
    const challengeIbaActive = challenge.iba_active === true;

    // CI-CHALLENGE-002: If SIM is not stable then iba_active must be false.
    if (event.sim_state !== 'stable' && (challengeIbaActive || tags.includes('iba_active'))) {
      violations.push({
        ci_rule_id: 'CI-CHALLENGE-002',
        message: `iba_active must be false when sim_state=${event.sim_state}`,
      });
    }

    // CI-CHALLENGE-001: proof that consent preceded challenge in the same session.
    if (challengeIbaActive) {
      if (challenge.user_choice !== 'challenge_on') {
        violations.push({
          ci_rule_id: 'CI-CHALLENGE-001',
          message: `challenge.user_choice must be 'challenge_on' (got ${challenge.user_choice})`,
        });
      }

      if (challenge.scope !== 'single_turn') {
        violations.push({
          ci_rule_id: 'CI-CHALLENGE-001',
          message: `challenge.scope must be 'single_turn' (got ${challenge.scope})`,
        });
      }

      if (challenge.sim_state_at_apply !== 'stable') {
        violations.push({
          ci_rule_id: 'CI-CHALLENGE-001',
          message: `challenge.sim_state_at_apply must be 'stable' (got ${challenge.sim_state_at_apply})`,
        });
      }

      const consentTs = typeof challenge.consent_ts === 'string' ? Date.parse(challenge.consent_ts) : NaN;
      const appliedTs = typeof challenge.applied_ts === 'string' ? Date.parse(challenge.applied_ts) : NaN;
      if (!Number.isFinite(consentTs) || !Number.isFinite(appliedTs)) {
        violations.push({
          ci_rule_id: 'CI-CHALLENGE-001',
          message: 'challenge.consent_ts and challenge.applied_ts must be valid ISO timestamps',
        });
      } else if (consentTs > appliedTs) {
        violations.push({
          ci_rule_id: 'CI-CHALLENGE-001',
          message: 'challenge.consent_ts must be <= challenge.applied_ts',
        });
      }
    }

    // CI-CHALLENGE-003 (warn): prompt count should not exceed max_prompts_per_session.
    const promptShown = challenge.prompt_shown === true;
    const promptCount = typeof challenge.prompt_count_in_session === 'number' ? challenge.prompt_count_in_session : null;
    if (promptShown && promptCount != null && promptCount > 2) {
      warnings.push({
        ci_rule_id: 'CI-CHALLENGE-003',
        message: `prompt_count_in_session=${promptCount} exceeds max_prompts_per_session=2`,
      });
    }
  }

  const third = snapshot.third_message as any | undefined;
  if (third?.stage === 'third_assistant_message') {
    const q = typeof third.questions_count === 'number' ? third.questions_count : 999;
    if (q > 1) {
      violations.push({ ci_rule_id: 'CI-THIRD-MSG-001', message: `questions_count=${q} > 1` });
    }
    if (third.solutions_provided !== false) {
      violations.push({ ci_rule_id: 'CI-THIRD-MSG-001', message: 'solutions_provided must be false' });
    }
    if (third.frameworks_used !== false) {
      violations.push({ ci_rule_id: 'CI-THIRD-MSG-001', message: 'frameworks_used must be false' });
    }
    if (third.tier_mentioned !== false) {
      violations.push({ ci_rule_id: 'CI-THIRD-MSG-001', message: 'tier_mentioned must be false' });
    }
    if (third.upgrade_language_used !== false) {
      violations.push({ ci_rule_id: 'CI-THIRD-MSG-001', message: 'upgrade_language_used must be false' });
    }
  }

  const fourth = snapshot.fourth_message as any | undefined;
  if (fourth?.stage === 'fourth_assistant_message') {
    const usedLayers = typeof fourth.reflection_layers_used === 'number' ? fourth.reflection_layers_used : 999;
    const maxLayers = typeof fourth.max_reflection_layers_from_SIM === 'number' ? fourth.max_reflection_layers_from_SIM : 0;
    if (usedLayers > maxLayers) {
      violations.push({
        ci_rule_id: 'CI-FOURTH-MSG-002',
        message: `reflection_layers_used=${usedLayers} > max_reflection_layers_from_SIM=${maxLayers}`,
      });
    }

    const usedAbs = abstractionRank(fourth.abstraction_level_used);
    const maxAbs = abstractionRank(fourth.max_abstraction_level_from_SIM);
    if (usedAbs === -1 || maxAbs === -1 || usedAbs > maxAbs) {
      violations.push({
        ci_rule_id: 'CI-FOURTH-MSG-002',
        message: `abstraction_level_used=${fourth.abstraction_level_used} exceeds max_abstraction_level_from_SIM=${fourth.max_abstraction_level_from_SIM}`,
      });
    }

    if (isOverloadedOrProtected(fourth.sim_state) && fourth.analysis_used !== false) {
      violations.push({
        ci_rule_id: 'CI-FOURTH-MSG-002',
        message: 'analysis_used must be false when sim_state is overloaded/protected',
      });
    }
  }

  // Upgrade suppression safety
  if (event.invitation_shown === true && isOverloadedOrProtected(event.sim_state_at_invite)) {
    violations.push({
      ci_rule_id: 'CI-UPGRADE-001',
      message: `invitation_shown=true with sim_state_at_invite=${event.sim_state_at_invite}`,
    });
  }

  // Tier containment
  if (event.tier === 'free' && abstractionRank(event.abstraction_level) >= abstractionRank('structural')) {
    violations.push({
      ci_rule_id: 'CI-TIER-001',
      message: `free tier abstraction_level_used=${event.abstraction_level} must not be structural`,
    });
  }

  return { ok: violations.length === 0, violations, warnings };
}
