'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { ContentTheme, Platform, Post, PostStatus, Performance } from '@/lib/vera/marketing/types';

type Tab = 'generate' | 'ready' | 'posted' | 'plans' | 'analytics';

type PlanStatus = 'scheduled' | 'drafting' | 'drafted' | 'ready' | 'posted' | 'failed';

type Plan = {
  id: string;
  platform: Platform;
  theme: ContentTheme;
  scheduleAt: Date;
  status: PlanStatus;
  campaignId?: string | null;
  draftedPostId?: string | null;
};

const PLATFORMS: Platform[] = ['tiktok', 'youtube', 'instagram', 'facebook', 'twitter', 'linkedin'];
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
  return t.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function platformIcon(p: Platform): string {
  if (p === 'instagram') return '◎';
  if (p === 'twitter') return '𝕏';
  if (p === 'tiktok') return '♪';
  if (p === 'youtube') return '▶';
  if (p === 'facebook') return 'f';
  return '▣';
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

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  const data = (await res.json().catch(() => ({}))) as any;
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data as T;
}

function normalizePlan(raw: any): Plan {
  return {
    id: String(raw.id || ''),
    platform: raw.platform as Platform,
    theme: raw.theme as ContentTheme,
    scheduleAt: new Date(String(raw.schedule_at || new Date().toISOString())),
    status: (raw.status || 'scheduled') as PlanStatus,
    campaignId: raw.campaign_id ?? null,
    draftedPostId: raw.drafted_post_id ?? null,
  };
}

