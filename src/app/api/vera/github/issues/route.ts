import { NextResponse } from 'next/server';
import { assertAdminOrThrow } from '../../_admin';
import type { ErrorLog } from '@/lib/vera/selfHealing/types';
import { createIssue } from '@/lib/vera/selfHealing/githubIntegration';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await assertAdminOrThrow();

    const body = (await req.json().catch(() => ({}))) as any;
    const error = body?.error as ErrorLog | undefined;

    if (!error || typeof error.id !== 'string' || typeof error.type !== 'string' || typeof error.message !== 'string') {
      return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
    }

    const url = await createIssue(error);
    return NextResponse.json({ url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown_error';
    const code = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : msg.startsWith('missing_github_') ? 500 : 500;
    return NextResponse.json({ error: msg }, { status: code });
  }
}
