'use client';

import { useState } from 'react';

interface BurnListProps {
  onBack: () => void;
  onComplete?: () => void;
  theme?: 'light' | 'dark';
}

interface BurnItem {
  id: string;
  text: string;
  burning: boolean;
  burned: boolean;
}

export function BurnList({ onBack, onComplete, theme = 'dark' }: BurnListProps) {
  const [items, setItems] = useState<BurnItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [isBurning, setIsBurning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

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
    fire: '#f97316',
    fireGlow: 'rgba(249, 115, 22, 0.3)',
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
    fire: '#ea580c',
    fireGlow: 'rgba(234, 88, 12, 0.2)',
  };

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    setItems([...items, {
      id: Date.now().toString(),
      text: newItem.trim(),
      burning: false,
      burned: false,
    }]);
    setNewItem('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleBurn = async () => {
    if (items.length === 0) return;
    setIsBurning(true);

    // Burn items one by one
    for (let i = 0; i < items.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setItems(prev => prev.map((item, index) => 
        index === i ? { ...item, burning: true } : item
      ));
      await new Promise(resolve => setTimeout(resolve, 600));
      setItems(prev => prev.map((item, index) => 
        index === i ? { ...item, burned: true } : item
      ));
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setIsComplete(true);
  };

  // Completion screen
  if (isComplete) {
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
        padding: '24px',
      }}>
        <div style={{
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease',
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
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '28px',
            fontWeight: 300,
            color: colors.text,
            marginBottom: '12px',
          }}>
            Released
          </h2>
          <p style={{
            color: colors.textMuted,
            fontSize: '16px',
            marginBottom: '32px',
          }}>
            You are lighter now.
          </p>
          <button
            onClick={() => {
              onComplete?.();
              onBack();
            }}
            style={{
              background: `linear-gradient(135deg, ${colors.accent}, #7c3aed)`,
              border: 'none',
              borderRadius: '12px',
              padding: '16px 32px',
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Return
          </button>
        </div>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

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
          BURN LIST
        </span>

        <div style={{ width: '70px' }} />
      </div>

      {/* Title */}
      <div style={{
        padding: '32px 24px 24px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '28px',
          fontWeight: 300,
          color: colors.text,
          marginBottom: '8px',
        }}>
          What do you want to let go of?
        </h1>
        <p style={{
          color: colors.textDim,
          fontSize: '15px',
        }}>
          Add each thought, worry, or burden. Then burn them.
        </p>
      </div>

      {/* Add item input */}
      {!isBurning && (
        <div style={{
          padding: '0 24px 16px',
        }}>
          <div style={{
            display: 'flex',
            gap: '12px',
          }}>
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type something to release..."
              style={{
                flex: 1,
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
            <button
              onClick={handleAddItem}
              disabled={!newItem.trim()}
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '12px',
                padding: '14px 20px',
                color: newItem.trim() ? colors.text : colors.textDim,
                fontSize: '14px',
                cursor: newItem.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Items list */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0 24px',
      }}>
        {items.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: colors.textDim,
          }}>
            <p style={{ fontSize: '15px' }}>
              Your list is empty. Add what weighs on you.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  background: item.burning 
                    ? `linear-gradient(135deg, ${colors.fire}40, ${colors.fireGlow})`
                    : colors.cardBg,
                  border: `1px solid ${item.burning ? colors.fire + '60' : colors.cardBorder}`,
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: item.burned ? 0 : 1,
                  transform: item.burning ? 'scale(0.95)' : 'scale(1)',
                  transition: 'all 0.5s ease',
                }}
              >
                <span style={{
                  color: item.burning ? colors.fire : colors.text,
                  fontSize: '16px',
                }}>
                  {item.text}
                </span>
                {!isBurning && (
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: colors.textDim,
                      fontSize: '18px',
                      cursor: 'pointer',
                      padding: '4px 8px',
                    }}
                  >
                    ×
                  </button>
                )}
                {item.burning && !item.burned && (
                  <span style={{ color: colors.fire, fontSize: '20px' }}>
                    🔥
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Burn button */}
      {items.length > 0 && !isBurning && (
        <div style={{
          padding: '24px',
          borderTop: `1px solid ${colors.cardBorder}`,
        }}>
          <button
            onClick={handleBurn}
            style={{
              width: '100%',
              background: `linear-gradient(135deg, ${colors.fire}, #dc2626)`,
              border: 'none',
              borderRadius: '12px',
              padding: '18px 24px',
              color: '#fff',
              fontSize: '17px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span>Burn & Release</span>
            <span style={{ fontSize: '20px' }}>🔥</span>
          </button>
          <p style={{
            textAlign: 'center',
            color: colors.textDim,
            fontSize: '13px',
            marginTop: '12px',
          }}>
            {items.length} {items.length === 1 ? 'item' : 'items'} ready to release
          </p>
        </div>
      )}

      {/* Burning in progress */}
      {isBurning && !isComplete && (
        <div style={{
          padding: '24px',
          borderTop: `1px solid ${colors.cardBorder}`,
          textAlign: 'center',
        }}>
          <p style={{
            color: colors.fire,
            fontSize: '16px',
            fontStyle: 'italic',
          }}>
            Releasing...
          </p>
        </div>
      )}
    </div>
  );
}

export default BurnList;