import Dropdown from './Dropdown';

export type LinkItem = { label: string; url: string };
type Props = {
  storeLink?: LinkItem | null;
  shopLinks?: LinkItem[] | null;
  openOnHover?: boolean;
};

const navLinkBase =
  'inline-flex items-center gap-1 px-3 py-2 rounded-lg text-nav hover:text-navHover focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40';
const itemClass =
  'block rounded-lg px-3 py-2 hover:bg-white/10 focus-visible:bg-white/15 focus:outline-none';

export default function ShopMenu({ storeLink = null, shopLinks = [], openOnHover = false }: Props) {
  const list = (shopLinks ?? []).filter(Boolean);
  const hasAny = !!storeLink || list.length > 0;

  // If there’s exactly one shop destination (storeLink) and no extra links, make it a direct link.
  if (storeLink && list.length === 0) {
    return (
      <li className="list-none">
        <a href={storeLink.url} target="_blank" rel="noopener noreferrer" className={navLinkBase}>
          {storeLink.label || 'Shop'}
        </a>
      </li>
    );
  }

  // Otherwise render a dropdown immediately; hydrate content when data arrives.
  return (
    <li className="list-none">
      <Dropdown label="Shop" buttonClassName={navLinkBase} openOnHover={openOnHover}>
        {hasAny ? (
          <>
            {storeLink && (
              <a
                role="menuitem"
                className={itemClass}
                href={storeLink.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {storeLink.label || 'Shop'}
              </a>
            )}
            {list.map((l, i) => (
              <a
                key={`${l.url}-${i}`}
                role="menuitem"
                className={itemClass}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label}
              </a>
            ))}
          </>
        ) : (
          <div className="px-3 py-2 text-sm/6 opacity-60">Loading…</div>
        )}
      </Dropdown>
    </li>
  );
}
