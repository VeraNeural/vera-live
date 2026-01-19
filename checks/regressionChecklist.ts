import { SYSTEM_PROMPT_SKELETON } from "../src/lib/ops/config/systemPromptSkeleton";

export type RegressionChecklistResult = {
  ok: boolean;
  errors: string[];
};

export async function runRegressionChecklist(): Promise<RegressionChecklistResult> {
  const errors: string[] = [];

  if (!SYSTEM_PROMPT_SKELETON || SYSTEM_PROMPT_SKELETON.length < 20) {
    errors.push("system_prompt_skeleton_missing");
  }

  return { ok: errors.length === 0, errors };
}
