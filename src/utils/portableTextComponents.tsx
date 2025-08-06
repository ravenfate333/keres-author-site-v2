import type { PortableTextComponents } from '@portabletext/react';

// Define all custom styles for rich text
export const customPortableTextComponents: PortableTextComponents = {
  block: {
    // This style will apply to all default paragraph blocks
    normal: ({children}) => <p className="mb-4">{children}</p>,
    
    // TODO: Add more styles here later, for example for headings
    // h1: ({children}) => <h1 className="text-4xl font-bold mb-6">{children}</h1>,
  },
};