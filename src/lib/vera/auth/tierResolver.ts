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
  nudge?: { kind: 'signup_soft' | 'signup_hard'; text: string };
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
          text: "I'd love to keep going. To keep chatting, create a free account — it only takes a moment. You'll get 20 messages per day.",
        },
      };
    }

    // Anonymous soft-sell nudges are deterministic based on metering count.
    // count is number of messages already recorded; next user message will be count + 1.
    const nextMessageNumber = limitCheck.count + 1;

    // Messages 3-4: light, natural invitation
    if (nextMessageNumber === 3 || nextMessageNumber === 4) {
      return {
        tier: 'anonymous',
        userId: null,
        nudge: {
          kind: 'signup_soft',
          text: 'By the way, I can do so much more — breathing exercises, sleep stories, journaling. Want me to set you up with a free account? Takes 10 seconds 💜',
        },
      };
    }

    // Message 5: close the deal
    if (nextMessageNumber === 5) {
      return {
        tier: 'anonymous',
        userId: null,
        nudge: {
          kind: 'signup_hard',
          text: "I'd love to keep going! Let me get you set up real quick — I'll be right here waiting for you.",
        },
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
