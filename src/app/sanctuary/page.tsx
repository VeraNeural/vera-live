'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SanctuaryLanding() {
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

  const rooms = [
    { name: 'Zen Garden', icon: '◎', free: true },
    { name: 'Journal Nook', icon: '☐', free: true },
    { name: 'Library', icon: '▊', free: true, note: '1 story' },
    { name: 'Therapy Room', icon: '⊥', free: false },
    { name: 'Rest Chamber', icon: '☽', free: false },
    { name: 'Design Studio', icon: '▢', free: false },
  ];

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
        }

        .sanctuary-landing {
          min-height: 100vh;
          min-height: 100dvh;
          background: ${isDark
            ? 'linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0d0d18 100%)'
            : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)'};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
        }

        .back-btn {
          position: absolute;
          top: 24px;
          left: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
          border-radius: 50px;
          color: ${isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)'};
          font-size: 0.85rem;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)'};
        }

        .content {
          max-width: 500px;
          width: 100%;
          text-align: center;
        }

        .video-placeholder {
          width: 100%;
          aspect-ratio: 16/9;
          background: ${isDark 
            ? 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(30,30,50,0.8) 100%)'
            : 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(240,235,227,0.9) 100%)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'};
          border-radius: 20px;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .play-btn {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.08)'};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .play-btn:hover {
          transform: scale(1.05);
          background: ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.95)'};
        }

        .play-icon {
          width: 0;
          height: 0;
          border-left: 18px solid ${isDark ? 'rgba(255,255,255,0.8)' : 'rgba(42,42,42,0.7)'};
          border-top: 11px solid transparent;
          border-bottom: 11px solid transparent;
          margin-left: 4px;
        }

        .title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2rem, 5vw, 2.8rem);
          font-weight: 300;
          color: ${isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.85)'};
          margin-bottom: 12px;
        }

        .description {
          font-size: 1rem;
          line-height: 1.6;
          color: ${isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)'};
          margin-bottom: 32px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .enter-btn {
          padding: 18px 48px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          border-radius: 50px;
          color: white;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.35);
          transition: all 0.3s ease;
          margin-bottom: 40px;
        }

        .enter-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(139, 92, 246, 0.45);
        }

        .rooms-preview {
          margin-bottom: 32px;
        }

        .rooms-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: ${isDark ? 'rgba(255,255,255,0.35)' : 'rgba(42,42,42,0.35)'};
          margin-bottom: 16px;
        }

        .rooms-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
        }

        .room-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'};
          border-radius: 50px;
          font-size: 0.75rem;
          color: ${isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)'};
        }

        .room-tag.locked {
          opacity: 0.5;
        }

        .room-icon {
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .room-note {
          font-size: 0.6rem;
          color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'};
        }

        .free-badge {
          font-size: 0.55rem;
          padding: 2px 6px;
          background: ${isDark ? 'rgba(52,211,153,0.2)' : 'rgba(52,211,153,0.15)'};
          color: #34d399;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .lock-icon {
          font-size: 0.7rem;
          opacity: 0.5;
        }

        .pricing {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: ${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)'};
          font-size: 0.85rem;
        }

        .price {
          font-weight: 600;
          color: ${isDark ? 'rgba(255,255,255,0.8)' : 'rgba(42,42,42,0.8)'};
        }

        .divider {
          width: 4px;
          height: 4px;
          background: ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(42,42,42,0.3)'};
          border-radius: 50%;
        }

        .trial {
          color: #34d399;
        }

        @media (max-width: 600px) {
          .back-btn {
            top: 16px;
            left: 16px;
            padding: 8px 14px;
            font-size: 0.8rem;
          }

          .video-placeholder {
            border-radius: 16px;
            margin-bottom: 24px;
          }

          .play-btn {
            width: 60px;
            height: 60px;
          }

          .description {
            font-size: 0.9rem;
            margin-bottom: 24px;
          }

          .enter-btn {
            padding: 16px 40px;
            font-size: 0.95rem;
            margin-bottom: 32px;
          }

          .room-tag {
            padding: 6px 10px;
            font-size: 0.7rem;
          }
        }
      `}</style>

      <div className="sanctuary-landing">
        <a href="/" className="back-btn">
          ← Back
        </a>

        <div className="content">
          {/* Video Placeholder */}
          <div className="video-placeholder">
            <div className="play-btn">
              <div className="play-icon" />
            </div>
          </div>

          {/* Title & Description */}
          <h1 className="title">Your Space</h1>
          <p className="description">
            A private room where you settle, restore, and move through life with VERA by your side.
          </p>

          {/* Enter Button */}
          <button 
            className="enter-btn"
            onClick={() => router.push('/sanctuary/space')}
          >
            Enter Your Space
          </button>

          {/* Rooms Preview */}
          <div className="rooms-preview">
            <p className="rooms-label">What's inside</p>
            <div className="rooms-grid">
              {rooms.map((room) => (
                <div key={room.name} className={`room-tag ${!room.free ? 'locked' : ''}`}>
                  <span className="room-icon">{room.icon}</span>
                  <span>{room.name}</span>
                  {room.note && <span className="room-note">({room.note})</span>}
                  {room.free ? (
                    <span className="free-badge">Free</span>
                  ) : (
                    <span className="lock-icon">🔒</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="pricing">
            <span className="price">$8/month</span>
            <span className="divider" />
            <span className="trial">7-day free trial</span>
          </div>
        </div>
      </div>
    </>
  );
}