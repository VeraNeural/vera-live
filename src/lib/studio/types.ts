// ============================================================================
// STUDIO ROOM TYPE DEFINITIONS
// ============================================================================

import type { ComponentType } from 'react';

export interface CreativeStudioProps {
  onBack: () => void;
  onStartActivity?: (activityId: string) => void;
}

export type Tab = 'activities' | 'projects';

export type ActivityCategory = 'art' | 'craft' | 'build' | 'express' | 'sound' | 'written' | 'body';

// Alias used in some parts of the UI/codebase (category selection).
export type CategoryId = ActivityCategory;

export type Activity = {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: ActivityCategory;
  hasExperience?: boolean; // true if we've built the actual experience
};

export type CategoryItem = {
  id: string;
  title: string;
  description: string;
  count: number;
};

export interface IconProps {
  size?: number;
  color?: string;
}

export type ThemeColors = {
  bg: string;
  accent: string;
  text: string;
  textMuted: string;
  cardBg: string;
  cardBorder: string;
  glow: string;
};

export type StudioColors = {
  bg: string;
  text: string;
  textMuted: string;
  textDim: string;
  cardBg: string;
  cardBorder: string;
  accent: string;
  accentSecondary: string;
  accentDim: string;
  accentGlow: string;
};
