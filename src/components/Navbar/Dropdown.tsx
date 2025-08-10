import { useEffect, useId, useRef, useState } from "react";

type DropdownProps = {
  label: string;
  children: React.ReactNode;
  align?: "left" | "right";
  buttonClassName?: string;
  panelClassName?: string;
  id?: string;
  openOnHover?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function Dropdown({
  label,
  children,
  align = "left",
  buttonClassName = "inline-flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
  panelClassName = "",
  id,
  openOnHover = false,
  onOpenChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const openedByKeyboard = useRef(false); // track how it was opened
  const hoverTimer = useRef<number | null>(null);

  const uid = useId();
  const menuId = id || `menu-${uid}`;
  const btnId = `button-${uid}`;

  // notify parent
  useEffect(() => { onOpenChange?.(open); }, [open, onOpenChange]);

  // close on outside / Esc (only when open)
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !btnRef.current?.contains(t)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  // restore focus ONLY if it was opened via keyboard
  useEffect(() => {
    if (wasOpen.current && !open && openedByKeyboard.current) {
      btnRef.current?.focus({ preventScroll: true });
    }
    if (!open) openedByKeyboard.current = false; // reset on close
    wasOpen.current = open;
  }, [open]);

  // Hover handling (desktop)
  const onMouseEnter = () => {
    if (!openOnHover) return;
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    setOpen(true);
  };
  const onMouseLeave = () => {
    if (!openOnHover) return;
    hoverTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <button
        ref={btnRef}
        id={btnId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        // Prevent mouse from moving focus to the trigger (so ring doesn't stick)
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            openedByKeyboard.current = true;
          }
        }}
        className={buttonClassName.replace(/focus:/g, "focus-visible:")} // safety
      >
        {label}
        <svg
          className={`h-4 w-4 opacity-80 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
        </svg>
      </button>

      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-labelledby={btnId}
        data-state={open ? "open" : "closed"}
        className={[
          align === "left" ? "absolute left-0 top-full" : "absolute right-0 top-full",
          "z-30 mt-2 min-w-56 rounded-xl bg-nav-bg/95 text-navHover shadow-lg backdrop-blur border border-white/10",
          "origin-top transform-gpu will-change-[opacity,transform]",
          "transition-transform duration-200 ease-out",
          "data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0 data-[state=closed]:scale-95",
          "data-[state=open]:opacity-100 data-[state=open]:scale-100 motion-safe:data-[state=open]:animate-fade-scale-strong",
          panelClassName,
        ].join(" ")}
      >
        <div className="p-1" role="none">
          {children}
        </div>
      </div>
    </div>
  );
}
