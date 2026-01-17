import { NextRequest, NextResponse } from 'next/server';
import { assertAdminOrThrow } from '../_admin';
import { deletePost, getPost, listPosts, savePost } from '@/lib/vera/marketing/store';
import type { Performance, Post, PostStatus } from '@/lib/vera/marketing/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await assertAdminOrThrow();
    const posts = await listPosts();
    return NextResponse.json({ posts });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'failed';
    const status = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

// Upsert/save a post (e.g. Save to Ready)
export async function POST(req: NextRequest) {
  try {
    await assertAdminOrThrow();
    const body = (await req.json()) as { post: Post };
    if (!body?.post?.id) return NextResponse.json({ error: 'Missing post' }, { status: 400 });

    const saved = await savePost(body.post);
    return NextResponse.json({ post: saved });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'failed';
    const status = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

// Patch fields like status, scheduledFor, postedAt, performance
export async function PATCH(req: NextRequest) {
  try {
    await assertAdminOrThrow();

    const body = (await req.json()) as {
      id: string;
      status?: PostStatus;
      scheduledFor?: string;
      postedAt?: string | null;
      performance?: Performance;
    };

    if (!body?.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const existing = await getPost(body.id);

    const updated: Post = {
      ...existing,
      status: body.status ?? existing.status,
      scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : existing.scheduledFor,
      postedAt: body.postedAt === null ? undefined : body.postedAt ? new Date(body.postedAt) : existing.postedAt,
      performance: body.performance ?? existing.performance,
    };

    await savePost(updated);

    return NextResponse.json({ post: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'failed';
    const status = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await assertAdminOrThrow();
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await deletePost(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'failed';
    const status = msg === 'unauthorized' ? 401 : msg === 'forbidden' ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
