'use client';

import Link from 'next/link';

interface LegalLinksProps {
  isDark?: boolean;
  size?: 'small' | 'medium';
  className?: string;
}

/**
 * LegalLinks - Reusable footer links to legal pages
 * 
 * Displays: Privacy · Terms · Disclaimer
 */
export function LegalLinks({ isDark = true, size = 'small' }: LegalLinksProps) {
  const fontSize = size === 'small' ? 11 : 12;
  const color = isDark ? 'rgba(255, 250, 240, 0.45)' : 'rgba(35, 30, 25, 0.45)';
  const hoverColor = isDark ? 'rgba(255, 250, 240, 0.7)' : 'rgba(35, 30, 25, 0.7)';

  const linkStyle: React.CSSProperties = {
    color,
    textDecoration: 'none',
    transition: 'color 0.15s ease',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontSize,
        fontWeight: 400,
      }}
    >
      <Link
        href="/legal/privacy"
        style={linkStyle}
        onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
        onMouseLeave={(e) => (e.currentTarget.style.color = color)}
      >
        Privacy
      </Link>
      <span style={{ color, opacity: 0.6 }}>·</span>
      <Link
        href="/legal/terms"
        style={linkStyle}
        onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
        onMouseLeave={(e) => (e.currentTarget.style.color = color)}
      >
        Terms
      </Link>
      <span style={{ color, opacity: 0.6 }}>·</span>
      <Link
        href="/legal/disclaimer"
        style={linkStyle}
        onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
        onMouseLeave={(e) => (e.currentTarget.style.color = color)}
      >
        Disclaimer
      </Link>
    </div>
  );
}

export default LegalLinks;
