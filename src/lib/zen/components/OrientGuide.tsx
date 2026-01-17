import type { OrientPrompt } from '../types';
import { ORIENT_PROMPTS as DEFAULT_PROMPTS } from '../data/practices';

type ZenColors = {
  text: string;
  textMuted: string;
  textDim: string;
  cardBorder: string;
  accent: string;
};

export type OrientGuideProps = {
  colors: ZenColors;
  orientIndex: number;
  onEnd: () => void;
  prompts?: OrientPrompt[];
};

export function OrientGuide({ colors, orientIndex, onEnd, prompts = DEFAULT_PROMPTS }: OrientGuideProps) {
  const current = prompts[orientIndex];

  return (
    <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
      <div
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 24,
          fontWeight: 300,
          color: colors.text,
          marginBottom: 24,
          maxWidth: 280,
        }}
      >
        {current?.instruction}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 6,
          justifyContent: 'center',
          marginBottom: 28,
        }}
      >
        {prompts.map((_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background:
                i === orientIndex
                  ? colors.accent
                  : i < orientIndex
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
