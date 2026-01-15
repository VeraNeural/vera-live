'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============================================================================
// TYPES
// ============================================================================
type ThemeMode = 'light' | 'auto' | 'dark';
type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
  timeOfDay: TimeOfDay;
  colors: typeof TIME_COLORS.morning;
}

// ============================================================================
// COLOR CONSTANTS
// ============================================================================
const TIME_COLORS = {
  morning: {
    bg: 'linear-gradient(180deg, #f8f5f0 0%, #f0e8dc 30%, #e8dcc8 100%)',
    accent: '#d4a574',
    text: 'rgba(60, 50, 40, 0.9)',
    textMuted: 'rgba(60, 50, 40, 0.5)',
    cardBg: 'rgba(255, 255, 255, 0.75)',
    cardBorder: 'rgba(0, 0, 0, 0.06)',
    glow: 'rgba(255, 200, 120, 0.2)',
  },
  afternoon: {
    bg: 'linear-gradient(180deg, #f5f2ed 0%, #ebe3d5 30%, #dfd5c2 100%)',
    accent: '#c49a6c',
    text: 'rgba(55, 45, 35, 0.9)',
    textMuted: 'rgba(55, 45, 35, 0.45)',
    cardBg: 'rgba(255, 255, 255, 0.7)',
    cardBorder: 'rgba(0, 0, 0, 0.05)',
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

// ============================================================================
// HELPER
// ============================================================================
const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

// ============================================================================
// CONTEXT
// ============================================================================
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('auto');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeOfDay(getTimeOfDay());

    // Load saved preference
    const saved = localStorage.getItem('vera-theme') as ThemeMode | null;
    if (saved && ['light', 'auto', 'dark'].includes(saved)) {
      setMode(saved);
    }

    // Update time periodically
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Save preference when changed
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('vera-theme', mode);
    }
  }, [mode, mounted]);

  // Calculate isDark based on mode
  const isDark = mode === 'dark'
    ? true
    : mode === 'light'
      ? false
      : (timeOfDay === 'evening' || timeOfDay === 'night');

  // Get colors based on dark mode and time
  const colors = isDark ? TIME_COLORS.evening : TIME_COLORS[timeOfDay];

  return (
    <ThemeContext.Provider value={{ mode, setMode, isDark, timeOfDay, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// ============================================================================
// TOGGLE COMPONENT
// ============================================================================
export function ThemeToggle() {
  const { mode, setMode, isDark, colors } = useTheme();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}>
      <span style={{
        fontSize: 12,
        color: colors.textMuted,
        fontWeight: 500,
        textTransform: 'capitalize',
      }}>
        {mode}
      </span>

      <div style={{
        display: 'flex',
        gap: 4,
        padding: 4,
        background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        borderRadius: 20,
      }}>
        {(['light', 'auto', 'dark'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            aria-label={`${m} mode`}
            style={{
              padding: '6px 12px',
              borderRadius: 16,
              border: 'none',
              background: mode === m
                ? (isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.9)')
                : 'transparent',
              color: mode === m ? colors.text : colors.textMuted,
              fontSize: 11,
              fontWeight: mode === m ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: mode === m
                ? (isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)')
                : 'none',
            }}
          >
            {m === 'auto' ? '◐' : m === 'light' ? '○' : '●'}
          </button>
        ))}
      </div>
    </div>
  );
}

// Export colors for use elsewhere
export { TIME_COLORS };
export type { ThemeMode, TimeOfDay };