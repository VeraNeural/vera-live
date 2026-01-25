/**
 * Error Sanitization Utility
 * 
 * Prevents internal infrastructure details from leaking to clients.
 * Use this for all user-facing error responses.
 */

const SENSITIVE_PATTERNS = [
  // Internal system names
  /julija/gi,
  /\biba\b/gi,
  /\bsim\b/gi,
  /neural/gi,
  /governance/gi,
  // Technical details
  /supabase/gi,
  /anthropic/gi,
  /openai/gi,
  /postgres/gi,
  /clerk/gi,
  /stripe/gi,
  // File paths
  /\/src\//gi,
  /\/lib\//gi,
  /\/app\//gi,
  /\.tsx?/gi,
  /node_modules/gi,
  // Stack trace patterns
  /at\s+\w+\s+\(/gi,
  /:\d+:\d+\)?$/gm,
  // Internal field names
  /iba_policy/gi,
  /decision_?object/gi,
  /arousal_?state/gi,
  /sanctuary_?state/gi,
  /tier_?resolver/gi,
  /lead_?layer/gi,
];

const GENERIC_MESSAGES: Record<string, string> = {
  auth: 'Authentication required',
  permission: 'Access denied',
  validation: 'Invalid request',
  notfound: 'Not found',
  server: 'Something went wrong. Please try again.',
  default: 'An error occurred',
};

/**
 * Sanitize an error message for user-facing responses.
 * Strips internal details and returns a generic message.
 */
export function sanitizeErrorMessage(
  error: unknown,
  fallbackType: keyof typeof GENERIC_MESSAGES = 'default'
): string {
  if (!error) return GENERIC_MESSAGES[fallbackType];

  const message = error instanceof Error ? error.message : String(error);

  // Check if message contains sensitive patterns
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(message)) {
      return GENERIC_MESSAGES[fallbackType];
    }
  }

  // If message is short and clean, it might be safe
  if (message.length < 100 && !message.includes('/') && !message.includes('\\')) {
    // Additional check for technical jargon
    const lowerMsg = message.toLowerCase();
    if (
      !lowerMsg.includes('undefined') &&
      !lowerMsg.includes('null') &&
      !lowerMsg.includes('type') &&
      !lowerMsg.includes('function') &&
      !lowerMsg.includes('object') &&
      !lowerMsg.includes('column') &&
      !lowerMsg.includes('table') &&
      !lowerMsg.includes('query')
    ) {
      return message;
    }
  }

  return GENERIC_MESSAGES[fallbackType];
}

/**
 * Create a safe error response object for API endpoints.
 */
export function safeErrorResponse(
  error: unknown,
  fallbackType: keyof typeof GENERIC_MESSAGES = 'default'
): { error: string } {
  return { error: sanitizeErrorMessage(error, fallbackType) };
}

/**
 * Check if we're in production mode.
 * Use this to conditionally suppress detailed logging.
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Safe console log that only outputs in development.
 */
export function devLog(label: string, ...args: unknown[]): void {
  if (!isProduction()) {
    console.log(`[${label}]`, ...args);
  }
}

/**
 * Safe console error that sanitizes in production.
 */
export function safeConsoleError(label: string, error: unknown): void {
  if (isProduction()) {
    console.error(`[${label}] Error occurred`);
  } else {
    console.error(`[${label}]`, error);
  }
}
