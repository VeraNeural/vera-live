'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// ============================================================================
// TYPES
// ============================================================================
type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

type Room = {
  id: string;
  name: string;
  essence: string;
  icon: string;
  gradient: string;
};

// ============================================================================
// CONSTANTS
// ============================================================================
const ROOMS: Room[] = [
  { 
    id: 'recalibration', 
    name: 'Recalibration', 
    essence: 'Find your center', 
    icon: '◎',
    gradient: 'linear-gradient(135deg, rgba(120, 100, 180, 0.15) 0%, rgba(100, 120, 160, 0.1) 100%)',
  },
  { 
    id: 'zen', 
    name: 'Zen Garden', 
    essence: 'Embrace stillness', 
    icon: '❋',
    gradient: 'linear-gradient(135deg, rgba(100, 140, 120, 0.15) 0%, rgba(120, 150, 130, 0.1) 100%)',
  },
  { 
    id: 'library', 
    name: 'Library', 
    essence: 'Discover wisdom', 
    icon: '▤',
    gradient: 'linear-gradient(135deg, rgba(160, 130, 100, 0.15) 0%, rgba(140, 120, 100, 0.1) 100%)',
  },
  { 
    id: 'rest', 
    name: 'Rest Chamber', 
    essence: 'Surrender to sleep', 
    icon: '☽',
    gradient: 'linear-gradient(135deg, rgba(100, 110, 140, 0.15) 0%, rgba(90, 100, 130, 0.1) 100%)',
  },
  { 
    id: 'studio', 
    name: 'Design Studio', 
    essence: 'Create beauty', 
    icon: '◈',
    gradient: 'linear-gradient(135deg, rgba(180, 120, 140, 0.15) 0%, rgba(160, 130, 150, 0.1) 100%)',
  },
  { 
    id: 'journal', 
    name: 'Journal Nook', 
    essence: 'Reflect deeply', 
    icon: '▢',
    gradient: 'linear-gradient(135deg, rgba(200, 170, 120, 0.15) 0%, rgba(180, 160, 130, 0.1) 100%)',
  },
];

const TIME_COLORS = {
  morning: {
    bg: 'linear-gradient(180deg, #f8f5f0 0%, #f0e8dc 30%, #e8dcc8 100%)',
    accent: '#d4a574',
    text: 'rgba(60, 50, 40, 0.9)',
    textMuted: 'rgba(60, 50, 40, 0.5)',
    cardBg: 'rgba(255, 255, 255, 0.75)',
    cardBorder: 'rgba(0, 0, 0, 0.06)',
    glow: 'rgba(255, 200, 120, 0.2)',
  },
  afternoon: {
    bg: 'linear-gradient(180deg, #f5f2ed 0%, #ebe3d5 30%, #dfd5c2 100%)',
    accent: '#c49a6c',
    text: 'rgba(55, 45, 35, 0.9)',
    textMuted: 'rgba(55, 45, 35, 0.45)',
    cardBg: 'rgba(255, 255, 255, 0.7)',
    cardBorder: 'rgba(0, 0, 0, 0.05)',
    glow: 'rgba(255, 180, 100, 0.15)',
  },
  evening: {
    bg: 'linear-gradient(180deg, #1e1a28 0%, #15121c 50%, #0e0b14 100%)',
    accent: '#c9a87c',
    text: 'rgba(255, 250, 240, 0.9)',
    textMuted: 'rgba(255, 250, 240, 0.45)',
    cardBg: 'rgba(255, 255, 255, 0.06)',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    glow: 'rgba(255, 180, 100, 0.08)',
  },
  night: {
    bg: 'linear-gradient(180deg, #0a0810 0%, #06050a 50%, #030305 100%)',
    accent: '#a08060',
    text: 'rgba(255, 250, 245, 0.85)',
    textMuted: 'rgba(255, 250, 245, 0.35)',
    cardBg: 'rgba(255, 255, 255, 0.04)',
    cardBorder: 'rgba(255, 255, 255, 0.06)',
    glow: 'rgba(255, 200, 120, 0.05)',
  },
};

