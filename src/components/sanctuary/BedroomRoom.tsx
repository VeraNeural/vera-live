'use client';

import { useState, useEffect } from 'react';
import { useTheme, ThemeToggle } from '@/contexts/ThemeContext';

import OceanWaves from '@/components/rest/OceanWaves';
import RainOnLeaves from '@/components/rest/RainOnLeaves';
import NightForest from '@/components/rest/NightForest';
import TheQuietVillage from '@/components/rest/TheQuietVillage';
import MoonlitGarden from '@/components/rest/MoonlitGarden';
import BodyScanForSleep from '@/components/rest/BodyScanFoSleep';
import LettingGoOfTheDay from '@/components/rest/LettingGoOfTheDay';

// ============================================================================
// TYPES
// ============================================================================
interface RestChamberProps {
  onBack: () => void;
}

type Category = 'soundscapes' | 'stories' | 'meditations';
type TimerOption = '15m' | '30m' | '1h' | '∞';

type Track = {
  id: string;
  title: string;
  duration: string;
  icon: string;
  hasExperience: boolean;
};

// ============================================================================
// CONSTANTS
// ============================================================================
const CONTENT: Record<Category, Track[]> = {
  soundscapes: [
    { id: 'ocean-waves', title: 'Ocean Waves', duration: '45 min', icon: '〰', hasExperience: true },
    { id: 'rain-on-leaves', title: 'Rain on Leaves', duration: '60 min', icon: '⁘', hasExperience: true },
    { id: 'night-forest', title: 'Night Forest', duration: '30 min', icon: '❋', hasExperience: true },
  ],
  stories: [
    { id: 'quiet-village', title: 'The Quiet Village', duration: '20 min', icon: '◇', hasExperience: true },
    { id: 'moonlit-garden', title: 'Moonlit Garden', duration: '25 min', icon: '☽', hasExperience: true },
  ],
  meditations: [
    { id: 'body-scan', title: 'Body Scan for Sleep', duration: '15 min', icon: '◎', hasExperience: true },
    { id: 'letting-go', title: 'Letting Go of the Day', duration: '20 min', icon: '○', hasExperience: true },
  ],
};

const CATEGORIES = [
  { id: 'soundscapes' as Category, title: 'Soundscapes', desc: 'Ambient sounds for deep rest', count: 3 },
  { id: 'stories' as Category, title: 'Sleep Stories', desc: 'Gentle tales to drift away', count: 2 },
  { id: 'meditations' as Category, title: 'Meditations', desc: 'Guided journeys into rest', count: 2 },
];

const TIMER_OPTIONS: TimerOption[] = ['15m', '30m', '1h', '∞'];

// ============================================================================
// STYLES
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
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  @keyframes breathe {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.05); opacity: 0.8; }
  }

  .card-btn {
    transition: transform 0.2s ease, background 0.2s ease;
  }
  .card-btn:active {
    transform: scale(0.97);
  }

  .timer-btn {
    transition: all 0.2s ease;
  }
  .timer-btn:active {
    transform: scale(0.94);
  }

  .rest-scroll::-webkit-scrollbar {
    width: 3px;
  }
  .rest-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .rest-scroll::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 3px;
  }
