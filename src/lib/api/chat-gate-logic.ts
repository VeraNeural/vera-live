import { GATE_MESSAGES, VERA_GATE_RESPONSES } from "@/lib/auth/gateMessages";
import { checkMessageLimit } from "@/lib/auth/messageCounter";

export type ChatGateResult =
  | { gated: false }
  | { gated: true; content: string };

// This is designed to be called inside `src/app/api/chat/route.ts`.
// Minimal behavior:
// - Count messages server-side
// - If over limit, return a gate message *as normal chat content*
export async function maybeGateChat(opts: {
  userId: string | null;
}): Promise<ChatGateResult> {
  const decision = await checkMessageLimit(opts.userId);
  if (decision.allowed) return { gated: false };

  if (decision.gate === "auth_required") {
    // We keep returning a plain string for now (route contract is `{ content: string }`).
    // UI can later choose to render a gate card using `GATE_MESSAGES.auth_required`.
    return { gated: true, content: GATE_MESSAGES.auth_required.message };
  }

  if (decision.gate === "limit_reached") {
    return { gated: true, content: VERA_GATE_RESPONSES.limit_reached };
  }

  return { gated: true, content: VERA_GATE_RESPONSES.limit_reached };
}
