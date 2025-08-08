// Source for handling all social media links and styling
import {
  FaInstagram,
  FaFacebook,
  FaXTwitter,
  FaTiktok,
  FaYoutube,
  FaTwitch,
  FaGoodreads,
  FaAmazon,
  FaBook,
  FaThreads,
  FaBluesky,
  FaPinterest,
  FaTumblr,
  FaLinkedin,
  FaGlobe,
  FaLink,
} from 'react-icons/fa6';

export type PlatformId =
  | 'instagram'
  | 'facebook'
  | 'x'
  | 'tiktok'
  | 'youtube'
  | 'twitch'
  | 'goodreads'
  | 'amazon'
  | 'bookbub'
  | 'threads'
  | 'bluesky'
  | 'pinterest'
  | 'tumblr'
  | 'linkedin'
  | 'website'
  | 'custom';

export interface Platform {
  id: PlatformId;
  label: string; // human-readable
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  brandColor?: string;
}

// One list to rule them all
export const PLATFORMS: Platform[] = [
  { id: 'instagram', label: 'Instagram', Icon: FaInstagram, brandColor: '#E4405F' },
  { id: 'facebook',  label: 'Facebook',  Icon: FaFacebook,  brandColor: '#1877F2' },
  { id: 'x',         label: 'X (Twitter)', Icon: FaXTwitter, brandColor: '#000000' },
  { id: 'tiktok',    label: 'TikTok',    Icon: FaTiktok,    brandColor: '#000000' },
  { id: 'youtube',   label: 'YouTube',   Icon: FaYoutube,   brandColor: '#FF0000' },
  { id: 'twitch',    label: 'Twitch',    Icon: FaTwitch,    brandColor: '#9146FF' },
  { id: 'goodreads', label: 'Goodreads', Icon: FaGoodreads, brandColor: '#553b08' },
  { id: 'amazon',    label: 'Amazon',    Icon: FaAmazon,    brandColor: '#FF9900' },
  { id: 'bookbub',   label: 'BookBub',   Icon: FaBook,      brandColor: '#E60023' },
  { id: 'threads',   label: 'Threads',   Icon: FaThreads,   brandColor: '#000000' },
  { id: 'bluesky',   label: 'Bluesky',   Icon: FaBluesky,   brandColor: '#0085FF' },
  { id: 'pinterest', label: 'Pinterest', Icon: FaPinterest, brandColor: '#E60023' },
  { id: 'tumblr',    label: 'Tumblr',    Icon: FaTumblr,    brandColor: '#35465C' },
  { id: 'linkedin',  label: 'LinkedIn',  Icon: FaLinkedin,  brandColor: '#0077B5' },
  { id: 'website',   label: 'Website',   Icon: FaGlobe },
  { id: 'custom',    label: 'Custom Link', Icon: FaLink },
];

// Handy helper for Sanity dropdowns
export const PLATFORM_OPTIONS = PLATFORMS.map(p => ({ title: p.label, value: p.id }));
