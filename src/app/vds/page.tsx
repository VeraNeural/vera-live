'use client';

import { useState, useEffect } from 'react';

export default function VDSPartnership() {
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
    return <div style={{ minHeight: '100vh', background: '#f8f6f2' }} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark
        ? 'linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0d0d18 100%)'
        : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)',
      fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      
      {/* Header */}
      <header style={{
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <a href="/" style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '1.5rem',
          fontWeight: 300,
          color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.9)',
          textDecoration: 'none',
        }}>
          VERA
        </a>
        <span style={{
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)',
        }}>
          Ecosystem Partner
        </span>
      </header>

      {/* Hero */}
      <section style={{
        padding: '80px 24px 100px',
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        {/* Partner Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 24px',
          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
          borderRadius: '60px',
          marginBottom: '40px',
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="24" height="24" rx="5" stroke={isDark ? 'rgba(139,92,246,0.7)' : 'rgba(139,92,246,0.6)'} strokeWidth="1.5" fill="none"/>
            <path d="M7 11 L14 7 L21 11 L21 17 L14 21 L7 17 Z" stroke={isDark ? 'rgba(139,92,246,0.5)' : 'rgba(139,92,246,0.4)'} strokeWidth="1.5" fill="none"/>
            <circle cx="14" cy="14" r="2.5" fill={isDark ? 'rgba(139,92,246,0.7)' : 'rgba(139,92,246,0.6)'}/>
          </svg>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '1.2rem',
            fontWeight: 400,
            color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.9)',
          }}>
            Vision Design Studio
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
          fontWeight: 300,
          color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)',
          lineHeight: 1.2,
          marginBottom: '24px',
        }}>
          Your Inner Map.<br />Their Outer Design.
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)',
          lineHeight: 1.7,
          maxWidth: '600px',
          margin: '0 auto 40px',
        }}>
          VERA maps how your nervous system works. Vision Design Studio builds spaces that honor it. 
          Together, we create environments engineered for your biology, not just your taste.
        </p>

        <a 
          href="https://vds.veraneural.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '18px 40px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 500,
            textDecoration: 'none',
            boxShadow: '0 8px 30px rgba(139,92,246,0.25)',
          }}
        >
          Visit Vision Design Studio
        </a>
      </section>

      {/* The Partnership */}
      <section style={{
        padding: '60px 24px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <div style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
          borderRadius: '20px',
          padding: '48px 40px',
        }}>
          <p style={{
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: isDark ? 'rgba(139,92,246,0.8)' : 'rgba(139,92,246,0.7)',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            The Partnership
          </p>
          
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 300,
            color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)',
            textAlign: 'center',
            marginBottom: '32px',
          }}>
            Why Space Matters to Your Signal
          </h2>

          <div style={{
            fontSize: '1.05rem',
            color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)',
            lineHeight: 1.8,
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}>
            <p>
              Your physical environment isn't neutral. Every room you inhabit (the light quality, 
              the spatial organization, the materials, the acoustic load) directly impacts your 
              nervous system's ability to regulate.
            </p>
            <p>
              <strong style={{ color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.9)' }}>Vision Design Studio</strong> is 
              a global luxury design firm led by Julija Krajceva. $2 billion in delivered projects. 
              25+ years of hands-on excellence. Award-winning work featured in Architectural Digest, 
              Elle Decor, and World of Interiors.
            </p>
            <p>
              But what makes VDS different is their partnership with VERA and the Signal Integrity Trust. 
              They don't just design beautiful spaces; they design spaces that support how 
              <em> your specific nervous system</em> works.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        padding: '60px 24px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 300,
          color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.85)',
          textAlign: 'center',
          marginBottom: '50px',
        }}>
          How It Works
        </h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          {[
            {
              step: '01',
              title: 'Complete Your VERA Assessments',
              description: 'Take the Space Psychology and Sensory Profile assessments to map how your nervous system responds to environmental factors.',
            },
            {
              step: '02',
              title: 'Share Your Signal Profile',
              description: "Your assessment results become part of your VDS consultation. They'll understand your biology before discussing aesthetics.",
            },
            {
              step: '03',
              title: 'Experience Neuro-Informed Design',
              description: 'Every design choice (lighting, materials, spatial flow, acoustics) is made with your nervous system in mind.',
            },
            {
              step: '04',
              title: 'Walk Through Before Building',
              description: "VDS's Virtual Design Studio lets you experience your space in immersive 3D before construction begins.",
            },
          ].map((item, index) => (
            <div key={index} style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr',
              gap: '24px',
              padding: '28px 32px',
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
              borderRadius: '16px',
              alignItems: 'start',
            }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '1.5rem',
                color: isDark ? 'rgba(139,92,246,0.6)' : 'rgba(139,92,246,0.5)',
                fontWeight: 300,
              }}>
                {item.step}
              </span>
              <div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)',
                  marginBottom: '8px',
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(42,42,42,0.6)',
                  lineHeight: 1.6,
                }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Assessment Links */}
      <section style={{
        padding: '60px 24px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <div style={{
          background: isDark 
            ? 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(139,92,246,0.05) 100%)'
            : 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(139,92,246,0.03) 100%)',
          border: `1px solid ${isDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.15)'}`,
          borderRadius: '20px',
          padding: '50px 40px',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: isDark ? 'rgba(139,92,246,0.8)' : 'rgba(139,92,246,0.7)',
            marginBottom: '20px',
          }}>
            Start Here
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 300,
            color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)',
            marginBottom: '16px',
          }}>
            Map Yourself First
          </h2>
          <p style={{
            fontSize: '1rem',
            color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)',
            lineHeight: 1.7,
            maxWidth: '500px',
            margin: '0 auto 32px',
          }}>
            These assessments will become the foundation of your VDS consultation.
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '340px',
            margin: '0 auto',
          }}>
            <a href="/assessment/space-psychology" style={{
              padding: '16px 28px',
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'}`,
              borderRadius: '10px',
              color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.9)',
              fontSize: '0.95rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}>
              Space Psychology Assessment
            </a>
            <a href="/assessment/sensory" style={{
              padding: '16px 28px',
              background: 'transparent',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              borderRadius: '10px',
              color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)',
              fontSize: '0.95rem',
              textDecoration: 'none',
            }}>
              Sensory Profile Assessment
            </a>
            <a href="/assessment" style={{
              padding: '16px 28px',
              background: 'transparent',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              borderRadius: '10px',
              color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)',
              fontSize: '0.95rem',
              textDecoration: 'none',
            }}>
              View All Assessments
            </a>
          </div>
        </div>
      </section>

      {/* About Julija */}
      <section style={{
        padding: '60px 24px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <div style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
          borderRadius: '20px',
          padding: '48px 40px',
        }}>
          <p style={{
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            The Visionary
          </p>
          
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 300,
            color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)',
            textAlign: 'center',
            marginBottom: '32px',
          }}>
            Julija Krajceva
          </h2>

          <div style={{
            fontSize: '1rem',
            color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)',
            lineHeight: 1.8,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            <p>
              Julija doesn't hand off projects. From first sketch to final walkthrough, she's involved in 
              every phase: concept, execution, delivery. When crews are on site at 6am, Julija is there. 
              When a detail isn't right, she fixes it herself.
            </p>
            <p>
              She speaks five languages, works across three continents, and treats every project with 
              the same obsessive dedication, whether it's a private villa or a $200 million development.
            </p>
            <p style={{
              padding: '24px',
              background: isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.05)',
              borderLeft: `3px solid ${isDark ? 'rgba(139,92,246,0.4)' : 'rgba(139,92,246,0.3)'}`,
              borderRadius: '0 12px 12px 0',
              fontStyle: 'italic',
              color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(42,42,42,0.8)',
            }}>
              "I don't hand off projects. I see them through. Every wall, every light, every moment 
              a client walks in for the first time, that's what I live for."
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        padding: '60px 24px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}>
          {[
            { number: '$2B+', label: 'Projects Delivered' },
            { number: '25+', label: 'Years Excellence' },
            { number: '14', label: 'Design Awards' },
            { number: '100%', label: 'Project Involvement' },
          ].map((stat, index) => (
            <div key={index} style={{
              padding: '28px 20px',
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
              borderRadius: '14px',
              textAlign: 'center',
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 300,
                color: isDark ? 'rgba(139,92,246,0.9)' : 'rgba(139,92,246,0.8)',
                marginBottom: '6px',
              }}>
                {stat.number}
              </p>
              <p style={{
                fontSize: '0.7rem',
                color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px',
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
          fontWeight: 300,
          color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)',
          marginBottom: '20px',
        }}>
          Ready to Design Your Space?
        </h2>
        <p style={{
          fontSize: '1rem',
          color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)',
          marginBottom: '32px',
        }}>
          Begin a consultation with Vision Design Studio
        </p>
        <a 
          href="https://vds.veraneural.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '18px 48px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 500,
            textDecoration: 'none',
            boxShadow: '0 8px 30px rgba(139,92,246,0.25)',
          }}
        >
          Visit Vision Design Studio
        </a>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '0.8rem',
          color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)',
          marginBottom: '16px',
        }}>
          Vision Design Studio is an official VERA Ecosystem Partner
        </p>
        <div style={{
          display: 'flex',
          gap: '24px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}>
          <a href="/sanctuary" style={{
            fontSize: '0.85rem',
            color: isDark ? 'rgba(139,92,246,0.8)' : 'rgba(139,92,246,0.7)',
            textDecoration: 'none',
          }}>
            Sanctuary
          </a>
          <a href="/assessment" style={{
            fontSize: '0.85rem',
            color: isDark ? 'rgba(139,92,246,0.8)' : 'rgba(139,92,246,0.7)',
            textDecoration: 'none',
          }}>
            Assessments
          </a>
          <a href="/trust" style={{
            fontSize: '0.85rem',
            color: isDark ? 'rgba(139,92,246,0.8)' : 'rgba(139,92,246,0.7)',
            textDecoration: 'none',
          }}>
            Signal Integrity Trust
          </a>
        </div>
        <p style={{
          fontSize: '0.75rem',
          color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(42,42,42,0.3)',
        }}>
          © 2026 VERA. All rights reserved.
        </p>
      </footer>
    </div>
  );
}