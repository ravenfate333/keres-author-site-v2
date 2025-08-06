// This file defines a 'series' schema for Sanity.io for unique series objects to be created by the author/user. 
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'series',
  title: 'Book Series',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Series Title',
      description: 'e.g., The Cracked Coffins Series',
      type: 'string',
    }),
    defineField({
      name: 'genres',
      title: 'Series Genres',
      description: 'The main genres that apply to the entire series.',
      type: 'array',
      of: [{type: 'reference', to: {type: 'genre'}}]
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      description: 'A unique, URL-friendly version of the title (e.g., cracked-coffins). Click "Generate".',
      type: 'slug',
      options: {
        source: 'title', // Auto-generates from the title field
        maxLength: 96,
      },
    }),
    // Add more fields here later, like a series description!
  ],
})