'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface WorryStoneDesignProps {
  onBack: () => void;
  onComplete?: (data: { stoneDesign: string; intention: string }) => void;
}

// Stone shapes
const STONE_SHAPES = [
  { id: 'oval', name: 'Classic Oval', description: 'Smooth and balanced' },
  { id: 'round', name: 'River Round', description: 'Centered and whole' },
  { id: 'teardrop', name: 'Teardrop', description: 'Gentle release' },
  { id: 'heart', name: 'Heart Stone', description: 'Self-compassion' },
];

// Stone textures/colors
const STONE_MATERIALS = [
  { id: 'jade', color: '#86efac', highlight: '#4ade80', name: 'Jade', meaning: 'Harmony & balance' },
  { id: 'amethyst', color: '#c4b5fd', highlight: '#a78bfa', name: 'Amethyst', meaning: 'Calm & clarity' },
  { id: 'rose-quartz', color: '#fda4af', highlight: '#fb7185', name: 'Rose Quartz', meaning: 'Love & healing' },
  { id: 'obsidian', color: '#475569', highlight: '#64748b', name: 'Obsidian', meaning: 'Protection & grounding' },
  { id: 'moonstone', color: '#e2e8f0', highlight: '#f8fafc', name: 'Moonstone', meaning: 'Intuition & new beginnings' },
  { id: 'tigers-eye', color: '#d97706', highlight: '#f59e0b', name: "Tiger's Eye", meaning: 'Courage & confidence' },
  { id: 'lapis', color: '#3b82f6', highlight: '#60a5fa', name: 'Lapis Lazuli', meaning: 'Wisdom & truth' },
  { id: 'malachite', color: '#10b981', highlight: '#34d399', name: 'Malachite', meaning: 'Transformation' },
];

// Thumb indent patterns
const INDENT_PATTERNS = [
  { id: 'smooth', name: 'Smooth', description: 'Simple, calming' },
  { id: 'spiral', name: 'Spiral', description: 'Centering focus' },
  { id: 'ripples', name: 'Ripples', description: 'Expanding peace' },
  { id: 'crescent', name: 'Crescent', description: 'Lunar comfort' },
];

// Intentions
const INTENTIONS = [
  "Release what no longer serves me",
  "I am calm, I am safe",
  "This too shall pass",
  "I choose peace over worry",
  "I am enough, exactly as I am",
  "Breathe in calm, breathe out tension",
  "I trust in my own resilience",
  "May I be gentle with myself",
];

type Phase = 'intro' | 'designing' | 'intention' | 'reflection';

