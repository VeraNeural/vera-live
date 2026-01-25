/// <reference types="vitest-axe" />
/**
 * Accessibility Testing Utilities
 * 
 * Uses vitest-axe to run automated WCAG 2.1 AA checks on React components.
 * 
 * Usage:
 *   import { checkA11y, axe } from '../utils/a11y';
 *   
 *   it('has no a11y violations', async () => {
 *     const { container } = render(<MyComponent />);
 *     await checkA11y(container);
 *   });
 */

import { axe, configureAxe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import type { AxeCore } from 'vitest-axe';
import { expect } from 'vitest';

// Re-export axe for direct usage
export { axe };

/**
 * Configured axe instance with WCAG 2.1 AA rules enabled
 */
export const axeWcagAA = configureAxe({
  rules: {
    // Core WCAG 2.1 AA rules
    'color-contrast': { enabled: true },
    'label': { enabled: true },
    'button-name': { enabled: true },
    'image-alt': { enabled: true },
    'link-name': { enabled: true },
  },
});

/**
 * Check a DOM container for accessibility violations
 * Throws if any violations are found
 */
export async function checkA11y(
  container: Element | string,
  options?: AxeCore.RunOptions
) {
  const results = await axe(container, options);
  expect(results).toHaveNoViolations();
}

/**
 * Get a11y violations without throwing
 * Useful for detailed reporting
 */
export async function getA11yViolations(
  container: Element | string,
  options?: AxeCore.RunOptions
): Promise<AxeCore.Result[]> {
  const results = await axe(container, options);
  return results.violations;
}

/**
 * Format violations for readable output
 */
export function formatViolations(violations: AxeCore.Result[]): string {
  if (violations.length === 0) return 'No violations found';
  
  return violations.map(v => 
    `${v.id} (${v.impact}): ${v.description}\n  Affected: ${v.nodes.map(n => n.html).join(', ')}`
  ).join('\n\n');
}
