'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface GratitudeJarProps {
  onBack: () => void;
  onComplete?: (data: { jarDesign: string; gratitudes: string[] }) => void;
}

// Jar styles
const JAR_STYLES = [
  { id: 'mason', name: 'Mason Jar', description: 'Classic and timeless' },
  { id: 'apothecary', name: 'Apothecary', description: 'Elegant and refined' },
  { id: 'round', name: 'Round Vessel', description: 'Soft and welcoming' },
  { id: 'heart', name: 'Heart Vessel', description: 'Full of love' },
];

// Jar colors (glass tints)
const JAR_COLORS = [
  { id: 'clear', color: 'rgba(255,255,255,0.15)', name: 'Clear', glow: 'rgba(255,255,255,0.3)' },
  { id: 'blue', color: 'rgba(96,165,250,0.25)', name: 'Ocean Blue', glow: 'rgba(96,165,250,0.4)' },
  { id: 'green', color: 'rgba(74,222,128,0.25)', name: 'Sea Glass', glow: 'rgba(74,222,128,0.4)' },
  { id: 'amber', color: 'rgba(251,191,36,0.25)', name: 'Amber', glow: 'rgba(251,191,36,0.4)' },
  { id: 'rose', color: 'rgba(251,113,133,0.25)', name: 'Rose', glow: 'rgba(251,113,133,0.4)' },
  { id: 'purple', color: 'rgba(167,139,250,0.25)', name: 'Amethyst', glow: 'rgba(167,139,250,0.4)' },
];

// Paper/note colors for gratitude slips
const NOTE_COLORS = [
  { color: '#fef3c7', name: 'Warm Yellow' },
  { color: '#fce7f3', name: 'Soft Pink' },
  { color: '#dbeafe', name: 'Sky Blue' },
  { color: '#d1fae5', name: 'Mint' },
  { color: '#f3e8ff', name: 'Lavender' },
  { color: '#fff7ed', name: 'Cream' },
];

// Gratitude prompts
const GRATITUDE_PROMPTS = [
  "Something that made you smile today...",
  "A person you're grateful for...",
  "A small pleasure you often overlook...",
  "Something your body allows you to do...",
  "A challenge that helped you grow...",
  "Something beautiful you noticed...",
  "A comfort you have access to...",
  "Someone who believed in you...",
];

type Phase = 'intro' | 'designing' | 'filling' | 'reflection';

interface GratitudeNote {
  id: number;
  text: string;
  color: string;
  rotation: number;
}

