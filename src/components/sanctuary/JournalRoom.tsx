'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme, ThemeToggle } from '@/contexts/ThemeContext';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface JournalNookProps {
  onBack: () => void;
}

type Tab = 'write' | 'entries';
type Mood = 'calm' | 'anxious' | 'sad' | 'grateful' | 'hopeful' | 'tired';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: Mood | null;
  prompt: string | null;
  createdAt: Date;
  wordCount: number;
}

interface MoodOption {
  id: Mood;
  label: string;
  color: string;
  emoji: string;
}

interface BookData {
  width: number;
  height: number;
  color: string;
}

interface StarData {
  top: string;
  left: string;
  size: number;
  delay: number;
}

interface LeafData {
  height: number;
  rotation: number;
  offsetX: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const WRITING_PROMPTS: string[] = [
  "What's weighing on your mind right now?",
  "What are you grateful for today?",
  "Describe a moment that made you smile recently.",
  "What would you tell your younger self?",
  "What's one thing you're looking forward to?",
  "How are you really feeling today?",
  "What do you need to let go of?",
  "What brought you peace this week?",
  "What's a small victory you achieved recently?",
  "If you could change one thing about today, what would it be?",
  "What does self-care look like for you right now?",
  "Write about a person who made a difference in your life.",
];

const MOOD_OPTIONS: MoodOption[] = [
  { id: 'calm', label: 'Calm', color: '#6ee7b7', emoji: '😌' },
  { id: 'anxious', label: 'Anxious', color: '#fcd34d', emoji: '😰' },
  { id: 'sad', label: 'Sad', color: '#93c5fd', emoji: '😢' },
  { id: 'grateful', label: 'Grateful', color: '#c4b5fd', emoji: '🙏' },
  { id: 'hopeful', label: 'Hopeful', color: '#f9a8d4', emoji: '✨' },
  { id: 'tired', label: 'Tired', color: '#a1a1aa', emoji: '😴' },
];

const BOOKSHELF_DATA: BookData[][] = [
  [
    { width: 9, height: 30, color: '#8B4513' },
    { width: 7, height: 24, color: '#4a5568' },
    { width: 10, height: 32, color: '#9c7c5c' },
  ],
  [
    { width: 8, height: 20, color: '#5c8a6c' },
    { width: 10, height: 28, color: '#a08060' },
  ],
  [
    { width: 10, height: 36, color: '#6b4423' },
    { width: 7, height: 24, color: '#4a6080' },
    { width: 8, height: 30, color: '#8c7c6c' },
  ],
  [
    { width: 8, height: 26, color: '#9c8c7c' },
    { width: 10, height: 32, color: '#5c4a3a' },
  ],
  [
    { width: 7, height: 20, color: '#7c6c5c' },
    { width: 8, height: 28, color: '#5a7080' },
    { width: 9, height: 24, color: '#a08868' },
  ],
];

const WINDOW_STARS: StarData[] = [
  { top: '17%', left: '11%', size: 2, delay: 0 },
  { top: '24%', left: '34%', size: 1, delay: 0.5 },
  { top: '33%', left: '19%', size: 1.5, delay: 1 },
  { top: '43%', left: '58%', size: 1, delay: 1.5 },
  { top: '28%', left: '73%', size: 1.5, delay: 2 },
  { top: '55%', left: '42%', size: 1, delay: 0.8 },
];

const PLANT_LEAVES: LeafData[] = [
  { height: 48, rotation: -10, offsetX: -6 },
  { height: 62, rotation: -3, offsetX: 0 },
  { height: 56, rotation: 4, offsetX: 6 },
  { height: 42, rotation: 12, offsetX: 12 },
];

// ============================================================================
// STYLES
// ============================================================================

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');

