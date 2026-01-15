'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface BodyScanForSleepProps {
  onBack: () => void;
  onComplete?: () => void;
}

const GUIDANCE = [
  { text: "Find a comfortable position. Let your body settle into the surface beneath you.", pause: 8000, bodyPart: 'full' },
  { text: "Take a slow, deep breath in... and let it go completely.", pause: 6000, bodyPart: 'full' },
  { text: "Another breath... feeling your body grow heavier with each exhale.", pause: 7000, bodyPart: 'full' },
  { text: "Bring your attention to the top of your head. Notice any tension there...", pause: 6000, bodyPart: 'head' },
  { text: "Let it soften. Let it release. Your scalp relaxes completely.", pause: 7000, bodyPart: 'head' },
  { text: "Move to your forehead. Smooth away any furrows of worry...", pause: 6000, bodyPart: 'head' },
  { text: "Your eyes... let them rest heavy in their sockets. No need to look at anything.", pause: 7000, bodyPart: 'head' },
  { text: "Your jaw... let it go slack. Lips slightly parted. Tongue resting gently.", pause: 7000, bodyPart: 'head' },
  { text: "Feel the relaxation flowing down your neck... each muscle softening.", pause: 7000, bodyPart: 'neck' },
  { text: "Your shoulders... let them drop away from your ears. Heavy and loose.", pause: 8000, bodyPart: 'shoulders' },
  { text: "The relaxation spreads down your arms... through your elbows... forearms...", pause: 7000, bodyPart: 'arms' },
  { text: "Into your hands... your fingers... letting go of everything you've held today.", pause: 8000, bodyPart: 'arms' },
  { text: "Return to your chest. Feel your heart beating slowly, steadily.", pause: 7000, bodyPart: 'chest' },
  { text: "Your breathing is natural and easy. The breath breathes itself.", pause: 7000, bodyPart: 'chest' },
  { text: "Your belly softens... releasing any holding... expanding and contracting naturally.", pause: 8000, bodyPart: 'belly' },
  { text: "Feel your lower back melt into the surface beneath you...", pause: 7000, bodyPart: 'back' },
  { text: "Your hips release... your pelvis grows heavy...", pause: 7000, bodyPart: 'hips' },
  { text: "The relaxation flows down your thighs... warm and heavy...", pause: 7000, bodyPart: 'legs' },
  { text: "Your knees soften... your calves let go...", pause: 6000, bodyPart: 'legs' },
  { text: "Down to your feet... your toes... completely relaxed.", pause: 7000, bodyPart: 'feet' },
  { text: "Your whole body now... one wave of relaxation... heavy and peaceful.", pause: 8000, bodyPart: 'full' },
  { text: "You are safe. You are calm. You are ready for sleep.", pause: 8000, bodyPart: 'full' },
  { text: "Let yourself drift now... deeper and deeper into rest...", pause: 10000, bodyPart: 'full' },
  { text: "Sleep... peaceful sleep...", pause: 15000, bodyPart: 'full' },
];

