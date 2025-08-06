import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'genre',
  title: 'Genre',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'The name of the genre (e.g., Dark Fantasy, Thriller)',
      type: 'string',
    }),
    defineField({
        name: 'slug',
        title: 'URL Slug',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 96,
        },
      }),
  ],
})