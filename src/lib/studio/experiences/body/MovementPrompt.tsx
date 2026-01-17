'use client';

import { useEffect, useMemo, useState } from 'react';

interface MovementPromptProps {
  onBack: () => void;
  onComplete?: () => void;
  theme?: 'light' | 'dark';
}

const PROMPTS = [
  'Roll your shoulders slowly',
  'Stretch toward the ceiling',
  'Twist your torso gently',
  'Shake out your hands',
  'Circle your wrists',
  'Nod your head yes, then no',
  'Shrug and release',
  'Stretch your neck each side',
];

function formatTime(seconds: number): string {
  return `0:${String(seconds).padStart(2, '0')}`;
}

export function MovementPrompt({ onBack, onComplete, theme = 'dark' }: MovementPromptProps) {
  const [screen, setScreen] = useState<'intro' | 'active' | 'complete'>('intro');
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);

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

  const total = PROMPTS.length;
  const prompt = PROMPTS[index] ?? '';

  const progress = useMemo(() => {
    if (total === 0) return 0;
    return Math.min(1, (index + (15 - timeLeft) / 15) / total);
  }, [index, timeLeft, total]);

  useEffect(() => {
    if (screen !== 'active') return;

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Advance
          setIndex((i) => {
            const next = i + 1;
            if (next >= total) {
              setScreen('complete');
              return i;
            }
            return next;
          });
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [screen, total]);

  const start = () => {
    setIndex(0);
    setTimeLeft(15);
    setScreen('active');
  };

  const next = () => {
    setIndex((i) => {
      const ni = i + 1;
      if (ni >= total) {
        setScreen('complete');
        return i;
      }
      return ni;
    });
    setTimeLeft(15);
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
            Movement Prompt
          </h1>
          <p style={{
            fontSize: '15px',
            lineHeight: 1.6,
            color: colors.textMuted,
            margin: '0 0 22px 0',
            maxWidth: '520px',
          }}>
            Eight gentle movements, 15 seconds each.
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
          Complete
        </h1>
        <p style={{
          fontSize: '15px',
          lineHeight: 1.6,
          color: colors.textMuted,
          margin: '0 0 22px 0',
          maxWidth: '520px',
        }}>
          Notice what feels different.
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
          {index + 1}/{total} • {formatTime(timeLeft)}
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
            Prompt
          </p>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '44px',
            fontWeight: 300,
            color: colors.text,
            margin: '0 0 16px 0',
          }}>
            {prompt}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '14px' }}>
            {PROMPTS.map((_, idx) => {
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

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={next}
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '12px',
                padding: '10px 16px',
                color: colors.textMuted,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovementPrompt;
