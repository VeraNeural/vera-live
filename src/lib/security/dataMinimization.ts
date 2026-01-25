/**
 * Data Minimization Utilities
 * 
 * HIPAA-aligned data handling that ensures:
 * - API responses return only necessary data (Minimum Necessary Standard)
 * - Sensitive fields are explicitly excluded
 * - Internal processing data is stripped from exports
 * 
 * These functions should be used before sending data to clients
 * or external systems.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface SanitizedUser {
  id: string;
  email?: string;
  created_at?: string;
  subscription_tier?: string;
}

export interface SanitizedConversation {
  id: string;
  title?: string;
  created_at: string;
  updated_at?: string;
  messages: SanitizedMessage[];
}

export interface SanitizedMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export interface SanitizedMemory {
  id: string;
  summary?: string;
  topics?: string[];
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// INTERNAL FIELD LISTS
// ============================================================================

/**
 * Fields that should NEVER be exposed to clients or external systems
 */
const FORBIDDEN_FIELDS = [
  // Internal governance
  'iba_policy',
  'iba_decision',
  'decision_object',
  'arousal_state',
  'arousal_band',
  'sanctuary_state',
  'sim_state',
  'sim_decision',
  'governance_version',
  // Processing metadata
  'lead_layer',
  'tier_resolver',
  'model_selected',
  'model_provenance',
  'execution_path',
  'fallback_used',
  // Internal flags
  'is_internal',
  'debug_info',
  'telemetry',
  'trace_id',
  // System fields
  'service_role',
  'admin_notes',
  'moderation_flags',
];

/**
 * Fields that are sensitive but may be included with explicit consent
 */
const SENSITIVE_FIELDS = [
  'content', // Message content - include in exports, exclude from analytics
  'summary', // Memory summary - include in exports, exclude from analytics
  'facts', // Memory facts - include in exports, exclude from analytics
  'topics', // User topics - include in exports, exclude from analytics
  'name', // User's preferred name - include in exports, exclude from analytics
];

// ============================================================================
// SANITIZATION FUNCTIONS
// ============================================================================

/**
 * Strip forbidden fields from any object
 */
export function stripForbiddenFields<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (FORBIDDEN_FIELDS.includes(key.toLowerCase())) {
      continue; // Skip forbidden fields
    }
    
    // Recursively clean nested objects
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = stripForbiddenFields(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        item && typeof item === 'object'
          ? stripForbiddenFields(item as Record<string, unknown>)
          : item
      );
    } else {
      result[key] = value;
    }
  }
  
  return result as Partial<T>;
}

/**
 * Sanitize user data for API responses
 * Returns only fields needed for frontend display
 */
export function sanitizeUserForResponse(user: Record<string, unknown>): SanitizedUser {
  return {
    id: String(user.id ?? user.clerk_user_id ?? ''),
    email: typeof user.email === 'string' ? user.email : undefined,
    created_at: typeof user.created_at === 'string' ? user.created_at : undefined,
    subscription_tier: typeof user.subscription_tier === 'string' 
      ? user.subscription_tier 
      : typeof user.tier === 'string' 
        ? user.tier 
        : undefined,
  };
}

/**
 * Sanitize conversation for data export (GDPR)
 * Includes user content but strips internal processing data
 */
export function sanitizeConversationForExport(
  conversation: Record<string, unknown>
): SanitizedConversation {
  const messages = Array.isArray(conversation.messages) 
    ? conversation.messages 
    : [];
  
  return {
    id: String(conversation.id ?? ''),
    title: typeof conversation.title === 'string' ? conversation.title : undefined,
    created_at: String(conversation.created_at ?? new Date().toISOString()),
    updated_at: typeof conversation.updated_at === 'string' 
      ? conversation.updated_at 
      : undefined,
    messages: messages
      .filter((m: unknown) => {
        if (!m || typeof m !== 'object') return false;
        const msg = m as Record<string, unknown>;
        // Only include user and assistant messages
        return msg.role === 'user' || msg.role === 'assistant';
      })
      .map((m: unknown) => sanitizeMessageForExport(m as Record<string, unknown>)),
  };
}

/**
 * Sanitize individual message for export
 */
export function sanitizeMessageForExport(
  message: Record<string, unknown>
): SanitizedMessage {
  return {
    id: typeof message.id === 'string' ? message.id : undefined,
    role: (message.role === 'user' || message.role === 'assistant') 
      ? message.role 
      : 'assistant',
    content: typeof message.content === 'string' ? message.content : '',
    created_at: typeof message.created_at === 'string' 
      ? message.created_at 
      : undefined,
  };
}

/**
 * Sanitize memory for export
 */
export function sanitizeMemoryForExport(
  memory: Record<string, unknown>
): SanitizedMemory {
  return {
    id: String(memory.id ?? ''),
    summary: typeof memory.summary === 'string' ? memory.summary : undefined,
    topics: Array.isArray(memory.topics) 
      ? memory.topics.filter((t): t is string => typeof t === 'string')
      : undefined,
    created_at: typeof memory.created_at === 'string' 
      ? memory.created_at 
      : undefined,
    updated_at: typeof memory.updated_at === 'string' 
      ? memory.updated_at 
      : undefined,
  };
}

/**
 * Sanitize data for analytics (no PHI)
 * Strips all content and sensitive identifiers
 */
export function sanitizeForAnalytics(
  data: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    // Skip all forbidden AND sensitive fields for analytics
    if (
      FORBIDDEN_FIELDS.includes(key.toLowerCase()) ||
      SENSITIVE_FIELDS.includes(key.toLowerCase())
    ) {
      continue;
    }
    
    // Skip user identifiers
    if (['user_id', 'clerk_user_id', 'email', 'name', 'ip'].includes(key.toLowerCase())) {
      continue;
    }
    
    result[key] = value;
  }
  
  return result;
}

/**
 * Check if an object contains any forbidden fields
 * Useful for validation before sending to external systems
 */
export function containsForbiddenFields(obj: Record<string, unknown>): string[] {
  const found: string[] = [];
  
  function check(o: Record<string, unknown>, path: string = '') {
    for (const [key, value] of Object.entries(o)) {
      const fullPath = path ? `${path}.${key}` : key;
      
      if (FORBIDDEN_FIELDS.includes(key.toLowerCase())) {
        found.push(fullPath);
      }
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        check(value as Record<string, unknown>, fullPath);
      }
    }
  }
  
  check(obj);
  return found;
}
