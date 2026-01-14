// Gate messages - exact copy as specified

export const GATE_MESSAGES = {
  // Anonymous user tries to send first message
  auth_required: {
    type: "auth_required" as const,
    title: "Start free to continue",
    message: "Create a free account to continue this conversation.",
    cta: "Start Free",
    cta_link: "/signup",
  },

  // Free user hits daily limit
  limit_reached: {
    type: "limit_reached" as const,
    title: "You've reached today's limit",
    message:
      "I can stay with you — Sanctuary unlocks longer conversations, saved sessions, and deeper support.",
    cta: "Explore Sanctuary",
    cta_link: "/sanctuary/upgrade",
  },
} as const;

export type GateType = keyof typeof GATE_MESSAGES;
export type GateMessage = (typeof GATE_MESSAGES)[GateType];

// VERA's in-chat response when limit is reached
export const VERA_GATE_RESPONSES = {
  auth_required: null, // Don't send a VERA message, just show the gate UI
  limit_reached:
    "I can stay with you — Sanctuary unlocks longer conversations, saved sessions, and deeper support.",
} as const;

// Sanctuary preview content
export const SANCTUARY_PREVIEW = {
  title: "Sanctuary",
  description:
    "A deeper space for longer conversations, saved sessions, and full access to VERA.",
  features: [
    "Unlimited conversations",
    "Session memory",
    "Voice + file support (coming online)",
    "Private, grounded space",
  ],
  cta_primary: "Enter Sanctuary",
  cta_secondary: "Continue with free",
} as const;
