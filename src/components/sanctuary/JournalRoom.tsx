'use client';

import { useState, useEffect, useRef } from 'react';

interface JournalRoomProps {
  onBack: () => void;
  onSaveEntry?: (entry: { title: string; content: string; mood?: string; date: string }) => void;
  savedEntries?: Array<{
    id: string;
    title: string;
    preview: string;
    date: string;
    mood?: string;
  }>;
}

const PROMPTS = [
  "What's weighing on your mind right now?",
  "Describe a moment today that made you feel something.",
  "What would you tell your younger self?",
  "What are you grateful for in this moment?",
  "What's something you need to let go of?",
  "How does your body feel right now?",
  "What would make tomorrow better than today?",
  "Write a letter to someone you can't talk to.",
];

const MOODS = [
  { id: 'calm', label: 'Calm', color: '#6EE7B7' },
  { id: 'anxious', label: 'Anxious', color: '#FCD34D' },
  { id: 'sad', label: 'Sad', color: '#93C5FD' },
  { id: 'grateful', label: 'Grateful', color: '#C4B5FD' },
  { id: 'hopeful', label: 'Hopeful', color: '#FDA4AF' },
  { id: 'tired', label: 'Tired', color: '#D1D5DB' },
];

export default function JournalRoom({ onBack, onSaveEntry, savedEntries = [] }: JournalRoomProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'entries'>('write');
  const [journalContent, setJournalContent] = useState('');
  const [journalTitle, setJournalTitle] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Deterministic particles
  const [particles] = useState(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: 8 + (i * 23) % 85,
      size: 2 + (i % 3),
      duration: 12 + (i * 2) % 8,
      delay: (i * 0.7) % 6,
    }))
  );

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleNewPrompt = () => {
    setCurrentPrompt((prev) => (prev + 1) % PROMPTS.length);
  };

  const handleUsePrompt = () => {
    if (journalContent) {
      setJournalContent(journalContent + '\n\n' + PROMPTS[currentPrompt] + '\n');
    } else {
      setJournalContent(PROMPTS[currentPrompt] + '\n\n');
    }
    textareaRef.current?.focus();
  };

  const handleSave = async () => {
    if (!journalContent.trim()) return;
    
    setIsSaving(true);
    
    const entry = {
      title: journalTitle || new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      content: journalContent,
      mood: selectedMood || undefined,
      date: new Date().toISOString(),
    };

    if (onSaveEntry) {
      await onSaveEntry(entry);
    }

    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
    
    setJournalContent('');
    setJournalTitle('');
    setSelectedMood(null);
  };

  const wordCount = journalContent.trim() ? journalContent.trim().split(/\s+/).length : 0;

  return (
    <>
      <style jsx>{`
        .journal-room {
          min-height: 100vh;
          min-height: 100dvh;
          background: linear-gradient(180deg, 
            #1a1815 0%, 
            #1e1b16 20%,
            #242018 50%, 
            #1f1c17 100%);
          position: relative;
          overflow: hidden;
        }

        /* ============ ROOM ELEMENTS CONTAINER ============ */
        .room-elements {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: ${isLoaded ? 0.4 : 0};
          transition: opacity 1.2s ease;
        }

        /* ============ AMBIENT LIGHTING ============ */
        .ambient-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .warm-glow {
          background: 
            radial-gradient(ellipse 45% 45% at 8% 85%, rgba(255, 170, 90, 0.18) 0%, transparent 50%),
            radial-gradient(ellipse 35% 35% at 10% 82%, rgba(255, 140, 60, 0.12) 0%, transparent 40%);
          animation: candleFlicker 4s ease-in-out infinite;
        }

        @keyframes candleFlicker {
          0%, 100% { opacity: 0.85; }
          25% { opacity: 1; }
          50% { opacity: 0.8; }
          75% { opacity: 0.95; }
        }

        .window-light {
          background: 
            radial-gradient(ellipse 50% 60% at 85% 25%, rgba(180, 190, 210, 0.1) 0%, transparent 60%),
            linear-gradient(135deg, transparent 50%, rgba(160, 170, 195, 0.03) 100%);
        }

        /* ============ DUST PARTICLES ============ */
        .dust {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 235, 205, 0.5);
          box-shadow: 0 0 4px rgba(255, 235, 205, 0.25);
          animation: dustFloat linear infinite;
        }

        @keyframes dustFloat {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 0.7; transform: translateY(80vh) scale(1); }
          90% { opacity: 0.4; }
          100% { transform: translateY(-10vh) scale(0.5); opacity: 0; }
        }

        /* ============ FLOOR ============ */
        .floor {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 32%;
          background: linear-gradient(180deg,
            rgba(45, 38, 30, 0.95) 0%,
            rgba(35, 30, 24, 1) 50%,
            rgba(28, 24, 20, 1) 100%);
        }

        .floor-boards {
          position: absolute;
          inset: 0;
          background-image: 
            repeating-linear-gradient(90deg,
              transparent 0px,
              transparent 120px,
              rgba(0, 0, 0, 0.08) 120px,
              rgba(0, 0, 0, 0.08) 122px);
        }

        /* ============ LARGE WINDOW WITH NIGHT VIEW ============ */
        /* ============ WINDOW - SMALLER NIGHT VIEW ============ */
        .window-container {
          position: absolute;
          top: 6%;
          right: 5%;
          width: 14%;
          max-width: 140px;
          height: 35%;
        }

        .window {
          width: 100%;
          height: 100%;
          border: 6px solid rgba(65, 52, 40, 0.95);
          border-radius: 5px;
          box-shadow:
            0 0 40px rgba(0, 0, 0, 0.35),
            0 12px 45px rgba(0, 0, 0, 0.3),
            inset 0 0 60px rgba(140, 160, 200, 0.06);
          overflow: hidden;
          position: relative;
        }

        /* Night sky */
        .night-sky {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg,
            rgba(12, 18, 32, 1) 0%,
            rgba(18, 28, 48, 1) 30%,
            rgba(25, 38, 62, 1) 60%,
            rgba(35, 50, 75, 1) 100%);
        }

        /* Moon */
        .moon {
          position: absolute;
          top: 15%;
          right: 20%;
          width: 45px;
          height: 45px;
          background: radial-gradient(circle at 35% 35%,
            rgba(255, 255, 248, 1) 0%,
            rgba(245, 245, 238, 0.95) 40%,
            rgba(230, 230, 220, 0.9) 100%);
          border-radius: 50%;
          box-shadow: 
            0 0 40px rgba(255, 255, 245, 0.5),
            0 0 80px rgba(255, 255, 245, 0.3),
            0 0 120px rgba(255, 255, 245, 0.15);
        }

        /* Stars */
        .star {
          position: absolute;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          animation: twinkle 3s ease-in-out infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        /* Night landscape */
        .night-hills {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 35%;
        }

        .hill {
          position: absolute;
          bottom: 0;
          border-radius: 50% 50% 0 0;
          background: linear-gradient(180deg,
            rgba(25, 35, 50, 0.95) 0%,
            rgba(18, 25, 38, 1) 100%);
        }

        .hill-1 { left: -10%; width: 50%; height: 70%; }
        .hill-2 { left: 25%; width: 55%; height: 85%; }
        .hill-3 { right: -10%; width: 48%; height: 60%; }

        /* Distant trees silhouette */
        .tree-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 25%;
          background: 
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 30'%3E%3Cpath d='M0,30 L5,30 L5,20 L3,20 L5,15 L2,15 L6,8 L10,15 L7,15 L9,20 L7,20 L7,30 L15,30 L15,22 L12,22 L17,10 L22,22 L19,22 L19,30 L25,30 L25,25 L23,25 L26,18 L29,25 L27,25 L27,30 L100,30 Z' fill='rgba(15,22,35,0.9)'/%3E%3C/svg%3E") repeat-x bottom;
          background-size: 80px 30px;
        }

        /* Window frame */
        .window-frame-v {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 100%;
          background: linear-gradient(90deg,
            rgba(55, 44, 35, 0.95) 0%,
            rgba(75, 60, 48, 0.98) 50%,
            rgba(55, 44, 35, 0.95) 100%);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          z-index: 5;
        }

        .window-frame-h {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 100%;
          height: 6px;
          background: linear-gradient(180deg,
            rgba(55, 44, 35, 0.95) 0%,
            rgba(75, 60, 48, 0.98) 50%,
            rgba(55, 44, 35, 0.95) 100%);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          z-index: 5;
        }

        .window-sill {
          position: absolute;
          bottom: -12px;
          left: -10px;
          right: -10px;
          height: 14px;
          background: linear-gradient(180deg,
            rgba(70, 56, 45, 0.98) 0%,
            rgba(55, 44, 35, 0.95) 100%);
          border-radius: 0 0 4px 4px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
        }

        /* ============ BOOKSHELF - LEFT SIDE ============ */
        .bookshelf {
          position: absolute;
          left: 0;
          top: 8%;
          width: 7%;
          max-width: 70px;
          height: 52%;
          background: linear-gradient(90deg,
            rgba(55, 44, 35, 0.98) 0%,
            rgba(65, 52, 42, 0.95) 80%,
            rgba(55, 44, 35, 0.9) 100%);
          border-radius: 0 4px 4px 0;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
        }

        .shelf {
          position: absolute;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(180deg,
            rgba(80, 65, 52, 1) 0%,
            rgba(60, 48, 38, 1) 100%);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
        }

        .books-row {
          position: absolute;
          bottom: 6px;
          left: 6px;
          right: 6px;
          display: flex;
          gap: 2px;
          align-items: flex-end;
        }

        .book {
          border-radius: 1px 2px 0 0;
          box-shadow: 1px 0 2px rgba(0, 0, 0, 0.2);
        }

        /* ============ WRITING DESK - CENTERED BOTTOM ============ */
        .desk-area {
          position: absolute;
          bottom: 8%;
          left: 50%;
          transform: translateX(-50%);
          width: 320px;
        }

        .desk-surface {
          position: relative;
          width: 100%;
          height: 18px;
          background: linear-gradient(180deg,
            rgba(95, 75, 58, 1) 0%,
            rgba(80, 62, 48, 1) 100%);
          border-radius: 4px 4px 0 0;
          box-shadow:
            0 -4px 20px rgba(0, 0, 0, 0.2),
            0 8px 35px rgba(0, 0, 0, 0.35),
            inset 0 2px 6px rgba(120, 100, 80, 0.15);
        }

        .desk-front {
          width: 100%;
          height: 70px;
          background: linear-gradient(180deg,
            rgba(85, 68, 52, 1) 0%,
            rgba(70, 55, 42, 1) 100%);
          border-radius: 0 0 4px 4px;
        }

        .desk-drawer {
          position: absolute;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          width: 55%;
          height: 38px;
          background: linear-gradient(180deg,
            rgba(95, 78, 62, 0.6) 0%,
            rgba(80, 65, 50, 0.5) 100%);
          border-radius: 3px;
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .drawer-handle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 35px;
          height: 6px;
          background: linear-gradient(180deg,
            rgba(150, 130, 105, 0.9) 0%,
            rgba(120, 100, 80, 0.85) 100%);
          border-radius: 3px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .desk-leg {
          position: absolute;
          bottom: -55px;
          width: 14px;
          height: 55px;
          background: linear-gradient(90deg,
            rgba(60, 48, 38, 1) 0%,
            rgba(75, 60, 48, 1) 50%,
            rgba(60, 48, 38, 1) 100%);
          border-radius: 2px;
        }

        .desk-leg-left { left: 25px; }
        .desk-leg-right { right: 25px; }

        /* ============ DESK ITEMS ============ */
        .desk-items {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          height: 120px;
        }

        /* Open Journal Book */
        .journal-book {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
          height: 105px;
        }

        .journal-page-left, .journal-page-right {
          position: absolute;
          top: 0;
          width: 50%;
          height: 100%;
          border-radius: 3px;
        }

        .journal-page-left {
          left: 0;
          background: linear-gradient(90deg,
            rgba(255, 252, 245, 0.95) 0%,
            rgba(252, 250, 242, 0.98) 100%);
          border-radius: 3px 0 0 3px;
          box-shadow: 
            inset 6px 0 18px rgba(0, 0, 0, 0.04),
            -3px 0 10px rgba(0, 0, 0, 0.12);
          transform: rotateY(4deg);
          transform-origin: right center;
        }

        .journal-page-right {
          right: 0;
          background: linear-gradient(90deg,
            rgba(252, 250, 242, 0.98) 0%,
            rgba(255, 252, 245, 0.95) 100%);
          border-radius: 0 3px 3px 0;
          box-shadow: 
            inset -6px 0 18px rgba(0, 0, 0, 0.04),
            3px 0 10px rgba(0, 0, 0, 0.12);
          transform: rotateY(-4deg);
          transform-origin: left center;
        }

        .page-lines {
          position: absolute;
          top: 14%;
          left: 12%;
          right: 12%;
          bottom: 14%;
        }

        .page-line {
          height: 1px;
          background: rgba(175, 165, 150, 0.25);
          margin-bottom: 9px;
        }

        .journal-spine {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: -2px;
          bottom: -2px;
          width: 10px;
          background: linear-gradient(90deg,
            rgba(100, 78, 58, 0.9) 0%,
            rgba(120, 95, 72, 1) 50%,
            rgba(100, 78, 58, 0.9) 100%);
          border-radius: 2px;
          box-shadow: 0 0 12px rgba(0, 0, 0, 0.35);
        }

        /* Candle - Left side of desk */
        .candle-container {
          position: absolute;
          bottom: 0;
          left: 25px;
        }

        .candle-holder {
          width: 38px;
          height: 14px;
          background: linear-gradient(180deg,
            rgba(170, 150, 120, 1) 0%,
            rgba(140, 118, 92, 1) 100%);
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.28);
        }

        .candle {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 45px;
          background: linear-gradient(180deg,
            rgba(255, 252, 245, 0.96) 0%,
            rgba(248, 242, 230, 0.92) 100%);
          border-radius: 2px 2px 4px 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
        }

        .candle-drip {
          position: absolute;
          width: 5px;
          background: linear-gradient(180deg,
            rgba(255, 252, 245, 0.95) 0%,
            rgba(248, 242, 230, 0.9) 100%);
          border-radius: 0 0 3px 3px;
        }

        .drip-1 { top: 6px; left: 2px; height: 12px; }
        .drip-2 { top: 4px; right: 2px; height: 16px; }

        .wick {
          position: absolute;
          top: -7px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 7px;
          background: #2a2a2a;
          border-radius: 1px;
        }

        .flame-container {
          position: absolute;
          top: -32px;
          left: 50%;
          transform: translateX(-50%);
        }

        .flame {
          width: 12px;
          height: 22px;
          background: radial-gradient(ellipse at bottom,
            rgba(255, 255, 235, 1) 0%,
            rgba(255, 220, 130, 0.95) 20%,
            rgba(255, 175, 85, 0.8) 40%,
            rgba(255, 130, 55, 0.5) 60%,
            transparent 100%);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          animation: flameFlicker 0.4s ease-in-out infinite alternate;
        }

        .flame-inner {
          position: absolute;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
          width: 5px;
          height: 11px;
          background: radial-gradient(ellipse at bottom,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 210, 0.8) 50%,
            transparent 100%);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        }

        @keyframes flameFlicker {
          0% { transform: scaleY(1) rotate(-1deg); }
          100% { transform: scaleY(1.08) rotate(1deg); }
        }

        .candle-glow {
          position: absolute;
          top: -55px;
          left: 50%;
          transform: translateX(-50%);
          width: 110px;
          height: 90px;
          background: radial-gradient(ellipse,
            rgba(255, 175, 95, 0.22) 0%,
            rgba(255, 145, 75, 0.12) 40%,
            transparent 70%);
          animation: glowPulse 3s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.8; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.1); }
        }

        /* Ink Pot & Quill - Right side */
        .ink-quill-container {
          position: absolute;
          bottom: 8px;
          right: 30px;
        }

        .ink-pot {
          width: 24px;
          height: 30px;
          background: linear-gradient(180deg,
            rgba(28, 28, 38, 1) 0%,
            rgba(18, 18, 25, 1) 100%);
          border-radius: 4px 4px 6px 6px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
          position: relative;
        }

        .ink-pot-neck {
          position: absolute;
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 7px;
          background: linear-gradient(180deg,
            rgba(38, 38, 48, 1) 0%,
            rgba(28, 28, 38, 1) 100%);
          border-radius: 2px 2px 0 0;
        }

        .ink-shine {
          position: absolute;
          top: 9px;
          left: 4px;
          width: 6px;
          height: 11px;
          background: linear-gradient(180deg,
            rgba(255, 255, 255, 0.12) 0%,
            transparent 100%);
          border-radius: 2px;
        }

        .quill {
          position: absolute;
          bottom: 25px;
          right: -15px;
          width: 55px;
          height: 10px;
          transform: rotate(-40deg);
        }

        .quill-feather {
          position: absolute;
          right: 0;
          width: 38px;
          height: 100%;
          background: linear-gradient(180deg,
            rgba(248, 242, 232, 0.95) 0%,
            rgba(225, 215, 200, 0.9) 50%,
            rgba(205, 195, 180, 0.85) 100%);
          border-radius: 0 50% 50% 0;
          clip-path: polygon(0 50%, 100% 0, 100% 100%);
        }

        .quill-shaft {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 22px;
          height: 3px;
          background: linear-gradient(90deg,
            rgba(55, 45, 35, 1) 0%,
            rgba(75, 62, 48, 1) 100%);
          border-radius: 1px;
        }

        .quill-tip {
          position: absolute;
          left: -6px;
          top: 50%;
          transform: translateY(-50%);
          width: 9px;
          height: 3px;
          background: linear-gradient(90deg,
            rgba(35, 30, 25, 1) 0%,
            rgba(55, 45, 35, 1) 100%);
          clip-path: polygon(0 50%, 100% 0, 100% 100%);
        }

        /* ============ FLOOR PLANT - RIGHT SIDE ============ */
        .floor-plant {
          position: absolute;
          bottom: 6%;
          right: 8%;
        }

        .plant-pot {
          width: 50px;
          height: 48px;
          background: linear-gradient(90deg,
            rgba(75, 60, 48, 0.95) 0%,
            rgba(95, 78, 62, 0.98) 25%,
            rgba(88, 72, 58, 0.97) 50%,
            rgba(78, 62, 50, 0.96) 75%,
            rgba(68, 55, 44, 0.95) 100%);
          border-radius: 4px 4px 12px 12px;
          box-shadow: 
            4px 0 15px rgba(0, 0, 0, 0.2),
            0 6px 20px rgba(0, 0, 0, 0.28);
          position: relative;
        }

        .pot-rim {
          position: absolute;
          top: -5px;
          left: -3px;
          right: -3px;
          height: 7px;
          background: linear-gradient(90deg,
            rgba(80, 65, 52, 0.95) 0%,
            rgba(100, 82, 65, 0.98) 50%,
            rgba(80, 65, 52, 0.95) 100%);
          border-radius: 4px 4px 0 0;
        }

        .plant-leaves {
          position: absolute;
          bottom: 44px;
          left: 50%;
          transform: translateX(-50%);
        }

        .fern-leaf {
          position: absolute;
          width: 4px;
          background: linear-gradient(180deg,
            rgba(65, 120, 75, 0.95) 0%,
            rgba(50, 100, 58, 0.9) 100%);
          border-radius: 2px;
          transform-origin: bottom center;
        }

        .fern-1 { height: 55px; left: -18px; transform: rotate(-28deg); }
        .fern-2 { height: 70px; left: -8px; transform: rotate(-12deg); }
        .fern-3 { height: 75px; left: 0; transform: rotate(3deg); }
        .fern-4 { height: 68px; left: 8px; transform: rotate(15deg); }
        .fern-5 { height: 52px; left: 16px; transform: rotate(30deg); }

        /* ============ COZY RUG ============ */
        .rug {
          position: absolute;
          bottom: 2%;
          left: 50%;
          transform: translateX(-50%);
          width: 380px;
          height: 45px;
          background: linear-gradient(90deg,
            rgba(85, 55, 45, 0.6) 0%,
            rgba(95, 62, 50, 0.65) 20%,
            rgba(100, 68, 55, 0.7) 50%,
            rgba(95, 62, 50, 0.65) 80%,
            rgba(85, 55, 45, 0.6) 100%);
          border-radius: 3px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
        }

        .rug-pattern {
          position: absolute;
          inset: 8px 15px;
          border: 1px solid rgba(120, 90, 70, 0.3);
          border-radius: 2px;
        }

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
          background: rgba(255, 250, 240, 0.06);
          border: 1px solid rgba(255, 250, 240, 0.1);
          color: rgba(255, 250, 240, 0.65);
          font-size: 0.85rem;
          cursor: pointer;
          z-index: 100;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .back-button:hover {
          background: rgba(255, 250, 240, 0.1);
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
          color: rgba(255, 250, 240, 0.95);
          margin-bottom: 8px;
          letter-spacing: 0.02em;
        }

        .subtitle {
          font-size: 0.92rem;
          color: rgba(255, 250, 240, 0.45);
        }

        /* Tabs */
        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 24px;
        }

        .tab {
          padding: 12px 28px;
          border-radius: 50px;
          border: 1px solid rgba(255, 250, 240, 0.1);
          background: transparent;
          color: rgba(255, 250, 240, 0.55);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .tab:hover {
          border-color: rgba(255, 200, 150, 0.35);
          color: rgba(255, 250, 240, 0.85);
        }

        .tab.active {
          background: rgba(255, 200, 150, 0.12);
          border-color: rgba(255, 200, 150, 0.35);
          color: rgba(255, 250, 240, 0.95);
        }

        /* Writing Container */
        .writing-container {
          width: 100%;
          max-width: 580px;
        }

        /* Prompt Card */
        .prompt-card {
          background: rgba(255, 250, 240, 0.04);
          border: 1px solid rgba(255, 250, 240, 0.08);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
          text-align: center;
        }

        .prompt-label {
          font-size: 0.72rem;
          color: rgba(255, 200, 150, 0.65);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 12px;
        }

        .prompt-text {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.15rem;
          font-style: italic;
          color: rgba(255, 250, 240, 0.82);
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .prompt-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .prompt-btn {
          padding: 10px 20px;
          border-radius: 50px;
          border: 1px solid rgba(255, 250, 240, 0.12);
          background: transparent;
          color: rgba(255, 250, 240, 0.55);
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .prompt-btn:hover {
          background: rgba(255, 250, 240, 0.06);
          color: rgba(255, 250, 240, 0.85);
        }

        .prompt-btn-use {
          background: rgba(255, 200, 150, 0.12);
          border-color: rgba(255, 200, 150, 0.28);
          color: rgba(255, 220, 180, 0.88);
        }

        .prompt-btn-use:hover {
          background: rgba(255, 200, 150, 0.2);
        }

        /* Title Input */
        .title-input {
          width: 100%;
          padding: 14px 20px;
          border-radius: 12px;
          border: 1px solid rgba(255, 250, 240, 0.08);
          background: rgba(255, 250, 240, 0.025);
          color: rgba(255, 250, 240, 0.9);
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.25rem;
          margin-bottom: 12px;
          transition: all 0.3s ease;
        }

        .title-input::placeholder {
          color: rgba(255, 250, 240, 0.28);
        }

        .title-input:focus {
          outline: none;
          border-color: rgba(255, 200, 150, 0.28);
          background: rgba(255, 250, 240, 0.04);
        }

        /* Journal Textarea */
        .journal-textarea {
          width: 100%;
          min-height: 260px;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(255, 250, 240, 0.08);
          background: rgba(255, 250, 240, 0.025);
          color: rgba(255, 250, 240, 0.88);
          font-family: 'Georgia', serif;
          font-size: 1rem;
          line-height: 1.8;
          resize: vertical;
          transition: all 0.3s ease;
        }

        .journal-textarea::placeholder {
          color: rgba(255, 250, 240, 0.28);
          font-style: italic;
        }

        .journal-textarea:focus {
          outline: none;
          border-color: rgba(255, 200, 150, 0.28);
          background: rgba(255, 250, 240, 0.04);
          box-shadow: 0 0 45px rgba(255, 175, 95, 0.06);
        }

        /* Mood Section */
        .mood-section {
          margin-top: 20px;
          margin-bottom: 20px;
        }

        .mood-label {
          font-size: 0.82rem;
          color: rgba(255, 250, 240, 0.45);
          margin-bottom: 12px;
        }

        .mood-options {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .mood-btn {
          padding: 10px 18px;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: transparent;
          color: rgba(255, 255, 255, 0.55);
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: inherit;
        }

        .mood-btn:hover {
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.04);
        }

        .mood-btn.selected {
          border-color: var(--mood-color);
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.92);
        }

        .mood-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--mood-color);
        }

        /* Footer */
        .writing-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
        }

        .word-count {
          font-size: 0.82rem;
          color: rgba(255, 250, 240, 0.38);
        }

        .save-btn {
          padding: 14px 36px;
          border-radius: 50px;
          border: none;
          background: linear-gradient(135deg, 
            rgba(255, 195, 145, 0.88) 0%, 
            rgba(255, 165, 115, 0.82) 100%);
          color: rgba(30, 25, 20, 0.95);
          font-size: 0.92rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 25px rgba(255, 175, 115, 0.22);
          font-family: inherit;
        }

        .save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 35px rgba(255, 175, 115, 0.32);
        }

        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .saved-indicator {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 20px 40px;
          background: rgba(30, 26, 22, 0.95);
          border: 1px solid rgba(255, 200, 150, 0.28);
          border-radius: 16px;
          color: rgba(255, 250, 240, 0.95);
          font-size: 1.05rem;
          box-shadow: 0 12px 55px rgba(0, 0, 0, 0.5);
          z-index: 200;
          animation: savedPop 0.3s ease;
        }

        @keyframes savedPop {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }

        /* Entries List */
        .entries-container {
          width: 100%;
          max-width: 580px;
        }

        .entries-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .entry-card {
          background: rgba(255, 250, 240, 0.035);
          border: 1px solid rgba(255, 250, 240, 0.06);
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .entry-card:hover {
          background: rgba(255, 250, 240, 0.055);
          border-color: rgba(255, 200, 150, 0.18);
          transform: translateX(4px);
        }

        .entry-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .entry-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.12rem;
          color: rgba(255, 250, 240, 0.88);
        }

        .entry-date {
          font-size: 0.78rem;
          color: rgba(255, 250, 240, 0.38);
        }

        .entry-preview {
          font-size: 0.88rem;
          color: rgba(255, 250, 240, 0.48);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .entry-mood {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          padding: 6px 12px;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.04);
          font-size: 0.78rem;
          color: rgba(255, 255, 255, 0.55);
        }

        .empty-entries {
          text-align: center;
          padding: 55px 20px;
          color: rgba(255, 250, 240, 0.38);
        }

        .empty-icon {
          width: 55px;
          height: 65px;
          margin: 0 auto 20px;
          position: relative;
        }

        .empty-book {
          width: 48px;
          height: 58px;
          background: rgba(255, 250, 240, 0.08);
          border-radius: 2px 4px 4px 2px;
          margin: 0 auto;
        }

        .empty-book-spine {
          position: absolute;
          left: 4px;
          top: 4px;
          bottom: 4px;
          width: 5px;
          background: rgba(255, 200, 150, 0.18);
          border-radius: 2px 0 0 2px;
        }

        /* ============ RESPONSIVE ============ */
        @media (max-width: 768px) {
          .room-elements { opacity: ${isLoaded ? 0.28 : 0}; }
          .bookshelf { width: 8%; height: 45%; }
          .desk-area { width: 240px; left: 30%; }
          .floor-plant { right: 5%; transform: scale(0.7); }
          .rug { width: 280px; left: 30%; }
          .journal-textarea { min-height: 200px; }
        }

        @media (max-width: 480px) {
          .room-elements { opacity: ${isLoaded ? 0.15 : 0}; }
          .bookshelf { display: none; }
          .desk-area { width: 180px; transform: scale(0.6); bottom: 3%; left: 5%; transform: translateX(0); }
          .floor-plant { display: none; }
          .rug { width: 150px; height: 25px; left: 8%; transform: translateX(0); }
          .journal-textarea { min-height: 160px; }
          .title { font-size: 1.5rem; }
          .tab { padding: 10px 18px; font-size: 0.82rem; }
          .prompt-text { font-size: 0.95rem; }
        }
      `}</style>

      <div className="journal-room">
        {/* Ambient Layers */}
        <div className="ambient-layer warm-glow" />
        <div className="ambient-layer window-light" />

        {/* Room Elements */}
        <div className="room-elements">
          {/* Dust Particles */}
          {particles.map((p) => (
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

          {/* Floor */}
          <div className="floor">
            <div className="floor-boards" />
          </div>

          {/* Cozy Rug */}
          <div className="rug">
            <div className="rug-pattern" />
          </div>

          {/* Large Window with Night View */}
          <div className="window-container">
            <div className="window">
              <div className="night-sky" />
              <div className="moon" />
              {/* Stars */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="star"
                  style={{
                    top: `${8 + (i * 7) % 35}%`,
                    left: `${10 + (i * 13) % 75}%`,
                    width: `${1.5 + (i % 3)}px`,
                    height: `${1.5 + (i % 3)}px`,
                    animationDelay: `${(i * 0.4) % 3}s`,
                  }}
                />
              ))}
              <div className="night-hills">
                <div className="hill hill-1" />
                <div className="hill hill-2" />
                <div className="hill hill-3" />
                <div className="tree-line" />
              </div>
              <div className="window-frame-v" />
              <div className="window-frame-h" />
            </div>
            <div className="window-sill" />
          </div>

          {/* Bookshelf */}
          <div className="bookshelf">
            <div className="shelf" style={{ top: '16%' }}>
              <div className="books-row">
                <div className="book" style={{ width: '9px', height: '28px', background: 'rgba(100, 65, 50, 0.9)' }} />
                <div className="book" style={{ width: '11px', height: '32px', background: 'rgba(140, 90, 70, 0.9)' }} />
                <div className="book" style={{ width: '8px', height: '25px', background: 'rgba(55, 80, 80, 0.9)' }} />
              </div>
            </div>
            <div className="shelf" style={{ top: '40%' }}>
              <div className="books-row">
                <div className="book" style={{ width: '10px', height: '30px', background: 'rgba(120, 50, 55, 0.9)' }} />
                <div className="book" style={{ width: '9px', height: '26px', background: 'rgba(75, 65, 110, 0.9)' }} />
                <div className="book" style={{ width: '11px', height: '31px', background: 'rgba(90, 70, 55, 0.9)' }} />
              </div>
            </div>
            <div className="shelf" style={{ top: '64%' }}>
              <div className="books-row">
                <div className="book" style={{ width: '9px', height: '28px', background: 'rgba(110, 75, 50, 0.9)' }} />
                <div className="book" style={{ width: '10px', height: '25px', background: 'rgba(75, 60, 50, 0.9)' }} />
              </div>
            </div>
            <div className="shelf" style={{ top: '88%' }} />
          </div>

          {/* Writing Desk */}
          <div className="desk-area">
            <div className="desk-items">
              {/* Candle */}
              <div className="candle-container">
                <div className="candle-glow" />
                <div className="candle">
                  <div className="candle-drip drip-1" />
                  <div className="candle-drip drip-2" />
                  <div className="wick" />
                  <div className="flame-container">
                    <div className="flame" />
                    <div className="flame-inner" />
                  </div>
                </div>
                <div className="candle-holder" />
              </div>

              {/* Open Journal */}
              <div className="journal-book">
                <div className="journal-page-left">
                  <div className="page-lines">
                    {[...Array(6)].map((_, i) => <div key={i} className="page-line" />)}
                  </div>
                </div>
                <div className="journal-page-right">
                  <div className="page-lines">
                    {[...Array(6)].map((_, i) => <div key={i} className="page-line" />)}
                  </div>
                </div>
                <div className="journal-spine" />
              </div>

              {/* Ink & Quill */}
              <div className="ink-quill-container">
                <div className="ink-pot">
                  <div className="ink-pot-neck" />
                  <div className="ink-shine" />
                </div>
                <div className="quill">
                  <div className="quill-tip" />
                  <div className="quill-shaft" />
                  <div className="quill-feather" />
                </div>
              </div>
            </div>

            <div className="desk-surface" />
            <div className="desk-front">
              <div className="desk-drawer">
                <div className="drawer-handle" />
              </div>
            </div>
            <div className="desk-leg desk-leg-left" />
            <div className="desk-leg desk-leg-right" />
          </div>

          {/* Floor Plant */}
          <div className="floor-plant">
            <div className="plant-leaves">
              <div className="fern-leaf fern-1" />
              <div className="fern-leaf fern-2" />
              <div className="fern-leaf fern-3" />
              <div className="fern-leaf fern-4" />
              <div className="fern-leaf fern-5" />
            </div>
            <div className="plant-pot">
              <div className="pot-rim" />
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
            <h1 className="title">Journal Nook</h1>
            <div className="subtitle">A quiet space for reflection</div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'write' ? 'active' : ''}`}
              onClick={() => setActiveTab('write')}
            >
              Write
            </button>
            <button
              className={`tab ${activeTab === 'entries' ? 'active' : ''}`}
              onClick={() => setActiveTab('entries')}
            >
              Past Entries
            </button>
          </div>

          {/* Writing Tab */}
          {activeTab === 'write' && (
            <div className="writing-container">
              <div className="prompt-card">
                <div className="prompt-label">Writing Prompt</div>
                <div className="prompt-text">"{PROMPTS[currentPrompt]}"</div>
                <div className="prompt-actions">
                  <button className="prompt-btn" onClick={handleNewPrompt}>
                    Different prompt
                  </button>
                  <button className="prompt-btn prompt-btn-use" onClick={handleUsePrompt}>
                    Use this
                  </button>
                </div>
              </div>

              <input
                type="text"
                className="title-input"
                placeholder="Give this entry a title..."
                value={journalTitle}
                onChange={(e) => setJournalTitle(e.target.value)}
              />

              <textarea
                ref={textareaRef}
                className="journal-textarea"
                placeholder="Begin writing... let your thoughts flow freely."
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
              />

              <div className="mood-section">
                <div className="mood-label">How are you feeling?</div>
                <div className="mood-options">
                  {MOODS.map((mood) => (
                    <button
                      key={mood.id}
                      className={`mood-btn ${selectedMood === mood.id ? 'selected' : ''}`}
                      style={{ '--mood-color': mood.color } as React.CSSProperties}
                      onClick={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)}
                    >
                      <span className="mood-dot" style={{ background: mood.color }} />
                      {mood.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="writing-footer">
                <span className="word-count">{wordCount} words</span>
                <button
                  className={`save-btn ${isSaving ? 'saving' : ''}`}
                  onClick={handleSave}
                  disabled={!journalContent.trim() || isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </div>
          )}

          {/* Entries Tab */}
          {activeTab === 'entries' && (
            <div className="entries-container">
              {savedEntries.length > 0 ? (
                <div className="entries-list">
                  {savedEntries.map((entry) => (
                    <div key={entry.id} className="entry-card">
                      <div className="entry-header">
                        <div className="entry-title">{entry.title}</div>
                        <div className="entry-date">{entry.date}</div>
                      </div>
                      <div className="entry-preview">{entry.preview}</div>
                      {entry.mood && (
                        <div className="entry-mood">
                          <span
                            className="mood-dot"
                            style={{ background: MOODS.find(m => m.id === entry.mood)?.color }}
                          />
                          {MOODS.find(m => m.id === entry.mood)?.label}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-entries">
                  <div className="empty-icon">
                    <div className="empty-book">
                      <div className="empty-book-spine" />
                    </div>
                  </div>
                  <div>No entries yet</div>
                  <div style={{ marginTop: '8px', fontSize: '0.82rem' }}>
                    Start writing to fill these pages
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Saved Indicator */}
        {showSaved && (
          <div className="saved-indicator">
            ✓ Entry saved
          </div>
        )}
      </div>
    </>
  );
}