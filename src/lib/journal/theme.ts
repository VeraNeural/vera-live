// ============================================================================
// JOURNAL ROOM THEME & STYLING
// ============================================================================

/**
 * Global CSS styles for Journal Room
 * Includes cozy library-like atmosphere with animations and responsive design
 */
export const GLOBAL_STYLES = `
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
