// ============================================================================
// STUDIO ROOM THEME & STYLING
// ============================================================================

import type { ThemeColors, StudioColors } from './types';

/**
 * Transform global theme colors into Studio-specific color palette
 */
export function getStudioColors(theme: ThemeColors): StudioColors {
  return {
    bg: theme.bg,
    text: theme.text,
    textMuted: theme.textMuted,
    textDim: theme.textMuted,
    cardBg: theme.cardBg,
    cardBorder: theme.cardBorder,
    accent: theme.accent,
    accentSecondary: theme.accent,
    accentDim: theme.accent,
    accentGlow: theme.glow,
  };
}

/**
 * Global CSS styles for Studio Room
 */
export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }
  
  html, body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.7; }
  }

  .card-btn {
    transition: transform 0.2s ease, background 0.2s ease;
  }
  .card-btn:active {
    transform: scale(0.97);
  }

  .tab-btn {
    transition: all 0.2s ease;
  }
  .tab-btn:active {
    transform: scale(0.96);
  }

  .studio-scroll::-webkit-scrollbar {
    width: 3px;
  }
  .studio-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .studio-scroll::-webkit-scrollbar-thumb {
    background: rgba(168, 85, 247, 0.2);
    border-radius: 3px;
  }
`;
