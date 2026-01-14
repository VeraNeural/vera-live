'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface VeraSanctuaryProps {
  onRoomSelect: (room: string) => void;
  userName?: string;
}

type Room = {
  id: string;
  name: string;
  essence: string;
};

const ROOMS: Room[] = [
  { id: 'therapy', name: 'Therapy Room', essence: 'Speak freely' },
  { id: 'zen', name: 'Zen Garden', essence: 'Find stillness' },
  { id: 'library', name: 'Library', essence: 'Discover wisdom' },
  { id: 'bedroom', name: 'Rest Chamber', essence: 'Embrace sleep' },
  { id: 'studio', name: 'Design Studio', essence: 'Create beauty' },
  { id: 'journal', name: 'Journal Nook', essence: 'Reflect deeply' },
  { id: 'pulse', name: 'Pulse', essence: 'Connect with others' },
];

export default function VeraSanctuary({ onRoomSelect, userName }: VeraSanctuaryProps) {
  const router = useRouter();
  const [activePortal, setActivePortal] = useState<string | null>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [breathPhase, setBreathPhase] = useState(0);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);

    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
    else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');

    const breathInterval = setInterval(() => {
      setBreathPhase(prev => (prev + 1) % 100);
    }, 80);

    return () => clearInterval(breathInterval);
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

  const handlePortalEnter = (roomId: string) => {
    setIsEntering(true);
    setActivePortal(roomId);
    setTimeout(() => onRoomSelect(roomId), 800);
  };

  const handleTalkToVera = () => {
    window.location.href = 'https://veraneural.ai/chat-exact';
  };

  const breathValue = Math.sin(breathPhase * 0.0628) * 0.5 + 0.5;
  const dustPositions = [65, 78, 45, 82, 55, 72, 38, 88, 50, 75, 42, 68, 58, 85, 48];

  return (
    <div className={`sanctuary ${isEntering ? 'entering' : ''}`}>
      <style jsx>{`
        .sanctuary {
          position: fixed;
          inset: 0;
          overflow: hidden;
          font-family: 'Outfit', -apple-system, sans-serif;
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .sanctuary.entering { opacity: 0; transform: scale(1.05); }

        .room-environment {
          position: absolute;
          inset: 0;
          background: ${isDark 
            ? 'linear-gradient(180deg, #0a0a12 0%, #12121f 40%, #0d0d18 100%)'
            : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)'};
          transition: background 2s ease;
        }

        .vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${isDark ? 0.4 : 0.15}) 100%)),
                      radial-gradient(ellipse 80% 50% at 50% 60%, rgba(138, 100, 200, 0.08) 0%, transparent 50%);
          pointer-events: none;
          z-index: 5;
        }

        .architecture {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: ${isLoaded ? 1 : 0};
          transition: opacity 1.5s ease 0.3s;
        }

        .wall {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 65%;
          background: ${isDark
            ? 'linear-gradient(180deg, #0e0e18 0%, #141420 60%, #18182a 100%)'
            : 'linear-gradient(180deg, #faf8f5 0%, #f5f0e8 60%, #ebe5db 100%)'};
        }

        .floor {
          position: absolute;
          bottom: 0; left: -20%; right: -20%;
          height: 50%;
          background: ${isDark
            ? 'linear-gradient(180deg, #18182a 0%, #0f0f1a 50%, #0a0a12 100%)'
            : 'linear-gradient(180deg, #ebe5db 0%, #ddd5c8 50%, #d0c8ba 100%)'};
          transform: perspective(1000px) rotateX(65deg);
          transform-origin: top center;
        }

        .floor-reflection {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 30%;
          background: linear-gradient(180deg, ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.3)'} 0%, transparent 100%);
        }

        /* ============ WINDOW WITH TREES ============ */

        .window-area {
          position: absolute;
          top: 8%; right: 8%;
          width: 28%; max-width: 280px;
          aspect-ratio: 3/4;
        }

        .window-frame {
          position: absolute;
          inset: 0;
          background: ${isDark
            ? 'linear-gradient(180deg, #0a1020 0%, #151535 40%, #0d0d28 100%)'
            : 'linear-gradient(180deg, #d4e8f0 0%, #b8d8e8 30%, #a8d0e0 60%, #c8e0ec 100%)'};
          border: 6px solid ${isDark ? '#252540' : '#c8b8a8'};
          border-radius: 4px;
          box-shadow: inset 0 0 80px ${isDark ? 'rgba(100, 120, 200, 0.1)' : 'rgba(255, 255, 255, 0.6)'}, 0 20px 60px ${isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)'};
          overflow: hidden;
        }

        /* Trees visible through window */
        .window-trees {
          position: absolute;
          bottom: 10%;
          left: 0; right: 0;
          height: 60%;
          pointer-events: none;
        }

        .tree {
          position: absolute;
          bottom: 0;
        }

        .tree-trunk {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          background: ${isDark ? '#1a1a30' : '#6b7b68'};
          border-radius: 2px;
        }

        .tree-canopy {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 50% 50% 45% 45%;
        }

        .tree-1 { left: 15%; }
        .tree-1 .tree-trunk { width: 6px; height: 25px; }
        .tree-1 .tree-canopy { width: 35px; height: 45px; background: ${isDark ? 'rgba(30, 50, 40, 0.9)' : 'rgba(80, 110, 80, 0.7)'}; }

        .tree-2 { left: 40%; }
        .tree-2 .tree-trunk { width: 8px; height: 35px; }
        .tree-2 .tree-canopy { width: 50px; height: 60px; background: ${isDark ? 'rgba(25, 45, 35, 0.95)' : 'rgba(70, 100, 70, 0.75)'}; }

        .tree-3 { left: 70%; }
        .tree-3 .tree-trunk { width: 5px; height: 20px; }
        .tree-3 .tree-canopy { width: 30px; height: 38px; background: ${isDark ? 'rgba(35, 55, 45, 0.85)' : 'rgba(90, 120, 85, 0.65)'}; }

        .tree-4 { left: 88%; }
        .tree-4 .tree-trunk { width: 4px; height: 15px; }
        .tree-4 .tree-canopy { width: 22px; height: 28px; background: ${isDark ? 'rgba(30, 50, 40, 0.8)' : 'rgba(85, 115, 80, 0.6)'}; }

        /* Distant trees/hills */
        .tree-line {
          position: absolute;
          bottom: 0;
          left: -10%; right: -10%;
          height: 25%;
          background: ${isDark 
            ? 'linear-gradient(180deg, transparent 0%, rgba(20, 35, 30, 0.6) 50%, rgba(15, 30, 25, 0.8) 100%)'
            : 'linear-gradient(180deg, transparent 0%, rgba(100, 130, 100, 0.3) 50%, rgba(80, 110, 80, 0.4) 100%)'};
          border-radius: 100% 100% 0 0;
        }

        .window-mullion-v {
          position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 6px; height: 100%;
          background: ${isDark ? '#252540' : '#c8b8a8'};
          z-index: 2;
        }

        .window-mullion-h {
          position: absolute;
          top: 50%; left: 0; transform: translateY(-50%);
          width: 100%; height: 6px;
          background: ${isDark ? '#252540' : '#c8b8a8'};
          z-index: 2;
        }

        .window-sill {
          position: absolute;
          bottom: -16px; left: -12px; right: -12px;
          height: 16px;
          background: ${isDark ? 'linear-gradient(180deg, #2a2a48 0%, #202038 100%)' : 'linear-gradient(180deg, #c8b8a8 0%, #b8a898 100%)'};
          border-radius: 0 0 4px 4px;
          z-index: 3;
        }

        .celestial-body {
          position: absolute;
          top: 12%; right: 18%;
          width: ${isDark ? '24px' : '0px'}; height: ${isDark ? '24px' : '0px'};
          border-radius: 50%;
          background: ${isDark ? 'radial-gradient(circle at 35% 35%, #f4f4ff 0%, #d8d8f0 50%, #b8b8e0 100%)' : 'transparent'};
          box-shadow: ${isDark ? '0 0 30px rgba(200, 210, 255, 0.5)' : 'none'};
          transition: all 1s ease;
          z-index: 1;
        }

        /* ============ LIGHT BEAMS ============ */

        .light-beams {
          position: absolute;
          top: 0; right: 5%;
          width: 50%; height: 100%;
          overflow: hidden;
          pointer-events: none;
          opacity: ${isDark ? 0.2 : 0.85};
        }

        .beam {
          position: absolute;
          top: -10%;
          background: ${isDark
            ? 'linear-gradient(180deg, rgba(100, 120, 200, 0.1) 0%, rgba(100, 120, 200, 0.03) 40%, transparent 80%)'
            : 'linear-gradient(180deg, rgba(255, 252, 245, 0.45) 0%, rgba(255, 250, 240, 0.15) 40%, transparent 80%)'};
          transform-origin: top center;
          animation: beamSway 20s ease-in-out infinite;
        }

        .beam-1 { width: 140px; height: 120%; left: 15%; transform: rotate(-12deg); animation-delay: 0s; }
        .beam-2 { width: 100px; height: 115%; left: 35%; transform: rotate(-8deg); animation-delay: -5s; opacity: 0.7; }
        .beam-3 { width: 120px; height: 118%; left: 55%; transform: rotate(-15deg); animation-delay: -10s; opacity: 0.5; }
        .beam-4 { width: 80px; height: 110%; left: 75%; transform: rotate(-6deg); animation-delay: -15s; opacity: 0.4; }

        @keyframes beamSway {
          0%, 100% { transform: rotate(-10deg) translateX(0); }
          50% { transform: rotate(-7deg) translateX(15px); }
        }

        /* ============ DUST PARTICLES ============ */

        .dust-field {
          position: absolute;
          top: 0; right: 0;
          width: 60%; height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .dust {
          position: absolute;
          width: 3px; height: 3px;
          background: ${isDark ? 'rgba(180, 190, 255, 0.5)' : 'rgba(255, 250, 240, 0.85)'};
          border-radius: 50%;
          box-shadow: 0 0 6px ${isDark ? 'rgba(180, 190, 255, 0.3)' : 'rgba(255, 250, 240, 0.5)'};
          animation: dustRise 18s linear infinite;
        }

        @keyframes dustRise {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 0.8; transform: translateY(85vh) scale(1); }
          90% { opacity: 0.3; }
          100% { transform: translateY(-10vh) scale(0.4); opacity: 0; }
        }

        /* ============ SOFA ============ */

        .sofa-group {
          position: absolute;
          bottom: 22%; left: 50%;
          transform: translateX(-50%);
          width: 38%; max-width: 380px;
        }

        .sofa { position: relative; height: 140px; }

        .sofa-back {
          position: absolute;
          bottom: 50px; left: 0; right: 0;
          height: 95px;
          background: ${isDark
            ? 'linear-gradient(180deg, #3a3250 0%, #2d2840 50%, #252238 100%)'
            : 'linear-gradient(180deg, #e8e0d4 0%, #dcd4c4 50%, #d0c8b8 100%)'};
          border-radius: 20px 20px 0 0;
          box-shadow: inset 0 15px 40px ${isDark ? 'rgba(80, 70, 120, 0.2)' : 'rgba(255, 255, 255, 0.5)'};
        }

        .sofa-seat {
          position: absolute;
          bottom: 28px; left: 6%; right: 6%;
          height: 38px;
          background: ${isDark
            ? 'linear-gradient(180deg, #403858 0%, #342e48 100%)'
            : 'linear-gradient(180deg, #f0e8dc 0%, #e4dcd0 100%)'};
          border-radius: 12px;
          box-shadow: 0 12px 35px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.08)'};
        }

        .sofa-cushion {
          position: absolute;
          bottom: 60px;
          width: 28%; height: 55px;
          background: ${isDark
            ? 'linear-gradient(160deg, #3d3555 0%, #322c48 100%)'
            : 'linear-gradient(160deg, #ebe3d7 0%, #dfd7cb 100%)'};
          border-radius: 12px;
          box-shadow: inset 0 8px 20px ${isDark ? 'rgba(80, 70, 120, 0.15)' : 'rgba(255, 255, 255, 0.5)'}, 4px 8px 20px ${isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.06)'};
        }

        .cushion-1 { left: 8%; }
        .cushion-2 { left: 36%; }
        .cushion-3 { left: 64%; }

        .sofa-arm {
          position: absolute;
          bottom: 28px;
          width: 9%; height: 75px;
          background: ${isDark
            ? 'linear-gradient(180deg, #3a3250 0%, #2d2840 100%)'
            : 'linear-gradient(180deg, #e0d8cc 0%, #d4ccc0 100%)'};
          border-radius: 14px;
          box-shadow: 6px 10px 25px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)'};
        }

        .arm-left { left: 0; border-radius: 14px 6px 6px 14px; }
        .arm-right { right: 0; border-radius: 6px 14px 14px 6px; }

        .sofa-leg {
          position: absolute;
          bottom: 0;
          width: 8px; height: 28px;
          background: ${isDark
            ? 'linear-gradient(180deg, #252238 0%, #1a1828 100%)'
            : 'linear-gradient(180deg, #8b7355 0%, #6b5545 100%)'};
          border-radius: 3px;
        }

        .leg-1 { left: 12%; }
        .leg-2 { left: 38%; }
        .leg-3 { right: 38%; }
        .leg-4 { right: 12%; }

        .throw-pillow {
          position: absolute;
          bottom: 88px;
          width: 48px; height: 42px;
          border-radius: 10px;
          box-shadow: 3px 6px 15px ${isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.08)'};
        }

        .pillow-accent-1 {
          left: 14%;
          background: ${isDark ? 'linear-gradient(135deg, #4a6b5a 0%, #3a5a4a 100%)' : 'linear-gradient(135deg, #a8b5a0 0%, #8fa888 100%)'};
          transform: rotate(-10deg);
        }

        .pillow-accent-2 {
          right: 16%;
          background: ${isDark ? 'linear-gradient(135deg, #6b5a4a 0%, #5a4a3a 100%)' : 'linear-gradient(135deg, #c4a890 0%, #b89878 100%)'};
          transform: rotate(8deg);
        }

        /* ============ COFFEE TABLE - CENTERED ============ */

        .coffee-table {
          position: absolute;
          bottom: 10%; 
          left: 50%;
          transform: translateX(-50%);
          width: 18%; 
          max-width: 160px;
        }

        .table-surface {
          height: 14px;
          background: ${isDark
            ? 'linear-gradient(180deg, #4a3a2a 0%, #3a2a1a 100%)'
            : 'linear-gradient(180deg, #a08060 0%, #8a6a50 100%)'};
          border-radius: 20px;
          box-shadow: 0 12px 40px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.15)'};
        }

        .table-legs {
          display: flex;
          justify-content: space-between;
          padding: 0 18%;
          margin-top: 6px;
        }

        .table-leg {
          width: 8px; height: 35px;
          background: ${isDark ? 'linear-gradient(180deg, #3a2a1a 0%, #2a1a0a 100%)' : 'linear-gradient(180deg, #8a6a50 0%, #6a5040 100%)'};
          border-radius: 3px;
        }

        .table-objects {
          position: absolute;
          top: -45px; left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: flex-end;
          gap: 25px;
        }

        .vase {
          width: 22px; height: 42px;
          background: ${isDark ? 'linear-gradient(180deg, #e8e0d8 0%, #d0c8c0 100%)' : 'linear-gradient(180deg, #f8f4f0 0%, #e8e4e0 100%)'};
          border-radius: 8px 8px 5px 5px;
          box-shadow: 4px 6px 15px ${isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.1)'};
          position: relative;
        }

        .stems {
          position: absolute;
          top: -28px; left: 50%;
          transform: translateX(-50%);
        }

        .stem {
          position: absolute;
          width: 2px; height: 28px;
          background: #6a8a60;
          border-radius: 1px;
          transform-origin: bottom center;
        }

        .stem-1 { transform: rotate(-15deg); left: -6px; }
        .stem-2 { left: 0; height: 32px; }
        .stem-3 { transform: rotate(15deg); left: 6px; }

        .books { display: flex; flex-direction: column; gap: 3px; }

        .book {
          height: 8px;
          border-radius: 1px;
          box-shadow: 2px 2px 6px ${isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.08)'};
        }

        .book-1 { width: 40px; background: ${isDark ? '#4a6a5a' : '#8aa898'}; }
        .book-2 { width: 35px; background: ${isDark ? '#6a5040' : '#c4a484'}; }
        .book-3 { width: 38px; background: ${isDark ? '#5a5a6a' : '#a8a8b8'}; }

        .candle {
          position: relative;
          width: 16px; height: 28px;
          background: linear-gradient(180deg, #faf8f4 0%, #e8e4dc 100%);
          border-radius: 3px;
        }

        .flame {
          position: absolute;
          top: -14px; left: 50%;
          transform: translateX(-50%);
          width: 8px; height: 16px;
          background: radial-gradient(ellipse at 50% 80%, rgba(255, 220, 140, 0.95) 0%, rgba(255, 160, 60, 0.7) 50%, transparent 100%);
          border-radius: 50% 50% 50% 50% / 70% 70% 30% 30%;
          animation: flicker 0.4s ease-in-out infinite alternate;
        }

        .flame-glow {
          position: absolute;
          top: -35px; left: 50%;
          transform: translateX(-50%);
          width: 60px; height: 60px;
          background: radial-gradient(circle, rgba(255, 180, 80, 0.2) 0%, transparent 70%);
          animation: glowPulse 2s ease-in-out infinite;
        }

        @keyframes flicker {
          0% { transform: translateX(-50%) scaleY(1) rotate(-2deg); }
          100% { transform: translateX(-50%) scaleY(1.12) rotate(2deg); }
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.35; transform: translateX(-50%) scale(1.15); }
        }

        /* ============ FLOOR PLANT (NEXT TO COUCH) - PEACE LILY STYLE ============ */

        .plant-group { 
          position: absolute; 
          bottom: 24%; 
          right: 12%; 
          left: auto;
        }

        .planter {
          width: 45px; height: 40px;
          background: ${isDark 
            ? 'linear-gradient(180deg, #4a4040 0%, #3a3030 50%, #2a2525 100%)' 
            : 'linear-gradient(180deg, #d4c4b0 0%, #c4b4a0 50%, #b4a490 100%)'};
          border-radius: 5px 5px 12px 12px;
          box-shadow: 6px 12px 25px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'};
          position: relative;
        }

        .planter-rim {
          position: absolute;
          top: -4px;
          left: -3px;
          right: -3px;
          height: 8px;
          background: ${isDark 
            ? 'linear-gradient(180deg, #5a5050 0%, #4a4040 100%)' 
            : 'linear-gradient(180deg, #e4d4c0 0%, #d4c4b0 100%)'};
          border-radius: 4px 4px 0 0;
        }

        .foliage {
          position: absolute;
          bottom: 38px;
          left: 50%;
          transform: translateX(-50%);
          width: 90px;
          height: 100px;
        }

        /* Elegant elongated leaves */
        .leaf {
          position: absolute;
          background: ${isDark 
            ? 'linear-gradient(180deg, #3a5540 0%, #2d4535 50%, #254030 100%)' 
            : 'linear-gradient(180deg, #6a9a70 0%, #5a8a60 50%, #4a7a50 100%)'};
          border-radius: 50% 50% 50% 50% / 90% 90% 10% 10%;
          transform-origin: bottom center;
          animation: gentleSway 6s ease-in-out infinite;
          box-shadow: 2px 4px 8px ${isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)'};
        }

        /* Leaf vein */
        .leaf::after {
          content: '';
          position: absolute;
          bottom: 5%;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 70%;
          background: ${isDark ? 'rgba(100, 140, 100, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
        }

        .leaf-1 { width: 14px; height: 50px; left: 38px; bottom: 0; --sway: -8deg; animation-delay: 0s; }
        .leaf-2 { width: 16px; height: 58px; left: 44px; bottom: 0; --sway: 3deg; animation-delay: -1s; }
        .leaf-3 { width: 13px; height: 45px; left: 30px; bottom: 5px; --sway: -18deg; animation-delay: -2s; }
        .leaf-4 { width: 15px; height: 52px; left: 52px; bottom: 3px; --sway: 15deg; animation-delay: -3s; }
        .leaf-5 { width: 12px; height: 40px; left: 24px; bottom: 8px; --sway: -25deg; animation-delay: -4s; }
        .leaf-6 { width: 14px; height: 48px; left: 58px; bottom: 6px; --sway: 22deg; animation-delay: -5s; }

        /* White peace lily flowers */
        .flower {
          position: absolute;
          bottom: 0;
          transform-origin: bottom center;
          animation: gentleSway 7s ease-in-out infinite;
        }

        .flower-stem {
          width: 2px;
          background: #5a7a50;
          border-radius: 1px;
          margin: 0 auto;
        }

        .flower-bloom {
          width: 12px;
          height: 18px;
          background: ${isDark 
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 240, 235, 0.85) 100%)' 
            : 'linear-gradient(180deg, #ffffff 0%, #f8f8f4 100%)'};
          border-radius: 50% 50% 45% 45% / 70% 70% 30% 30%;
          box-shadow: 0 4px 12px ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
          position: relative;
        }

        .flower-center {
          position: absolute;
          bottom: 20%;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 8px;
          background: #e8dc90;
          border-radius: 2px;
        }

        .flower-1 { left: 42px; --sway: 5deg; animation-delay: -0.5s; }
        .flower-1 .flower-stem { height: 55px; }

        .flower-2 { left: 54px; --sway: -8deg; animation-delay: -2.5s; }
        .flower-2 .flower-stem { height: 48px; }
        .flower-2 .flower-bloom { width: 10px; height: 15px; }

        @keyframes gentleSway {
          0%, 100% { transform: rotate(var(--sway, 0deg)); }
          50% { transform: rotate(calc(var(--sway, 0deg) + 3deg)); }
        }

        /* ============ TALL FLOOR LAMP ============ */

        .floor-lamp-group { 
          position: absolute; 
          bottom: 28%; 
          left: 12%; 
          z-index: 5;
        }

        .floor-lamp {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .floor-lamp-shade {
          width: 50px; 
          height: 40px;
          background: ${isDark 
            ? 'linear-gradient(180deg, #f8f4ec 0%, #e8e0d4 100%)' 
            : 'linear-gradient(180deg, #fcfaf6 0%, #f0ece4 100%)'};
          border-radius: 8px 8px 20px 20px;
          box-shadow: 
            0 8px 30px ${isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.1)'},
            inset 0 -25px 40px ${isDark ? 'rgba(255, 200, 120, 0.3)' : 'rgba(255, 220, 150, 0.25)'};
        }

        .floor-lamp-neck-top {
          width: 8px;
          height: 15px;
          background: ${isDark ? '#5a4a38' : '#a08868'};
        }

        .floor-lamp-pole {
          width: 6px;
          height: 120px;
          background: ${isDark 
            ? 'linear-gradient(180deg, #5a4a38 0%, #4a3a28 50%, #3a2a18 100%)' 
            : 'linear-gradient(180deg, #a08868 0%, #907858 50%, #806848 100%)'};
          border-radius: 2px;
        }

        .floor-lamp-base {
          width: 35px;
          height: 10px;
          background: ${isDark 
            ? 'linear-gradient(180deg, #4a3a28 0%, #3a2a18 100%)' 
            : 'linear-gradient(180deg, #907858 0%, #705838 100%)'};
          border-radius: 50%;
          box-shadow: 4px 8px 20px ${isDark ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.12)'};
        }

        .floor-lamp-glow {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, ${isDark ? 'rgba(255, 220, 150, 0.15)' : 'rgba(255, 240, 200, 0.2)'} 0%, transparent 70%);
          pointer-events: none;
        }

        /* ============ CEILING PENDANT LIGHT ============ */

        .ceiling-light {
          position: absolute;
          top: 0;
          left: 38%;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ceiling-cord {
          width: 2px;
          height: 80px;
          background: ${isDark ? '#3a3a50' : '#8a8a78'};
        }

        .ceiling-canopy {
          width: 20px;
          height: 8px;
          background: ${isDark ? '#2a2a40' : '#a0a090'};
          border-radius: 0 0 4px 4px;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        .pendant-shade {
          width: 70px;
          height: 45px;
          background: ${isDark 
            ? 'linear-gradient(180deg, rgba(255, 250, 240, 0.9) 0%, rgba(240, 235, 220, 0.85) 100%)'
            : 'linear-gradient(180deg, #faf8f4 0%, #f0ebe4 100%)'};
          border-radius: 50% 50% 45% 45% / 30% 30% 70% 70%;
          box-shadow: 
            0 10px 40px ${isDark ? 'rgba(255, 200, 120, 0.25)' : 'rgba(0, 0, 0, 0.1)'},
            inset 0 -15px 30px ${isDark ? 'rgba(255, 200, 120, 0.4)' : 'rgba(255, 230, 180, 0.3)'};
        }

        .pendant-glow {
          position: absolute;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
          height: 200px;
          background: radial-gradient(ellipse at top, 
            ${isDark ? 'rgba(255, 220, 150, 0.12)' : 'rgba(255, 245, 220, 0.25)'} 0%, 
            transparent 70%);
          pointer-events: none;
        }

        /* ============ ZEN RUG (UNDER COFFEE TABLE) ============ */

        .rug {
          position: absolute;
          bottom: 22%;
          left: 50%;
          transform: translateX(-50%) perspective(800px) rotateX(65deg);
          width: 42%;
          max-width: 450px;
          height: 22%;
          border-radius: 8px;
          transform-origin: bottom center;
          overflow: hidden;
        }

        .rug-base {
          position: absolute;
          inset: 0;
          background: ${isDark
            ? 'linear-gradient(180deg, rgba(60, 55, 70, 0.4) 0%, rgba(50, 45, 60, 0.3) 50%, rgba(45, 40, 55, 0.25) 100%)'
            : 'linear-gradient(180deg, rgba(210, 200, 185, 0.5) 0%, rgba(195, 185, 170, 0.4) 50%, rgba(180, 170, 155, 0.35) 100%)'};
          border-radius: 8px;
        }

        .rug-pattern {
          position: absolute;
          inset: 8%;
          border: 2px solid ${isDark ? 'rgba(100, 90, 110, 0.3)' : 'rgba(160, 145, 125, 0.4)'};
          border-radius: 4px;
        }

        .rug-pattern-inner {
          position: absolute;
          inset: 15%;
          border: 1px solid ${isDark ? 'rgba(100, 90, 110, 0.2)' : 'rgba(160, 145, 125, 0.3)'};
          border-radius: 3px;
        }

        .rug-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30%;
          height: 40%;
          background: ${isDark
            ? 'radial-gradient(ellipse, rgba(80, 75, 95, 0.25) 0%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(175, 165, 150, 0.3) 0%, transparent 70%)'};
          border-radius: 50%;
        }

        /* Subtle texture lines */
        .rug-texture {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 8px,
            ${isDark ? 'rgba(80, 75, 95, 0.08)' : 'rgba(150, 140, 125, 0.1)'} 8px,
            ${isDark ? 'rgba(80, 75, 95, 0.08)' : 'rgba(150, 140, 125, 0.1)'} 9px
          );
          border-radius: 8px;
        }

        /* ============ VERA ORB ============ */

        .vera-presence {
          position: absolute;
          top: 42%;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 50;
          gap: 20px;
          opacity: ${isLoaded ? 1 : 0};
          transition: opacity 1.2s ease 0.8s;
        }

        .orb-container { position: relative; cursor: pointer; }

        .orb {
          width: 100px; height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.3) 0%, rgba(160, 140, 200, 0.5) 30%, rgba(120, 100, 180, 0.4) 60%, rgba(90, 70, 160, 0.3) 100%);
          box-shadow: 0 0 ${50 + breathValue * 30}px rgba(140, 120, 200, ${0.35 + breathValue * 0.2}), 0 0 ${100 + breathValue * 50}px rgba(140, 120, 200, ${0.15 + breathValue * 0.1}), inset 0 0 50px rgba(255, 255, 255, 0.15);
          transform: scale(${1 + breathValue * 0.06});
          transition: box-shadow 0.3s ease;
        }

        .orb:hover {
          box-shadow: 0 0 80px rgba(140, 120, 200, 0.5), 0 0 150px rgba(140, 120, 200, 0.25), inset 0 0 50px rgba(255, 255, 255, 0.2);
        }

        .orb-ring {
          position: absolute;
          inset: -18px;
          border-radius: 50%;
          border: 1px solid rgba(140, 120, 200, ${0.2 + breathValue * 0.15});
          transform: scale(${0.95 + breathValue * 0.1});
        }

        .orb-ring-outer { inset: -35px; border-color: rgba(140, 120, 200, ${0.1 + breathValue * 0.08}); }

        .vera-label {
          font-size: 0.6rem;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          color: ${isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.3)'};
          font-weight: 300;
        }

        /* ============ GREETING ============ */

        .greeting-area {
          position: absolute;
          top: 35%;
          left: 0;
          right: 0;
          text-align: center;
          z-index: 40;
          padding: 0 20px;
          opacity: ${isLoaded ? 1 : 0};
          transition: opacity 1s ease 0.5s;
        }

        .greeting {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.6rem, 5vw, 2.8rem);
          font-weight: 300;
          color: ${isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(42, 42, 42, 0.6)'};
          margin: 0;
          text-shadow: 0 4px 20px ${isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)'};
        }

        .time-essence {
          font-size: clamp(0.6rem, 2vw, 0.8rem);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: ${isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.25)'};
          margin-top: 10px;
          font-weight: 300;
        }

        /* ============ ROOM PORTALS - TOP LEFT ============ */

        .portals {
          position: absolute;
          top: 15%;
          left: 3%;
          z-index: 60;
          opacity: ${isLoaded ? 1 : 0};
          transition: opacity 0.8s ease 1s;
        }

        .portals-scroll {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .portal {
          width: 110px; 
          height: 90px;
          background: ${isDark
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.65) 100%)'};
          backdrop-filter: blur(20px);
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)'};
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .portal::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
          pointer-events: none;
        }

        .portal:hover, .portal.active {
          transform: translateY(-4px) scale(1.02);
          border-color: ${isDark ? 'rgba(140, 120, 200, 0.4)' : 'rgba(180, 160, 120, 0.4)'};
          box-shadow: 0 15px 40px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.12)'}, 0 0 30px ${isDark ? 'rgba(140, 120, 200, 0.15)' : 'rgba(180, 160, 120, 0.15)'};
        }

        .portal-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, ${isDark ? 'rgba(140, 120, 200, 0.15)' : 'rgba(201, 169, 98, 0.1)'} 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .portal:hover .portal-glow { opacity: 1; }

        .portal-icon { width: 28px; height: 28px; position: relative; }

        .icon-line { position: absolute; background: ${isDark ? 'rgba(160, 140, 200, 0.7)' : 'rgba(120, 100, 160, 0.6)'}; border-radius: 2px; }
        .line-h { width: 20px; height: 3px; bottom: 8px; left: 4px; }
        .line-v { width: 3px; height: 12px; bottom: 8px; left: 12px; }

        .icon-circle { width: 18px; height: 18px; border: 2px solid ${isDark ? 'rgba(160, 180, 140, 0.7)' : 'rgba(120, 140, 100, 0.6)'}; border-radius: 50%; position: absolute; top: 5px; left: 5px; }
        .icon-dot { width: 5px; height: 5px; background: ${isDark ? 'rgba(160, 180, 140, 0.7)' : 'rgba(120, 140, 100, 0.6)'}; border-radius: 50%; position: absolute; top: 11px; left: 11px; }

        .icon-rect { position: absolute; background: ${isDark ? 'rgba(180, 160, 140, 0.7)' : 'rgba(140, 120, 100, 0.6)'}; border-radius: 1px; }
        .rect-1 { width: 5px; height: 16px; left: 5px; bottom: 6px; }
        .rect-2 { width: 5px; height: 20px; left: 11px; bottom: 6px; }
        .rect-3 { width: 5px; height: 14px; left: 17px; bottom: 6px; }

        .icon-moon { width: 16px; height: 16px; border: 2px solid ${isDark ? 'rgba(180, 190, 220, 0.7)' : 'rgba(140, 150, 180, 0.6)'}; border-radius: 50%; position: absolute; top: 6px; left: 6px; clip-path: polygon(0 0, 70% 0, 70% 100%, 0 100%); }

        .icon-frame { width: 18px; height: 12px; border: 2px solid ${isDark ? 'rgba(200, 180, 140, 0.7)' : 'rgba(160, 140, 100, 0.6)'}; position: absolute; top: 5px; left: 5px; }
        .icon-stand { width: 2px; height: 10px; background: ${isDark ? 'rgba(200, 180, 140, 0.7)' : 'rgba(160, 140, 100, 0.6)'}; position: absolute; bottom: 4px; left: 13px; }

        .icon-page { width: 16px; height: 20px; border: 2px solid ${isDark ? 'rgba(180, 160, 140, 0.7)' : 'rgba(140, 120, 100, 0.6)'}; border-radius: 2px; position: absolute; top: 4px; left: 6px; }
        .icon-lines { position: absolute; left: 10px; right: 10px; height: 1px; background: ${isDark ? 'rgba(180, 160, 140, 0.5)' : 'rgba(140, 120, 100, 0.4)'}; }
        .lines-1 { top: 10px; }
        .lines-2 { top: 14px; }
        .lines-3 { top: 18px; }

        .icon-heart { position: absolute; top: 4px; left: 5px; width: 18px; height: 18px; }
        .heart-top { position: absolute; width: 8px; height: 8px; border: 2px solid ${isDark ? 'rgba(220, 140, 160, 0.7)' : 'rgba(180, 100, 120, 0.6)'}; border-radius: 50% 50% 0 0; }
        .heart-top-left { left: 0; top: 0; }
        .heart-top-right { right: 0; top: 0; }
        .heart-bottom { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 10px solid ${isDark ? 'rgba(220, 140, 160, 0.7)' : 'rgba(180, 100, 120, 0.6)'}; }

        .portal-name { font-size: 0.7rem; font-weight: 500; color: ${isDark ? '#ffffff' : '#2a2a2a'}; }
        .portal-essence { font-size: 0.5rem; color: ${isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.35)'}; letter-spacing: 0.1em; text-transform: uppercase; }

        /* ============ BOTTOM BAR ============ */

        .bottom-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          z-index: 70;
          padding: 20px 24px;
          padding-bottom: max(20px, env(safe-area-inset-bottom));
          background: linear-gradient(to top, ${isDark ? 'rgba(10, 10, 18, 0.95)' : 'rgba(248, 246, 242, 0.95)'} 0%, transparent 100%);
          backdrop-filter: blur(20px);
          display: flex;
          justify-content: center;
          gap: 12px;
          opacity: ${isLoaded ? 1 : 0};
          transition: opacity 0.8s ease 1.2s;
        }

        .action-btn {
          padding: 16px 32px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          font-family: inherit;
        }

        .action-primary {
          background: linear-gradient(135deg, ${isDark ? '#8B7CC6' : '#9B8BC6'} 0%, ${isDark ? '#6B5CA6' : '#7B6BA6'} 100%);
          color: #ffffff;
          box-shadow: 0 8px 30px ${isDark ? 'rgba(139, 124, 198, 0.4)' : 'rgba(139, 124, 198, 0.3)'};
        }

        .action-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(139, 124, 198, 0.5); }

        .action-secondary {
          background: ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
          color: ${isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'};
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'};
        }

        .action-secondary:hover { background: ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}; transform: translateY(-2px); }

        /* ============ RESPONSIVE ============ */

        @media (max-width: 768px) {
          .greeting-area { top: 35%; }
          .greeting { font-size: clamp(1.4rem, 4.5vw, 1.8rem); color: ${isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(42, 42, 42, 0.55)'}; }
          .time-essence { font-size: 0.6rem; letter-spacing: 0.2em; color: ${isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.2)'}; }
          .vera-presence { top: 55%; left: 50%; transform: translateX(-50%); opacity: 0 !important; pointer-events: none; }
          .orb { width: 80px; height: 80px; }
          .orb-ring { inset: -12px; }
          .orb-ring-outer { inset: -25px; }
          .portals { top: 18%; left: 2%; }
          .portals-scroll { grid-template-columns: repeat(2, 1fr); gap: 6px; }
          .portal { width: 85px; height: 70px; }
          .portal-icon { width: 22px; height: 22px; }
          .portal-name { font-size: 0.6rem; }
          .portal-essence { font-size: 0.45rem; }
          .sofa-group { transform: translateX(-50%) scale(0.85); opacity: 0.9; }
          .coffee-table { opacity: 0.85; transform: translateX(-50%) scale(0.9); }
          .floor-lamp-group { left: 8%; opacity: 0.75; transform: scale(0.85); display: none; }
          .plant-group { right: 12%; opacity: 0.8; transform: scale(0.85); left: auto; }
          .rug { bottom: 22%; }
          .ceiling-light { opacity: 0.7; }
        }

        @media (max-width: 480px) {
          .greeting-area { top: 35%; padding: 0 15%; left: 0; transform: none; }
          .greeting { font-size: clamp(1.2rem, 4.5vw, 1.5rem); color: ${isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(42, 42, 42, 0.5)'}; }
          .time-essence { font-size: 0.5rem; margin-top: 6px; letter-spacing: 0.15em; color: ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'}; }
          .vera-presence { top: 32%; left: auto; right: 24px; transform: none; opacity: 0 !important; pointer-events: none; gap: 14px; }
          .orb { width: 60px; height: 60px; }
          .orb-ring { inset: -8px; }
          .orb-ring-outer { inset: -16px; }
          .vera-label { font-size: 0.45rem; letter-spacing: 0.4em; }
          .portals { top: 16%; left: 2%; }
          .portals-scroll { grid-template-columns: 1fr; gap: 5px; }
          .portal { width: 75px; height: 55px; border-radius: 10px; }
          .portal-icon { width: 18px; height: 18px; }
          .portal-name { font-size: 0.55rem; }
          .portal-essence { display: none; }
          .sofa-group { bottom: 22%; left: 50%; transform: translateX(-50%) scale(0.75); opacity: 0.7; }
          .coffee-table { left: 50%; transform: translateX(-50%) scale(0.7); opacity: 0.65; }
          .floor-lamp-group { left: 8%; opacity: 0.6; transform: scale(0.65); display: none; }
          .plant-group { right: 8%; left: auto; opacity: 0.65; transform: scale(0.7); bottom: 24%; }
          .rug { bottom: 22%; }
          .ceiling-light { opacity: 0.3; }
          .bottom-bar { flex-direction: column; align-items: center; }
          .action-btn { width: 100%; max-width: 280px; padding: 14px 24px; font-size: 0.8rem; }
          .action-secondary { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .orb, .orb-ring, .leaf, .flame, .dust, .beam { animation: none; }
        }
      `}</style>

      <div className="room-environment"><div className="vignette" /></div>

      <div className="architecture">
        <div className="wall" />
        <div className="floor"><div className="floor-reflection" /></div>

        {/* Window with trees */}
        <div className="window-area">
          <div className="window-frame">
            <div className="window-trees">
              <div className="tree-line" />
              <div className="tree tree-1"><div className="tree-trunk" /><div className="tree-canopy" /></div>
              <div className="tree tree-2"><div className="tree-trunk" /><div className="tree-canopy" /></div>
              <div className="tree tree-3"><div className="tree-trunk" /><div className="tree-canopy" /></div>
              <div className="tree tree-4"><div className="tree-trunk" /><div className="tree-canopy" /></div>
            </div>
            <div className="celestial-body" />
            <div className="window-mullion-v" />
            <div className="window-mullion-h" />
          </div>
          <div className="window-sill" />
        </div>

        <div className="light-beams">
          <div className="beam beam-1" />
          <div className="beam beam-2" />
          <div className="beam beam-3" />
          <div className="beam beam-4" />
        </div>

        <div className="dust-field">
          {dustPositions.map((pos, i) => (
            <div key={i} className="dust" style={{ left: `${pos}%`, animationDelay: `${i * 1.2}s`, animationDuration: `${18 + (i % 4) * 2}s` }} />
          ))}
        </div>

        {/* Zen Rug */}
        <div className="rug">
          <div className="rug-base" />
          <div className="rug-pattern" />
          <div className="rug-pattern-inner" />
          <div className="rug-center" />
          <div className="rug-texture" />
        </div>

        {/* Ceiling Pendant Light */}
        <div className="ceiling-light">
          <div className="ceiling-canopy" />
          <div className="ceiling-cord" />
          <div className="pendant-shade" />
          <div className="pendant-glow" />
        </div>

        <div className="sofa-group">
          <div className="sofa">
            <div className="sofa-back" />
            <div className="sofa-cushion cushion-1" />
            <div className="sofa-cushion cushion-2" />
            <div className="sofa-cushion cushion-3" />
            <div className="sofa-seat" />
            <div className="sofa-arm arm-left" />
            <div className="sofa-arm arm-right" />
            <div className="sofa-leg leg-1" />
            <div className="sofa-leg leg-2" />
            <div className="sofa-leg leg-3" />
            <div className="sofa-leg leg-4" />
            <div className="throw-pillow pillow-accent-1" />
            <div className="throw-pillow pillow-accent-2" />
          </div>
        </div>

        <div className="coffee-table">
          <div className="table-objects">
            <div className="vase">
              <div className="stems">
                <div className="stem stem-1" />
                <div className="stem stem-2" />
                <div className="stem stem-3" />
              </div>
            </div>
            <div className="books">
              <div className="book book-1" />
              <div className="book book-2" />
              <div className="book book-3" />
            </div>
            <div className="candle">
              <div className="flame-glow" />
              <div className="flame" />
            </div>
          </div>
          <div className="table-surface" />
          <div className="table-legs">
            <div className="table-leg" />
            <div className="table-leg" />
          </div>
        </div>

        {/* Tall Floor Lamp */}
        <div className="floor-lamp-group">
          <div className="floor-lamp">
            <div className="floor-lamp-glow" />
            <div className="floor-lamp-shade" />
            <div className="floor-lamp-neck-top" />
            <div className="floor-lamp-pole" />
            <div className="floor-lamp-base" />
          </div>
        </div>

        <div className="plant-group">
          <div className="foliage">
            <div className="leaf leaf-1" />
            <div className="leaf leaf-2" />
            <div className="leaf leaf-3" />
            <div className="leaf leaf-4" />
            <div className="leaf leaf-5" />
            <div className="leaf leaf-6" />
            <div className="flower flower-1">
              <div className="flower-bloom">
                <div className="flower-center" />
              </div>
              <div className="flower-stem" />
            </div>
            <div className="flower flower-2">
              <div className="flower-bloom">
                <div className="flower-center" />
              </div>
              <div className="flower-stem" />
            </div>
          </div>
          <div className="planter">
            <div className="planter-rim" />
          </div>
        </div>
      </div>

      <div className="greeting-area">
        <h1 className="greeting">{getGreeting()}</h1>
        <p className="time-essence">Your sanctuary awaits</p>
      </div>

      <div className="vera-presence">
        <div className="orb-container" onClick={handleTalkToVera}>
          <div className="orb-ring" />
          <div className="orb-ring orb-ring-outer" />
          <div className="orb" />
        </div>
        <span className="vera-label">VERA</span>
      </div>

      <div className="portals">
        <div className="portals-scroll">
          {ROOMS.map((room) => (
            <div key={room.id} className={`portal ${activePortal === room.id ? 'active' : ''}`} onClick={() => handlePortalEnter(room.id)}>
              <div className="portal-glow" />
              <div className={`portal-icon icon-${room.id}`}>
                {room.id === 'therapy' && <><div className="icon-line line-h" /><div className="icon-line line-v" /></>}
                {room.id === 'zen' && <><div className="icon-circle" /><div className="icon-dot" /></>}
                {room.id === 'library' && <><div className="icon-rect rect-1" /><div className="icon-rect rect-2" /><div className="icon-rect rect-3" /></>}
                {room.id === 'bedroom' && <div className="icon-moon" />}
                {room.id === 'studio' && <><div className="icon-frame" /><div className="icon-stand" /></>}
                {room.id === 'journal' && <><div className="icon-page" /><div className="icon-lines lines-1" /><div className="icon-lines lines-2" /><div className="icon-lines lines-3" /></>}
                {room.id === 'pulse' && <><div className="icon-heart"><div className="heart-top heart-top-left" /><div className="heart-top heart-top-right" /><div className="heart-bottom" /></div></>}
              </div>
              <span className="portal-name">{room.name}</span>
              <span className="portal-essence">{room.essence}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bottom-bar">
        <a href="https://veraneural.ai/chat-exact" target="_blank" rel="noopener noreferrer" className="action-btn action-primary" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto' }}>Talk to VERA</a>
      </div>
    </div>
  );
}