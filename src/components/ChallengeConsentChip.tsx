'use client';

import { useMemo, useState } from 'react';

type Choice = 'challenge_on' | 'challenge_off';

export interface ChallengeConsentChipProps {
  onAccept: () => void;
  onDecline: () => void;
  explanation?: string;
  disabled?: boolean;
}

export default function ChallengeConsentChip({
  onAccept,
  onDecline,
  explanation,
  disabled = false,
}: ChallengeConsentChipProps) {
  const [expanded, setExpanded] = useState(false);

  const copy = useMemo(
    () => ({
      label: 'OPTIONAL',
      prompt: 'Want a more direct take?',
      subtext: 'Direct and grounded, never harsh.',
      accept: 'Challenge me',
      decline: 'Keep it supportive',
      why: 'Why am I seeing this?',
      whyText:
        explanation ||
        'You’ve been circling this. If you want, I can challenge the pattern constructively.',
    }),
    [explanation]
  );

  return (
    <div
      aria-label="Challenge consent"
      style={{
        maxWidth: 560,
        margin: '14px 0',
        padding: '14px 14px 12px',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(14px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 6,
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            userSelect: 'none',
          }}
        >
          {copy.label}
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() => setExpanded((v) => !v)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            color: 'rgba(255,255,255,0.55)',
            fontSize: 12,
            cursor: disabled ? 'default' : 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: 3,
          }}
        >
          {copy.why}
        </button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            fontSize: 15,
            lineHeight: 1.35,
            color: 'rgba(255,255,255,0.88)',
            marginBottom: 4,
          }}
        >
          {copy.prompt}
        </div>
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)' }}>
          {copy.subtext}
        </div>

        {expanded && (
          <div
            style={{
              marginTop: 10,
              fontSize: 12.5,
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.62)',
            }}
          >
            {copy.whyText}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="button"
          disabled={disabled}
          onClick={onAccept}
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.04)',
            color: 'rgba(255,255,255,0.9)',
            fontSize: 13.5,
            fontWeight: 500,
            cursor: disabled ? 'default' : 'pointer',
          }}
          aria-label={copy.accept}
        >
          {copy.accept}
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={onDecline}
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.75)',
            fontSize: 13.5,
            fontWeight: 500,
            cursor: disabled ? 'default' : 'pointer',
          }}
          aria-label={copy.decline}
        >
          {copy.decline}
        </button>
      </div>
    </div>
  );
}
