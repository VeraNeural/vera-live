'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { generateStoryAudio } from '@/lib/library/generation/audioGenerator';

interface LettingGoOfTheDayProps {
  onBack: () => void;
  onComplete?: () => void;
}

const GUIDANCE = [
  { text: "Settle into a comfortable position. The day is done. Your only task now is rest.", pause: 8000 },
  { text: "Take a deep breath in... and as you exhale, let your shoulders drop.", pause: 7000 },
  { text: "Another breath... releasing any tension you've been carrying.", pause: 7000 },
  { text: "Think back to the beginning of this day... when you first opened your eyes.", pause: 8000 },
  { text: "So much has happened since then. So much you've done, felt, experienced.", pause: 7000 },
  { text: "Some moments were easy. Some were difficult. All of them are passing now.", pause: 8000 },
  { text: "If there were moments of stress... breathe into them... and let them go.", pause: 8000 },
  { text: "You did the best you could with what you had. That is always enough.", pause: 8000 },
  { text: "If there were moments of joy... hold them gently... then let them float away too.", pause: 8000 },
  { text: "The day is like a river that has flowed past you. You cannot hold the water.", pause: 8000 },
  { text: "Let it go. Let it all go. Tomorrow is its own river, its own journey.", pause: 8000 },
  { text: "Right now, there is nothing to do. Nothing to fix. Nothing to figure out.", pause: 8000 },
  { text: "Just this breath. Just this moment. Just this gentle falling away.", pause: 8000 },
  { text: "Your mind may wander to tomorrow... gently guide it back to now.", pause: 7000 },
  { text: "Tomorrow will take care of itself. Tonight, you rest.", pause: 8000 },
  { text: "Feel the weight of the day lifting from your chest...", pause: 7000 },
  { text: "Feel your thoughts growing quieter... slower... softer...", pause: 8000 },
  { text: "You are letting go. You are drifting. You are finding peace.", pause: 8000 },
  { text: "Let the night hold you now... safe... warm... complete.", pause: 10000 },
  { text: "Rest now... let go... sleep...", pause: 15000 },
];

export default function LettingGoOfTheDay({ onBack, onComplete }: LettingGoOfTheDayProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<any>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [segment, setSegment] = useState(0);
  const [text, setText] = useState('');
  const [volume, setVolume] = useState(0.6);
  const [showIntro, setShowIntro] = useState(true);
  const [narrationUrl, setNarrationUrl] = useState<string>('');
  const [isNarrating, setIsNarrating] = useState(false);
  const [narrationError, setNarrationError] = useState<string | null>(null);

  const narrationText = GUIDANCE.map((s) => s.text).join('\n\n');

  const handleListenWithVera = async () => {
    if (narrationUrl || isNarrating) return;
    setIsNarrating(true);
    setNarrationError(null);
    try {
      const { audioUrl } = await generateStoryAudio({
        text: narrationText,
        storyId: 'rest-letting-go-of-the-day',
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
    master.gain.value = volume * 0.35;
    master.connect(ctx.destination);
    nodesRef.current.master = master;

    // Ethereal pad
    [146, 174, 220, 261].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.value = 0.03;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      osc.start();
    });

    // Soft ambient noise
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const nFilter = ctx.createBiquadFilter();
    nFilter.type = 'lowpass';
    nFilter.frequency.value = 250;
    const nGain = ctx.createGain();
    nGain.gain.value = 0.025;
    noise.connect(nFilter);
    nFilter.connect(nGain);
    nGain.connect(master);
    noise.start();
  }, [volume]);

  useEffect(() => {
    if (nodesRef.current.master) nodesRef.current.master.gain.value = volume * 0.35;
  }, [volume]);

  // Floating particles animation
  useEffect(() => {
    if (!isPlaying || showIntro) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 2 + Math.random() * 3,
        speed: 0.2 + Math.random() * 0.5,
        opacity: 0.2 + Math.random() * 0.4,
      });
    }

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.y -= p.speed;
        p.x += Math.sin(time * 0.01 + p.y * 0.01) * 0.3;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        glow.addColorStop(0, `rgba(180, 160, 255, ${p.opacity})`);
        glow.addColorStop(1, 'rgba(180, 160, 255, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();
      });
      
      time++;
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, showIntro]);

  useEffect(() => {
    if (!isPlaying || showIntro || segment >= GUIDANCE.length) return;
    let i = 0;
    setText('');
    const int = setInterval(() => {
      if (i < GUIDANCE[segment].text.length) setText(GUIDANCE[segment].text.slice(0, ++i));
      else {
        clearInterval(int);
        setTimeout(() => {
          if (segment < GUIDANCE.length - 1) setSegment(s => s + 1);
          else if (onComplete) setTimeout(onComplete, 5000);
        }, GUIDANCE[segment].pause);
      }
    }, 50);
    return () => clearInterval(int);
  }, [isPlaying, segment, showIntro, onComplete]);

  const start = async () => { await initAudio(); audioContextRef.current?.resume(); setShowIntro(false); setIsPlaying(true); };
  const stop = () => { setIsPlaying(false); audioContextRef.current?.close(); audioContextRef.current = null; cancelAnimationFrame(animRef.current); };
  useEffect(() => () => stop(), []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(180deg, #12101a 0%, #08060c 100%)', display: 'flex', flexDirection: 'column' }}>
      <canvas ref={canvasRef} width={400} height={600} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      
      <header style={{ position: 'relative', zIndex: 10, padding: 'max(env(safe-area-inset-top,16px),16px) 20px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => { stop(); onBack(); }} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, color: 'white', fontSize: 13, cursor: 'pointer' }}>← Back</button>
        {isPlaying && !showIntro && <div style={{ flex: 1, maxWidth: 150, margin: '0 16px', height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}><div style={{ height: '100%', width: `${((segment+1)/GUIDANCE.length)*100}%`, background: 'rgba(180,160,255,0.5)', borderRadius: 2 }} /></div>}
        <div style={{ width: 60 }} />
      </header>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 30, position: 'relative', zIndex: 10 }}>
        {showIntro ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, margin: '0 auto 24px', borderRadius: '50%', background: 'rgba(180,160,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 36 }}>○</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.6rem,6vw,2.2rem)', color: 'white', marginBottom: 8, fontWeight: 300 }}>Letting Go of the Day</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>Guided Meditation · 20 min</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <button onClick={start} style={{ padding: '14px 36px', background: 'rgba(180,160,255,0.15)', border: '1px solid rgba(180,160,255,0.3)', borderRadius: 25, color: 'white', fontSize: 15, cursor: 'pointer' }}>Begin</button>

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
                          <g transform="translate(1 1)" stroke="rgba(180,160,255,0.9)" strokeWidth="2">
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
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.2rem,5vw,1.5rem)', color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 1.8, maxWidth: 500 }}>{text}</p>
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