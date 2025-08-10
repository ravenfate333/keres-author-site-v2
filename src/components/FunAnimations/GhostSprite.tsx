import React from "react";

export type GhostFace = "normal" | "alternate"; // "alternate" = surprised face

export default function GhostSprite({
  width = 96,
  height,                // optional; defaults to square
  face = "normal",
  className = "",
  style,
}: {
  width?: number;
  height?: number;
  face?: GhostFace;
  className?: string;
  style?: React.CSSProperties;
}) {
  const sizeH = height ?? width; // square by default
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="sneaky ghost"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{
        width: `${width}px`,
        height: `${sizeH}px`,
        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))",
        display: "block",
        ...style,
      }}
    >
      <path
        d="M32 6c-11 0-20 9-20 20v17c0 3 3 4 6 3 3-1 4 3 7 3s4-3 7-3 4 3 7 3 4-4 7-3c3 1 6 0 6-3V26C52 15 43 6 32 6z"
        fill="white"
        fillOpacity="0.9"
      />
      <circle cx="24" cy="26" r="3.5" fill="black" />
      <circle cx="40" cy="26" r="3.5" fill="black" />
      {face === "alternate" ? (
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
