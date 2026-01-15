'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface PaperFoldingProps {
  onBack: () => void;
  onComplete?: (data: { pattern: string; completedSteps: number }) => void;
}

// Origami patterns with step-by-step instructions
const ORIGAMI_PATTERNS = [
  {
    id: 'crane',
    name: 'Peace Crane',
    meaning: 'Hope, healing, and peace',
    duration: '15 min',
    steps: [
      { instruction: "Start with a square piece of paper, colored side down", visual: "square" },
      { instruction: "Fold in half diagonally to form a triangle", visual: "triangle" },
      { instruction: "Fold the triangle in half again", visual: "small-triangle" },
      { instruction: "Open one flap and squash fold into a square", visual: "squash" },
      { instruction: "Flip and repeat on the other side", visual: "diamond" },
      { instruction: "Fold edges to center line (kite fold)", visual: "kite" },
      { instruction: "Fold top triangle down and unfold", visual: "crease" },
      { instruction: "Petal fold - lift bottom point up", visual: "petal" },
      { instruction: "Flip and repeat petal fold", visual: "petal-done" },
      { instruction: "Fold wings down, shape head and tail", visual: "crane" },
    ],
  },
  {
    id: 'lotus',
    name: 'Lotus Flower',
    meaning: 'Purity, rebirth, and inner peace',
    duration: '12 min',
    steps: [
      { instruction: "Start with a square, fold all corners to center", visual: "blintz" },
      { instruction: "Fold all corners to center again", visual: "blintz2" },
      { instruction: "Fold corners to center a third time", visual: "blintz3" },
      { instruction: "Flip the paper over carefully", visual: "flip" },
      { instruction: "Fold all corners to center on this side", visual: "blintz4" },
      { instruction: "Hold center, pull out corner flaps from behind", visual: "pull1" },
      { instruction: "Gently pull out the next layer of petals", visual: "pull2" },
      { instruction: "Pull out the final layer - your lotus blooms", visual: "lotus" },
    ],
  },
  {
    id: 'heart',
    name: 'Beating Heart',
    meaning: 'Love, compassion, and self-care',
    duration: '10 min',
    steps: [
      { instruction: "Start with a square, fold in half vertically", visual: "half" },
      { instruction: "Unfold, then fold in half horizontally", visual: "cross" },
      { instruction: "Fold bottom edge to center crease", visual: "bottom" },
      { instruction: "Flip over, fold bottom corners to center", visual: "corners" },
      { instruction: "Flip again, fold sides to center line", visual: "sides" },
      { instruction: "Fold top corners down at an angle", visual: "top-corners" },
      { instruction: "Tuck top flaps, round the heart shape", visual: "heart" },
    ],
  },
];

const PAPER_COLORS = [
  { color: '#fecaca', name: 'Rose' },
  { color: '#fed7aa', name: 'Peach' },
  { color: '#fef08a', name: 'Sunshine' },
  { color: '#bbf7d0', name: 'Mint' },
  { color: '#a5f3fc', name: 'Sky' },
  { color: '#c7d2fe', name: 'Lavender' },
  { color: '#fbcfe8', name: 'Blossom' },
  { color: '#f5f5f4', name: 'Ivory' },
];

type Phase = 'intro' | 'folding' | 'reflection';

