'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeToggle } from '@/contexts/ThemeContext';

// ============================================================================
// TYPES
// ============================================================================
interface RecalibrationRoomProps {
  onBack: () => void;
  onSendMessage: (message: string) => void;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  isGenerating?: boolean;
  userName?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const STARTER_PROMPTS = [
  "I've been feeling anxious lately",
  "I need someone to talk to",
  "Help me process my feelings",
  "I'm feeling overwhelmed",
];


// ============================================================================
// STYLES - iOS Compatible
// ============================================================================
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }
  
  html, body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Simple animations - iOS compatible */
  @keyframes breathe {
    0%, 100% { 
      transform: scale(1); 
      opacity: 0.9; 
    }
    50% { 
      transform: scale(1.06); 
      opacity: 1; 
    }
  }

  @keyframes fadeIn {
    from { 
      opacity: 0; 
      transform: translateY(8px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }

  /* Scrollbar - subtle */
  .messages-scroll::-webkit-scrollbar {
    width: 3px;
  }
  .messages-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .messages-scroll::-webkit-scrollbar-thumb {
    background: rgba(150, 130, 110, 0.2);
    border-radius: 3px;
  }

  /* Input placeholder - handled via inline style */
  .chat-input::placeholder {
    color: rgba(120, 105, 90, 0.45);
  }
  
  .chat-input-dark::placeholder {
    color: rgba(255, 240, 230, 0.35);
  }

  /* Prompt buttons */
  .prompt-btn {
    transition: transform 0.2s ease, background-color 0.2s ease;
  }
  .prompt-btn:active {
    transform: scale(0.96);
  }
`;

// ============================================================================
// COMPONENT
// ============================================================================
export default function RecalibrationRoom({ 
  onBack, 
  onSendMessage, 
  messages, 
  isGenerating = false,
  userName = 'You'
}: RecalibrationRoomProps) {
  const { isDark, colors } = useTheme();

  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isGenerating) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const room = {
    inputBg: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.92)',
    inputBorderFocused: isDark ? 'rgba(200, 170, 140, 0.3)' : 'rgba(180, 150, 120, 0.4)',
    veraShadow: isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)',
    userBubbleStart: '#8b5cf6',
    userBubbleEnd: '#7c3aed',
    veraGradientStart: '#9b7bf7',
  } as const;

  return (
    <>
      <style jsx global>{GLOBAL_STYLES}</style>

      <div style={{
        position: 'fixed',
        inset: 0,
        background: colors.bg,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'background 0.4s ease',
      }}>
        
        {/* ================================================================ */}
        {/* AMBIENT BACKGROUND - Simple, iOS-friendly */}
        {/* ================================================================ */}
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          {/* Primary warm glow - top center */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '140%',
            height: '60%',
            background: `radial-gradient(ellipse at center, ${colors.glow} 0%, transparent 70%)`,
            borderRadius: '50%',
            transition: 'background 0.4s ease',
          }} />

          {/* Secondary warm glow - bottom */}
          <div style={{
            position: 'absolute',
            bottom: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120%',
            height: '40%',
            background: `radial-gradient(ellipse at center, ${colors.glow} 0%, transparent 70%)`,
            borderRadius: '50%',
            transition: 'background 0.4s ease',
          }} />

          {/* Soft vignette - focuses attention on center */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.03) 100%)',
          }} />
        </div>

        {/* ================================================================ */}
        {/* HEADER */}
        {/* ================================================================ */}
        <header style={{
          padding: '16px',
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 50,
        }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 18px',
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 50,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              color: colors.textMuted,
              transition: 'all 0.3s ease',
            }}
          >
            ← Sanctuary
          </button>
          
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: colors.textMuted,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            transition: 'color 0.3s ease',
          }}>
            Recalibration
          </span>

          <ThemeToggle />
        </header>

        {/* ================================================================ */}
        {/* CHAT AREA */}
        {/* ================================================================ */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 680,
          width: '100%',
          margin: '0 auto',
          padding: '0 16px',
          position: 'relative',
          zIndex: 10,
          overflow: 'hidden',
        }}>
          
          {/* Messages Container */}
          <div 
            className="messages-scroll"
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '20px 0',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {messages.length === 0 ? (
              /* ======================================================== */
              /* EMPTY STATE - Welcome Screen */
              /* ======================================================== */
              <div style={{
                textAlign: 'center',
                padding: '40px 16px',
                animation: 'fadeIn 0.6s ease-out',
              }}>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 28,
                  fontWeight: 300,
                  color: colors.text,
                  marginBottom: 10,
                  letterSpacing: '-0.01em',
                  transition: 'color 0.3s ease',
                }}>
                  I'm here with you
                </h2>
                
                <p style={{
                  fontSize: 15,
                  color: colors.textMuted,
                  marginBottom: 36,
                  lineHeight: 1.6,
                  maxWidth: 300,
                  margin: '0 auto 36px',
                  transition: 'color 0.3s ease',
                }}>
                  This is a safe space to share whatever's on your mind.
                </p>

                {/* Starter Prompts */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  justifyContent: 'center',
                  maxWidth: 400,
                  margin: '0 auto',
                }}>
                  {STARTER_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      className="prompt-btn"
                      onClick={() => onSendMessage(prompt)}
                      style={{
                        padding: '12px 20px',
                        background: colors.cardBg,
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: 24,
                        fontSize: 14,
                        fontWeight: 500,
                        color: colors.textMuted,
                        cursor: 'pointer',
                        boxShadow: isDark 
                          ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
                          : '0 2px 8px rgba(0, 0, 0, 0.04)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* ======================================================== */
              /* MESSAGES LIST */
              /* ======================================================== */
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 16,
                paddingBottom: 20,
              }}>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      animation: 'fadeIn 0.3s ease-out',
                    }}
                  >
                    <div style={{
                      maxWidth: '80%',
                      padding: '14px 18px',
                      borderRadius: msg.role === 'user' 
                        ? '20px 20px 6px 20px' 
                        : '20px 20px 20px 6px',
                      background: msg.role === 'user' 
                        ? `linear-gradient(135deg, ${room.userBubbleStart} 0%, ${room.userBubbleEnd} 100%)`
                        : colors.cardBg,
                      color: msg.role === 'user' 
                        ? '#ffffff' 
                        : colors.text,
                      fontSize: 15,
                      lineHeight: 1.65,
                      boxShadow: msg.role === 'user'
                        ? `0 4px 16px ${room.veraShadow}`
                        : isDark 
                          ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                          : '0 2px 8px rgba(0, 0, 0, 0.04)',
                      border: msg.role === 'user' 
                        ? 'none' 
                        : `1px solid ${colors.cardBorder}`,
                      transition: 'background 0.3s ease, color 0.3s ease, border-color 0.3s ease',
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isGenerating && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-start',
                    animation: 'fadeIn 0.3s ease-out',
                  }}>
                    <div style={{
                      padding: '16px 22px',
                      borderRadius: '20px 20px 20px 6px',
                      background: colors.cardBg,
                      border: `1px solid ${colors.cardBorder}`,
                      boxShadow: isDark 
                        ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.04)',
                      transition: 'all 0.3s ease',
                    }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: room.veraGradientStart,
                              opacity: 0.6,
                              animation: `pulse 1.2s ease-in-out ${i * 0.15}s infinite`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* INPUT AREA */}
          {/* ============================================================ */}
          <div style={{
            padding: '16px 0',
            paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
          }}>
            <div style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-end',
            }}>
              {/* Attachment & Voice buttons */}
              <div style={{ 
                display: 'flex', 
                gap: 8,
                flexShrink: 0,
              }}>
                {/* Attachment Button */}
                <button
                  type="button"
                  aria-label="Attach file"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    background: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Paperclip icon - pure CSS */}
                  <div style={{
                    width: 16,
                    height: 16,
                    position: 'relative',
                  }}>
                    <div style={{
                      position: 'absolute',
                      width: 10,
                      height: 14,
                      borderTop: `2px solid ${colors.textMuted}`,
                      borderLeft: `2px solid ${colors.textMuted}`,
                      borderRight: `2px solid ${colors.textMuted}`,
                      borderRadius: '5px 5px 0 0',
                      borderBottom: 'none',
                      top: 0,
                      left: 3,
                    }} />
                    <div style={{
                      position: 'absolute',
                      width: 6,
                      height: 10,
                      borderTop: `2px solid ${colors.textMuted}`,
                      borderLeft: `2px solid ${colors.textMuted}`,
                      borderRight: `2px solid ${colors.textMuted}`,
                      borderRadius: '3px 3px 0 0',
                      borderBottom: 'none',
                      top: 4,
                      left: 5,
                    }} />
                  </div>
                </button>
                
                {/* Microphone Button */}
                <button
                  type="button"
                  aria-label="Voice input"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    background: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Microphone icon - pure CSS */}
                  <div style={{
                    width: 16,
                    height: 18,
                    position: 'relative',
                  }}>
                    {/* Mic body */}
                    <div style={{
                      position: 'absolute',
                      width: 8,
                      height: 12,
                      background: colors.textMuted,
                      borderRadius: 4,
                      top: 0,
                      left: 4,
                    }} />
                    {/* Mic stand */}
                    <div style={{
                      position: 'absolute',
                      width: 12,
                      height: 6,
                      borderLeft: `2px solid ${colors.textMuted}`,
                      borderRight: `2px solid ${colors.textMuted}`,
                      borderBottom: `2px solid ${colors.textMuted}`,
                      borderTop: 'none',
                      borderRadius: '0 0 6px 6px',
                      top: 9,
                      left: 2,
                    }} />
                    {/* Mic base */}
                    <div style={{
                      position: 'absolute',
                      width: 2,
                      height: 4,
                      background: colors.textMuted,
                      bottom: 0,
                      left: 7,
                    }} />
                  </div>
                </button>
              </div>

              {/* Text Input */}
              <textarea
                ref={textareaRef}
                className={`chat-input ${isDark ? 'chat-input-dark' : ''}`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Share what's on your mind..."
                rows={1}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  borderRadius: 28,
                  border: `1.5px solid ${isFocused ? room.inputBorderFocused : colors.cardBorder}`,
                  background: room.inputBg,
                  fontSize: 15,
                  color: colors.text,
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  minHeight: 52,
                  maxHeight: 120,
                  boxShadow: isFocused 
                    ? isDark 
                      ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
                      : '0 4px 20px rgba(0, 0, 0, 0.06)'
                    : isDark
                      ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                      : '0 2px 8px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.3s ease',
                }}
              />
              
              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!inputValue.trim() || isGenerating}
                style={{
                  padding: '14px 24px',
                  borderRadius: 28,
                  border: 'none',
                  background: inputValue.trim() && !isGenerating
                    ? `linear-gradient(135deg, ${room.userBubbleStart} 0%, ${room.userBubbleEnd} 100%)`
                    : 'rgba(0, 0, 0, 0.06)',
                  color: inputValue.trim() && !isGenerating 
                    ? '#ffffff' 
                    : 'rgba(0, 0, 0, 0.25)',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: inputValue.trim() && !isGenerating ? 'pointer' : 'not-allowed',
                  boxShadow: inputValue.trim() && !isGenerating 
                    ? `0 4px 16px ${room.veraShadow}` 
                    : 'none',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}