'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface SoundBathProps {
  onBack: () => void;
  onComplete?: () => void;
  theme?: 'light' | 'dark';
}

type TrackKey = 'rain' | 'ocean' | 'forest' | 'wind' | 'night' | 'fire' | 'guitar';

type Track = {
  key: TrackKey;
  name: string;
  filename: string;
};

type DurationOption = { label: string; seconds: number };

type Screen = 'select' | 'active' | 'complete';

type FadeMode = 'off' | 'on';

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

export function SoundBath({ onBack, onComplete, theme = 'dark' }: SoundBathProps) {
  const [screen, setScreen] = useState<Screen>('select');
  const [selected, setSelected] = useState<TrackKey[]>(['ocean']);
  const [durationSeconds, setDurationSeconds] = useState(10 * 60);
  const [remaining, setRemaining] = useState(10 * 60);
  const [fadeMode, setFadeMode] = useState<FadeMode>('on');

  const audioRef = useRef<Record<TrackKey, HTMLAudioElement | null>>({
    rain: null,
    ocean: null,
    forest: null,
    wind: null,
    night: null,
    fire: null,
    guitar: null,
  });

  const baseVolumesRef = useRef<Record<TrackKey, number>>({
    rain: 0.5,
    ocean: 0.6,
    forest: 0.45,
    wind: 0.35,
    night: 0.35,
    fire: 0.4,
    guitar: 0.22,
  });

  const fadeIntervalRef = useRef<number | null>(null);
  const tickIntervalRef = useRef<number | null>(null);

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

  const tracks: Track[] = useMemo(
    () => [
      { key: 'rain', name: 'Rain', filename: 'rain.mp3' },
      { key: 'ocean', name: 'Ocean', filename: 'ocean.mp3' },
      { key: 'forest', name: 'Forest', filename: 'forest.mp3' },
      { key: 'wind', name: 'Wind', filename: 'wind.mp3' },
      { key: 'night', name: 'Night', filename: 'night.mp3' },
      { key: 'fire', name: 'Fire', filename: 'fire.mp3' },
      { key: 'guitar', name: 'Guitar hum', filename: 'guitar-humming.mp3' },
    ],
    [],
  );

  const durations: DurationOption[] = [
    { label: '5 min', seconds: 5 * 60 },
    { label: '10 min', seconds: 10 * 60 },
    { label: '20 min', seconds: 20 * 60 },
  ];

  const clearIntervals = () => {
    if (tickIntervalRef.current) {
      window.clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
    if (fadeIntervalRef.current) {
      window.clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  const stopAll = () => {
    clearIntervals();

    (Object.keys(audioRef.current) as TrackKey[]).forEach((key) => {
      const a = audioRef.current[key];
      if (!a) return;
      a.pause();
      a.src = '';
      audioRef.current[key] = null;
    });
  };

  useEffect(() => {
    return () => {
      stopAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyVolumes = (multiplier: number) => {
    (Object.keys(audioRef.current) as TrackKey[]).forEach((key) => {
      const a = audioRef.current[key];
      if (!a) return;
      const base = baseVolumesRef.current[key] ?? 0.5;
      a.volume = Math.max(0, Math.min(1, base * multiplier));
    });
  };

  const start = async () => {
    if (selected.length === 0) return;

    setRemaining(durationSeconds);
    setScreen('active');

    // Initialize and play selected tracks.
    for (const key of selected) {
      const track = tracks.find((t) => t.key === key);
      if (!track) continue;
      const audio = new Audio(safeSrc(track.filename));
      audio.loop = true;
      audio.volume = baseVolumesRef.current[key] ?? 0.5;
      audioRef.current[key] = audio;
      await safePlay(audio);
    }

    tickIntervalRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          stopAll();
          setScreen('complete');
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Fade out over the last 30 seconds.
    if (fadeMode === 'on') {
      fadeIntervalRef.current = window.setInterval(() => {
        setRemaining((r) => {
          // Using state updater to avoid another interval; only used to compute fade.
          if (r <= 30) {
            const multiplier = Math.max(0, r / 30);
            applyVolumes(multiplier);
          }
          return r;
        });
      }, 250);
    }
  };

  const toggleSelected = (key: TrackKey) => {
    setSelected((prev) => {
      const exists = prev.includes(key);
      if (exists) return prev.filter((k) => k !== key);
      if (prev.length >= 3) return prev;
      return [...prev, key];
    });
  };

  const changeBaseVolume = (key: TrackKey, value: number) => {
    baseVolumesRef.current[key] = value;
    const audio = audioRef.current[key];
    if (audio) audio.volume = Math.max(0, Math.min(1, value));
  };

  const finish = () => {
    stopAll();
    setScreen('complete');
    onComplete?.();
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
            Sound Bath
          </h1>
          <p style={{ fontSize: '15px', lineHeight: 1.6, color: colors.textMuted, margin: '0 0 20px 0', maxWidth: '560px' }}>
            Choose 1–3 sounds. Set a duration. Let the mix carry you.
          </p>

          <div style={{ width: '100%', maxWidth: '720px', display: 'grid', gap: '12px' }}>
            <div style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'baseline', marginBottom: '10px' }}>
                <div style={{ fontSize: '13px', color: colors.textDim, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Sounds</div>
                <div style={{ fontSize: '13px', color: colors.textMuted }}>{selected.length}/3 selected</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                {tracks.map((t) => {
                  const isOn = selected.includes(t.key);
                  const isDisabled = !isOn && selected.length >= 3;
                  const baseVolume = baseVolumesRef.current[t.key] ?? 0.5;

                  return (
                    <div key={t.key} style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: '12px', padding: '12px' }}>
                      <button
                        onClick={() => toggleSelected(t.key)}
                        disabled={isDisabled}
                        style={{
                          width: '100%',
                          background: isOn ? `linear-gradient(135deg, ${colors.accent}, #7c3aed)` : colors.cardBg,
                          border: `1px solid ${colors.cardBorder}`,
                          borderRadius: '12px',
                          padding: '10px 12px',
                          color: isOn ? '#fff' : colors.textMuted,
                          fontSize: '14px',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          opacity: isDisabled ? 0.6 : 1,
                          marginBottom: '10px',
                        }}
                      >
                        {t.name}
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ fontSize: '12px', color: colors.textDim, width: 46 }}>Vol</div>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={baseVolume}
                          onChange={(e) => changeBaseVolume(t.key, Number(e.target.value))}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '13px', color: colors.textDim, textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: '10px' }}>Duration</div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {durations.map((d) => {
                  const selectedD = d.seconds === durationSeconds;
                  return (
                    <button
                      key={d.label}
                      onClick={() => setDurationSeconds(d.seconds)}
                      style={{
                        background: selectedD ? `linear-gradient(135deg, ${colors.accent}, #7c3aed)` : colors.cardBg,
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: '12px',
                        padding: '10px 14px',
                        color: selectedD ? '#fff' : colors.textMuted,
                        fontSize: '14px',
                        cursor: 'pointer',
                        minWidth: 120,
                      }}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setFadeMode((v) => (v === 'on' ? 'off' : 'on'))}
                style={{
                  marginTop: '12px',
                  width: '100%',
                  background: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: '12px',
                  padding: '10px 14px',
                  color: colors.textMuted,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Fade out last 30s: {fadeMode === 'on' ? 'On' : 'Off'}
              </button>
            </div>

            <button
              onClick={() => void start()}
              disabled={selected.length === 0}
              style={{
                background: selected.length === 0 ? colors.cardBg : `linear-gradient(135deg, ${colors.accent}, #7c3aed)`,
                border: selected.length === 0 ? `1px solid ${colors.cardBorder}` : 'none',
                borderRadius: '12px',
                padding: '12px 16px',
                color: selected.length === 0 ? colors.textMuted : '#fff',
                fontSize: '14px',
                cursor: selected.length === 0 ? 'not-allowed' : 'pointer',
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
          Let the sound fade…
        </h1>
        <p style={{ fontSize: '15px', lineHeight: 1.6, color: colors.textMuted, margin: '0 0 22px 0', maxWidth: '520px' }}>
          Notice what changed in your body. Keep what you want.
        </p>

        <button
          onClick={() => {
            onComplete?.();
            onBack();
          }}
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
            finish();
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
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '40px', fontWeight: 300, color: colors.text, margin: '0 0 12px 0' }}>
          Stay with the blend
        </h1>
        <p style={{ fontSize: '15px', lineHeight: 1.6, color: colors.textMuted, margin: 0, maxWidth: '520px' }}>
          If your mind wanders, return to the layers.
        </p>

        <div style={{ marginTop: 18, background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: '12px', padding: '14px 16px', color: colors.textMuted, fontSize: '14px' }}>
          Playing: {selected.map((k) => tracks.find((t) => t.key === k)?.name ?? k).join(' • ')}
        </div>

        <button
          onClick={finish}
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
          End early
        </button>
      </div>
    </div>
  );
}

export default SoundBath;
