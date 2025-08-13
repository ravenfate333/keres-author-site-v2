import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { BookItem } from './BooksMenu';
import type { LinkItem as ShopLink } from './ShopMenu';
import type { LinkItem as MoreLink } from './MoreMenu';

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  series: BookItem[];
  standalones: BookItem[];
  settings: {
    storeLink?: ShopLink | null;
    shopLinks?: ShopLink[] | null;
    moreLinks?: MoreLink[] | null;
  } | null;
};

const itemClass =
  'block rounded-lg px-3 py-2 text-nav hover:text-navHover hover:bg-white/10 focus:bg-white/15 focus:outline-none';

export default function MobileNav({ open, onOpenChange, series, standalones, settings }: Props) {
  // Lock/unlock background scroll when mobile menu is open
  useEffect(() => {
    const el = document.documentElement;
    if (open) el.classList.add('overflow-hidden');
    else el.classList.remove('overflow-hidden');
    return () => el.classList.remove('overflow-hidden');
  }, [open]);

  return (
    <div
      id="mobile-nav"
      data-state={open ? 'open' : 'closed'}
      className={[
        // match desktop bar tokens
        'lg:hidden border-t border-white/10 bg-nav-bg/70 text-nav backdrop-blur',
        // slide open/closed
        'transition-[max-height,opacity] duration-200 ease-out overflow-hidden',
        open ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0',
      ].join(' ')}
    >
      <div className="px-4 py-3 space-y-1">
        {/* Author (singleton) */}
        <Link to="/about" className={itemClass} onClick={() => onOpenChange(false)}>
          Author
        </Link>

        {/* Books */}
        <details className="group/books">
          <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 focus:outline-none">
            <span>Books</span>
            {/* independent chevron for Books */}
            <svg
              className="h-4 w-4 shrink-0 inline-block opacity-80 motion-safe:transition-transform group-open/books:rotate-180"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
            </svg>
          </summary>

          <div className="ml-1 pl-2 space-y-1">
            {/* All Books */}
            <Link to="/books" className={itemClass} onClick={() => onOpenChange(false)}>
              All Books
            </Link>

            {/* Series → /series/:slug */}
            {series.map((s) => (
              <Link
                key={`m-series-${s.slug}`}
                to={`/series/${s.slug}`}
                onClick={() => onOpenChange(false)}
                className={itemClass}
              >
                {s.label}
              </Link>
            ))}

            {/* Standalones → /books/:slug */}
            {standalones.length > 0 && (
              <details className="group/standalones">
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 focus:outline-none">
                  <span>Standalones</span>
                  {/* independent chevron for Standalones */}
                  <svg
                    className="h-4 w-4 shrink-0 inline-block opacity-80 motion-safe:transition-transform group-open/standalones:rotate-180"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M7.21 14.77a.75.75 0 01.02-1.06L11 10 7.23 6.29a.75.75 0 111.06-1.06l4.24 4.24a.75.75 0 010 1.06l-4.24 4.24a.75.75 0 01-1.08 0z" />
                  </svg>
                </summary>
                <div className="ml-1 pl-2 space-y-1">
                  {standalones.map((b) => (
                    <Link
                      key={`m-standalone-${b.slug}`}
                      to={`/books/${b.slug}`}
                      onClick={() => onOpenChange(false)}
                      className={itemClass}
                    >
                      {b.label}
                    </Link>
                  ))}
                </div>
              </details>
            )}
          </div>
        </details>

        {/* Content Warnings */}
        <Link to="/content-warnings" className={itemClass} onClick={() => onOpenChange(false)}>
          Content Warnings
        </Link>

        <Link to="/faq" className={itemClass} onClick={() => onOpenChange(false)}>
          FAQ
        </Link>

        {/* Shop */}
        {settings?.storeLink && !(settings?.shopLinks && settings.shopLinks.length > 0) ? (
          <a
            href={settings.storeLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className={itemClass}
            onClick={() => onOpenChange(false)}
          >
            {settings.storeLink.label || 'Shop'}
          </a>
        ) : (
          (settings?.shopLinks?.length || 0) > 0 && (
            <details className="group/shop">
              <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 focus:outline-none">
                <span>Shop</span>
                <svg
                  className="h-4 w-4 shrink-0 inline-block opacity-80 motion-safe:transition-transform group-open/shop:rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                </svg>
              </summary>
              <div className="ml-1 pl-2 space-y-1">
                {settings?.storeLink && (
                  <a
                    href={settings.storeLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={itemClass}
                    onClick={() => onOpenChange(false)}
                  >
                    {settings.storeLink.label || 'Shop'}
                  </a>
                )}
                {(settings?.shopLinks || []).map((l, i) => (
                  <a
                    key={`${l.url}-${i}`}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={itemClass}
                    onClick={() => onOpenChange(false)}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </details>
          )
        )}

        {/* More */}
        {(settings?.moreLinks?.length || 0) > 0 && (
          <details className="group/more">
            <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 focus:outline-none">
              <span>More</span>
              <svg
                className="h-4 w-4 shrink-0 inline-block opacity-80 motion-safe:transition-transform group-open/more:rotate-180"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </summary>
            <div className="ml-1 pl-2 space-y-1">
              {(settings?.moreLinks || []).map((l, i) => (
                <a
                  key={`${l.url}-${i}`}
                  href={l.url}
                  className={itemClass}
                  onClick={() => onOpenChange(false)}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </details>
        )}

        {/* Contact */}
        <Link to="/contact" className={itemClass} onClick={() => onOpenChange(false)}>
          Contact
        </Link>
      </div>
    </div>
  );
}
