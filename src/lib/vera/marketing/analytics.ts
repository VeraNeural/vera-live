import type { Performance, Post } from './types';
import { getPost, listPosts, savePost } from './store';

export async function trackPerformance(postId: string, metrics: Performance): Promise<void> {
  const post = await getPost(postId);
  await savePost({ ...post, performance: metrics });
}

export async function getTopPerformingContent(limit = 10): Promise<Post[]> {
  const posts = await listPosts();
  const scored = posts
    .filter((p) => p.performance)
    .map((p) => ({
      post: p,
      score:
        (p.performance?.signups ?? 0) * 10 +
        (p.performance?.clicks ?? 0) * 2 +
        (p.performance?.shares ?? 0) * 3 +
        (p.performance?.comments ?? 0) * 2 +
        (p.performance?.likes ?? 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post);

  return scored;
}

export async function getSignupsFromSocial(): Promise<number> {
  const posts = await listPosts();
  return posts.reduce((sum, p) => sum + (p.performance?.signups ?? 0), 0);
}

export async function generateDailyReport(): Promise<string> {
  const posts = await listPosts();
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);

  const todays = posts.filter((p) => p.scheduledFor.toISOString().slice(0, 10) === todayKey);
  const posted = todays.filter((p) => p.status === 'posted').length;
  const ready = todays.filter((p) => p.status === 'ready' || p.status === 'scheduled').length;

  const signups = await getSignupsFromSocial();

  return [
    `VERA Marketing — Daily Report (${todayKey})`,
    `Posts scheduled today: ${todays.length}`,
    `Ready/scheduled: ${ready}`,
    `Posted: ${posted}`,
    `Total tracked signups (manual): ${signups}`,
  ].join('\n');
}
