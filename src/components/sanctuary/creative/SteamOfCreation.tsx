'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface StreamOfCreationProps {
  onBack: () => void;
  onComplete?: (imageData: string) => void;
}

// Flowing, gradient-based color sets
const COLOR_STREAMS = [
  { id: 'ocean', name: 'Ocean', colors: ['#0ea5e9', '#06b6d4', '#14b8a6', '#0891b2'], bg: '#0c1929' },
  { id: 'sunset', name: 'Sunset', colors: ['#f97316', '#f59e0b', '#ec4899', '#f43f5e'], bg: '#1a0f0a' },
  { id: 'forest', name: 'Forest', colors: ['#22c55e', '#10b981', '#14b8a6', '#84cc16'], bg: '#0a1a10' },
  { id: 'aurora', name: 'Aurora', colors: ['#a855f7', '#8b5cf6', '#06b6d4', '#22c55e'], bg: '#0f0a1a' },
  { id: 'blossom', name: 'Blossom', colors: ['#ec4899', '#f472b6', '#fb7185', '#fda4af'], bg: '#1a0a14' },
  { id: 'mono', name: 'Monochrome', colors: ['#f8fafc', '#e2e8f0', '#94a3b8', '#64748b'], bg: '#0f0f14' },
];

const FLOW_MODES = [
  { id: 'smooth', name: 'Smooth', description: 'Gentle, flowing lines' },
  { id: 'ribbon', name: 'Ribbon', description: 'Varying width strokes' },
  { id: 'glow', name: 'Glow', description: 'Luminous trails' },
  { id: 'scatter', name: 'Scatter', description: 'Particle-like dots' },
];

