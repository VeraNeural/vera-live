import { describe, expect, test } from 'vitest';
import { computeDirectiveMode, parseChatApiEnvelope } from '../src/lib/vera/chatEnvelope';

describe('chat envelope contract', () => {
  test('parseChatApiEnvelope rejects missing ui_directive', () => {
    expect(() => parseChatApiEnvelope({ telemetry_hint: { consent_required: false, challenge_planned: false } })).toThrow();
  });

  test('parseChatApiEnvelope rejects malformed ui_directive', () => {
    expect(() =>
      parseChatApiEnvelope({
        ui_directive: {
          mode: 'conversation',
          content: 'hi',
          orb_state: 'anchored',
          input_position: 'top',
        },
        telemetry_hint: { consent_required: false, challenge_planned: false },
      })
    ).toThrow();
  });

  test('computeDirectiveMode forbids challenge without consent', () => {
    const r = computeDirectiveMode({ challengePlanned: true, consentPresent: false });
    expect(r.mode).toBe('conversation');
    expect(r.autoCorrectionApplied).toBe(true);
  });

  test('computeDirectiveMode allows challenge with consent', () => {
    const r = computeDirectiveMode({ challengePlanned: true, consentPresent: true });
    expect(r.mode).toBe('challenge');
    expect(r.autoCorrectionApplied).toBe(false);
  });

  test('parseChatApiEnvelope accepts valid envelope', () => {
    const env = parseChatApiEnvelope({
      ui_directive: {
        mode: 'conversation',
        content: '',
        orb_state: 'anchored',
        input_position: 'bottom',
        chips: ['challenge_consent'],
      },
      telemetry_hint: { consent_required: true, challenge_planned: true },
    });

    expect(env.ui_directive.mode).toBe('conversation');
    expect(env.ui_directive.input_position).toBe('bottom');
  });
});
