'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme, ThemeToggle } from '@/contexts/ThemeContext';

// ============================================================================
// TYPES
// ============================================================================
interface ZenRoomProps {
  onBack: () => void;
  onComplete?: () => void;
}

type Practice = 'breathe' | 'orient' | 'shake' | 'ground';
type Mode = 'select' | 'practice-select' | 'active' | 'complete';

type BreathingPattern = {
  name: string;
  description: string;
  phases: { name: string; duration: number }[];
};

// ============================================================================
// CONSTANTS
// ============================================================================
const BREATHING_PATTERNS: Record<string, BreathingPattern> = {
  coherent: {
    name: 'Coherent',
    description: 'Balance & calm',
    phases: [
      { name: 'Breathe in', duration: 5 },
      { name: 'Breathe out', duration: 5 },
    ],
  },
  '478': {
    name: '4-7-8',
    description: 'Deep relaxation',
    phases: [
      { name: 'Breathe in', duration: 4 },
      { name: 'Hold', duration: 7 },
      { name: 'Breathe out', duration: 8 },
    ],
  },
  box: {
    name: 'Box',
    description: 'Focus & calm',
    phases: [
      { name: 'Breathe in', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Breathe out', duration: 4 },
      { name: 'Hold', duration: 4 },
    ],
  },
  calming: {
    name: 'Calming',
    description: 'Quick reset',
    phases: [
      { name: 'Breathe in', duration: 4 },
      { name: 'Breathe out', duration: 6 },
    ],
  },
};

const ORIENT_PROMPTS = [
  { instruction: "Slowly look to your left", duration: 5 },
  { instruction: "Notice 3 things you see", duration: 6 },
  { instruction: "Gently turn to your right", duration: 5 },
  { instruction: "Find something with texture", duration: 6 },
  { instruction: "Look up slowly", duration: 5 },
  { instruction: "Notice the colors around you", duration: 6 },
  { instruction: "Return your gaze to center", duration: 5 },
  { instruction: "Feel your feet on the ground", duration: 6 },
  { instruction: "Take in the whole space", duration: 5 },
  { instruction: "You are safe here", duration: 5 },
];

const SHAKE_PHASES = [
  { instruction: "Start with your hands", subtext: "Let them tremble gently", duration: 15 },
  { instruction: "Move to your wrists", subtext: "Loose, easy shaking", duration: 15 },
  { instruction: "Now your arms", subtext: "Let them bounce freely", duration: 20 },
  { instruction: "Add your shoulders", subtext: "Shake out the tension", duration: 20 },
  { instruction: "Your whole upper body", subtext: "Everything loose and free", duration: 20 },
  { instruction: "Now add your legs", subtext: "Bounce, shake, release", duration: 25 },
  { instruction: "Your whole body", subtext: "Let everything move", duration: 30 },
  { instruction: "Slowly wind down", subtext: "Gentler... softer...", duration: 15 },
  { instruction: "Coming to stillness", subtext: "Notice how you feel", duration: 10 },
];

const GROUND_STEPS = [
  { sense: "SEE", instruction: "Name 5 things you can see", count: 5, duration: 20 },
  { sense: "TOUCH", instruction: "Notice 4 things you can feel", count: 4, duration: 16 },
  { sense: "HEAR", instruction: "Listen for 3 sounds", count: 3, duration: 15 },
  { sense: "SMELL", instruction: "Notice 2 things you can smell", count: 2, duration: 12 },
  { sense: "TASTE", instruction: "Observe 1 taste in your mouth", count: 1, duration: 8 },
  { sense: "PRESENT", instruction: "You are here. You are safe.", count: 0, duration: 8 },
];

const DURATIONS = [
  { label: '2 min', seconds: 120 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
];

const SHAKE_DURATIONS = [
  { label: '1 min', seconds: 60 },
  { label: '3 min', seconds: 180 },
  { label: '5 min', seconds: 300 },
];

const PRACTICES = [
  { id: 'breathe' as Practice, name: 'Breathe', icon: '○', description: 'Calm your nervous system' },
  { id: 'orient' as Practice, name: 'Orient', icon: '◎', description: 'Find safety in your space' },
  { id: 'shake' as Practice, name: 'Shake', icon: '∿', description: 'Release stored tension' },
  { id: 'ground' as Practice, name: 'Ground', icon: '▽', description: '5-4-3-2-1 senses' },
];

type ThemeColors = {
  bg: string;
  accent: string;
  text: string;
  textMuted: string;
  cardBg: string;
  cardBorder: string;
  glow: string;
};

const getZenColors = (theme: ThemeColors) => {
  return {
    bg: theme.bg,
    text: theme.text,
    textMuted: theme.textMuted,
    textDim: theme.textMuted,
    cardBg: theme.cardBg,
    cardBorder: theme.cardBorder,
    accent: theme.accent,
    accentGlow: theme.glow,
  };
};

// ============================================================================
// STYLES
// ============================================================================
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }
  
  html, body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes breathe {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.08); opacity: 1; }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }

  @keyframes orbPulse {
    0%, 100% { box-shadow: 0 0 40px rgba(139, 119, 183, 0.2), 0 0 80px rgba(139, 119, 183, 0.1); }
    50% { box-shadow: 0 0 60px rgba(139, 119, 183, 0.3), 0 0 100px rgba(139, 119, 183, 0.15); }
  }

  .practice-card {
    transition: transform 0.2s ease, background 0.2s ease;
  }
  .practice-card:active {
    transform: scale(0.97);
  }

  .option-btn {
    transition: all 0.2s ease;
  }
  .option-btn:active {
    transform: scale(0.96);
  }
