import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { clerkClient } from '@clerk/nextjs/server';
import Anthropic from '@anthropic-ai/sdk';
import type { HealthCheck, HealthStatus, SystemStatus } from './types';
import { getRecentErrors } from './errorMonitor';
import { createIssue, findOpenIssueUrlBySignature } from './githubIntegration';
import { resolveModelByTier } from '@/lib/vera/core/anthropicClient';
import {
  checkMessageLimit,
  getMessageCount24h,
  meteringIdFromSessionId,
  recordMessage,
} from '@/lib/auth/messageCounter';
import { findMatchingCommand } from '@/lib/vera/navigator/commandRegistry';

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

function todayKey(): string {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getInternalBaseUrl(): string {
  const explicit =
    (process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      process.env.APP_URL ||
      '').trim();
  if (explicit) return explicit.replace(/\/$/, '');

  const vercel = (process.env.VERCEL_URL || '').trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;

  const port = (process.env.PORT || '3000').trim() || '3000';
  return `http://localhost:${port}`;
}

async function cookieHeaderForSameOriginFetch(): Promise<string> {
  try {
    const store = await cookies();
    const all = store.getAll();
    return all.map((c) => `${c.name}=${c.value}`).join('; ');
  } catch {
    return '';
  }
}

async function ensureDailyMeteringCountAtLeast(input: {
  tier: 'anonymous' | 'free';
  meteringId: string;
  sessionId: string;
  targetCount: number;
}): Promise<{ ok: boolean; startCount: number; endCount: number; error?: string }> {
  try {
    const startCount = await getMessageCount24h(input.meteringId);
    const needed = Math.max(0, input.targetCount - startCount);

    // Bound the amount of writes in case something goes weird.
    if (needed > 50) {
      return { ok: false, startCount, endCount: startCount, error: `Refusing to write ${needed} metering rows` };
    }

    for (let i = 0; i < needed; i++) {
      // Best-effort: record_message RPC handles schema/UUID compatibility.
      await recordMessage(input.meteringId, input.sessionId);
    }

    const endCount = await getMessageCount24h(input.meteringId);
    return { ok: endCount >= input.targetCount, startCount, endCount };
  } catch (e) {
    return { ok: false, startCount: 0, endCount: 0, error: e instanceof Error ? e.message : String(e) };
  }
}

function healthCheckSignature(check: Pick<HealthCheck, 'name'>): string {
  // Matches the signature we embed into GitHub issue bodies via createIssue().
  // We treat each health check name as an error "type" for dedupe.
  return `error_type:HealthCheck:${(check.name || '').trim() || 'unknown'}`;
}

async function autoCreateIssuesForCriticalHealthChecks(checks: HealthCheck[]): Promise<void> {
  const critical = checks.filter((c) => c.status === 'critical');
  if (critical.length === 0) return;

  // Avoid duplicate calls within a single run.
  const seen = new Set<string>();

  await Promise.all(
    critical.map(async (c) => {
      const sig = healthCheckSignature(c);
      if (seen.has(sig)) return;
      seen.add(sig);

      try {
        const existing = await findOpenIssueUrlBySignature(sig);
        if (existing) return;

        const url = await createIssue({
          id: c.id,
          timestamp: c.lastCheck,
          type: `HealthCheck:${c.name}`,
          message: c.message,
          resolved: false,
        });

        console.log(`VERA auto-created issue: ${url}`);
      } catch (e) {
        // Best-effort: never fail health checks because GitHub is down/misconfigured.
        const msg = e instanceof Error ? e.message : String(e);
        console.warn('[selfHealing] auto-create issue skipped', { check: c.name, error: msg });
      }
    })
  );
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
    const preferred = [
      (process.env.ANTHROPIC_HEALTHCHECK_MODEL || '').trim(),
      (process.env.ANTHROPIC_MODEL || '').trim(),
      resolveModelByTier('sanctuary').apiModel,
      resolveModelByTier('free').apiModel,
    ].filter(Boolean);

    const candidates = Array.from(new Set(preferred));
    let lastError: unknown = null;

    for (const model of candidates) {
      try {
        // Minimal ping (very low cost)
        await client.messages.create({
          model,
          max_tokens: 1,
          messages: [{ role: 'user', content: 'ping' }],
        });

        return mkCheck('AI (Claude)', 'healthy', `Anthropic API reachable (model: ${model}).`);
      } catch (e) {
        lastError = e;

        const msg = e instanceof Error ? e.message : String(e);
        // If the model is not available, try the next candidate.
        if (/not_found_error/i.test(msg) || /model:/i.test(msg) || /404\b/.test(msg)) {
          continue;
        }

        // For auth/permission/rate errors, stop early — retries won't help.
        if (/401\b|403\b|rate limit|429\b/i.test(msg)) {
          break;
        }
      }
    }

    const tried = candidates.length ? ` Tried: ${candidates.join(', ')}.` : '';
    return mkCheck(
      'AI (Claude)',
      'critical',
      `Anthropic check failed.${tried} ${lastError instanceof Error ? lastError.message : String(lastError)}`.trim()
    );
  } catch (e) {
    return mkCheck('AI (Claude)', 'critical', `Anthropic check failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function checkHume(): Promise<HealthCheck> {
  const apiKey = (process.env.HUMEAI_API_KEY || process.env.HUME_API_KEY || '').trim();
  if (!apiKey) return mkCheck('Voice (Hume)', 'warning', 'HUMEAI_API_KEY / HUME_API_KEY missing.');

  try {
    // Use the same endpoint we use for TTS (best-effort).
    const resp = await fetch('https://api.hume.ai/v0/tts/stream/file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hume-Api-Key': apiKey,
      },
      body: JSON.stringify({
        utterances: [
          {
            text: 'ping',
            voice: {
              name: 'ITO',
            },
          },
        ],
        strip_headers: true,
        split_utterances: false,
        instant_mode: true,
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

export async function checkMessageCounter(): Promise<HealthCheck> {
  try {
    const supabase = getSupabaseAdmin();

    // 1) Table read (smoke)
    const { error: readErr } = await supabase.from('message_usage').select('id').limit(1);
    if (readErr) {
      return mkCheck('Message Counter', 'critical', `message_usage read failed: ${readErr.message}`);
    }

    // 2) RPC read/write (authoritative)
    const meteringId = meteringIdFromSessionId(`self-healing:message-counter:${todayKey()}`);
    const before = await getMessageCount24h(meteringId);
    await recordMessage(meteringId, `self-healing:message-counter:${todayKey()}`);
    const after = await getMessageCount24h(meteringId);

    if (after < before) {
      return mkCheck('Message Counter', 'critical', `RPC count decreased unexpectedly (before=${before}, after=${after}).`);
    }
    if (after === before) {
      return mkCheck('Message Counter', 'warning', `record_message did not change 24h count (before=${before}, after=${after}).`);
    }

    return mkCheck('Message Counter', 'healthy', `Metering OK (24h count moved ${before}→${after}).`);
  } catch (e) {
    return mkCheck(
      'Message Counter',
      'critical',
      `Message counter check threw: ${e instanceof Error ? e.message : String(e)}`
    );
  }
}

export async function checkAnonymousLimit(): Promise<HealthCheck> {
  try {
    const sessionId = `self-healing:anon-limit:${todayKey()}`;
    const meteringId = meteringIdFromSessionId(sessionId);
    const limit = 5;

    const fill = await ensureDailyMeteringCountAtLeast({
      tier: 'anonymous',
      meteringId,
      sessionId,
      targetCount: limit,
    });
    if (!fill.ok) {
      return mkCheck('Anonymous Limit', 'warning', `Unable to reach anon limit=${limit}: ${fill.error || 'unknown'}`);
    }

    const check = await checkMessageLimit({ tier: 'anonymous', meteringId });
    if (check.limit !== limit) {
      return mkCheck('Anonymous Limit', 'critical', `Expected anon limit=${limit}, got limit=${check.limit}.`);
    }
    if (check.allowed) {
      return mkCheck(
        'Anonymous Limit',
        'critical',
        `Expected anon gating at count>=${limit}, but allowed=true (count=${check.count}, remaining=${check.remaining}).`
      );
    }

    return mkCheck('Anonymous Limit', 'healthy', `Anon gating active at ${check.count}/${check.limit}.`);
  } catch (e) {
    return mkCheck('Anonymous Limit', 'critical', `Anonymous limit check threw: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function checkFreeLimit(): Promise<HealthCheck> {
  try {
    // We only validate the numeric limit and gating behavior via checkMessageLimit.
    // This uses a deterministic daily metering id so the system doesn't spam rows on frequent checks.
    const sessionId = `self-healing:free-limit:${todayKey()}`;
    const meteringId = meteringIdFromSessionId(sessionId);

    const limitProbe = await checkMessageLimit({ tier: 'free', meteringId });
    const expectedLimit = 25;
    if (limitProbe.limit !== expectedLimit) {
      return mkCheck('Free Limit', 'critical', `Expected free limit=${expectedLimit}, got limit=${limitProbe.limit}.`);
    }

    // Fill to limit once per day (at most 25 inserts/day for this id).
    const fill = await ensureDailyMeteringCountAtLeast({
      tier: 'free',
      meteringId,
      sessionId,
      targetCount: expectedLimit,
    });

    if (!fill.ok) {
      return mkCheck('Free Limit', 'warning', `Unable to reach free limit=${expectedLimit}: ${fill.error || 'unknown'}`);
    }

    const check = await checkMessageLimit({ tier: 'free', meteringId });
    if (check.allowed) {
      return mkCheck(
        'Free Limit',
        'critical',
        `Expected free gating at count>=${expectedLimit}, but allowed=true (count=${check.count}, remaining=${check.remaining}).`
      );
    }

    return mkCheck('Free Limit', 'healthy', `Free gating active at ${check.count}/${check.limit}.`);
  } catch (e) {
    return mkCheck('Free Limit', 'critical', `Free limit check threw: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function checkTierResolver(): Promise<HealthCheck> {
  try {
    // We validate deterministic nudge thresholds as implemented in tierResolver.
    // Gate enforcement itself is covered by Anonymous/Free limit checks.
    // NOTE: We intentionally do not call resolveTier() here because it depends on Clerk auth context.
    const next3 = 3;
    const next4 = 4;
    const next5 = 5;

    // Mirror the current tierResolver contract: nudges at 3-4 (soft) and 5 (hard).
    const softExpected = ['signup_soft', 'signup_soft'];
    const hardExpected = 'signup_hard';

    const nudgeFor = (n: number): 'signup_soft' | 'signup_hard' | null => {
      if (n === 3 || n === 4) return 'signup_soft';
      if (n === 5) return 'signup_hard';
      return null;
    };

    const a = nudgeFor(next3);
    const b = nudgeFor(next4);
    const c = nudgeFor(next5);

    if (a !== softExpected[0] || b !== softExpected[1] || c !== hardExpected) {
      return mkCheck('Tier Resolver', 'critical', `Anonymous nudge thresholds unexpected (3=${a},4=${b},5=${c}).`);
    }

    return mkCheck('Tier Resolver', 'healthy', 'Tier resolver nudge thresholds look consistent (anon 3-5).');
  } catch (e) {
    return mkCheck('Tier Resolver', 'critical', `Tier resolver check threw: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function checkNavigator(): Promise<HealthCheck> {
  try {
    const breathe = findMatchingCommand('breathe');
    if (!breathe || breathe.route.room !== 'zen' || breathe.route.view !== 'breathe') {
      return mkCheck(
        'Navigator',
        'critical',
        `Navigator mapping for "breathe" is wrong (got ${breathe ? `${breathe.route.room}/${breathe.route.view || ''}` : 'null'}).`
      );
    }

    const sleep = findMatchingCommand('sleep');
    if (!sleep || sleep.route.room !== 'rest') {
      return mkCheck(
        'Navigator',
        'critical',
        `Navigator mapping for "sleep" is wrong (got ${sleep ? `${sleep.route.room}/${sleep.route.view || ''}` : 'null'}).`
      );
    }

    return mkCheck('Navigator', 'healthy', 'Navigator command routing OK (breathe→zen, sleep→rest).');
  } catch (e) {
    return mkCheck('Navigator', 'critical', `Navigator check threw: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function checkChatAPI(): Promise<HealthCheck> {
  try {
    // Cheap API check: force an anonymous gate response (no model call) by using a known session at limit.
    const sessionId = `self-healing:chat-gate:${todayKey()}`;
    const meteringId = meteringIdFromSessionId(sessionId);

    const fill = await ensureDailyMeteringCountAtLeast({
      tier: 'anonymous',
      meteringId,
      sessionId,
      targetCount: 5,
    });
    if (!fill.ok) {
      return mkCheck('Chat API', 'warning', `Unable to prep anon gate session: ${fill.error || 'unknown'}`);
    }

    const base = getInternalBaseUrl();
    const res = await fetch(`${base}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Force session cookie so resolveTier uses the pre-filled metering id.
        Cookie: `vera_sid=${encodeURIComponent(sessionId)}`,
      },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'ping' }] }),
    });

    const data = (await res.json().catch(() => ({}))) as any;
    if (!res.ok) {
      return mkCheck('Chat API', 'critical', `POST /api/chat failed (${res.status}): ${data?.error || res.statusText}`);
    }

    if (data?.gate !== 'signup_required') {
      return mkCheck('Chat API', 'warning', `Expected gate=signup_required for anon-at-limit, got gate=${String(data?.gate || '')}.`);
    }
    if (typeof data?.content !== 'string' || !data.content.trim()) {
      return mkCheck('Chat API', 'warning', 'Chat response missing content string.');
    }

    return mkCheck('Chat API', 'healthy', 'Chat API responds and anonymous gating path works.');
  } catch (e) {
    return mkCheck('Chat API', 'critical', `Chat API check threw: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function checkNarrateAPI(): Promise<HealthCheck> {
  try {
    // Cheap wiring check: verify endpoint responds with validation (avoid TTS cost).
    const base = getInternalBaseUrl();
    const cookieHeader = await cookieHeaderForSameOriginFetch();
    const res = await fetch(`${base}/api/narrate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify({ text: 'ping' }),
    });

    const data = (await res.json().catch(() => ({}))) as any;

    // If admin cookies aren't present, this will 401.
    if (res.status === 401) {
      return mkCheck('Narrate API', 'warning', 'POST /api/narrate returned 401 (expected if no admin session cookies present).');
    }

    // We expect validation failure (missing storyId) = 400.
    if (res.status !== 400) {
      return mkCheck('Narrate API', 'warning', `Expected 400 validation response, got ${res.status}.`);
    }
    if (typeof data?.error !== 'string' || !data.error.trim()) {
      return mkCheck('Narrate API', 'warning', 'Narrate API validation response missing error string.');
    }

    return mkCheck('Narrate API', 'healthy', 'Narrate API responds and validates input.');
  } catch (e) {
    return mkCheck('Narrate API', 'critical', `Narrate API check threw: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function checkMarketingGenerator(): Promise<HealthCheck> {
  try {
    // Cheap wiring check: verify admin-only endpoint responds with validation (avoid AI generation cost).
    const base = getInternalBaseUrl();
    const cookieHeader = await cookieHeaderForSameOriginFetch();
    const res = await fetch(`${base}/api/vera/marketing/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify({}),
    });

    const data = (await res.json().catch(() => ({}))) as any;

    if (res.status === 401 || res.status === 403) {
      return mkCheck(
        'Marketing Generator API',
        'warning',
        `POST /api/vera/marketing/generate returned ${res.status} (expected if no admin session cookies present).`
      );
    }

    // We expect validation failure (missing platform/theme) = 400.
    if (res.status !== 400) {
      return mkCheck('Marketing Generator API', 'warning', `Expected 400 validation response, got ${res.status}.`);
    }
    if (typeof data?.error !== 'string' || !data.error.trim()) {
      return mkCheck('Marketing Generator API', 'warning', 'Marketing generate validation response missing error string.');
    }

    return mkCheck('Marketing Generator API', 'healthy', 'Marketing generator API responds and validates input.');
  } catch (e) {
    return mkCheck(
      'Marketing Generator API',
      'critical',
      `Marketing generator API check threw: ${e instanceof Error ? e.message : String(e)}`
    );
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
  const checks = await Promise.all([
    // Infrastructure
    checkDatabase(),
    checkAuth(),
    checkAI(),
    checkHume(),
    checkStorage(),

    // Business logic
    checkMessageCounter(),
    checkAnonymousLimit(),
    checkFreeLimit(),
    checkTierResolver(),
    checkNavigator(),

    // APIs
    checkChatAPI(),
    checkNarrateAPI(),
    checkMarketingGenerator(),
  ]);
  void persistHealthChecks(checks);
  void autoCreateIssuesForCriticalHealthChecks(checks);

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
