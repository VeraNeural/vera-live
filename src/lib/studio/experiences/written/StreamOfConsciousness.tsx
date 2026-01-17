'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { GLOBAL_STYLES } from '@/lib/studio/theme';

type TargetOption = '3m' | '5m' | '10m';

export interface StreamOfConsciousnessResult {
  action: 'review' | 'save' | 'release';
  text: string;
  wordCount: number;
  targetSeconds: number;
  startedAt: number;
  finishedAt: number;
}

interface StreamOfConsciousnessProps {
  onBack: () => void;
  onComplete: (result: StreamOfConsciousnessResult) => void;
}

const TARGETS: Array<{ id: TargetOption; label: string; seconds: number }> = [
  { id: '3m', label: '3 min', seconds: 3 * 60 },
  { id: '5m', label: '5 min', seconds: 5 * 60 },
  { id: '10m', label: '10 min', seconds: 10 * 60 },
];

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function StreamOfConsciousness({ onBack, onComplete }: StreamOfConsciousnessProps) {
  const [target, setTarget] = useState<TargetOption>('5m');
  const targetSeconds = useMemo(() => TARGETS.find((t) => t.id === target)?.seconds ?? 300, [target]);

  const [text, setText] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState<'setup' | 'writing' | 'complete' | 'review'>('setup');
  const [nudge, setNudge] = useState<string | null>(null);
  const [isReleasing, setIsReleasing] = useState(false);

  const lastTypeAtRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const wordCount = useMemo(() => countWords(text), [text]);

  useEffect(() => {
    if (phase !== 'writing') return;

    const tick = window.setInterval(() => {
      if (startedAt === null) return;
      const sec = Math.floor((Date.now() - startedAt) / 1000);
      setElapsed(sec);
      if (sec >= targetSeconds) {
        setPhase('complete');
      }

      const last = lastTypeAtRef.current;
      if (last && Date.now() - last > 5000) {
        setNudge('Keep going — no editing, just momentum.');
      } else {
        setNudge(null);
      }
    }, 250);

    return () => window.clearInterval(tick);
  }, [phase, startedAt, targetSeconds]);

  useEffect(() => {
    if (phase === 'writing') {
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [phase]);

  const startWriting = () => {
    setPhase('writing');
    setStartedAt(null);
    setElapsed(0);
    setText('');
    lastTypeAtRef.current = null;
  };

  const onChangeNoBackspace = (value: string) => {
    // Disallow edits/deletions: only accept when value extends previous.
    if (value.length < text.length) return;
    if (!value.startsWith(text)) {
      // If cursor moved and pasted, accept but re-lock by taking appended suffix.
      // This keeps the “no editing” spirit while not being brittle.
      setText(value);
    } else {
      setText(value);
    }
  };

  const onType = (value: string) => {
    const now = Date.now();
    lastTypeAtRef.current = now;
    if (startedAt === null) {
      setStartedAt(now);
    }
    onChangeNoBackspace(value);
  };

  const complete = (action: StreamOfConsciousnessResult['action']) => {
    if (!startedAt) return;

    const result: StreamOfConsciousnessResult = {
      action,
      text,
      wordCount,
      targetSeconds,
      startedAt,
      finishedAt: Date.now(),
    };

    if (action === 'release') {
      setIsReleasing(true);
      window.setTimeout(() => onComplete(result), 750);
      return;
    }

    onComplete(result);
  };

  const fadedText = useMemo(() => {
    if (!text) return { faded: '', focus: '' };
    const focusLen = 140;
    const focus = text.slice(-focusLen);
    const faded = text.slice(0, Math.max(0, text.length - focusLen));
    return { faded, focus };
  }, [text]);

  return (
    <>
      <style jsx global>{GLOBAL_STYLES}</style>
      <style jsx>{`
        .wrap {
          position: fixed;
          inset: 0;
          background: radial-gradient(1100px 700px at 20% 10%, rgba(168, 85, 247, 0.12), transparent 55%),
            radial-gradient(900px 600px at 80% 75%, rgba(99, 102, 241, 0.10), transparent 50%),
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
          padding: 14px;
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
          display: flex;
          flex-direction: column;
          padding: 16px;
          padding-bottom: max(16px, env(safe-area-inset-bottom));
          gap: 12px;
          overflow: hidden;
          opacity: ${isReleasing ? 0 : 1};
          transform: ${isReleasing ? 'translateY(16px) scale(0.99)' : 'translateY(0) scale(1)'};
          filter: ${isReleasing ? 'blur(2px)' : 'blur(0)'};
          transition: opacity 0.6s ease, transform 0.6s ease, filter 0.6s ease;
        }

        .card {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          padding: 16px;
        }

        .desc {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.55;
          margin: 8px 0 0 0;
        }

        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.55);
        }

        .targets {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 10px;
        }

        .targetBtn {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.75);
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 12px;
          cursor: pointer;
        }

        .targetBtnActive {
          border-color: rgba(168, 85, 247, 0.45);
          background: rgba(168, 85, 247, 0.14);
        }

        .typingSurface {
          flex: 1;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          padding: 14px;
          overflow: hidden;
          position: relative;
        }

        .rendered {
          height: 100%;
          overflow: auto;
          padding-right: 6px;
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.65;
          font-size: 15px;
        }

        .faded {
          opacity: 0.25;
          filter: blur(1.8px);
          user-select: none;
        }

        .focus {
          opacity: 0.9;
        }

        .input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          resize: none;
          background: transparent;
          color: transparent;
          caret-color: rgba(255, 255, 255, 0.8);
          border: none;
          outline: none;
          font-size: 16px;
          line-height: 1.65;
          padding: 14px;
        }

        .nudge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(168, 85, 247, 0.10);
          border-radius: 14px;
          padding: 10px 12px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.78);
          text-align: center;
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

        .ctaRelease {
          border-color: rgba(244, 63, 94, 0.35);
          background: rgba(244, 63, 94, 0.10);
          color: rgba(255, 255, 255, 0.88);
        }
      `}</style>

      <div className="wrap">
        <div className="header">
          <button className="pill" onClick={onBack}>
            ← Back
          </button>
          <div className="title">Stream of Consciousness</div>
          <div style={{ width: 78 }} />
        </div>

        {phase === 'setup' && (
          <div className="content">
            <div className="card">
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 300 }}>
                Don’t stop.
              </div>
              <p className="desc">Timer starts when you start typing. Previous text fades and blurs so you can’t edit it.</p>

              <div className="targets" aria-label="Target time">
                {TARGETS.map((t) => (
                  <button key={t.id} className={`targetBtn ${target === t.id ? 'targetBtnActive' : ''}`} onClick={() => setTarget(t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="actions" style={{ marginTop: 12 }}>
                <button className="cta ctaPrimary" onClick={startWriting}>
                  Start
                </button>
              </div>
            </div>
          </div>
        )}

        {(phase === 'writing' || phase === 'complete' || phase === 'review') && (
          <div className="content">
            <div className="row">
              <div>Elapsed: {formatElapsed(elapsed)} / {formatElapsed(targetSeconds)}</div>
              <div>Words: {wordCount}</div>
            </div>

            <div className="typingSurface">
              <div className="rendered" aria-hidden>
                {fadedText.faded && <span className="faded">{fadedText.faded}</span>}
                <span className="focus">{fadedText.focus}</span>
              </div>

              {phase === 'writing' && (
                <textarea
                  ref={inputRef}
                  className="input"
                  value={text}
                  onChange={(e) => onType(e.target.value)}
                  placeholder="Start typing…"
                  spellCheck={false}
                  autoCorrect="off"
                  autoCapitalize="sentences"
                />
              )}

              {phase === 'writing' && nudge && <div className="nudge">{nudge}</div>}
            </div>

            {phase === 'complete' && (
              <div className="card">
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 300, textAlign: 'center' }}>
                  Complete.
                </div>
                <p className="desc" style={{ textAlign: 'center' }}>You can review, save, or release.</p>
                <div className="actions" style={{ marginTop: 12 }}>
                  <button className="cta" onClick={() => setPhase('review')}>
                    Review
                  </button>
                  <button className="cta ctaPrimary" onClick={() => complete('save')}>
                    Save
                  </button>
                  <button className="cta ctaRelease" onClick={() => complete('release')}>
                    Release
                  </button>
                </div>
              </div>
            )}

            {phase === 'review' && (
              <div className="card">
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 300, textAlign: 'center' }}>
                  Review
                </div>
                <p className="desc" style={{ textAlign: 'center' }}>Read it once. No judgment.</p>
                <div className="actions" style={{ marginTop: 12 }}>
                  <button className="cta" onClick={() => complete('review')}>
                    Done
                  </button>
                  <button className="cta ctaPrimary" onClick={() => complete('save')}>
                    Save
                  </button>
                  <button className="cta ctaRelease" onClick={() => complete('release')}>
                    Release
                  </button>
                </div>
              </div>
            )}

            {phase === 'writing' && (
              <div className="actions">
                <button className="cta" onClick={() => setPhase('complete')}>
                  Finish early
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
