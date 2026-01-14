'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Room = {
  id: string;
  name: string;
  essence: string;
};

const ROOMS: Room[] = [
  { id: 'therapy', name: 'Therapy Room', essence: 'SPEAK FREELY' },
  { id: 'zen', name: 'Zen Garden', essence: 'FIND STILLNESS' },
  { id: 'library', name: 'Library', essence: 'DISCOVER WISDOM' },
  { id: 'rest', name: 'Rest Chamber', essence: 'EMBRACE SLEEP' },
  { id: 'studio', name: 'Design Studio', essence: 'CREATE BEAUTY' },
  { id: 'journal', name: 'Journal Nook', essence: 'REFLECT DEEPLY' },
];

export default function SanctuaryPage() {
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

  const getGreeting = () => {
    switch (timeOfDay) {
      case 'morning': return 'Good morning';
      case 'afternoon': return 'Good afternoon';
      case 'evening': return 'Good evening';
      case 'night': return 'Welcome';
    }
  };

  const handleRoomClick = (room: Room) => {
    router.push(`/sanctuary/${room.id}`);
  };

  // Icon components
  const renderIcon = (id: string) => {
    const color = isDark ? 'rgba(160, 140, 180, 0.7)' : 'rgba(120, 100, 140, 0.6)';
    
    switch (id) {
      case 'therapy':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
            <path d="M12 20V4M4 12h16" />
          </svg>
        );
      case 'zen':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        );
      case 'library':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="11" y="6" width="4" height="14" />
            <rect x="16" y="8" width="4" height="12" />
          </svg>
        );
      case 'rest':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        );
      case 'studio':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="14" rx="2" />
            <line x1="12" y1="17" x2="12" y2="21" />
            <line x1="8" y1="21" x2="16" y2="21" />
          </svg>
        );
      case 'journal':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
            <rect x="5" y="3" width="14" height="18" rx="1" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="9" y1="12" x2="15" y2="12" />
            <line x1="9" y1="16" x2="12" y2="16" />
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
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow: hidden;
        }

        .sanctuary {
          position: fixed;
          inset: 0;
          background: ${isDark
            ? 'linear-gradient(180deg, #0a0a12 0%, #12121f 40%, #0d0d18 100%)'
            : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)'};
          overflow: hidden;
        }

        /* Architecture */
        .wall {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 65%;
          background: ${isDark
            ? 'linear-gradient(180deg, #0e0e18 0%, #141420 60%, #18182a 100%)'
            : 'linear-gradient(180deg, #faf8f5 0%, #f5f0e8 60%, #ebe5db 100%)'};
        }

        .floor {
          position: absolute;
          bottom: 0;
          left: -20%;
          right: -20%;
          height: 50%;
          background: ${isDark
            ? 'linear-gradient(180deg, #18182a 0%, #0f0f1a 50%, #0a0a12 100%)'
            : 'linear-gradient(180deg, #ebe5db 0%, #ddd5c8 50%, #d0c8ba 100%)'};
          transform: perspective(1000px) rotateX(65deg);
          transform-origin: top center;
        }

        /* Window */
        .window {
          position: absolute;
          top: 8%;
          right: 8%;
          width: 22%;
          max-width: 220px;
          aspect-ratio: 3/4;
          background: ${isDark
            ? 'linear-gradient(180deg, #0a1020 0%, #151535 40%, #0d0d28 100%)'
            : 'linear-gradient(180deg, #d4e8f0 0%, #b8d8e8 30%, #a8d0e0 60%, #c8e0ec 100%)'};
          border: 5px solid ${isDark ? '#252540' : '#c8b8a8'};
          border-radius: 4px;
          overflow: hidden;
        }

        .window-mullion-v {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 5px;
          height: 100%;
          background: ${isDark ? '#252540' : '#c8b8a8'};
        }

        .window-mullion-h {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 100%;
          height: 5px;
          background: ${isDark ? '#252540' : '#c8b8a8'};
        }

        .trees {
          position: absolute;
          bottom: 10%;
          left: 0;
          right: 0;
          height: 50%;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          padding: 0 10%;
        }

        .tree {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .tree-canopy {
          border-radius: 50% 50% 45% 45%;
        }

        .tree-trunk {
          background: ${isDark ? '#1a1a30' : '#6b7b68'};
        }

        /* Moon */
        .moon {
          position: absolute;
          top: 15%;
          right: 18%;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #f4f4ff 0%, #d8d8f0 50%, #b8b8e0 100%);
          box-shadow: 0 0 20px rgba(200, 210, 255, 0.4);
          display: ${isDark ? 'block' : 'none'};
        }

        /* Pendant Light */
        .pendant {
          position: absolute;
          top: 0;
          left: 38%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pendant-cord {
          width: 2px;
          height: 70px;
          background: ${isDark ? '#3a3a50' : '#a0a090'};
        }

        .pendant-shade {
          width: 60px;
          height: 40px;
          background: ${isDark
            ? 'linear-gradient(180deg, rgba(255,250,240,0.85) 0%, rgba(240,235,220,0.8) 100%)'
            : 'linear-gradient(180deg, #faf8f4 0%, #f0ebe4 100%)'};
          border-radius: 50% 50% 45% 45% / 30% 30% 70% 70%;
          box-shadow: 0 8px 30px ${isDark ? 'rgba(255,200,120,0.2)' : 'rgba(0,0,0,0.08)'};
        }

        /* Sofa */
        .sofa-group {
          position: absolute;
          bottom: 22%;
          left: 50%;
          transform: translateX(-50%);
          width: 320px;
        }

        .sofa {
          position: relative;
          height: 130px;
        }

        .sofa-back {
          position: absolute;
          bottom: 45px;
          left: 0;
          right: 0;
          height: 85px;
          background: ${isDark
            ? 'linear-gradient(180deg, #3a3250 0%, #2d2840 50%, #252238 100%)'
            : 'linear-gradient(180deg, #e8e0d4 0%, #dcd4c4 50%, #d0c8b8 100%)'};
          border-radius: 18px 18px 0 0;
        }

        .sofa-seat {
          position: absolute;
          bottom: 25px;
          left: 8%;
          right: 8%;
          height: 32px;
          background: ${isDark
            ? 'linear-gradient(180deg, #403858 0%, #342e48 100%)'
            : 'linear-gradient(180deg, #f0e8dc 0%, #e4dcd0 100%)'};
          border-radius: 10px;
          box-shadow: 0 10px 30px ${isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.06)'};
        }

        .sofa-arm {
          position: absolute;
          bottom: 25px;
          width: 10%;
          height: 65px;
          background: ${isDark
            ? 'linear-gradient(180deg, #3a3250 0%, #2d2840 100%)'
            : 'linear-gradient(180deg, #e0d8cc 0%, #d4ccc0 100%)'};
          border-radius: 12px;
        }

        .arm-left {
          left: 0;
          border-radius: 12px 5px 5px 12px;
        }

        .arm-right {
          right: 0;
          border-radius: 5px 12px 12px 5px;
        }

        .sofa-leg {
          position: absolute;
          bottom: 0;
          width: 7px;
          height: 25px;
          background: ${isDark ? '#1a1828' : '#6b5545'};
          border-radius: 2px;
        }

        .pillow {
          position: absolute;
          bottom: 75px;
          width: 42px;
          height: 36px;
          border-radius: 8px;
          box-shadow: 2px 4px 12px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'};
        }

        .pillow-1 {
          left: 15%;
          background: ${isDark ? '#4a6b5a' : '#a8b5a0'};
          transform: rotate(-8deg);
        }

        .pillow-2 {
          right: 15%;
          background: ${isDark ? '#6b5a4a' : '#c4a890'};
          transform: rotate(6deg);
        }

        /* Coffee Table */
        .coffee-table {
          position: absolute;
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%);
          width: 140px;
        }

        .table-top {
          height: 12px;
          background: ${isDark ? '#3a2a1a' : '#a08060'};
          border-radius: 16px;
          box-shadow: 0 10px 30px ${isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.12)'};
        }

        .table-legs {
          display: flex;
          justify-content: space-between;
          padding: 0 20%;
          margin-top: 5px;
        }

        .table-leg {
          width: 6px;
          height: 30px;
          background: ${isDark ? '#2a1a0a' : '#806848'};
          border-radius: 2px;
        }

        .table-items {
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: flex-end;
          gap: 20px;
        }

        .vase {
          width: 18px;
          height: 35px;
          background: ${isDark ? '#d0c8c0' : '#f8f4f0'};
          border-radius: 6px 6px 4px 4px;
        }

        .books {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .book {
          height: 6px;
          border-radius: 1px;
        }

        .book-1 { width: 32px; background: ${isDark ? '#4a6a5a' : '#8aa898'}; }
        .book-2 { width: 28px; background: ${isDark ? '#6a5040' : '#c4a484'}; }
        .book-3 { width: 30px; background: ${isDark ? '#5a5a6a' : '#a8a8b8'}; }

        .candle {
          width: 14px;
          height: 24px;
          background: linear-gradient(180deg, #faf8f4 0%, #e8e4dc 100%);
          border-radius: 2px;
          position: relative;
        }

        .flame {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 12px;
          background: radial-gradient(ellipse at 50% 80%, rgba(255,220,140,0.9) 0%, rgba(255,160,60,0.6) 50%, transparent 100%);
          border-radius: 50% 50% 50% 50% / 70% 70% 30% 30%;
          animation: flicker 0.4s ease-in-out infinite alternate;
        }

        @keyframes flicker {
          0% { transform: translateX(-50%) scaleY(1) rotate(-2deg); }
          100% { transform: translateX(-50%) scaleY(1.1) rotate(2deg); }
        }

        /* Plant */
        .plant {
          position: absolute;
          bottom: 24%;
          right: 12%;
        }

        .pot {
          width: 40px;
          height: 35px;
          background: ${isDark ? '#3a3030' : '#c4b4a0'};
          border-radius: 4px 4px 10px 10px;
        }

        .leaves {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          width: 70px;
          height: 80px;
        }

        .leaf {
          position: absolute;
          background: ${isDark ? '#2d4535' : '#5a8a60'};
          border-radius: 50% 50% 50% 50% / 90% 90% 10% 10%;
          transform-origin: bottom center;
        }

        .leaf-1 { width: 12px; height: 40px; left: 29px; bottom: 0; }
        .leaf-2 { width: 14px; height: 48px; left: 32px; bottom: 0; transform: rotate(8deg); }
        .leaf-3 { width: 11px; height: 35px; left: 22px; bottom: 5px; transform: rotate(-15deg); }
        .leaf-4 { width: 13px; height: 42px; left: 38px; bottom: 3px; transform: rotate(12deg); }

        /* Floor Lamp */
        .floor-lamp {
          position: absolute;
          bottom: 28%;
          left: 10%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .lamp-shade {
          width: 45px;
          height: 35px;
          background: ${isDark ? '#f8f4ec' : '#fcfaf6'};
          border-radius: 6px 6px 18px 18px;
          box-shadow: inset 0 -20px 30px ${isDark ? 'rgba(255,200,120,0.25)' : 'rgba(255,220,150,0.2)'};
        }

        .lamp-pole {
          width: 5px;
          height: 100px;
          background: ${isDark ? '#4a3a28' : '#907858'};
        }

        .lamp-base {
          width: 30px;
          height: 8px;
          background: ${isDark ? '#3a2a18' : '#806848'};
          border-radius: 50%;
        }

        /* Greeting */
        .greeting-area {
          position: absolute;
          top: 32%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 10;
        }

        .greeting {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 300;
          color: ${isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.6)'};
          margin-bottom: 8px;
        }

        .greeting-sub {
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: ${isDark ? 'rgba(255,255,255,0.35)' : 'rgba(42,42,42,0.35)'};
        }

        /* Room Cards */
        .rooms {
          position: absolute;
          top: 15%;
          left: 3%;
          z-index: 20;
        }

        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .room-card {
          width: 100px;
          padding: 18px 12px;
          background: ${isDark
            ? 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.65) 100%)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
          border-radius: 14px;
          text-align: center;
          cursor: pointer;
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
          position: relative;
        }

        .room-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'};
        }

        .room-icon {
          margin-bottom: 10px;
          opacity: 0.85;
        }

        .room-name {
          font-size: 0.75rem;
          font-weight: 500;
          color: ${isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.85)'};
          margin-bottom: 3px;
        }

        .room-essence {
          font-size: 0.5rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'};
        }

        /* Bottom Bar */
        .bottom-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          padding-bottom: max(20px, env(safe-area-inset-bottom));
          background: linear-gradient(to top, ${isDark ? 'rgba(10,10,18,0.95)' : 'rgba(248,246,242,0.95)'} 0%, transparent 100%);
          display: flex;
          justify-content: center;
          z-index: 30;
        }

        .talk-btn {
          padding: 16px 40px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          border-radius: 50px;
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.35);
          transition: all 0.3s ease;
        }

        .talk-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(139, 92, 246, 0.45);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .rooms {
            top: 12%;
            left: 2%;
          }

          .rooms-grid {
            gap: 6px;
          }

          .room-card {
            width: 85px;
            padding: 14px 10px;
          }

          .room-name {
            font-size: 0.65rem;
          }

          .sofa-group {
            width: 260px;
            bottom: 20%;
          }

          .coffee-table {
            width: 120px;
          }

          .greeting {
            font-size: 1.5rem;
          }

          .floor-lamp {
            display: none;
          }

          .plant {
            right: 8%;
          }
        }

        @media (max-width: 480px) {
          .rooms-grid {
            grid-template-columns: 1fr;
          }

          .room-card {
            width: 75px;
            padding: 12px 8px;
          }

          .room-essence {
            display: none;
          }

          .window {
            width: 25%;
            top: 6%;
            right: 5%;
          }

          .sofa-group {
            width: 220px;
          }

          .plant {
            display: none;
          }
        }
      `}</style>

      <div className="sanctuary">
        {/* Wall & Floor */}
        <div className="wall" />
        <div className="floor" />

        {/* Window */}
        <div className="window">
          <div className="moon" />
          <div className="trees">
            <div className="tree">
              <div className="tree-canopy" style={{ width: 28, height: 36, background: isDark ? 'rgba(30,50,40,0.9)' : 'rgba(80,110,80,0.7)' }} />
              <div className="tree-trunk" style={{ width: 5, height: 18 }} />
            </div>
            <div className="tree">
              <div className="tree-canopy" style={{ width: 38, height: 48, background: isDark ? 'rgba(25,45,35,0.95)' : 'rgba(70,100,70,0.75)' }} />
              <div className="tree-trunk" style={{ width: 6, height: 24 }} />
            </div>
            <div className="tree">
              <div className="tree-canopy" style={{ width: 24, height: 30, background: isDark ? 'rgba(35,55,45,0.85)' : 'rgba(90,120,85,0.65)' }} />
              <div className="tree-trunk" style={{ width: 4, height: 14 }} />
            </div>
          </div>
          <div className="window-mullion-v" />
          <div className="window-mullion-h" />
        </div>

        {/* Pendant Light */}
        <div className="pendant">
          <div className="pendant-cord" />
          <div className="pendant-shade" />
        </div>

        {/* Floor Lamp */}
        <div className="floor-lamp">
          <div className="lamp-shade" />
          <div className="lamp-pole" />
          <div className="lamp-base" />
        </div>

        {/* Sofa */}
        <div className="sofa-group">
          <div className="sofa">
            <div className="sofa-back" />
            <div className="sofa-seat" />
            <div className="sofa-arm arm-left" />
            <div className="sofa-arm arm-right" />
            <div className="sofa-leg" style={{ left: '15%' }} />
            <div className="sofa-leg" style={{ left: '40%' }} />
            <div className="sofa-leg" style={{ right: '40%' }} />
            <div className="sofa-leg" style={{ right: '15%' }} />
            <div className="pillow pillow-1" />
            <div className="pillow pillow-2" />
          </div>
        </div>

        {/* Coffee Table */}
        <div className="coffee-table">
          <div className="table-items">
            <div className="vase" />
            <div className="books">
              <div className="book book-1" />
              <div className="book book-2" />
              <div className="book book-3" />
            </div>
            <div className="candle">
              <div className="flame" />
            </div>
          </div>
          <div className="table-top" />
          <div className="table-legs">
            <div className="table-leg" />
            <div className="table-leg" />
          </div>
        </div>

        {/* Plant */}
        <div className="plant">
          <div className="leaves">
            <div className="leaf leaf-1" />
            <div className="leaf leaf-2" />
            <div className="leaf leaf-3" />
            <div className="leaf leaf-4" />
          </div>
          <div className="pot" />
        </div>

        {/* Greeting */}
        <div className="greeting-area">
          <h1 className="greeting">{getGreeting()}</h1>
          <p className="greeting-sub">Your sanctuary awaits</p>
        </div>

        {/* Room Cards */}
        <div className="rooms">
          <div className="rooms-grid">
            {ROOMS.map((room) => (
              <div
                key={room.id}
                className="room-card"
                onClick={() => handleRoomClick(room)}
              >
                <div className="room-icon">{renderIcon(room.id)}</div>
                <div className="room-name">{room.name}</div>
                <div className="room-essence">{room.essence}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bottom-bar">
          <button className="talk-btn" onClick={() => router.push('/')}>
            Talk to VERA
          </button>
        </div>
      </div>
    </>
  );
}