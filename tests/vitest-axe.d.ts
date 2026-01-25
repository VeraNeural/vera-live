/**
 * Type declarations for vitest-axe matchers
 * 
 * These extend Vitest's Assertion interface with
 * the toHaveNoViolations matcher from vitest-axe.
 */

import type { AxeResults } from 'axe-core';

declare module 'vitest' {
  interface Assertion<T = any> {
    /**
     * Assert that there are no axe accessibility violations
     */
    toHaveNoViolations(): void;
  }
  
  interface AsymmetricMatchersContaining {
    /**
     * Assert that there are no axe accessibility violations
     */
    toHaveNoViolations(): void;
  }
}