export default function PaperFolding({ onBack, onComplete }: PaperFoldingProps) {
  const { isDark, colors } = useTheme();
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedPattern, setSelectedPattern] = useState(ORIGAMI_PATTERNS[0]);
  const [selectedColor, setSelectedColor] = useState(PAPER_COLORS[4].color);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showPatternSelect, setShowPatternSelect] = useState(false);

  const currentStepData = selectedPattern.steps[currentStep];
  const totalSteps = selectedPattern.steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const markStepComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setPhase('reflection');
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetPattern = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const selectNewPattern = (pattern: typeof ORIGAMI_PATTERNS[0]) => {
    setSelectedPattern(pattern);
    setCurrentStep(0);
    setCompletedSteps([]);
    setShowPatternSelect(false);
  };

  // Render visual representation of the fold step
  const renderStepVisual = (visual: string) => {
    const baseStyle = {
      width: 120,
      height: 120,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
    };

    const paperStyle = {
      background: selectedColor,
      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.15)',
      transition: 'all 0.3s ease',
    };

    switch (visual) {
      case 'square':
        return <div style={{ ...baseStyle }}><div style={{ ...paperStyle, width: 100, height: 100, borderRadius: 2 }} /></div>;
      case 'triangle':
        return <div style={{ ...baseStyle }}><div style={{ ...paperStyle, width: 0, height: 0, borderLeft: '50px solid transparent', borderRight: '50px solid transparent', borderBottom: `90px solid ${selectedColor}`, background: 'transparent', boxShadow: 'none' }} /></div>;
      case 'small-triangle':
        return <div style={{ ...baseStyle }}><div style={{ ...paperStyle, width: 0, height: 0, borderLeft: '35px solid transparent', borderRight: '35px solid transparent', borderBottom: `60px solid ${selectedColor}`, background: 'transparent', boxShadow: 'none' }} /></div>;
      case 'diamond':
      case 'squash':
        return <div style={{ ...baseStyle }}><div style={{ ...paperStyle, width: 80, height: 80, transform: 'rotate(45deg)', borderRadius: 2 }} /></div>;
      case 'kite':
        return <div style={{ ...baseStyle }}><div style={{ ...paperStyle, width: 60, height: 100, clipPath: 'polygon(50% 0%, 100% 35%, 50% 100%, 0% 35%)', borderRadius: 0 }} /></div>;
      case 'crane':
        return <div style={{ ...baseStyle }}><div style={{ fontSize: 64, filter: isDark ? 'brightness(0.9)' : 'none' }}>🕊️</div></div>;
      case 'lotus':
        return <div style={{ ...baseStyle }}><div style={{ fontSize: 64 }}>🪷</div></div>;
      case 'heart':
        return <div style={{ ...baseStyle }}><div style={{ fontSize: 64, color: selectedColor, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>♥</div></div>;
      case 'blintz':
      case 'blintz2':
      case 'blintz3':
      case 'blintz4':
        const size = visual === 'blintz' ? 90 : visual === 'blintz2' ? 75 : visual === 'blintz3' ? 60 : 50;
        return <div style={{ ...baseStyle }}><div style={{ ...paperStyle, width: size, height: size, transform: 'rotate(45deg)', borderRadius: 2 }} /></div>;
      default:
        return <div style={{ ...baseStyle }}><div style={{ ...paperStyle, width: 80, height: 80, borderRadius: 4 }} /></div>;
    }
  };

  const bg = isDark
    ? 'linear-gradient(180deg, #0c0c14 0%, #12121c 50%, #0a0a10 100%)'
    : 'linear-gradient(180deg, #faf8f5 0%, #f5f0ea 50%, #efe8e0 100%)';

  const accent = 'rgba(251,191,36,0.9)';

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(2deg); } }
        @keyframes unfold { from { transform: scale(0.8) rotate(-10deg); opacity: 0; } to { transform: scale(1) rotate(0deg); opacity: 1; } }
        .paper-btn { transition: all 0.2s ease; }
        .paper-btn:active { transform: scale(0.95); }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ padding: 'max(env(safe-area-inset-top, 12px), 12px) 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`, zIndex: 20 }}>
          <button onClick={onBack} style={{ padding: '8px 16px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`, borderRadius: 20, color: colors.text, fontSize: 13, fontWeight: 450, cursor: 'pointer' }}>← Back</button>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.textMuted }}>Paper Folding</span>
          <div style={{ width: 70 }} />
        </header>

        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 32 }}>
              <div style={{ position: 'absolute', inset: 0, background: PAPER_COLORS[4].color, transform: 'rotate(45deg)', borderRadius: 4, animation: 'float 4s ease-in-out infinite', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }} />
              <div style={{ position: 'absolute', inset: 15, background: PAPER_COLORS[6].color, transform: 'rotate(30deg)', borderRadius: 4, animation: 'float 4s ease-in-out infinite 0.5s', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }} />
              <div style={{ position: 'absolute', inset: 30, background: PAPER_COLORS[2].color, transform: 'rotate(15deg)', borderRadius: 4, animation: 'float 4s ease-in-out infinite 1s', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', fontWeight: 300, color: colors.text, marginBottom: 12, letterSpacing: '-0.02em' }}>Paper Folding</h1>
            <p style={{ fontSize: 14, color: colors.textMuted, maxWidth: 320, lineHeight: 1.6, marginBottom: 32 }}>Transform a simple sheet into something meaningful. Each fold is a moment of presence, each crease a meditation.</p>

            {/* Pattern Selection */}
            <div style={{ width: '100%', maxWidth: 340, marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Choose your creation</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ORIGAMI_PATTERNS.map((pattern) => (
                  <button key={pattern.id} onClick={() => setSelectedPattern(pattern)} className="paper-btn" style={{ padding: '14px 16px', background: selectedPattern.id === pattern.id ? (isDark ? 'rgba(251,191,36,0.15)' : 'rgba(251,191,36,0.1)') : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)'), border: `1px solid ${selectedPattern.id === pattern.id ? 'rgba(251,191,36,0.4)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')}`, borderRadius: 12, textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: colors.text, marginBottom: 2 }}>{pattern.name}</div>
                      <div style={{ fontSize: 12, color: colors.textMuted }}>{pattern.meaning}</div>
                    </div>
                    <span style={{ fontSize: 12, color: colors.textMuted }}>{pattern.duration}</span>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setPhase('folding')} style={{ padding: '14px 36px', background: `linear-gradient(135deg, ${accent} 0%, rgba(251,191,36,0.85) 100%)`, border: 'none', borderRadius: 25, color: '#1a1a24', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(251,191,36,0.3)' }}>Begin Folding</button>
          </div>
        )}

        {/* FOLDING PHASE */}
        {phase === 'folding' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 16px', paddingBottom: 'max(env(safe-area-inset-bottom, 20px), 20px)', overflow: 'hidden' }}>
            {/* Progress bar */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: colors.text, fontWeight: 500 }}>{selectedPattern.name}</span>
                <span style={{ fontSize: 12, color: colors.textMuted }}>Step {currentStep + 1} of {totalSteps}</span>
              </div>
              <div style={{ height: 4, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: accent, borderRadius: 2, transition: 'width 0.3s ease' }} />
              </div>
            </div>

            {/* Paper color selection */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
              {PAPER_COLORS.map((item) => (
                <button key={item.color} onClick={() => setSelectedColor(item.color)} style={{ width: 28, height: 28, borderRadius: '50%', background: item.color, border: selectedColor === item.color ? '3px solid white' : '2px solid transparent', boxShadow: selectedColor === item.color ? `0 0 12px ${item.color}` : '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer', outline: 'none', transition: 'all 0.2s ease' }} />
              ))}
            </div>

            {/* Step visual */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'unfold 0.4s ease' }}>
              {renderStepVisual(currentStepData.visual)}
              
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.1rem, 4.5vw, 1.3rem)', color: colors.text, textAlign: 'center', maxWidth: 320, marginTop: 24, lineHeight: 1.5 }}>{currentStepData.instruction}</p>
              
              <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 12, fontStyle: 'italic' }}>Take your time with each fold</p>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
              <button onClick={goToPreviousStep} disabled={currentStep === 0} style={{ padding: '12px 20px', background: 'transparent', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 20, color: currentStep === 0 ? colors.textMuted : colors.text, fontSize: 14, cursor: currentStep === 0 ? 'default' : 'pointer', opacity: currentStep === 0 ? 0.5 : 1 }}>← Previous</button>
              <button onClick={markStepComplete} style={{ padding: '12px 28px', background: `linear-gradient(135deg, ${accent} 0%, rgba(251,191,36,0.85) 100%)`, border: 'none', borderRadius: 20, color: '#1a1a24', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 12px rgba(251,191,36,0.3)' }}>{currentStep === totalSteps - 1 ? 'Complete' : 'Next Step →'}</button>
            </div>
          </div>
        )}

        {/* REFLECTION PHASE */}
        {phase === 'reflection' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', paddingBottom: 'max(env(safe-area-inset-bottom, 24px), 24px)', overflow: 'auto', WebkitOverflowScrolling: 'touch', animation: 'fadeIn 0.5s ease' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', fontWeight: 300, color: colors.text, marginBottom: 24, textAlign: 'center' }}>Your {selectedPattern.name}</h2>

            <div style={{ marginBottom: 32, animation: 'float 4s ease-in-out infinite' }}>
              {renderStepVisual(selectedPattern.steps[selectedPattern.steps.length - 1].visual)}
            </div>

            <div style={{ textAlign: 'center', maxWidth: 360, marginBottom: 32 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontStyle: 'italic', color: colors.text, marginBottom: 16, lineHeight: 1.5 }}>"{selectedPattern.meaning}"</p>
              <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.6 }}>You've transformed a flat sheet into something with dimension and meaning. The patience and presence you practiced carries forward into everything you do.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280 }}>
              <button onClick={() => { if (onComplete) onComplete({ pattern: selectedPattern.id, completedSteps: completedSteps.length }); onBack(); }} style={{ padding: '14px 24px', background: `linear-gradient(135deg, ${accent} 0%, rgba(251,191,36,0.85) 100%)`, border: 'none', borderRadius: 25, color: '#1a1a24', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(251,191,36,0.3)' }}>Complete</button>
              <button onClick={() => { resetPattern(); setPhase('folding'); }} style={{ padding: '12px 24px', background: 'transparent', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 25, color: colors.textMuted, fontSize: 14, cursor: 'pointer' }}>Fold Again</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}