'use client';

import { useState, useEffect, useRef } from 'react';

interface BedroomRoomProps {
  onBack: () => void;
  onStartSleepStory?: (storyId: string) => void;
  onPlaySound?: (soundId: string) => void;
}

type SleepContent = {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  audioUrl?: string;
};

const SLEEP_CATEGORIES = [
  { id: 'soundscapes', title: 'Soundscapes', description: 'Ambient sounds for deep rest', count: 3 },
  { id: 'sleep-stories', title: 'Sleep Stories', description: 'Gentle tales to drift away', count: 2 },
  { id: 'meditations', title: 'Sleep Meditations', description: 'Guided journeys into rest', count: 2 },
];

const SLEEP_CONTENT: SleepContent[] = [
  { id: 'rain-sleep', title: 'Gentle Rain', description: 'Soft rain on a quiet night', duration: '∞', category: 'soundscapes' },
  { id: 'ocean-waves', title: 'Ocean Waves', description: 'Rhythmic waves for deep sleep', duration: '∞', category: 'soundscapes' },
  { id: 'night-forest', title: 'Night Forest', description: 'Crickets and gentle breeze', duration: '∞', category: 'soundscapes' },
  { id: 'sleepy-village', title: 'The Sleepy Village', description: 'A cozy bedtime tale', duration: '20 min', category: 'sleep-stories' },
  { id: 'cloud-journey', title: 'Cloud Journey', description: 'Floating through soft clouds', duration: '15 min', category: 'sleep-stories' },
  { id: 'body-scan', title: 'Body Scan', description: 'Release tension, find rest', duration: '12 min', category: 'meditations' },
  { id: 'breath-sleep', title: 'Breath Into Sleep', description: 'Gentle breathing into stillness', duration: '10 min', category: 'meditations' },
];

