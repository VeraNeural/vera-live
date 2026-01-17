'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface PlaylistBuilderProps {
  onBack: () => void;
  onComplete?: () => void;
  theme?: 'light' | 'dark';
}

type Track = {
  id: string;
  title: string;
  filename: string;
  durationHint?: string;
};

type Screen = 'build' | 'play' | 'complete';

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

const STORAGE_KEY = 'vera:studio:playlist-builder:v1';

export function PlaylistBuilder({ onBack, onComplete, theme = 'dark' }: PlaylistBuilderProps) {
  const [screen, setScreen] = useState<Screen>('build');
  const [playlist, setPlaylist] = useState<string[]>([]); // track ids
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      { id: 'es-birdlife', title: 'Morning Birdlife', filename: 'ES_ASMR Morning Birdlife - Autonomic Sensations.mp3', durationHint: 'ASMR' },
      { id: 'es-rain-sleep', title: 'Rain for Sleep', filename: 'ES_Rain for Sleep - Autonomic Sensations.mp3' },
      { id: 'es-rain-asmr', title: 'Rain ASMR', filename: 'ES_ASMR Rain - Autonomic Sensations.mp3' },
      { id: 'es-ocean', title: 'Ocean', filename: 'ocean.mp3', durationHint: 'Loop' },
      { id: 'es-rain', title: 'Rain', filename: 'rain.mp3', durationHint: 'Loop' },
      { id: 'es-forest', title: 'Forest', filename: 'forest.mp3', durationHint: 'Loop' },
      { id: 'es-wind', title: 'Wind', filename: 'wind.mp3', durationHint: 'Loop' },
      { id: 'es-night', title: 'Night', filename: 'night.mp3', durationHint: 'Loop' },
      { id: 'es-fire', title: 'Fire', filename: 'fire.mp3', durationHint: 'Loop' },
      { id: 'es-guitar', title: 'Guitar humming', filename: 'guitar-humming.mp3', durationHint: 'Loop' },
      { id: 'es-white-noise', title: 'White Noise', filename: 'ES_White Noise - Autonomic Sensations.mp3' },
      { id: 'es-binaural', title: 'Binaural Beats', filename: 'ES_Binaural Beats - Autonomic Sensations.mp3' },
    ],
    [],
  );

  const trackById = useMemo(() => {
    const map = new Map<string, Track>();
    for (const t of tracks) map.set(t.id, t);
    return map;
  }, [tracks]);

  useEffect(() => {
    // Restore saved playlist.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { playlist?: string[] };
      if (Array.isArray(parsed.playlist)) {
        setPlaylist(parsed.playlist.filter((id) => trackById.has(id)));
      }
    } catch {
      // ignore
    }
  }, [trackById]);

  useEffect(() => {
    // Persist playlist.
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ playlist }));
    } catch {
      // ignore
    }
  }, [playlist]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const playTrack = async (track: Track) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    const audio = new Audio(safeSrc(track.filename));
    audioRef.current = audio;
    audio.volume = 0.65;

    audio.onended = () => {
      setActiveIndex((prev) => {
        const next = prev + 1;
        if (next >= playlist.length) {
          setIsPlaying(false);
          setScreen('complete');
          onComplete?.();
          return prev;
        }
        // Trigger next track via effect.
        return next;
      });
    };

    await safePlay(audio);
  };

  useEffect(() => {
    if (screen !== 'play') return;
    if (!isPlaying) return;

    const id = playlist[activeIndex];
    if (!id) return;
    const track = trackById.get(id);
    if (!track) return;

    void playTrack(track);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, isPlaying, activeIndex]);

  const startPlayback = () => {
    if (playlist.length === 0) return;
    setActiveIndex(0);
    setIsPlaying(true);
    setScreen('play');
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setScreen('build');
  };

  const togglePreview = async (id: string) => {
    if (previewId === id) {
      setPreviewId(null);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    const track = trackById.get(id);
    if (!track) return;
    setPreviewId(id);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    const audio = new Audio(safeSrc(track.filename));
    audioRef.current = audio;
    audio.volume = 0.55;
    await safePlay(audio);
  };

  const addToPlaylist = (id: string) => {
    setPlaylist((prev) => [...prev, id]);
  };

  const removeFromPlaylist = (idx: number) => {
    setPlaylist((prev) => prev.filter((_, i) => i !== idx));
  };

  const move = (idx: number, dir: -1 | 1) => {
    setPlaylist((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      const tmp = next[idx];
      next[idx] = next[j];
      next[j] = tmp;
      return next;
    });
  };

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
          Let the last note land
        </h1>
        <p style={{ fontSize: '15px', lineHeight: 1.6, color: colors.textMuted, margin: '0 0 22px 0', maxWidth: '520px' }}>
          Your playlist is saved for next time.
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

  if (screen === 'play') {
    const id = playlist[activeIndex];
    const track = id ? trackById.get(id) : undefined;

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
            onClick={stopPlayback}
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
            {activeIndex + 1}/{playlist.length}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '40px', fontWeight: 300, color: colors.text, margin: '0 0 10px 0' }}>
            {track?.title ?? 'Playing…'}
          </h1>
          <p style={{ fontSize: '15px', lineHeight: 1.6, color: colors.textMuted, margin: 0, maxWidth: '520px' }}>
            Let it be the only thing you do for a moment.
          </p>

          <button
            onClick={() => {
              setIsPlaying(false);
              if (audioRef.current) {
                audioRef.current.pause();
              }
            }}
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
            Pause
          </button>

          <button
            onClick={() => {
              setIsPlaying(true);
              if (audioRef.current) void safePlay(audioRef.current);
            }}
            style={{
              marginTop: 10,
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '12px',
              padding: '10px 16px',
              color: colors.textMuted,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Resume
          </button>

          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
              }
              setActiveIndex((prev) => {
                const next = prev + 1;
                if (next >= playlist.length) {
                  setScreen('complete');
                  onComplete?.();
                  return prev;
                }
                return next;
              });
            }}
            style={{
              marginTop: 10,
              background: `linear-gradient(135deg, ${colors.accent}, #7c3aed)`,
              border: 'none',
              borderRadius: '12px',
              padding: '10px 16px',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Skip
          </button>
        </div>
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
          Playlist Builder
        </h1>
        <p style={{ fontSize: '15px', lineHeight: 1.6, color: colors.textMuted, margin: '0 0 22px 0', maxWidth: '560px' }}>
          Preview tracks, add them to your list, reorder, then play straight through.
        </p>

        <div style={{ width: '100%', maxWidth: '980px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '13px', color: colors.textDim, textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: '10px' }}>Library</div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {tracks.map((t) => {
                const isPreviewing = previewId === t.id;
                return (
                  <div key={t.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: '12px', padding: '10px 12px' }}>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ color: colors.text, fontSize: '14px' }}>{t.title}</div>
                      {t.durationHint ? <div style={{ color: colors.textDim, fontSize: '12px' }}>{t.durationHint}</div> : null}
                    </div>

                    <button
                      onClick={() => void togglePreview(t.id)}
                      style={{
                        background: colors.cardBg,
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: '12px',
                        padding: '8px 12px',
                        color: colors.textMuted,
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      {isPreviewing ? 'Stop' : 'Preview'}
                    </button>

                    <button
                      onClick={() => addToPlaylist(t.id)}
                      style={{
                        background: `linear-gradient(135deg, ${colors.accent}, #7c3aed)`,
                        border: 'none',
                        borderRadius: '12px',
                        padding: '8px 12px',
                        color: '#fff',
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      Add
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'baseline', marginBottom: '10px' }}>
              <div style={{ fontSize: '13px', color: colors.textDim, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Your playlist</div>
              <div style={{ fontSize: '13px', color: colors.textMuted }}>{playlist.length} tracks</div>
            </div>

            {playlist.length === 0 ? (
              <div style={{ color: colors.textMuted, fontSize: '14px', padding: '10px 0' }}>Add a few tracks to begin.</div>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {playlist.map((id, idx) => {
                  const t = trackById.get(id);
                  return (
                    <div key={`${id}-${idx}`} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: '12px', padding: '10px 12px' }}>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ color: colors.text, fontSize: '14px' }}>{t?.title ?? id}</div>
                        <div style={{ color: colors.textDim, fontSize: '12px' }}>#{idx + 1}</div>
                      </div>

                      <button
                        onClick={() => move(idx, -1)}
                        style={{
                          background: colors.cardBg,
                          border: `1px solid ${colors.cardBorder}`,
                          borderRadius: '12px',
                          padding: '8px 10px',
                          color: colors.textMuted,
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => move(idx, 1)}
                        style={{
                          background: colors.cardBg,
                          border: `1px solid ${colors.cardBorder}`,
                          borderRadius: '12px',
                          padding: '8px 10px',
                          color: colors.textMuted,
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeFromPlaylist(idx)}
                        style={{
                          background: colors.cardBg,
                          border: `1px solid ${colors.cardBorder}`,
                          borderRadius: '12px',
                          padding: '8px 12px',
                          color: colors.textMuted,
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={startPlayback}
              disabled={playlist.length === 0}
              style={{
                marginTop: '12px',
                width: '100%',
                background: playlist.length === 0 ? colors.cardBg : `linear-gradient(135deg, ${colors.accent}, #7c3aed)`,
                border: playlist.length === 0 ? `1px solid ${colors.cardBorder}` : 'none',
                borderRadius: '12px',
                padding: '12px 16px',
                color: playlist.length === 0 ? colors.textMuted : '#fff',
                fontSize: '14px',
                cursor: playlist.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaylistBuilder;
