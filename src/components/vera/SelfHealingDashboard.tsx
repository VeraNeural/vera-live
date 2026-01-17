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
  if (overall === 'healthy') return 'HEALTHY';
  if (overall === 'degraded') return 'DEGRADED';
  return 'DOWN';
}

function overallEmoji(overall: SystemStatus['overall']): string {
  if (overall === 'healthy') return '🟢';
  if (overall === 'degraded') return '🟡';
  return '🔴';
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

function truncate(text: string, max = 88): string {
  const t = (text || '').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export default function SelfHealingDashboard() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<{ summary: string; dailyReport: string } | null>(null);
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);

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

  const orderedChecks = useMemo(() => {
    const checks = status?.checks || [];
    const preferredOrder = ['Database', 'Auth', 'AI (Claude)', 'Voice (Hume)', 'Storage'];

    const byName = new Map<string, HealthCheck>();
    for (const c of checks) byName.set(c.name, c);

    const ordered: HealthCheck[] = [];
    for (const name of preferredOrder) {
      const c = byName.get(name);
      if (c) ordered.push(c);
    }

    for (const c of checks) {
      if (!preferredOrder.includes(c.name)) ordered.push(c);
    }

    return ordered;
  }, [status]);

  const unresolvedErrors = useMemo(() => errors.filter((e) => !e.resolved), [errors]);

  const criticalChecks = useMemo(
    () => (status?.checks || []).filter((c) => c.status === 'critical'),
    [status]
  );

  const warningChecks = useMemo(
    () => (status?.checks || []).filter((c) => c.status === 'warning'),
    [status]
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

  const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ fontWeight: 900 }}>{title}</div>
      {subtitle ? <div style={{ fontSize: 12, opacity: 0.7 }}>{subtitle}</div> : null}
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
              padding: '10px 14px',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontWeight: 950,
              letterSpacing: 0.4,
            }}
            aria-label={`Overall status ${statusLabel(overall)}`}
          >
            <span style={{ fontSize: 14 }}>{overallEmoji(overall)}</span>
            <span style={{ color: statusColor(overall) }}>{statusLabel(overall)}</span>
          </div>
          <Button label={loading ? 'Running…' : 'Run Health Check'} onClick={runChecks} tone="primary" disabled={loading} />
        </div>
      </div>

      {error && <div style={{ marginTop: 12, color: 'rgba(255,120,120,0.95)' }}>{error}</div>}

      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card>
            <SectionTitle title="Health Checks" subtitle={status ? `Last run: ${fmtTime(status.checks[0]?.lastCheck)}` : '—'} />
            <div style={{ marginTop: 10, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', opacity: 0.8 }}>Service</th>
                    <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', opacity: 0.8, width: 90 }}>Status</th>
                    <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', opacity: 0.8 }}>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {orderedChecks.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ padding: '12px 8px', opacity: 0.75 }}>
                        No checks yet. Click “Run Health Check”.
                      </td>
                    </tr>
                  )}

                  {orderedChecks.map((c) => (
                    <tr key={c.id}>
                      <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 800 }}>{c.name}</td>
                      <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{checkEmoji(c.status)}</td>
                      <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)', opacity: 0.9 }}>{c.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <SectionTitle title="Recent Errors" subtitle={`${errors.length} shown`} />
            <div style={{ marginTop: 10, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', opacity: 0.8, width: 190 }}>Timestamp</th>
                    <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', opacity: 0.8, width: 160 }}>Type</th>
                    <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', opacity: 0.8 }}>Message</th>
                    <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', opacity: 0.8, width: 110 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {errors.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: '12px 8px', opacity: 0.75 }}>
                        No recent errors.
                      </td>
                    </tr>
                  )}

                  {errors.map((e) => (
                    <tr
                      key={e.id}
                      onClick={() => setSelectedError(e)}
                      style={{ cursor: 'pointer' }}
                      aria-label="View error details"
                    >
                      <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)', opacity: 0.85 }}>{fmtTime(e.timestamp)}</td>
                      <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)', opacity: 0.9 }}>{e.type}</td>
                      <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)', opacity: 0.95 }}>{truncate(e.message, 96)}</td>
                      <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)', opacity: 0.85 }}>{e.resolved ? 'resolved' : 'open'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
              Tip: click a row to see full details.
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card>
            <SectionTitle title="Overall Status" subtitle={report?.summary ? 'Auto-summary available' : undefined} />
            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  padding: '14px 14px',
                  borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(0,0,0,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 18 }}>{overallEmoji(overall)}</div>
                <div>
                  <div style={{ fontWeight: 950, letterSpacing: 0.4, color: statusColor(overall) }}>{statusLabel(overall)}</div>
                  <div style={{ marginTop: 4, fontSize: 12, opacity: 0.78 }}>
                    {criticalChecks.length > 0
                      ? `${criticalChecks.length} critical check(s) failing.`
                      : warningChecks.length > 0
                        ? `${warningChecks.length} warning check(s).`
                        : 'All checks look good.'}
                  </div>
                </div>
              </div>
            </div>

            {report?.summary && (
              <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                {report.summary}
              </div>
            )}
          </Card>

          <Card>
            <SectionTitle title="Critical Issues" subtitle={`${criticalChecks.length + unresolvedErrors.length} detected`} />
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {criticalChecks.length === 0 && unresolvedErrors.length === 0 && (
                <div style={{ opacity: 0.75, fontSize: 13 }}>No critical issues right now.</div>
              )}

              {criticalChecks.map((c) => (
                <details key={c.id} style={{ border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, padding: 12, background: 'rgba(0,0,0,0.18)' }}>
                  <summary style={{ cursor: 'pointer', listStyle: 'none' as any, display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                    <div style={{ fontWeight: 900 }}>{checkEmoji(c.status)} {c.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>{fmtTime(c.lastCheck)}</div>
                  </summary>
                  <div style={{ marginTop: 8, fontSize: 12, opacity: 0.9, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{c.message}</div>
                </details>
              ))}

              {unresolvedErrors.map((e) => {
                const fix: AutoFix | undefined = (e as any).fix;
                const canAutoFix = fix?.fix?.kind === 'create_bucket';

                return (
                  <details key={e.id} style={{ border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, padding: 12, background: 'rgba(0,0,0,0.18)' }}>
                    <summary style={{ cursor: 'pointer', listStyle: 'none' as any, display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                      <div style={{ fontWeight: 900 }}>🔴 {truncate(e.message, 56)}</div>
                      <div style={{ fontSize: 12, opacity: 0.7 }}>{fmtTime(e.timestamp)}</div>
                    </summary>

                    <div style={{ marginTop: 10, fontSize: 12, opacity: 0.85 }}>
                      <div><span style={{ opacity: 0.75 }}>Type:</span> {e.type}</div>
                      {e.file ? <div><span style={{ opacity: 0.75 }}>File:</span> {e.file}</div> : null}
                    </div>

                    {fix && (
                      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.9 }}>
                        <div style={{ fontWeight: 800 }}>{fix.fix.title}</div>
                        <div style={{ marginTop: 4, opacity: 0.85, whiteSpace: 'pre-wrap' }}>{fix.fix.details}</div>
                        {fix.fix.sql && (
                          <div style={{ marginTop: 8, padding: 10, borderRadius: 12, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.10)', whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
                            {fix.fix.sql}
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <Button label="View Details" onClick={() => setSelectedError(e)} disabled={loading} />
                      <Button label="Mark Resolved" onClick={() => markResolved(e.id)} disabled={loading} />
                      {fix && (
                        <Button
                          label={canAutoFix ? 'Auto-Fix' : 'Fix Available'}
                          onClick={() => (canAutoFix ? applyAutoFix(e.id) : void 0)}
                          tone={canAutoFix ? 'primary' : 'default'}
                          disabled={loading || !canAutoFix}
                        />
                      )}
                    </div>
                  </details>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
        <Button label="Refresh" onClick={() => refresh().catch(() => null)} disabled={loading} />
      </div>

      {selectedError && (
        <div
          onClick={() => setSelectedError(null)}
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
              <div style={{ fontWeight: 950, fontSize: 14 }}>Error Details</div>
              <button
                onClick={() => setSelectedError(null)}
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

            <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ fontSize: 12, opacity: 0.85 }}><span style={{ opacity: 0.7 }}>Timestamp:</span> {fmtTime(selectedError.timestamp)}</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}><span style={{ opacity: 0.7 }}>Type:</span> {selectedError.type}</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}><span style={{ opacity: 0.7 }}>Status:</span> {selectedError.resolved ? 'resolved' : 'open'}</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}><span style={{ opacity: 0.7 }}>File:</span> {selectedError.file || '—'}</div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 900, fontSize: 13 }}>Message</div>
              <div style={{ marginTop: 6, fontSize: 13, opacity: 0.95, whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>{selectedError.message}</div>
            </div>

            {selectedError.stack && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 900, fontSize: 13 }}>Stack</div>
                <pre
                  style={{
                    marginTop: 6,
                    padding: 12,
                    borderRadius: 12,
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    whiteSpace: 'pre-wrap',
                    fontSize: 12,
                    lineHeight: 1.45,
                    overflowX: 'auto',
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  }}
                >
                  {selectedError.stack}
                </pre>
              </div>
            )}

            <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {!selectedError.resolved && (
                <Button label="Mark Resolved" onClick={() => markResolved(selectedError.id)} disabled={loading} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
