'use client';

import { useState, useEffect, useCallback } from 'react';
import { Download, Filter, RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  event_type: string;
  user_id: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown>;
  success: boolean;
}

interface AuditLogsResponse {
  data: AuditLogEntry[];
  count: number;
}

const EVENT_CATEGORIES = {
  auth: ['auth.login', 'auth.logout', 'auth.login_failed', 'auth.password_reset', 'auth.token_refresh'],
  data: ['data.export_requested', 'data.export_completed', 'data.deletion_requested', 'data.deletion_completed'],
  subscription: ['subscription.created', 'subscription.cancelled', 'subscription.updated', 'subscription.payment_failed'],
  consent: ['consent.cookie_updated', 'consent.memory_updated'],
  security: ['security.rate_limit_hit', 'security.suspicious_activity', 'security.blocked_request', 'security.unauthorized_access'],
  admin: ['admin.user_accessed', 'admin.settings_changed', 'admin.entitlement_granted'],
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  'auth.login': '#22c55e',
  'auth.logout': '#6b7280',
  'auth.login_failed': '#ef4444',
  'auth.password_reset': '#f59e0b',
  'data.export_requested': '#3b82f6',
  'data.export_completed': '#22c55e',
  'data.deletion_requested': '#f59e0b',
  'data.deletion_completed': '#ef4444',
  'subscription.created': '#22c55e',
  'subscription.cancelled': '#ef4444',
  'subscription.updated': '#3b82f6',
  'subscription.payment_failed': '#ef4444',
  'consent.cookie_updated': '#8b5cf6',
  'consent.memory_updated': '#8b5cf6',
  'security.rate_limit_hit': '#f59e0b',
  'security.suspicious_activity': '#ef4444',
  'security.blocked_request': '#ef4444',
  'security.unauthorized_access': '#ef4444',
  'admin.user_accessed': '#3b82f6',
  'admin.settings_changed': '#f59e0b',
  'admin.entitlement_granted': '#22c55e',
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [eventType, setEventType] = useState<string>('');
  const [successFilter, setSuccessFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7); // Last 7 days default
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [userId, setUserId] = useState<string>('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const limit = 50;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (eventType) params.set('eventType', eventType);
      if (successFilter !== 'all') params.set('success', successFilter);
      if (startDate) params.set('startDate', new Date(startDate).toISOString());
      if (endDate) params.set('endDate', new Date(endDate + 'T23:59:59').toISOString());
      if (userId) params.set('userId', userId);
      params.set('limit', String(limit));
      params.set('offset', String((page - 1) * limit));

      const response = await fetch(`/api/admin/audit-logs?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs');
      }

      const result: AuditLogsResponse = await response.json();
      setLogs(result.data);
      setCount(result.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [eventType, successFilter, startDate, endDate, userId, page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleExportCSV = useCallback(() => {
    const headers = ['Timestamp', 'Event Type', 'User ID', 'IP Hash', 'Success', 'Metadata'];
    const rows = logs.map((log) => [
      log.timestamp,
      log.event_type,
      log.user_id || '',
      log.ip_hash || '',
      log.success ? 'Yes' : 'No',
      JSON.stringify(log.metadata),
    ]);

    const csv = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [logs]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventIcon = (eventType: string, success: boolean) => {
    if (!success) return <XCircle size={14} style={{ color: '#ef4444' }} />;
    if (eventType.startsWith('security.')) return <AlertTriangle size={14} style={{ color: '#f59e0b' }} />;
    return <CheckCircle size={14} style={{ color: '#22c55e' }} />;
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Audit Logs</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={fetchLogs}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              cursor: 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            disabled={logs.length === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid rgba(139,92,246,0.3)',
              background: 'rgba(139,92,246,0.15)',
              color: '#a78bfa',
              cursor: 'pointer',
              opacity: logs.length === 0 ? 0.5 : 1,
            }}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          padding: 20,
          borderRadius: 12,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, gridColumn: '1 / -1' }}>
          <Filter size={16} style={{ color: '#9ca3af' }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: '#9ca3af' }}>Filters</span>
        </div>

        <div>
          <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 6 }}>Event Type</label>
          <select
            value={eventType}
            onChange={(e) => {
              setEventType(e.target.value);
              setPage(1);
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(0,0,0,0.3)',
              color: 'white',
              fontSize: 14,
            }}
          >
            <option value="">All Events</option>
            {Object.entries(EVENT_CATEGORIES).map(([category, events]) => (
              <optgroup key={category} label={category.charAt(0).toUpperCase() + category.slice(1)}>
                {events.map((event) => (
                  <option key={event} value={event}>
                    {event}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 6 }}>Status</label>
          <select
            value={successFilter}
            onChange={(e) => {
              setSuccessFilter(e.target.value);
              setPage(1);
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(0,0,0,0.3)',
              color: 'white',
              fontSize: 14,
            }}
          >
            <option value="all">All</option>
            <option value="true">Success</option>
            <option value="false">Failed</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 6 }}>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(1);
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(0,0,0,0.3)',
              color: 'white',
              fontSize: 14,
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 6 }}>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(1);
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(0,0,0,0.3)',
              color: 'white',
              fontSize: 14,
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 6 }}>User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              setPage(1);
            }}
            placeholder="Filter by user..."
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(0,0,0,0.3)',
              color: 'white',
              fontSize: 14,
            }}
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div
          style={{
            padding: 16,
            borderRadius: 8,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5',
            marginBottom: 24,
          }}
        >
          {error}
        </div>
      )}

      {/* Results count */}
      <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 12 }}>
        Showing {logs.length} of {count} logs
      </div>

      {/* Logs table */}
      <div
        style={{
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '140px 200px 120px 100px 80px 1fr',
            gap: 16,
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            fontSize: 12,
            fontWeight: 600,
            color: '#9ca3af',
          }}
        >
          <div>Timestamp</div>
          <div>Event Type</div>
          <div>User ID</div>
          <div>IP Hash</div>
          <div>Status</div>
          <div>Metadata</div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>No audit logs found</div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 200px 120px 100px 80px 1fr',
                gap: 16,
                padding: '12px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                fontSize: 13,
                alignItems: 'center',
              }}
            >
              <div style={{ color: '#9ca3af' }}>{formatDate(log.timestamp)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: EVENT_TYPE_COLORS[log.event_type] || '#6b7280',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{log.event_type}</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#9ca3af' }}>
                {log.user_id ? log.user_id.substring(0, 12) + '...' : '-'}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#6b7280' }}>{log.ip_hash || '-'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {getEventIcon(log.event_type, log.success)}
                <span style={{ fontSize: 11, color: log.success ? '#86efac' : '#fca5a5' }}>
                  {log.success ? 'OK' : 'Fail'}
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: 11,
                  color: '#6b7280',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={JSON.stringify(log.metadata, null, 2)}
              >
                {JSON.stringify(log.metadata)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {count > limit && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: page === 1 ? 'transparent' : 'rgba(255,255,255,0.05)',
              color: page === 1 ? '#4b5563' : 'white',
              cursor: page === 1 ? 'default' : 'pointer',
            }}
          >
            Previous
          </button>
          <span style={{ padding: '8px 16px', color: '#9ca3af' }}>
            Page {page} of {Math.ceil(count / limit)}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(Math.ceil(count / limit), p + 1))}
            disabled={page >= Math.ceil(count / limit)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: page >= Math.ceil(count / limit) ? 'transparent' : 'rgba(255,255,255,0.05)',
              color: page >= Math.ceil(count / limit) ? '#4b5563' : 'white',
              cursor: page >= Math.ceil(count / limit) ? 'default' : 'pointer',
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