export default function BodyScanForSleep({ onBack, onComplete }: BodyScanForSleepProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<any>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [segment, setSegment] = useState(0);
  const [text, setText] = useState('');
  const [volume, setVolume] = useState(0.6);
  const [showIntro, setShowIntro] = useState(true);
  const [activePart, setActivePart] = useState('full');

  const initAudio = useCallback(async () => {
    if (audioContextRef.current) return;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;
    const master = ctx.createGain();
    master.gain.value = volume * 0.35;
    master.connect(ctx.destination);
    nodesRef.current.master = master;

    // Deep, soothing drone
    [110, 165, 220].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.value = 0.04 - i * 0.01;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 500;
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      osc.start();
    });

    // Soft breathing rhythm noise
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const nFilter = ctx.createBiquadFilter();
    nFilter.type = 'lowpass';
    nFilter.frequency.value = 200;
    const nGain = ctx.createGain();
    nGain.gain.value = 0.02;
    noise.connect(nFilter);
    nFilter.connect(nGain);
    nGain.connect(master);
    noise.start();
  }, [volume]);

  useEffect(() => {
    if (nodesRef.current.master) nodesRef.current.master.gain.value = volume * 0.35;
  }, [volume]);

  useEffect(() => {
    if (!isPlaying || showIntro || segment >= GUIDANCE.length) return;
    let i = 0;
    setText('');
    setActivePart(GUIDANCE[segment].bodyPart);
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
  const stop = () => { setIsPlaying(false); audioContextRef.current?.close(); audioContextRef.current = null; };
  useEffect(() => () => stop(), []);

  const getPartOpacity = (part: string) => activePart === part || activePart === 'full' ? 1 : 0.3;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(180deg, #0f1419 0%, #080c10 100%)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ position: 'relative', zIndex: 10, padding: 'max(env(safe-area-inset-top,16px),16px) 20px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => { stop(); onBack(); }} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, color: 'white', fontSize: 13, cursor: 'pointer' }}>← Back</button>
        {isPlaying && !showIntro && <div style={{ flex: 1, maxWidth: 150, margin: '0 16px', height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}><div style={{ height: '100%', width: `${((segment+1)/GUIDANCE.length)*100}%`, background: 'rgba(150,200,255,0.5)', borderRadius: 2 }} /></div>}
        <div style={{ width: 60 }} />
      </header>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', zIndex: 10 }}>
        {showIntro ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>◎</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.6rem,6vw,2.2rem)', color: 'white', marginBottom: 8, fontWeight: 300 }}>Body Scan for Sleep</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>Guided Meditation · 15 min</p>
            <button onClick={start} style={{ padding: '14px 36px', background: 'rgba(150,200,255,0.15)', border: '1px solid rgba(150,200,255,0.3)', borderRadius: 25, color: 'white', fontSize: 15, cursor: 'pointer' }}>Begin</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, width: '100%', maxWidth: 400 }}>
            {/* Body visualization */}
            <svg viewBox="0 0 100 200" style={{ width: 80, height: 160, opacity: 0.6 }}>
              <ellipse cx="50" cy="20" rx="15" ry="18" fill={`rgba(150,200,255,${getPartOpacity('head')})`} style={{ transition: 'fill 0.5s' }} />
              <rect x="45" y="38" width="10" height="15" fill={`rgba(150,200,255,${getPartOpacity('neck')})`} style={{ transition: 'fill 0.5s' }} />
              <ellipse cx="50" cy="75" rx="25" ry="30" fill={`rgba(150,200,255,${getPartOpacity('chest')})`} style={{ transition: 'fill 0.5s' }} />
              <line x1="25" y1="55" x2="5" y2="100" stroke={`rgba(150,200,255,${getPartOpacity('arms')})`} strokeWidth="8" strokeLinecap="round" style={{ transition: 'stroke 0.5s' }} />
              <line x1="75" y1="55" x2="95" y2="100" stroke={`rgba(150,200,255,${getPartOpacity('arms')})`} strokeWidth="8" strokeLinecap="round" style={{ transition: 'stroke 0.5s' }} />
              <ellipse cx="50" cy="115" rx="20" ry="15" fill={`rgba(150,200,255,${getPartOpacity('belly')})`} style={{ transition: 'fill 0.5s' }} />
              <ellipse cx="50" cy="135" rx="22" ry="12" fill={`rgba(150,200,255,${getPartOpacity('hips')})`} style={{ transition: 'fill 0.5s' }} />
              <line x1="40" y1="145" x2="35" y2="190" stroke={`rgba(150,200,255,${getPartOpacity('legs')})`} strokeWidth="10" strokeLinecap="round" style={{ transition: 'stroke 0.5s' }} />
              <line x1="60" y1="145" x2="65" y2="190" stroke={`rgba(150,200,255,${getPartOpacity('legs')})`} strokeWidth="10" strokeLinecap="round" style={{ transition: 'stroke 0.5s' }} />
              <ellipse cx="32" cy="195" rx="8" ry="4" fill={`rgba(150,200,255,${getPartOpacity('feet')})`} style={{ transition: 'fill 0.5s' }} />
              <ellipse cx="68" cy="195" rx="8" ry="4" fill={`rgba(150,200,255,${getPartOpacity('feet')})`} style={{ transition: 'fill 0.5s' }} />
            </svg>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.1rem,4.5vw,1.4rem)', color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 1.7 }}>{text}</p>
          </div>
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