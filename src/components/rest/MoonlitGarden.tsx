'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { generateStoryAudio } from '@/lib/library/generation/audioGenerator';

interface MoonlitGardenProps {
  onBack: () => void;
  onComplete?: () => void;
}

const STORY = [
  { text: "You push open an old wooden gate, and step into a garden bathed in silver moonlight...", pause: 8000 },
  { text: "The air is thick with the perfume of night-blooming jasmine and sweet honeysuckle.", pause: 7000 },
  { text: "A stone path winds before you, its surface smooth and cool beneath your bare feet.", pause: 8000 },
  { text: "On either side, roses climb ancient trellises, their petals gleaming like scattered pearls.", pause: 8000 },
  { text: "A fountain gurgles softly nearby, its gentle music blending with the cricket songs.", pause: 7000 },
  { text: "You follow the path deeper into the garden, past beds of lavender and sleeping tulips.", pause: 8000 },
  { text: "A white moth dances past you, drawn to the luminous flowers that only bloom at night.", pause: 7000 },
  { text: "You come upon a stone bench beneath a great wisteria tree, its purple blooms cascading down.", pause: 8000 },
  { text: "You sit, and the bench welcomes you like an old friend who has been waiting patiently.", pause: 8000 },
  { text: "Above you, the moon sails through wisps of cloud, painting the garden in shifting light.", pause: 7000 },
  { text: "A gentle breeze stirs the leaves, and they whisper secrets you don't need to understand.", pause: 8000 },
  { text: "The tension in your shoulders begins to melt. Your breathing grows slow and deep.", pause: 7000 },
  { text: "Each exhale carries away the weight of the day. Each inhale brings peace.", pause: 8000 },
  { text: "The garden holds you gently, asking nothing, offering everything.", pause: 8000 },
  { text: "Your eyelids grow heavy with the sweetness of the night air.", pause: 7000 },
  { text: "The flowers bow their heads as if in sleep. The fountain's song grows softer.", pause: 8000 },
  { text: "You can rest here. You can let go here. You are safe in this moonlit garden.", pause: 8000 },
  { text: "Let sleep come like dew settling on the flowers... soft... quiet... gentle...", pause: 10000 },
  { text: "Rest now... the garden will watch over you... sleep...", pause: 15000 },
];

