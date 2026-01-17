'use client';

import { useEffect, useMemo, useState } from 'react';
import { GLOBAL_STYLES } from '@/lib/studio/theme';

export interface BurnListResult {
  action: 'save' | 'release';
  items: string[];
  burnedCount: number;
  createdAt: number;
  finishedAt: number;
}

interface BurnListProps {
  onBack: () => void;
  onComplete: (result: BurnListResult) => void;
}

export function BurnList({ onBack, onComplete }: BurnListProps) {
  const [input, setInput] = useState('');
  const [items, setItems] = useState<string[]>([]);
  const [phase, setPhase] = useState<'collect' | 'confirm' | 'burning' | 'done'>('collect');
  const [createdAt] = useState<number>(() => Date.now());

  const [burnIndex, setBurnIndex] = useState(0);
  const [spark, setSpark] = useState(0);

  const canAdd = input.trim().length > 0;
  const remaining = useMemo(() => items.slice(burnIndex), [items, burnIndex]);
  const burnedCount = Math.min(burnIndex, items.length);

  const addItem = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setItems((prev) => [...prev, trimmed]);
    setInput('');
  };

  const removeItem = (index: number) => {
    if (phase !== 'collect') return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const startBurn = () => {
    if (items.length === 0) return;
    setPhase('burning');
    setBurnIndex(0);
    setSpark(0);
  };

  useEffect(() => {
    if (phase !== 'burning') return;

    if (burnIndex >= items.length) {
      const t = window.setTimeout(() => setPhase('done'), 500);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => {
      setSpark((s) => s + 1);
      window.setTimeout(() => setBurnIndex((i) => i + 1), 520);
    }, 780);

    return () => window.clearTimeout(t);
  }, [phase, burnIndex, items.length]);

  const complete = (action: BurnListResult['action']) => {
    const result: BurnListResult = {
      action,
      items,
      burnedCount: action === 'release' ? items.length : burnedCount,
      createdAt,
      finishedAt: Date.now(),
    };
    onComplete(result);
  };

  return (
    <>
      <style jsx global>{GLOBAL_STYLES}</style>
      <style jsx>{`
        .wrap {
          position: fixed;
          inset: 0;
          background: radial-gradient(1000px 700px at 20% 10%, rgba(244, 63, 94, 0.12), transparent 55%),
            radial-gradient(900px 650px at 80% 85%, rgba(251, 146, 60, 0.10), transparent 50%),
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
        }

        .card {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          padding: 16px;
        }

        .hero {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 28px;
          font-weight: 300;
        }

        .desc {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.55;
          margin: 8px 0 0 0;
        }

        .row {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .input {
          flex: 1;
          min-width: 200px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 12px 12px;
          color: rgba(255, 255, 255, 0.88);
          outline: none;
        }

        .btn {
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: 999px;
          padding: 11px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.78);
        }

        .btnPrimary {
          border-color: rgba(244, 63, 94, 0.45);
          background: linear-gradient(135deg, rgba(244, 63, 94, 0.20) 0%, rgba(251, 146, 60, 0.14) 100%);
          color: rgba(255, 255, 255, 0.92);
        }

        .btnDanger {
          border-color: rgba(244, 63, 94, 0.40);
          background: rgba(244, 63, 94, 0.10);
          color: rgba(255, 255, 255, 0.90);
        }

        .list {
          flex: 1;
          overflow: auto;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          padding: 12px;
        }

        .note {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
          border-radius: 14px;
          padding: 12px;
          margin: 10px 0;
          position: relative;
          overflow: hidden;
        }

        .noteText {
          font-size: 14px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.85);
          word-break: break-word;
        }

        .noteMeta {
          margin-top: 8px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.45);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .remove {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.7);
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 11px;
          cursor: pointer;
        }

        @keyframes burnAway {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
            filter: blur(0);
          }
          30% {
            opacity: 0.95;
          }
          100% {
            transform: translateY(10px) scale(0.98);
            opacity: 0;
            filter: blur(2px);
          }
        }

        @keyframes flame {
          0% { transform: translateY(0) scale(1); opacity: 0.75; }
          50% { transform: translateY(-6px) scale(1.08); opacity: 0.95; }
          100% { transform: translateY(-2px) scale(0.98); opacity: 0.70; }
        }

        .burning {
          animation: burnAway 0.55s ease forwards;
        }

        .flame {
          position: absolute;
          right: 10px;
          top: 10px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(251, 146, 60, 0.9) 45%, rgba(244, 63, 94, 0.1) 70%);
          filter: blur(0.2px);
          animation: flame 0.5s ease-in-out infinite;
        }

        .footerActions {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .center {
          text-align: center;
        }
      `}</style>

      <div className="wrap">
        <div className="header">
          <button className="pill" onClick={onBack}>
            ← Back
          </button>
          <div className="title">Burn List</div>
          <div style={{ width: 78 }} />
        </div>

        <div className="content">
          {phase === 'collect' && (
            <>
              <div className="card">
                <div className="hero">Put it on paper.</div>
                <p className="desc">Add every thought you want to release. One line at a time.</p>

                <div className="row" style={{ marginTop: 12 }}>
                  <input
                    className="input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add an item…"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addItem();
                      }
                    }}
                  />
                  <button className="btn btnPrimary" onClick={addItem} disabled={!canAdd}>
                    Add
                  </button>
                </div>
              </div>

              <div className="list" aria-label="Items">
                {items.length === 0 ? (
                  <div className="card center" style={{ border: 'none', background: 'transparent' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 300 }}>
                      Start with one.
                    </div>
                    <p className="desc">No need to be perfect. Short is fine.</p>
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <div key={`${item}-${idx}`} className="note">
                      <div className="noteText">{item}</div>
                      <div className="noteMeta">
                        <span>Item {idx + 1}</span>
                        <button className="remove" onClick={() => removeItem(idx)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="footerActions">
                <button className="btn" onClick={() => setPhase('confirm')} disabled={items.length === 0}>
                  Next
                </button>
              </div>
            </>
          )}

          {phase === 'confirm' && (
            <div className="card center">
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 300 }}>
                Ready?
              </div>
              <p className="desc">You can save this privately, or burn it and let it go.</p>
              <div className="footerActions" style={{ marginTop: 12 }}>
                <button className="btn" onClick={() => complete('save')}>
                  Save
                </button>
                <button className="btn btnDanger" onClick={startBurn}>
                  Burn
                </button>
                <button className="btn" onClick={() => setPhase('collect')}>
                  Back
                </button>
              </div>
            </div>
          )}

          {phase === 'burning' && (
            <>
              <div className="card center">
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 300 }}>
                  Burning…
                </div>
                <p className="desc">Watch it disappear. Breathe out.</p>
              </div>
              <div className="list">
                {items.map((item, idx) => {
                  const isBurningNow = idx === burnIndex;
                  const isAlreadyBurned = idx < burnIndex;
                  return (
                    <div
                      key={`${item}-${idx}`}
                      className={`note ${isBurningNow ? 'burning' : ''}`}
                      style={{ opacity: isAlreadyBurned ? 0 : 1 }}
                    >
                      <div className="noteText">{item}</div>
                      {isBurningNow && <div className="flame" key={spark} />}
                      <div className="noteMeta">
                        <span>{isAlreadyBurned ? 'Gone' : isBurningNow ? 'Burning' : 'Next'}</span>
                        <span />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {phase === 'done' && (
            <div className="card center">
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 300 }}>
                It’s gone.
              </div>
              <p className="desc">You don’t have to carry it right now.</p>
              <div className="footerActions" style={{ marginTop: 12 }}>
                <button className="btn btnPrimary" onClick={() => complete('release')}>
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
