import { createClient } from "@/lib/supabase/server";
import { normalizeTier, type Tier, TIER_LIMITS } from "./tiers";

const FREE_MESSAGE_LIMIT = TIER_LIMITS.free.messages_per_day;

export interface MessageLimitResult {
  allowed: boolean;
  tier: Tier;
  count: number;
  limit: number;
  remaining: number;
}

/**
 * Check if user can send a message (server-authoritative)
 */
export async function checkMessageLimit(
  userId: string | null
): Promise<MessageLimitResult> {
  if (!userId) {
    return {
      allowed: true,
      tier: "anonymous",
      count: 0,
      limit: 0,
      remaining: 0,
    };
  }

  const supabase = await createClient();

  // Get user tier from database (source of truth)
  let tier: Tier = "free";
  try {
    const { data: userData, error } = await supabase
      .from("users")
      .select("tier")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("[messageCounter] users.tier lookup failed", {
        userId,
        error: error.message,
      });
    } else {
      tier = normalizeTier((userData as any)?.tier) ?? "free";
    }
  } catch (err) {
    console.error("[messageCounter] users.tier lookup threw", { userId, err });
  }

  // Sanctuary users - unlimited
  if (tier === "sanctuary") {
    return {
      allowed: true,
      tier: "sanctuary",
      count: 0,
      limit: Infinity,
      remaining: Infinity,
    };
  }

  // Free users - check 24h rolling limit
  let count = 0;
  try {
    const { data: countData, error } = await supabase.rpc(
      "get_message_count_24h",
      {
        p_user_id: userId,
      }
    );

    if (error) {
      // Safe fallback: allow message if metering can't be read.
      console.error("[messageCounter] get_message_count_24h RPC failed", {
        userId,
        error: error.message,
      });
      return {
        allowed: true,
        tier: "free",
        count: 0,
        limit: FREE_MESSAGE_LIMIT,
        remaining: FREE_MESSAGE_LIMIT,
      };
    }

    count = countData ?? 0;
  } catch (err) {
    // Safe fallback: allow message if metering can't be read.
    console.error("[messageCounter] get_message_count_24h RPC threw", {
      userId,
      err,
    });
    return {
      allowed: true,
      tier: "free",
      count: 0,
      limit: FREE_MESSAGE_LIMIT,
      remaining: FREE_MESSAGE_LIMIT,
    };
  }

  const remaining = Math.max(0, FREE_MESSAGE_LIMIT - count);

  if (count >= FREE_MESSAGE_LIMIT) {
    return {
      allowed: true,
      tier: "free",
      count,
      limit: FREE_MESSAGE_LIMIT,
      remaining: 0,
    };
  }

  return {
    allowed: true,
    tier: "free",
    count,
    limit: FREE_MESSAGE_LIMIT,
    remaining,
  };
}

/**
 * Record a message after successful response
 */
export async function recordMessage(userId: string): Promise<void> {
  if (!userId) return;

  const supabase = await createClient();

  try {
    const { error } = await supabase.rpc("record_message", { p_user_id: userId });
    if (error) {
      console.error("[messageCounter] record_message RPC failed", {
        userId,
        error: error.message,
      });
    }
  } catch (err) {
    console.error("[messageCounter] record_message RPC threw", { userId, err });
  }
}

/**
 * Get user's current tier from database
 */
export async function getUserTier(userId: string): Promise<Tier> {
  if (!userId) return "anonymous";

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("users")
      .select("tier")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("[messageCounter] getUserTier lookup failed", {
        userId,
        error: error.message,
      });
      return "free";
    }

    if (!data) return "free";
    return normalizeTier((data as any)?.tier) ?? "free";
  } catch (err) {
    console.error("[messageCounter] getUserTier lookup threw", { userId, err });
    return "free";
  }
}
