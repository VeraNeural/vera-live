'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { GLOBAL_STYLES } from '@/lib/studio/theme';

type TimerOption = '5m' | '10m' | '15m' | 'unlimited';

export interface BrainDumpResult {
  action: 'save' | 'delete' | 'release';
  text: string;
  wordCount: number;
  durationSeconds: number | null;
  startedAt: number | null;
  finishedAt: number;
}

interface BrainDumpProps {
  onBack: () => void;
  onComplete: (result: BrainDumpResult) => void;
}

const TIMER_OPTIONS: Array<{ id: TimerOption; label: string; seconds: number | null }> = [
  { id: '5m', label: '5 min', seconds: 5 * 60 },
  { id: '10m', label: '10 min', seconds: 10 * 60 },
  { id: '15m', label: '15 min', seconds: 15 * 60 },
  { id: 'unlimited', label: 'Unlimited', seconds: null },
];

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

function formatRemaining(seconds: number | null): string {
  if (seconds === null) return '∞';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function BrainDump({ onBack, onComplete }: BrainDumpProps) {
  const [timer, setTimer] = useState<TimerOption>('10m');
  const [text, setText] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(10 * 60);
  const [phase, setPhase] = useState<'write' | 'done'>('write');
  const [isReleasing, setIsReleasing] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const durationSeconds = useMemo(() => TIMER_OPTIONS.find((t) => t.id === timer)?.seconds ?? null, [timer]);
  const wordCount = useMemo(() => countWords(text), [text]);

  useEffect(() => {
    // Reset remaining when timer changes (only if not already running)
    if (phase !== 'write') return;
    if (startedAt !== null) return;
    setRemainingSeconds(durationSeconds);
  }, [durationSeconds, phase, startedAt]);

  useEffect(() => {
    if (phase !== 'write') return;
    if (durationSeconds === null) return;
    if (startedAt === null) return;
    if (remainingSeconds === null) return;

    if (remainingSeconds <= 0) {
      const now = Date.now();
      setFinishedAt(now);
      setPhase('done');
      return;
    }

    const id = window.setInterval(() => {
      setRemainingSeconds((prev) => (prev === null ? null : Math.max(0, prev - 1)));
    }, 1000);

    return () => window.clearInterval(id);
  }, [durationSeconds, phase, remainingSeconds, startedAt]);

  useEffect(() => {
    if (phase === 'write') {
      window.setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [phase]);

  const startIfNeeded = () => {
    if (startedAt !== null) return;
    setStartedAt(Date.now());
  };

  const finishNow = () => {
    const now = Date.now();
    if (startedAt === null) setStartedAt(now);
    setFinishedAt(now);
    setPhase('done');
  };

  const finalize = (action: BrainDumpResult['action']) => {
    const now = Date.now();
    const result: BrainDumpResult = {
      action,
      text,
      wordCount,
      durationSeconds,
      startedAt,
      finishedAt: finishedAt ?? now,
    };

    if (action === 'release') {
      setIsReleasing(true);
      window.setTimeout(() => onComplete(result), 650);
      return;
    }

    onComplete(result);
  };

  return (
    <>
      <style jsx global>{GLOBAL_STYLES}</style>
      <style jsx>{`
        .wrap {
          position: fixed;
          inset: 0;
          background: radial-gradient(1200px 700px at 20% 10%, rgba(168, 85, 247, 0.12), transparent 55%),
            radial-gradient(900px 600px at 80% 70%, rgba(99, 102, 241, 0.10), transparent 50%),
            linear-gradient(180deg, rgba(8, 8, 12, 1) 0%, rgba(5, 5, 8, 1) 100%);
          color: rgba(255, 255, 255, 0.86);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 14px;
          padding-top: max(14px, env(safe-area-inset-top));
          gap: 10px;
          z-index: 10;
        }

        .pill {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.72);
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 13px;
          cursor: pointer;
        }

        .title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
        }

        .content {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 16px;
          padding-bottom: max(16px, env(safe-area-inset-bottom));
          gap: 12px;
          opacity: ${isReleasing ? 0 : 1};
          transform: ${isReleasing ? 'translateY(16px) scale(0.99)' : 'translateY(0) scale(1)'};
          filter: ${isReleasing ? 'blur(2px)' : 'blur(0)'};
          transition: opacity 0.55s ease, transform 0.55s ease, filter 0.55s ease;
        }

        .prompt {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 22px;
          font-weight: 300;
          line-height: 1.25;
          margin: 0;
          color: rgba(255, 255, 255, 0.84);
        }

        .meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          color: rgba(255, 255, 255, 0.55);
          font-size: 12px;
        }

        .timerRow {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .timerBtn {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.75);
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 12px;
          cursor: pointer;
        }

        .timerBtnActive {
          border-color: rgba(168, 85, 247, 0.45);
          background: rgba(168, 85, 247, 0.14);
        }

        .textarea {
          flex: 1;
          width: 100%;
          resize: none;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 14px;
          color: rgba(255, 255, 255, 0.86);
          font-size: 15px;
          line-height: 1.65;
          outline: none;
        }

        .textarea::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .cta {
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: 999px;
          padding: 11px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.78);
        }

        .ctaPrimary {
          border-color: rgba(168, 85, 247, 0.5);
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(99, 102, 241, 0.18) 100%);
          color: rgba(255, 255, 255, 0.92);
        }

        .ctaDanger {
          border-color: rgba(244, 63, 94, 0.35);
          background: rgba(244, 63, 94, 0.10);
          color: rgba(255, 255, 255, 0.88);
        }

        .doneCard {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          padding: 16px;
          text-align: center;
        }

        .doneTitle {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 26px;
          font-weight: 300;
          margin: 0 0 8px 0;
        }

        .doneSub {
          margin: 0 0 14px 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.55;
        }
      `}</style>

      <div className="wrap">
        <div className="header">
          <button className="pill" onClick={onBack}>
            ← Back
          </button>
          <div className="title">Brain Dump</div>
          <button className="pill" onClick={finishNow}>
            Done
          </button>
        </div>

        <div className="content">
          <p className="prompt">Just let it flow.</p>

          <div className="meta">
            <div>Words: {wordCount}</div>
            <div>Time: {formatRemaining(remainingSeconds)}</div>
          </div>

          {startedAt === null && (
            <div className="timerRow" aria-label="Timer options">
              {TIMER_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  className={`timerBtn ${timer === t.id ? 'timerBtnActive' : ''}`}
                  onClick={() => {
                    setTimer(t.id);
                    setRemainingSeconds(t.seconds);
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {phase === 'write' && (
            <textarea
              ref={textareaRef}
              className="textarea"
              placeholder="No judgment. No editing. Just dump it here…"
              value={text}
              onFocus={startIfNeeded}
              onChange={(e) => {
                startIfNeeded();
                setText(e.target.value);
              }}
            />
          )}

          {phase === 'done' && (
            <div className="doneCard">
              <h2 className="doneTitle">You did it.</h2>
              <p className="doneSub">No fixing. No polishing. Just release.</p>
              <div className="actions">
                <button className="cta ctaPrimary" onClick={() => finalize('save')}>
                  Save
                </button>
                <button className="cta ctaDanger" onClick={() => finalize('delete')}>
                  Delete
                </button>
                <button className="cta" onClick={() => finalize('release')}>
                  Release
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
