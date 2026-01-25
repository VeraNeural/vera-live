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
      className="sr-only sr-only-focusable"
    >
      Skip to main content
    </a>
  );
}
