import type { Intent, NavigationResult } from './types';
import { COMMAND_REGISTRY } from './commandRegistry';

export function routeAction(intent: Intent): NavigationResult {
  const cmd = COMMAND_REGISTRY.find((c) => c.id === intent.action);

  if (!cmd) {
    return {
      voiceResponse: "I couldn't find the right place for that.",
      shouldSpeak: true,
    };
  }

  return {
    navigateTo: {
      room: cmd.route.room,
      view: cmd.route.view,
    },
    voiceResponse: cmd.voiceResponse,
    shouldSpeak: true,
  };
}
