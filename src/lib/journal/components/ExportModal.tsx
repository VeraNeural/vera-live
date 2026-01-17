'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CheckIn, ExportOptions, JournalEntry, JournalPattern } from '../types';

export interface ExportModalData {
  entries?: JournalEntry[];
  checkIns?: CheckIn[];
  patterns?: JournalPattern[];
}

export interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
  data: ExportModalData;
  defaultOptions?: Partial<ExportOptions>;
}

function toISODateInputValue(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function parseISODateInputValue(value: string) {
  const date = new Date(`${value}T00:00:00.000`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function safeFilenameDate(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

export function ExportModal({ open, onClose, theme = 'dark', data, defaultOptions }: ExportModalProps) {
  const colors = theme === 'dark'
    ? {
        bg: '#0f0d15',
        bgGradient: 'linear-gradient(to bottom, #0f0d15 0%, #1a1625 100%)',
        text: '#e8e6f0',
        textMuted: 'rgba(232, 230, 240, 0.6)',
        textDim: 'rgba(232, 230, 240, 0.4)',
        cardBg: 'rgba(255, 255, 255, 0.03)',
        cardBorder: 'rgba(255, 255, 255, 0.06)',
        accent: '#a855f7',
        accentGlow: 'rgba(168, 85, 247, 0.15)',
      }
    : {
        bg: '#faf9fc',
        bgGradient: 'linear-gradient(to bottom, #faf9fc 0%, #f3f1f8 100%)',
        text: '#1a1625',
        textMuted: 'rgba(26, 22, 37, 0.6)',
        textDim: 'rgba(26, 22, 37, 0.4)',
        cardBg: 'rgba(0, 0, 0, 0.02)',
        cardBorder: 'rgba(0, 0, 0, 0.06)',
        accent: '#9333ea',
        accentGlow: 'rgba(147, 51, 234, 0.1)',
      };

  const [format, setFormat] = useState<ExportOptions['format']>(defaultOptions?.format ?? 'json');
  const [includeEntries, setIncludeEntries] = useState(true);
  const [includeCheckIns, setIncludeCheckIns] = useState(true);
  const [includePatterns, setIncludePatterns] = useState(false);
  const [includeAnalysis, setIncludeAnalysis] = useState(defaultOptions?.includeAnalysis ?? false);

  const now = useMemo(() => new Date(), []);
  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  });
  const [to, setTo] = useState(() => new Date());

  useEffect(() => {
    if (!open) return;
    // Reset minimal state on open
    setFormat(defaultOptions?.format ?? 'json');
    setIncludeAnalysis(defaultOptions?.includeAnalysis ?? false);

    const dFrom = defaultOptions?.dateRange?.from;
    const dTo = defaultOptions?.dateRange?.to;

    if (dFrom) setFrom(dFrom);
    if (dTo) setTo(dTo);
  }, [open, defaultOptions]);

  const filtered = useMemo(() => {
    const fromDay = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
    const toDay = new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1).getTime();

    const inRange = (d: Date) => {
      const t = d.getTime();
      return t >= fromDay && t < toDay;
    };

    return {
      entries: (data.entries ?? []).filter((e) => inRange(e.createdAt)),
      checkIns: (data.checkIns ?? []).filter((c) => inRange(c.createdAt)),
      patterns: (data.patterns ?? []).filter((p) => inRange(p.lastSeen)),
    };
  }, [data.entries, data.checkIns, data.patterns, from, to]);

  if (!open) return null;

  const doExport = () => {
    const payload: Record<string, unknown> = {
      exportedAt: now.toISOString(),
      format,
      dateRange: { from: from.toISOString(), to: to.toISOString() },
      includeAnalysis,
    };

    if (includeEntries) {
      payload.entries = filtered.entries.map((e) => ({
        ...e,
        createdAt: e.createdAt.toISOString(),
      }));
    }

    if (includeCheckIns) {
      payload.checkIns = filtered.checkIns.map((c) => ({
        ...c,
        date: c.date.toISOString(),
        createdAt: c.createdAt.toISOString(),
      }));
    }

    if (includePatterns) {
      payload.patterns = filtered.patterns.map((p) => ({
        ...p,
        firstSeen: p.firstSeen.toISOString(),
        lastSeen: p.lastSeen.toISOString(),
      }));
    }

    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `vera-journal-export-${safeFilenameDate()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: theme === 'dark' ? 'rgba(0,0,0,0.55)' : 'rgba(20,18,30,0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        zIndex: 9999,
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 560,
          background: colors.bgGradient,
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: '18px',
          overflow: 'hidden',
          boxShadow: theme === 'dark' ? '0 30px 90px rgba(0,0,0,0.45)' : '0 30px 90px rgba(15,13,21,0.18)',
        }}
      >
        <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${colors.cardBorder}` }}>
          <div>
            <div style={{ color: colors.text, fontSize: 16 }}>Export</div>
            <div style={{ color: colors.textDim, fontSize: 13 }}>Download your journal data</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '12px',
              padding: '8px 10px',
              color: colors.textMuted,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>

        <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            <div style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 14, padding: 12 }}>
              <div style={{ color: colors.textDim, fontSize: 13, marginBottom: 8 }}>From</div>
              <input
                type="date"
                value={toISODateInputValue(from)}
                onChange={(e) => {
                  const parsed = parseISODateInputValue(e.target.value);
                  if (parsed) setFrom(parsed);
                }}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: 12,
                  padding: '10px 12px',
                  color: colors.text,
                }}
              />
            </div>

            <div style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 14, padding: 12 }}>
              <div style={{ color: colors.textDim, fontSize: 13, marginBottom: 8 }}>To</div>
              <input
                type="date"
                value={toISODateInputValue(to)}
                onChange={(e) => {
                  const parsed = parseISODateInputValue(e.target.value);
                  if (parsed) setTo(parsed);
                }}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: 12,
                  padding: '10px 12px',
                  color: colors.text,
                }}
              />
            </div>
          </div>

          <div style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 14, padding: 12 }}>
            <div style={{ color: colors.textDim, fontSize: 13, marginBottom: 10 }}>Format</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {(['json', 'markdown', 'pdf'] as const).map((f) => {
                const active = format === f;
                const disabled = f !== 'json';

                return (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    disabled={disabled}
                    style={{
                      flex: 1,
                      background: active ? `linear-gradient(135deg, ${colors.accentGlow}, transparent)` : 'transparent',
                      border: `1px solid ${active ? colors.accent : colors.cardBorder}`,
                      borderRadius: 12,
                      padding: '10px 12px',
                      color: disabled ? colors.textDim : active ? colors.text : colors.textMuted,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      opacity: disabled ? 0.65 : 1,
                    }}
                  >
                    {f.toUpperCase()}
                  </button>
                );
              })}
            </div>
            <div style={{ color: colors.textDim, fontSize: 12, marginTop: 10 }}>
              For now, only JSON export is enabled.
            </div>
          </div>

          <div style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 14, padding: 12 }}>
            <div style={{ color: colors.textDim, fontSize: 13, marginBottom: 10 }}>Include</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, color: colors.textMuted, fontSize: 14, marginBottom: 8 }}>
              <input type="checkbox" checked={includeEntries} onChange={(e) => setIncludeEntries(e.target.checked)} />
              Entries ({filtered.entries.length})
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, color: colors.textMuted, fontSize: 14, marginBottom: 8 }}>
              <input type="checkbox" checked={includeCheckIns} onChange={(e) => setIncludeCheckIns(e.target.checked)} />
              Check-ins ({filtered.checkIns.length})
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, color: colors.textMuted, fontSize: 14, marginBottom: 8 }}>
              <input type="checkbox" checked={includePatterns} onChange={(e) => setIncludePatterns(e.target.checked)} />
              Patterns ({filtered.patterns.length})
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, color: colors.textMuted, fontSize: 14 }}>
              <input type="checkbox" checked={includeAnalysis} onChange={(e) => setIncludeAnalysis(e.target.checked)} />
              Analysis (placeholder)
            </label>
          </div>

          <button
            onClick={doExport}
            style={{
              background: `linear-gradient(135deg, ${colors.accent}, #7c3aed)`,
              border: 'none',
              borderRadius: '12px',
              padding: '14px 18px',
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Download JSON
          </button>
        </div>
      </div>
    </div>
  );
}
