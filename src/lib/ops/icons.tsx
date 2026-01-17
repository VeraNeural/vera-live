import React from 'react';

// ============================================================================
// OUTPUT ICON COMPONENT - For output type indicators
// ============================================================================

export const OutputIcon = ({ type, color }: { type: string; color: string }) => {
  const icons: Record<string, React.ReactNode> = {
    'insight': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l2 2"/></svg>,
    'emotion': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    'target': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    'lightbulb': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-1 1H9a1 1 0 01-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z"/></svg>,
    'mail': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>,
    'key': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
    'check': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    'alert': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    'refresh': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
    'strength': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    'eye': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    'default': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="4"/></svg>,
  };
  return icons[type] || icons['default'];
};

// ============================================================================
// OPS ICON COMPONENT - For category and action icons
// ============================================================================

export const OpsIcon = ({ type, color }: { type: string; color: string }) => {
  const icons: Record<string, React.ReactNode> = {
    // AI Provider Icons
    'ai-claude': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v4l2.5 1.5" /><circle cx="12" cy="12" r="2" fill={color} opacity="0.3" /></svg>,
    'ai-gpt': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M9 9h6M9 12h6M9 15h4" /></svg>,
    'ai-grok': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>,
    // Generation Mode Icons
    'mode-single': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" fill={color} opacity="0.3" /></svg>,
    'mode-specialist': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill={color} /></svg>,
    'mode-consensus': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="7" cy="12" r="4" /><circle cx="17" cy="12" r="4" /><circle cx="12" cy="12" r="4" opacity="0.5" /><path d="M10 12h4" strokeWidth="2" /></svg>,
    'mode-chain': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="5" cy="12" r="3" /><circle cx="12" cy="12" r="3" /><circle cx="19" cy="12" r="3" /><path d="M8 12h1M15 12h1" /></svg>,
    'mode-compare': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="5" width="7" height="14" rx="1" /><rect x="14" y="5" width="7" height="14" rx="1" /><path d="M12 8v8M10 10l2-2 2 2M10 14l2 2 2-2" /></svg>,
    // Original Icons
    'email': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>,
    'social': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="4" y="4" width="16" height="16" rx="2" /><circle cx="12" cy="10" r="3" /><path d="M8 18c0-2.2 1.8-4 4-4s4 1.8 4 4" /></svg>,
    'resume': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="5" y="3" width="14" height="18" rx="2" /><line x1="9" y1="7" x2="15" y2="7" /><line x1="9" y1="11" x2="15" y2="11" /><line x1="9" y1="15" x2="12" y2="15" /></svg>,
    'message': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>,
    'decode': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M9 9c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 2-3 2v2" /><circle cx="12" cy="17" r="0.5" fill={color} /></svg>,
    'meeting': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="16" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="9" y1="4" x2="9" y2="10" /><line x1="15" y1="4" x2="15" y2="10" /></svg>,
    'no': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><line x1="8" y1="8" x2="16" y2="16" /></svg>,
    'follow-up': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M3 12h12m0 0l-4-4m4 4l-4 4" /><path d="M21 5v14" /></svg>,
    'simplify': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M12 12v4" /><circle cx="12" cy="19" r="2" /></svg>,
    'apology': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /></svg>,
    'briefcase': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>,
    'interview': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="9" cy="7" r="3" /><circle cx="17" cy="7" r="3" /><path d="M5 21v-2a4 4 0 014-4h2" /><path d="M13 21v-2a4 4 0 014-4h2" /></svg>,
    'money': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="2" x2="12" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
    'review': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    'complaint': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    'gift': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8V21M3 12h18" /><path d="M12 8c-2-3-6-3-6 0s4 4 6 0c2 4 6 4 6 0s-4-3-6 0" /></svg>,
    'thank': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M12 21C12 21 3 13.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 13.5 14 21 14 21" /></svg>,
    'thread': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="16" y2="12" /><line x1="4" y1="18" x2="12" y2="18" /></svg>,
    'caption': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>,
    'headline': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M4 7h16M4 12h10M4 17h6" /></svg>,
    'bio': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="7" r="4" /><path d="M5 21v-2a7 7 0 0114 0v2" /></svg>,
    'think': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v4l2 2" /></svg>,
    'brainstorm': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>,
    'reframe': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>,
    'devil': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M8 9l2 2-2 2M16 9l-2 2 2 2" /><path d="M9 16c1 1 2.5 1.5 3 1.5s2-.5 3-1.5" /></svg>,
    'persona': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8" r="5" /><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /></svg>,
    'boundary': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="3" x2="12" y2="21" /></svg>,
    'excuse': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>,
    'pros-cons': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="2" x2="12" y2="22" /><path d="M5 6h4M5 10h3M5 14h4" /><path d="M15 6h4M15 10h4M15 14h3" /></svg>,
    'health': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /><path d="M12 8v8M8 12h8" /></svg>,
    'workout': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" /><circle cx="12" cy="12" r="9" /></svg>,
    'meal': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>,
    'sleep': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>,
    'habit': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
    'budget': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>,
    'savings': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2z" /><path d="M2 9v1c0 1.1.9 2 2 2h1" /></svg>,
    'learn': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>,
    'study': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>,
    'heart': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>,
    'dating': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="9" cy="9" r="4" /><circle cx="15" cy="9" r="4" /><path d="M12 21C12 21 4 16 4 11V6l8-3 8 3v5c0 5-8 10-8 10z" /></svg>,
    'family': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="5" r="3" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" /><path d="M12 8v4M5 17l7-5M19 17l-7-5" /></svg>,
    'creative': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /><circle cx="12" cy="12" r="3" /></svg>,
    'story': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>,
    'goal': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
    'plan': <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    'copy': <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>,
    'arrow-right': <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>,
  };
  return icons[type] || <span style={{ fontSize: 18 }}>✨</span>;
};
