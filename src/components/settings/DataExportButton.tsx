'use client';

import { useState, useCallback } from 'react';

type ExportStatus = 'idle' | 'loading' | 'success' | 'error' | 'rate-limited';

interface ExportState {
  status: ExportStatus;
  message?: string;
  retryAfter?: number;
}

export function DataExportButton() {
  const [state, setState] = useState<ExportState>({ status: 'idle' });

  const handleExport = useCallback(async () => {
    setState({ status: 'loading' });

    try {
      const response = await fetch('/api/user/export-data', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 429) {
        const data = await response.json();
        const minutes = Math.ceil((data.retryAfter || 3600) / 60);
        setState({
          status: 'rate-limited',
          message: `Please wait ${minutes} minute${minutes !== 1 ? 's' : ''} before requesting another export.`,
          retryAfter: data.retryAfter,
        });
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Export failed');
      }

      // Trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vera-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setState({ status: 'success', message: 'Your data has been downloaded.' });
      
      // Reset to idle after 5 seconds
      setTimeout(() => {
        setState((prev) => prev.status === 'success' ? { status: 'idle' } : prev);
      }, 5000);

    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Failed to export data',
      });
    }
  }, []);

  const isDisabled = state.status === 'loading' || state.status === 'rate-limited';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <button
        onClick={handleExport}
        disabled={isDisabled}
        style={{
          padding: '12px 20px',
          borderRadius: '8px',
          border: 'none',
          background: isDisabled ? '#374151' : '#2563eb',
          color: isDisabled ? '#9ca3af' : '#ffffff',
          fontSize: '14px',
          fontWeight: 500,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s, transform 0.1s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
        aria-busy={state.status === 'loading'}
      >
        {state.status === 'loading' ? (
          <>
            <LoadingSpinner />
            Preparing Export...
          </>
        ) : (
          <>
            <DownloadIcon />
            Download My Data
          </>
        )}
      </button>

      {state.message && (
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            color: state.status === 'success' ? '#22c55e' :
                   state.status === 'error' ? '#ef4444' :
                   state.status === 'rate-limited' ? '#f59e0b' :
                   '#9ca3af',
          }}
          role={state.status === 'error' ? 'alert' : 'status'}
        >
          {state.message}
        </p>
      )}

      <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
        Export includes your profile, conversations, preferences, and memories.
        Limited to one export per hour.
      </p>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
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
      style={{
        animation: 'spin 1s linear infinite',
      }}
    >
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1" />
    </svg>
  );
}

export default DataExportButton;
