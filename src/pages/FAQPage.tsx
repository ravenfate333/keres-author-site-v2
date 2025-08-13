import { useEffect, useState } from 'react';
import AccordionPage from '../components/AccordionPage';
import type { TypedObject } from '@portabletext/types';
import sanityClient from '../sanityClient';
import { ACCORDION_PAGE_QUERY } from '../lib/accordionPage';
import { customPortableTextComponents } from '../utils/portableTextComponents';
import type { AccordionPageData, AccordionSection } from "../types/accordion";

export default function FAQPage() {
  const [data, setData] = useState<AccordionPageData | null>(null);

  useEffect(() => {
    sanityClient
      .fetch(ACCORDION_PAGE_QUERY, { id: "singleton-faq" })
      .then(setData)
      .catch((err) => {
        console.error("FAQ fetch failed:", err);
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
      title="Frequently Asked Questions"
      data={data}
      anchorPrefix="faq"
      portableTextComponents={customPortableTextComponents}
    />
  );
}
