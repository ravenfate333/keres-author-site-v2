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
  ghostWidthPx?: number; // width in px; height auto from aspect
  bubbleTopPx?: number; // distance above head (smaller = closer)
  bubbleAheadPct?: number; // bubble anchor (% across ghost width)
  face?: FaceMode; // "normal" | "surprised" | "alternate"
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

  const ghostRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);

  // L -> R only; resets when off-screen right
  const [x, setX] = useState(-120);
  const [paused, setPaused] = useState(false);

  // flair
  const [quip, setQuip] = useState<string | null>(null);
  const [hoverHide, setHoverHide] = useState(false);
  const [altFace, setAltFace] = useState<boolean>(false); // used when face="alternate"

  // helpers
  const rand = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
  const vw = () => (typeof window !== 'undefined' ? window.innerWidth : 1200);

  // schedule random pauses + occasional quips
  const pauseTimer = useRef<number | null>(null);
  const clearPauseTimer = () => {
    if (pauseTimer.current) {
      window.clearTimeout(pauseTimer.current);
      pauseTimer.current = null;
    }
  };

  const schedulePause = () => {
    clearPauseTimer();
    const delay = rand(minPauseEveryMs, maxPauseEveryMs);
    pauseTimer.current = window.setTimeout(() => {
      const dur = rand(minPauseDurMs, maxPauseDurMs);
      // flip the face if we’re alternating
      if (face === 'alternate') setAltFace((prev) => !prev);
      if (Math.random() < 0.5 && quips.length) {
        setQuip(quips[rand(0, quips.length - 1)]);
      }
      setPaused(true);
      window.setTimeout(() => {
        setPaused(false);
        setQuip(null);
        schedulePause();
      }, dur);
    }, delay);
  };

  // movement loop (always moves; slower if reduced motion)
  useEffect(() => {
    const effectiveSpeed = reducedMotion ? Math.max(20, speedPxPerSec * 0.5) : speedPxPerSec;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      const width = vw();
      const ghostW = ghostRef.current?.offsetWidth ?? ghostWidthPx;
      const leftOff = -ghostW - 24;
      const rightOff = width + 24;

      if (!paused && !hoverHide) {
        setX((prev) => {
          const next = prev + effectiveSpeed * dt;
          if (next >= rightOff) {
            setQuip(null);
            schedulePause();
            return leftOff;
          }
          return next;
        });
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    schedulePause();

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      clearPauseTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speedPxPerSec, reducedMotion, ghostWidthPx, face]);

  // hover -> “oh nooo” then resume
  useEffect(() => {
    if (!hoverHide) return;
    setPaused(true);
    setQuip(ONO);
    const t = setTimeout(() => {
      setQuip(null);
      setHoverHide(false);
      setPaused(false);
      schedulePause();
    }, reentryDelayMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverHide]);

  const fadeCls = hoverHide ? 'opacity-0' : 'opacity-100';
  const motionCls = reducedMotion ? '' : 'animate-ghost-sneak-bob';

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
      <div
        ref={ghostRef}
        className={`pointer-events-auto relative select-none transition-opacity duration-[1200ms] ${fadeCls}`}
        onMouseEnter={() => setHoverHide(true)}
        style={{ transform: `translateX(${x}px)`, willChange: 'transform, opacity' }}
      >
        {/* snug bubble: just above head, slightly ahead (tweak with props) */}
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

        <BottomGhostSprite className={motionCls} widthPx={ghostWidthPx} surprised={useSurprised} />
      </div>
    </div>
  );

  if (!portal) return content;
  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
}

/* === Sprite that matches side peeking ghost exactly (64×64 viewBox) === */
function BottomGhostSprite({
  className = '',
  widthPx = 96,
  surprised = false,
}: {
  className?: string;
  widthPx?: number;
  surprised?: boolean;
}) {
  // keep the original 64:64 square aspect
  const heightPx = widthPx; // square
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="sneaky ghost"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{
        width: `${widthPx}px`,
        height: `${heightPx}px`,
        filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))',
        display: 'block',
      }}
    >
      {/* body (same path as side ghost) */}
      <path
        d="M32 6c-11 0-20 9-20 20v17c0 3 3 4 6 3 3-1 4 3 7 3s4-3 7-3 4 3 7 3 4-4 7-3c3 1 6 0 6-3V26C52 15 43 6 32 6z"
        fill="white"
        fillOpacity="0.9"
      />
      {/* eyes */}
      <circle cx="24" cy="26" r="3.5" fill="black" />
      <circle cx="40" cy="26" r="3.5" fill="black" />
      {/* mouth: smile vs :O */}
      {surprised ? (
        <circle cx="32" cy="36" r="2.8" fill="black" />
      ) : (
        <path
          d="M26 36c3 2 9 2 12 0"
          stroke="black"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
