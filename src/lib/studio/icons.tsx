// ============================================================================
// STUDIO ROOM ICON COMPONENTS
// ============================================================================

import React from 'react';
import type { IconProps } from './types';

/**
 * Emotion Color Map Icon - concentric circles with radial lines
 */
export function EmotionColorMapIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <circle cx="12" cy="12" r="1.5" fill={color} opacity="0.8" />
      <path d="M12 3V5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M12 19V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M3 12H5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M19 12H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

/**
 * Zentangle Icon - flowing wave patterns
 */
export function ZentangleIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 8C5 6 7 10 9 8C11 6 13 10 15 8C17 6 19 10 21 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 12C5 10 7 14 9 12C11 10 13 14 15 12C17 10 19 14 21 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M3 16C5 14 7 18 9 16C11 14 13 18 15 16C17 14 19 18 21 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

/**
 * Mandala Icon - symmetrical circular pattern
 */
export function MandalaIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <circle cx="12" cy="12" r="1" fill={color} />
      <path d="M12 3V6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 18V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 12H6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 12H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Sketch Icon - pen/pencil drawing
 */
export function SketchIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M17 3L21 7L8 20H4V16L17 3Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 6L18 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/**
 * Craft Icon - layered triangular shapes
 */
export function CraftIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L15 8H9L12 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 8L6 16H18L15 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <path d="M6 16L4 22H20L18 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
    </svg>
  );
}

/**
 * Build Icon - grid of squares/blocks
 */
export function BuildIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5" opacity="0.8" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5" opacity="0.8" />
      <rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

/**
 * Express Icon - concentric circles (free expression)
 */
export function ExpressIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <circle cx="12" cy="12" r="1.5" fill={color} />
    </svg>
  );
}

/**
 * Category icon mapping - maps category IDs to icon components
 */
export const CATEGORY_ICONS: Record<string, React.FC<IconProps>> = {
  'art': EmotionColorMapIcon,
  'craft': CraftIcon,
  'build': BuildIcon,
  'express': ExpressIcon,
};

/**
 * Activity icon mapping - maps activity IDs to icon components
 */
export const ACTIVITY_ICONS: Record<string, React.FC<IconProps>> = {
  'emotion-colors': EmotionColorMapIcon,
  'zentangle': ZentangleIcon,
  'mandala': MandalaIcon,
  'sketch-feelings': SketchIcon,
};
