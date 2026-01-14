// Tier definitions - server is source of truth

export type Tier = "anonymous" | "free" | "sanctuary";

export function normalizeTier(raw: unknown): Tier | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim().toLowerCase();
  if (value === "anonymous" || value === "free" || value === "sanctuary") {
    return value as Tier;
  }
  return null;
}

export const TIER_LIMITS = {
  anonymous: {
    messages_per_day: 0, // Soft gate on first send
    memory: false,
    voice: false,
    files: false,
    rooms: false,
  },
  free: {
    messages_per_day: 25,
    memory: true, // Session memory only
    voice: false,
    files: false,
    rooms: false,
  },
  sanctuary: {
    messages_per_day: Infinity,
    memory: true, // Persistent memory
    voice: true,
    files: true,
    rooms: true,
  },
} as const;

export const TIER_FEATURES = {
  anonymous: ["basic_chat"],
  free: ["basic_chat", "session_memory", "extended_conversation"],
  sanctuary: [
    "basic_chat",
    "session_memory",
    "extended_conversation",
    "persistent_memory",
    "voice",
    "file_uploads",
    "sanctuary_rooms",
    "unlimited_messages",
  ],
} as const;

export function canAccessFeature(tier: Tier, feature: string): boolean {
  return TIER_FEATURES[tier].includes(feature as any);
}

export function getMessageLimit(tier: Tier): number {
  return TIER_LIMITS[tier].messages_per_day;
}
