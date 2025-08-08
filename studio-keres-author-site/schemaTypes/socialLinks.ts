import { defineType, defineField } from 'sanity';
import { PLATFORMS, PLATFORM_OPTIONS, type PlatformId } from '../../shared/platforms';

export default defineType({
  name: 'socialLinks',
  title: 'Social Links',
  type: 'document',
  description:
    'Add and reorder your social links. These will appear site-wide wherever social links are displayed.',

  // Auto‑seed all platforms once when the doc is created
  initialValue: () => ({
    links: PLATFORMS
      .filter(p => p.id !== 'custom') // skip the generic "custom" row by default (optional)
      .map(p => ({
        platform: p.id,
        url: '',
        enabled: false,
        ariaLabel: '', // leave empty so frontend uses the fallback aria label
      })),
  }),

  fields: [
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: { list: PLATFORM_OPTIONS },
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'ariaLabel',
              title: 'ARIA Label (optional)',
              type: 'string',
              description: 'Screen-reader text; if blank, a default is used.',
            }),
            defineField({
              name: 'enabled',
              title: 'Enabled',
              type: 'boolean',
              description: 'Uncheck to hide without deleting.',
              initialValue: true, // field-level default when adding new rows manually
            }),
          ],
          preview: {
            select: { platform: 'platform', url: 'url' },
            prepare({ platform, url }: { platform?: PlatformId; url?: string }) {
              const match = PLATFORMS.find(p => p.id === platform) ?? PLATFORMS.find(p => p.id === 'custom');
              return {
                title: match?.label ?? 'Unknown Platform',
                subtitle: url ?? '',
                media: match?.Icon,
              };
            },
          },
        },
      ],
      options: { sortable: true },
    }),
  ],

  preview: {
    select: { links: 'links' },
    prepare({ links }: { links?: unknown[] }) {
      return {
        title: 'Social Links',
        subtitle: `${links?.length ?? 0} links configured`,
      };
    },
  },
});
