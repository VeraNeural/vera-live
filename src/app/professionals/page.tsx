'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfessionalsLanding() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (process.env.NODE_ENV === 'development') {
      console.log('Waitlist signup:', { email, role });
    }
    setSubmitted(true);
  };

  const professionalTypes = [
    { id: 'therapist', title: 'Therapists', desc: 'Licensed mental health professionals' },
    { id: 'coach', title: 'Life Coaches', desc: 'Certified transformation guides' },
    { id: 'wellness', title: 'Wellness Experts', desc: 'Holistic health practitioners' },
    { id: 'career', title: 'Career Coaches', desc: 'Professional development specialists' },
    { id: 'relationship', title: 'Relationship Coaches', desc: 'Connection and intimacy experts' },
    { id: 'spiritual', title: 'Spiritual Guides', desc: 'Mindfulness and growth mentors' },
  ];

  const benefits = [
    { id: 'leads', title: 'Warm Leads', desc: 'Connect with clients already on their wellness journey' },
    { id: 'revenue', title: 'Fair Revenue', desc: 'Keep 85% of your earnings' },
    { id: 'verified', title: 'Verified Profiles', desc: 'Build trust with credential verification' },
    { id: 'booking', title: 'Easy Booking', desc: 'Integrated scheduling and payments' },
    { id: 'ai', title: 'VERA Support', desc: 'AI assists with client prep and follow-ups' },
    { id: 'growth', title: 'Grow Your Practice', desc: 'Analytics and insights to scale' },
  ];

  const renderIcon = (id: string) => {
    switch (id) {
      case 'therapist':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        );
      case 'coach':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
            <path d="M12 2L15 8l6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z" />
          </svg>
        );
      case 'wellness':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 6v12M6 12h12" />
          </svg>
        );
      case 'career':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        );
      case 'relationship':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
            <path d="M12 21C12 21 4 15 4 9.5C4 6 7 4 9.5 4C11 4 12 5 12 5C12 5 13 4 14.5 4C17 4 20 6 20 9.5C20 15 12 21 12 21Z" />
          </svg>
        );
      case 'spiritual':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <circle cx="12" cy="12" r="8" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
          </svg>
        );
      case 'leads':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
            <circle cx="9" cy="7" r="3" />
            <circle cx="17" cy="7" r="3" />
            <path d="M3 18c0-3 3-5 6-5s6 2 6 5" />
            <path d="M15 13c2 0 4 1.5 4 4" />
          </svg>
        );
      case 'revenue':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 6v12" />
            <path d="M9 9h4.5a1.5 1.5 0 010 3H10a1.5 1.5 0 000 3h5" />
          </svg>
        );
      case 'verified':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9,12 11,14 15,10" />
          </svg>
        );
      case 'booking':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <line x1="9" y1="2" x2="9" y2="6" />
            <line x1="15" y1="2" x2="15" y2="6" />
          </svg>
        );
      case 'ai':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
            <circle cx="12" cy="12" r="4" />
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="3" x2="12" y2="5" />
            <line x1="12" y1="19" x2="12" y2="21" />
          </svg>
        );
      case 'growth':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
            <polyline points="4,16 8,12 12,14 20,6" />
            <polyline points="16,6 20,6 20,10" />
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
        .professionals-landing {
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
          margin-bottom: 60px;
        }

        .badge {
          display: inline-block;
          padding: 8px 20px;
          background: ${isDark ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.08)'};
          border: 1px solid ${isDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.15)'};
          border-radius: 50px;
          color: ${isDark ? 'rgba(139,92,246,0.9)' : 'rgba(139,92,246,0.8)'};
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
          line-height: 1.6;
          max-width: 500px;
          margin: 0 auto;
        }

        .section {
          margin-bottom: 60px;
        }

        .section-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: ${isDark ? 'rgba(255,255,255,0.35)' : 'rgba(42,42,42,0.35)'};
          text-align: center;
          margin-bottom: 20px;
        }

        .types-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .type-card {
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
          backdrop-filter: blur(20px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .type-card:hover {
          transform: translateY(-4px);
          border-color: ${isDark ? 'rgba(140, 120, 200, 0.3)' : 'rgba(160, 140, 120, 0.3)'};
          box-shadow: 0 12px 35px ${isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.1)'};
        }

        .type-icon {
          margin-bottom: 12px;
          opacity: 0.9;
        }

        .type-title {
          font-size: 0.85rem;
          font-weight: 500;
          color: ${isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.85)'};
          margin-bottom: 4px;
        }

        .type-desc {
          font-size: 0.65rem;
          color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'};
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .benefit-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          background: ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'};
          border-radius: 14px;
          transition: all 0.3s ease;
        }

        .benefit-card:hover {
          background: ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)'};
        }

        .benefit-icon {
          flex-shrink: 0;
          opacity: 0.8;
        }

        .benefit-content {
          flex: 1;
        }

        .benefit-title {
          font-size: 0.9rem;
          font-weight: 500;
          color: ${isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.9)'};
          margin-bottom: 4px;
        }

        .benefit-desc {
          font-size: 0.75rem;
          color: ${isDark ? 'rgba(255,255,255,0.45)' : 'rgba(42,42,42,0.45)'};
          line-height: 1.4;
        }

        .waitlist-section {
          background: ${isDark
            ? 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'};
          border-radius: 24px;
          padding: 48px 32px;
          text-align: center;
          backdrop-filter: blur(20px);
        }

        .waitlist-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.8rem;
          font-weight: 300;
          color: ${isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)'};
          margin-bottom: 12px;
        }

        .waitlist-desc {
          font-size: 0.9rem;
          color: ${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)'};
          margin-bottom: 32px;
          line-height: 1.5;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-width: 380px;
          margin: 0 auto;
        }

        .input, .select {
          padding: 14px 20px;
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
          border-radius: 12px;
          color: ${isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.9)'};
          font-size: 0.95rem;
          font-family: inherit;
          outline: none;
          transition: all 0.2s ease;
        }

        .input:focus, .select:focus {
          border-color: rgba(139,92,246,0.4);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.08);
        }

        .input::placeholder {
          color: ${isDark ? 'rgba(255,255,255,0.35)' : 'rgba(42,42,42,0.35)'};
        }

        .select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
        }

        .submit-btn {
          padding: 16px 32px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 6px 20px rgba(139,92,246,0.25);
          margin-top: 8px;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139,92,246,0.35);
        }

        .success-message {
          padding: 20px;
        }

        .success-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 20px;
          border-radius: 50%;
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .success-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.5rem;
          color: ${isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)'};
          margin-bottom: 8px;
        }

        .success-text {
          font-size: 0.9rem;
          color: ${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)'};
        }

        .footer-note {
          text-align: center;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'};
        }

        .footer-text {
          font-size: 0.85rem;
          color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'};
          margin-bottom: 8px;
        }

        .footer-link {
          color: ${isDark ? 'rgba(139,92,246,0.9)' : 'rgba(139,92,246,0.8)'};
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .footer-link:hover {
          opacity: 0.8;
        }

        @media (max-width: 700px) {
          .types-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .benefits-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 500px) {
          .content {
            padding-top: 70px;
          }
          .back-btn {
            top: 16px;
            left: 16px;
          }
          .types-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .type-card {
            padding: 18px 12px;
            min-height: 100px;
          }
          .waitlist-section {
            padding: 36px 20px;
          }
        }
      `}</style>

      <div className="professionals-landing">
        <button type="button" className="back-btn" onClick={() => router.push('/')}>← Back</button>

        <div className="content">
          <div className="hero">
            <span className="badge">Coming Soon</span>
            <h1 className="title">Join the VERA Professional Network</h1>
            <p className="subtitle">
              Connect with clients who are ready for change. Build your practice 
              with people already on their wellness journey.
            </p>
          </div>

          <div className="section">
            <p className="section-label">Who We're Looking For</p>
            <div className="types-grid">
              {professionalTypes.map((type) => (
                <div key={type.id} className="type-card">
                  <div className="type-icon">{renderIcon(type.id)}</div>
                  <div className="type-title">{type.title}</div>
                  <div className="type-desc">{type.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <p className="section-label">Why Partner with VERA</p>
            <div className="benefits-grid">
              {benefits.map((benefit) => (
                <div key={benefit.id} className="benefit-card">
                  <div className="benefit-icon">{renderIcon(benefit.id)}</div>
                  <div className="benefit-content">
                    <div className="benefit-title">{benefit.title}</div>
                    <div className="benefit-desc">{benefit.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="waitlist-section">
            {submitted ? (
              <div className="success-message">
                <div className="success-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                </div>
                <h3 className="success-title">You're on the list</h3>
                <p className="success-text">We'll reach out soon with early access details.</p>
              </div>
            ) : (
              <>
                <h2 className="waitlist-title">Get Early Access</h2>
                <p className="waitlist-desc">
                  Be among the first professionals to join VERA. 
                  Early partners get reduced fees and priority placement.
                </p>
                <form className="form" onSubmit={handleSubmit}>
                  <input
                    type="email"
                    className="input"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <select
                    className="select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="" disabled>What type of professional are you?</option>
                    <option value="therapist">Therapist / Counselor</option>
                    <option value="life-coach">Life Coach</option>
                    <option value="wellness">Wellness Expert</option>
                    <option value="career">Career Coach</option>
                    <option value="relationship">Relationship Coach</option>
                    <option value="spiritual">Spiritual Guide</option>
                    <option value="other">Other</option>
                  </select>
                  <button type="submit" className="submit-btn">Join the Waitlist</button>
                </form>
              </>
            )}
          </div>

          <div className="footer-note">
            <p className="footer-text">Looking for support instead of offering it?</p>
            <a className="footer-link" onClick={() => router.push('/sanctuary')}>
              Explore Your Space →
            </a>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
              <a href="/legal/privacy" style={{ fontSize: '0.75rem', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)', textDecoration: 'none' }}>
                Privacy Policy
              </a>
              <span style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(42,42,42,0.2)' }}>·</span>
              <a href="/legal/terms" style={{ fontSize: '0.75rem', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)', textDecoration: 'none' }}>
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}