'use client';

import { useState, useEffect, CSSProperties } from 'react';
import { useRouter } from 'next/navigation';

export default function VeraHome() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [breathPhase, setBreathPhase] = useState(0);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setMounted(true);
    
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
    else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');

    const breathInterval = setInterval(() => {
      setBreathPhase(prev => (prev + 1) % 100);
    }, 80);

    return () => clearInterval(breathInterval);
  }, []);

  const isDark = timeOfDay === 'evening' || timeOfDay === 'night';
  const breathValue = Math.sin(breathPhase * 0.0628) * 0.5 + 0.5;

  const getGreeting = () => {
    switch (timeOfDay) {
      case 'morning': return 'Good morning';
      case 'afternoon': return 'Good afternoon';
      case 'evening': return 'Good evening';
      case 'night': return 'Welcome';
    }
  };

  const explore = [
    { id: 'jobs', label: 'Find a job' },
    { id: 'build', label: 'Build something' },
    { id: 'write', label: 'Write with me' },
    { id: 'research', label: 'Research a topic' },
    { id: 'learn', label: 'Learn a skill' },
    { id: 'design', label: 'Design help' },
    { id: 'business', label: 'Business strategy' },
    { id: 'talk', label: 'Just talk' },
  ];

  const ecosystem = [
    { id: 'sanctuary', name: 'Sanctuary', desc: '7 immersive healing rooms', href: '/sanctuary' },
    { id: 'pulse', name: 'Pulse', desc: 'Community where everyone gets seen', href: '/pulse' },
    { id: 'vds', name: 'VDS Studio', desc: 'Professional design services', href: 'https://vds.veraneural.com' },
    { id: 'edutask', name: 'Edutask', desc: 'Courses and certifications', href: '/edutask' },
    { id: 'therapists', name: 'Therapists', desc: 'Trusted professional support', href: '/therapists' },
    { id: 'partners', name: 'Partners', desc: 'Businesses you can trust', href: '/partners' },
  ];

  const dustPositions = [65, 78, 45, 82, 55, 72, 38, 88, 50, 75, 42, 68];

  const colors = {
    bg: isDark
      ? 'linear-gradient(180deg, #0a0a12 0%, #12121f 40%, #0d0d18 100%)'
      : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)',
    text: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(42,42,42,0.8)',
    textMuted: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)',
    textFaint: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(42,42,42,0.4)',
    cardBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.65)',
    cardBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
    windowBg: isDark
      ? 'linear-gradient(180deg, #0a1020 0%, #151535 40%, #0d0d28 100%)'
      : 'linear-gradient(180deg, #d4e8f0 0%, #b8d8e8 30%, #a8d0e0 60%, #c8e0ec 100%)',
    windowFrame: isDark ? '#252540' : '#c8b8a8',
    treeLine: isDark 
      ? 'linear-gradient(180deg, transparent 0%, rgba(20, 35, 30, 0.6) 50%, rgba(15, 30, 25, 0.8) 100%)'
      : 'linear-gradient(180deg, transparent 0%, rgba(100, 130, 100, 0.3) 50%, rgba(80, 110, 80, 0.4) 100%)',
    treeCanopy1: isDark ? 'rgba(30, 50, 40, 0.9)' : 'rgba(80, 110, 80, 0.7)',
    treeCanopy2: isDark ? 'rgba(25, 45, 35, 0.95)' : 'rgba(70, 100, 70, 0.75)',
    treeCanopy3: isDark ? 'rgba(35, 55, 45, 0.85)' : 'rgba(90, 120, 85, 0.65)',
    treeTrunk: isDark ? '#1a1a30' : '#6b7b68',
    beam: isDark
      ? 'linear-gradient(180deg, rgba(100, 120, 200, 0.1) 0%, transparent 70%)'
      : 'linear-gradient(180deg, rgba(255, 252, 245, 0.4) 0%, transparent 70%)',
    dust: isDark ? 'rgba(180, 190, 255, 0.4)' : 'rgba(255, 250, 240, 0.8)',
    floor: isDark
      ? 'linear-gradient(180deg, transparent 0%, rgba(18, 18, 30, 0.5) 50%, rgba(10, 10, 18, 0.8) 100%)'
      : 'linear-gradient(180deg, transparent 0%, rgba(235, 229, 219, 0.5) 50%, rgba(220, 212, 200, 0.7) 100%)',
  };

  // Styles as objects to avoid type issues
  const styles: Record<string, CSSProperties> = {
    container: {
      minHeight: '100vh',
      fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
      background: colors.bg,
      transition: 'background 1s ease',
      position: 'relative',
      overflowX: 'hidden',
    },
    vignette: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      pointerEvents: 'none',
      background: `radial-gradient(ellipse at center, transparent 40%, ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.08)'} 100%)`,
      zIndex: 1,
    },
    bgElements: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      pointerEvents: 'none',
      zIndex: 0,
    },
    windowArea: {
      position: 'absolute',
      top: '8%',
      right: '6%',
      width: '22%',
      maxWidth: '240px',
    },
    windowFrame: {
      width: '100%',
      paddingBottom: '133%', // 3:4 aspect ratio
      position: 'relative',
      background: colors.windowBg,
      border: `5px solid ${colors.windowFrame}`,
      borderRadius: '4px',
      boxShadow: `inset 0 0 60px ${isDark ? 'rgba(100, 120, 200, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
      overflow: 'hidden',
    },
    header: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 32px',
      background: `linear-gradient(to bottom, ${isDark ? 'rgba(10, 10, 18, 0.9)' : 'rgba(248, 246, 242, 0.9)'} 0%, transparent 100%)`,
      backdropFilter: 'blur(10px)',
    },
    main: {
      position: 'relative',
      zIndex: 10,
      minHeight: '100vh',
      padding: '120px 32px 80px',
      maxWidth: '900px',
      margin: '0 auto',
    },
    heroSection: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '40px',
      marginBottom: '50px',
      flexWrap: 'wrap',
    },
    greeting: {
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
      fontWeight: 300,
      color: colors.text,
      margin: '0 0 12px 0',
      lineHeight: 1.2,
    },
    chatContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '6px 6px 6px 24px',
      background: colors.cardBg,
      border: `1px solid ${colors.cardBorder}`,
      borderRadius: '60px',
      boxShadow: `0 4px 30px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)'}`,
      backdropFilter: 'blur(20px)',
    },
    chatInput: {
      flex: 1,
      padding: '16px 0',
      background: 'transparent',
      border: 'none',
      fontSize: '1rem',
      color: colors.text,
      outline: 'none',
    },
    chatSubmit: {
      padding: '16px 32px',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
      border: 'none',
      borderRadius: '50px',
      color: 'white',
      fontSize: '0.95rem',
      fontWeight: 500,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    },
    sectionLabel: {
      fontSize: '0.7rem',
      textTransform: 'uppercase',
      letterSpacing: '0.2em',
      color: colors.textFaint,
      textAlign: 'center',
      marginBottom: '20px',
    },
    exploreGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '10px',
    },
    exploreItem: {
      padding: '12px 22px',
      background: colors.cardBg,
      border: `1px solid ${colors.cardBorder}`,
      borderRadius: '50px',
      fontSize: '0.9rem',
      color: colors.textMuted,
      cursor: 'pointer',
      backdropFilter: 'blur(10px)',
    },
    ecosystemGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '14px',
    },
    ecosystemCard: {
      padding: '24px 18px',
      background: colors.cardBg,
      border: `1px solid ${colors.cardBorder}`,
      borderRadius: '18px',
      textAlign: 'center',
      cursor: 'pointer',
      textDecoration: 'none',
      backdropFilter: 'blur(15px)',
    },
    trustSection: {
      textAlign: 'center',
      paddingTop: '30px',
      borderTop: `1px solid ${colors.cardBorder}`,
    },
    trustStats: {
      display: 'flex',
      justifyContent: 'center',
      gap: '50px',
    },
    veraIndicator: {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 18px',
      background: isDark ? 'rgba(25, 25, 40, 0.9)' : 'rgba(255,255,255,0.9)',
      border: `1px solid ${colors.cardBorder}`,
      borderRadius: '50px',
      boxShadow: `0 4px 25px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`,
      backdropFilter: 'blur(20px)',
      zIndex: 100,
    },
  };

  if (!mounted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)',
      }} />
    );
  }

  return (
    <div style={styles.container}>
      
      {/* Vignette */}
      <div style={styles.vignette} />

      {/* Background Elements */}
      <div style={styles.bgElements}>
        {/* Window */}
        <div style={styles.windowArea}>
          <div style={styles.windowFrame}>
            {/* Trees inside window */}
            <div style={{
              position: 'absolute',
              bottom: '10%',
              left: 0,
              right: 0,
              height: '55%',
            }}>
              {/* Tree Line */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: '-10%',
                right: '-10%',
                height: '25%',
                background: colors.treeLine,
                borderRadius: '100% 100% 0 0',
              }} />
              
              {/* Trees */}
              {[
                { left: '18%', trunkW: 5, trunkH: 20, canopyW: 30, canopyH: 40, color: colors.treeCanopy1 },
                { left: '45%', trunkW: 7, trunkH: 28, canopyW: 42, canopyH: 52, color: colors.treeCanopy2 },
                { left: '72%', trunkW: 4, trunkH: 16, canopyW: 26, canopyH: 32, color: colors.treeCanopy3 },
              ].map((tree, i) => (
                <div key={i} style={{ position: 'absolute', bottom: '15%', left: tree.left }}>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: tree.trunkW,
                    height: tree.trunkH,
                    background: colors.treeTrunk,
                    borderRadius: 2,
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: tree.trunkH,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: tree.canopyW,
                    height: tree.canopyH,
                    background: tree.color,
                    borderRadius: '50% 50% 45% 45%',
                  }} />
                </div>
              ))}
            </div>

            {/* Moon */}
            {isDark && (
              <div style={{
                position: 'absolute',
                top: '15%',
                right: '20%',
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #f4f4ff 0%, #d8d8f0 50%, #b8b8e0 100%)',
                boxShadow: '0 0 25px rgba(200, 210, 255, 0.5)',
              }} />
            )}

            {/* Mullions */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 5,
              height: '100%',
              background: colors.windowFrame,
              zIndex: 2,
            }} />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
              width: '100%',
              height: 5,
              background: colors.windowFrame,
              zIndex: 2,
            }} />
          </div>
        </div>

        {/* Light Beams */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: '5%',
          width: '45%',
          height: '100%',
          overflow: 'hidden',
          opacity: isDark ? 0.15 : 0.6,
        }}>
          {[
            { left: '20%', w: 100, h: '110%', rotate: -12 },
            { left: '45%', w: 70, h: '100%', rotate: -8, opacity: 0.6 },
            { left: '65%', w: 90, h: '105%', rotate: -14, opacity: 0.4 },
          ].map((beam, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: '-10%',
              left: beam.left,
              width: beam.w,
              height: beam.h,
              background: colors.beam,
              transform: `rotate(${beam.rotate}deg)`,
              transformOrigin: 'top center',
              opacity: beam.opacity || 1,
            }} />
          ))}
        </div>

        {/* Floor */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '35%',
          background: colors.floor,
        }} />
      </div>

      {/* Header */}
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
          }}>
            <span style={{
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 600,
              fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}>V</span>
          </div>
          <span style={{
            fontSize: '1.4rem',
            fontWeight: 400,
            letterSpacing: '0.1em',
            color: colors.text,
          }}>VERA</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button style={{
            padding: '10px 20px',
            background: 'transparent',
            border: 'none',
            color: colors.textMuted,
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}>Sign In</button>
          <button style={{
            padding: '12px 28px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
            border: 'none',
            borderRadius: 50,
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
          }}>Get Started</button>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>

        {/* Hero */}
        <section style={styles.heroSection}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h1 style={styles.greeting}>{getGreeting()}</h1>
            <p style={{
              fontSize: '1.05rem',
              color: colors.textMuted,
              fontWeight: 300,
              margin: 0,
              lineHeight: 1.5,
            }}>AI that helps you do anything — your way, your pace</p>
          </div>

          {/* Orb */}
          <div 
            onClick={() => router.push('/chat')}
            style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}
          >
            <div style={{
              position: 'absolute',
              top: -14, left: -14, right: -14, bottom: -14,
              borderRadius: '50%',
              border: `1px solid rgba(139, 92, 246, ${0.18 + breathValue * 0.12})`,
              transform: `scale(${0.95 + breathValue * 0.07})`,
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              top: -28, left: -28, right: -28, bottom: -28,
              borderRadius: '50%',
              border: `1px solid rgba(139, 92, 246, ${0.08 + breathValue * 0.06})`,
              pointerEvents: 'none',
            }} />
            <div style={{
              width: 110,
              height: 110,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.3) 0%, rgba(139,92,246,0.5) 30%, rgba(139,92,246,0.4) 60%, rgba(124,58,237,0.3) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 ${45 + breathValue * 25}px rgba(139,92,246,${0.3 + breathValue * 0.15}), 0 0 ${90 + breathValue * 45}px rgba(139,92,246,${0.12 + breathValue * 0.08}), inset 0 0 45px rgba(255,255,255,0.15)`,
              transform: `scale(${1 + breathValue * 0.04})`,
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
              }} />
            </div>
            <span style={{
              position: 'absolute',
              bottom: -28,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.65rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: colors.textFaint,
              whiteSpace: 'nowrap',
            }}>Talk to VERA</span>
          </div>
        </section>

        {/* Chat */}
        <section style={{ marginBottom: 50 }}>
          <div style={styles.chatContainer}>
            <input
              type="text"
              placeholder="Ask VERA anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && router.push('/chat')}
              style={styles.chatInput}
            />
            <button onClick={() => router.push('/chat')} style={styles.chatSubmit}>
              Ask VERA
            </button>
          </div>
        </section>

        {/* Explore */}
        <section style={{ marginBottom: 50 }}>
          <p style={styles.sectionLabel}>Explore what VERA can do</p>
          <div style={styles.exploreGrid}>
            {explore.map((item) => (
              <div key={item.id} onClick={() => router.push('/chat')} style={styles.exploreItem}>
                {item.label}
              </div>
            ))}
          </div>
        </section>

        {/* Ecosystem */}
        <section style={{ marginBottom: 50 }}>
          <p style={styles.sectionLabel}>The VERA Ecosystem</p>
          <div style={styles.ecosystemGrid}>
            {ecosystem.map((space) => (
              <a
                key={space.id}
                href={space.href}
                style={styles.ecosystemCard}
                onClick={(e) => {
                  const isExternal =
                    space.href.startsWith('http://') || space.href.startsWith('https://');
                  if (!isExternal) {
                    e.preventDefault();
                    router.push(space.href);
                  }
                }}
                target={space.href.startsWith('http://') || space.href.startsWith('https://') ? '_blank' : undefined}
                rel={space.href.startsWith('http://') || space.href.startsWith('https://') ? 'noreferrer' : undefined}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  margin: '0 auto 14px',
                  borderRadius: 12,
                  background: isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: `2px solid ${isDark ? 'rgba(167,139,250,0.8)' : 'rgba(139,92,246,0.7)'}`,
                  }} />
                </div>
                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: colors.text,
                  marginBottom: 6,
                }}>{space.name}</div>
                <div style={{
                  fontSize: '0.75rem',
                  color: colors.textFaint,
                  lineHeight: 1.4,
                }}>{space.desc}</div>
              </a>
            ))}
          </div>
        </section>

        {/* Trust */}
        <section style={styles.trustSection}>
          <p style={{ fontSize: '0.75rem', color: colors.textFaint, marginBottom: 20 }}>
            Trusted by people who need more than productivity
          </p>
          <div style={styles.trustStats}>
            {[
              { value: '50K+', label: 'Conversations' },
              { value: '4.9', label: 'Rating' },
              { value: '24/7', label: 'Always here' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.6rem',
                  fontWeight: 600,
                  color: colors.text,
                  marginBottom: 4,
                }}>{stat.value}</div>
                <div style={{
                  fontSize: '0.65rem',
                  color: colors.textFaint,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* VERA Indicator */}
      <div style={styles.veraIndicator}>
        <div style={{
          width: 8,
          height: 8,
          background: '#34d399',
          borderRadius: '50%',
        }} />
        <span style={{ fontSize: '0.8rem', color: colors.textMuted }}>
          VERA is here
        </span>
      </div>
    </div>
  );
}