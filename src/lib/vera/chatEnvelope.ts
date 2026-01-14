export type UiDirectiveMode = 'conversation' | 'challenge' | 'grounding' | 'upgrade_invite';
export type OrbState = 'anchored' | 'active';
export type InputPosition = 'bottom';

export type UiDirective = {
  mode: UiDirectiveMode;
  content: string;
  chips?: string[];
  orb_state: OrbState;
  input_position: InputPosition;
};

export type TelemetryHint = {
  consent_required: boolean;
  challenge_planned: boolean;
};

export type ChatApiEnvelope = {
  ui_directive: UiDirective;
  telemetry_hint: TelemetryHint;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

export function computeDirectiveMode(input: {
  challengePlanned: boolean;
  consentPresent: boolean;
}): { mode: UiDirectiveMode; autoCorrectionApplied: boolean } {
  if (input.challengePlanned && input.consentPresent) {
    return { mode: 'challenge', autoCorrectionApplied: false };
  }
  if (input.challengePlanned && !input.consentPresent) {
    return { mode: 'conversation', autoCorrectionApplied: true };
  }
  return { mode: 'conversation', autoCorrectionApplied: false };
}

export function buildChatApiEnvelope(input: {
  mode: UiDirectiveMode;
  content: string;
  chips?: string[];
  orb_state?: OrbState;
  input_position?: InputPosition;
  telemetry_hint: TelemetryHint;
}): ChatApiEnvelope {
  const ui_directive: UiDirective = {
    mode: input.mode,
    content: input.content,
    chips: input.chips && input.chips.length ? input.chips : undefined,
    orb_state: input.orb_state ?? 'anchored',
    input_position: input.input_position ?? 'bottom',
  };

  const envelope: ChatApiEnvelope = {
    ui_directive,
    telemetry_hint: {
      consent_required: Boolean(input.telemetry_hint.consent_required),
      challenge_planned: Boolean(input.telemetry_hint.challenge_planned),
    },
  };

  assertValidChatApiEnvelope(envelope);
  return envelope;
}

export function assertValidChatApiEnvelope(value: unknown): asserts value is ChatApiEnvelope {
  if (!isRecord(value)) throw new Error('ChatApiEnvelope must be an object');

  const ui = value.ui_directive;
  const th = value.telemetry_hint;

  if (!isRecord(ui)) throw new Error('ui_directive missing or not an object');
  if (!isRecord(th)) throw new Error('telemetry_hint missing or not an object');

  const mode = ui.mode;
  if (mode !== 'conversation' && mode !== 'challenge' && mode !== 'grounding' && mode !== 'upgrade_invite') {
    throw new Error('ui_directive.mode invalid');
  }

  if (typeof ui.content !== 'string') throw new Error('ui_directive.content must be a string');

  if (ui.chips !== undefined && !isStringArray(ui.chips)) {
    throw new Error('ui_directive.chips must be string[] when present');
  }

  if (ui.orb_state !== 'anchored' && ui.orb_state !== 'active') {
    throw new Error('ui_directive.orb_state invalid');
  }

  if (ui.input_position !== 'bottom') {
    throw new Error('ui_directive.input_position invalid');
  }

  if (typeof th.consent_required !== 'boolean') throw new Error('telemetry_hint.consent_required must be boolean');
  if (typeof th.challenge_planned !== 'boolean') throw new Error('telemetry_hint.challenge_planned must be boolean');
}

export function parseChatApiEnvelope(value: unknown): ChatApiEnvelope {
  assertValidChatApiEnvelope(value);
  return value;
}
