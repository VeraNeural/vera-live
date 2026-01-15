export type FinalizeSimState = 'stable' | 'strained' | 'overloaded' | 'protected';

const REQUIRED_EXIT_LINES = [
  'We can pause here.',
  'If this feels like too much, we can slow it down.',
  'You can switch back at any time.',
];

const DEFAULT_FALLBACK = "I'm here with you. What would you like to explore?";

function normalizeLineBreaks(input: string): string {
  return (input ?? '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function stripInternalBlocks(input: string): string {
  // Strip full NEURAL block if present.
  const withoutNeural = input.replace(/\[\[NEURAL\]\][\s\S]*?\[\[\/NEURAL\]\]/gi, '');

  // Prefer explicit VERA block content if present.
  const veraMatch = withoutNeural.match(/\[\[VERA\]\]([\s\S]*?)\[\[\/VERA\]\]/i);
  if (veraMatch && typeof veraMatch[1] === 'string') {
    return veraMatch[1];
  }

  // Otherwise, strip any stray VERA markers.
  return withoutNeural
    .replace(/\[\[VERA\]\]/gi, '')
    .replace(/\[\[\/VERA\]\]/gi, '');
}

function lastNonEmptyLine(text: string): string {
  const lines = (text ?? '')
    .split(/\n+/g)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length ? lines[lines.length - 1] : '';
}

function buildFallback(iba_active: boolean): string {
  if (!iba_active) return DEFAULT_FALLBACK;
  return [DEFAULT_FALLBACK, '', 'You can switch back at any time.'].join('\n');
}

export function finalizeResponse(input: {
  text: string;
  iba_active: boolean;
  sim_state: FinalizeSimState;
}): { text: string; finalize_passed: boolean; finalize_violations?: string[] } {
  try {
    const raw = typeof input?.text === 'string' ? input.text : '';
    const normalized = normalizeLineBreaks(raw);
    const stripped = stripInternalBlocks(normalized);

    const cleaned = stripped
      // Defensive: remove any leftover internal markers.
      .replace(/\[\[(?:NEURAL|VERA)\]\]/gi, '')
      .replace(/\[\[\/(?:NEURAL|VERA)\]\]/gi, '')
      .trim();

    const violations: string[] = [];

    if (!cleaned) {
      violations.push('empty_text');
    }

    if (/\[\[(?:NEURAL|VERA)\]\]/i.test(cleaned) || /\[\[\/(?:NEURAL|VERA)\]\]/i.test(cleaned)) {
      violations.push('internal_tags_present');
    }

    if (Boolean(input?.iba_active)) {
      const last = lastNonEmptyLine(cleaned);
      const ok = REQUIRED_EXIT_LINES.some((l) => l === last);
      if (!ok) violations.push('missing_exit_line');
    }

    if (violations.length) {
      return {
        text: buildFallback(Boolean(input?.iba_active)),
        finalize_passed: false,
        finalize_violations: violations,
      };
    }

    return { text: cleaned, finalize_passed: true };
  } catch {
    return {
      text: buildFallback(Boolean((input as any)?.iba_active)),
      finalize_passed: false,
      finalize_violations: ['exception'],
    };
  }
}
