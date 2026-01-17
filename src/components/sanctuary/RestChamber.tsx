'use client';

import { useState, useEffect } from 'react';

// ============================================================================
// IMPORT ALL ACTIVITY COMPONENTS FROM REST FOLDER
// ============================================================================
import OceanWaves from '../rest/OceanWaves';
import RainOnLeaves from '../rest/RainOnLeaves';
import NightForest from '../rest/NightForest';
import TheQuietVillage from '../rest/TheQuietVillage';
import MoonlitGarden from '../rest/MoonlitGarden';
import BodyScanForSleep from '../rest/BodyScanForSleep';
import LettingGoOfTheDay from '../rest/LettingGoOfTheDay';

// ============================================================================
// TYPES
// ============================================================================
interface RestChamberProps {
  onBack: () => void;
  initialView?: string;
}

type Category = 'soundscapes' | 'stories' | 'meditations';
type TimerOption = '15m' | '30m' | '1h' | '∞';

type ActivityId = 
  | 'ocean-waves' 
  | 'rain-on-leaves' 
  | 'night-forest'
  | 'the-quiet-village'
  | 'moonlit-garden'
  | 'body-scan-for-sleep'
  | 'letting-go-of-the-day';

type Track = {
  id: ActivityId;
  title: string;
  duration: string;
  icon: string;
};

// ============================================================================
// CONSTANTS
// ============================================================================
const CONTENT: Record<Category, Track[]> = {
  soundscapes: [
    { id: 'ocean-waves', title: 'Ocean Waves', duration: '45 min', icon: '〰' },
    { id: 'rain-on-leaves', title: 'Rain on Leaves', duration: '60 min', icon: '⁘' },
    { id: 'night-forest', title: 'Night Forest', duration: '30 min', icon: '❋' },
  ],
  stories: [
    { id: 'the-quiet-village', title: 'The Quiet Village', duration: '20 min', icon: '◇' },
    { id: 'moonlit-garden', title: 'Moonlit Garden', duration: '25 min', icon: '☽' },
  ],
  meditations: [
    { id: 'body-scan-for-sleep', title: 'Body Scan for Sleep', duration: '15 min', icon: '◎' },
    { id: 'letting-go-of-the-day', title: 'Letting Go of the Day', duration: '20 min', icon: '○' },
  ],
};

const CATEGORIES = [
  { id: 'soundscapes' as Category, title: 'Soundscapes', desc: 'Ambient sounds for deep rest', count: 3 },
  { id: 'stories' as Category, title: 'Sleep Stories', desc: 'Gentle tales to drift away', count: 2 },
  { id: 'meditations' as Category, title: 'Meditations', desc: 'Guided journeys into rest', count: 2 },
];

const TIMER_OPTIONS: TimerOption[] = ['15m', '30m', '1h', '∞'];

// iOS-friendly colors - night/sleep theme
const COLORS = {
  bgGradientStart: '#0a0812',
  bgGradientEnd: '#050508',
  text: 'rgba(255, 255, 255, 0.85)',
  textMuted: 'rgba(255, 255, 255, 0.55)',
  textDim: 'rgba(255, 255, 255, 0.35)',
  cardBg: 'rgba(255, 255, 255, 0.04)',
  cardBorder: 'rgba(255, 255, 255, 0.06)',
  accent: '#8b5cf6',
  accentDim: 'rgba(139, 92, 246, 0.6)',
  accentGlow: 'rgba(139, 92, 246, 0.25)',
  moonGlow: 'rgba(150, 160, 200, 0.06)',
};

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

  @media (max-width: 428px) {
    .rest-category-grid {
      grid-template-columns: 1fr !important;
      max-width: 420px !important;
    }
  }
`;

// ============================================================================
// COMPONENT
// ============================================================================
export default function RestChamber({ onBack, initialView }: RestChamberProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTimer, setSelectedTimer] = useState<TimerOption>('30m');
  const [activeActivity, setActiveActivity] = useState<ActivityId | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const normalizeCategoryFromView = (view?: string): Category | null => {
    const v = (view || '').toLowerCase().trim();
    if (!v) return null;
    if (v === 'soundscapes') return 'soundscapes';
    if (v === 'stories' || v === 'sleep-stories') return 'stories';
    if (v === 'meditations') return 'meditations';
    return null;
  };

  // Jump directly to a category when routed with `?view=`
  useEffect(() => {
    const category = normalizeCategoryFromView(initialView);
    if (!category) return;
    setActiveActivity(null);
    setSelectedCategory(category);
  }, [initialView]);

  const handleOpenActivity = (activityId: ActivityId) => {
    setActiveActivity(activityId);
  };

  const handleBackFromActivity = () => {
    setActiveActivity(null);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  // ============================================================================
  // RENDER ACTIVITY COMPONENT
  // ============================================================================
  if (activeActivity) {
    const activityProps = {
      onBack: handleBackFromActivity,
      onComplete: handleBackFromActivity,
    };

    switch (activeActivity) {
      case 'ocean-waves':
        return <OceanWaves {...activityProps} />;
      case 'rain-on-leaves':
        return <RainOnLeaves {...activityProps} />;
      case 'night-forest':
        return <NightForest {...activityProps} />;
      case 'the-quiet-village':
        return <TheQuietVillage {...activityProps} />;
      case 'moonlit-garden':
        return <MoonlitGarden {...activityProps} />;
      case 'body-scan-for-sleep':
        return <BodyScanForSleep {...activityProps} />;
      case 'letting-go-of-the-day':
        return <LettingGoOfTheDay {...activityProps} />;
      default:
        return null;
    }
  }

  // ============================================================================
  // RENDER MAIN REST CHAMBER UI
  // ============================================================================
  return (
    <>
      <style jsx global>{GLOBAL_STYLES}</style>

      <div style={{
        position: 'fixed',
        inset: 0,
        background: `linear-gradient(180deg, ${COLORS.bgGradientStart} 0%, ${COLORS.bgGradientEnd} 100%)`,
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
            background: 'radial-gradient(ellipse at center, rgba(100, 80, 140, 0.04) 0%, transparent 60%)',
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
              minHeight: 44,
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
          
          <div style={{ width: 100 }} />
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
              }} className="rest-category-grid">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    className="card-btn"
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '22px 16px',
                      minHeight: 44,
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
                    minHeight: 44,
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
                      onClick={() => handleOpenActivity(track.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 18px',
                        background: COLORS.cardBg,
                        border: `1px solid ${COLORS.cardBorder}`,
                        borderRadius: 14,
                        cursor: 'pointer',
                        textAlign: 'left',
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
                      
                      {/* Play Button */}
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <div style={{
                          width: 0,
                          height: 0,
                          borderTop: '7px solid transparent',
                          borderBottom: '7px solid transparent',
                          borderLeft: `11px solid ${COLORS.textMuted}`,
                          marginLeft: 3,
                        }} />
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
          background: `linear-gradient(to top, ${COLORS.bgGradientEnd} 0%, ${COLORS.bgGradientEnd}ee 50%, transparent 100%)`,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 40,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 18px',
            background: 'rgba(15, 12, 25, 0.95)',
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