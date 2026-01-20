import React, { useMemo } from 'react';
import { OutputIcon } from '../icons';

// ============================================================================
// FORMATTED OUTPUT COMPONENT
// ============================================================================

interface FormattedOutputProps {
  content: string;
  colors: {
    bg: string;
    accent: string;
    text: string;
    textMuted: string;
    cardBg: string;
    cardBorder: string;
    glow: string;
  };
  isDark: boolean;
  showSignatureBadge?: boolean;
}

interface Section {
  title: string;
  content: string[];
  type: 'header' | 'list' | 'quote' | 'text';
}

interface InterpretationBlock {
  title: string;
  body: string;
}

export const FormattedOutput: React.FC<FormattedOutputProps> = ({ 
  content, 
  colors, 
  isDark,
  showSignatureBadge = false,
}) => {
  const hasSignatureBadge = useMemo(() => {
    return showSignatureBadge && /(^|\n)VERA Signature Decode™(\n|$)/m.test(content);
  }, [content, showSignatureBadge]);

  // Clean up the content - remove asterisks, hashtags, dashes as pauses, emojis
  const cleanContent = useMemo(() => {
    let cleaned = content
      .replace(/(^|\n)VERA Signature Decode™(\n|$)/m, '\n')
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
    const result: Section[] = [];
    let currentSection: Section | null = null;

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

  const isAlternativeInterpretations = (title: string) =>
    title.trim().toLowerCase() === 'alternative interpretations';

  const formatAlternativeTitle = () => 'Ways to Understand What’s Happening';

  const splitInterpretation = (text: string): InterpretationBlock => {
    const candidates = [' — ', ' - ', ': '];
    for (const sep of candidates) {
      const idx = text.indexOf(sep);
      if (idx > 0 && idx < text.length - 2) {
        const title = text.slice(0, idx).trim();
        const body = text.slice(idx + sep.length).trim();
        if (title && body) return { title, body };
      }
    }
    const sentenceMatch = text.match(/^(.*?[.!?])\s+(.*)$/);
    if (sentenceMatch) {
      const [, first, rest] = sentenceMatch;
      return { title: first.trim(), body: rest.trim() };
    }
    return { title: 'Interpretation', body: text.trim() };
  };

  const getInterpretationBlocks = (section: Section): InterpretationBlock[] => {
    const source = section.content.length ? section.content : [];
    return source.map((item) => splitInterpretation(item)).filter((block) => block.body);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
      {hasSignatureBadge && (
        <div
          title="A VERA Signature Decode delivers a decisive interpretation of intent, power dynamics, and consequences — without hedging or speculation."
          style={{
            position: 'absolute',
            top: -10,
            right: 0,
            padding: '6px 12px',
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(35,30,25,0.9)',
            background: isDark ? 'rgba(255, 200, 120, 0.12)' : 'rgba(200, 160, 100, 0.2)',
            border: `1px solid ${isDark ? 'rgba(255, 200, 120, 0.28)' : 'rgba(160, 120, 80, 0.35)'}`,
            boxShadow: isDark ? 'none' : '0 6px 16px rgba(0,0,0,0.08)',
            zIndex: 2,
            pointerEvents: 'auto',
          }}
        >
          VERA Signature Decode™
        </div>
      )}
      {sections.map((section, idx) => {
        if (isAlternativeInterpretations(section.title)) {
          const blocks = getInterpretationBlocks(section);
          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 2 }}>
                {formatAlternativeTitle()}
              </div>
              {blocks.map((block, blockIndex) => (
                <div key={blockIndex} style={{
                  paddingTop: blockIndex === 0 ? 0 : 12,
                  borderTop: blockIndex === 0 ? 'none' : `1px solid ${colors.cardBorder}`,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>
                    {block.title}
                  </div>
                  <div style={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.6, marginTop: 4 }}>
                    {block.body}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        return (
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
                    lineHeight: 1.7, 
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
                      marginTop: 9,
                      opacity: 0.7,
                    }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : section.type === 'quote' ? (
              <div style={{
                padding: '16px 20px',
                background: isDark ? 'rgba(255, 180, 100, 0.06)' : 'rgba(200, 160, 100, 0.1)',
                borderRadius: 12, 
                fontStyle: 'italic', 
                fontSize: 15, 
                lineHeight: 1.8, 
                color: colors.text,
                borderLeft: `3px solid ${colors.accent}`,
              }}>{section.content.join(' ')}</div>
            ) : (
              <div style={{ fontSize: 15, lineHeight: 1.8, color: colors.text }}>
                {section.content.map((text, i) => (
                  <p key={i} style={{ margin: i > 0 ? '16px 0 0 0' : 0 }}>{text}</p>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
