import { createClient } from "@/lib/supabase/server";
import { createHash } from "crypto";
import type { Tier } from "./tiers";
import { TIER_LIMITS } from "./tiers";
import { getUserAccessState } from "./accessState";

const FREE_MESSAGE_LIMIT = TIER_LIMITS.free.messages_per_day;
const ANON_MESSAGE_LIMIT = 5;

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

/**
 * Deterministically map an arbitrary string to a UUID-like value.
 * This is used ONLY to satisfy Postgres UUID input for metering.
 */
function stableUuidFromString(input: string): string {
  const hex = createHash("sha256").update(input).digest("hex");
  // Take first 32 hex chars.
  const base = hex.slice(0, 32).split("");

  // Set version to 5 (positions are 0-indexed in the 32-hex string)
  base[12] = "5";
  // Set RFC 4122 variant (8, 9, a, b)
  base[16] = "8";

  const s = base.join("");
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20, 32)}`;
}

/**
 * Resolve the UUID metering id for an authenticated Clerk user.
 * Prefers the DB uuid in `users.id` (looked up by `clerk_user_id`).
 * Falls back to a deterministic UUID derived from the Clerk user id.
 */
export async function resolveMeteringIdForClerkUserId(clerkUserId: string): Promise<string> {
  if (!clerkUserId) return stableUuidFromString("clerk:missing");

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_user_id", clerkUserId)
      .limit(1)
      .maybeSingle();

    const dbId = (data as any)?.id;
    if (typeof dbId === "string" && isUuid(dbId)) {
      return dbId;
    }
  } catch {
    // Ignore and fall back to deterministic UUID.
  }

  return stableUuidFromString(`clerk:${clerkUserId}`);
}

/**
 * Resolve the UUID metering id for an anonymous session.
 */
export function meteringIdFromSessionId(sessionId: string): string {
  return stableUuidFromString(`sid:${sessionId}`);
}

export interface MessageLimitResult {
  allowed: boolean;
  tier: Tier;
  count: number;
  limit: number;
  remaining: number;
}

export async function getMessageCount24h(meteringId: string): Promise<number> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_message_count_24h", {
    p_user_id: meteringId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? 0) as number;
}

/**
 * Check if user can send a message (server-authoritative)
 */
export async function checkMessageLimit(
  input: {
    tier: Tier;
    meteringId: string;
  }
): Promise<MessageLimitResult> {
  if (input.tier === "sanctuary") {
    return {
      allowed: true,
      tier: "sanctuary",
      count: 0,
      limit: Infinity,
      remaining: Infinity,
    };
  }

  const limit = input.tier === "anonymous" ? ANON_MESSAGE_LIMIT : FREE_MESSAGE_LIMIT;

  let count = 0;
  try {
    count = await getMessageCount24h(input.meteringId);
  } catch (err) {
    // Fail closed: if metering can't be read, block.
    console.error("[messageCounter] get_message_count_24h failed", {
      meteringId: input.meteringId,
      err,
    });
    return {
      allowed: false,
      tier: input.tier,
      count: 0,
      limit,
      remaining: 0,
    };
  }

  const remaining = Math.max(0, limit - count);

  if (count >= limit) {
    return {
      allowed: false,
      tier: input.tier,
      count,
      limit,
      remaining: 0,
    };
  }

  return {
    allowed: true,
    tier: input.tier,
    count,
    limit,
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
  try {
    const access = await getUserAccessState(userId);
    return access.state === "sanctuary" ? "sanctuary" : access.state === "anonymous" ? "anonymous" : "free";
  } catch (err) {
    console.error("[messageCounter] getUserTier lookup threw", { userId, err });
    return "free";
  }
}
