import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { cleanupOldAuditLogs, getAuditLogStats, getRetentionDays } from '@/lib/audit/auditRetention';
import { logAuditEvent, getAuditContext } from '@/lib/audit/auditLogger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Verify the requester is an admin
 */
async function verifyAdmin(): Promise<{ authorized: boolean; userId: string | null }> {
  const { userId } = await auth();
  if (!userId) return { authorized: false, userId: null };

  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  if (!adminEmail) return { authorized: false, userId };

  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const email = (user.emailAddresses?.[0]?.emailAddress || '').trim().toLowerCase();

    if (!email || email !== adminEmail) {
      return { authorized: false, userId };
    }

    return { authorized: true, userId };
  } catch {
    return { authorized: false, userId };
  }
}

/**
 * GET /api/admin/cleanup-audit-logs
 * 
 * Get audit log statistics without performing cleanup.
 * Admin only.
 */
export async function GET(request: NextRequest) {
  const auditContext = getAuditContext(request);
  const { authorized, userId } = await verifyAdmin();

  if (!authorized) {
    await logAuditEvent('security.unauthorized_access', userId, {
      endpoint: '/api/admin/cleanup-audit-logs',
      action: 'read',
    }, false, auditContext);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const stats = await getAuditLogStats();
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (err) {
    console.error('[AUDIT_CLEANUP] Failed to get stats:', err);
    return NextResponse.json(
      { error: 'Failed to get audit log stats' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/cleanup-audit-logs
 * 
 * Trigger manual cleanup of old audit logs.
 * Admin only.
 * 
 * Request body (optional):
 * { retentionDays: number }
 * 
 * Can be called by:
 * - Admin dashboard
 * - External cron service (e.g., Vercel Cron, GitHub Actions)
 * 
 * For external cron, include Authorization header with admin API key:
 * Authorization: Bearer <ADMIN_CLEANUP_API_KEY>
 */
export async function POST(request: NextRequest) {
  const auditContext = getAuditContext(request);
  
  // Check for API key authentication (for external cron services)
  const authHeader = request.headers.get('authorization');
  const adminApiKey = process.env.ADMIN_CLEANUP_API_KEY;
  
  let isAuthorized = false;
  let authUserId: string | null = null;

  if (authHeader && adminApiKey && authHeader === `Bearer ${adminApiKey}`) {
    // External cron service with valid API key
    isAuthorized = true;
    authUserId = 'system:cron';
  } else {
    // Check for admin user authentication
    const { authorized, userId } = await verifyAdmin();
    isAuthorized = authorized;
    authUserId = userId;
  }

  if (!isAuthorized) {
    await logAuditEvent('security.unauthorized_access', authUserId, {
      endpoint: '/api/admin/cleanup-audit-logs',
      action: 'cleanup',
    }, false, auditContext);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    // Parse optional retention days from body
    let retentionDays = getRetentionDays();
    try {
      const body = await request.json();
      if (body.retentionDays && typeof body.retentionDays === 'number' && body.retentionDays > 0) {
        retentionDays = body.retentionDays;
      }
    } catch {
      // No body or invalid JSON - use default
    }

    // Perform cleanup
    const { deletedCount, error } = await cleanupOldAuditLogs(retentionDays);

    if (error) {
      return NextResponse.json({
        success: false,
        error,
        deletedCount: 0,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      deletedCount,
      retentionDays,
      message: `Cleaned up ${deletedCount} audit logs older than ${retentionDays} days`,
    });
  } catch (err) {
    console.error('[AUDIT_CLEANUP] Cleanup failed:', err);
    return NextResponse.json(
      { error: 'Failed to cleanup audit logs' },
      { status: 500 }
    );
  }
}
