'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface SketchYourDayProps {
  onBack: () => void;
  onComplete?: (imageData: string[]) => void;
}

const SKETCH_COLORS = [
  { color: '#1e293b', name: 'Ink' },
  { color: '#64748b', name: 'Graphite' },
  { color: '#60a5fa', name: 'Sky' },
  { color: '#34d399', name: 'Leaf' },
  { color: '#fbbf24', name: 'Sun' },
  { color: '#f87171', name: 'Ember' },
  { color: '#a78bfa', name: 'Dusk' },
  { color: '#f472b6', name: 'Bloom' },
];

const BRUSH_SIZES = [
  { size: 3, label: 'Fine' },
  { size: 8, label: 'Medium' },
  { size: 16, label: 'Bold' },
];

const PANEL_PROMPTS = [
  { id: 1, prompt: "This morning felt like...", time: "Morning" },
  { id: 2, prompt: "A moment that stood out...", time: "Midday" },
  { id: 3, prompt: "Right now I feel...", time: "Now" },
];

type Phase = 'intro' | 'sketching' | 'reflection';

interface PanelData {
  id: number;
  hasContent: boolean;
  imageData: string;
}

export default function SketchYourDay({ onBack, onComplete }: SketchYourDayProps) {
  const { isDark, colors } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedColor, setSelectedColor] = useState(SKETCH_COLORS[0].color);
  const [brushSize, setBrushSize] = useState(8);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activePanel, setActivePanel] = useState(0);
  const [panels, setPanels] = useState<PanelData[]>(
    PANEL_PROMPTS.map(p => ({ id: p.id, hasContent: false, imageData: '' }))
  );
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const maxWidth = Math.min(rect.width - 32, 400);
        const height = Math.min(maxWidth * 0.75, rect.height - 280);
        setCanvasSize({ width: maxWidth, height: height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [phase]);

  const initializeCanvas = useCallback(() => {
    if (canvasRef.current && canvasSize.width > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const currentPanel = panels[activePanel];
        if (currentPanel.imageData) {
          const img = new Image();
          img.onload = () => { ctx.drawImage(img, 0, 0); };
          img.src = currentPanel.imageData;
        } else {
          ctx.fillStyle = isDark ? '#141420' : '#fefdfb';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  }, [canvasSize, isDark, activePanel, panels]);

  useEffect(() => {
    if (phase === 'sketching') initializeCanvas();
  }, [phase, activePanel, initializeCanvas]);

  const saveCurrentPanel = useCallback(() => {
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL('image/png');
      setPanels(prev => prev.map((p, i) => 
        i === activePanel ? { ...p, imageData, hasContent: p.hasContent } : p
      ));
      return imageData;
    }
    return '';
  }, [activePanel]);

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

  const draw = useCallback((pos: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.globalAlpha = 0.95;
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
    setPanels(prev => prev.map((p, i) => i === activePanel ? { ...p, hasContent: true } : p));
  }, [selectedColor, brushSize, activePanel]);

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
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  const goToPanel = (index: number) => {
    if (index === activePanel) return;
    saveCurrentPanel();
    setActivePanel(index);
  };

  const nextPanel = () => {
    if (activePanel < PANEL_PROMPTS.length - 1) {
      saveCurrentPanel();
      setActivePanel(activePanel + 1);
    }
  };

  const prevPanel = () => {
    if (activePanel > 0) {
      saveCurrentPanel();
      setActivePanel(activePanel - 1);
    }
  };

  const clearPanel = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.fillStyle = isDark ? '#141420' : '#fefdfb';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setPanels(prev => prev.map((p, i) => i === activePanel ? { ...p, hasContent: false, imageData: '' } : p));
    }
  };

  const finishSketching = () => {
    saveCurrentPanel();
    setPhase('reflection');
  };

  const hasAnyContent = panels.some(p => p.hasContent);

  const bg = isDark
    ? 'linear-gradient(180deg, #0c0c14 0%, #12121c 50%, #0a0a10 100%)'
    : 'linear-gradient(180deg, #faf8f5 0%, #f5f0ea 50%, #efe8e0 100%)';

  const accent = 'rgba(96,165,250,0.9)';

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .color-btn { transition: all 0.2s ease; }
        .color-btn:active { transform: scale(0.92); }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ padding: 'max(env(safe-area-inset-top, 12px), 12px) 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`, zIndex: 20 }}>
          <button onClick={onBack} style={{ padding: '8px 16px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`, borderRadius: 20, color: colors.text, fontSize: 13, fontWeight: 450, cursor: 'pointer' }}>← Back</button>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.textMuted }}>Sketch Your Day</span>
          <div style={{ width: 70 }} />
        </header>

        {phase === 'intro' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 50, height: 38, borderRadius: 6, background: isDark ? `rgba(96,165,250,${0.15 + i * 0.1})` : `rgba(96,165,250,${0.1 + i * 0.08})`, border: `1px solid ${isDark ? 'rgba(96,165,250,0.3)' : 'rgba(96,165,250,0.25)'}`, animation: `fadeIn 0.5s ease ${i * 0.15}s both` }} />
              ))}
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', fontWeight: 300, color: colors.text, marginBottom: 12, letterSpacing: '-0.02em' }}>Sketch Your Day</h1>
            <p style={{ fontSize: 14, color: colors.textMuted, maxWidth: 320, lineHeight: 1.6, marginBottom: 40 }}>Three simple panels to capture your day. Quick sketches — no perfection needed. Let your pen tell the story your words might miss.</p>
            <button onClick={() => setPhase('sketching')} style={{ padding: '14px 36px', background: `linear-gradient(135deg, ${accent} 0%, rgba(96,165,250,0.85) 100%)`, border: 'none', borderRadius: 25, color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer', boxShadow: '0 4px 20px rgba(96,165,250,0.3)' }}>Begin</button>
          </div>
        )}

        {phase === 'sketching' && (
          <div ref={containerRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 16px', paddingBottom: 'max(env(safe-area-inset-bottom, 12px), 12px)', overflow: 'hidden' }}>
            <div style={{ textAlign: 'center', marginBottom: 12, animation: 'slideIn 0.3s ease', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
                {PANEL_PROMPTS.map((panel, index) => (
                  <button key={panel.id} onClick={() => goToPanel(index)} style={{ width: index === activePanel ? 24 : 10, height: 10, borderRadius: 5, background: index === activePanel ? accent : panels[index].hasContent ? (isDark ? 'rgba(96,165,250,0.4)' : 'rgba(96,165,250,0.35)') : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'), border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.2s ease' }} />
                ))}
              </div>
              <p style={{ fontSize: 11, color: colors.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{PANEL_PROMPTS[activePanel].time}</p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1rem, 4vw, 1.15rem)', fontStyle: 'italic', color: colors.text }}>"{PANEL_PROMPTS[activePanel].prompt}"</p>
            </div>

            <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', boxShadow: isDark ? '0 4px 30px rgba(0,0,0,0.4)' : '0 4px 30px rgba(0,0,0,0.1)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
              <canvas ref={canvasRef} width={canvasSize.width || 300} height={canvasSize.height || 225} onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd} onMouseLeave={handleEnd} onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd} onTouchCancel={handleEnd} style={{ display: 'block', width: canvasSize.width || 300, height: canvasSize.height || 225, touchAction: 'none', cursor: 'crosshair' }} />
            </div>

            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%', maxWidth: 400 }}>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                {SKETCH_COLORS.map(item => (
                  <button key={item.color} className="color-btn" onClick={() => setSelectedColor(item.color)} title={item.name} style={{ width: 30, height: 30, borderRadius: '50%', background: item.color, border: selectedColor === item.color ? '3px solid white' : '2px solid transparent', boxShadow: selectedColor === item.color ? `0 0 10px ${item.color}` : 'none', cursor: 'pointer', outline: 'none' }} />
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {BRUSH_SIZES.map(item => (
                  <button key={item.size} onClick={() => setBrushSize(item.size)} style={{ width: 34, height: 34, borderRadius: '50%', background: brushSize === item.size ? (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)') : 'transparent', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <div style={{ width: item.size / 1.5, height: item.size / 1.5, borderRadius: '50%', background: colors.text, opacity: brushSize === item.size ? 1 : 0.5 }} />
                  </button>
                ))}
                <button onClick={clearPanel} style={{ marginLeft: 8, padding: '6px 14px', background: 'transparent', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 14, color: colors.textMuted, fontSize: 11, cursor: 'pointer' }}>Clear</button>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 4, width: '100%', justifyContent: 'center' }}>
                <button onClick={prevPanel} disabled={activePanel === 0} style={{ padding: '10px 18px', background: 'transparent', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 20, color: activePanel === 0 ? colors.textMuted : colors.text, fontSize: 13, cursor: activePanel === 0 ? 'default' : 'pointer', opacity: activePanel === 0 ? 0.5 : 1 }}>← Previous</button>
                {activePanel < PANEL_PROMPTS.length - 1 ? (
                  <button onClick={nextPanel} style={{ padding: '10px 24px', background: `linear-gradient(135deg, ${accent} 0%, rgba(96,165,250,0.85) 100%)`, border: 'none', borderRadius: 20, color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', boxShadow: '0 2px 12px rgba(96,165,250,0.3)' }}>Next →</button>
                ) : (
                  <button onClick={finishSketching} disabled={!hasAnyContent} style={{ padding: '10px 24px', background: hasAnyContent ? `linear-gradient(135deg, ${accent} 0%, rgba(96,165,250,0.85) 100%)` : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'), border: 'none', borderRadius: 20, color: hasAnyContent ? 'white' : colors.textMuted, fontSize: 13, fontWeight: 500, cursor: hasAnyContent ? 'pointer' : 'default', boxShadow: hasAnyContent ? '0 2px 12px rgba(96,165,250,0.3)' : 'none' }}>Done</button>
                )}
              </div>
            </div>
          </div>
        )}

        {phase === 'reflection' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', paddingBottom: 'max(env(safe-area-inset-bottom, 24px), 24px)', overflow: 'auto', WebkitOverflowScrolling: 'touch', animation: 'fadeIn 0.5s ease' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', fontWeight: 300, color: colors.text, marginBottom: 20, textAlign: 'center' }}>Your Day in Sketches</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24, width: '100%', maxWidth: 320 }}>
              {panels.map((panel, index) => (
                <div key={panel.id} style={{ animation: `fadeIn 0.4s ease ${index * 0.1}s both` }}>
                  <p style={{ fontSize: 11, color: colors.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{PANEL_PROMPTS[index].time}</p>
                  <div style={{ borderRadius: 8, overflow: 'hidden', boxShadow: isDark ? '0 2px 15px rgba(0,0,0,0.3)' : '0 2px 15px rgba(0,0,0,0.08)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}` }}>
                    {panel.imageData ? (
                      <img src={panel.imageData} alt={`${PANEL_PROMPTS[index].time} sketch`} style={{ display: 'block', width: '100%', height: 'auto' }} />
                    ) : (
                      <div style={{ height: 80, background: isDark ? '#141420' : '#fefdfb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 12, color: colors.textMuted, fontStyle: 'italic' }}>Empty panel</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', maxWidth: 360, marginBottom: 32 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontStyle: 'italic', color: colors.text, marginBottom: 16, lineHeight: 1.5 }}>"What story do these sketches tell?"</p>
              <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.6 }}>Your day captured in simple strokes. Sometimes the smallest drawings hold the biggest truths about how we're really feeling.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280 }}>
              <button onClick={() => { const images = panels.map(p => p.imageData).filter(Boolean); if (onComplete) onComplete(images); onBack(); }} style={{ padding: '14px 24px', background: `linear-gradient(135deg, ${accent} 0%, rgba(96,165,250,0.85) 100%)`, border: 'none', borderRadius: 25, color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer', boxShadow: '0 4px 20px rgba(96,165,250,0.3)' }}>Complete</button>
              <button onClick={() => setPhase('sketching')} style={{ padding: '12px 24px', background: 'transparent', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 25, color: colors.textMuted, fontSize: 14, cursor: 'pointer' }}>Keep Sketching</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}