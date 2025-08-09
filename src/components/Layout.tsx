import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useEffect } from 'react';

const Layout = () => {
  useEffect(() => {
    const navEl = document.querySelector('nav[data-navbar-root]') as HTMLElement | null;
    if (!navEl) return;

    const measure = () => {
      const h = navEl.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--nav-height', `${h}px`);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(navEl);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-white pt-[var(--nav-height)]">
      {/* Skip to content (visible on keyboard focus) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100]
                   focus:rounded-md focus:bg-gray-900 focus:text-white focus:px-3 focus:py-2"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
