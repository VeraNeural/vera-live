import { describe, expect, it } from 'vitest';
import { routeTurn } from '../src/lib/vera/router';
import { composeSystemPrompt } from '../src/lib/vera/promptComposer';
import {
  SANCTUARY_REQUIRED_CAPABILITIES,
  SANCTUARY_ENTRY_FIRST_RESPONSE_TEMPLATE,
  isValidSanctuaryState,
} from '../src/lib/vera/sanctuaryTier';

function allRequiredCapabilitiesTrue(obj: Record<string, unknown>): boolean {
  return Object.values(obj).every((v) => v === true);
}

describe('Sanctuary tier: emotional continuity requirements', () => {
  it('required capabilities are all true', () => {
    expect(SANCTUARY_REQUIRED_CAPABILITIES.tier).toBe('sanctuary');
    expect(allRequiredCapabilitiesTrue(SANCTUARY_REQUIRED_CAPABILITIES.required_capabilities as any)).toBe(true);
  });

  it('routing sets persistent memory for sanctuary', () => {
    const decision = routeTurn({
      userText: 'I feel a heaviness that keeps coming back.',
      convo: [{ role: 'user', content: 'I feel a heaviness that keeps coming back.' }],
      tier: 'sanctuary',
    });
    expect(decision.routing.iba_policy.tier).toBe('sanctuary');
    expect(decision.routing.iba_policy.memory_use).toBe('persistent');
  });

  it('system prompt contains sanctuary contract + required entry response when state missing', () => {
    const decision = routeTurn({
      userText: 'I feel a heaviness that keeps coming back.',
      convo: [{ role: 'user', content: 'I feel a heaviness that keeps coming back.' }],
      tier: 'sanctuary',
    });

    const system = composeSystemPrompt(decision, { sanctuaryState: null });
    expect(system).toContain('SANCTUARY TIER');
    expect(system).toContain('SANCTUARY STATE MISSING:');
    expect(system).toContain(SANCTUARY_ENTRY_FIRST_RESPONSE_TEMPLATE.first_response);
  });

  it('sanctuary_state validator accepts canonical shape', () => {
    const ok = isValidSanctuaryState({
      sanctuary_state: {
        user_id: '00000000-0000-0000-0000-000000000000',
        active_themes: ['feeling unseen at work'],
        emotional_markers: [
          { marker: 'sadness', confidence: 'medium', timestamp: '2026-01-13T10:00:00.000Z' },
        ],
        adaptive_codes_inferred: [{ code_id: 12, confidence: 'low' }],
        last_session_summary: 'We stayed with the feeling of being overlooked without rushing to fix it.',
        continuity_anchor: 'feeling unseen at work',
      },
    });
    expect(ok).toBe(true);
  });
});
