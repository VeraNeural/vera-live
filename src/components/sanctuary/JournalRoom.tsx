'use client';

import { useState, useEffect } from 'react';

interface JournalRoomProps {
  onBack: () => void;
}

type Tab = 'write' | 'entries';
type Mood = 'calm' | 'anxious' | 'sad' | 'grateful' | 'hopeful' | 'tired';

const PROMPTS = [
  "What's weighing on your mind right now?",
  "What are you grateful for today?",
  "Describe a moment that made you smile recently.",
  "What would you tell your younger self?",
  "What's one thing you're looking forward to?",
  "How are you really feeling today?",
];

const MOODS: { id: Mood; label: string; color: string }[] = [
  { id: 'calm', label: 'Calm', color: '#4ade80' },
  { id: 'anxious', label: 'Anxious', color: '#fbbf24' },
  { id: 'sad', label: 'Sad', color: '#60a5fa' },
  { id: 'grateful', label: 'Grateful', color: '#a78bfa' },
  { id: 'hopeful', label: 'Hopeful', color: '#f472b6' },
  { id: 'tired', label: 'Tired', color: '#9ca3af' },
];

export default function JournalRoom({ onBack }: JournalRoomProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('write');
  const [currentPrompt, setCurrentPrompt] = useState(PROMPTS[0]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getNewPrompt = () => {
    const otherPrompts = PROMPTS.filter(p => p !== currentPrompt);
    const randomPrompt = otherPrompts[Math.floor(Math.random() * otherPrompts.length)];
    setCurrentPrompt(randomPrompt);
  };

  const usePrompt = () => {
    setTitle(currentPrompt);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  if (!mounted) {
    return <div style={{ minHeight: '100vh', background: '#1a1815' }} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1a1815 0%, #252220 50%, #1a1815 100%)',
      fontFamily: "'Outfit', -apple-system, sans-serif",
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Bookshelf on left */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: 0,
        width: 60,
        height: '70%',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '10px 8px',
      }}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              height: 60 + (i % 3) * 20,
              background: ['#8b4513', '#654321', '#4a3728', '#2d1f1a', '#5c4033'][i % 5],
              borderRadius: 2,
              width: '100%',
            }}
          />
        ))}
      </div>

      {/* Window with moon */}
      <div style={{
        position: 'absolute',
        top: '8%',
        right: '8%',
        width: 140,
        height: 200,
        background: 'linear-gradient(180deg, #1a2030 0%, #252540 100%)',
        border: '5px solid #3a3530',
        borderRadius: 4,
      }}>
        {/* Moon */}
        <div style={{
          position: 'absolute',
          top: 25,
          right: 25,
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #f5f5ff 0%, #d0d0e8 50%, #b0b0d0 100%)',
          boxShadow: '0 0 25px rgba(200,200,255,0.4)',
        }} />
        {/* Stars */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 2,
              height: 2,
              background: '#fff',
              borderRadius: '50%',
              top: `${20 + Math.random() * 50}%`,
              left: `${10 + Math.random() * 60}%`,
            }}
          />
        ))}
        {/* Window dividers */}
        <div style={{ position: 'absolute', top: 0, left: '50%', width: 5, height: '100%', background: '#3a3530' }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 5, background: '#3a3530' }} />
      </div>

      {/* Desk with candle */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
        {/* Books on desk */}
        <div style={{
          position: 'absolute',
          bottom: 65,
          left: 20,
          display: 'flex',
          gap: 4,
        }}>
          <div style={{ width: 35, height: 45, background: '#5a5a70', borderRadius: 2 }} />
          <div style={{ width: 40, height: 50, background: '#4a5a6a', borderRadius: 2 }} />
        </div>
        
        {/* Candle */}
        <div style={{
          position: 'absolute',
          bottom: 70,
          left: -30,
        }}>
          <div style={{
            width: 12,
            height: 25,
            background: 'linear-gradient(180deg, #f5f0e8 0%, #e0d8c8 100%)',
            borderRadius: 2,
          }}>
            <div style={{
              position: 'absolute',
              top: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 6,
              height: 12,
              background: 'radial-gradient(ellipse at 50% 80%, rgba(255,200,100,0.9) 0%, rgba(255,150,50,0.6) 50%, transparent 100%)',
              borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
              animation: 'flicker 0.5s ease-in-out infinite alternate',
            }} />
          </div>
        </div>

        {/* Desk surface */}
        <div style={{
          width: 300,
          height: 15,
          background: '#4a4035',
          borderRadius: 4,
        }} />
        {/* Desk body */}
        <div style={{
          width: 300,
          height: 50,
          background: '#3a3530',
          borderRadius: '0 0 4px 4px',
          display: 'flex',
        }}>
          <div style={{ flex: 1, borderRight: '2px solid #2a2520', margin: 5 }} />
          <div style={{ flex: 1, margin: 5 }} />
        </div>
        
        {/* Pen */}
        <div style={{
          position: 'absolute',
          bottom: 60,
          right: 20,
          width: 60,
          height: 8,
          background: 'linear-gradient(90deg, #2a2a40 0%, #1a1a30 100%)',
          borderRadius: 4,
          transform: 'rotate(-20deg)',
        }} />
      </div>

      {/* Plant */}
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '10%',
      }}>
        <div style={{
          width: 30,
          height: 25,
          background: '#4a5a4a',
          borderRadius: '4px 4px 8px 8px',
        }} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            position: 'absolute',
            bottom: 22,
            left: `${5 + i * 7}px`,
            width: 6,
            height: 30 + i * 5,
            background: '#5a8a5a',
            borderRadius: '50% 50% 0 0',
            transform: `rotate(${-20 + i * 12}deg)`,
            transformOrigin: 'bottom center',
          }} />
        ))}
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: 20,
          left: 80,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 20px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 50,
          color: 'rgba(255,255,255,0.8)',
          fontSize: '0.9rem',
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        ← Back
      </button>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        padding: '60px 40px 40px',
        maxWidth: 700,
        margin: '0 auto',
      }}>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 300,
          textAlign: 'center',
          marginBottom: 8,
        }}>
          Journal Nook
        </h1>
        <p style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 30,
        }}>
          A quiet space for reflection
        </p>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 30,
        }}>
          {(['write', 'entries'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 28px',
                background: activeTab === tab ? 'rgba(180,160,130,0.2)' : 'transparent',
                border: '1px solid rgba(180,160,130,0.3)',
                borderRadius: 30,
                color: activeTab === tab ? '#d4c4a8' : 'rgba(255,255,255,0.5)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'entries' ? 'Past Entries' : 'Write'}
            </button>
          ))}
        </div>

        {activeTab === 'write' && (
          <>
            {/* Writing Prompt */}
            <div style={{
              padding: '24px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(180,160,130,0.2)',
              borderRadius: 16,
              marginBottom: 20,
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '0.7rem',
                color: '#b4a078',
                letterSpacing: '0.2em',
                marginBottom: 12,
              }}>
                WRITING PROMPT
              </div>
              <p style={{
                fontSize: '1.2rem',
                fontStyle: 'italic',
                color: 'rgba(255,255,255,0.85)',
                marginBottom: 16,
              }}>
                "{currentPrompt}"
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button
                  onClick={getNewPrompt}
                  style={{
                    padding: '10px 20px',
                    background: 'transparent',
                    border: '1px solid rgba(180,160,130,0.3)',
                    borderRadius: 25,
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Different prompt
                </button>
                <button
                  onClick={usePrompt}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(180,160,130,0.2)',
                    border: '1px solid rgba(180,160,130,0.3)',
                    borderRadius: 25,
                    color: '#d4c4a8',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Use this
                </button>
              </div>
            </div>

            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give this entry a title..."
              style={{
                width: '100%',
                padding: '16px 20px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(180,160,130,0.15)',
                borderRadius: 12,
                color: '#fff',
                fontSize: '1rem',
                marginBottom: 16,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />

            {/* Writing Area */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Begin writing... let your thoughts flow freely."
              style={{
                width: '100%',
                minHeight: 200,
                padding: '20px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(180,160,130,0.15)',
                borderRadius: 12,
                color: '#fff',
                fontSize: '1rem',
                lineHeight: 1.7,
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                fontStyle: 'italic',
              }}
            />

            {/* Mood Selector */}
            <div style={{ marginTop: 20 }}>
              <p style={{
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: 12,
              }}>
                How are you feeling?
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 16px',
                      background: selectedMood === mood.id ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selectedMood === mood.id ? mood.color : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: 25,
                      color: selectedMood === mood.id ? '#fff' : 'rgba(255,255,255,0.6)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: mood.color,
                    }} />
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 24,
            }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                {wordCount} words
              </span>
              <button
                style={{
                  padding: '14px 30px',
                  background: 'linear-gradient(135deg, #b4a078 0%, #8a7858 100%)',
                  border: 'none',
                  borderRadius: 30,
                  color: '#fff',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Save Entry
              </button>
            </div>
          </>
        )}

        {activeTab === 'entries' && (
          <div style={{
            padding: '60px 40px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 16,
            textAlign: 'center',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>
              No journal entries yet
            </p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
              Start writing to see your entries here
            </p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes flicker {
          0% { transform: translateX(-50%) scaleY(1); }
          100% { transform: translateX(-50%) scaleY(1.1); }
        }
      `}</style>
    </div>
  );
}