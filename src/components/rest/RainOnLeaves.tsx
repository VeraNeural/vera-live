'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface RainOnLeavesProps {
  onBack: () => void;
  onComplete?: () => void;
}

interface Raindrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

interface Leaf {
  x: number;
  y: number;
  size: number;
  rotation: number;
  swayOffset: number;
  color: string;
}

export default function RainOnLeaves({ onBack, onComplete }: RainOnLeavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ [key: string]: any }>({});
  const animationRef = useRef<number>(0);
  const raindropsRef = useRef<Raindrop[]>([]);
  const leavesRef = useRef<Leaf[]>([]);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [showSettings, setShowSettings] = useState(false);
  const [rainIntensity, setRainIntensity] = useState(0.7);

  // Initialize raindrops and leaves
  useEffect(() => {
    // Create leaves
    const leafColors = ['#2d5a3d', '#3d6b4a', '#4a7c57', '#1e4a2d', '#528a5e'];
    leavesRef.current = Array.from({ length: 40 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 600,
      size: 20 + Math.random() * 40,
      rotation: Math.random() * Math.PI * 2,
      swayOffset: Math.random() * Math.PI * 2,
      color: leafColors[Math.floor(Math.random() * leafColors.length)],
    }));

    // Initialize raindrops
    raindropsRef.current = Array.from({ length: 200 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 600,
      speed: 8 + Math.random() * 8,
      length: 15 + Math.random() * 20,
      opacity: 0.3 + Math.random() * 0.4,
    }));
  }, []);

  // Initialize Audio
  const initAudio = useCallback(async () => {
    if (audioContextRef.current) return;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = volume * 0.6;
    masterGain.connect(ctx.destination);
    nodesRef.current.masterGain = masterGain;

    // Create noise buffer
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    // Layer 1: Heavy rain (pink noise style)
    const rainNoise = ctx.createBufferSource();
    rainNoise.buffer = noiseBuffer;
    rainNoise.loop = true;

    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.value = 8000;

    const rainHighpass = ctx.createBiquadFilter();
    rainHighpass.type = 'highpass';
    rainHighpass.frequency.value = 400;

    const rainGain = ctx.createGain();
    rainGain.gain.value = 0.35 * rainIntensity;

    rainNoise.connect(rainFilter);
    rainFilter.connect(rainHighpass);
    rainHighpass.connect(rainGain);
    rainGain.connect(masterGain);
    rainNoise.start();
    nodesRef.current.rainNoise = rainNoise;
    nodesRef.current.rainGain = rainGain;

    // Layer 2: Light patter (high frequency)
    const patterNoise = ctx.createBufferSource();
    patterNoise.buffer = noiseBuffer;
    patterNoise.loop = true;

    const patterFilter = ctx.createBiquadFilter();
    patterFilter.type = 'bandpass';
    patterFilter.frequency.value = 6000;
    patterFilter.Q.value = 0.8;

    const patterGain = ctx.createGain();
    patterGain.gain.value = 0.15 * rainIntensity;

    patterNoise.connect(patterFilter);
    patterFilter.connect(patterGain);
    patterGain.connect(masterGain);
    patterNoise.start();
    nodesRef.current.patterNoise = patterNoise;

    // Layer 3: Dripping sounds (randomized resonant pings)
    const createDrip = () => {
      if (!audioContextRef.current) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 800 + Math.random() * 1200;

      const dripGain = ctx.createGain();
      dripGain.gain.setValueAtTime(0.08 * rainIntensity, now);
      dripGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      const dripFilter = ctx.createBiquadFilter();
      dripFilter.type = 'bandpass';
      dripFilter.frequency.value = osc.frequency.value;
      dripFilter.Q.value = 10;

      osc.connect(dripFilter);
      dripFilter.connect(dripGain);
      dripGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.2);

      // Schedule next drip
      const nextDrip = 100 + Math.random() * 400;
      setTimeout(createDrip, nextDrip);
    };

    // Start multiple drip streams
    setTimeout(() => createDrip(), 500);
    setTimeout(() => createDrip(), 1200);
    setTimeout(() => createDrip(), 2000);

    // Layer 4: Distant thunder (occasional)
    const createThunder = () => {
      if (!audioContextRef.current) return;
      const now = ctx.currentTime;

      const thunderNoise = ctx.createBufferSource();
      thunderNoise.buffer = noiseBuffer;

      const thunderFilter = ctx.createBiquadFilter();
      thunderFilter.type = 'lowpass';
      thunderFilter.frequency.value = 150;

      const thunderGain = ctx.createGain();
      thunderGain.gain.setValueAtTime(0, now);
      thunderGain.gain.linearRampToValueAtTime(0.3 * rainIntensity, now + 0.5);
      thunderGain.gain.linearRampToValueAtTime(0.15 * rainIntensity, now + 1.5);
      thunderGain.gain.linearRampToValueAtTime(0, now + 4);

      thunderNoise.connect(thunderFilter);
      thunderFilter.connect(thunderGain);
      thunderGain.connect(masterGain);

      thunderNoise.start(now);
      thunderNoise.stop(now + 5);

      // Schedule next thunder
      const nextThunder = 30000 + Math.random() * 60000;
      setTimeout(createThunder, nextThunder);
    };

    setTimeout(createThunder, 10000);

    // Layer 5: Leaves rustling
    const rustleNoise = ctx.createBufferSource();
    rustleNoise.buffer = noiseBuffer;
    rustleNoise.loop = true;

    const rustleFilter = ctx.createBiquadFilter();
    rustleFilter.type = 'bandpass';
    rustleFilter.frequency.value = 3000;
    rustleFilter.Q.value = 2;

    const rustleGain = ctx.createGain();
    rustleGain.gain.value = 0.05;

    // LFO for rustle
    const rustleLfo = ctx.createOscillator();
    rustleLfo.frequency.value = 0.3;
    const rustleLfoGain = ctx.createGain();
    rustleLfoGain.gain.value = 0.03;
    rustleLfo.connect(rustleLfoGain);
    rustleLfoGain.connect(rustleGain.gain);
    rustleLfo.start();

    rustleNoise.connect(rustleFilter);
    rustleFilter.connect(rustleGain);
    rustleGain.connect(masterGain);
    rustleNoise.start();
    nodesRef.current.rustleNoise = rustleNoise;

  }, [volume, rainIntensity]);

  // Update volume
  useEffect(() => {
    if (nodesRef.current.masterGain) {
      nodesRef.current.masterGain.gain.value = volume * 0.6;
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

      // Dark forest background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#0a1510');
      gradient.addColorStop(0.5, '#0d1a14');
      gradient.addColorStop(1, '#081210');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw leaves (background layer)
      leavesRef.current.forEach((leaf, i) => {
        const sway = Math.sin(time * 0.001 + leaf.swayOffset) * 3;
        
        ctx.save();
        ctx.translate(leaf.x + sway, leaf.y);
        ctx.rotate(leaf.rotation + Math.sin(time * 0.002 + leaf.swayOffset) * 0.1);
        
        // Leaf shape
        ctx.beginPath();
        ctx.moveTo(0, -leaf.size / 2);
        ctx.quadraticCurveTo(leaf.size / 3, -leaf.size / 4, leaf.size / 4, 0);
        ctx.quadraticCurveTo(leaf.size / 3, leaf.size / 4, 0, leaf.size / 2);
        ctx.quadraticCurveTo(-leaf.size / 3, leaf.size / 4, -leaf.size / 4, 0);
        ctx.quadraticCurveTo(-leaf.size / 3, -leaf.size / 4, 0, -leaf.size / 2);
        ctx.closePath();
        
        ctx.fillStyle = leaf.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        
        // Leaf vein
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -leaf.size / 2);
        ctx.lineTo(0, leaf.size / 2);
        ctx.stroke();
        
        ctx.restore();
      });

      ctx.globalAlpha = 1;

      // Draw and update raindrops
      raindropsRef.current.forEach((drop) => {
        // Draw raindrop
        ctx.strokeStyle = `rgba(180, 200, 220, ${drop.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 2, drop.y + drop.length);
        ctx.stroke();

        // Update position
        drop.y += drop.speed;
        drop.x -= 0.5;

        // Reset if off screen
        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }
        if (drop.x < 0) {
          drop.x = width;
        }
      });

      // Splash effects at bottom
      for (let i = 0; i < 10; i++) {
        const splashX = (time * 0.5 + i * 80) % width;
        const splashY = height - 50 + Math.random() * 30;
        const splashSize = 2 + Math.random() * 3;
        
        ctx.fillStyle = 'rgba(180, 200, 220, 0.4)';
        ctx.beginPath();
        ctx.arc(splashX, splashY, splashSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Fog overlay
      const fogGradient = ctx.createLinearGradient(0, height * 0.6, 0, height);
      fogGradient.addColorStop(0, 'rgba(30, 50, 40, 0)');
      fogGradient.addColorStop(1, 'rgba(30, 50, 40, 0.5)');
      ctx.fillStyle = fogGradient;
      ctx.fillRect(0, 0, width, height);

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

      <div style={{ position: 'fixed', inset: 0, background: '#0a1510', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <canvas ref={canvasRef} width={800} height={600} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

        <header style={{ position: 'relative', zIndex: 10, padding: 'max(env(safe-area-inset-top, 16px), 16px) 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => { handleStop(); onBack(); }} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, color: 'white', fontSize: 13, cursor: 'pointer' }}>← Back</button>
          <button onClick={() => setShowSettings(!showSettings)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, color: 'white', fontSize: 13, cursor: 'pointer' }}>{selectedDuration} min</button>
        </header>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10, padding: 20 }}>
          {!isPlaying ? (
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: 300, color: 'white', marginBottom: 8 }}>Rain on Leaves</h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 40 }}>Gentle forest rain for deep rest</p>
              <button onClick={handlePlay} style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)', color: 'white', fontSize: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <span style={{ marginLeft: 4 }}>▶</span>
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Now Playing</p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', fontWeight: 300, color: 'white', marginBottom: 24 }}>Rain on Leaves</h1>
              <div style={{ fontSize: 48, fontWeight: 200, color: 'white', fontFamily: 'monospace', marginBottom: 32, animation: 'pulse 4s ease-in-out infinite' }}>{formatTime(timeRemaining)}</div>
              <button onClick={handleStop} style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)', color: 'white', fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>⏹</button>
            </div>
          )}
        </div>

        <div style={{ position: 'relative', zIndex: 10, padding: '20px', paddingBottom: 'max(env(safe-area-inset-bottom, 20px), 20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>🔈</span>
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} style={{ width: 150, accentColor: '#4ade80' }} />
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>🔊</span>
        </div>

        {showSettings && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 24, maxWidth: 300, width: '90%' }}>
              <h3 style={{ color: 'white', fontSize: 18, marginBottom: 20, textAlign: 'center' }}>Duration</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[15, 30, 45, 60, 90, 120].map(mins => (
                  <button key={mins} onClick={() => handleSetDuration(mins)} style={{ padding: '14px 20px', background: selectedDuration === mins ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)', border: `1px solid ${selectedDuration === mins ? 'rgba(74,222,128,0.5)' : 'rgba(255,255,255,0.2)'}`, borderRadius: 12, color: 'white', fontSize: 16, cursor: 'pointer' }}>{mins} minutes</button>
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