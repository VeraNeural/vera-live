'use client';

import { useEffect, useMemo, useState } from 'react';

interface PostureResetProps {
  onBack: () => void;
  onComplete?: () => void;
  theme?: 'light' | 'dark';
}

type Step = {
  text: string;
  seconds: number;
};

function SilhouetteIcon({ stroke }: { stroke: string }) {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 7.5c1.5 0 2.7-1.2 2.7-2.7S13.5 2.1 12 2.1 9.3 3.3 9.3 4.8 10.5 7.5 12 7.5Z" />
      <path d="M7.5 21.6v-6.3c0-1.9 1.2-3.6 3-4.2l1.5-.5 1.5.5c1.8.6 3 2.3 3 4.2v6.3" />
      <path d="M9 21.6v-5.4" />
      <path d="M15 21.6v-5.4" />
    </svg>
  );
}

export function PostureReset({ onBack, onComplete, theme = 'dark' }: PostureResetProps) {
  const [screen, setScreen] = useState<'intro' | 'active' | 'complete'>('intro');
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);

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
    { text: 'Plant your feet flat on the floor', seconds: 8 },
    { text: 'Unclench your jaw', seconds: 8 },
    { text: 'Drop your shoulders away from your ears', seconds: 8 },
    { text: 'Lengthen your spine', seconds: 8 },
    { text: 'Soften your eyes and forehead', seconds: 8 },
    { text: 'Take three slow breaths', seconds: 8 },
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
            Posture Reset
          </h1>
          <p style={{
            fontSize: '15px',
            lineHeight: 1.6,
            color: colors.textMuted,
            margin: '0 0 22px 0',
            maxWidth: '520px',
          }}>
            A short guided reset you can do anywhere.
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
          Your body is reset
        </h1>
        <p style={{
          fontSize: '15px',
          lineHeight: 1.6,
          color: colors.textMuted,
          margin: '0 0 22px 0',
          maxWidth: '520px',
        }}>
          Hold this posture for one more breath.
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
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '10px',
            opacity: 0.9,
          }}>
            <SilhouetteIcon stroke={colors.accent} />
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

export default PostureReset;
