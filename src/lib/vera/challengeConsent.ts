import type { SIMState } from '@/lib/telemetry/logTelemetry';

export type ChallengeChoice = 'challenge_on' | 'challenge_off';
export type ChallengeScope = 'single_turn' | 'none';

export type ChallengeConsentState = {
  policy_id: string;
  user_choice: ChallengeChoice;
  scope: ChallengeScope;
  consent_ts: string;
};

export type ChallengeCookieState = {
  prompt_count: number;
  last_prompt_turn: number;
  last_prompt_ts?: string;
  suppress_until_turn: number;
  consent?: ChallengeConsentState;
};

export function decodeChallengeCookieState(value: string | undefined): ChallengeCookieState {
  if (!value) return { prompt_count: 0, last_prompt_turn: 0, suppress_until_turn: 0 };
  try {
    const json = Buffer.from(value, 'base64url').toString('utf8');
    const parsed = JSON.parse(json) as Partial<ChallengeCookieState>;

    const consent = (parsed as any)?.consent;
    const consentParsed: ChallengeConsentState | undefined =
      consent &&
      typeof consent === 'object' &&
      typeof (consent as any).policy_id === 'string' &&
      ((consent as any).user_choice === 'challenge_on' || (consent as any).user_choice === 'challenge_off') &&
      ((consent as any).scope === 'single_turn' || (consent as any).scope === 'none') &&
      typeof (consent as any).consent_ts === 'string'
        ? {
            policy_id: (consent as any).policy_id,
            user_choice: (consent as any).user_choice,
            scope: (consent as any).scope,
            consent_ts: (consent as any).consent_ts,
          }
        : undefined;

    return {
      prompt_count: typeof parsed.prompt_count === 'number' ? parsed.prompt_count : 0,
      last_prompt_turn: typeof parsed.last_prompt_turn === 'number' ? parsed.last_prompt_turn : 0,
      last_prompt_ts: typeof parsed.last_prompt_ts === 'string' ? parsed.last_prompt_ts : undefined,
      suppress_until_turn: typeof parsed.suppress_until_turn === 'number' ? parsed.suppress_until_turn : 0,
      consent: consentParsed,
    };
  } catch {
    return { prompt_count: 0, last_prompt_turn: 0, suppress_until_turn: 0 };
  }
}

export function encodeChallengeCookieState(state: ChallengeCookieState): string {
  return Buffer.from(JSON.stringify(state), 'utf8').toString('base64url');
}

export function canOfferChallengeConsent(input: {
  sim_state: SIMState;
  crisis_markers: boolean;
  dependency_markers: boolean;
  upgrade_pressure: boolean;
  loop_detected: boolean;
  turn_id: number;
  cookie: ChallengeCookieState;
  min_turns_before_repeat: number;
  max_prompts_per_session: number;
  challenge_consent_already_asked: boolean;
}): boolean {
  if (input.sim_state !== 'stable') return false;
  if (input.crisis_markers) return false;
  if (input.dependency_markers) return false;
  if (input.upgrade_pressure) return false;
  if (!input.loop_detected) return false;
  if (input.challenge_consent_already_asked) return false;

  const suppressedByTurns = input.cookie.suppress_until_turn > 0 && input.turn_id < input.cookie.suppress_until_turn;
  if (suppressedByTurns) return false;

  const suppressedByRepeatWindow =
    input.cookie.last_prompt_turn > 0 && (input.turn_id - input.cookie.last_prompt_turn) < input.min_turns_before_repeat;
  if (suppressedByRepeatWindow) return false;

  const promptBudgetExceeded = input.cookie.prompt_count >= input.max_prompts_per_session;
  if (promptBudgetExceeded) return false;

  return true;
}

export function nextChallengeCookieStateOnPromptShown(input: {
  cookie: ChallengeCookieState;
  turn_id: number;
  prompt_ts: string;
}): ChallengeCookieState {
  return {
    ...input.cookie,
    prompt_count: input.cookie.prompt_count + 1,
    last_prompt_turn: input.turn_id,
    last_prompt_ts: input.prompt_ts,
  };
}

export function nextChallengeCookieStateOnDecline(input: {
  cookie: ChallengeCookieState;
  turn_id: number;
  suppress_reprompt_for_turns: number;
}): ChallengeCookieState {
  return {
    ...input.cookie,
    suppress_until_turn: input.turn_id + input.suppress_reprompt_for_turns,
  };
}
