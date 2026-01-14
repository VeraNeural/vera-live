'use client';

import { useState, useRef, useEffect } from 'react';
import { AttachmentButton } from '@/components/AttachmentButton';
import { VoiceButton } from '@/components/VoiceButton';

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
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

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const starterPrompts = [
    "I've been feeling anxious lately",
    "I need someone to talk to",
    "Help me process my feelings",
    "I'm feeling overwhelmed",
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.03); opacity: 1; }
        }
        
        .recalibration-textarea::placeholder {
          color: #a09890;
        }
        
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .messages-container::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 3px;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0ea 50%, #efe8e0 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <header style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0,0,0,0.04)',
        }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(0,0,0,0.04)',
              borderRadius: 50,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 450,
              color: '#6b635a',
              transition: 'all 0.2s ease',
            }}
          >
            ← Back to Sanctuary
          </button>
          
          <h1 style={{
            fontSize: 13,
            fontWeight: 500,
            color: '#8a8078',
            margin: 0,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Recalibration
          </h1>
          
          <div style={{ width: 140 }} />
        </header>

        {/* Chat Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 720,
          width: '100%',
          margin: '0 auto',
          padding: '20px 16px',
        }}>
          {/* Messages */}
          <div 
            className="messages-container"
            style={{
              flex: 1,
              overflowY: 'auto',
              paddingBottom: 16,
            }}
          >
            {messages.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '50px 16px',
              }}>
                {/* VERA Orb */}
                <div style={{
                  width: 80,
                  height: 80,
                  margin: '0 auto 28px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9) 0%, rgba(180,160,200,0.5) 50%, rgba(139,92,246,0.3) 100%)',
                  boxShadow: '0 0 50px rgba(139,92,246,0.15)',
                  animation: 'breathe 4s ease-in-out infinite',
                }} />
                
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '1.75rem',
                  fontWeight: 300,
                  color: '#4a4540',
                  marginBottom: 8,
                }}>
                  I'm here with you
                </h2>
                
                <p style={{
                  fontSize: 14,
                  color: '#9a9088',
                  marginBottom: 32,
                }}>
                  This is a safe space to share whatever's on your mind.
                </p>

                {/* Starter Prompts */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  justifyContent: 'center',
                }}>
                  {starterPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => onSendMessage(prompt)}
                      style={{
                        padding: '11px 18px',
                        background: 'rgba(255,255,255,0.85)',
                        border: '1px solid rgba(200,180,160,0.15)',
                        borderRadius: 22,
                        fontSize: 13,
                        fontWeight: 450,
                        color: '#6a6058',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div style={{
                      maxWidth: '80%',
                      padding: '14px 18px',
                      borderRadius: msg.role === 'user' 
                        ? '20px 20px 4px 20px' 
                        : '20px 20px 20px 4px',
                      background: msg.role === 'user' 
                        ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                        : 'rgba(255,255,255,0.95)',
                      color: msg.role === 'user' ? '#fff' : '#4a4540',
                      fontSize: 14,
                      lineHeight: 1.6,
                      boxShadow: msg.role === 'user'
                        ? '0 4px 20px rgba(139, 92, 246, 0.3)'
                        : '0 2px 12px rgba(0,0,0,0.04)',
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                
                {isGenerating && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                      padding: '14px 20px',
                      borderRadius: '20px 20px 20px 4px',
                      background: 'rgba(255,255,255,0.95)',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: '50%',
                              background: 'rgba(139, 92, 246, 0.5)',
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
            padding: '16px 0 0',
            borderTop: '1px solid rgba(0,0,0,0.04)',
          }}>
            {selectedImage && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={selectedImage}
                    alt="Selected"
                    style={{
                      maxHeight: 90,
                      borderRadius: 12,
                      border: '1px solid rgba(200,180,160,0.2)',
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
            
            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-end',
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <AttachmentButton
                  onSelect={handleImageSelect}
                  disabled={isGenerating}
                />
                <VoiceButton />
              </div>
              
              <textarea
                ref={textareaRef}
                className="recalibration-textarea"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share what's on your mind..."
                rows={1}
                style={{
                  flex: 1,
                  padding: '13px 18px',
                  borderRadius: 24,
                  border: '1px solid rgba(200,180,160,0.2)',
                  background: 'rgba(255,255,255,0.9)',
                  fontSize: 14,
                  color: '#3a3530',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  minHeight: 48,
                  maxHeight: 140,
                }}
              />
              
              <button
                type="submit"
                disabled={!inputValue.trim() || isGenerating}
                style={{
                  padding: '13px 24px',
                  borderRadius: 24,
                  border: 'none',
                  background: inputValue.trim() && !isGenerating
                    ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                    : 'rgba(0,0,0,0.06)',
                  color: inputValue.trim() && !isGenerating ? '#fff' : 'rgba(0,0,0,0.3)',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: inputValue.trim() && !isGenerating ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                }}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}