// ============================================================================
// GLOBAL STYLES
// ============================================================================
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }
  
  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
  }
  
  body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
    overscroll-behavior: none;
    touch-action: pan-y;
    position: fixed;
    inset: 0;
  }

  /* Scrollbar styling */
  .sanctuary-scroll::-webkit-scrollbar {
    width: 4px;
  }
  .sanctuary-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .sanctuary-scroll::-webkit-scrollbar-thumb {
    background: rgba(150, 140, 130, 0.3);
    border-radius: 4px;
  }

  /* Animations */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  @keyframes gentlePulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 0.9; transform: scale(1.02); }
  }

  @keyframes twinkle {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.9; }
  }

  @keyframes flicker {
    0%, 100% { opacity: 0.85; transform: scaleY(1); }
    25% { opacity: 1; transform: scaleY(1.04); }
    50% { opacity: 0.9; transform: scaleY(0.98); }
    75% { opacity: 0.95; transform: scaleY(1.02); }
  }

  /* Room card interactions */
  .room-card {
    transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    transform: translateZ(0);
    will-change: transform;
  }
  
  .room-card:hover {
    transform: translateY(-3px) scale(1.02);
  }
  
  .room-card:active {
    transform: translateY(0) scale(0.98);
  }

  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    .room-card:hover {
      transform: none;
    }
    .room-card:active {
      transform: scale(0.97);
    }
  }

  /* Safe area handling */
  .safe-area-top {
    padding-top: max(env(safe-area-inset-top, 0px), 12px);
  }
  .safe-area-bottom {
    padding-bottom: max(env(safe-area-inset-bottom, 0px), 20px);
  }
