'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { GLOBAL_STYLES } from '@/lib/studio/theme';

export interface UnsentLetterResult {
  action: 'save' | 'release';
  to: string;
  text: string;
  wordCount: number;
  finishedAt: number;
}

interface UnsentLetterProps {
  onBack: () => void;
  onComplete: (result: UnsentLetterResult) => void;
}

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export function UnsentLetter({ onBack, onComplete }: UnsentLetterProps) {
  const [to, setTo] = useState('');
  const [text, setText] = useState('');
  const [isSealing, setIsSealing] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const wordCount = useMemo(() => countWords(text), [text]);

  useEffect(() => {
    window.setTimeout(() => textareaRef.current?.focus(), 60);
  }, []);

  const finish = (action: UnsentLetterResult['action']) => {
    const result: UnsentLetterResult = {
      action,
      to,
      text,
      wordCount,
      finishedAt: Date.now(),
    };

    if (action === 'release') {
      setIsSealing(true);
      window.setTimeout(() => onComplete(result), 900);
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
          background: radial-gradient(1000px 650px at 15% 12%, rgba(168, 85, 247, 0.12), transparent 55%),
            radial-gradient(900px 600px at 85% 75%, rgba(99, 102, 241, 0.10), transparent 50%),
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
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          padding: 16px;
          padding-bottom: max(16px, env(safe-area-inset-bottom));
          overflow: auto;
          opacity: ${isSealing ? 0 : 1};
          transform: ${isSealing ? 'translateY(18px) scale(0.99)' : 'translateY(0) scale(1)'};
          filter: ${isSealing ? 'blur(2px)' : 'blur(0)'};
          transition: opacity 0.7s ease, transform 0.7s ease, filter 0.7s ease;
        }

        @media (min-width: 860px) {
          .content {
            grid-template-columns: 1.6fr 1fr;
            align-items: start;
          }
        }

        .card {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          padding: 16px;
        }

        .label {
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 8px;
        }

        .toRow {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 12px;
        }

        .toInput {
          flex: 1;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 10px 12px;
          color: rgba(255, 255, 255, 0.86);
          font-size: 14px;
          outline: none;
        }

        .toInput::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .textarea {
          width: 100%;
          min-height: 48vh;
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

        .prompts {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .prompt {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(168, 85, 247, 0.07);
          border-radius: 14px;
          padding: 12px;
          color: rgba(255, 255, 255, 0.74);
          font-size: 13px;
          line-height: 1.55;
        }

        .meta {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: rgba(255, 255, 255, 0.55);
          font-size: 12px;
          margin-top: 10px;
        }

        .actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 12px;
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

        .sealHint {
          margin-top: 10px;
          text-align: center;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.45);
        }
      `}</style>

      <div className="wrap">
        <div className="header">
          <button className="pill" onClick={onBack}>
            ← Back
          </button>
          <div className="title">Unsent Letter</div>
          <div style={{ width: 78 }} />
        </div>

        <div className="content">
          <div className="card">
            <div className="label">To</div>
            <div className="toRow">
              <input
                className="toInput"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="person / feeling / situation"
              />
            </div>

            <div className="label">Write</div>
            <textarea
              ref={textareaRef}
              className="textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Say what you need to say. This is private."
            />

            <div className="meta">
              <div>Words: {wordCount}</div>
              <div>{text.trim().length ? 'Keep going gently' : 'Start whenever you’re ready'}</div>
            </div>

            <div className="actions">
              <button className="cta ctaPrimary" onClick={() => finish('save')}>
                Save privately
              </button>
              <button className="cta ctaRelease" onClick={() => finish('release')}>
                Seal &amp; Release
              </button>
            </div>
            <div className="sealHint">Release is symbolic — it simply lets it go.</div>
          </div>

          <div className="prompts">
            <div className="prompt">What do you wish they knew?</div>
            <div className="prompt">What hurt?</div>
            <div className="prompt">What do you need to say?</div>
            <div className="prompt">You don’t need to be fair. You just need to be honest.</div>
          </div>
        </div>
      </div>
    </>
  );
}
