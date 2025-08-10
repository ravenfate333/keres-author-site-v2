import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import GhostSprite from '../FunAnimations/GhostSprite';

type FaceMode = 'normal' | 'alternate';

interface BottomGhostProps {
  speedPxPerSec?: number;
  bottomOffsetPx?: number;
  minPauseEveryMs?: number;
  maxPauseEveryMs?: number;
  minPauseDurMs?: number;
  maxPauseDurMs?: number;
  reentryDelayMs?: number;
  zIndex?: number;
  quips?: string[];
  portal?: boolean;
  respectReducedMotion?: boolean;
  ghostWidthPx?: number;
  bubbleTopPx?: number;
  bubbleAheadPct?: number;
  face?: FaceMode;
}

const DEFAULT_QUIPS = [
  'omw to buy books',
  "don't mind me...",
  'my TBR is scarier',
  'I think this page is haunted...',
];
const ONO = 'oh nooo...';

export default function BottomGhost({
  speedPxPerSec = 56,
  bottomOffsetPx = 16,
  minPauseEveryMs = 2500,
  maxPauseEveryMs = 5200,
  minPauseDurMs = 700,
  maxPauseDurMs = 1600,
  reentryDelayMs = 1200,
  zIndex = 90,
  quips = DEFAULT_QUIPS,
  portal = true,
  respectReducedMotion = true,
  ghostWidthPx = 96,
  bubbleTopPx = 2,
  bubbleAheadPct = 3,
  face = 'alternate',
}: BottomGhostProps) {
  const reducedMotion = useMemo(
    () =>
      respectReducedMotion
        ? window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
        : false,
    [respectReducedMotion],
  );

  // node translateX on (imperative; no per-frame re-render)
  const moverRef = useRef<HTMLDivElement | null>(null);

  // UI state
  const [quip, setQuip] = useState<string | null>(null);
  const [hoverHide, setHoverHide] = useState(false);
  const [altFace, setAltFace] = useState(false);

  // motion refs
  const xRef = useRef<number>(-120);
  const vxRef = useRef<number>(speedPxPerSec);
  const nextPauseAtRef = useRef<number>(0);
  const pauseUntilRef = useRef<number | null>(null);
  const lastPauseStartRef = useRef<number>(0);
  const travelSincePauseRef = useRef<number>(0);
  const runningRef = useRef<boolean>(true);

  // start at random, then cycle quips in order
  const quipIndexRef = useRef<number>(Math.floor(Math.random() * Math.max(1, quips.length)));

  const rand = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
  const vw = () => (typeof window !== 'undefined' ? window.innerWidth : 1200);

  // seed first pause window
  useEffect(() => {
    const now = performance.now();
    nextPauseAtRef.current = now + rand(minPauseEveryMs, maxPauseEveryMs);
  }, [minPauseEveryMs, maxPauseEveryMs]);

  // pause rAF when tab is hidden
  useEffect(() => {
    const onVis = () => {
      runningRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    const speed = reducedMotion ? Math.max(20, speedPxPerSec * 0.5) : speedPxPerSec;
    vxRef.current = speed;

    let last = performance.now();
    let rafId: number;

    const MIN_TRAVEL_PX_BEFORE_PAUSE = 120;
    const MIN_TIME_AFTER_RESUME_MS = 900;

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (!runningRef.current) { last = now; return; }

      const dt = (now - last) / 1000;
      last = now;

      const width = vw();
      const leftOff = -ghostWidthPx - 24;
      const rightOff = width + 24;
      const mover = moverRef.current;
      if (!mover) return;

      const isPaused = pauseUntilRef.current !== null && now < pauseUntilRef.current;

      // start pause?
      if (
        !isPaused &&
        !hoverHide &&
        now >= nextPauseAtRef.current &&
        travelSincePauseRef.current >= MIN_TRAVEL_PX_BEFORE_PAUSE &&
        now - lastPauseStartRef.current >= MIN_TIME_AFTER_RESUME_MS
      ) {
        if (face === 'alternate') setAltFace(v => !v);
        if (quips.length) {
          quipIndexRef.current = (quipIndexRef.current + 1) % quips.length;
          setQuip(quips[quipIndexRef.current]);
        }
        pauseUntilRef.current = now + rand(minPauseDurMs, maxPauseDurMs);
        lastPauseStartRef.current = now;
        travelSincePauseRef.current = 0;
      }

      // end pause
      if (pauseUntilRef.current && now >= pauseUntilRef.current) {
        pauseUntilRef.current = null;
        setQuip(null);
        nextPauseAtRef.current = now + rand(minPauseEveryMs, maxPauseEveryMs);
      }

      // move
      if (!isPaused && !hoverHide) {
        xRef.current += vxRef.current * dt;
        travelSincePauseRef.current += Math.abs(vxRef.current * dt);

        if (xRef.current >= rightOff) {
          xRef.current = leftOff;
          setQuip(null);
          pauseUntilRef.current = null;
          nextPauseAtRef.current = now + rand(minPauseEveryMs, maxPauseEveryMs);
          travelSincePauseRef.current = 0;
          lastPauseStartRef.current = now;
        }
      }

      mover.style.transform = `translateX(${xRef.current}px)`;
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [
    speedPxPerSec,
    reducedMotion,
    ghostWidthPx,
    minPauseEveryMs,
    maxPauseEveryMs,
    minPauseDurMs,
    maxPauseDurMs,
    face,
    quips,
  ]);

  // hover fade-out -> resume (slow, with "oh nooo..." shown first)
  useEffect(() => {
    if (!hoverHide) return;
    const t = setTimeout(() => {
      setQuip(null);
      setHoverHide(false);
      const now = performance.now();
      nextPauseAtRef.current = now + Math.max(800, minPauseEveryMs);
      pauseUntilRef.current = null;
      travelSincePauseRef.current = 0;
      lastPauseStartRef.current = now;
    }, reentryDelayMs);
    return () => clearTimeout(t);
  }, [hoverHide, reentryDelayMs, minPauseEveryMs]);

  const content = (
    <div
      className="fixed pointer-events-none w-screen"
      style={{
        left: 0, right: 0, bottom: bottomOffsetPx, zIndex,
        WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)',
      }}
      aria-hidden="true"
    >
      <div
        ref={moverRef}
        className="pointer-events-auto relative select-none transition-opacity duration-[1200ms] ease-out"
        onMouseEnter={() => {
          if (hoverHide) return;
          setQuip(ONO);                       // show bubble immediately
          setTimeout(() => setHoverHide(true), 100); // begin slow fade after a tiny delay
        }}
        style={{ willChange: 'transform, opacity', opacity: hoverHide ? 0 : 1 }}
      >
        {quip && (
          <div
            className="absolute text-xs text-black bg-white/90 rounded-md shadow px-2 py-1 animate-[fade-in_140ms_ease-out] whitespace-nowrap"
            style={{
              left: `${bubbleAheadPct}%`,
              transform: 'translateX(-50%) translateY(-100%)',
              top: `-${bubbleTopPx}px`,
            }}
          >
            {quip}
          </div>
        )}

        {/* bob on child so it doesn't clash with translateX on mover */}
        <div className="animate-ghost-sneak-bob">
          <GhostSprite width={ghostWidthPx} face={altFace ? 'alternate' : 'normal'} />
        </div>
      </div>
    </div>
  );

  if (!portal) return content;
  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
}
