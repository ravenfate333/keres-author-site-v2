import { useEffect, useMemo, useRef, useState } from 'react';
import GhostSprite from './GhostSprite';

type Edge = 'left' | 'right';

interface GhostPeekerProps {
  edge?: Edge;                 // default starting edge (used if randomEdge=false)
  randomEdge?: boolean;        // randomly choose edge each peek
  minDelayMs?: number;
  maxDelayMs?: number;
  className?: string;
  zIndex?: number;
  maxWidthPx?: number;         // cap the sprite width
  afraidRadiusPx?: number;     // mouse proximity that makes ghost hide
}

const QUIPS = ['boo!', 'psst', 'hi reader…', 'oOoOo'];

export default function GhostPeeker({
  edge = 'right',
  randomEdge = true,
  minDelayMs = 2000,
  maxDelayMs = 6000,
  className = '',
  zIndex = 40,
  maxWidthPx = 56,
  afraidRadiusPx = 120,
}: GhostPeekerProps) {
  const [isPeeking, setIsPeeking] = useState(false);
  const [topPct, setTopPct] = useState(50);
  const [isSurprised, setIsSurprised] = useState(false); // alternate faces
  const [edgeState, setEdgeState] = useState<Edge>(edge); // current edge
  const [quip, setQuip] = useState<string | null>(null);  // speech bubble
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);

  const reducedMotion = useMemo(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false,
    []
  );
  const peekDurationMs = reducedMotion ? 1800 : 4200;

  const rand = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const schedule = () => {
    const delay = rand(minDelayMs, maxDelayMs);
    timers.current.push(
      window.setTimeout(() => {
        setTopPct(rand(28, 72));
        setIsSurprised((prev) => !prev);

        if (randomEdge) setEdgeState(Math.random() < 0.5 ? 'left' : 'right');

        // ~17% chance to show a quip
        if (Math.random() < 0.17) {
          const q = QUIPS[rand(0, QUIPS.length - 1)];
          setQuip(q);
          window.setTimeout(() => setQuip(null), 1600);
        } else {
          setQuip(null);
        }

        setIsPeeking(true);

        timers.current.push(
          window.setTimeout(() => {
            setIsPeeking(false);
            schedule();
          }, peekDurationMs)
        );
      }, delay)
    );
  };

  useEffect(() => {
    const onVisibility = () => {
      clearTimers();
      if (document.visibilityState === 'visible') schedule();
    };
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // afraid-of-mouse: hide if cursor gets close to the ghost center
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const g = ghostRef.current;
      if (!g || !isPeeking) return;
      const r = g.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const d = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (d < afraidRadiusPx) setIsPeeking(false);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [isPeeking, afraidRadiusPx]);

  const isRight = edgeState === 'right';
  const sideClass = isRight ? 'right-0' : 'left-0';
  const startX = isRight ? '100%' : '-100%';

  // size: match old behavior (responsive cap)
  const spriteSize = Math.min(maxWidthPx, 0.12 * (typeof window !== 'undefined' ? window.innerWidth : 480));
  // flip by mirroring the sprite horizontally
  const flipStyle = { transform: isRight ? 'scaleX(1)' : 'scaleX(-1)' } as React.CSSProperties;

  return (
    <div
      className={`pointer-events-none fixed inset-0 ${className}`}
      style={{ zIndex }}
      aria-hidden="true"
    >
      <div
        className={`absolute ${sideClass} -translate-y-1/2`}
        style={{
          top: `${topPct}%`,
          ['--startX' as any]: startX,
          ['--peekDuration' as any]: `${peekDurationMs}ms`,
        }}
      >
        <div
          ref={ghostRef}
          className={[
            'relative',             // for quip positioning
            'origin-center',
            'pointer-events-auto',
            'transition-opacity',
            isPeeking ? 'opacity-100 animate-ghost-peek' : 'opacity-0',
          ].join(' ')}
          onMouseEnter={() => setIsPeeking(false)} // also shy on hover
        >
          {/* Speech bubble (above the head, slightly inward) */}
          {quip && (
            <div
              className={[
                'absolute',
                isRight ? '-left-2' : '-right-2',
                '-top-2 -translate-y-full',
                'px-2 py-1 rounded-md bg-white/90 text-xs text-black shadow',
                'animate-[fade-in_180ms_ease-out]',
                'select-none',
              ].join(' ')}
            >
              {quip}
            </div>
          )}

          {/* Shared sprite (face swaps), flip via scaleX */}
          <div style={flipStyle}>
            <GhostSprite
              width={spriteSize}
              face={isSurprised ? 'alternate' : 'normal'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
