import { NextRequest, NextResponse } from 'next/server';
import { assertAdminOrThrow } from '../_admin';
import { getPost, savePost } from '@/lib/vera/marketing/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await assertAdminOrThrow();

    const body = (await req.json()) as { postId?: string; scheduledFor?: string };
    const postId = (body.postId || '').trim();
    const scheduledFor = (body.scheduledFor || '').trim();

    if (!postId || !scheduledFor) {
      return NextResponse.json({ error: 'Missing postId or scheduledFor' }, { status: 400 });
    }

    const post = await getPost(postId);
    const next = {
      ...post,
      status: 'scheduled' as const,
      scheduledFor: new Date(scheduledFor),
    };

    await savePost(next);

    return NextResponse.json({ post: next });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'failed';
    const status = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
