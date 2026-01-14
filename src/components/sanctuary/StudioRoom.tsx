'use client';

import { useState } from 'react';

interface DesignStudioProps {
  onBack: () => void;
}

type Tab = 'templates' | 'projects';

const TEMPLATES = [
  { id: 1, title: 'Sanctuary Spaces', desc: 'Calming environments to design', count: 6 },
  { id: 2, title: 'Healing Elements', desc: 'Objects for your sanctuary', count: 4 },
  { id: 3, title: 'Mood Palettes', desc: 'Color schemes for emotions', count: 5 },
];

export default function DesignStudio({ onBack }: DesignStudioProps) {
  const [activeTab, setActiveTab] = useState<Tab>('templates');

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0.2; }
          50% { transform: translateY(-15px); opacity: 0.5; }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #18182a 0%, #1e1e38 50%, #141428 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        
        {/* Floating particles - subtle */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: i % 3 === 0 ? 4 : 3,
                height: i % 3 === 0 ? 4 : 3,
                background: `rgba(168, 85, 247, ${0.2 + Math.random() * 0.2})`,
                borderRadius: '50%',
                top: `${15 + Math.random() * 55}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${6 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '20%',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 60%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'glow 8s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* Window */}
        <div style={{
          position: 'absolute',
          top: '6%',
          right: '6%',
          width: 130,
          height: 175,
          background: 'linear-gradient(180deg, #7a9fc0 0%, #9ac4e0 40%, #6a8fb0 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: 'inset 0 0 30px rgba(255,255,255,0.1)',
        }}>
          {/* Sun */}
          <div style={{
            position: 'absolute',
            top: 22,
            right: 22,
            width: 20,
            height: 20,
            background: 'radial-gradient(circle at 35% 35%, #fff8e0 0%, #ffd700 100%)',
            borderRadius: '50%',
            boxShadow: '0 0 20px rgba(255,200,0,0.4)',
          }} />
          {/* Soft clouds */}
          <div style={{
            position: 'absolute',
            top: '25%',
            left: '8%',
            width: 32,
            height: 14,
            background: 'rgba(255,255,255,0.5)',
            borderRadius: 14,
            filter: 'blur(1px)',
          }} />
          {/* Hills */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: -10,
            right: -10,
            height: '30%',
            background: 'linear-gradient(180deg, rgba(90,130,90,0.8) 0%, rgba(70,110,70,0.9) 100%)',
            borderRadius: '50% 50% 0 0',
          }} />
          {/* Window dividers */}
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: '50%', 
            width: 1, 
            height: '100%', 
            background: 'rgba(255,255,255,0.15)',
            transform: 'translateX(-50%)',
          }} />
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: 0, 
            width: '100%', 
            height: 1, 
            background: 'rgba(255,255,255,0.15)',
            transform: 'translateY(-50%)',
          }} />
        </div>

        {/* Art Frame on Wall */}
        <div style={{
          position: 'absolute',
          top: '8%',
          left: '10%',
          width: 100,
          height: 130,
          background: 'linear-gradient(180deg, rgba(60,55,75,0.6) 0%, rgba(50,45,65,0.5) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          {/* Abstract art */}
          <div style={{
            width: 50,
            height: 70,
            background: 'linear-gradient(135deg, rgba(168,85,247,0.4) 0%, rgba(236,72,153,0.3) 100%)',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          }} />
        </div>

        {/* Easel - Refined */}
        <div style={{
          position: 'absolute',
          bottom: '18%',
          left: '7%',
        }}>
          {/* Canvas */}
          <div style={{
            width: 70,
            height: 90,
            background: 'linear-gradient(180deg, #f5f2ec 0%, #e8e2d8 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2,
            marginBottom: 8,
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          }} />
          {/* Stand */}
          <div style={{
            width: 35,
            height: 6,
            background: 'rgba(80,70,100,0.6)',
            margin: '0 auto',
            borderRadius: 2,
          }} />
          {/* Legs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 4 }}>
            <div style={{ 
              width: 2, 
              height: 55, 
              background: 'linear-gradient(180deg, rgba(80,70,100,0.7) 0%, rgba(60,50,80,0.5) 100%)', 
              transform: 'rotate(-10deg)',
              borderRadius: 1,
            }} />
            <div style={{ 
              width: 2, 
              height: 55, 
              background: 'linear-gradient(180deg, rgba(80,70,100,0.7) 0%, rgba(60,50,80,0.5) 100%)', 
              transform: 'rotate(10deg)',
              borderRadius: 1,
            }} />
          </div>
        </div>

        {/* Desk with Monitor - Refined */}
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '8%',
        }}>
          {/* Monitor */}
          <div style={{
            width: 85,
            height: 55,
            background: 'linear-gradient(180deg, rgba(40,38,60,0.8) 0%, rgba(30,28,50,0.7) 100%)',
            borderRadius: '4px 4px 0 0',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Screen glow */}
            <div style={{
              width: '80%',
              height: '80%',
              background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(100,80,150,0.05) 100%)',
              borderRadius: 2,
            }} />
          </div>
          {/* Stand */}
          <div style={{ 
            width: 24, 
            height: 16, 
            background: 'rgba(50,45,70,0.6)', 
            margin: '0 auto',
            borderRadius: '0 0 2px 2px',
          }} />
          {/* Desk surface */}
          <div style={{
            width: 130,
            height: 12,
            background: 'linear-gradient(180deg, rgba(60,55,80,0.7) 0%, rgba(50,45,70,0.6) 100%)',
            borderRadius: 3,
            marginLeft: -22,
            marginTop: 4,
            border: '1px solid rgba(255,255,255,0.05)',
          }} />
          {/* Desk body */}
          <div style={{
            width: 130,
            height: 50,
            background: 'linear-gradient(180deg, rgba(45,42,65,0.6) 0%, rgba(35,32,55,0.5) 100%)',
            marginLeft: -22,
            borderRadius: '0 0 4px 4px',
            border: '1px solid rgba(255,255,255,0.04)',
            borderTop: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            padding: '8px 10px',
          }}>
            <div style={{ 
              height: 14, 
              background: 'rgba(60,55,85,0.5)', 
              borderRadius: 2,
              border: '1px solid rgba(255,255,255,0.03)',
            }} />
            <div style={{ 
              height: 14, 
              background: 'rgba(60,55,85,0.5)', 
              borderRadius: 2,
              border: '1px solid rgba(255,255,255,0.03)',
            }} />
          </div>
          
          {/* Small plant */}
          <div style={{
            position: 'absolute',
            top: -25,
            right: -25,
          }}>
            <div style={{
              width: 22,
              height: 18,
              background: 'linear-gradient(180deg, rgba(70,65,90,0.7) 0%, rgba(55,50,75,0.6) 100%)',
              borderRadius: '3px 3px 6px 6px',
              border: '1px solid rgba(255,255,255,0.05)',
            }} />
            <div style={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
            }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  position: 'absolute',
                  width: 6,
                  height: 20,
                  background: 'linear-gradient(180deg, rgba(100,160,100,0.8) 0%, rgba(80,130,80,0.6) 100%)',
                  borderRadius: '50% 50% 0 0',
                  left: `${-8 + i * 8}px`,
                  transform: `rotate(${-12 + i * 12}deg)`,
                  transformOrigin: 'bottom center',
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 18px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 50,
            color: 'rgba(255,255,255,0.6)',
            fontSize: 13,
            fontWeight: 450,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 10,
          }}
        >
          ← Back to Sanctuary
        </button>

        {/* Main Content */}
        <div style={{
          position: 'relative',
          zIndex: 5,
          padding: '70px 24px 40px',
          maxWidth: 700,
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(2rem, 5vw, 2.8rem)',
            fontWeight: 300,
            marginBottom: 8,
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '-0.02em',
          }}>
            Design Studio
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 32,
            fontSize: 14,
            letterSpacing: '0.03em',
          }}>
            Create your perfect sanctuary
          </p>

          {/* Main CTA */}
          <button
            style={{
              padding: '15px 36px',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              border: 'none',
              borderRadius: 50,
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: 36,
              boxShadow: '0 8px 30px rgba(168,85,247,0.35)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(168,85,247,0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(168,85,247,0.35)';
            }}
          >
            Open Virtual Design Studio
          </button>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 28,
          }}>
            {(['templates', 'projects'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 22px',
                  background: activeTab === tab ? 'rgba(168,85,247,0.15)' : 'transparent',
                  border: `1px solid ${activeTab === tab ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 25,
                  color: activeTab === tab ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
                  fontSize: 13,
                  fontWeight: activeTab === tab ? 500 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'capitalize',
                }}
              >
                {tab === 'projects' ? 'My Projects' : tab}
              </button>
            ))}
          </div>

          {/* Template Cards */}
          {activeTab === 'templates' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 14,
            }}>
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  style={{
                    padding: '24px 18px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 16,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'rgba(168,85,247,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >
                  <h3 style={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    fontSize: 15, 
                    fontWeight: 500, 
                    marginBottom: 8,
                    letterSpacing: '-0.01em',
                  }}>
                    {template.title}
                  </h3>
                  <p style={{ 
                    color: 'rgba(255,255,255,0.4)', 
                    fontSize: 12, 
                    marginBottom: 12,
                    lineHeight: 1.4,
                  }}>
                    {template.desc}
                  </p>
                  <span style={{ 
                    color: 'rgba(168,85,247,0.7)', 
                    fontSize: 11,
                    letterSpacing: '0.05em',
                  }}>
                    {template.count} options
                  </span>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'projects' && (
            <div style={{
              padding: '50px 30px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 16,
              border: '1px dashed rgba(255,255,255,0.08)',
            }}>
              <p style={{ 
                color: 'rgba(255,255,255,0.4)', 
                marginBottom: 18,
                fontSize: 14,
              }}>
                No projects yet
              </p>
              <button
                style={{
                  padding: '12px 24px',
                  background: 'rgba(168,85,247,0.15)',
                  border: '1px solid rgba(168,85,247,0.25)',
                  borderRadius: 25,
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: 13,
                  fontWeight: 450,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Create your first project
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}