export default function GratitudeJar({ onBack, onComplete }: GratitudeJarProps) {
  const { isDark, colors } = useTheme();
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedJarStyle, setSelectedJarStyle] = useState(JAR_STYLES[0]);
  const [selectedJarColor, setSelectedJarColor] = useState(JAR_COLORS[0]);
  const [selectedNoteColor, setSelectedNoteColor] = useState(NOTE_COLORS[0].color);
  const [gratitudes, setGratitudes] = useState<GratitudeNote[]>([]);
  const [currentGratitude, setCurrentGratitude] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(GRATITUDE_PROMPTS[0]);
  const [showAddAnimation, setShowAddAnimation] = useState(false);

  const getNewPrompt = () => {
    const others = GRATITUDE_PROMPTS.filter(p => p !== currentPrompt);
    setCurrentPrompt(others[Math.floor(Math.random() * others.length)]);
  };

  const addGratitude = () => {
    if (!currentGratitude.trim()) return;
    
    const newNote: GratitudeNote = {
      id: Date.now(),
      text: currentGratitude.trim(),
      color: selectedNoteColor,
      rotation: Math.random() * 30 - 15,
    };
    
    setShowAddAnimation(true);
    setTimeout(() => {
      setGratitudes([...gratitudes, newNote]);
      setShowAddAnimation(false);
    }, 400);
    
    setCurrentGratitude('');
    getNewPrompt();
  };

  const removeGratitude = (id: number) => {
    setGratitudes(gratitudes.filter(g => g.id !== id));
  };

  // Render jar with notes inside
  const renderJar = (size: number = 200, showNotes: boolean = true) => {
    const jarColor = selectedJarColor;
    
    const jarShapes: Record<string, React.CSSProperties> = {
      mason: {
        width: size * 0.7,
        height: size,
        borderRadius: '8px 8px 20px 20px',
        position: 'relative' as const,
      },
      apothecary: {
        width: size * 0.6,
        height: size,
        borderRadius: '10px 10px 30% 30%',
        position: 'relative' as const,
      },
      round: {
        width: size * 0.75,
        height: size * 0.85,
        borderRadius: '20% 20% 50% 50%',
        position: 'relative' as const,
      },
      heart: {
        width: size * 0.7,
        height: size * 0.9,
        borderRadius: '50% 50% 50% 50%',
        clipPath: 'path("M70 15 C70 -5, 50 -5, 35 10 C20 -5, 0 -5, 0 15 C0 40, 35 70, 70 40 C70 40, 70 25, 70 15")',
        position: 'relative' as const,
      },
    };

    const lidStyles: Record<string, React.CSSProperties> = {
      mason: { width: '80%', height: 16, borderRadius: '4px 4px 0 0', top: -14 },
      apothecary: { width: '50%', height: 20, borderRadius: '4px 4px 8px 8px', top: -18 },
      round: { width: '40%', height: 14, borderRadius: '6px 6px 0 0', top: -12 },
      heart: { width: '30%', height: 12, borderRadius: '4px', top: -10 },
    };

    return (
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        {/* Lid */}
        <div style={{
          position: 'absolute',
          ...lidStyles[selectedJarStyle.id],
          left: '50%',
          transform: 'translateX(-50%)',
          background: isDark 
            ? 'linear-gradient(180deg, #64748b 0%, #475569 100%)'
            : 'linear-gradient(180deg, #94a3b8 0%, #64748b 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 10,
        }} />
        
        {/* Jar body */}
        <div style={{
          ...jarShapes[selectedJarStyle.id],
          background: `linear-gradient(135deg, ${jarColor.color} 0%, ${jarColor.glow} 50%, ${jarColor.color} 100%)`,
          border: `2px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)'}`,
          boxShadow: isDark 
            ? `0 8px 32px rgba(0,0,0,0.4), inset 0 0 30px ${jarColor.glow}`
            : `0 8px 32px rgba(0,0,0,0.15), inset 0 0 30px ${jarColor.glow}`,
          overflow: 'hidden',
        }}>
          {/* Notes inside jar */}
          {showNotes && (
            <div style={{ 
              position: 'absolute', 
              bottom: 10, 
              left: '50%', 
              transform: 'translateX(-50%)',
              width: '85%',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              justifyContent: 'center',
              padding: 8,
            }}>
              {gratitudes.slice(-8).map((note, index) => (
                <div
                  key={note.id}
                  style={{
                    width: 24 + Math.random() * 8,
                    height: 16 + Math.random() * 6,
                    background: note.color,
                    borderRadius: 2,
                    transform: `rotate(${note.rotation}deg)`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Glass shine effect */}
          <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            width: '30%',
            height: '60%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
            borderRadius: '50%',
            filter: 'blur(8px)',
          }} />
        </div>
      </div>
    );
  };

  const bg = isDark
    ? 'linear-gradient(180deg, #0c0c14 0%, #12121c 50%, #0a0a10 100%)'
    : 'linear-gradient(180deg, #faf8f5 0%, #f5f0ea 50%, #efe8e0 100%)';

  const accent = 'rgba(251,146,60,0.9)';

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dropIn { from { opacity: 0; transform: translateY(-30px) rotate(-10deg); } to { opacity: 1; transform: translateY(0) rotate(0deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .option-btn { transition: all 0.2s ease; }
        .option-btn:active { transform: scale(0.97); }
        .note-item { animation: fadeIn 0.3s ease; }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ padding: 'max(env(safe-area-inset-top, 12px), 12px) 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`, zIndex: 20 }}>
          <button onClick={onBack} style={{ padding: '8px 16px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`, borderRadius: 20, color: colors.text, fontSize: 13, fontWeight: 450, cursor: 'pointer' }}>← Back</button>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.textMuted }}>Gratitude Jar</span>
          <div style={{ width: 70 }} />
        </header>

        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ marginBottom: 32, animation: 'float 4s ease-in-out infinite' }}>
              {renderJar(160, false)}
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', fontWeight: 300, color: colors.text, marginBottom: 12, letterSpacing: '-0.02em' }}>Gratitude Jar</h1>
            <p style={{ fontSize: 14, color: colors.textMuted, maxWidth: 320, lineHeight: 1.6, marginBottom: 40 }}>Create a beautiful container for your blessings. Fill it with moments of gratitude — small notes that remind you of the good in your life.</p>
            <button onClick={() => setPhase('designing')} style={{ padding: '14px 36px', background: `linear-gradient(135deg, ${accent} 0%, rgba(251,146,60,0.85) 100%)`, border: 'none', borderRadius: 25, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(251,146,60,0.3)' }}>Design Your Jar</button>
          </div>
        )}

        {/* DESIGNING PHASE */}
        {phase === 'designing' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 16px)', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {/* Jar Preview */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, animation: 'fadeIn 0.4s ease' }}>
              {renderJar(180, false)}
            </div>

            {/* Jar Style Selection */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Jar Style</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {JAR_STYLES.map((style) => (
                  <button key={style.id} onClick={() => setSelectedJarStyle(style)} className="option-btn" style={{ padding: '10px 14px', background: selectedJarStyle.id === style.id ? (isDark ? 'rgba(251,146,60,0.15)' : 'rgba(251,146,60,0.1)') : 'transparent', border: `1px solid ${selectedJarStyle.id === style.id ? 'rgba(251,146,60,0.4)' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`, borderRadius: 10, color: selectedJarStyle.id === style.id ? colors.text : colors.textMuted, fontSize: 13, cursor: 'pointer' }}>{style.name}</button>
                ))}
              </div>
            </div>

            {/* Jar Color Selection */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Glass Tint</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {JAR_COLORS.map((color) => (
                  <button key={color.id} onClick={() => setSelectedJarColor(color)} className="option-btn" style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg, ${color.color} 0%, ${color.glow} 100%)`, border: selectedJarColor.id === color.id ? '3px solid white' : `2px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`, boxShadow: selectedJarColor.id === color.id ? `0 0 16px ${color.glow}` : '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }} title={color.name} />
                ))}
              </div>
              <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 8 }}>{selectedJarColor.name}</p>
            </div>

            {/* Continue Button */}
            <button onClick={() => setPhase('filling')} style={{ padding: '14px 28px', background: `linear-gradient(135deg, ${accent} 0%, rgba(251,146,60,0.85) 100%)`, border: 'none', borderRadius: 25, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(251,146,60,0.3)', alignSelf: 'center', marginTop: 'auto' }}>Start Filling</button>
          </div>
        )}

        {/* FILLING PHASE */}
        {phase === 'filling' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 16px)', overflow: 'hidden' }}>
            {/* Jar with notes */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, position: 'relative' }}>
              {renderJar(160, true)}
              {showAddAnimation && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  animation: 'dropIn 0.4s ease forwards',
                }}>
                  <div style={{ width: 30, height: 20, background: selectedNoteColor, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} />
                </div>
              )}
            </div>

            <p style={{ fontSize: 12, color: colors.textMuted, textAlign: 'center', marginBottom: 4 }}>{gratitudes.length} gratitude{gratitudes.length !== 1 ? 's' : ''} added</p>

            {/* Prompt */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(0.95rem, 3.5vw, 1.1rem)', fontStyle: 'italic', color: colors.text }}>{currentPrompt}</p>
              <button onClick={getNewPrompt} style={{ padding: '4px 12px', background: 'transparent', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 12, color: colors.textMuted, fontSize: 10, cursor: 'pointer', marginTop: 8 }}>Different prompt</button>
            </div>

            {/* Note color selection */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
              {NOTE_COLORS.map((color) => (
                <button key={color.color} onClick={() => setSelectedNoteColor(color.color)} style={{ width: 28, height: 28, borderRadius: 6, background: color.color, border: selectedNoteColor === color.color ? '2px solid rgba(0,0,0,0.3)' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s ease' }} />
              ))}
            </div>

            {/* Input */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <input type="text" value={currentGratitude} onChange={(e) => setCurrentGratitude(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addGratitude()} placeholder="I'm grateful for..." style={{ flex: 1, padding: '12px 16px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 12, color: colors.text, fontSize: 14, outline: 'none' }} />
              <button onClick={addGratitude} disabled={!currentGratitude.trim()} style={{ padding: '12px 20px', background: currentGratitude.trim() ? `linear-gradient(135deg, ${accent} 0%, rgba(251,146,60,0.85) 100%)` : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'), border: 'none', borderRadius: 12, color: currentGratitude.trim() ? 'white' : colors.textMuted, fontSize: 14, fontWeight: 500, cursor: currentGratitude.trim() ? 'pointer' : 'default' }}>Add</button>
            </div>

            {/* Gratitude list */}
            <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
              {gratitudes.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {gratitudes.map((note) => (
                    <div key={note.id} className="note-item" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: note.color, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      <span style={{ flex: 1, fontSize: 14, color: '#1e293b' }}>{note.text}</span>
                      <button onClick={() => removeGratitude(note.id)} style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.1)', border: 'none', color: '#64748b', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Continue button */}
            <button onClick={() => setPhase('reflection')} disabled={gratitudes.length === 0} style={{ padding: '14px 28px', background: gratitudes.length > 0 ? `linear-gradient(135deg, ${accent} 0%, rgba(251,146,60,0.85) 100%)` : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'), border: 'none', borderRadius: 25, color: gratitudes.length > 0 ? 'white' : colors.textMuted, fontSize: 14, fontWeight: 600, cursor: gratitudes.length > 0 ? 'pointer' : 'default', boxShadow: gratitudes.length > 0 ? '0 4px 20px rgba(251,146,60,0.3)' : 'none', alignSelf: 'center', marginTop: 16 }}>Seal Your Jar</button>
          </div>
        )}

        {/* REFLECTION PHASE */}
        {phase === 'reflection' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', paddingBottom: 'max(env(safe-area-inset-bottom, 24px), 24px)', overflow: 'auto', WebkitOverflowScrolling: 'touch', animation: 'fadeIn 0.5s ease' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', fontWeight: 300, color: colors.text, marginBottom: 8, textAlign: 'center' }}>Your Gratitude Jar</h2>
            <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 24 }}>{gratitudes.length} moment{gratitudes.length !== 1 ? 's' : ''} of gratitude</p>

            <div style={{ marginBottom: 24, animation: 'float 4s ease-in-out infinite' }}>
              {renderJar(200, true)}
            </div>

            <div style={{ textAlign: 'center', maxWidth: 340, marginBottom: 32 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontStyle: 'italic', color: colors.text, marginBottom: 16, lineHeight: 1.5 }}>"Gratitude turns what we have into enough"</p>
              <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.6 }}>Your jar is filled with reminders of goodness. Return to it whenever you need to remember the blessings in your life, or add more gratitudes as you discover them.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280 }}>
              <button onClick={() => { if (onComplete) onComplete({ jarDesign: `${selectedJarStyle.id}-${selectedJarColor.id}`, gratitudes: gratitudes.map(g => g.text) }); onBack(); }} style={{ padding: '14px 24px', background: `linear-gradient(135deg, ${accent} 0%, rgba(251,146,60,0.85) 100%)`, border: 'none', borderRadius: 25, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(251,146,60,0.3)' }}>Complete</button>
              <button onClick={() => setPhase('filling')} style={{ padding: '12px 24px', background: 'transparent', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 25, color: colors.textMuted, fontSize: 14, cursor: 'pointer' }}>Add More Gratitudes</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}