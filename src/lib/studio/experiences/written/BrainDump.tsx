'use client';

import { useState, useEffect } from 'react';

interface BrainDumpProps {
  onBack: () => void;
  onComplete?: () => void;
  theme?: 'light' | 'dark';
}

export function BrainDump({ onBack, onComplete, theme = 'dark' }: BrainDumpProps) {
  const [content, setContent] = useState('');
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const timeOptions = [
    { label: '5 min', value: 5 * 60 },
    { label: '10 min', value: 10 * 60 },
    { label: '15 min', value: 15 * 60 },
    { label: '∞', value: null },
  ];

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const colors = theme === 'dark' ? {
    bg: '#0f0d15',
    bgGradient: 'linear-gradient(to bottom, #0f0d15 0%, #1a1625 100%)',
    text: '#e8e6f0',
    textMuted: 'rgba(232, 230, 240, 0.6)',
    textDim: 'rgba(232, 230, 240, 0.4)',
    cardBg: 'rgba(255, 255, 255, 0.03)',
    cardBorder: 'rgba(255, 255, 255, 0.06)',
    accent: '#a855f7',
    accentGlow: 'rgba(168, 85, 247, 0.15)',
  } : {
    bg: '#faf9fc',
    bgGradient: 'linear-gradient(to bottom, #faf9fc 0%, #f3f1f8 100%)',
    text: '#1a1625',
    textMuted: 'rgba(26, 22, 37, 0.6)',
    textDim: 'rgba(26, 22, 37, 0.4)',
    cardBg: 'rgba(0, 0, 0, 0.02)',
    cardBorder: 'rgba(0, 0, 0, 0.06)',
    accent: '#9333ea',
    accentGlow: 'rgba(147, 51, 234, 0.1)',
  };

  useEffect(() => {
    if (!isActive || timeRemaining === null) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          setIsActive(false);
          setIsComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '∞';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = (time: number | null) => {
    setSelectedTime(time);
    setTimeRemaining(time);
    setIsActive(true);
  };

  const handleDone = () => {
    setIsActive(false);
    setIsComplete(true);
  };

  const handleRelease = () => {
    setContent('');
    onComplete?.();
    onBack();
  };

  const handleSave = () => {
    // TODO: Save to journal/storage
    console.log('Saving brain dump:', content);
    onComplete?.();
    onBack();
  };

  // Time selection screen
  if (!isActive && !isComplete) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: colors.bgGradient,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <button
            onClick={onBack}
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '12px',
              padding: '10px 16px',
              color: colors.textMuted,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ← Back
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          gap: '32px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '32px',
              fontWeight: 300,
              color: colors.text,
              marginBottom: '12px',
            }}>
              Brain Dump
            </h1>
            <p style={{
              color: colors.textMuted,
              fontSize: '16px',
              maxWidth: '300px',
            }}>
              No judgment. No editing. Just let everything out.
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            maxWidth: '280px',
          }}>
            <p style={{
              color: colors.textDim,
              fontSize: '14px',
              textAlign: 'center',
              marginBottom: '8px',
            }}>
              How long do you need?
            </p>
            {timeOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => handleStart(option.value)}
                style={{
                  background: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: '12px',
                  padding: '16px 24px',
                  color: colors.text,
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Completion screen
  if (isComplete) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: colors.bgGradient,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          gap: '24px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '28px',
              fontWeight: 300,
              color: colors.text,
              marginBottom: '12px',
            }}>
              Well done
            </h2>
            <p style={{
              color: colors.textMuted,
              fontSize: '16px',
            }}>
              {wordCount} words released
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            maxWidth: '280px',
            marginTop: '16px',
          }}>
            <button
              onClick={handleSave}
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '12px',
                padding: '16px 24px',
                color: colors.text,
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Save to Journal
            </button>
            <button
              onClick={handleRelease}
              style={{
                background: `linear-gradient(135deg, ${colors.accent}, #7c3aed)`,
                border: 'none',
                borderRadius: '12px',
                padding: '16px 24px',
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Release & Let Go
            </button>
            <button
              onClick={onBack}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '12px',
                color: colors.textDim,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Writing screen
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: colors.bgGradient,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${colors.cardBorder}`,
      }}>
        <button
          onClick={onBack}
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '12px',
            padding: '10px 16px',
            color: colors.textMuted,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
        
        <span style={{
          color: colors.textMuted,
          fontSize: '14px',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
        }}>
          BRAIN DUMP
        </span>

        <button
          onClick={handleDone}
          style={{
            background: colors.accent,
            border: 'none',
            borderRadius: '12px',
            padding: '10px 20px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Done
        </button>
      </div>

      {/* Prompt */}
      <div style={{
        padding: '20px 24px',
        textAlign: 'center',
      }}>
        <p style={{
          color: colors.textDim,
          fontSize: '15px',
          fontStyle: 'italic',
        }}>
          Just let it flow. No one will see this but you.
        </p>
      </div>

      {/* Textarea */}
      <div style={{
        flex: 1,
        padding: '0 20px 20px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing..."
          autoFocus
          style={{
            flex: 1,
            width: '100%',
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '16px',
            padding: '20px',
            color: colors.text,
            fontSize: '17px',
            lineHeight: 1.7,
            resize: 'none',
            outline: 'none',
            fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
          }}
        />
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: `1px solid ${colors.cardBorder}`,
      }}>
        <span style={{
          color: colors.textDim,
          fontSize: '14px',
        }}>
          {wordCount} words
        </span>
        <span style={{
          color: colors.textMuted,
          fontSize: '14px',
        }}>
          {formatTime(timeRemaining)}
        </span>
      </div>
    </div>
  );
}

export default BrainDump;