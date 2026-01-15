'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface BlankCanvasProps {
  onBack: () => void;
  onComplete?: (imageData: string) => void;
}

// Full color palette - maximum creative freedom
const COLORS = [
  // Row 1 - Warm
  { color: '#fecaca', name: 'Blush' },
  { color: '#fda4af', name: 'Rose' },
  { color: '#fb7185', name: 'Pink' },
  { color: '#f43f5e', name: 'Red' },
  { color: '#dc2626', name: 'Crimson' },
  // Row 2 - Orange/Yellow
  { color: '#fed7aa', name: 'Peach' },
  { color: '#fdba74', name: 'Apricot' },
  { color: '#fb923c', name: 'Orange' },
  { color: '#fbbf24', name: 'Amber' },
  { color: '#facc15', name: 'Yellow' },
  // Row 3 - Green
  { color: '#d9f99d', name: 'Lime' },
  { color: '#a3e635', name: 'Green' },
  { color: '#4ade80', name: 'Emerald' },
  { color: '#34d399', name: 'Mint' },
  { color: '#2dd4bf', name: 'Teal' },
  // Row 4 - Blue
  { color: '#a5f3fc', name: 'Cyan' },
  { color: '#7dd3fc', name: 'Sky' },
  { color: '#60a5fa', name: 'Blue' },
  { color: '#3b82f6', name: 'Royal' },
  { color: '#2563eb', name: 'Deep Blue' },
  // Row 5 - Purple
  { color: '#c4b5fd', name: 'Lavender' },
  { color: '#a78bfa', name: 'Violet' },
  { color: '#8b5cf6', name: 'Purple' },
  { color: '#7c3aed', name: 'Grape' },
  { color: '#6d28d9', name: 'Indigo' },
  // Row 6 - Neutrals
  { color: '#ffffff', name: 'White' },
  { color: '#e5e5e5', name: 'Light Gray' },
  { color: '#a3a3a3', name: 'Gray' },
  { color: '#525252', name: 'Dark Gray' },
  { color: '#171717', name: 'Black' },
];

const BRUSH_SIZES = [
  { size: 2, label: 'XS' },
  { size: 6, label: 'S' },
  { size: 14, label: 'M' },
  { size: 28, label: 'L' },
  { size: 50, label: 'XL' },
];

const BRUSH_TYPES = [
  { id: 'round', name: 'Round', opacity: 1 },
  { id: 'soft', name: 'Soft', opacity: 0.6 },
  { id: 'marker', name: 'Marker', opacity: 0.85 },
];

