/**
 * Vitest Setup File for Accessibility Testing
 * 
 * This file extends Vitest's expect with vitest-axe matchers
 * for accessibility testing.
 */

import * as matchers from 'vitest-axe/matchers';
import { expect } from 'vitest';

// Extend Vitest expect with axe matchers
expect.extend(matchers);

// Type augmentation for vitest-axe matchers
import 'vitest-axe/extend-expect';
