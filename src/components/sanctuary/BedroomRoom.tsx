'use client';

import { useState } from 'react';

interface RestChamberProps {
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

export default function RestChamber({ onBack }: RestChamberProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTimer, setSelectedTimer] = useState<TimerOption>('30m');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  const handlePlayTrack = (title: string) => {
    if (currentTrack === title) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(title);
      setIsPlaying(true);
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        @keyframes flicker {
          0%, 100% { transform: translateX(-50%) scaleY(1) rotate(-1deg); }
          50% { transform: translateX(-50%) scaleY(1.08) rotate(1deg); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0c0c16 0%, #111120 40%, #0a0a12 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        
        {/* Subtle Stars */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: i % 3 === 0 ? 2 : 1,
                height: i % 3 === 0 ? 2 : 1,
                background: 'rgba(255,255,255,0.5)',
                borderRadius: '50%',
                top: `${5 + Math.random() * 40}%`,
                left: `${Math.random() * 100}%`,
                animation: `twinkle ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Ambient Moon Glow */}
        <div style={{
          position: 'absolute',
          top: '5%',
          right: '10%',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(180,180,220,0.08) 0%, transparent 60%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'glow 6s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* Window with Moon */}
        <div style={{
          position: 'absolute',
          top: '6%',
          right: '6%',
          width: 140,
          height: 190,
          background: 'linear-gradient(180deg, #12122a 0%, #0a0a18 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: 'inset 0 0 40px rgba(100,100,180,0.05)',
        }}>
          {/* Moon */}
          <div style={{
            position: 'absolute',
            top: 25,
            right: 25,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #f8f8ff 0%, #d8d8f0 40%, #b8b8d8 100%)',
            boxShadow: '0 0 25px rgba(200,200,255,0.35), 0 0 50px rgba(180,180,220,0.15)',
          }} />
          {/* Window dividers */}
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: '50%', 
            width: 1, 
            height: '100%', 
            background: 'rgba(255,255,255,0.08)',
            transform: 'translateX(-50%)',
          }} />
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: 0, 
            width: '100%', 
            height: 1, 
            background: 'rgba(255,255,255,0.08)',
            transform: 'translateY(-50%)',
          }} />
        </div>

        {/* Bed - Refined */}
        <div style={{
          position: 'absolute',
          bottom: '12%',
          left: '8%',
          width: 320,
        }}>
          {/* Headboard */}
          <div style={{
            height: 70,
            background: 'linear-gradient(180deg, rgba(60,55,80,0.6) 0%, rgba(45,42,65,0.5) 100%)',
            borderRadius: '6px 6px 0 0',
            border: '1px solid rgba(255,255,255,0.05)',
            borderBottom: 'none',
          }} />
          {/* Mattress */}
          <div style={{
            height: 45,
            background: 'linear-gradient(180deg, rgba(70,65,95,0.5) 0%, rgba(55,52,78,0.4) 100%)',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.04)',
            position: 'relative',
          }}>
            {/* Pillows */}
            <div style={{
              display: 'flex',
              gap: 12,
              padding: '10px 24px',
            }}>
              <div style={{ 
                width: 70, 
                height: 26, 
                background: 'linear-gradient(180deg, rgba(90,85,115,0.6) 0%, rgba(75,72,100,0.5) 100%)', 
                borderRadius: 5,
                border: '1px solid rgba(255,255,255,0.05)',
              }} />
              <div style={{ 
                width: 70, 
                height: 26, 
                background: 'linear-gradient(180deg, rgba(90,85,115,0.6) 0%, rgba(75,72,100,0.5) 100%)', 
                borderRadius: 5,
                border: '1px solid rgba(255,255,255,0.05)',
              }} />
            </div>
          </div>
          {/* Blanket */}
          <div style={{
            height: 35,
            background: 'linear-gradient(180deg, rgba(45,42,68,0.5) 0%, rgba(35,33,55,0.4) 100%)',
            borderRadius: '0 0 6px 6px',
            border: '1px solid rgba(255,255,255,0.03)',
            borderTop: 'none',
          }} />
        </div>

        {/* Nightstand with Candle */}
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: 'calc(8% + 340px)',
        }}>
          {/* Table */}
          <div style={{
            width: 50,
            height: 42,
            background: 'linear-gradient(180deg, rgba(50,45,70,0.6) 0%, rgba(40,38,60,0.5) 100%)',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.05)',
          }} />
          {/* Candle */}
          <div style={{
            position: 'absolute',
            bottom: 48,
            left: 18,
            width: 10,
            height: 22,
            background: 'linear-gradient(180deg, #f5f2ec 0%, #e8e2d8 100%)',
            borderRadius: 2,
          }}>
            {/* Flame */}
            <div style={{
              position: 'absolute',
              top: -9,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 5,
              height: 10,
              background: 'radial-gradient(ellipse at 50% 70%, rgba(255,200,100,0.95) 0%, rgba(255,140,50,0.7) 40%, transparent 100%)',
              borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
              animation: 'flicker 0.8s ease-in-out infinite',
              boxShadow: '0 0 8px rgba(255,180,80,0.5)',
            }} />
          </div>
          {/* Candle glow on table */}
          <div style={{
            position: 'absolute',
            bottom: 42,
            left: 10,
            width: 30,
            height: 15,
            background: 'radial-gradient(ellipse, rgba(255,180,100,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
        </div>

        {/* Telescope - Refined */}
        <div style={{
          position: 'absolute',
          bottom: '18%',
          right: '10%',
        }}>
          {/* Tripod legs */}
          <div style={{
            width: 2,
            height: 70,
            background: 'linear-gradient(180deg, rgba(80,75,100,0.7) 0%, rgba(60,55,80,0.5) 100%)',
            transform: 'rotate(-12deg)',
            transformOrigin: 'top center',
            position: 'absolute',
            bottom: 0,
            left: 12,
          }} />
          <div style={{
            width: 2,
            height: 70,
            background: 'linear-gradient(180deg, rgba(80,75,100,0.7) 0%, rgba(60,55,80,0.5) 100%)',
            transform: 'rotate(12deg)',
            transformOrigin: 'top center',
            position: 'absolute',
            bottom: 0,
            right: 12,
          }} />
          {/* Scope body */}
          <div style={{
            width: 50,
            height: 16,
            background: 'linear-gradient(90deg, rgba(70,65,95,0.8) 0%, rgba(55,52,78,0.7) 100%)',
            borderRadius: '3px 8px 8px 3px',
            position: 'absolute',
            bottom: 60,
            left: -8,
            transform: 'rotate(-25deg)',
            border: '1px solid rgba(255,255,255,0.06)',
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
            gap: 6,
            padding: '10px 18px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 50,
            color: 'rgba(255,255,255,0.6)',
            fontSize: 13,
            fontWeight: 450,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 10,
          }}
        >
          ← Back to Sanctuary
        </button>

        {/* Main Content */}
        <div style={{
          position: 'relative',
          zIndex: 5,
          padding: '70px 24px 100px',
          maxWidth: 680,
          margin: '0 auto',
        }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(2rem, 5vw, 2.8rem)',
            fontWeight: 300,
            textAlign: 'center',
            marginBottom: 8,
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: '-0.02em',
          }}>
            Rest Chamber
          </h1>
          <p style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 40,
            fontSize: 14,
            letterSpacing: '0.05em',
          }}>
            Let go of the day
          </p>

          {/* Category Cards */}
          {!selectedCategory ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 14,
              marginBottom: 40,
            }}>
              {[
                { id: 'soundscapes' as Category, title: 'Soundscapes', desc: 'Ambient sounds for deep rest', count: 3 },
                { id: 'stories' as Category, title: 'Sleep Stories', desc: 'Gentle tales to drift away', count: 2 },
                { id: 'meditations' as Category, title: 'Meditations', desc: 'Guided journeys into rest', count: 2 },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '24px 18px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 16,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >
                  <h3 style={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    fontSize: 15, 
                    fontWeight: 500, 
                    marginBottom: 8,
                    letterSpacing: '-0.01em',
                  }}>
                    {cat.title}
                  </h3>
                  <p style={{ 
                    color: 'rgba(255,255,255,0.4)', 
                    fontSize: 12, 
                    marginBottom: 12,
                    lineHeight: 1.4,
                  }}>
                    {cat.desc}
                  </p>
                  <span style={{ 
                    color: 'rgba(139,92,246,0.7)', 
                    fontSize: 11,
                    letterSpacing: '0.05em',
                  }}>
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
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 20,
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                ← Back to categories
              </button>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {CONTENT[selectedCategory].map((track) => (
                  <button
                    key={track.id}
                    onClick={() => handlePlayTrack(track.title)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 18px',
                      background: currentTrack === track.title 
                        ? 'rgba(139,92,246,0.12)' 
                        : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${currentTrack === track.title 
                        ? 'rgba(139,92,246,0.25)' 
                        : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: 14,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ 
                        color: 'rgba(255,255,255,0.9)', 
                        fontSize: 14, 
                        marginBottom: 4,
                        fontWeight: 450,
                      }}>
                        {track.title}
                      </div>
                      <div style={{ 
                        color: 'rgba(255,255,255,0.4)', 
                        fontSize: 12,
                      }}>
                        {track.duration}
                      </div>
                    </div>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: currentTrack === track.title && isPlaying
                        ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                        : 'rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      color: currentTrack === track.title && isPlaying 
                        ? '#fff' 
                        : 'rgba(255,255,255,0.5)',
                      transition: 'all 0.2s ease',
                    }}>
                      {currentTrack === track.title && isPlaying ? '⏸' : '▶'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sleep Timer */}
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 18px',
          background: 'rgba(15,15,25,0.9)',
          borderRadius: 50,
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span style={{ 
            color: 'rgba(255,255,255,0.45)', 
            fontSize: 12, 
            marginRight: 8,
            letterSpacing: '0.02em',
          }}>
            Sleep timer
          </span>
          {(['15m', '30m', '1h', '∞'] as TimerOption[]).map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTimer(time)}
              style={{
                padding: '7px 12px',
                background: selectedTimer === time ? 'rgba(139,92,246,0.2)' : 'transparent',
                border: 'none',
                borderRadius: 16,
                color: selectedTimer === time ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                fontSize: 12,
                fontWeight: selectedTimer === time ? 500 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}