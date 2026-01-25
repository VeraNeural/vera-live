/**
 * Audit Logger - Compliance and Security Event Tracking
 * 
 * SECURITY RULES:
 * - NEVER log message content or conversation data
 * - NEVER log passwords, tokens, or API keys
 * - NEVER log full IP addresses (hash or truncate)
 * - NEVER log PII in metadata (names, emails in plain text)
 * - DO hash or anonymize sensitive identifiers
 * 
 * Retention: Auto-delete logs older than 365 days (configurable)
 */

import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { createHash } from 'crypto';

// ============================================================================
// TYPES
// ============================================================================

export type AuditEventType =
  // Authentication events
  | 'auth.login'
  | 'auth.logout'
  | 'auth.login_failed'
  | 'auth.password_reset'
  | 'auth.token_refresh'
  | 'auth.session_revoked'
  // Data access events
  | 'data.export_requested'
  | 'data.export_completed'
  | 'data.deletion_requested'
  | 'data.deletion_completed'
  // Subscription events
  | 'subscription.created'
  | 'subscription.cancelled'
  | 'subscription.updated'
  | 'subscription.payment_failed'
  // Consent events
  | 'consent.cookie_updated'
  | 'consent.memory_updated'
  // Admin events
  | 'admin.user_accessed'
  | 'admin.settings_changed'
  | 'admin.entitlement_granted'
  // Security events
  | 'security.rate_limit_hit'
  | 'security.suspicious_activity'
  | 'security.blocked_request'
  | 'security.csrf_violation'
  | 'security.unauthorized_access';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  event_type: AuditEventType;
  user_id: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown>;
  success: boolean;
  created_at: string;
}

export interface AuditLogContext {
  ip?: string;
  userAgent?: string;
  requestId?: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Hash an IP address for privacy-compliant logging
 * Uses SHA-256 with a salt, truncated to 16 chars
 */
function hashIP(ip: string | undefined | null): string | null {
  if (!ip) return null;
  
  // Salt with a constant to prevent rainbow table attacks
  // In production, use an environment variable
  const salt = process.env.AUDIT_HASH_SALT || 'vera-audit-salt-2026';
  const hash = createHash('sha256')
    .update(salt + ip)
    .digest('hex');
  
  // Return first 16 characters (64 bits of entropy)
  return hash.substring(0, 16);
}

/**
 * Hash an email for privacy-compliant logging
 */
export function hashEmail(email: string | undefined | null): string | null {
  if (!email) return null;
  
  const salt = process.env.AUDIT_HASH_SALT || 'vera-audit-salt-2026';
  const normalized = email.toLowerCase().trim();
  const hash = createHash('sha256')
    .update(salt + normalized)
    .digest('hex');
  
  return hash.substring(0, 16);
}

/**
 * Truncate user ID for semi-anonymous logging
 * Keeps first 8 chars for debugging while maintaining privacy
 */
export function truncateUserId(userId: string | null): string | null {
  if (!userId) return null;
  return userId.substring(0, 8) + '...';
}

/**
 * Sanitize metadata to ensure no PII or sensitive data is logged
 */
function sanitizeMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const forbidden = [
    'password', 'token', 'secret', 'key', 'authorization',
    'email', 'name', 'phone', 'address', 'ssn', 'dob',
    'content', 'message', 'conversation', 'memory',
    'credit_card', 'card_number', 'cvv', 'expiry',
  ];
  
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(metadata)) {
    const lowerKey = key.toLowerCase();
    
    // Skip forbidden keys
    if (forbidden.some(f => lowerKey.includes(f))) {
      sanitized[key] = '[REDACTED]';
      continue;
    }
    
    // Recursively sanitize nested objects
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeMetadata(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Truncate user agent to reasonable length
 */
function truncateUserAgent(userAgent: string | undefined | null): string | null {
  if (!userAgent) return null;
  // Keep first 200 chars to capture browser/OS info without bloat
  return userAgent.substring(0, 200);
}

// ============================================================================
// MAIN LOGGING FUNCTIONS
// ============================================================================

/**
 * Log an audit event to the database
 * 
 * @param eventType - The type of event
 * @param userId - The user ID (Clerk ID), or null for anonymous/failed events
 * @param metadata - Additional context (will be sanitized)
 * @param success - Whether the operation succeeded
 * @param context - Optional request context (IP, user agent)
 */
export async function logAuditEvent(
  eventType: AuditEventType,
  userId: string | null,
  metadata: Record<string, unknown> = {},
  success: boolean = true,
  context: AuditLogContext = {}
): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    
    const logEntry = {
      event_type: eventType,
      user_id: userId,
      ip_hash: hashIP(context.ip),
      user_agent: truncateUserAgent(context.userAgent),
      metadata: sanitizeMetadata({
        ...metadata,
        request_id: context.requestId,
      }),
      success,
    };
    
    const { error } = await supabase
      .from('audit_logs')
      .insert(logEntry);
    
    if (error) {
      // Log to console but don't throw - audit logging should never break the app
      console.error('[AUDIT] Failed to write audit log:', error.message);
    }
  } catch (err) {
    // Silently fail - audit logging should never break the app
    console.error('[AUDIT] Error in logAuditEvent:', err);
  }
}

