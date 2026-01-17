'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme, ThemeToggle } from '@/contexts/ThemeContext';

import type { Mode, PhaseState, PracticeId } from '@/lib/zen/types';
import { GLOBAL_STYLES, PHASE_COLORS } from '@/lib/zen/theme';
import { BackArrowIcon } from '@/lib/zen/icons';
import {
  PRACTICES,
  BREATHING_PATTERNS,
  ORIENT_PROMPTS,
  SHAKE_PHASES,
  GROUND_STEPS,
  DURATION_PRESETS,
} from '@/lib/zen/data/practices';

import { PracticePicker } from '@/lib/zen/components/PracticePicker';
import { PracticeOptions } from '@/lib/zen/components/PracticeOptions';
import { BreathingGuide } from '@/lib/zen/components/BreathingGuide';
import { OrientGuide } from '@/lib/zen/components/OrientGuide';
import { ShakeGuide } from '@/lib/zen/components/ShakeGuide';
import { GroundGuide } from '@/lib/zen/components/GroundGuide';
import { CompletionScreen } from '@/lib/zen/components/CompletionScreen';

interface ZenRoomProps {
  onBack: () => void;
  onComplete?: () => void;
}

type ThemeColors = {
  bg: string;
  accent: string;
  text: string;
  textMuted: string;
  cardBg: string;
  cardBorder: string;
  glow: string;
};

const getZenColors = (theme: ThemeColors) => ({
  bg: theme.bg,
  text: theme.text,
  textMuted: theme.textMuted,
  textDim: theme.textMuted,
  cardBg: theme.cardBg,
  cardBorder: theme.cardBorder,
  accent: theme.accent,
  accentGlow: theme.glow,
});

