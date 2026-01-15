'use client';

// ============================================================================
// ELEGANT ICONS FOR CREATIVE STUDIO
// Minimal, refined SVG icons - no emojis, no cartoonish elements
// ============================================================================

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Emotion Color Map - Gradient circle / color wheel concept
export function EmotionColorMapIcon({ size = 24, color = 'currentColor', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="12" cy="12" r="5" stroke={color} strokeWidth={strokeWidth} opacity="0.6" />
      <circle cx="12" cy="12" r="1.5" fill={color} opacity="0.8" />
      {/* Radiating lines suggesting color/emotion spread */}
      <path d="M12 3V5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.4" />
      <path d="M12 19V21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.4" />
      <path d="M3 12H5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.4" />
      <path d="M19 12H21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

// Zentangle Patterns - Flowing repetitive lines
export function ZentangleIcon({ size = 24, color = 'currentColor', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Flowing wave patterns */}
      <path 
        d="M3 8C5 6 7 10 9 8C11 6 13 10 15 8C17 6 19 10 21 8" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
        fill="none"
      />
      <path 
        d="M3 12C5 10 7 14 9 12C11 10 13 14 15 12C17 10 19 14 21 12" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path 
        d="M3 16C5 14 7 18 9 16C11 14 13 18 15 16C17 14 19 18 21 16" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}

// Mandala Creation - Symmetrical radiating pattern
export function MandalaIcon({ size = 24, color = 'currentColor', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} opacity="0.3" />
      <circle cx="12" cy="12" r="6" stroke={color} strokeWidth={strokeWidth} opacity="0.5" />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} opacity="0.7" />
      <circle cx="12" cy="12" r="1" fill={color} />
      {/* Petal hints */}
      <path d="M12 3V6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M12 18V21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M3 12H6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M18 12H21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M5.64 5.64L7.76 7.76" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.6" />
      <path d="M16.24 16.24L18.36 18.36" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.6" />
      <path d="M5.64 18.36L7.76 16.24" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.6" />
      <path d="M16.24 7.76L18.36 5.64" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

// Sketch Your Day - Simple pencil line / gesture
export function SketchIcon({ size = 24, color = 'currentColor', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pencil body - elegant diagonal */}
      <path 
        d="M17 3L21 7L8 20H4V16L17 3Z" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      {/* Pencil tip detail */}
      <path 
        d="M14 6L18 10" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

// Gratitude Garden - Simple growing plant/leaf
export function GratitudeGardenIcon({ size = 24, color = 'currentColor', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stem */}
      <path 
        d="M12 21V12" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
      />
      {/* Leaves */}
      <path 
        d="M12 12C12 12 8 10 8 6C8 6 12 8 12 12" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path 
        d="M12 12C12 12 16 10 16 6C16 6 12 8 12 12" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.7"
      />
      {/* Small bud at top */}
      <path 
        d="M12 8C12 8 10 5 12 3C14 5 12 8 12 8Z" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

// Breath Visualization - Expanding circles / breath
export function BreathIcon({ size = 24, color = 'currentColor', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="12" cy="12" r="6" stroke={color} strokeWidth={strokeWidth} opacity="0.5" />
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} opacity="0.25" />
    </svg>
  );
}

// Sound Journey - Sound wave / frequency
export function SoundJourneyIcon({ size = 24, color = 'currentColor', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 12V14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.4" />
      <path d="M7 10V14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.6" />
      <path d="M10 7V17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.8" />
      <path d="M13 5V19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M16 8V16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.8" />
      <path d="M19 10V14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

// Memory Collage - Overlapping frames
export function MemoryCollageIcon({ size = 24, color = 'currentColor', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="12" height="12" rx="1" stroke={color} strokeWidth={strokeWidth} opacity="0.4" />
      <rect x="6" y="4" width="12" height="12" rx="1" stroke={color} strokeWidth={strokeWidth} opacity="0.6" />
      <rect x="9" y="8" width="12" height="12" rx="1" stroke={color} strokeWidth={strokeWidth} />
    </svg>
  );
}

// Word Cloud - Scattered text/words concept
export function WordCloudIcon({ size = 24, color = 'currentColor', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 8H10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.5" />
      <path d="M6 12H14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M3 16H9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.6" />
      <path d="M14 8H20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.7" />
      <path d="M16 16H21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

// Poetry Flow - Flowing lines like verse
export function PoetryIcon({ size = 24, color = 'currentColor', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 6H15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M7 10H19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.7" />
      <path d="M5 14H13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.8" />
      <path d="M9 18H17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

// Vision Board - Grid with intention
export function VisionBoardIcon({ size = 24, color = 'currentColor', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth={strokeWidth} opacity="0.6" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth={strokeWidth} opacity="0.8" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth={strokeWidth} opacity="0.8" />
      <rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth={strokeWidth} opacity="0.6" />
    </svg>
  );
}

// Movement Trace - Flowing body movement
export function MovementIcon({ size = 24, color = 'currentColor', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M4 17C6 15 8 19 10 15C12 11 14 20 16 14C18 8 20 12 22 10" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="4" cy="17" r="1.5" fill={color} opacity="0.5" />
      <circle cx="22" cy="10" r="1.5" fill={color} />
    </svg>
  );
}

// Texture Exploration - Layered abstract shapes
export function TextureIcon({ size = 24, color = 'currentColor', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="5" stroke={color} strokeWidth={strokeWidth} opacity="0.4" />
      <circle cx="16" cy="10" r="5" stroke={color} strokeWidth={strokeWidth} opacity="0.6" />
      <circle cx="10" cy="16" r="5" stroke={color} strokeWidth={strokeWidth} opacity="0.8" />
    </svg>
  );
}

// ============================================================================
// ICON MAP - Easy lookup by activity ID
// ============================================================================
export const ACTIVITY_ICONS: Record<string, React.FC<IconProps>> = {
  'emotion-color-map': EmotionColorMapIcon,
  'zentangle': ZentangleIcon,
  'mandala': MandalaIcon,
  'sketch-your-day': SketchIcon,
  'gratitude-garden': GratitudeGardenIcon,
  'breath-visualization': BreathIcon,
  'sound-journey': SoundJourneyIcon,
  'memory-collage': MemoryCollageIcon,
  'word-cloud': WordCloudIcon,
  'poetry': PoetryIcon,
  'vision-board': VisionBoardIcon,
  'movement': MovementIcon,
  'texture': TextureIcon,
};

// Helper component to render icon by ID
export function ActivityIcon({ 
  id, 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 1.5 
}: { id: string } & IconProps) {
  const Icon = ACTIVITY_ICONS[id];
  if (!Icon) return null;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}