import { auth } from '@clerk/nextjs/server';
import { getUserAccessState } from '@/lib/auth/accessState';
import {
  checkMessageLimit,
  meteringIdFromSessionId,
  resolveMeteringIdForClerkUserId,
} from '@/lib/auth/messageCounter';
import type { RoutingTier } from '../core/types';

export type ResolvedTier = {
  tier: 'anonymous' | 'free' | 'sanctuary' | 'build';
  userId: string | null;
  gateResponse?: { gate: string; text: string };
  showSoftInvite?: boolean;
};

/**
 * Resolves the user's access tier and enforces message limits.
 * Returns gate responses when limits are exceeded.
 */
export async function resolveTier(sessionId: string): Promise<ResolvedTier> {
  // Clerk is the only identity source.
  const { userId } = await auth();

  // Anonymous user flow
  if (!userId) {
    const anonMeteringId = meteringIdFromSessionId(sessionId);
    const limitCheck = await checkMessageLimit({ tier: 'anonymous', meteringId: anonMeteringId });

    if (!limitCheck.allowed) {
      return {
        tier: 'anonymous',
        userId: null,
        gateResponse: {
          gate: 'signup_required',
          text: "I'm really enjoying our conversation. To keep chatting, create a free account - it only takes a moment. You'll get 20 messages per day.",
        },
      };
    }

    // Show soft invite on 5th message (count === 4 means next is 5th)
    if (limitCheck.count === 4) {
      return {
        tier: 'anonymous',
        userId: null,
        showSoftInvite: true,
      };
    }

    return {
      tier: 'anonymous',
      userId: null,
    };
  }

  // Authenticated user flow - determine entitlement tier
  let entitlementTier: 'free' | 'sanctuary' | 'build' = 'free';

  try {
    const access = await getUserAccessState(userId);
    console.log('[TIER DEBUG]', { userId, accessState: access.state });
    // Map anonymous to free for routing purposes
    entitlementTier = access.state === 'anonymous' ? 'free' : access.state;
  } catch (e) {
    console.error('getUserAccessState failed; falling back to free', e);
    entitlementTier = 'free';
  }

  // Free tier: enforce message limits
  if (entitlementTier === 'free') {
    const freeMeteringId = await resolveMeteringIdForClerkUserId(userId);
    const limitCheck = await checkMessageLimit({ tier: 'free', meteringId: freeMeteringId });

    if (!limitCheck.allowed) {
      return {
        tier: 'free',
        userId,
        gateResponse: {
          gate: 'upgrade_required',
          text:
            "You've been busy today! Join Sanctuary for unlimited conversations with me — plus voice, images, and I'll remember our chats.",
        },
      };
    }
  }

  // Sanctuary and Build tiers have no message limits
  return {
    tier: entitlementTier,
    userId,
  };
}
