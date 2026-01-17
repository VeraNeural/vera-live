import { randomUUID } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import type { ErrorLog } from './types';

function nowIso(): string {
  return new Date().toISOString();
}

function inferFileFromStack(stack?: string): string | undefined {
  if (!stack) return undefined;
  // Best-effort: first file-like token in stack trace.
  const m = stack.match(/\(?([^\s()]+\.(?:ts|tsx|js|jsx))(?::\d+:\d+)?\)?/);
  return m?.[1];
}

function toErrorLogRow(input: {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  stack?: string;
  file?: string;
  resolved: boolean;
}): Record<string, any> {
  return {
    id: input.id,
    timestamp: input.timestamp,
    type: input.type,
    message: input.message,
    stack: input.stack ?? null,
    file: input.file ?? null,
    resolved: input.resolved,
  };
}

function fromRow(row: any): ErrorLog {
  return {
    id: String(row.id),
    timestamp: String(row.timestamp ?? row.created_at ?? nowIso()),
    type: String(row.type ?? 'unknown'),
    message: String(row.message ?? ''),
    stack: row.stack ? String(row.stack) : undefined,
    file: row.file ? String(row.file) : undefined,
    resolved: Boolean(row.resolved),
  };
}

/**
 * Save an error to Supabase (best-effort).
 * If the vera_errors table doesn't exist yet, this will not throw.
 */
export async function logError(error: Error, context?: string): Promise<ErrorLog> {
  const id = randomUUID();
  const type = context || (error as any)?.name || 'Error';
  const message = (error as any)?.message ? String((error as any).message) : String(error);
  const stack = typeof (error as any)?.stack === 'string' ? String((error as any).stack) : undefined;
  const file = inferFileFromStack(stack);

  const entry: ErrorLog = {
    id,
    timestamp: nowIso(),
    type,
    message,
    stack,
    file,
    resolved: false,
  };

  try {
    const supabase = getSupabaseAdmin();
    const { error: insertErr } = await supabase.from('vera_errors').insert(toErrorLogRow(entry));
    if (insertErr) {
      console.error('[selfHealing] Failed to insert vera_errors', insertErr.message);
    }
  } catch (e) {
    console.error('[selfHealing] logError failed', e);
  }

  return entry;
}

export async function getRecentErrors(limit: number): Promise<ErrorLog[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('vera_errors')
    .select('id,timestamp,type,message,stack,file,resolved,created_at')
    .order('timestamp', { ascending: false })
    .limit(Math.max(1, Math.min(200, limit || 50)));

  if (error) throw new Error(error.message);
  return (data ?? []).map(fromRow);
}

export async function getErrorsByType(type: string): Promise<ErrorLog[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('vera_errors')
    .select('id,timestamp,type,message,stack,file,resolved,created_at')
    .eq('type', type)
    .order('timestamp', { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);
  return (data ?? []).map(fromRow);
}

export async function markResolved(errorId: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('vera_errors').update({ resolved: true }).eq('id', errorId);
  if (error) throw new Error(error.message);
}