export default function ZenRoom({ onBack, onComplete }: ZenRoomProps) {
  const { colors } = useTheme();
  const COLORS = getZenColors(colors as ThemeColors);

  const [mode, setMode] = useState<Mode>('select');
  const [selectedPractice, setSelectedPractice] = useState<PracticeId>('breathe');
  const [selectedPattern, setSelectedPattern] = useState<string>(BREATHING_PATTERNS[0]?.id ?? 'coherent');
  const [selectedDuration, setSelectedDuration] = useState<number>(DURATION_PRESETS.breathe[0]?.seconds ?? 120);
  const [isLoaded, setIsLoaded] = useState(false);

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [orientIndex, setOrientIndex] = useState(0);
  const [shakePhaseIndex, setShakePhaseIndex] = useState(0);
  const [groundStepIndex, setGroundStepIndex] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const clearTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    const id = setTimeout(() => setIsLoaded(true), 100);
    return () => {
      clearTimeout(id);
      clearTimer();
    };
  }, []);

  const pattern = BREATHING_PATTERNS.find((p) => p.id === selectedPattern) ?? BREATHING_PATTERNS[0];
  const currentPhase = pattern?.phases[currentPhaseIndex];

  const breathingPhaseColor = (() => {
    if (selectedPractice !== 'breathe' || mode !== 'active' || !currentPhase) return COLORS.accent;
    const phaseName = currentPhase.name.toLowerCase();
    if (phaseName.includes('in')) return PHASE_COLORS.inhale;
    if (phaseName.includes('out')) return PHASE_COLORS.exhale;
    return PHASE_COLORS.hold;
  })();

  const getOrbScale = () => {
    if (mode !== 'active') return 1;
    if (selectedPractice !== 'breathe' || !currentPhase) return 1;
    const phaseName = currentPhase.name.toLowerCase();
    if (phaseName.includes('in')) return 1 + phaseProgress * 0.4;
    if (phaseName.includes('out')) return 1.4 - phaseProgress * 0.4;
    return phaseName.includes('hold') ? (currentPhaseIndex === 1 ? 1.4 : 1) : 1;
  };

  const complete = () => {
    clearTimer();
    setMode('complete');
    onComplete?.();
  };

  const startBreathing = () => {
    if (!pattern) return;
    clearTimer();
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
        const next = prev - tickMs / 1000;
        if (next <= 0) {
          complete();
          return 0;
        }
        return next;
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
    clearTimer();
    setMode('active');
    setOrientIndex(0);

    let currentIndex = 0;
    let elapsed = 0;
    const tickMs = 100;

    intervalRef.current = setInterval(() => {
      elapsed += tickMs / 1000;
      const prompt = ORIENT_PROMPTS[currentIndex];
      setPhaseProgress(Math.min(elapsed / prompt.duration, 1));
      if (elapsed >= prompt.duration) {
        currentIndex += 1;
        if (currentIndex >= ORIENT_PROMPTS.length) return complete();
        setOrientIndex(currentIndex);
        elapsed = 0;
      }
    }, tickMs);
  };

  const startShake = () => {
    clearTimer();
    setMode('active');
    setShakePhaseIndex(0);
    setTimeRemaining(selectedDuration);

    let currentPhaseLocal = 0;
    let phaseElapsed = 0;
    const tickMs = 50;
    const total = SHAKE_PHASES.reduce((sum, p) => sum + p.duration, 0);
    const scale = total > 0 ? selectedDuration / total : 1;

    intervalRef.current = setInterval(() => {
      phaseElapsed += tickMs / 1000;
      const scaledDuration = SHAKE_PHASES[currentPhaseLocal].duration * scale;
      setPhaseProgress(Math.min(phaseElapsed / scaledDuration, 1));

      setTimeRemaining((prev) => {
        const next = prev - tickMs / 1000;
        if (next <= 0) {
          complete();
          return 0;
        }
        return next;
      });

      if (phaseElapsed >= scaledDuration && currentPhaseLocal < SHAKE_PHASES.length - 1) {
        currentPhaseLocal += 1;
        setShakePhaseIndex(currentPhaseLocal);
        phaseElapsed = 0;
      }
    }, tickMs);
  };

  const startGround = () => {
    clearTimer();
    setMode('active');
    setGroundStepIndex(0);

    let currentStep = 0;
    let elapsed = 0;
    const tickMs = 100;

    intervalRef.current = setInterval(() => {
      elapsed += tickMs / 1000;
      const step = GROUND_STEPS[currentStep];
      setPhaseProgress(Math.min(elapsed / step.duration, 1));
      if (elapsed >= step.duration) {
        currentStep += 1;
        if (currentStep >= GROUND_STEPS.length) return complete();
        setGroundStepIndex(currentStep);
        elapsed = 0;
      }
    }, tickMs);
  };

  const startPractice = () => {
    switch (selectedPractice) {
      case 'breathe':
        return startBreathing();
      case 'orient':
        return startOrient();
      case 'shake':
        return startShake();
      case 'ground':
        return startGround();
    }
  };

  const stopPractice = () => complete();
  const resetAndGoBack = () => {
    clearTimer();
    setMode('select');
    onBack();
  };
  const selectPractice = (practice: PracticeId) => {
    setSelectedPractice(practice);
    setMode('practice-select');
  };

  const getCompletionMessage = () => {
    switch (selectedPractice) {
      case 'breathe':
        return `${cycleCount} breathing cycles completed`;
      case 'orient':
        return 'Orienting practice complete';
      case 'shake':
        return 'Tension released';
      case 'ground':
        return 'You are present and grounded';
    }
  };

  const phaseState: PhaseState = { currentPhaseIndex, phaseProgress, timeRemaining };

  return (
    <>
      <style jsx global>{GLOBAL_STYLES.globalCss}</style>
      <div style={{ position: 'fixed', inset: 0, background: COLORS.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '150%', height: '60%', background: `radial-gradient(ellipse at center, ${COLORS.accentGlow} 0%, transparent 60%)`, borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '120%', height: '50%', background: `radial-gradient(ellipse at center, ${COLORS.accentGlow} 0%, transparent 60%)`, borderRadius: '50%' }} />
        </div>

        <header style={{ padding: 16, paddingTop: 'max(16px, env(safe-area-inset-top))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50 }}>
          <button onClick={resetAndGoBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 50, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: COLORS.textMuted }}>
            <BackArrowIcon size={18} color={COLORS.textMuted} /> Sanctuary
          </button>
          <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textDim, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Zen Garden</span>
          <ThemeToggle />
        </header>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, paddingBottom: 'max(40px, env(safe-area-inset-bottom))', position: 'relative', zIndex: 10, opacity: isLoaded ? 1 : 0, transform: isLoaded ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <div style={{ position: 'absolute', inset: -16, borderRadius: '50%', border: `1px solid ${mode === 'active' && selectedPractice === 'breathe' ? breathingPhaseColor : 'rgba(139, 119, 183, 0.15)'}`, animation: 'breathe 6s ease-in-out infinite' }} />
            <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, rgba(180, 160, 220, 0.3) 0%, rgba(139, 119, 183, 0.15) 50%, rgba(100, 80, 160, 0.08) 100%)', boxShadow: '0 0 50px rgba(139, 119, 183, 0.25), 0 0 100px rgba(139, 119, 183, 0.1)', transform: `scale(${getOrbScale()})`, transition: 'transform 0.5s ease-out', animation: mode !== 'active' ? 'orbPulse 4s ease-in-out infinite' : 'none' }}>
              <div style={{ position: 'absolute', top: '20%', left: '25%', width: '40%', height: '40%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)' }} />
            </div>
          </div>

          {mode === 'select' && <PracticePicker practices={PRACTICES} colors={COLORS} onSelect={selectPractice} />}
          {mode === 'practice-select' && (
            <PracticeOptions
              practiceId={selectedPractice}
              colors={COLORS}
              selectedPatternId={selectedPattern}
              onPatternChange={setSelectedPattern}
              selectedDurationSeconds={selectedDuration}
              onDurationChange={setSelectedDuration}
              onBegin={startPractice}
              onBackToPicker={() => setMode('select')}
            />
          )}

          {mode === 'active' && selectedPractice === 'breathe' && (
            <BreathingGuide colors={COLORS} patternId={selectedPattern} phaseState={phaseState} cycleCount={cycleCount} onEnd={stopPractice} />
          )}
          {mode === 'active' && selectedPractice === 'orient' && <OrientGuide colors={COLORS} orientIndex={orientIndex} onEnd={stopPractice} />}
          {mode === 'active' && selectedPractice === 'shake' && (
            <ShakeGuide colors={COLORS} timeRemaining={timeRemaining} shakePhaseIndex={shakePhaseIndex} onEnd={stopPractice} />
          )}
          {mode === 'active' && selectedPractice === 'ground' && <GroundGuide colors={COLORS} groundStepIndex={groundStepIndex} onEnd={stopPractice} />}

          {mode === 'complete' && (
            <CompletionScreen colors={COLORS} practiceId={selectedPractice} message={getCompletionMessage()} onReturn={resetAndGoBack} />
          )}
        </div>
      </div>
    </>
  );
}
