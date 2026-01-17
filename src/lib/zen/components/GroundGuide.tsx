import type { GroundStep } from '../types';
import { GROUND_STEPS as DEFAULT_STEPS } from '../data/practices';

type ZenColors = {
  text: string;
  textMuted: string;
  textDim: string;
  cardBorder: string;
  accent: string;
};

export type GroundGuideProps = {
  colors: ZenColors;
  groundStepIndex: number;
  onEnd: () => void;
  steps?: GroundStep[];
};

export function GroundGuide({ colors, groundStepIndex, onEnd, steps = DEFAULT_STEPS }: GroundGuideProps) {
  const current = steps[groundStepIndex];

  return (
    <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
      <div
        style={{
          fontSize: 12,
          color: colors.textDim,
          marginBottom: 8,
          letterSpacing: '0.15em',
        }}
      >
        {current?.sense}
      </div>

      <div
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 22,
          fontWeight: 300,
          color: colors.text,
          marginBottom: 12,
          maxWidth: 260,
        }}
      >
        {current?.instruction}
      </div>

      {current?.count > 0 && (
        <div
          style={{
            fontSize: 48,
            fontWeight: 200,
            color: colors.textDim,
            marginBottom: 16,
          }}
        >
          {current.count}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
          marginBottom: 28,
        }}
      >
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background:
                i === groundStepIndex
                  ? colors.accent
                  : i < groundStepIndex
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
