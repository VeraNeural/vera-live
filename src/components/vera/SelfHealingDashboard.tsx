'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AutoFix, ErrorLog, HealthCheck, SystemStatus } from '@/lib/vera/selfHealing/types';

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  const data = (await res.json().catch(() => ({}))) as any;
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data as T;
}

function statusColor(overall: SystemStatus['overall']): string {
  if (overall === 'healthy') return 'rgba(34,197,94,0.95)';
  if (overall === 'degraded') return 'rgba(234,179,8,0.95)';
  return 'rgba(239,68,68,0.95)';
}

function statusLabel(overall: SystemStatus['overall']): string {
  if (overall === 'healthy') return 'Healthy';
  if (overall === 'degraded') return 'Warning';
  return 'Critical';
}

function checkEmoji(status: HealthCheck['status']): string {
  if (status === 'healthy') return '🟢';
  if (status === 'warning') return '🟡';
  return '🔴';
}

function fmtTime(ts?: string): string {
  if (!ts) return '';
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString();
}

export default function SelfHealingDashboard() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<{ summary: string; dailyReport: string } | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    const [s, e, r] = await Promise.all([
      api<SystemStatus>('/api/vera/health'),
      api<{ errors: ErrorLog[] }>('/api/vera/errors?limit=25'),
      api<{ summary: string; dailyReport: string }>('/api/vera/health/report'),
    ]);
    setStatus(s);
    setErrors(e.errors);
    setReport(r);
  }, []);

  useEffect(() => {
    refresh().catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'));
  }, [refresh]);

  const runChecks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const s = await api<SystemStatus>('/api/vera/health/check', { method: 'POST' });
      setStatus(s);
      const e = await api<{ errors: ErrorLog[] }>('/api/vera/errors?limit=25');
      setErrors(e.errors);
      const r = await api<{ summary: string; dailyReport: string }>('/api/vera/health/report');
      setReport(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Health check failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const markResolved = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api(`/api/vera/errors/${encodeURIComponent(id)}`, { method: 'PATCH' });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Resolve failed');
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const applyAutoFix = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api(`/api/vera/errors/${encodeURIComponent(id)}/autofix`, { method: 'POST' });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Auto-fix failed');
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const overall = status?.overall || 'degraded';

  const checksByName = useMemo(() => {
    const m = new Map<string, HealthCheck>();
    for (const c of status?.checks || []) m.set(c.name, c);
    return m;
  }, [status]);

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

  const Button = ({ label, onClick, tone = 'default', disabled }: { label: string; onClick: () => void; tone?: 'default' | 'danger' | 'primary'; disabled?: boolean }) => {
    const bg =
      tone === 'danger'
        ? 'rgba(255,60,60,0.12)'
        : tone === 'primary'
          ? 'rgba(139,92,246,0.25)'
          : 'rgba(255,255,255,0.06)';

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          padding: '10px 14px',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.12)',
          background: bg,
          color: 'rgba(255,255,255,0.92)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontWeight: 700,
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ color: 'rgba(255,255,255,0.92)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>VERA Self-Healing</div>
          <div style={{ opacity: 0.75, marginTop: 4, fontSize: 13 }}>
            Monitor system health, log errors, and apply safe auto-fixes.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: 999, background: statusColor(overall), display: 'inline-block' }} />
            <span style={{ fontWeight: 800 }}>{statusLabel(overall)}</span>
          </div>
          <Button label={loading ? 'Running…' : 'Run Health Check'} onClick={runChecks} tone="primary" disabled={loading} />
        </div>
      </div>

      {error && <div style={{ marginTop: 12, color: 'rgba(255,120,120,0.95)' }}>{error}</div>}

      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 12 }}>
        {[{ k: 'Database' }, { k: 'Auth' }, { k: 'AI (Claude)' }, { k: 'Voice (Hume)' }, { k: 'Storage' }].map(({ k }) => {
          const c = checksByName.get(k);
          return (
            <Card key={k}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                <div style={{ fontWeight: 800 }}>{k}</div>
                <div style={{ fontSize: 13 }}>{c ? checkEmoji(c.status) : '—'}</div>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, opacity: 0.85 }}>{c?.message || 'No data yet.'}</div>
              <div style={{ marginTop: 10, fontSize: 11, opacity: 0.6 }}>{c ? fmtTime(c.lastCheck) : ''}</div>
            </Card>
          );
        })}
      </div>

      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <Card>
          <div style={{ fontWeight: 800 }}>Recent Errors</div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {errors.length === 0 && <div style={{ opacity: 0.75, fontSize: 13 }}>No recent errors.</div>}

            {errors.map((e) => {
              const fix: AutoFix | undefined = (e as any).fix;
              const canAutoFix = fix?.fix?.kind === 'create_bucket';

              return (
                <div key={e.id} style={{ border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, opacity: 0.95 }}>{e.message}</div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>{e.resolved ? 'resolved' : e.type}</div>
                  </div>

                  <div style={{ marginTop: 6, fontSize: 12, opacity: 0.75 }}>
                    {e.file ? <span>{e.file} • </span> : null}
                    <span>{fmtTime(e.timestamp)}</span>
                  </div>

                  {fix && (
                    <div style={{ marginTop: 8, fontSize: 12, opacity: 0.85 }}>
                      <div style={{ fontWeight: 700 }}>{fix.fix.title}</div>
                      <div style={{ marginTop: 4, opacity: 0.85, whiteSpace: 'pre-wrap' }}>{fix.fix.details}</div>
                      {fix.fix.sql && (
                        <div style={{ marginTop: 8, padding: 10, borderRadius: 12, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.10)', whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
                          {fix.fix.sql}
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {!e.resolved && (
                      <Button label="Mark Resolved" onClick={() => markResolved(e.id)} disabled={loading} />
                    )}
                    {fix && (
                      <Button
                        label={canAutoFix ? 'Auto-Fix' : 'Fix Available'}
                        onClick={() => (canAutoFix ? applyAutoFix(e.id) : void 0)}
                        tone={canAutoFix ? 'primary' : 'default'}
                        disabled={loading || !canAutoFix}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div style={{ fontWeight: 800 }}>Daily Report</div>
          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.85, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
            {report?.dailyReport || 'Loading…'}
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
        <Button label="Refresh" onClick={() => refresh().catch(() => null)} disabled={loading} />
      </div>
    </div>
  );
}
