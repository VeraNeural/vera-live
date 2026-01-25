import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { getAuditLogs, type AuditEventType, logAuditEvent, getAuditContext } from '@/lib/audit/auditLogger';

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
 * GET /api/admin/audit-logs
 * 
 * Fetch audit logs with filters. Admin only.
 * 
 * Query params:
 * - eventType: Filter by event type
 * - success: 'true' or 'false'
 * - startDate: ISO date string
 * - endDate: ISO date string
 * - userId: Filter by user ID
 * - limit: Number of results (default 50, max 500)
 * - offset: Pagination offset
 */
export async function GET(request: NextRequest) {
  const auditContext = getAuditContext(request);
  const { authorized, userId } = await verifyAdmin();

  if (!authorized) {
    await logAuditEvent('security.unauthorized_access', userId, { 
      endpoint: '/api/admin/audit-logs',
      action: 'read',
    }, false, auditContext);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Log admin access
  await logAuditEvent('admin.user_accessed', userId, { 
    resource: 'audit_logs',
    action: 'list',
  }, true, auditContext);

  try {
    const searchParams = request.nextUrl.searchParams;

    const eventType = searchParams.get('eventType') as AuditEventType | null;
    const successParam = searchParams.get('success');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const userIdParam = searchParams.get('userId');
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    const filters: Parameters<typeof getAuditLogs>[0] = {};

    if (eventType) {
      filters.eventType = eventType;
    }

    if (successParam !== null) {
      filters.success = successParam === 'true';
    }

    if (startDateParam) {
      filters.startDate = new Date(startDateParam);
    }

    if (endDateParam) {
      filters.endDate = new Date(endDateParam);
    }

    if (userIdParam) {
      filters.userId = userIdParam;
    }

    filters.limit = Math.min(parseInt(limitParam || '50', 10), 500);
    filters.offset = parseInt(offsetParam || '0', 10);

    const result = await getAuditLogs(filters);

    return NextResponse.json(result);
  } catch (err) {
    console.error('[ADMIN_AUDIT_LOGS] Failed to fetch:', err);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
