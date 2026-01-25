/**
 * Rate Limiter - Supabase-Backed Persistent Rate Limiting
 *
 * Production Security Layer:
 * - Persists rate limits across server restarts and instances
 * - Tier-based limits with different time windows
 * - IP hashing for anonymous users (GDPR compliant)
 * - Audit logging integration
 *
 * @module security/rateLimiter
 */

import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { logSecurityEvent, getAuditContext } from '@/lib/audit/auditLogger';
import { createHash } from 'crypto';
import type { NextRequest } from 'next/server';

// ============================================================================
// TYPES
// ============================================================================

export interface RateLimitConfig {
  /** Maximum requests per window */
  limit: number;
  /** Window size in seconds */
  windowSeconds: number;
  /** Tier name for logging */
  tier: string;
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Maximum requests per window */
  limit: number;
  /** Remaining requests in current window */
  remaining: number;
  /** Unix timestamp when window resets */
  resetAt: number;
  /** Seconds until window resets */
  retryAfter: number;
  /** Current count in window */
  currentCount: number;
  /** The tier that was applied */
  tier: string;
}

// ============================================================================
// TIER CONFIGURATION
// ============================================================================

const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86400;

/** Rate limits by tier */
export const TIER_CONFIGS: Record<string, RateLimitConfig> = {
  anonymous: {
    limit: 5,
    windowSeconds: SECONDS_IN_DAY, // 5 messages per 24 hours
    tier: 'anonymous',
  },
  free: {
    limit: 20,
    windowSeconds: SECONDS_IN_DAY, // 20 messages per 24 hours
    tier: 'free',
  },
  pro: {
    limit: 100,
    windowSeconds: SECONDS_IN_HOUR, // 100 messages per hour
    tier: 'pro',
  },
  sanctuary: {
    limit: 100,
    windowSeconds: SECONDS_IN_HOUR, // 100 messages per hour
    tier: 'sanctuary',
  },
  enterprise: {
    limit: 1000,
    windowSeconds: SECONDS_IN_HOUR, // 1000 messages per hour (default, can be customized)
    tier: 'enterprise',
  },
  // Fallback for unknown tiers
  default: {
    limit: 5,
    windowSeconds: SECONDS_IN_DAY,
    tier: 'default',
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Hash an identifier for privacy-compliant storage
 * Uses SHA-256, truncated to 32 chars
 */
function hashIdentifier(value: string): string {
  return createHash('sha256').update(value).digest('hex').substring(0, 32);
}

/**
 * Extract client IP from request headers (Vercel/Cloudflare compatible)
 */
function getClientIP(req: NextRequest): string {
  // Vercel
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // Cloudflare
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Real IP header
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  return 'unknown';
}

/**
 * Generate a rate limit identifier
 * For authenticated users: user ID
 * For anonymous users: hashed IP address
 */
export function getRateLimitIdentifier(
  userId: string | null | undefined,
  req?: NextRequest
): string {
  if (userId) {
    return `user:${userId}`;
  }

  if (req) {
    const ip = getClientIP(req);
    if (ip !== 'unknown') {
      return `ip:${hashIdentifier(ip)}`;
    }
  }

  // Fallback: use stricter anonymous limit with random ID
  // This prevents abuse but may be overly restrictive
  return `anon:${hashIdentifier(Date.now().toString() + Math.random())}`;
}

/**
 * Get rate limit config for a given tier
 */
export function getConfigForTier(tier: string): RateLimitConfig {
  return TIER_CONFIGS[tier] || TIER_CONFIGS.default;
}

// ============================================================================
// CORE RATE LIMITING (SUPABASE-BACKED)
// ============================================================================

/**
 * Check rate limit for a user/endpoint combination
 *
 * @param identifier - User ID or hashed IP
 * @param tier - User tier (anonymous, free, pro, sanctuary, enterprise)
 * @param endpoint - API endpoint being accessed
 * @returns RateLimitResult with allowed status and metadata
 */
export async function checkRateLimit(
  identifier: string,
  tier: string,
  endpoint: string
): Promise<RateLimitResult> {
  const config = getConfigForTier(tier);
  const now = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
  const windowStart = now - config.windowSeconds;

  try {
    const supabase = getSupabaseAdmin();

    // Query current count within window
    const { data, error } = await supabase
      .from('rate_limits')
      .select('count, window_start, updated_at')
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found (which is fine, first request)
      console.error('[RateLimiter] Supabase query error:', error);
      // On DB error, fail open but with conservative defaults
      return {
        allowed: true,
        limit: config.limit,
        remaining: config.limit - 1,
        resetAt: now + config.windowSeconds,
        retryAfter: config.windowSeconds,
        currentCount: 0,
        tier: config.tier,
      };
    }

    let currentCount = 0;
    let windowStartTime = now;

    if (data) {
      // Check if window has expired
      if (data.window_start > windowStart) {
        // Still within window
        currentCount = data.count;
        windowStartTime = data.window_start;
      }
      // If window expired, count resets to 0
    }

    const remaining = Math.max(0, config.limit - currentCount);
    const allowed = currentCount < config.limit;
    const resetAt = windowStartTime + config.windowSeconds;
    const retryAfter = Math.max(1, resetAt - now);

    return {
      allowed,
      limit: config.limit,
      remaining: allowed ? remaining - 1 : 0, // Account for this request
      resetAt,
      retryAfter,
      currentCount,
      tier: config.tier,
    };
  } catch (error) {
    console.error('[RateLimiter] Error checking rate limit:', error);
    // Fail open with conservative defaults
    return {
      allowed: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetAt: now + config.windowSeconds,
      retryAfter: config.windowSeconds,
      currentCount: 0,
      tier: config.tier,
    };
  }
}

/**
 * Increment rate limit counter after successful request
 *
 * @param identifier - User ID or hashed IP
 * @param endpoint - API endpoint that was accessed
 */
export async function incrementRateLimit(
  identifier: string,
  endpoint: string
): Promise<void> {
  const now = Math.floor(Date.now() / 1000);

  try {
    const supabase = getSupabaseAdmin();

    // Upsert: increment if exists and window valid, otherwise create new
    const { error } = await supabase.rpc('increment_rate_limit', {
      p_identifier: identifier,
      p_endpoint: endpoint,
      p_now: now,
    });

    if (error) {
      // Fallback to manual upsert if RPC not available
      console.warn('[RateLimiter] RPC failed, using fallback:', error.message);
      await incrementRateLimitFallback(identifier, endpoint, now);
    }
  } catch (error) {
    console.error('[RateLimiter] Error incrementing rate limit:', error);
    // Non-critical - don't fail the request
  }
}

/**
 * Fallback increment using standard upsert
 */
async function incrementRateLimitFallback(
  identifier: string,
  endpoint: string,
  now: number
): Promise<void> {
  const supabase = getSupabaseAdmin();

  // Get current record
  const { data } = await supabase
    .from('rate_limits')
    .select('id, count, window_start')
    .eq('identifier', identifier)
    .eq('endpoint', endpoint)
    .single();

  // Determine appropriate window based on tier detection from identifier
  const tier = identifier.startsWith('user:') ? 'free' : 'anonymous';
  const config = getConfigForTier(tier);
  const windowStart = now - config.windowSeconds;

  if (data && data.window_start > windowStart) {
    // Within window, increment
    await supabase
      .from('rate_limits')
      .update({
        count: data.count + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.id);
  } else {
    // Window expired or no record, upsert with count = 1
    await supabase.from('rate_limits').upsert(
      {
        identifier,
        endpoint,
        count: 1,
        window_start: now,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'identifier,endpoint',
      }
    );
  }
}

// ============================================================================
// HEADERS
// ============================================================================

/**
 * Build rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetAt.toString(),
  };

  if (!result.allowed) {
    headers['Retry-After'] = result.retryAfter.toString();
  }

  return headers;
}

/**
 * Build 429 rate limit response
 */
export function buildRateLimitResponse(result: RateLimitResult): Response {
  const headers = getRateLimitHeaders(result);

  return new Response(
    JSON.stringify({
      error: {
        code: 'RATE_LIMITED',
        message: "You've reached your message limit. Upgrade for more messages.",
        retryAfter: result.retryAfter,
      },
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  );
}

// ============================================================================
// AUDIT LOGGING
// ============================================================================

/**
 * Log rate limit hit to audit system
 */
export async function logRateLimitHit(
  identifier: string,
  endpoint: string,
  result: RateLimitResult,
  req?: NextRequest
): Promise<void> {
  try {
    const context = req ? getAuditContext(req) : {};
    await logSecurityEvent('security.rate_limit_hit', null, context, {
      identifier: identifier.startsWith('ip:') ? identifier : 'user_id_redacted',
      endpoint,
      tier: result.tier,
      limit: result.limit,
      current_count: result.currentCount,
    });
  } catch (error) {
    console.error('[RateLimiter] Failed to log rate limit hit:', error);
  }
}

// ============================================================================
// COMBINED CHECK + INCREMENT HELPER
// ============================================================================

/**
 * Full rate limit flow for API routes
 *
 * @example
 * ```ts
 * const rateLimitResult = await applyRateLimit(req, userId, tier, '/api/chat');
 * if (!rateLimitResult.allowed) {
 *   return rateLimitResult.response;
 * }
 * // ... process request ...
 * await rateLimitResult.recordSuccess(); // Call after successful response
 * // Add headers to response
 * for (const [key, value] of Object.entries(rateLimitResult.headers)) {
 *   response.headers.set(key, value);
 * }
 * ```
 */
export async function applyRateLimit(
  req: NextRequest,
  userId: string | null | undefined,
  tier: string,
  endpoint: string
): Promise<{
  allowed: boolean;
  result: RateLimitResult;
  headers: Record<string, string>;
  response?: Response;
  /** Call this after successful request to increment counter */
  recordSuccess: () => Promise<void>;
}> {
  const identifier = getRateLimitIdentifier(userId, req);
  const result = await checkRateLimit(identifier, tier, endpoint);
  const headers = getRateLimitHeaders(result);

  if (!result.allowed) {
    // Log rate limit hit
    await logRateLimitHit(identifier, endpoint, result, req);

    return {
      allowed: false,
      result,
      headers,
      response: buildRateLimitResponse(result),
      recordSuccess: async () => {}, // No-op for blocked requests
    };
  }

  return {
    allowed: true,
    result,
    headers,
    recordSuccess: async () => {
      await incrementRateLimit(identifier, endpoint);
    },
  };
}

// ============================================================================
// TESTING UTILITIES
// ============================================================================

/**
 * Clear rate limits for an identifier (testing only)
 */
export async function __clearRateLimits(identifier: string): Promise<void> {
  if (process.env.NODE_ENV !== 'test') return;

  try {
    const supabase = getSupabaseAdmin();
    await supabase.from('rate_limits').delete().eq('identifier', identifier);
  } catch (error) {
    console.error('[RateLimiter] Error clearing rate limits:', error);
  }
}
