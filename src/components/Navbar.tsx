import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

// --- Data navigation ---
const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/about', label: 'ABOUT THE AUTHOR' },
  { href: '/contact', label: 'CONTACT' },
];

const bookLinks = [
  { href: '/books', label: 'All Books' },
  { href: '/series/cracked-coffins-series', label: 'The Cracked Coffins Series' },
];

// --- Main Navbar Component ---
const Navbar = () => {
  // State to manage the mobile menu's open/closed status
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-red-800/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        {/* Author Name / Logo TODO: STYLIZE BETTER */}
        <a href="/" className="-m-1.5 p-1.5 text-white font-bold text-xl">
          Beronika Keres
        </a>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop Menu (hidden on mobile) */}
        <div className="hidden md:flex md:gap-x-12">
          {navLinks.map((item) => (
            <Link key={item.label} to={item.href} className="text-sm font-semibold leading-6 text-white">
              {item.label}
            </Link>
          ))}
          {/* Desktop Dropdown TODO: ADDRESS DEPRECATED WARNING BELOW */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-white">
              BOOKS
              <ChevronDownIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
            </Menu.Button>
            <Transition
              as="div"
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Menu.Items className="absolute -right-8 top-full z-10 mt-3 w-56 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-900/5">
                {bookLinks.map((item) => (
                  <Menu.Item key={item.label}>
                    <Link
                      to={item.href}
                      className="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                    >
                      {item.label}
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </nav>

      {/* Mobile Menu Drawer (Dialog) */}
      <Dialog as="div" className="md:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5 text-white font-bold">
              Beronika Keres
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                  >
                    {item.label}
                  </Link>
                ))}
                {/* Mobile Dropdown Links */}
                 <p className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white">BOOKS</p>
                 <div className="pl-4">
                    {bookLinks.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-400 hover:bg-gray-800"
                      >
                        {item.label}
                      </Link>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Navbar;