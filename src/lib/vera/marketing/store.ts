import { randomUUID } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import type { Post } from './types';

type StoredPost = Omit<Post, 'scheduledFor' | 'postedAt'> & {
  scheduledFor: string;
  postedAt?: string;
};

function toStored(post: Post): StoredPost {
  return {
    ...post,
    scheduledFor: post.scheduledFor.toISOString(),
    postedAt: post.postedAt ? post.postedAt.toISOString() : undefined,
  };
}

function fromStored(raw: StoredPost): Post {
  return {
    ...raw,
    scheduledFor: new Date(raw.scheduledFor),
    postedAt: raw.postedAt ? new Date(raw.postedAt) : undefined,
  };
}

function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function marketingBucket(): string {
  // Supabase bucket names are case-sensitive and typically lowercase.
  // Default to the existing project bucket.
  const fromEnv = (process.env.SUPABASE_MARKETING_BUCKET || '').trim();
  return fromEnv || 'vera-live';
}

function postPath(id: string): string {
  return `marketing/posts/${id}.json`;
}

export async function savePost(post: Post): Promise<Post> {
  const supabase = getSupabaseAdmin();
  const bucket = marketingBucket();
  const id = post.id || randomUUID();
  const toWrite: StoredPost = toStored({ ...post, id });

  const payload = Buffer.from(JSON.stringify(toWrite, null, 2));
  const { error } = await supabase.storage.from(bucket).upload(postPath(id), payload, {
    contentType: 'application/json',
    upsert: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { ...post, id };
}

export async function listPosts(): Promise<Post[]> {
  const supabase = getSupabaseAdmin();
  const bucket = marketingBucket();

  const { data, error } = await supabase.storage.from(bucket).list('marketing/posts', {
    limit: 500,
    sortBy: { column: 'name', order: 'desc' },
  });

  if (error) {
    throw new Error(error.message);
  }

  const posts: Post[] = [];
  for (const item of data ?? []) {
    if (!item.name.endsWith('.json')) continue;
    const id = item.name.replace(/\.json$/i, '');
    const p = await getPost(id).catch(() => null);
    if (p) posts.push(p);
  }

  // Newest scheduled first
  posts.sort((a, b) => b.scheduledFor.getTime() - a.scheduledFor.getTime());
  return posts;
}

export async function getPost(id: string): Promise<Post> {
  const supabase = getSupabaseAdmin();
  const bucket = marketingBucket();

  const { data, error } = await supabase.storage.from(bucket).download(postPath(id));
  if (error) throw new Error(error.message);

  const text = await data.text();
  const parsed = safeJsonParse<StoredPost>(text);
  if (!parsed) throw new Error('Invalid post JSON');

  return fromStored(parsed);
}

export async function deletePost(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const bucket = marketingBucket();

  const { error } = await supabase.storage.from(bucket).remove([postPath(id)]);
  if (error) throw new Error(error.message);
}