// Styled Components
const styles = {
  container: {
    minHeight: '100vh',
    color: 'rgba(255,255,255,0.92)',
    padding: '32px',
  } as CSSProperties,
  
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '32px',
  } as CSSProperties,
  
  title: {
    fontFamily: 'var(--font-serif, Georgia, serif)',
    fontSize: '28px',
    fontWeight: 400,
    letterSpacing: '-0.02em',
    color: 'rgba(255,255,255,0.95)',
  } as CSSProperties,
  
  subtitle: {
    marginTop: '8px',
    fontSize: '14px',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: '0.01em',
  } as CSSProperties,
  
  refreshBtn: {
    padding: '10px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  } as CSSProperties,
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '28px',
  } as CSSProperties,
  
  statCard: {
    padding: '20px',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
    transition: 'all 0.3s ease',
  } as CSSProperties,
  
  statLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: '0.03em',
    textTransform: 'uppercase' as const,
    marginBottom: '8px',
  } as CSSProperties,
  
  statValue: {
    fontSize: '28px',
    fontWeight: 300,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: '-0.02em',
  } as CSSProperties,
  
  tabsContainer: {
    display: 'flex',
    gap: '6px',
    padding: '4px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    marginBottom: '24px',
    width: 'fit-content',
  } as CSSProperties,
  
  tab: (active: boolean): CSSProperties => ({
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    background: active ? 'rgba(139,92,246,0.2)' : 'transparent',
    color: active ? 'rgba(167,139,250,1)' : 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  }),
  
  card: {
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
  } as CSSProperties,
  
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '20px',
  } as CSSProperties,
  
  select: {
    padding: '12px 14px',
    borderRadius: '10px',
    background: 'rgba(0,0,0,0.3)',
    color: 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(255,255,255,0.08)',
    fontSize: '14px',
    width: '100%',
    cursor: 'pointer',
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '36px',
  } as CSSProperties,
  
  option: {
    background: '#1a1625',
    color: '#e8e6f0',
  } as CSSProperties,
  
  generateBtn: {
    width: '100%',
    padding: '14px 20px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, rgba(139,92,246,0.4) 0%, rgba(109,40,217,0.4) 100%)',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    marginTop: '16px',
  } as CSSProperties,
  
  actionBtn: (variant: 'default' | 'primary' | 'danger' = 'default'): CSSProperties => ({
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: variant === 'primary' 
      ? 'rgba(139,92,246,0.25)' 
      : variant === 'danger' 
        ? 'rgba(239,68,68,0.15)' 
        : 'rgba(255,255,255,0.04)',
    color: variant === 'danger' ? 'rgba(252,165,165,1)' : 'rgba(255,255,255,0.85)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  }),
  
  postCard: {
    padding: '18px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.015)',
    marginBottom: '12px',
    transition: 'all 0.2s ease',
  } as CSSProperties,
  
  postHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  } as CSSProperties,
  
  postMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
  } as CSSProperties,
  
  platformBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.85)',
  } as CSSProperties,
  
  themeBadge: {
    padding: '4px 10px',
    borderRadius: '6px',
    background: 'rgba(139,92,246,0.12)',
    color: 'rgba(167,139,250,0.9)',
    fontSize: '12px',
    fontWeight: 500,
  } as CSSProperties,

  statusBadge: (status: PlanStatus): CSSProperties => {
    const palette: Record<PlanStatus, { bg: string; color: string; border: string }> = {
      scheduled: { bg: 'rgba(59,130,246,0.12)', color: 'rgba(147,197,253,0.95)', border: 'rgba(59,130,246,0.25)' },
      drafting: { bg: 'rgba(251,191,36,0.12)', color: 'rgba(252,211,77,0.95)', border: 'rgba(251,191,36,0.25)' },
      drafted: { bg: 'rgba(34,197,94,0.12)', color: 'rgba(134,239,172,0.95)', border: 'rgba(34,197,94,0.25)' },
      ready: { bg: 'rgba(99,102,241,0.12)', color: 'rgba(165,180,252,0.95)', border: 'rgba(99,102,241,0.25)' },
      posted: { bg: 'rgba(16,185,129,0.12)', color: 'rgba(110,231,183,0.95)', border: 'rgba(16,185,129,0.25)' },
      failed: { bg: 'rgba(239,68,68,0.12)', color: 'rgba(252,165,165,0.95)', border: 'rgba(239,68,68,0.25)' },
    };
    const token = palette[status] || palette.scheduled;
    return {
      padding: '4px 10px',
      borderRadius: '999px',
      border: `1px solid ${token.border}`,
      background: token.bg,
      color: token.color,
      fontSize: '11px',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.04em',
    };
  },
  
  postContent: {
    fontSize: '14px',
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.75)',
    whiteSpace: 'pre-wrap' as const,
  } as CSSProperties,
  
  postActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '14px',
    flexWrap: 'wrap' as const,
  } as CSSProperties,
  
  dateText: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
  } as CSSProperties,
  
  input: {
    padding: '12px 14px',
    borderRadius: '10px',
    background: 'rgba(0,0,0,0.3)',
    color: 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(255,255,255,0.08)',
    fontSize: '14px',
    width: '100%',
  } as CSSProperties,
  
  textarea: {
    padding: '14px',
    borderRadius: '12px',
    background: 'rgba(0,0,0,0.3)',
    color: 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(255,255,255,0.08)',
    fontSize: '14px',
    lineHeight: 1.6,
    width: '100%',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
  } as CSSProperties,
  
  error: {
    padding: '14px 18px',
    borderRadius: '10px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    color: 'rgba(252,165,165,1)',
    fontSize: '14px',
    marginBottom: '20px',
  } as CSSProperties,
  
  emptyState: {
    padding: '40px 20px',
    textAlign: 'center' as const,
    color: 'rgba(255,255,255,0.4)',
    fontSize: '14px',
  } as CSSProperties,
  
  tableHeader: {
    padding: '12px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    fontSize: '12px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
    textAlign: 'left' as const,
  } as CSSProperties,
  
  tableCell: {
    padding: '14px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.8)',
  } as CSSProperties,
  
  modal: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: 50,
  } as CSSProperties,
  
  modalContent: {
    width: 'min(720px, 100%)',
    maxHeight: '85vh',
    overflow: 'auto',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'linear-gradient(180deg, rgba(20,16,32,0.98) 0%, rgba(12,10,20,0.98) 100%)',
    padding: '28px',
  } as CSSProperties,
};