/**
 * Helper to extract context from Next.js request
 */
export function getAuditContext(request: Request): AuditLogContext {
  const headers = request.headers;
  
  // Get IP from various headers (Vercel, Cloudflare, etc.)
  const ip = 
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    undefined;
  
  return {
    ip,
    userAgent: headers.get('user-agent') || undefined,
    requestId: headers.get('x-request-id') || headers.get('x-vercel-id') || undefined,
  };
}

// ============================================================================
// QUERY FUNCTIONS (Admin Use)
// ============================================================================

/**
 * Get audit logs for a specific user (admin only)
 */
export async function getAuditLogs(
  filters: {
    userId?: string;
    eventType?: AuditEventType;
    startDate?: Date;
    endDate?: Date;
    success?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ data: AuditLogEntry[]; count: number }> {
  const supabase = getSupabaseAdmin();
  
  let query = supabase
    .from('audit_logs')
    .select('*', { count: 'exact' });
  
  if (filters.userId) {
    query = query.eq('user_id', filters.userId);
  }
  
  if (filters.eventType) {
    query = query.eq('event_type', filters.eventType);
  }
  
  if (filters.startDate) {
    query = query.gte('timestamp', filters.startDate.toISOString());
  }
  
  if (filters.endDate) {
    query = query.lte('timestamp', filters.endDate.toISOString());
  }
  
  if (filters.success !== undefined) {
    query = query.eq('success', filters.success);
  }
  
  query = query
    .order('timestamp', { ascending: false })
    .limit(filters.limit || 100)
    .range(
      filters.offset || 0,
      (filters.offset || 0) + (filters.limit || 100) - 1
    );
  
  const { data, count, error } = await query;
  
  if (error) {
    console.error('[AUDIT] Failed to fetch audit logs:', error.message);
    return { data: [], count: 0 };
  }
  
  return { data: data || [], count: count || 0 };
}

/**
 * Get audit log statistics (admin dashboard)
 */
export async function getAuditStats(
  startDate: Date,
  endDate: Date
): Promise<Record<string, number>> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('audit_logs')
    .select('event_type')
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString());
  
  if (error || !data) {
    return {};
  }
  
  // Count events by type
  const stats: Record<string, number> = {};
  for (const log of data) {
    stats[log.event_type] = (stats[log.event_type] || 0) + 1;
  }
  
  return stats;
}

// ============================================================================
// CONVENIENCE WRAPPERS
// ============================================================================

/**
 * Log authentication event
 */
export async function logAuthEvent(
  event: 'auth.login' | 'auth.logout' | 'auth.login_failed' | 'auth.password_reset',
  userId: string | null,
  context: AuditLogContext,
  success: boolean = true,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  await logAuditEvent(event, userId, metadata, success, context);
}

/**
 * Log data access event
 */
export async function logDataEvent(
  event: 'data.export_requested' | 'data.export_completed' | 'data.deletion_requested' | 'data.deletion_completed',
  userId: string,
  context: AuditLogContext,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  await logAuditEvent(event, userId, metadata, true, context);
}

/**
 * Log security event
 */
export async function logSecurityEvent(
  event: 'security.rate_limit_hit' | 'security.suspicious_activity' | 'security.blocked_request' | 'security.unauthorized_access',
  userId: string | null,
  context: AuditLogContext,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  await logAuditEvent(event, userId, metadata, false, context);
}

/**
 * Log subscription event
 */
export async function logSubscriptionEvent(
  event: 'subscription.created' | 'subscription.cancelled' | 'subscription.updated' | 'subscription.payment_failed',
  userId: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  await logAuditEvent(event, userId, metadata, event !== 'subscription.payment_failed');
}

/**
 * Log consent event
 */
export async function logConsentEvent(
  event: 'consent.cookie_updated' | 'consent.memory_updated',
  userId: string | null,
  context: AuditLogContext,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  await logAuditEvent(event, userId, metadata, true, context);
}
