type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

/**
 * Ops Icon - gear/settings for operations
 */
export function OpsIcon({ size = 20, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" />
      <path d="M12 1V4M12 20V23M4.22 4.22L6.34 6.34M17.66 17.66L19.78 19.78M1 12H4M20 12H23M4.22 19.78L6.34 17.66M17.66 6.34L19.78 4.22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Zen Icon - radiating peaceful star
 */
export function ZenIcon({ size = 20, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="2" fill={color} opacity="0.8" />
      <path d="M12 2V6M12 18V22M22 12H18M6 12H2" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M18.36 5.64L15.54 8.46M8.46 15.54L5.64 18.36M18.36 18.36L15.54 15.54M8.46 8.46L5.64 5.64" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

/**
 * Rest Icon - crescent moon
 */
export function RestIcon({ size = 20, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Wellness Icon - heart with pulse
 */
export function WellnessIcon({ size = 20, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path 
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 20.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path d="M3 12L6 9L9 12L12 6L15 12L18 9L21 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
    </svg>
  );
}

/**
 * Journal Icon - open book with lines
 */
export function JournalIcon({ size = 20, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 7H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M8 11H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M8 15H12" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/**
 * Studio Icon - palette/creative
 */
export function StudioIcon({ size = 20, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="13.5" cy="6.5" r="4.5" stroke={color} strokeWidth="1.5" />
      <path 
        d="M3.22 12.58C2.48 13.32 2.48 14.53 3.22 15.27L8.73 20.78C9.47 21.52 10.68 21.52 11.42 20.78L21.78 10.42C22.52 9.68 22.52 8.47 21.78 7.73L16.27 2.22C15.53 1.48 14.32 1.48 13.58 2.22L3.22 12.58Z" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <circle cx="8" cy="16" r="1.5" fill={color} opacity="0.6" />
      <circle cx="12" cy="12" r="1.5" fill={color} opacity="0.4" />
      <circle cx="16" cy="8" r="1.5" fill={color} opacity="0.3" />
    </svg>
  );
}

/**
 * Library Icon - stacked books
 */
export function LibraryIcon({ size = 20, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 2V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <path d="M8 6H10" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M8 10H10" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M14 6H18" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M14 10H18" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/**
 * Languages Icon - globe with speech
 */
export function LanguagesIcon({ size = 20, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
      <path d="M2 12H22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 2C14.5 4.5 16 8 16 12C16 16 14.5 19.5 12 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 2C9.5 4.5 8 8 8 12C8 16 9.5 19.5 12 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Chevron Right Icon
 */
export function ChevronRightIcon({ size = 16, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <polyline points="9 18 15 12 9 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Chevron Down Icon
 */
export function ChevronDownIcon({ size = 16, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <polyline points="6 9 12 15 18 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Plus Icon
 */
export function PlusIcon({ size = 18, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Close Icon
 */
export function CloseIcon({ size = 18, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Shield Icon - trust/transparency
 */
export function ShieldIcon({ size = 20, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Brain Icon - memory
 */
export function BrainIcon({ size = 20, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 4.5C10.5 4.5 9.5 5.5 9.5 7C9.5 8.5 10.5 9.5 12 9.5C13.5 9.5 14.5 8.5 14.5 7C14.5 5.5 13.5 4.5 12 4.5Z" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <path d="M9.5 7C7.5 7 6 8.5 6 10.5C6 12.5 7.5 14 9.5 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M14.5 7C16.5 7 18 8.5 18 10.5C18 12.5 16.5 14 14.5 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M9.5 14C9.5 16 10.5 17.5 12 17.5C13.5 17.5 14.5 16 14.5 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Trash Icon
 */
export function TrashIcon({ size = 16, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 6H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="10" y1="11" x2="10" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="11" x2="14" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}