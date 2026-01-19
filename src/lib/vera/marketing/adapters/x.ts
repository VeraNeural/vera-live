import type { AdapterInput, AdapterResult } from './types';

const X_API_BASE = (process.env.X_API_BASE || 'https://api.x.com/2').trim();
const X_ACCESS_TOKEN = (process.env.X_ACCESS_TOKEN || '').trim();

export async function postToPlatform(input: AdapterInput): Promise<AdapterResult> {
  if (input.platform !== 'twitter') {
    return { success: false, error: 'unsupported_platform' };
  }

  if (!X_ACCESS_TOKEN) {
    return { success: false, error: 'missing_x_access_token' };
  }

  const text = (input.post.caption || '').trim();
  if (!text) {
    return { success: false, error: 'empty_post_body' };
  }

  const resp = await fetch(`${X_API_BASE}/tweets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${X_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  const data = (await resp.json().catch(() => ({}))) as any;

  if (!resp.ok) {
    return { success: false, error: data?.error || data?.detail || `http_${resp.status}` };
  }

  const externalId = data?.data?.id ? String(data.data.id) : undefined;
  return { success: true, externalId };
}
