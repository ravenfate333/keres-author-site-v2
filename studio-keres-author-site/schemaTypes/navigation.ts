import React from 'react';
import { defineType, defineField, defineArrayMember } from 'sanity';
import { FaBars, FaShoppingCart, FaLink } from 'react-icons/fa';

export default defineType({
  name: 'navigation',
  title: 'Main Navigation',
  type: 'document',
  icon: FaBars, // neutral menu icon for the document type

  fields: [
    defineField({
      name: 'storeLink',
      title: 'Single Shop Link (optional)',
      description:
        'Use this if you only sell in one place. If you also add “Shop Links” below, all links are shown together in the nav.',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'label', title: 'Label', type: 'string', initialValue: 'Shop' }),
        defineField({ name: 'url', title: 'URL', type: 'url' }),
      ],
      preview: {
        select: { title: 'label', url: 'url' },
        prepare: ({ title, url }) => ({
          title: title || 'Shop',
          subtitle: url || '',
          media: () => React.createElement(FaShoppingCart),
        }),
      },
    }),

    defineField({
      name: 'shopLinks',
      title: 'Shop Links',
      description: 'Add one or more storefront links (Etsy, Poshmark, Audible, etc.).',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'shopLink',
          title: 'Shop Link',
          type: 'object',
          icon: FaShoppingCart,
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
          preview: {
            select: { title: 'label', url: 'url' },
            prepare: ({ title, url }) => ({
              title: title || 'Shop link',
              subtitle: url || '',
              media: () => React.createElement(FaShoppingCart),
            }),
          },
        }),
      ],
    }),

    defineField({
      name: 'moreLinks',
      title: '"More" Dropdown Links',
      description: 'Extra links that are NOT storefronts.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'customLink',
          title: 'Custom Link',
          type: 'object',
          icon: FaLink,
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
          preview: {
            select: { title: 'label', url: 'url' },
            prepare: ({ title, url }) => ({
              title: title || 'Link',
              subtitle: url || '',
              media: () => React.createElement(FaLink),
            }),
          },
        }),
      ],
    }),
  ],

  // Universal, compact doc-level preview
  preview: {
    select: {
      storeLabel: 'storeLink.label',
      storeUrl: 'storeLink.url',
      shops: 'shopLinks',
      mores: 'moreLinks',
    },
    prepare({ storeLabel, storeUrl, shops, mores }) {
      const shopArr = Array.isArray(shops) ? shops : [];
      const moreArr = Array.isArray(mores) ? mores : [];
      const shopCount = (storeUrl ? 1 : 0) + shopArr.length;
      const moreCount = moreArr.length;

      // Title stays generic so the doc is clearly “Main Navigation”
      const title = 'Main Navigation';

      // Helpful summary; if exactly one shop, show its label
      const singleShopLabel =
        shopCount === 1 ? (storeLabel || shopArr[0]?.label || 'Shop') : undefined;

      const parts = [
        `Shop: ${shopCount}`,
        `More: ${moreCount}`,
        singleShopLabel ? `• ${singleShopLabel}` : null,
      ].filter(Boolean);

      const subtitle = parts.join(' ');

      return {
        title,
        subtitle,
        media: () => React.createElement(FaBars),
      };
    },
  },
});
