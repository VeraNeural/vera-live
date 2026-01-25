/**
 * Cookie Consent Management
 * 
 * GDPR/ePrivacy compliant consent storage and management.
 * Stores user preferences in localStorage with the following categories:
 * - necessary: Always true (session, auth, security)
 * - analytics: GA4 and similar analytics tools
 * - marketing: Meta Pixel, TikTok Pixel, ad retargeting
 */

export interface CookieConsent {
  necessary: true; // Always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
  timestamp: string; // ISO timestamp when consent was given
  version: string; // Consent version for policy updates
}

const STORAGE_KEY = 'vera-cookie-consent';
const CONSENT_VERSION = '1.0';

const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: '',
  version: CONSENT_VERSION,
};

/**
 * Check if running in browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/**
 * Get current consent preferences from localStorage
 */
export function getConsent(): CookieConsent {
  if (!isBrowser()) {
    return DEFAULT_CONSENT;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_CONSENT;
    }

    const parsed = JSON.parse(stored) as CookieConsent;
    
    // Ensure necessary is always true
    parsed.necessary = true;
    
    // Check if consent version matches (for policy updates)
    if (parsed.version !== CONSENT_VERSION) {
      // Policy updated - user needs to re-consent
      return DEFAULT_CONSENT;
    }

    return parsed;
  } catch {
    return DEFAULT_CONSENT;
  }
}

/**
 * Save consent preferences to localStorage
 */
export function setConsent(preferences: Partial<Omit<CookieConsent, 'necessary' | 'timestamp' | 'version'>>): void {
  if (!isBrowser()) {
    return;
  }

  const consent: CookieConsent = {
    necessary: true, // Always true
    analytics: preferences.analytics ?? false,
    marketing: preferences.marketing ?? false,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    
    // Dispatch custom event for reactive updates
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: consent }));
  } catch (err) {
    console.error('[CookieConsent] Failed to save consent:', err);
  }
}

/**
 * Accept all cookie categories
 */
export function acceptAll(): void {
  setConsent({
    analytics: true,
    marketing: true,
  });
}

/**
 * Accept only necessary cookies (reject optional)
 */
export function acceptNecessaryOnly(): void {
  setConsent({
    analytics: false,
    marketing: false,
  });
}

/**
 * Check if user has made any consent choice
 */
export function hasConsented(): boolean {
  if (!isBrowser()) {
    return false;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return false;
    }

    const parsed = JSON.parse(stored) as CookieConsent;
    
    // Check for valid timestamp (indicates user made a choice)
    if (!parsed.timestamp) {
      return false;
    }

    // Check if consent version matches current policy
    if (parsed.version !== CONSENT_VERSION) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Revoke consent and reset to defaults
 * User will be prompted again for consent
 */
export function revokeConsent(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    
    // Dispatch event to trigger UI update
    window.dispatchEvent(new CustomEvent('cookie-consent-revoked'));
  } catch (err) {
    console.error('[CookieConsent] Failed to revoke consent:', err);
  }
}

/**
 * Check if a specific category is consented
 */
export function hasConsentFor(category: 'necessary' | 'analytics' | 'marketing'): boolean {
  const consent = getConsent();
  
  // Necessary is always true
  if (category === 'necessary') {
    return true;
  }
  
  // Other categories require explicit consent
  if (!hasConsented()) {
    return false;
  }
  
  return consent[category] === true;
}

/**
 * Get human-readable consent summary
 */
export function getConsentSummary(): string {
  if (!hasConsented()) {
    return 'No consent given';
  }

  const consent = getConsent();
  const enabled: string[] = ['Necessary'];
  
  if (consent.analytics) enabled.push('Analytics');
  if (consent.marketing) enabled.push('Marketing');
  
  return enabled.join(', ');
}