`;

// ============================================================================
// COMPONENT
// ============================================================================
export default function ZenRoom({ onBack, onComplete }: ZenRoomProps) {
  const { colors } = useTheme();
  const COLORS = getZenColors(colors);

  // UI State
  const [mode, setMode] = useState<Mode>('select');
  const [selectedPractice, setSelectedPractice] = useState<Practice>('breathe');
  const [selectedPattern, setSelectedPattern] = useState('coherent');
  const [selectedDuration, setSelectedDuration] = useState(120);
  const [isLoaded, setIsLoaded] = useState(false);

  // Practice State
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [orientIndex, setOrientIndex] = useState(0);
  const [shakePhaseIndex, setShakePhaseIndex] = useState(0);
  const [groundStepIndex, setGroundStepIndex] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const pattern = BREATHING_PATTERNS[selectedPattern];
  const currentPhase = pattern?.phases[currentPhaseIndex];

  // ============================================================================
  // ORB ANIMATION
  // ============================================================================
  const getOrbScale = () => {
    if (mode !== 'active') return 1;
    
    if (selectedPractice === 'breathe' && currentPhase) {
      const phaseName = currentPhase.name.toLowerCase();
      if (phaseName.includes('in')) return 1 + phaseProgress * 0.4;
      if (phaseName.includes('out')) return 1.4 - phaseProgress * 0.4;
      return phaseName.includes('hold') ? (currentPhaseIndex === 1 ? 1.4 : 1) : 1;
    }
    
    return 1;
  };

  // ============================================================================
  // PRACTICE FUNCTIONS
  // ============================================================================
  const startBreathing = () => {
    setMode('active');
    setTimeRemaining(selectedDuration);
    setCurrentPhaseIndex(0);
    setPhaseProgress(0);
    setCycleCount(0);

    let elapsed = 0;
    let currentPhaseLocal = 0;
    const tickMs = 50;

    intervalRef.current = setInterval(() => {
      elapsed += tickMs / 1000;
      const currentPhaseDuration = pattern.phases[currentPhaseLocal].duration;
      
      setPhaseProgress(Math.min(elapsed / currentPhaseDuration, 1));
      setTimeRemaining((prev) => {
        const newTime = prev - tickMs / 1000;
        if (newTime <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setMode('complete');
          return 0;
        }
        return newTime;
      });

      if (elapsed >= currentPhaseDuration) {
        currentPhaseLocal = (currentPhaseLocal + 1) % pattern.phases.length;
        setCurrentPhaseIndex(currentPhaseLocal);
        if (currentPhaseLocal === 0) setCycleCount((c) => c + 1);
        setPhaseProgress(0);
        elapsed = 0;
      }
    }, tickMs);
  };

  const startOrient = () => {
    setMode('active');
    setOrientIndex(0);
    
    let currentIndex = 0;
    let elapsed = 0;
    const tickMs = 100;

    intervalRef.current = setInterval(() => {
      elapsed += tickMs / 1000;
      const currentPrompt = ORIENT_PROMPTS[currentIndex];
      
      setPhaseProgress(Math.min(elapsed / currentPrompt.duration, 1));

      if (elapsed >= currentPrompt.duration) {
        currentIndex++;
        if (currentIndex >= ORIENT_PROMPTS.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setMode('complete');
          return;
        }
        setOrientIndex(currentIndex);
        elapsed = 0;
      }
    }, tickMs);
  };

  const startShake = () => {
    setMode('active');
    setShakePhaseIndex(0);
    setTimeRemaining(selectedDuration);

    let elapsed = 0;
    let currentPhaseLocal = 0;
    let phaseElapsed = 0;
    const tickMs = 50;
    const totalPhaseDuration = SHAKE_PHASES.reduce((sum, p) => sum + p.duration, 0);
    const scale = selectedDuration / totalPhaseDuration;

    intervalRef.current = setInterval(() => {
      elapsed += tickMs / 1000;
      phaseElapsed += tickMs / 1000;
      
      const scaledDuration = SHAKE_PHASES[currentPhaseLocal].duration * scale;
      setPhaseProgress(Math.min(phaseElapsed / scaledDuration, 1));

      setTimeRemaining((prev) => {
        const newTime = prev - tickMs / 1000;
        if (newTime <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setMode('complete');
          return 0;
        }
        return newTime;
      });

      if (phaseElapsed >= scaledDuration && currentPhaseLocal < SHAKE_PHASES.length - 1) {
        currentPhaseLocal++;
        setShakePhaseIndex(currentPhaseLocal);
        phaseElapsed = 0;
      }
    }, tickMs);
  };

  const startGround = () => {
    setMode('active');
    setGroundStepIndex(0);

    let currentStep = 0;
    let elapsed = 0;
    const tickMs = 100;

    intervalRef.current = setInterval(() => {
      elapsed += tickMs / 1000;
      const currentGroundStep = GROUND_STEPS[currentStep];
      
      setPhaseProgress(Math.min(elapsed / currentGroundStep.duration, 1));

      if (elapsed >= currentGroundStep.duration) {
        currentStep++;
        if (currentStep >= GROUND_STEPS.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setMode('complete');
          return;
        }
        setGroundStepIndex(currentStep);
        elapsed = 0;
      }
    }, tickMs);
  };

  const startPractice = () => {
    switch (selectedPractice) {
      case 'breathe': startBreathing(); break;
      case 'orient': startOrient(); break;
      case 'shake': startShake(); break;
      case 'ground': startGround(); break;
    }
  };

  const stopPractice = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMode('complete');
  };

  const resetAndGoBack = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMode('select');
    onBack();
  };

  const selectPractice = (practice: Practice) => {
    setSelectedPractice(practice);
    setMode('practice-select');
  };

  // ============================================================================
  // HELPERS
  // ============================================================================
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCompletionMessage = () => {
    switch (selectedPractice) {
      case 'breathe': return `${cycleCount} breathing cycles completed`;
      case 'orient': return 'Orienting practice complete';
      case 'shake': return 'Tension released';
      case 'ground': return 'You are present and grounded';
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <>
      <style jsx global>{GLOBAL_STYLES}</style>

      <div style={{
        position: 'fixed',
        inset: 0,
        background: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        
        {/* ================================================================ */}
        {/* AMBIENT BACKGROUND */}
        {/* ================================================================ */}
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          {/* Subtle nebula glow */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '150%',
            height: '60%',
            background: `radial-gradient(ellipse at center, ${COLORS.accentGlow} 0%, transparent 60%)`,
            borderRadius: '50%',
          }} />

          {/* Bottom glow */}
          <div style={{
            position: 'absolute',
            bottom: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120%',
            height: '50%',
            background: `radial-gradient(ellipse at center, ${COLORS.accentGlow} 0%, transparent 60%)`,
            borderRadius: '50%',
          }} />
        </div>

        {/* ================================================================ */}
        {/* HEADER */}
        {/* ================================================================ */}
        <header style={{
          padding: '16px',
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 50,
        }}>
          <button
            onClick={resetAndGoBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 18px',
              background: COLORS.cardBg,
              border: `1px solid ${COLORS.cardBorder}`,
              borderRadius: 50,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              color: COLORS.textMuted,
            }}
          >
            ← Sanctuary
          </button>
          
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: COLORS.textDim,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Zen Garden
          </span>

          <ThemeToggle />
        </header>

        {/* ================================================================ */}
        {/* MAIN CONTENT */}
        {/* ================================================================ */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          paddingBottom: 'max(40px, env(safe-area-inset-bottom))',
          position: 'relative',
          zIndex: 10,
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          
          {/* ============================================================ */}
          {/* ORB */}
          {/* ============================================================ */}
          <div style={{
            position: 'relative',
            marginBottom: 24,
          }}>
            {/* Outer ring */}
            <div style={{
              position: 'absolute',
              inset: -16,
              borderRadius: '50%',
              border: '1px solid rgba(139, 119, 183, 0.15)',
              animation: 'breathe 6s ease-in-out infinite',
            }} />
            
            {/* Orb */}
            <div style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, rgba(180, 160, 220, 0.3) 0%, rgba(139, 119, 183, 0.15) 50%, rgba(100, 80, 160, 0.08) 100%)',
              boxShadow: '0 0 50px rgba(139, 119, 183, 0.25), 0 0 100px rgba(139, 119, 183, 0.1)',
              transform: `scale(${getOrbScale()})`,
              transition: 'transform 0.5s ease-out',
              animation: mode !== 'active' ? 'orbPulse 4s ease-in-out infinite' : 'none',
            }}>
              {/* Inner glow */}
              <div style={{
                position: 'absolute',
                top: '20%',
                left: '25%',
                width: '40%',
                height: '40%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
              }} />
            </div>
          </div>

          {/* ============================================================ */}
          {/* PRACTICE SELECTION */}
          {/* ============================================================ */}
          {mode === 'select' && (
            <div style={{ 
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease-out',
            }}>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 28,
                fontWeight: 300,
                color: COLORS.text,
                marginBottom: 8,
              }}>
                Zen Garden
              </h1>
              <p style={{
                fontSize: 14,
                color: COLORS.textMuted,
                marginBottom: 28,
              }}>
                Choose your practice
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
                maxWidth: 320,
              }}>
                {PRACTICES.map((p) => (
                  <button
                    key={p.id}
                    className="practice-card"
                    onClick={() => selectPractice(p.id)}
                    style={{
                      padding: '20px 16px',
                      background: COLORS.cardBg,
                      border: `1px solid ${COLORS.cardBorder}`,
                      borderRadius: 16,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{
                      fontSize: 24,
                      marginBottom: 10,
                      color: COLORS.textMuted,
                    }}>
                      {p.icon}
                    </div>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: COLORS.text,
                      marginBottom: 4,
                    }}>
                      {p.name}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: COLORS.textDim,
                    }}>
                      {p.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* PRACTICE OPTIONS */}
          {/* ============================================================ */}
          {mode === 'practice-select' && (
            <div style={{ 
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease-out',
            }}>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 26,
                fontWeight: 300,
                color: COLORS.text,
                marginBottom: 6,
              }}>
                {PRACTICES.find(p => p.id === selectedPractice)?.name}
              </h1>
              <p style={{
                fontSize: 14,
                color: COLORS.textMuted,
                marginBottom: 24,
              }}>
                {PRACTICES.find(p => p.id === selectedPractice)?.description}
              </p>

              {/* Breathing patterns */}
              {selectedPractice === 'breathe' && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  {Object.entries(BREATHING_PATTERNS).map(([key, p]) => (
                    <button
                      key={key}
                      className="option-btn"
                      onClick={() => setSelectedPattern(key)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 50,
                        border: `1px solid ${selectedPattern === key ? COLORS.accent : COLORS.cardBorder}`,
                        background: selectedPattern === key ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                        color: selectedPattern === key ? COLORS.text : COLORS.textMuted,
                        fontSize: 14,
                        cursor: 'pointer',
                      }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Duration selection */}
              {(selectedPractice === 'breathe' || selectedPractice === 'shake') && (
                <div style={{
                  display: 'flex',
                  gap: 8,
                  justifyContent: 'center',
                  marginBottom: 24,
                }}>
                  {(selectedPractice === 'shake' ? SHAKE_DURATIONS : DURATIONS).map((d) => (
                    <button
                      key={d.seconds}
                      className="option-btn"
                      onClick={() => setSelectedDuration(d.seconds)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: 50,
                        border: `1px solid ${selectedDuration === d.seconds ? COLORS.accent : COLORS.cardBorder}`,
                        background: selectedDuration === d.seconds ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                        color: selectedDuration === d.seconds ? COLORS.text : COLORS.textMuted,
                        fontSize: 14,
                        cursor: 'pointer',
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Info text for orient/ground */}
              {selectedPractice === 'orient' && (
                <p style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 24 }}>
                  ~1 minute guided practice
                </p>
              )}
              {selectedPractice === 'ground' && (
                <p style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 24 }}>
                  5-4-3-2-1 sensory grounding
                </p>
              )}

              {/* Start button */}
              <button
                onClick={startPractice}
                style={{
                  padding: '16px 48px',
                  borderRadius: 50,
                  border: 'none',
                  background: `linear-gradient(135deg, ${COLORS.accent} 0%, #6366f1 100%)`,
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: `0 4px 24px ${COLORS.accentGlow}`,
                  marginBottom: 16,
                }}
              >
                Begin
              </button>

              {/* Back link */}
              <button
                onClick={() => setMode('select')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: COLORS.textDim,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                ← Choose different practice
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* ACTIVE: BREATHING */}
          {/* ============================================================ */}
          {mode === 'active' && selectedPractice === 'breathe' && currentPhase && (
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
              <div style={{
                fontSize: 14,
                color: COLORS.textDim,
                marginBottom: 8,
                letterSpacing: '0.1em',
              }}>
                {formatTime(timeRemaining)}
              </div>
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 28,
                fontWeight: 300,
                color: COLORS.text,
                marginBottom: 8,
              }}>
                {currentPhase.name}
              </div>
              <div style={{
                fontSize: 56,
                fontWeight: 200,
                color: COLORS.textDim,
                marginBottom: 8,
              }}>
                {Math.ceil(currentPhase.duration * (1 - phaseProgress))}
              </div>
              <div style={{
                fontSize: 12,
                color: COLORS.textDim,
                marginBottom: 28,
              }}>
                Cycle {cycleCount + 1}
              </div>
              <button
                onClick={stopPractice}
                style={{
                  padding: '12px 28px',
                  borderRadius: 50,
                  border: `1px solid ${COLORS.cardBorder}`,
                  background: 'transparent',
                  color: COLORS.textMuted,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                End Session
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* ACTIVE: ORIENT */}
          {/* ============================================================ */}
          {mode === 'active' && selectedPractice === 'orient' && (
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 24,
                fontWeight: 300,
                color: COLORS.text,
                marginBottom: 24,
                maxWidth: 280,
              }}>
                {ORIENT_PROMPTS[orientIndex]?.instruction}
              </div>
              
              {/* Progress dots */}
              <div style={{
                display: 'flex',
                gap: 6,
                justifyContent: 'center',
                marginBottom: 28,
              }}>
                {ORIENT_PROMPTS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: i === orientIndex 
                        ? COLORS.accent 
                        : i < orientIndex 
                          ? 'rgba(139, 119, 183, 0.5)' 
                          : COLORS.cardBorder,
                      transition: 'background 0.3s ease',
                    }}
                  />
                ))}
              </div>
              
              <button
                onClick={stopPractice}
                style={{
                  padding: '12px 28px',
                  borderRadius: 50,
                  border: `1px solid ${COLORS.cardBorder}`,
                  background: 'transparent',
                  color: COLORS.textMuted,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                End Session
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* ACTIVE: SHAKE */}
          {/* ============================================================ */}
          {mode === 'active' && selectedPractice === 'shake' && (
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
              <div style={{
                fontSize: 14,
                color: COLORS.textDim,
                marginBottom: 8,
                letterSpacing: '0.1em',
              }}>
                {formatTime(timeRemaining)}
              </div>
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 24,
                fontWeight: 300,
                color: COLORS.text,
                marginBottom: 6,
              }}>
                {SHAKE_PHASES[shakePhaseIndex]?.instruction}
              </div>
              <div style={{
                fontSize: 14,
                color: COLORS.textMuted,
                marginBottom: 24,
              }}>
                {SHAKE_PHASES[shakePhaseIndex]?.subtext}
              </div>
              
              {/* Progress dots */}
              <div style={{
                display: 'flex',
                gap: 6,
                justifyContent: 'center',
                marginBottom: 28,
              }}>
                {SHAKE_PHASES.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: i === shakePhaseIndex 
                        ? COLORS.accent 
                        : i < shakePhaseIndex 
                          ? 'rgba(139, 119, 183, 0.5)' 
                          : COLORS.cardBorder,
                      transition: 'background 0.3s ease',
                    }}
                  />
                ))}
              </div>
              
              <button
                onClick={stopPractice}
                style={{
                  padding: '12px 28px',
                  borderRadius: 50,
                  border: `1px solid ${COLORS.cardBorder}`,
                  background: 'transparent',
                  color: COLORS.textMuted,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                End Session
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* ACTIVE: GROUND */}
          {/* ============================================================ */}
          {mode === 'active' && selectedPractice === 'ground' && (
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
              <div style={{
                fontSize: 12,
                color: COLORS.textDim,
                marginBottom: 8,
                letterSpacing: '0.15em',
              }}>
                {GROUND_STEPS[groundStepIndex]?.sense}
              </div>
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 22,
                fontWeight: 300,
                color: COLORS.text,
                marginBottom: 12,
                maxWidth: 260,
              }}>
                {GROUND_STEPS[groundStepIndex]?.instruction}
              </div>
              
              {GROUND_STEPS[groundStepIndex]?.count > 0 && (
                <div style={{
                  fontSize: 48,
                  fontWeight: 200,
                  color: COLORS.textDim,
                  marginBottom: 16,
                }}>
                  {GROUND_STEPS[groundStepIndex]?.count}
                </div>
              )}
              
              {/* Progress dots */}
              <div style={{
                display: 'flex',
                gap: 8,
                justifyContent: 'center',
                marginBottom: 28,
              }}>
                {GROUND_STEPS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: i === groundStepIndex 
                        ? COLORS.accent 
                        : i < groundStepIndex 
                          ? 'rgba(139, 119, 183, 0.5)' 
                          : COLORS.cardBorder,
                      transition: 'background 0.3s ease',
                    }}
                  />
                ))}
              </div>
              
              <button
                onClick={stopPractice}
                style={{
                  padding: '12px 28px',
                  borderRadius: 50,
                  border: `1px solid ${COLORS.cardBorder}`,
                  background: 'transparent',
                  color: COLORS.textMuted,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                End Session
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* COMPLETE */}
          {/* ============================================================ */}
          {mode === 'complete' && (
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 32,
                fontWeight: 300,
                color: COLORS.text,
                marginBottom: 10,
              }}>
                Beautiful
              </h1>
              <p style={{
                fontSize: 15,
                color: COLORS.textMuted,
                marginBottom: 32,
              }}>
                {getCompletionMessage()}
              </p>
              <button
                onClick={resetAndGoBack}
                style={{
                  padding: '16px 40px',
                  borderRadius: 50,
                  border: 'none',
                  background: `linear-gradient(135deg, ${COLORS.accent} 0%, #6366f1 100%)`,
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: `0 4px 24px ${COLORS.accentGlow}`,
                }}
              >
                Return to Sanctuary
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}