  /* ===== RESET & BASE ===== */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
    text-size-adjust: 100%;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    overscroll-behavior: none;
    touch-action: pan-y;
  }

  /* ===== PREVENT OVERSCROLL ON iOS ===== */
  html, body {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  /* ===== ANIMATIONS ===== */
  @keyframes flicker {
    0%, 100% { 
      opacity: 0.8; 
      transform: scaleY(1) rotate(-1deg); 
    }
    25% { 
      opacity: 1; 
      transform: scaleY(1.08) rotate(0.5deg); 
    }
    50% { 
      opacity: 0.85; 
      transform: scaleY(0.96) rotate(-0.5deg); 
    }
    75% { 
      opacity: 1; 
      transform: scaleY(1.04) rotate(0.8deg); 
    }
  }

  @keyframes twinkle {
    0%, 100% { 
      opacity: 0.2; 
      transform: scale(1);
    }
    50% { 
      opacity: 1; 
      transform: scale(1.2);
    }
  }

  @keyframes gentleGlow {
    0%, 100% { 
      opacity: 0.3; 
    }
    50% { 
      opacity: 0.55; 
    }
  }

  @keyframes lampGlow {
    0%, 100% { 
      box-shadow: 
        0 0 20px rgba(255, 200, 120, 0.3), 
        0 0 40px rgba(255, 180, 100, 0.15),
        inset 0 -8px 15px rgba(255, 180, 100, 0.2);
    }
    50% { 
      box-shadow: 
        0 0 30px rgba(255, 200, 120, 0.5), 
        0 0 60px rgba(255, 180, 100, 0.25),
        inset 0 -10px 20px rgba(255, 180, 100, 0.3);
    }
  }

  @keyframes fadeIn {
    from { 
      opacity: 0; 
      transform: translateY(10px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }

  @keyframes pulse {
    0%, 100% { 
      transform: scale(1); 
    }
    50% { 
      transform: scale(1.02); 
    }
  }

  /* ===== SCROLLBAR STYLING ===== */
  .journal-scroll {
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(200, 175, 140, 0.2) transparent;
    overscroll-behavior-y: contain;
  }

  .journal-scroll::-webkit-scrollbar {
    width: 6px;
  }

  .journal-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .journal-scroll::-webkit-scrollbar-thumb {
    background: rgba(200, 175, 140, 0.2);
    border-radius: 3px;
  }

  .journal-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(200, 175, 140, 0.35);
  }

  /* ===== INPUT STYLING ===== */
  .journal-input {
    -webkit-appearance: none;
    appearance: none;
    background-clip: padding-box;
  }

  .journal-input::placeholder {
    color: rgba(200, 185, 165, 0.4);
    opacity: 1;
  }

  .journal-input:focus {
    outline: none;
  }

  .journal-input::-webkit-input-placeholder {
    color: rgba(200, 185, 165, 0.4);
  }

  .journal-input::-moz-placeholder {
    color: rgba(200, 185, 165, 0.4);
  }

  .journal-input:-ms-input-placeholder {
    color: rgba(200, 185, 165, 0.4);
  }

  /* ===== BUTTON TRANSITIONS ===== */
  .journal-btn {
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    -webkit-user-select: none;
    user-select: none;
    cursor: pointer;
  }

  .journal-btn:hover {
    transform: translateY(-1px);
  }

  .journal-btn:active {
    transform: scale(0.97);
  }

  /* ===== MOOD BUTTON ===== */
  .mood-btn {
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    -webkit-user-select: none;
    user-select: none;
    cursor: pointer;
  }

  .mood-btn:hover {
    transform: translateY(-2px);
  }

  .mood-btn:active {
    transform: scale(0.95);
  }

  /* ===== TAB BUTTON ===== */
  .tab-btn {
    transition: all 0.2s ease;
    -webkit-user-select: none;
    user-select: none;
    cursor: pointer;
  }

  .tab-btn:active {
    transform: scale(0.97);
  }

  /* ===== PROMPT BUTTON ===== */
  .prompt-btn {
    transition: all 0.2s ease;
    -webkit-user-select: none;
    user-select: none;
    cursor: pointer;
  }

  .prompt-btn:active {
    transform: scale(0.96);
  }

  /* ===== RESPONSIVE BREAKPOINTS ===== */
  
  /* Extra small devices (phones, 320px and up) */
  @media screen and (min-width: 320px) {
    html { font-size: 14px; }
  }

  /* Small devices (phones, 375px and up) */
  @media screen and (min-width: 375px) {
    html { font-size: 15px; }
  }

  /* Medium devices (tablets, 768px and up) */
  @media screen and (min-width: 768px) {
    html { font-size: 16px; }
  }

  /* Large devices (desktops, 1024px and up) */
  @media screen and (min-width: 1024px) {
    html { font-size: 17px; }
  }

  /* Extra large devices (large desktops, 1440px and up) */
  @media screen and (min-width: 1440px) {
    html { font-size: 18px; }
  }

  /* ===== SAFE AREA SUPPORT ===== */
  @supports (padding-top: env(safe-area-inset-top)) {
    .safe-area-top {
      padding-top: env(safe-area-inset-top);
    }
    .safe-area-bottom {
      padding-bottom: env(safe-area-inset-bottom);
    }
  }

  /* ===== REDUCED MOTION ===== */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* ===== DARK MODE SUPPORT ===== */
  @media (prefers-color-scheme: dark) {
    /* Already dark themed, no changes needed */
  }

  /* ===== HIGH CONTRAST MODE ===== */
  @media (prefers-contrast: high) {
    .journal-input {
      border-width: 2px;
    }
  }

  /* ===== FOCUS VISIBLE ===== */
  .journal-btn:focus-visible,
  .mood-btn:focus-visible,
  .tab-btn:focus-visible,
  .prompt-btn:focus-visible {
    outline: 2px solid rgba(200, 175, 140, 0.6);
    outline-offset: 2px;
  }

  .journal-input:focus-visible {
    border-color: rgba(200, 175, 140, 0.5);
  }
`;

// ============================================================================
// COMPONENT
// ============================================================================

export default function JournalNook({ onBack }: JournalNookProps) {
  const { colors } = useTheme();

  // ===== STATE =====
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('write');
  const [currentPrompt, setCurrentPrompt] = useState<string>(WRITING_PROMPTS[0]);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isContentFocused, setIsContentFocused] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // ===== EFFECTS =====
  useEffect(() => {
    setMounted(true);
    // Set random prompt on mount
    const randomIndex = Math.floor(Math.random() * WRITING_PROMPTS.length);
    setCurrentPrompt(WRITING_PROMPTS[randomIndex]);

    // Prevent bounce/overscroll on iOS
    const preventOverscroll = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const scrollable = target.closest('.journal-scroll');
      if (!scrollable) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventOverscroll, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventOverscroll);
    };
  }, []);

  // ===== CALLBACKS =====
  const getNewPrompt = useCallback(() => {
    const availablePrompts = WRITING_PROMPTS.filter(p => p !== currentPrompt);
    const randomIndex = Math.floor(Math.random() * availablePrompts.length);
    setCurrentPrompt(availablePrompts[randomIndex]);
  }, [currentPrompt]);

  const usePromptAsTitle = useCallback(() => {
    setTitle(currentPrompt);
  }, [currentPrompt]);

  const handleSaveEntry = useCallback(() => {
    if (!content.trim()) return;

    setSaveStatus('saving');

    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      title: title.trim() || 'Untitled Entry',
      content: content.trim(),
      mood: selectedMood,
      prompt: currentPrompt,
      createdAt: new Date(),
      wordCount: content.trim().split(/\s+/).length,
    };

    // Simulate save delay
    setTimeout(() => {
      setEntries(prev => [newEntry, ...prev]);
      setTitle('');
      setContent('');
      setSelectedMood(null);
      setSaveStatus('saved');

      setTimeout(() => {
        setSaveStatus('idle');
        getNewPrompt();
      }, 1500);
    }, 500);
  }, [content, title, selectedMood, currentPrompt, getNewPrompt]);

  const handleMoodSelect = useCallback((mood: Mood) => {
    setSelectedMood(prev => prev === mood ? null : mood);
  }, []);

  // ===== COMPUTED VALUES =====
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  // ===== LOADING STATE =====
  if (!mounted) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          minHeight: '100dvh',
          minWidth: '100vw',
          background: colors.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: `3px solid ${colors.cardBorder}`,
            borderTopColor: colors.accent,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    );
  }

  // ===== RENDER =====
  return (
    <>
      {/* Global Styles */}
      <style jsx global>{GLOBAL_STYLES}</style>
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Main Container - Locked to viewport */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100dvh',
          minHeight: '-webkit-fill-available',
          background: colors.bg,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          isolation: 'isolate',
        }}
      >
        {/* ================================================================== */}
        {/* ATMOSPHERIC BACKGROUND LAYER - VERY DARK FOR FOCUS ON CONTENT */}
        {/* ================================================================== */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 0,
            opacity: 0.22, /* Very dark - just hints of the room */
          }}
        >
          {/* ----- Ambient Lamp Glow ----- */}
          <div
            style={{
              position: 'absolute',
              bottom: '12%',
              left: '6%',
              width: 'clamp(120px, 32vw, 260px)',
              height: 'clamp(120px, 32vw, 260px)',
              background: 'radial-gradient(circle, rgba(255, 190, 120, 0.08) 0%, rgba(255, 160, 80, 0.02) 50%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(40px)',
              animation: 'gentleGlow 5s ease-in-out infinite',
            }}
          />

          {/* ----- Secondary Glow ----- */}
          <div
            style={{
              position: 'absolute',
              top: '20%',
              right: '10%',
              width: 'clamp(80px, 20vw, 150px)',
              height: 'clamp(80px, 20vw, 150px)',
              background: 'radial-gradient(circle, rgba(100, 130, 180, 0.06) 0%, transparent 60%)',
              borderRadius: '50%',
              filter: 'blur(30px)',
            }}
          />

          {/* ================================================================== */}
          {/* LEFT BOOKSHELF - FULL FURNITURE PIECE */}
          {/* ================================================================== */}
          <div
            style={{
              position: 'absolute',
              top: 'clamp(75px, 12vh, 110px)', /* Lowered to avoid Back button */
              left: 0,
              width: 'clamp(55px, 14vw, 95px)',
              height: 'clamp(260px, 50vh, 380px)', /* Slightly shorter */
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Bookcase Frame - Back Panel */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, #3d3228 0%, #4a3d32 50%, #3d3228 100%)',
                borderRadius: '0 clamp(3px, 0.6vw, 5px) clamp(3px, 0.6vw, 5px) 0',
                boxShadow: `
                  inset -3px 0 8px rgba(0, 0, 0, 0.3),
                  4px 0 15px rgba(0, 0, 0, 0.25)
                `,
              }}
            />

            {/* Bookcase Frame - Right Side Panel */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 'clamp(4px, 1vw, 7px)',
                height: '100%',
                background: 'linear-gradient(90deg, #5a4d42 0%, #4a3d32 100%)',
                borderRadius: '0 clamp(3px, 0.6vw, 5px) clamp(3px, 0.6vw, 5px) 0',
              }}
            />

            {/* Bookcase Frame - Top Trim */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 'clamp(6px, 1.4vw, 10px)',
                background: 'linear-gradient(180deg, #6a5a4a 0%, #5a4a3a 100%)',
                borderRadius: '0 clamp(3px, 0.6vw, 5px) 0 0',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            />

            {/* Bookcase Frame - Bottom Base */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 'clamp(10px, 2.2vw, 16px)',
                background: 'linear-gradient(180deg, #5a4a3a 0%, #4a3a2a 100%)',
                borderRadius: '0 0 clamp(3px, 0.6vw, 5px) 0',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              }}
            />

            {/* Shelves Container */}
            <div
              style={{
                position: 'absolute',
                top: 'clamp(8px, 1.6vw, 12px)',
                left: 'clamp(3px, 0.7vw, 5px)',
                right: 'clamp(6px, 1.4vw, 10px)',
                bottom: 'clamp(10px, 2.2vw, 16px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Shelf Row 1 */}
              <div style={{ position: 'relative', height: 'clamp(32px, 7vh, 48px)' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 'clamp(3px, 0.6vw, 4px)', background: 'linear-gradient(180deg, #6a5a4a 0%, #5a4a3a 100%)', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }} />
                <div style={{ position: 'absolute', bottom: 'clamp(3px, 0.6vw, 4px)', left: 'clamp(2px, 0.5vw, 4px)', display: 'flex', alignItems: 'flex-end', gap: 'clamp(1px, 0.3vw, 2px)' }}>
                  <div style={{ width: 'clamp(7px, 1.6vw, 11px)', height: 'clamp(24px, 5.5vh, 38px)', background: 'linear-gradient(180deg, #8B4513 0%, #6B3410 100%)', borderRadius: 1 }} />
                  <div style={{ width: 'clamp(6px, 1.4vw, 10px)', height: 'clamp(20px, 4.5vh, 32px)', background: 'linear-gradient(180deg, #4a5568 0%, #2d3748 100%)', borderRadius: 1 }} />
                  <div style={{ width: 'clamp(8px, 1.8vw, 12px)', height: 'clamp(26px, 6vh, 40px)', background: 'linear-gradient(180deg, #9c7c5c 0%, #7c5c3c 100%)', borderRadius: 1 }} />
                  <div style={{ width: 'clamp(5px, 1.2vw, 8px)', height: 'clamp(18px, 4vh, 28px)', background: 'linear-gradient(180deg, #6b8e6b 0%, #4b6e4b 100%)', borderRadius: 1 }} />
                </div>
              </div>

              {/* Shelf Row 2 */}
              <div style={{ position: 'relative', height: 'clamp(32px, 7vh, 48px)' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 'clamp(3px, 0.6vw, 4px)', background: 'linear-gradient(180deg, #6a5a4a 0%, #5a4a3a 100%)', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }} />
                <div style={{ position: 'absolute', bottom: 'clamp(3px, 0.6vw, 4px)', left: 'clamp(3px, 0.6vw, 5px)', display: 'flex', alignItems: 'flex-end', gap: 'clamp(1px, 0.3vw, 2px)' }}>
                  <div style={{ width: 'clamp(8px, 1.8vw, 12px)', height: 'clamp(22px, 5vh, 34px)', background: 'linear-gradient(180deg, #5c8a6c 0%, #3c6a4c 100%)', borderRadius: 1 }} />
                  <div style={{ width: 'clamp(9px, 2vw, 14px)', height: 'clamp(28px, 6.5vh, 44px)', background: 'linear-gradient(180deg, #a08060 0%, #806040 100%)', borderRadius: 1 }} />
                  <div style={{ width: 'clamp(6px, 1.4vw, 10px)', height: 'clamp(16px, 3.5vh, 26px)', background: 'linear-gradient(180deg, #8a6a5a 0%, #6a4a3a 100%)', borderRadius: 1 }} />
                </div>
              </div>

              {/* Shelf Row 3 */}
              <div style={{ position: 'relative', height: 'clamp(32px, 7vh, 48px)' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 'clamp(3px, 0.6vw, 4px)', background: 'linear-gradient(180deg, #6a5a4a 0%, #5a4a3a 100%)', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }} />
                <div style={{ position: 'absolute', bottom: 'clamp(3px, 0.6vw, 4px)', left: 'clamp(2px, 0.5vw, 4px)', display: 'flex', alignItems: 'flex-end', gap: 'clamp(1px, 0.3vw, 2px)' }}>
                  <div style={{ width: 'clamp(9px, 2vw, 14px)', height: 'clamp(28px, 6.5vh, 44px)', background: 'linear-gradient(180deg, #6b4423 0%, #4a2c13 100%)', borderRadius: 1 }} />
                  <div style={{ width: 'clamp(6px, 1.4vw, 10px)', height: 'clamp(20px, 4.5vh, 32px)', background: 'linear-gradient(180deg, #4a6080 0%, #2a4060 100%)', borderRadius: 1 }} />
                  <div style={{ width: 'clamp(7px, 1.6vw, 11px)', height: 'clamp(24px, 5.5vh, 38px)', background: 'linear-gradient(180deg, #8c7c6c 0%, #6c5c4c 100%)', borderRadius: 1 }} />
                  <div style={{ width: 'clamp(5px, 1.1vw, 8px)', height: 'clamp(14px, 3vh, 22px)', background: 'linear-gradient(180deg, #9a7a5a 0%, #7a5a3a 100%)', borderRadius: 1 }} />
                </div>
              </div>

              {/* Shelf Row 4 */}
              <div style={{ position: 'relative', height: 'clamp(32px, 7vh, 48px)' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 'clamp(3px, 0.6vw, 4px)', background: 'linear-gradient(180deg, #6a5a4a 0%, #5a4a3a 100%)', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }} />
                <div style={{ position: 'absolute', bottom: 'clamp(3px, 0.6vw, 4px)', left: 'clamp(3px, 0.6vw, 5px)', display: 'flex', alignItems: 'flex-end', gap: 'clamp(1px, 0.3vw, 2px)' }}>
                  <div style={{ width: 'clamp(7px, 1.6vw, 11px)', height: 'clamp(22px, 5vh, 34px)', background: 'linear-gradient(180deg, #9c8c7c 0%, #7c6c5c 100%)', borderRadius: 1 }} />
                  <div style={{ width: 'clamp(8px, 1.8vw, 13px)', height: 'clamp(26px, 6vh, 40px)', background: 'linear-gradient(180deg, #5c4a3a 0%, #3c2a1a 100%)', borderRadius: 1 }} />
                  <div style={{ width: 'clamp(6px, 1.3vw, 9px)', height: 'clamp(18px, 4vh, 28px)', background: 'linear-gradient(180deg, #7a8a6a 0%, #5a6a4a 100%)', borderRadius: 1 }} />
                </div>
              </div>

              {/* Shelf Row 5 - Bottom with slightly larger books */}
              <div style={{ position: 'relative', height: 'clamp(34px, 7.5vh, 52px)' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 'clamp(3px, 0.6vw, 4px)', background: 'linear-gradient(180deg, #6a5a4a 0%, #5a4a3a 100%)', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }} />
                <div style={{ position: 'absolute', bottom: 'clamp(3px, 0.6vw, 4px)', left: 'clamp(2px, 0.5vw, 4px)', display: 'flex', alignItems: 'flex-end', gap: 'clamp(1px, 0.3vw, 2px)' }}>
                  <div style={{ width: 'clamp(9px, 2vw, 14px)', height: 'clamp(28px, 6.5vh, 44px)', background: 'linear-gradient(180deg, #8a5a4a 0%, #6a3a2a 100%)', borderRadius: 1 }} />
                  <div style={{ width: 'clamp(7px, 1.6vw, 11px)', height: 'clamp(24px, 5.5vh, 38px)', background: 'linear-gradient(180deg, #5a6a5a 0%, #3a4a3a 100%)', borderRadius: 1 }} />
                  <div style={{ width: 'clamp(6px, 1.4vw, 10px)', height: 'clamp(20px, 4.5vh, 32px)', background: 'linear-gradient(180deg, #7a6a8a 0%, #5a4a6a 100%)', borderRadius: 1 }} />
                </div>
              </div>
            </div>

            {/* Decorative Items on Top of Bookcase */}
            <div
              style={{
                position: 'absolute',
                top: 'clamp(-16px, -3vh, -24px)',
                left: 'clamp(8px, 2vw, 14px)',
                display: 'flex',
                alignItems: 'flex-end',
                gap: 'clamp(4px, 1vw, 8px)',
              }}
            >
              {/* Small Vase */}
              <div
                style={{
                  width: 'clamp(8px, 1.8vw, 13px)',
                  height: 'clamp(12px, 2.5vh, 18px)',
                  background: 'linear-gradient(180deg, #8a7a6a 0%, #6a5a4a 100%)',
                  borderRadius: '30% 30% 40% 40% / 20% 20% 50% 50%',
                }}
              />
              {/* Small Plant in Vase */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: 'clamp(10px, 2.2vw, 16px)',
                    height: 'clamp(10px, 2vh, 15px)',
                    background: 'linear-gradient(180deg, #6a5a4a 0%, #4a3a2a 100%)',
                    borderRadius: '20% 20% 35% 35% / 15% 15% 45% 45%',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'clamp(8px, 1.8vh, 13px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'clamp(3px, 0.7vw, 5px)',
                    height: 'clamp(10px, 2vh, 15px)',
                    background: 'linear-gradient(180deg, #5a8a5a 0%, #3a6a3a 100%)',
                    borderRadius: '50% 50% 10% 10% / 70% 70% 10% 10%',
                  }}
                />
              </div>
            </div>
          </div>

          {/* ================================================================== */}
          {/* WINDOW WITH TWILIGHT SKY */}
          {/* ================================================================== */}
          <div
            style={{
              position: 'absolute',
              top: 'clamp(18px, 4vh, 35px)',
              right: 'clamp(10px, 3vw, 25px)',
              width: 'clamp(80px, 18vw, 130px)',
              aspectRatio: '3 / 4',
              background: 'linear-gradient(180deg, #1e2a4a 0%, #162040 35%, #0e1830 100%)',
              borderRadius: 'clamp(2px, 0.4vw, 4px)',
              border: 'clamp(3px, 0.6vw, 5px) solid rgba(70, 60, 55, 0.9)',
              overflow: 'hidden',
              boxShadow: `
                inset 0 0 25px rgba(100, 130, 180, 0.08),
                0 4px 15px rgba(0, 0, 0, 0.3)
              `,
            }}
          >
            {/* Moon */}
            <div
              style={{
                position: 'absolute',
                top: '10%',
                right: '12%',
                width: 'clamp(12px, 4vw, 24px)',
                height: 'clamp(12px, 4vw, 24px)',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #f8f8ff 0%, #e0e0f5 40%, #c8c8e0 100%)',
                boxShadow: `
                  0 0 15px rgba(220, 225, 255, 0.5),
                  0 0 35px rgba(200, 210, 240, 0.2)
                `,
              }}
            />

            {/* Stars */}
            {WINDOW_STARS.map((star, index) => (
              <div
                key={`star-${index}`}
                style={{
                  position: 'absolute',
                  width: star.size,
                  height: star.size,
                  background: 'rgba(255, 255, 255, 0.85)',
                  borderRadius: '50%',
                  top: star.top,
                  left: star.left,
                  animation: `twinkle ${2 + star.delay}s ease-in-out infinite`,
                  animationDelay: `${star.delay}s`,
                }}
              />
            ))}

            {/* Window Mullions - Vertical */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'clamp(2px, 0.5vw, 4px)',
                height: '100%',
                background: 'rgba(70, 60, 55, 0.9)',
              }}
            />

            {/* Window Mullions - Horizontal */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                transform: 'translateY(-50%)',
                width: '100%',
                height: 'clamp(2px, 0.5vw, 4px)',
                background: 'rgba(70, 60, 55, 0.9)',
              }}
            />
          </div>

          {/* ================================================================== */}
          {/* FOREGROUND DESK - Below the content area */}
          {/* ================================================================== */}
          <div
            style={{
              position: 'absolute',
              bottom: 'clamp(15px, 4vh, 40px)', /* At the bottom of the screen */
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'clamp(360px, 95vw, 620px)',
            }}
          >
            {/* Items sitting ON TOP of desk surface */}
            <div
              style={{
                position: 'absolute',
                bottom: '100%', /* Sits right on top of desk */
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                padding: '0 clamp(8px, 2vw, 15px)', /* Less padding = items more to edges */
                pointerEvents: 'none',
              }}
            >
              {/* CANDLE on LEFT side of desk */}
              <div
                style={{
                  position: 'relative',
                  marginBottom: 'clamp(-2px, -0.5vw, -4px)', /* Sits on surface */
                }}
              >
                {/* Candle holder/base */}
                <div
                  style={{
                    width: 'clamp(22px, 5vw, 36px)',
                    height: 'clamp(12px, 3vw, 20px)',
                    background: 'linear-gradient(180deg, #8a7a6a 0%, #5a4a3a 100%)',
                    borderRadius: '25% 25% 10% 10% / 50% 50% 30% 30%',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                  }}
                />
                {/* Candle body */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'clamp(10px, 2.5vw, 18px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'clamp(12px, 3vw, 20px)',
                    height: 'clamp(45px, 11vw, 75px)',
                    background: 'linear-gradient(180deg, #f8f5f0 0%, #e8e2d8 50%, #d8d0c5 100%)',
                    borderRadius: 'clamp(3px, 0.6vw, 5px)',
                    boxShadow: 'inset -3px 0 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
                {/* Wick */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'clamp(54px, 13.5vw, 92px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'clamp(2px, 0.4vw, 3px)',
                    height: 'clamp(6px, 1.5vw, 10px)',
                    background: '#2a2a2a',
                    borderRadius: 1,
                  }}
                />
                {/* Flame */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'clamp(58px, 14.5vw, 98px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'clamp(8px, 2vw, 14px)',
                    height: 'clamp(18px, 4.5vw, 30px)',
                    background: 'linear-gradient(180deg, #fff8e0 0%, #ffcc44 30%, #ff9922 60%, #ff6600 100%)',
                    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                    animation: 'flicker 2s ease-in-out infinite',
                    boxShadow: '0 0 20px rgba(255, 180, 80, 0.7), 0 0 40px rgba(255, 140, 40, 0.4)',
                  }}
                />
                {/* Candle glow on desk */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'clamp(-20px, -5vw, -35px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'clamp(100px, 25vw, 170px)',
                    height: 'clamp(60px, 15vw, 100px)',
                    background: 'radial-gradient(ellipse, rgba(255, 200, 100, 0.2) 0%, rgba(255, 160, 60, 0.08) 40%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* ELEGANT PLANT on RIGHT side of desk */}
              <div
                style={{
                  position: 'relative',
                  marginBottom: 'clamp(-2px, -0.5vw, -4px)', /* Sits on surface */
                }}
              >
                {/* Elegant slim dark vase */}
                <div
                  style={{
                    width: 'clamp(20px, 5vw, 34px)',
                    height: 'clamp(40px, 10vw, 68px)',
                    background: 'linear-gradient(135deg, #3a3a3a 0%, #252525 50%, #1a1a1a 100%)',
                    borderRadius: '20% 20% 35% 35% / 8% 8% 25% 25%',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.45), inset 2px 0 6px rgba(255, 255, 255, 0.06)',
                    position: 'relative',
                  }}
                >
                  {/* Vase highlight */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '8%',
                      left: '12%',
                      width: '18%',
                      height: '55%',
                      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
                      borderRadius: '50%',
                    }}
                  />
                </div>
                
                {/* Elegant eucalyptus-style branches */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'clamp(36px, 9vw, 62px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  {/* Main stem 1 - left leaning */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 'clamp(-4px, -1vw, -7px)',
                      width: 'clamp(2px, 0.5vw, 3px)',
                      height: 'clamp(50px, 12vw, 85px)',
                      background: 'linear-gradient(180deg, #5a7a5a 0%, #3a5a3a 100%)',
                      transform: 'rotate(-12deg)',
                      transformOrigin: 'bottom center',
                      borderRadius: 2,
                    }}
                  >
                    {/* Leaves on stem 1 */}
                    {[
                      { bottom: '15%', rotate: -50, size: 1 },
                      { bottom: '30%', rotate: 45, size: 0.95 },
                      { bottom: '45%', rotate: -48, size: 0.88 },
                      { bottom: '60%', rotate: 50, size: 0.8 },
                      { bottom: '75%', rotate: -45, size: 0.72 },
                      { bottom: '88%', rotate: 42, size: 0.6 },
                    ].map((leaf, i) => (
                      <div
                        key={`leaf1-${i}`}
                        style={{
                          position: 'absolute',
                          bottom: leaf.bottom,
                          left: leaf.rotate > 0 ? '100%' : 'auto',
                          right: leaf.rotate < 0 ? '100%' : 'auto',
                          width: `clamp(${7 * leaf.size}px, ${1.8 * leaf.size}vw, ${12 * leaf.size}px)`,
                          height: `clamp(${12 * leaf.size}px, ${3 * leaf.size}vw, ${20 * leaf.size}px)`,
                          background: 'linear-gradient(180deg, rgba(90, 130, 90, 0.92) 0%, rgba(60, 100, 60, 0.88) 100%)',
                          borderRadius: '50%',
                          transform: `rotate(${leaf.rotate}deg)`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Main stem 2 - center/right */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 'clamp(3px, 0.8vw, 6px)',
                      width: 'clamp(2px, 0.5vw, 3px)',
                      height: 'clamp(60px, 15vw, 100px)',
                      background: 'linear-gradient(180deg, #5a7a5a 0%, #3a5a3a 100%)',
                      transform: 'rotate(8deg)',
                      transformOrigin: 'bottom center',
                      borderRadius: 2,
                    }}
                  >
                    {/* Leaves on stem 2 */}
                    {[
                      { bottom: '12%', rotate: 52, size: 1 },
                      { bottom: '25%', rotate: -48, size: 0.95 },
                      { bottom: '38%', rotate: 50, size: 0.9 },
                      { bottom: '52%', rotate: -45, size: 0.82 },
                      { bottom: '65%', rotate: 48, size: 0.75 },
                      { bottom: '78%', rotate: -42, size: 0.65 },
                      { bottom: '90%', rotate: 40, size: 0.55 },
                    ].map((leaf, i) => (
                      <div
                        key={`leaf2-${i}`}
                        style={{
                          position: 'absolute',
                          bottom: leaf.bottom,
                          left: leaf.rotate > 0 ? '100%' : 'auto',
                          right: leaf.rotate < 0 ? '100%' : 'auto',
                          width: `clamp(${7 * leaf.size}px, ${1.8 * leaf.size}vw, ${12 * leaf.size}px)`,
                          height: `clamp(${12 * leaf.size}px, ${3 * leaf.size}vw, ${20 * leaf.size}px)`,
                          background: 'linear-gradient(180deg, rgba(90, 130, 90, 0.92) 0%, rgba(60, 100, 60, 0.88) 100%)',
                          borderRadius: '50%',
                          transform: `rotate(${leaf.rotate}deg)`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Desk Surface */}
            <div
              style={{
                height: 'clamp(12px, 3vw, 20px)',
                background: 'linear-gradient(180deg, #5a4a3a 0%, #4a3a2a 50%, #3a2a1a 100%)',
                borderRadius: 'clamp(4px, 0.8vw, 8px) clamp(4px, 0.8vw, 8px) 0 0',
                boxShadow: `
                  0 -2px 10px rgba(0, 0, 0, 0.2),
                  inset 0 2px 0 rgba(255, 255, 255, 0.08)
                `,
              }}
            />

            {/* Desk Front Panel with Drawers */}
            <div
              style={{
                height: 'clamp(50px, 12vw, 85px)',
                background: 'linear-gradient(180deg, #4a3a2a 0%, #3a2a1a 100%)',
                borderRadius: '0 0 clamp(4px, 0.8vw, 8px) clamp(4px, 0.8vw, 8px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                justifyContent: 'center',
                gap: 'clamp(30px, 8vw, 60px)',
                padding: 'clamp(8px, 2vw, 14px)',
              }}
            >
              {/* Drawer 1 */}
              <div
                style={{
                  width: 'clamp(70px, 18vw, 120px)',
                  height: '100%',
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(0, 0, 0, 0.06) 100%)',
                  borderRadius: 'clamp(3px, 0.5vw, 5px)',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Drawer Handle */}
                <div
                  style={{
                    width: 'clamp(18px, 4vw, 30px)',
                    height: 'clamp(4px, 0.9vw, 7px)',
                    background: 'rgba(180, 160, 140, 0.35)',
                    borderRadius: 3,
                  }}
                />
              </div>

              {/* Drawer 2 */}
              <div
                style={{
                  width: 'clamp(70px, 18vw, 120px)',
                  height: '100%',
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(0, 0, 0, 0.06) 100%)',
                  borderRadius: 'clamp(3px, 0.5vw, 5px)',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Drawer Handle */}
                <div
                  style={{
                    width: 'clamp(18px, 4vw, 30px)',
                    height: 'clamp(4px, 0.9vw, 7px)',
                    background: 'rgba(180, 160, 140, 0.35)',
                    borderRadius: 3,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* HEADER */}
        {/* ================================================================== */}
        <header
          className="safe-area-top"
          style={{
            padding: 'clamp(10px, 2.5vw, 14px)',
            paddingTop: 'max(clamp(10px, 2.5vw, 14px), env(safe-area-inset-top, 10px))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 50,
            position: 'relative',
          }}
        >
          <button
            onClick={onBack}
            className="prompt-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(3px, 0.8vw, 5px)',
              padding: 'clamp(7px, 1.8vw, 11px) clamp(11px, 2.8vw, 16px)',
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 50,
              fontSize: 'clamp(11px, 2.8vw, 13px)',
              fontWeight: 450,
              color: colors.textMuted,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <span style={{ fontSize: 'clamp(12px, 3vw, 14px)' }}>←</span>
            <span>Sanctuary</span>
          </button>

          <ThemeToggle />
        </header>

        {/* ================================================================== */}
        {/* MAIN CONTENT AREA */}
        {/* ================================================================== */}
        <main
          className="journal-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '0 clamp(10px, 3.5vw, 18px)',
            paddingBottom: 'clamp(100px, 20vh, 160px)',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div
            style={{
              maxWidth: 580,
              margin: '0 auto',
              width: '100%',
            }}
          >
            {/* ----- Title Section ----- */}
            <header style={{ textAlign: 'center', marginBottom: 'clamp(14px, 4vw, 24px)' }}>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(26px, 7vw, 40px)',
                  fontWeight: 300,
                  marginBottom: 'clamp(3px, 0.8vw, 6px)',
                  color: 'rgba(255, 250, 240, 0.9)',
                  letterSpacing: '-0.01em',
                }}
              >
                Journal Nook
              </h1>
              <p
                style={{
                  color: 'rgba(255, 250, 240, 0.4)',
                  fontSize: 'clamp(11px, 3vw, 14px)',
                  letterSpacing: '0.03em',
                }}
              >
                A quiet space for reflection
              </p>
            </header>

            {/* ----- Tab Navigation ----- */}
            <nav
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'clamp(5px, 1.8vw, 9px)',
                marginBottom: 'clamp(14px, 4vw, 24px)',
              }}
            >
              {(['write', 'entries'] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  className="tab-btn"
                  onClick={() => setActiveTab(tab)}
                  aria-selected={activeTab === tab}
                  style={{
                    padding: 'clamp(9px, 2.2vw, 13px) clamp(18px, 4.5vw, 26px)',
                    background: activeTab === tab ? 'rgba(200, 175, 140, 0.15)' : 'transparent',
                    border: `1px solid ${activeTab === tab ? 'rgba(200, 175, 140, 0.35)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: 30,
                    color: activeTab === tab ? 'rgba(220, 200, 170, 0.95)' : 'rgba(255, 255, 255, 0.5)',
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    fontWeight: activeTab === tab ? 500 : 400,
                  }}
                >
                  {tab === 'entries' ? 'Past Entries' : 'Write'}
                </button>
              ))}
            </nav>

            {/* ================================================================== */}
            {/* WRITE TAB CONTENT */}
            {/* ================================================================== */}
            {activeTab === 'write' && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {/* ----- Writing Prompt Card ----- */}
                <div
                  style={{
                    padding: 'clamp(14px, 4vw, 24px)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(200, 175, 140, 0.18)',
                    borderRadius: 'clamp(10px, 2.5vw, 16px)',
                    marginBottom: 'clamp(12px, 3.5vw, 18px)',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: 'clamp(8px, 2.2vw, 10px)',
                      color: 'rgba(200, 175, 140, 0.7)',
                      letterSpacing: '0.18em',
                      marginBottom: 'clamp(7px, 2vw, 12px)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Writing Prompt
                  </div>
                  <p
                    style={{
                      fontSize: 'clamp(15px, 4vw, 19px)',
                      fontStyle: 'italic',
                      color: 'rgba(255, 250, 240, 0.85)',
                      marginBottom: 'clamp(10px, 3vw, 16px)',
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      lineHeight: 1.45,
                    }}
                  >
                    "{currentPrompt}"
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: 'clamp(7px, 2vw, 11px)',
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      onClick={getNewPrompt}
                      className="prompt-btn"
                      style={{
                        padding: 'clamp(7px, 2vw, 11px) clamp(14px, 3.5vw, 20px)',
                        background: 'transparent',
                        border: '1px solid rgba(200, 175, 140, 0.28)',
                        borderRadius: 25,
                        color: 'rgba(255, 250, 240, 0.6)',
                        fontSize: 'clamp(11px, 2.8vw, 13px)',
                      }}
                    >
                      Different prompt
                    </button>
                    <button
                      onClick={usePromptAsTitle}
                      className="prompt-btn"
                      style={{
                        padding: 'clamp(7px, 2vw, 11px) clamp(14px, 3.5vw, 20px)',
                        background: 'rgba(200, 175, 140, 0.15)',
                        border: '1px solid rgba(200, 175, 140, 0.35)',
                        borderRadius: 25,
                        color: 'rgba(220, 200, 170, 0.95)',
                        fontSize: 'clamp(11px, 2.8vw, 13px)',
                        fontWeight: 500,
                      }}
                    >
                      Use this
                    </button>
                  </div>
                </div>

                {/* ----- Title Input ----- */}
                <input
                  type="text"
                  className="journal-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setIsTitleFocused(true)}
                  onBlur={() => setIsTitleFocused(false)}
                  placeholder="Give this entry a title..."
                  aria-label="Entry title"
                  style={{
                    width: '100%',
                    padding: 'clamp(12px, 3.5vw, 16px) clamp(14px, 3.8vw, 20px)',
                    background: isTitleFocused 
                      ? 'rgba(255, 248, 235, 0.06)' 
                      : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isTitleFocused ? 'rgba(220, 190, 140, 0.45)' : 'rgba(200, 175, 140, 0.15)'}`,
                    borderRadius: 'clamp(9px, 2.2vw, 13px)',
                    color: 'rgba(255, 250, 240, 0.95)',
                    fontSize: 'clamp(13px, 3.5vw, 15px)',
                    marginBottom: 'clamp(10px, 2.8vw, 14px)',
                    fontFamily: 'inherit',
                    transition: 'all 0.25s ease',
                    boxShadow: isTitleFocused 
                      ? '0 0 0 3px rgba(220, 190, 140, 0.12), 0 4px 20px rgba(200, 160, 100, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.03)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                />

                {/* ----- Content Textarea ----- */}
                <textarea
                  className="journal-input"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onFocus={() => setIsContentFocused(true)}
                  onBlur={() => setIsContentFocused(false)}
                  placeholder="Begin writing... let your thoughts flow freely."
                  aria-label="Journal entry content"
                  style={{
                    width: '100%',
                    minHeight: 'clamp(140px, 35vw, 200px)',
                    padding: 'clamp(14px, 3.8vw, 20px)',
                    background: isContentFocused 
                      ? 'linear-gradient(180deg, rgba(255, 250, 240, 0.07) 0%, rgba(255, 248, 235, 0.04) 100%)' 
                      : 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.02) 100%)',
                    border: `1px solid ${isContentFocused ? 'rgba(220, 190, 140, 0.45)' : 'rgba(200, 175, 140, 0.15)'}`,
                    borderRadius: 'clamp(10px, 2.5vw, 15px)',
                    color: 'rgba(255, 250, 240, 0.92)',
                    fontSize: 'clamp(13px, 3.5vw, 15px)',
                    lineHeight: 1.75,
                    resize: 'vertical',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: 'italic',
                    transition: 'all 0.25s ease',
                    boxShadow: isContentFocused 
                      ? '0 0 0 3px rgba(220, 190, 140, 0.12), 0 8px 32px rgba(200, 160, 100, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.04)' 
                      : '0 2px 12px rgba(0, 0, 0, 0.12)',
                  }}
                />

                {/* ----- Mood Selector ----- */}
                <div style={{ marginTop: 'clamp(14px, 4vw, 22px)' }}>
                  <p
                    style={{
                      fontSize: 'clamp(11px, 3vw, 13px)',
                      color: 'rgba(255, 250, 240, 0.45)',
                      marginBottom: 'clamp(9px, 2.5vw, 13px)',
                    }}
                  >
                    How are you feeling?
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 'clamp(7px, 2vw, 11px)',
                    }}
                    role="radiogroup"
                    aria-label="Select your mood"
                  >
                    {MOOD_OPTIONS.map((mood) => (
                      <button
                        key={mood.id}
                        className="mood-btn"
                        onClick={() => handleMoodSelect(mood.id)}
                        role="radio"
                        aria-checked={selectedMood === mood.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'clamp(5px, 1.4vw, 7px)',
                          padding: 'clamp(7px, 2vw, 11px) clamp(12px, 3vw, 16px)',
                          background: selectedMood === mood.id ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                          border: `1px solid ${selectedMood === mood.id ? mood.color : 'rgba(255, 255, 255, 0.1)'}`,
                          borderRadius: 25,
                          color: selectedMood === mood.id ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                          fontSize: 'clamp(11px, 2.8vw, 13px)',
                        }}
                      >
                        <span
                          style={{
                            width: 'clamp(5px, 1.4vw, 7px)',
                            height: 'clamp(5px, 1.4vw, 7px)',
                            borderRadius: '50%',
                            background: mood.color,
                            boxShadow: selectedMood === mood.id ? `0 0 8px ${mood.color}` : 'none',
                          }}
                        />
                        {mood.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ----- Footer with Word Count & Save Button ----- */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'clamp(18px, 5vw, 28px)',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 250, 240, 0.35)',
                      fontSize: 'clamp(11px, 2.8vw, 13px)',
                    }}
                  >
                    {wordCount} {wordCount === 1 ? 'word' : 'words'}
                  </span>
                  <button
                    className="journal-btn"
                    onClick={handleSaveEntry}
                    disabled={!content.trim() || saveStatus === 'saving'}
                    style={{
                      padding: 'clamp(11px, 3vw, 15px) clamp(22px, 5.5vw, 30px)',
                      background: !content.trim()
                        ? 'rgba(100, 90, 80, 0.3)'
                        : saveStatus === 'saved'
                        ? 'linear-gradient(135deg, #6ee7b7 0%, #4ade80 100%)'
                        : 'linear-gradient(135deg, #c4a87c 0%, #9a8058 100%)',
                      border: 'none',
                      borderRadius: 30,
                      color: '#fff',
                      fontSize: 'clamp(13px, 3.2vw, 15px)',
                      fontWeight: 500,
                      boxShadow: content.trim() ? '0 4px 18px rgba(180, 150, 100, 0.28)' : 'none',
                      opacity: !content.trim() ? 0.5 : 1,
                      cursor: !content.trim() ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved ✓' : 'Save Entry'}
                  </button>
                </div>
              </div>
            )}

            {/* ================================================================== */}
            {/* ENTRIES TAB CONTENT */}
            {/* ================================================================== */}
            {activeTab === 'entries' && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {entries.length === 0 ? (
                  <div
                    style={{
                      padding: 'clamp(38px, 10vw, 65px) clamp(18px, 5vw, 38px)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 'clamp(12px, 3vw, 18px)',
                      textAlign: 'center',
                      border: '1px dashed rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <p
                      style={{
                        color: 'rgba(255, 250, 240, 0.5)',
                        marginBottom: 'clamp(10px, 3vw, 16px)',
                        fontSize: 'clamp(13px, 3.5vw, 15px)',
                      }}
                    >
                      No journal entries yet
                    </p>
                    <p
                      style={{
                        color: 'rgba(255, 250, 240, 0.3)',
                        fontSize: 'clamp(11px, 3vw, 13px)',
                      }}
                    >
                      Start writing to see your entries here
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'clamp(10px, 3vw, 16px)',
                    }}
                  >
                    {entries.map((entry) => (
                      <article
                        key={entry.id}
                        style={{
                          padding: 'clamp(14px, 4vw, 20px)',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(200, 175, 140, 0.15)',
                          borderRadius: 'clamp(10px, 2.5vw, 14px)',
                        }}
                      >
                        <header
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: 'clamp(8px, 2vw, 12px)',
                          }}
                        >
                          <h3
                            style={{
                              fontFamily: "'Cormorant Garamond', Georgia, serif",
                              fontSize: 'clamp(16px, 4vw, 20px)',
                              fontWeight: 400,
                              color: 'rgba(255, 250, 240, 0.9)',
                            }}
                          >
                            {entry.title}
                          </h3>
                          {entry.mood && (
                            <span
                              style={{
                                padding: 'clamp(3px, 0.8vw, 5px) clamp(8px, 2vw, 12px)',
                                background: `${MOOD_OPTIONS.find(m => m.id === entry.mood)?.color}22`,
                                borderRadius: 12,
                                fontSize: 'clamp(10px, 2.5vw, 12px)',
                                color: MOOD_OPTIONS.find(m => m.id === entry.mood)?.color,
                              }}
                            >
                              {MOOD_OPTIONS.find(m => m.id === entry.mood)?.label}
                            </span>
                          )}
                        </header>
                        <p
                          style={{
                            color: 'rgba(255, 250, 240, 0.6)',
                            fontSize: 'clamp(12px, 3vw, 14px)',
                            lineHeight: 1.6,
                            marginBottom: 'clamp(8px, 2vw, 12px)',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {entry.content}
                        </p>
                        <footer
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            color: 'rgba(255, 250, 240, 0.35)',
                            fontSize: 'clamp(10px, 2.5vw, 12px)',
                          }}
                        >
                          <span>{entry.wordCount} words</span>
                          <time>
                            {entry.createdAt.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </time>
                        </footer>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}