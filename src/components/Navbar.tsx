import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import sanityClient from '../sanityClient';

// TODO FIX STORE SHOWING UP UNDER MORE DROP DOWN
// Two ideas: Rename more to Shop and allow multiple shop links + "duplicate" for true more
// OR undo nesting  

interface NavSettings {
  storeLink?: { label: string; url: string };
  moreLinks?: { label: string; url: string }[];
}
interface BookLinkItem {
  type: 'series' | 'book';
  label: string;
  slug: string;
}

const isExternal = (url: string) => /^https?:\/\//i.test(url);

export default function Navbar() {
  const [openNav, setOpenNav] = React.useState(false);
  const [hideOnMobile, setHideOnMobile] = React.useState(false);
  const [openBooks, setOpenBooks] = React.useState(false); // desktop Books
  const [openStandalones, setOpenStandalones] = React.useState(false); // desktop nested
  const [openMore, setOpenMore] = React.useState(false); // desktop More

  const [navSettings, setNavSettings] = React.useState<NavSettings | null>(null);
  const [series, setSeries] = React.useState<BookLinkItem[]>([]);
  const [standalones, setStandalones] = React.useState<BookLinkItem[]>([]);
  const location = useLocation();

  // Hardcoded order
  const mainLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
  ];
  // Sanity Handled Books page is rendered in between these links on site
  /* const afterBooksLinks = [
    { label: "Trigger Warnings", href: "/trigger-warnings" },
    { label: "Contact", href: "/contact" },
  ]; */

  React.useEffect(() => {
    const query = `
    {
      "settings": *[_type == "navigation" && _id == "singleton-navigation"][0]{ storeLink, moreLinks },
      "series": *[_type == "series"] | order(title asc){
        "type": "series", "label": title, "slug": slug.current
      },
      "standalones": *[_type == "book" && !defined(series)] | order(title asc){
        "type": "book", "label": title, "slug": slug.current
      }
    }`;

    let cancelled = false;

    sanityClient.fetch(query).then((data) => {
      if (cancelled) return;
      setNavSettings(data?.settings ?? null);
      setSeries(data?.series ?? []);
      setStandalones(data?.standalones ?? []);
    });

    const onResize = () => {
      if (window.innerWidth >= 1024) setOpenNav(false);
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Close mobile panel on route change
  React.useEffect(() => {
    setOpenNav(false);
  }, [location.pathname]);

  // Close desktop popovers on outside click / Esc
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest('[data-popover=books]')) setOpenBooks(false);
      if (!el.closest('[data-popover=standalones]')) setOpenStandalones(false);
      if (!el.closest('[data-popover=more]')) setOpenMore(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenBooks(false);
        setOpenStandalones(false);
        setOpenMore(false);
      }
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Auto-hide on mobile: scroll down = hide, scroll up/top = show
  React.useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const isMobile = window.innerWidth < 1024; // lg breakpoint

        if (isMobile && !openNav) {
          const goingDown = y > lastY && y > 10; // small threshold to ignore micro scroll
          const nearTop = y < 4;

          if (nearTop) setHideOnMobile(false);
          else setHideOnMobile(goingDown);
        } else {
          // Always show on desktop or when menu is open
          setHideOnMobile(false);
        }

        lastY = y;
        ticking = false;
      });
    };

    const onResize = () => setHideOnMobile(false);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [openNav, setHideOnMobile]);

  return (
    <nav
      data-navbar-root
      className={[
        'fixed top-0 z-50 w-full border-b border-gray-200 bg-white/70 backdrop-blur-md shadow-sm',
        'dark:border-gray-800 dark:bg-gray-900/70',
        'transition-transform duration-300 will-change-transform',
        hideOnMobile ? '-translate-y-full lg:translate-y-0' : 'translate-y-0',
      ].join(' ')}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 lg:px-8">
        {/* Brand */}
        <Link to="/" className="py-1.5 text-base font-semibold text-gray-900 dark:text-white">
          Beronika Keres
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-6 lg:flex">
          {/* Home / About */}
          {mainLinks.map(({ label, href }) => (
            <li key={label}>
              <Link
                className="p-1 text-sm text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white"
                to={href}
              >
                {label}
              </Link>
            </li>
          ))}

          {/* Books (desktop dropdown with nested Standalones) */}
          <li className="relative" data-popover="books">
            <button
              type="button"
              className="flex items-center gap-1 p-1 text-sm text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white"
              aria-expanded={openBooks}
              onClick={(e) => {
                e.stopPropagation();
                setOpenBooks((v) => !v);
                setOpenMore(false);
              }}
            >
              Books
              <svg
                className={`h-4 w-4 transition ${openBooks ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" />
              </svg>
            </button>

            {openBooks && (
              <div
                role="menu"
                className="absolute left-0 top-full z-20 mt-2 min-w-[16rem] rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <Link
                  role="menuitem"
                  className="block rounded px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                  to="/books"
                >
                  All Books
                </Link>

                {series.length > 0 && (
                  <>
                    <div className="px-3 pt-2 pb-1 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                      Series
                    </div>
                    {series.map(({ label, slug }) => (
                      <Link
                        key={`series-${slug}`}
                        role="menuitem"
                        to={`/series/${slug}`}
                        className="block rounded px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        {label}
                      </Link>
                    ))}
                  </>
                )}

                {standalones.length > 0 && (
                  <div className="relative mt-1" data-popover="standalones">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                      aria-expanded={openStandalones}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenStandalones((v) => !v);
                      }}
                    >
                      Standalones
                      <svg
                        className={`h-4 w-4 transition ${openStandalones ? 'rotate-90' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M7.21 14.77a.75.75 0 01-.02-1.06L10.94 10 7.19 6.29a.75.75 0 011.06-1.06l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-.02z" />
                      </svg>
                    </button>

                    {openStandalones && (
                      <div
                        role="menu"
                        className="absolute left-full top-0 z-30 ml-2 min-w-[14rem] rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                      >
                        {standalones.map(({ label, slug }) => (
                          <Link
                            key={`standalone-${slug}`}
                            role="menuitem"
                            to={`/books/${slug}`}
                            className="block rounded px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            {label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </li>

          {/* Trigger Warnings */}
          <li>
            <Link
              className="p-1 text-sm text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white"
              to="/trigger-warnings"
            >
              Trigger Warnings
            </Link>
          </li>

          {/* More (store + moreLinks) */}
          {(navSettings?.storeLink?.url || (navSettings?.moreLinks?.length ?? 0) > 0) && (
            <li className="relative" data-popover="more">
              <button
                type="button"
                className="flex items-center gap-1 p-1 text-sm text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white"
                aria-expanded={openMore}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMore((v) => !v);
                  setOpenBooks(false);
                  setOpenStandalones(false);
                }}
              >
                More
                <svg
                  className={`h-4 w-4 transition ${openMore ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" />
                </svg>
              </button>

              {openMore && (
                <div
                  role="menu"
                  className="absolute left-0 top-full z-20 mt-2 min-w-[14rem] rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  {navSettings?.storeLink?.url && (
                    <a
                      role="menuitem"
                      className="block rounded px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                      href={navSettings.storeLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {navSettings.storeLink.label || 'Store'}
                    </a>
                  )}
                  {(navSettings?.moreLinks ?? []).map(({ label, url }) =>
                    isExternal(url) ? (
                      <a
                        key={`more-${label}`}
                        role="menuitem"
                        className="block rounded px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        key={`more-${label}`}
                        role="menuitem"
                        className="block rounded px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                        to={url}
                      >
                        {label}
                      </Link>
                    ),
                  )}
                </div>
              )}
            </li>
          )}

          {/* Contact */}
          <li>
            <Link
              className="p-1 text-sm text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white"
              to="/contact"
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={openNav}
          onClick={() => setOpenNav((v) => !v)}
          className="ml-auto h-6 w-6 text-gray-900 dark:text-gray-100 lg:hidden"
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile panel */}
      {openNav && (
        <div className="mx-auto max-w-7xl px-4 pb-3 lg:hidden">
          <div className="flex flex-col gap-1 py-2">
            {mainLinks.map(({ label, href }) => (
              <Link
                key={label}
                to={href}
                onClick={() => setOpenNav(false)}
                className="py-2 text-sm text-gray-800 dark:text-gray-100"
              >
                {label}
              </Link>
            ))}

            {/* Books accordion */}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-sm text-gray-800 dark:text-gray-100">
                <span>Books</span>
                <svg
                  className="h-4 w-4 transition group-open:rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" />
                </svg>
              </summary>
              <div className="ml-3 flex flex-col">
                <Link to="/books" onClick={() => setOpenNav(false)} className="py-2 text-sm">
                  All Books
                </Link>

                {series.length > 0 && (
                  <>
                    <div className="pt-1 pb-1 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                      Series
                    </div>
                    {series.map(({ label, slug }) => (
                      <Link
                        key={`m-series-${slug}`}
                        to={`/series/${slug}`}
                        onClick={() => setOpenNav(false)}
                        className="py-2 text-sm"
                      >
                        {label}
                      </Link>
                    ))}
                  </>
                )}

                {standalones.length > 0 && (
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-sm">
                      <span>Standalones</span>
                      <svg
                        className="h-4 w-4 transition group-open:rotate-180"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M7.21 14.77a.75.75 0 01-.02-1.06L10.94 10 7.19 6.29a.75.75 0 011.06-1.06l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-.02z" />
                      </svg>
                    </summary>
                    <div className="ml-3 flex flex-col">
                      {standalones.map(({ label, slug }) => (
                        <Link
                          key={`m-standalone-${slug}`}
                          to={`/books/${slug}`}
                          onClick={() => setOpenNav(false)}
                          className="py-2 text-sm"
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </details>

            <Link to="/trigger-warnings" onClick={() => setOpenNav(false)} className="py-2 text-sm">
              Trigger Warnings
            </Link>

            {(navSettings?.storeLink?.url || (navSettings?.moreLinks?.length ?? 0) > 0) && (
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-sm">
                  <span>More</span>
                  <svg
                    className="h-4 w-4 transition group-open:rotate-180"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" />
                  </svg>
                </summary>
                <div className="ml-3 flex flex-col">
                  {navSettings?.storeLink?.url && (
                    <a
                      href={navSettings.storeLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 text-sm"
                      onClick={() => setOpenNav(false)}
                    >
                      {navSettings.storeLink.label || 'Store'}
                    </a>
                  )}
                  {(navSettings?.moreLinks ?? []).map(({ label, url }) =>
                    isExternal(url) ? (
                      <a
                        key={`m-more-${label}`}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 text-sm"
                        onClick={() => setOpenNav(false)}
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        key={`m-more-${label}`}
                        to={url}
                        className="py-2 text-sm"
                        onClick={() => setOpenNav(false)}
                      >
                        {label}
                      </Link>
                    ),
                  )}
                </div>
              </details>
            )}

            <Link to="/contact" onClick={() => setOpenNav(false)} className="py-2 text-sm">
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
