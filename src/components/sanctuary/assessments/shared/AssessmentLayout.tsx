import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface AssessmentLayoutProps {
  children: React.ReactNode;
  progress: number;
  onBack: () => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

const AssessmentLayout: React.FC<AssessmentLayoutProps> = ({
  children,
  progress,
  onBack,
  onNext,
  onPrev,
  isFirstQuestion,
  isLastQuestion,
}) => {
  const { isDark, colors } = useTheme();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: colors.bg,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '16px',
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          onClick={onBack}
          style={{
            padding: '8px 14px',
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: 50,
            cursor: 'pointer',
            fontSize: 13,
            color: colors.textMuted,
          }}
        >
          ✕
        </button>
        <span style={{ fontSize: 13, color: colors.textMuted }}>{progress}%</span>
        <div style={{ width: 50 }} />
      </header>

      {/* Progress Bar */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <div
          style={{
            height: 4,
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: colors.accent,
              borderRadius: 4,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 24px' }}>{children}</div>

      {/* Navigation Buttons */}
      <footer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '16px 24px',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        }}
      >
        <button
          onClick={onPrev}
          disabled={isFirstQuestion}
          style={{
            padding: '12px 24px',
            background: isFirstQuestion ? colors.cardBorder : colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: 50,
            cursor: isFirstQuestion ? 'not-allowed' : 'pointer',
            fontSize: 14,
            color: isFirstQuestion ? colors.textMuted : colors.text,
          }}
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={isLastQuestion}
          style={{
            padding: '12px 24px',
            background: isLastQuestion
              ? colors.cardBorder
              : `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accent}dd 100%)`,
            border: 'none',
            borderRadius: 50,
            color: isLastQuestion ? colors.textMuted : '#fff',
            fontSize: 14,
            fontWeight: 500,
            cursor: isLastQuestion ? 'not-allowed' : 'pointer',
            boxShadow: isLastQuestion ? 'none' : `0 4px 20px ${colors.accent}44`,
          }}
        >
          Next
        </button>
      </footer>
    </div>
  );
};

export default AssessmentLayout;