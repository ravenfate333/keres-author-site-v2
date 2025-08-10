import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Dropdown from "./Dropdown";

export type BookItem = { type: "series" | "book"; label: string; slug: string };

type Props = {
  series?: BookItem[];
  standalones?: BookItem[];
  openOnHover?: boolean;   // enable hover to open the top-level Books dropdown
  triggerActive?: boolean; // tint the “Books” trigger when on /books or /series
};

const BOOK_ROUTE_BASE = "/books";
const SERIES_ROUTE_BASE = "/series";

const navLinkBase =
  "inline-flex items-center gap-1 px-3 py-2 rounded-lg text-nav hover:text-navHover focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40";
const itemClass =
  "block rounded-lg px-3 py-2 hover:bg-white/10 focus-visible:bg-white/15 focus:outline-none";

export default function BooksMenu({
  series = [],
  standalones = [],
  openOnHover = false,
  triggerActive = false,
}: Props) {
  const [openStandalones, setOpenStandalones] = useState(false);
  const location = useLocation();
  const hoverTimer = useRef<number | null>(null);

  // Close the Standalones flyout on route change
  useEffect(() => {
    setOpenStandalones(false);
  }, [location.pathname]);

  const triggerClass = [
    navLinkBase,
    triggerActive ? "font-semibold text-navAccent" : "",
  ].join(" ");

  return (
    <li className="relative list-none">
      <Dropdown
        label="Books"
        buttonClassName={triggerClass}
        openOnHover={openOnHover}
        onOpenChange={(o) => {
          // If parent dropdown closes, also close the flyout
          if (!o) setOpenStandalones(false);
        }}
      >
        {/* All Books */}
        <Link role="menuitem" to={BOOK_ROUTE_BASE} className={itemClass}>
          All Books
        </Link>

        {/* Series */}
        {series.length > 0 && (
          <div role="none" className="mb-1">
            <div className="px-3 py-2 text-sm/6 opacity-80">Series</div>
            <ul role="none">
              {series.map((s) => (
                <li role="none" key={`series-${s.slug}`}>
                  <Link
                    to={`${SERIES_ROUTE_BASE}/${s.slug}`}
                    role="menuitem"
                    className={itemClass}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Standalones trigger + flyout */}
        {standalones.length > 0 && (
          <div
            role="none"
            className="relative"
            onMouseEnter={() => {
              if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
              setOpenStandalones(true);
            }}
            onMouseLeave={() => {
              hoverTimer.current = window.setTimeout(() => setOpenStandalones(false), 120);
            }}
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={openStandalones}
              aria-controls="menu-standalones"
              onClick={() => setOpenStandalones((v) => !v)}
              className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <span>Standalones</span>
              <svg
                className={`ml-2 h-4 w-4 transition-transform ${openStandalones ? "rotate-90" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M7.21 14.77a.75.75 0 01.02-1.06L11 10 7.23 6.29a.75.75 0 111.06-1.06l4.24 4.24a.75.75 0 010 1.06l-4.24 4.24a.75.75 0 01-1.08 0z" />
              </svg>
            </button>

            <div
              id="menu-standalones"
              role="menu"
              data-state={openStandalones ? "open" : "closed"}
              className={[
                "absolute left-full top-0 z-40 min-w-[14rem] rounded-lg bg-nav-bg/95 text-navHover p-1 shadow-lg backdrop-blur border border-white/10",
                "origin-left transform-gpu will-change-[opacity,transform] transition duration-200 ease-out",
                "data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0 data-[state=closed]:-translate-x-1 data-[state=closed]:scale-95",
                "data-[state=open]:opacity-100 data-[state=open]:translate-x-0 data-[state=open]:scale-100 motion-safe:data-[state=open]:animate-fade-scale-strong",
              ].join(" ")}
            >
              <ul role="none">
                {standalones.map((b) => (
                  <li role="none" key={`standalone-${b.slug}`}>
                    <Link
                      to={`${BOOK_ROUTE_BASE}/${b.slug}`}
                      role="menuitem"
                      className={itemClass}
                      onClick={() => setOpenStandalones(false)}
                    >
                      {b.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Dropdown>
    </li>
  );
}
