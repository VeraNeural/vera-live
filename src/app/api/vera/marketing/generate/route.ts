import { NextRequest, NextResponse } from 'next/server';
import { assertAdminOrThrow } from '../_admin';
import type { ContentTheme, Platform } from '@/lib/vera/marketing/types';
import { generateContentNow } from '@/lib/vera/marketing/veraMarketer';
import { savePost } from '@/lib/vera/marketing/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await assertAdminOrThrow();

    const body = (await req.json().catch(() => null)) as { platform?: Platform; theme?: ContentTheme } | null;
    const platform = body?.platform;
    const theme = body?.theme;

    if (!platform || !theme) {
      return NextResponse.json({ error: 'Missing platform or theme' }, { status: 400 });
    }

    const post = await generateContentNow(platform, theme);

    // Save as draft by default so the dashboard can promote to ready.
    await savePost({ ...post, status: 'draft' });

    return NextResponse.json({ post });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'failed';
    const status = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
