/**
 * Rate Limiter - Sliding Window Algorithm with Tier-Based Limits
 *
 * Production Security Layer:
 * - Protects API from abuse and cost overruns
 * - Sliding window for smooth rate limiting
 * - Tier-based limits (anonymous < free < pro < sanctuary)
 * - Audit logging integration
 *
 * ARCHITECTURE DECISION:
 * - In-memory Map for single-instance deployment (current)
 * - Ready for Upstash Redis upgrade for multi-instance production
 *
 * @module rateLimiter
 */

import { logSecurityEvent, getAuditContext } from '@/lib/audit/auditLogger';
import type { NextRequest } from 'next/server';

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface RateLimitConfig {
  /** Maximum requests per window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
  /** Optional identifier for this limiter (for logging) */
  name?: string;
}

/** Rate limits by tier (requests per minute) */
export const TIER_LIMITS: Record<string, RateLimitConfig> = {
  anonymous: {
    limit: 10,
    windowMs: 60 * 1000, // 10 requests per minute
    name: 'anonymous',
  },
  free: {
    limit: 30,
    windowMs: 60 * 1000, // 30 requests per minute
    name: 'free',
  },
  pro: {
    limit: 60,
    windowMs: 60 * 1000, // 60 requests per minute
    name: 'pro',
  },
  sanctuary: {
    limit: 120,
    windowMs: 60 * 1000, // 120 requests per minute (2x pro for emotional sessions)
    name: 'sanctuary',
  },
  // Fallback for unknown tiers
  default: {
    limit: 10,
    windowMs: 60 * 1000,
    name: 'default',
  },
};

// ============================================================================
// TYPES
// ============================================================================

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
}

interface SlidingWindowEntry {
  /** Timestamps of requests in current window */
  timestamps: number[];
  /** When this entry was last accessed */
  lastAccess: number;
}

// ============================================================================
// STORAGE
// ============================================================================

/**
 * In-memory storage for rate limiting
 * Key format: `${identifier}:${endpoint}`
 *
 * NOTE: For multi-instance production, replace with Upstash Redis:
 * - @upstash/ratelimit for atomic operations
 * - @upstash/redis for the storage backend
 */
const store = new Map<string, SlidingWindowEntry>();

// Cleanup old entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanupTimer(): void {
  if (cleanupTimer) return;

  cleanupTimer = setInterval(() => {
    const now = Date.now();
    const maxAge = 10 * 60 * 1000; // 10 minutes

    for (const [key, entry] of store.entries()) {
      if (now - entry.lastAccess > maxAge) {
        store.delete(key);
      }
    }
  }, CLEANUP_INTERVAL_MS);

  // Prevent timer from keeping process alive in tests
  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }
}

// Start cleanup timer on module load
if (typeof window === 'undefined') {
  startCleanupTimer();
}

// ============================================================================
// CORE RATE LIMITER
// ============================================================================

/**
 * Check rate limit using sliding window algorithm
 *
 * @param identifier - User ID, session ID, or IP hash
 * @param config - Rate limit configuration
 * @param endpoint - API endpoint being accessed (for logging/key generation)
 * @returns RateLimitResult with allowed status and metadata
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
  endpoint: string = 'default'
): RateLimitResult {
  const key = `${identifier}:${endpoint}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Get or create entry
  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [], lastAccess: now };
  }

  // Sliding window: filter out timestamps outside current window
  entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);
  entry.lastAccess = now;

  // Calculate remaining capacity
  const currentCount = entry.timestamps.length;
  const remaining = Math.max(0, config.limit - currentCount);
  const allowed = currentCount < config.limit;

  // Calculate reset time (end of current window)
  const oldestTimestamp = entry.timestamps[0] || now;
  const resetAt = oldestTimestamp + config.windowMs;
  const retryAfter = Math.ceil((resetAt - now) / 1000);

  // If allowed, record this request
  if (allowed) {
    entry.timestamps.push(now);
    store.set(key, entry);
  } else {
    // Update entry even on rejection to track access time
    store.set(key, entry);
  }

  return {
    allowed,
    limit: config.limit,
    remaining: allowed ? remaining - 1 : 0,
    resetAt: Math.ceil(resetAt / 1000),
    retryAfter: Math.max(1, retryAfter),
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get rate limit config for a given tier
 */
