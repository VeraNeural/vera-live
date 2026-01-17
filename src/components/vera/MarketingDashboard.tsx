'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ContentTheme, Platform, Post, PostStatus, Performance } from '@/lib/vera/marketing/types';

type Tab = 'generate' | 'ready' | 'posted' | 'analytics';

const PLATFORMS: Platform[] = ['instagram', 'twitter', 'tiktok', 'linkedin'];
const THEMES: ContentTheme[] = [
  'sleep',
  'anxiety',
  'productivity',
  'all-in-one',
  'navigation',
  'ops',
  'language',
  'cost-savings',
  'feature-demo',
  'testimonial',
  'behind-the-scenes',
];

function prettyPlatform(p: Platform): string {
  return p[0].toUpperCase() + p.slice(1);
}

function prettyTheme(t: ContentTheme): string {
  return t.replace(/-/g, ' ');
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  const data = (await res.json().catch(() => ({}))) as any;
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data as T;
}

export default function MarketingDashboard() {
  const [tab, setTab] = useState<Tab>('generate');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [platform, setPlatform] = useState<Platform>('instagram');
  const [theme, setTheme] = useState<ContentTheme>('sleep');
  const [generated, setGenerated] = useState<Post | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    const data = await api<{ posts: Post[] }>('/api/vera/marketing/posts');
    setPosts(data.posts);
  }, []);

  useEffect(() => {
    refresh().catch((e) => setError(e instanceof Error ? e.message : 'Failed to load posts'));
  }, [refresh]);

  const stats = useMemo(() => {
    const generatedCount = posts.length;
    const readyCount = posts.filter((p) => p.status === 'ready' || p.status === 'scheduled').length;
    const postedCount = posts.filter((p) => p.status === 'posted').length;
    const signups = posts.reduce((sum, p) => sum + (p.performance?.signups ?? 0), 0);
    return { generatedCount, readyCount, postedCount, signups };
  }, [posts]);

  const filtered = useMemo(() => {
    if (tab === 'ready') return posts.filter((p) => p.status === 'ready' || p.status === 'scheduled');
    if (tab === 'posted') return posts.filter((p) => p.status === 'posted');
    if (tab === 'analytics') return posts;
    return posts;
  }, [posts, tab]);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api<{ post: Post }>('/api/vera/marketing/generate', {
        method: 'POST',
        body: JSON.stringify({ platform, theme }),
      });
      setGenerated(data.post);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  }, [platform, theme, refresh]);

  const saveToReady = useCallback(
    async (post: Post) => {
      setLoading(true);
      setError(null);
      try {
        const updated: Post = { ...post, status: 'ready' };
        await api('/api/vera/marketing/posts', { method: 'POST', body: JSON.stringify({ post: updated }) });
        setGenerated(updated);
        await refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Save failed');
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  const copyToClipboard = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
  }, []);

  const markPosted = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await api('/api/vera/marketing/posts', {
          method: 'PATCH',
          body: JSON.stringify({ id, status: 'posted', postedAt: new Date().toISOString() }),
        });
        await refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Update failed');
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  const deleteOne = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await api(`/api/vera/marketing/posts?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
        await refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Delete failed');
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  const updatePerformance = useCallback(
    async (id: string, performance: Performance) => {
      setLoading(true);
      setError(null);
      try {
        await api('/api/vera/marketing/posts', {
          method: 'PATCH',
          body: JSON.stringify({ id, performance }),
        });
        await refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Performance update failed');
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  const Card = ({ children }: { children: any }) => (
    <div
      style={{
        border: '1px solid rgba(255,255,255,0.10)',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 16,
        padding: 16,
      }}
    >
      {children}
    </div>
  );

  const Pill = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      style={{
        padding: '8px 12px',
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.12)',
        background: active ? 'rgba(139,92,246,0.25)' : 'transparent',
        color: 'rgba(255,255,255,0.92)',
        cursor: 'pointer',
        fontSize: 13,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ color: 'rgba(255,255,255,0.92)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>VERA Marketing Engine</div>
          <div style={{ opacity: 0.75, marginTop: 4, fontSize: 13 }}>
            Generate posts, queue them as ready, and track performance (manual for now).
          </div>
        </div>
        <button
          onClick={() => refresh().catch(() => null)}
          style={{
            padding: '10px 14px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.92)',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginTop: 16 }}>
        <Card>
          <div style={{ opacity: 0.7, fontSize: 12 }}>Posts generated</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{stats.generatedCount}</div>
        </Card>
        <Card>
          <div style={{ opacity: 0.7, fontSize: 12 }}>Ready/scheduled</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{stats.readyCount}</div>
        </Card>
        <Card>
          <div style={{ opacity: 0.7, fontSize: 12 }}>Published</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{stats.postedCount}</div>
        </Card>
        <Card>
          <div style={{ opacity: 0.7, fontSize: 12 }}>Signups (manual)</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{stats.signups}</div>
        </Card>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
        <Pill active={tab === 'generate'} label="Generate" onClick={() => setTab('generate')} />
        <Pill active={tab === 'ready'} label="Ready to Post" onClick={() => setTab('ready')} />
        <Pill active={tab === 'posted'} label="Posted" onClick={() => setTab('posted')} />
        <Pill active={tab === 'analytics'} label="Analytics" onClick={() => setTab('analytics')} />
      </div>

      {error && (
        <div style={{ marginTop: 12, color: 'rgba(255,120,120,0.95)' }}>{error}</div>
      )}

      {tab === 'generate' && (
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Card>
            <div style={{ fontWeight: 700 }}>Generate</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, opacity: 0.9 }}>
                Platform
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  style={{ padding: 10, borderRadius: 12, background: 'rgba(0,0,0,0.25)', color: 'white', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {prettyPlatform(p)}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, opacity: 0.9 }}>
                Theme
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as ContentTheme)}
                  style={{ padding: 10, borderRadius: 12, background: 'rgba(0,0,0,0.25)', color: 'white', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  {THEMES.map((t) => (
                    <option key={t} value={t}>
                      {prettyTheme(t)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button
              onClick={() => generate()}
              disabled={loading}
              style={{
                marginTop: 12,
                padding: '10px 14px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(139,92,246,0.25)',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 700,
              }}
            >
              {loading ? 'Generating…' : 'Generate Post'}
            </button>

            {generated && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, opacity: 0.7 }}>Preview</div>
                <div style={{ marginTop: 8, whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: 13 }}>
                  {generated.caption}
                </div>
                <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => saveToReady(generated)}
                    disabled={loading}
                    style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'white', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Save to Ready
                  </button>
                  <button
                    onClick={() => copyToClipboard(generated.caption)}
                    style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'white', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </Card>

          <Card>
            <div style={{ fontWeight: 700 }}>Recent drafts</div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {posts
                .filter((p) => p.status === 'draft')
                .slice(0, 6)
                .map((p) => (
                  <div key={p.id} style={{ border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ fontSize: 12, opacity: 0.8 }}>
                        {prettyPlatform(p.platform)} • {prettyTheme(p.theme)}
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.6 }}>{p.status}</div>
                    </div>
                    <div style={{ marginTop: 8, whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.5 }}>
                      {p.caption}
                    </div>
                    <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button onClick={() => saveToReady(p)} style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'white', cursor: 'pointer' }}>
                        Save to Ready
                      </button>
                      <button onClick={() => copyToClipboard(p.caption)} style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'white', cursor: 'pointer' }}>
                        Copy
                      </button>
                      <button onClick={() => deleteOne(p.id)} style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,60,60,0.12)', color: 'white', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

              {posts.filter((p) => p.status === 'draft').length === 0 && (
                <div style={{ opacity: 0.7, fontSize: 13 }}>No drafts yet.</div>
              )}
            </div>
          </Card>
        </div>
      )}

      {tab !== 'generate' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((p) => (
            <Card key={p.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                <div style={{ fontWeight: 700 }}>
                  {prettyPlatform(p.platform)} • {prettyTheme(p.theme)}
                </div>
                <div style={{ opacity: 0.7, fontSize: 12 }}>{p.status}</div>
              </div>

              <div style={{ marginTop: 8, whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.55 }}>
                {p.caption}
              </div>

              <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button onClick={() => copyToClipboard(p.caption)} style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'white', cursor: 'pointer', fontWeight: 700 }}>
                  Copy to Clipboard
                </button>

                {p.status !== 'posted' && (
                  <button onClick={() => markPosted(p.id)} style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(139,92,246,0.25)', color: 'white', cursor: 'pointer', fontWeight: 700 }}>
                    Mark as Posted
                  </button>
                )}

                <button onClick={() => deleteOne(p.id)} style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,60,60,0.12)', color: 'white', cursor: 'pointer', fontWeight: 700 }}>
                  Delete
                </button>
              </div>

              {tab === 'posted' && (
                <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 10 }}>
                  {(['likes', 'comments', 'shares', 'clicks', 'signups'] as const).map((k) => (
                    <label key={k} style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, opacity: 0.9 }}>
                      {k}
                      <input
                        defaultValue={p.performance?.[k] ?? 0}
                        onBlur={(e) => {
                          const next = {
                            likes: p.performance?.likes ?? 0,
                            comments: p.performance?.comments ?? 0,
                            shares: p.performance?.shares ?? 0,
                            clicks: p.performance?.clicks ?? 0,
                            signups: p.performance?.signups ?? 0,
                            [k]: Math.max(0, parseInt(e.target.value || '0', 10) || 0),
                          } as Performance;
                          updatePerformance(p.id, next).catch(() => null);
                        }}
                        style={{ padding: 10, borderRadius: 12, background: 'rgba(0,0,0,0.25)', color: 'white', border: '1px solid rgba(255,255,255,0.12)' }}
                      />
                    </label>
                  ))}
                </div>
              )}
            </Card>
          ))}

          {filtered.length === 0 && <div style={{ opacity: 0.7, fontSize: 13 }}>Nothing here yet.</div>}
        </div>
      )}
    </div>
  );
}
