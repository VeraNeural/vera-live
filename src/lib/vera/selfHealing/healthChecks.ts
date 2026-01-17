import { randomUUID } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { clerkClient } from '@clerk/nextjs/server';
import Anthropic from '@anthropic-ai/sdk';
import type { HealthCheck, HealthStatus, SystemStatus } from './types';
import { getRecentErrors } from './errorMonitor';

function nowIso(): string {
  return new Date().toISOString();
}

function mkCheck(name: string, status: HealthStatus, message: string): HealthCheck {
  return {
    id: randomUUID(),
    name,
    status,
    lastCheck: nowIso(),
    message,
  };
}

export async function checkDatabase(): Promise<HealthCheck> {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('users').select('id').limit(1);
    if (error) return mkCheck('Database', 'critical', `Supabase DB error: ${error.message}`);
    return mkCheck('Database', 'healthy', 'Supabase database reachable.');
  } catch (e) {
    return mkCheck('Database', 'critical', `Database check threw: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function checkStorage(): Promise<HealthCheck> {
  const bucket = (process.env.SUPABASE_MARKETING_BUCKET || '').trim() || 'vera-live';
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(bucket).list('marketing', { limit: 1 });
    if (error) return mkCheck('Storage', 'critical', `Storage error (${bucket}): ${error.message}`);
    return mkCheck('Storage', 'healthy', `Storage reachable (bucket: ${bucket}).`);
  } catch (e) {
    return mkCheck('Storage', 'critical', `Storage check threw: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function checkAuth(): Promise<HealthCheck> {
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim();
  if (!adminEmail) return mkCheck('Auth', 'warning', 'ADMIN_EMAIL not set (admin gating will fail).');

  try {
    const client = await clerkClient();
    const { data } = await client.users.getUserList({ limit: 1 });
    void data;
    return mkCheck('Auth', 'healthy', 'Clerk reachable.');
  } catch (e) {
    return mkCheck('Auth', 'critical', `Clerk check failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function checkAI(): Promise<HealthCheck> {
  const apiKey = (process.env.ANTHROPIC_API_KEY || '').trim();
  if (!apiKey) return mkCheck('AI (Claude)', 'warning', 'ANTHROPIC_API_KEY missing.');

  try {
    const client = new Anthropic({ apiKey });
    // Minimal ping (very low cost)
    await client.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 1,
      messages: [{ role: 'user', content: 'ping' }],
    });
    return mkCheck('AI (Claude)', 'healthy', 'Anthropic API reachable.');
  } catch (e) {
    return mkCheck('AI (Claude)', 'critical', `Anthropic check failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function checkHume(): Promise<HealthCheck> {
  const apiKey = (process.env.HUMEAI_API_KEY || process.env.HUME_API_KEY || '').trim();
  if (!apiKey) return mkCheck('Voice (Hume)', 'warning', 'HUMEAI_API_KEY / HUME_API_KEY missing.');

  try {
    // Use the same endpoint we use for TTS (best-effort). We'll request an empty-ish payload to avoid audio cost.
    const resp = await fetch('https://api.hume.ai/v0/tts/stream/file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hume-Api-Key': apiKey,
      },
      body: JSON.stringify({
        text: 'ping',
        voice: { provider: 'HUME_AI' },
      }),
    });

    if (resp.status === 429) {
      return mkCheck('Voice (Hume)', 'warning', 'Hume rate limited (429).');
    }

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      return mkCheck('Voice (Hume)', 'critical', `Hume TTS failed (${resp.status}): ${errText || resp.statusText}`);
    }

    return mkCheck('Voice (Hume)', 'healthy', 'Hume TTS reachable.');
  } catch (e) {
    return mkCheck('Voice (Hume)', 'critical', `Hume check threw: ${e instanceof Error ? e.message : String(e)}`);
  }
}

function overallFromChecks(checks: HealthCheck[]): SystemStatus['overall'] {
  const worst = checks.reduce<'healthy' | 'warning' | 'critical'>((acc, c) => {
    if (c.status === 'critical') return 'critical';
    if (c.status === 'warning' && acc !== 'critical') return 'warning';
    return acc;
  }, 'healthy');

  if (worst === 'healthy') return 'healthy';
  if (worst === 'warning') return 'degraded';
  return 'down';
}

async function persistHealthChecks(checks: HealthCheck[]): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    const rows = checks.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      message: c.message,
      checked_at: c.lastCheck,
    }));
    const { error } = await supabase.from('vera_health_checks').insert(rows);
    if (error) {
      // Don't fail health endpoint if the table isn't there yet.
      console.error('[selfHealing] Failed to insert vera_health_checks', error.message);
    }
  } catch (e) {
    console.error('[selfHealing] persistHealthChecks threw', e);
  }
}

export async function runAllChecks(): Promise<SystemStatus> {
  const checks = await Promise.all([checkDatabase(), checkAuth(), checkAI(), checkHume(), checkStorage()]);
  void persistHealthChecks(checks);

  let recentErrors: SystemStatus['recentErrors'] = [];
  try {
    recentErrors = await getRecentErrors(20);
  } catch {
    recentErrors = [];
  }

  return {
    overall: overallFromChecks(checks),
    checks,
    recentErrors,
  };
}
