'use client';

/**
 * SkipLink - Accessibility skip navigation link
 * 
 * Allows keyboard users to skip directly to main content,
 * bypassing navigation and other repetitive elements.
 * 
 * WCAG 2.1 AA: Success Criterion 2.4.1 (Bypass Blocks)
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 'auto',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        zIndex: 9999,
      }}
      onFocus={(e) => {
        // Make visible when focused
        e.currentTarget.style.left = '16px';
        e.currentTarget.style.top = '16px';
        e.currentTarget.style.width = 'auto';
        e.currentTarget.style.height = 'auto';
        e.currentTarget.style.padding = '12px 24px';
        e.currentTarget.style.background = '#1a1520';
        e.currentTarget.style.color = '#fff';
        e.currentTarget.style.borderRadius = '8px';
        e.currentTarget.style.textDecoration = 'none';
        e.currentTarget.style.fontWeight = '600';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      }}
      onBlur={(e) => {
        // Hide when focus leaves
        e.currentTarget.style.left = '-9999px';
        e.currentTarget.style.width = '1px';
        e.currentTarget.style.height = '1px';
        e.currentTarget.style.padding = '0';
      }}
    >
      Skip to main content
    </a>
  );
}
