'use client';

import { useState, useRef, useEffect } from 'react';
import { AttachmentButton } from '@/components/AttachmentButton';
import { ImagePreview } from '@/components/ImagePreview';
import { VoiceButton } from '@/components/VoiceButton';

interface TherapyRoomProps {
  onBack: () => void;
  onSendMessage: (message: string) => void;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  isGenerating?: boolean;
  userName?: string;
}

export default function TherapyRoom({ 
  onBack, 
  onSendMessage, 
  messages, 
  isGenerating = false,
  userName = 'You'
}: TherapyRoomProps) {
  const [inputValue, setInputValue] = useState('');
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  if (!mounted) {
    return <div style={{ minHeight: '100vh', background: '#f7f5f2' }} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f7f5f2 0%, #f0ebe5 40%, #e8e3dc 100%)',
      fontFamily: "'Outfit', -apple-system, sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 16px',
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(0,0,0,0.05)',
            borderRadius: 50,
            cursor: 'pointer',
            fontSize: '0.85rem',
            color: '#555',
          }}
        >
          ← Back to Sanctuary
        </button>
        <h1 style={{
          fontSize: '1rem',
          fontWeight: 500,
          color: '#666',
          margin: 0,
        }}>
          Recalibration Room
        </h1>
        <div style={{ width: 140 }} /> {/* Spacer for centering */}
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 700,
        width: '100%',
        margin: '0 auto',
        padding: '20px',
      }}>
        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 20,
        }}>
          {messages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
            }}>
              {/* Vera Orb */}
              <div style={{
                width: 80,
                height: 80,
                margin: '0 auto 24px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4), rgba(160,140,200,0.5) 40%, rgba(120,100,180,0.4) 70%)',
                boxShadow: '0 0 40px rgba(140,120,200,0.3)',
              }} />
              
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 300,
                color: '#555',
                marginBottom: 8,
              }}>
                I'm here with you
              </h2>
              <p style={{
                fontSize: '0.9rem',
                color: '#888',
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
                      padding: '12px 18px',
                      background: 'rgba(255,255,255,0.8)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderRadius: 20,
                      fontSize: '0.85rem',
                      color: '#666',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
                      e.currentTarget.style.transform = 'translateY(0)';
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
                    borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    background: msg.role === 'user' 
                      ? 'linear-gradient(135deg, #8b7cc6 0%, #7b6cb6 100%)'
                      : 'rgba(255,255,255,0.9)',
                    color: msg.role === 'user' ? '#fff' : '#444',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    boxShadow: msg.role === 'user'
                      ? '0 4px 15px rgba(139,124,198,0.3)'
                      : '0 2px 10px rgba(0,0,0,0.05)',
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isGenerating && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: '20px 20px 20px 4px',
                    background: 'rgba(255,255,255,0.9)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: 6,
                    }}>
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#bbb',
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

        {/* Input Area */}
        <div style={{
          padding: '16px 0',
          borderTop: '1px solid rgba(0,0,0,0.05)',
        }}>
          {selectedImage && (
            <div style={{ marginBottom: 12 }}>
              <div style={{
                position: 'relative',
                maxWidth: '100%',
                display: 'inline-block',
              }}>
                <img
                  src={selectedImage}
                  alt="Selected"
                  style={{
                    maxHeight: 120,
                    borderRadius: 12,
                    border: '1px solid rgba(0,0,0,0.1)',
                    objectFit: 'cover',
                  }}
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: 'rgba(0,0,0,0.6)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.6)';
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
            <div style={{
              display: 'flex',
              gap: 8,
              alignItems: 'flex-end',
            }}>
              <AttachmentButton
                onSelect={handleImageSelect}
                disabled={isGenerating}
              />
              <VoiceButton />
            </div>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share what's on your mind..."
              rows={1}
              style={{
                flex: 1,
                padding: '14px 18px',
                borderRadius: 24,
                border: '1px solid rgba(0,0,0,0.08)',
                background: 'rgba(255,255,255,0.9)',
                fontSize: '0.95rem',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                minHeight: 50,
                maxHeight: 150,
              }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isGenerating}
              style={{
                padding: '14px 24px',
                borderRadius: 24,
                border: 'none',
                background: inputValue.trim() && !isGenerating
                  ? 'linear-gradient(135deg, #8b7cc6 0%, #7b6cb6 100%)'
                  : 'rgba(0,0,0,0.1)',
                color: inputValue.trim() && !isGenerating ? '#fff' : '#999',
                fontSize: '0.9rem',
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

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}