export default function StreamOfCreation({ onBack, onComplete }: StreamOfCreationProps) {
  const { isDark, colors } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [selectedStream, setSelectedStream] = useState(COLOR_STREAMS[3]); // Aurora
  const [flowMode, setFlowMode] = useState(FLOW_MODES[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [colorIndex, setColorIndex] = useState(0);
  const [strokeCount, setStrokeCount] = useState(0);
  
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const velocity = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const points = useRef<{ x: number; y: number; pressure: number }[]>([]);

  // Set canvas size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current && canvasSize.width > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = selectedStream.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [canvasSize, selectedStream.bg]);

  // Cycle colors automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex(prev => (prev + 1) % selectedStream.colors.length);
    }, 800);
    return () => clearInterval(interval);
  }, [selectedStream.colors.length]);

  // Get position
  const getPosition = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      const touch = e.touches[0];
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }, []);

  // Draw based on flow mode
  const draw = useCallback((pos: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const currentColor = selectedStream.colors[colorIndex];
    
    // Calculate velocity for dynamic effects
    if (lastPos.current) {
      velocity.current = {
        x: pos.x - lastPos.current.x,
        y: pos.y - lastPos.current.y,
      };
    }
    const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);

    switch (flowMode.id) {
      case 'smooth':
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = Math.max(3, 15 - speed * 0.3);
        ctx.globalAlpha = 0.8;
        if (lastPos.current) {
          ctx.beginPath();
          ctx.moveTo(lastPos.current.x, lastPos.current.y);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
        }
        break;

      case 'ribbon':
        const ribbonWidth = Math.max(2, Math.min(40, speed * 1.5));
        ctx.lineCap = 'round';
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = ribbonWidth;
        ctx.globalAlpha = 0.6;
        if (lastPos.current) {
          ctx.beginPath();
          ctx.moveTo(lastPos.current.x, lastPos.current.y);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
        }
        // Add highlight
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = ribbonWidth * 0.3;
        if (lastPos.current) {
          ctx.beginPath();
          ctx.moveTo(lastPos.current.x - 2, lastPos.current.y - 2);
          ctx.lineTo(pos.x - 2, pos.y - 2);
          ctx.stroke();
        }
        break;

      case 'glow':
        // Outer glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = currentColor;
        ctx.lineCap = 'round';
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = 6;
        ctx.globalAlpha = 0.9;
        if (lastPos.current) {
          ctx.beginPath();
          ctx.moveTo(lastPos.current.x, lastPos.current.y);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
        }
        // Inner bright core
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 2;
        if (lastPos.current) {
          ctx.beginPath();
          ctx.moveTo(lastPos.current.x, lastPos.current.y);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
        break;

      case 'scatter':
        ctx.globalAlpha = 0.8;
        const particles = Math.max(1, Math.floor(speed / 3));
        for (let i = 0; i < particles; i++) {
          const offsetX = (Math.random() - 0.5) * speed * 2;
          const offsetY = (Math.random() - 0.5) * speed * 2;
          const size = Math.random() * 4 + 1;
          ctx.beginPath();
          ctx.arc(pos.x + offsetX, pos.y + offsetY, size, 0, Math.PI * 2);
          ctx.fillStyle = selectedStream.colors[Math.floor(Math.random() * selectedStream.colors.length)];
          ctx.fill();
        }
        // Central dot
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = currentColor;
        ctx.fill();
        break;
    }

    lastPos.current = pos;
    setHasDrawn(true);
  }, [selectedStream.colors, colorIndex, flowMode.id]);

  // Event handlers
  const handleStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    setShowControls(false);
    const pos = getPosition(e);
    if (pos) {
      lastPos.current = pos;
      velocity.current = { x: 0, y: 0 };
      draw(pos);
    }
  }, [getPosition, draw]);

  const handleMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPosition(e);
    if (pos) draw(pos);
  }, [isDrawing, getPosition, draw]);

  const handleEnd = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      lastPos.current = null;
      setStrokeCount(prev => prev + 1);
    }
  }, [isDrawing]);

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.fillStyle = selectedStream.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
      setStrokeCount(0);
    }
  };

  // Change stream
  const changeStream = (stream: typeof COLOR_STREAMS[0]) => {
    setSelectedStream(stream);
    // Update background
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas && !hasDrawn) {
      ctx.fillStyle = stream.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Get canvas image
  const getCanvasImage = () => canvasRef.current?.toDataURL('image/png') || '';

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .stream-btn { transition: all 0.2s ease; }
        .stream-btn:active { transform: scale(0.95); }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, background: selectedStream.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'background 0.5s ease' }}>
        {/* Minimal floating header */}
        <header style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: 'max(env(safe-area-inset-top, 8px), 8px) 12px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 30, pointerEvents: 'none' }}>
          <button onClick={onBack} style={{ padding: '6px 14px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: 16, color: 'white', fontSize: 13, cursor: 'pointer', pointerEvents: 'auto' }}>← Back</button>
          
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', pointerEvents: 'auto' }}>
            {/* Current color indicator */}
            <div style={{ display: 'flex', gap: 4, padding: '4px 8px', background: 'rgba(0,0,0,0.3)', borderRadius: 12 }}>
              {selectedStream.colors.map((color, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: color, opacity: i === colorIndex ? 1 : 0.4, transition: 'opacity 0.3s ease', boxShadow: i === colorIndex ? `0 0 8px ${color}` : 'none' }} />
              ))}
            </div>
            
            <button onClick={() => setShowControls(!showControls)} style={{ padding: '6px 14px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: 16, color: 'white', fontSize: 12, cursor: 'pointer' }}>{showControls ? 'Flow' : 'Options'}</button>
          </div>
        </header>

        {/* Canvas - fullscreen */}
        <div ref={containerRef} style={{ position: 'absolute', inset: 0 }}>
          <canvas
            ref={canvasRef}
            width={canvasSize.width || 400}
            height={canvasSize.height || 400}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            onTouchCancel={handleEnd}
            style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none', cursor: 'crosshair' }}
          />
        </div>

        {/* Floating message when starting */}
        {!hasDrawn && !showControls && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none', animation: 'pulse 2s ease-in-out infinite' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>Let your hands move freely...</p>
          </div>
        )}

        {/* Controls Panel */}
        {showControls && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 16px)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.1)', animation: 'slideUp 0.2s ease' }}>
            {/* Color Streams */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Color Stream</p>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 4 }}>
                {COLOR_STREAMS.map((stream) => (
                  <button key={stream.id} onClick={() => changeStream(stream)} className="stream-btn" style={{ padding: '10px 14px', background: selectedStream.id === stream.id ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${selectedStream.id === stream.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 12, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {stream.colors.map((color, i) => (
                        <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{stream.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Flow Modes */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Flow Mode</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {FLOW_MODES.map((mode) => (
                  <button key={mode.id} onClick={() => setFlowMode(mode)} className="stream-btn" style={{ padding: '8px 16px', background: flowMode.id === mode.id ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${flowMode.id === mode.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 20, cursor: 'pointer' }}>
                    <span style={{ fontSize: 12, color: flowMode.id === mode.id ? 'white' : 'rgba(255,255,255,0.6)' }}>{mode.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={clearCanvas} className="stream-btn" style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, color: 'rgba(255,255,255,0.8)', fontSize: 13, cursor: 'pointer' }}>Clear</button>
              
              <button onClick={() => { setShowControls(false); }} className="stream-btn" style={{ padding: '10px 24px', background: 'linear-gradient(135deg, rgba(139,92,246,0.8) 0%, rgba(109,40,217,0.8) 100%)', border: 'none', borderRadius: 20, color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Start Flowing</button>
              
              <button onClick={() => { const image = getCanvasImage(); if (onComplete) onComplete(image); onBack(); }} disabled={!hasDrawn} className="stream-btn" style={{ padding: '10px 20px', background: hasDrawn ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${hasDrawn ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 20, color: hasDrawn ? 'white' : 'rgba(255,255,255,0.4)', fontSize: 13, cursor: hasDrawn ? 'pointer' : 'default' }}>Done</button>
            </div>
          </div>
        )}

        {/* Floating done button when controls hidden */}
        {!showControls && hasDrawn && (
          <button onClick={() => { const image = getCanvasImage(); if (onComplete) onComplete(image); onBack(); }} style={{ position: 'absolute', bottom: 'max(env(safe-area-inset-bottom, 20px), 20px)', right: 20, padding: '12px 24px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 25, color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer', animation: 'fadeIn 0.3s ease' }}>Done</button>
        )}
      </div>
    </>
  );
}