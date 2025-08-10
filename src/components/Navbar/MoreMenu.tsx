import Dropdown from "./Dropdown";

export type LinkItem = { label: string; url: string };
type Props = { links?: LinkItem[] | null; openOnHover?: boolean };

const navLinkBase =
  "inline-flex items-center gap-1 px-3 py-2 rounded-lg text-nav hover:text-navHover focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40";
const itemClass =
  "block rounded-lg px-3 py-2 hover:bg-white/10 focus-visible:bg-white/15 focus:outline-none";

export default function MoreMenu({ links = [], openOnHover = false }: Props) {
  const list = (links ?? []).filter(Boolean);
  const hasAny = list.length > 0;

  // Always render the trigger to avoid layout shift.
  return (
    <li className="list-none">
      <Dropdown label="More" buttonClassName={navLinkBase} openOnHover={openOnHover}>
        {hasAny ? (
          list.map((l, i) => (
            <a key={`${l.url}-${i}`} role="menuitem" className={itemClass} href={l.url} target="_blank"
            rel="noopener noreferrer">
              {l.label}
            </a>
          ))
        ) : (
          <div className="px-3 py-2 text-sm/6 opacity-60">Loading…</div>
        )}
      </Dropdown>
    </li>
  );
}
