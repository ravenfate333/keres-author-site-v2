import {
  FaAmazon,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaYoutube,
  FaGoodreads,
  FaPinterest,
  FaGlobe,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

export type Platform =
  | 'amazon'
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'twitter'
  | 'youtube'
  | 'goodreads'
  | 'pinterest'
  | 'globe';

export const iconMap: Record<Platform, IconType> = {
  amazon: FaAmazon,
  facebook: FaFacebook,
  instagram: FaInstagram,
  tiktok: FaTiktok,
  twitter: FaTwitter,
  youtube: FaYoutube,
  goodreads: FaGoodreads,
  pinterest: FaPinterest,
  globe: FaGlobe,
};
