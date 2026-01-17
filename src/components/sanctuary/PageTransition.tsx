'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

type TransitionPhase = 'idle' | 'fadeOut' | 'pause' | 'fadeIn';

type PageTransitionProps = {
  children: React.ReactNode;
};

const FADE_OUT_MS = 300;
const PAUSE_MS = 200;
const FADE_IN_MS = 300;

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  const [phase, setPhase] = useState<TransitionPhase>('idle');

  const transitionTokenRef = useRef(0);
  const lastPathRef = useRef<string | null>(null);

  const isTransitioning = phase !== 'idle';

  const contentStyle = useMemo<React.CSSProperties>(() => {
    const base: React.CSSProperties = {
      width: '100%',
      height: '100%',
      transitionProperty: 'opacity, transform, filter',
      transitionTimingFunction: 'cubic-bezier(0.42, 0, 0.58, 1)',
    };

    if (phase === 'fadeOut') {
      return {
        ...base,
        opacity: 0,
        transform: 'scale(0.98)',
        filter: 'blur(2px)',
        transitionDuration: `${FADE_OUT_MS}ms`,
      };
    }

    if (phase === 'pause') {
      return {
        ...base,
        opacity: 0,
        transform: 'scale(0.98)',
        filter: 'blur(2px)',
        transitionDuration: '0ms',
      };
    }

    if (phase === 'fadeIn') {
      return {
        ...base,
        opacity: 1,
        transform: 'scale(1)',
        filter: 'blur(0px)',
        transitionDuration: `${FADE_IN_MS}ms`,
      };
    }

    return {
      ...base,
      opacity: 1,
      transform: 'scale(1)',
      filter: 'blur(0px)',
      transitionDuration: '0ms',
    };
  }, [phase]);

  useEffect(() => {
    // First mount: establish baseline path without transitioning.
    if (lastPathRef.current === null) {
      lastPathRef.current = pathname;
      return;
    }

    if (pathname === lastPathRef.current) return;
    lastPathRef.current = pathname;

    const start = () => {
      transitionTokenRef.current += 1;
      const token = transitionTokenRef.current;

      setPhase('fadeOut');

      window.setTimeout(() => {
        if (transitionTokenRef.current !== token) return;

        setPhase('pause');

        window.setTimeout(() => {
          if (transitionTokenRef.current !== token) return;

          setPhase('fadeIn');

          window.setTimeout(() => {
            if (transitionTokenRef.current !== token) return;
            setPhase('idle');
          }, FADE_IN_MS);
        }, PAUSE_MS);
      }, FADE_OUT_MS);
    };

    // If we're mid-transition, restart the sequence so we always land on the latest route.
    start();
  }, [pathname]);

  return (
    <div className="vera-page-transition" style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      {/* Orb / glow layer */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          opacity: isTransitioning ? 1 : 0,
          transition: `opacity ${FADE_OUT_MS}ms ease-in-out`,
          zIndex: 9999,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '45%',
            transform: 'translate(-50%, -50%)',
            width: 220,
            height: 220,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 40% 35%, rgba(255, 255, 255, 0.35), rgba(155, 120, 255, 0.18) 40%, rgba(0, 0, 0, 0) 70%)',
            filter: 'blur(0px)',
            boxShadow:
              '0 0 60px rgba(155, 120, 255, 0.18), 0 0 140px rgba(255, 180, 120, 0.08), 0 0 220px rgba(255, 255, 255, 0.06)',
            animation: 'veraOrbBreath 1600ms ease-in-out infinite',
            opacity: phase === 'pause' ? 0.95 : 0.65,
            transition: 'opacity 200ms ease-in-out',
          }}
        />
      </div>

      {/* Content */}
      <div style={contentStyle}>{children}</div>

      <style>{`
        @keyframes veraOrbBreath {
          0% {
            transform: translate(-50%, -50%) scale(0.96);
            filter: blur(0px);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.03);
            filter: blur(0.4px);
          }
          100% {
            transform: translate(-50%, -50%) scale(0.96);
            filter: blur(0px);
          }
        }
      `}</style>
    </div>
  );
}
