/**
 * Encryption Utility for Sensitive Data
 * 
 * HIPAA-aligned encryption for sensitive fields that require
 * additional protection beyond database-level encryption.
 * 
 * Uses AES-256-GCM for authenticated encryption.
 * 
 * IMPORTANT: This is for application-level field encryption.
 * Supabase already provides encryption at rest for the entire database.
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits
const SALT_LENGTH = 32;
const KEY_LENGTH = 32; // 256 bits

/**
 * Get or derive encryption key from environment
 * Uses scrypt for key derivation if a passphrase is provided
 */
function getEncryptionKey(): Buffer {
  const keyHex = process.env.ENCRYPTION_KEY;
  
  if (!keyHex) {
    throw new Error(
      'Missing ENCRYPTION_KEY environment variable. ' +
      'Generate with: openssl rand -hex 32'
    );
  }
  
  // If the key is already 64 hex chars (32 bytes), use directly
  if (keyHex.length === 64) {
    return Buffer.from(keyHex, 'hex');
  }
  
  // Otherwise, derive a key using scrypt
  const salt = process.env.ENCRYPTION_SALT || 'vera-default-salt-change-in-prod';
  return scryptSync(keyHex, salt, KEY_LENGTH);
}

/**
 * Check if encryption is configured
 */
export function isEncryptionConfigured(): boolean {
  return Boolean(process.env.ENCRYPTION_KEY);
}

/**
 * Encrypt sensitive data using AES-256-GCM
 * 
 * @param plaintext - The data to encrypt
 * @returns Encrypted string in format: iv:authTag:ciphertext (all hex encoded)
 * 
 * @example
 * const encrypted = encryptSensitiveData('user-sensitive-info');
 * // Returns: "abc123...:def456...:ghi789..."
 */
export function encryptSensitiveData(plaintext: string): string {
  if (!plaintext) return '';
  
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  
  const cipher = createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Format: iv:authTag:ciphertext
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt sensitive data encrypted with encryptSensitiveData
 * 
 * @param encryptedData - Encrypted string from encryptSensitiveData
 * @returns Decrypted plaintext
 * @throws Error if decryption fails (tampered or wrong key)
 */
export function decryptSensitiveData(encryptedData: string): string {
  if (!encryptedData) return '';
  
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }
  
  const [ivHex, authTagHex, ciphertext] = parts;
  
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Safely try to decrypt data, returning null if decryption fails
 * Useful for migrating from unencrypted to encrypted storage
 */
export function tryDecrypt(data: string): string | null {
  if (!data) return null;
  
  // Check if it looks like encrypted data (iv:authTag:ciphertext format)
  const parts = data.split(':');
  if (parts.length !== 3 || parts[0].length !== 32) {
    // Doesn't look encrypted, return as-is
    return data;
  }
  
  try {
    return decryptSensitiveData(data);
  } catch {
    // Decryption failed, might be plaintext that happens to have colons
    return data;
  }
}

/**
 * Hash sensitive data for logging/auditing without reversibility
 * Uses same approach as audit logger for consistency
 */
export function hashForAudit(data: string): string {
  if (!data) return '';
  
  const { createHash } = require('crypto');
  const salt = process.env.AUDIT_HASH_SALT || 'vera-audit-salt-2026';
  const hash = createHash('sha256')
    .update(salt + data)
    .digest('hex');
  
  return hash.substring(0, 16);
}

/**
 * Generate a new encryption key (for setup/rotation)
 * Returns hex-encoded 32-byte key
 */
export function generateEncryptionKey(): string {
  return randomBytes(32).toString('hex');
}
