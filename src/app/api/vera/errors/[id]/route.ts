import { NextResponse } from 'next/server';
import { assertAdminOrThrow } from '../../_admin';
import { markResolved } from '@/lib/vera/selfHealing/errorMonitor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await assertAdminOrThrow();
    const { id } = await ctx.params;
    await markResolved(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown_error';
    const code = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : 500;
    return NextResponse.json({ error: msg }, { status: code });
  }
}
