import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import type { AccordionPageData } from "../types/accordion";

interface Props {
  title: string;
  data: AccordionPageData;
  anchorPrefix: "cw" | "faq";
  allowMultipleOpen?: boolean;
  portableTextComponents?: PortableTextComponents;
  /** Optional user override to disable animation even if system allows motion */
  disableAnimation?: boolean;
}

export default function AccordionPage({
  title,
  data,
  anchorPrefix,
  allowMultipleOpen = false,
  portableTextComponents,
  disableAnimation = false,
}: Props) {
  const sections = data?.sections ?? [];
  const [openSlugs, setOpenSlugs] = useState<string[]>(() => []);
  const headerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const reducedMotion = usePrefersReducedMotion() || disableAnimation;

  // keep refs array length in sync with sections
  useEffect(() => {
    headerRefs.current.length = sections.length;
  }, [sections.length]);

  // open based on hash on initial mount
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash || "").replace("#", "");
    if (!hash) return;
    const slug = hash.startsWith(`${anchorPrefix}-`)
      ? hash.slice(anchorPrefix.length + 1)
      : null;
    if (!slug) return;
    if (sections.some((s) => s.slug === slug)) {
      setOpenSlugs([slug]);
      const el = document.getElementById(`${anchorPrefix}-${slug}`);
      if (el) {
        el.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    }
  }, [anchorPrefix, sections, reducedMotion]);

  const toggle = (slug: string) => {
    setOpenSlugs((prev) => {
      const isOpen = prev.includes(slug);
      let next: string[];
      if (allowMultipleOpen) {
        next = isOpen ? prev.filter((s) => s !== slug) : [...prev, slug];
      } else {
        next = isOpen ? [] : [slug];
      }
      if (next.length === 1) {
        history.replaceState(null, "", `#${anchorPrefix}-${next[0]}`);
      } else {
        history.replaceState(null, "", " ");
      }
      return next;
    });
  };

  function onHeaderKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, idx: number) {
    const key = e.key;
    const last = sections.length - 1;

    if (key === " " || key === "Enter") {
      e.preventDefault();
      const slug = sections[idx]?.slug;
      if (slug) toggle(slug);
      return;
    }

    if (key === "ArrowDown" || key === "ArrowUp" || key === "Home" || key === "End") {
      e.preventDefault();
      let next = idx;
      if (key === "ArrowDown") next = idx === last ? 0 : idx + 1;
      if (key === "ArrowUp") next = idx === 0 ? last : idx - 1;
      if (key === "Home") next = 0;
      if (key === "End") next = last;
      headerRefs.current[next]?.focus();
    }
  }

  const isEmpty = (v: any) => !v || (Array.isArray(v) && v.length === 0);

  if (!data || data.isEnabled === false || (isEmpty(data.intro) && isEmpty(data.sections))) {
    return <div className="py-16 text-center">This page isn’t available.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      {!isEmpty(data.intro) && (
        <div className="prose dark:prose-invert mb-6">
          <PortableText value={data.intro ?? []} components={portableTextComponents} />
        </div>
      )}

      <div id={`${anchorPrefix}-accordion`} data-accordion="collapse">
        {sections.map((section, idx) => {
          const slug = section.slug || `section-${idx}`;
          const isOpen = openSlugs.includes(slug);
          const headingId = `${anchorPrefix}-heading-${slug}`;
          const panelId = `${anchorPrefix}-panel-${slug}`;
          const anchorId = `${anchorPrefix}-${slug}`;
          const isDisabled = !section.body || section.body.length === 0;

          return (
            <div key={slug} id={anchorId} className="group">
              <h2 id={`${headingId}-wrap`} role="heading" aria-level={2}>
                <button
                  id={headingId}
                  ref={(el) => {
                    headerRefs.current[idx] = el;
                  }}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-disabled={isDisabled || undefined}
                  disabled={isDisabled}
                  onClick={() => {
                    if (!isDisabled) toggle(slug);
                  }}
                  onKeyDown={(e) => onHeaderKeyDown(e, idx)}
                  className={[
                    "scroll-mt-24", // adjust to match sticky header height
                    "flex items-center justify-between w-full p-5 font-medium",
                    "text-gray-700 dark:text-gray-200",
                    "border border-gray-200 dark:border-gray-700",
                    isOpen ? "bg-white dark:bg-zinc-900" : "bg-white/95 dark:bg-zinc-900/95",
                    "hover:bg-gray-50 dark:hover:bg-zinc-800",
                    "gap-3",
                    "focus:outline-none focus:ring-0",
                    "focus-visible:ring-2 focus-visible:ring-gray-300 dark:focus-visible:ring-gray-600",
                    isDisabled ? "opacity-60 cursor-not-allowed" : "",
                  ].join(" ")}
                >
                  <span>{section.title}</span>
                  <svg
                    data-accordion-icon
                    className={`w-3 h-3 shrink-0 transform transition-transform ${
                      isOpen ? "rotate-0" : "rotate-180"
                    }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </h2>

              <AccordionPanel
                id={panelId}
                headingId={headingId}
                isOpen={isOpen}
                reducedMotion={reducedMotion}
              >
                {/* Announce newly revealed content without stealing focus */}
                <div className="prose dark:prose-invert" aria-live={isOpen ? "polite" : undefined}>
                  <PortableText value={section.body ?? []} components={portableTextComponents} />
                </div>
              </AccordionPanel>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Animated height wrapper for panels */
function AccordionPanel({
  id,
  headingId,
  isOpen,
  reducedMotion,
  children,
}: {
  id: string;
  headingId: string;
  isOpen: boolean;
  reducedMotion: boolean;
  children: ReactNode;
}) {
  const { outerRef, innerRef } = useAutoHeight(isOpen, reducedMotion);

  return (
    <div
      id={id}
      role="region"
      aria-labelledby={headingId}
      aria-hidden={!isOpen}
      ref={outerRef}
      className={
        reducedMotion
          ? "h-0 overflow-hidden"
          : "h-0 overflow-hidden transition-[height] duration-500 ease-out"
      }
    >
      <div
        ref={innerRef}
        className="p-5 border-x border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900"
      >
        {children}
      </div>
    </div>
  );
}

/** Measure & animate height (0 <-> content) */
function useAutoHeight(isOpen: boolean, reducedMotion: boolean) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    if (reducedMotion) {
      outer.style.height = isOpen ? "auto" : "0px";
      return;
    }

    const toAutoAfter = () => {
      if (isOpen) outer.style.height = "auto";
      outer.removeEventListener("transitionend", toAutoAfter);
    };

    if (isOpen) {
      // opening: lock current -> next frame to target -> set auto after transition
      outer.style.height = `${outer.getBoundingClientRect().height || 0}px`;
      const target = inner.getBoundingClientRect().height;
      requestAnimationFrame(() => {
        outer.style.height = `${target}px`;
      });
      outer.addEventListener("transitionend", toAutoAfter);
    } else {
      // closing: lock to current px, then -> 0 next frame
      const current = outer.getBoundingClientRect().height;
      outer.style.height = `${current}px`;
      requestAnimationFrame(() => {
        outer.style.height = "0px";
      });
    }
  }, [isOpen, reducedMotion]);

  return { outerRef, innerRef };
}

/* Respect user motion preference */
function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  const mqlRef = useRef<MediaQueryList | null>(null);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    mqlRef.current = mql;
    const listener = (e: MediaQueryListEvent) => setPrefers(e.matches);
    setPrefers(mql.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);
  return prefers;
}
