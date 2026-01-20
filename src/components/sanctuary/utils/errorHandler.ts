/**
 * Centralized error handling utilities for OpsRoom and orchestrators
 * Provides consistent error handling, logging, and user-friendly messages
 */

export interface ErrorContext {
  operation: string;
  activityId?: string;
  provider?: string;
  userMessage?: string;
}

export interface ErrorHandlerOptions {
  fallbackMessage?: string;
  logToConsole?: boolean;
  onError?: (error: Error, context: ErrorContext) => void;
}

/**
 * Default fallback error message for user-facing errors
 */
export const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

/**
 * Logs error to console in development mode only
 */
export function logError(error: unknown, context: ErrorContext): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context.operation}] Error:`, error);
    if (context.activityId) {
      console.error(`Activity ID: ${context.activityId}`);
    }
    if (context.provider) {
      console.error(`Provider: ${context.provider}`);
    }
  }
}

/**
 * Extracts error message from various error types
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error occurred';
}

/**
 * Handles API response errors and throws appropriate error
 */
export async function handleApiResponse(response: Response): Promise<unknown> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }
  return data;
}

/**
 * Wraps async function with try-catch and error handling
 * Returns result or null on error
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  context: ErrorContext,
  options: ErrorHandlerOptions = {}
): Promise<T | null> {
  const { logToConsole = true, onError } = options;

  try {
    return await fn();
  } catch (error) {
    if (logToConsole) {
      logError(error, context);
    }
    if (onError) {
      onError(error instanceof Error ? error : new Error(String(error)), context);
    }
    return null;
  }
}

/**
 * Wraps async function with try-catch, returns fallback value on error
 */
export async function safeAsyncWithFallback<T>(
  fn: () => Promise<T>,
  fallbackValue: T,
  context: ErrorContext,
  options: ErrorHandlerOptions = {}
): Promise<T> {
  const result = await safeAsync(fn, context, options);
  return result ?? fallbackValue;
}

/**
 * Wraps API generation call with consistent error handling
 * Sets output state and handles errors gracefully
 */
export async function handleGenerateWithState<TOutput>(
  generateFn: () => Promise<TOutput>,
  setOutput: (output: TOutput | string) => void,
  setGenerating: (generating: boolean) => void,
  context: ErrorContext,
  options: ErrorHandlerOptions = {}
): Promise<void> {
  const { fallbackMessage = DEFAULT_ERROR_MESSAGE } = options;

  setGenerating(true);
  setOutput(null as never);

  try {
    const result = await generateFn();
    setOutput(result);
  } catch (error) {
    logError(error, context);
    setOutput(fallbackMessage);
  } finally {
    setGenerating(false);
  }
}

/**
 * Handles localStorage operations with error catching
 */
export function safeLocalStorage<T>(
  operation: 'get' | 'set' | 'remove',
  key: string,
  value?: T
): T | null {
  try {
    switch (operation) {
      case 'get': {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
      case 'set': {
        if (value !== undefined) {
          localStorage.setItem(key, JSON.stringify(value));
        }
        return value ?? null;
      }
      case 'remove': {
        localStorage.removeItem(key);
        return null;
      }
    }
  } catch (error) {
    logError(error, { operation: `localStorage.${operation}`, userMessage: `Key: ${key}` });
    return null;
  }
}

/**
 * Handles clipboard operations with error catching
 */
export async function safeCopyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    logError(error, { operation: 'clipboard.writeText' });
    return false;
  }
}

/**
 * Wraps fetch API call with error handling and JSON parsing
 */
export async function safeFetch<T = unknown>(
  url: string,
  options: RequestInit = {},
  context: ErrorContext
): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await fetch(url, options);
    const data = await handleApiResponse(response);
    return { data: data as T, error: null };
  } catch (error) {
    logError(error, context);
    return { data: null, error: extractErrorMessage(error) };
  }
}

/**
 * Validates user input before generation
 */
export function validateInput(
  input: string,
  minLength: number = 1,
  fieldName: string = 'Input'
): { valid: boolean; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, error: `${fieldName} is required` };
  }
  if (trimmed.length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  return { valid: true };
}

/**
 * Handles multiple state updates with error catching
 * Useful for resetting state after errors
 */
export function safeStateUpdate(updateFn: () => void, context: ErrorContext): void {
  try {
    updateFn();
  } catch (error) {
    logError(error, { ...context, operation: `${context.operation} (state update)` });
  }
}

/**
 * Parses JSON with fallback value
 */
export function safeJsonParse<T>(
  jsonString: string,
  fallbackValue: T,
  context: ErrorContext
): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    logError(error, { ...context, operation: `${context.operation} (JSON parse)` });
    return fallbackValue;
  }
}

/**
 * Error boundary-style handler for components
 * Use in useEffect cleanup or error scenarios
 */
export function createErrorBoundary(componentName: string) {
  return {
    logError: (error: unknown, info?: string) => {
      logError(error, {
        operation: componentName,
        userMessage: info,
      });
    },
    handleError: (error: unknown, fallback?: () => void) => {
      logError(error, { operation: componentName });
      if (fallback) {
        try {
          fallback();
        } catch (fallbackError) {
          logError(fallbackError, {
            operation: `${componentName} (fallback)`,
          });
        }
      }
    },
  };
}
