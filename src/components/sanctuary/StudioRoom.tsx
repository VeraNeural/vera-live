'use client';

import { useState, useEffect } from 'react';

interface StudioRoomProps {
  onBack: () => void;
  onLaunchVDS?: () => void;
  onOpenProject?: (projectId: string) => void;
  onSelectTemplate?: (templateId: string) => void;
  savedProjects?: Array<{
    id: string;
    name: string;
    thumbnail?: string;
    lastEdited: string;
  }>;
}

const TEMPLATE_CATEGORIES = [
  { id: 'spaces', title: 'Sanctuary Spaces', description: 'Calming environments to design', count: 6 },
  { id: 'elements', title: 'Healing Elements', description: 'Objects for your sanctuary', count: 4 },
  { id: 'moods', title: 'Mood Palettes', description: 'Color schemes for emotions', count: 5 },
];

const TEMPLATES = {
  spaces: [
    { id: 'blank', name: 'Blank Canvas', description: 'Start from scratch' },
    { id: 'cozy-corner', name: 'Cozy Corner', description: 'Warm, intimate space' },
    { id: 'zen-garden', name: 'Zen Garden', description: 'Peaceful outdoor retreat' },
    { id: 'cloud-room', name: 'Cloud Room', description: 'Floating among the sky' },
    { id: 'forest-clearing', name: 'Forest Clearing', description: 'Nature sanctuary' },
    { id: 'ocean-view', name: 'Ocean View', description: 'Seaside tranquility' },
  ],
  elements: [
    { id: 'water-features', name: 'Water Features', description: 'Fountains, streams, rain' },
    { id: 'living-plants', name: 'Living Plants', description: 'Greenery and gardens' },
    { id: 'soft-lighting', name: 'Soft Lighting', description: 'Candles, lamps, moonlight' },
    { id: 'comfort-items', name: 'Comfort Items', description: 'Blankets, cushions, rugs' },
  ],
  moods: [
    { id: 'calm-blue', name: 'Calm Waters', description: 'Blues and soft grays' },
    { id: 'warm-earth', name: 'Earth Embrace', description: 'Browns and warm tones' },
    { id: 'forest-green', name: 'Forest Heart', description: 'Greens and natural hues' },
    { id: 'sunset-glow', name: 'Sunset Glow', description: 'Oranges and soft pinks' },
    { id: 'night-sky', name: 'Night Sky', description: 'Deep purples and stars' },
  ],
};

