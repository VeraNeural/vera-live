'use client';

import { useState, useRef, useEffect } from 'react';

interface RecalibrationRoomProps {
  onBack: () => void;
  onSendMessage: (message: string) => void;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  isGenerating?: boolean;
  userName?: string;
}

export default function RecalibrationRoom({ 
  onBack, 
  onSendMessage, 
  messages, 
  isGenerating = false,
  userName = 'You'
}: RecalibrationRoomProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    setSelectedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const starterPrompts = [
    "I've been feeling anxious lately",
    "I need someone to talk to",
    "Help me process my feelings",
    "I'm feeling overwhelmed",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          -webkit-tap-highlight-color: transparent;
        }
        
        html, body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.04); opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes gentleGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }

        .recalibration-input::placeholder {
          color: rgba(120, 105, 90, 0.5);
        }

        .recalibration-input:focus {
          outline: none;
          border-color: rgba(180, 140, 120, 0.3);
        }

        .messages-scroll::-webkit-scrollbar {
          width: 4px;
        }

        .messages-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .messages-scroll::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.08);
          border-radius: 2px;
        }

        .prompt-btn {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .prompt-btn:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.95);
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
        }

        .prompt-btn:active {
          transform: translateY(0) scale(0.98);
        }

        @media (hover: none) {
          .prompt-btn:hover {
            transform: none;
            background: rgba(255,255,255,0.85);
            box-shadow: none;
          }
          .prompt-btn:active {
            transform: scale(0.96);
            background: rgba(255,255,255,0.95);
          }
        }
      `}</style>

      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(180deg, #faf7f2 0%, #f5efe5 50%, #efe7db 100%)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        
        {/* Atmospheric Background Elements */}
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          {/* Warm ambient glow */}
          <div style={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            width: 'min(60vw, 300px)',
            height: 'min(60vw, 300px)',
            background: 'radial-gradient(circle, rgba(255,220,180,0.15) 0%, transparent 60%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            animation: 'gentleGlow 8s ease-in-out infinite',
          }} />

          {/* Window - Blurred, soft light source */}
          <div style={{
            position: 'absolute',
            top: 'max(8%, 40px)',
            right: 'max(6%, 25px)',
            width: 'min(25vw, 130px)',
            aspectRatio: '3/4',
            background: 'linear-gradient(180deg, rgba(220,235,245,0.6) 0%, rgba(200,225,240,0.5) 50%, rgba(180,210,230,0.4) 100%)',
            borderRadius: 6,
            border: '4px solid rgba(200,185,165,0.4)',
            filter: 'blur(2px)',
            boxShadow: `
              inset 0 0 40px rgba(255,255,255,0.4),
              0 0 60px rgba(200,220,240,0.2)
            `,
          }}>
            {/* Window mullions */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 4,
              height: '100%',
              background: 'rgba(200,185,165,0.4)',
            }} />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
              width: '100%',
              height: 4,
              background: 'rgba(200,185,165,0.4)',
            }} />
          </div>

          {/* Soft sunbeam from window */}
          <div style={{
            position: 'absolute',
            top: '15%',
            right: '10%',
            width: 'min(40vw, 200px)',
            height: 'min(80vw, 400px)',
            background: 'linear-gradient(135deg, rgba(255,240,210,0.08) 0%, transparent 60%)',
            transform: 'rotate(-15deg)',
            filter: 'blur(30px)',
          }} />

          {/* Couch silhouette - subtle */}
          <div style={{
            position: 'absolute',
            bottom: 'min(28%, 180px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(70vw, 320px)',
            opacity: 0.06,
          }}>
            {/* Back */}
            <div style={{
              height: 'min(18vw, 80px)',
              background: 'rgba(80,60,50,1)',
              borderRadius: '20px 20px 0 0',
            }} />
            {/* Seat */}
            <div style={{
              height: 'min(8vw, 35px)',
              background: 'rgba(80,60,50,1)',
              borderRadius: 8,
              marginTop: -5,
            }} />
          </div>

          {/* Floor lamp silhouette */}
          <div style={{
            position: 'absolute',
            bottom: 'min(30%, 190px)',
            left: 'max(8%, 30px)',
            opacity: 0.05,
          }}>
            <div style={{
              width: 'min(10vw, 40px)',
              height: 'min(8vw, 32px)',
              background: 'rgba(80,60,50,1)',
              borderRadius: '6px 6px 16px 16px',
            }} />
            <div style={{
              width: 'min(1.5vw, 5px)',
              height: 'min(20vw, 80px)',
              background: 'rgba(80,60,50,1)',
              margin: '0 auto',
            }} />
            <div style={{
              width: 'min(6vw, 25px)',
              height: 'min(2vw, 8px)',
              background: 'rgba(80,60,50,1)',
              borderRadius: '50%',
              margin: '0 auto',
            }} />
          </div>

          {/* Plant silhouette */}
          <div style={{
            position: 'absolute',
            bottom: 'min(26%, 165px)',
            right: 'max(10%, 35px)',
            opacity: 0.05,
          }}>
            <div style={{
              width: 'min(9vw, 36px)',
              height: 'min(7vw, 30px)',
              background: 'rgba(80,60,50,1)',
              borderRadius: '4px 4px 8px 8px',
            }} />
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  bottom: 'min(6vw, 26px)',
                  left: `${35 + i * 12}%`,
                  width: 'min(2.5vw, 10px)',
                  height: `min(${8 + i * 2}vw, ${32 + i * 8}px)`,
                  background: 'rgba(80,60,50,1)',
                  borderRadius: '50% 50% 0 0',
                  transform: `rotate(${-15 + i * 15}deg)`,
                  transformOrigin: 'bottom center',
                }}
              />
            ))}
          </div>
        </div>

        {/* Header */}
        <header style={{
          padding: 'max(16px, env(safe-area-inset-top)) 16px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0,0,0,0.04)',
          background: 'rgba(250,247,242,0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 50,
        }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(0,0,0,0.04)',
              borderRadius: 50,
              cursor: 'pointer',
              fontSize: 'clamp(0.75rem, 3vw, 0.85rem)',
              fontWeight: 450,
              color: 'rgba(90,80,70,0.85)',
              transition: 'all 0.2s ease',
            }}
          >
            ← Sanctuary
          </button>
          
          <h1 style={{
            fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)',
            fontWeight: 500,
            color: 'rgba(120,105,90,0.7)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            Recalibration
          </h1>
          
          <div style={{ width: 'min(25vw, 100px)' }} />
        </header>

        {/* Chat Area */}
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
          {/* Messages */}
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
              <div style={{
                textAlign: 'center',
                padding: 'min(12vw, 50px) 16px',
              }}>
                {/* VERA Orb */}
                <div style={{
                  width: 'min(22vw, 85px)',
                  height: 'min(22vw, 85px)',
                  margin: '0 auto min(7vw, 28px)',
                  borderRadius: '50%',
                  background: `
                    radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95) 0%, transparent 50%),
                    radial-gradient(circle at 50% 50%, rgba(200,180,210,0.5) 0%, rgba(160,140,180,0.3) 50%, rgba(139,92,246,0.2) 100%)
                  `,
                  boxShadow: `
                    0 0 40px rgba(139,92,246,0.12),
                    0 0 80px rgba(139,92,246,0.06),
                    inset 0 0 30px rgba(255,255,255,0.3)
                  `,
                  animation: 'breathe 5s ease-in-out infinite',
                }} />
                
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(1.4rem, 6vw, 1.85rem)',
                  fontWeight: 300,
                  color: 'rgba(70,62,55,0.9)',
                  marginBottom: 8,
                  letterSpacing: '-0.01em',
                }}>
                  I'm here with you
                </h2>
                
                <p style={{
                  fontSize: 'clamp(0.8rem, 3.2vw, 0.92rem)',
                  color: 'rgba(130,115,100,0.75)',
                  marginBottom: 'min(8vw, 32px)',
                  lineHeight: 1.5,
                }}>
                  This is a safe space to share whatever's on your mind.
                </p>

                {/* Starter Prompts */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'min(2.5vw, 10px)',
                  justifyContent: 'center',
                  maxWidth: 500,
                  margin: '0 auto',
                }}>
                  {starterPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      className="prompt-btn"
                      onClick={() => onSendMessage(prompt)}
                      style={{
                        padding: 'min(3vw, 12px) min(4.5vw, 18px)',
                        background: 'rgba(255,255,255,0.85)',
                        border: '1px solid rgba(200,185,165,0.2)',
                        borderRadius: 22,
                        fontSize: 'clamp(0.75rem, 3vw, 0.85rem)',
                        fontWeight: 450,
                        color: 'rgba(100,88,75,0.85)',
                        cursor: 'pointer',
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 'min(4vw, 16px)',
                paddingBottom: 20,
              }}>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      animation: 'float 0.4s ease-out',
                    }}
                  >
                    <div style={{
                      maxWidth: '82%',
                      padding: 'min(3.5vw, 14px) min(4.5vw, 18px)',
                      borderRadius: msg.role === 'user' 
                        ? '20px 20px 6px 20px' 
                        : '20px 20px 20px 6px',
                      background: msg.role === 'user' 
                        ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                        : 'rgba(255,255,255,0.92)',
                      color: msg.role === 'user' ? '#fff' : 'rgba(60,52,45,0.9)',
                      fontSize: 'clamp(0.85rem, 3.5vw, 0.95rem)',
                      lineHeight: 1.6,
                      boxShadow: msg.role === 'user'
                        ? '0 4px 20px rgba(139, 92, 246, 0.25)'
                        : '0 2px 12px rgba(0,0,0,0.04)',
                      border: msg.role === 'user' 
                        ? 'none' 
                        : '1px solid rgba(0,0,0,0.03)',
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                
                {isGenerating && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                      padding: 'min(3.5vw, 14px) min(5vw, 20px)',
                      borderRadius: '20px 20px 20px 6px',
                      background: 'rgba(255,255,255,0.92)',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                      border: '1px solid rgba(0,0,0,0.03)',
                    }}>
                      <div style={{ display: 'flex', gap: 'min(1.5vw, 6px)' }}>
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            style={{
                              width: 'min(2vw, 8px)',
                              height: 'min(2vw, 8px)',
                              borderRadius: '50%',
                              background: 'rgba(139, 92, 246, 0.45)',
                              animation: `pulse 1.4s ease-in-out ${i * 0.15}s infinite`,
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

          {/* Input Area */}
          <div style={{
            padding: '12px 0',
            paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
            borderTop: '1px solid rgba(0,0,0,0.04)',
            background: 'linear-gradient(to top, rgba(250,247,242,0.98) 0%, rgba(250,247,242,0.9) 100%)',
          }}>
            {selectedImage && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={selectedImage}
                    alt="Selected"
                    style={{
                      maxHeight: 'min(22vw, 90px)',
                      borderRadius: 12,
                      border: '1px solid rgba(200,185,165,0.2)',
                    }}
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      background: 'rgba(0,0,0,0.6)',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            
            <div style={{
              display: 'flex',
              gap: 'min(2.5vw, 10px)',
              alignItems: 'flex-end',
            }}>
              {/* Attachment & Voice buttons placeholder */}
              <div style={{ 
                display: 'flex', 
                gap: 'min(1.5vw, 6px)',
                flexShrink: 0,
              }}>
                <button
                  style={{
                    width: 'min(11vw, 44px)',
                    height: 'min(11vw, 44px)',
                    borderRadius: 12,
                    background: 'rgba(139,92,246,0.08)',
                    border: '1px solid rgba(139,92,246,0.15)',
                    color: 'rgba(139,92,246,0.7)',
                    fontSize: 'min(5vw, 18px)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  📎
                </button>
                <button
                  style={{
                    width: 'min(11vw, 44px)',
                    height: 'min(11vw, 44px)',
                    borderRadius: 12,
                    background: 'rgba(139,92,246,0.08)',
                    border: '1px solid rgba(139,92,246,0.15)',
                    color: 'rgba(139,92,246,0.7)',
                    fontSize: 'min(5vw, 18px)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  🎤
                </button>
              </div>
              
              <textarea
                ref={textareaRef}
                className="recalibration-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Share what's on your mind..."
                rows={1}
                style={{
                  flex: 1,
                  padding: 'min(3.2vw, 13px) min(4.5vw, 18px)',
                  borderRadius: 24,
                  border: `1px solid ${isFocused ? 'rgba(180,140,120,0.3)' : 'rgba(200,185,165,0.2)'}`,
                  background: 'rgba(255,255,255,0.9)',
                  fontSize: 'clamp(0.85rem, 3.5vw, 0.95rem)',
                  color: 'rgba(55,48,42,0.95)',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  minHeight: 'min(12vw, 48px)',
                  maxHeight: 'min(30vw, 120px)',
                  transition: 'border-color 0.2s ease',
                  boxShadow: isFocused ? '0 2px 12px rgba(0,0,0,0.04)' : 'none',
                }}
              />
              
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!inputValue.trim() || isGenerating}
                style={{
                  padding: 'min(3.2vw, 13px) min(6vw, 24px)',
                  borderRadius: 24,
                  border: 'none',
                  background: inputValue.trim() && !isGenerating
                    ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                    : 'rgba(0,0,0,0.06)',
                  color: inputValue.trim() && !isGenerating ? '#fff' : 'rgba(0,0,0,0.25)',
                  fontSize: 'clamp(0.85rem, 3.5vw, 0.95rem)',
                  fontWeight: 500,
                  cursor: inputValue.trim() && !isGenerating ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  boxShadow: inputValue.trim() && !isGenerating 
                    ? '0 4px 15px rgba(139,92,246,0.3)' 
                    : 'none',
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