// Thinking Mode runtime resolution order (read-only reference)
// Do not wire or execute; deterministic policy declaration only.

export const THINKING_MODE_RESOLUTION_STEPS = [
  'explicit-user-selection',
  'implicit-system-override',
  'activity-default',
  'fail-closed-fallback',
] as const;

export type ThinkingModeResolutionStep = (typeof THINKING_MODE_RESOLUTION_STEPS)[number];

// Resolution step guards (documentation only):
// 1) Explicit user-selected mode
//    - Only applies when surfacing === "explicit" AND overrides are allowed.
//    - Skip when surfacing is hidden/implicit or overrides are not permitted.
//
// 2) Implicit system override
//    - Only applies when surfacing === "implicit" AND overrides are allowed.
//    - Skip when surfacing is explicit/hidden or overrides are not permitted.
//
// 3) Activity default thinking mode
//    - Applies whenever no higher-priority mode is eligible.
//
// 4) Fail-closed fallback to Activity default
//    - Ensures deterministic selection even if upstream inputs are invalid,
//      missing, or incompatible with the activity.
//    - This fallback exists to prevent accidental activation of unsupported modes.

export const THINKING_MODE_RESOLUTION_NOTES = {
  explicitUserSelection:
    'Use only when surfacing is explicit and overrides are allowed; otherwise skip.',
  implicitSystemOverride:
    'Use only when surfacing is implicit and overrides are allowed; otherwise skip.',
  activityDefault:
    'Use when no higher-priority eligible mode is present.',
  failClosedFallback:
    'Always fall back to activity default to avoid unsupported modes.',
} as const;
