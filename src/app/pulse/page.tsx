'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PulseLanding() {
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

  const features = [
    { icon: '💬', title: 'Share Anonymously', desc: 'Express yourself without judgment' },
    { icon: '💜', title: 'Give & Receive Support', desc: 'Coins system rewards kindness' },
    { icon: '🤝', title: 'Find Your People', desc: 'Connect with others who understand' },
    { icon: '🛡️', title: 'Safe Space', desc: 'Moderated community, always respectful' },
  ];

  if (!mounted) {
    return <div style={{ minHeight: '100vh', background: '#0f0f1a' }} />;
  }

  return (
    <>
      <style jsx>{`
        .pulse-landing {
          min-height: 100vh;
          min-height: 100dvh;
          background: linear-gradient(180deg, #0f0f1a 0%, #1a1525 50%, #0f0f1a 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .back-btn {
          position: absolute;
          top: 24px;
          left: 24px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px;
          color: rgba(255,255,255,0.7);
          font-size: 0.85rem;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .back-btn:hover {
          background: rgba(255,255,255,0.1);
        }

        .content {
          max-width: 600px;
          width: 100%;
          padding-top: 80px;
          padding-bottom: 40px;
        }

        /* Video Section */
        .video-section {
          margin-bottom: 40px;
        }

        .video-placeholder {
          width: 100%;
          aspect-ratio: 16/9;
          background: linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(139,92,246,0.1) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .video-placeholder::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(236,72,153,0.15) 0%, transparent 70%);
        }

        .play-btn {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 1;
        }

        .play-btn:hover {
          transform: scale(1.1);
          background: rgba(255,255,255,0.15);
        }

        .play-icon {
          width: 0;
          height: 0;
          border-left: 22px solid rgba(255,255,255,0.9);
          border-top: 14px solid transparent;
          border-bottom: 14px solid transparent;
          margin-left: 6px;
        }

        /* Header */
        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .logo {
          font-size: 3.5rem;
          margin-bottom: 16px;
        }

        .title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.2rem, 6vw, 3rem);
          font-weight: 400;
          color: rgba(255,255,255,0.95);
          margin-bottom: 12px;
        }

        .tagline {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
          max-width: 450px;
          margin: 0 auto;
        }

        /* Features */
        .features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }

        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          background: rgba(255,255,255,0.05);
          transform: translateY(-2px);
        }

        .feature-icon {
          font-size: 2rem;
          margin-bottom: 12px;
        }

        .feature-title {
          font-size: 0.95rem;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          margin-bottom: 6px;
        }

        .feature-desc {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.4;
        }

        /* CTA Section */
        .cta-section {
          text-align: center;
          margin-bottom: 40px;
        }

        .enter-btn {
          padding: 18px 48px;
          background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
          border: none;
          border-radius: 50px;
          color: white;
          font-size: 1.1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 30px rgba(236,72,153,0.35);
          margin-bottom: 20px;
        }

        .enter-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(236,72,153,0.45);
        }

        .pricing {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
        }

        .price {
          font-weight: 600;
          font-size: 1.1rem;
          color: rgba(255,255,255,0.9);
        }

        .divider {
          width: 4px;
          height: 4px;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
        }

        .cancel-note {
          color: #34d399;
        }

        /* VERA Upsell Banner */
        .vera-upsell {
          background: linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(168,85,247,0.05) 100%);
          border: 1px solid rgba(139,92,246,0.2);
          border-radius: 20px;
          padding: 24px;
          text-align: center;
        }

        .upsell-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(139,92,246,0.8);
          margin-bottom: 12px;
        }

        .upsell-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.4rem;
          color: rgba(255,255,255,0.9);
          margin-bottom: 8px;
        }

        .upsell-desc {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .upsell-btn {
          padding: 12px 28px;
          background: rgba(139,92,246,0.2);
          border: 1px solid rgba(139,92,246,0.3);
          border-radius: 50px;
          color: #a78bfa;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .upsell-btn:hover {
          background: rgba(139,92,246,0.3);
        }

        /* Community Stats */
        .stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
        }

        .stat-label {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Responsive */
        @media (max-width: 600px) {
          .content {
            padding-top: 70px;
          }

          .back-btn {
            top: 16px;
            left: 16px;
            padding: 8px 14px;
            font-size: 0.8rem;
          }

          .features {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .feature-card {
            display: flex;
            align-items: center;
            text-align: left;
            gap: 16px;
            padding: 16px;
          }

          .feature-icon {
            margin-bottom: 0;
            font-size: 1.8rem;
          }

          .feature-content {
            flex: 1;
          }

          .stats {
            gap: 24px;
          }

          .enter-btn {
            padding: 16px 40px;
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="pulse-landing">
        <a href="/" className="back-btn">← Back</a>

        <div className="content">
          {/* Video Section */}
          <div className="video-section">
            <div className="video-placeholder">
              <div className="play-btn">
                <div className="play-icon" />
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="header">
            <div className="logo">💜</div>
            <h1 className="title">Pulse</h1>
            <p className="tagline">
              A safe community where everyone gets seen. Share your journey, support others, and never feel alone.
            </p>
          </div>

          {/* Features */}
          <div className="features">
            {features.map((feature, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-content">
                  <div className="feature-title">{feature.title}</div>
                  <div className="feature-desc">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="cta-section">
            <button 
              className="enter-btn"
              onClick={() => window.location.href = 'https://pulse-kappa-three.vercel.app/'}
            >
              Enter Pulse Community
            </button>
            <div className="pricing">
              <span className="price">$2.99/month</span>
              <span className="divider" />
              <span className="cancel-note">Cancel anytime</span>
            </div>
          </div>

          {/* VERA Upsell */}
          <div className="vera-upsell">
            <p className="upsell-label">Part of the VERA Ecosystem</p>
            <h3 className="upsell-title">Get More with Sanctuary</h3>
            <p className="upsell-desc">
              Access Your Space — 6 immersive rooms for breathing, journaling, 
              stories, and unlimited VERA conversations.
            </p>
            <button 
              className="upsell-btn"
              onClick={() => router.push('/sanctuary')}
            >
              Explore Sanctuary · $8/month
            </button>
          </div>

          {/* Stats */}
          <div className="stats">
            <div className="stat">
              <div className="stat-value">10K+</div>
              <div className="stat-label">Members</div>
            </div>
            <div className="stat">
              <div className="stat-value">50K+</div>
              <div className="stat-label">Posts</div>
            </div>
            <div className="stat">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}