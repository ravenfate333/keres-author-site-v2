import { PLATFORMS } from '../../shared/platforms';
import { useSocialLinks } from '../hooks/useSocialLinks';

interface SocialLinksProps {
  size?: number;
  gap?: string;
  mode?: 'mono' | 'brand';
}

export default function SocialLinks({ size = 24, gap = 'gap-3', mode = 'mono' }: SocialLinksProps) {
  const links = useSocialLinks();

  return (
    <div className={`flex ${gap}`}>
      {links.filter(l => l.enabled !== false).map((link, i) => {
        const platformData =
          PLATFORMS.find(p => p.id === link.platform) || PLATFORMS.find(p => p.id === 'custom');
        if (!platformData) return null;

        const Icon = platformData.Icon;
        const colorClass =
          mode === 'brand' && platformData.brandColor ? '' : 'text-gray-500 hover:text-gray-900';
        const inlineColor =
          mode === 'brand' && platformData.brandColor ? { color: platformData.brandColor } : undefined;

        return (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.ariaLabel || `Visit ${platformData.label} (opens in new tab)`}
            className={colorClass}
            style={inlineColor}
          >
            <Icon size={size} />
          </a>
        );
      })}
    </div>
  );
}
