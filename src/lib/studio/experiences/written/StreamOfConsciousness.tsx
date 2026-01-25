'use client';

import { useState, useEffect, useRef } from 'react';

interface StreamOfConsciousnessProps {
  onBack: () => void;
  onComplete?: () => void;
  theme?: 'light' | 'dark';
}

export function StreamOfConsciousness({ onBack, onComplete, theme = 'dark' }: StreamOfConsciousnessProps) {
  const [content, setContent] = useState('');
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [pauseWarning, setPauseWarning] = useState(false);
  const lastTypeTime = useRef<number>(Date.now());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const timeOptions = [
    { label: '3 min', value: 3 * 60 },
    { label: '5 min', value: 5 * 60 },
    { label: '10 min', value: 10 * 60 },
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
    warning: '#f59e0b',
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
    warning: '#d97706',
  };

  // Timer countdown
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

  // Pause detection
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const timeSinceType = Date.now() - lastTypeTime.current;
      if (timeSinceType > 5000 && content.length > 0) {
        setPauseWarning(true);
      } else {
        setPauseWarning(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, content]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '∞';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = (time: number) => {
    setSelectedTime(time);
    setTimeRemaining(time);
    setIsActive(true);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    lastTypeTime.current = Date.now();
    setPauseWarning(false);
  };

  const handleFinish = () => {
    setIsActive(false);
    setIsComplete(true);
  };

  const handleRelease = () => {
    setContent('');
    onComplete?.();
    onBack();
  };

  const handleSave = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[StreamOfConsciousness] Saving entry (content redacted for privacy)');
    }
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
        <div style={{
          padding: '16px 20px',
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
        </div>

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
              Stream of Consciousness
            </h1>
            <p style={{
              color: colors.textMuted,
              fontSize: '16px',
              maxWidth: '320px',
              lineHeight: 1.6,
            }}>
              Write without stopping. Don't think, don't edit. Just let it flow.
            </p>
          </div>

          <div style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '16px',
            padding: '20px',
            maxWidth: '300px',
          }}>
            <p style={{
              color: colors.textDim,
              fontSize: '14px',
              lineHeight: 1.6,
            }}>
              The screen will gently blur previous lines so you can't go back. If you pause too long, you'll get a nudge to keep going.
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
            }}>
              Choose your duration
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
              Stream Complete
            </h2>
            <p style={{
              color: colors.textMuted,
              fontSize: '16px',
            }}>
              {wordCount} words flowed through you
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
              Review & Save
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
              Release Without Reading
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
        <span style={{
          color: colors.textMuted,
          fontSize: '14px',
        }}>
          {wordCount} words
        </span>
        
        <span style={{
          color: colors.text,
          fontSize: '20px',
          fontWeight: 500,
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}>
          {formatTime(timeRemaining)}
        </span>

        <button
          onClick={handleFinish}
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
          Finish
        </button>
      </div>

      {/* Pause warning */}
      {pauseWarning && (
        <div style={{
          padding: '12px 24px',
          background: `${colors.warning}15`,
          borderBottom: `1px solid ${colors.warning}30`,
          textAlign: 'center',
        }}>
          <p style={{
            color: colors.warning,
            fontSize: '14px',
          }}>
            Keep going... don't stop now ✨
          </p>
        </div>
      )}

      {/* Textarea with blur effect */}
      <div style={{
        flex: 1,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>
        {/* Gradient overlay for blur effect */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          height: '100px',
          background: `linear-gradient(to bottom, ${colors.bg}ee 0%, transparent 100%)`,
          pointerEvents: 'none',
          zIndex: 1,
          borderRadius: '16px 16px 0 0',
        }} />
        
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing and don't stop..."
          autoFocus
          style={{
            flex: 1,
            width: '100%',
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '16px',
            padding: '80px 20px 20px',
            color: colors.text,
            fontSize: '17px',
            lineHeight: 1.8,
            resize: 'none',
            outline: 'none',
            fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
          }}
        />
      </div>

      {/* Footer prompt */}
      <div style={{
        padding: '16px 24px',
        textAlign: 'center',
        borderTop: `1px solid ${colors.cardBorder}`,
      }}>
        <p style={{
          color: colors.textDim,
          fontSize: '14px',
          fontStyle: 'italic',
        }}>
          Don't think. Don't edit. Just write.
        </p>
      </div>
    </div>
  );
}

export default StreamOfConsciousness;