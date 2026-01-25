/**
 * Rate Limiter Tests
 *
 * Tests for:
 * 1. In-memory sliding window rate limiting (lib/rateLimiter.ts)
 * 2. Supabase-backed rate limiter configuration (lib/security/rateLimiter.ts)
 */

import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';

// In-memory rate limiter tests
import {
  checkRateLimit,
  getConfigForTier as getInMemoryConfigForTier,
  getIdentifier,
  buildRateLimitHeaders,
  TIER_LIMITS,
  __resetStore,
  __getStoreSize,
  __stopCleanupTimer,
  type RateLimitConfig,
} from '@/lib/rateLimiter';

// Supabase-backed rate limiter configuration tests
import {
  getConfigForTier as getSupabaseConfigForTier,
  getRateLimitIdentifier,
  getRateLimitHeaders as getSupabaseRateLimitHeaders,
  TIER_CONFIGS,
} from '@/lib/security/rateLimiter';

describe('rateLimiter (in-memory)', () => {
  beforeEach(() => {
    // Reset store before each test
    __resetStore();
  });

  afterAll(() => {
    // Clean up timer after all tests
    __stopCleanupTimer();
  });

  describe('checkRateLimit', () => {
    it('should allow requests within limit', () => {
      const config: RateLimitConfig = { limit: 5, windowMs: 60000 };
      const identifier = 'user:test-user-1';

      // Make 5 requests - all should be allowed
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit(identifier, config, '/api/test');
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(5 - i - 1);
      }
    });

    it('should block requests exceeding limit', () => {
      const config: RateLimitConfig = { limit: 3, windowMs: 60000 };
      const identifier = 'user:test-user-2';

      // Make 3 requests - all should be allowed
      for (let i = 0; i < 3; i++) {
        const result = checkRateLimit(identifier, config, '/api/test');
        expect(result.allowed).toBe(true);
      }

      // 4th request should be blocked
      const blocked = checkRateLimit(identifier, config, '/api/test');
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
      expect(blocked.retryAfter).toBeGreaterThan(0);
    });

    it('should track different identifiers separately', () => {
      const config: RateLimitConfig = { limit: 2, windowMs: 60000 };

      // User 1: 2 requests
      checkRateLimit('user:user-a', config, '/api/test');
      checkRateLimit('user:user-a', config, '/api/test');
      const user1Blocked = checkRateLimit('user:user-a', config, '/api/test');
      expect(user1Blocked.allowed).toBe(false);

      // User 2: still has full quota
      const user2First = checkRateLimit('user:user-b', config, '/api/test');
      expect(user2First.allowed).toBe(true);
      expect(user2First.remaining).toBe(1);
    });

    it('should track different endpoints separately', () => {
      const config: RateLimitConfig = { limit: 2, windowMs: 60000 };
      const identifier = 'user:test-user-3';

      // Use quota on /api/chat
      checkRateLimit(identifier, config, '/api/chat');
      checkRateLimit(identifier, config, '/api/chat');
      const chatBlocked = checkRateLimit(identifier, config, '/api/chat');
      expect(chatBlocked.allowed).toBe(false);

      // /api/other should still have full quota
      const otherAllowed = checkRateLimit(identifier, config, '/api/other');
      expect(otherAllowed.allowed).toBe(true);
    });

    it('should return correct reset time', () => {
      const config: RateLimitConfig = { limit: 1, windowMs: 60000 };
      const identifier = 'user:test-user-4';

      const result = checkRateLimit(identifier, config, '/api/test');
      expect(result.allowed).toBe(true);

      // Reset should be approximately 60 seconds from now
      const now = Math.ceil(Date.now() / 1000);
      expect(result.resetAt).toBeGreaterThanOrEqual(now);
      expect(result.resetAt).toBeLessThanOrEqual(now + 60);
    });

    it('should implement sliding window correctly', async () => {
      // Use a short window for testing
      const config: RateLimitConfig = { limit: 2, windowMs: 100 };
      const identifier = 'user:test-user-5';

      // Make 2 requests
      checkRateLimit(identifier, config, '/api/test');
      checkRateLimit(identifier, config, '/api/test');

      // 3rd should be blocked
      const blocked = checkRateLimit(identifier, config, '/api/test');
      expect(blocked.allowed).toBe(false);

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Now should be allowed again
      const allowed = checkRateLimit(identifier, config, '/api/test');
      expect(allowed.allowed).toBe(true);
    });
  });

  describe('TIER_LIMITS', () => {
    it('should define limits for all tiers', () => {
      expect(TIER_LIMITS.anonymous).toBeDefined();
      expect(TIER_LIMITS.free).toBeDefined();
      expect(TIER_LIMITS.pro).toBeDefined();
      expect(TIER_LIMITS.sanctuary).toBeDefined();
      expect(TIER_LIMITS.default).toBeDefined();
    });

    it('should have increasing limits for higher tiers', () => {
      expect(TIER_LIMITS.anonymous.limit).toBeLessThan(TIER_LIMITS.free.limit);
      expect(TIER_LIMITS.free.limit).toBeLessThan(TIER_LIMITS.pro.limit);
      expect(TIER_LIMITS.pro.limit).toBeLessThan(TIER_LIMITS.sanctuary.limit);
    });

    it('should have reasonable limits', () => {
      // Anonymous: 10/min
      expect(TIER_LIMITS.anonymous.limit).toBe(10);
      expect(TIER_LIMITS.anonymous.windowMs).toBe(60000);

      // Free: 30/min
      expect(TIER_LIMITS.free.limit).toBe(30);

      // Pro: 60/min
      expect(TIER_LIMITS.pro.limit).toBe(60);

      // Sanctuary: 120/min
      expect(TIER_LIMITS.sanctuary.limit).toBe(120);
    });
  });

  describe('getConfigForTier', () => {
    it('should return correct config for known tiers', () => {
      expect(getInMemoryConfigForTier('anonymous')).toEqual(TIER_LIMITS.anonymous);
      expect(getInMemoryConfigForTier('free')).toEqual(TIER_LIMITS.free);
      expect(getInMemoryConfigForTier('pro')).toEqual(TIER_LIMITS.pro);
      expect(getInMemoryConfigForTier('sanctuary')).toEqual(TIER_LIMITS.sanctuary);
    });

    it('should return default config for unknown tiers', () => {
      expect(getInMemoryConfigForTier('unknown')).toEqual(TIER_LIMITS.default);
      expect(getInMemoryConfigForTier('')).toEqual(TIER_LIMITS.default);
    });
  });

  describe('getIdentifier', () => {
    it('should prioritize userId over sessionId', () => {
      const result = getIdentifier('user-123', 'session-456');
      expect(result).toBe('user:user-123');
    });

    it('should use sessionId when no userId', () => {
      const result = getIdentifier(null, 'session-456');
      expect(result).toBe('session:session-456');
    });

    it('should handle undefined/null gracefully', () => {
      const result = getIdentifier(undefined, undefined);
      expect(result).toBe('anonymous:unknown');
    });

    it('should handle empty strings', () => {
      const result = getIdentifier('', '');
      expect(result).toBe('anonymous:unknown');
    });
  });

  describe('buildRateLimitHeaders', () => {
    it('should build correct headers', () => {
      const result = {
        allowed: true,
        limit: 60,
        remaining: 45,
        resetAt: 1706200000,
        retryAfter: 30,
      };

      const headers = buildRateLimitHeaders(result);

      expect(headers['X-RateLimit-Limit']).toBe('60');
      expect(headers['X-RateLimit-Remaining']).toBe('45');
      expect(headers['X-RateLimit-Reset']).toBe('1706200000');
      expect(headers['X-RateLimit-Reset-After']).toBe('30');
    });
  });

  describe('store management', () => {
    it('should track store size correctly', () => {
      const config: RateLimitConfig = { limit: 10, windowMs: 60000 };

      expect(__getStoreSize()).toBe(0);

      checkRateLimit('user:a', config, '/api/test');
      expect(__getStoreSize()).toBe(1);

      checkRateLimit('user:b', config, '/api/test');
      expect(__getStoreSize()).toBe(2);

      // Same user/endpoint should not increase size
      checkRateLimit('user:a', config, '/api/test');
      expect(__getStoreSize()).toBe(2);
    });

    it('should reset store correctly', () => {
      const config: RateLimitConfig = { limit: 10, windowMs: 60000 };

      checkRateLimit('user:test', config, '/api/test');
      expect(__getStoreSize()).toBe(1);

      __resetStore();
      expect(__getStoreSize()).toBe(0);
    });
  });

  describe('security invariants', () => {
    it('should never allow negative remaining count', () => {
      const config: RateLimitConfig = { limit: 1, windowMs: 60000 };
      const identifier = 'user:test-security';

      // Exhaust limit
      checkRateLimit(identifier, config, '/api/test');

      // Multiple blocked requests should not go negative
      for (let i = 0; i < 10; i++) {
        const result = checkRateLimit(identifier, config, '/api/test');
        expect(result.remaining).toBeGreaterThanOrEqual(0);
      }
    });

    it('should always return positive retryAfter when blocked', () => {
      const config: RateLimitConfig = { limit: 1, windowMs: 60000 };
      const identifier = 'user:test-retry';

      checkRateLimit(identifier, config, '/api/test');
      const blocked = checkRateLimit(identifier, config, '/api/test');

      expect(blocked.allowed).toBe(false);
      expect(blocked.retryAfter).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// Supabase-backed Rate Limiter Tests (Configuration Only)
// Note: Actual Supabase integration tests require a test database
// ============================================================================

describe('rateLimiter (Supabase-backed configuration)', () => {
  describe('TIER_CONFIGS', () => {
    it('should define limits for all tiers', () => {
      expect(TIER_CONFIGS.anonymous).toBeDefined();
      expect(TIER_CONFIGS.free).toBeDefined();
      expect(TIER_CONFIGS.pro).toBeDefined();
      expect(TIER_CONFIGS.sanctuary).toBeDefined();
      expect(TIER_CONFIGS.enterprise).toBeDefined();
      expect(TIER_CONFIGS.default).toBeDefined();
    });

    it('should have correct anonymous tier limits (5/24h)', () => {
      expect(TIER_CONFIGS.anonymous.limit).toBe(5);
      expect(TIER_CONFIGS.anonymous.windowSeconds).toBe(86400); // 24 hours
    });

    it('should have correct free tier limits (20/24h)', () => {
      expect(TIER_CONFIGS.free.limit).toBe(20);
      expect(TIER_CONFIGS.free.windowSeconds).toBe(86400); // 24 hours
    });

    it('should have correct pro tier limits (100/h)', () => {
      expect(TIER_CONFIGS.pro.limit).toBe(100);
      expect(TIER_CONFIGS.pro.windowSeconds).toBe(3600); // 1 hour
    });

    it('should have correct sanctuary tier limits (100/h)', () => {
      expect(TIER_CONFIGS.sanctuary.limit).toBe(100);
      expect(TIER_CONFIGS.sanctuary.windowSeconds).toBe(3600); // 1 hour
    });

    it('should have correct enterprise tier limits (1000/h)', () => {
      expect(TIER_CONFIGS.enterprise.limit).toBe(1000);
      expect(TIER_CONFIGS.enterprise.windowSeconds).toBe(3600); // 1 hour
    });
  });

  describe('getConfigForTier', () => {
    it('should return correct config for known tiers', () => {
      expect(getSupabaseConfigForTier('anonymous')).toEqual(TIER_CONFIGS.anonymous);
      expect(getSupabaseConfigForTier('free')).toEqual(TIER_CONFIGS.free);
      expect(getSupabaseConfigForTier('pro')).toEqual(TIER_CONFIGS.pro);
      expect(getSupabaseConfigForTier('sanctuary')).toEqual(TIER_CONFIGS.sanctuary);
      expect(getSupabaseConfigForTier('enterprise')).toEqual(TIER_CONFIGS.enterprise);
    });

    it('should return default config for unknown tiers', () => {
      expect(getSupabaseConfigForTier('unknown')).toEqual(TIER_CONFIGS.default);
      expect(getSupabaseConfigForTier('')).toEqual(TIER_CONFIGS.default);
    });
  });

  describe('getRateLimitIdentifier', () => {
    it('should return user: prefix for authenticated users', () => {
      const result = getRateLimitIdentifier('user-123');
      expect(result).toBe('user:user-123');
    });

    it('should return ip: prefix for anonymous users (no req)', () => {
      const result = getRateLimitIdentifier(null);
      expect(result).toMatch(/^anon:/);
    });

    it('should handle empty userId', () => {
      const result = getRateLimitIdentifier('');
      expect(result).toMatch(/^anon:/);
    });

    it('should handle undefined userId', () => {
      const result = getRateLimitIdentifier(undefined);
      expect(result).toMatch(/^anon:/);
    });
  });

  describe('getRateLimitHeaders', () => {
    it('should build correct headers for allowed request', () => {
      const result = {
        allowed: true,
        limit: 100,
        remaining: 95,
        resetAt: 1706200000,
        retryAfter: 3600,
        currentCount: 5,
        tier: 'pro',
      };

      const headers = getSupabaseRateLimitHeaders(result);

      expect(headers['X-RateLimit-Limit']).toBe('100');
      expect(headers['X-RateLimit-Remaining']).toBe('95');
      expect(headers['X-RateLimit-Reset']).toBe('1706200000');
      expect(headers['Retry-After']).toBeUndefined(); // Only on 429
    });

    it('should include Retry-After header for blocked request', () => {
      const result = {
        allowed: false,
        limit: 5,
        remaining: 0,
        resetAt: 1706200000,
        retryAfter: 3600,
        currentCount: 5,
        tier: 'anonymous',
      };

      const headers = getSupabaseRateLimitHeaders(result);

      expect(headers['X-RateLimit-Limit']).toBe('5');
      expect(headers['X-RateLimit-Remaining']).toBe('0');
      expect(headers['Retry-After']).toBe('3600');
    });
  });

  describe('security invariants', () => {
    it('should never exceed enterprise limits', () => {
      expect(TIER_CONFIGS.enterprise.limit).toBeLessThanOrEqual(1000);
    });

    it('should have higher limits for paid tiers', () => {
      expect(TIER_CONFIGS.anonymous.limit).toBeLessThan(TIER_CONFIGS.free.limit);
      expect(TIER_CONFIGS.free.limit).toBeLessThan(TIER_CONFIGS.pro.limit);
      expect(TIER_CONFIGS.pro.limit).toBeLessThanOrEqual(TIER_CONFIGS.sanctuary.limit);
      expect(TIER_CONFIGS.sanctuary.limit).toBeLessThan(TIER_CONFIGS.enterprise.limit);
    });

    it('should have shorter windows for paid tiers', () => {
      // Anonymous/free: 24 hour window
      expect(TIER_CONFIGS.anonymous.windowSeconds).toBe(86400);
      expect(TIER_CONFIGS.free.windowSeconds).toBe(86400);
      
      // Paid tiers: 1 hour window
      expect(TIER_CONFIGS.pro.windowSeconds).toBe(3600);
      expect(TIER_CONFIGS.sanctuary.windowSeconds).toBe(3600);
      expect(TIER_CONFIGS.enterprise.windowSeconds).toBe(3600);
    });
  });
});