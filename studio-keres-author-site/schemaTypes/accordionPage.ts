import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'accordionPage',
  title: 'Accordion Page',
  type: 'document',
  fields: [
    defineField({
      name: 'intro',
      title: 'Intro / Overview',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Optional intro text above the accordion. Supports headings, lists, links, etc.',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        defineField({
          name: 'section',
          title: 'Section',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Display Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
              description:
                "Shown in the accordion button (can be long, e.g. 'Cracked Coffins (Series Book 1)').",
            }),
            defineField({
              name: 'anchorTitle',
              title: 'Permalink Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
              description: "Short/clean title used to generate the slug, e.g. 'Cracked Coffins'.",
            }),
            defineField({
              name: "slug",
              title: "Slug",
              type: "slug",
              options: {
                // In array items, read from the sibling via `parent`
                // Return a string (never undefined) to satisfy TS
                source: (_doc, { parent }) =>
                  ((parent as { anchorTitle?: string })?.anchorTitle ?? ""),
                slugify: (input: string) =>
                  (input || "")
                    .toLowerCase()
                    .normalize("NFKD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, "")
                    .slice(0, 96),
                maxLength: 96,
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'array',
              of: [{type: 'block'}],
              description:
                'Full rich text for this section. Supports bullet lists, bold, links, etc.',
            }),
          ],
          preview: {
            select: {title: 'title', slug: 'slug.current'},
            prepare: ({title, slug}) => ({
              title: title || '<Untitled>',
              subtitle: slug ? `#${slug}` : 'No slug',
            }),
          },
        }),
      ],
    }),

    defineField({
      name: 'isEnabled',
      title: 'Enable Page',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})
