'use client';

import { useEffect, useMemo, useState } from 'react';

interface ShakeItOutProps {
  onBack: () => void;
  onComplete?: () => void;
  theme?: 'light' | 'dark';
}

type DurationOption = { label: string; seconds: number };

type Phase = {
  label: string;
  instruction: string;
  seconds: number;
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function ShakeItOut({ onBack, onComplete, theme = 'dark' }: ShakeItOutProps) {
  const [selectedSeconds, setSelectedSeconds] = useState<number | null>(null);
  const [screen, setScreen] = useState<'select' | 'active' | 'complete'>('select');

  const [elapsed, setElapsed] = useState(0);

  const colors = theme === 'dark' ? {
    bg: '#0f0d15',
    bgGradient: 'linear-gradient(to bottom, #0f0d15 0%, #1a1625 100%)',
    text: '#e8e6f0',
    textMuted: 'rgba(232, 230, 240, 0.6)',
    textDim: 'rgba(232, 230, 240, 0.4)',
    cardBg: 'rgba(255, 255, 255, 0.03)',
    cardBorder: 'rgba(255, 255, 255, 0.06)',
    accent: '#a855f7',
    accentGlow: 'rgba(168, 85, 247, 0.15)',
  } : {
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

  const durationOptions: DurationOption[] = [
    { label: '1 min', seconds: 60 },
    { label: '2 min', seconds: 120 },
    { label: '3 min', seconds: 180 },
  ];

  const phases: Phase[] = useMemo(() => {
    const total = selectedSeconds ?? 0;
    if (!total) return [];

    // 20% / 25% / 25% / 20% / 10%
    const raw = [0.2, 0.25, 0.25, 0.2, 0.1].map((p) => Math.max(1, Math.round(total * p)));
    // Normalize to exact total
    const sum = raw.reduce((a, b) => a + b, 0);
    raw[raw.length - 1] = Math.max(1, raw[raw.length - 1] + (total - sum));

    return [
      { label: 'Start gentle', instruction: 'Start gentle', seconds: raw[0] },
      { label: 'Build intensity', instruction: 'Build intensity', seconds: raw[1] },
      { label: 'Peak shake', instruction: 'Peak shake', seconds: raw[2] },
      { label: 'Slow down', instruction: 'Slow down', seconds: raw[3] },
      { label: 'Stillness', instruction: 'Stillness', seconds: raw[4] },
    ];
  }, [selectedSeconds]);

  const totalSeconds = selectedSeconds ?? 0;
  const remaining = Math.max(0, totalSeconds - elapsed);

  const currentPhaseIndex = useMemo(() => {
    if (!phases.length) return 0;
    let t = 0;
    for (let i = 0; i < phases.length; i += 1) {
      t += phases[i].seconds;
      if (elapsed < t) return i;
    }
    return phases.length - 1;
  }, [elapsed, phases]);

  const phaseElapsed = useMemo(() => {
    if (!phases.length) return 0;
    const before = phases.slice(0, currentPhaseIndex).reduce((a, p) => a + p.seconds, 0);
    return Math.max(0, elapsed - before);
  }, [elapsed, phases, currentPhaseIndex]);

  const phaseRemaining = useMemo(() => {
    if (!phases.length) return 0;
    return Math.max(0, phases[currentPhaseIndex].seconds - phaseElapsed);
  }, [phases, currentPhaseIndex, phaseElapsed]);

  useEffect(() => {
    if (screen !== 'active') return;
    if (!totalSeconds) return;

    const interval = window.setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= totalSeconds) {
          window.clearInterval(interval);
          setScreen('complete');
          return totalSeconds;
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [screen, totalSeconds]);

  const start = (seconds: number) => {
    setSelectedSeconds(seconds);
    setElapsed(0);
    setScreen('active');
  };

  const done = () => {
    onComplete?.();
    onBack();
  };

  // Selection / intro screen
  if (screen === 'select') {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: colors.bgGradient,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}>
        <div style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <button
            onClick={onBack}
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '12px',
              padding: '10px 16px',
              color: colors.textMuted,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ← Back
          </button>
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '40px',
            fontWeight: 300,
            color: colors.text,
            margin: '0 0 12px 0',
          }}>
            Shake It Out
          </h1>
          <p style={{
            fontSize: '15px',
            lineHeight: 1.6,
            color: colors.textMuted,
            margin: '0 0 24px 0',
            maxWidth: '520px',
          }}>
            A short guided shake sequence to discharge tension.
          </p>

          <div style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '12px',
            padding: '18px',
            width: '100%',
            maxWidth: '520px',
          }}>
            <p style={{
              fontSize: '13px',
              color: colors.textDim,
              margin: '0 0 14px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              Choose duration
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {durationOptions.map((opt) => (
                <button
                  key={opt.seconds}
                  onClick={() => start(opt.seconds)}
                  style={{
                    background: `linear-gradient(135deg, ${colors.accent}, #7c3aed)`,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: '#fff',
                    fontSize: '14px',
                    cursor: 'pointer',
                    minWidth: '120px',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Completion screen
  if (screen === 'complete') {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: colors.bgGradient,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        textAlign: 'center',
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '38px',
          fontWeight: 300,
          color: colors.text,
          margin: '0 0 10px 0',
        }}>
          Notice how you feel now
        </h1>
        <p style={{
          fontSize: '15px',
          lineHeight: 1.6,
          color: colors.textMuted,
          margin: '0 0 22px 0',
          maxWidth: '520px',
        }}>
          Let your breath settle. Feel the change in your body.
        </p>

        <button
          onClick={done}
          style={{
            background: `linear-gradient(135deg, ${colors.accent}, #7c3aed)`,
            border: 'none',
            borderRadius: '12px',
            padding: '12px 18px',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Done
        </button>
      </div>
    );
  }

  // Active screen
  const current = phases[currentPhaseIndex];
  const progress = totalSeconds ? Math.min(1, elapsed / totalSeconds) : 0;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: colors.bgGradient,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    }}>
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}>
        <button
          onClick={onBack}
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '12px',
            padding: '10px 16px',
            color: colors.textMuted,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← Back
        </button>

        <div style={{
          fontSize: '13px',
          color: colors.textMuted,
        }}>
          {formatTime(remaining)}
        </div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        textAlign: 'center',
      }}>
        <div style={{
          background: colors.cardBg,
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: '12px',
          padding: '22px 18px',
          width: '100%',
          maxWidth: '720px',
        }}>
          <p style={{
            fontSize: '12px',
            color: colors.textDim,
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.10em',
          }}>
            {current?.label}
          </p>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '44px',
            fontWeight: 300,
            color: colors.text,
            margin: '0 0 16px 0',
          }}>
            {current?.instruction}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '14px',
          }}>
            {phases.map((p, idx) => {
              const isActive = idx === currentPhaseIndex;
              const isDone = idx < currentPhaseIndex;
              return (
                <div
                  key={p.label}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '999px',
                    background: isActive ? colors.accent : isDone ? colors.accentGlow : colors.cardBorder,
                    border: `1px solid ${colors.cardBorder}`,
                  }}
                />
              );
            })}
          </div>

          <div style={{
            height: '10px',
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '999px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progress * 100}%`,
              background: `linear-gradient(135deg, ${colors.accent}, #7c3aed)`,
              transition: 'width 0.25s ease',
            }} />
          </div>

          <p style={{
            fontSize: '13px',
            color: colors.textMuted,
            margin: '14px 0 0 0',
          }}>
            Phase: {formatTime(phaseRemaining)} remaining
          </p>
        </div>
      </div>
    </div>
  );
}

export default ShakeItOut;
