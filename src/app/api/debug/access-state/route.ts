import { NextResponse, type NextRequest } from 'next/server';
import { getUserAccessState } from '@/lib/auth/accessState';
import { checkMessageLimit, resolveMeteringIdForClerkUserId } from '@/lib/auth/messageCounter';
import { getAuthUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// TEMPORARY / DEBUG ONLY:
// This endpoint is intended for server-side inspection during development.
// Do not expose it in client UI, and keep it disabled in production.
export async function GET(request: NextRequest) {
  // Only allow admin access to debug routes
  const authUser = await getAuthUser(request);

  if (!authUser?.isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    );
  }

  // Extra safety: do not allow in production.
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const access = await getUserAccessState(authUser.userId);

  const entitlement = access.state;
  const entitlement_source = access.entitlement_source ?? 'none';

  const features_enabled = {
    voice: entitlement === 'sanctuary' || entitlement === 'forge',
    images: entitlement === 'sanctuary' || entitlement === 'forge',
    memory: entitlement === 'sanctuary' || entitlement === 'forge',
  };

  const metering_key: 'vera_sid' | 'clerk_user_id' = 'clerk_user_id';

  const meteringId = await resolveMeteringIdForClerkUserId(authUser.userId);

  const remaining_messages: number | 'unlimited' =
    entitlement === 'sanctuary' || entitlement === 'forge'
      ? 'unlimited'
      : (await checkMessageLimit({ tier: 'free', meteringId })).remaining;

  return NextResponse.json({
    clerk_user_id: authUser.userId,
    entitlement,
    entitlement_source,
    remaining_messages,
    metering_key,
    period_end: access.period_end ?? null,
    features_enabled,
  });
}
