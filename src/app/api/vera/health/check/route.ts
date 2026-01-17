import { NextResponse } from 'next/server';
import { assertAdminOrThrow } from '../../_admin';
import { runAllChecks } from '@/lib/vera/selfHealing/healthChecks';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await assertAdminOrThrow();
    const status = await runAllChecks();
    return NextResponse.json(status);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown_error';
    const code = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : 500;
    return NextResponse.json({ error: msg }, { status: code });
  }
}
