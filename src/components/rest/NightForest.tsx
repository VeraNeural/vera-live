'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface NightForestProps {
  onBack: () => void;
  onComplete?: () => void;
}

interface Firefly {
  x: number;
  y: number;
  phase: number;
  speed: number;
  brightness: number;
}

export default function NightForest({ onBack, onComplete }: NightForestProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ [key: string]: any }>({});
  const animationRef = useRef<number>(0);
  const firefliesRef = useRef<Firefly[]>([]);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60);
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [showSettings, setShowSettings] = useState(false);

  // Initialize fireflies
  useEffect(() => {
    firefliesRef.current = Array.from({ length: 35 }, () => ({
      x: Math.random() * 800,
      y: 100 + Math.random() * 400,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1,
      brightness: 0.5 + Math.random() * 0.5,
    }));
  }, []);

  // Initialize Audio
  const initAudio = useCallback(async () => {
    if (audioContextRef.current) return;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = volume * 0.5;
    masterGain.connect(ctx.destination);
    nodesRef.current.masterGain = masterGain;

    // Create noise buffer
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    // Layer 1: Ambient forest hum (very low)
    const ambientNoise = ctx.createBufferSource();
    ambientNoise.buffer = noiseBuffer;
    ambientNoise.loop = true;

    const ambientFilter = ctx.createBiquadFilter();
    ambientFilter.type = 'lowpass';
    ambientFilter.frequency.value = 300;

    const ambientGain = ctx.createGain();
    ambientGain.gain.value = 0.08;

    ambientNoise.connect(ambientFilter);
    ambientFilter.connect(ambientGain);
    ambientGain.connect(masterGain);
    ambientNoise.start();
    nodesRef.current.ambientNoise = ambientNoise;

    // Layer 2: Cricket chirps (multiple oscillators with rhythmic pattern)
    const createCricket = (baseFreq: number, delay: number) => {
      const cricketGain = ctx.createGain();
      cricketGain.gain.value = 0;
      cricketGain.connect(masterGain);

      const chirp = () => {
        if (!audioContextRef.current) return;
        const now = ctx.currentTime;
        
        // Create a short burst of oscillation
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = baseFreq + Math.random() * 200;

        const chirpGain = ctx.createGain();
        chirpGain.gain.setValueAtTime(0, now);
        
        // Rapid on-off pattern for cricket sound
        const chirpDuration = 0.05;
        const numChirps = 3 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numChirps; i++) {
          const chirpStart = now + i * 0.08;
          chirpGain.gain.setValueAtTime(0.12, chirpStart);
          chirpGain.gain.setValueAtTime(0, chirpStart + chirpDuration);
        }

        osc.connect(chirpGain);
        chirpGain.connect(masterGain);
        osc.start(now);
        osc.stop(now + numChirps * 0.1);

        // Schedule next chirp
        const nextChirp = 800 + Math.random() * 2000;
        setTimeout(chirp, nextChirp);
      };

      setTimeout(chirp, delay);
      return cricketGain;
    };

    // Create multiple cricket voices
    createCricket(4500, 0);
    createCricket(5000, 300);
    createCricket(4200, 600);
    createCricket(4800, 900);

    // Layer 3: Owl hoots (occasional)
    const createOwlHoot = () => {
      if (!audioContextRef.current) return;
      const now = ctx.currentTime;

      // Owl hoot is a low frequency tone with slight pitch bend
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(350, now);
      osc1.frequency.linearRampToValueAtTime(280, now + 0.8);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(175, now);
      osc2.frequency.linearRampToValueAtTime(140, now + 0.8);

      const owlGain = ctx.createGain();
      owlGain.gain.setValueAtTime(0, now);
      owlGain.gain.linearRampToValueAtTime(0.15, now + 0.1);
      owlGain.gain.setValueAtTime(0.15, now + 0.5);
      owlGain.gain.linearRampToValueAtTime(0, now + 0.9);

      const owlFilter = ctx.createBiquadFilter();
      owlFilter.type = 'lowpass';
      owlFilter.frequency.value = 600;

      osc1.connect(owlFilter);
      osc2.connect(owlFilter);
      owlFilter.connect(owlGain);
      owlGain.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1);
      osc2.stop(now + 1);

      // Second hoot
      setTimeout(() => {
        if (!audioContextRef.current) return;
        const now2 = ctx.currentTime;

        const osc3 = ctx.createOscillator();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(300, now2);
        osc3.frequency.linearRampToValueAtTime(250, now2 + 0.6);

        const owlGain2 = ctx.createGain();
        owlGain2.gain.setValueAtTime(0, now2);
        owlGain2.gain.linearRampToValueAtTime(0.12, now2 + 0.1);
        owlGain2.gain.linearRampToValueAtTime(0, now2 + 0.7);

        osc3.connect(owlFilter);
        owlGain2.connect(masterGain);

        osc3.start(now2);
        osc3.stop(now2 + 0.8);
      }, 1200);

      // Schedule next owl hoot
      const nextHoot = 20000 + Math.random() * 40000;
      setTimeout(createOwlHoot, nextHoot);
    };

    setTimeout(createOwlHoot, 5000);

    // Layer 4: Gentle wind through trees
    const windNoise = ctx.createBufferSource();
    windNoise.buffer = noiseBuffer;
    windNoise.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.value = 400;
    windFilter.Q.value = 0.5;

    const windGain = ctx.createGain();
    windGain.gain.value = 0.06;

    // LFO for wind
    const windLfo = ctx.createOscillator();
    windLfo.frequency.value = 0.1;
    const windLfoGain = ctx.createGain();
    windLfoGain.gain.value = 0.04;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(windGain.gain);
    windLfo.start();

    windNoise.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(masterGain);
    windNoise.start();
    nodesRef.current.windNoise = windNoise;

    // Layer 5: Distant frog croaks
    const createFrog = () => {
      if (!audioContextRef.current) return;
      const now = ctx.currentTime;

      const frogOsc = ctx.createOscillator();
      frogOsc.type = 'sawtooth';
      frogOsc.frequency.setValueAtTime(120, now);
      frogOsc.frequency.linearRampToValueAtTime(80, now + 0.15);

      const frogGain = ctx.createGain();
      frogGain.gain.setValueAtTime(0, now);
      frogGain.gain.linearRampToValueAtTime(0.08, now + 0.02);
      frogGain.gain.linearRampToValueAtTime(0, now + 0.2);

      const frogFilter = ctx.createBiquadFilter();
      frogFilter.type = 'lowpass';
      frogFilter.frequency.value = 300;

      frogOsc.connect(frogFilter);
      frogFilter.connect(frogGain);
      frogGain.connect(masterGain);

      frogOsc.start(now);
      frogOsc.stop(now + 0.3);

      const nextFrog = 3000 + Math.random() * 8000;
      setTimeout(createFrog, nextFrog);
    };

    setTimeout(createFrog, 2000);

  }, [volume]);

  // Update volume
  useEffect(() => {
    if (nodesRef.current.masterGain) {
      nodesRef.current.masterGain.gain.value = volume * 0.5;
    }
  }, [volume]);

  // Visual animation
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Night sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      skyGradient.addColorStop(0, '#0a0a14');
      skyGradient.addColorStop(0.3, '#0f1020');
      skyGradient.addColorStop(0.7, '#141828');
      skyGradient.addColorStop(1, '#0a0f18');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Stars
      ctx.fillStyle = 'white';
      for (let i = 0; i < 80; i++) {
        const x = (Math.sin(i * 123.4) * 0.5 + 0.5) * width;
        const y = (Math.cos(i * 456.7) * 0.5 + 0.5) * height * 0.5;
        const twinkle = Math.sin(time * 0.002 + i * 2) * 0.4 + 0.6;
        ctx.globalAlpha = twinkle * 0.7;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() < 0.1 ? 1.5 : 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Crescent moon
      const moonX = width * 0.15;
      const moonY = height * 0.12;
      
      // Moon glow
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 60);
      moonGlow.addColorStop(0, 'rgba(200, 210, 255, 0.3)');
      moonGlow.addColorStop(1, 'rgba(200, 210, 255, 0)');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 60, 0, Math.PI * 2);
      ctx.fill();

      // Crescent
      ctx.fillStyle = '#e8e8f0';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0a0a14';
      ctx.beginPath();
      ctx.arc(moonX + 8, moonY - 2, 14, 0, Math.PI * 2);
      ctx.fill();

      // Silhouette trees (back layer)
      ctx.fillStyle = '#080c12';
      for (let i = 0; i < 15; i++) {
        const treeX = i * 60 + 20;
        const treeHeight = 150 + Math.sin(i * 1.5) * 50;
        const treeWidth = 30 + Math.sin(i * 2.3) * 15;
        
        ctx.beginPath();
        ctx.moveTo(treeX, height * 0.65);
        ctx.lineTo(treeX + treeWidth / 2, height * 0.65 - treeHeight);
        ctx.lineTo(treeX + treeWidth, height * 0.65);
        ctx.closePath();
        ctx.fill();
      }

      // Silhouette trees (front layer)
      ctx.fillStyle = '#050810';
      for (let i = 0; i < 10; i++) {
        const treeX = i * 90 + 40;
        const treeHeight = 200 + Math.sin(i * 2.1) * 60;
        const treeWidth = 50 + Math.sin(i * 1.7) * 20;
        const sway = Math.sin(time * 0.0008 + i) * 3;
        
        ctx.beginPath();
        ctx.moveTo(treeX, height * 0.75);
        ctx.lineTo(treeX + treeWidth / 2 + sway, height * 0.75 - treeHeight);
        ctx.lineTo(treeX + treeWidth, height * 0.75);
        ctx.closePath();
        ctx.fill();
      }

      // Ground
      ctx.fillStyle = '#040608';
      ctx.fillRect(0, height * 0.75, width, height * 0.25);

      // Fireflies
      firefliesRef.current.forEach((firefly) => {
        // Update position
        firefly.x += Math.sin(time * 0.001 + firefly.phase) * firefly.speed * 0.5;
        firefly.y += Math.cos(time * 0.0015 + firefly.phase) * firefly.speed * 0.3;
        
        // Wrap around
        if (firefly.x < 0) firefly.x = width;
        if (firefly.x > width) firefly.x = 0;
        if (firefly.y < 100) firefly.y = 500;
        if (firefly.y > 500) firefly.y = 100;

        // Pulsing glow
        const pulse = Math.sin(time * 0.003 + firefly.phase) * 0.5 + 0.5;
        const glowSize = 15 + pulse * 10;
        
        // Glow
        const fireflyGlow = ctx.createRadialGradient(firefly.x, firefly.y, 0, firefly.x, firefly.y, glowSize);
        fireflyGlow.addColorStop(0, `rgba(180, 255, 100, ${pulse * firefly.brightness * 0.8})`);
        fireflyGlow.addColorStop(0.5, `rgba(150, 255, 80, ${pulse * firefly.brightness * 0.3})`);
        fireflyGlow.addColorStop(1, 'rgba(100, 200, 50, 0)');
        
        ctx.fillStyle = fireflyGlow;
        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(220, 255, 150, ${pulse * firefly.brightness})`;
        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle mist
      ctx.fillStyle = 'rgba(20, 30, 40, 0.1)';
      for (let i = 0; i < 5; i++) {
        const mistX = (time * 0.01 + i * 200) % (width + 200) - 100;
        const mistY = height * 0.6 + Math.sin(time * 0.0005 + i) * 20;
        ctx.beginPath();
        ctx.ellipse(mistX, mistY, 150, 30, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      time += 16;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying]);

  // Timer
  useEffect(() => {
    if (!isPlaying || timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) { handleStop(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining]);

  const handlePlay = async () => {
    await initAudio();
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      nodesRef.current = {};
    }
  };

  useEffect(() => {
    return () => { handleStop(); cancelAnimationFrame(animationRef.current); };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSetDuration = (mins: number) => {
    setSelectedDuration(mins);
    setTimeRemaining(mins * 60);
    setShowSettings(false);
  };

  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, background: '#0a0a14', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <canvas ref={canvasRef} width={800} height={600} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

        <header style={{ position: 'relative', zIndex: 10, padding: 'max(env(safe-area-inset-top, 16px), 16px) 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => { handleStop(); onBack(); }} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, color: 'white', fontSize: 13, cursor: 'pointer' }}>← Back</button>
          <button onClick={() => setShowSettings(!showSettings)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, color: 'white', fontSize: 13, cursor: 'pointer' }}>{selectedDuration} min</button>
        </header>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10, padding: 20 }}>
          {!isPlaying ? (
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: 300, color: 'white', marginBottom: 8 }}>Night Forest</h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 40 }}>Crickets, owls, and gentle wind</p>
              <button onClick={handlePlay} style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)', color: 'white', fontSize: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <span style={{ marginLeft: 4 }}>▶</span>
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Now Playing</p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', fontWeight: 300, color: 'white', marginBottom: 24 }}>Night Forest</h1>
              <div style={{ fontSize: 48, fontWeight: 200, color: 'white', fontFamily: 'monospace', marginBottom: 32, animation: 'pulse 4s ease-in-out infinite' }}>{formatTime(timeRemaining)}</div>
              <button onClick={handleStop} style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)', color: 'white', fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>⏹</button>
            </div>
          )}
        </div>

        <div style={{ position: 'relative', zIndex: 10, padding: '20px', paddingBottom: 'max(env(safe-area-inset-bottom, 20px), 20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>🔈</span>
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} style={{ width: 150, accentColor: '#a3e635' }} />
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>🔊</span>
        </div>

        {showSettings && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 24, maxWidth: 300, width: '90%' }}>
              <h3 style={{ color: 'white', fontSize: 18, marginBottom: 20, textAlign: 'center' }}>Duration</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[15, 30, 45, 60].map(mins => (
                  <button key={mins} onClick={() => handleSetDuration(mins)} style={{ padding: '14px 20px', background: selectedDuration === mins ? 'rgba(163,230,53,0.3)' : 'rgba(255,255,255,0.1)', border: `1px solid ${selectedDuration === mins ? 'rgba(163,230,53,0.5)' : 'rgba(255,255,255,0.2)'}`, borderRadius: 12, color: 'white', fontSize: 16, cursor: 'pointer' }}>{mins} minutes</button>
                ))}
              </div>
              <button onClick={() => setShowSettings(false)} style={{ marginTop: 16, width: '100%', padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, color: 'rgba(255,255,255,0.6)', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}