export default function BlankCanvas({ onBack, onComplete }: BlankCanvasProps) {
  const { isDark, colors } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [selectedColor, setSelectedColor] = useState(COLORS[17].color); // Blue
  const [brushSize, setBrushSize] = useState(14);
  const [brushType, setBrushType] = useState(BRUSH_TYPES[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showTools, setShowTools] = useState(true);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const bgColor = isDark ? '#0f0f18' : '#fefefe';

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
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveToHistory();
      }
    }
  }, [canvasSize, bgColor]);

  // Save canvas state to history
  const saveToHistory = useCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        setHistory(prev => {
          const newHistory = prev.slice(0, historyIndex + 1);
          newHistory.push(imageData);
          if (newHistory.length > 50) newHistory.shift(); // Limit history
          return newHistory;
        });
        setHistoryIndex(prev => Math.min(prev + 1, 49));
      }
    }
  }, [historyIndex]);

  // Undo
  const undo = () => {
    if (historyIndex > 0 && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.putImageData(history[historyIndex - 1], 0, 0);
        setHistoryIndex(prev => prev - 1);
      }
    }
  };

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1 && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.putImageData(history[historyIndex + 1], 0, 0);
        setHistoryIndex(prev => prev + 1);
      }
    }
  };

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

  // Draw
  const draw = useCallback((pos: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? bgColor : selectedColor;
    ctx.lineWidth = isEraser ? brushSize * 2 : brushSize;
    ctx.globalAlpha = isEraser ? 1 : brushType.opacity;

    if (lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, (isEraser ? brushSize : brushSize / 2), 0, Math.PI * 2);
      ctx.fillStyle = isEraser ? bgColor : selectedColor;
      ctx.globalAlpha = isEraser ? 1 : brushType.opacity;
      ctx.fill();
    }

    lastPos.current = pos;
    setHasDrawn(true);
  }, [selectedColor, brushSize, brushType, isEraser, bgColor]);

  // Event handlers
  const handleStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPosition(e);
    if (pos) { lastPos.current = null; draw(pos); }
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
      saveToHistory();
    }
  }, [isDrawing, saveToHistory]);

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
      saveToHistory();
    }
  };

  // Get canvas image
  const getCanvasImage = () => canvasRef.current?.toDataURL('image/png') || '';

  const bg = isDark
    ? 'linear-gradient(180deg, #0c0c14 0%, #12121c 50%, #0a0a10 100%)'
    : 'linear-gradient(180deg, #f8f8f8 0%, #f0f0f0 50%, #e8e8e8 100%)';

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .tool-btn { transition: all 0.15s ease; }
        .tool-btn:active { transform: scale(0.92); }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Minimal Header */}
        <header style={{ padding: 'max(env(safe-area-inset-top, 8px), 8px) 12px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 30 }}>
          <button onClick={onBack} style={{ padding: '6px 14px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 16, color: colors.text, fontSize: 13, cursor: 'pointer' }}>← Back</button>
          
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={undo} disabled={historyIndex <= 0} className="tool-btn" style={{ padding: '6px 12px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 16, color: historyIndex <= 0 ? colors.textMuted : colors.text, fontSize: 12, cursor: historyIndex <= 0 ? 'default' : 'pointer', opacity: historyIndex <= 0 ? 0.5 : 1 }}>Undo</button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="tool-btn" style={{ padding: '6px 12px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 16, color: historyIndex >= history.length - 1 ? colors.textMuted : colors.text, fontSize: 12, cursor: historyIndex >= history.length - 1 ? 'default' : 'pointer', opacity: historyIndex >= history.length - 1 ? 0.5 : 1 }}>Redo</button>
          </div>

          <button onClick={() => setShowTools(!showTools)} style={{ padding: '6px 14px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 16, color: colors.text, fontSize: 12, cursor: 'pointer' }}>{showTools ? 'Hide' : 'Tools'}</button>
        </header>

        {/* Canvas Container */}
        <div ref={containerRef} style={{ flex: 1, position: 'relative', margin: '0 12px', marginBottom: showTools ? 0 : 12, borderRadius: 12, overflow: 'hidden', boxShadow: isDark ? '0 4px 30px rgba(0,0,0,0.5)' : '0 4px 30px rgba(0,0,0,0.1)' }}>
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
            style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none', cursor: isEraser ? 'cell' : 'crosshair' }}
          />
        </div>

        {/* Tools Panel */}
        {showTools && (
          <div style={{ padding: '12px', paddingBottom: 'max(env(safe-area-inset-bottom, 12px), 12px)', background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.9)', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, animation: 'slideUp 0.2s ease' }}>
            {/* Color Palette */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 12 }}>
              {COLORS.map((item) => (
                <button
                  key={item.color}
                  onClick={() => { setSelectedColor(item.color); setIsEraser(false); }}
                  className="tool-btn"
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: item.color,
                    border: selectedColor === item.color && !isEraser ? '3px solid rgba(139,92,246,0.9)' : (item.color === '#ffffff' ? '1px solid #ddd' : '1px solid transparent'),
                    cursor: 'pointer',
                    boxShadow: selectedColor === item.color && !isEraser ? '0 0 10px rgba(139,92,246,0.5)' : 'none',
                  }}
                />
              ))}
            </div>

            {/* Tools Row */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Brush Sizes */}
              <div style={{ display: 'flex', gap: 4 }}>
                {BRUSH_SIZES.map((item) => (
                  <button
                    key={item.size}
                    onClick={() => setBrushSize(item.size)}
                    className="tool-btn"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: brushSize === item.size ? (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)') : 'transparent',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ width: Math.max(4, item.size / 3), height: Math.max(4, item.size / 3), borderRadius: '50%', background: colors.text, opacity: brushSize === item.size ? 1 : 0.4 }} />
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div style={{ width: 1, height: 24, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

              {/* Brush Types */}
              <div style={{ display: 'flex', gap: 4 }}>
                {BRUSH_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => { setBrushType(type); setIsEraser(false); }}
                    className="tool-btn"
                    style={{
                      padding: '6px 12px',
                      background: brushType.id === type.id && !isEraser ? (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)') : 'transparent',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      borderRadius: 14,
                      color: brushType.id === type.id && !isEraser ? colors.text : colors.textMuted,
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    {type.name}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div style={{ width: 1, height: 24, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

              {/* Eraser */}
              <button
                onClick={() => setIsEraser(!isEraser)}
                className="tool-btn"
                style={{
                  padding: '6px 12px',
                  background: isEraser ? 'rgba(239,68,68,0.2)' : 'transparent',
                  border: `1px solid ${isEraser ? 'rgba(239,68,68,0.5)' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`,
                  borderRadius: 14,
                  color: isEraser ? '#ef4444' : colors.textMuted,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                Eraser
              </button>

              {/* Clear */}
              <button onClick={clearCanvas} className="tool-btn" style={{ padding: '6px 12px', background: 'transparent', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 14, color: colors.textMuted, fontSize: 11, cursor: 'pointer' }}>Clear</button>

              {/* Done */}
              <button
                onClick={() => {
                  const image = getCanvasImage();
                  if (onComplete) onComplete(image);
                  onBack();
                }}
                disabled={!hasDrawn}
                className="tool-btn"
                style={{
                  padding: '8px 20px',
                  background: hasDrawn ? 'linear-gradient(135deg, rgba(139,92,246,0.9) 0%, rgba(109,40,217,0.85) 100%)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
                  border: 'none',
                  borderRadius: 16,
                  color: hasDrawn ? 'white' : colors.textMuted,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: hasDrawn ? 'pointer' : 'default',
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}