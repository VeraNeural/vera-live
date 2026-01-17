import type { Practice, PracticeId } from '../types';
import { PRACTICES as DEFAULT_PRACTICES } from '../data/practices';

type ZenColors = {
  text: string;
  textMuted: string;
  textDim: string;
  cardBg: string;
  cardBorder: string;
};

export type PracticePickerProps = {
  practices?: Practice[];
  colors: ZenColors;
  onSelect: (practiceId: PracticeId) => void;
};

export function PracticePicker({ practices = DEFAULT_PRACTICES, colors, onSelect }: PracticePickerProps) {
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
          fontSize: 28,
          fontWeight: 300,
          color: colors.text,
          marginBottom: 8,
        }}
      >
        Zen Garden
      </h1>
      <p
        style={{
          fontSize: 14,
          color: colors.textMuted,
          marginBottom: 28,
        }}
      >
        Choose your practice
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          maxWidth: 320,
        }}
      >
        {practices.map((practice) => (
          <button
            key={practice.id}
            className="practice-card"
            onClick={() => onSelect(practice.id)}
            style={{
              padding: '20px 16px',
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 16,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 24,
                marginBottom: 10,
                color: colors.textMuted,
              }}
            >
              {practice.icon}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: colors.text,
                marginBottom: 4,
              }}
            >
              {practice.name}
            </div>
            <div
              style={{
                fontSize: 12,
                color: colors.textDim,
              }}
            >
              {practice.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