export default function MarketingDashboard() {
  const [tab, setTab] = useState<Tab>('generate');
  const [posts, setPosts] = useState<Post[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [platform, setPlatform] = useState<Platform>('instagram');
  const [theme, setTheme] = useState<ContentTheme>('sleep');
  const [generated, setGenerated] = useState<Post | null>(null);

  const [editPost, setEditPost] = useState<Post | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editImagePrompt, setEditImagePrompt] = useState('');

  const [planPreview, setPlanPreview] = useState<Plan | null>(null);

  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const draggingIdRef = useRef<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    const [postsData, plansData] = await Promise.all([
      api<{ posts: Post[] }>('/api/vera/marketing/posts'),
      api<{ plans: any[] }>('/api/vera/marketing/plans'),
    ]);
    setPosts(postsData.posts);
    setPlans((plansData.plans || []).map(normalizePlan));
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

  const reschedulePlan = useCallback(
    async (id: string, scheduleAt: Date) => {
      setLoading(true);
      setError(null);
      try {
        await api('/api/vera/marketing/plans', {
          method: 'PATCH',
          body: JSON.stringify({ id, scheduleAt: scheduleAt.toISOString() }),
        });
        await refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Plan reschedule failed');
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  const cancelPlan = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await api(`/api/vera/marketing/plans?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
        await refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Plan cancel failed');
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  const openPlan = useCallback((plan: Plan) => {
    setPlanPreview(plan);
  }, []);

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
    const byPlatform: Record<Platform, number> = { instagram: 0, twitter: 0, tiktok: 0, linkedin: 0, youtube: 0, facebook: 0 };
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

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            VERA <span style={{ color: 'rgba(167,139,250,0.8)' }}>Marketing</span>
          </h1>
          <p style={styles.subtitle}>Generate content, schedule posts, track performance</p>
        </div>
        <button
          onClick={() => refresh().catch(() => null)}
          style={styles.refreshBtn}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Posts</div>
          <div style={styles.statValue}>{stats.generatedCount}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Ready / Scheduled</div>
          <div style={styles.statValue}>{stats.readyCount}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Published</div>
          <div style={styles.statValue}>{stats.postedCount}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Signups</div>
          <div style={styles.statValue}>{stats.signups}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        {(['generate', 'ready', 'posted', 'plans', 'analytics'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={styles.tab(tab === t)}
          >
            {t === 'generate' && '✦ Generate'}
            {t === 'ready' && '◎ Ready'}
            {t === 'posted' && '✓ Posted'}
            {t === 'plans' && '⏱ Plans'}
            {t === 'analytics' && '◈ Analytics'}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && <div style={styles.error}>{error}</div>}

      {/* Generate Tab */}
      {tab === 'generate' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Generate Form */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              Create New Post
              {loading && <span style={{ fontWeight: 400, fontSize: '13px', color: 'rgba(167,139,250,0.8)', marginLeft: '12px' }}>Generating…</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Platform
                </label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value as Platform)} style={styles.select}>
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p} style={styles.option}>
                      {platformIcon(p)} {prettyPlatform(p)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Theme
                </label>
                <select value={theme} onChange={(e) => setTheme(e.target.value as ContentTheme)} style={styles.select}>
                  {(['Wellness', 'Product', 'Social Proof', 'Behind the Scenes'] as const).map((group) => (
                    <optgroup key={group} label={group}>
                      {THEMES.filter((t) => themeGroup(t) === group).map((t) => (
                        <option key={t} value={t} style={styles.option}>
                          {prettyTheme(t)}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            <button onClick={() => generate()} disabled={loading} style={{ ...styles.generateBtn, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Generating…' : '✦ Generate Post'}
            </button>

            {/* Preview */}
            {generated && (
              <div style={{ marginTop: '24px', padding: '18px', borderRadius: '12px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
                <div style={{ fontSize: '12px', color: 'rgba(167,139,250,0.8)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Preview</div>
                <div style={styles.postContent}>{generated.caption}</div>
                <div style={styles.postActions}>
                  <button onClick={() => saveToReady(generated)} disabled={loading} style={styles.actionBtn('primary')}>
                    Save to Ready
                  </button>
                  <button onClick={() => copyToClipboard(generated.caption)} style={styles.actionBtn()}>
                    Copy
                  </button>
                  <button onClick={() => openEdit(generated)} style={styles.actionBtn()}>
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recent Drafts */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Recent Drafts</div>
            {drafts.length === 0 ? (
              <div style={styles.emptyState}>No drafts yet. Generate your first post!</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {drafts.slice(0, 6).map((p) => (
                  <div key={p.id} style={styles.postCard}>
                    <div style={styles.postHeader}>
                      <div style={styles.postMeta}>
                        <span style={styles.platformBadge}>
                          {platformIcon(p.platform)} {prettyPlatform(p.platform)}
                        </span>
                        <span style={styles.themeBadge}>{prettyTheme(p.theme)}</span>
                      </div>
                      <span style={styles.dateText}>{p.scheduledFor.toLocaleDateString()}</span>
                    </div>
                    <div style={styles.postContent}>{truncate(p.caption, 140)}</div>
                    <div style={styles.postActions}>
                      <button onClick={() => openEdit(p)} style={styles.actionBtn()}>Edit</button>
                      <button onClick={() => copyToClipboard(p.caption)} style={styles.actionBtn()}>Copy</button>
                      <button onClick={() => saveToReady(p)} style={styles.actionBtn('primary')}>Move to Ready</button>
                      <button onClick={() => deleteOne(p.id)} style={styles.actionBtn('danger')}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ready Tab */}
      {tab === 'ready' && (
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={styles.cardTitle}>Post Queue</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => bulkMarkPosted()}
                disabled={loading || selectedInReady.length === 0}
                style={{ ...styles.actionBtn('primary'), opacity: selectedInReady.length === 0 ? 0.5 : 1 }}
              >
                Mark Posted ({selectedInReady.length})
              </button>
              <button
                onClick={() => bulkDelete()}
                disabled={loading || selectedInReady.length === 0}
                style={{ ...styles.actionBtn('danger'), opacity: selectedInReady.length === 0 ? 0.5 : 1 }}
              >
                Delete ({selectedInReady.length})
              </button>
            </div>
          </div>

          {readyQueue.length === 0 ? (
            <div style={styles.emptyState}>No posts in queue. Generate and save posts to see them here.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ ...styles.tableHeader, width: '40px' }}></th>
                    <th style={{ ...styles.tableHeader, width: '30px' }}></th>
                    <th style={{ ...styles.tableHeader, width: '120px' }}>Platform</th>
                    <th style={{ ...styles.tableHeader, width: '140px' }}>Theme</th>
                    <th style={styles.tableHeader}>Preview</th>
                    <th style={{ ...styles.tableHeader, width: '180px' }}>Schedule</th>
                    <th style={{ ...styles.tableHeader, width: '200px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {readyQueue.map((p) => {
                    const isSelected = Boolean(selectedIds[p.id]);
                    return (
                      <tr
                        key={p.id}
                        draggable={p.status === 'ready'}
                        onDragStart={() => { draggingIdRef.current = p.id; }}
                        onDragOver={(e) => { if (p.status === 'ready') e.preventDefault(); }}
                        onDrop={() => {
                          const dragged = draggingIdRef.current;
                          draggingIdRef.current = null;
                          if (dragged) reorderReady(dragged, p.id).catch(() => null);
                        }}
                      >
                        <td style={styles.tableCell}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => toggleSelected(p.id, e.target.checked)}
                            style={{ accentColor: 'rgba(139,92,246,1)' }}
                          />
                        </td>
                        <td style={{ ...styles.tableCell, color: 'rgba(255,255,255,0.3)', cursor: p.status === 'ready' ? 'grab' : 'default' }}>
                          {p.status === 'ready' ? '⋮⋮' : ''}
                        </td>
                        <td style={styles.tableCell}>
                          <span style={styles.platformBadge}>{platformIcon(p.platform)} {prettyPlatform(p.platform)}</span>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={styles.themeBadge}>{prettyTheme(p.theme)}</span>
                        </td>
                        <td style={{ ...styles.tableCell, maxWidth: '300px' }}>
                          <span style={{ ...styles.postContent, fontSize: '13px' }}>{truncate(p.caption, 80)}</span>
                        </td>
                        <td style={styles.tableCell}>
                          <input
                            type="datetime-local"
                            defaultValue={fmtDateTimeLocal(p.scheduledFor)}
                            onBlur={(e) => {
                              const d = parseDateTimeLocal(e.target.value);
                              if (d) setSchedule(p.id, d).catch(() => null);
                            }}
                            style={{ ...styles.input, padding: '8px 10px', fontSize: '12px' }}
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <button onClick={() => openEdit(p)} style={styles.actionBtn()}>Edit</button>
                            <button onClick={() => copyToClipboard(p.caption)} style={styles.actionBtn()}>Copy</button>
                            <button onClick={() => markPosted(p.id)} style={styles.actionBtn('primary')}>Posted</button>
                            <button onClick={() => deleteOne(p.id)} style={styles.actionBtn('danger')}>✕</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ marginTop: '14px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            Drag rows to reorder. Changing schedule time moves post to SCHEDULED status.
          </div>
        </div>
      )}

      {/* Posted Tab */}
      {tab === 'posted' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {posted.length === 0 ? (
            <div style={{ ...styles.card, ...styles.emptyState }}>No published posts yet.</div>
          ) : (
            posted.map((p) => (
              <div key={p.id} style={styles.card}>
                <div style={styles.postHeader}>
                  <div style={styles.postMeta}>
                    <span style={styles.platformBadge}>{platformIcon(p.platform)} {prettyPlatform(p.platform)}</span>
                    <span style={styles.themeBadge}>{prettyTheme(p.theme)}</span>
                  </div>
                  <span style={styles.dateText}>
                    Posted {(p.postedAt || p.scheduledFor).toLocaleDateString()}
                  </span>
                </div>

                <div style={styles.postContent}>{p.caption}</div>

                <div style={styles.postActions}>
                  <button onClick={() => copyToClipboard(p.caption)} style={styles.actionBtn()}>Copy</button>
                  <button onClick={() => deleteOne(p.id)} style={styles.actionBtn('danger')}>Delete</button>
                </div>

                {/* Performance inputs */}
                <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                  {(['likes', 'comments', 'shares', 'clicks', 'signups'] as const).map((k) => (
                    <div key={k}>
                      <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {k}
                      </label>
                      <input
                        type="number"
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
                        style={{ ...styles.input, padding: '10px 12px' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Plans Tab */}
      {tab === 'plans' && (
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={styles.cardTitle}>Posting Plans</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
              scheduled → claimed → drafted
            </div>
          </div>

          {plans.length === 0 ? (
            <div style={styles.emptyState}>No scheduled plans yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ ...styles.tableHeader, width: '130px' }}>Status</th>
                    <th style={{ ...styles.tableHeader, width: '140px' }}>Platform</th>
                    <th style={{ ...styles.tableHeader, width: '160px' }}>Theme</th>
                    <th style={{ ...styles.tableHeader, width: '200px' }}>Schedule</th>
                    <th style={styles.tableHeader}>Draft Preview</th>
                    <th style={{ ...styles.tableHeader, width: '200px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => {
                    const drafted = plan.draftedPostId
                      ? posts.find((p) => p.id === plan.draftedPostId)
                      : null;
                    const statusLabel = plan.status === 'drafting' ? 'CLAIMED' : plan.status.toUpperCase();
                    return (
                      <tr key={plan.id}>
                        <td style={styles.tableCell}>
                          <span style={styles.statusBadge(plan.status)}>{statusLabel}</span>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={styles.platformBadge}>{platformIcon(plan.platform)} {prettyPlatform(plan.platform)}</span>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={styles.themeBadge}>{prettyTheme(plan.theme)}</span>
                        </td>
                        <td style={styles.tableCell}>
                          {plan.status === 'scheduled' ? (
                            <input
                              type="datetime-local"
                              defaultValue={fmtDateTimeLocal(plan.scheduleAt)}
                              onBlur={(e) => {
                                const d = parseDateTimeLocal(e.target.value);
                                if (d) reschedulePlan(plan.id, d).catch(() => null);
                              }}
                              style={{ ...styles.input, padding: '8px 10px', fontSize: '12px' }}
                            />
                          ) : (
                            <span style={styles.dateText}>{plan.scheduleAt.toLocaleString()}</span>
                          )}
                        </td>
                        <td style={{ ...styles.tableCell, maxWidth: '320px' }}>
                          {drafted ? (
                            <span style={{ ...styles.postContent, fontSize: '13px' }}>{truncate(drafted.caption, 100)}</span>
                          ) : (
                            <span style={styles.dateText}>No draft yet</span>
                          )}
                        </td>
                        <td style={styles.tableCell}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <button onClick={() => openPlan(plan)} style={styles.actionBtn()}>View</button>
                            {plan.status === 'scheduled' && (
                              <button onClick={() => cancelPlan(plan.id)} style={styles.actionBtn('danger')}>Cancel</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {tab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Posts by Platform */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Posts by Platform</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
              {PLATFORMS.map((p) => {
                const v = analytics.byPlatform[p];
                const max = Math.max(1, ...Object.values(analytics.byPlatform));
                const w = Math.round((v / max) * 100);
                return (
                  <div key={p} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 40px', gap: '14px', alignItems: 'center' }}>
                    <span style={styles.platformBadge}>{platformIcon(p)} {prettyPlatform(p)}</span>
                    <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${w}%`, background: 'linear-gradient(90deg, rgba(139,92,246,0.6), rgba(167,139,250,0.8))', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                    </div>
                    <span style={{ textAlign: 'right', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>{v}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Engagement Chart */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Engagement (Last 14 Days)</div>
            {analytics.series.length === 0 ? (
              <div style={styles.emptyState}>No performance data yet.</div>
            ) : (
              <svg viewBox="0 0 500 160" width="100%" height="160" style={{ display: 'block', marginTop: '12px' }}>
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(139,92,246,0.3)" />
                    <stop offset="100%" stopColor="rgba(139,92,246,0)" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="500" height="160" fill="rgba(0,0,0,0.2)" rx="8" />
                {(() => {
                  const values = analytics.series.map(([, v]) => v);
                  const max = Math.max(1, ...values);
                  const points = analytics.series.map(([, v], i) => {
                    const x = (i / Math.max(1, analytics.series.length - 1)) * 480 + 10;
                    const y = 130 - (v / max) * 100;
                    return { x, y };
                  });
                  const pathD = points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
                  const areaD = `${pathD} L ${points[points.length - 1].x} 130 L ${points[0].x} 130 Z`;
                  return (
                    <>
                      <path d={areaD} fill="url(#chartGradient)" />
                      <path d={pathD} fill="none" stroke="rgba(139,92,246,0.9)" strokeWidth="2" />
                      {points.map((pt, i) => (
                        <circle key={i} cx={pt.x} cy={pt.y} r="3" fill="rgba(167,139,250,1)" />
                      ))}
                      {analytics.series.map(([label], i) => (
                        <text key={label} x={(i / Math.max(1, analytics.series.length - 1)) * 480 + 10} y={150} fontSize="9" fill="rgba(255,255,255,0.4)" textAnchor="middle">
                          {label.slice(5)}
                        </text>
                      ))}
                    </>
                  );
                })()}
              </svg>
            )}
          </div>

          {/* Top Posts */}
          <div style={{ ...styles.card, gridColumn: '1 / -1' }}>
            <div style={styles.cardTitle}>Top Performing Posts</div>
            {analytics.top.length === 0 ? (
              <div style={styles.emptyState}>No performance data yet. Add metrics to your posted content.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                {analytics.top.map((p) => (
                  <div key={p.id} style={styles.postCard}>
                    <div style={styles.postHeader}>
                      <div style={styles.postMeta}>
                        <span style={styles.platformBadge}>{platformIcon(p.platform)} {prettyPlatform(p.platform)}</span>
                        <span style={styles.themeBadge}>{prettyTheme(p.theme)}</span>
                      </div>
                      <span style={{ fontSize: '13px', color: 'rgba(167,139,250,0.9)', fontWeight: 600 }}>
                        {p.performance?.signups ?? 0} signups
                      </span>
                    </div>
                    <div style={{ ...styles.postContent, fontSize: '13px' }}>{truncate(p.caption, 180)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Plan Preview Modal */}
      {planPreview && (
        <div onClick={() => setPlanPreview(null)} style={styles.modal} role="dialog" aria-modal="true">
          <div onClick={(e) => e.stopPropagation()} style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Plan Details</h2>
              <button onClick={() => setPlanPreview(null)} style={styles.actionBtn()}>✕ Close</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={styles.statusBadge(planPreview.status)}>
                {planPreview.status === 'drafting'
                  ? 'CLAIMED'
                  : planPreview.status.toUpperCase()}
              </span>
              <span style={styles.platformBadge}>{platformIcon(planPreview.platform)} {prettyPlatform(planPreview.platform)}</span>
              <span style={styles.themeBadge}>{prettyTheme(planPreview.theme)}</span>
            </div>

            <div style={{ marginBottom: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
              Schedule: {planPreview.scheduleAt.toLocaleString()}
            </div>

            {planPreview.campaignId && (
              <div style={{ marginBottom: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                Campaign: {planPreview.campaignId}
              </div>
            )}

            {(() => {
              const drafted = planPreview.draftedPostId
                ? posts.find((p) => p.id === planPreview.draftedPostId)
                : null;
              if (!drafted) {
                return <div style={styles.emptyState}>No draft linked to this plan yet.</div>;
              }
              return (
                <div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Draft Preview
                  </div>
                  <div style={styles.postContent}>{drafted.caption}</div>
                  <div style={styles.postActions}>
                    <button onClick={() => copyToClipboard(drafted.caption)} style={styles.actionBtn()}>Copy</button>
                    <button onClick={() => openEdit(drafted)} style={styles.actionBtn()}>Edit Draft</button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editPost && (
        <div onClick={() => setEditPost(null)} style={styles.modal} role="dialog" aria-modal="true">
          <div onClick={(e) => e.stopPropagation()} style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Edit Post</h2>
              <button onClick={() => setEditPost(null)} style={styles.actionBtn()}>✕ Close</button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={styles.platformBadge}>{platformIcon(editPost.platform)} {prettyPlatform(editPost.platform)}</span>
              <span style={{ ...styles.themeBadge, marginLeft: '10px' }}>{prettyTheme(editPost.theme)}</span>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Caption
              </label>
              <textarea
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                rows={8}
                style={styles.textarea}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Image Prompt (optional)
              </label>
              <textarea
                value={editImagePrompt}
                onChange={(e) => setEditImagePrompt(e.target.value)}
                rows={3}
                style={styles.textarea}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => copyToClipboard(editCaption)} style={styles.actionBtn()}>Copy</button>
              <button onClick={() => saveEdits()} disabled={loading} style={{ ...styles.actionBtn('primary'), opacity: loading ? 0.6 : 1 }}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}