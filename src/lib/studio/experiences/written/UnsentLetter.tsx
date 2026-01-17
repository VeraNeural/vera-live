'use client';

import { useState } from 'react';

interface UnsentLetterProps {
  onBack: () => void;
  onComplete?: () => void;
  theme?: 'light' | 'dark';
}

export function UnsentLetter({ onBack, onComplete, theme = 'dark' }: UnsentLetterProps) {
  const [recipient, setRecipient] = useState('');
  const [content, setContent] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);

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

  const prompts = [
    "What do you wish they knew?",
    "What hurt?",
    "What do you need to say?",
    "You don't need to be fair. Just be honest.",
  ];

  const handleDone = () => {
    setIsComplete(true);
  };

  const handleRelease = () => {
    setIsReleasing(true);
    setTimeout(() => {
      setContent('');
      setRecipient('');
      onComplete?.();
      onBack();
    }, 1500);
  };

  const handleSave = () => {
    // TODO: Save to journal/storage
    console.log('Saving unsent letter:', { recipient, content });
    onComplete?.();
    onBack();
  };

  // Release animation screen
  if (isReleasing) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: colors.bgGradient,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}>
        <div style={{
          textAlign: 'center',
          animation: 'fadeOut 1.5s ease forwards',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: colors.accentGlow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.5">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </div>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '24px',
            color: colors.text,
          }}>
            Sealed & Released
          </p>
        </div>
        <style>{`
          @keyframes fadeOut {
            0% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
          }
        `}</style>
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
              Letter Complete
            </h2>
            <p style={{
              color: colors.textMuted,
              fontSize: '16px',
            }}>
              To: {recipient || 'Unnamed'}
            </p>
            <p style={{
              color: colors.textDim,
              fontSize: '14px',
              marginTop: '4px',
            }}>
              {wordCount} words written
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
              Save Privately
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
              Seal & Release
            </button>
            <button
              onClick={() => setIsComplete(false)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '12px',
                color: colors.textDim,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Keep writing
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
          letterSpacing: '0.05em',
        }}>
          UNSENT LETTER
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

      {/* To field */}
      <div style={{
        padding: '20px 24px 0',
      }}>
        <label style={{
          display: 'block',
          color: colors.textDim,
          fontSize: '13px',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          To
        </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="A person, feeling, or situation..."
          style={{
            width: '100%',
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '12px',
            padding: '14px 16px',
            color: colors.text,
            fontSize: '16px',
            outline: 'none',
            fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
          }}
        />
      </div>

      {/* Textarea */}
      <div style={{
        flex: 1,
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Say what you need to say..."
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

      {/* Prompts */}
      <div style={{
        padding: '0 24px 16px',
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          {prompts.map((prompt, i) => (
            <span
              key={i}
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '20px',
                padding: '8px 14px',
                color: colors.textDim,
                fontSize: '13px',
                fontStyle: 'italic',
              }}
            >
              {prompt}
            </span>
          ))}
        </div>
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
          color: colors.textDim,
          fontSize: '13px',
          fontStyle: 'italic',
        }}>
          This is private. Be honest.
        </span>
      </div>
    </div>
  );
}

export default UnsentLetter;