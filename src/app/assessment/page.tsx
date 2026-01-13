'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AssessmentLanding() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  useEffect(() => {
    setMounted(true);
    
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
    else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);

  const isDark = timeOfDay === 'evening' || timeOfDay === 'night';
  const iconColor = isDark ? 'rgba(160, 140, 180, 0.7)' : 'rgba(120, 100, 140, 0.6)';

  const mappingModules = [
    { 
      id: 'nervous-system', 
      title: 'Nervous System Map', 
      desc: 'How your system responds to stress, safety, and stimulation',
      duration: '5 min',
      available: true
    },
    { 
      id: 'signal-integrity', 
      title: 'Signal Integrity Map', 
      desc: 'Your cognitive load tolerance and attention boundaries',
      duration: '5 min',
      available: true
    },
    { 
      id: 'lifestyle', 
      title: 'Lifestyle Decode', 
      desc: 'How you actually move through your day',
      duration: '4 min',
      available: true
    },
    { 
      id: 'sensory', 
      title: 'Sensory Profile', 
      desc: 'Your thresholds for light, sound, texture, and space',
      duration: '4 min',
      available: true
    },
    { 
      id: 'agency', 
      title: 'Agency Architecture', 
      desc: 'How you access choice and follow-through',
      duration: '5 min',
      available: true
    },
    { 
      id: 'space-psychology', 
      title: 'Space Psychology', 
      desc: 'How your environment shapes your nervous system',
      duration: '6 min',
      available: true
    },
  ];

  const renderIcon = (id: string) => {
    switch (id) {
      case 'nervous-system':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
            <path d="M12 2C12 2 8 6 8 10c0 2 1 3 2 4s2 3 2 5c0-2 1-4 2-5s2-2 2-4c0-4-4-8-4-8z" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        );
      case 'signal-integrity':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
            <path d="M2 12h4l3-9 6 18 3-9h4" />
          </svg>
        );
      case 'lifestyle':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 6v6l4 2" />
          </svg>
        );
      case 'sensory':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 5v2M12 17v2M5 12h2M17 12h2" />
            <path d="M7.05 7.05l1.41 1.41M15.54 15.54l1.41 1.41M7.05 16.95l1.41-1.41M15.54 8.46l1.41-1.41" />
          </svg>
        );
      case 'agency':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
            <path d="M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z" />
          </svg>
        );
      case 'space-psychology':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!mounted) {
    return <div style={{ minHeight: '100vh', background: '#f8f6f2' }} />;
  }

  return (
    <>
      <style jsx>{`
        .assessment-landing {
          min-height: 100vh;
          min-height: 100dvh;
          background: ${isDark
            ? 'linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0d0d18 100%)'
            : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)'};
          padding: 20px;
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
        }

        .back-btn {
          position: absolute;
          top: 24px;
          left: 24px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
          border-radius: 50px;
          color: ${isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)'};
          font-size: 0.85rem;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .back-btn:hover {
          background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)'};
        }

        .content {
          max-width: 800px;
          margin: 0 auto;
          padding-top: 80px;
          padding-bottom: 60px;
        }

        .hero {
          text-align: center;
          margin-bottom: 50px;
        }

        .free-badge {
          display: inline-block;
          padding: 6px 16px;
          background: ${isDark ? 'rgba(52,211,153,0.1)' : 'rgba(52,211,153,0.1)'};
          border: 1px solid ${isDark ? 'rgba(52,211,153,0.25)' : 'rgba(52,211,153,0.25)'};
          border-radius: 50px;
          color: #34d399;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 300;
          color: ${isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)'};
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .subtitle {
          font-size: 1rem;
          color: ${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)'};
          line-height: 1.7;
          max-width: 520px;
          margin: 0 auto;
        }

        .section {
          margin-bottom: 50px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: ${isDark ? 'rgba(255,255,255,0.35)' : 'rgba(42,42,42,0.35)'};
        }

        .total-time {
          font-size: 0.75rem;
          color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'};
        }

        .modules-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .module-card {
          display: flex;
          flex-direction: column;
          padding: 24px 20px;
          background: ${isDark 
            ? 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.65) 100%)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
          border-radius: 16px;
          backdrop-filter: blur(20px);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .module-card:hover {
          transform: translateY(-4px);
          border-color: ${isDark ? 'rgba(140, 120, 200, 0.3)' : 'rgba(160, 140, 120, 0.3)'};
          box-shadow: 0 12px 35px ${isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.1)'};
        }

        .module-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .module-icon {
          opacity: 0.9;
        }

        .module-duration {
          font-size: 0.65rem;
          color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'};
          padding: 4px 10px;
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
          border-radius: 20px;
        }

        .module-title {
          font-size: 0.95rem;
          font-weight: 500;
          color: ${isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.85)'};
          margin-bottom: 6px;
        }

        .module-desc {
          font-size: 0.75rem;
          color: ${isDark ? 'rgba(255,255,255,0.45)' : 'rgba(42,42,42,0.45)'};
          line-height: 1.4;
        }

        .cta-section {
          text-align: center;
          margin-top: 40px;
        }

        .start-btn {
          padding: 18px 48px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          border-radius: 50px;
          color: white;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 30px rgba(139,92,246,0.3);
          margin-bottom: 16px;
        }

        .start-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(139,92,246,0.4);
        }

        .cta-note {
          font-size: 0.8rem;
          color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'};
        }

        .output-section {
          background: ${isDark
            ? 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'};
          border-radius: 20px;
          padding: 32px;
          margin-top: 50px;
        }

        .output-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.4rem;
          font-weight: 300;
          color: ${isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.85)'};
          margin-bottom: 20px;
          text-align: center;
        }

        .outputs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .output-item {
          text-align: center;
          padding: 20px 12px;
        }

        .output-icon {
          margin-bottom: 12px;
          opacity: 0.7;
        }

        .output-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: ${isDark ? 'rgba(255,255,255,0.85)' : 'rgba(42,42,42,0.8)'};
          margin-bottom: 4px;
        }

        .output-desc {
          font-size: 0.7rem;
          color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'};
        }

        .ecosystem-note {
          text-align: center;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'};
        }

        .ecosystem-text {
          font-size: 0.85rem;
          color: ${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)'};
          margin-bottom: 16px;
          line-height: 1.6;
        }

        .ecosystem-links {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .eco-link {
          font-size: 0.8rem;
          color: ${isDark ? 'rgba(139,92,246,0.9)' : 'rgba(139,92,246,0.8)'};
          text-decoration: none;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .eco-link:hover {
          opacity: 0.7;
        }

        @media (max-width: 600px) {
          .content {
            padding-top: 70px;
          }

          .back-btn {
            top: 16px;
            left: 16px;
          }

          .modules-grid {
            grid-template-columns: 1fr;
          }

          .outputs-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .output-item {
            padding: 16px 12px;
          }

          .ecosystem-links {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>

      <div className="assessment-landing">
        <a href="/" className="back-btn">← Back</a>

        <div className="content">
          <div className="hero">
            <span className="free-badge">Always Free</span>
            <h1 className="title">Know Yourself</h1>
            <p className="subtitle">
              Map how your nervous system, environment, and signals interact. 
              Not a test. Not a diagnosis. A map of how you actually work.
            </p>
          </div>

          <div className="section">
            <div className="section-header">
              <span className="section-label">Mapping Modules</span>
              <span className="total-time">~30 min total</span>
            </div>
            <div className="modules-grid">
              {mappingModules.map((module) => (
                <div 
                  key={module.id} 
                  className="module-card"
                  onClick={() => router.push(`/assessment/${module.id}`)}
                >
                  <div className="module-header">
                    <div className="module-icon">{renderIcon(module.id)}</div>
                    <span className="module-duration">{module.duration}</span>
                  </div>
                  <div className="module-title">{module.title}</div>
                  <div className="module-desc">{module.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="cta-section">
            <button 
              className="start-btn"
              onClick={() => router.push('/assessment/nervous-system')}
            >
              Begin Mapping
            </button>
            <p className="cta-note">Start with Nervous System Map · No account required</p>
          </div>

          <div className="output-section">
            <h2 className="output-title">What You'll Receive</h2>
            <div className="outputs-grid">
              <div className="output-item">
                <div className="output-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                </div>
                <div className="output-name">Signal Profile</div>
                <div className="output-desc">Your unique nervous system signature</div>
              </div>
              <div className="output-item">
                <div className="output-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <path d="M14 2v6h6M16 13H8M16 17H8" />
                  </svg>
                </div>
                <div className="output-name">Map Report</div>
                <div className="output-desc">Downloadable PDF summary</div>
              </div>
              <div className="output-item">
                <div className="output-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
                    <path d="M12 2L15 8l6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z" />
                  </svg>
                </div>
                <div className="output-name">Recommendations</div>
                <div className="output-desc">Personalized next steps</div>
              </div>
            </div>
          </div>

          <div className="ecosystem-note">
            <p className="ecosystem-text">
              Your map personalizes your entire VERA experience, from Sanctuary rooms to professional matching to space design.
            </p>
            <div className="ecosystem-links">
              <a className="eco-link" onClick={() => router.push('/sanctuary')}>Your Space</a>
              <a className="eco-link" onClick={() => router.push('/professionals')}>Professionals</a>
              <a className="eco-link" onClick={() => router.push('/vds')}>VDS Studio</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}