export function getConfigForTier(tier: string): RateLimitConfig {
  return TIER_LIMITS[tier] || TIER_LIMITS.default;
}

/**
 * Generate a rate limit identifier from request
 * Priority: userId > sessionId > IP hash
 */
export function getIdentifier(
  userId?: string | null,
  sessionId?: string | null,
  req?: NextRequest
): string {
  if (userId) return `user:${userId}`;
  if (sessionId) return `session:${sessionId}`;

  // Fall back to IP hash
  if (req) {
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
    // Simple hash for privacy
    return `ip:${hashString(ip)}`;
  }

  return 'anonymous:unknown';
}

/**
 * Simple string hash for IP anonymization
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Build rate limit headers for response
 */
export function buildRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetAt.toString(),
    'X-RateLimit-Reset-After': result.retryAfter.toString(),
  };
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
  tier: string,
  req?: NextRequest
): Promise<void> {
  try {
    const context = req ? getAuditContext(req) : {};
    await logSecurityEvent('security.rate_limit_hit', null, context, {
      identifier: identifier.startsWith('ip:') ? identifier : 'user_id_redacted',
      endpoint,
      tier,
    });
  } catch (error) {
    // Non-blocking - don't fail request if audit logging fails
    console.error('[RateLimiter] Failed to log rate limit hit:', error);
  }
}

// ============================================================================
// MIDDLEWARE HELPER
// ============================================================================

/**
 * Full rate limit check with logging for API routes
 *
 * @example
 * ```ts
 * const rateLimitResult = await applyRateLimit(req, userId, sessionId, tier, '/api/chat');
 * if (!rateLimitResult.allowed) {
 *   return rateLimitResult.response;
 * }
 * // Add headers to eventual response
 * const headers = rateLimitResult.headers;
 * ```
 */
export async function applyRateLimit(
  req: NextRequest,
  userId: string | null | undefined,
  sessionId: string | null | undefined,
  tier: string,
  endpoint: string
): Promise<{
  allowed: boolean;
  result: RateLimitResult;
  headers: Record<string, string>;
  response?: Response;
}> {
  const identifier = getIdentifier(userId, sessionId, req);
  const config = getConfigForTier(tier);
  const result = checkRateLimit(identifier, config, endpoint);
  const headers = buildRateLimitHeaders(result);

  if (!result.allowed) {
    // Log rate limit hit
    await logRateLimitHit(identifier, endpoint, tier, req);

    // Build 429 response
    const response = new Response(
      JSON.stringify({
        error: 'Rate limit exceeded',
        code: 'RATE_LIMITED',
        message: `Rate limit exceeded. Please retry after ${result.retryAfter} seconds.`,
        retryAfter: result.retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': result.retryAfter.toString(),
          ...headers,
        },
      }
    );

    return { allowed: false, result, headers, response };
  }

  return { allowed: true, result, headers };
}

// ============================================================================
// TESTING UTILITIES
// ============================================================================

/**
 * Reset rate limit store (for testing only)
 */
export function __resetStore(): void {
  if (process.env.NODE_ENV === 'test') {
    store.clear();
  }
}

/**
 * Get current store size (for testing only)
 */
export function __getStoreSize(): number {
  if (process.env.NODE_ENV === 'test') {
    return store.size;
  }
  return -1;
}

/**
 * Stop cleanup timer (for testing only)
 */
export function __stopCleanupTimer(): void {
  if (process.env.NODE_ENV === 'test' && cleanupTimer) {
    clearInterval(cleanupTimer);
    cleanupTimer = null;
  }
}
