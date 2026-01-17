import type { PracticeId } from '../types';
import { BREATHING_PATTERNS, DURATION_PRESETS, PRACTICES } from '../data/practices';

type ZenColors = {
  text: string;
  textMuted: string;
  textDim: string;
  cardBorder: string;
  accent: string;
  accentGlow: string;
};

export type PracticeOptionsProps = {
  practiceId: PracticeId;
  colors: ZenColors;

  selectedPatternId: string;
  onPatternChange: (patternId: string) => void;

  selectedDurationSeconds: number;
  onDurationChange: (seconds: number) => void;

  onBegin: () => void;
  onBackToPicker: () => void;
};

export function PracticeOptions({
  practiceId,
  colors,
  selectedPatternId,
  onPatternChange,
  selectedDurationSeconds,
  onDurationChange,
  onBegin,
  onBackToPicker,
}: PracticeOptionsProps) {
  const practice = PRACTICES.find((p) => p.id === practiceId);

  return (
    <div
      style={{
        textAlign: 'center',
        animation: 'fadeIn 0.5s ease-out',
      }}
    >
      <h1
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 26,
          fontWeight: 300,
          color: colors.text,
          marginBottom: 6,
        }}
      >
        {practice?.name}
      </h1>
      <p
        style={{
          fontSize: 14,
          color: colors.textMuted,
          marginBottom: 24,
        }}
      >
        {practice?.description}
      </p>

      {practiceId === 'breathe' && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          {BREATHING_PATTERNS.map((pattern) => (
            <button
              key={pattern.id}
              className="option-btn"
              onClick={() => onPatternChange(pattern.id)}
              style={{
                padding: '10px 18px',
                borderRadius: 50,
                border: `1px solid ${selectedPatternId === pattern.id ? colors.accent : colors.cardBorder}`,
                background: selectedPatternId === pattern.id ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                color: selectedPatternId === pattern.id ? colors.text : colors.textMuted,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              {pattern.name}
            </button>
          ))}
        </div>
      )}

      {(practiceId === 'breathe' || practiceId === 'shake') && (
        <div
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          {DURATION_PRESETS[practiceId].map((duration) => (
            <button
              key={duration.seconds}
              className="option-btn"
              onClick={() => onDurationChange(duration.seconds)}
              style={{
                padding: '10px 20px',
                borderRadius: 50,
                border: `1px solid ${selectedDurationSeconds === duration.seconds ? colors.accent : colors.cardBorder}`,
                background: selectedDurationSeconds === duration.seconds ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                color: selectedDurationSeconds === duration.seconds ? colors.text : colors.textMuted,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              {duration.label}
            </button>
          ))}
        </div>
      )}

      {practiceId === 'orient' && (
        <p style={{ fontSize: 13, color: colors.textDim, marginBottom: 24 }}>
          ~1 minute guided practice
        </p>
      )}

      {practiceId === 'ground' && (
        <p style={{ fontSize: 13, color: colors.textDim, marginBottom: 24 }}>
          5-4-3-2-1 sensory grounding
        </p>
      )}

      <button
        onClick={onBegin}
        style={{
          padding: '16px 48px',
          borderRadius: 50,
          border: 'none',
          background: `linear-gradient(135deg, ${colors.accent} 0%, #6366f1 100%)`,
          color: '#fff',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: `0 4px 24px ${colors.accentGlow}`,
          marginBottom: 16,
        }}
      >
        Begin
      </button>

      <button
        onClick={onBackToPicker}
        style={{
          background: 'none',
          border: 'none',
          color: colors.textDim,
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        ← Choose different practice
      </button>
    </div>
  );
}
