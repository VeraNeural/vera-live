import { randomUUID } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import type { AutoFix, ErrorLog } from './types';

function nowIso(): string {
  return new Date().toISOString();
}

function mkFix(input: AutoFix['fix'] & { errorType: string }): AutoFix {
  return {
    id: randomUUID(),
    errorType: input.errorType,
    fix: {
      kind: input.kind,
      title: input.title,
      details: input.details,
      sql: input.sql,
      bucketName: input.bucketName,
    },
    applied: false,
    appliedAt: undefined,
    success: false,
  };
}

function extractMissingRelation(message: string): string | null {
  const m = message.match(/relation\s+"([^"]+)"\s+does\s+not\s+exist/i);
  return m?.[1] ?? null;
}

function extractMissingBucket(message: string): string | null {
  // Common Supabase storage errors vary; keep it permissive.
  const m = message.match(/bucket(?:\s+|_)?(?:not\s+found|does\s+not\s+exist)[:\s]*([a-z0-9._-]+)/i);
  if (m?.[1]) return m[1];
  if (/bucket not found/i.test(message)) return 'vera-live';
  return null;
}

export function detectFixableError(error: ErrorLog): AutoFix | null {
  const message = (error.message || '').trim();

  const missingRelation = extractMissingRelation(message);
  if (missingRelation) {
    const sql = `-- Create missing table: ${missingRelation}\n-- Replace columns/constraints with your expected schema\ncreate table if not exists public.${missingRelation} (\n  id uuid primary key default gen_random_uuid(),\n  created_at timestamptz not null default now()\n);`;
    return mkFix({
      errorType: 'missing_table',
      kind: 'sql',
      title: `Missing table: ${missingRelation}`,
      details: 'Supabase/Postgres reported a missing relation. Apply the SQL below in the Supabase SQL editor (manual step).',
      sql,
    });
  }

  const missingBucket = extractMissingBucket(message);
  if (missingBucket) {
    return mkFix({
      errorType: 'missing_bucket',
      kind: 'create_bucket',
      title: `Missing Storage bucket: ${missingBucket}`,
      details: 'Attempt to create the missing Supabase Storage bucket automatically (admin only).',
      bucketName: missingBucket,
    });
  }

  if (/invalid api key|unauthorized|forbidden|401\b/i.test(message)) {
    return mkFix({
      errorType: 'invalid_api_key',
      kind: 'alert_admin',
      title: 'API key/auth invalid',
      details: 'An upstream provider rejected credentials. Verify env vars (ANTHROPIC_API_KEY / HUMEAI_API_KEY / CLERK_SECRET_KEY / SUPABASE_SERVICE_ROLE_KEY).',
    });
  }

  if (/rate limit|too many requests|429\b/i.test(message)) {
    return mkFix({
      errorType: 'rate_limit',
      kind: 'retry_strategy',
      title: 'Rate limit detected',
      details: 'Suggested strategy: exponential backoff + jitter (e.g., 1s, 2s, 4s, 8s) and circuit-break after repeated failures.',
    });
  }

  return null;
}

export async function applyFix(fix: AutoFix): Promise<boolean> {
  if (fix.fix.kind !== 'create_bucket') return false;

  const bucketName = (fix.fix.bucketName || '').trim();
  if (!bucketName) return false;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: false,
      fileSizeLimit: '10mb',
    });

    // If it already exists, treat as success.
    if (error && !/already exists/i.test(error.message)) {
      throw new Error(error.message);
    }

    fix.applied = true;
    fix.appliedAt = nowIso();
    fix.success = true;
    return true;
  } catch (e) {
    fix.applied = true;
    fix.appliedAt = nowIso();
    fix.success = false;
    console.error('[selfHealing] applyFix failed', e);
    return false;
  }
}
