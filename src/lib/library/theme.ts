// ============================================================================
// LIBRARY ROOM THEME DEFINITIONS
// ============================================================================

export type ThemeColors = {
  bg: string;
  accent: string;
  text: string;
  textMuted: string;
  cardBg: string;
  cardBorder: string;
  glow: string;
};

export type LibraryColors = {
  bg: string;
  text: string;
  textMuted: string;
  textDim: string;
  cardBg: string;
  cardBorder: string;
  accent: string;
  accentDim: string;
  warmGlow: string;
};

export const getLibraryColors = (theme: ThemeColors): LibraryColors => {
  return {
    bg: theme.bg,
    text: theme.text,
    textMuted: theme.textMuted,
    textDim: theme.textMuted,
    cardBg: theme.cardBg,
    cardBorder: theme.cardBorder,
    accent: theme.accent,
    accentDim: theme.accent,
    warmGlow: theme.glow,
  };
};
