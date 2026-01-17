// ============================================================================
// LIBRARY ROOM ICON COMPONENTS
// ============================================================================

import React from 'react';

// Stories Category Icons
export const StoryCategoryIcon = ({ type, color }: { type: string; color: string }) => {
  const icons: Record<string, React.ReactNode> = {
    'rest-sleep': (
      <svg viewBox="0 0 24 24" width="20" height="20">
        {/* Moon with stars - represents rest and sleep */}
        <path 
          d="M12 3C7 3 3 7 3 12s4 9 9 9c1.5 0 2.9-.3 4.2-.9-3.5-1-6.2-4.2-6.2-8.1 0-3.9 2.7-7.1 6.2-8.1C14.9 3.3 13.5 3 12 3z" 
          fill="none" 
          stroke={color} 
          strokeWidth="1.5" 
        />
        <circle cx="17" cy="6" r="1" fill={color} opacity="0.6" />
        <circle cx="20" cy="10" r="0.7" fill={color} opacity="0.4" />
        <circle cx="18" cy="14" r="0.5" fill={color} opacity="0.3" />
      </svg>
    ),
    'guided-journeys': (
      <svg viewBox="0 0 24 24" width="20" height="20">
        {/* Compass/path - represents journeys */}
        <circle cx="12" cy="12" r="8" fill="none" stroke={color} strokeWidth="1.5" />
        <path 
          d="M12 12L16 8L12 16L8 8L12 12" 
          fill={color} 
          opacity="0.4" 
          stroke={color} 
          strokeWidth="1" 
        />
        <circle cx="12" cy="12" r="1.5" fill={color} opacity="0.6" />
      </svg>
    ),
    'meditative-tales': (
      <svg viewBox="0 0 24 24" width="20" height="20">
        {/* Lotus flower - represents meditation */}
        <ellipse cx="12" cy="16" rx="6" ry="3" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
        <path 
          d="M12 5C12 5 8 9 8 12C8 14 10 15 12 15C14 15 16 14 16 12C16 9 12 5 12 5Z" 
          fill="none" 
          stroke={color} 
          strokeWidth="1.5" 
        />
        <path d="M12 15L12 19" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <path 
          d="M7 10C7 10 5 12 6 14" 
          fill="none" 
          stroke={color} 
          strokeWidth="1.5" 
          strokeLinecap="round"
          opacity="0.4"
        />
        <path 
          d="M17 10C17 10 19 12 18 14" 
          fill="none" 
          stroke={color} 
          strokeWidth="1.5" 
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
    ),
    'rise-ready': (
      <svg viewBox="0 0 24 24" width="20" height="20">
        {/* Rising sun - represents new beginnings and confidence */}
        <path 
          d="M4 18h16" 
          stroke={color} 
          strokeWidth="1.5" 
          strokeLinecap="round" 
        />
        <path 
          d="M12 14C15.3 14 18 11.3 18 8" 
          fill="none" 
          stroke={color} 
          strokeWidth="1.5" 
          strokeLinecap="round"
        />
        <path 
          d="M6 8C6 11.3 8.7 14 12 14" 
          fill="none" 
          stroke={color} 
          strokeWidth="1.5" 
          strokeLinecap="round"
        />
        <path d="M12 4L12 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 6L7.5 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <path d="M18 6L16.5 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <path d="M3 11L5 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M19 11L21 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
  };

  return icons[type] || null;
};

// Learn Category Icons
export const LearnCategoryIcon = ({ type, color }: { type: string; color: string }) => {
  const icons: Record<string, React.ReactNode> = {
    'nervous-system': (
      <svg viewBox="0 0 24 24" width="20" height="20">
        {/* Brain/neural pathways - represents nervous system */}
        <circle cx="12" cy="8" r="5" fill="none" stroke={color} strokeWidth="1.5" />
        <path 
          d="M9 7C9 7 10 9 12 9C14 9 15 7 15 7" 
          fill="none" 
          stroke={color} 
          strokeWidth="1.5" 
          strokeLinecap="round"
          opacity="0.6"
        />
        <path d="M12 13L12 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 17L9 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <path d="M12 17L15 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="10" cy="6" r="1" fill={color} opacity="0.4" />
        <circle cx="14" cy="6" r="1" fill={color} opacity="0.4" />
      </svg>
    ),
    'emotions': (
      <svg viewBox="0 0 24 24" width="20" height="20">
        {/* Heart with wave - represents emotions */}
        <path 
          d="M12 6C12 6 8 2 5 5C2 8 5 12 12 19C19 12 22 8 19 5C16 2 12 6 12 6Z" 
          fill="none" 
          stroke={color} 
          strokeWidth="1.5" 
        />
        <path 
          d="M7 10L9 10L10 8L12 12L14 9L15 10L17 10" 
          fill="none" 
          stroke={color} 
          strokeWidth="1.5" 
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
      </svg>
    ),
    'rest-science': (
      <svg viewBox="0 0 24 24" width="20" height="20">
        {/* Wave pattern with Zs - represents rest science */}
        <path 
          d="M3 12C5 9 7 15 9 12C11 9 13 15 15 12C17 9 19 15 21 12" 
          fill="none" 
          stroke={color} 
          strokeWidth="1.5" 
          strokeLinecap="round"
        />
        <text x="14" y="8" fill={color} fontSize="6" fontWeight="bold" opacity="0.6">z</text>
        <text x="17" y="6" fill={color} fontSize="5" fontWeight="bold" opacity="0.4">z</text>
        <text x="19" y="4" fill={color} fontSize="4" fontWeight="bold" opacity="0.3">z</text>
      </svg>
    ),
    'resilience': (
      <svg viewBox="0 0 24 24" width="20" height="20">
        {/* Tree/growth - represents resilience */}
        <path d="M12 21L12 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path 
          d="M12 12C12 12 6 12 6 8C6 4 12 3 12 3C12 3 18 4 18 8C18 12 12 12 12 12Z" 
          fill="none" 
          stroke={color} 
          strokeWidth="1.5" 
        />
        <path d="M9 15L12 12L15 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <circle cx="12" cy="7" r="2" fill={color} opacity="0.3" />
      </svg>
    ),
  };

  return icons[type] || null;
};

// Discover Assessment Icons
export const AssessmentIcon = ({ type, color }: { type: string; color: string }) => {
  const icons: Record<string, React.ReactNode> = {
    'inner-landscape': (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path 
          d="M12 3 C9 3 6 5.5 6 9 C6 12.5 9 17 12 21 C15 17 18 12.5 18 9 C18 5.5 15 3 12 3" 
          fill="none" 
          stroke={color} 
          strokeWidth="1.5" 
        />
        <circle cx="12" cy="9" r="2" fill={color} opacity="0.5" />
        <path d="M12 11 L12 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    'rest-restoration': (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path 
          d="M12 4 C8 4 5 7 5 11 C5 15 8 19 12 21 C16 19 19 15 19 11 C19 7 16 4 12 4" 
          fill="none" 
          stroke={color} 
          strokeWidth="1.5" 
        />
        <circle cx="12" cy="11" r="3" fill={color} opacity="0.4" />
        <path d="M12 14 L12 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    'stress-response': (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path 
          d="M12 3 L12 8 M12 16 L12 21" 
          stroke={color} 
          strokeWidth="1.5" 
          strokeLinecap="round" 
        />
        <path 
          d="M4.5 7.5 L8 10 M16 14 L19.5 16.5" 
          stroke={color} 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          opacity="0.7"
        />
        <path 
          d="M4.5 16.5 L8 14 M16 10 L19.5 7.5" 
          stroke={color} 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          opacity="0.7"
        />
        <circle cx="12" cy="12" r="3" fill={color} opacity="0.4" />
      </svg>
    ),
    'connection-style': (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <circle cx="9" cy="10" r="4" fill="none" stroke={color} strokeWidth="1.5" />
        <circle cx="15" cy="10" r="4" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M9 16 C9 19 12 21 12 21 C12 21 15 19 15 16" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
    'life-rhythm': (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <circle cx="12" cy="12" r="8" fill="none" stroke={color} strokeWidth="1.5" />
        <circle cx="12" cy="12" r="1.5" fill={color} opacity="0.5" />
        <path d="M12 4 L12 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 17 L12 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 12 L7 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17 12 L20 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 12 L12 8" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M12 12 L15 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  };

  return icons[type] || null;
};
