'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ZentanglePatternsProps {
  onBack: () => void;
  onComplete?: (imageData: string) => void;
}

// Monochromatic palette for zentangle (traditional black/white with subtle variants)
const ZENTANGLE_COLORS = [
  { color: '#1a1a1a', name: 'Ink', description: 'classic, bold' },
  { color: '#374151', name: 'Graphite', description: 'soft, subtle' },
  { color: '#6b7280', name: 'Pewter', description: 'gentle, muted' },
  { color: '#9ca3af', name: 'Silver', description: 'light, delicate' },
  { color: '#d1d5db', name: 'Mist', description: 'whisper, faint' },
  { color: '#4b5563', name: 'Charcoal', description: 'deep, grounding' },
];

const BRUSH_SIZES = [
  { size: 2, label: 'Fine' },
  { size: 5, label: 'Thin' },
  { size: 10, label: 'Medium' },
  { size: 18, label: 'Broad' },
];

// Starter shapes that appear on canvas
const STARTER_SHAPES = [
  { id: 'circle', name: 'Circle', description: 'Fill with flowing patterns' },
  { id: 'triangle', name: 'Triangle', description: 'Sharp edges, organic fills' },
  { id: 'square', name: 'Square', description: 'Structure meets freedom' },
  { id: 'organic', name: 'Organic', description: 'Let nature guide you' },
];

// Pattern prompts to guide the meditative drawing
const PATTERN_PROMPTS = [
  "Draw small loops, repeating until the space fills",
  "Create parallel lines, like gentle waves",
  "Add tiny circles, clustered together",
  "Draw crosshatching — lines in both directions",
  "Make spirals, starting small, growing outward",
  "Add dots along the edges you've drawn",
  "Create feather-like strokes, soft and repeated",
  "Draw scales, overlapping like fish or leaves",
  "Make zigzag patterns, rhythmic and steady",
  "Add curved lines radiating from a point",
];

type Phase = 'intro' | 'drawing' | 'reflection';

