import { useEffect, useState } from 'react';
import AccordionPage from '../components/AccordionPage';
import sanityClient from '../sanityClient';
import { ACCORDION_PAGE_QUERY } from '../lib/accordionPage';
import { customPortableTextComponents } from '../utils/portableTextComponents';
import type { TypedObject } from '@portabletext/types';
import type { AccordionPageData, AccordionSection } from '../types/accordion';

export default function ContentWarningsPage() {
  const [data, setData] = useState<AccordionPageData | null>(null);

  useEffect(() => {
    sanityClient
      .fetch(ACCORDION_PAGE_QUERY, { id: 'singleton-contentWarnings' })
      .then(setData)
      .catch((err) => {
        console.error('CW fetch failed:', err);
        const fallback: AccordionPageData = {
          isEnabled: false,
          intro: [] as TypedObject[],
          sections: [] as AccordionSection[],
        };
        setData(fallback);
      });
  }, []);

  if (!data) return <div className="py-16 text-center">Loading…</div>;

  return (
    <AccordionPage
      title="Content Warnings"
      data={data}
      anchorPrefix="cw"
      // allowMultipleOpen
      portableTextComponents={customPortableTextComponents}
    />
  );
}