`;

// ============================================================================
// COMPONENT
// ============================================================================
export default function RestChamber({ onBack }: RestChamberProps) {
  const { isDark, colors } = useTheme();

  const COLORS = {
    bg: colors.bg,
    text: colors.text,
    textMuted: colors.textMuted,
    textDim: isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(60, 50, 40, 0.35)',
    cardBg: colors.cardBg,
    cardBorder: colors.cardBorder,
    accent: '#8b5cf6',
    accentDim: 'rgba(139, 92, 246, 0.6)',
    accentGlow: colors.glow,
    moonGlow: colors.glow,
  } as const;

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTimer, setSelectedTimer] = useState<TimerOption>('30m');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleStartTrack = (track: Track) => {
    if (!track.hasExperience) return;
    setCurrentTrack(track.title);
    setIsPlaying(true);
    setActiveTrackId(track.id);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setActiveTrackId(null);
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  const handleExitExperience = () => {
    setActiveTrackId(null);
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  if (activeTrackId === 'ocean-waves') {
    return <OceanWaves onBack={handleExitExperience} onComplete={handleExitExperience} />;
  }
  if (activeTrackId === 'rain-on-leaves') {
    return <RainOnLeaves onBack={handleExitExperience} onComplete={handleExitExperience} />;
  }
  if (activeTrackId === 'night-forest') {
    return <NightForest onBack={handleExitExperience} onComplete={handleExitExperience} />;
  }
  if (activeTrackId === 'quiet-village') {
    return <TheQuietVillage onBack={handleExitExperience} onComplete={handleExitExperience} />;
  }
  if (activeTrackId === 'moonlit-garden') {
    return <MoonlitGarden onBack={handleExitExperience} onComplete={handleExitExperience} />;
  }
  if (activeTrackId === 'body-scan') {
    return <BodyScanForSleep onBack={handleExitExperience} onComplete={handleExitExperience} />;
  }
  if (activeTrackId === 'letting-go') {
    return <LettingGoOfTheDay onBack={handleExitExperience} onComplete={handleExitExperience} />;
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <>
      <style jsx global>{GLOBAL_STYLES}</style>

      <div style={{
        position: 'fixed',
        inset: 0,
        background: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        
        {/* ================================================================ */}
        {/* AMBIENT BACKGROUND */}
        {/* ================================================================ */}
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          {/* Moon glow - top right */}
          <div style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '70%',
            height: '50%',
            background: `radial-gradient(ellipse at center, ${COLORS.moonGlow} 0%, transparent 60%)`,
            borderRadius: '50%',
            animation: 'breathe 8s ease-in-out infinite',
          }} />

          {/* Subtle bottom glow */}
          <div style={{
            position: 'absolute',
            bottom: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: '40%',
            background: `radial-gradient(ellipse at center, ${COLORS.accentGlow} 0%, transparent 60%)`,
            borderRadius: '50%',
          }} />

          {/* Simple stars - just a few dots */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: i % 3 === 0 ? 2 : 1,
                height: i % 3 === 0 ? 2 : 1,
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '50%',
                top: `${8 + (i * 7) % 35}%`,
                left: `${5 + (i * 11) % 90}%`,
                opacity: 0.3 + (i % 4) * 0.2,
              }}
            />
          ))}
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
              background: COLORS.cardBg,
              border: `1px solid ${COLORS.cardBorder}`,
              borderRadius: 50,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              color: COLORS.textMuted,
            }}
          >
            ← Sanctuary
          </button>
          
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: COLORS.textDim,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Rest Chamber
          </span>

          <ThemeToggle />
        </header>

        {/* ================================================================ */}
        {/* SCROLLABLE CONTENT */}
        {/* ================================================================ */}
        <div 
          className="rest-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: 100, // Space for timer bar
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            minHeight: '100%',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}>
            
            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 32,
                fontWeight: 300,
                color: COLORS.text,
                marginBottom: 8,
              }}>
                Rest Chamber
              </h1>
              <p style={{
                fontSize: 14,
                color: COLORS.textDim,
                letterSpacing: '0.03em',
              }}>
                Let go of the day
              </p>
            </div>

            {/* ============================================================ */}
            {/* CATEGORY SELECTION */}
            {/* ============================================================ */}
            {!selectedCategory && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
                maxWidth: 360,
                width: '100%',
                animation: 'fadeIn 0.4s ease-out',
              }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    className="card-btn"
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '22px 16px',
                      background: COLORS.cardBg,
                      border: `1px solid ${COLORS.cardBorder}`,
                      borderRadius: 16,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <h3 style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: COLORS.text,
                      marginBottom: 8,
                    }}>
                      {cat.title}
                    </h3>
                    <p style={{
                      fontSize: 12,
                      color: COLORS.textDim,
                      marginBottom: 12,
                      lineHeight: 1.4,
                    }}>
                      {cat.desc}
                    </p>
                    <span style={{
                      fontSize: 11,
                      color: COLORS.accentDim,
                    }}>
                      {cat.count} tracks
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* ============================================================ */}
            {/* TRACK LIST */}
            {/* ============================================================ */}
            {selectedCategory && (
              <div style={{
                width: '100%',
                maxWidth: 400,
                animation: 'fadeIn 0.4s ease-out',
              }}>
                <button
                  onClick={handleBackToCategories}
                  style={{
                    marginBottom: 20,
                    padding: '8px 16px',
                    background: 'transparent',
                    border: `1px solid ${COLORS.cardBorder}`,
                    borderRadius: 20,
                    color: COLORS.textMuted,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  ← All categories
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {CONTENT[selectedCategory].map((track) => (
                    <button
                      key={track.id}
                      className="card-btn"
                      onClick={() => handleStartTrack(track)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 18px',
                        background: currentTrack === track.title 
                          ? 'rgba(139, 92, 246, 0.1)' 
                          : COLORS.cardBg,
                        border: `1px solid ${currentTrack === track.title 
                          ? 'rgba(139, 92, 246, 0.25)' 
                          : COLORS.cardBorder}`,
                        borderRadius: 14,
                        cursor: track.hasExperience ? 'pointer' : 'not-allowed',
                        textAlign: 'left',
                        opacity: track.hasExperience ? 1 : 0.55,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ 
                          fontSize: 20, 
                          opacity: 0.5,
                          color: COLORS.text,
                        }}>
                          {track.icon}
                        </span>
                        <div>
                          <div style={{
                            fontSize: 15,
                            fontWeight: 500,
                            color: COLORS.text,
                            marginBottom: 4,
                          }}>
                            {track.title}
                          </div>
                          <div style={{
                            fontSize: 12,
                            color: COLORS.textDim,
                          }}>
                            {track.duration}
                          </div>
                        </div>
                      </div>
                      
                      {/* Play/Pause Button */}
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: currentTrack === track.title && isPlaying
                          ? `linear-gradient(135deg, ${COLORS.accent} 0%, #7c3aed 100%)`
                          : 'rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: currentTrack === track.title && isPlaying
                          ? `0 4px 16px ${COLORS.accentGlow}`
                          : 'none',
                      }}>
                        {currentTrack === track.title && isPlaying ? (
                          <div style={{ display: 'flex', gap: 3 }}>
                            <div style={{ width: 3, height: 14, background: '#fff', borderRadius: 1 }} />
                            <div style={{ width: 3, height: 14, background: '#fff', borderRadius: 1 }} />
                          </div>
                        ) : (
                          <div style={{
                            width: 0,
                            height: 0,
                            borderTop: '7px solid transparent',
                            borderBottom: '7px solid transparent',
                            borderLeft: `11px solid ${COLORS.textMuted}`,
                            marginLeft: 3,
                          }} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================================================================ */}
        {/* SLEEP TIMER BAR */}
        {/* ================================================================ */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
          background: isDark
            ? 'linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.25) 50%, transparent 100%)'
            : 'linear-gradient(to top, rgba(248, 245, 240, 0.9) 0%, rgba(248, 245, 240, 0.35) 50%, transparent 100%)',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 40,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 18px',
            background: isDark ? 'rgba(15, 12, 25, 0.95)' : 'rgba(255, 255, 255, 0.85)',
            borderRadius: 50,
            border: `1px solid ${COLORS.cardBorder}`,
          }}>
            <span style={{
              color: COLORS.textDim,
              fontSize: 12,
              marginRight: 8,
            }}>
              Sleep timer
            </span>
            {TIMER_OPTIONS.map((time) => (
              <button
                key={time}
                className="timer-btn"
                onClick={() => setSelectedTimer(time)}
                style={{
                  padding: '7px 12px',
                  background: selectedTimer === time 
                    ? 'rgba(139, 92, 246, 0.2)' 
                    : 'transparent',
                  border: 'none',
                  borderRadius: 16,
                  color: selectedTimer === time 
                    ? COLORS.text 
                    : COLORS.textDim,
                  fontSize: 13,
                  fontWeight: selectedTimer === time ? 600 : 400,
                  cursor: 'pointer',
                }}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}