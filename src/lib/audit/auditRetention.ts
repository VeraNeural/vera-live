/**
 * Audit Log Retention Policy
 * 
 * Handles automated cleanup of old audit logs to comply with
 * GDPR/CCPA data minimization principles.
 * 
 * Default retention: 365 days (configurable via AUDIT_RETENTION_DAYS env var)
 */

import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { logAuditEvent } from './auditLogger';

// Default retention period in days
const DEFAULT_RETENTION_DAYS = 365;

/**
 * Get the configured retention period from environment or default
 */
export function getRetentionDays(): number {
  const envValue = process.env.AUDIT_RETENTION_DAYS;
  if (envValue) {
    const parsed = parseInt(envValue, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return DEFAULT_RETENTION_DAYS;
}

/**
 * Clean up audit logs older than the retention period
 * 
 * @param retentionDays - Number of days to retain logs (default: 365)
 * @returns Object with deleted count and any error
 */
export async function cleanupOldAuditLogs(
  retentionDays: number = getRetentionDays()
): Promise<{ deletedCount: number; error: string | null }> {
  const supabase = getSupabaseAdmin();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  try {
    // First, count how many records will be deleted (for logging)
    const { count: preCount, error: countError } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .lt('timestamp', cutoffDate.toISOString());

    if (countError) {
      console.error('[AUDIT_RETENTION] Failed to count old logs:', countError.message);
    }

    // Delete old audit logs
    const { error: deleteError } = await supabase
      .from('audit_logs')
      .delete()
      .lt('timestamp', cutoffDate.toISOString());

    if (deleteError) {
      console.error('[AUDIT_RETENTION] Failed to delete old logs:', deleteError.message);
      return { deletedCount: 0, error: deleteError.message };
    }

    const deletedCount = preCount ?? 0;

    // Log the cleanup action as a meta audit event (only if records were deleted)
    if (deletedCount > 0) {
      await logAuditEvent(
        'admin.settings_changed',
        null, // System action, no user
        {
          action: 'audit_log_cleanup',
          retention_days: retentionDays,
          deleted_count: deletedCount,
          cutoff_date: cutoffDate.toISOString(),
        },
        true
      );
    }

    console.log(`[AUDIT_RETENTION] Cleanup complete: ${deletedCount} logs deleted (older than ${retentionDays} days)`);

    return { deletedCount, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[AUDIT_RETENTION] Cleanup failed:', errorMessage);
    return { deletedCount: 0, error: errorMessage };
  }
}

/**
 * Get statistics about audit log storage
 */
export async function getAuditLogStats(): Promise<{
  totalCount: number;
  oldestTimestamp: string | null;
  newestTimestamp: string | null;
  recordsOlderThanRetention: number;
  retentionDays: number;
}> {
  const supabase = getSupabaseAdmin();
  const retentionDays = getRetentionDays();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  // Get total count
  const { count: totalCount } = await supabase
    .from('audit_logs')
    .select('*', { count: 'exact', head: true });

  // Get oldest record
  const { data: oldest } = await supabase
    .from('audit_logs')
    .select('timestamp')
    .order('timestamp', { ascending: true })
    .limit(1)
    .single();

  // Get newest record
  const { data: newest } = await supabase
    .from('audit_logs')
    .select('timestamp')
    .order('timestamp', { ascending: false })
    .limit(1)
    .single();

  // Get count of records older than retention
  const { count: oldCount } = await supabase
    .from('audit_logs')
    .select('*', { count: 'exact', head: true })
    .lt('timestamp', cutoffDate.toISOString());

  return {
    totalCount: totalCount ?? 0,
    oldestTimestamp: oldest?.timestamp ?? null,
    newestTimestamp: newest?.timestamp ?? null,
    recordsOlderThanRetention: oldCount ?? 0,
    retentionDays,
  };
}
