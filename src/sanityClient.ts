import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// ========================
// 🔧 Development Settings
// ========================
console.log('Sanity Token Loaded:', import.meta.env.VITE_SANITY_TOKEN ? 'Yes' : 'No');

// ========================
// ⚙️  Sanity Client Config
// ========================
const client = createClient({
  projectId: '092fr38x',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: import.meta.env.VITE_SANITY_TOKEN,
  ignoreBrowserTokenWarning: true,
  perspective: 'drafts',
});

// ========================
// 🛠️  Utility Builders (e.g. Image URLs)
// ========================
const builder = imageUrlBuilder(client);
export const urlFor = (source: any) => builder.image(source);

export default client;
