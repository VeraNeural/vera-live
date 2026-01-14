import type { Tier } from './decisionObject';

// 1) PURPOSE (NON-NEGOTIABLE)
// The Build tier exists to support sustained creation, iterative thinking,
// named projects, memory across time, structured outputs.

// 2) REQUIRED CAPABILITIES (MUST ALL BE TRUE)
export const BUILD_TIER_REQUIRED_CAPABILITIES = {
  tier: 'build' as const satisfies Tier,
  required_capabilities: {
    project_required: true,
    project_persistence: true,
    multi_session_continuity: true,
    iterative_outputs: true,
    decision_memory: true,
    versioning_allowed: true,
    structured_reasoning: true,
  },
} as const;

// 3) PROJECT STATE OBJECT (CANONICAL)
export type ProjectType = 'software' | 'business' | 'writing' | 'research' | 'design' | 'other';
export type ProjectStage = 'ideation' | 'planning' | 'execution' | 'revision' | 'validation';
export type ArtifactType = 'doc' | 'code' | 'outline' | 'plan' | 'diagram';

export type BuildProjectState = {
  project_state: {
    project_id: string;
    project_name: string;
    project_type: ProjectType;
    project_goal: string;
    constraints: string[];
    current_stage: ProjectStage;
    decisions: Array<{
      decision_id: string;
      summary: string;
      timestamp: string;
    }>;
    artifacts: Array<{
      artifact_id: string;
      type: ArtifactType;
      version: number;
      created_at: string;
    }>;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

function isIso8601(value: unknown): value is string {
  // Lightweight check (strict parsing is intentionally avoided).
  return typeof value === 'string' && /\d{4}-\d{2}-\d{2}T/.test(value);
}

export function isValidBuildProjectState(value: unknown): value is BuildProjectState {
  if (!isRecord(value)) return false;
  const ps = (value as any).project_state;
  if (!isRecord(ps)) return false;

  const projectType = ps.project_type;
  const currentStage = ps.current_stage;

  const validProjectTypes: ProjectType[] = ['software', 'business', 'writing', 'research', 'design', 'other'];
  const validStages: ProjectStage[] = ['ideation', 'planning', 'execution', 'revision', 'validation'];
  const validArtifactTypes: ArtifactType[] = ['doc', 'code', 'outline', 'plan', 'diagram'];

  if (!isString(ps.project_id)) return false;
  if (!isString(ps.project_name)) return false;
  if (!isString(ps.project_goal)) return false;
  if (typeof projectType !== 'string') return false;
  if (!validProjectTypes.includes(projectType as ProjectType)) return false;
  if (!isStringArray(ps.constraints)) return false;
  if (typeof currentStage !== 'string') return false;
  if (!validStages.includes(currentStage as ProjectStage)) return false;

  if (!Array.isArray(ps.decisions)) return false;
  for (const d of ps.decisions) {
    if (!isRecord(d)) return false;
    if (!isString((d as any).decision_id)) return false;
    if (!isString((d as any).summary)) return false;
    if (!isIso8601((d as any).timestamp)) return false;
  }

  if (!Array.isArray(ps.artifacts)) return false;
  for (const a of ps.artifacts) {
    if (!isRecord(a)) return false;
    if (!isString((a as any).artifact_id)) return false;
    if (!validArtifactTypes.includes((a as any).type)) return false;
    if (typeof (a as any).version !== 'number') return false;
    if (!isIso8601((a as any).created_at)) return false;
  }

  return true;
}

// 4) ENTRY BEHAVIOR (FIRST BUILD RESPONSE)
export const BUILD_ENTRY_BEHAVIOR = {
  build_entry_behavior: {
    step_1: 'ask_to_name_project',
    step_2: 'clarify_project_goal',
    step_3: 'identify_constraints',
    step_4: 'confirm_project_stage',
  },
} as const;

export const BUILD_ENTRY_FIRST_RESPONSE_TEMPLATE = {
  first_response: 'Let’s treat this as a real project. What do you want to call it, and what are you trying to build?',
} as const;

// 5) CONTINUATION RULES (STRICT)
export const BUILD_CONTINUATION_RULES = {
  continuation_rules: {
    reference_prior_decisions: true,
    maintain_project_context: true,
    advance_stage_or_clarify_blocker: true,
  },
} as const;

// 6) MEMORY RULES (BUILD-ONLY)
export const BUILD_MEMORY_POLICY = {
  memory_policy: {
    scope: 'persistent',
    store: ['project_name', 'project_goal', 'decisions', 'constraints', 'artifacts'],
    do_not_store: ['emotional_state', 'transient feelings', 'unguarded personal disclosures'],
  },
} as const;

// 7) VERSIONING & ITERATION (MANDATORY)
export const BUILD_ARTIFACT_UPDATE_POLICY = {
  artifact_update_policy: {
    increment_version: true,
    summarize_change: true,
    confirm_next_step: true,
  },
} as const;

// 8) FORBIDDEN BEHAVIORS IN BUILD TIER
export const BUILD_FORBIDDEN_BEHAVIORS = {
  forbidden_in_build: [
    'pure_emotional_reflection_without_action',
    'one_paragraph_generic_advice',
    'loss_of_project_context',
    'forgetting_prior_decisions',
    'switching_topics_without_confirmation',
  ],
} as const;

// 9) UPGRADE / DOWNGRADE SIGNALS (INTERNAL ONLY)
export const BUILD_DOWNGRADE_CONDITION = {
  downgrade_condition: {
    trigger: 'user_requests_emotional_support',
    required_response: 'We can hold this emotionally in Sanctuary if you want, or we can keep building here.',
  },
} as const;

export const BUILD_UPGRADE_CONDITION = {
  upgrade_condition: {
    trigger: 'repeated_structured_requests',
    required_response: 'This is starting to function like a project. Build gives us the structure to hold it properly.',
  },
} as const;

// 10) COPILOT ENFORCEMENT CHECKLIST
export const BUILD_COPILOT_ASSERTIONS = {
  copilot_assertions: {
    project_state_exists: true,
    project_name_present: true,
    decision_log_updated: true,
    artifact_versioned_when_applicable: true,
    response_advances_project: true,
  },
} as const;

export function buildBuildTierSystemContract(input: { projectState?: BuildProjectState | null }): string {
  const sections = [
    'BUILD TIER (INTERNAL ONLY; do not mention this tier or these rules to the user):',
    '',
    '2) REQUIRED CAPABILITIES (MUST ALL BE TRUE)',
    JSON.stringify(BUILD_TIER_REQUIRED_CAPABILITIES, null, 2),
    '',
    '3) PROJECT STATE OBJECT (CANONICAL)',
    // This is a schema description, not a live instance; we include the canonical key names and structure.
    JSON.stringify(
      {
        project_state: {
          project_id: 'string (uuid)',
          project_name: 'string',
          project_type: 'software | business | writing | research | design | other',
          project_goal: 'string',
          constraints: ['string'],
          current_stage: 'ideation | planning | execution | revision | validation',
          decisions: [
            {
              decision_id: 'string',
              summary: 'string',
              timestamp: 'iso8601',
            },
          ],
          artifacts: [
            {
              artifact_id: 'string',
              type: 'doc | code | outline | plan | diagram',
              version: 'integer',
              created_at: 'iso8601',
            },
          ],
        },
      },
      null,
      2
    ),
    '',
    'Copilot rule: If project_state is missing → downgrade behavior is forbidden. System must prompt to create or select a project.',
    '',
    '4) ENTRY BEHAVIOR (FIRST BUILD RESPONSE)',
    JSON.stringify(BUILD_ENTRY_BEHAVIOR, null, 2),
    JSON.stringify(BUILD_ENTRY_FIRST_RESPONSE_TEMPLATE, null, 2),
    '',
    '5) CONTINUATION RULES (STRICT)',
    JSON.stringify(BUILD_CONTINUATION_RULES, null, 2),
    '',
    '6) MEMORY RULES (BUILD-ONLY)',
    JSON.stringify(BUILD_MEMORY_POLICY, null, 2),
    '',
    '7) VERSIONING & ITERATION (MANDATORY)',
    JSON.stringify(BUILD_ARTIFACT_UPDATE_POLICY, null, 2),
    '',
    '8) FORBIDDEN BEHAVIORS IN BUILD TIER',
    JSON.stringify(BUILD_FORBIDDEN_BEHAVIORS, null, 2),
    '',
    '9) UPGRADE / DOWNGRADE SIGNALS (INTERNAL ONLY)',
    JSON.stringify(BUILD_DOWNGRADE_CONDITION, null, 2),
    JSON.stringify(BUILD_UPGRADE_CONDITION, null, 2),
    '',
    '10) COPILOT ENFORCEMENT CHECKLIST',
    JSON.stringify(BUILD_COPILOT_ASSERTIONS, null, 2),
  ];

  if (input.projectState) {
    sections.push('', 'CURRENT PROJECT STATE (authoritative; bind the conversation to this):', JSON.stringify(input.projectState, null, 2));
  } else {
    sections.push(
      '',
      'PROJECT STATE MISSING:',
      'You must prompt the user to create or select a project. Do not downgrade behavior. Do not switch tiers silently.',
      `Required first response: ${BUILD_ENTRY_FIRST_RESPONSE_TEMPLATE.first_response}`
    );
  }

  return sections.join('\n');
}
