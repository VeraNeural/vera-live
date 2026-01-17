import type { PracticeId } from '../types';
import { PRACTICES } from '../data/practices';

type ZenColors = {
  text: string;
  textMuted: string;
  accent: string;
  accentGlow: string;
};

export type CompletionScreenProps = {
  colors: ZenColors;
  practiceId?: PracticeId;
  message: string;
  onReturn: () => void;
};

export function CompletionScreen({ colors, practiceId, message, onReturn }: CompletionScreenProps) {
  const practiceName = practiceId ? PRACTICES.find((p) => p.id === practiceId)?.name : undefined;

  return (
    <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
      <h1
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 32,
          fontWeight: 300,
          color: colors.text,
          marginBottom: 10,
        }}
      >
        Beautiful
      </h1>

      {practiceName && (
        <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10, letterSpacing: '0.1em' }}>
          {practiceName}
        </div>
      )}

      <p
        style={{
          fontSize: 15,
          color: colors.textMuted,
          marginBottom: 32,
        }}
      >
        {message}
      </p>

      <button
        onClick={onReturn}
        style={{
          padding: '16px 40px',
          borderRadius: 50,
          border: 'none',
          background: `linear-gradient(135deg, ${colors.accent} 0%, #6366f1 100%)`,
          color: '#fff',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: `0 4px 24px ${colors.accentGlow}`,
        }}
      >
        Return to Sanctuary
      </button>
    </div>
  );
}
