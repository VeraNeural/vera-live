import { NextResponse } from 'next/server';
import { assertAdminOrThrow } from '../../../_admin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import type { ErrorLog } from '@/lib/vera/selfHealing/types';
import { detectFixableError, applyFix } from '@/lib/vera/selfHealing/autoFixer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fromRow(row: any): ErrorLog {
  return {
    id: String(row.id),
    timestamp: String(row.timestamp ?? row.created_at ?? new Date().toISOString()),
    type: String(row.type ?? 'unknown'),
    message: String(row.message ?? ''),
    stack: row.stack ? String(row.stack) : undefined,
    file: row.file ? String(row.file) : undefined,
    resolved: Boolean(row.resolved),
  };
}

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await assertAdminOrThrow();
    const { id } = await ctx.params;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('vera_errors')
      .select('id,timestamp,type,message,stack,file,resolved,created_at')
      .eq('id', id)
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return NextResponse.json({ error: 'not_found' }, { status: 404 });

    const err: ErrorLog = fromRow(data);
    const fix = detectFixableError(err);
    if (!fix) return NextResponse.json({ ok: false, reason: 'no_fix_available' });

    const success = await applyFix(fix);
    return NextResponse.json({ ok: success, fix });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown_error';
    const code = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : 500;
    return NextResponse.json({ error: msg }, { status: code });
  }
}
