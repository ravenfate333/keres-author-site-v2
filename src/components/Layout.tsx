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

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-white pt-[var(--nav-height)]">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
