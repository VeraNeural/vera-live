import fs from "fs";
import path from "path";
import { describe, it } from "vitest";

// Sanctuary is a server-enforced capability state, not a separate chat surface.
// This guardrail intentionally focuses on the primary chat surface + /api/chat.
// It does NOT attempt to police unrelated product pages (e.g. other marketing/feature routes).

const ROOT = path.resolve(__dirname, "../../");

const FILES_TO_SCAN = [
  "src/app/page.tsx",
  "src/components/TrustTransparencySidebar.tsx",
  "src/app/api/chat/route.ts",
].map((p) => path.join(ROOT, p));

const FORBIDDEN_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /href=\{?['\"]\/sanctuary/i, reason: "No /sanctuary navigation from chat surface" },
  { pattern: /router\.push\(\s*['\"]\/sanctuary/i, reason: "No /sanctuary navigation from chat surface" },
  { pattern: /router\.replace\(\s*['\"]\/sanctuary/i, reason: "No /sanctuary navigation from chat surface" },
  { pattern: /\bSanctuaryHub\b/i, reason: "No Sanctuary hub semantics in chat surface" },
  { pattern: /enter\s+sanctuary/i, reason: "No destination framing in chat surface" },
  { pattern: /surface\s*:\s*['\"]sanctuary['\"]/i, reason: "No sanctuary surface field" },
  { pattern: /destination\s*:\s*['\"]sanctuary['\"]/i, reason: "No sanctuary destination field" },
  { pattern: /mode\s*:\s*['\"]sanctuary['\"]/i, reason: "No sanctuary mode field" },
];

describe("Sanctuary surface invariant (chat + /api/chat)", () => {
  it("does not encode Sanctuary as a destination, route, or mode", () => {
    const matches: string[] = [];

    for (const filePath of FILES_TO_SCAN) {
      if (!fs.existsSync(filePath)) {
        matches.push(`${filePath} missing (scan target)`);
        continue;
      }

      const content = fs.readFileSync(filePath, "utf8");
      for (const { pattern, reason } of FORBIDDEN_PATTERNS) {
        if (pattern.test(content)) {
          matches.push(`${filePath} matched ${pattern} (${reason})`);
        }
      }
    }

    if (matches.length > 0) {
      throw new Error(`Sanctuary surface invariant violated:\n\n${matches.join("\n")}`);
    }
  });
});
