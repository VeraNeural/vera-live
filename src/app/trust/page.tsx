'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

export default function TrustPage() {
  const router = useRouter();

  const timeOfDay = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }, []);

  const isDark = timeOfDay === 'evening' || timeOfDay === 'night';

  return (
    <main className="wrap">
      <div className="bg" aria-hidden="true" />

      <header className="top">
        <button className="back" onClick={() => router.push('/')}
          aria-label="Back to home">
          ← Back
        </button>
        <div className="title">
          <div className="kicker">SIGNAL INTEGRITY TRUST</div>
          <h1>Trust, by design</h1>
          <p className="sub">
            VERA is built to stay calm, stay coherent, and stay aligned with your nervous system.
          </p>
        </div>
      </header>

      <section className="card">
        <h2>What this means</h2>
        <ul>
          <li>Safety-first approach — your state matters more than words.</li>
          <li>One consistent voice that stays coherent and grounded.</li>
          <li>Gentle pacing under stress, clarity when regulated.</li>
          <li>Consistent boundaries you can rely on.</li>
        </ul>
      </section>

      <section className="grid">
        <div className="panel">
          <h3>Containment</h3>
          <p>
            When you are activated, shutdown, or dissociated, the system defaults to regulation and
            stabilization.
          </p>
        </div>
        <div className="panel">
          <h3>Continuity</h3>
          <p>
            Your context is treated carefully, with no sudden tone flips or pressure pushes.
          </p>
        </div>
        <div className="panel">
          <h3>Precision</h3>
          <p>
            When you are regulated and asking for cognitive work, VERA can be direct and structured
            without becoming harsh.
          </p>
        </div>
      </section>

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          padding: 28px 18px 60px;
          color: ${isDark ? 'rgba(240, 235, 245, 0.92)' : 'rgba(30, 20, 40, 0.92)'};
          position: relative;
          overflow: hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        }

        .bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(180, 140, 210, 0.22), transparent 55%),
            radial-gradient(circle at 80% 30%, rgba(120, 180, 210, 0.18), transparent 55%),
            radial-gradient(circle at 30% 85%, rgba(210, 140, 170, 0.16), transparent 55%),
            linear-gradient(180deg, ${isDark ? '#0b0712' : '#f7f1fb'} 0%, ${isDark ? '#0a0710' : '#f2e9fb'} 100%);
          filter: saturate(1.05);
          z-index: -1;
        }

        .top {
          max-width: 980px;
          margin: 0 auto 18px;
        }

        .back {
          background: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(20,10,30,0.06)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(20,10,30,0.10)'};
          color: inherit;
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 14px;
          cursor: pointer;
        }

        .title {
          margin-top: 18px;
        }

        .kicker {
          letter-spacing: 0.22em;
          font-size: 12px;
          opacity: 0.75;
        }

        h1 {
          margin: 10px 0 8px;
          font-weight: 520;
          font-size: 40px;
          line-height: 1.05;
        }

        .sub {
          margin: 0;
          opacity: 0.85;
          max-width: 58ch;
          font-size: 16px;
          line-height: 1.45;
        }

        .card {
          max-width: 980px;
          margin: 18px auto;
          padding: 18px 18px;
          border-radius: 18px;
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(20,10,30,0.10)'};
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.55)'};
          backdrop-filter: blur(10px);
        }

        h2 {
          margin: 0 0 10px;
          font-size: 16px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.9;
        }

        ul {
          margin: 0;
          padding-left: 18px;
          line-height: 1.6;
          opacity: 0.9;
        }

        .grid {
          max-width: 980px;
          margin: 16px auto 0;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .panel {
          padding: 16px;
          border-radius: 16px;
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(20,10,30,0.10)'};
          background: ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.45)'};
          backdrop-filter: blur(10px);
        }

        h3 {
          margin: 0 0 6px;
          font-size: 16px;
          font-weight: 520;
        }

        p {
          margin: 0;
          opacity: 0.88;
          line-height: 1.5;
          font-size: 14px;
        }

        @media (max-width: 860px) {
          h1 {
            font-size: 34px;
          }
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
