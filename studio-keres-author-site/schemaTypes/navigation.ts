import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'navigation',
  title: 'Main Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'storeLink',
      title: 'Store Link',
      description: 'Add a URL here to make the "Store" link appear in the main navigation. Leave it blank to hide it.',
      type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Label', type: 'string', initialValue: 'Store' }),
        defineField({ name: 'url', title: 'URL', type: 'url' }),
      ]
    }),
    defineField({
        name: 'moreLinks',
        title: '"More" Dropdown Links',
        description: 'Add any extra links you want to appear in a "More" dropdown menu. The dropdown will not appear if this list is empty.',
        type: 'array',
        of: [{
          type: 'object',
          name: 'customLink',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ]
        }]
      }),
  ],
})