import {defineField, defineType} from 'sanity'
import { featureFlags } from '../../src/utils/featureFlags'

export default defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
    }),
    defineField({
      name: 'showGenreSorter',
      title: 'Show Genre Sorter on All Books Page',
      description: 'If enabled, a tool to sort books by genre will appear on the "All Books" page.',
      type: 'boolean',
      // The field will be hidden from the Sanity Studio
      // if the `enableGenreSorter` flag is false.
      hidden: !featureFlags.enableGenreSorter,
      initialValue: true, // Default to 'on' when the feature is enabled
    }),
  ],
})