export default function ZentanglePatterns({ onBack, onComplete }: ZentanglePatternsProps) {
  const { isDark, colors } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedColor, setSelectedColor] = useState(ZENTANGLE_COLORS[0].color);
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedShape, setSelectedShape] = useState(STARTER_SHAPES[0]);
  const [currentPrompt, setCurrentPrompt] = useState(PATTERN_PROMPTS[0]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [hasDrawn, setHasDrawn] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  
  const lastPos = useRef<{ x: number; y: number } | null>(null);

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

  // Draw starter shape on canvas
  const drawStarterShape = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) * 0.35;
    
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    switch (selectedShape.id) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - size);
        ctx.lineTo(centerX + size * 0.866, centerY + size * 0.5);
        ctx.lineTo(centerX - size * 0.866, centerY + size * 0.5);
        ctx.closePath();
        ctx.stroke();
        break;
      case 'square':
        ctx.strokeRect(centerX - size * 0.7, centerY - size * 0.7, size * 1.4, size * 1.4);
        break;
      case 'organic':
        ctx.beginPath();
        ctx.moveTo(centerX - size * 0.6, centerY - size * 0.3);
        ctx.bezierCurveTo(
          centerX - size * 0.2, centerY - size * 0.8,
          centerX + size * 0.5, centerY - size * 0.6,
          centerX + size * 0.7, centerY - size * 0.1
        );
        ctx.bezierCurveTo(
          centerX + size * 0.9, centerY + size * 0.5,
          centerX + size * 0.2, centerY + size * 0.8,
          centerX - size * 0.3, centerY + size * 0.6
        );
        ctx.bezierCurveTo(
          centerX - size * 0.8, centerY + size * 0.4,
          centerX - size * 0.9, centerY - size * 0.1,
          centerX - size * 0.6, centerY - size * 0.3
        );
        ctx.stroke();
        break;
    }
    
    ctx.setLineDash([]);
  }, [selectedShape, isDark]);

  // Initialize canvas
  useEffect(() => {
    if (phase === 'drawing' && canvasRef.current && canvasSize.width > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Cream/off-white background like traditional zentangle paper
        ctx.fillStyle = isDark ? '#1a1a24' : '#fefdfb';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawStarterShape(ctx, canvas.width, canvas.height);
      }
    }
  }, [phase, canvasSize, isDark, drawStarterShape]);

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

  // Draw on canvas
  const draw = useCallback((pos: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.globalAlpha = 1;

    if (lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = selectedColor;
      ctx.fill();
    }

    lastPos.current = pos;
    setHasDrawn(true);
  }, [selectedColor, brushSize]);

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

  // Cycle through prompts
  const getNextPrompt = () => {
    const nextIndex = (promptIndex + 1) % PATTERN_PROMPTS.length;
    setPromptIndex(nextIndex);
    setCurrentPrompt(PATTERN_PROMPTS[nextIndex]);
  };

  // Clear canvas and redraw starter shape
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.fillStyle = isDark ? '#1a1a24' : '#fefdfb';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawStarterShape(ctx, canvas.width, canvas.height);
      setHasDrawn(false);
    }
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
        
        @keyframes drawLine {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.02); opacity: 1; }
        }
        
        .color-btn {
          transition: all 0.2s ease;
        }
        
        .color-btn:active {
          transform: scale(0.92);
        }
        
        .shape-btn {
          transition: all 0.2s ease;
        }
        
        .shape-btn:active {
          transform: scale(0.96);
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
            Zentangle Patterns
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
            {/* Zentangle pattern icon */}
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: 12,
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                marginBottom: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'breathe 4s ease-in-out infinite',
              }}
            >
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="20" stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'} strokeWidth="1" strokeDasharray="3 3"/>
                <path d="M30 10 Q40 20 30 30 Q20 40 30 50" stroke={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'} strokeWidth="1.5" fill="none"/>
                <path d="M15 30 Q25 25 30 30 Q35 35 45 30" stroke={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'} strokeWidth="1.5" fill="none"/>
                <circle cx="30" cy="30" r="5" fill={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}/>
              </svg>
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
              Zentangle Patterns
            </h1>
            
            <p
              style={{
                fontSize: 14,
                color: colors.textMuted,
                maxWidth: 320,
                lineHeight: 1.6,
                marginBottom: 32,
              }}
            >
              Meditative drawing through repetitive patterns. There's no erasing — embrace each stroke as part of the journey. Let your mind quiet as your hand creates.
            </p>

            {/* Shape selection */}
            <div style={{ marginBottom: 32, width: '100%', maxWidth: 320 }}>
              <p
                style={{
                  fontSize: 12,
                  color: colors.textMuted,
                  marginBottom: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Choose a starter shape
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 10,
                }}
              >
                {STARTER_SHAPES.map((shape) => (
                  <button
                    key={shape.id}
                    className="shape-btn"
                    onClick={() => setSelectedShape(shape)}
                    style={{
                      padding: '12px',
                      background: selectedShape.id === shape.id
                        ? (isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)')
                        : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)'),
                      border: `1px solid ${selectedShape.id === shape.id
                        ? 'rgba(139,92,246,0.4)'
                        : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')}`,
                      borderRadius: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontSize: 13,
                        fontWeight: 500,
                        color: colors.text,
                        marginBottom: 2,
                      }}
                    >
                      {shape.name}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: colors.textMuted,
                      }}
                    >
                      {shape.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setPhase('drawing')}
              style={{
                padding: '14px 36px',
                background: 'linear-gradient(135deg, rgba(139,92,246,0.9) 0%, rgba(109,40,217,0.85) 100%)',
                border: 'none',
                borderRadius: 25,
                color: 'white',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(139,92,246,0.3)',
              }}
            >
              Begin Drawing
            </button>
          </div>
        )}

        {/* DRAWING PHASE */}
        {phase === 'drawing' && (
          <div
            ref={containerRef}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px 16px',
              paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 16px)',
              overflow: 'hidden',
            }}
          >
            {/* Pattern Prompt */}
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
                  marginBottom: 8,
                  maxWidth: 300,
                }}
              >
                "{currentPrompt}"
              </p>
              <button
                onClick={getNextPrompt}
                style={{
                  padding: '5px 12px',
                  background: 'transparent',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: 16,
                  color: colors.textMuted,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                Next pattern idea
              </button>
            </div>

            {/* Canvas */}
            <div
              style={{
                position: 'relative',
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: isDark
                  ? '0 4px 30px rgba(0,0,0,0.4)'
                  : '0 4px 30px rgba(0,0,0,0.1)',
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

            {/* Tools */}
            <div
              style={{
                marginTop: 14,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                maxWidth: 380,
              }}
            >
              {/* Color Palette */}
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                {ZENTANGLE_COLORS.map((item) => (
                  <button
                    key={item.color}
                    className="color-btn"
                    onClick={() => setSelectedColor(item.color)}
                    title={`${item.name} — ${item.description}`}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: item.color,
                      border: selectedColor === item.color
                        ? `3px solid ${isDark ? '#8b5cf6' : '#7c3aed'}`
                        : `2px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
                      boxShadow: selectedColor === item.color
                        ? '0 0 12px rgba(139,92,246,0.4)'
                        : 'none',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  />
                ))}
              </div>

              {/* Selected color name */}
              <p
                style={{
                  fontSize: 11,
                  color: colors.textMuted,
                  textAlign: 'center',
                }}
              >
                {ZENTANGLE_COLORS.find(c => c.color === selectedColor)?.name}
              </p>

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
                        width: Math.max(item.size / 2, 3),
                        height: Math.max(item.size / 2, 3),
                        borderRadius: '50%',
                        background: colors.text,
                        opacity: brushSize === item.size ? 1 : 0.5,
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  marginTop: 6,
                }}
              >
                <button
                  onClick={clearCanvas}
                  style={{
                    padding: '10px 18px',
                    background: 'transparent',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: 20,
                    color: colors.textMuted,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Start Over
                </button>
                
                <button
                  onClick={() => setPhase('reflection')}
                  disabled={!hasDrawn}
                  style={{
                    padding: '10px 22px',
                    background: hasDrawn
                      ? 'linear-gradient(135deg, rgba(139,92,246,0.9) 0%, rgba(109,40,217,0.85) 100%)'
                      : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
                    border: 'none',
                    borderRadius: 20,
                    color: hasDrawn ? 'white' : colors.textMuted,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: hasDrawn ? 'pointer' : 'default',
                    boxShadow: hasDrawn ? '0 2px 12px rgba(139,92,246,0.3)' : 'none',
                  }}
                >
                  Complete
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
              Your Zentangle
            </h2>

            {/* Canvas Preview */}
            <div
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: isDark
                  ? '0 4px 30px rgba(0,0,0,0.4)'
                  : '0 4px 30px rgba(0,0,0,0.1)',
                marginBottom: 24,
                maxWidth: 280,
              }}
            >
              <img
                src={getCanvasImage()}
                alt="Your zentangle pattern"
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                }}
              />
            </div>

            {/* Reflection */}
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
                "In repetition, the mind finds stillness."
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: colors.textMuted,
                  lineHeight: 1.6,
                }}
              >
                Each line you drew was a moment of presence. The patterns you created emerged from letting go of perfection and embracing the meditative flow.
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
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.9) 0%, rgba(109,40,217,0.85) 100%)',
                  border: 'none',
                  borderRadius: 25,
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(139,92,246,0.3)',
                }}
              >
                Complete
              </button>
              
              <button
                onClick={() => setPhase('drawing')}
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
                Continue Drawing
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}