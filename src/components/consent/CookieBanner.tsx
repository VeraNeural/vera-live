'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Cookie, Shield, BarChart3, Target } from 'lucide-react';
import {
  hasConsented,
  acceptAll,
  setConsent,
  getConsent,
  type CookieConsent,
} from '@/lib/consent/cookieConsent';

type BannerState = 'hidden' | 'banner' | 'preferences';

export function CookieBanner() {
  const [state, setState] = useState<BannerState>('hidden');
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
  });

  // Check consent status on mount
  useEffect(() => {
    if (!hasConsented()) {
      setState('banner');
    } else {
      const consent = getConsent();
      setPreferences({
        analytics: consent.analytics,
        marketing: consent.marketing,
      });
    }
  }, []);

  // Listen for consent revocation
  useEffect(() => {
    const handleRevoke = () => {
      setState('banner');
      setPreferences({ analytics: false, marketing: false });
    };

    window.addEventListener('cookie-consent-revoked', handleRevoke);
    return () => window.removeEventListener('cookie-consent-revoked', handleRevoke);
  }, []);

  const handleAcceptAll = useCallback(() => {
    acceptAll();
    setState('hidden');
  }, []);

  const handleSavePreferences = useCallback(() => {
    setConsent(preferences);
    setState('hidden');
  }, [preferences]);

  const handleRejectOptional = useCallback(() => {
    setConsent({ analytics: false, marketing: false });
    setState('hidden');
  }, []);

  if (state === 'hidden') {
    return null;
  }

  return (
    <>
      {/* Main Banner */}
      {state === 'banner' && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Cookie consent"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9998,
            background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(17,24,39,0.98))',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '20px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <Cookie size={24} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600, color: '#f9fafb' }}>
                  We value your privacy
                </h2>
                <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af', lineHeight: 1.6 }}>
                  We use cookies to improve your experience and analyze site traffic. 
                  You can choose which cookies to accept or reject optional cookies.
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <button
                onClick={() => setState('preferences')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'transparent',
                  color: '#d1d5db',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Manage Preferences
              </button>
              <button
                onClick={handleRejectOptional}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'transparent',
                  color: '#d1d5db',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Reject Optional
              </button>
              <button
                onClick={handleAcceptAll}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Accept All
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
              By clicking "Accept All", you consent to our use of cookies.{' '}
              <a href="/privacy" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {state === 'preferences' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-preferences-title"
        >
          <div
            style={{
              background: 'rgba(17,24,39,0.98)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              maxWidth: '520px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Cookie size={22} style={{ color: '#f59e0b' }} />
                <h2
                  id="cookie-preferences-title"
                  style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#f9fafb' }}
                >
                  Cookie Preferences
                </h2>
              </div>
              <button
                onClick={() => setState('banner')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  borderRadius: '8px',
                  display: 'flex',
                }}
                aria-label="Back to banner"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cookie Categories */}
            <div style={{ padding: '24px' }}>
              <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#9ca3af', lineHeight: 1.6 }}>
                Choose which cookies you want to accept. Your choices will be saved and you can change them anytime in our Privacy settings.
              </p>

              {/* Necessary Cookies */}
              <CookieCategory
                icon={<Shield size={18} />}
                title="Necessary Cookies"
                description="Essential for the website to function. These cannot be disabled."
                examples="Authentication, security, session management"
                checked={true}
                disabled={true}
                onChange={() => {}}
              />

              {/* Analytics Cookies */}
              <CookieCategory
                icon={<BarChart3 size={18} />}
                title="Analytics Cookies"
                description="Help us understand how visitors interact with our website."
                examples="Google Analytics (GA4)"
                checked={preferences.analytics}
                disabled={false}
                onChange={(checked) => setPreferences(p => ({ ...p, analytics: checked }))}
              />

              {/* Marketing Cookies */}
              <CookieCategory
                icon={<Target size={18} />}
                title="Marketing Cookies"
                description="Used for advertising and retargeting purposes."
                examples="Meta Pixel, TikTok Pixel"
                checked={preferences.marketing}
                disabled={false}
                onChange={(checked) => setPreferences(p => ({ ...p, marketing: checked }))}
              />
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                padding: '16px 24px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={handleRejectOptional}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'transparent',
                  color: '#d1d5db',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Reject All Optional
              </button>
              <button
                onClick={handleSavePreferences}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface CookieCategoryProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  examples: string;
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}

function CookieCategory({
  icon,
  title,
  description,
  examples,
  checked,
  disabled,
  onChange,
}: CookieCategoryProps) {
  const id = title.toLowerCase().replace(/\s+/g, '-');

  return (
    <div
      style={{
        padding: '16px',
        marginBottom: '12px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
          <div style={{ color: checked ? '#22c55e' : '#6b7280', marginTop: '2px' }}>
            {icon}
          </div>
          <div>
            <label
              htmlFor={id}
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#f9fafb',
                marginBottom: '4px',
                cursor: disabled ? 'default' : 'pointer',
              }}
            >
              {title}
              {disabled && (
                <span style={{ fontSize: '11px', color: '#22c55e', marginLeft: '8px', fontWeight: 400 }}>
                  Always Active
                </span>
              )}
            </label>
            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#9ca3af', lineHeight: 1.5 }}>
              {description}
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>
              Examples: {examples}
            </p>
          </div>
        </div>
        
        {/* Toggle Switch */}
        <label
          htmlFor={id}
          style={{
            position: 'relative',
            width: '44px',
            height: '24px',
            flexShrink: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          <input
            id={id}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            style={{
              position: 'absolute',
              opacity: 0,
              width: 0,
              height: 0,
            }}
          />
          <span
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '12px',
              background: checked ? '#22c55e' : '#374151',
              transition: 'background 0.2s',
              opacity: disabled ? 0.6 : 1,
            }}
          />
          <span
            style={{
              position: 'absolute',
              top: '2px',
              left: checked ? '22px' : '2px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#ffffff',
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
          />
        </label>
      </div>
    </div>
  );
}

export default CookieBanner;
