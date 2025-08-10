import { Link, useLocation } from "react-router-dom";
import BooksMenu from "./BooksMenu";
import type { BookItem } from "./BooksMenu";
import ShopMenu from "./ShopMenu";
import type { LinkItem as ShopLink } from "./ShopMenu";
import MoreMenu from "./MoreMenu";
import type { LinkItem as MoreLink } from "./MoreMenu";

const navLinkBase =
  "inline-flex items-center gap-1 px-3 py-2 rounded-lg text-nav hover:text-navHover focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

type Props = {
  series: BookItem[];
  standalones: BookItem[];
  settings: {
    storeLink?: ShopLink | null;
    shopLinks?: ShopLink[] | null;
    moreLinks?: MoreLink[] | null;
  } | null;
  isActive: (path: string) => boolean;
};

export default function DesktopNav({ series, standalones, settings, isActive }: Props) {
  const { pathname } = useLocation();
  const booksActive = pathname.startsWith("/books") || pathname.startsWith("/series");

  return (
    <ul className="hidden lg:flex ml-auto items-center gap-6">
      {/* Home */}
      <li className="list-none">
        <Link
          to="/"
          className={[navLinkBase, isActive("/") ? "font-semibold text-navAccent" : ""].join(" ")}
          aria-current={isActive("/") ? "page" : undefined}
        >
          Home
        </Link>
      </li>

      {/* Author (singleton) */}
      <li className="list-none">
        <Link
          to="/about"
          className={[navLinkBase, isActive("/about") ? "font-semibold text-navAccent" : ""].join(" ")}
          aria-current={isActive("/about") ? "page" : undefined}
        >
          Author
        </Link>
      </li>

      {/* Books (hover open) */}
      <BooksMenu
        series={series}
        standalones={standalones}
        openOnHover
        triggerActive={booksActive}
      />

      {/* Shop (hover open) */}
      <ShopMenu
        storeLink={settings?.storeLink}
        shopLinks={settings?.shopLinks || []}
        openOnHover
      />

      {/* More (hover open) */}
      <MoreMenu
        links={settings?.moreLinks || []}
        openOnHover
      />

      {/* Contact */}
      <li className="list-none">
        <Link
          to="/contact"
          className={[navLinkBase, isActive("/contact") ? "font-semibold text-navAccent" : ""].join(" ")}
          aria-current={isActive("/contact") ? "page" : undefined}
        >
          Contact
        </Link>
      </li>
    </ul>
  );
}