export default function BedroomRoom({ onBack, onStartSleepStory, onPlaySound }: BedroomRoomProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<SleepContent | null>(null);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [selectedTimer, setSelectedTimer] = useState<string | null>(null);

  // Stars in window - deterministic
  const [windowStars] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: 8 + (i * 19) % 72,
      y: 5 + (i * 21) % 65,
      size: 1 + (i % 2),
      duration: 3 + (i % 4),
      delay: (i * 0.5) % 5,
    }))
  );

  // Floating dust particles in moonbeam
  const [dustParticles] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      startX: 72 + (i * 4) % 15,
      startY: 20 + (i * 12) % 35,
      size: 1.5 + (i % 2) * 0.5,
      duration: 10 + (i * 2) % 6,
      delay: i * 1.5,
    }))
  );

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleContentClick = (item: SleepContent) => {
    if (item.category === 'soundscapes') {
      const newActive = activeSound === item.id ? null : item.id;
      setActiveSound(newActive);
      if (onPlaySound && newActive) onPlaySound(item.id);
    } else {
      setSelectedContent(item);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedContent(null);
  };

  const contentInCategory = SLEEP_CONTENT.filter(c => c.category === selectedCategory);

  return (
    <>
      <style jsx>{`
        .bedroom-room {
          min-height: 100vh;
          min-height: 100dvh;
          background: linear-gradient(180deg, #05050d 0%, #08081a 30%, #0b0b1e 60%, #070716 100%);
          position: relative;
          overflow-x: hidden;
          overflow-y: auto;
        }

        /* ============ AMBIENT LAYERS ============ */
        .ambient-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }

        .night-gradient {
          background: 
            radial-gradient(ellipse 70% 50% at 82% 18%, rgba(60, 70, 120, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 15% 75%, rgba(25, 30, 60, 0.06) 0%, transparent 40%);
        }

        /* Moonbeam streaming through window */
        .moonbeam {
          background: linear-gradient(
            135deg,
            transparent 0%,
            transparent 45%,
            rgba(180, 190, 230, 0.03) 50%,
            rgba(160, 170, 220, 0.05) 55%,
            rgba(140, 150, 200, 0.03) 65%,
            transparent 75%
          );
          clip-path: polygon(82% 0%, 95% 0%, 60% 100%, 35% 100%);
        }

        /* ============ ROOM ELEMENTS ============ */
        .room-elements {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: ${isLoaded ? 0.45 : 0};
          transition: opacity 1s ease;
        }

        /* ============ FLOOR ============ */
        .floor {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 28%;
          background: linear-gradient(180deg,
            rgba(15, 15, 28, 0.9) 0%,
            rgba(10, 10, 22, 0.95) 50%,
            rgba(8, 8, 18, 1) 100%);
          transform: perspective(600px) rotateX(45deg);
          transform-origin: bottom center;
        }

        /* Moonlight reflection on floor */
        .floor-moonlight {
          position: absolute;
          bottom: 5%;
          right: 20%;
          width: 30%;
          height: 15%;
          background: radial-gradient(ellipse at center,
            rgba(180, 190, 230, 0.06) 0%,
            rgba(160, 170, 220, 0.03) 40%,
            transparent 70%);
          border-radius: 50%;
          filter: blur(10px);
        }

        /* ============ WINDOW ============ */
        .window-container {
          position: absolute;
          top: 6%;
          right: 10%;
          width: 15%;
          max-width: 150px;
          height: 36%;
        }

        .window {
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg,
            rgba(6, 10, 25, 0.98) 0%,
            rgba(10, 15, 35, 0.95) 50%,
            rgba(6, 10, 25, 0.98) 100%);
          border: 4px solid rgba(35, 40, 55, 0.9);
          border-radius: 4px 4px 0 0;
          position: relative;
          box-shadow:
            inset 0 0 30px rgba(80, 100, 160, 0.05),
            0 0 25px rgba(0, 0, 0, 0.4);
          overflow: hidden;
        }

        .window-star {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          animation: twinkle ease-in-out infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.2); }
        }

        /* ============ SHOOTING STAR ============ */
        .shooting-star {
          position: absolute;
          top: 20%;
          left: 15%;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          opacity: 0;
          animation: shootingStar 12s ease-in-out infinite;
        }

        .shooting-star::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0.8) 0%, transparent 100%);
          transform: rotate(-45deg) translateX(-40px);
          transform-origin: right center;
        }

        @keyframes shootingStar {
          0%, 85%, 100% { 
            opacity: 0;
            transform: translate(0, 0);
          }
          88% {
            opacity: 1;
          }
          92% {
            opacity: 1;
            transform: translate(50px, 50px);
          }
          93% {
            opacity: 0;
            transform: translate(60px, 60px);
          }
        }

        /* ============ CRESCENT MOON ============ */
        .crescent-moon {
          position: absolute;
          top: 10%;
          right: 20%;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: transparent;
          box-shadow: 
            8px -2px 0 0 rgba(245, 245, 255, 0.95),
            8px -2px 15px 2px rgba(200, 210, 255, 0.3),
            8px -2px 30px 5px rgba(180, 190, 240, 0.15);
        }

        .moon-glow {
          position: absolute;
          top: 5%;
          right: 12%;
          width: 50px;
          height: 50px;
          background: radial-gradient(circle,
            rgba(200, 210, 255, 0.08) 0%,
            rgba(180, 190, 240, 0.04) 40%,
            transparent 70%);
          border-radius: 50%;
          animation: moonPulse 6s ease-in-out infinite;
        }

        @keyframes moonPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .window-frame-v {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 100%;
          background: rgba(35, 40, 55, 0.9);
        }

        .window-frame-h {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 100%;
          height: 3px;
          background: rgba(35, 40, 55, 0.9);
        }

        .window-sill {
          position: absolute;
          bottom: -8px;
          left: -5px;
          right: -5px;
          height: 8px;
          background: linear-gradient(180deg,
            rgba(45, 50, 65, 1) 0%,
            rgba(35, 40, 55, 1) 100%);
          border-radius: 0 0 3px 3px;
        }

        /* ============ CURTAINS ============ */
        .curtain {
          position: absolute;
          top: -2%;
          width: 18%;
          height: 106%;
          background: linear-gradient(180deg,
            rgba(35, 40, 60, 0.92) 0%,
            rgba(30, 35, 52, 0.88) 50%,
            rgba(25, 30, 48, 0.85) 100%);
        }

        .curtain-left {
          left: -10%;
          border-radius: 0 4px 0 0;
          box-shadow: 2px 0 12px rgba(0, 0, 0, 0.25);
          animation: curtainSway 8s ease-in-out infinite;
        }

        .curtain-right {
          right: -10%;
          border-radius: 4px 0 0 0;
          box-shadow: -2px 0 12px rgba(0, 0, 0, 0.25);
          animation: curtainSway 8s ease-in-out infinite reverse;
        }

        @keyframes curtainSway {
          0%, 100% { transform: skewX(0deg); }
          50% { transform: skewX(0.5deg); }
        }

        .curtain-fold {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 30%;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(0, 0, 0, 0.06) 50%,
            transparent 100%);
        }

        .curtain-left .curtain-fold { right: 15%; }
        .curtain-right .curtain-fold { left: 15%; }

        /* ============ FLOATING DUST PARTICLES ============ */
        .dust-particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(200, 210, 240, 0.4);
          animation: dustFloat linear infinite;
        }

        @keyframes dustFloat {
          0% { 
            opacity: 0;
            transform: translate(0, 0);
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.4;
          }
          100% { 
            opacity: 0;
            transform: translate(-30px, 80px);
          }
        }

        /* ============ BED ============ */
        .bed-container {
          position: absolute;
          bottom: 8%;
          left: 4%;
          width: 38%;
          height: 24%;
          opacity: 0.7;
        }

        .headboard {
          position: absolute;
          top: -22%;
          left: 2%;
          right: 2%;
          height: 32%;
          background: linear-gradient(180deg,
            rgba(50, 45, 62, 0.85) 0%,
            rgba(40, 36, 52, 0.8) 100%);
          border-radius: 8px 8px 0 0;
          box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.2);
        }

        .headboard-detail {
          position: absolute;
          top: 15%;
          left: 6%;
          right: 6%;
          bottom: 20%;
          background: linear-gradient(180deg,
            rgba(55, 50, 70, 0.2) 0%,
            transparent 100%);
          border-radius: 5px;
          border: 1px solid rgba(70, 65, 90, 0.1);
        }

        .bed-frame {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80%;
          background: linear-gradient(180deg,
            rgba(42, 38, 52, 0.85) 0%,
            rgba(32, 30, 42, 0.8) 100%);
          border-radius: 5px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }

        .mattress {
          position: absolute;
          top: 8%;
          left: 3%;
          right: 3%;
          height: 68%;
          background: linear-gradient(180deg,
            rgba(235, 232, 242, 0.85) 0%,
            rgba(220, 215, 230, 0.8) 50%,
            rgba(205, 200, 218, 0.75) 100%);
          border-radius: 4px;
          box-shadow: inset 0 3px 12px rgba(255, 255, 255, 0.2);
        }

        .blanket {
          position: absolute;
          top: 30%;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg,
            rgba(65, 75, 110, 0.85) 0%,
            rgba(55, 65, 100, 0.8) 40%,
            rgba(48, 58, 92, 0.75) 100%);
          border-radius: 0 0 4px 4px;
          box-shadow: inset 0 5px 15px rgba(100, 110, 150, 0.12);
          animation: blanketBreathe 6s ease-in-out infinite;
        }

        @keyframes blanketBreathe {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.006); }
        }

        .blanket-fold {
          position: absolute;
          top: 0;
          left: 12%;
          right: 12%;
          height: 18%;
          background: linear-gradient(180deg,
            rgba(80, 90, 125, 0.25) 0%,
            transparent 100%);
          border-radius: 0 0 20px 20px;
        }

        .pillow {
          position: absolute;
          top: 12%;
          height: 18%;
          background: linear-gradient(180deg,
            rgba(248, 248, 255, 0.9) 0%,
            rgba(235, 235, 245, 0.85) 100%);
          border-radius: 5px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
        }

        .pillow-1 { left: 10%; width: 25%; transform: rotate(-2deg); }
        .pillow-2 { right: 10%; width: 25%; transform: rotate(2deg); }

        .pillow-indent {
          position: absolute;
          top: 25%;
          left: 20%;
          right: 20%;
          bottom: 25%;
          background: rgba(220, 220, 235, 0.2);
          border-radius: 50%;
        }

        /* ============ BOOK ON BED ============ */
        .book {
          position: absolute;
          bottom: 38%;
          right: 20%;
          width: 22px;
          height: 16px;
          transform: rotate(-8deg);
          opacity: 0.85;
        }

        .book-cover {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg,
            rgba(100, 80, 70, 0.85) 0%,
            rgba(85, 65, 55, 0.8) 100%);
          border-radius: 1px 2px 2px 1px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .book-pages {
          position: absolute;
          top: 2px;
          left: 2px;
          right: 3px;
          bottom: 2px;
          background: linear-gradient(90deg,
            rgba(250, 248, 240, 0.9) 0%,
            rgba(245, 242, 235, 0.85) 100%);
          border-radius: 0 2px 2px 0;
        }

        .book-spine {
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          background: rgba(70, 55, 45, 0.85);
          border-radius: 1px 0 0 1px;
        }

        /* ============ NIGHTSTAND ============ */
        .nightstand {
          position: absolute;
          bottom: 8%;
          left: 44%;
          width: 55px;
        }

        .nightstand-top {
          width: 100%;
          height: 8px;
          background: linear-gradient(180deg,
            rgba(45, 42, 55, 1) 0%,
            rgba(38, 35, 48, 1) 100%);
          border-radius: 3px 3px 0 0;
        }

        .nightstand-body {
          width: 100%;
          height: 45px;
          background: linear-gradient(180deg,
            rgba(40, 37, 50, 1) 0%,
            rgba(35, 32, 45, 1) 100%);
          border-radius: 0 0 3px 3px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }

        .nightstand-drawer {
          position: absolute;
          top: 12px;
          left: 8%;
          right: 8%;
          height: 14px;
          background: rgba(50, 47, 62, 0.6);
          border-radius: 2px;
        }

        .drawer-handle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 3px;
          background: rgba(90, 85, 105, 0.7);
          border-radius: 2px;
        }

        /* ============ TELESCOPE ============ */
        .telescope {
          position: absolute;
          bottom: 10%;
          right: 15%;
          opacity: 0.75;
        }

        .telescope-tripod {
          position: relative;
          width: 100px;
          height: 130px;
        }

        .tripod-leg {
          position: absolute;
          bottom: 0;
          width: 4px;
          height: 90px;
          background: linear-gradient(180deg,
            rgba(60, 55, 70, 0.95) 0%,
            rgba(45, 40, 55, 0.9) 100%);
          border-radius: 2px;
        }

        .tripod-leg-1 {
          left: 15px;
          transform: rotate(-15deg);
          transform-origin: top center;
        }

        .tripod-leg-2 {
          left: 50%;
          transform: translateX(-50%);
        }

        .tripod-leg-3 {
          right: 15px;
          transform: rotate(15deg);
          transform-origin: top center;
        }

        .tripod-hub {
          position: absolute;
          top: 35px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 16px;
          background: radial-gradient(circle,
            rgba(70, 65, 85, 1) 0%,
            rgba(55, 50, 68, 1) 100%);
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .telescope-tube {
          position: absolute;
          top: 5px;
          left: 50%;
          transform: translateX(-50%) rotate(-40deg);
          transform-origin: bottom center;
          width: 22px;
          height: 85px;
          background: linear-gradient(90deg,
            rgba(45, 42, 58, 0.95) 0%,
            rgba(65, 60, 80, 0.95) 25%,
            rgba(75, 70, 92, 0.95) 50%,
            rgba(65, 60, 80, 0.95) 75%,
            rgba(45, 42, 58, 0.95) 100%);
          border-radius: 4px 4px 8px 8px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.3);
        }

        .telescope-lens {
          position: absolute;
          top: -3px;
          left: 50%;
          transform: translateX(-50%);
          width: 28px;
          height: 8px;
          background: linear-gradient(180deg,
            rgba(80, 110, 160, 0.5) 0%,
            rgba(120, 160, 220, 0.35) 50%,
            rgba(80, 110, 160, 0.5) 100%);
          border-radius: 4px;
          border: 3px solid rgba(50, 45, 65, 0.95);
          box-shadow: 
            inset 0 0 12px rgba(150, 190, 240, 0.3),
            0 0 8px rgba(100, 140, 200, 0.2);
        }

        .telescope-eyepiece {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 18px;
          background: linear-gradient(90deg,
            rgba(40, 38, 52, 0.95) 0%,
            rgba(55, 52, 68, 0.95) 50%,
            rgba(40, 38, 52, 0.95) 100%);
          border-radius: 3px;
        }

        .telescope-band {
          position: absolute;
          left: -2px;
          right: -2px;
          height: 5px;
          background: rgba(100, 95, 115, 0.8);
          border-radius: 2px;
        }

        .band-1 { top: 20px; }
        .band-2 { top: 50px; }

        /* ============ CANDLE ============ */
        .candle-container {
          position: absolute;
          top: -45px;
          left: 35%;
          transform: translateX(-50%);
        }

        .candle {
          width: 8px;
          height: 26px;
          background: linear-gradient(180deg,
            rgba(250, 248, 240, 0.95) 0%,
            rgba(240, 235, 220, 0.9) 100%);
          border-radius: 2px 2px 0 0;
          margin: 0 auto;
          position: relative;
        }

        .candle-holder {
          width: 20px;
          height: 6px;
          background: linear-gradient(180deg,
            rgba(80, 70, 90, 1) 0%,
            rgba(60, 52, 70, 1) 100%);
          border-radius: 2px;
          margin: 0 auto;
        }

        .candle-flame {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 14px;
          background: radial-gradient(ellipse at bottom,
            rgba(255, 250, 220, 1) 0%,
            rgba(255, 200, 100, 0.9) 30%,
            rgba(255, 150, 50, 0.6) 60%,
            transparent 100%);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          animation: candleFlicker 0.3s ease-in-out infinite alternate;
        }

        @keyframes candleFlicker {
          0% { transform: translateX(-50%) scaleY(1) rotate(-1deg); opacity: 0.95; }
          100% { transform: translateX(-50%) scaleY(1.08) rotate(1deg); opacity: 1; }
        }

        .candle-glow {
          position: absolute;
          top: -18px;
          left: 50%;
          transform: translateX(-50%);
          width: 45px;
          height: 45px;
          background: radial-gradient(circle,
            rgba(255, 200, 100, 0.15) 0%,
            rgba(255, 180, 80, 0.08) 40%,
            transparent 70%);
          border-radius: 50%;
          animation: candleGlow 2s ease-in-out infinite;
        }

        @keyframes candleGlow {
          0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.1); }
        }

        /* ============ SMALL PLANT ============ */
        .plant {
          position: absolute;
          top: -32px;
          right: 6px;
        }

        .plant-pot {
          width: 14px;
          height: 12px;
          background: linear-gradient(180deg,
            rgba(140, 100, 80, 0.9) 0%,
            rgba(120, 85, 65, 0.85) 100%);
          border-radius: 1px 1px 3px 3px;
        }

        .plant-leaves {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
        }

        .leaf {
          position: absolute;
          width: 8px;
          height: 12px;
          background: linear-gradient(135deg,
            rgba(60, 90, 60, 0.9) 0%,
            rgba(45, 75, 45, 0.85) 100%);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        }

        .leaf-1 { transform: rotate(-25deg) translateX(-4px); }
        .leaf-2 { transform: rotate(0deg) translateY(-5px); }
        .leaf-3 { transform: rotate(25deg) translateX(4px); }

        /* ============ BACK BUTTON ============ */
        .back-button {
          position: fixed;
          top: calc(env(safe-area-inset-top, 0px) + 16px);
          left: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85rem;
          cursor: pointer;
          z-index: 100;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          font-family: inherit;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(-2px);
        }

        /* ============ CONTENT ============ */
        .content {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: calc(env(safe-area-inset-top, 0px) + 70px) 20px 100px;
          opacity: ${isLoaded ? 1 : 0};
          transform: translateY(${isLoaded ? '0' : '20px'});
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .header {
          text-align: center;
          margin-bottom: 28px;
        }

        .title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2rem;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 8px;
          letter-spacing: 0.02em;
        }

        .subtitle {
          font-size: 0.88rem;
          color: rgba(255, 255, 255, 0.4);
        }

        /* ============ CATEGORY GRID ============ */
        .category-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          max-width: 420px;
          width: 100%;
        }

        .category-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 20px 14px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
        }

        .category-card:hover {
          transform: translateY(-3px);
          border-color: rgba(139, 119, 183, 0.35);
          background: rgba(139, 119, 183, 0.08);
          box-shadow: 0 10px 35px rgba(139, 119, 183, 0.1);
        }

        .category-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 0.95rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 6px;
        }

        .category-description {
          font-size: 0.68rem;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .category-count {
          font-size: 0.62rem;
          color: rgba(139, 119, 183, 0.6);
        }

        /* ============ CONTENT LIST ============ */
        .content-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 380px;
          width: 100%;
        }

        .content-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
        }

        .content-card:hover {
          transform: translateY(-2px);
          border-color: rgba(139, 119, 183, 0.35);
          background: rgba(139, 119, 183, 0.08);
        }

        .content-card.active {
          border-color: rgba(139, 119, 183, 0.5);
          background: rgba(139, 119, 183, 0.12);
          box-shadow: 0 0 30px rgba(139, 119, 183, 0.15);
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
        }

        .content-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.9);
        }

        .content-duration {
          font-size: 0.65rem;
          color: rgba(139, 119, 183, 0.6);
        }

        .content-description {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.45);
          line-height: 1.4;
        }

        .playing-indicator {
          display: flex;
          justify-content: flex-start;
          gap: 3px;
          margin-top: 12px;
        }

        .playing-bar {
          width: 3px;
          border-radius: 2px;
          background: rgba(139, 119, 183, 0.7);
          animation: playingBounce 0.8s ease-in-out infinite alternate;
        }

        .bar-1 { height: 10px; animation-delay: 0s; }
        .bar-2 { height: 16px; animation-delay: 0.15s; }
        .bar-3 { height: 12px; animation-delay: 0.3s; }
        .bar-4 { height: 14px; animation-delay: 0.45s; }

        @keyframes playingBounce {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1); }
        }

        .back-to-categories {
          background: none;
          border: none;
          color: rgba(139, 119, 183, 0.6);
          font-size: 0.8rem;
          cursor: pointer;
          margin-bottom: 20px;
          font-family: inherit;
          transition: color 0.3s ease;
        }

        .back-to-categories:hover {
          color: rgba(139, 119, 183, 0.9);
        }

        .section-header {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.3rem;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 20px;
          text-align: center;
        }

        /* ============ CONTENT DETAIL ============ */
        .content-detail {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 400px;
          width: 100%;
          text-align: center;
        }

        .detail-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.8rem;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 8px;
        }

        .detail-duration {
          font-size: 0.8rem;
          color: rgba(139, 119, 183, 0.6);
          margin-bottom: 20px;
        }

        .detail-description {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .play-button {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(139, 119, 183, 0.15);
          border: 1px solid rgba(139, 119, 183, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .play-button:hover {
          background: rgba(139, 119, 183, 0.25);
          border-color: rgba(139, 119, 183, 0.5);
          transform: scale(1.05);
        }

        .play-icon {
          width: 0;
          height: 0;
          border-top: 14px solid transparent;
          border-bottom: 14px solid transparent;
          border-left: 22px solid rgba(139, 119, 183, 0.8);
          margin-left: 4px;
        }

        .play-hint {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
        }

        /* ============ SLEEP TIMER ============ */
        .sleep-timer {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 24px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 50px;
          backdrop-filter: blur(15px);
        }

        .timer-label {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.45);
        }

        .timer-options {
          display: flex;
          gap: 6px;
        }

        .timer-btn {
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: transparent;
          color: rgba(255, 255, 255, 0.45);
          font-size: 0.72rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .timer-btn:hover {
          background: rgba(139, 119, 183, 0.15);
          border-color: rgba(139, 119, 183, 0.35);
          color: rgba(255, 255, 255, 0.8);
        }

        .timer-btn.active {
          background: rgba(139, 119, 183, 0.25);
          border-color: rgba(139, 119, 183, 0.45);
          color: #fff;
        }

        /* ============ RESPONSIVE ============ */
        @media (max-width: 768px) {
          .room-elements { opacity: ${isLoaded ? 0.35 : 0}; }
          .category-grid { max-width: 360px; gap: 10px; }
          .category-card { padding: 16px 12px; }
          .bed-container { width: 36%; left: 3%; }
          .nightstand { left: 42%; transform: scale(0.85); }
          .telescope { right: 10%; transform: scale(0.75); }
          .window-container { width: 18%; right: 8%; }
        }

        @media (max-width: 480px) {
          .room-elements { opacity: ${isLoaded ? 0.28 : 0}; }
          .content { padding: calc(env(safe-area-inset-top, 0px) + 60px) 16px 90px; }
          .title { font-size: 1.6rem; }
          .category-grid { grid-template-columns: 1fr; max-width: 280px; }
          .category-card { padding: 14px; }
          .content-list { max-width: 280px; }
          .bed-container { width: 45%; left: 2%; bottom: 6%; }
          .nightstand { display: none; }
          .telescope { right: 5%; bottom: 6%; transform: scale(0.55); }
          .window-container { width: 20%; right: 5%; top: 5%; height: 30%; }
          .book { display: none; }
          .sleep-timer { flex-direction: column; gap: 10px; padding: 14px 20px; }
        }
      `}</style>

      <div className="bedroom-room">
        {/* Ambient Layers */}
        <div className="ambient-layer night-gradient" />
        <div className="ambient-layer moonbeam" />

        {/* Room Elements */}
        <div className="room-elements">
          <div className="floor" />
          <div className="floor-moonlight" />

          {/* Floating dust particles in moonbeam */}
          {dustParticles.map((particle) => (
            <div
              key={particle.id}
              className="dust-particle"
              style={{
                left: `${particle.startX}%`,
                top: `${particle.startY}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDuration: `${particle.duration}s`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}

          {/* Window */}
          <div className="window-container">
            <div className="curtain curtain-left"><div className="curtain-fold" /></div>
            <div className="curtain curtain-right"><div className="curtain-fold" /></div>
            <div className="window">
              {windowStars.map((star) => (
                <div
                  key={star.id}
                  className="window-star"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    animationDuration: `${star.duration}s`,
                    animationDelay: `${star.delay}s`,
                  }}
                />
              ))}
              <div className="shooting-star" />
              <div className="moon-glow" />
              <div className="crescent-moon" />
              <div className="window-frame-v" />
              <div className="window-frame-h" />
            </div>
            <div className="window-sill" />
          </div>

          {/* Bed */}
          <div className="bed-container">
            <div className="headboard">
              <div className="headboard-detail" />
            </div>
            <div className="bed-frame">
              <div className="mattress">
                <div className="pillow pillow-1"><div className="pillow-indent" /></div>
                <div className="pillow pillow-2"><div className="pillow-indent" /></div>
              </div>
              <div className="blanket">
                <div className="blanket-fold" />
              </div>
              {/* Book on bed */}
              <div className="book">
                <div className="book-spine" />
                <div className="book-cover" />
                <div className="book-pages" />
              </div>
            </div>
          </div>

          {/* Nightstand with candle and plant */}
          <div className="nightstand">
            <div className="candle-container">
              <div className="candle-glow" />
              <div className="candle">
                <div className="candle-flame" />
              </div>
              <div className="candle-holder" />
            </div>
            <div className="plant">
              <div className="plant-leaves">
                <div className="leaf leaf-1" />
                <div className="leaf leaf-2" />
                <div className="leaf leaf-3" />
              </div>
              <div className="plant-pot" />
            </div>
            <div className="nightstand-top" />
            <div className="nightstand-body">
              <div className="nightstand-drawer">
                <div className="drawer-handle" />
              </div>
            </div>
          </div>

          {/* Telescope */}
          <div className="telescope">
            <div className="telescope-tripod">
              <div className="tripod-leg tripod-leg-1" />
              <div className="tripod-leg tripod-leg-2" />
              <div className="tripod-leg tripod-leg-3" />
              <div className="tripod-hub" />
              <div className="telescope-tube">
                <div className="telescope-lens" />
                <div className="telescope-band band-1" />
                <div className="telescope-band band-2" />
                <div className="telescope-eyepiece" />
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button className="back-button" onClick={onBack}>
          <span>←</span>
          <span>Back</span>
        </button>

        {/* Content */}
        <div className="content">
          <div className="header">
            <h1 className="title">Rest Chamber</h1>
            <p className="subtitle">Let go of the day</p>
          </div>

          {/* Categories View */}
          {!selectedCategory && !selectedContent && (
            <div className="category-grid">
              {SLEEP_CATEGORIES.map((category) => (
                <div key={category.id} className="category-card" onClick={() => handleCategoryClick(category.id)}>
                  <h3 className="category-title">{category.title}</h3>
                  <p className="category-description">{category.description}</p>
                  <span className="category-count">{category.count} tracks</span>
                </div>
              ))}
            </div>
          )}

          {/* Content List View */}
          {selectedCategory && !selectedContent && (
            <>
              <button className="back-to-categories" onClick={handleBackToCategories}>
                ← Back
              </button>
              <h2 className="section-header">
                {SLEEP_CATEGORIES.find(c => c.id === selectedCategory)?.title}
              </h2>
              <div className="content-list">
                {contentInCategory.map((item) => (
                  <div 
                    key={item.id} 
                    className={`content-card ${activeSound === item.id ? 'active' : ''}`}
                    onClick={() => handleContentClick(item)}
                  >
                    <div className="content-header">
                      <h3 className="content-title">{item.title}</h3>
                      <span className="content-duration">{item.duration}</span>
                    </div>
                    <p className="content-description">{item.description}</p>
                    {activeSound === item.id && (
                      <div className="playing-indicator">
                        <div className="playing-bar bar-1" />
                        <div className="playing-bar bar-2" />
                        <div className="playing-bar bar-3" />
                        <div className="playing-bar bar-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Content Detail View */}
          {selectedContent && (
            <>
              <button className="back-to-categories" onClick={() => setSelectedContent(null)}>
                ← Back
              </button>
              <div className="content-detail">
                <h1 className="detail-title">{selectedContent.title}</h1>
                <span className="detail-duration">{selectedContent.duration}</span>
                <p className="detail-description">{selectedContent.description}</p>
                <button className="play-button">
                  <div className="play-icon" />
                </button>
                <span className="play-hint">Tap to begin</span>
              </div>
            </>
          )}
        </div>

        {/* Sleep Timer */}
        <div className="sleep-timer">
          <span className="timer-label">Sleep timer</span>
          <div className="timer-options">
            {['15m', '30m', '1h', '∞'].map((time) => (
              <button
                key={time}
                className={`timer-btn ${selectedTimer === time ? 'active' : ''}`}
                onClick={() => setSelectedTimer(selectedTimer === time ? null : time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}