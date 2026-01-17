'use client';

import { useCallback } from 'react';
import type { NavigationResult } from '../types';
import { parseIntent } from '../intentParser';
import { routeAction } from '../actionRouter';

export function useVeraNavigator() {
  const executeCommand = useCallback((message: string): NavigationResult | null => {
    const intent = parseIntent(message);
    if (!intent) return null;

    return routeAction(intent);
  }, []);

  return { executeCommand };
}
