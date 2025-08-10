import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import sanityClient from '../../sanityClient';
import { NAVBAR_QUERY } from '../../lib/navigation';

import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

import type { BookItem } from './BooksMenu';
import type { LinkItem as ShopLink } from './ShopMenu';
import type { LinkItem as MoreLink } from './MoreMenu';

type Settings = {
  storeLink?: ShopLink | null;
  shopLinks?: ShopLink[] | null;
  moreLinks?: MoreLink[] | null;
};

export default function Navbar() {
  const location = useLocation();

  const [settings, setSettings] = useState<Settings | null>(null);
  const [series, setSeries] = useState<BookItem[]>([]);
  const [standalones, setStandalones] = useState<BookItem[]>([]);
  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await sanityClient.fetch(NAVBAR_QUERY);
        if (cancelled) return;
        setSettings(data?.settings ?? null);
        setSeries(data?.series ?? []);
        setStandalones(data?.standalones ?? []);
      } catch (err) {
        console.error('[Navbar] fetch failed', err);
      }
    })();

    // Close mobile if resized up to desktop
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpenMobile(false);
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpenMobile(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-nav-bg/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:py-4">
        {/* TODO LOGO */}
        <Link to="/" className="text-xl font-semibold text-navHover">
          Beronika Keres
        </Link>

        {/* Desktop nav */}
        <DesktopNav
          series={series}
          standalones={standalones}
          settings={settings}
          isActive={isActive}
        />

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={openMobile}
          onClick={() => setOpenMobile((v) => !v)}
          className="ml-auto lg:hidden text-navHover"
        >
          <span className="relative block h-6 w-6">
            {/* Hamburger */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`absolute inset-0 h-6 w-6 motion-safe:transition-all motion-reduce:transition-none ${
                openMobile ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>

            {/* X */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`absolute inset-0 h-6 w-6 motion-safe:transition-all motion-reduce:transition-none ${
                openMobile ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </button>
      </div>

      {/* Mobile panel */}
      <MobileNav
        open={openMobile}
        onOpenChange={setOpenMobile}
        series={series}
        standalones={standalones}
        settings={settings}
      />
    </nav>
  );
}
