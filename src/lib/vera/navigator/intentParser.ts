import type { Intent } from './types';
import { findMatchingCommand, COMMAND_REGISTRY } from './commandRegistry';

function extractContext(message: string, phrases: string[]): string | undefined {
  const messageLower = message.toLowerCase();

  for (const phrase of phrases) {
    const phraseLower = phrase.toLowerCase();
    const idx = messageLower.indexOf(phraseLower);
    if (idx === -1) continue;

    const start = idx + phraseLower.length;
    const context = message.slice(start).trim();
    return context ? context : undefined;
  }

  return undefined;
}

export function parseIntent(message: string): Intent | null {
  const cmd = findMatchingCommand(message);
  if (!cmd) return null;

  const context = extractContext(message, cmd.phrases);

  return {
    action: cmd.id,
    target: cmd.route.room,
    context,
    confidence: 0.9,
  };
}
