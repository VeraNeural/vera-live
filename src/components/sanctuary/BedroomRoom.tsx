'use client';

import { useState, useEffect } from 'react';

interface BedroomRoomProps {
  onBack: () => void;
}

type Category = 'soundscapes' | 'stories' | 'meditations';
type TimerOption = '15m' | '30m' | '1h' | '∞';

const CONTENT = {
  soundscapes: [
    { id: 1, title: 'Ocean Waves', duration: '45 min' },
    { id: 2, title: 'Rain on Leaves', duration: '60 min' },
    { id: 3, title: 'Night Forest', duration: '30 min' },
  ],
  stories: [
    { id: 1, title: 'The Quiet Village', duration: '20 min' },
    { id: 2, title: 'Moonlit Garden', duration: '25 min' },
  ],
  meditations: [
    { id: 1, title: 'Body Scan for Sleep', duration: '15 min' },
    { id: 2, title: 'Letting Go of the Day', duration: '20 min' },
  ],
};

export default function BedroomRoom({ onBack }: BedroomRoomProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTimer, setSelectedTimer] = useState<TimerOption>('30m');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePlayTrack = (title: string) => {
    setCurrentTrack(title);
    setIsPlaying(true);
  };

  if (!mounted) {
    return <div style={{ minHeight: '100vh', background: '#0d0d1a' }} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0d0d1a 0%, #151528 50%, #0a0a14 100%)',
      fontFamily: "'Outfit', -apple-system, sans-serif",
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Stars */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 2,
              height: 2,
              background: 'rgba(255,255,255,0.6)',
              borderRadius: '50%',
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Window with Moon */}
      <div style={{
        position: 'absolute',
        top: '8%',
        right: '8%',
        width: 180,
        height: 240,
        background: 'linear-gradient(180deg, #1a1a35 0%, #0d0d20 100%)',
        border: '4px solid #2a2a45',
        borderRadius: 4,
      }}>
        {/* Moon */}
        <div style={{
          position: 'absolute',
          top: 30,
          right: 30,
          width: 35,
          height: 35,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #f5f5ff 0%, #d0d0e8 50%, #b0b0d0 100%)',
          boxShadow: '0 0 30px rgba(200,200,255,0.4)',
        }} />
        {/* Window dividers */}
        <div style={{ position: 'absolute', top: 0, left: '50%', width: 4, height: '100%', background: '#2a2a45' }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 4, background: '#2a2a45' }} />
      </div>

      {/* Bed */}
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '10%',
        width: 350,
      }}>
        {/* Headboard */}
        <div style={{
          height: 80,
          background: 'linear-gradient(180deg, #3a3a55 0%, #2a2a40 100%)',
          borderRadius: '8px 8px 0 0',
        }} />
        {/* Mattress */}
        <div style={{
          height: 50,
          background: 'linear-gradient(180deg, #4a4a65 0%, #3a3a55 100%)',
          borderRadius: 4,
        }}>
          {/* Pillows */}
          <div style={{
            display: 'flex',
            gap: 10,
            padding: '8px 20px',
          }}>
            <div style={{ width: 80, height: 30, background: '#5a5a75', borderRadius: 6 }} />
            <div style={{ width: 80, height: 30, background: '#5a5a75', borderRadius: 6 }} />
          </div>
        </div>
        {/* Blanket */}
        <div style={{
          height: 40,
          background: 'linear-gradient(180deg, #2d2d48 0%, #252540 100%)',
          borderRadius: '0 0 8px 8px',
        }} />
      </div>

      {/* Nightstand with candle */}
      <div style={{
        position: 'absolute',
        bottom: '18%',
        left: 'calc(10% + 370px)',
      }}>
        <div style={{
          width: 60,
          height: 50,
          background: '#2a2a40',
          borderRadius: 4,
        }} />
        {/* Candle */}
        <div style={{
          position: 'absolute',
          bottom: 55,
          left: 20,
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

      {/* Telescope */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '12%',
      }}>
        {/* Tripod */}
        <div style={{
          width: 4,
          height: 80,
          background: '#3a3a55',
          transform: 'rotate(-15deg)',
          transformOrigin: 'top center',
          position: 'absolute',
          bottom: 0,
          left: 10,
        }} />
        <div style={{
          width: 4,
          height: 80,
          background: '#3a3a55',
          transform: 'rotate(15deg)',
          transformOrigin: 'top center',
          position: 'absolute',
          bottom: 0,
          right: 10,
        }} />
        {/* Scope */}
        <div style={{
          width: 60,
          height: 20,
          background: 'linear-gradient(90deg, #4a4a65 0%, #3a3a55 100%)',
          borderRadius: '4px 10px 10px 4px',
          position: 'absolute',
          bottom: 70,
          left: -10,
          transform: 'rotate(-30deg)',
        }} />
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
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
        padding: '80px 40px 40px',
        maxWidth: 800,
        margin: '0 auto',
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 300,
          textAlign: 'center',
          marginBottom: 8,
        }}>
          Rest Chamber
        </h1>
        <p style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 40,
          fontSize: '1rem',
        }}>
          Let go of the day
        </p>

        {/* Category Cards */}
        {!selectedCategory ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginBottom: 40,
          }}>
            {[
              { id: 'soundscapes' as Category, title: 'Soundscapes', desc: 'Ambient sounds for deep rest', count: 3 },
              { id: 'stories' as Category, title: 'Sleep Stories', desc: 'Gentle tales to drift away', count: 2 },
              { id: 'meditations' as Category, title: 'Sleep Meditations', desc: 'Guided journeys into rest', count: 2 },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '24px 20px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 16,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 500, marginBottom: 8 }}>
                  {cat.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: 12 }}>
                  {cat.desc}
                </p>
                <span style={{ color: 'rgba(139,124,198,0.8)', fontSize: '0.75rem' }}>
                  {cat.count} tracks
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                marginBottom: 20,
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 20,
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              ← Back to categories
            </button>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {CONTENT[selectedCategory].map((track) => (
                <button
                  key={track.id}
                  onClick={() => handlePlayTrack(track.title)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: currentTrack === track.title ? 'rgba(139,124,198,0.2)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ color: '#fff', fontSize: '1rem', marginBottom: 4 }}>{track.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{track.duration}</div>
                  </div>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: currentTrack === track.title ? 'rgba(139,124,198,0.8)' : 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {currentTrack === track.title && isPlaying ? '⏸' : '▶'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sleep Timer */}
        <div style={{
          position: 'fixed',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 20px',
          background: 'rgba(30,30,50,0.9)',
          borderRadius: 50,
          backdropFilter: 'blur(10px)',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginRight: 8 }}>
            Sleep timer
          </span>
          {(['15m', '30m', '1h', '∞'] as TimerOption[]).map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTimer(time)}
              style={{
                padding: '8px 14px',
                background: selectedTimer === time ? 'rgba(255,255,255,0.15)' : 'transparent',
                border: 'none',
                borderRadius: 20,
                color: selectedTimer === time ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes flicker {
          0% { transform: translateX(-50%) scaleY(1); }
          100% { transform: translateX(-50%) scaleY(1.1); }
        }
      `}</style>
    </div>
  );
}