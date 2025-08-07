import {createClient} from '@sanity/client'

console.log('Sanity Token Loaded:', import.meta.env.VITE_SANITY_TOKEN ? 'Yes' : 'No');

export default createClient({
  projectId: '092fr38x',
  dataset: 'production',
  useCdn: false, // 'false' if you want to ensure fresh data or 'true' for deployment
  apiVersion: '2023-05-03', // use UTC date in YYYY-MM-DD format
  token: import.meta.env.VITE_SANITY_TOKEN, // Read the token from the .env file
  ignoreBrowserTokenWarning: true, // Recommended for client-side fetching

  perspective: 'previewDrafts',
})