'use client';

import { useEffect, useMemo, useState } from 'react';

interface HandReleaseProps {
  onBack: () => void;
  onComplete?: () => void;
  theme?: 'light' | 'dark';
}

type Step = {
  text: string;
  seconds: number;
};

function HandIcon({ stroke, variant }: { stroke: string; variant: number }) {
  // Simple variations to suggest different actions.
  if (variant === 0) {
    return (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12V7a1.5 1.5 0 0 1 3 0v4" />
        <path d="M11 11V6a1.5 1.5 0 0 1 3 0v5" />
        <path d="M14 12V7a1.5 1.5 0 0 1 3 0v7" />
        <path d="M7 12c0 5 2 9 6 9s6-3 6-8" />
        <path d="M6 12h1" />
      </svg>
    );
  }
  if (variant === 1) {
    return (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 12V8" />
        <path d="M10 12V6" />
        <path d="M13 12V6" />
        <path d="M16 12V8" />
        <path d="M6 12c0 6 2.5 9 6 9s6-3 6-8" />
        <path d="M6.5 16.5c.8.8 1.7 1.4 2.8 1.8" />
      </svg>
    );
  }
  if (variant === 2) {
    return (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12V7a1.5 1.5 0 0 1 3 0v4" />
        <path d="M12 11V6a1.5 1.5 0 0 1 3 0v5" />
        <path d="M15 12V8a1.5 1.5 0 0 1 3 0v7" />
        <path d="M7 12c0 6 2.5 9 6 9s6-3 6-8" />
        <path d="M12 18c2 0 3.5-1.5 3.5-3.5S14 11 12 11s-3.5 1.5-3.5 3.5S10 18 12 18Z" />
      </svg>
    );
  }
  if (variant === 3) {
    return (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12V7a1.5 1.5 0 0 1 3 0v4" />
        <path d="M11 11V6a1.5 1.5 0 0 1 3 0v5" />
        <path d="M14 12V7a1.5 1.5 0 0 1 3 0v7" />
        <path d="M7 12c0 6 2.5 9 6 9s6-3 6-8" />
        <path d="M4.5 10.5c1.5.2 2.5.8 3.2 1.8" />
        <path d="M4.5 13.5c1.7-.1 2.9-.7 3.7-2" />
      </svg>
    );
  }

  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12V7a1.5 1.5 0 0 1 3 0v4" />
      <path d="M12 11V6a1.5 1.5 0 0 1 3 0v5" />
      <path d="M15 12V8a1.5 1.5 0 0 1 3 0v7" />
      <path d="M7 12c0 6 2.5 9 6 9s6-3 6-8" />
      <path d="M9 18h6" />
    </svg>
  );
}

export function HandRelease({ onBack, onComplete, theme = 'dark' }: HandReleaseProps) {
  const [screen, setScreen] = useState<'intro' | 'active' | 'complete'>('intro');
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(9);

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

  const steps: Step[] = useMemo(() => ([
    { text: 'Make tight fists — squeeze hard', seconds: 9 },
    { text: 'Release and spread your fingers wide', seconds: 9 },
    { text: 'Circle your wrists slowly — both directions', seconds: 9 },
    { text: 'Shake your hands loosely', seconds: 9 },
    { text: 'Rest your palms facing up', seconds: 9 },
  ]), []);

  const total = steps.length;
  const step = steps[index];

  useEffect(() => {
    if (screen !== 'active') return;

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIndex((i) => {
            const next = i + 1;
            if (next >= total) {
              setScreen('complete');
              return i;
            }
            setTimeLeft(steps[next].seconds);
            return next;
          });
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [screen, steps, total]);

  const start = () => {
    setIndex(0);
    setTimeLeft(steps[0].seconds);
    setScreen('active');
  };

  const done = () => {
    onComplete?.();
    onBack();
  };

  if (screen === 'intro') {
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
            Hand Release
          </h1>
          <p style={{
            fontSize: '15px',
            lineHeight: 1.6,
            color: colors.textMuted,
            margin: '0 0 22px 0',
            maxWidth: '520px',
          }}>
            A guided hand + wrist sequence to let tension go.
          </p>

          <div style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '12px',
            padding: '18px',
            width: '100%',
            maxWidth: '520px',
          }}>
            <button
              onClick={start}
              style={{
                width: '100%',
                background: `linear-gradient(135deg, ${colors.accent}, #7c3aed)`,
                border: 'none',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Start
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          Tension released
        </h1>
        <p style={{
          fontSize: '15px',
          lineHeight: 1.6,
          color: colors.textMuted,
          margin: '0 0 22px 0',
          maxWidth: '520px',
        }}>
          Let your hands feel heavy and open.
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

  const progress = total ? Math.min(1, (index + (step.seconds - timeLeft) / step.seconds) / total) : 0;

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

        <div style={{ fontSize: '13px', color: colors.textMuted }}>
          {index + 1}/{total} • 0:{String(timeLeft).padStart(2, '0')}
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
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', opacity: 0.9 }}>
            <HandIcon stroke={colors.accent} variant={index} />
          </div>

          <p style={{
            fontSize: '12px',
            color: colors.textDim,
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.10em',
          }}>
            Step {index + 1}
          </p>

          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '44px',
            fontWeight: 300,
            color: colors.text,
            margin: '0 0 16px 0',
          }}>
            {step.text}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '14px',
          }}>
            {steps.map((_, idx) => {
              const isActive = idx === index;
              const isDone = idx < index;
              return (
                <div
                  key={idx}
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
        </div>
      </div>
    </div>
  );
}

export default HandRelease;