`;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

const getGreeting = (time: TimeOfDay): string => {
  switch (time) {
    case 'morning': return 'Good morning';
    case 'afternoon': return 'Good afternoon';
    case 'evening': return 'Good evening';
    case 'night': return 'Welcome back';
  }
};

// ============================================================================
// COMPONENT
// ============================================================================
export default function SanctuaryHub() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [manualTheme, setManualTheme] = useState<'light' | 'dark' | 'auto'>('auto');

  useEffect(() => {
    setMounted(true);
    setTimeOfDay(getTimeOfDay());
    
    // Update time periodically
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRoomClick = useCallback((roomId: string) => {
    router.push(`/sanctuary/${roomId}`);
  }, [router]);

  // Determine if dark mode based on manual override or auto time
  const isDark = manualTheme === 'dark' 
    ? true 
    : manualTheme === 'light' 
      ? false 
      : (timeOfDay === 'evening' || timeOfDay === 'night');
  
  // Use appropriate colors based on dark mode
  const colors = isDark ? TIME_COLORS.evening : TIME_COLORS[timeOfDay];

  // Loading state
  if (!mounted) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#f5f2ed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: 32,
          height: 32,
          border: '2px solid rgba(150, 130, 110, 0.2)',
          borderTopColor: 'rgba(150, 130, 110, 0.7)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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
      }}>
        
        {/* ================================================================ */}
        {/* AMBIENT BACKGROUND - Warm light effects */}
        {/* ================================================================ */}
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          {/* Primary warm glow - center top */}
          <div style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(120vw, 700px)',
            height: 'min(80vh, 500px)',
            background: isDark
              ? 'radial-gradient(ellipse at 50% 30%, rgba(255, 180, 100, 0.08) 0%, rgba(255, 150, 80, 0.03) 40%, transparent 70%)'
              : 'radial-gradient(ellipse at 50% 30%, rgba(255, 220, 180, 0.4) 0%, rgba(255, 200, 150, 0.15) 40%, transparent 70%)',
            borderRadius: '50%',
            animation: 'gentlePulse 10s ease-in-out infinite',
          }} />

          {/* Secondary warm glow - bottom left */}
          <div style={{
            position: 'absolute',
            bottom: '5%',
            left: '-15%',
            width: 'min(60vw, 350px)',
            height: 'min(60vw, 350px)',
            background: isDark
              ? 'radial-gradient(circle, rgba(255, 160, 100, 0.06) 0%, transparent 60%)'
              : 'radial-gradient(circle, rgba(255, 200, 150, 0.25) 0%, transparent 60%)',
            borderRadius: '50%',
            animation: 'gentlePulse 12s ease-in-out infinite 2s',
          }} />

          {/* Tertiary warm glow - bottom right */}
          <div style={{
            position: 'absolute',
            bottom: '10%',
            right: '-10%',
            width: 'min(50vw, 300px)',
            height: 'min(50vw, 300px)',
            background: isDark
              ? 'radial-gradient(circle, rgba(200, 150, 100, 0.05) 0%, transparent 60%)'
              : 'radial-gradient(circle, rgba(255, 210, 170, 0.2) 0%, transparent 60%)',
            borderRadius: '50%',
            animation: 'gentlePulse 14s ease-in-out infinite 4s',
          }} />

          {/* Floating light particles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${15 + (i * 13) % 60}%`,
                left: `${10 + (i * 17) % 80}%`,
                width: isDark ? 'clamp(2px, 0.5vw, 4px)' : 'clamp(3px, 0.8vw, 6px)',
                height: isDark ? 'clamp(2px, 0.5vw, 4px)' : 'clamp(3px, 0.8vw, 6px)',
                background: isDark
                  ? 'rgba(255, 200, 150, 0.3)'
                  : 'rgba(255, 220, 180, 0.6)',
                borderRadius: '50%',
                boxShadow: isDark
                  ? '0 0 8px rgba(255, 180, 120, 0.3)'
                  : '0 0 12px rgba(255, 200, 150, 0.5)',
                animation: `float ${6 + i * 1.5}s ease-in-out infinite, twinkle ${4 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}

          {/* Subtle grain texture overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: isDark ? 0.03 : 0.02,
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* ================================================================ */}
        {/* MAIN SCROLLABLE CONTENT */}
        {/* ================================================================ */}
        <div 
          className="sanctuary-scroll safe-area-top"
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div style={{
            minHeight: '100%',
            padding: 'clamp(16px, 4vw, 24px)',
            paddingTop: 'clamp(20px, 5vh, 40px)',
            paddingBottom: 'clamp(40px, 10vh, 80px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            
            {/* ============================================================ */}
            {/* GREETING SECTION */}
            {/* ============================================================ */}
            <header style={{
              textAlign: 'center',
              marginBottom: 'clamp(20px, 4vh, 32px)',
              animation: 'fadeInUp 0.6s ease-out',
            }}>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(2rem, 8vw, 3.2rem)',
                fontWeight: 300,
                color: colors.text,
                marginBottom: 'clamp(6px, 1.5vw, 10px)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}>
                {getGreeting(timeOfDay)}
              </h1>
              <p style={{
                fontSize: 'clamp(0.65rem, 2.8vw, 0.8rem)',
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: colors.textMuted,
              }}>
                Your sanctuary awaits
              </p>
            </header>

            {/* ============================================================ */}
            {/* THEME TOGGLE */}
            {/* ============================================================ */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 'clamp(24px, 5vh, 40px)',
              animation: 'fadeInUp 0.6s ease-out 0.1s both',
            }}>
              <span style={{
                fontSize: 12,
                color: colors.textMuted,
                fontWeight: 500,
              }}>
                {manualTheme === 'auto' ? 'Auto' : manualTheme === 'light' ? 'Light' : 'Dark'}
              </span>
              
              {/* Three-way toggle: Light / Auto / Dark */}
              <div style={{
                display: 'flex',
                gap: 4,
                padding: 4,
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                borderRadius: 20,
              }}>
                {(['light', 'auto', 'dark'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setManualTheme(mode)}
                    aria-label={`${mode} mode`}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 16,
                      border: 'none',
                      background: manualTheme === mode 
                        ? (isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.9)')
                        : 'transparent',
                      color: manualTheme === mode 
                        ? colors.text 
                        : colors.textMuted,
                      fontSize: 11,
                      fontWeight: manualTheme === mode ? 600 : 400,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      transition: 'all 0.2s ease',
                      boxShadow: manualTheme === mode 
                        ? (isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)')
                        : 'none',
                    }}
                  >
                    {mode === 'auto' ? '◐' : mode === 'light' ? '○' : '●'}
                  </button>
                ))}
              </div>
            </div>

            {/* ============================================================ */}
            {/* ROOM CARDS GRID */}
            {/* ============================================================ */}
            <section style={{
              width: '100%',
              maxWidth: 500,
              animation: 'fadeInUp 0.6s ease-out 0.1s both',
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 'clamp(12px, 3.5vw, 18px)',
              }}>
                {ROOMS.map((room, index) => (
                  <button
                    key={room.id}
                    className="room-card"
                    onClick={() => handleRoomClick(room.id)}
                    onMouseEnter={() => setHoveredRoom(room.id)}
                    onMouseLeave={() => setHoveredRoom(null)}
                    style={{
                      position: 'relative',
                      padding: 'clamp(20px, 5.5vw, 30px) clamp(14px, 3.5vw, 20px)',
                      background: isDark
                        ? (hoveredRoom === room.id 
                            ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 250, 240, 0.06) 100%)'
                            : 'linear-gradient(145deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 250, 240, 0.03) 100%)')
                        : (hoveredRoom === room.id
                            ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 252, 245, 0.9) 100%)'
                            : 'linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 252, 248, 0.7) 100%)'),
                      border: `1px solid ${isDark
                        ? (hoveredRoom === room.id ? 'rgba(255, 220, 180, 0.15)' : 'rgba(255, 255, 255, 0.06)')
                        : (hoveredRoom === room.id ? 'rgba(220, 200, 170, 0.4)' : 'rgba(255, 255, 255, 0.6)')}`,
                      borderRadius: 'clamp(16px, 4vw, 24px)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      outline: 'none',
                      overflow: 'hidden',
                      animation: `fadeInUp 0.5s ease-out ${0.1 + index * 0.06}s both`,
                      boxShadow: isDark
                        ? (hoveredRoom === room.id
                            ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 200, 150, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                            : '0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.03)')
                        : (hoveredRoom === room.id
                            ? '0 8px 32px rgba(180, 150, 120, 0.2), 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                            : '0 4px 16px rgba(180, 150, 120, 0.12), 0 1px 4px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)'),
                    }}
                  >
                    {/* Warm glow overlay on hover */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: hoveredRoom === room.id 
                        ? (isDark 
                            ? 'radial-gradient(ellipse at 50% 30%, rgba(255, 200, 150, 0.1) 0%, transparent 70%)'
                            : 'radial-gradient(ellipse at 50% 30%, rgba(255, 220, 180, 0.3) 0%, transparent 70%)')
                        : 'transparent',
                      transition: 'background 0.4s ease',
                      borderRadius: 'inherit',
                    }} />
                    
                    {/* Content */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      {/* Icon */}
                      <div style={{
                        fontSize: 'clamp(1.5rem, 6vw, 2rem)',
                        marginBottom: 'clamp(10px, 3vw, 16px)',
                        opacity: hoveredRoom === room.id ? 1 : 0.65,
                        color: isDark 
                          ? (hoveredRoom === room.id ? 'rgba(255, 230, 200, 0.9)' : colors.text)
                          : (hoveredRoom === room.id ? 'rgba(120, 100, 80, 0.9)' : colors.text),
                        transition: 'all 0.3s ease',
                        animation: hoveredRoom === room.id ? 'float 3s ease-in-out infinite' : 'none',
                        textShadow: hoveredRoom === room.id
                          ? (isDark ? '0 0 20px rgba(255, 200, 150, 0.3)' : '0 0 20px rgba(200, 170, 130, 0.3)')
                          : 'none',
                      }}>
                        {room.icon}
                      </div>
                      
                      {/* Name */}
                      <div style={{
                        fontSize: 'clamp(0.85rem, 3.8vw, 1rem)',
                        fontWeight: 600,
                        color: colors.text,
                        marginBottom: 'clamp(4px, 1.2vw, 8px)',
                        lineHeight: 1.2,
                      }}>
                        {room.name}
                      </div>
                      
                      {/* Essence */}
                      <div style={{
                        fontSize: 'clamp(0.65rem, 2.8vw, 0.75rem)',
                        letterSpacing: '0.03em',
                        color: colors.textMuted,
                        lineHeight: 1.4,
                      }}>
                        {room.essence}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>

      </div>
    </>
  );
}