'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { generateStoryAudio } from '@/lib/library/generation/audioGenerator';

interface TheQuietVillageProps {
  onBack: () => void;
  onComplete?: () => void;
}

const STORY = [
  { text: "As the last light of day fades beyond the distant hills, you find yourself walking along a quiet path...", pause: 8000 },
  { text: "The air is cool and fresh, carrying the gentle scent of wood smoke from the village ahead.", pause: 7000 },
  { text: "Stone cottages with thatched roofs line the narrow lane, their windows glowing with soft amber light.", pause: 8000 },
  { text: "A cat stretches lazily on a warm doorstep, barely acknowledging your presence as you pass.", pause: 7000 },
  { text: "The village square opens before you, centered around an ancient well covered in flowering vines.", pause: 8000 },
  { text: "An elderly woman sits on a wooden bench, knitting something soft and warm. She nods kindly as you approach.", pause: 8000 },
  { text: "\"The inn is just past the baker's,\" she says softly. \"They'll have a room for you.\"", pause: 9000 },
  { text: "You thank her and continue, passing gardens where the last roses of autumn still bloom.", pause: 7000 },
  { text: "The inn appears before you, its wooden sign creaking gently in the evening breeze.", pause: 8000 },
  { text: "Inside, a fire crackles in a stone hearth. The innkeeper welcomes you warmly.", pause: 8000 },
  { text: "He leads you up a narrow staircase, each wooden step worn smooth by countless travelers.", pause: 8000 },
  { text: "The room is small but perfect. A bed with a thick feather mattress and crisp white linens.", pause: 9000 },
  { text: "A window looks out over the moonlit rooftops. A nightingale begins its evening song.", pause: 8000 },
  { text: "You settle onto the bed, feeling the day's journey melt away from your tired muscles.", pause: 7000 },
  { text: "The sheets are cool and soft against your skin. The pillow cradles your head like a cloud.", pause: 8000 },
  { text: "Your eyes grow heavy. The moonlight traces silver patterns on the ceiling.", pause: 7000 },
  { text: "The village sleeps around you, safe and quiet. And soon, so will you.", pause: 8000 },
  { text: "Sleep now... sleep deeply... sleep well...", pause: 15000 },
];

export default function TheQuietVillage({ onBack, onComplete }: TheQuietVillageProps) {
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
        storyId: 'rest-the-quiet-village',
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

    // Ambient pad
    [174, 220, 261].forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.value = 0.04;
      osc.connect(gain);
      gain.connect(master);
      osc.start();
    });

    // Soft noise
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.03;
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start();
  }, [volume]);

  useEffect(() => {
    if (nodesRef.current.master) nodesRef.current.master.gain.value = volume * 0.4;
  }, [volume]);

  useEffect(() => {
    if (!isPlaying || showIntro || segment >= STORY.length) return;
    let i = 0;
    setText('');
    const typeInt = setInterval(() => {
      if (i < STORY[segment].text.length) {
        setText(STORY[segment].text.slice(0, ++i));
      } else {
        clearInterval(typeInt);
        setTimeout(() => {
          if (segment < STORY.length - 1) setSegment(s => s + 1);
          else if (onComplete) setTimeout(onComplete, 5000);
        }, STORY[segment].pause);
      }
    }, 55);
    return () => clearInterval(typeInt);
  }, [isPlaying, segment, showIntro, onComplete]);

  const start = async () => { await initAudio(); audioContextRef.current?.resume(); setShowIntro(false); setIsPlaying(true); };
  const stop = () => { setIsPlaying(false); audioContextRef.current?.close(); audioContextRef.current = null; };
  useEffect(() => () => stop(), []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(180deg, #1a1520 0%, #0a0810 100%)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        {[...Array(40)].map((_, i) => <div key={i} style={{ position: 'absolute', left: `${Math.random()*100}%`, top: `${Math.random()*50}%`, width: 1, height: 1, background: 'white', borderRadius: '50%', opacity: 0.3 + Math.random()*0.4 }} />)}
      </div>
      <header style={{ position: 'relative', zIndex: 10, padding: 'max(env(safe-area-inset-top,16px),16px) 20px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => { stop(); onBack(); }} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, color: 'white', fontSize: 13, cursor: 'pointer' }}>← Back</button>
        {isPlaying && !showIntro && <div style={{ flex: 1, maxWidth: 150, margin: '0 16px', height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}><div style={{ height: '100%', width: `${((segment+1)/STORY.length)*100}%`, background: 'rgba(200,180,255,0.5)', borderRadius: 2 }} /></div>}
        <div style={{ width: 60 }} />
      </header>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 30, position: 'relative', zIndex: 10 }}>
        {showIntro ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>🏘️</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.8rem,7vw,2.5rem)', color: 'white', marginBottom: 8, fontWeight: 300 }}>The Quiet Village</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>A Sleep Story · 20 min</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <button onClick={start} style={{ padding: '14px 36px', background: 'rgba(200,180,255,0.15)', border: '1px solid rgba(200,180,255,0.3)', borderRadius: 25, color: 'white', fontSize: 15, cursor: 'pointer' }}>Begin Story</button>

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
                          <g transform="translate(1 1)" stroke="rgba(200,180,255,0.9)" strokeWidth="2">
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