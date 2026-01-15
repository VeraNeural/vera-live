import fs from "fs";
import path from "path";
import { describe, it } from "vitest";

const ROOT = path.resolve(__dirname, "../../");

const FORBIDDEN_PATTERNS = [
  /enter[_-]?sanctuary/i,
  /sanctuary[_-]?page/i,
  /sanctuary[_-]?hub/i,
  /sanctuary[_-]?route/i,
  /mode:\s*["']sanctuary["']/i,
  /surface:\s*["']sanctuary["']/i,
  /destination:\s*["']sanctuary["']/i,
];

function scanDir(dir: string, matches: string[] = []) {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath, matches);
    } else if (
      entry.endsWith(".ts") ||
      entry.endsWith(".tsx") ||
      entry.endsWith(".js")
    ) {
      const content = fs.readFileSync(fullPath, "utf8");
      FORBIDDEN_PATTERNS.forEach((pattern) => {
        if (pattern.test(content)) {
          matches.push(`${fullPath} matched ${pattern}`);
        }
      });
    }
  }
  return matches;
}

describe("Sanctuary surface invariant", () => {
  it("Sanctuary must not be represented as a route, page, mode, or destination", () => {
    const matches = scanDir(ROOT);
    if (matches.length > 0) {
      throw new Error(
        "Sanctuary surface invariant violated:\n\n" +
          matches.join("\n")
      );
    }
  });
});
