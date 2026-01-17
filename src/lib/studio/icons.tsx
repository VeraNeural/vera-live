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
 * Sound Icon - wave + note
 */
export function SoundIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 14C6 12 8 16 10 14C12 12 14 16 16 14C18 12 20 16 22 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 4V13.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M15 4C17.5 5.2 19 6.4 19 8.2C19 10 17.8 11.2 15 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <circle cx="13" cy="15.5" r="1.6" stroke={color} strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
}

/**
 * Written Icon - page + pen
 */
export function WrittenIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 3H16C18 3 19 4 19 6V18C19 20 18 21 16 21H7C5 21 4 20 4 18V6C4 4 5 3 7 3Z" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <path d="M7.5 8H15.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M7.5 12H13.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M14.5 14.5L20.5 8.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13.8 16.2L14.5 14.5L16.2 15.2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Body Icon - simple figure
 */
export function BodyIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="6.5" r="2.2" stroke={color} strokeWidth="1.5" />
      <path d="M7 20C7 15.8 8.8 12.5 12 12.5C15.2 12.5 17 15.8 17 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.5 12.5C8.2 11.5 9.8 11 12 11C14.2 11 15.8 11.5 17.5 12.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

/**
 * Ambient Creator Icon - sliders
 */
export function AmbientCreatorIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 4V20" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M12 4V20" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M18 4V20" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <rect x="4.5" y="7" width="3" height="4" rx="1" stroke={color} strokeWidth="1.5" />
      <rect x="10.5" y="12" width="3" height="4" rx="1" stroke={color} strokeWidth="1.5" />
      <rect x="16.5" y="8.5" width="3" height="4" rx="1" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Hum & Tone Icon - wave ring
 */
export function HumToneIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3.2" stroke={color} strokeWidth="1.5" />
      <path d="M4 12C6 9 8 15 10 12C12 9 14 15 16 12C18 9 20 15 22 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

/**
 * Sound Bath Icon - bowl waves
 */
export function SoundBathIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 14C6 18 8.5 20 12 20C15.5 20 18 18 18 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 14H19" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M8 9C9.5 7.5 10.5 10.5 12 9C13.5 7.5 14.5 10.5 16 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

/**
 * Playlist Builder Icon - list + play
 */
export function PlaylistBuilderIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 7H13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 11H13" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M5 15H13" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M16 10.5V16.5L20 13.5L16 10.5Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Brain Dump Icon - cloud
 */
export function BrainDumpIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M8.5 18H16.5C19 18 21 16 21 13.5C21 11.4 19.7 9.7 17.8 9.2C17.2 6.8 15.1 5 12.6 5C10.2 5 8.2 6.6 7.4 8.8C5.5 9.3 4 11 4 13C4 15.8 6.2 18 8.5 18Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 14H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

/**
 * Unsent Letter Icon - envelope
 */
export function UnsentLetterIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 8C4 6.9 4.9 6 6 6H18C19.1 6 20 6.9 20 8V16C20 17.1 19.1 18 18 18H6C4.9 18 4 17.1 4 16V8Z" stroke={color} strokeWidth="1.5" />
      <path d="M4.8 7.2L12 12.5L19.2 7.2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}

/**
 * Stream of Consciousness Icon - flowing line
 */
export function StreamOfConsciousnessIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 10C5.5 7.5 7.5 12.5 10 10C12.5 7.5 14.5 12.5 17 10C19.5 7.5 21.5 12.5 24 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 14C5.5 11.5 7.5 16.5 10 14C12.5 11.5 14.5 16.5 17 14C19.5 11.5 21.5 16.5 24 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

/**
 * Burn List Icon - flame
 */
export function BurnListIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3C10 6 14 7 12.5 10C11.5 12 9 12.5 9 15C9 17.5 10.8 20 12.9 20C15.4 20 17 17.8 17 15.5C17 12 14.5 11 15 8.5C15.4 6.7 16.7 5.5 18 4.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Shake It Out Icon - motion lines
 */
export function ShakeItOutIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 7L9 9L7 11L9 13L7 15L9 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 7L15 9L17 11L15 13L17 15L15 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <path d="M12 6V18" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/**
 * Movement Prompt Icon - arrows
 */
export function MovementPromptIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 12H17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 9L17 12L14 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 9L7 12L10 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}

/**
 * Posture Reset Icon - spine line
 */
export function PostureResetIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 4C10.5 5.5 13.5 7 12 8.5C10.5 10 13.5 11.5 12 13C10.5 14.5 13.5 16 12 17.5C10.8 18.7 11.6 19.8 12 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 6H10" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M14 6H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/**
 * Hand Release Icon - open hand
 */
export function HandReleaseIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 12V7.5C7 6.7 7.7 6 8.5 6C9.3 6 10 6.7 10 7.5V12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 12V6.8C10 6.1 10.6 5.5 11.3 5.5C12 5.5 12.6 6.1 12.6 6.8V12" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
      <path d="M12.6 12V7.5C12.6 6.8 13.2 6.2 13.9 6.2C14.6 6.2 15.2 6.8 15.2 7.5V12" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
      <path d="M15.2 12V8.8C15.2 8.1 15.8 7.5 16.5 7.5C17.2 7.5 17.8 8.1 17.8 8.8V14.2C17.8 18 15.8 20 12.5 20C9.2 20 7 17.8 7 14.8V12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
  'sound': SoundIcon,
  'written': WrittenIcon,
  'body': BodyIcon,
};

/**
 * Activity icon mapping - maps activity IDs to icon components
 */
export const ACTIVITY_ICONS: Record<string, React.FC<IconProps>> = {
  'emotion-colors': EmotionColorMapIcon,
  'zentangle': ZentangleIcon,
  'mandala': MandalaIcon,
  'sketch-feelings': SketchIcon,

  // Sound & Vibe
  'ambient-creator': AmbientCreatorIcon,
  'hum-tone': HumToneIcon,
  'sound-bath': SoundBathIcon,
  'playlist-builder': PlaylistBuilderIcon,

  // Written Release
  'brain-dump': BrainDumpIcon,
  'unsent-letter': UnsentLetterIcon,
  'stream-of-consciousness': StreamOfConsciousnessIcon,
  'burn-list': BurnListIcon,

  // Body Expression
  'shake-it-out': ShakeItOutIcon,
  'movement-prompt': MovementPromptIcon,
  'posture-reset': PostureResetIcon,
  'hand-release': HandReleaseIcon,
};
