// JULIJA - Justification & Audit Trail

import { v4 as uuidv4 } from 'uuid';

export interface JustificationInput {
  userId: string;
  userTier: string;
  riskBand: string;
  authorized: boolean;
  reason: string;
  sessionId?: string;
  messageHash?: string;
}

export interface JustificationRecord {
  id: string;
  timestamp: string;
  userId: string;
  userTier: string;
  riskBand: string;
  authorized: boolean;
  reason: string;
  sessionId: string;
  messageHash: string;
}

/**
 * Creates an audit trail record for every JULIJA authorization decision
 * This provides accountability and traceability for all interactions
 */
export function createJustification(input: JustificationInput): JustificationRecord {
  const {
    userId,
    userTier,
    riskBand,
    authorized,
    reason,
    sessionId = 'unknown',
    messageHash = '',
  } = input;

  const record: JustificationRecord = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    userId,
    userTier,
    riskBand,
    authorized,
    reason,
    sessionId,
    messageHash,
  };

  // Log for audit trail (dev only; in production, this would go to a database)
  if (process.env.NODE_ENV === 'development') {
    console.log('[JULIJA AUDIT]', JSON.stringify(record));
  }

  return record;
}

/**
 * Hash message content for privacy-preserving audit logs
 * We don't store actual message content, just a hash for traceability
 */
export function hashMessage(content: string): string {
  // Simple hash for demo - in production use crypto
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `msg_${Math.abs(hash).toString(16)}`;
}