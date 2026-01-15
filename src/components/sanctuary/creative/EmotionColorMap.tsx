'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface EmotionColorMapProps {
  onBack: () => void;
  onComplete?: (imageData: string) => void;
}

// Emotion-based color palette
const EMOTION_COLORS = [
  { color: '#7dd3fc', name: 'Calm', emotion: 'peaceful, serene' },
  { color: '#60a5fa', name: 'Melancholy', emotion: 'sad, reflective' },
  { color: '#c4b5fd', name: 'Uncertain', emotion: 'confused, searching' },
  { color: '#f0abfc', name: 'Tender', emotion: 'loving, gentle' },
  { color: '#fda4af', name: 'Vulnerable', emotion: 'exposed, sensitive' },
  { color: '#fb923c', name: 'Anxious', emotion: 'worried, restless' },
  { color: '#fbbf24', name: 'Hopeful', emotion: 'optimistic, bright' },
  { color: '#a3e635', name: 'Growing', emotion: 'healing, renewing' },
  { color: '#4ade80', name: 'Balanced', emotion: 'grounded, stable' },
  { color: '#94a3b8', name: 'Numb', emotion: 'distant, detached' },
  { color: '#64748b', name: 'Heavy', emotion: 'burdened, weighed down' },
  { color: '#1e293b', name: 'Deep', emotion: 'intense, profound' },
];

const BRUSH_SIZES = [
  { size: 8, label: 'Fine' },
  { size: 20, label: 'Medium' },
  { size: 40, label: 'Broad' },
  { size: 70, label: 'Wide' },
];

const PROMPTS = [
  "What color feels like today?",
  "Where in your body do you feel tension? Paint that area.",
  "If this moment had a color, what would it be?",
  "Let your hand move freely — no rules.",
  "Paint what words can't express.",
  "What color is underneath the surface?",
];

type Phase = 'intro' | 'painting' | 'reflection';

export default function EmotionColorMap({ onBack, onComplete }: EmotionColorMapProps) {
  const { isDark, colors } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedColor, setSelectedColor] = useState(EMOTION_COLORS[0].color);
  const [brushSize, setBrushSize] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(PROMPTS[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [hasDrawn, setHasDrawn] = useState(false);
  
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Set canvas size based on container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const size = Math.min(rect.width - 32, rect.height - 200, 500);
        setCanvasSize({ width: size, height: size });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [phase]);

  // Initialize canvas
  useEffect(() => {
    if (phase === 'painting' && canvasRef.current && canvasSize.width > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = isDark ? '#1a1a24' : '#faf8f5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [phase, canvasSize, isDark]);

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
    ctx.globalAlpha = 0.85;

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

  // New prompt
  const getNewPrompt = () => {
    const others = PROMPTS.filter(p => p !== currentPrompt);
    setCurrentPrompt(others[Math.floor(Math.random() * others.length)]);
  };

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.fillStyle = isDark ? '#1a1a24' : '#faf8f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
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
            Emotion Color Map
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
            {/* Color circle */}
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, #7dd3fc, #c4b5fd, #f0abfc, #fda4af, #fb923c, #fbbf24, #a3e635, #4ade80, #7dd3fc)',
                marginBottom: 32,
                animation: 'breathe 4s ease-in-out infinite',
                boxShadow: isDark
                  ? '0 0 40px rgba(139,92,246,0.2)'
                  : '0 0 30px rgba(139,92,246,0.15)',
              }}
            />
            
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
              Paint Your Feelings
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
              Use colors to express what words can't. There's no right or wrong — just let your emotions flow onto the canvas.
            </p>
            
            <button
              onClick={() => setPhase('painting')}
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
              Begin
            </button>
          </div>
        )}

        {/* PAINTING PHASE */}
        {phase === 'painting' && (
          <div
            ref={containerRef}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px',
              paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 16px)',
              overflow: 'hidden',
            }}
          >
            {/* Prompt */}
            <div
              style={{
                textAlign: 'center',
                marginBottom: 16,
                animation: 'fadeIn 0.4s ease',
              }}
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                  fontStyle: 'italic',
                  color: colors.text,
                  marginBottom: 8,
                }}
              >
                "{currentPrompt}"
              </p>
              <button
                onClick={getNewPrompt}
                style={{
                  padding: '6px 14px',
                  background: 'transparent',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: 16,
                  color: colors.textMuted,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                Different prompt
              </button>
            </div>

            {/* Canvas */}
            <div
              style={{
                position: 'relative',
                borderRadius: 12,
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

            {/* Color Palette */}
            <div
              style={{
                marginTop: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                maxWidth: 400,
              }}
            >
              {/* Colors Row */}
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                {EMOTION_COLORS.map((item) => (
                  <button
                    key={item.color}
                    className="color-btn"
                    onClick={() => setSelectedColor(item.color)}
                    title={`${item.name} — ${item.emotion}`}
                    style={{
                      width: 32,
                      height: 32,
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

              {/* Selected color name */}
              <p
                style={{
                  fontSize: 12,
                  color: colors.textMuted,
                  textAlign: 'center',
                }}
              >
                {EMOTION_COLORS.find(c => c.color === selectedColor)?.name} — {EMOTION_COLORS.find(c => c.color === selectedColor)?.emotion}
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
                      width: 36,
                      height: 36,
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
                        width: item.size / 3,
                        height: item.size / 3,
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
                  marginTop: 8,
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
              Your Creation
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
                alt="Your emotion color map"
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
                "What do you notice about the colors you chose?"
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: colors.textMuted,
                  lineHeight: 1.6,
                }}
              >
                Sometimes our hands know what our minds haven't caught up to yet. Your creation is a window into how you're feeling right now.
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
                onClick={() => setPhase('painting')}
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
                Keep Painting
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}