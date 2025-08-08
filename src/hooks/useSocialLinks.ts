import { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';
import { SOCIAL_LINKS_QUERY } from '../lib/queries';
import type { PlatformId } from '../../shared/platforms';

export interface SocialLink {
  platform: PlatformId;
  url: string;
  enabled?: boolean; // make optional
  ariaLabel?: string;
}

export function useSocialLinks(): SocialLink[] {
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    let cancelled = false;

    sanityClient.fetch<{ links?: SocialLink[] }>(SOCIAL_LINKS_QUERY).then((data) => {
      console.log('SOCIAL_LINKS_QUERY →', data); // check browser console
      if (!cancelled) setLinks(data?.links ?? []);
    });

    return () => {
      cancelled = true; // avoid setState on unmounted component
    };
  }, []);

  return links;
}
