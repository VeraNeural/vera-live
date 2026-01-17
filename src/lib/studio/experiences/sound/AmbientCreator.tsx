'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface AmbientCreatorProps {
  onBack: () => void;
  onComplete?: () => void;
  theme?: 'light' | 'dark';
}

type TimerOption = { label: string; seconds: number | null };

type SoundLayer = {
  id: string;
  label: string;
  filename: string;
  category: string;
};

function safeSrc(filename: string): string {
  return encodeURI(`/sounds/${filename}`);
}

async function safePlay(audio: HTMLAudioElement) {
  try {
    await audio.play();
  } catch {
    // Autoplay restrictions or user gesture requirements.
  }
}

function formatTime(seconds: number | null): string {
  if (seconds === null) return '∞';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function AmbientCreator({ onBack, onComplete, theme = 'dark' }: AmbientCreatorProps) {
  const [screen, setScreen] = useState<'intro' | 'active' | 'complete'>('intro');
  const [timerSeconds, setTimerSeconds] = useState<number | null>(20 * 60);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(20 * 60);
  const [isPlaying, setIsPlaying] = useState(false);

  const [active, setActive] = useState<Record<string, boolean>>({
    rain: true,
    ocean: false,
    wind: false,
    forest: false,
    fire: false,
    night: false,
    drone: false,
  });

  const [volumes, setVolumes] = useState<Record<string, number>>({
    rain: 55,
    ocean: 45,
    wind: 35,
    forest: 40,
    fire: 35,
    night: 30,
    drone: 25,
  });

  const audioMapRef = useRef<Record<string, HTMLAudioElement | null>>({});

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

  const timerOptions: TimerOption[] = [
    { label: '10 min', seconds: 10 * 60 },
    { label: '20 min', seconds: 20 * 60 },
    { label: '30 min', seconds: 30 * 60 },
    { label: '∞', seconds: null },
  ];

  const layers: SoundLayer[] = useMemo(
    () => [
      { id: 'rain', label: 'Rain', filename: 'rain.mp3', category: 'Water' },
      { id: 'ocean', label: 'Ocean', filename: 'ocean.mp3', category: 'Water' },
      { id: 'wind', label: 'Wind', filename: 'wind.mp3', category: 'Air' },
      { id: 'forest', label: 'Forest', filename: 'forest.mp3', category: 'Nature' },
      { id: 'fire', label: 'Fire', filename: 'fire.mp3', category: 'Fire' },
      { id: 'night', label: 'Night', filename: 'night.mp3', category: 'Ambient' },
      { id: 'drone', label: 'Soft Drone', filename: 'guitar-humming.mp3', category: 'Tone' },
    ],
    [],
  );

  const createIfNeeded = (layerId: string, filename: string) => {
    if (audioMapRef.current[layerId]) return;
    const audio = new Audio(safeSrc(filename));
    audio.loop = true;
    audio.volume = Math.min(1, Math.max(0, (volumes[layerId] ?? 50) / 100));
    audioMapRef.current[layerId] = audio;
  };

  const applyVolumes = () => {
    Object.entries(audioMapRef.current).forEach(([layerId, audio]) => {
      if (!audio) return;
      audio.volume = Math.min(1, Math.max(0, (volumes[layerId] ?? 50) / 100));
    });
  };

  const playAll = async () => {
    setIsPlaying(true);
    const entries = layers.filter((l) => active[l.id]);
    for (const layer of entries) {
      createIfNeeded(layer.id, layer.filename);
      const audio = audioMapRef.current[layer.id];
      if (audio) {
        audio.volume = Math.min(1, Math.max(0, (volumes[layer.id] ?? 50) / 100));
        await safePlay(audio);
      }
    }
  };

  const pauseAll = () => {
    setIsPlaying(false);
    Object.values(audioMapRef.current).forEach((audio) => {
      if (!audio) return;
      audio.pause();
    });
  };

  useEffect(() => {
    applyVolumes();
  }, [volumes]);

  useEffect(() => {
    if (screen !== 'active') return;
    if (!isPlaying) return;
    if (timeRemaining === null) return;

    const interval = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          pauseAll();
          setScreen('complete');
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [screen, isPlaying, timeRemaining, onComplete]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      Object.values(audioMapRef.current).forEach((audio) => {
        if (!audio) return;
        audio.pause();
        audio.src = '';
      });
      audioMapRef.current = {};
    };
  }, []);

  const toggleLayer = async (layerId: string) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer) return;

    const nextActive = !active[layerId];
    setActive((prev) => ({ ...prev, [layerId]: nextActive }));

    if (nextActive) {
      createIfNeeded(layerId, layer.filename);
      const audio = audioMapRef.current[layerId];
      if (audio) {
        audio.volume = Math.min(1, Math.max(0, (volumes[layerId] ?? 50) / 100));
        if (isPlaying) {
          await safePlay(audio);
        }
      }
    } else {
      const audio = audioMapRef.current[layerId];
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      audioMapRef.current[layerId] = null;
    }
  };

  const start = async () => {
    setTimeRemaining(timerSeconds);
    setScreen('active');
    await playAll();
  };

  const done = () => {
    onComplete?.();
    onBack();
  };

  if (screen === 'intro') {
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
        <div
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
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

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 24px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '40px',
              fontWeight: 300,
              color: colors.text,
              margin: '0 0 12px 0',
            }}
          >
            Ambient Creator
          </h1>
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.6,
              color: colors.textMuted,
              margin: '0 0 24px 0',
              maxWidth: '520px',
            }}
          >
            Mix layers into your own calming soundscape.
          </p>

          <div
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '12px',
              padding: '18px',
              width: '100%',
              maxWidth: '560px',
            }}
          >
            <p
              style={{
                fontSize: '13px',
                color: colors.textDim,
                margin: '0 0 14px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Timer
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
              {timerOptions.map((opt) => {
                const selected = opt.seconds === timerSeconds;
                return (
                  <button
                    key={opt.label}
                    onClick={() => setTimerSeconds(opt.seconds)}
                    style={{
                      background: selected ? `linear-gradient(135deg, ${colors.accent}, #7c3aed)` : colors.cardBg,
                      border: `1px solid ${colors.cardBorder}`,
                      borderRadius: '12px',
                      padding: '10px 14px',
                      color: selected ? '#fff' : colors.textMuted,
                      fontSize: '14px',
                      cursor: 'pointer',
                      minWidth: '100px',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

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
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '38px',
            fontWeight: 300,
            color: colors.text,
            margin: '0 0 10px 0',
          }}
        >
          Complete
        </h1>
        <p
          style={{
            fontSize: '15px',
            lineHeight: 1.6,
            color: colors.textMuted,
            margin: '0 0 22px 0',
            maxWidth: '520px',
          }}
        >
          Let the quiet land.
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
    <>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.08); opacity: 0.85; }
          100% { transform: scale(1); opacity: 0.55; }
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
        <div
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <button
            onClick={() => {
              pauseAll();
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

          <div style={{ fontSize: '13px', color: colors.textMuted }}>{formatTime(timeRemaining)}</div>

          <button
            onClick={() => {
              if (isPlaying) {
                pauseAll();
              } else {
                void playAll();
              }
            }}
            style={{
              background: `linear-gradient(135deg, ${colors.accent}, #7c3aed)`,
              border: 'none',
              borderRadius: '12px',
              padding: '10px 16px',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer',
              minWidth: '110px',
            }}
          >
            {isPlaying ? 'Pause All' : 'Play All'}
          </button>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 24px 24px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '760px',
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '12px',
              padding: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '28px', fontWeight: 300, color: colors.text }}>
                  Mixer
                </div>
                <div style={{ fontSize: '13px', color: colors.textMuted }}>Toggle layers and adjust volume.</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {layers.map((layer) => {
                const isOn = !!active[layer.id];
                const vol = volumes[layer.id] ?? 50;
                return (
                  <div
                    key={layer.id}
                    style={{
                      background: colors.cardBg,
                      border: `1px solid ${colors.cardBorder}`,
                      borderRadius: '12px',
                      padding: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '14px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {isOn && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 10,
                          height: 10,
                          borderRadius: 999,
                          background: colors.accent,
                          boxShadow: `0 0 0 10px ${colors.accentGlow}`,
                          animation: 'pulse 1.8s ease-in-out infinite',
                        }}
                      />
                    )}

                    <div style={{ paddingLeft: isOn ? 26 : 0 }}>
                      <div style={{ color: colors.text, fontSize: '15px', fontWeight: 600 }}>{layer.label}</div>
                      <div style={{ color: colors.textDim, fontSize: '12px' }}>{layer.category}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => void toggleLayer(layer.id)}
                        style={{
                          background: isOn ? `linear-gradient(135deg, ${colors.accent}, #7c3aed)` : colors.cardBg,
                          border: `1px solid ${colors.cardBorder}`,
                          borderRadius: '12px',
                          padding: '8px 12px',
                          color: isOn ? '#fff' : colors.textMuted,
                          fontSize: '13px',
                          cursor: 'pointer',
                          minWidth: 84,
                        }}
                      >
                        {isOn ? 'On' : 'Off'}
                      </button>

                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={vol}
                        onChange={(e) => setVolumes((prev) => ({ ...prev, [layer.id]: Number(e.target.value) }))}
                        style={{ width: 200 }}
                        aria-label={`${layer.label} volume`}
                      />
                      <div style={{ width: 34, textAlign: 'right', fontSize: '12px', color: colors.textMuted }}>{vol}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AmbientCreator;
