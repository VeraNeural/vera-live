'use client';

import { useState, useEffect } from 'react';

export default function SignalIntegrityMode() {
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
        maxWidth: '1000px',
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
        <a href="/sanctuary" style={{
          fontSize: '0.85rem',
          color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)',
          textDecoration: 'none',
        }}>
          Enter Sanctuary
        </a>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '80px 24px 60px',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          color: isDark ? 'rgba(139,92,246,0.7)' : 'rgba(139,92,246,0.6)',
          marginBottom: '20px',
        }}>
          Coming Soon
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(2.4rem, 7vw, 3.8rem)',
          fontWeight: 300,
          lineHeight: 1.15,
          marginBottom: '28px',
          color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)',
        }}>
          A Platform Where You Don't Have to Perform to Be Heard
        </h1>

        <p style={{
          fontSize: '1.15rem',
          fontWeight: 300,
          color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)',
          lineHeight: 1.7,
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          VERA is a human-centered interaction platform where people can think, speak, 
          and decide without being pressured, ranked, or algorithmically distorted.
        </p>
      </section>

      {/* The Problem */}
      <section style={{
        padding: '60px 24px',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
          fontWeight: 300,
          marginBottom: '32px',
          color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)',
        }}>
          Why This Needs to Exist
        </h2>

        <p style={{
          fontSize: '1.05rem',
          color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)',
          lineHeight: 1.9,
          marginBottom: '24px',
        }}>
          Current platforms reward exaggeration, penalize nuance, accelerate burnout, 
          degrade trust, distort identity, and collapse decision quality.
        </p>

        <p style={{
          fontSize: '1.05rem',
          color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)',
          lineHeight: 1.9,
          marginBottom: '24px',
        }}>
          People leave not because they are weak, but because the environment 
          is hostile to human limits.
        </p>

        <p style={{
          fontSize: '1.05rem',
          color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)',
          lineHeight: 1.9,
        }}>
          VERA is built for the people who leave those platforms but still want 
          connection, intelligence, dialogue, growth, and meaning.
        </p>
      </section>

      {/* The Difference */}
      <section style={{
        padding: '60px 24px',
        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            fontWeight: 300,
            marginBottom: '40px',
            textAlign: 'center',
            color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)',
          }}>
            The Difference
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
          }}>
            {/* Other Platforms */}
            <div style={{
              padding: '32px',
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              borderRadius: '16px',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
            }}>
              <p style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)',
                marginBottom: '20px',
              }}>
                Other Platforms
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}>
                {['Be seen', 'Be ranked', 'Be active', 'Perform', 'Grow reach'].map((item, i) => (
                  <li key={i} style={{
                    fontSize: '1rem',
                    color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)',
                  }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* VERA */}
            <div style={{
              padding: '32px',
              background: isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.05)',
              borderRadius: '16px',
              border: `1px solid ${isDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.15)'}`,
            }}>
              <p style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: isDark ? 'rgba(139,92,246,0.8)' : 'rgba(139,92,246,0.7)',
                marginBottom: '20px',
              }}>
                VERA
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}>
                {['Be clear', 'Be oriented', 'Be coherent', 'Decide', 'Preserve self'].map((item, i) => (
                  <li key={i} style={{
                    fontSize: '1rem',
                    color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(42,42,42,0.85)',
                    fontWeight: 500,
                  }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p style={{
            fontSize: '1.1rem',
            color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)',
            textAlign: 'center',
            marginTop: '40px',
            lineHeight: 1.7,
          }}>
            Other platforms optimize engagement.<br />
            <strong style={{ color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)' }}>
              VERA optimizes human stability and decision clarity.
            </strong>
          </p>
        </div>
      </section>

      {/* What People Do */}
      <section style={{
        padding: '80px 24px',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
          fontWeight: 300,
          marginBottom: '24px',
          color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)',
        }}>
          What People Do on VERA
        </h2>

        <p style={{
          fontSize: '1.05rem',
          color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)',
          lineHeight: 1.8,
          marginBottom: '32px',
        }}>
          Write. Speak. Reflect. Ask questions. Share thoughts. Connect with others. 
          Interact with AI. Make sense of decisions. Process experiences.
        </p>

        <p style={{
          fontSize: '1.1rem',
          color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(42,42,42,0.8)',
          lineHeight: 1.8,
          padding: '24px 28px',
          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
          borderRadius: '12px',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
        }}>
          The difference is not what you do. 
          The difference is how the platform behaves while you do it.
        </p>
      </section>

      {/* What is SIM */}
      <section style={{
        padding: '60px 24px',
        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            fontWeight: 300,
            marginBottom: '24px',
            color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)',
          }}>
            What is Signal Integrity Mode?
          </h2>

          <p style={{
            fontSize: '1.05rem',
            color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)',
            lineHeight: 1.9,
            marginBottom: '24px',
          }}>
            Signal Integrity Mode is the ruleset that governs how interaction happens on the platform. 
            It answers questions like: How much content can appear at once? How fast do interactions move? 
            Are people rewarded for visibility? Are reactions amplified? Is silence allowed?
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginTop: '40px',
          }}>
            {/* Traditional Platforms */}
            <div style={{
              padding: '28px',
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              borderRadius: '14px',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
            }}>
              <p style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)',
                marginBottom: '16px',
              }}>
                Traditional Platforms Say
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}>
                {[
                  'More is better',
                  'Faster is better',
                  'Louder wins',
                  'Visibility = value',
                  'Engagement = success'
                ].map((item, i) => (
                  <li key={i} style={{
                    fontSize: '0.95rem',
                    color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(42,42,42,0.55)',
                  }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* SIM */}
            <div style={{
              padding: '28px',
              background: isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.05)',
              borderRadius: '14px',
              border: `1px solid ${isDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.15)'}`,
            }}>
              <p style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: isDark ? 'rgba(139,92,246,0.8)' : 'rgba(139,92,246,0.7)',
                marginBottom: '16px',
              }}>
                Signal Integrity Mode Says
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}>
                {[
                  'Enough is enough',
                  'Slower preserves clarity',
                  'Coherence over volume',
                  'Meaning over reach',
                  'Presence over performance'
                ].map((item, i) => (
                  <li key={i} style={{
                    fontSize: '0.95rem',
                    color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(42,42,42,0.85)',
                    fontWeight: 500,
                  }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p style={{
            fontSize: '1.05rem',
            color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)',
            textAlign: 'center',
            marginTop: '40px',
            lineHeight: 1.7,
          }}>
            Signal Integrity Mode is what keeps this from becoming 
            another loud, fast, extractive platform.
          </p>
        </div>
      </section>

      {/* What's Available Now */}
      <section style={{
        padding: '80px 24px',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
          fontWeight: 300,
          textAlign: 'center',
          marginBottom: '24px',
          color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)',
        }}>
          Start Now
        </h2>

        <p style={{
          fontSize: '1.05rem',
          color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)',
          textAlign: 'center',
          lineHeight: 1.8,
          marginBottom: '40px',
        }}>
          While Signal Integrity Mode is being built, you can already experience VERA.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          {[
            { title: 'Sanctuary', description: 'Your space to regulate and reflect.', link: '/sanctuary' },
            { title: 'Assessments', description: 'Understand how you work.', link: '/assessment' },
            { title: 'Pulse', description: 'Connect without performing.', link: '/pulse' },
          ].map((item, index) => (
            <a key={index} href={item.link} style={{
              padding: '28px 24px',
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
              borderRadius: '14px',
              textDecoration: 'none',
              display: 'block',
              textAlign: 'center',
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 500,
                color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.9)',
                marginBottom: '8px',
              }}>
                {item.title}
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(42,42,42,0.6)',
              }}>
                {item.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section style={{
        padding: '60px 24px 100px',
        maxWidth: '700px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
          fontWeight: 300,
          lineHeight: 1.6,
          color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(42,42,42,0.85)',
        }}>
          We built a platform that treats human limits as real, 
          and designs around them.
          <br /><br />
          This is a place to think out loud without being optimized, ranked, or pushed.
        </p>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 24px',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '0.8rem',
          color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(42,42,42,0.3)',
        }}>
          © 2026 VERA. All rights reserved.
        </p>
      </footer>
    </div>
  );
}