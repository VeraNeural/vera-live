'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const DISMISS_KEY = 'vera.pwa.a2hs.dismissed.v1';

function isIos(): boolean {
  if (typeof window === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  // iOS Safari
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navAny = window.navigator as any;
  if (typeof navAny.standalone === 'boolean') return navAny.standalone;
  return window.matchMedia?.('(display-mode: standalone)')?.matches ?? false;
}

export default function PwaClient() {
  const pathname = usePathname();
  const isSanctuaryRoute = useMemo(() => pathname?.startsWith('/sanctuary') ?? false, [pathname]);

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(true);
  const [standalone, setStandalone] = useState(true);

  useEffect(() => {
    if (!isSanctuaryRoute) return;

    setStandalone(isStandalone());

    try {
      setDismissed(window.localStorage.getItem(DISMISS_KEY) === '1');
    } catch {
      setDismissed(false);
    }
  }, [isSanctuaryRoute]);

  // Register service worker (production only)
  useEffect(() => {
    if (!isSanctuaryRoute) return;
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw.js')
      .catch(() => {
        // No-op: PWA should never break the app
      });
  }, [isSanctuaryRoute]);

  // Capture A2HS prompt (Chromium)
  useEffect(() => {
    if (!isSanctuaryRoute) return;
    if (typeof window === 'undefined') return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [isSanctuaryRoute]);

  const canShow = isSanctuaryRoute && !standalone && !dismissed;
  const showInstall = Boolean(deferredPrompt);
  const showIosHelp = !showInstall && isIos();

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // ignore
    }
  };

  const install = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } finally {
      setDeferredPrompt(null);
      dismiss();
    }
  };

  if (!canShow) return null;

  return (
    <div
      role="dialog"
      aria-label="Install VERA"
      style={{
        position: 'fixed',
        left: 12,
        right: 12,
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
        zIndex: 2000,
        borderRadius: 16,
        background: 'rgba(18, 12, 30, 0.90)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        color: 'rgba(255, 255, 255, 0.92)',
        padding: 12,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: '0 16px 60px rgba(0,0,0,0.45)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.01em' }}>Install VERA</div>
          {showInstall ? (
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4, lineHeight: 1.35 }}>
              Add VERA to your home screen for a faster, native-feeling Sanctuary.
            </div>
          ) : showIosHelp ? (
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4, lineHeight: 1.35 }}>
              On iPhone/iPad: tap Share, then “Add to Home Screen”.
            </div>
          ) : (
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4, lineHeight: 1.35 }}>
              You can install VERA from your browser menu.
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.14)',
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.88)',
            fontSize: 18,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          ×
        </button>
      </div>

      {showInstall && (
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button
            type="button"
            onClick={install}
            style={{
              flex: 1,
              minHeight: 44,
              borderRadius: 14,
              border: '1px solid rgba(255, 255, 255, 0.14)',
              background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
              color: 'white',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Add to Home Screen
          </button>
          <button
            type="button"
            onClick={dismiss}
            style={{
              minHeight: 44,
              padding: '0 14px',
              borderRadius: 14,
              border: '1px solid rgba(255, 255, 255, 0.14)',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.92)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Not now
          </button>
        </div>
      )}
    </div>
  );
}
