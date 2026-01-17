'use client';

import type { JournalPattern, PatternAlert } from '../types';

export interface PatternViewProps {
  onBack?: () => void;
  theme?: 'light' | 'dark';
  embedded?: boolean;
  patterns: JournalPattern[];
  alerts?: PatternAlert[];
  onExplore?: (patternId: string) => void;
  onDismissAlert?: (patternId: string) => void;
}

function severityLabel(severity: PatternAlert['severity']) {
  switch (severity) {
    case 'info':
      return 'Noticed';
    case 'gentle':
      return 'Gentle nudge';
    case 'attention':
      return 'Worth attention';
  }
}

export function PatternView({
  onBack,
  theme = 'dark',
  embedded = false,
  patterns,
  alerts,
  onExplore,
  onDismissAlert,
}: PatternViewProps) {
  const colors = theme === 'dark'
    ? {
        bg: '#0f0d15',
        bgGradient: 'linear-gradient(to bottom, #0f0d15 0%, #1a1625 100%)',
        text: '#e8e6f0',
        textMuted: 'rgba(232, 230, 240, 0.6)',
        textDim: 'rgba(232, 230, 240, 0.4)',
        cardBg: 'rgba(255, 255, 255, 0.03)',
        cardBorder: 'rgba(255, 255, 255, 0.06)',
        accent: '#a855f7',
        accentGlow: 'rgba(168, 85, 247, 0.15)',
      }
    : {
        bg: '#faf9fc',
        bgGradient: 'linear-gradient(to bottom, #faf9fc 0%, #f3f1f8 100%)',
        text: '#1a1625',
        textMuted: 'rgba(26, 22, 37, 0.6)',
        textDim: 'rgba(26, 22, 37, 0.4)',
        cardBg: 'rgba(0, 0, 0, 0.02)',
        cardBorder: 'rgba(0, 0, 0, 0.06)',
        accent: '#9333ea',
        accentGlow: 'rgba(147, 51, 234, 0.1)',
      };

  const visibleAlerts = (alerts ?? []).filter((a) => !a.dismissed);

  return (
    <div
      style={{
        position: embedded ? 'relative' : 'fixed',
        inset: embedded ? undefined : 0,
        background: colors.bgGradient,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        borderRadius: embedded ? 20 : undefined,
        border: embedded ? `1px solid ${colors.cardBorder}` : undefined,
        overflow: embedded ? 'hidden' : undefined,
      }}
    >
      {!embedded && (
        <div
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${colors.cardBorder}`,
          }}
        >
          <button
            onClick={onBack}
            disabled={!onBack}
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '12px',
              padding: '10px 16px',
              color: colors.textMuted,
              fontSize: '14px',
              cursor: onBack ? 'pointer' : 'default',
              opacity: onBack ? 1 : 0.6,
            }}
          >
            ← Back
          </button>

          <div style={{ color: colors.textDim, fontSize: 13 }}>{patterns.length} patterns</div>
        </div>
      )}

      <div
        style={{
          flex: embedded ? undefined : 1,
          overflowY: embedded ? 'visible' : 'auto',
          padding: embedded ? '20px' : '24px',
          maxWidth: 820,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginTop: 8, marginBottom: 22 }}>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '32px',
              fontWeight: 300,
              color: colors.text,
              marginBottom: '10px',
            }}
          >
            Patterns
          </h1>
          <p style={{ color: colors.textMuted, fontSize: '16px' }}>
            VERA noticed a few threads worth holding gently.
          </p>
        </div>

        {visibleAlerts.length > 0 && (
          <div style={{ marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visibleAlerts.map((a) => {
              const accent = a.severity === 'attention' ? '#ef4444' : a.severity === 'gentle' ? colors.accent : colors.textDim;
              return (
                <div
                  key={`${a.patternId}:${a.message}`}
                  style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                    borderLeft: `4px solid ${accent}`,
                    borderRadius: '16px',
                    padding: '14px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: colors.textDim, fontSize: 13, marginBottom: 6 }}>{severityLabel(a.severity)}</div>
                    <div style={{ color: colors.text, fontSize: 15, lineHeight: 1.4 }}>{a.message}</div>
                  </div>

                  {onDismissAlert && (
                    <button
                      onClick={() => onDismissAlert(a.patternId)}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: '12px',
                        padding: '8px 10px',
                        color: colors.textMuted,
                        fontSize: 13,
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {patterns.length === 0 ? (
          <div
            style={{
              background: colors.cardBg,
              border: `1px dashed ${colors.cardBorder}`,
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              color: colors.textMuted,
            }}
          >
            No patterns yet. As you write and check in, themes will start to emerge.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: 10 }}>
            {patterns
              .slice()
              .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime())
              .map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                    borderRadius: '16px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: colors.text, fontSize: 16, marginBottom: 6 }}>{p.description}</div>
                      <div style={{ color: colors.textDim, fontSize: 13 }}>
                        Type: {p.type} · Frequency: {String(p.frequency)} · Confidence: {Math.round(p.confidence * 100)}%
                      </div>
                    </div>

                    {onExplore && (
                      <button
                        onClick={() => onExplore(p.id)}
                        style={{
                          background: `linear-gradient(135deg, ${colors.accent}, #7c3aed)`,
                          border: 'none',
                          borderRadius: '12px',
                          padding: '10px 14px',
                          color: '#fff',
                          fontSize: 14,
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        Explore
                      </button>
                    )}
                  </div>

                  <div style={{ marginTop: 12, color: colors.textMuted, fontSize: 14, lineHeight: 1.5 }}>
                    Seen from {p.firstSeen.toLocaleDateString()} to {p.lastSeen.toLocaleDateString()} · {p.entries.length} related entries
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
