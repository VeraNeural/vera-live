import { ACTIVITY_MODEL_CONTRACTS } from "../src/lib/ops/config/activityModelContracts";
import { ACTIVITY_PROMPT_FRAGMENTS } from "../src/lib/ops/config/activityPromptFragments";

export type HarnessResult = {
  ok: boolean;
  errors: string[];
};

export async function runHarnessTests(): Promise<HarnessResult> {
  const errors: string[] = [];

  const requiredActivities = ["decision-helper", "habit-builder", "character-builder"];
  for (const activityId of requiredActivities) {
    if (!ACTIVITY_MODEL_CONTRACTS[activityId]) {
      errors.push(`missing_contract:${activityId}`);
    }
    if (!ACTIVITY_PROMPT_FRAGMENTS[activityId]) {
      errors.push(`missing_prompt_fragment:${activityId}`);
    }
  }

  return { ok: errors.length === 0, errors };
}
