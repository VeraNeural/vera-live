import type { ShakePhase } from '../types';
import { SHAKE_PHASES as DEFAULT_PHASES } from '../data/practices';

type ZenColors = {
  text: string;
  textMuted: string;
  textDim: string;
  cardBorder: string;
  accent: string;
};

export type ShakeGuideProps = {
  colors: ZenColors;
  timeRemaining: number;
  shakePhaseIndex: number;
  onEnd: () => void;
  phases?: ShakePhase[];
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function ShakeGuide({
  colors,
  timeRemaining,
  shakePhaseIndex,
  onEnd,
  phases = DEFAULT_PHASES,
}: ShakeGuideProps) {
  const current = phases[shakePhaseIndex];

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
        {formatTime(timeRemaining)}
      </div>

      <div
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 24,
          fontWeight: 300,
          color: colors.text,
          marginBottom: 6,
        }}
      >
        {current?.instruction}
      </div>

      <div
        style={{
          fontSize: 14,
          color: colors.textMuted,
          marginBottom: 24,
        }}
      >
        {current?.subtext}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 6,
          justifyContent: 'center',
          marginBottom: 28,
        }}
      >
        {phases.map((_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background:
                i === shakePhaseIndex
                  ? colors.accent
                  : i < shakePhaseIndex
                    ? 'rgba(139, 119, 183, 0.5)'
                    : colors.cardBorder,
              transition: 'background 0.3s ease',
            }}
          />
        ))}
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
