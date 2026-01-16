import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

/**
 * Get existing session or create new one
 * Returns session ID and whether a cookie needs to be set
 */
export async function getOrCreateSession(): Promise<{
  sessionId: string;
  shouldSetCookie: boolean;
}> {
  const store = await cookies();
  const existing = store.get('vera_sid')?.value;
  if (existing) return { sessionId: existing, shouldSetCookie: false };
  return { sessionId: randomUUID(), shouldSetCookie: true };
}

/**
 * Normalize and validate conversation ID
 * Returns null if invalid
 */
export function normalizeConversationId(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (trimmed.length > 128) return null;
  // Accept only simple identifier characters to avoid header/body injection.
  if (!/^[A-Za-z0-9_-]+$/.test(trimmed)) return null;
  return trimmed;
}

/**
 * Build cookie configuration for vera_sid session cookie
 * 30 days maxAge, httpOnly, secure in production
 */
export function buildSessionCookie(sessionId: string): {
  name: string;
  value: string;
  options: {
    httpOnly: boolean;
    sameSite: 'lax';
    secure: boolean;
    path: string;
    maxAge: number;
  };
} {
  return {
    name: 'vera_sid',
    value: sessionId,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  };
}