export default function WorryStoneDesign({ onBack, onComplete }: WorryStoneDesignProps) {
  const { isDark, colors } = useTheme();
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedShape, setSelectedShape] = useState(STONE_SHAPES[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(STONE_MATERIALS[0]);
  const [selectedIndent, setSelectedIndent] = useState(INDENT_PATTERNS[0]);
  const [selectedIntention, setSelectedIntention] = useState('');
  const [customIntention, setCustomIntention] = useState('');
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  // Hold progress animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHolding && holdProgress < 100) {
      interval = setInterval(() => {
        setHoldProgress(prev => Math.min(prev + 2, 100));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isHolding, holdProgress]);

  // Render stone shape
  const renderStone = (size: number = 180, interactive: boolean = false) => {
    const material = selectedMaterial;
    
    const baseStyle: React.CSSProperties = {
      width: size,
      height: selectedShape.id === 'teardrop' ? size * 1.2 : size,
      background: `radial-gradient(ellipse at 30% 30%, ${material.highlight} 0%, ${material.color} 50%, ${material.color}dd 100%)`,
      boxShadow: isDark 
        ? `0 8px 32px rgba(0,0,0,0.5), inset 0 2px 20px rgba(255,255,255,0.1)`
        : `0 8px 32px rgba(0,0,0,0.2), inset 0 2px 20px rgba(255,255,255,0.3)`,
      position: 'relative',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: interactive ? 'pointer' : 'default',
      transform: isHolding && interactive ? 'scale(0.98)' : 'scale(1)',
    };

    // Shape-specific styles
    const shapeStyles: Record<string, React.CSSProperties> = {
      oval: { borderRadius: '50%' },
      round: { borderRadius: '50%', height: size },
      teardrop: { borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' },
      heart: { borderRadius: '50%', clipPath: 'path("M90 30 C90 10, 70 0, 50 0 C30 0, 10 10, 10 30 C10 60, 50 90, 90 60 C90 60, 90 45, 90 30")', transform: isHolding && interactive ? 'scale(0.98)' : 'scale(1)' },
    };

    // Indent pattern rendering
    const renderIndent = () => {
      const indentSize = size * 0.35;
      const indentStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: indentSize,
        height: indentSize,
        borderRadius: '50%',
        background: `radial-gradient(ellipse at 60% 60%, ${material.color}88 0%, ${material.color}44 100%)`,
        boxShadow: `inset 2px 2px 8px rgba(0,0,0,0.2), inset -1px -1px 4px rgba(255,255,255,0.1)`,
      };

      const patternOverlay = () => {
        switch (selectedIndent.id) {
          case 'spiral':
            return (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                <svg width={indentSize * 0.7} height={indentSize * 0.7} viewBox="0 0 40 40">
                  <path d="M20 20 Q20 10 25 10 Q35 10 35 20 Q35 30 25 30 Q15 30 15 20 Q15 12 22 12" fill="none" stroke={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)'} strokeWidth="1.5"/>
                </svg>
              </div>
            );
          case 'ripples':
            return (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {[0.3, 0.55, 0.8].map((scale, i) => (
                  <div key={i} style={{ position: 'absolute', width: `${scale * 100}%`, height: `${scale * 100}%`, borderRadius: '50%', border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}` }} />
                ))}
              </div>
            );
          case 'crescent':
            return (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                <div style={{ width: '60%', height: '60%', borderRadius: '50%', boxShadow: `inset 8px -2px 0 ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)'}` }} />
              </div>
            );
          default:
            return null;
        }
      };

      return (
        <div style={indentStyle}>
          {patternOverlay()}
        </div>
      );
    };

    return (
      <div 
        style={{ ...baseStyle, ...shapeStyles[selectedShape.id] }}
        onMouseDown={() => interactive && setIsHolding(true)}
        onMouseUp={() => interactive && setIsHolding(false)}
        onMouseLeave={() => interactive && setIsHolding(false)}
        onTouchStart={() => interactive && setIsHolding(true)}
        onTouchEnd={() => interactive && setIsHolding(false)}
      >
        {renderIndent()}
      </div>
    );
  };

  const bg = isDark
    ? 'linear-gradient(180deg, #0c0c14 0%, #12121c 50%, #0a0a10 100%)'
    : 'linear-gradient(180deg, #faf8f5 0%, #f5f0ea 50%, #efe8e0 100%)';

  const accent = 'rgba(45,212,191,0.9)';

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(45,212,191,0.3); } 50% { box-shadow: 0 0 40px rgba(45,212,191,0.5); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .option-btn { transition: all 0.2s ease; }
        .option-btn:active { transform: scale(0.97); }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ padding: 'max(env(safe-area-inset-top, 12px), 12px) 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`, zIndex: 20 }}>
          <button onClick={onBack} style={{ padding: '8px 16px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`, borderRadius: 20, color: colors.text, fontSize: 13, fontWeight: 450, cursor: 'pointer' }}>← Back</button>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.textMuted }}>Worry Stone</span>
          <div style={{ width: 70 }} />
        </header>

        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ marginBottom: 32, animation: 'float 4s ease-in-out infinite' }}>
              {renderStone(120)}
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', fontWeight: 300, color: colors.text, marginBottom: 12, letterSpacing: '-0.02em' }}>Worry Stone Design</h1>
            <p style={{ fontSize: 14, color: colors.textMuted, maxWidth: 320, lineHeight: 1.6, marginBottom: 40 }}>Design a personal comfort object. A worry stone is held and rubbed to release anxiety — the smooth surface and repetitive motion calms the mind.</p>
            <button onClick={() => setPhase('designing')} style={{ padding: '14px 36px', background: `linear-gradient(135deg, ${accent} 0%, rgba(45,212,191,0.85) 100%)`, border: 'none', borderRadius: 25, color: '#0a2520', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(45,212,191,0.3)' }}>Begin Design</button>
          </div>
        )}

        {/* DESIGNING PHASE */}
        {phase === 'designing' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 16px)', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {/* Stone Preview */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, animation: 'fadeIn 0.4s ease' }}>
              {renderStone(140)}
            </div>

            {/* Shape Selection */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Shape</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {STONE_SHAPES.map((shape) => (
                  <button key={shape.id} onClick={() => setSelectedShape(shape)} className="option-btn" style={{ padding: '10px 14px', background: selectedShape.id === shape.id ? (isDark ? 'rgba(45,212,191,0.15)' : 'rgba(45,212,191,0.1)') : 'transparent', border: `1px solid ${selectedShape.id === shape.id ? 'rgba(45,212,191,0.4)' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`, borderRadius: 10, color: selectedShape.id === shape.id ? colors.text : colors.textMuted, fontSize: 13, cursor: 'pointer' }}>{shape.name}</button>
                ))}
              </div>
            </div>

            {/* Material Selection */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Material</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {STONE_MATERIALS.map((material) => (
                  <button key={material.id} onClick={() => setSelectedMaterial(material)} className="option-btn" style={{ width: 44, height: 44, borderRadius: '50%', background: `radial-gradient(ellipse at 30% 30%, ${material.highlight} 0%, ${material.color} 100%)`, border: selectedMaterial.id === material.id ? '3px solid white' : '2px solid transparent', boxShadow: selectedMaterial.id === material.id ? `0 0 16px ${material.color}` : '0 2px 8px rgba(0,0,0,0.2)', cursor: 'pointer' }} title={material.name} />
                ))}
              </div>
              <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 8 }}>{selectedMaterial.name} — {selectedMaterial.meaning}</p>
            </div>

            {/* Indent Pattern Selection */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Thumb Indent</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {INDENT_PATTERNS.map((pattern) => (
                  <button key={pattern.id} onClick={() => setSelectedIndent(pattern)} className="option-btn" style={{ padding: '10px 14px', background: selectedIndent.id === pattern.id ? (isDark ? 'rgba(45,212,191,0.15)' : 'rgba(45,212,191,0.1)') : 'transparent', border: `1px solid ${selectedIndent.id === pattern.id ? 'rgba(45,212,191,0.4)' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`, borderRadius: 10, color: selectedIndent.id === pattern.id ? colors.text : colors.textMuted, fontSize: 13, cursor: 'pointer' }}>{pattern.name}</button>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <button onClick={() => setPhase('intention')} style={{ padding: '14px 28px', background: `linear-gradient(135deg, ${accent} 0%, rgba(45,212,191,0.85) 100%)`, border: 'none', borderRadius: 25, color: '#0a2520', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(45,212,191,0.3)', alignSelf: 'center' }}>Set Your Intention</button>
          </div>
        )}

        {/* INTENTION PHASE */}
        {phase === 'intention' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px', paddingBottom: 'max(env(safe-area-inset-bottom, 24px), 24px)', overflow: 'auto', WebkitOverflowScrolling: 'touch', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.3rem, 5vw, 1.6rem)', fontWeight: 300, color: colors.text, marginBottom: 8 }}>Set Your Intention</h2>
              <p style={{ fontSize: 13, color: colors.textMuted }}>What would you like this stone to remind you of?</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {INTENTIONS.map((intention, index) => (
                <button key={index} onClick={() => { setSelectedIntention(intention); setCustomIntention(''); }} className="option-btn" style={{ padding: '14px 16px', background: selectedIntention === intention ? (isDark ? 'rgba(45,212,191,0.12)' : 'rgba(45,212,191,0.08)') : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)'), border: `1px solid ${selectedIntention === intention ? 'rgba(45,212,191,0.35)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')}`, borderRadius: 12, textAlign: 'left', cursor: 'pointer' }}>
                  <span style={{ fontSize: 14, color: selectedIntention === intention ? colors.text : colors.textMuted, fontStyle: 'italic' }}>"{intention}"</span>
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>Or write your own:</p>
              <textarea value={customIntention} onChange={(e) => { setCustomIntention(e.target.value); setSelectedIntention(''); }} placeholder="My personal intention..." style={{ width: '100%', padding: '14px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 12, color: colors.text, fontSize: 14, resize: 'none', height: 80, outline: 'none', fontFamily: 'inherit' }} />
            </div>

            <button onClick={() => setPhase('reflection')} disabled={!selectedIntention && !customIntention} style={{ padding: '14px 28px', background: (selectedIntention || customIntention) ? `linear-gradient(135deg, ${accent} 0%, rgba(45,212,191,0.85) 100%)` : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'), border: 'none', borderRadius: 25, color: (selectedIntention || customIntention) ? '#0a2520' : colors.textMuted, fontSize: 14, fontWeight: 600, cursor: (selectedIntention || customIntention) ? 'pointer' : 'default', boxShadow: (selectedIntention || customIntention) ? '0 4px 20px rgba(45,212,191,0.3)' : 'none', alignSelf: 'center' }}>Complete Stone</button>
          </div>
        )}

        {/* REFLECTION PHASE */}
        {phase === 'reflection' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', paddingBottom: 'max(env(safe-area-inset-bottom, 24px), 24px)', overflow: 'auto', WebkitOverflowScrolling: 'touch', animation: 'fadeIn 0.5s ease' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', fontWeight: 300, color: colors.text, marginBottom: 8, textAlign: 'center' }}>Your Worry Stone</h2>
            <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 24 }}>Hold and press to feel its comfort</p>

            <div style={{ marginBottom: 24, animation: isHolding ? 'none' : 'float 4s ease-in-out infinite' }}>
              {renderStone(180, true)}
            </div>

            {/* Hold progress */}
            {isHolding && (
              <div style={{ width: 200, marginBottom: 16 }}>
                <div style={{ height: 4, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${holdProgress}%`, background: accent, borderRadius: 2, transition: 'width 0.1s ease' }} />
                </div>
              </div>
            )}

            <div style={{ textAlign: 'center', maxWidth: 340, marginBottom: 32 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontStyle: 'italic', color: colors.text, marginBottom: 16, lineHeight: 1.5 }}>"{customIntention || selectedIntention}"</p>
              <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.6 }}>When worry arises, imagine holding your {selectedMaterial.name} stone. Feel its smooth surface, rub the indent with your thumb, and remember your intention.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280 }}>
              <button onClick={() => { if (onComplete) onComplete({ stoneDesign: `${selectedShape.id}-${selectedMaterial.id}-${selectedIndent.id}`, intention: customIntention || selectedIntention }); onBack(); }} style={{ padding: '14px 24px', background: `linear-gradient(135deg, ${accent} 0%, rgba(45,212,191,0.85) 100%)`, border: 'none', borderRadius: 25, color: '#0a2520', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(45,212,191,0.3)' }}>Complete</button>
              <button onClick={() => setPhase('designing')} style={{ padding: '12px 24px', background: 'transparent', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 25, color: colors.textMuted, fontSize: 14, cursor: 'pointer' }}>Redesign Stone</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}