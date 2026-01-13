'use client';

import { useState, useEffect } from 'react';

export default function Pulse() {
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

  if (!mounted) {
    return <div style={{ minHeight: '100vh', background: isDark ? '#0a0a12' : '#f8f6f2' }} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark
        ? 'linear-gradient(180deg, #0a0a12 0%, #0d0d18 50%, #0a0a12 100%)'
        : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #f8f6f2 100%)',
      fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
      color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.9)',
    }}>

      {/* Navigation */}
      <nav style={{
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <a href="/" style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '1.4rem',
          fontWeight: 300,
          color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.9)',
          textDecoration: 'none',
        }}>
          VERA
        </a>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="/sanctuary" style={{
            fontSize: '0.85rem',
            color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)',
            textDecoration: 'none',
          }}>
            Sanctuary
          </a>
          <a href="/api/checkout?product=pulse" style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '0.85rem',
            fontWeight: 500,
            textDecoration: 'none',
          }}>
            Join Pulse
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '100px 24px 80px',
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: isDark ? 'rgba(236,72,153,0.1)' : 'rgba(236,72,153,0.08)',
          borderRadius: '50px',
          marginBottom: '32px',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#ec4899',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          <span style={{
            fontSize: '0.8rem',
            color: isDark ? 'rgba(236,72,153,0.9)' : 'rgba(236,72,153,0.8)',
            fontWeight: 500,
          }}>
            A new kind of community
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(2.8rem, 8vw, 4.5rem)',
          fontWeight: 300,
          lineHeight: 1.1,
          marginBottom: '28px',
          color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)',
        }}>
          Finally, a Place Where<br />
          <span style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            You Can Just Be You
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
          fontWeight: 300,
          color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)',
          lineHeight: 1.8,
          maxWidth: '650px',
          margin: '0 auto 40px',
        }}>
          Not built for influencers. Built for humans. Share what's real, 
          connect with people who get it, and grow together without the pressure 
          to perform or compete for attention.
        </p>

        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <a href="/api/checkout?product=pulse" style={{
            padding: '18px 40px',
            background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 500,
            textDecoration: 'none',
            boxShadow: '0 10px 40px rgba(236,72,153,0.25)',
          }}>
            Join Pulse · $2.99/month
          </a>
          <a href="#how-it-works" style={{
            padding: '18px 40px',
            background: 'transparent',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: '12px',
            color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(42,42,42,0.8)',
            fontSize: '1rem',
            textDecoration: 'none',
          }}>
            See How It Works
          </a>
        </div>
      </section>

      {/* The Problem */}
      <section style={{
        padding: '80px 24px',
        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 300,
            textAlign: 'center',
            marginBottom: '40px',
            color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)',
          }}>
            Tired of Social Media That Feels Like Work?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}>
            {[
              'Posting just to stay "relevant"',
              'Comparing yourself to highlight reels',
              'Algorithms deciding who sees you',
              'Feeling alone in a crowd of followers',
            ].map((item, index) => (
              <div key={index} style={{
                padding: '20px 24px',
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
                borderRadius: '12px',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
              }}>
                <p style={{
                  fontSize: '0.95rem',
                  color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)',
                  lineHeight: 1.5,
                }}>
                  {item}
                </p>
              </div>
            ))}
          </div>

          <p style={{
            fontSize: '1.15rem',
            color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(42,42,42,0.8)',
            textAlign: 'center',
            marginTop: '40px',
            fontWeight: 400,
          }}>
            You're not the problem. The platforms are.
          </p>
        </div>
      </section>

      {/* What Pulse Is */}
      <section id="how-it-works" style={{
        padding: '100px 24px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          fontWeight: 300,
          textAlign: 'center',
          marginBottom: '20px',
          color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)',
        }}>
          Pulse is Different
        </h2>

        <p style={{
          fontSize: '1.1rem',
          color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto 60px',
          lineHeight: 1.7,
        }}>
          A community designed for connection, not competition. 
          Where everyone's voice matters equally.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {[
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="10" r="5" stroke={isDark ? 'rgba(139,92,246,0.8)' : 'rgba(139,92,246,0.7)'} strokeWidth="2"/>
                  <path d="M16 18c-6 0-10 3-10 6v2h20v-2c0-3-4-6-10-6z" stroke={isDark ? 'rgba(139,92,246,0.8)' : 'rgba(139,92,246,0.7)'} strokeWidth="2"/>
                  <circle cx="16" cy="10" r="2" fill={isDark ? 'rgba(139,92,246,0.5)' : 'rgba(139,92,246,0.4)'}/>
                </svg>
              ),
              title: 'Share Anonymously or As You',
              description: 'Your choice. Some days you want to be known. Some days you just need to be heard. Both are welcome here.',
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 28l-1.8-1.6C8 21 4 17.4 4 13c0-3.4 2.6-6 6-6 1.9 0 3.7.9 5 2.3 1.3-1.4 3.1-2.3 5-2.3 3.4 0 6 2.6 6 6 0 4.4-4 8-10.2 13.4L16 28z" 
                    stroke={isDark ? 'rgba(236,72,153,0.8)' : 'rgba(236,72,153,0.7)'} strokeWidth="2" fill="none"/>
                </svg>
              ),
              title: 'Give & Receive Real Support',
              description: 'Not likes. Not claps. Actual support from people who care. Our coins system rewards genuine kindness.',
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="10" cy="16" r="4" stroke={isDark ? 'rgba(251,191,36,0.8)' : 'rgba(251,191,36,0.7)'} strokeWidth="2"/>
                  <circle cx="22" cy="16" r="4" stroke={isDark ? 'rgba(251,191,36,0.8)' : 'rgba(251,191,36,0.7)'} strokeWidth="2"/>
                  <path d="M14 16h4" stroke={isDark ? 'rgba(251,191,36,0.8)' : 'rgba(251,191,36,0.7)'} strokeWidth="2"/>
                </svg>
              ),
              title: 'Find Your People',
              description: 'Connect with others who actually understand. Not networking. Not followers. Real relationships.',
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 28c6.6 0 12-5.4 12-12S22.6 4 16 4 4 9.4 4 16s5.4 12 12 12z" stroke={isDark ? 'rgba(59,130,246,0.8)' : 'rgba(59,130,246,0.7)'} strokeWidth="2"/>
                  <path d="M12 16l3 3 6-6" stroke={isDark ? 'rgba(59,130,246,0.8)' : 'rgba(59,130,246,0.7)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              title: 'Safe by Design',
              description: 'Moderated with care. No trolls. No harassment. No toxicity. Just humans being human together.',
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="6" y="6" width="20" height="20" rx="4" stroke={isDark ? 'rgba(34,197,94,0.8)' : 'rgba(34,197,94,0.7)'} strokeWidth="2"/>
                  <path d="M6 14h20M14 14v12" stroke={isDark ? 'rgba(34,197,94,0.6)' : 'rgba(34,197,94,0.5)'} strokeWidth="2"/>
                </svg>
              ),
              title: 'No Algorithm Games',
              description: 'Everyone sees everyone. No boosting the loudest voices. No suppressing the quiet ones.',
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4v8l6-4-6-4z" fill={isDark ? 'rgba(236,72,153,0.6)' : 'rgba(236,72,153,0.5)'}/>
                  <circle cx="16" cy="20" r="8" stroke={isDark ? 'rgba(236,72,153,0.8)' : 'rgba(236,72,153,0.7)'} strokeWidth="2"/>
                  <path d="M16 16v4l3 2" stroke={isDark ? 'rgba(236,72,153,0.8)' : 'rgba(236,72,153,0.7)'} strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ),
              title: 'Move at Your Own Pace',
              description: 'No pressure to post daily. No punishment for taking breaks. Show up when you can.',
            },
          ].map((feature, index) => (
            <div key={index} style={{
              padding: '36px 32px',
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
              borderRadius: '20px',
            }}>
              <div style={{ marginBottom: '20px' }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '1.15rem',
                fontWeight: 500,
                color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)',
                marginBottom: '12px',
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(42,42,42,0.6)',
                lineHeight: 1.6,
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Who It's For */}
      <section style={{
        padding: '80px 24px',
        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 300,
            marginBottom: '40px',
            color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)',
          }}>
            Pulse is For You If...
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            textAlign: 'left',
            maxWidth: '550px',
            margin: '0 auto',
          }}>
            {[
              'You want connection without the performance',
              'You have things to share but hate "content creation"',
              'You want to support others and be supported back',
              'You need a space that feels safe and human',
              'You are tired of feeling invisible or overwhelmed',
              'You believe community should feel like community',
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 20px',
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
                borderRadius: '12px',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p style={{
                  fontSize: '1rem',
                  color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(42,42,42,0.8)',
                }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{
        padding: '100px 24px',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <div style={{
          padding: '60px 48px',
          background: isDark 
            ? 'linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(139,92,246,0.1) 100%)'
            : 'linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(139,92,246,0.08) 100%)',
          border: `1px solid ${isDark ? 'rgba(236,72,153,0.2)' : 'rgba(236,72,153,0.15)'}`,
          borderRadius: '24px',
        }}>
          <p style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: isDark ? 'rgba(236,72,153,0.8)' : 'rgba(236,72,153,0.7)',
            marginBottom: '16px',
          }}>
            Simple Pricing
          </p>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
            fontWeight: 300,
            marginBottom: '8px',
            color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)',
          }}>
            $2.99
            <span style={{
              fontSize: '1rem',
              fontFamily: "'Outfit', sans-serif",
              color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)',
            }}>/month</span>
          </h2>

          <p style={{
            fontSize: '1rem',
            color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)',
            marginBottom: '32px',
          }}>
            Cancel anytime. No contracts. No tricks.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            textAlign: 'left',
            marginBottom: '36px',
          }}>
            {[
              'Unlimited posts and interactions',
              'Anonymous or named sharing',
              'Coins to give and receive support',
              'Access to all community spaces',
              'Direct connections with members',
              'Ad-free, algorithm-free experience',
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l4 4 6-6" stroke={isDark ? 'rgba(236,72,153,0.8)' : 'rgba(236,72,153,0.7)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p style={{
                  fontSize: '0.95rem',
                  color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)',
                }}>
                  {item}
                </p>
              </div>
            ))}
          </div>

          <a href="/api/checkout?product=pulse" style={{
            display: 'inline-block',
            padding: '18px 48px',
            background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '1.05rem',
            fontWeight: 500,
            textDecoration: 'none',
            boxShadow: '0 10px 40px rgba(236,72,153,0.3)',
          }}>
            Join Pulse Now
          </a>

          <p style={{
            fontSize: '0.8rem',
            color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)',
            marginTop: '20px',
          }}>
            Part of the VERA Ecosystem
          </p>
        </div>
      </section>

      {/* Closing */}
      <section style={{
        padding: '80px 24px',
        maxWidth: '700px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 300,
          lineHeight: 1.6,
          color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(42,42,42,0.85)',
        }}>
          Social media promised connection.<br />
          It delivered performance anxiety.<br /><br />
          <strong style={{ color: isDark ? 'rgba(236,72,153,0.9)' : 'rgba(236,72,153,0.8)' }}>
            Pulse delivers on the original promise.
          </strong>
        </p>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          <p style={{
            fontSize: '0.8rem',
            color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(42,42,42,0.3)',
          }}>
            © 2026 VERA. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="/" style={{ fontSize: '0.85rem', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)', textDecoration: 'none' }}>Home</a>
            <a href="/sanctuary" style={{ fontSize: '0.85rem', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)', textDecoration: 'none' }}>Sanctuary</a>
            <a href="/assessment" style={{ fontSize: '0.85rem', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)', textDecoration: 'none' }}>Assessments</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}