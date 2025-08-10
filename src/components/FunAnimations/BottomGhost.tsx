import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type FaceMode = 'normal' | 'surprised' | 'alternate';

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
  minPauseEveryMs = 4000,
  maxPauseEveryMs = 9000,
  minPauseDurMs = 900,
  maxPauseDurMs = 1600,
  reentryDelayMs = 1000,
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

  // DOM refs
  const moverRef = useRef<HTMLDivElement | null>(null);  // the element we translateX on
  const spriteRef = useRef<HTMLDivElement | null>(null); // inner bob container

  // visual state
  const [quip, setQuip] = useState<string | null>(null);
  const [hoverHide, setHoverHide] = useState(false);
  const [altFace, setAltFace] = useState(false);

  // motion refs (not state)
  const xRef = useRef<number>(-120);
  const vxRef = useRef<number>(speedPxPerSec);
  const nextPauseAtRef = useRef<number>(0);
  const pauseUntilRef = useRef<number | null>(null);
  const lastPauseStartRef = useRef<number>(0);
  const travelSincePauseRef = useRef<number>(0);

  // tuning to prevent micro-pauses
  const MIN_TRAVEL_PX_BEFORE_PAUSE = 120;  // must travel this far before another pause
  const MIN_TIME_AFTER_RESUME_MS = 900;    // grace period after resuming

  const rand = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
  const vw = () => (typeof window !== 'undefined' ? window.innerWidth : 1200);

  // seed the first pause window
  useEffect(() => {
    const now = performance.now();
    nextPauseAtRef.current = now + rand(minPauseEveryMs, maxPauseEveryMs);
  }, [minPauseEveryMs, maxPauseEveryMs]);

  // main loop (imperative transform = smooth)
  useEffect(() => {
    const speed = reducedMotion ? Math.max(20, speedPxPerSec * 0.5) : speedPxPerSec;
    vxRef.current = speed;

    let last = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      const width = vw();
      const mover = moverRef.current;
      if (!mover) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const ghostW = ghostWidthPx;
      const leftOff = -ghostW - 24;
      const rightOff = width + 24;

      const isPaused = pauseUntilRef.current !== null && now < pauseUntilRef.current;

      // consider starting a pause (only if traveled enough since last pause and past grace period)
      if (
        !isPaused &&
        !hoverHide &&
        now >= nextPauseAtRef.current &&
        travelSincePauseRef.current >= MIN_TRAVEL_PX_BEFORE_PAUSE &&
        now - lastPauseStartRef.current >= MIN_TIME_AFTER_RESUME_MS
      ) {
        // flip face if alternating
        if (face === 'alternate') setAltFace((v) => !v);
        // quip maybe
        if (Math.random() < 0.5 && quips.length) {
          setQuip(quips[rand(0, quips.length - 1)]);
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

      // move if not paused/hover-hiding
      if (!isPaused && !hoverHide) {
        xRef.current += vxRef.current * dt;
        travelSincePauseRef.current += Math.abs(vxRef.current * dt);
        if (xRef.current >= rightOff) {
          xRef.current = leftOff;
          setQuip(null);
          pauseUntilRef.current = null;
          nextPauseAtRef.current = now + rand(minPauseEveryMs, maxPauseEveryMs);
          travelSincePauseRef.current = 0;
          lastPauseStartRef.current = now; // avoid instant pause after reset
        }
      }

      // apply transform (translateX) imperatively (no render)
      mover.style.transform = `translateX(${xRef.current}px)`;

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [
    speedPxPerSec,
    reducedMotion,
    ghostWidthPx,
    hoverHide,
    minPauseEveryMs,
    maxPauseEveryMs,
    minPauseDurMs,
    maxPauseDurMs,
    face,
    quips,
  ]);

  // hover -> temporary "oh nooo..." + fade
  useEffect(() => {
    if (!hoverHide) return;
    setQuip(ONO);
    const t = setTimeout(() => {
      setQuip(null);
      setHoverHide(false);
      const now = performance.now();
      nextPauseAtRef.current = now + rand(minPauseEveryMs, maxPauseEveryMs);
      pauseUntilRef.current = null;
      travelSincePauseRef.current = 0;
      lastPauseStartRef.current = now;
    }, reentryDelayMs);
    return () => clearTimeout(t);
  }, [hoverHide, reentryDelayMs, minPauseEveryMs, maxPauseEveryMs]);

  const motionCls = reducedMotion ? '' : ''; // bob moved to inner wrapper so no transform conflicts
  const useSurprised = face === 'surprised' ? true : face === 'normal' ? false : altFace;

  const content = (
    <div
      className="fixed pointer-events-none w-screen"
      style={{
        left: 0,
        right: 0,
        bottom: bottomOffsetPx,
        zIndex,
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
      }}
      aria-hidden="true"
    >
      {/* mover: gets translateX via JS only */}
      <div
        ref={moverRef}
        className="pointer-events-auto relative select-none transition-opacity duration-[1200ms]"
        onMouseEnter={() => setHoverHide(true)}
        style={{ willChange: 'transform, opacity', opacity: hoverHide ? 0 : 1 }}
      >
        {/* bubble */}
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

        {/* inner wrapper gets the bob so it doesn't fight translateX */}
        <div ref={spriteRef} className="animate-ghost-sneak-bob">
          <BottomGhostSprite className={motionCls} widthPx={ghostWidthPx} surprised={useSurprised} />
        </div>
      </div>
    </div>
  );

  if (!portal) return content;
  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
}

/* sprite */
function BottomGhostSprite({
  className = '',
  widthPx = 96,
  surprised = false,
}: {
  className?: string;
  widthPx?: number;
  surprised?: boolean;
}) {
  const size = widthPx;
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="sneaky ghost"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))',
        display: 'block',
      }}
    >
      <path d="M32 6c-11 0-20 9-20 20v17c0 3 3 4 6 3 3-1 4 3 7 3s4-3 7-3 4 3 7 3 4-4 7-3c3 1 6 0 6-3V26C52 15 43 6 32 6z" fill="white" fillOpacity="0.9" />
      <circle cx="24" cy="26" r="3.5" fill="black" />
      <circle cx="40" cy="26" r="3.5" fill="black" />
      {surprised ? (
        <circle cx="32" cy="36" r="2.8" fill="black" />
      ) : (
        <path d="M26 36c3 2 9 2 12 0" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}
