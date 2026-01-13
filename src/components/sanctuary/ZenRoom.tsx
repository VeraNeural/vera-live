'use client';

import { useState, useEffect, useRef } from 'react';

interface ZenRoomProps {
  onBack: () => void;
  onComplete?: () => void;
}

type Practice = 'breathe' | 'orient' | 'shake' | 'ground';

type BreathingPattern = {
  name: string;
  description: string;
  phases: { name: string; duration: number }[];
};

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

export default function ZenRoom({ onBack, onComplete }: ZenRoomProps) {
  const [mode, setMode] = useState<'select' | 'practice-select' | 'active' | 'complete'>('select');
  const [selectedPractice, setSelectedPractice] = useState<Practice>('breathe');
  const [selectedPattern, setSelectedPattern] = useState('coherent');
  const [selectedDuration, setSelectedDuration] = useState(120);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Stars - fewer, calmer
  const [stars] = useState(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: (i * 23.7) % 100,
      y: (i * 13.3) % 45,
      size: 1 + (i % 2),
      duration: 4 + (i % 3) * 2,
      delay: (i * 0.5) % 8,
    }))
  );

  // Incense smoke particles - deterministic
  const [smokeParticles] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      delay: i * 0.8,
      duration: 6 + (i % 3),
      drift: (i % 2 === 0 ? 1 : -1) * (10 + (i % 15)),
    }))
  );

  // Breathing state
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  // Orient state
  const [orientIndex, setOrientIndex] = useState(0);

  // Shake state  
  const [shakePhaseIndex, setShakePhaseIndex] = useState(0);
  const [shakeIntensity, setShakeIntensity] = useState(0);

  // Ground state
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

  const getOrbScale = () => {
    if (mode !== 'active') return 1;
    
    if (selectedPractice === 'breathe' && currentPhase) {
      const phaseName = currentPhase.name.toLowerCase();
      if (phaseName.includes('in')) return 1 + phaseProgress * 0.5;
      if (phaseName.includes('out')) return 1.5 - phaseProgress * 0.5;
      return phaseName.includes('hold') ? (currentPhaseIndex === 1 ? 1.5 : 1) : 1;
    }
    
    if (selectedPractice === 'shake') {
      return 1 + Math.sin(Date.now() / 50) * 0.03 * shakeIntensity;
    }
    
    return 1;
  };

  const getOrbStyle = () => {
    if (mode !== 'active') return {};
    
    if (selectedPractice === 'shake') {
      const shake = shakeIntensity * 3;
      return {
        transform: `scale(${getOrbScale()}) translate(${Math.sin(Date.now() / 30) * shake}px, ${Math.cos(Date.now() / 40) * shake}px)`,
      };
    }
    
    if (selectedPractice === 'orient') {
      const prompt = ORIENT_PROMPTS[orientIndex];
      let rotate = 0;
      if (prompt?.instruction.includes('left')) rotate = -15;
      if (prompt?.instruction.includes('right')) rotate = 15;
      if (prompt?.instruction.includes('up')) rotate = -10;
      return { transform: `scale(${getOrbScale()}) rotate(${rotate}deg)` };
    }
    
    return { transform: `scale(${getOrbScale()})` };
  };

  // Start Breathing
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

  // Start Orient
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

  // Start Shake
  const startShake = () => {
    setMode('active');
    setShakePhaseIndex(0);
    setShakeIntensity(0);
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
      
      // Intensity builds up then down
      const progressThroughSession = elapsed / selectedDuration;
      if (progressThroughSession < 0.7) {
        setShakeIntensity(Math.min(progressThroughSession / 0.5, 1) * 10);
      } else {
        setShakeIntensity((1 - (progressThroughSession - 0.7) / 0.3) * 10);
      }

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

  // Start Ground
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  const getCompletionMessage = () => {
    switch (selectedPractice) {
      case 'breathe': return `${cycleCount} breathing cycles completed`;
      case 'orient': return 'Orienting practice complete';
      case 'shake': return 'Tension released';
      case 'ground': return 'You are present and grounded';
    }
  };

  const practices = [
    { id: 'breathe' as Practice, name: 'Breathe', icon: '○', description: 'Calm your nervous system' },
    { id: 'orient' as Practice, name: 'Orient', icon: '◎', description: 'Find safety in your space' },
    { id: 'shake' as Practice, name: 'Shake', icon: '∿', description: 'Release stored tension' },
    { id: 'ground' as Practice, name: 'Ground', icon: '▽', description: '5-4-3-2-1 senses' },
  ];

  return (
    <>
      <style jsx>{`
        .zen-room {
          min-height: 100vh;
          min-height: 100dvh;
          background: linear-gradient(180deg, #08081a 0%, #0a0a1c 30%, #0c0c20 60%, #0a0a1a 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding-top: 10vh;
        }

        /* ============ AMBIENT LAYERS ============ */
        .ambient-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .stars-layer {
          background-image: 
            radial-gradient(1px 1px at 15% 12%, rgba(255, 255, 255, 0.3), transparent),
            radial-gradient(1px 1px at 45% 8%, rgba(255, 255, 255, 0.2), transparent),
            radial-gradient(1px 1px at 75% 15%, rgba(255, 255, 255, 0.25), transparent),
            radial-gradient(1px 1px at 90% 5%, rgba(255, 255, 255, 0.2), transparent);
          background-size: 350px 350px;
        }

        .star {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          animation: twinkle ease-in-out infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        .nebula-glow {
          background: 
            radial-gradient(ellipse 80% 50% at 20% 80%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse 100% 80% at 50% 50%, rgba(139, 119, 183, 0.04) 0%, transparent 60%);
        }

        /* ============ MOON ============ */
        .moon {
          position: absolute;
          top: 8%;
          right: 12%;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, 
            #fffef8 0%, 
            #f8f6f0 30%, 
            #e8e6e0 60%, 
            #d8d6d0 100%);
          box-shadow: 
            0 0 40px rgba(255, 255, 240, 0.3),
            0 0 80px rgba(255, 255, 240, 0.15),
            0 0 120px rgba(255, 255, 240, 0.08);
        }

        .moon-crater {
          position: absolute;
          border-radius: 50%;
          background: rgba(200, 198, 190, 0.3);
        }

        .crater-1 { width: 12px; height: 12px; top: 20%; left: 25%; }
        .crater-2 { width: 8px; height: 8px; top: 45%; left: 55%; }
        .crater-3 { width: 6px; height: 6px; top: 65%; left: 30%; }

        /* ============ MOUNTAINS ============ */
        .mountains {
          position: absolute;
          bottom: 25%;
          left: 0;
          right: 0;
          height: 20%;
          pointer-events: none;
        }

        .mountain {
          position: absolute;
          bottom: 0;
          border-left: solid transparent;
          border-right: solid transparent;
          border-bottom: solid;
        }

        .mountain-1 {
          left: 5%;
          border-left-width: 80px;
          border-right-width: 100px;
          border-bottom-width: 120px;
          border-bottom-color: rgba(20, 20, 35, 0.9);
        }

        .mountain-2 {
          left: 20%;
          border-left-width: 120px;
          border-right-width: 140px;
          border-bottom-width: 160px;
          border-bottom-color: rgba(15, 15, 28, 0.95);
        }

        .mountain-3 {
          right: 15%;
          border-left-width: 150px;
          border-right-width: 100px;
          border-bottom-width: 140px;
          border-bottom-color: rgba(18, 18, 32, 0.9);
        }

        .mountain-4 {
          right: 0%;
          border-left-width: 100px;
          border-right-width: 80px;
          border-bottom-width: 100px;
          border-bottom-color: rgba(22, 22, 38, 0.85);
        }

        /* ============ GROUND ============ */
        .ground {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 30%;
          background: linear-gradient(180deg, 
            transparent 0%,
            rgba(10, 10, 24, 0.6) 30%,
            rgba(8, 8, 20, 0.85) 60%,
            rgba(5, 5, 15, 1) 100%);
        }

        /* ============ ZEN STONES ============ */
        .zen-stones {
          position: absolute;
          bottom: 10%;
          left: 15%;
        }

        .stone {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(145deg, 
            rgba(60, 58, 65, 1) 0%, 
            rgba(45, 43, 50, 1) 50%, 
            rgba(35, 33, 40, 1) 100%);
          box-shadow: 
            3px 5px 15px rgba(0, 0, 0, 0.5),
            inset -2px -2px 8px rgba(0, 0, 0, 0.3),
            inset 2px 2px 8px rgba(100, 100, 110, 0.1);
        }

        .stone-1 { width: 50px; height: 40px; bottom: 0; left: 10px; border-radius: 45% 55% 50% 50%; }
        .stone-2 { width: 40px; height: 32px; bottom: 35px; left: 18px; border-radius: 50% 50% 45% 55%; }
        .stone-3 { width: 28px; height: 24px; bottom: 62px; left: 24px; border-radius: 48% 52% 50% 50%; }

        /* ============ INCENSE ============ */
        .incense-holder {
          position: absolute;
          bottom: 10%;
          right: 15%;
        }

        .incense-bowl {
          width: 45px;
          height: 20px;
          background: linear-gradient(180deg, 
            rgba(80, 70, 60, 1) 0%, 
            rgba(60, 50, 40, 1) 100%);
          border-radius: 0 0 50% 50%;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
        }

        .incense-stick {
          position: absolute;
          bottom: 18px;
          left: 50%;
          transform: translateX(-50%) rotate(-8deg);
          width: 3px;
          height: 50px;
          background: linear-gradient(180deg, 
            rgba(180, 100, 60, 1) 0%, 
            rgba(120, 80, 50, 1) 100%);
          border-radius: 1px;
        }

        .incense-tip {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 5px;
          height: 5px;
          background: radial-gradient(circle, 
            rgba(255, 150, 50, 0.9) 0%, 
            rgba(255, 100, 30, 0.6) 50%, 
            transparent 70%);
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(255, 120, 40, 0.6);
          animation: emberGlow 1.5s ease-in-out infinite;
        }

        @keyframes emberGlow {
          0%, 100% { opacity: 0.8; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.2); }
        }

        .smoke-container {
          position: absolute;
          bottom: 65px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 120px;
          overflow: visible;
        }

        .smoke {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, 
            rgba(200, 200, 210, 0.3) 0%, 
            rgba(180, 180, 190, 0.1) 50%, 
            transparent 70%);
          border-radius: 50%;
          animation: smokeRise linear infinite;
        }

        @keyframes smokeRise {
          0% {
            transform: translateX(-50%) translateY(0) scale(1);
            opacity: 0.4;
          }
          50% {
            opacity: 0.25;
          }
          100% {
            transform: translateX(calc(-50% + var(--drift, 10px))) translateY(-120px) scale(3);
            opacity: 0;
          }
        }

        /* ============ CANDLES ============ */
        .candles-container {
          position: absolute;
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 50px;
        }

        .candle-group {
          position: relative;
        }

        .candle {
          position: relative;
          width: 10px;
          background: linear-gradient(180deg, 
            rgba(255, 253, 250, 0.95) 0%,
            rgba(250, 245, 238, 0.9) 50%,
            rgba(242, 238, 230, 0.85) 100%);
          border-radius: 2px 2px 3px 3px;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
        }

        .candle-tall { height: 50px; }
        .candle-medium { height: 38px; margin-top: 12px; }
        .candle-short { height: 30px; margin-top: 20px; }

        .wick {
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 4px;
          background: #2d2d2d;
          border-radius: 1px;
        }

        .flame-container {
          position: absolute;
          top: -22px;
          left: 50%;
          transform: translateX(-50%);
        }

        .flame {
          width: 6px;
          height: 14px;
          background: radial-gradient(ellipse at bottom,
            rgba(255, 255, 245, 1) 0%,
            rgba(255, 225, 140, 0.95) 25%,
            rgba(255, 190, 90, 0.7) 50%,
            rgba(255, 140, 50, 0.4) 75%,
            transparent 100%);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          animation: flameFlicker 0.5s ease-in-out infinite alternate;
        }

        .flame-glow {
          position: absolute;
          bottom: -3px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
          background: radial-gradient(circle,
            rgba(255, 200, 100, 0.15) 0%,
            rgba(255, 160, 60, 0.08) 40%,
            transparent 70%);
        }

        @keyframes flameFlicker {
          0% { transform: scaleY(1) scaleX(1) rotate(-1deg); opacity: 0.95; }
          100% { transform: scaleY(1.08) scaleX(0.94) rotate(1deg); opacity: 1; }
        }

        .candle-holder {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 18px;
          height: 5px;
          background: linear-gradient(180deg, rgba(60, 55, 48, 1) 0%, rgba(42, 38, 32, 1) 100%);
          border-radius: 2px 2px 3px 3px;
        }

        /* ============ MEDITATION MAT ============ */
        .meditation-mat {
          position: absolute;
          bottom: 6%;
          left: 50%;
          transform: translateX(-50%);
          width: 180px;
          height: 50px;
          background: linear-gradient(90deg,
            rgba(70, 60, 90, 0.35) 0%,
            rgba(90, 80, 110, 0.45) 50%,
            rgba(70, 60, 90, 0.35) 100%);
          border-radius: 100px;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
        }

        .mat-pattern {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 75%;
          height: 55%;
          border: 1px solid rgba(139, 119, 183, 0.2);
          border-radius: 50px;
        }

        /* ============ SINGING BOWL ============ */
        .singing-bowl {
          position: absolute;
          bottom: 8%;
          left: 50%;
          transform: translateX(-50%) translateX(120px);
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .singing-bowl:hover {
          transform: translateX(-50%) translateX(120px) scale(1.05);
        }

        .bowl-body {
          width: 40px;
          height: 22px;
          background: linear-gradient(180deg, 
            rgba(180, 160, 100, 0.9) 0%, 
            rgba(140, 120, 70, 1) 50%,
            rgba(100, 85, 50, 1) 100%);
          border-radius: 0 0 50% 50%;
          box-shadow: 
            0 5px 15px rgba(0, 0, 0, 0.3),
            inset 0 5px 15px rgba(255, 255, 200, 0.1);
        }

        .bowl-rim {
          position: absolute;
          top: -3px;
          left: -2px;
          right: -2px;
          height: 6px;
          background: linear-gradient(180deg, 
            rgba(200, 180, 120, 1) 0%, 
            rgba(160, 140, 80, 1) 100%);
          border-radius: 50%;
        }

        .bowl-mallet {
          position: absolute;
          top: -8px;
          right: -12px;
          width: 8px;
          height: 35px;
          background: linear-gradient(90deg, 
            rgba(120, 80, 50, 1) 0%, 
            rgba(90, 60, 35, 1) 100%);
          border-radius: 3px;
          transform: rotate(25deg);
        }

        /* ============ BACK BUTTON ============ */
        .back-button {
          position: fixed;
          top: calc(env(safe-area-inset-top, 0px) + 16px);
          left: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85rem;
          cursor: pointer;
          z-index: 100;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          font-family: inherit;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(-2px);
        }

        /* ============ CONTENT ============ */
        .content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 20px;
          padding-bottom: 220px;
          opacity: ${isLoaded ? 1 : 0};
          transform: translateY(${isLoaded ? '0' : '20px'});
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        /* ============ ORB ============ */
        .orb-container {
          position: relative;
          margin-bottom: 20px;
        }

        .zen-orb {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%,
            rgba(200, 180, 240, 0.4) 0%,
            rgba(150, 130, 200, 0.25) 40%,
            rgba(120, 100, 180, 0.15) 70%,
            rgba(100, 80, 160, 0.06) 100%);
          box-shadow: 
            0 0 50px rgba(139, 119, 183, 0.3),
            0 0 100px rgba(139, 119, 183, 0.12),
            inset 0 0 40px rgba(139, 119, 183, 0.1);
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .orb-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 55%;
          height: 55%;
          border-radius: 50%;
          background: radial-gradient(circle at 40% 40%,
            rgba(220, 200, 255, 0.35) 0%,
            rgba(180, 160, 220, 0.15) 50%,
            transparent 70%);
        }

        .orb-ring {
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          border: 1.5px solid rgba(139, 119, 183, 0.18);
          animation: orbRingPulse 6s ease-in-out infinite;
        }

        .orb-ring-2 { inset: -25px; border-color: rgba(139, 119, 183, 0.1); animation-delay: -3s; }

        @keyframes orbRingPulse {
          0%, 100% { transform: scale(0.96); opacity: 0.5; }
          50% { transform: scale(1.04); opacity: 0.2; }
        }

        /* ============ PRACTICE SELECTION ============ */
        .title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.7rem;
          font-weight: 300;
          color: #ffffff;
          margin-bottom: 6px;
          letter-spacing: 0.02em;
        }

        .subtitle {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.45);
          margin-bottom: 28px;
        }

        .practice-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
          max-width: 340px;
        }

        .practice-card {
          padding: 18px 14px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          font-family: inherit;
        }

        .practice-card:hover {
          background: rgba(139, 119, 183, 0.12);
          border-color: rgba(139, 119, 183, 0.35);
          transform: translateY(-2px);
        }

        .practice-icon {
          font-size: 1.8rem;
          margin-bottom: 8px;
          opacity: 0.8;
        }

        .practice-name {
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 4px;
          color: #fff;
        }

        .practice-desc {
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.4);
        }

        /* ============ PRACTICE OPTIONS ============ */
        .options-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .pattern-options, .duration-options {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
        }

        .option-btn {
          padding: 10px 18px;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: transparent;
          color: rgba(255, 255, 255, 0.55);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .option-btn:hover {
          border-color: rgba(139, 119, 183, 0.4);
          color: rgba(255, 255, 255, 0.85);
        }

        .option-btn.selected {
          background: rgba(139, 92, 246, 0.22);
          border-color: rgba(139, 92, 246, 0.45);
          color: #fff;
        }

        .start-btn {
          padding: 16px 50px;
          border-radius: 50px;
          border: none;
          background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
          color: #fff;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 5px 30px rgba(139, 92, 246, 0.35);
          font-family: inherit;
          margin-top: 8px;
        }

        .start-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 40px rgba(139, 92, 246, 0.45);
        }

        .back-link {
          color: rgba(255, 255, 255, 0.35);
          font-size: 0.8rem;
          cursor: pointer;
          margin-top: 12px;
          transition: color 0.3s ease;
          background: none;
          border: none;
          font-family: inherit;
        }

        .back-link:hover {
          color: rgba(255, 255, 255, 0.6);
        }

        /* ============ ACTIVE STATE ============ */
        .timer {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.3);
          margin-bottom: 6px;
          letter-spacing: 0.1em;
        }

        .phase-text {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.8rem;
          font-weight: 300;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .phase-subtext {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.45);
          margin-bottom: 12px;
        }

        .countdown {
          font-size: 3.5rem;
          font-weight: 200;
          color: rgba(255, 255, 255, 0.35);
          margin-bottom: 16px;
          font-variant-numeric: tabular-nums;
        }

        .cycle-counter {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.22);
          margin-bottom: 28px;
          letter-spacing: 0.05em;
        }

        .progress-dots {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }

        .progress-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          transition: all 0.3s ease;
        }

        .progress-dot.active {
          background: rgba(139, 119, 183, 0.7);
          box-shadow: 0 0 10px rgba(139, 119, 183, 0.5);
        }

        .progress-dot.complete {
          background: rgba(139, 119, 183, 0.4);
        }

        .end-btn {
          padding: 12px 28px;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: transparent;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .end-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.25);
        }

        /* ============ COMPLETE STATE ============ */
        .complete-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          color: #ffffff;
          font-size: 2rem;
          font-weight: 300;
          margin-bottom: 10px;
        }

        .complete-message {
          color: rgba(255, 255, 255, 0.45);
          font-size: 0.95rem;
          margin-bottom: 32px;
        }

        .complete-btn {
          padding: 15px 40px;
          border-radius: 50px;
          border: none;
          background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
          color: #fff;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 25px rgba(139, 92, 246, 0.3);
          font-family: inherit;
        }

        .complete-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 35px rgba(139, 92, 246, 0.4);
        }

        /* ============ RESPONSIVE ============ */
        @media (max-width: 480px) {
          .zen-room { padding-top: 8vh; }
          .content { padding-bottom: 180px; }
          .zen-orb { width: 120px; height: 120px; }
          .orb-ring { inset: -10px; }
          .orb-ring-2 { inset: -20px; }
          .title { font-size: 1.4rem; }
          .practice-grid { max-width: 280px; gap: 10px; }
          .practice-card { padding: 14px 10px; }
          .practice-icon { font-size: 1.5rem; }
          .candles-container { gap: 35px; }
          .candle-tall { height: 38px; }
          .candle-medium { height: 28px; margin-top: 10px; }
          .candle-short { height: 22px; margin-top: 16px; }
          .moon { width: 40px; height: 40px; top: 5%; right: 6%; }
          .zen-stones { left: 6%; bottom: 8%; }
          .stone-1 { width: 35px; height: 28px; }
          .stone-2 { width: 28px; height: 22px; bottom: 24px; }
          .stone-3 { width: 20px; height: 16px; bottom: 42px; }
          .incense-holder { right: 6%; bottom: 8%; }
          .singing-bowl { display: none; }
          .phase-text { font-size: 1.4rem; }
          .countdown { font-size: 2.5rem; }
          .meditation-mat { width: 140px; height: 40px; bottom: 5%; }
        }
      `}</style>

      <div className="zen-room">
        {/* Ambient layers */}
        <div className="ambient-layer stars-layer" />
        <div className="ambient-layer nebula-glow" />

        {/* Stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}

        {/* Moon */}
        <div className="moon">
          <div className="moon-crater crater-1" />
          <div className="moon-crater crater-2" />
          <div className="moon-crater crater-3" />
        </div>

        {/* Mountains */}
        <div className="mountains">
          <div className="mountain mountain-1" />
          <div className="mountain mountain-2" />
          <div className="mountain mountain-3" />
          <div className="mountain mountain-4" />
        </div>

        {/* Ground */}
        <div className="ground" />

        {/* Zen Stones */}
        <div className="zen-stones">
          <div className="stone stone-1" />
          <div className="stone stone-2" />
          <div className="stone stone-3" />
        </div>

        {/* Incense */}
        <div className="incense-holder">
          <div className="smoke-container">
            {smokeParticles.map((p) => (
              <div
                key={p.id}
                className="smoke"
                style={{
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  '--drift': `${p.drift}px`,
                } as React.CSSProperties}
              />
            ))}
          </div>
          <div className="incense-stick">
            <div className="incense-tip" />
          </div>
          <div className="incense-bowl" />
        </div>

        {/* Meditation Mat */}
        <div className="meditation-mat">
          <div className="mat-pattern" />
        </div>

        {/* Candles */}
        <div className="candles-container">
          <div className="candle-group">
            <div className="candle candle-medium">
              <div className="wick" />
              <div className="flame-container">
                <div className="flame-glow" />
                <div className="flame" />
              </div>
            </div>
            <div className="candle-holder" />
          </div>

          <div className="candle-group">
            <div className="candle candle-tall">
              <div className="wick" />
              <div className="flame-container">
                <div className="flame-glow" />
                <div className="flame" />
              </div>
            </div>
            <div className="candle-holder" />
          </div>

          <div className="candle-group">
            <div className="candle candle-short">
              <div className="wick" />
              <div className="flame-container">
                <div className="flame-glow" />
                <div className="flame" />
              </div>
            </div>
            <div className="candle-holder" />
          </div>
        </div>

        {/* Singing Bowl */}
        <div className="singing-bowl">
          <div className="bowl-rim" />
          <div className="bowl-body" />
          <div className="bowl-mallet" />
        </div>

        {/* Back Button */}
        <button className="back-button" onClick={resetAndGoBack}>
          <span>←</span>
          <span>Back</span>
        </button>

        {/* Content */}
        <div className="content">
          {/* Orb */}
          <div className="orb-container">
            <div className="orb-ring" />
            <div className="orb-ring orb-ring-2" />
            <div 
              className="zen-orb"
              style={getOrbStyle()}
            >
              <div className="orb-inner" />
            </div>
          </div>

          {/* Practice Selection */}
          {mode === 'select' && (
            <>
              <h1 className="title">Zen Garden</h1>
              <p className="subtitle">Choose your practice</p>

              <div className="practice-grid">
                {practices.map((p) => (
                  <button
                    key={p.id}
                    className="practice-card"
                    onClick={() => selectPractice(p.id)}
                  >
                    <div className="practice-icon">{p.icon}</div>
                    <div className="practice-name">{p.name}</div>
                    <div className="practice-desc">{p.description}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Practice Options */}
          {mode === 'practice-select' && (
            <>
              <h1 className="title">
                {practices.find(p => p.id === selectedPractice)?.name}
              </h1>
              <p className="subtitle">
                {practices.find(p => p.id === selectedPractice)?.description}
              </p>

              <div className="options-container">
                {/* Breathing patterns */}
                {selectedPractice === 'breathe' && (
                  <div className="pattern-options">
                    {Object.entries(BREATHING_PATTERNS).map(([key, p]) => (
                      <button
                        key={key}
                        className={`option-btn ${selectedPattern === key ? 'selected' : ''}`}
                        onClick={() => setSelectedPattern(key)}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Duration selection for breathe and shake */}
                {(selectedPractice === 'breathe' || selectedPractice === 'shake') && (
                  <div className="duration-options">
                    {(selectedPractice === 'shake' ? SHAKE_DURATIONS : DURATIONS).map((d) => (
                      <button
                        key={d.seconds}
                        className={`option-btn ${selectedDuration === d.seconds ? 'selected' : ''}`}
                        onClick={() => setSelectedDuration(d.seconds)}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Info for orient and ground */}
                {selectedPractice === 'orient' && (
                  <p className="subtitle" style={{ marginBottom: 0 }}>
                    ~1 minute guided practice
                  </p>
                )}

                {selectedPractice === 'ground' && (
                  <p className="subtitle" style={{ marginBottom: 0 }}>
                    5-4-3-2-1 sensory grounding
                  </p>
                )}

                <button className="start-btn" onClick={startPractice}>
                  Begin
                </button>

                <button className="back-link" onClick={() => setMode('select')}>
                  ← Choose different practice
                </button>
              </div>
            </>
          )}

          {/* Active Breathing */}
          {mode === 'active' && selectedPractice === 'breathe' && currentPhase && (
            <>
              <div className="timer">{formatTime(timeRemaining)}</div>
              <div className="phase-text">{currentPhase.name}</div>
              <div className="countdown">
                {Math.ceil(currentPhase.duration * (1 - phaseProgress))}
              </div>
              <div className="cycle-counter">Cycle {cycleCount + 1}</div>
              <button className="end-btn" onClick={stopPractice}>End Session</button>
            </>
          )}

          {/* Active Orient */}
          {mode === 'active' && selectedPractice === 'orient' && (
            <>
              <div className="phase-text">{ORIENT_PROMPTS[orientIndex]?.instruction}</div>
              <div className="progress-dots">
                {ORIENT_PROMPTS.map((_, i) => (
                  <div 
                    key={i} 
                    className={`progress-dot ${i === orientIndex ? 'active' : i < orientIndex ? 'complete' : ''}`} 
                  />
                ))}
              </div>
              <button className="end-btn" onClick={stopPractice}>End Session</button>
            </>
          )}

          {/* Active Shake */}
          {mode === 'active' && selectedPractice === 'shake' && (
            <>
              <div className="timer">{formatTime(timeRemaining)}</div>
              <div className="phase-text">{SHAKE_PHASES[shakePhaseIndex]?.instruction}</div>
              <div className="phase-subtext">{SHAKE_PHASES[shakePhaseIndex]?.subtext}</div>
              <div className="progress-dots">
                {SHAKE_PHASES.map((_, i) => (
                  <div 
                    key={i} 
                    className={`progress-dot ${i === shakePhaseIndex ? 'active' : i < shakePhaseIndex ? 'complete' : ''}`} 
                  />
                ))}
              </div>
              <button className="end-btn" onClick={stopPractice}>End Session</button>
            </>
          )}

          {/* Active Ground */}
          {mode === 'active' && selectedPractice === 'ground' && (
            <>
              <div className="phase-text" style={{ fontSize: '1rem', opacity: 0.5, marginBottom: '8px' }}>
                {GROUND_STEPS[groundStepIndex]?.sense}
              </div>
              <div className="phase-text">{GROUND_STEPS[groundStepIndex]?.instruction}</div>
              {GROUND_STEPS[groundStepIndex]?.count > 0 && (
                <div className="countdown" style={{ fontSize: '2.5rem' }}>
                  {GROUND_STEPS[groundStepIndex]?.count}
                </div>
              )}
              <div className="progress-dots">
                {GROUND_STEPS.map((_, i) => (
                  <div 
                    key={i} 
                    className={`progress-dot ${i === groundStepIndex ? 'active' : i < groundStepIndex ? 'complete' : ''}`} 
                  />
                ))}
              </div>
              <button className="end-btn" onClick={stopPractice}>End Session</button>
            </>
          )}

          {/* Complete */}
          {mode === 'complete' && (
            <>
              <h1 className="complete-title">Beautiful</h1>
              <p className="complete-message">{getCompletionMessage()}</p>
              <button className="complete-btn" onClick={resetAndGoBack}>
                Return to Sanctuary
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}