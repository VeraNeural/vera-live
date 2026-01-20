import type { CSSProperties } from 'react';

export interface OpsRoomColors {
  bg: string;
  accent: string;
  text: string;
  textMuted: string;
  cardBg: string;
  cardBorder: string;
  glow: string;
}

export const createStyles = (colors: OpsRoomColors, isDark: boolean) => ({
  // Container styles
  container: {
    position: 'fixed' as const,
    inset: 0,
    background: colors.bg,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },

  ambientBackground: {
    position: 'absolute' as const,
    inset: 0,
    pointerEvents: 'none' as const,
    overflow: 'hidden',
  },

  ambientGradient: {
    position: 'absolute' as const,
    top: '-10%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'min(120vw, 700px)',
    height: 'min(80vh, 500px)',
    background: isDark
      ? 'radial-gradient(ellipse at 50% 30%, rgba(255, 180, 100, 0.08) 0%, transparent 70%)'
      : 'radial-gradient(ellipse at 50% 30%, rgba(255, 220, 180, 0.4) 0%, transparent 70%)',
    borderRadius: '50%',
  },

  // Header styles
  header: {
    padding: '16px',
    paddingTop: 'max(16px, env(safe-area-inset-top))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50,
  },

  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 18px',
    background: colors.cardBg,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: 50,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    color: colors.textMuted,
  },

  themeButtonContainer: {
    display: 'flex',
    gap: 8,
  },

  themeButton: (isActive: boolean) => ({
    padding: '8px 12px',
    borderRadius: 20,
    border: `1px solid ${isActive ? colors.accent : colors.cardBorder}`,
    background: isActive ? (isDark ? 'rgba(255,180,100,0.1)' : 'rgba(200,160,100,0.15)') : 'transparent',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 500,
    color: isActive ? colors.accent : colors.textMuted,
  }),

  // Content area
  contentArea: (isLoaded: boolean) => ({
    flex: 1,
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '20px 20px 40px',
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.4s ease-out',
  }),

  // Welcome screen
  welcomeContainer: {
    textAlign: 'center' as const,
    marginBottom: 28,
  },

  welcomeTitle: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 40,
    fontWeight: 300,
    color: colors.text,
    marginBottom: 8,
  },

  welcomeSubtitle: {
    fontSize: 15,
    color: colors.textMuted,
  },

  // Card container
  cardContainer: {
    width: '100%',
    maxWidth: 700,
    marginTop: 18,
  },

  card: {
    padding: '16px',
    borderRadius: 16,
    background: colors.cardBg,
    border: `1px solid ${colors.cardBorder}`,
  },

  cardLabel: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    color: colors.textMuted,
    marginBottom: 10,
  },

  buttonGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 8,
  },

  pillButton: (isActive: boolean) => ({
    padding: '8px 14px',
    borderRadius: 999,
    border: `1px solid ${isActive ? colors.accent : colors.cardBorder}`,
    background: isActive
      ? (isDark ? 'rgba(255,180,100,0.1)' : 'rgba(200,160,100,0.15)')
      : 'transparent',
    color: isActive ? colors.text : colors.textMuted,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  }),

  // Activity selection
  activityContainer: {
    width: '100%',
    maxWidth: 600,
    animation: 'fadeIn 0.4s ease-out',
  },

  activityHeader: {
    textAlign: 'center' as const,
    marginBottom: 24,
  },

  activityTitle: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 28,
    fontWeight: 300,
    color: colors.text,
    marginBottom: 8,
  },

  activityDescription: {
    fontSize: 14,
    color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(30,30,30,0.7)',
  },

  separator: {
    height: 1,
    background: isDark ? 'rgba(235, 210, 180, 0.12)' : 'rgba(140, 110, 80, 0.12)',
    margin: '0 0 18px 0',
  },

  optionsGrid: {
    display: 'grid',
    gap: 12,
  },

  optionCard: (isHovering: boolean) => ({
    padding: '18px',
    borderRadius: 14,
    background: colors.cardBg,
    border: `1px solid ${colors.cardBorder}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: isHovering ? `0 4px 12px ${colors.glow}` : 'none',
  }),

  optionCardContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
  },

  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: isDark ? 'rgba(255, 180, 100, 0.12)' : 'rgba(200, 160, 100, 0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  optionTextContainer: {
    flex: 1,
  },

  optionTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: colors.text,
    marginBottom: 4,
  },

  optionDescription: {
    fontSize: 13,
    color: colors.textMuted,
  },

  // Output area
  outputContainer: (hasMarginTop: boolean = true) => ({
    width: '100%',
    maxWidth: 700,
    marginTop: hasMarginTop ? 24 : 0,
    animation: 'fadeIn 0.4s ease-out',
  }),

  generatingCard: {
    padding: '16px',
    borderRadius: 16,
    background: colors.cardBg,
    border: `1px solid ${colors.cardBorder}`,
  },

  generatingContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '18px 20px',
    borderRadius: 14,
    background: colors.cardBg,
    border: `1px solid ${colors.cardBorder}`,
  },

  generatingSpinner: {
    width: 20,
    height: 20,
    borderRadius: '50%',
  },

  generatingText: {
    fontSize: 14,
    color: colors.textMuted,
    margin: 0,
  },

  outputCard: {
    padding: '16px',
    borderRadius: 16,
    background: colors.cardBg,
    border: `1px solid ${colors.cardBorder}`,
  },

  outputArea: (minHeight: number = 120, maxHeight: string = '60vh') => ({
    padding: '20px',
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
    borderRadius: 10,
    minHeight,
    maxHeight,
    overflowY: 'auto' as const,
    color: colors.text,
    fontSize: 14,
    lineHeight: 1.6,
  }),

  // Button styles
  actionButtonsContainer: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap' as const,
    marginTop: 14,
    justifyContent: 'center',
  },

  primaryButton: (disabled: boolean = false) => ({
    padding: '10px 20px',
    borderRadius: 8,
    border: 'none',
    background: disabled ? (isDark ? 'rgb(55 65 81)' : 'rgb(229 231 235)') : 'rgb(217 119 6)',
    color: disabled ? (isDark ? 'rgb(156 163 175)' : 'rgb(107 114 128)') : 'white',
    fontSize: 14,
    fontWeight: 500,
    cursor: disabled ? 'default' : 'pointer',
    boxShadow: disabled ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
  }),

  secondaryButton: {
    padding: '10px 20px',
    borderRadius: 8,
    border: `1px solid ${isDark ? 'rgb(156 163 175)' : 'rgb(209 213 219)'}`,
    background: 'transparent',
    color: isDark ? 'rgb(209 213 219)' : 'rgb(75 85 99)',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  accentButton: (disabled: boolean = false) => ({
    padding: '10px 20px',
    borderRadius: 8,
    border: '1px solid rgb(245 158 11)',
    background: 'transparent',
    color: 'rgb(245 158 11)',
    fontSize: 14,
    fontWeight: 500,
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
  }),

  outlineButton: {
    padding: '10px 20px',
    borderRadius: 8,
    border: '1px solid rgb(251 191 36)',
    background: 'transparent',
    color: 'rgb(251 191 36)',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  // Copy button
  copyButton: (disabled: boolean = false) => ({
    padding: '6px 10px',
    borderRadius: 8,
    border: `1px solid ${colors.cardBorder}`,
    background: colors.cardBg,
    cursor: disabled ? 'default' : 'pointer',
    fontSize: 12,
    fontWeight: 500,
    color: disabled ? colors.textMuted : colors.text,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  }),

  // Collapsible section
  collapsibleHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  collapsibleToggle: {
    padding: '4px 10px',
    borderRadius: 6,
    border: `1px solid ${colors.cardBorder}`,
    background: 'transparent',
    color: colors.textMuted,
    fontSize: 12,
    cursor: 'pointer',
  },

  // Miscellaneous
  marginTop: (value: number) => ({
    marginTop: value,
  }),

  flexContainer: {
    display: 'flex',
    gap: 12,
  },

  fullWidth: {
    width: '100%',
  },

  divider: (color: string) => ({
    height: 1,
    background: color,
    marginBottom: 16,
  }),
});

export type OpsRoomStyles = ReturnType<typeof createStyles>;
