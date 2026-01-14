import modelRoutingSpec from '../../../specs/model_routing_policy.json';

export type RuntimeTier = 'free' | 'sanctuary' | 'build';

export type RuntimeLog = {
  runtime_log: {
    tier: RuntimeTier;
    model_used: string;
    tokens_used: number;
    response_tags: string[];
    state_snapshot: Record<string, unknown>;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

function hasAtLeastTwo(source: string[], allowed: string[]): boolean {
  const set = new Set(source);
  let count = 0;
  for (const a of allowed) {
    if (set.has(a)) count += 1;
    if (count >= 2) return true;
  }
  return false;
}

export function validateRuntimeLog(input: unknown): { ok: true } | { ok: false; errors: string[] } {
  const errors: string[] = [];

  if (!isRecord(input) || !isRecord((input as any).runtime_log)) {
    return { ok: false, errors: ['runtime_log_missing_or_invalid'] };
  }

  const log = (input as any).runtime_log as any;

  const tier = log.tier as RuntimeTier;
  if (tier !== 'free' && tier !== 'sanctuary' && tier !== 'build') {
    errors.push('tier_invalid');
  }

  if (typeof log.model_used !== 'string' || !log.model_used) {
    errors.push('model_used_invalid');
  }

  if (typeof log.tokens_used !== 'number' || Number.isNaN(log.tokens_used) || log.tokens_used < 0) {
    errors.push('tokens_used_invalid');
  }

  if (!isStringArray(log.response_tags)) {
    errors.push('response_tags_invalid');
  }

  if (!isRecord(log.state_snapshot)) {
    errors.push('state_snapshot_invalid');
  }

  if (errors.length) return { ok: false, errors };

  const routing = (modelRoutingSpec as any)?.model_routing?.[tier];
  const preferredModels: string[] = Array.isArray(routing?.preferred_models) ? routing.preferred_models : [];
  const maxTokens: number = typeof routing?.max_tokens === 'number' ? routing.max_tokens : 0;

  if (!preferredModels.includes(log.model_used)) {
    errors.push('model_not_allowed_for_tier');
  }

  if (log.tokens_used > maxTokens) {
    errors.push('tokens_exceed_max_tokens');
  }

  if (tier === 'sanctuary') {
    const allowed = ['reflection', 'question', 'pacing', 'theme_tracking'];
    if (!hasAtLeastTwo(log.response_tags, allowed)) {
      errors.push('sanctuary_tags_missing_minimum');
    }
  }

  if (tier === 'build') {
    const snapshot = log.state_snapshot as Record<string, unknown>;
    if (snapshot.project_state == null) {
      errors.push('build_missing_project_state');
    }
    if (!log.response_tags.includes('action')) {
      errors.push('build_missing_action_tag');
    }
  }

  if (tier === 'free') {
    if (log.response_tags.includes('project_management')) {
      errors.push('free_forbidden_project_management_tag');
    }
  }

  return errors.length ? { ok: false, errors } : { ok: true };
}
