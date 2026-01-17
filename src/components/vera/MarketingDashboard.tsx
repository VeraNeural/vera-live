'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
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

function platformIcon(p: Platform): string {
  if (p === 'instagram') return '📸';
  if (p === 'twitter') return '𝕏';
  if (p === 'tiktok') return '🎬';
  return '💼';
}

function themeGroup(t: ContentTheme): 'Wellness' | 'Product' | 'Social Proof' | 'Behind the Scenes' {
  if (t === 'sleep' || t === 'anxiety') return 'Wellness';
  if (t === 'testimonial') return 'Social Proof';
  if (t === 'behind-the-scenes') return 'Behind the Scenes';
  return 'Product';
}

function fmtDateTimeLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function parseDateTimeLocal(value: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function truncate(text: string, max = 180): string {
  const t = (text || '').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

const SELECT_STYLE: CSSProperties = {
  padding: 10,
  borderRadius: 12,
  background: '#1a1625',
  color: '#e8e6f0',
  colorScheme: 'dark',
  border: '1px solid rgba(255,255,255,0.10)',
};

const OPTION_STYLE: CSSProperties = {
  background: '#1a1625',
  color: '#e8e6f0',
};

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

  const [editPost, setEditPost] = useState<Post | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editImagePrompt, setEditImagePrompt] = useState('');

  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const draggingIdRef = useRef<string | null>(null);

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

  const drafts = useMemo(() => posts.filter((p) => p.status === 'draft'), [posts]);
  const readyQueue = useMemo(
    () => posts.filter((p) => p.status === 'ready' || p.status === 'scheduled').sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime()),
    [posts]
  );
  const posted = useMemo(() => posts.filter((p) => p.status === 'posted'), [posts]);

  const selectedInReady = useMemo(() => {
    const ids = Object.keys(selectedIds).filter((id) => selectedIds[id]);
    return readyQueue.filter((p) => ids.includes(p.id));
  }, [readyQueue, selectedIds]);

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

  const openEdit = useCallback((post: Post) => {
    setEditPost(post);
    setEditCaption(post.caption);
    setEditImagePrompt(post.imagePrompt || '');
  }, []);

  const saveEdits = useCallback(async () => {
    if (!editPost) return;

    setLoading(true);
    setError(null);
    try {
      const updated: Post = {
        ...editPost,
        caption: editCaption,
        imagePrompt: editImagePrompt || undefined,
      };
      await api('/api/vera/marketing/posts', { method: 'POST', body: JSON.stringify({ post: updated }) });
      setEditPost(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  }, [editCaption, editImagePrompt, editPost, refresh]);

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

  const setSchedule = useCallback(
    async (postId: string, scheduledFor: Date) => {
      setLoading(true);
      setError(null);
      try {
        await api('/api/vera/marketing/schedule', {
          method: 'POST',
          body: JSON.stringify({ postId, scheduledFor: scheduledFor.toISOString() }),
        });
        await refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Schedule failed');
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  const reorderReady = useCallback(
    async (draggedId: string, targetId: string) => {
      const list = readyQueue.filter((p) => p.status === 'ready');
      if (list.length < 2) return;
      if (!list.find((p) => p.id === draggedId) || !list.find((p) => p.id === targetId)) return;

      const from = list.findIndex((p) => p.id === draggedId);
      const to = list.findIndex((p) => p.id === targetId);
      if (from === -1 || to === -1 || from === to) return;

      const next = [...list];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);

      // Persist the ordering by writing ascending scheduledFor timestamps.
      // Keep status as 'ready' (scheduling uses /schedule which flips to scheduled).
      const base = new Date();
      for (let i = 0; i < next.length; i++) {
        const scheduledFor = new Date(base.getTime() + i * 60_000);
        await api('/api/vera/marketing/posts', {
          method: 'PATCH',
          body: JSON.stringify({ id: next[i].id, scheduledFor: scheduledFor.toISOString() }),
        });
      }
      await refresh();
    },
    [readyQueue, refresh]
  );

  const toggleSelected = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => ({ ...prev, [id]: checked }));
  }, []);

  const bulkDelete = useCallback(async () => {
    const ids = selectedInReady.map((p) => p.id);
    if (ids.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      for (const id of ids) {
        await api(`/api/vera/marketing/posts?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      }
      setSelectedIds({});
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bulk delete failed');
    } finally {
      setLoading(false);
    }
  }, [refresh, selectedInReady]);

  const bulkMarkPosted = useCallback(async () => {
    const ids = selectedInReady.map((p) => p.id);
    if (ids.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      for (const id of ids) {
        await api('/api/vera/marketing/posts', {
          method: 'PATCH',
          body: JSON.stringify({ id, status: 'posted', postedAt: new Date().toISOString() }),
        });
      }
      setSelectedIds({});
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bulk update failed');
    } finally {
      setLoading(false);
    }
  }, [refresh, selectedInReady]);

  const analytics = useMemo(() => {
    const byPlatform: Record<Platform, number> = { instagram: 0, twitter: 0, tiktok: 0, linkedin: 0 };
    for (const p of posts) byPlatform[p.platform] += 1;

    const engagementByDay = new Map<string, number>();
    for (const p of posted) {
      const d = p.postedAt || p.scheduledFor;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const perf = p.performance;
      const score = (perf?.likes ?? 0) + (perf?.comments ?? 0) + (perf?.shares ?? 0) + (perf?.clicks ?? 0) + (perf?.signups ?? 0) * 5;
      engagementByDay.set(key, (engagementByDay.get(key) ?? 0) + score);
    }

    const series = Array.from(engagementByDay.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-14);

    const top = [...posted]
      .sort((a, b) => (b.performance?.signups ?? 0) - (a.performance?.signups ?? 0) || (b.performance?.clicks ?? 0) - (a.performance?.clicks ?? 0))
      .slice(0, 8);

    return { byPlatform, series, top };
  }, [posted, posts]);

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
          <div style={{ opacity: 0.7, fontSize: 12 }}>📝 Posts generated</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{stats.generatedCount}</div>
        </Card>
        <Card>
          <div style={{ opacity: 0.7, fontSize: 12 }}>📅 Ready/scheduled</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{stats.readyCount}</div>
        </Card>
        <Card>
          <div style={{ opacity: 0.7, fontSize: 12 }}>✅ Published</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{stats.postedCount}</div>
        </Card>
        <Card>
          <div style={{ opacity: 0.7, fontSize: 12 }}>👥 Signups (manual)</div>
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
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 12 }}>
          <Card>
            <div style={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
              <span>Generate</span>
              {loading ? <span style={{ fontSize: 12, opacity: 0.75 }}>Generating…</span> : null}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, opacity: 0.9 }}>
                Platform
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  style={SELECT_STYLE}
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p} style={OPTION_STYLE}>
                      {platformIcon(p)} {prettyPlatform(p)}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, opacity: 0.9 }}>
                Theme
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as ContentTheme)}
                  style={SELECT_STYLE}
                >
                  {(['Wellness', 'Product', 'Social Proof', 'Behind the Scenes'] as const).map((group) => (
                    <optgroup key={group} label={group}>
                      {THEMES.filter((t) => themeGroup(t) === group).map((t) => (
                        <option key={t} value={t} style={OPTION_STYLE}>
                          {prettyTheme(t)}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>
            </div>

            <button
              onClick={() => generate()}
              disabled={loading}
              style={{
                marginTop: 12,
                padding: '14px 16px',
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(139,92,246,0.25)',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 900,
                width: '100%',
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
                  <button
                    onClick={() => openEdit(generated)}
                    style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'white', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </Card>

          <Card>
            <div style={{ fontWeight: 800 }}>Recent drafts</div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {drafts
                .slice(0, 8)
                .map((p) => (
                  <div key={p.id} style={{ border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ fontSize: 12, opacity: 0.9, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14 }}>{platformIcon(p.platform)}</span>
                        <span style={{ fontWeight: 800 }}>{prettyPlatform(p.platform)}</span>
                        <span style={{ opacity: 0.65 }}>•</span>
                        <span style={{ padding: '3px 8px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)' }}>
                          {prettyTheme(p.theme)}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.65 }}>{p.scheduledFor.toLocaleDateString()}</div>
                    </div>
                    <div style={{ marginTop: 8, whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.5, opacity: 0.95 }}>
                      {truncate(p.caption, 220)}
                    </div>
                    <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button onClick={() => openEdit(p)} style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'white', cursor: 'pointer' }}>
                        Edit
                      </button>
                      <button onClick={() => copyToClipboard(p.caption)} style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'white', cursor: 'pointer' }}>
                        Copy
                      </button>
                      <button onClick={() => saveToReady(p)} style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(139,92,246,0.25)', color: 'white', cursor: 'pointer', fontWeight: 700 }}>
                        Post
                      </button>
                      <button onClick={() => deleteOne(p.id)} style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,60,60,0.12)', color: 'white', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

              {drafts.length === 0 && (
                <div style={{ opacity: 0.7, fontSize: 13 }}>No drafts yet.</div>
              )}
            </div>
          </Card>
        </div>
      )}

      {tab === 'ready' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
              <div style={{ fontWeight: 800 }}>Queue</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  onClick={() => bulkMarkPosted()}
                  disabled={loading || selectedInReady.length === 0}
                  style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(139,92,246,0.25)', color: 'white', cursor: 'pointer', fontWeight: 800, opacity: selectedInReady.length === 0 ? 0.5 : 1 }}
                >
                  Bulk: Mark Posted ({selectedInReady.length})
                </button>
                <button
                  onClick={() => bulkDelete()}
                  disabled={loading || selectedInReady.length === 0}
                  style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,60,60,0.12)', color: 'white', cursor: 'pointer', fontWeight: 800, opacity: selectedInReady.length === 0 ? 0.5 : 1 }}
                >
                  Bulk: Delete ({selectedInReady.length})
                </button>
              </div>
            </div>

            <div style={{ marginTop: 12, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', opacity: 0.8, width: 42 }} />
                    <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', opacity: 0.8, width: 34 }} />
                    <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', opacity: 0.8, width: 140 }}>Platform</th>
                    <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', opacity: 0.8, width: 180 }}>Theme</th>
                    <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', opacity: 0.8 }}>Preview</th>
                    <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', opacity: 0.8, width: 210 }}>Schedule</th>
                    <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', opacity: 0.8, width: 210 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {readyQueue.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '12px 8px', opacity: 0.75 }}>
                        Nothing queued yet.
                      </td>
                    </tr>
                  )}

                  {readyQueue.map((p) => {
                    const isSelected = Boolean(selectedIds[p.id]);
                    return (
                      <tr
                        key={p.id}
                        draggable={p.status === 'ready'}
                        onDragStart={() => {
                          draggingIdRef.current = p.id;
                        }}
                        onDragOver={(e) => {
                          if (p.status !== 'ready') return;
                          e.preventDefault();
                        }}
                        onDrop={() => {
                          const dragged = draggingIdRef.current;
                          draggingIdRef.current = null;
                          if (dragged) reorderReady(dragged, p.id).catch(() => null);
                        }}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <td style={{ padding: '10px 8px' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => toggleSelected(p.id, e.target.checked)}
                          />
                        </td>
                        <td style={{ padding: '10px 8px', opacity: 0.6 }}>{p.status === 'ready' ? '↕' : ''}</td>
                        <td style={{ padding: '10px 8px', fontWeight: 800 }}>
                          {platformIcon(p.platform)} {prettyPlatform(p.platform)}
                        </td>
                        <td style={{ padding: '10px 8px', opacity: 0.9 }}>{prettyTheme(p.theme)}</td>
                        <td style={{ padding: '10px 8px', opacity: 0.95 }}>{truncate(p.caption, 80)}</td>
                        <td style={{ padding: '10px 8px' }}>
                          <input
                            type="datetime-local"
                            defaultValue={fmtDateTimeLocal(p.scheduledFor)}
                            onBlur={(e) => {
                              const d = parseDateTimeLocal(e.target.value);
                              if (!d) return;
                              setSchedule(p.id, d).catch(() => null);
                            }}
                            style={{ padding: 10, borderRadius: 12, background: '#1a1625', color: '#e8e6f0', border: '1px solid rgba(255,255,255,0.10)', width: '100%' }}
                          />
                        </td>
                        <td style={{ padding: '10px 8px' }}>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <button onClick={() => openEdit(p)} style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'white', cursor: 'pointer' }}>Edit</button>
                            <button onClick={() => copyToClipboard(p.caption)} style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'white', cursor: 'pointer' }}>Copy</button>
                            <button onClick={() => markPosted(p.id)} style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(139,92,246,0.25)', color: 'white', cursor: 'pointer', fontWeight: 700 }}>Mark Posted</button>
                            <button onClick={() => deleteOne(p.id)} style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,60,60,0.12)', color: 'white', cursor: 'pointer' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
              Drag to reorder READY items. Changing schedule time moves it to SCHEDULED.
            </div>
          </Card>
        </div>
      )}

      {tab === 'posted' && (
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

      {tab === 'analytics' && (
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Card>
            <div style={{ fontWeight: 800 }}>Posts per platform</div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PLATFORMS.map((p) => {
                const v = analytics.byPlatform[p];
                const max = Math.max(1, ...Object.values(analytics.byPlatform));
                const w = Math.round((v / max) * 100);
                return (
                  <div key={p} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 40px', gap: 10, alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, opacity: 0.9 }}>{platformIcon(p)} {prettyPlatform(p)}</div>
                    <div style={{ height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${w}%`, background: 'rgba(139,92,246,0.55)' }} />
                    </div>
                    <div style={{ textAlign: 'right', opacity: 0.85 }}>{v}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <div style={{ fontWeight: 800 }}>Engagement (last 14 days)</div>
            <div style={{ marginTop: 12 }}>
              {analytics.series.length === 0 ? (
                <div style={{ opacity: 0.7, fontSize: 13 }}>No posted performance data yet.</div>
              ) : (
                <svg viewBox="0 0 520 180" width="100%" height="180" style={{ display: 'block' }}>
                  {(() => {
                    const values = analytics.series.map(([, v]) => v);
                    const max = Math.max(1, ...values);
                    const pts = analytics.series
                      .map(([, v], i) => {
                        const x = (i / Math.max(1, analytics.series.length - 1)) * 500 + 10;
                        const y = 160 - (v / max) * 130;
                        return `${x},${y}`;
                      })
                      .join(' ');
                    return (
                      <>
                        <rect x="0" y="0" width="520" height="180" fill="rgba(0,0,0,0.18)" rx="14" />
                        <polyline points={pts} fill="none" stroke="rgba(139,92,246,0.85)" strokeWidth="3" />
                        {analytics.series.map(([label], i) => (
                          <text key={label} x={(i / Math.max(1, analytics.series.length - 1)) * 500 + 10} y={175} fontSize="10" fill="rgba(255,255,255,0.55)" textAnchor="middle">
                            {label.slice(5)}
                          </text>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              )}
            </div>
          </Card>

          <div style={{ gridColumn: '1 / -1' }}>
            <Card>
              <div style={{ fontWeight: 800 }}>Top performing content</div>
              <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                {analytics.top.length === 0 && <div style={{ opacity: 0.7, fontSize: 13 }}>No posted posts with metrics yet.</div>}
                {analytics.top.map((p) => (
                  <div key={p.id} style={{ border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                      <div style={{ fontWeight: 900 }}>{platformIcon(p.platform)} {prettyPlatform(p.platform)} • {prettyTheme(p.theme)}</div>
                      <div style={{ fontSize: 12, opacity: 0.7 }}>{p.performance?.signups ?? 0} signups</div>
                    </div>
                    <div style={{ marginTop: 8, whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.5, opacity: 0.95 }}>{truncate(p.caption, 220)}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {editPost && (
        <div
          onClick={() => setEditPost(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.62)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 18,
            zIndex: 50,
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(980px, 100%)',
              maxHeight: 'min(82dvh, 720px)',
              overflow: 'auto',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'radial-gradient(1200px 600px at 20% 10%, rgba(139,92,246,0.14), transparent 60%), rgba(10,10,18,0.96)',
              padding: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
              <div style={{ fontWeight: 900 }}>Edit post</div>
              <button
                onClick={() => setEditPost(null)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.92)',
                  cursor: 'pointer',
                  fontWeight: 800,
                }}
              >
                Close
              </button>
            </div>

            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.8 }}>
              {platformIcon(editPost.platform)} {prettyPlatform(editPost.platform)} • {prettyTheme(editPost.theme)}
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 12, opacity: 0.9 }}>Caption</div>
              <textarea
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                rows={10}
                style={{
                  marginTop: 6,
                  width: '100%',
                  padding: 12,
                  borderRadius: 12,
                  background: '#1a1625',
                  color: '#e8e6f0',
                  border: '1px solid rgba(255,255,255,0.10)',
                  resize: 'vertical',
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              />
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 12, opacity: 0.9 }}>Image prompt (optional)</div>
              <textarea
                value={editImagePrompt}
                onChange={(e) => setEditImagePrompt(e.target.value)}
                rows={3}
                style={{
                  marginTop: 6,
                  width: '100%',
                  padding: 12,
                  borderRadius: 12,
                  background: '#1a1625',
                  color: '#e8e6f0',
                  border: '1px solid rgba(255,255,255,0.10)',
                  resize: 'vertical',
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              />
            </div>

            <div style={{ marginTop: 12, display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                onClick={() => copyToClipboard(editCaption)}
                style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'white', cursor: 'pointer', fontWeight: 800 }}
              >
                Copy
              </button>
              <button
                onClick={() => saveEdits()}
                disabled={loading}
                style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(139,92,246,0.25)', color: 'white', cursor: 'pointer', fontWeight: 900, opacity: loading ? 0.6 : 1 }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
