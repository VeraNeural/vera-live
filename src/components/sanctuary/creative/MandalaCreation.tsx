'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface MandalaCreationProps {
  onBack: () => void;
  onComplete?: (imageData: string) => void;
}

// Mandala color palette - harmonious, meditative colors
const MANDALA_COLORS = [
  { color: '#e879f9', name: 'Orchid' },
  { color: '#c084fc', name: 'Violet' },
  { color: '#a78bfa', name: 'Lavender' },
  { color: '#818cf8', name: 'Periwinkle' },
  { color: '#60a5fa', name: 'Sky' },
  { color: '#38bdf8', name: 'Cyan' },
  { color: '#2dd4bf', name: 'Teal' },
  { color: '#34d399', name: 'Emerald' },
  { color: '#a3e635', name: 'Lime' },
  { color: '#facc15', name: 'Gold' },
  { color: '#fb923c', name: 'Tangerine' },
  { color: '#f87171', name: 'Coral' },
];

const BRUSH_SIZES = [
  { size: 4, label: 'Fine' },
  { size: 10, label: 'Medium' },
  { size: 18, label: 'Broad' },
];

const SYMMETRY_OPTIONS = [
  { segments: 4, label: '4-fold' },
  { segments: 6, label: '6-fold' },
  { segments: 8, label: '8-fold' },
  { segments: 12, label: '12-fold' },
];

const GUIDANCE_PROMPTS = [
  "Start from the center and let your pattern grow outward",
  "Repeat a simple shape — circles, petals, or waves",
  "Follow the rhythm of your breath as you draw",
  "Let each stroke mirror itself into harmony",
  "Build layer upon layer, ring upon ring",
  "Find peace in the repetition",
];

type Phase = 'intro' | 'creating' | 'reflection';

