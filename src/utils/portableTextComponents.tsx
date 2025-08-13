import type { PortableTextComponents } from '@portabletext/react';

export const customPortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4">{children}</p>,
    h1: ({ children }) => <h1 className="text-4xl font-bold mb-6">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold mt-5 mb-2">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc ps-5 space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal ps-5 space-y-1">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = (value?.href as string) || '#';
      const external = href.startsWith('http');
      return (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="underline underline-offset-2"
        >
          {children}
        </a>
      );
    },
  },
};
