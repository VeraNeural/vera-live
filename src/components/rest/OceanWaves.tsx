'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface OceanWavesProps {
  onBack: () => void;
  onComplete?: () => void;
}

export default function OceanWaves({ onBack, onComplete }: OceanWavesProps) {
  const { isDark, colors } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ [key: string]: any }>({});
  const animationRef = useRef<number>(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes
  const [selectedDuration, setSelectedDuration] = useState(45);
  const [showSettings, setShowSettings] = useState(false);

  // Initialize Audio Context and create ocean sounds
  const initAudio = useCallback(async () => {
    if (audioContextRef.current) return;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;

    // Master gain
    const masterGain = ctx.createGain();
    masterGain.gain.value = volume * 0.5;
    masterGain.connect(ctx.destination);
    nodesRef.current.masterGain = masterGain;

    // Create multiple layers of ocean sounds

    // Layer 1: Deep ocean rumble (low frequency noise)
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const lowpassDeep = ctx.createBiquadFilter();
    lowpassDeep.type = 'lowpass';
    lowpassDeep.frequency.value = 200;

    const deepGain = ctx.createGain();
    deepGain.gain.value = 0.3;

    whiteNoise.connect(lowpassDeep);
    lowpassDeep.connect(deepGain);
    deepGain.connect(masterGain);
    whiteNoise.start();
    nodesRef.current.whiteNoise = whiteNoise;

    // Layer 2: Wave crash sounds (filtered noise with envelope)
    const createWaveCrash = (delay: number, intensity: number) => {
      const crashNoise = ctx.createBufferSource();
      crashNoise.buffer = noiseBuffer;
      crashNoise.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 800 + Math.random() * 400;
      bandpass.Q.value = 0.5;

      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 300;

      const crashGain = ctx.createGain();
      crashGain.gain.value = 0;

      crashNoise.connect(bandpass);
      bandpass.connect(highpass);
      highpass.connect(crashGain);
      crashGain.connect(masterGain);
      crashNoise.start();

      // Create wave envelope
      const cycleDuration = 8 + Math.random() * 6; // 8-14 seconds per wave
      
      const animateWave = () => {
        if (!audioContextRef.current) return;
        const now = ctx.currentTime;
        
        crashGain.gain.cancelScheduledValues(now);
        crashGain.gain.setValueAtTime(0, now);
        crashGain.gain.linearRampToValueAtTime(intensity * 0.4, now + cycleDuration * 0.3);
        crashGain.gain.linearRampToValueAtTime(intensity * 0.15, now + cycleDuration * 0.5);
        crashGain.gain.linearRampToValueAtTime(0, now + cycleDuration * 0.9);
        
        setTimeout(animateWave, cycleDuration * 1000);
      };

      setTimeout(animateWave, delay * 1000);
      return { source: crashNoise, gain: crashGain };
    };

    // Create multiple wave layers with different timings
    nodesRef.current.waves = [
      createWaveCrash(0, 0.8),
      createWaveCrash(3, 0.6),
      createWaveCrash(7, 0.7),
    ];

    // Layer 3: Gentle high-frequency shimmer (foam/bubbles)
    const shimmerNoise = ctx.createBufferSource();
    shimmerNoise.buffer = noiseBuffer;
    shimmerNoise.loop = true;

    const highpass2 = ctx.createBiquadFilter();
    highpass2.type = 'highpass';
    highpass2.frequency.value = 3000;

    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0.05;

    shimmerNoise.connect(highpass2);
    highpass2.connect(shimmerGain);
    shimmerGain.connect(masterGain);
    shimmerNoise.start();
    nodesRef.current.shimmerNoise = shimmerNoise;

    // Layer 4: Sub bass undertone
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.value = 40;

    const subGain = ctx.createGain();
    subGain.gain.value = 0.1;

    // LFO for sub bass movement
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 10;
    lfo.connect(lfoGain);
    lfoGain.connect(subOsc.frequency);
    lfo.start();

    subOsc.connect(subGain);
    subGain.connect(masterGain);
    subOsc.start();
    nodesRef.current.subOsc = subOsc;
    nodesRef.current.lfo = lfo;

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

      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#0a1628');
      gradient.addColorStop(0.4, '#0f2744');
      gradient.addColorStop(0.7, '#1a3a5c');
      gradient.addColorStop(1, '#0d2137');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      for (let i = 0; i < 50; i++) {
        const x = (Math.sin(i * 234.5) * 0.5 + 0.5) * width;
        const y = (Math.cos(i * 567.8) * 0.5 + 0.5) * height * 0.4;
        const twinkle = Math.sin(time * 0.001 + i) * 0.5 + 0.5;
        ctx.globalAlpha = twinkle * 0.8;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Moon
      const moonX = width * 0.8;
      const moonY = height * 0.15;
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 80);
      moonGlow.addColorStop(0, 'rgba(255, 255, 240, 0.9)');
      moonGlow.addColorStop(0.2, 'rgba(255, 255, 220, 0.3)');
      moonGlow.addColorStop(1, 'rgba(255, 255, 200, 0)');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 80, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fffef0';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 25, 0, Math.PI * 2);
      ctx.fill();

      // Draw multiple wave layers
      const drawWave = (yOffset: number, amplitude: number, speed: number, color: string, alpha: number) => {
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        for (let x = 0; x <= width; x += 5) {
          const y = yOffset + 
            Math.sin(x * 0.008 + time * speed * 0.001) * amplitude +
            Math.sin(x * 0.015 + time * speed * 0.0015) * (amplitude * 0.5) +
            Math.sin(x * 0.003 + time * speed * 0.0008) * (amplitude * 1.5);
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(width, height);
        ctx.closePath();
        
        const waveGradient = ctx.createLinearGradient(0, yOffset - amplitude, 0, height);
        waveGradient.addColorStop(0, color);
        waveGradient.addColorStop(1, 'rgba(10, 30, 50, 0.95)');
        ctx.fillStyle = waveGradient;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      };

      // Back waves
      drawWave(height * 0.55, 20, 0.3, 'rgba(30, 80, 120, 0.6)', 0.5);
      drawWave(height * 0.6, 25, 0.4, 'rgba(40, 100, 140, 0.7)', 0.6);
      
      // Moon reflection on water
      const reflectionGradient = ctx.createLinearGradient(moonX - 30, height * 0.5, moonX + 30, height);
      reflectionGradient.addColorStop(0, 'rgba(255, 255, 220, 0.3)');
      reflectionGradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
      ctx.fillStyle = reflectionGradient;
      ctx.fillRect(moonX - 40, height * 0.55, 80, height * 0.45);

      // Front waves
      drawWave(height * 0.65, 30, 0.5, 'rgba(50, 120, 160, 0.8)', 0.7);
      drawWave(height * 0.72, 25, 0.6, 'rgba(60, 140, 180, 0.9)', 0.8);
      drawWave(height * 0.78, 20, 0.7, 'rgba(70, 160, 200, 0.95)', 0.9);

      // Foam particles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let i = 0; i < 30; i++) {
        const px = (time * 0.02 + i * 50) % width;
        const baseY = height * 0.75 + Math.sin(px * 0.01 + time * 0.001) * 15;
        const py = baseY + Math.sin(time * 0.003 + i) * 5;
        const size = 1 + Math.sin(time * 0.002 + i * 2) * 0.5;
        ctx.globalAlpha = 0.3 + Math.sin(time * 0.001 + i) * 0.2;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      time += 16;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  // Timer countdown
  useEffect(() => {
    if (!isPlaying || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleStop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining]);

  // Start playback
  const handlePlay = async () => {
    await initAudio();
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    setIsPlaying(true);
  };

  // Stop playback
  const handleStop = () => {
    setIsPlaying(false);
    
    // Stop all audio nodes
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      nodesRef.current = {};
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      handleStop();
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Set duration
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

      <div style={{ position: 'fixed', inset: 0, background: '#0a1628', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Canvas Background */}
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Header */}
        <header style={{ position: 'relative', zIndex: 10, padding: 'max(env(safe-area-inset-top, 16px), 16px) 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => { handleStop(); onBack(); }} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, color: 'white', fontSize: 13, cursor: 'pointer' }}>← Back</button>
          
          <button onClick={() => setShowSettings(!showSettings)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, color: 'white', fontSize: 13, cursor: 'pointer' }}>
            {selectedDuration} min
          </button>
        </header>

        {/* Center Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10, padding: 20 }}>
          {!isPlaying ? (
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: 300, color: 'white', marginBottom: 8, letterSpacing: '0.02em' }}>Ocean Waves</h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 40 }}>Ambient sounds for deep rest</p>
              
              <button onClick={handlePlay} style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)', color: 'white', fontSize: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <span style={{ marginLeft: 4 }}>▶</span>
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Now Playing</p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', fontWeight: 300, color: 'white', marginBottom: 24 }}>Ocean Waves</h1>
              
              <div style={{ fontSize: 48, fontWeight: 200, color: 'white', fontFamily: 'monospace', marginBottom: 32, animation: 'pulse 4s ease-in-out infinite' }}>
                {formatTime(timeRemaining)}
              </div>

              <button onClick={handleStop} style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)', color: 'white', fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                ⏹
              </button>
            </div>
          )}
        </div>

        {/* Volume Control */}
        <div style={{ position: 'relative', zIndex: 10, padding: '20px', paddingBottom: 'max(env(safe-area-inset-bottom, 20px), 20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>🔈</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ width: 150, accentColor: '#60a5fa' }}
          />
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>🔊</span>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 24, maxWidth: 300, width: '90%' }}>
              <h3 style={{ color: 'white', fontSize: 18, marginBottom: 20, textAlign: 'center' }}>Duration</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[15, 30, 45, 60, 90].map(mins => (
                  <button key={mins} onClick={() => handleSetDuration(mins)} style={{ padding: '14px 20px', background: selectedDuration === mins ? 'rgba(96,165,250,0.3)' : 'rgba(255,255,255,0.1)', border: `1px solid ${selectedDuration === mins ? 'rgba(96,165,250,0.5)' : 'rgba(255,255,255,0.2)'}`, borderRadius: 12, color: 'white', fontSize: 16, cursor: 'pointer' }}>
                    {mins} minutes
                  </button>
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