export default function StudioRoom({ onBack, onLaunchVDS, onOpenProject, onSelectTemplate, savedProjects = [] }: StudioRoomProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'projects'>('create');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('afternoon');

  // Floating particles - deterministic
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 5 + (i * 17) % 90,
      y: 60 + (i * 13) % 35,
      size: 3 + (i % 4),
      duration: 18 + (i * 2) % 10,
      delay: (i * 0.8) % 8,
      color: i % 3,
    }))
  );

  useEffect(() => {
    // Determine time of day
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      setTimeOfDay('morning');
    } else if (hour >= 12 && hour < 17) {
      setTimeOfDay('afternoon');
    } else if (hour >= 17 && hour < 20) {
      setTimeOfDay('evening');
    } else {
      setTimeOfDay('night');
    }
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const isDay = timeOfDay === 'morning' || timeOfDay === 'afternoon';
  const isEvening = timeOfDay === 'evening';
  const isNight = timeOfDay === 'night';

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleTemplateClick = (templateId: string) => {
    if (onSelectTemplate) {
      onSelectTemplate(templateId);
    } else if (onLaunchVDS) {
      onLaunchVDS();
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const templatesInCategory = selectedCategory ? TEMPLATES[selectedCategory as keyof typeof TEMPLATES] || [] : [];

  return (
    <>
      <style jsx>{`
        .studio-room {
          min-height: 100vh;
          min-height: 100dvh;
          background: linear-gradient(180deg, #1a1625 0%, #231f35 30%, #2a2545 60%, #1e1a30 100%);
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

        .creative-glow {
          background: 
            radial-gradient(ellipse 60% 50% at 20% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 80% 70%, rgba(236, 72, 153, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse 70% 60% at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 60%);
          animation: creativeShift 15s ease-in-out infinite;
        }

        @keyframes creativeShift {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        .grid-overlay {
          background-image: 
            linear-gradient(rgba(139, 119, 183, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 119, 183, 0.02) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        /* ============ ROOM ELEMENTS ============ */
        .room-elements {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: ${isLoaded ? 0.4 : 0};
          transition: opacity 1s ease;
        }

        /* ============ FLOATING PARTICLES ============ */
        .particle {
          position: absolute;
          border-radius: 50%;
          animation: floatParticle linear infinite;
        }

        .particle-purple {
          background: rgba(139, 92, 246, 0.5);
          box-shadow: 0 0 12px rgba(139, 92, 246, 0.3);
        }

        .particle-pink {
          background: rgba(236, 72, 153, 0.4);
          box-shadow: 0 0 12px rgba(236, 72, 153, 0.25);
        }

        .particle-blue {
          background: rgba(99, 102, 241, 0.4);
          box-shadow: 0 0 12px rgba(99, 102, 241, 0.25);
        }

        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% { opacity: 0.6; }
          50% {
            transform: translateY(-25vh) translateX(15px) scale(1.1);
            opacity: 0.4;
          }
          90% { opacity: 0.2; }
          100% {
            transform: translateY(-50vh) translateX(-10px) scale(0.7);
            opacity: 0;
          }
        }

        /* ============ FLOOR ============ */
        .floor {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 30%;
          background: linear-gradient(180deg,
            rgba(30, 26, 48, 0.85) 0%,
            rgba(25, 22, 40, 0.9) 50%,
            rgba(20, 18, 32, 0.95) 100%);
          transform: perspective(800px) rotateX(50deg);
          transform-origin: bottom center;
        }

        .floor-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(139, 119, 183, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 119, 183, 0.06) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        /* ============ WINDOW - SMALLER WITH DAY/NIGHT ============ */
        .window-container {
          position: absolute;
          top: 5%;
          right: 4%;
          width: 16%;
          max-width: 160px;
          height: 38%;
        }

        .window {
          width: 100%;
          height: 100%;
          border: 5px solid rgba(55, 48, 70, 0.95);
          border-radius: 4px;
          box-shadow:
            0 0 30px rgba(0, 0, 0, 0.3),
            0 10px 35px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          position: relative;
        }

        /* Day sky */
        .day-sky {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, 
            rgba(135, 185, 230, 1) 0%, 
            rgba(175, 210, 245, 1) 40%, 
            rgba(220, 235, 250, 1) 100%);
          opacity: ${isDay ? 1 : 0};
          transition: opacity 0.5s ease;
        }

        /* Sun */
        .sun {
          position: absolute;
          top: 18%;
          right: 22%;
          width: 28px;
          height: 28px;
          background: radial-gradient(circle, 
            rgba(255, 255, 240, 1) 0%, 
            rgba(255, 250, 200, 0.9) 40%, 
            rgba(255, 240, 150, 0.4) 70%, 
            transparent 100%);
          border-radius: 50%;
          box-shadow: 0 0 50px rgba(255, 250, 200, 0.6);
          opacity: ${isDay ? 1 : 0};
          transition: opacity 0.5s ease;
        }

        /* Clouds */
        .cloud {
          position: absolute;
          background: rgba(255, 255, 255, 0.85);
          border-radius: 20px;
          opacity: ${isDay ? 1 : 0};
          transition: opacity 0.5s ease;
        }

        .cloud::before, .cloud::after {
          content: '';
          position: absolute;
          background: inherit;
          border-radius: 50%;
        }

        .cloud-1 {
          top: 15%;
          left: 12%;
          width: 30px;
          height: 12px;
        }
        .cloud-1::before { width: 15px; height: 15px; top: -8px; left: 5px; }
        .cloud-1::after { width: 12px; height: 12px; top: -5px; right: 5px; }

        .cloud-2 {
          top: 35%;
          left: 50%;
          width: 25px;
          height: 10px;
        }
        .cloud-2::before { width: 12px; height: 12px; top: -6px; left: 4px; }
        .cloud-2::after { width: 10px; height: 10px; top: -4px; right: 4px; }

        /* Night sky */
        .night-sky {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg,
            rgba(12, 15, 30, 1) 0%,
            rgba(20, 28, 50, 1) 40%,
            rgba(35, 45, 70, 1) 100%);
          opacity: ${isNight ? 1 : 0};
          transition: opacity 0.5s ease;
        }

        /* Crescent Moon */
        .moon {
          position: absolute;
          top: 15%;
          right: 20%;
          width: 24px;
          height: 24px;
          background: transparent;
          border-radius: 50%;
          box-shadow: 8px -2px 0 0 rgba(255, 255, 245, 0.95);
          opacity: ${isNight ? 1 : 0};
          transition: opacity 0.5s ease;
        }

        .moon-glow {
          position: absolute;
          top: 12%;
          right: 15%;
          width: 40px;
          height: 40px;
          background: radial-gradient(circle,
            rgba(255, 255, 245, 0.15) 0%,
            transparent 70%);
          opacity: ${isNight ? 1 : 0};
        }

        /* Stars */
        .star {
          position: absolute;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          opacity: ${isNight ? 1 : 0};
          animation: twinkle 3s ease-in-out infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: ${isNight ? 0.4 : 0}; transform: scale(1); }
          50% { opacity: ${isNight ? 1 : 0}; transform: scale(1.2); }
        }

        /* Shooting Star */
        .shooting-star {
          position: absolute;
          top: 25%;
          left: 15%;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          opacity: ${isNight ? 1 : 0};
          animation: shoot 4s ease-in-out infinite;
        }

        .shooting-star::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 35px;
          height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0.8) 0%, transparent 100%);
          transform: rotate(-35deg);
          transform-origin: left center;
        }

        @keyframes shoot {
          0%, 100% { 
            transform: translate(0, 0); 
            opacity: 0;
          }
          5% {
            opacity: ${isNight ? 1 : 0};
          }
          15% { 
            transform: translate(40px, 25px); 
            opacity: 0;
          }
          16%, 99% {
            opacity: 0;
          }
        }

        /* Window landscape */
        .window-hills {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 30%;
        }

        .window-hill {
          position: absolute;
          bottom: 0;
          border-radius: 50% 50% 0 0;
        }

        .window-hill-1 {
          left: -15%;
          width: 55%;
          height: 70%;
          background: ${isDay 
            ? 'linear-gradient(180deg, rgba(85, 140, 85, 0.9) 0%, rgba(65, 115, 65, 1) 100%)'
            : 'linear-gradient(180deg, rgba(25, 35, 45, 0.95) 0%, rgba(18, 25, 35, 1) 100%)'};
        }

        .window-hill-2 {
          right: -15%;
          width: 60%;
          height: 85%;
          background: ${isDay 
            ? 'linear-gradient(180deg, rgba(75, 130, 75, 0.9) 0%, rgba(55, 105, 55, 1) 100%)'
            : 'linear-gradient(180deg, rgba(20, 30, 40, 0.95) 0%, rgba(15, 22, 32, 1) 100%)'};
        }

        /* Window frame */
        .window-frame-v {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 100%;
          background: linear-gradient(90deg,
            rgba(50, 44, 65, 0.95) 0%,
            rgba(65, 58, 80, 0.98) 50%,
            rgba(50, 44, 65, 0.95) 100%);
          z-index: 5;
        }

        .window-frame-h {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 100%;
          height: 4px;
          background: linear-gradient(180deg,
            rgba(50, 44, 65, 0.95) 0%,
            rgba(65, 58, 80, 0.98) 50%,
            rgba(50, 44, 65, 0.95) 100%);
          z-index: 5;
        }

        .window-sill {
          position: absolute;
          bottom: -8px;
          left: -6px;
          right: -6px;
          height: 10px;
          background: linear-gradient(180deg,
            rgba(60, 52, 75, 0.98) 0%,
            rgba(50, 44, 65, 0.95) 100%);
          border-radius: 0 0 3px 3px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        /* ============ MONA LISA FRAME (Wall Art) - LARGER & ZEN ============ */
        .wall-art {
          position: absolute;
          top: 8%;
          left: 12%;
          width: 130px;
          height: 170px;
        }

        .frame-outer {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg,
            rgba(160, 135, 95, 0.95) 0%,
            rgba(140, 115, 75, 0.98) 25%,
            rgba(125, 100, 60, 0.95) 50%,
            rgba(140, 115, 75, 0.98) 75%,
            rgba(160, 135, 95, 0.95) 100%);
          border-radius: 2px;
          padding: 10px;
          box-shadow: 
            0 10px 40px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(200, 180, 140, 0.3),
            inset 0 -1px 0 rgba(80, 65, 40, 0.3);
        }

        .frame-inner {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg,
            rgba(110, 90, 55, 0.95) 0%,
            rgba(125, 100, 65, 0.98) 50%,
            rgba(110, 90, 55, 0.95) 100%);
          padding: 5px;
          box-shadow: 
            inset 0 2px 5px rgba(0, 0, 0, 0.25),
            inset 0 -1px 2px rgba(160, 140, 100, 0.2);
        }

        .painting-canvas {
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg,
            rgba(58, 48, 35, 1) 0%,
            rgba(52, 42, 30, 1) 20%,
            rgba(65, 55, 40, 1) 40%,
            rgba(48, 38, 28, 1) 70%,
            rgba(42, 32, 24, 1) 100%);
          position: relative;
          overflow: hidden;
        }

        /* Mona Lisa silhouette suggestion */
        .painting-figure {
          position: absolute;
          top: 12%;
          left: 50%;
          transform: translateX(-50%);
          width: 65px;
          height: 95px;
        }

        .figure-head {
          width: 28px;
          height: 34px;
          background: radial-gradient(ellipse at 50% 40%,
            rgba(185, 160, 130, 0.85) 0%,
            rgba(165, 140, 110, 0.8) 60%,
            rgba(145, 120, 90, 0.75) 100%);
          border-radius: 50% 50% 45% 45%;
          margin: 0 auto;
        }

        .figure-hair {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 34px;
          height: 22px;
          background: rgba(32, 24, 18, 0.85);
          border-radius: 50% 50% 40% 40%;
        }

        .figure-body {
          width: 55px;
          height: 60px;
          background: linear-gradient(180deg,
            rgba(42, 35, 26, 0.85) 0%,
            rgba(52, 42, 30, 0.8) 50%,
            rgba(38, 30, 22, 0.85) 100%);
          border-radius: 30% 30% 0 0;
          margin: 2px auto 0;
        }

        .figure-hands {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 42px;
          height: 14px;
          background: rgba(175, 150, 120, 0.65);
          border-radius: 40%;
        }

        /* Painting varnish/age effect */
        .painting-varnish {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 30% 20%, rgba(255, 240, 200, 0.06) 0%, transparent 50%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.08) 0%, transparent 30%, rgba(0, 0, 0, 0.12) 100%);
        }

        /* ============ SCULPTURE - CLASSICAL GREEK/ROMAN ============ */
        .sculpture {
          position: absolute;
          bottom: 9%;
          left: 4%;
        }

        /* Marble Pedestal */
        .pedestal {
          width: 50px;
          height: 70px;
          background: linear-gradient(90deg,
            rgba(165, 160, 155, 0.95) 0%,
            rgba(195, 190, 185, 0.98) 15%,
            rgba(215, 212, 208, 0.99) 30%,
            rgba(205, 200, 195, 0.98) 50%,
            rgba(185, 180, 175, 0.96) 70%,
            rgba(165, 160, 155, 0.95) 85%,
            rgba(150, 145, 140, 0.93) 100%);
          position: relative;
          box-shadow: 
            4px 0 15px rgba(0, 0, 0, 0.2),
            -2px 0 10px rgba(0, 0, 0, 0.1),
            0 8px 25px rgba(0, 0, 0, 0.3);
        }

        /* Pedestal molding top */
        .pedestal-crown {
          position: absolute;
          top: -8px;
          left: -6px;
          right: -6px;
          height: 8px;
          background: linear-gradient(180deg,
            rgba(225, 222, 218, 0.98) 0%,
            rgba(205, 200, 195, 0.95) 50%,
            rgba(185, 180, 175, 0.92) 100%);
          border-radius: 2px 2px 0 0;
          box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
        }

        .pedestal-crown::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 2px;
          right: 2px;
          height: 3px;
          background: linear-gradient(180deg,
            rgba(195, 190, 185, 0.9) 0%,
            rgba(175, 170, 165, 0.85) 100%);
        }

        /* Pedestal base molding */
        .pedestal-base {
          position: absolute;
          bottom: -6px;
          left: -8px;
          right: -8px;
          height: 8px;
          background: linear-gradient(180deg,
            rgba(185, 180, 175, 0.95) 0%,
            rgba(200, 195, 190, 0.98) 50%,
            rgba(175, 170, 165, 0.95) 100%);
          border-radius: 0 0 2px 2px;
        }

        .pedestal-base::before {
          content: '';
          position: absolute;
          top: -4px;
          left: 4px;
          right: 4px;
          height: 4px;
          background: linear-gradient(180deg,
            rgba(175, 170, 165, 0.9) 0%,
            rgba(190, 185, 180, 0.95) 100%);
        }

        /* Classical Female Torso/Venus */
        .torso {
          position: absolute;
          bottom: 70px;
          left: 50%;
          transform: translateX(-50%);
        }

        /* Head */
        .sculpture-head {
          width: 20px;
          height: 24px;
          background: linear-gradient(135deg,
            rgba(235, 232, 228, 0.99) 0%,
            rgba(220, 215, 210, 0.97) 25%,
            rgba(205, 200, 195, 0.95) 50%,
            rgba(190, 185, 180, 0.93) 75%,
            rgba(175, 170, 165, 0.9) 100%);
          border-radius: 50% 50% 45% 45%;
          margin: 0 auto;
          position: relative;
          box-shadow:
            inset 3px 3px 8px rgba(255, 255, 255, 0.3),
            inset -2px -2px 6px rgba(0, 0, 0, 0.08),
            2px 2px 8px rgba(0, 0, 0, 0.1);
        }

        /* Classical hair bun */
        .sculpture-hair {
          position: absolute;
          top: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 22px;
          height: 14px;
          background: linear-gradient(180deg,
            rgba(200, 195, 190, 0.95) 0%,
            rgba(185, 180, 175, 0.9) 100%);
          border-radius: 50% 50% 30% 30%;
        }

        .hair-bun {
          position: absolute;
          top: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 10px;
          background: radial-gradient(ellipse at 50% 60%,
            rgba(210, 205, 200, 0.95) 0%,
            rgba(185, 180, 175, 0.9) 100%);
          border-radius: 50%;
        }

        /* Neck */
        .sculpture-neck {
          width: 10px;
          height: 14px;
          background: linear-gradient(90deg,
            rgba(195, 190, 185, 0.95) 0%,
            rgba(220, 215, 210, 0.98) 40%,
            rgba(210, 205, 200, 0.96) 60%,
            rgba(190, 185, 180, 0.93) 100%);
          margin: 0 auto;
          border-radius: 0 0 20% 20%;
        }

        /* Shoulders and upper torso */
        .sculpture-shoulders {
          width: 42px;
          height: 18px;
          background: linear-gradient(180deg,
            rgba(215, 210, 205, 0.98) 0%,
            rgba(225, 220, 215, 0.97) 30%,
            rgba(210, 205, 200, 0.95) 100%);
          border-radius: 50% 50% 30% 30%;
          margin: -2px auto 0;
          position: relative;
          box-shadow:
            inset 0 5px 10px rgba(255, 255, 255, 0.2),
            0 3px 8px rgba(0, 0, 0, 0.1);
        }

        /* Draped fabric suggestion */
        .sculpture-drape {
          position: absolute;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          width: 38px;
          height: 45px;
          background: linear-gradient(180deg,
            rgba(210, 205, 200, 0.95) 0%,
            rgba(220, 215, 210, 0.97) 20%,
            rgba(200, 195, 190, 0.93) 50%,
            rgba(215, 210, 205, 0.95) 80%,
            rgba(195, 190, 185, 0.9) 100%);
          border-radius: 30% 30% 40% 40%;
          box-shadow:
            inset 4px 0 12px rgba(255, 255, 255, 0.15),
            inset -4px 0 12px rgba(0, 0, 0, 0.08);
        }

        /* Fabric folds */
        .drape-fold {
          position: absolute;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(180, 175, 170, 0.3) 50%,
            transparent 100%);
          border-radius: 50%;
        }

        .fold-1 {
          top: 8px;
          left: 8px;
          width: 4px;
          height: 30px;
          transform: rotate(-5deg);
        }

        .fold-2 {
          top: 10px;
          right: 10px;
          width: 3px;
          height: 25px;
          transform: rotate(8deg);
        }

        .fold-3 {
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 20px;
        }

        /* Broken arm stump (classical style) */
        .arm-stump {
          position: absolute;
          top: 2px;
          width: 8px;
          height: 12px;
          background: linear-gradient(180deg,
            rgba(215, 210, 205, 0.95) 0%,
            rgba(195, 190, 185, 0.9) 100%);
          border-radius: 40%;
        }

        .arm-left {
          left: -4px;
          transform: rotate(-25deg);
        }

        .arm-right {
          right: -4px;
          transform: rotate(25deg);
        }

        /* ============ EASEL - REFINED ============ */
        .easel-container {
          position: absolute;
          bottom: 11%;
          left: 16%;
          width: 100px;
          height: 140px;
        }

        .easel-leg {
          position: absolute;
          bottom: 0;
          width: 4px;
          height: 100px;
          background: linear-gradient(90deg,
            rgba(90, 70, 50, 0.95) 0%,
            rgba(120, 95, 70, 0.98) 30%,
            rgba(105, 82, 60, 0.95) 70%,
            rgba(85, 65, 45, 0.92) 100%);
          border-radius: 1px;
          box-shadow: 1px 0 3px rgba(0, 0, 0, 0.2);
        }

        .easel-leg-left {
          left: 18px;
          transform: rotate(-10deg);
          transform-origin: bottom center;
        }

        .easel-leg-right {
          right: 18px;
          transform: rotate(10deg);
          transform-origin: bottom center;
        }

        .easel-leg-back {
          left: 50%;
          transform: translateX(-50%);
          height: 90px;
          width: 3px;
        }

        .easel-support {
          position: absolute;
          bottom: 45px;
          left: 15px;
          right: 15px;
          height: 3px;
          background: linear-gradient(90deg,
            rgba(95, 75, 55, 0.9) 0%,
            rgba(115, 90, 65, 0.95) 50%,
            rgba(95, 75, 55, 0.9) 100%);
          border-radius: 1px;
        }

        .easel-tray {
          position: absolute;
          bottom: 42px;
          left: 12px;
          right: 12px;
          height: 5px;
          background: linear-gradient(180deg,
            rgba(110, 88, 65, 0.95) 0%,
            rgba(90, 70, 50, 0.9) 100%);
          border-radius: 1px 1px 0 0;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .easel-canvas {
          position: absolute;
          bottom: 48px;
          left: 50%;
          transform: translateX(-50%);
          width: 65px;
          height: 80px;
          background: linear-gradient(180deg,
            rgba(252, 250, 245, 0.96) 0%,
            rgba(248, 245, 238, 0.94) 50%,
            rgba(245, 242, 235, 0.92) 100%);
          border: none;
          box-shadow: 
            0 3px 12px rgba(0, 0, 0, 0.15),
            inset 0 0 20px rgba(0, 0, 0, 0.02);
          position: relative;
        }

        .canvas-edge {
          position: absolute;
          top: 0;
          left: -3px;
          width: 3px;
          height: 100%;
          background: linear-gradient(180deg,
            rgba(235, 230, 220, 0.95) 0%,
            rgba(220, 215, 205, 0.9) 100%);
        }

        .canvas-content {
          position: absolute;
          top: 12%;
          left: 12%;
          right: 12%;
          bottom: 12%;
          background: 
            radial-gradient(ellipse at 40% 30%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 70%, rgba(99, 102, 241, 0.08) 0%, transparent 50%);
          border-radius: 2px;
          animation: canvasShimmer 5s ease-in-out infinite;
        }

        @keyframes canvasShimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.9; }
        }

        /* ============ BRUSHES - REFINED ============ */
        .brushes-container {
          position: absolute;
          bottom: 47px;
          left: 15px;
          display: flex;
          gap: 2px;
        }

        .brush {
          width: 2px;
          border-radius: 1px 1px 2px 2px;
        }

        .brush-handle {
          background: linear-gradient(180deg,
            rgba(160, 130, 100, 0.95) 0%,
            rgba(140, 110, 80, 0.9) 100%);
        }

        .brush-1 {
          height: 18px;
          background: linear-gradient(180deg, 
            rgba(139, 92, 246, 0.9) 0%, 
            rgba(139, 92, 246, 0.9) 25%,
            rgba(160, 130, 100, 0.95) 25%,
            rgba(140, 110, 80, 0.9) 100%);
          transform: rotate(-4deg);
        }

        .brush-2 {
          height: 20px;
          background: linear-gradient(180deg, 
            rgba(236, 72, 153, 0.9) 0%, 
            rgba(236, 72, 153, 0.9) 25%,
            rgba(160, 130, 100, 0.95) 25%,
            rgba(140, 110, 80, 0.9) 100%);
          transform: rotate(2deg);
        }

        .brush-3 {
          height: 16px;
          background: linear-gradient(180deg, 
            rgba(99, 102, 241, 0.9) 0%, 
            rgba(99, 102, 241, 0.9) 25%,
            rgba(160, 130, 100, 0.95) 25%,
            rgba(140, 110, 80, 0.9) 100%);
          transform: rotate(-2deg);
        }

        /* ============ PALETTE - REFINED ============ */
        .palette {
          position: absolute;
          bottom: 9%;
          left: 28%;
          width: 50px;
          height: 35px;
          background: linear-gradient(135deg,
            rgba(195, 175, 145, 0.95) 0%,
            rgba(180, 160, 130, 0.98) 30%,
            rgba(165, 145, 115, 0.95) 70%,
            rgba(175, 155, 125, 0.92) 100%);
          border-radius: 25px 25px 18px 25px;
          box-shadow: 
            0 3px 10px rgba(0, 0, 0, 0.2),
            inset 0 1px 2px rgba(255, 255, 255, 0.2),
            inset 0 -1px 2px rgba(0, 0, 0, 0.1);
          transform: rotate(-12deg);
        }

        .palette-hole {
          position: absolute;
          top: 32%;
          left: 14%;
          width: 9px;
          height: 9px;
          background: rgba(30, 26, 48, 0.85);
          border-radius: 50%;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);
        }

        .paint-blob {
          position: absolute;
          border-radius: 50%;
          box-shadow: 
            inset 0 1px 2px rgba(255, 255, 255, 0.3),
            0 1px 2px rgba(0, 0, 0, 0.15);
        }

        .blob-purple { top: 6px; right: 9px; width: 10px; height: 8px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(120, 75, 220, 0.9) 100%); }
        .blob-pink { top: 16px; right: 5px; width: 8px; height: 7px; background: linear-gradient(135deg, rgba(236, 72, 153, 0.95) 0%, rgba(210, 55, 135, 0.9) 100%); }
        .blob-blue { bottom: 8px; right: 12px; width: 7px; height: 7px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(80, 85, 220, 0.9) 100%); }
        .blob-teal { bottom: 5px; left: 32%; width: 8px; height: 6px; background: linear-gradient(135deg, rgba(20, 184, 166, 0.95) 0%, rgba(15, 160, 145, 0.9) 100%); }

        /* ============ DESK - ARCHITECTURAL PERSPECTIVE ============ */
        .desk-container {
          position: absolute;
          bottom: 5%;
          right: 3%;
          width: 280px;
          height: 180px;
          transform: perspective(800px) rotateY(-8deg);
          transform-style: preserve-3d;
        }

        /* Desk Surface */
        .desk-surface {
          position: absolute;
          bottom: 85px;
          left: 0;
          width: 100%;
          height: 12px;
          background: linear-gradient(180deg,
            rgba(95, 80, 70, 0.95) 0%,
            rgba(75, 62, 55, 0.98) 50%,
            rgba(65, 52, 45, 0.95) 100%);
          border-radius: 3px;
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.4),
            0 -1px 0 rgba(120, 100, 85, 0.3);
          transform: rotateX(75deg);
          transform-origin: bottom center;
        }

        /* Desk Top Surface (the actual top you see) */
        .desk-top-surface {
          position: absolute;
          bottom: 85px;
          left: 0;
          width: 100%;
          height: 55px;
          background: linear-gradient(180deg,
            rgba(85, 70, 62, 0.92) 0%,
            rgba(75, 60, 52, 0.95) 100%);
          border-radius: 2px;
          transform: perspective(400px) rotateX(70deg);
          transform-origin: bottom center;
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.15);
        }

        /* Desk Front Panel */
        .desk-front-panel {
          position: absolute;
          bottom: 12px;
          left: 5px;
          right: 5px;
          height: 72px;
          background: linear-gradient(180deg,
            rgba(70, 58, 50, 0.98) 0%,
            rgba(58, 48, 42, 0.95) 100%);
          border-radius: 2px;
          box-shadow: 
            inset 2px 0 8px rgba(0, 0, 0, 0.2),
            inset -2px 0 8px rgba(0, 0, 0, 0.2),
            0 2px 8px rgba(0, 0, 0, 0.3);
        }

        /* Desk Legs */
        .desk-leg {
          position: absolute;
          bottom: 0;
          width: 8px;
          height: 12px;
          background: linear-gradient(90deg,
            rgba(55, 45, 40, 0.95) 0%,
            rgba(70, 58, 50, 0.98) 50%,
            rgba(55, 45, 40, 0.95) 100%);
          border-radius: 1px;
        }

        .desk-leg-left { left: 15px; }
        .desk-leg-right { right: 15px; }

        /* Drawer Unit (under desk, right side) */
        .drawer-unit {
          position: absolute;
          bottom: 12px;
          right: 15px;
          width: 90px;
          height: 70px;
          background: linear-gradient(180deg,
            rgba(65, 55, 48, 0.98) 0%,
            rgba(55, 45, 40, 0.95) 100%);
          border-radius: 2px;
          box-shadow: 
            inset 1px 0 4px rgba(0, 0, 0, 0.15),
            -2px 0 6px rgba(0, 0, 0, 0.2);
        }

        .drawer {
          position: absolute;
          left: 4px;
          right: 4px;
          height: 20px;
          background: linear-gradient(180deg,
            rgba(75, 62, 55, 0.7) 0%,
            rgba(65, 52, 45, 0.6) 100%);
          border-radius: 2px;
          box-shadow: 
            inset 0 1px 3px rgba(0, 0, 0, 0.2),
            0 1px 0 rgba(100, 85, 75, 0.2);
        }

        .drawer-1 { top: 6px; }
        .drawer-2 { top: 30px; }
        .drawer-3 { bottom: 6px; }

        .drawer-handle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 25px;
          height: 4px;
          background: linear-gradient(180deg,
            rgba(160, 140, 120, 0.8) 0%,
            rgba(130, 110, 95, 0.7) 100%);
          border-radius: 2px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        /* ============ MONITOR - REALISTIC ============ */
        .monitor {
          position: absolute;
          bottom: 100px;
          left: 75px;
        }

        .monitor-frame {
          width: 130px;
          height: 80px;
          background: linear-gradient(180deg,
            rgba(25, 25, 30, 0.99) 0%,
            rgba(35, 35, 42, 0.98) 100%);
          border-radius: 4px;
          padding: 4px;
          box-shadow: 
            0 0 0 2px rgba(45, 45, 55, 0.9),
            0 8px 25px rgba(0, 0, 0, 0.5),
            0 0 40px rgba(139, 92, 246, 0.1);
        }

        .monitor-screen {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg,
            rgba(15, 12, 25, 1) 0%,
            rgba(20, 18, 32, 1) 100%);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }

        .screen-content {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 30% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
            linear-gradient(180deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.05) 100%);
          animation: screenGlow 4s ease-in-out infinite;
        }

        @keyframes screenGlow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        .screen-reflection {
          position: absolute;
          top: 0;
          left: 0;
          right: 50%;
          bottom: 60%;
          background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.03) 0%,
            transparent 100%);
          border-radius: 2px 0 0 0;
        }

        .monitor-chin {
          width: 130px;
          height: 8px;
          background: linear-gradient(180deg,
            rgba(30, 30, 38, 0.98) 0%,
            rgba(25, 25, 32, 0.99) 100%);
          border-radius: 0 0 4px 4px;
        }

        .monitor-stand-neck {
          width: 18px;
          height: 35px;
          background: linear-gradient(90deg,
            rgba(50, 50, 60, 0.95) 0%,
            rgba(65, 65, 75, 0.98) 50%,
            rgba(50, 50, 60, 0.95) 100%);
          margin: 0 auto;
          border-radius: 2px;
        }

        .monitor-stand-base {
          width: 55px;
          height: 6px;
          background: linear-gradient(180deg,
            rgba(55, 55, 65, 0.98) 0%,
            rgba(45, 45, 55, 0.95) 100%);
          margin: 0 auto;
          border-radius: 3px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        /* ============ KEYBOARD ============ */
        .keyboard {
          position: absolute;
          bottom: 92px;
          left: 85px;
          width: 70px;
          height: 22px;
          background: linear-gradient(180deg,
            rgba(45, 45, 55, 0.95) 0%,
            rgba(35, 35, 45, 0.98) 100%);
          border-radius: 3px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transform: perspective(200px) rotateX(15deg);
        }

        .keyboard-keys {
          position: absolute;
          inset: 3px;
          background: repeating-linear-gradient(
            90deg,
            rgba(60, 60, 70, 0.6) 0px,
            rgba(60, 60, 70, 0.6) 4px,
            rgba(40, 40, 50, 0.4) 4px,
            rgba(40, 40, 50, 0.4) 5px
          );
          border-radius: 2px;
        }

        /* ============ MOUSE ============ */
        .mouse {
          position: absolute;
          bottom: 92px;
          left: 165px;
          width: 14px;
          height: 22px;
          background: linear-gradient(180deg,
            rgba(50, 50, 60, 0.98) 0%,
            rgba(40, 40, 50, 0.95) 100%);
          border-radius: 7px 7px 10px 10px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }

        .mouse-wheel {
          position: absolute;
          top: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 6px;
          background: rgba(80, 80, 95, 0.8);
          border-radius: 2px;
        }

        /* ============ COFFEE CUP ============ */
        .coffee-cup {
          position: absolute;
          bottom: 92px;
          left: 195px;
        }

        .cup-body {
          width: 16px;
          height: 18px;
          background: linear-gradient(135deg,
            rgba(220, 200, 180, 0.95) 0%,
            rgba(200, 180, 160, 0.9) 100%);
          border-radius: 2px 2px 4px 4px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        .cup-handle {
          position: absolute;
          top: 4px;
          right: -6px;
          width: 8px;
          height: 10px;
          border: 2px solid rgba(200, 180, 160, 0.9);
          border-left: none;
          border-radius: 0 5px 5px 0;
        }

        .cup-steam {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 10px;
          opacity: 0.4;
        }

        .steam-wisp {
          position: absolute;
          width: 2px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          animation: steamRise 2s ease-out infinite;
        }

        .steam-1 { left: 1px; height: 8px; animation-delay: 0s; }
        .steam-2 { left: 4px; height: 6px; animation-delay: 0.5s; }

        @keyframes steamRise {
          0% { transform: translateY(0) scaleY(1); opacity: 0.4; }
          100% { transform: translateY(-8px) scaleY(0.5); opacity: 0; }
        }

        /* ============ DESK LAMP - ARCHITECTURAL ============ */
        .desk-lamp {
          position: absolute;
          bottom: 92px;
          right: 25px;
        }

        .lamp-shade {
          width: 45px;
          height: 30px;
          background: linear-gradient(180deg,
            rgba(60, 55, 75, 0.95) 0%,
            rgba(50, 45, 65, 0.9) 100%);
          border-radius: 50% 50% 5% 5% / 30% 30% 10% 10%;
          transform: rotate(-20deg);
          box-shadow: 
            0 4px 15px rgba(0, 0, 0, 0.25),
            inset 0 -15px 25px rgba(139, 92, 246, 0.08);
          position: relative;
        }

        .lamp-inner {
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 35px;
          height: 10px;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 50%;
          filter: blur(3px);
        }

        .lamp-light-cone {
          position: absolute;
          bottom: -45px;
          left: 50%;
          transform: translateX(-50%) rotate(20deg);
          width: 0;
          height: 0;
          border-left: 30px solid transparent;
          border-right: 30px solid transparent;
          border-top: 50px solid rgba(139, 92, 246, 0.08);
          filter: blur(8px);
        }

        .lamp-arm-upper {
          width: 4px;
          height: 40px;
          background: linear-gradient(90deg,
            rgba(70, 65, 85, 0.95) 0%,
            rgba(85, 80, 100, 0.98) 50%,
            rgba(70, 65, 85, 0.95) 100%);
          margin: 0 auto;
          transform: rotate(15deg);
          transform-origin: bottom center;
          border-radius: 2px;
        }

        .lamp-arm-joint {
          width: 8px;
          height: 8px;
          background: rgba(90, 85, 105, 0.95);
          border-radius: 50%;
          margin: -2px auto;
        }

        .lamp-arm-lower {
          width: 4px;
          height: 30px;
          background: linear-gradient(90deg,
            rgba(70, 65, 85, 0.95) 0%,
            rgba(85, 80, 100, 0.98) 50%,
            rgba(70, 65, 85, 0.95) 100%);
          margin: 0 auto;
          border-radius: 2px;
        }

        .lamp-base {
          width: 35px;
          height: 8px;
          background: linear-gradient(180deg,
            rgba(65, 60, 80, 0.98) 0%,
            rgba(55, 50, 70, 0.95) 100%);
          margin: 0 auto;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
        }

        /* ============ PLANT - ELEGANT MONSTERA ============ */
        .floor-plant {
          position: absolute;
          bottom: 6%;
          right: 24%;
        }

        /* Ceramic pot with saucer */
        .plant-pot {
          width: 55px;
          height: 50px;
          background: linear-gradient(90deg,
            rgba(55, 50, 45, 0.95) 0%,
            rgba(75, 68, 62, 0.98) 20%,
            rgba(85, 78, 70, 0.98) 40%,
            rgba(75, 68, 62, 0.97) 60%,
            rgba(60, 55, 48, 0.95) 80%,
            rgba(50, 45, 40, 0.93) 100%);
          border-radius: 8% 8% 25% 25%;
          box-shadow: 
            5px 0 15px rgba(0, 0, 0, 0.25),
            -3px 0 10px rgba(0, 0, 0, 0.15),
            0 8px 20px rgba(0, 0, 0, 0.3),
            inset 0 3px 8px rgba(255, 255, 255, 0.08);
          position: relative;
        }

        .pot-rim {
          position: absolute;
          top: -5px;
          left: -3px;
          right: -3px;
          height: 8px;
          background: linear-gradient(90deg,
            rgba(60, 55, 48, 0.95) 0%,
            rgba(80, 72, 65, 0.98) 30%,
            rgba(90, 82, 74, 0.98) 50%,
            rgba(75, 68, 60, 0.97) 70%,
            rgba(55, 50, 45, 0.95) 100%);
          border-radius: 4px 4px 0 0;
          box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
        }

        .pot-saucer {
          position: absolute;
          bottom: -6px;
          left: -8px;
          right: -8px;
          height: 6px;
          background: linear-gradient(90deg,
            rgba(50, 45, 40, 0.9) 0%,
            rgba(70, 62, 55, 0.95) 30%,
            rgba(65, 58, 52, 0.95) 70%,
            rgba(48, 43, 38, 0.9) 100%);
          border-radius: 50%;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
        }

        .pot-soil {
          position: absolute;
          top: 3px;
          left: 6px;
          right: 6px;
          height: 10px;
          background: radial-gradient(ellipse at 50% 100%,
            rgba(45, 35, 28, 0.95) 0%,
            rgba(55, 42, 32, 0.9) 50%,
            rgba(40, 30, 22, 0.85) 100%);
          border-radius: 3px;
        }

        /* Monstera leaves container */
        .plant-leaves {
          position: absolute;
          bottom: 45px;
          left: 50%;
          transform: translateX(-50%);
          width: 90px;
          height: 100px;
        }

        /* Large monstera leaves */
        .monstera-leaf {
          position: absolute;
          border-radius: 50% 50% 45% 45%;
          box-shadow: 
            inset 3px 0 8px rgba(255, 255, 255, 0.08),
            inset -2px 0 6px rgba(0, 0, 0, 0.1),
            2px 3px 8px rgba(0, 0, 0, 0.15);
        }

        /* Main large leaf */
        .leaf-1 {
          width: 35px;
          height: 50px;
          left: 25px;
          bottom: 20px;
          background: linear-gradient(135deg,
            rgba(45, 95, 55, 0.95) 0%,
            rgba(55, 110, 65, 0.98) 30%,
            rgba(50, 100, 58, 0.96) 60%,
            rgba(40, 85, 48, 0.94) 100%);
          transform: rotate(-5deg);
        }

        /* Leaf hole cutouts (monstera style) */
        .leaf-1::before {
          content: '';
          position: absolute;
          top: 35%;
          left: 20%;
          width: 8px;
          height: 12px;
          background: rgba(30, 26, 48, 0.3);
          border-radius: 50%;
        }

        .leaf-1::after {
          content: '';
          position: absolute;
          top: 25%;
          right: 18%;
          width: 6px;
          height: 10px;
          background: rgba(30, 26, 48, 0.3);
          border-radius: 50%;
        }

        /* Second large leaf */
        .leaf-2 {
          width: 32px;
          height: 45px;
          left: 10px;
          bottom: 30px;
          background: linear-gradient(145deg,
            rgba(50, 105, 60, 0.96) 0%,
            rgba(60, 120, 70, 0.98) 40%,
            rgba(48, 98, 55, 0.95) 100%);
          transform: rotate(-25deg);
        }

        .leaf-2::before {
          content: '';
          position: absolute;
          top: 40%;
          left: 25%;
          width: 7px;
          height: 10px;
          background: rgba(30, 26, 48, 0.3);
          border-radius: 50%;
        }

        /* Third leaf */
        .leaf-3 {
          width: 28px;
          height: 40px;
          right: 8px;
          bottom: 35px;
          background: linear-gradient(125deg,
            rgba(42, 88, 50, 0.95) 0%,
            rgba(52, 105, 60, 0.97) 50%,
            rgba(45, 92, 52, 0.94) 100%);
          transform: rotate(20deg);
        }

        .leaf-3::after {
          content: '';
          position: absolute;
          top: 30%;
          left: 30%;
          width: 5px;
          height: 8px;
          background: rgba(30, 26, 48, 0.3);
          border-radius: 50%;
        }

        /* Smaller accent leaves */
        .leaf-4 {
          width: 22px;
          height: 32px;
          left: 0;
          bottom: 45px;
          background: linear-gradient(160deg,
            rgba(55, 115, 65, 0.96) 0%,
            rgba(48, 100, 55, 0.94) 100%);
          transform: rotate(-40deg);
        }

        .leaf-5 {
          width: 20px;
          height: 28px;
          right: 0;
          bottom: 50px;
          background: linear-gradient(120deg,
            rgba(40, 85, 48, 0.94) 0%,
            rgba(50, 100, 58, 0.96) 100%);
          transform: rotate(35deg);
        }

        /* Young unfurling leaf */
        .leaf-6 {
          width: 12px;
          height: 25px;
          left: 38px;
          bottom: 60px;
          background: linear-gradient(180deg,
            rgba(65, 130, 75, 0.97) 0%,
            rgba(55, 115, 65, 0.95) 100%);
          border-radius: 40% 40% 45% 45%;
          transform: rotate(5deg);
        }

        /* Stems */
        .plant-stems {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 50px;
        }

        .stem {
          position: absolute;
          bottom: 0;
          width: 3px;
          background: linear-gradient(180deg,
            rgba(45, 80, 50, 0.95) 0%,
            rgba(55, 95, 60, 0.9) 100%);
          border-radius: 2px;
        }

        .stem-1 { left: 8px; height: 45px; transform: rotate(-3deg); }
        .stem-2 { left: 4px; height: 50px; transform: rotate(-8deg); }
        .stem-3 { left: 12px; height: 48px; transform: rotate(5deg); }

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
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.65);
          font-size: 0.85rem;
          cursor: pointer;
          z-index: 100;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          font-family: inherit;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.1);
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
          padding: calc(env(safe-area-inset-top, 0px) + 70px) 20px 40px;
          opacity: ${isLoaded ? 1 : 0};
          transform: translateY(${isLoaded ? '0' : '20px'});
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .header {
          text-align: center;
          margin-bottom: 24px;
        }

        .title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2rem;
          font-weight: 300;
          color: #ffffff;
          margin-bottom: 8px;
          letter-spacing: 0.02em;
        }

        .subtitle {
          font-size: 0.88rem;
          color: rgba(255, 255, 255, 0.5);
        }

        /* ============ LAUNCH VDS BUTTON ============ */
        .launch-vds {
          padding: 16px 40px;
          border-radius: 50px;
          border: none;
          background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #EC4899 100%);
          color: #fff;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 32px;
          box-shadow: 
            0 5px 30px rgba(139, 92, 246, 0.35),
            0 0 50px rgba(139, 92, 246, 0.1);
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .launch-vds:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 
            0 8px 40px rgba(139, 92, 246, 0.45),
            0 0 70px rgba(139, 92, 246, 0.15);
        }

        /* ============ TABS ============ */
        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }

        .tab {
          padding: 10px 24px;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: transparent;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .tab:hover {
          border-color: rgba(139, 92, 246, 0.4);
          color: rgba(255, 255, 255, 0.85);
        }

        .tab.active {
          background: rgba(139, 92, 246, 0.18);
          border-color: rgba(139, 92, 246, 0.45);
          color: #fff;
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
          border-color: rgba(139, 92, 246, 0.4);
          background: rgba(139, 92, 246, 0.08);
          box-shadow: 0 10px 35px rgba(139, 92, 246, 0.12);
        }

        .category-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 0.95rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.9);
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
          color: rgba(139, 92, 246, 0.6);
        }

        /* ============ TEMPLATE LIST ============ */
        .template-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          max-width: 380px;
          width: 100%;
        }

        .template-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 18px 14px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
        }

        .template-card:hover {
          transform: translateY(-2px);
          border-color: rgba(139, 92, 246, 0.4);
          background: rgba(139, 92, 246, 0.1);
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.12);
        }

        .template-icon {
          width: 40px;
          height: 40px;
          margin: 0 auto 12px;
          border-radius: 10px;
          background: linear-gradient(135deg,
            rgba(139, 92, 246, 0.25) 0%,
            rgba(99, 102, 241, 0.15) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .template-name {
          font-size: 0.88rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 4px;
        }

        .template-description {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.45);
        }

        .back-to-categories {
          background: none;
          border: none;
          color: rgba(139, 92, 246, 0.6);
          font-size: 0.8rem;
          cursor: pointer;
          margin-bottom: 20px;
          font-family: inherit;
          transition: color 0.3s ease;
        }

        .back-to-categories:hover {
          color: rgba(139, 92, 246, 0.9);
        }

        .section-header {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.3rem;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 20px;
          text-align: center;
        }

        /* ============ PROJECTS ============ */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          max-width: 380px;
          width: 100%;
        }

        .project-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .project-card:hover {
          transform: translateY(-2px);
          border-color: rgba(139, 92, 246, 0.35);
          background: rgba(139, 92, 246, 0.06);
        }

        .project-thumbnail {
          width: 100%;
          height: 70px;
          background: linear-gradient(135deg,
            rgba(139, 92, 246, 0.15) 0%,
            rgba(99, 102, 241, 0.1) 100%);
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .project-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 4px;
        }

        .project-date {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.35);
        }

        .empty-projects {
          text-align: center;
          padding: 50px 20px;
          color: rgba(255, 255, 255, 0.35);
        }

        .empty-icon {
          width: 50px;
          height: 50px;
          margin: 0 auto 16px;
          border: 2px dashed rgba(255, 255, 255, 0.15);
          border-radius: 10px;
        }

        /* ============ RESPONSIVE ============ */
        @media (max-width: 768px) {
          .room-elements { opacity: ${isLoaded ? 0.25 : 0}; }
          .wall-art { left: 3%; top: 3%; transform: scale(0.45); }
          .sculpture { left: 1%; transform: scale(0.4); }
          .easel-container { left: 5%; transform: scale(0.4); }
          .palette { left: 12%; transform: scale(0.4) rotate(-12deg); }
          .floor-plant { right: 28%; transform: scale(0.4); }
          .desk-container { right: 1%; transform: perspective(800px) rotateY(-8deg) scale(0.35); transform-origin: bottom right; }
        }

        @media (max-width: 480px) {
          .room-elements { opacity: ${isLoaded ? 0.12 : 0}; }
          .wall-art, .sculpture, .easel-container, .palette { display: none; }
          .desk-container { right: 0%; transform: perspective(800px) rotateY(-8deg) scale(0.25); transform-origin: bottom right; }
          .floor-plant { right: 45%; bottom: 3%; transform: scale(0.28); }
          .title { font-size: 1.5rem; }
          .launch-vds { padding: 12px 26px; font-size: 0.82rem; }
          .category-grid { grid-template-columns: 1fr; gap: 8px; }
          .template-list { grid-template-columns: 1fr; }
          .projects-grid { grid-template-columns: 1fr; }
          .category-card { padding: 14px 12px; }
        }
      `}</style>

      <div className="studio-room">
        {/* Ambient Layers */}
        <div className="ambient-layer creative-glow" />
        <div className="ambient-layer grid-overlay" />

        {/* Room Elements */}
        <div className="room-elements">
          {/* Floating Particles */}
          {particles.map((p) => (
            <div
              key={p.id}
              className={`particle ${p.color === 0 ? 'particle-purple' : p.color === 1 ? 'particle-pink' : 'particle-blue'}`}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}

          <div className="floor"><div className="floor-grid" /></div>

          {/* Wall Art - Mona Lisa */}
          <div className="wall-art">
            <div className="frame-outer">
              <div className="frame-inner">
                <div className="painting-canvas">
                  <div className="painting-figure">
                    <div className="figure-hair" />
                    <div className="figure-head" />
                    <div className="figure-body" />
                    <div className="figure-hands" />
                  </div>
                  <div className="painting-varnish" />
                </div>
              </div>
            </div>
          </div>

          {/* Sculpture - Classical Venus/Torso */}
          <div className="sculpture">
            <div className="torso">
              <div className="sculpture-hair">
                <div className="hair-bun" />
              </div>
              <div className="sculpture-head" />
              <div className="sculpture-neck" />
              <div className="sculpture-shoulders">
                <div className="arm-stump arm-left" />
                <div className="arm-stump arm-right" />
                <div className="sculpture-drape">
                  <div className="drape-fold fold-1" />
                  <div className="drape-fold fold-2" />
                  <div className="drape-fold fold-3" />
                </div>
              </div>
            </div>
            <div className="pedestal">
              <div className="pedestal-crown" />
              <div className="pedestal-base" />
            </div>
          </div>

          {/* Window with Day/Night View */}
          <div className="window-container">
            <div className="window">
              {/* Day elements */}
              <div className="day-sky" />
              <div className="sun" />
              <div className="cloud cloud-1" />
              <div className="cloud cloud-2" />
              
              {/* Night elements */}
              <div className="night-sky" />
              <div className="moon-glow" />
              <div className="moon" />
              <div className="shooting-star" />
              {/* Stars */}
              <div className="star" style={{ top: '12%', left: '18%', width: '2px', height: '2px' }} />
              <div className="star" style={{ top: '25%', left: '65%', width: '1.5px', height: '1.5px', animationDelay: '0.5s' }} />
              <div className="star" style={{ top: '18%', left: '40%', width: '1px', height: '1px', animationDelay: '1s' }} />
              <div className="star" style={{ top: '35%', left: '25%', width: '1.5px', height: '1.5px', animationDelay: '1.5s' }} />
              <div className="star" style={{ top: '8%', left: '75%', width: '2px', height: '2px', animationDelay: '2s' }} />
              <div className="star" style={{ top: '42%', left: '55%', width: '1px', height: '1px', animationDelay: '0.8s' }} />
              
              {/* Hills */}
              <div className="window-hills">
                <div className="window-hill window-hill-1" />
                <div className="window-hill window-hill-2" />
              </div>
              
              {/* Frame */}
              <div className="window-frame-v" />
              <div className="window-frame-h" />
            </div>
            <div className="window-sill" />
          </div>

          {/* Easel */}
          <div className="easel-container">
            <div className="easel-leg easel-leg-left" />
            <div className="easel-leg easel-leg-right" />
            <div className="easel-leg easel-leg-back" />
            <div className="easel-support" />
            <div className="easel-tray">
              <div className="brushes-container">
                <div className="brush brush-1" />
                <div className="brush brush-2" />
                <div className="brush brush-3" />
              </div>
            </div>
            <div className="easel-canvas">
              <div className="canvas-edge" />
              <div className="canvas-content" />
            </div>
          </div>

          {/* Palette */}
          <div className="palette">
            <div className="palette-hole" />
            <div className="paint-blob blob-purple" />
            <div className="paint-blob blob-pink" />
            <div className="paint-blob blob-blue" />
            <div className="paint-blob blob-teal" />
          </div>

          {/* Plant - Elegant Monstera */}
          <div className="floor-plant">
            <div className="plant-leaves">
              <div className="plant-stems">
                <div className="stem stem-1" />
                <div className="stem stem-2" />
                <div className="stem stem-3" />
              </div>
              <div className="monstera-leaf leaf-1" />
              <div className="monstera-leaf leaf-2" />
              <div className="monstera-leaf leaf-3" />
              <div className="monstera-leaf leaf-4" />
              <div className="monstera-leaf leaf-5" />
              <div className="monstera-leaf leaf-6" />
            </div>
            <div className="plant-pot">
              <div className="pot-rim" />
              <div className="pot-soil" />
              <div className="pot-saucer" />
            </div>
          </div>

          {/* Desk - Architectural */}
          <div className="desk-container">
            {/* Monitor */}
            <div className="monitor">
              <div className="monitor-frame">
                <div className="monitor-screen">
                  <div className="screen-content" />
                  <div className="screen-reflection" />
                </div>
              </div>
              <div className="monitor-chin" />
              <div className="monitor-stand-neck" />
              <div className="monitor-stand-base" />
            </div>

            {/* Keyboard */}
            <div className="keyboard">
              <div className="keyboard-keys" />
            </div>

            {/* Mouse */}
            <div className="mouse">
              <div className="mouse-wheel" />
            </div>

            {/* Coffee Cup */}
            <div className="coffee-cup">
              <div className="cup-body" />
              <div className="cup-handle" />
              <div className="cup-steam">
                <div className="steam-wisp steam-1" />
                <div className="steam-wisp steam-2" />
              </div>
            </div>

            {/* Lamp */}
            <div className="desk-lamp">
              <div className="lamp-shade">
                <div className="lamp-inner" />
                <div className="lamp-light-cone" />
              </div>
              <div className="lamp-arm-upper" />
              <div className="lamp-arm-joint" />
              <div className="lamp-arm-lower" />
              <div className="lamp-base" />
            </div>

            {/* Desk Structure */}
            <div className="desk-top-surface" />
            <div className="desk-surface" />
            <div className="desk-front-panel" />
            <div className="drawer-unit">
              <div className="drawer drawer-1"><div className="drawer-handle" /></div>
              <div className="drawer drawer-2"><div className="drawer-handle" /></div>
              <div className="drawer drawer-3"><div className="drawer-handle" /></div>
            </div>
            <div className="desk-leg desk-leg-left" />
            <div className="desk-leg desk-leg-right" />
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
            <h1 className="title">Design Studio</h1>
            <p className="subtitle">Create your perfect sanctuary</p>
          </div>

          <button className="launch-vds" onClick={onLaunchVDS}>
            Open Virtual Design Studio
          </button>

          <div className="tabs">
            <button className={`tab ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>
              Templates
            </button>
            <button className={`tab ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
              My Projects
            </button>
          </div>

          {/* Templates - Categories */}
          {activeTab === 'create' && !selectedCategory && (
            <div className="category-grid">
              {TEMPLATE_CATEGORIES.map((category) => (
                <div key={category.id} className="category-card" onClick={() => handleCategoryClick(category.id)}>
                  <h3 className="category-title">{category.title}</h3>
                  <p className="category-description">{category.description}</p>
                  <span className="category-count">{category.count} options</span>
                </div>
              ))}
            </div>
          )}

          {/* Templates - List */}
          {activeTab === 'create' && selectedCategory && (
            <>
              <button className="back-to-categories" onClick={handleBackToCategories}>
                ← Back
              </button>
              <h2 className="section-header">
                {TEMPLATE_CATEGORIES.find(c => c.id === selectedCategory)?.title}
              </h2>
              <div className="template-list">
                {templatesInCategory.map((template) => (
                  <div key={template.id} className="template-card" onClick={() => handleTemplateClick(template.id)}>
                    <div className="template-icon" />
                    <div className="template-name">{template.name}</div>
                    <div className="template-description">{template.description}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Projects */}
          {activeTab === 'projects' && (
            <>
              {savedProjects.length > 0 ? (
                <div className="projects-grid">
                  {savedProjects.map((project) => (
                    <div key={project.id} className="project-card" onClick={() => onOpenProject?.(project.id)}>
                      <div className="project-thumbnail" />
                      <div className="project-name">{project.name}</div>
                      <div className="project-date">{project.lastEdited}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-projects">
                  <div className="empty-icon" />
                  <div>No sanctuaries created yet</div>
                  <div style={{ marginTop: '8px', fontSize: '0.8rem' }}>
                    Start with a template above
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}