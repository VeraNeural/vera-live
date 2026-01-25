'use client';

import { useEffect, useRef } from 'react';
import { X, Shield, Lock, Download } from 'lucide-react';
import { DataExportButton } from '@/components/settings/DataExportButton';
import { DeleteAccountSection } from '@/components/settings/DeleteAccountSection';

interface PrivacySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export function PrivacySettingsModal({ isOpen, onClose, isDark }: PrivacySettingsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Trap focus
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const colors = {
    bg: isDark ? 'rgba(17, 24, 39, 0.98)' : 'rgba(255, 255, 255, 0.98)',
    card: isDark ? '#1f2937' : '#f9fafb',
    border: isDark ? '#374151' : '#e5e7eb',
    text: isDark ? '#f9fafb' : '#111827',
    textSecondary: isDark ? '#9ca3af' : '#6b7280',
    accent: '#2563eb',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div
        ref={modalRef}
        style={{
          background: colors.bg,
          borderRadius: '16px',
          border: `1px solid ${colors.border}`,
          maxWidth: '480px',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield size={22} style={{ color: colors.accent }} />
            <h2
              id="privacy-modal-title"
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 600,
                color: colors.text,
              }}
            >
              Privacy & Data
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              color: colors.textSecondary,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Data Protection Section */}
          <section style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Lock size={16} style={{ color: colors.accent }} />
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: colors.text }}>
                Data Protection
              </h3>
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: '20px',
                fontSize: '13px',
                lineHeight: '1.8',
                color: colors.textSecondary,
              }}
            >
              <li>Your conversations are encrypted in transit</li>
              <li>We never sell your personal data to third parties</li>
              <li>You can delete your data at any time from your account</li>
              <li>Memories are stored only with your consent</li>
            </ul>
          </section>

          {/* Data Export Section */}
          <section style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Download size={16} style={{ color: colors.accent }} />
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: colors.text }}>
                Export Your Data (GDPR/CCPA)
              </h3>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: colors.textSecondary }}>
              Download a copy of all your personal data in a portable JSON format.
              This includes your profile, conversations, memories, and preferences.
            </p>
            <DataExportButton />
          </section>

          {/* Legal Links */}
          <section
            style={{
              paddingTop: '16px',
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            <p style={{ margin: 0, fontSize: '12px', color: colors.textSecondary }}>
              For more information, see our{' '}
              <a
                href="/legal/privacy"
                style={{ color: colors.accent, textDecoration: 'underline' }}
              >
                Privacy Policy
              </a>
              ,{' '}
              <a
                href="/legal/terms"
                style={{ color: colors.accent, textDecoration: 'underline' }}
              >
                Terms of Service
              </a>
              , and{' '}
              <a
                href="/legal/disclaimer"
                style={{ color: colors.accent, textDecoration: 'underline' }}
              >
                Medical Disclaimer
              </a>
              .
            </p>
          </section>

          {/* Delete Account Section */}
          <DeleteAccountSection isDark={isDark} />
        </div>
      </div>
    </div>
  );
}

export default PrivacySettingsModal;
