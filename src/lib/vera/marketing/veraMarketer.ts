import type { ContentTheme, Platform, Post } from './types';
import { generatePost } from './contentGenerator';
import { listPosts, savePost } from './store';
import { getTopPerformingContent } from './analytics';

export async function generateContentNow(platform: Platform, theme: ContentTheme): Promise<Post> {
  const post = await generatePost(platform, theme);
  return post;
}

export async function getReadyToPostContent(): Promise<Post[]> {
  const posts = await listPosts();
  return posts.filter((p) => p.status === 'ready' || p.status === 'scheduled');
}

export async function runDailyRoutine(): Promise<void> {
  // Morning: generate 2-3 posts and save as drafts.
  const platforms: Platform[] = ['instagram', 'twitter', 'tiktok'];
  const themes: ContentTheme[] = ['sleep', 'anxiety', 'all-in-one'];

  for (let i = 0; i < 3; i++) {
    const platform = platforms[i % platforms.length] as Platform;
    const theme = themes[i % themes.length] as ContentTheme;
    const post = await generatePost(platform, theme);
    await savePost({ ...post, status: 'draft' });
  }

  // Check yesterday performance (best-effort)
  await getTopPerformingContent(5).catch(() => []);
}