export default function MoonlitGarden({ onBack, onComplete }: MoonlitGardenProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<any>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [segment, setSegment] = useState(0);
  const [text, setText] = useState('');
  const [volume, setVolume] = useState(0.6);
  const [showIntro, setShowIntro] = useState(true);
  const [narrationUrl, setNarrationUrl] = useState<string>('');
  const [isNarrating, setIsNarrating] = useState(false);
  const [narrationError, setNarrationError] = useState<string | null>(null);

  const narrationText = STORY.map((s) => s.text).join('\n\n');

  const handleListenWithVera = async () => {
    if (narrationUrl || isNarrating) return;
    setIsNarrating(true);
    setNarrationError(null);
    try {
      const { audioUrl } = await generateStoryAudio({
        text: narrationText,
        storyId: 'rest-moonlit-garden',
        chapterId: 'full',
      });
      setNarrationUrl(audioUrl);
    } catch (err) {
      setNarrationError(err instanceof Error ? err.message : 'Narration failed');
    } finally {
      setIsNarrating(false);
    }
  };

  const initAudio = useCallback(async () => {
    if (audioContextRef.current) return;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;
    const master = ctx.createGain();
    master.gain.value = volume * 0.4;
    master.connect(ctx.destination);
    nodesRef.current.master = master;

    // Ambient pad - garden tones
    [196, 247, 294].forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.value = 0.035;
      osc.connect(gain);
      gain.connect(master);
      osc.start();
    });

    // Noise for wind/water
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    // Water/fountain sound
    const water = ctx.createBufferSource();
    water.buffer = buf;
    water.loop = true;
    const waterFilter = ctx.createBiquadFilter();
    waterFilter.type = 'bandpass';
    waterFilter.frequency.value = 2000;
    waterFilter.Q.value = 0.5;
    const waterGain = ctx.createGain();
    waterGain.gain.value = 0.04;
    water.connect(waterFilter);
    waterFilter.connect(waterGain);
    waterGain.connect(master);
    water.start();

    // Crickets
    const cricket = () => {
      if (!audioContextRef.current) return;
      const osc = ctx.createOscillator();
      osc.frequency.value = 4000 + Math.random() * 1000;
      const g = ctx.createGain();
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0, now);
      for (let i = 0; i < 3; i++) {
        g.gain.setValueAtTime(0.06, now + i * 0.08);
        g.gain.setValueAtTime(0, now + i * 0.08 + 0.04);
      }
      osc.connect(g);
      g.connect(master);
      osc.start(now);
      osc.stop(now + 0.3);
      setTimeout(cricket, 1000 + Math.random() * 2000);
    };
    setTimeout(cricket, 500);
  }, [volume]);

  useEffect(() => {
    if (nodesRef.current.master) nodesRef.current.master.gain.value = volume * 0.4;
  }, [volume]);

  useEffect(() => {
    if (!isPlaying || showIntro || segment >= STORY.length) return;
    let i = 0;
    setText('');
    const int = setInterval(() => {
      if (i < STORY[segment].text.length) setText(STORY[segment].text.slice(0, ++i));
      else {
        clearInterval(int);
        setTimeout(() => {
          if (segment < STORY.length - 1) setSegment(s => s + 1);
          else if (onComplete) setTimeout(onComplete, 5000);
        }, STORY[segment].pause);
      }
    }, 55);
    return () => clearInterval(int);
  }, [isPlaying, segment, showIntro, onComplete]);

  const start = async () => { await initAudio(); audioContextRef.current?.resume(); setShowIntro(false); setIsPlaying(true); };
  const stop = () => { setIsPlaying(false); audioContextRef.current?.close(); audioContextRef.current = null; };
  useEffect(() => () => stop(), []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(180deg, #101828 0%, #0a1018 100%)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        {[...Array(35)].map((_, i) => <div key={i} style={{ position: 'absolute', left: `${Math.random()*100}%`, top: `${Math.random()*40}%`, width: 1, height: 1, background: 'white', borderRadius: '50%', opacity: 0.2 + Math.random()*0.4 }} />)}
      </div>
      <header style={{ position: 'relative', zIndex: 10, padding: 'max(env(safe-area-inset-top,16px),16px) 20px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => { stop(); onBack(); }} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, color: 'white', fontSize: 13, cursor: 'pointer' }}>← Back</button>
        {isPlaying && !showIntro && <div style={{ flex: 1, maxWidth: 150, margin: '0 16px', height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}><div style={{ height: '100%', width: `${((segment+1)/STORY.length)*100}%`, background: 'rgba(180,200,255,0.5)', borderRadius: 2 }} /></div>}
        <div style={{ width: 60 }} />
      </header>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 30, position: 'relative', zIndex: 10 }}>
        {showIntro ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>🌙</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.8rem,7vw,2.5rem)', color: 'white', marginBottom: 8, fontWeight: 300 }}>Moonlit Garden</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>A Sleep Story · 25 min</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <button onClick={start} style={{ padding: '14px 36px', background: 'rgba(180,200,255,0.15)', border: '1px solid rgba(180,200,255,0.3)', borderRadius: 25, color: 'white', fontSize: 15, cursor: 'pointer' }}>Begin Story</button>

              {!narrationUrl && (
                <button
                  onClick={handleListenWithVera}
                  disabled={isNarrating}
                  style={{
                    padding: '12px 28px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: 25,
                    color: 'white',
                    fontSize: 14,
                    cursor: isNarrating ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  {isNarrating ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <g fill="none" fillRule="evenodd">
                          <g transform="translate(1 1)" stroke="rgba(180,200,255,0.9)" strokeWidth="2">
                            <circle strokeOpacity=".25" cx="18" cy="18" r="18" />
                            <path d="M36 18c0-9.94-8.06-18-18-18">
                              <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" />
                            </path>
                          </g>
                        </g>
                      </svg>
                      <span>VERA is narrating...</span>
                    </>
                  ) : (
                    <span>Listen with VERA</span>
                  )}
                </button>
              )}

              {narrationUrl && (
                <audio controls src={narrationUrl} style={{ width: 280, marginTop: 4 }} />
              )}

              {narrationError && (
                <div style={{ marginTop: 6, color: 'rgba(255,255,255,0.6)', fontSize: 12, maxWidth: 320 }}>
                  {narrationError}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.2rem,5vw,1.6rem)', color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 1.7, maxWidth: 500 }}>{text}</p>
        )}
      </div>
      <div style={{ position: 'relative', zIndex: 10, padding: 20, paddingBottom: 'max(env(safe-area-inset-bottom,20px),20px)', display: 'flex', justifyContent: 'center', gap: 12 }}>
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>🔈</span>
        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(+e.target.value)} style={{ width: 120 }} />
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>🔊</span>
      </div>
    </div>
  );
}