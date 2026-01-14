'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface VeraSanctuaryProps {
  onRoomSelect: (room: string) => void;
  userName?: string;
}

const ROOMS = [
  { id: 'therapy', name: 'Therapy Room', essence: 'Speak freely', icon: '💬' },
  { id: 'zen', name: 'Zen Garden', essence: 'Find stillness', icon: '🧘' },
  { id: 'library', name: 'Library', essence: 'Discover wisdom', icon: '📚' },
  { id: 'bedroom', name: 'Rest Chamber', essence: 'Embrace sleep', icon: '🌙' },
  { id: 'studio', name: 'Design Studio', essence: 'Create beauty', icon: '🎨' },
  { id: 'journal', name: 'Journal Nook', essence: 'Reflect deeply', icon: '📝' },
  { id: 'pulse', name: 'Pulse', essence: 'Connect with others', icon: '💜' },
];

export default function VeraSanctuary({ onRoomSelect, userName }: VeraSanctuaryProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  useEffect(() => {
    setIsLoaded(true);
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
    else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);

  const isDark = timeOfDay === 'evening' || timeOfDay === 'night';

  const getGreeting = () => {
    const name = userName ? `, ${userName}` : '';
    switch (timeOfDay) {
      case 'morning': return `Good morning${name}`;
      case 'afternoon': return `Good afternoon${name}`;
      case 'evening': return `Good evening${name}`;
      case 'night': return `Welcome${name}`;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: isDark
          ? 'linear-gradient(180deg, #0a0a12 0%, #12121f 40%, #0d0d18 100%)'
          : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)',
        color: isDark ? '#ffffff' : '#2a2a2a',
        fontFamily: "'Outfit', -apple-system, sans-serif",
        overflow: 'hidden',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}
    >
      {/* Greeting */}
      <div
        style={{
          textAlign: 'center',
          paddingTop: '12vh',
          marginBottom: '4vh',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(1.8rem, 5vw, 3rem)',
            fontWeight: 300,
            margin: 0,
            opacity: 0.8,
          }}
        >
          {getGreeting()}
        </h1>
        <p
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            opacity: 0.5,
            marginTop: '12px',
          }}
        >
          Your sanctuary awaits
        </p>
      </div>

      {/* Orb */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '6vh',
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.3), rgba(160,140,200,0.5) 30%, rgba(120,100,180,0.4) 60%, rgba(90,70,160,0.3))',
            boxShadow: '0 0 60px rgba(140,120,200,0.4), 0 0 120px rgba(140,120,200,0.2)',
            cursor: 'pointer',
          }}
          onClick={() => window.location.href = '/'}
        />
      </div>

      {/* Room Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px',
          maxWidth: '600px',
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        {ROOMS.map((room) => (
          <div
            key={room.id}
            onClick={() => onRoomSelect(room.id)}
            style={{
              background: isDark
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
              borderRadius: '16px',
              padding: '24px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{room.icon}</div>
            <div style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '4px' }}>
              {room.name}
            </div>
            <div
              style={{
                fontSize: '0.65rem',
                opacity: 0.5,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {room.essence}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Button */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '24px',
          display: 'flex',
          justifyContent: 'center',
          background: `linear-gradient(to top, ${isDark ? 'rgba(10,10,18,0.95)' : 'rgba(248,246,242,0.95)'}, transparent)`,
        }}
      >
        <a
          href="/"
          style={{
            padding: '16px 40px',
            borderRadius: '50px',
            background: 'linear-gradient(135deg, #8B7CC6 0%, #6B5CA6 100%)',
            color: '#ffffff',
            fontWeight: 500,
            textDecoration: 'none',
            boxShadow: '0 8px 30px rgba(139,124,198,0.4)',
          }}
        >
          Talk to VERA
        </a>
      </div>
    </div>
  );
}