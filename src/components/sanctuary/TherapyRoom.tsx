'use client';

import { useState, useEffect, useRef } from 'react';

interface TherapyRoomProps {
  onBack: () => void;
  onSendMessage: (message: string) => void;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  isGenerating?: boolean;
  userName?: string;
}

export default function TherapyRoom({ 
  onBack, 
  onSendMessage, 
  messages, 
  isGenerating = false,
  userName 
}: TherapyRoomProps) {
  const [inputValue, setInputValue] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [dustParticles] = useState(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 55 + (i * 2.25) % 35,
      size: 1 + (i % 3),
      duration: 10 + (i % 6) * 2.5,
      delay: i * 0.4,
    }))
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
    setTimeout(() => setShowChat(true), 800);

    // Time of day detection
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const breathValue = Math.sin(breathPhase * 0.0628) * 0.5 + 0.5;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isGenerating) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const starterPrompts = [
    "I've been feeling anxious lately",
    "I need someone to talk to",
    "Help me process my feelings",
    "I'm feeling overwhelmed",
  ];

  return (
    <>
      <style jsx>{`
        .therapy-room {
          min-height: 100vh;
          min-height: 100dvh;
          position: relative;
          overflow: hidden;
          background: ${isDark 
            ? 'linear-gradient(180deg, #0d0d14 0%, #12121a 40%, #0a0a10 100%)'
            : 'linear-gradient(180deg, #f7f5f2 0%, #f0ebe5 40%, #e8e3dc 70%, #e0dbd4 100%)'};
          transition: background 0.5s ease;
        }

        /* Ambient Light Layers - Softer, more zen */
        .light-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .sunlight {
          background: ${isDark
            ? 'radial-gradient(ellipse 60% 70% at 75% 25%, rgba(40, 50, 80, 0.4) 0%, transparent 50%)'
            : 'radial-gradient(ellipse 70% 80% at 75% 25%, rgba(255, 252, 245, 0.7) 0%, transparent 50%), radial-gradient(ellipse 50% 60% at 80% 35%, rgba(255, 250, 240, 0.4) 0%, transparent 40%)'};
          animation: sunPulse 10s ease-in-out infinite;
        }

        @keyframes sunPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }

        .ambient-glow {
          background: ${isDark
            ? 'radial-gradient(ellipse 100% 50% at 50% 100%, rgba(30, 30, 50, 0.3) 0%, transparent 60%)'
            : 'radial-gradient(ellipse 100% 50% at 50% 100%, rgba(200, 195, 185, 0.25) 0%, transparent 60%), radial-gradient(ellipse 60% 30% at 15% 85%, rgba(180, 190, 175, 0.12) 0%, transparent 50%)'};
        }

        /* Light Beams - Softer, gentler */
        .light-beams {
          position: absolute;
          top: 0;
          right: 5%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          opacity: ${isDark ? 0 : 1};
          transition: opacity 0.5s ease;
        }

        .beam {
          position: absolute;
          background: linear-gradient(180deg, 
            rgba(255, 252, 248, 0.35) 0%, 
            rgba(255, 250, 245, 0.2) 30%,
            rgba(255, 248, 240, 0.08) 60%,
            transparent 100%);
          transform-origin: top center;
          animation: beamSway 20s ease-in-out infinite;
        }

        .beam-1 { width: 140px; height: 120%; top: -10%; left: 15%; transform: rotate(-12deg) skewX(-8deg); }
        .beam-2 { width: 90px; height: 115%; top: -10%; left: 40%; transform: rotate(-8deg) skewX(-5deg); animation-delay: -6s; opacity: 0.6; }
        .beam-3 { width: 110px; height: 118%; top: -10%; left: 60%; transform: rotate(-15deg) skewX(-6deg); animation-delay: -12s; opacity: 0.4; }

        @keyframes beamSway {
          0%, 100% { transform: rotate(-12deg) skewX(-8deg) translateX(0); opacity: 1; }
          50% { transform: rotate(-10deg) skewX(-6deg) translateX(10px); opacity: 0.85; }
        }

        /* Dust Particles - Gentler */
        .dust-container {
          position: absolute;
          top: 0;
          right: 0;
          width: 60%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
          opacity: ${isDark ? 0.3 : 1};
        }

        .dust {
          position: absolute;
          border-radius: 50%;
          background: ${isDark ? 'rgba(200, 200, 220, 0.5)' : 'rgba(255, 252, 248, 0.7)'};
          box-shadow: 0 0 6px ${isDark ? 'rgba(200, 200, 220, 0.3)' : 'rgba(255, 250, 245, 0.4)'};
          animation: dustFloat linear infinite;
        }

        @keyframes dustFloat {
          0% { transform: translateY(100vh) translateX(0) scale(0); opacity: 0; }
          10% { opacity: 0.8; transform: translateY(80vh) translateX(8px) scale(1); }
          50% { transform: translateY(40vh) translateX(-10px) scale(1); opacity: 0.7; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-10vh) translateX(15px) scale(0.5); opacity: 0; }
        }

        /* Room Elements - Zen palette */
        .room-elements {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 70%;
          pointer-events: none;
          opacity: ${isLoaded ? 0.3 : 0};
          transition: opacity 1.5s ease;
        }

        .floor {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 40%;
          background: ${isDark
            ? 'linear-gradient(180deg, rgba(25, 25, 35, 0.9) 0%, rgba(20, 20, 28, 0.95) 50%, rgba(15, 15, 22, 1) 100%)'
            : 'linear-gradient(180deg, rgba(225, 220, 212, 0.9) 0%, rgba(215, 210, 200, 0.95) 50%, rgba(205, 200, 190, 1) 100%)'};
          transform: perspective(800px) rotateX(55deg);
          transform-origin: bottom center;
        }

        .wall {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 75%;
          background: ${isDark
            ? 'linear-gradient(180deg, rgba(15, 15, 22, 1) 0%, rgba(18, 18, 26, 1) 50%, rgba(22, 22, 32, 1) 100%)'
            : 'linear-gradient(180deg, rgba(245, 242, 238, 1) 0%, rgba(240, 236, 230, 1) 50%, rgba(235, 230, 222, 1) 100%)'};
        }

        /* Window */
        .window-container {
          position: absolute;
          top: 8%;
          right: 6%;
          width: 25%;
          height: 50%;
        }

        .window {
          width: 100%;
          height: 100%;
          background: ${isDark
            ? 'linear-gradient(180deg, rgba(15, 20, 35, 0.9) 0%, rgba(20, 30, 50, 0.85) 50%, rgba(25, 35, 55, 0.9) 100%)'
            : 'linear-gradient(180deg, rgba(200, 220, 240, 0.7) 0%, rgba(180, 210, 235, 0.6) 30%, rgba(200, 225, 245, 0.7) 60%, rgba(220, 235, 250, 0.8) 100%)'};
          border: 5px solid ${isDark ? 'rgba(60, 60, 80, 0.6)' : 'rgba(212, 200, 184, 0.95)'};
          box-shadow: ${isDark 
            ? 'inset 0 0 60px rgba(100, 120, 180, 0.15), 0 10px 50px rgba(0, 0, 0, 0.3)'
            : 'inset 0 0 80px rgba(255, 255, 255, 0.9), 0 10px 50px rgba(0, 0, 0, 0.08)'};
          position: relative;
          border-radius: 3px;
        }

        .window-frame-v {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 5px;
          height: 100%;
          background: ${isDark ? 'rgba(60, 60, 80, 0.6)' : 'rgba(212, 200, 184, 0.95)'};
        }

        .window-frame-h {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 100%;
          height: 5px;
          background: ${isDark ? 'rgba(60, 60, 80, 0.6)' : 'rgba(212, 200, 184, 0.95)'};
        }

        .window-sill {
          position: absolute;
          bottom: -15px;
          left: -10px;
          right: -10px;
          height: 15px;
          background: ${isDark 
            ? 'linear-gradient(180deg, rgba(50, 50, 70, 0.8) 0%, rgba(40, 40, 60, 0.9) 100%)'
            : 'linear-gradient(180deg, rgba(212, 200, 184, 1) 0%, rgba(196, 184, 168, 1) 100%)'};
          border-radius: 0 0 4px 4px;
        }

        /* Moon (night only) */
        .moon {
          position: absolute;
          top: 15%;
          right: 20%;
          width: 25px;
          height: 25px;
          background: radial-gradient(circle at 35% 35%, #fffef8 0%, #f0f0e8 50%, #e8e8e0 100%);
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(255, 255, 240, 0.4), 0 0 40px rgba(255, 255, 240, 0.2);
          opacity: ${isDark ? 1 : 0};
          transition: opacity 0.5s ease;
        }

        /* Stars (night only) */
        .stars {
          position: absolute;
          inset: 0;
          opacity: ${isDark ? 1 : 0};
          transition: opacity 0.5s ease;
        }

        .star {
          position: absolute;
          background: #ffffff;
          border-radius: 50%;
          animation: twinkle 3s ease-in-out infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.9; }
        }

        /* Couch */
        .couch-container {
          position: absolute;
          bottom: 16%;
          left: 5%;
          width: 40%;
        }

        /* Wall Art - Calming abstract above couch */
        .wall-art {
          position: absolute;
          bottom: 48%;
          left: 5%;
          width: 40%;
          display: flex;
          justify-content: center;
        }

        .art-frame {
          width: 70%;
          max-width: 240px;
          height: 100px;
          background: ${isDark ? 'rgba(35, 32, 42, 0.6)' : 'rgba(255, 255, 255, 0.5)'};
          border: 3px solid ${isDark ? 'rgba(60, 55, 70, 0.5)' : 'rgba(180, 170, 155, 0.6)'};
          border-radius: 2px;
          box-shadow: 
            0 4px 20px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)'},
            inset 0 0 30px ${isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.5)'};
          overflow: hidden;
          position: relative;
        }

        .art-canvas {
          position: absolute;
          inset: 6px;
          background: ${isDark 
            ? 'linear-gradient(180deg, rgba(45, 50, 65, 0.9) 0%, rgba(55, 60, 75, 0.85) 30%, rgba(50, 55, 70, 0.9) 60%, rgba(40, 45, 58, 0.95) 100%)'
            : 'linear-gradient(180deg, rgba(220, 225, 230, 0.9) 0%, rgba(200, 210, 205, 0.85) 30%, rgba(215, 210, 200, 0.9) 60%, rgba(225, 220, 215, 0.95) 100%)'};
          border-radius: 1px;
        }

        /* Soft abstract shapes */
        .art-shape-1 {
          position: absolute;
          top: 20%;
          left: 10%;
          width: 35%;
          height: 50%;
          background: ${isDark 
            ? 'radial-gradient(ellipse at center, rgba(80, 90, 110, 0.4) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(180, 190, 185, 0.5) 0%, transparent 70%)'};
          border-radius: 50%;
        }

        .art-shape-2 {
          position: absolute;
          top: 30%;
          right: 15%;
          width: 40%;
          height: 45%;
          background: ${isDark 
            ? 'radial-gradient(ellipse at center, rgba(70, 75, 95, 0.35) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(195, 200, 195, 0.45) 0%, transparent 70%)'};
          border-radius: 50%;
        }

        .art-shape-3 {
          position: absolute;
          bottom: 15%;
          left: 30%;
          width: 45%;
          height: 35%;
          background: ${isDark 
            ? 'radial-gradient(ellipse at center, rgba(65, 70, 85, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(205, 200, 190, 0.4) 0%, transparent 70%)'};
          border-radius: 50%;
        }

        /* Subtle horizon line */
        .art-horizon {
          position: absolute;
          top: 55%;
          left: 5%;
          right: 5%;
          height: 1px;
          background: ${isDark 
            ? 'linear-gradient(90deg, transparent 0%, rgba(100, 105, 120, 0.25) 20%, rgba(100, 105, 120, 0.3) 50%, rgba(100, 105, 120, 0.25) 80%, transparent 100%)'
            : 'linear-gradient(90deg, transparent 0%, rgba(170, 175, 170, 0.3) 20%, rgba(170, 175, 170, 0.4) 50%, rgba(170, 175, 170, 0.3) 80%, transparent 100%)'};
        }

        .couch {
          position: relative;
          height: 140px;
        }

        .couch-back {
          position: absolute;
          bottom: 45px;
          left: 0;
          width: 100%;
          height: 95px;
          background: ${isDark
            ? 'linear-gradient(180deg, rgba(50, 45, 60, 0.95) 0%, rgba(42, 38, 52, 0.92) 50%, rgba(35, 32, 45, 0.9) 100%)'
            : 'linear-gradient(180deg, rgba(232, 224, 212, 0.98) 0%, rgba(220, 212, 198, 0.95) 50%, rgba(208, 200, 186, 0.92) 100%)'};
          border-radius: 20px 20px 0 0;
          box-shadow: ${isDark
            ? 'inset 0 15px 40px rgba(80, 70, 100, 0.2), 0 -5px 25px rgba(0, 0, 0, 0.2)'
            : 'inset 0 15px 40px rgba(255, 255, 255, 0.6), 0 -5px 25px rgba(0, 0, 0, 0.05)'};
        }

        .couch-seat {
          position: absolute;
          bottom: 22px;
          left: 4%;
          width: 92%;
          height: 38px;
          background: ${isDark
            ? 'linear-gradient(180deg, rgba(55, 50, 65, 1) 0%, rgba(45, 40, 55, 1) 100%)'
            : 'linear-gradient(180deg, rgba(240, 235, 225, 1) 0%, rgba(228, 220, 208, 1) 100%)'};
          border-radius: 12px;
          box-shadow: 0 10px 30px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)'};
        }

        .couch-cushion {
          position: absolute;
          bottom: 50px;
          width: 28%;
          height: 55px;
          background: ${isDark
            ? 'linear-gradient(145deg, rgba(55, 50, 65, 1) 0%, rgba(45, 40, 55, 1) 100%)'
            : 'linear-gradient(145deg, rgba(238, 232, 222, 1) 0%, rgba(226, 218, 206, 1) 100%)'};
          border-radius: 12px;
          box-shadow: ${isDark
            ? 'inset 0 5px 20px rgba(80, 70, 100, 0.2), 3px 5px 15px rgba(0, 0, 0, 0.2)'
            : 'inset 0 5px 20px rgba(255, 255, 255, 0.6), 3px 5px 15px rgba(0, 0, 0, 0.06)'};
        }

        .cushion-1 { left: 6%; }
        .cushion-2 { left: 36%; }
        .cushion-3 { left: 66%; }

        .couch-arm {
          position: absolute;
          bottom: 22px;
          width: 8%;
          height: 75px;
          background: ${isDark
            ? 'linear-gradient(180deg, rgba(50, 45, 60, 1) 0%, rgba(42, 38, 52, 1) 100%)'
            : 'linear-gradient(180deg, rgba(228, 220, 208, 1) 0%, rgba(216, 208, 196, 1) 100%)'};
        }

        .arm-left { left: 0; border-radius: 15px 6px 6px 15px; }
        .arm-right { right: 0; border-radius: 6px 15px 15px 6px; }

        .couch-leg {
          position: absolute;
          bottom: 0;
          width: 6px;
          height: 22px;
          background: ${isDark
            ? 'linear-gradient(180deg, rgba(60, 50, 40, 1) 0%, rgba(45, 35, 28, 1) 100%)'
            : 'linear-gradient(180deg, rgba(139, 115, 85, 1) 0%, rgba(107, 85, 65, 1) 100%)'};
          border-radius: 2px;
        }

        .leg-1 { left: 8%; }
        .leg-2 { left: 32%; }
        .leg-3 { right: 32%; }
        .leg-4 { right: 8%; }

        .throw-pillow {
          position: absolute;
          border-radius: 10px;
          box-shadow: 2px 4px 12px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)'};
        }

        .pillow-sage {
          bottom: 75px;
          left: 10%;
          width: 50px;
          height: 42px;
          background: ${isDark
            ? 'linear-gradient(145deg, rgba(70, 85, 75, 1) 0%, rgba(55, 70, 60, 1) 100%)'
            : 'linear-gradient(145deg, rgba(168, 181, 160, 1) 0%, rgba(148, 165, 140, 1) 100%)'};
          transform: rotate(-12deg);
        }

        .pillow-terracotta {
          bottom: 70px;
          right: 12%;
          width: 45px;
          height: 38px;
          background: ${isDark
            ? 'linear-gradient(145deg, rgba(100, 75, 60, 1) 0%, rgba(80, 60, 48, 1) 100%)'
            : 'linear-gradient(145deg, rgba(196, 164, 132, 1) 0%, rgba(180, 148, 116, 1) 100%)'};
          transform: rotate(8deg);
        }

        /* Tall Floor Lamp - Next to Couch */
        .floor-lamp-tall {
          position: absolute;
          bottom: 14%;
          left: 42%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .tall-lamp-shade {
          width: 55px;
          height: 45px;
          background: ${isDark
            ? 'linear-gradient(180deg, rgba(65, 60, 55, 1) 0%, rgba(55, 50, 45, 1) 100%)'
            : 'linear-gradient(180deg, rgba(255, 252, 248, 1) 0%, rgba(248, 244, 238, 1) 100%)'};
          border-radius: 8px 8px 25px 25px;
          box-shadow: 
            0 8px 25px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)'},
            inset 0 -25px 40px ${isDark ? 'rgba(255, 200, 120, 0.12)' : 'rgba(255, 220, 150, 0.3)'};
          position: relative;
        }

        .tall-lamp-glow {
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 60px;
          background: radial-gradient(ellipse at top, 
            ${isDark ? 'rgba(255, 220, 150, 0.15)' : 'rgba(255, 230, 180, 0.25)'} 0%, 
            transparent 70%);
          pointer-events: none;
        }

        .tall-lamp-neck {
          width: 8px;
          height: 12px;
          background: ${isDark ? 'rgba(90, 75, 60, 1)' : 'rgba(180, 160, 135, 1)'};
          margin-top: 2px;
        }

        .tall-lamp-pole {
          width: 6px;
          height: 130px;
          background: ${isDark 
            ? 'linear-gradient(180deg, rgba(70, 58, 45, 1) 0%, rgba(55, 45, 35, 1) 100%)'
            : 'linear-gradient(180deg, rgba(160, 140, 115, 1) 0%, rgba(140, 120, 95, 1) 100%)'};
          border-radius: 3px;
        }

        .tall-lamp-base {
          width: 40px;
          height: 12px;
          background: ${isDark 
            ? 'linear-gradient(180deg, rgba(55, 45, 35, 1) 0%, rgba(42, 35, 28, 1) 100%)'
            : 'linear-gradient(180deg, rgba(140, 120, 95, 1) 0%, rgba(120, 100, 80, 1) 100%)'};
          border-radius: 50%;
          margin-top: 2px;
        }

        /* Floor Plant - Zen Peace Lily */
        .floor-plant {
          position: absolute;
          bottom: 12%;
          right: 8%;
        }

        .plant-pot {
          width: 50px;
          height: 42px;
          background: ${isDark
            ? 'linear-gradient(180deg, rgba(55, 50, 48, 1) 0%, rgba(42, 38, 35, 1) 100%)'
            : 'linear-gradient(180deg, rgba(200, 185, 168, 1) 0%, rgba(175, 160, 142, 1) 100%)'};
          border-radius: 4px 4px 12px 12px;
          box-shadow: 0 8px 25px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'};
          position: relative;
        }

        .plant-pot-rim {
          position: absolute;
          top: -4px;
          left: -2px;
          right: -2px;
          height: 8px;
          background: ${isDark
            ? 'linear-gradient(180deg, rgba(65, 58, 55, 1) 0%, rgba(55, 50, 48, 1) 100%)'
            : 'linear-gradient(180deg, rgba(215, 198, 180, 1) 0%, rgba(200, 185, 168, 1) 100%)'};
          border-radius: 3px;
        }

        .plant-leaves-container {
          position: absolute;
          bottom: 38px;
          left: 50%;
          transform: translateX(-50%);
          width: 90px;
          height: 110px;
        }

        .plant-leaf {
          position: absolute;
          background: ${isDark
            ? 'linear-gradient(180deg, rgba(45, 65, 50, 0.95) 0%, rgba(35, 55, 42, 1) 100%)'
            : 'linear-gradient(180deg, rgba(95, 130, 100, 0.95) 0%, rgba(75, 110, 80, 1) 100%)'};
          border-radius: 50% 50% 50% 50% / 85% 85% 15% 15%;
          transform-origin: bottom center;
          animation: gentleLeafSway 7s ease-in-out infinite;
        }

        /* Leaf vein */
        .plant-leaf::after {
          content: '';
          position: absolute;
          bottom: 8%;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 65%;
          background: ${isDark ? 'rgba(80, 110, 85, 0.25)' : 'rgba(255, 255, 255, 0.18)'};
        }

        .leaf-1 { width: 14px; height: 52px; left: 38px; bottom: 0; --leaf-rotate: -6deg; animation-delay: 0s; }
        .leaf-2 { width: 16px; height: 60px; left: 42px; bottom: 0; --leaf-rotate: 3deg; animation-delay: -1.2s; }
        .leaf-3 { width: 13px; height: 46px; left: 30px; bottom: 4px; --leaf-rotate: -18deg; animation-delay: -2.4s; }
        .leaf-4 { width: 15px; height: 54px; left: 50px; bottom: 2px; --leaf-rotate: 14deg; animation-delay: -3.6s; }
        .leaf-5 { width: 12px; height: 42px; left: 24px; bottom: 8px; --leaf-rotate: -26deg; animation-delay: -4.8s; }
        .leaf-6 { width: 14px; height: 50px; left: 56px; bottom: 5px; --leaf-rotate: 22deg; animation-delay: -6s; }

        @keyframes gentleLeafSway {
          0%, 100% { transform: rotate(var(--leaf-rotate, 0deg)); }
          50% { transform: rotate(calc(var(--leaf-rotate, 0deg) + 2deg)); }
        }

        /* Peace Lily Flowers */
        .lily-flower {
          position: absolute;
          bottom: 0;
          transform-origin: bottom center;
          animation: gentleLeafSway 8s ease-in-out infinite;
        }

        .lily-stem {
          width: 2px;
          background: ${isDark ? 'rgba(50, 70, 55, 0.9)' : 'rgba(85, 115, 90, 0.9)'};
          border-radius: 1px;
          margin: 0 auto;
        }

        .lily-bloom {
          width: 14px;
          height: 20px;
          background: ${isDark 
            ? 'linear-gradient(180deg, rgba(240, 240, 235, 0.85) 0%, rgba(225, 225, 220, 0.8) 100%)' 
            : 'linear-gradient(180deg, rgba(255, 255, 252, 0.95) 0%, rgba(248, 248, 245, 0.9) 100%)'};
          border-radius: 50% 50% 45% 45% / 65% 65% 35% 35%;
          box-shadow: 0 3px 10px ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
          position: relative;
        }

        .lily-spadix {
          position: absolute;
          bottom: 25%;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 10px;
          background: ${isDark ? '#d4c890' : '#e8dc98'};
          border-radius: 2px;
        }

        .lily-1 { left: 40px; --leaf-rotate: 4deg; animation-delay: -0.8s; }
        .lily-1 .lily-stem { height: 58px; }

        .lily-2 { left: 52px; --leaf-rotate: -6deg; animation-delay: -3.2s; }
        .lily-2 .lily-stem { height: 50px; }
        .lily-2 .lily-bloom { width: 12px; height: 17px; }

        /* Rug - Zen sage */
        .rug {
          position: absolute;
          bottom: 6%;
          left: 10%;
          width: 50%;
          height: 22%;
          background: radial-gradient(ellipse at center, 
            ${isDark ? 'rgba(60, 70, 65, 0.35)' : 'rgba(160, 172, 155, 0.4)'} 0%, 
            ${isDark ? 'rgba(60, 70, 65, 0.12)' : 'rgba(160, 172, 155, 0.15)'} 50%, 
            transparent 80%);
          border-radius: 50%;
          transform: perspective(600px) rotateX(65deg);
          transform-origin: bottom center;
        }

        /* Back Button */
        .back-button {
          position: fixed;
          top: calc(env(safe-area-inset-top, 0px) + 16px);
          left: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          border-radius: 50px;
          background: ${isDark ? 'rgba(30, 30, 40, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(45, 45, 45, 0.1)'};
          color: ${isDark ? 'rgba(255, 255, 255, 0.8)' : '#2d2d2d'};
          font-size: 0.85rem;
          cursor: pointer;
          z-index: 100;
          transition: all 0.3s ease;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 20px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.06)'};
          font-family: inherit;
        }

        .back-button:hover {
          background: ${isDark ? 'rgba(40, 40, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
          transform: translateX(-2px);
        }

        .back-arrow {
          font-size: 1.1rem;
          transition: transform 0.3s ease;
        }

        .back-button:hover .back-arrow {
          transform: translateX(-3px);
        }

        /* Chat Container */
        .chat-container {
          position: relative;
          z-index: 50;
          height: 100vh;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          padding-top: calc(env(safe-area-inset-top, 0px) + 70px);
          padding-bottom: env(safe-area-inset-bottom, 0px);
          opacity: ${showChat ? 1 : 0};
          transform: translateY(${showChat ? '0' : '20px'});
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        /* VERA Presence - Single Orb */
        .vera-presence {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 16px;
          margin-bottom: 8px;
        }

        .vera-orb {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, 
            rgba(255, 255, 255, 0.3) 0%, 
            rgba(160, 140, 200, 0.5) 30%, 
            rgba(120, 100, 180, 0.4) 60%, 
            rgba(90, 70, 160, 0.3) 100%);
          box-shadow: 
            0 0 ${25 + breathValue * 15}px rgba(140, 120, 200, ${0.3 + breathValue * 0.15}),
            0 0 ${50 + breathValue * 25}px rgba(140, 120, 200, ${0.1 + breathValue * 0.08}),
            inset 0 0 25px rgba(255, 255, 255, 0.15);
          transform: scale(${1 + breathValue * 0.04});
        }

        .vera-status {
          text-align: center;
        }

        .vera-label {
          font-size: 0.6rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: ${isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(45, 45, 45, 0.5)'};
        }

        .vera-room {
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${isDark ? 'rgba(160, 140, 200, 0.8)' : 'rgba(139, 119, 183, 0.8)'};
          margin-top: 3px;
        }

        /* Messages Area */
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 0 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          -webkit-overflow-scrolling: touch;
        }

        .message {
          max-width: 85%;
          padding: 16px 20px;
          border-radius: 20px;
          font-size: 0.95rem;
          line-height: 1.6;
          animation: messageIn 0.3s ease;
        }

        @keyframes messageIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .message-user {
          align-self: flex-end;
          background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
          color: #ffffff;
          border-bottom-right-radius: 6px;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.25);
        }

        .message-assistant {
          align-self: flex-start;
          background: rgba(255, 255, 255, 0.92);
          color: #2d2d2d;
          border: 1px solid rgba(45, 45, 45, 0.08);
          border-bottom-left-radius: 6px;
          box-shadow: 0 3px 15px rgba(0, 0, 0, 0.04);
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 18px 22px;
          background: rgba(255, 255, 255, 0.92);
          border-radius: 20px;
          border-bottom-left-radius: 6px;
          max-width: 85px;
          animation: messageIn 0.3s ease;
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(139, 119, 183, 0.6);
          animation: typingBounce 1.4s ease-in-out infinite;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }

        /* Empty State - NO large orb */
        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 20px;
        }

        .empty-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.5rem;
          font-weight: 300;
          color: ${isDark ? '#ffffff' : '#2d2d2d'};
          margin-bottom: 8px;
        }

        .empty-subtitle {
          font-size: 0.95rem;
          color: ${isDark ? 'rgba(255, 255, 255, 0.55)' : 'rgba(45, 45, 45, 0.6)'};
          margin-bottom: 28px;
          line-height: 1.5;
        }

        /* Starter Prompts - Smaller pills */
        .starter-prompts {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          width: 100%;
          max-width: 450px;
        }

        .starter-btn {
          padding: 10px 16px;
          border-radius: 20px;
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(45, 45, 45, 0.1)'};
          background: ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.85)'};
          color: ${isDark ? 'rgba(255, 255, 255, 0.8)' : '#2d2d2d'};
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          backdrop-filter: blur(8px);
          font-family: inherit;
        }

        .starter-btn:hover {
          background: ${isDark ? 'rgba(140, 120, 200, 0.15)' : 'rgba(139, 119, 183, 0.12)'};
          border-color: ${isDark ? 'rgba(140, 120, 200, 0.3)' : 'rgba(139, 119, 183, 0.3)'};
          transform: translateY(-2px);
        }

        /* Input Area */
        .input-area {
          padding: 16px 20px;
          padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
          background: linear-gradient(180deg, transparent 0%, ${isDark ? 'rgba(10, 10, 16, 0.98)' : 'rgba(250, 248, 245, 0.98)'} 25%);
        }

        .input-container {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          background: ${isDark ? 'rgba(30, 30, 40, 0.9)' : 'rgba(255, 255, 255, 0.95)'};
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(45, 45, 45, 0.1)'};
          border-radius: 26px;
          padding: 8px 8px 8px 22px;
          box-shadow: 0 5px 25px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.06)'};
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .input-container:focus-within {
          border-color: ${isDark ? 'rgba(140, 120, 200, 0.4)' : 'rgba(139, 119, 183, 0.3)'};
          box-shadow: 0 5px 30px ${isDark ? 'rgba(140, 120, 200, 0.15)' : 'rgba(139, 119, 183, 0.1)'};
        }

        .input-field {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 0.95rem;
          color: ${isDark ? '#ffffff' : '#2d2d2d'};
          resize: none;
          max-height: 120px;
          line-height: 1.5;
          padding: 10px 0;
          font-family: inherit;
        }

        .input-field::placeholder {
          color: ${isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(45, 45, 45, 0.4)'};
        }

        .input-field:focus {
          outline: none;
        }

        .send-btn {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
          color: #ffffff;
          font-size: 1.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 6px 25px rgba(139, 92, 246, 0.4);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .send-arrow {
          transform: rotate(-90deg);
        }

        @media (max-width: 768px) {
          .message { max-width: 90%; }
          .room-elements { opacity: ${isLoaded ? 0.25 : 0}; }
          .couch-container { transform: scale(0.7); left: 2%; bottom: 12%; }
          .floor-lamp-tall { transform: scale(0.7); left: 38%; bottom: 10%; }
          .floor-plant { transform: scale(0.7); right: 5%; bottom: 8%; }
          .wall-art { left: 2%; width: 44%; }
          .art-frame { width: 65%; max-width: 200px; height: 80px; }
          .window-container { width: 30%; right: 3%; top: 5%; height: 40%; }
          .starter-btn { padding: 8px 14px; font-size: 0.75rem; }
          .empty-state { padding: 30px 15px; justify-content: flex-start; padding-top: 10%; }
          .empty-title { font-size: 1.4rem; }
          .empty-subtitle { font-size: 0.9rem; margin-bottom: 20px; }
          .starter-prompts { max-width: 320px; }
        }

        @media (max-width: 480px) {
          .vera-presence { padding: 12px; gap: 8px; }
          .vera-orb { width: 42px; height: 42px; }
          .vera-label { font-size: 0.55rem; letter-spacing: 0.3em; }
          .vera-room { font-size: 0.5rem; }
          .empty-state { padding: 20px 20px; padding-top: 5%; }
          .empty-title { font-size: 1.25rem; }
          .empty-subtitle { font-size: 0.8rem; margin-bottom: 18px; max-width: 200px; }
          .starter-prompts { gap: 6px; max-width: 280px; }
          .starter-btn { padding: 7px 11px; font-size: 0.68rem; }
          .room-elements { opacity: ${isLoaded ? 0.18 : 0}; }
          .couch-container { transform: scale(0.5); left: 0; bottom: 8%; }
          .floor-lamp-tall { transform: scale(0.5); left: 36%; bottom: 6%; }
          .floor-plant { transform: scale(0.5); right: 2%; bottom: 5%; }
          .wall-art { left: 0; width: 48%; bottom: 42%; }
          .art-frame { width: 60%; max-width: 160px; height: 65px; }
          .window-container { width: 25%; right: 2%; top: 3%; height: 32%; opacity: 0.6; }
          .light-beams { opacity: 0.4; }
          .input-container { padding: 6px 6px 6px 16px; }
          .input-field { font-size: 0.9rem; padding: 8px 0; }
          .send-btn { width: 40px; height: 40px; font-size: 1.1rem; }
        }
      `}</style>

      <div className="therapy-room">
        {/* Ambient Lighting */}
        <div className="light-layer sunlight" />
        <div className="light-layer ambient-glow" />
        
        {/* Light Beams */}
        <div className="light-beams">
          <div className="beam beam-1" />
          <div className="beam beam-2" />
          <div className="beam beam-3" />
        </div>

        {/* Dust Particles */}
        <div className="dust-container">
          {dustParticles.map((p) => (
            <div
              key={p.id}
              className="dust"
              style={{
                left: `${p.x}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Room Elements */}
        <div className="room-elements">
          <div className="wall" />
          
          <div className="window-container">
            <div className="window">
              <div className="window-frame-v" />
              <div className="window-frame-h" />
              <div className="moon" />
              <div className="stars">
                <div className="star" style={{ top: '20%', left: '15%', width: '2px', height: '2px', animationDelay: '0s' }} />
                <div className="star" style={{ top: '35%', left: '70%', width: '1.5px', height: '1.5px', animationDelay: '0.5s' }} />
                <div className="star" style={{ top: '60%', left: '25%', width: '2px', height: '2px', animationDelay: '1s' }} />
                <div className="star" style={{ top: '45%', left: '55%', width: '1px', height: '1px', animationDelay: '1.5s' }} />
                <div className="star" style={{ top: '75%', left: '80%', width: '1.5px', height: '1.5px', animationDelay: '2s' }} />
              </div>
            </div>
            <div className="window-sill" />
          </div>

          <div className="floor" />

          <div className="rug" />

          {/* Wall Art - Above Couch */}
          <div className="wall-art">
            <div className="art-frame">
              <div className="art-canvas">
                <div className="art-shape-1" />
                <div className="art-shape-2" />
                <div className="art-shape-3" />
                <div className="art-horizon" />
              </div>
            </div>
          </div>

          <div className="couch-container">
            <div className="couch">
              <div className="couch-back" />
              <div className="couch-cushion cushion-1" />
              <div className="couch-cushion cushion-2" />
              <div className="couch-cushion cushion-3" />
              <div className="couch-seat" />
              <div className="couch-arm arm-left" />
              <div className="couch-arm arm-right" />
              <div className="couch-leg leg-1" />
              <div className="couch-leg leg-2" />
              <div className="couch-leg leg-3" />
              <div className="couch-leg leg-4" />
              <div className="throw-pillow pillow-sage" />
              <div className="throw-pillow pillow-terracotta" />
            </div>
          </div>

          {/* Tall Floor Lamp - Next to Couch */}
          <div className="floor-lamp-tall">
            <div className="tall-lamp-shade">
              <div className="tall-lamp-glow" />
            </div>
            <div className="tall-lamp-neck" />
            <div className="tall-lamp-pole" />
            <div className="tall-lamp-base" />
          </div>

          <div className="floor-plant">
            <div className="plant-leaves-container">
              <div className="plant-leaf leaf-1" />
              <div className="plant-leaf leaf-2" />
              <div className="plant-leaf leaf-3" />
              <div className="plant-leaf leaf-4" />
              <div className="plant-leaf leaf-5" />
              <div className="plant-leaf leaf-6" />
              <div className="lily-flower lily-1">
                <div className="lily-bloom">
                  <div className="lily-spadix" />
                </div>
                <div className="lily-stem" />
              </div>
              <div className="lily-flower lily-2">
                <div className="lily-bloom">
                  <div className="lily-spadix" />
                </div>
                <div className="lily-stem" />
              </div>
            </div>
            <div className="plant-pot">
              <div className="plant-pot-rim" />
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button className="back-button" onClick={onBack}>
          <span className="back-arrow">←</span>
          <span>Back to Sanctuary</span>
        </button>

        {/* Chat Container */}
        <div className="chat-container">
          {/* VERA Presence - Single Orb at top */}
          <div className="vera-presence">
            <div className="vera-orb" />
            <div className="vera-status">
              <div className="vera-label">VERA is here</div>
              <div className="vera-room">Therapy Room</div>
            </div>
          </div>

          {/* Messages or Empty State */}
          {messages.length === 0 ? (
            <div className="empty-state">
              <h2 className="empty-title">Have a seat</h2>
              <p className="empty-subtitle">I'm here to listen. What's on your mind?</p>
              
              <div className="starter-prompts">
                {starterPrompts.map((prompt, i) => (
                  <button 
                    key={i}
                    className="starter-btn"
                    onClick={() => onSendMessage(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages-area">
              {messages.map((msg, i) => (
                <div key={i} className={`message message-${msg.role}`}>
                  {msg.content}
                </div>
              ))}
              
              {isGenerating && (
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Area */}
          <div className="input-area">
            <form onSubmit={handleSubmit} className="input-container">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share what's on your mind..."
                className="input-field"
                rows={1}
                disabled={isGenerating}
              />
              <button 
                type="submit" 
                className="send-btn"
                disabled={!inputValue.trim() || isGenerating}
              >
                <span className="send-arrow">➤</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}