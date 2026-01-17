import type { PhaseState } from '../types';
import { BREATHING_PATTERNS } from '../data/practices';

type ZenColors = {
  text: string;
  textMuted: string;
  textDim: string;
  cardBorder: string;
};

export type BreathingGuideProps = {
  colors: ZenColors;
  patternId: string;
  phaseState: PhaseState;
  cycleCount: number;
  onEnd: () => void;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function BreathingGuide({ colors, patternId, phaseState, cycleCount, onEnd }: BreathingGuideProps) {
  const pattern = BREATHING_PATTERNS.find((p) => p.id === patternId);
  const phase = pattern?.phases[phaseState.currentPhaseIndex];
  const phaseCountdown = phase ? Math.ceil(phase.duration * (1 - phaseState.phaseProgress)) : 0;

  if (!pattern || !phase) return null;

  return (
    <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
      <div
        style={{
          fontSize: 14,
          color: colors.textDim,
          marginBottom: 8,
          letterSpacing: '0.1em',
        }}
      >
        {formatTime(phaseState.timeRemaining)}
      </div>

      <div
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 28,
          fontWeight: 300,
          color: colors.text,
          marginBottom: 8,
        }}
      >
        {phase.name}
      </div>

      <div
        style={{
          fontSize: 56,
          fontWeight: 200,
          color: colors.textDim,
          marginBottom: 8,
        }}
      >
        {phaseCountdown}
      </div>

      <div
        style={{
          fontSize: 12,
          color: colors.textDim,
          marginBottom: 28,
        }}
      >
        Cycle {cycleCount + 1}
      </div>

      <button
        onClick={onEnd}
        style={{
          padding: '12px 28px',
          borderRadius: 50,
          border: `1px solid ${colors.cardBorder}`,
          background: 'transparent',
          color: colors.textMuted,
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        End Session
      </button>
    </div>
  );
}