export default function MandalaCreation({ onBack, onComplete }: MandalaCreationProps) {
  const { isDark, colors } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedColor, setSelectedColor] = useState(MANDALA_COLORS[2].color);
  const [brushSize, setBrushSize] = useState(10);
  const [symmetrySegments, setSymmetrySegments] = useState(8);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(GUIDANCE_PROMPTS[0]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showGuides, setShowGuides] = useState(true);
  
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const centerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Set canvas size based on container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const size = Math.min(rect.width - 32, rect.height - 220, 500);
        setCanvasSize({ width: size, height: size });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [phase]);

  // Initialize canvas with guides
  const initializeCanvas = useCallback(() => {
    if (canvasRef.current && canvasSize.width > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Fill background
        ctx.fillStyle = isDark ? '#0f0f18' : '#fdfcfa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        centerRef.current = { x: centerX, y: centerY };
        
        if (showGuides) {
          // Draw concentric circle guides
          ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
          ctx.lineWidth = 1;
          
          const maxRadius = Math.min(centerX, centerY) - 10;
          const rings = 5;
          
          for (let i = 1; i <= rings; i++) {
            const radius = (maxRadius / rings) * i;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
          }
          
          // Draw radial guides
          for (let i = 0; i < symmetrySegments; i++) {
            const angle = (Math.PI * 2 / symmetrySegments) * i;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
              centerX + Math.cos(angle) * maxRadius,
              centerY + Math.sin(angle) * maxRadius
            );
            ctx.stroke();
          }
          
          // Draw center dot
          ctx.beginPath();
          ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
          ctx.fill();
        }
      }
    }
  }, [canvasSize, isDark, showGuides, symmetrySegments]);

  // Initialize canvas when phase changes
  useEffect(() => {
    if (phase === 'creating') {
      initializeCanvas();
    }
  }, [phase, initializeCanvas]);

  // Get position from touch or mouse event
  const getPosition = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  }, []);

  // Draw with radial symmetry
  const draw = useCallback((pos: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const center = centerRef.current;
    
    // Calculate angle and distance from center
    const dx = pos.x - center.x;
    const dy = pos.y - center.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.globalAlpha = 0.9;

    // Draw in all symmetry segments
    for (let i = 0; i < symmetrySegments; i++) {
      const segmentAngle = (Math.PI * 2 / symmetrySegments) * i;
      const mirroredAngle = segmentAngle + angle;
      
      const newX = center.x + Math.cos(mirroredAngle) * distance;
      const newY = center.y + Math.sin(mirroredAngle) * distance;

      if (lastPos.current) {
        const lastDx = lastPos.current.x - center.x;
        const lastDy = lastPos.current.y - center.y;
        const lastDistance = Math.sqrt(lastDx * lastDx + lastDy * lastDy);
        const lastAngle = Math.atan2(lastDy, lastDx);
        const lastMirroredAngle = segmentAngle + lastAngle;
        
        const lastNewX = center.x + Math.cos(lastMirroredAngle) * lastDistance;
        const lastNewY = center.y + Math.sin(lastMirroredAngle) * lastDistance;

        ctx.beginPath();
        ctx.moveTo(lastNewX, lastNewY);
        ctx.lineTo(newX, newY);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(newX, newY, brushSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = selectedColor;
        ctx.fill();
      }
    }

    lastPos.current = pos;
    setHasDrawn(true);
  }, [selectedColor, brushSize, symmetrySegments]);

  // Event handlers
  const handleStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPosition(e);
    if (pos) {
      lastPos.current = null;
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
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  // New prompt
  const getNewPrompt = () => {
    const others = GUIDANCE_PROMPTS.filter(p => p !== currentPrompt);
    setCurrentPrompt(others[Math.floor(Math.random() * others.length)]);
  };

  // Clear canvas
  const clearCanvas = () => {
    setHasDrawn(false);
    initializeCanvas();
  };

  // Get canvas image
  const getCanvasImage = () => {
    return canvasRef.current?.toDataURL('image/png') || '';
  };

  // Theme
  const bg = isDark
    ? 'linear-gradient(180deg, #0c0c14 0%, #12121c 50%, #0a0a10 100%)'
    : 'linear-gradient(180deg, #faf8f5 0%, #f5f0ea 50%, #efe8e0 100%)';

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .color-btn {
          transition: all 0.2s ease;
        }
        
        .color-btn:active {
          transform: scale(0.92);
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: bg,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: 'max(env(safe-area-inset-top, 12px), 12px) 16px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
            zIndex: 20,
          }}
        >
          <button
            onClick={onBack}
            style={{
              padding: '8px 16px',
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
              borderRadius: 20,
              color: colors.text,
              fontSize: 13,
              fontWeight: 450,
              cursor: 'pointer',
            }}
          >
            ← Back
          </button>
          
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: colors.textMuted,
            }}
          >
            Mandala Creation
          </span>
          
          <div style={{ width: 70 }} />
        </header>

        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 20px',
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease',
            }}
          >
            {/* Mandala icon */}
            <div
              style={{
                position: 'relative',
                width: 100,
                height: 100,
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: `2px solid ${isDark ? 'rgba(167,139,250,0.4)' : 'rgba(139,92,246,0.3)'}`,
                  animation: 'rotate 20s linear infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 15,
                  borderRadius: '50%',
                  border: `2px solid ${isDark ? 'rgba(192,132,252,0.5)' : 'rgba(168,85,247,0.4)'}`,
                  animation: 'rotate 15s linear infinite reverse',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 30,
                  borderRadius: '50%',
                  border: `2px solid ${isDark ? 'rgba(232,121,249,0.6)' : 'rgba(217,70,239,0.5)'}`,
                  animation: 'rotate 10s linear infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 42,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(168,85,247,0.3) 0%, rgba(232,121,249,0.3) 100%)',
                  animation: 'pulse 3s ease-in-out infinite',
                }}
              />
            </div>
            
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(1.6rem, 6vw, 2.2rem)',
                fontWeight: 300,
                color: colors.text,
                marginBottom: 12,
                letterSpacing: '-0.02em',
              }}
            >
              Create Your Mandala
            </h1>
            
            <p
              style={{
                fontSize: 14,
                color: colors.textMuted,
                maxWidth: 320,
                lineHeight: 1.6,
                marginBottom: 40,
              }}
            >
              Draw with radial symmetry to create beautiful, balanced patterns. What you draw is mirrored around the center, creating harmony from every stroke.
            </p>
            
            <button
              onClick={() => setPhase('creating')}
              style={{
                padding: '14px 36px',
                background: 'linear-gradient(135deg, rgba(168,85,247,0.9) 0%, rgba(139,92,246,0.85) 100%)',
                border: 'none',
                borderRadius: 25,
                color: 'white',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(168,85,247,0.3)',
              }}
            >
              Begin
            </button>
          </div>
        )}

        {/* CREATING PHASE */}
        {phase === 'creating' && (
          <div
            ref={containerRef}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px 16px',
              paddingBottom: 'max(env(safe-area-inset-bottom, 12px), 12px)',
              overflow: 'hidden',
            }}
          >
            {/* Prompt */}
            <div
              style={{
                textAlign: 'center',
                marginBottom: 12,
                animation: 'fadeIn 0.4s ease',
              }}
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(0.95rem, 3.5vw, 1.1rem)',
                  fontStyle: 'italic',
                  color: colors.text,
                  marginBottom: 6,
                }}
              >
                "{currentPrompt}"
              </p>
              <button
                onClick={getNewPrompt}
                style={{
                  padding: '5px 12px',
                  background: 'transparent',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: 14,
                  color: colors.textMuted,
                  fontSize: 10,
                  cursor: 'pointer',
                }}
              >
                Different guidance
              </button>
            </div>

            {/* Canvas */}
            <div
              style={{
                position: 'relative',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: isDark
                  ? '0 4px 30px rgba(0,0,0,0.4), inset 0 0 60px rgba(168,85,247,0.05)'
                  : '0 4px 30px rgba(0,0,0,0.1), inset 0 0 60px rgba(168,85,247,0.03)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
              }}
            >
              <canvas
                ref={canvasRef}
                width={canvasSize.width || 300}
                height={canvasSize.height || 300}
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
                onTouchCancel={handleEnd}
                style={{
                  display: 'block',
                  width: canvasSize.width || 300,
                  height: canvasSize.height || 300,
                  touchAction: 'none',
                  cursor: 'crosshair',
                }}
              />
            </div>

            {/* Controls */}
            <div
              style={{
                marginTop: 12,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                maxWidth: 400,
              }}
            >
              {/* Symmetry selector */}
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 11, color: colors.textMuted, marginRight: 4 }}>Symmetry:</span>
                {SYMMETRY_OPTIONS.map((option) => (
                  <button
                    key={option.segments}
                    onClick={() => {
                      setSymmetrySegments(option.segments);
                      if (!hasDrawn) {
                        setTimeout(initializeCanvas, 10);
                      }
                    }}
                    style={{
                      padding: '5px 10px',
                      background: symmetrySegments === option.segments
                        ? (isDark ? 'rgba(168,85,247,0.25)' : 'rgba(168,85,247,0.15)')
                        : 'transparent',
                      border: `1px solid ${symmetrySegments === option.segments
                        ? (isDark ? 'rgba(168,85,247,0.4)' : 'rgba(168,85,247,0.3)')
                        : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`,
                      borderRadius: 12,
                      color: symmetrySegments === option.segments ? colors.text : colors.textMuted,
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Colors Row */}
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                {MANDALA_COLORS.map((item) => (
                  <button
                    key={item.color}
                    className="color-btn"
                    onClick={() => setSelectedColor(item.color)}
                    title={item.name}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: item.color,
                      border: selectedColor === item.color
                        ? '3px solid white'
                        : '2px solid transparent',
                      boxShadow: selectedColor === item.color
                        ? `0 0 12px ${item.color}`
                        : 'none',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  />
                ))}
              </div>

              {/* Brush Size */}
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                {BRUSH_SIZES.map((item) => (
                  <button
                    key={item.size}
                    onClick={() => setBrushSize(item.size)}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      background: brushSize === item.size
                        ? (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)')
                        : 'transparent',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: item.size / 2,
                        height: item.size / 2,
                        borderRadius: '50%',
                        background: colors.text,
                        opacity: brushSize === item.size ? 1 : 0.5,
                      }}
                    />
                  </button>
                ))}
                
                {/* Toggle guides */}
                <button
                  onClick={() => {
                    setShowGuides(!showGuides);
                    if (!hasDrawn) {
                      setTimeout(initializeCanvas, 10);
                    }
                  }}
                  style={{
                    marginLeft: 8,
                    padding: '6px 12px',
                    background: showGuides
                      ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)')
                      : 'transparent',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: 14,
                    color: colors.textMuted,
                    fontSize: 10,
                    cursor: 'pointer',
                  }}
                >
                  Guides {showGuides ? 'On' : 'Off'}
                </button>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  marginTop: 4,
                }}
              >
                <button
                  onClick={clearCanvas}
                  style={{
                    padding: '10px 20px',
                    background: 'transparent',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: 20,
                    color: colors.textMuted,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Clear
                </button>
                
                <button
                  onClick={() => setPhase('reflection')}
                  disabled={!hasDrawn}
                  style={{
                    padding: '10px 24px',
                    background: hasDrawn
                      ? 'linear-gradient(135deg, rgba(168,85,247,0.9) 0%, rgba(139,92,246,0.85) 100%)'
                      : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
                    border: 'none',
                    borderRadius: 20,
                    color: hasDrawn ? 'white' : colors.textMuted,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: hasDrawn ? 'pointer' : 'default',
                    boxShadow: hasDrawn ? '0 2px 12px rgba(168,85,247,0.3)' : 'none',
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REFLECTION PHASE */}
        {phase === 'reflection' && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '24px 20px',
              paddingBottom: 'max(env(safe-area-inset-bottom, 24px), 24px)',
              overflow: 'auto',
              WebkitOverflowScrolling: 'touch',
              animation: 'fadeIn 0.5s ease',
            }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(1.4rem, 5vw, 1.8rem)',
                fontWeight: 300,
                color: colors.text,
                marginBottom: 20,
                textAlign: 'center',
              }}
            >
              Your Mandala
            </h2>

            {/* Canvas Preview */}
            <div
              style={{
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: isDark
                  ? '0 4px 30px rgba(0,0,0,0.4)'
                  : '0 4px 30px rgba(0,0,0,0.1)',
                marginBottom: 24,
                maxWidth: 260,
              }}
            >
              <img
                src={getCanvasImage()}
                alt="Your mandala creation"
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                }}
              />
            </div>

            {/* Reflection prompts */}
            <div
              style={{
                textAlign: 'center',
                maxWidth: 360,
                marginBottom: 32,
              }}
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 18,
                  fontStyle: 'italic',
                  color: colors.text,
                  marginBottom: 16,
                  lineHeight: 1.5,
                }}
              >
                "Notice the balance you've created"
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: colors.textMuted,
                  lineHeight: 1.6,
                }}
              >
                Mandalas represent wholeness — the circle of life, the self, the universe. The symmetry you've drawn reflects the harmony that exists within you, even when life feels chaotic.
              </p>
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                width: '100%',
                maxWidth: 280,
              }}
            >
              <button
                onClick={() => {
                  const image = getCanvasImage();
                  if (onComplete) onComplete(image);
                  onBack();
                }}
                style={{
                  padding: '14px 24px',
                  background: 'linear-gradient(135deg, rgba(168,85,247,0.9) 0%, rgba(139,92,246,0.85) 100%)',
                  border: 'none',
                  borderRadius: 25,
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(168,85,247,0.3)',
                }}
              >
                Complete
              </button>
              
              <button
                onClick={() => setPhase('creating')}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: 25,
                  color: colors.textMuted,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Keep Creating
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}