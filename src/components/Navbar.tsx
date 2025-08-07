import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import sanityClient from '../sanityClient';

// --- Define the shapes of our fetched data ---
interface NavSettings {
  storeLink?: { label: string; url: string; };
  moreLinks?: { label: string; url:string; }[];
}
interface BookLinkItem {
  type: 'series' | 'book';
  label: string;
  slug: string;
}

// --- Main Navbar Component ---
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State for the CMS-driven parts of the nav
  const [navSettings, setNavSettings] = useState<NavSettings | null>(null);
  const [bookLinks, setBookLinks] = useState<BookLinkItem[]>([]);

  // --- Hard-coded main navigation links ---
  const mainLinks = [
    { label: 'HOME', href: '/' },
    { label: 'ABOUT', href: '/about' },
    // { label: 'Contact', href: '/contact' },
  ];

  // --- Fetch all dynamic data in one go ---
  useEffect(() => {
    const query = `
      {
        "settings": *[_type == "navigation" && _id == "navigation"][0]{ storeLink, moreLinks },
        "series": *[_type == "series"]{ "type": _type, "label": title, "slug": slug.current },
        "standalones": *[_type == "book" && !defined(series)]{ "type": _type, "label": title, "slug": slug.current }
      }
    `;
    
    sanityClient.fetch(query).then(data => {
      setNavSettings(data.settings);
      
      // Combine series and standalones for the "Books" dropdown
      const combinedBookLinks = [...(data.series || []), ...(data.standalones || [])];
      setBookLinks(combinedBookLinks);
    });
  }, []);

  return (
    <header className="bg-red-800/80 sticky top-0 z-50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        {/* Author Name / Logo */}
        <a href="/" className="-m-1.5 p-1.5 text-white font-bold text-xl">
          Beronika Keres
        </a>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white" onClick={() => setMobileMenuOpen(true)}>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* --- DESKTOP MENU (New Logic) --- */}
        <div className="hidden md:flex md:gap-x-12 items-center">
          {/* 1. Hard-coded Links */}
          {mainLinks.map((item) => (
            <Link key={item.label} to={item.href} className="text-sm font-semibold leading-6 text-white">
              {item.label}
            </Link>
          ))}
          
          {/* 2. Conditional "Store" Link */}
          {navSettings?.storeLink?.url && (
             <a href={navSettings.storeLink.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold leading-6 text-white">
                {navSettings.storeLink.label}
             </a>
          )}
          
          {/* 3. Automatic "Books" Dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-white">
              BOOKS
              <ChevronDownIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
            </Menu.Button>
            <Transition as="div" enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
              <Menu.Items className="absolute -right-8 top-full z-10 mt-3 w-56 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-900/5">
                <Menu.Item>
                  <Link to="/books" className="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                    All Books
                  </Link>
                </Menu.Item>
                {bookLinks.map((item) => (
                  <Menu.Item key={item.label}>
                    <Link to={`/${item.type === 'series' ? 'series' : 'books'}/${item.slug}`} className="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                      {item.label}
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>

          {/* 4. Dynamic "More" Dropdown */}
          {navSettings?.moreLinks && navSettings.moreLinks.length > 0 && (
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-white">
                MORE
                <ChevronDownIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
              </Menu.Button>
              <Transition as="div" enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
                <Menu.Items className="absolute -right-8 top-full z-10 mt-3 w-56 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-900/5">
                  {navSettings.moreLinks.map((item) => (
                    <Menu.Item key={item.label}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                        {item.label}
                      </a>
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>
      </nav>

      {/* --- MOBILE MENU DRAWER  --- */}
    </header>
  );
};

export default Navbar;