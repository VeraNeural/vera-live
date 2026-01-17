'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface HumAndToneProps {
  onBack: () => void;
  onComplete?: () => void;
  theme?: 'light' | 'dark';
}

type DurationOption = { label: string; seconds: number };

type Phase = {
  label: string;
  seconds: number;
  type: 'inhale' | 'hum' | 'rest';
};

function safeSrc(filename: string): string {
  return encodeURI(`/sounds/${filename}`);
}

async function safePlay(audio: HTMLAudioElement) {
  try {
    await audio.play();
  } catch {
    // ignore
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function HumAndTone({ onBack, onComplete, theme = 'dark' }: HumAndToneProps) {
  const [screen, setScreen] = useState<'select' | 'active' | 'complete'>('select');
  const [durationSeconds, setDurationSeconds] = useState(5 * 60);
  const [remaining, setRemaining] = useState(5 * 60);

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseLeft, setPhaseLeft] = useState(4);

  const [useDrone, setUseDrone] = useState(true);
  const droneRef = useRef<HTMLAudioElement | null>(null);

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

  const durationOptions: DurationOption[] = [
    { label: 'Short (2 min)', seconds: 2 * 60 },
    { label: 'Medium (5 min)', seconds: 5 * 60 },
    { label: 'Full (10 min)', seconds: 10 * 60 },
  ];

  const phases: Phase[] = useMemo(
    () => [
      { label: 'Take a deep breath in', seconds: 4, type: 'inhale' },
      { label: 'Hum on the exhale — feel it in your chest', seconds: 8, type: 'hum' },
      { label: 'Breathe in again', seconds: 4, type: 'inhale' },
      { label: 'Try a lower tone — feel it in your belly', seconds: 8, type: 'hum' },
      { label: 'One more breath', seconds: 4, type: 'inhale' },
      { label: 'Now a higher tone — feel it in your head', seconds: 8, type: 'hum' },
      { label: 'Rest in silence', seconds: 10, type: 'rest' },
    ],
    [],
  );

  const current = phases[phaseIndex];

  useEffect(() => {
    return () => {
      if (droneRef.current) {
        droneRef.current.pause();
        droneRef.current.src = '';
        droneRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (screen !== 'active') return;

    const interval = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setScreen('complete');
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });

      setPhaseLeft((prev) => {
        if (prev <= 1) {
          const nextIndex = (phaseIndex + 1) % phases.length;
          setPhaseIndex(nextIndex);
          return phases[nextIndex].seconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [screen, phaseIndex, phases, onComplete]);

  const start = async (seconds: number) => {
    setDurationSeconds(seconds);
    setRemaining(seconds);
    setPhaseIndex(0);
    setPhaseLeft(phases[0].seconds);
    setScreen('active');

    if (useDrone) {
      const audio = new Audio(safeSrc('guitar-humming.mp3'));
      audio.loop = true;
      audio.volume = 0.18;
      droneRef.current = audio;
      await safePlay(audio);
    }
  };

  const stop = () => {
    if (droneRef.current) {
      droneRef.current.pause();
      droneRef.current.src = '';
      droneRef.current = null;
    }
    setScreen('complete');
    onComplete?.();
  };

  const done = () => {
    onComplete?.();
    onBack();
  };

  if (screen === 'select') {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: colors.bgGradient,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        }}
      >
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
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

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '40px', fontWeight: 300, color: colors.text, margin: '0 0 12px 0' }}>
            Hum & Tone
          </h1>
          <p style={{ fontSize: '15px', lineHeight: 1.6, color: colors.textMuted, margin: '0 0 22px 0', maxWidth: '520px' }}>
            A guided humming and toning sequence to regulate your nervous system.
          </p>

          <div style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: '12px', padding: '18px', width: '100%', maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {durationOptions.map((opt) => {
                const selected = opt.seconds === durationSeconds;
                return (
                  <button
                    key={opt.label}
                    onClick={() => setDurationSeconds(opt.seconds)}
                    style={{
                      background: selected ? `linear-gradient(135deg, ${colors.accent}, #7c3aed)` : colors.cardBg,
                      border: `1px solid ${colors.cardBorder}`,
                      borderRadius: '12px',
                      padding: '10px 14px',
                      color: selected ? '#fff' : colors.textMuted,
                      fontSize: '14px',
                      cursor: 'pointer',
                      minWidth: '160px',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setUseDrone((v) => !v)}
              style={{
                width: '100%',
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '12px',
                padding: '10px 14px',
                color: colors.textMuted,
                fontSize: '14px',
                cursor: 'pointer',
                marginBottom: '12px',
              }}
            >
              Background drone: {useDrone ? 'On' : 'Off'}
            </button>

            <button
              onClick={() => void start(durationSeconds)}
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
      <div
        style={{
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
        }}
      >
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '38px', fontWeight: 300, color: colors.text, margin: '0 0 10px 0' }}>
          Notice the vibration settling
        </h1>
        <p style={{ fontSize: '15px', lineHeight: 1.6, color: colors.textMuted, margin: '0 0 22px 0', maxWidth: '520px' }}>
          Let the resonance soften. Feel your breath.
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

  const pulseScale = current?.type === 'inhale' ? 1.18 : current?.type === 'hum' ? 1.05 : 0.92;
  const glow = current?.type === 'hum' ? colors.accentGlow : 'transparent';

  return (
    <>
      <style>{`
        @keyframes breathe {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: colors.bgGradient,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        }}
      >
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <button
            onClick={() => {
              stop();
              onBack();
            }}
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

          <div style={{ fontSize: '13px', color: colors.textMuted }}>{formatTime(remaining)}</div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: 999,
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              boxShadow: `0 0 0 18px ${glow}`,
              marginBottom: 22,
              transform: `scale(${pulseScale})`,
              transition: 'transform 0.7s ease, box-shadow 0.7s ease',
              animation: current?.type === 'rest' ? 'none' : 'breathe 2.2s ease-in-out infinite',
            }}
          />

          <div style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: '12px', padding: '22px 18px', width: '100%', maxWidth: '720px' }}>
            <p style={{ fontSize: '12px', color: colors.textDim, margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.10em' }}>
              {current?.type === 'inhale' ? 'Inhale' : current?.type === 'hum' ? 'Hum' : 'Rest'} • {phaseLeft}s
            </p>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '40px', fontWeight: 300, color: colors.text, margin: 0 }}>
              {current?.label}
            </div>
          </div>

          <button
            onClick={stop}
            style={{
              marginTop: 18,
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '12px',
              padding: '10px 16px',
              color: colors.textMuted,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Stop
          </button>
        </div>
      </div>
    </>
  );
}

export default HumAndTone;
