'use client';

import { useState, useEffect } from 'react';
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

  const quickActions = [
    { id: 'overwhelmed', label: "I'm feeling overwhelmed" },
    { id: 'jobs', label: 'Help me find a job' },
    { id: 'write', label: 'Write something' },
    { id: 'build', label: 'Build a project' },
    { id: 'research', label: 'Research a topic' },
    { id: 'talk', label: 'Just talk' },
  ];

  const ecosystem = [
    { id: 'sanctuary', name: 'Sanctuary', essence: 'YOUR SPACE', href: '/sanctuary', iconType: 'home' },
    { id: 'pulse', name: 'Pulse', essence: 'CONNECT WITH OTHERS', href: '/pulse', iconType: 'heart' },
    { id: 'professionals', name: 'Professionals', essence: 'EXPERTS & THERAPISTS', href: '/professionals', iconType: 'users' },
    { id: 'assessment', name: 'Assessment', essence: 'KNOW YOURSELF', href: '/assessment', iconType: 'compass' },
    { id: 'vds', name: 'VDS Studio', essence: 'CREATE BEAUTY', href: 'https://vds.veraneural.com', iconType: 'design' },
    { id: 'sit', name: 'Signal Integrity Trust', essence: 'COMING SOON', href: '#', iconType: 'shield' },
  ];

  // Icon components matching Sanctuary style
  const renderIcon = (type: string, isDark: boolean) => {
    const color = isDark ? 'rgba(160, 140, 180, 0.7)' : 'rgba(120, 100, 140, 0.6)';
    
    switch (type) {
      case 'home':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </svg>
        );
      case 'heart':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c084a0" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        );
      case 'users':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case 'design':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="14" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="15" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        );
      case 'book':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        );
      case 'handshake':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9,12 11,14 15,10" />
          </svg>
        );
      case 'shield':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <circle cx="12" cy="11" r="3" />
          </svg>
        );
      case 'compass':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill={color} opacity="0.3" />
          </svg>
        );
      default:
        return (
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: `2px solid ${color}`,
          }} />
        );
    }
  };

  if (!mounted) {
    return <div style={{ minHeight: '100vh', background: '#f8f6f2' }} />;
  }

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        html, body {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .vera-home {
          min-height: 100vh;
          min-height: 100dvh;
          background: ${isDark
            ? 'linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0d0d18 100%)'
            : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)'};
          transition: background 0.8s ease;
          position: relative;
          overflow-x: hidden;
        }

        /* Header */
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          background: ${isDark 
            ? 'linear-gradient(to bottom, rgba(10, 10, 18, 0.95) 0%, rgba(10, 10, 18, 0) 100%)'
            : 'linear-gradient(to bottom, rgba(248, 246, 242, 0.95) 0%, rgba(248, 246, 242, 0) 100%)'};
          backdrop-filter: blur(12px);
        }

        .logo {
          display: flex;
          align-items: center;
        }

        .logo-text {
          font-size: 1.4rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: ${isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.9)'};
          font-family: 'Cormorant Garamond', Georgia, serif;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-secondary {
          padding: 10px 20px;
          background: transparent;
          border: none;
          color: ${isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)'};
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 50px;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
        }

        .btn-primary {
          padding: 10px 24px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          border-radius: 50px;
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }

        /* Main Content */
        .main {
          padding: 100px 20px 60px;
          max-width: 800px;
          margin: 0 auto;
        }

        /* Hero Section */
        .hero {
          text-align: center;
          margin-bottom: 32px;
        }

        .greeting {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2rem, 6vw, 3rem);
          font-weight: 300;
          color: ${isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.85)'};
          margin-bottom: 8px;
          line-height: 1.2;
        }

        .tagline {
          font-size: clamp(0.95rem, 2.5vw, 1.1rem);
          color: ${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)'};
          font-weight: 300;
        }

        /* Orb */
        .orb-container {
          display: flex;
          justify-content: center;
          margin: 32px 0;
        }

        .orb-wrapper {
          position: relative;
          cursor: pointer;
        }

        .orb {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, 
            rgba(255,255,255,0.3) 0%, 
            rgba(139,92,246,0.5) 30%, 
            rgba(139,92,246,0.4) 60%, 
            rgba(124,58,237,0.3) 100%);
          box-shadow: 
            0 0 ${35 + breathValue * 18}px rgba(139,92,246,${0.25 + breathValue * 0.12}),
            0 0 ${70 + breathValue * 35}px rgba(139,92,246,${0.1 + breathValue * 0.06}),
            inset 0 0 35px rgba(255,255,255,0.15);
          transform: scale(${1 + breathValue * 0.03});
          transition: box-shadow 0.3s ease;
        }

        .orb-ring {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border-radius: 50%;
          border: 1px solid rgba(139, 92, 246, ${0.12 + breathValue * 0.08});
          transform: scale(${0.95 + breathValue * 0.04});
          pointer-events: none;
        }

        .orb-ring-outer {
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          border-color: rgba(139, 92, 246, ${0.06 + breathValue * 0.04});
        }

        .orb-label {
          position: absolute;
          bottom: -26px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.55rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'};
          white-space: nowrap;
        }

        /* Chat Input */
        .chat-section {
          margin-bottom: 36px;
        }

        .chat-container {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 6px 6px 20px;
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
          border-radius: 60px;
          box-shadow: 0 4px 20px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)'};
          backdrop-filter: blur(20px);
        }

        .chat-input {
          flex: 1;
          padding: 14px 0;
          background: transparent;
          border: none;
          font-size: 1rem;
          color: ${isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.9)'};
          outline: none;
          min-width: 0;
        }

        .chat-input::placeholder {
          color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'};
        }

        .chat-submit {
          padding: 14px 28px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          border-radius: 50px;
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .chat-submit:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
        }

        /* Quick Actions */
        .section {
          margin-bottom: 36px;
        }

        .section-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(42,42,42,0.3)'};
          text-align: center;
          margin-bottom: 14px;
        }

        .quick-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
        }

        .quick-action {
          padding: 10px 16px;
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'};
          border-radius: 50px;
          font-size: 0.8rem;
          color: ${isDark ? 'rgba(255,255,255,0.65)' : 'rgba(42,42,42,0.65)'};
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.2s ease;
        }

        .quick-action:hover {
          background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)'};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.06)'};
        }

        /* Ecosystem - Sanctuary Style Cards */
        .ecosystem-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .ecosystem-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          min-height: 120px;
          background: ${isDark 
            ? 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.65) 100%)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
          border-radius: 16px;
          text-align: center;
          cursor: pointer;
          text-decoration: none;
          backdrop-filter: blur(20px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .ecosystem-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        .ecosystem-card:hover {
          transform: translateY(-4px);
          border-color: ${isDark ? 'rgba(140, 120, 200, 0.3)' : 'rgba(160, 140, 120, 0.3)'};
          box-shadow: 
            0 12px 35px ${isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.1)'},
            0 0 25px ${isDark ? 'rgba(140, 120, 200, 0.1)' : 'rgba(160, 140, 120, 0.1)'};
        }

        .ecosystem-icon {
          margin-bottom: 12px;
          opacity: 0.9;
        }

        .ecosystem-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: ${isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.85)'};
          margin-bottom: 4px;
        }

        .ecosystem-essence {
          font-size: 0.55rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${isDark ? 'rgba(255,255,255,0.35)' : 'rgba(42,42,42,0.4)'};
        }

        /* Trust Section */
        .trust {
          text-align: center;
          padding-top: 28px;
          border-top: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'};
        }

        .trust-label {
          font-size: 0.65rem;
          color: ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(42,42,42,0.3)'};
          margin-bottom: 14px;
        }

        .trust-stats {
          display: flex;
          justify-content: center;
          gap: 36px;
        }

        .trust-stat {
          text-align: center;
        }

        .trust-value {
          font-size: 1.3rem;
          font-weight: 600;
          color: ${isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.9)'};
        }

        .trust-name {
          font-size: 0.55rem;
          color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'};
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* VERA Indicator */
        .vera-indicator {
          position: fixed;
          bottom: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: ${isDark ? 'rgba(20, 20, 35, 0.95)' : 'rgba(255,255,255,0.95)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
          border-radius: 50px;
          box-shadow: 0 4px 20px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'};
          backdrop-filter: blur(20px);
          z-index: 100;
        }

        .vera-dot {
          width: 8px;
          height: 8px;
          background: #34d399;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .vera-text {
          font-size: 0.75rem;
          color: ${isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)'};
        }

        /* Responsive */
        @media (min-width: 600px) {
          .ecosystem-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 600px) {
          .header {
            padding: 12px 16px;
          }

          .logo-text {
            font-size: 1.1rem;
          }

          .btn-secondary {
            padding: 8px 12px;
            font-size: 0.8rem;
          }

          .btn-primary {
            padding: 8px 16px;
            font-size: 0.8rem;
          }

          .main {
            padding: 85px 16px 80px;
          }

          .orb {
            width: 75px;
            height: 75px;
          }

          .chat-container {
            padding: 4px 4px 4px 16px;
          }

          .chat-input {
            font-size: 0.9rem;
            padding: 12px 0;
          }

          .chat-submit {
            padding: 12px 20px;
            font-size: 0.85rem;
          }

          .quick-action {
            padding: 8px 12px;
            font-size: 0.75rem;
          }

          .ecosystem-card {
            padding: 20px 12px;
            min-height: 100px;
          }

          .ecosystem-name {
            font-size: 0.8rem;
          }

          .trust-stats {
            gap: 24px;
          }

          .vera-indicator {
            bottom: 16px;
            right: 16px;
            padding: 8px 12px;
          }
        }
      `}</style>

      <div className="vera-home">
        {/* Header */}
        <header className="header">
          <div className="logo">
            <span className="logo-text">VERA</span>
          </div>

          <div className="header-actions">
            <button className="btn-secondary" onClick={() => router.push('/login')}>
              Sign In
            </button>
            <button className="btn-primary" onClick={() => router.push('/signup')}>
              Get Started
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="main">
          {/* Hero */}
          <section className="hero">
            <h1 className="greeting">{getGreeting()}</h1>
            <p className="tagline">AI that helps you do anything — while keeping you grounded</p>
          </section>

          {/* Orb */}
          <div className="orb-container">
            <div className="orb-wrapper" onClick={() => router.push('/chat')}>
              <div className="orb-ring" />
              <div className="orb-ring orb-ring-outer" />
              <div className="orb" />
              <span className="orb-label">Talk to VERA</span>
            </div>
          </div>

          {/* Chat Input */}
          <section className="chat-section">
            <div className="chat-container">
              <input
                type="text"
                className="chat-input"
                placeholder="Ask VERA anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && router.push('/chat')}
              />
              <button className="chat-submit" onClick={() => router.push('/chat')}>
                Ask VERA
              </button>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="section">
            <p className="section-label">Quick start</p>
            <div className="quick-actions">
              {quickActions.map((action) => (
                <div
                  key={action.id}
                  className="quick-action"
                  onClick={() => router.push('/chat')}
                >
                  {action.label}
                </div>
              ))}
            </div>
          </section>

          {/* Ecosystem - Sanctuary Style */}
          <section className="section">
            <p className="section-label">The VERA Ecosystem</p>
            <div className="ecosystem-grid">
              {ecosystem.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="ecosystem-card"
                >
                  <div className="ecosystem-icon">
                    {renderIcon(item.iconType, isDark)}
                  </div>
                  <div className="ecosystem-name">{item.name}</div>
                  <div className="ecosystem-essence">{item.essence}</div>
                </a>
              ))}
            </div>
          </section>

          {/* Trust */}
          <section className="trust">
            <p className="trust-label">Trusted by people who need more than productivity</p>
            <div className="trust-stats">
              <div className="trust-stat">
                <div className="trust-value">50K+</div>
                <div className="trust-name">Conversations</div>
              </div>
              <div className="trust-stat">
                <div className="trust-value">4.9</div>
                <div className="trust-name">Rating</div>
              </div>
              <div className="trust-stat">
                <div className="trust-value">24/7</div>
                <div className="trust-name">Always here</div>
              </div>
            </div>
          </section>
        </main>

        {/* VERA Indicator */}
        <div className="vera-indicator">
          <div className="vera-dot" />
          <span className="vera-text">VERA is here</span>
        </div>
      </div>
    </>
  );
}