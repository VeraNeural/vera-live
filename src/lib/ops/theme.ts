// ============================================================================
// OPS ROOM THEME & COLOR SYSTEM
// ============================================================================

import type { TimeOfDay } from './types';

export const TIME_COLORS = {
  morning: {
    bg: 'linear-gradient(180deg, #f2efea 0%, #e8dfd0 30%, #ded2bb 100%)',
    accent: '#d4a574',
    text: 'rgba(45, 35, 25, 0.95)',
    textMuted: 'rgba(65, 55, 45, 0.65)',
    cardBg: 'rgba(255, 255, 255, 0.85)',
    cardBorder: 'rgba(45, 35, 25, 0.12)',
    glow: 'rgba(255, 200, 120, 0.2)',
  },
  afternoon: {
    bg: 'linear-gradient(180deg, #ede9e4 0%, #ddd4c5 30%, #cfc2ad 100%)',
    accent: '#c49a6c',
    text: 'rgba(40, 30, 20, 0.95)',
    textMuted: 'rgba(60, 50, 40, 0.7)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(40, 30, 20, 0.15)',
    glow: 'rgba(255, 180, 100, 0.15)',
  },
  evening: {
    bg: 'linear-gradient(180deg, #1e1a28 0%, #15121c 50%, #0e0b14 100%)',
    accent: '#c9a87c',
    text: 'rgba(255, 250, 240, 0.9)',
    textMuted: 'rgba(255, 250, 240, 0.45)',
    cardBg: 'rgba(255, 255, 255, 0.06)',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    glow: 'rgba(255, 180, 100, 0.08)',
  },
  night: {
    bg: 'linear-gradient(180deg, #0a0810 0%, #06050a 50%, #030305 100%)',
    accent: '#a08060',
    text: 'rgba(255, 250, 245, 0.85)',
    textMuted: 'rgba(255, 250, 245, 0.35)',
    cardBg: 'rgba(255, 255, 255, 0.04)',
    cardBorder: 'rgba(255, 255, 255, 0.06)',
    glow: 'rgba(255, 200, 120, 0.05)',
  },
};

export const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};
