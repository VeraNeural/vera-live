import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserAccessState } from '@/lib/auth/accessState';
import { checkMessageLimit, resolveMeteringIdForClerkUserId } from '@/lib/auth/messageCounter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// TEMPORARY / DEBUG ONLY:
// This endpoint is intended for server-side inspection during development.
// Do not expose it in client UI, and keep it disabled in production.
export async function GET() {
  // Extra safety: do not allow in production.
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  // Clerk is the ONLY identity source.
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const access = await getUserAccessState(userId);

  const entitlement = access.state;
  const entitlement_source = access.entitlement_source ?? 'none';

  const features_enabled = {
    voice: entitlement === 'sanctuary',
    images: entitlement === 'sanctuary',
    memory: entitlement === 'sanctuary',
  };

  const metering_key: 'vera_sid' | 'clerk_user_id' = 'clerk_user_id';

  const meteringId = await resolveMeteringIdForClerkUserId(userId);

  const remaining_messages: number | 'unlimited' =
    entitlement === 'sanctuary'
      ? 'unlimited'
      : (await checkMessageLimit({ tier: 'free', meteringId })).remaining;

  return NextResponse.json({
    clerk_user_id: userId,
    entitlement,
    entitlement_source,
    remaining_messages,
    metering_key,
    period_end: access.period_end ?? null,
    features_enabled,
  });
}
