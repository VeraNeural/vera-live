'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useClerk } from '@clerk/nextjs';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

type DeletionStatus = 'idle' | 'confirming' | 'deleting' | 'success' | 'error';

interface DeletionState {
  status: DeletionStatus;
  message?: string;
}

const CONFIRMATION_PHRASE = 'DELETE MY ACCOUNT';

export function DeleteAccountSection({ isDark = true }: { isDark?: boolean }) {
  const [state, setState] = useState<DeletionState>({ status: 'idle' });
  const [confirmationInput, setConfirmationInput] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const { signOut } = useClerk();

  const colors = {
    bg: isDark ? 'rgba(17, 24, 39, 0.98)' : 'rgba(255, 255, 255, 0.98)',
    card: isDark ? '#1f2937' : '#f9fafb',
    border: isDark ? '#374151' : '#e5e7eb',
    text: isDark ? '#f9fafb' : '#111827',
    textSecondary: isDark ? '#9ca3af' : '#6b7280',
    danger: '#dc2626',
    dangerHover: '#b91c1c',
    dangerBg: isDark ? 'rgba(220, 38, 38, 0.1)' : 'rgba(220, 38, 38, 0.05)',
  };

  // Close modal on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.status === 'confirming') {
        setState({ status: 'idle' });
        setConfirmationInput('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.status]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && state.status === 'confirming') {
        setState({ status: 'idle' });
        setConfirmationInput('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [state.status]);

  const handleDeleteRequest = useCallback(() => {
    setState({ status: 'confirming' });
    setConfirmationInput('');
  }, []);

  const handleCancelDelete = useCallback(() => {
    setState({ status: 'idle' });
    setConfirmationInput('');
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (confirmationInput !== CONFIRMATION_PHRASE) {
      setState({
        status: 'confirming',
        message: `Please type exactly: ${CONFIRMATION_PHRASE}`,
      });
      return;
    }

    setState({ status: 'deleting' });

    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ confirmation: CONFIRMATION_PHRASE }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete account');
      }

      setState({ status: 'success', message: 'Account deleted. Redirecting...' });

      // Sign out and redirect after brief delay
      setTimeout(async () => {
        try {
          await signOut();
        } catch {
          // Clerk user already deleted, just redirect
          window.location.href = '/';
        }
      }, 2000);

    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete account',
      });
    }
  }, [confirmationInput, signOut]);

  const isConfirmDisabled = confirmationInput !== CONFIRMATION_PHRASE;

  return (
    <>
      {/* Danger Zone Section */}
      <div
        style={{
          marginTop: '32px',
          padding: '20px',
          borderRadius: '12px',
          border: `1px solid ${colors.danger}30`,
          background: colors.dangerBg,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <AlertTriangle size={18} style={{ color: colors.danger }} />
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: colors.danger }}>
            Danger Zone
          </h3>
        </div>

        <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: colors.textSecondary }}>
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>

        <button
          onClick={handleDeleteRequest}
          disabled={state.status === 'deleting'}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: `1px solid ${colors.danger}`,
            background: 'transparent',
            color: colors.danger,
            fontSize: '14px',
            fontWeight: 500,
            cursor: state.status === 'deleting' ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.danger;
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = colors.danger;
          }}
        >
          <Trash2 size={16} />
          Delete My Account
        </button>
      </div>

      {/* Confirmation Modal */}
      {(state.status === 'confirming' || state.status === 'deleting' || state.status === 'success') && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div
            ref={modalRef}
            style={{
              background: colors.bg,
              borderRadius: '16px',
              border: `1px solid ${colors.danger}50`,
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
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
                <AlertTriangle size={22} style={{ color: colors.danger }} />
                <h2
                  id="delete-modal-title"
                  style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: colors.danger }}
                >
                  Delete Account
                </h2>
              </div>
              {state.status === 'confirming' && (
                <button
                  onClick={handleCancelDelete}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px',
                    cursor: 'pointer',
                    color: colors.textSecondary,
                    borderRadius: '8px',
                    display: 'flex',
                  }}
                  aria-label="Cancel"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              {state.status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ margin: 0, fontSize: '16px', color: colors.text }}>
                    ✓ {state.message}
                  </p>
                </div>
              ) : (
                <>
                  <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: colors.text, lineHeight: 1.6 }}>
                    This will <strong>permanently delete</strong> your account and all associated data including:
                  </p>

                  <ul style={{
                    margin: '0 0 20px 0',
                    paddingLeft: '20px',
                    fontSize: '13px',
                    color: colors.textSecondary,
                    lineHeight: 1.8,
                  }}>
                    <li>Your conversation history</li>
                    <li>Saved memories and insights</li>
                    <li>Preferences and settings</li>
                    <li>Active subscription (will be cancelled and prorated)</li>
                  </ul>

                  <div style={{
                    padding: '16px',
                    background: colors.dangerBg,
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: `1px solid ${colors.danger}20`,
                  }}>
                    <p style={{ margin: 0, fontSize: '13px', color: colors.danger, fontWeight: 500 }}>
                      ⚠️ This action cannot be undone.
                    </p>
                  </div>

                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: colors.text }}>
                    Type <strong>{CONFIRMATION_PHRASE}</strong> to confirm:
                  </label>

                  <input
                    type="text"
                    value={confirmationInput}
                    onChange={(e) => setConfirmationInput(e.target.value)}
                    placeholder={CONFIRMATION_PHRASE}
                    disabled={state.status === 'deleting'}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: `1px solid ${state.message && state.status === 'confirming' ? colors.danger : colors.border}`,
                      background: colors.card,
                      color: colors.text,
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                    autoComplete="off"
                    spellCheck={false}
                  />

                  {state.message && state.status === 'confirming' && (
                    <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: colors.danger }}>
                      {state.message}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {state.status !== 'success' && (
              <div style={{
                display: 'flex',
                gap: '12px',
                padding: '16px 24px',
                borderTop: `1px solid ${colors.border}`,
                justifyContent: 'flex-end',
              }}>
                <button
                  onClick={handleCancelDelete}
                  disabled={state.status === 'deleting'}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    background: 'transparent',
                    color: colors.text,
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: state.status === 'deleting' ? 'not-allowed' : 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isConfirmDisabled || state.status === 'deleting'}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isConfirmDisabled ? colors.border : colors.danger,
                    color: isConfirmDisabled ? colors.textSecondary : '#ffffff',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: isConfirmDisabled || state.status === 'deleting' ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {state.status === 'deleting' ? (
                    <>
                      <LoadingSpinner />
                      Deleting...
                    </>
                  ) : (
                    'Delete Permanently'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Toast */}
      {state.status === 'error' && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '16px 20px',
          background: colors.danger,
          color: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          zIndex: 10001,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span>{state.message}</span>
          <button
            onClick={() => setState({ status: 'idle' })}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}

function LoadingSpinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1" />
    </svg>
  );
}

export default DeleteAccountSection;
