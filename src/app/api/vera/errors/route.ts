import { NextResponse } from 'next/server';
import { assertAdminOrThrow } from '../_admin';
import { getRecentErrors, logError } from '@/lib/vera/selfHealing/errorMonitor';
import { detectFixableError } from '@/lib/vera/selfHealing/autoFixer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await assertAdminOrThrow();

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '25', 10) || 25;

    const errors = await getRecentErrors(limit);
    const withFix = errors.map((e) => ({ ...e, fix: detectFixableError(e) || undefined }));
    return NextResponse.json({ errors: withFix });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown_error';
    const code = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : 500;
    return NextResponse.json({ error: msg }, { status: code });
  }
}

export async function POST(req: Request) {
  try {
    await assertAdminOrThrow();

    const body = (await req.json().catch(() => ({}))) as any;
    const type = typeof body.type === 'string' ? body.type : 'ManualError';
    const message = typeof body.message === 'string' ? body.message : 'Unknown error';
    const stack = typeof body.stack === 'string' ? body.stack : undefined;

    const err = new Error(message);
    if (stack) (err as any).stack = stack;

    const logged = await logError(err, type);
    const fix = detectFixableError(logged);
    return NextResponse.json({ error: { ...logged, fix: fix || undefined } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown_error';
    const code = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : 500;
    return NextResponse.json({ error: msg }, { status: code });
  }
}
