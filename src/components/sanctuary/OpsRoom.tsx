'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

// ============================================================================
// ELEGANT SVG ICONS FOR OUTPUT
// ============================================================================
const OutputIcon = ({ type, color }: { type: string; color: string }) => {
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
// FORMATTED OUTPUT COMPONENT - CLEAN, NO EMOJIS
// ============================================================================
const FormattedOutput = ({ 
  content, 
  colors, 
  isDark 
}: { 
  content: string; 
  colors: any; 
  isDark: boolean;
}) => {
  // Clean up the content - remove asterisks, hashtags, dashes as pauses, emojis
  const cleanContent = useMemo(() => {
    let cleaned = content
      // Remove ALL emojis (comprehensive)
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '')
      .replace(/[\u{FE00}-\u{FE0F}]/gu, '') // Variation selectors
      .replace(/[\u{200D}]/gu, '') // Zero-width joiner
      .replace(/[\u{20E3}]/gu, '') // Combining enclosing keycap
      .replace(/[\u{E0020}-\u{E007F}]/gu, '') // Tags
      .replace(/️/g, '') // Leftover variation selector
      // Remove hashtags (standalone or at end)
      .replace(/#\w+\s*/g, '')
      // Remove bold/italic markdown
      .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      // Remove markdown headers
      .replace(/^#{1,6}\s+/gm, '')
      // Clean emdashes: keep them but normalize
      .replace(/\s*[—–-]{2,}\s*/g, ' — ')
      // Remove leading dashes/bullets (will be reformatted)
      .replace(/^[\s]*[—–]\s+/gm, '')
      .replace(/^[\s]*[-•]\s+/gm, '• ')
      // Clean up multiple spaces
      .replace(/[ \t]{2,}/g, ' ')
      // Clean up multiple newlines
      .replace(/\n{3,}/g, '\n\n')
      // Remove any remaining stray characters
      .replace(/^\s*[•]\s*$/gm, '') // Empty bullets
      .trim();
    return cleaned;
  }, [content]);

  const sections = useMemo(() => {
    const lines = cleanContent.split('\n');
    const result: { title: string; content: string[]; type: 'header' | 'list' | 'quote' | 'text' }[] = [];
    let currentSection: { title: string; content: string[]; type: 'header' | 'list' | 'quote' | 'text' } | null = null;

    lines.forEach((line) => {
      let trimmed = line.trim();
      
      // Check for section headers (text ending with colon, or ALL CAPS)
      const headerMatch = trimmed.match(/^([A-Z][^:]+):$/) || 
                          trimmed.match(/^([A-Z\s&]+)$/) ||
                          trimmed.match(/^(\d+\.\s*[A-Z][^:]+):?$/);
      if (headerMatch && trimmed.length < 60) {
        if (currentSection) result.push(currentSection);
        currentSection = { title: headerMatch[1].trim(), content: [], type: 'header' };
        return;
      }
      
      // Handle bullet points
      if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('– ') || trimmed.match(/^\d+[\.\)]\s/)) {
        if (!currentSection) {
          currentSection = { title: '', content: [], type: 'list' };
        }
        const item = trimmed
          .replace(/^[•\-–]\s*/, '')
          .replace(/^\d+[\.\)]\s*/, '');
        currentSection.content.push(item);
        currentSection.type = 'list';
        return;
      }
      
      // Handle quotes
      if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
          (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
        const quoteText = trimmed.replace(/^[""]|[""]$/g, '');
        if (currentSection) {
          currentSection.content.push(`"${quoteText}"`);
          currentSection.type = 'quote';
        } else {
          result.push({ title: '', content: [`"${quoteText}"`], type: 'quote' });
        }
        return;
      }
      
      // Regular text
      if (trimmed) {
        if (currentSection) {
          currentSection.content.push(trimmed);
          if (currentSection.type === 'header') currentSection.type = 'text';
        } else {
          currentSection = { title: '', content: [trimmed], type: 'text' };
        }
      }
    });
    if (currentSection) result.push(currentSection);
    return result;
  }, [cleanContent]);

  const getSectionIcon = (title: string): string => {
    const lower = title.toLowerCase();
    if (lower.includes('subtext') || lower.includes('saying') || lower.includes('meaning')) return 'insight';
    if (lower.includes('emotional') || lower.includes('state') || lower.includes('feeling')) return 'emotion';
    if (lower.includes('want') || lower.includes('need') || lower.includes('goal')) return 'target';
    if (lower.includes('response') || lower.includes('approach') || lower.includes('suggest') || lower.includes('idea')) return 'lightbulb';
    if (lower.includes('subject') || lower.includes('email')) return 'mail';
    if (lower.includes('key') || lower.includes('point') || lower.includes('takeaway')) return 'key';
    if (lower.includes('pro') || lower.includes('strength') || lower.includes('benefit')) return 'check';
    if (lower.includes('con') || lower.includes('risk') || lower.includes('caution') || lower.includes('watch')) return 'alert';
    if (lower.includes('option') || lower.includes('alternative')) return 'refresh';
    if (lower.includes('insight') || lower.includes('observation')) return 'eye';
    return 'default';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {sections.map((section, idx) => (
        <div key={idx} style={{
          padding: section.title ? '16px 18px' : '12px 18px',
          background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.5)',
          borderRadius: 12,
          borderLeft: section.title ? `3px solid ${colors.accent}` : 'none',
        }}>
          {section.title && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDark ? 'rgba(255, 180, 100, 0.12)' : 'rgba(200, 160, 100, 0.15)',
              }}>
                <OutputIcon type={getSectionIcon(section.title)} color={colors.accent} />
              </div>
              <h3 style={{
                fontSize: 13, fontWeight: 600, color: colors.accent,
                textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0,
              }}>{section.title}</h3>
            </div>
          )}
          {section.type === 'list' ? (
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {section.content.map((item, i) => (
                <li key={i} style={{ 
                  fontSize: 15, 
                  lineHeight: 1.6, 
                  color: colors.text,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}>
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: colors.accent,
                    flexShrink: 0,
                    marginTop: 8,
                    opacity: 0.6,
                  }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : section.type === 'quote' ? (
            <div style={{
              padding: '14px 18px',
              background: isDark ? 'rgba(255, 180, 100, 0.06)' : 'rgba(200, 160, 100, 0.08)',
              borderRadius: 10, 
              fontStyle: 'italic', 
              fontSize: 15, 
              lineHeight: 1.7, 
              color: colors.text,
              borderLeft: `2px solid ${colors.accent}`,
            }}>{section.content.join(' ')}</div>
          ) : (
            <div style={{ fontSize: 15, lineHeight: 1.75, color: colors.text }}>
              {section.content.map((text, i) => (
                <p key={i} style={{ margin: i > 0 ? '12px 0 0 0' : 0 }}>{text}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// TYPES
// ============================================================================
interface OpsRoomProps {
  onBack: () => void;
}

type Category = 'communication' | 'work' | 'life' | 'content' | 'thinking' | 'health' | 'money' | 'learning' | 'relationships' | 'creativity' | 'planning';
type AIProvider = 'claude' | 'gpt4' | 'grok';
type GenerationMode = 'single' | 'specialist' | 'consensus' | 'review-chain' | 'compare';
type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
type ThemeMode = 'light' | 'dark' | 'auto';

type ActionItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  placeholder: string;
  systemPrompt: string;
  fields?: {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select';
    placeholder?: string;
    options?: { value: string; label: string }[];
    required?: boolean;
  }[];
};

// ============================================================================
// THEME COLORS
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
// AI PROVIDER COLORS & INFO
// ============================================================================
const AI_PROVIDERS: Record<AIProvider, { name: string; color: string; iconType: string; tagline: string }> = {
  claude: { name: 'Claude', color: '#D97706', iconType: 'ai-claude', tagline: 'Nuanced & Empathetic' },
  gpt4: { name: 'GPT-4', color: '#10B981', iconType: 'ai-gpt', tagline: 'Precise & Structured' },
  grok: { name: 'Grok', color: '#8B5CF6', iconType: 'ai-grok', tagline: 'Creative & Edgy' },
};

const GENERATION_MODES: Record<GenerationMode, { name: string; description: string; iconType: string }> = {
  single: { name: 'Single AI', description: 'Pick one AI', iconType: 'mode-single' },
  specialist: { name: 'Specialist', description: 'Best AI for task', iconType: 'mode-specialist' },
  consensus: { name: 'Consensus', description: 'All 3 merge best', iconType: 'mode-consensus' },
  'review-chain': { name: 'Review Chain', description: 'Draft → Edit → Polish', iconType: 'mode-chain' },
  compare: { name: 'Compare', description: 'See all 3 side-by-side', iconType: 'mode-compare' },
};

// ============================================================================
// SVG ICONS
// ============================================================================
const OpsIcon = ({ type, color }: { type: string; color: string }) => {
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

// ============================================================================
// CATEGORIES (11 total!)
// ============================================================================
const CATEGORIES: { id: Category; title: string; icon: string; description: string }[] = [
  { id: 'communication', title: 'Communication', icon: 'message', description: 'Find the right words' },
  { id: 'work', title: 'Work & Career', icon: 'briefcase', description: 'Navigate pressure & direction' },
  { id: 'life', title: 'Life Admin', icon: 'complaint', description: 'Reduce friction & drag' },
  { id: 'content', title: 'Content', icon: 'social', description: 'Express & connect' },
  { id: 'thinking', title: 'Thinking Tools', icon: 'think', description: 'Untangle & clarify' },
  { id: 'health', title: 'Health & Wellness', icon: 'health', description: 'Sustain what matters' },
  { id: 'money', title: 'Money & Finance', icon: 'money', description: 'Stability & capacity' },
  { id: 'learning', title: 'Learning & Growth', icon: 'learn', description: 'Build understanding' },
  { id: 'relationships', title: 'Relationships', icon: 'heart', description: 'Deepen connection' },
  { id: 'creativity', title: 'Creativity', icon: 'creative', description: 'Unlock & explore' },
  { id: 'planning', title: 'Planning & Goals', icon: 'goal', description: 'Shape your path' },
];
// ============================================================================
// ALL ACTIONS BY CATEGORY
// ============================================================================
const ACTIONS_BY_CATEGORY: Record<Category, ActionItem[]> = {
  communication: [
    { id: 'decode-message', title: 'Decode Message', description: 'Understand the real meaning', icon: 'decode', placeholder: 'Paste the message you want to decode...', systemPrompt: 'Analyze this message and explain: 1) What they\'re actually saying (the subtext), 2) Their likely emotional state, 3) What they probably want from you, 4) Suggested response approach. Be direct and insightful.' },
    { id: 'quick-reply', title: 'Quick Reply', description: 'Draft a response in seconds', icon: 'email', placeholder: 'Paste the email/message you need to reply to...', systemPrompt: 'Write a concise, appropriate reply to the message provided. Match the tone of the original. Be direct and helpful. No filler phrases or over-formality.' },
    { id: 'say-no', title: 'Say No Nicely', description: 'Decline without guilt', icon: 'no', placeholder: 'What do you need to say no to? Who is asking?', systemPrompt: 'Help me decline this request politely but firmly. Provide 3 versions: 1) Brief and direct, 2) Warm but clear, 3) With an alternative offer. No over-explaining or excessive apologizing.' },
    { id: 'follow-up', title: 'Follow Up', description: 'Nudge without nagging', icon: 'follow-up', placeholder: 'What are you following up on? Context about the original message...', systemPrompt: 'Write a follow-up message that\'s friendly but effective. Not passive-aggressive. Provide 2-3 versions with different tones.' },
    { id: 'apology', title: 'Apology Crafter', description: 'Apologize without over-explaining', icon: 'apology', placeholder: 'What happened? Who do you need to apologize to?', systemPrompt: 'Help craft a genuine apology that: 1) Acknowledges what happened, 2) Takes responsibility without excessive self-blame, 3) Doesn\'t over-explain, 4) Offers a path forward.' },
    { id: 'explain-simply', title: 'Explain Simply', description: 'Make complex things clear', icon: 'simplify', placeholder: 'What do you need to explain? Who is your audience?', systemPrompt: 'Explain this concept in simple terms that anyone can understand. Use analogies if helpful. Provide both a one-sentence version and a paragraph version.' },
    { id: 'boundary-script', title: 'Boundary Script', description: 'Set limits with grace', icon: 'boundary', placeholder: 'What boundary do you need to set? With whom?', systemPrompt: 'Help me set this boundary clearly and kindly. Provide: 1) The key statement, 2) How to handle pushback, 3) A softer alternative if needed.' },
    { id: 'tough-conversation', title: 'Tough Conversation', description: 'Navigate difficult dialogue', icon: 'message', placeholder: 'What\'s the conversation about? Your relationship? Your goal?', systemPrompt: 'Help me prepare for this difficult conversation. Provide: 1) Opening statement options, 2) Key points to make, 3) How to respond to likely reactions, 4) How to end constructively.' },
  ],

  work: [
    { id: 'meeting-prep', title: 'Meeting Prep', description: 'Get ready in 2 minutes', icon: 'meeting', placeholder: 'What\'s the meeting about? Paste any context...', systemPrompt: 'Help me prepare for this meeting quickly. Provide: 1) Key points to remember, 2) Questions I should ask, 3) Potential challenges to anticipate, 4) A brief mental framework.' },
    { id: 'interview-prep', title: 'Interview Prep', description: 'Nail your next interview', icon: 'interview', placeholder: 'What\'s the role? Company? Concerns?', systemPrompt: 'Help me prepare for this job interview. Provide: 1) Likely questions and how to answer them for THIS specific role, 2) Questions I should ask, 3) Key points to emphasize, 4) Common pitfalls to avoid.', fields: [
      { id: 'role', label: 'What role?', type: 'text', placeholder: 'e.g., Product Manager at Stripe', required: true },
      { id: 'background', label: 'Your relevant experience', type: 'textarea', placeholder: 'Brief summary of your background...' },
      { id: 'concerns', label: 'Any specific concerns?', type: 'textarea', placeholder: 'Gaps, weaknesses, tricky questions...' },
    ]},
    { id: 'salary-negotiation', title: 'Salary Negotiation', description: 'Ask for what you\'re worth', icon: 'money', placeholder: 'Current salary? Target? Context?', systemPrompt: 'Help me negotiate this salary/raise. Provide: 1) Key talking points, 2) Specific scripts for different scenarios, 3) How to handle pushback, 4) What to do if they say no.', fields: [
      { id: 'current', label: 'Current situation', type: 'text', placeholder: 'Current salary or offer amount' },
      { id: 'target', label: 'Your target', type: 'text', placeholder: 'What you want to get' },
      { id: 'context', label: 'Context', type: 'textarea', placeholder: 'Is this a new job, raise, promotion?' },
    ]},
    { id: 'one-on-one', title: '1:1 Agenda', description: 'Prep for manager meetings', icon: 'meeting', placeholder: 'Who is the 1:1 with? Any specific topics?', systemPrompt: 'Help me prepare a 1:1 agenda. Include: 1) Status updates worth sharing, 2) Questions to ask, 3) Feedback to give or request, 4) Career development topics.' },
    { id: 'performance-review', title: 'Performance Review', description: 'Self-assessment that shines', icon: 'review', placeholder: 'What did you accomplish? Role and context?', systemPrompt: 'Help me write my self-assessment for performance review. Transform my accomplishments into powerful bullets that demonstrate impact.', fields: [
      { id: 'role', label: 'Your role', type: 'text', placeholder: 'e.g., Senior Engineer', required: true },
      { id: 'accomplishments', label: 'What you accomplished', type: 'textarea', placeholder: 'Projects, wins, contributions...', required: true },
      { id: 'challenges', label: 'Any challenges faced?', type: 'textarea', placeholder: 'Obstacles overcome, lessons learned...' },
    ]},
    { id: 'resume-bullets', title: 'Resume Bullets', description: 'Achievement-focused points', icon: 'resume', placeholder: 'Role, responsibilities, and any metrics...', systemPrompt: 'Transform this into powerful resume bullet points. Use strong action verbs. Quantify results. Generate 4-6 bullets.', fields: [
      { id: 'role', label: 'Job title', type: 'text', placeholder: 'e.g., Product Manager', required: true },
      { id: 'company', label: 'Company/Industry', type: 'text', placeholder: 'e.g., Tech startup' },
      { id: 'responsibilities', label: 'What did you do?', type: 'textarea', placeholder: 'Describe responsibilities and achievements...', required: true },
    ]},
    { id: 'cover-letter', title: 'Cover Letter', description: 'Stand out from the pile', icon: 'resume', placeholder: 'Role, company, and why you\'re excited...', systemPrompt: 'Write a compelling cover letter that: 1) Opens with a hook, 2) Connects my experience to their needs, 3) Shows genuine interest, 4) Ends with confidence. Under 300 words.', fields: [
      { id: 'role', label: 'What role?', type: 'text', placeholder: 'e.g., Product Designer at Figma', required: true },
      { id: 'background', label: 'Relevant experience', type: 'textarea', placeholder: 'Your key qualifications...', required: true },
      { id: 'why', label: 'Why this company?', type: 'textarea', placeholder: 'What excites you about them?' },
    ]},
    { 
      id: 'job-application-kit', 
      title: 'Job Application Kit', 
      description: 'Full ATS resume + cover letter + emails', 
      icon: 'resume', 
      placeholder: 'Paste the full job description here...', 
      systemPrompt: `You are an elite career coach, ATS optimization expert, and executive resume writer who has helped thousands land jobs at top companies. Your task is to create a COMPLETE, DETAILED job application kit.

IMPORTANT: Be DETAILED and COMPREHENSIVE. Each section must be COMPLETE and SEPARATE.

Based on the job description and the candidate's current resume, generate ALL of the following sections. Use clear separators between each section.

================================================================================
SECTION 1: COMPLETE ATS-OPTIMIZED RESUME
================================================================================

Create a FULL, detailed resume ready to copy into a Word document:

PROFESSIONAL SUMMARY
(Write 4-5 powerful sentences - years of experience, core expertise, key achievements with numbers, skills matching job requirements, value proposition for THIS role)

PROFESSIONAL EXPERIENCE

[For EACH position from their resume, write:]

[Job Title]
[Company Name] | [Location] | [Start Date] - [End Date]

• [Bullet 1 - Start with power verb, include metric, match job keyword]
• [Bullet 2 - Challenge-Action-Result format]
• [Bullet 3 - Specific achievement with numbers]
• [Bullet 4 - Leadership or collaboration example]
• [Bullet 5 - Technical skill or process improvement]
• [Bullet 6 - If senior role, add more bullets]
• [Bullet 7 - If senior role, add more bullets]

[Repeat for ALL positions in their resume]

EDUCATION

[Degree] | [University] | [Year]
[Add relevant coursework, honors, GPA if strong]

SKILLS

Technical Skills: [List all matching job requirements]
Software & Tools: [List all matching job requirements]
Industry Knowledge: [List relevant areas]
Soft Skills: [List 4-5 relevant ones]

CERTIFICATIONS (if applicable)
[List any from their resume]

================================================================================
SECTION 2: COVER LETTER
================================================================================

[Today's Date]

[Hiring Manager/Recruiting Team]
[Company Name]
[Address if known]

Dear Hiring Manager,

[OPENING PARAGRAPH - 3-4 sentences]
Strong hook mentioning the specific role and company by name. Express genuine enthusiasm. Briefly mention your most relevant qualification that matches their top requirement.

[BODY PARAGRAPH 1 - 4-5 sentences]
Detail your TOP achievement that directly relates to this role. Use specific numbers and results. Connect it explicitly to what they're looking for in the job description.

[BODY PARAGRAPH 2 - 4-5 sentences]
Share another relevant accomplishment or skill set. Show you understand their company, industry, or challenges. Demonstrate cultural fit.

[CLOSING PARAGRAPH - 2-3 sentences]
Express enthusiasm for the opportunity to contribute. Clear call to action. Thank them for their consideration.

Sincerely,
[Candidate Name]
[Phone]
[Email]
[LinkedIn URL]

================================================================================
SECTION 3: EMAIL TO APPLY DIRECTLY (Corporate Portal/HR)
================================================================================

SUBJECT LINE OPTIONS:
1. Application for [Job Title] - [Your Name] | [Key Qualification]
2. [Job Title] Application - [X] Years of [Relevant] Experience
3. Experienced [Your Title] Eager to Join [Company Name] as [Job Title]

EMAIL BODY:

Dear [Company Name] Recruiting Team,

I am writing to express my strong interest in the [Job Title] position at [Company Name]. With [X years] of experience in [relevant field], I am excited about the opportunity to contribute to your team.

In my current role at [Company], I [one key achievement with metric]. I am particularly drawn to [Company Name] because [specific reason about company - mission, product, culture, recent news].

I have attached my resume for your review. I would welcome the opportunity to discuss how my background in [key skill] and [key skill] aligns with your needs.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
[Name]
[Phone]
[Email]

================================================================================
SECTION 4: FOLLOW-UP EMAIL (1 Week After Applying)
================================================================================

SUBJECT: Following Up - [Job Title] Application | [Your Name]

Dear [Hiring Manager/Recruiting Team],

I hope this message finds you well. I recently submitted my application for the [Job Title] position and wanted to follow up to reiterate my strong interest in joining [Company Name].

I am very enthusiastic about the opportunity to bring my experience in [key skill] to your team. I would be happy to provide any additional information that would be helpful.

Thank you for your time and consideration. I look forward to the possibility of speaking with you.

Best regards,
[Name]
[Phone] | [Email]

================================================================================
SECTION 5: LINKEDIN MESSAGE TO RECRUITER
================================================================================

MESSAGE 1 - Connection Request Note (300 characters max):

Hi [Name], I recently applied for the [Job Title] role at [Company] and would love to connect. With my background in [key area], I'm very excited about this opportunity. Would be great to be part of your network!

MESSAGE 2 - Follow-up After Connecting:

Hi [Name],

Thank you for connecting! I wanted to reach out because I recently applied for the [Job Title] position at [Company Name] and I'm very excited about the opportunity.

With [X years] in [field] and a track record of [key achievement], I believe I could make a strong contribution to your team.

I'd love the chance to learn more about the role and share how my experience aligns with what you're looking for. Would you be open to a brief conversation?

Thank you for your time!

Best,
[Name]

================================================================================
SECTION 6: LINKEDIN MESSAGE TO HIRING MANAGER
================================================================================

MESSAGE 1 - Connection Request Note (300 characters max):

Hi [Name], I'm a [Your Title] with [X years] in [field] and very interested in the [Job Title] role on your team. I'd love to connect and learn more about the opportunity. Thank you!

MESSAGE 2 - Follow-up After Connecting:

Hi [Name],

Thank you for accepting my connection request. I came across the [Job Title] position on your team and was immediately drawn to it because [specific reason about team/company/role].

A bit about me: I'm currently [Title] at [Company] where I [brief achievement]. Previously, I [another relevant experience]. I'm particularly passionate about [relevant area].

I've already applied through [LinkedIn/company portal], but I wanted to reach out directly to express my genuine interest. If you have a few minutes, I'd love to share more about how I could contribute to [team/company goal].

Either way, I appreciate you connecting and wish you continued success with the team.

Best regards,
[Name]

================================================================================
SECTION 7: LINKEDIN PROFILE OPTIMIZATION
================================================================================

HEADLINE OPTIONS (pick one):
1. [Current Title] | [Key Skill] | [Industry] | [Value Proposition]
2. [Title] at [Company] | Helping [who] achieve [what] through [how]
3. [X]+ Years in [Field] | [Specialty] | [Key Achievement]

KEYWORDS TO ADD THROUGHOUT PROFILE:
[List 12-15 exact keywords from the job posting]

ABOUT SECTION - OPENING LINES TO ADD:
[Write 3-4 sentences tailored to this role/industry that can be added to their LinkedIn About section]

================================================================================

FORMAT RULES:
- Keep each section clearly separated
- Use clean, professional formatting
- No tables or graphics (ATS-friendly)
- Be DETAILED - this is a complete application kit
- Match the candidate's actual experience level
- Use their real achievements and metrics from their resume`,
      fields: [
        { id: 'job_description', label: 'Job Description', type: 'textarea', placeholder: 'Paste the COMPLETE job posting here - include the company name, job title, requirements, responsibilities, qualifications, and any info about the company...', required: true },
        { id: 'current_resume', label: 'Your Current Resume', type: 'textarea', placeholder: 'Paste your ENTIRE current resume here including:\n\n• Contact info (optional)\n• All job titles, companies, dates\n• All bullet points and descriptions\n• Education\n• Skills\n• Certifications\n• Any other sections\n\nThe more detail you provide, the better the output!', required: true },
      ]
    },
  ],

  life: [
    { id: 'complaint-letter', title: 'Complaint Letter', description: 'Get results, not ignored', icon: 'complaint', placeholder: 'What happened? What company? What outcome?', systemPrompt: 'Write a professional complaint letter that: 1) States the issue clearly, 2) Includes relevant details, 3) Specifies what resolution I want, 4) Is firm but not aggressive.' },
    { id: 'dispute', title: 'Dispute Email', description: 'Challenge charges & decisions', icon: 'complaint', placeholder: 'What are you disputing? Details...', systemPrompt: 'Help me dispute this charge/decision professionally. Include: 1) Clear statement of issue, 2) Supporting facts, 3) Specific ask, 4) Escalation path.' },
    { id: 'reference-request', title: 'Reference Request', description: 'Ask someone to vouch for you', icon: 'thank', placeholder: 'Who are you asking? For what opportunity?', systemPrompt: 'Help me ask this person to be a reference. Include: 1) The ask, 2) Context about the opportunity, 3) Specific things I hope they can speak to, 4) An easy out if not comfortable.' },
    { id: 'thank-you', title: 'Thank You Note', description: 'Genuine, not generic', icon: 'thank', placeholder: 'Who are you thanking? What for?', systemPrompt: 'Write a genuine thank you note that: 1) Is specific, 2) Explains the impact, 3) Feels personal. Provide short and longer versions.' },
    { id: 'gift-ideas', title: 'Gift Ideas', description: 'Perfect presents, fast', icon: 'gift', placeholder: 'Who is it for? Occasion? Budget? Interests?', systemPrompt: 'Suggest thoughtful gift ideas. For each: 1) Why it fits them, 2) Where to get it, 3) Price range. Mix practical and creative.', fields: [
      { id: 'who', label: 'Who is it for?', type: 'text', placeholder: 'e.g., My mom, a coworker...', required: true },
      { id: 'occasion', label: 'Occasion', type: 'text', placeholder: 'Birthday, thank you...' },
      { id: 'interests', label: 'Their interests', type: 'textarea', placeholder: 'Hobbies, style, preferences...' },
      { id: 'budget', label: 'Budget', type: 'text', placeholder: 'e.g., $50, $100-200' },
    ]},
    { id: 'excuse', title: 'Polite Excuse', description: 'Get out of things gracefully', icon: 'excuse', placeholder: 'What do you need to get out of?', systemPrompt: 'Help me gracefully decline or get out of this commitment. Provide 3 options: 1) Brief and vague, 2) Specific but kind, 3) With a counter-offer.' },
  ],

  content: [
    { id: 'linkedin-post', title: 'LinkedIn Post', description: 'Professional, not cringe', icon: 'social', placeholder: 'What topic? What\'s your angle?', systemPrompt: 'Create a LinkedIn post that feels authentic and human. Use short paragraphs. Include a hook. End with engagement. No excessive hashtags.', fields: [
      { id: 'topic', label: 'What\'s the topic?', type: 'textarea', placeholder: 'A lesson, insight, update...', required: true },
      { id: 'goal', label: 'Goal', type: 'select', options: [
        { value: 'thought-leadership', label: 'Thought Leadership' },
        { value: 'engagement', label: 'Drive Engagement' },
        { value: 'announcement', label: 'Announcement' },
        { value: 'storytelling', label: 'Tell a Story' },
      ]},
    ]},
    { id: 'tweet-thread', title: 'Tweet Thread', description: 'Turn ideas into threads', icon: 'thread', placeholder: 'What\'s the main idea? Key points?', systemPrompt: 'Turn this into an engaging Twitter/X thread. Rules: 1) First tweet must hook, 2) Each tweet stands alone but flows, 3) Use line breaks, 4) End with takeaway. Aim for 5-10 tweets.' },
    { id: 'caption', title: 'Caption Generator', description: 'Instagram & social captions', icon: 'caption', placeholder: 'What\'s the photo/video about? Vibe?', systemPrompt: 'Write engaging social media captions. Provide 3 options: 1) Short and punchy, 2) Story-based, 3) Engagement-focused. Include emoji and hashtag suggestions.' },
    { id: 'headline', title: 'Headline Options', description: 'Multiple angles, one topic', icon: 'headline', placeholder: 'What\'s the content about? Audience?', systemPrompt: 'Generate 10 headline options. Mix: curiosity-driven, benefit-focused, number-based, and question formats. Rank top 3 and explain why.' },
    { id: 'bio', title: 'Bio Writer', description: 'Professional bios in any length', icon: 'bio', placeholder: 'Who are you? Key accomplishments?', systemPrompt: 'Write professional bios in multiple lengths: 1) One-liner, 2) Short (2-3 sentences), 3) Full paragraph. Make them human, not robotic.', fields: [
      { id: 'name', label: 'Name', type: 'text', required: true },
      { id: 'role', label: 'Role/Title', type: 'text', placeholder: 'Designer, Founder...' },
      { id: 'accomplishments', label: 'Key accomplishments', type: 'textarea', placeholder: 'What should people know?' },
    ]},
  ],

  thinking: [
    { id: 'pros-cons', title: 'Pros & Cons', description: 'Structured decision matrix', icon: 'pros-cons', placeholder: 'What decision? Options?', systemPrompt: 'Create a structured pros/cons analysis. For each option: 1) List 4-6 pros, 2) List 4-6 cons, 3) Rate importance, 4) Provide summary recommendation.' },
    { id: 'devil-advocate', title: 'Devil\'s Advocate', description: 'Argue against your idea', icon: 'devil', placeholder: 'What\'s your idea or plan?', systemPrompt: 'Play devil\'s advocate. Provide: 1) Strongest arguments against, 2) Potential blind spots, 3) What could go wrong, 4) Questions I haven\'t considered.' },
    { id: 'brainstorm', title: 'Brainstorm', description: 'Generate 10+ ideas fast', icon: 'brainstorm', placeholder: 'What do you need ideas for?', systemPrompt: 'Generate at least 10 creative ideas. Include: 1) Safe/obvious options, 2) Creative/unexpected options, 3) At least one wild card. Add why each could work.' },
    { id: 'reframe', title: 'Reframe This', description: 'See it from new angles', icon: 'reframe', placeholder: 'What situation to reframe?', systemPrompt: 'Help me see this from different perspectives. Provide: 1) Optimistic reframe, 2) Growth opportunity, 3) How a mentor might view this, 4) Long-term perspective, 5) What this might be teaching me.' },
    { id: 'persona', title: 'What Would X Do?', description: 'Think like someone else', icon: 'persona', placeholder: 'Situation? Who to think like?', systemPrompt: 'Analyze this as if I were the person specified. How would they think? What would they prioritize? What action would they take?', fields: [
      { id: 'situation', label: 'Situation', type: 'textarea', placeholder: 'What you\'re facing...', required: true },
      { id: 'persona', label: 'Who to think like?', type: 'text', placeholder: 'Elon Musk, your future self, a stoic philosopher...', required: true },
    ]},
    { id: 'decision-helper', title: 'Decision Helper', description: 'Clear thinking for tough choices', icon: 'think', placeholder: 'What decision? Factors?', systemPrompt: 'Help me think through this decision. Provide: 1) Key factors, 2) Questions to ask myself, 3) What info I might be missing, 4) A framework for deciding, 5) How to test before committing.' },
  ],

  health: [
    { id: 'meal-plan', title: 'Meal Plan', description: 'Healthy eating made easy', icon: 'meal', placeholder: 'Dietary preferences? Goals? Time constraints?', systemPrompt: 'Create a practical meal plan. Consider preferences, budget, and time. Include: 1) Specific meals, 2) Simple recipes or ideas, 3) Shopping list basics, 4) Prep tips.', fields: [
      { id: 'diet', label: 'Dietary preferences', type: 'text', placeholder: 'Vegetarian, low-carb, no restrictions...' },
      { id: 'goal', label: 'Health goal', type: 'text', placeholder: 'Lose weight, gain muscle, more energy...' },
      { id: 'time', label: 'Cooking time available', type: 'text', placeholder: '15 min, 30 min, I like to cook...' },
    ]},
    { id: 'workout', title: 'Workout Plan', description: 'Exercise that fits your life', icon: 'workout', placeholder: 'Fitness level? Equipment? Goals?', systemPrompt: 'Create a realistic workout plan. Include: 1) Specific exercises with reps/sets, 2) Warmup and cooldown, 3) Modifications for difficulty, 4) Recovery tips.', fields: [
      { id: 'level', label: 'Fitness level', type: 'select', options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
      ]},
      { id: 'equipment', label: 'Equipment available', type: 'text', placeholder: 'None, dumbbells, full gym...' },
      { id: 'goal', label: 'Goal', type: 'text', placeholder: 'Strength, cardio, flexibility...' },
      { id: 'time', label: 'Time per workout', type: 'text', placeholder: '20 min, 45 min, 1 hour...' },
    ]},
    { id: 'habit-builder', title: 'Habit Builder', description: 'Make good habits stick', icon: 'habit', placeholder: 'What habit? Current routine?', systemPrompt: 'Help me build this habit. Provide: 1) How to start small, 2) Trigger/cue suggestions, 3) How to track progress, 4) What to do when I slip, 5) How to scale up over time.' },
    { id: 'sleep-routine', title: 'Sleep Routine', description: 'Better rest, better life', icon: 'sleep', placeholder: 'Current sleep issues? Schedule constraints?', systemPrompt: 'Create a personalized sleep routine. Include: 1) Wind-down ritual, 2) Environment optimization, 3) What to avoid, 4) How to handle middle-of-night waking, 5) Morning routine that helps.' },
    { id: 'stress-relief', title: 'Stress Relief', description: 'Calm in the chaos', icon: 'health', placeholder: 'What\'s causing stress? How it shows up?', systemPrompt: 'Provide personalized stress relief strategies. Include: 1) Immediate calming techniques, 2) Daily practices, 3) Mindset shifts, 4) When to seek more support.' },
    { id: 'motivation-boost', title: 'Motivation Boost', description: 'Get unstuck fast', icon: 'brainstorm', placeholder: 'What are you struggling to do? Why does it matter?', systemPrompt: 'Give me a motivation boost. Include: 1) Reframe why this matters, 2) The smallest possible first step, 3) How to make it more enjoyable, 4) What success looks like, 5) A pep talk that doesn\'t feel cheesy.' },
  ],

  money: [
    { id: 'budget-help', title: 'Budget Help', description: 'Know where your money goes', icon: 'budget', placeholder: 'Income? Major expenses? Goals?', systemPrompt: 'Help me create or improve my budget. Include: 1) Suggested category percentages, 2) Where to cut if needed, 3) How to track spending, 4) Tips for sticking to it.', fields: [
      { id: 'income', label: 'Monthly income (after tax)', type: 'text', placeholder: 'e.g., $5,000' },
      { id: 'expenses', label: 'Major fixed expenses', type: 'textarea', placeholder: 'Rent, car payment, subscriptions...' },
      { id: 'goal', label: 'Financial goal', type: 'text', placeholder: 'Save for house, pay off debt, emergency fund...' },
    ]},
    { id: 'negotiate-bill', title: 'Negotiate Bill', description: 'Lower your monthly costs', icon: 'money', placeholder: 'What bill? Current amount? History?', systemPrompt: 'Help me negotiate this bill lower. Provide: 1) Script for the call, 2) Key leverage points, 3) What to ask for specifically, 4) When to escalate, 5) Alternative if they say no.' },
    { id: 'investment-basics', title: 'Investment Basics', description: 'Understand your options', icon: 'savings', placeholder: 'What do you want to understand? Current situation?', systemPrompt: 'Explain this investment concept in simple terms. Include: 1) How it works, 2) Pros and cons, 3) Who it\'s good for, 4) Common mistakes, 5) Next steps to learn more. Note: This is educational, not financial advice.' },
    { id: 'expense-review', title: 'Expense Review', description: 'Find hidden savings', icon: 'budget', placeholder: 'List your subscriptions and recurring costs...', systemPrompt: 'Review these expenses and identify savings. Provide: 1) What to cancel or downgrade, 2) What to negotiate, 3) Cheaper alternatives, 4) What\'s actually worth keeping.' },
    { id: 'savings-plan', title: 'Savings Plan', description: 'Reach your money goals', icon: 'savings', placeholder: 'What are you saving for? Timeline? Current savings?', systemPrompt: 'Create a savings plan for this goal. Include: 1) Monthly target to hit goal, 2) Where to keep the money, 3) How to automate, 4) What to do if you fall behind, 5) How to stay motivated.' },
    { id: 'money-mindset', title: 'Money Mindset', description: 'Heal your relationship with money', icon: 'money', placeholder: 'What\'s your biggest money challenge or belief?', systemPrompt: 'Help me shift my money mindset. Provide: 1) Reframe of my current belief, 2) Where this belief might come from, 3) New perspective to try, 4) Small action to reinforce change, 5) Affirmation that doesn\'t feel fake.' },
  ],

  learning: [
    { id: 'study-plan', title: 'Study Plan', description: 'Learn anything effectively', icon: 'study', placeholder: 'What do you want to learn? Timeline? Current level?', systemPrompt: 'Create a study plan for learning this. Include: 1) Learning roadmap, 2) Best resources, 3) Practice exercises, 4) Milestones to track progress, 5) How long each phase should take.', fields: [
      { id: 'topic', label: 'What to learn', type: 'text', placeholder: 'Spanish, Python, photography...', required: true },
      { id: 'timeline', label: 'Timeline', type: 'text', placeholder: '3 months, 1 year...' },
      { id: 'level', label: 'Current level', type: 'select', options: [
        { value: 'complete-beginner', label: 'Complete Beginner' },
        { value: 'some-basics', label: 'Know Some Basics' },
        { value: 'intermediate', label: 'Intermediate' },
      ]},
    ]},
    { id: 'explain-concept', title: 'Explain Concept', description: 'Understand anything deeply', icon: 'learn', placeholder: 'What concept? What do you already know?', systemPrompt: 'Explain this concept at multiple levels: 1) ELI5 (super simple), 2) Basic understanding, 3) Deeper dive, 4) Common misconceptions, 5) How it connects to other things.' },
    { id: 'skill-roadmap', title: 'Skill Roadmap', description: 'From beginner to expert', icon: 'goal', placeholder: 'What skill? Where are you now? Where do you want to be?', systemPrompt: 'Create a roadmap to develop this skill. Include: 1) Stages of progression, 2) What to focus on at each stage, 3) How to practice, 4) How to know when to move on, 5) Common plateaus and how to break through.' },
    { id: 'book-summary', title: 'Book Summary', description: 'Key ideas in minutes', icon: 'learn', placeholder: 'What book? What do you want to get from it?', systemPrompt: 'Provide a useful summary of this book. Include: 1) Core thesis, 2) Key ideas (5-7), 3) Most actionable takeaways, 4) Who should read the full book, 5) What critics say.' },
    { id: 'learning-hack', title: 'Learning Hack', description: 'Study smarter, not harder', icon: 'brainstorm', placeholder: 'What are you trying to learn? What\'s not working?', systemPrompt: 'Give me learning hacks for this situation. Include: 1) Why current approach might not work, 2) Better techniques to try, 3) How to make it stick, 4) How to test yourself, 5) How to stay consistent.' },
    { id: 'knowledge-test', title: 'Knowledge Test', description: 'Quiz yourself', icon: 'study', placeholder: 'What topic do you want to be tested on?', systemPrompt: 'Create a knowledge test on this topic. Include: 1) 10 questions of varying difficulty, 2) Mix of formats (multiple choice, short answer, application), 3) Answers at the end, 4) Explanation of why each answer is correct.' },
  ],

  relationships: [
    { id: 'dating-profile', title: 'Dating Profile', description: 'Stand out authentically', icon: 'dating', placeholder: 'Tell me about yourself, interests, what you\'re looking for...', systemPrompt: 'Write a dating profile that\'s authentic and attractive. Include: 1) Attention-grabbing opener, 2) What makes you interesting, 3) What you\'re looking for, 4) Conversation starters. Avoid clichés.', fields: [
      { id: 'about', label: 'About you', type: 'textarea', placeholder: 'Personality, interests, quirks...', required: true },
      { id: 'looking', label: 'What you\'re looking for', type: 'textarea', placeholder: 'Type of person, relationship...' },
      { id: 'tone', label: 'Desired tone', type: 'select', options: [
        { value: 'witty', label: 'Witty & Playful' },
        { value: 'sincere', label: 'Sincere & Warm' },
        { value: 'confident', label: 'Confident & Direct' },
        { value: 'quirky', label: 'Quirky & Unique' },
      ]},
    ]},
    { id: 'conflict-resolution', title: 'Conflict Resolution', description: 'Navigate disagreements', icon: 'message', placeholder: 'What\'s the conflict? Your relationship? What you want?', systemPrompt: 'Help me resolve this conflict constructively. Provide: 1) How to open the conversation, 2) How to express my perspective without attacking, 3) How to listen to theirs, 4) Finding common ground, 5) Specific compromises to propose.' },
    { id: 'family-dynamics', title: 'Family Dynamics', description: 'Navigate tricky family stuff', icon: 'family', placeholder: 'What\'s the family situation? Who\'s involved?', systemPrompt: 'Help me navigate this family situation. Provide: 1) Understanding the dynamics at play, 2) What boundaries might help, 3) Scripts for difficult conversations, 4) How to protect my peace, 5) When professional help might help.' },
    { id: 'friendship-advice', title: 'Friendship Advice', description: 'Be a better friend', icon: 'heart', placeholder: 'What\'s going on with your friendship?', systemPrompt: 'Give me friendship advice for this situation. Provide: 1) Perspective on what might be happening, 2) How to communicate my needs, 3) Whether/how to address issues, 4) How to strengthen the friendship, 5) When to let go if needed.' },
    { id: 'relationship-boundary', title: 'Relationship Boundary', description: 'Protect your peace', icon: 'boundary', placeholder: 'What boundary? With whom? Why is it hard?', systemPrompt: 'Help me set this relationship boundary. Provide: 1) Why this boundary matters, 2) How to communicate it clearly, 3) How to enforce it, 4) How to handle their reaction, 5) How to stay strong if they push back.' },
    { id: 'conversation-starter', title: 'Conversation Starters', description: 'Never run out of things to say', icon: 'message', placeholder: 'Who are you talking to? Context?', systemPrompt: 'Give me great conversation starters for this situation. Provide: 1) Opening lines, 2) Follow-up questions, 3) Topics to explore, 4) How to keep it going, 5) Graceful ways to exit if needed.' },
  ],

  creativity: [
    { id: 'story-idea', title: 'Story Ideas', description: 'Spark your imagination', icon: 'story', placeholder: 'Genre? Themes? Any starting point?', systemPrompt: 'Generate creative story ideas. Provide: 1) 5 unique premises, 2) Main character concepts, 3) Potential conflicts, 4) Twist possibilities, 5) Opening line for each.' },
    { id: 'naming', title: 'Name Generator', description: 'Find the perfect name', icon: 'creative', placeholder: 'What needs a name? Vibe? Constraints?', systemPrompt: 'Generate name options for this. Provide: 1) 10+ options across different styles, 2) Why each works, 3) Domain/handle availability considerations, 4) Top 3 recommendations with reasoning.', fields: [
      { id: 'what', label: 'What needs a name?', type: 'text', placeholder: 'Business, product, pet, baby...', required: true },
      { id: 'vibe', label: 'Desired vibe', type: 'text', placeholder: 'Professional, playful, unique, classic...' },
      { id: 'constraints', label: 'Constraints', type: 'text', placeholder: 'Must start with..., avoid..., industry...' },
    ]},
    { id: 'creative-prompt', title: 'Creative Prompts', description: 'Break through blocks', icon: 'brainstorm', placeholder: 'What type of creative work? Where are you stuck?', systemPrompt: 'Give me creative prompts to break through this block. Provide: 1) 10 unique prompts/exercises, 2) Why each might help, 3) Time estimate for each, 4) How to build on what you create.' },
    { id: 'metaphor-maker', title: 'Metaphor Maker', description: 'Explain things beautifully', icon: 'creative', placeholder: 'What concept needs a metaphor? Audience?', systemPrompt: 'Create powerful metaphors for this concept. Provide: 1) 5 different metaphors/analogies, 2) When each works best, 3) How to extend each one, 4) Potential pitfalls of each.' },
    { id: 'plot-twist', title: 'Plot Twist Generator', description: 'Surprise your audience', icon: 'story', placeholder: 'Current story/situation? What needs a twist?', systemPrompt: 'Generate unexpected plot twists. Provide: 1) 5 twist options from subtle to dramatic, 2) How to set each up, 3) Impact on story/characters, 4) How to execute believably.' },
    { id: 'character-builder', title: 'Character Builder', description: 'Create memorable characters', icon: 'persona', placeholder: 'What kind of character? Role in story?', systemPrompt: 'Help me build a compelling character. Provide: 1) Background and history, 2) Personality traits and flaws, 3) Motivations and fears, 4) Speech patterns and quirks, 5) Character arc potential, 6) Relationships with others.' },
  ],

  planning: [
    { id: 'goal-setting', title: 'Goal Setting', description: 'Set goals that actually work', icon: 'goal', placeholder: 'What do you want to achieve? By when?', systemPrompt: 'Help me set this goal effectively. Provide: 1) SMART goal formulation, 2) Why this goal matters (dig deeper), 3) Potential obstacles, 4) Milestones to track, 5) First 3 actions to take.', fields: [
      { id: 'goal', label: 'What\'s your goal?', type: 'textarea', placeholder: 'What do you want to achieve?', required: true },
      { id: 'timeline', label: 'Timeline', type: 'text', placeholder: '3 months, 1 year...' },
      { id: 'why', label: 'Why does this matter?', type: 'textarea', placeholder: 'What will achieving this give you?' },
    ]},
    { id: 'project-plan', title: 'Project Plan', description: 'Break down big projects', icon: 'plan', placeholder: 'What\'s the project? Deadline? Resources?', systemPrompt: 'Create a project plan. Include: 1) Phases and milestones, 2) Tasks for each phase, 3) Time estimates, 4) Dependencies, 5) Risks and mitigation, 6) Success criteria.', fields: [
      { id: 'project', label: 'Project description', type: 'textarea', placeholder: 'What are you trying to accomplish?', required: true },
      { id: 'deadline', label: 'Deadline', type: 'text', placeholder: 'When does it need to be done?' },
      { id: 'resources', label: 'Resources available', type: 'textarea', placeholder: 'Time, money, help, tools...' },
    ]},
    { id: 'habit-tracker', title: 'Habit Tracker Setup', description: 'Track what matters', icon: 'habit', placeholder: 'What habits? Current tracking method?', systemPrompt: 'Help me set up habit tracking. Provide: 1) What to track (and what not to), 2) Best tracking method for my style, 3) How often to review, 4) What to do with the data, 5) How to adjust when things aren\'t working.' },
    { id: 'weekly-review', title: 'Weekly Review', description: 'Reflect and reset', icon: 'plan', placeholder: 'Paste your wins, challenges, and upcoming priorities...', systemPrompt: 'Guide me through a weekly review. Help me: 1) Celebrate wins (even small ones), 2) Learn from challenges, 3) Identify patterns, 4) Set priorities for next week, 5) Adjust systems if needed.' },
    { id: 'vision-board', title: 'Vision Board Ideas', description: 'Visualize your future', icon: 'creative', placeholder: 'What areas of life? What feelings do you want?', systemPrompt: 'Help me create a meaningful vision board. Provide: 1) Key themes to include, 2) Specific images/words to find, 3) How to organize it, 4) How to use it daily, 5) When to update it.' },
    { id: 'accountability', title: 'Accountability Plan', description: 'Stay on track', icon: 'goal', placeholder: 'What goal? What\'s made you slip before?', systemPrompt: 'Create an accountability plan. Include: 1) Who to involve and how, 2) Check-in frequency and format, 3) Consequences and rewards, 4) What to do when you slip, 5) How to stay motivated long-term.' },
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

// ============================================================================
// STYLES
// ============================================================================
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }
  
  html, body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .card-btn {
    transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  }
  .card-btn:hover { transform: translateY(-2px); }
  .card-btn:active { transform: scale(0.98); }

  .input-field {
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .input-field:focus { outline: none; }

  .output-area::-webkit-scrollbar { width: 4px; }
  .output-area::-webkit-scrollbar-track { background: transparent; }
  .output-area::-webkit-scrollbar-thumb { background: rgba(150, 140, 130, 0.3); border-radius: 4px; }

  .generating {
    background: linear-gradient(90deg, rgba(200,180,150,0.1) 25%, rgba(200,180,150,0.2) 50%, rgba(200,180,150,0.1) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  /* Fix select dropdown styling */
  select.input-field {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
    padding-right: 40px !important;
  }

  select.input-field option {
    background: #1a1a24;
    color: #e8e4de;
    padding: 12px;
  }

  /* Light mode dropdown */
  @media (prefers-color-scheme: light) {
    select.input-field option {
      background: #ffffff;
      color: #2a2a2a;
    }
  }

  /* Responsive grid - always fit on screen */
  .ops-category-grid {
    grid-template-columns: repeat(3, 1fr) !important;
  }

  /* Small mobile - 2 columns */
  @media (max-width: 400px) {
    .ops-category-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
`;

// ============================================================================
// COMPONENT
// ============================================================================
export default function OpsRoom({ onBack }: OpsRoomProps) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');
  const [manualTheme, setManualTheme] = useState<ThemeMode>('auto');
  const [isLoaded, setIsLoaded] = useState(false);

  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);

  const [generationMode, setGenerationMode] = useState<GenerationMode>('specialist');
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('claude');
  const [showModeSelector, setShowModeSelector] = useState(false);

  const [simpleInput, setSimpleInput] = useState('');
  const [formFields, setFormFields] = useState<Record<string, string>>({});

  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [compareOutputs, setCompareOutputs] = useState<{ provider: AIProvider; content: string }[] | null>(null);
  const [usedProvider, setUsedProvider] = useState<AIProvider | null>(null);
  const [copied, setCopied] = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
    setTimeout(() => setIsLoaded(true), 100);
    const interval = setInterval(() => setTimeOfDay(getTimeOfDay()), 60000);
    return () => clearInterval(interval);
  }, []);

  const isDark = manualTheme === 'dark' ? true : manualTheme === 'light' ? false : (timeOfDay === 'evening' || timeOfDay === 'night');
  const colors = isDark ? TIME_COLORS.evening : TIME_COLORS[timeOfDay];

  const handleGenerate = async () => {
    if (!selectedAction) return;

    let userInput = '';
    if (selectedAction.fields) {
      userInput = selectedAction.fields.map(f => `${f.label}: ${formFields[f.id] || 'Not specified'}`).join('\n');
    } else {
      userInput = simpleInput;
    }
    if (!userInput.trim()) return;

    setIsGenerating(true);
    setOutput(null);
    setCompareOutputs(null);

    try {
      const response = await fetch('/api/ops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: selectedAction.systemPrompt,
          userInput,
          mode: generationMode,
          provider: selectedProvider,
          taskType: selectedAction.id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Generation failed');

      if (generationMode === 'compare' && data.responses) {
        setCompareOutputs(data.responses);
      } else {
        setOutput(data.content);
        setUsedProvider(data.provider || null);
      }
    } catch (err) {
      setOutput('Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text?: string) => {
    const textToCopy = text || output;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSelectedAction(null);
    setSimpleInput('');
    setFormFields({});
    setOutput(null);
    setCompareOutputs(null);
    setUsedProvider(null);
  };

  const handleBack = () => {
    if (output || compareOutputs) {
      handleReset();
    } else if (selectedAction) {
      setSelectedAction(null);
      setSimpleInput('');
      setFormFields({});
    } else if (activeCategory) {
      setActiveCategory(null);
    } else {
      onBack();
    }
  };

  const isFormValid = () => {
    if (!selectedAction) return false;
    if (selectedAction.fields) {
      const required = selectedAction.fields.filter(f => f.required);
      return required.every(f => formFields[f.id]?.trim());
    }
    return simpleInput.trim().length > 0;
  };

  return (
    <>
      <style jsx global>{GLOBAL_STYLES}</style>

      <div style={{
        position: 'fixed',
        inset: 0,
        background: colors.bg,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Ambient Background */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(120vw, 700px)',
            height: 'min(80vh, 500px)',
            background: isDark
              ? 'radial-gradient(ellipse at 50% 30%, rgba(255, 180, 100, 0.08) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at 50% 30%, rgba(255, 220, 180, 0.4) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
        </div>

        {/* Header */}
        <header style={{
          padding: '16px',
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 50,
        }}>
          <button onClick={handleBack} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
            background: colors.cardBg, border: `1px solid ${colors.cardBorder}`,
            borderRadius: 50, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: colors.textMuted,
          }}>
            ← {output || compareOutputs ? 'New' : selectedAction ? 'Back' : activeCategory ? 'Categories' : 'Sanctuary'}
          </button>

          <span style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Ops
          </span>

          <div style={{ display: 'flex', gap: 4, padding: 4, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', borderRadius: 20 }}>
            {(['light', 'auto', 'dark'] as const).map((mode) => (
              <button key={mode} onClick={() => setManualTheme(mode)} style={{
                padding: '6px 10px', borderRadius: 16, border: 'none',
                background: manualTheme === mode ? (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)') : 'transparent',
                color: manualTheme === mode ? colors.text : colors.textMuted, fontSize: 11, cursor: 'pointer',
              }}>
                {mode === 'auto' ? '◐' : mode === 'light' ? '○' : '●'}
              </button>
            ))}
          </div>
        </header>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '20px', paddingBottom: 'max(40px, env(safe-area-inset-bottom))',
            minHeight: '100%', opacity: isLoaded ? 1 : 0, transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}>

            {/* Title */}
            {!activeCategory && !output && !compareOutputs && (
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, fontWeight: 300, color: colors.text, marginBottom: 8 }}>
                  Ops
                </h1>
                <p style={{ fontSize: 14, color: colors.textMuted }}>Get things moving</p>
              </div>
            )}

            {/* AI Mode Selector Button */}
            {!activeCategory && !output && !compareOutputs && (
              <button
                onClick={() => setShowModeSelector(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', marginBottom: 20,
                  background: isDark ? 'rgba(255, 180, 100, 0.1)' : 'rgba(200, 160, 100, 0.15)',
                  border: `1px solid ${isDark ? 'rgba(255, 180, 100, 0.2)' : 'rgba(200, 160, 100, 0.25)'}`,
                  borderRadius: 50, cursor: 'pointer', fontSize: 13, color: colors.text,
                }}
              >
                <OpsIcon type={GENERATION_MODES[generationMode].iconType} color={colors.accent} />
                <span>{GENERATION_MODES[generationMode].name}</span>
                {generationMode === 'single' && <span style={{ color: AI_PROVIDERS[selectedProvider].color }}>({AI_PROVIDERS[selectedProvider].name})</span>}
              </button>
            )}

            {/* Category Grid - Balanced size */}
            {!activeCategory && !output && !compareOutputs && (
              <div style={{
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: 12,
                maxWidth: 600, 
                width: '100%', 
                animation: 'fadeIn 0.4s ease-out',
              }}
              className="ops-category-grid"
              >
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} className="card-btn" onClick={() => setActiveCategory(cat.id)} style={{
                    padding: '18px 12px',
                    background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.85)',
                    border: `1px solid ${colors.cardBorder}`, borderRadius: 14,
                    cursor: 'pointer', textAlign: 'center',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                  }}>
                    <div style={{
                      width: 40, 
                      height: 40, 
                      borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isDark ? 'rgba(255, 180, 100, 0.1)' : 'rgba(200, 160, 100, 0.12)',
                      border: `1px solid ${isDark ? 'rgba(255, 180, 100, 0.18)' : 'rgba(200, 160, 100, 0.2)'}`,
                      marginBottom: 10,
                    }}>
                      <OpsIcon type={cat.icon} color={colors.accent} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: colors.text, lineHeight: 1.3, marginBottom: 4 }}>{cat.title}</div>
                    <div style={{ fontSize: 11, color: colors.textMuted, lineHeight: 1.3 }}>{cat.description}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Action Grid - Same style as categories */}
            {activeCategory && !selectedAction && !output && !compareOutputs && (
              <div style={{ width: '100%', maxWidth: 600, animation: 'fadeIn 0.4s ease-out' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 300, color: colors.text, marginBottom: 8 }}>
                    {CATEGORIES.find(c => c.id === activeCategory)?.title}
                  </h2>
                  <p style={{ fontSize: 14, color: colors.textMuted, maxWidth: 400, margin: '0 auto', lineHeight: 1.5 }}>
                    {activeCategory === 'communication' && 'Choose a tool to help you communicate clearly and confidently.'}
                    {activeCategory === 'work' && 'Tools to help you navigate your career with clarity and confidence.'}
                    {activeCategory === 'life' && 'Handle the tasks that drain your energy so you can focus on what matters.'}
                    {activeCategory === 'content' && 'Create content that connects and resonates with your audience.'}
                    {activeCategory === 'thinking' && 'Frameworks to help you think through decisions and untangle complexity.'}
                    {activeCategory === 'health' && 'Support for building sustainable habits and taking care of yourself.'}
                    {activeCategory === 'money' && 'Tools to help you plan, budget, and build financial stability.'}
                    {activeCategory === 'learning' && 'Accelerate your learning and deepen your understanding.'}
                    {activeCategory === 'relationships' && 'Strengthen connections and navigate relationship dynamics.'}
                    {activeCategory === 'creativity' && 'Unlock ideas and explore creative possibilities.'}
                    {activeCategory === 'planning' && 'Set meaningful goals and create actionable plans.'}
                  </p>
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: 12,
                }}
                className="ops-category-grid"
                >
                  {ACTIONS_BY_CATEGORY[activeCategory].map((action) => (
                    <button key={action.id} className="card-btn" onClick={() => { setSelectedAction(action); setFormFields({}); setSimpleInput(''); }}
                      style={{
                        padding: '20px 14px',
                        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.85)',
                        border: `1px solid ${colors.cardBorder}`, borderRadius: 14, cursor: 'pointer',
                        textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
                      }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isDark ? 'rgba(255, 180, 100, 0.1)' : 'rgba(200, 160, 100, 0.12)',
                        border: `1px solid ${isDark ? 'rgba(255, 180, 100, 0.18)' : 'rgba(200, 160, 100, 0.2)'}`,
                        marginBottom: 12,
                      }}>
                        <OpsIcon type={action.icon} color={colors.accent} />
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: colors.text, lineHeight: 1.3, marginBottom: 6 }}>{action.title}</div>
                      <div style={{ fontSize: 12, color: colors.textMuted, lineHeight: 1.4 }}>{action.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Form */}
            {selectedAction && !output && !compareOutputs && (
              <div style={{ width: '100%', maxWidth: 700, animation: 'fadeIn 0.4s ease-out' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isDark ? 'rgba(255, 180, 100, 0.1)' : 'rgba(200, 160, 100, 0.15)',
                  }}>
                    <OpsIcon type={selectedAction.icon} color={colors.accent} />
                  </div>
                  <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 300, color: colors.text }}>{selectedAction.title}</h2>
                    <p style={{ fontSize: 13, color: colors.textMuted }}>{selectedAction.description}</p>
                  </div>
                </div>

                {selectedAction.fields ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {selectedAction.fields.map((field) => (
                      <div key={field.id}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.textMuted, marginBottom: 8 }}>
                          {field.label}{field.required && <span style={{ color: colors.accent }}> *</span>}
                        </label>
                        {field.type === 'text' && (
                          <input type="text" className="input-field" value={formFields[field.id] || ''} onChange={(e) => setFormFields({ ...formFields, [field.id]: e.target.value })} placeholder={field.placeholder}
                            style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${colors.cardBorder}`, background: colors.cardBg, color: colors.text, fontSize: 15 }} />
                        )}
                        {field.type === 'textarea' && (
                          <textarea className="input-field" value={formFields[field.id] || ''} onChange={(e) => setFormFields({ ...formFields, [field.id]: e.target.value })} placeholder={field.placeholder} rows={12}
                            style={{ width: '100%', padding: '18px 20px', borderRadius: 12, border: `1px solid ${colors.cardBorder}`, background: colors.cardBg, color: colors.text, fontSize: 16, lineHeight: 1.6, resize: 'vertical', minHeight: 200 }} />
                        )}
                        {field.type === 'select' && field.options && (
                          <select className="input-field" value={formFields[field.id] || ''} onChange={(e) => setFormFields({ ...formFields, [field.id]: e.target.value })}
                            style={{ 
                              width: '100%', 
                              padding: '14px 16px', 
                              borderRadius: 12, 
                              border: `1px solid ${colors.cardBorder}`, 
                              background: isDark ? '#1e1e28' : '#ffffff', 
                              color: isDark ? '#e8e4de' : '#2a2a2a', 
                              fontSize: 15, 
                              cursor: 'pointer',
                              colorScheme: isDark ? 'dark' : 'light',
                            }}>
                            <option value="">Select...</option>
                            {field.options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <textarea className="input-field" value={simpleInput} onChange={(e) => setSimpleInput(e.target.value)} placeholder={selectedAction.placeholder} rows={10}
                    style={{ width: '100%', padding: '18px 20px', borderRadius: 12, border: `1px solid ${colors.cardBorder}`, background: colors.cardBg, color: colors.text, fontSize: 16, lineHeight: 1.6, resize: 'vertical', minHeight: 180 }} />
                )}

                <button onClick={handleGenerate} disabled={!isFormValid() || isGenerating}
                  style={{
                    width: '100%', padding: '16px', borderRadius: 50, border: 'none', marginTop: 24,
                    background: isFormValid() && !isGenerating
                      ? `linear-gradient(135deg, ${colors.accent} 0%, ${isDark ? 'rgba(160, 120, 80, 0.9)' : 'rgba(180, 140, 90, 0.9)'} 100%)`
                      : isDark ? 'rgba(255, 180, 100, 0.2)' : 'rgba(180, 150, 100, 0.3)',
                    color: 'white', fontSize: 15, fontWeight: 600, cursor: isFormValid() && !isGenerating ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}>
                  {isGenerating ? 'Generating...' : <><span>Generate</span><OpsIcon type="arrow-right" color="white" /></>}
                </button>
              </div>
            )}

            {/* Single Output */}
            {output && !compareOutputs && (
              <div style={{ width: '100%', maxWidth: 600, animation: 'fadeIn 0.4s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {usedProvider && (
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                        background: AI_PROVIDERS[usedProvider].color + '20', color: AI_PROVIDERS[usedProvider].color,
                      }}>
                        <OpsIcon type={AI_PROVIDERS[usedProvider].iconType} color={AI_PROVIDERS[usedProvider].color} />
                        {AI_PROVIDERS[usedProvider].name}
                      </span>
                    )}
                  </div>
                  <button onClick={() => handleCopy()} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
                    background: copied ? (isDark ? 'rgba(100, 200, 150, 0.2)' : 'rgba(80, 180, 120, 0.15)') : colors.cardBg,
                    border: `1px solid ${copied ? (isDark ? 'rgba(100, 200, 150, 0.4)' : 'rgba(80, 180, 120, 0.3)') : colors.cardBorder}`,
                    borderRadius: 50, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                    color: copied ? (isDark ? 'rgba(100, 200, 150, 1)' : 'rgba(60, 150, 100, 1)') : colors.textMuted,
                  }}>
                    {copied ? '✓ Copied!' : <><OpsIcon type="copy" color={colors.textMuted} />Copy</>}
                  </button>
                </div>

                <div ref={outputRef} className="output-area" style={{
                  padding: '20px', background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.9)',
                  border: `1px solid ${colors.cardBorder}`, borderRadius: 16, maxHeight: '65vh', overflowY: 'auto',
                }}>
                  <FormattedOutput content={output} colors={colors} isDark={isDark} />
                </div>

                <button onClick={handleReset} style={{
                  width: '100%', marginTop: 16, padding: '14px', background: 'transparent',
                  border: `1px solid ${colors.cardBorder}`, borderRadius: 50, color: colors.textMuted, fontSize: 14, cursor: 'pointer',
                }}>
                  Start Over
                </button>
              </div>
            )}

            {/* Compare Outputs */}
            {compareOutputs && (
              <div style={{ width: '100%', maxWidth: 900, animation: 'fadeIn 0.4s ease-out' }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 300, color: colors.text, marginBottom: 20, textAlign: 'center' }}>
                  Compare AI Responses
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {compareOutputs.map((item) => (
                    <div key={item.provider} style={{
                      padding: '16px', background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.9)',
                      border: `1px solid ${colors.cardBorder}`, borderRadius: 16,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                          background: AI_PROVIDERS[item.provider].color + '20', color: AI_PROVIDERS[item.provider].color,
                        }}>
                          <OpsIcon type={AI_PROVIDERS[item.provider].iconType} color={AI_PROVIDERS[item.provider].color} />
                          {AI_PROVIDERS[item.provider].name}
                        </span>
                        <button onClick={() => handleCopy(item.content)} style={{
                          padding: '6px 12px', borderRadius: 20, border: `1px solid ${colors.cardBorder}`,
                          background: 'transparent', color: colors.textMuted, fontSize: 11, cursor: 'pointer',
                        }}>
                          Copy
                        </button>
                      </div>
                      <div className="output-area" style={{ maxHeight: 300, overflowY: 'auto', fontSize: 14, lineHeight: 1.6, color: colors.text }}>
                        <FormattedOutput content={item.content} colors={colors} isDark={isDark} />
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={handleReset} style={{
                  width: '100%', marginTop: 20, padding: '14px', background: 'transparent',
                  border: `1px solid ${colors.cardBorder}`, borderRadius: 50, color: colors.textMuted, fontSize: 14, cursor: 'pointer',
                }}>
                  Start Over
                </button>
              </div>
            )}

            {/* Generating State */}
            {isGenerating && !output && !compareOutputs && (
              <div style={{
                width: '100%', maxWidth: 500, padding: '40px 24px',
                background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.9)',
                border: `1px solid ${colors.cardBorder}`, borderRadius: 16, textAlign: 'center',
              }}>
                <div className="generating" style={{ width: 60, height: 60, borderRadius: '50%', margin: '0 auto 20px' }} />
                <p style={{ fontSize: 15, color: colors.textMuted }}>
                  {generationMode === 'compare' ? 'Getting responses from all 3 AIs...' :
                   generationMode === 'consensus' ? 'Consulting all 3 AIs and synthesizing...' :
                   generationMode === 'review-chain' ? 'Running AI review chain...' :
                   'Working on it...'}
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Mode Selector Modal */}
        {showModeSelector && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.6)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }} onClick={() => setShowModeSelector(false)}>
            <div style={{
              background: isDark ? '#1a1520' : '#fff', borderRadius: 20, padding: 24,
              maxWidth: 400, width: '100%', maxHeight: '80vh', overflowY: 'auto',
            }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 300, color: colors.text, marginBottom: 20, textAlign: 'center' }}>
                AI Mode
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {(Object.entries(GENERATION_MODES) as [GenerationMode, typeof GENERATION_MODES[GenerationMode]][]).map(([mode, info]) => (
                  <button key={mode} onClick={() => setGenerationMode(mode)} style={{
                    padding: '14px 16px', borderRadius: 12, border: `1px solid ${generationMode === mode ? colors.accent : colors.cardBorder}`,
                    background: generationMode === mode ? (isDark ? 'rgba(255, 180, 100, 0.1)' : 'rgba(200, 160, 100, 0.1)') : 'transparent',
                    cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: generationMode === mode ? (isDark ? 'rgba(255, 180, 100, 0.15)' : 'rgba(200, 160, 100, 0.2)') : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'),
                    }}>
                      <OpsIcon type={info.iconType} color={generationMode === mode ? colors.accent : colors.textMuted} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{info.name}</div>
                      <div style={{ fontSize: 12, color: colors.textMuted }}>{info.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              {generationMode === 'single' && (
                <>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: colors.textMuted, marginBottom: 12 }}>Select AI</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(Object.entries(AI_PROVIDERS) as [AIProvider, typeof AI_PROVIDERS[AIProvider]][]).map(([provider, info]) => (
                      <button key={provider} onClick={() => setSelectedProvider(provider)} style={{
                        padding: '12px 14px', borderRadius: 10, border: `1px solid ${selectedProvider === provider ? info.color : colors.cardBorder}`,
                        background: selectedProvider === provider ? info.color + '15' : 'transparent',
                        cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                      }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: selectedProvider === provider ? info.color + '20' : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'),
                        }}>
                          <OpsIcon type={info.iconType} color={selectedProvider === provider ? info.color : colors.textMuted} />
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{info.name}</div>
                          <div style={{ fontSize: 11, color: colors.textMuted }}>{info.tagline}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button onClick={() => setShowModeSelector(false)} style={{
                width: '100%', marginTop: 20, padding: '14px', borderRadius: 50, border: 'none',
                background: colors.accent, color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer',
              }}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}