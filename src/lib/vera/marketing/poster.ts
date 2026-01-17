import type { Post } from './types';
import { savePost } from './store';

// Prepared for API integration.
// For now, we persist posts with status="ready" so the admin dashboard can copy/paste.

export async function postToTwitter(post: Post): Promise<{ success: boolean; postId?: string }> {
  await savePost({ ...post, status: 'ready' });
  return { success: true, postId: post.id };
}

export async function postToInstagram(post: Post): Promise<{ success: boolean; postId?: string }> {
  await savePost({ ...post, status: 'ready' });
  return { success: true, postId: post.id };
}
