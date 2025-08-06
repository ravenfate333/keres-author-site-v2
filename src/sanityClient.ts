import {createClient} from '@sanity/client'

export default createClient({
  projectId: '092fr38x',
  dataset: 'production',
  useCdn: false, // 'false' if you want to ensure fresh data or 'true' for deployment
  apiVersion: '2023-05-03', // use UTC date in YYYY-MM-DD format
})