import { describe, expect, it } from 'vitest';
import { SYSTEM_PROMPT_SKELETON } from '../src/lib/ops/config/systemPromptSkeleton';
import { ACTIVITY_PROMPT_FRAGMENTS } from '../src/lib/ops/config/activityPromptFragments';
import { ACTIVITY_MODEL_CONTRACTS } from '../src/lib/ops/config/activityModelContracts';
import { ACTIVITY_THINKING_MATRIX } from '../src/lib/ops/config/activityThinkingMatrix';
import { ACTIVITY_DEFAULT_THINKING_MODE } from '../src/lib/ops/config/activityDefaultThinkingMode';
import { ACTIVITY_THINKING_OVERRIDES } from '../src/lib/ops/config/activityThinkingOverrides';
import { ACTIVITY_THINKING_SURFACING } from '../src/lib/ops/config/activityThinkingSurfacing';
import { validateOutput } from '../src/lib/ops/validation/outputValidation';
import { safetyLayer } from '../src/lib/ops/safety/safetyLayer';

const FIXTURES = {
  activityId: 'decision-helper',
  userInput: 'I am deciding between two offers with different tradeoffs.',
  thinkingMode: { id: 'pros-cons', label: 'Pros & Cons' },
  modelOutput:
    'Option A: Pros include stability and known team. Cons include lower growth.\nOption B: Pros include higher growth and scope. Cons include higher risk.\nTradeoffs are clear based on stability vs growth.',
};

const EXPECTED_ORDER = [
  'input-gate',
  'load-contract',
  'resolve-thinking-mode',
  'apply-focus',
  'assemble-prompt',
  'single-model-call',
  'output-validation',
  'safety-layer',
  'deliver-output',
];

type ThinkingMode = { id: string; label: string; persona?: string } | undefined;

type HarnessResult = {
  output: string;
  order: string[];
};

function isModeAllowed(activityId: string, modeId: string): boolean {
  const allowed = ACTIVITY_THINKING_MATRIX[activityId]?.allowedThinkingModes || [];
  return allowed.includes(modeId);
}

function resolveThinkingMode(activityId: string, thinkingMode?: ThinkingMode): string | null {
  const surfacing = ACTIVITY_THINKING_SURFACING[activityId]?.surfacing || 'hidden';
  const overrides = ACTIVITY_THINKING_OVERRIDES[activityId] || { allowOverride: false };
  const defaultMode = ACTIVITY_DEFAULT_THINKING_MODE[activityId];

  if (!defaultMode) return null;

  if (surfacing === 'explicit' && overrides.allowOverride && thinkingMode?.id) {
    const allowedOverrides = overrides.allowedOverrides || [];
    if (allowedOverrides.includes(thinkingMode.id) && isModeAllowed(activityId, thinkingMode.id)) {
      return thinkingMode.id;
    }
  }

  if (surfacing === 'implicit' && overrides.allowOverride) {
    // No implicit override source available in this harness.
  }

  if (defaultMode !== 'default' && isModeAllowed(activityId, defaultMode)) {
    return defaultMode;
  }

  return defaultMode === 'default' ? null : null;
}

function assemblePrompt(
  activityId: string,
  modeId: string | null,
  userInput: string
): string {
  const fragment = ACTIVITY_PROMPT_FRAGMENTS[activityId];
  const modeBlock = modeId
    ? `\n\n[THINKING_MODE_ACTIVE]\nid: ${modeId}\n[/THINKING_MODE_ACTIVE]`
    : '';
  return [SYSTEM_PROMPT_SKELETON, fragment, modeBlock, userInput].filter(Boolean).join('\n');
}

function executeRw01Harness(
  activityId: string,
  userInput: string,
  thinkingMode: ThinkingMode,
  modelCall: (prompt: string, input: string) => string
): HarnessResult {
  const order: string[] = [];

  order.push('input-gate');
  if (!userInput.trim()) throw new Error('Missing input');

  order.push('load-contract');
  if (!ACTIVITY_MODEL_CONTRACTS[activityId]) throw new Error('Missing contract');

  order.push('resolve-thinking-mode');
  const resolvedMode = resolveThinkingMode(activityId, thinkingMode);

  order.push('apply-focus');

  order.push('assemble-prompt');
  const prompt = assemblePrompt(activityId, resolvedMode, userInput);

  order.push('single-model-call');
  const output = modelCall(prompt, userInput);

  order.push('output-validation');
  const validation = validateOutput(activityId, output);
  if (!validation.valid) throw new Error('Output validation failed');

  order.push('safety-layer');
  const safety = safetyLayer(userInput, output);
  if (safety.outcome !== 'allow') throw new Error('Safety layer blocked');

  order.push('deliver-output');
  return { output, order };
}

describe('RW-01 minimal harness', () => {
  it('executes in order and preserves output', () => {
    const result = executeRw01Harness(
      FIXTURES.activityId,
      FIXTURES.userInput,
      FIXTURES.thinkingMode,
      () => FIXTURES.modelOutput
    );

    expect(result.order).toEqual(EXPECTED_ORDER);
    expect(result.output).toBe(FIXTURES.modelOutput);
  });
});
