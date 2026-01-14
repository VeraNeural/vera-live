'use client';

import { useState, useEffect } from 'react';

interface StudioRoomProps {
  onBack: () => void;
}

type Tab = 'templates' | 'projects';

const TEMPLATES = [
  { id: 1, title: 'Sanctuary Spaces', desc: 'Calming environments to design', count: 6 },
  { id: 2, title: 'Healing Elements', desc: 'Objects for your sanctuary', count: 4 },
  { id: 3, title: 'Mood Palettes', desc: 'Color schemes for emotions', count: 5 },
];

export default function StudioRoom({ onBack }: StudioRoomProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('templates');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ minHeight: '100vh', background: '#1a1a2e' }} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1a1a2e 0%, #252545 50%, #1a1a30 100%)',
      fontFamily: "'Outfit', -apple-system, sans-serif",
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Floating particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 4,
              height: 4,
              background: 'rgba(180,140,255,0.3)',
              borderRadius: '50%',
              top: `${20 + Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Window */}
      <div style={{
        position: 'absolute',
        top: '8%',
        right: '8%',
        width: 160,
        height: 220,
        background: 'linear-gradient(180deg, #6a8caf 0%, #8ab4d4 40%, #5a7a9f 100%)',
        border: '5px solid #3a3a55',
        borderRadius: 4,
        overflow: 'hidden',
      }}>
        {/* Clouds */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 40,
          height: 20,
          background: 'rgba(255,255,255,0.7)',
          borderRadius: 20,
        }} />
        <div style={{
          position: 'absolute',
          top: '35%',
          right: '15%',
          width: 30,
          height: 15,
          background: 'rgba(255,255,255,0.5)',
          borderRadius: 15,
        }} />
        {/* Sun */}
        <div style={{
          position: 'absolute',
          top: '25%',
          right: '25%',
          width: 25,
          height: 25,
          background: 'radial-gradient(circle, #ffd700 0%, #ffb347 100%)',
          borderRadius: '50%',
          boxShadow: '0 0 20px rgba(255,200,0,0.5)',
        }} />
        {/* Hills */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: -10,
          right: -10,
          height: '35%',
          background: '#4a6a4a',
          borderRadius: '50% 50% 0 0',
        }} />
        {/* Window dividers */}
        <div style={{ position: 'absolute', top: 0, left: '50%', width: 5, height: '100%', background: '#3a3a55', zIndex: 2 }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 5, background: '#3a3a55', zIndex: 2 }} />
      </div>

      {/* Art on wall */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '12%',
        width: 120,
        height: 150,
        background: '#8a7a6a',
        border: '8px solid #5a4a3a',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Abstract art */}
        <div style={{
          width: 60,
          height: 80,
          background: '#3a3a50',
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        }} />
      </div>

      {/* Easel */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '8%',
      }}>
        {/* Canvas */}
        <div style={{
          width: 80,
          height: 100,
          background: '#e8e0d8',
          border: '4px solid #5a4a3a',
          marginBottom: 10,
        }} />
        {/* Stand */}
        <div style={{
          width: 40,
          height: 8,
          background: '#4a3a2a',
          margin: '0 auto',
        }} />
        {/* Legs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 30 }}>
          <div style={{ width: 4, height: 60, background: '#4a3a2a', transform: 'rotate(-10deg)' }} />
          <div style={{ width: 4, height: 60, background: '#4a3a2a', transform: 'rotate(10deg)' }} />
        </div>
      </div>

      {/* Desk with monitor */}
      <div style={{
        position: 'absolute',
        bottom: '12%',
        right: '10%',
      }}>
        {/* Monitor */}
        <div style={{
          width: 100,
          height: 65,
          background: '#2a2a40',
          borderRadius: '4px 4px 0 0',
          marginBottom: 5,
        }} />
        <div style={{ width: 30, height: 20, background: '#3a3a50', margin: '0 auto' }} />
        {/* Desk */}
        <div style={{
          width: 150,
          height: 15,
          background: '#3a3a50',
          borderRadius: 4,
          marginLeft: -25,
        }} />
        {/* Drawers */}
        <div style={{
          width: 150,
          height: 60,
          background: '#2a2a40',
          marginLeft: -25,
          borderRadius: '0 0 4px 4px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          padding: '8px 10px',
        }}>
          <div style={{ height: 15, background: '#3a3a55', borderRadius: 2 }} />
          <div style={{ height: 15, background: '#3a3a55', borderRadius: 2 }} />
        </div>
        {/* Plant */}
        <div style={{
          position: 'absolute',
          top: -30,
          right: -30,
        }}>
          <div style={{
            width: 25,
            height: 20,
            background: '#4a5a4a',
            borderRadius: '4px 4px 8px 8px',
          }} />
          <div style={{
            position: 'absolute',
            bottom: 18,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 30,
            height: 35,
          }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                position: 'absolute',
                width: 8,
                height: 25,
                background: '#5a8a5a',
                borderRadius: '50% 50% 0 0',
                left: `${30 + i * 20}%`,
                transform: `rotate(${-15 + i * 15}deg)`,
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
          gap: 8,
          padding: '12px 20px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 50,
          color: 'rgba(255,255,255,0.8)',
          fontSize: '0.9rem',
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        ← Back
      </button>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        padding: '80px 40px 40px',
        maxWidth: 800,
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 300,
          marginBottom: 8,
        }}>
          Design Studio
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 30,
        }}>
          Create your perfect sanctuary
        </p>

        {/* Main CTA */}
        <button
          style={{
            padding: '16px 40px',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            border: 'none',
            borderRadius: 50,
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
            marginBottom: 30,
            boxShadow: '0 8px 30px rgba(168,85,247,0.4)',
          }}
        >
          Open Virtual Design Studio
        </button>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 30,
        }}>
          {(['templates', 'projects'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px',
                background: activeTab === tab ? 'rgba(139,124,198,0.3)' : 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 30,
                color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.6)',
                fontSize: '0.9rem',
                cursor: 'pointer',
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
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}>
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                style={{
                  padding: '24px 20px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 16,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 500, marginBottom: 8 }}>
                  {template.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: 12 }}>
                  {template.desc}
                </p>
                <span style={{ color: 'rgba(139,124,198,0.8)', fontSize: '0.75rem' }}>
                  {template.count} options
                </span>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'projects' && (
          <div style={{
            padding: '60px 40px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 16,
            border: '1px dashed rgba(255,255,255,0.1)',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>
              No projects yet
            </p>
            <button
              style={{
                padding: '12px 24px',
                background: 'rgba(139,124,198,0.2)',
                border: '1px solid rgba(139,124,198,0.3)',
                borderRadius: 30,
                color: '#fff',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Create your first project
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}