import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logAuditEvent, getAuditContext } from '@/lib/audit/auditLogger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/consent/log
 * 
 * Logs cookie consent changes for GDPR audit trail.
 * This is called from the client-side CookieBanner component.
 * 
 * Request body:
 * { analytics: boolean, marketing: boolean, action: 'accept_all' | 'reject_optional' | 'custom' }
 */
export async function POST(request: NextRequest) {
  try {
    const auditContext = getAuditContext(request);
    
    // Get user ID if authenticated (optional for consent logging)
    const { userId } = await auth();
    
    let body: { analytics?: boolean; marketing?: boolean; action?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { analytics, marketing, action } = body;

    // Log the consent change
    await logAuditEvent(
      'consent.cookie_updated',
      userId,
      {
        analytics_consent: Boolean(analytics),
        marketing_consent: Boolean(marketing),
        action: action || 'unknown',
      },
      true,
      auditContext
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[CONSENT_LOG] Failed to log consent:', err);
    // Don't fail the request - consent logging is non-critical
    return NextResponse.json({ success: true });
  }
}
