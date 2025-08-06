// This file defines a 'book' schema for Sanity.io for unique book objects to be created by the author/user. 

import { defineField, defineType } from 'sanity'
import InheritedGenres from '../inputs/InheritedGenres'

export default defineType({
    name: 'book',
    title: 'Book',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            description: 'e.g., Cracked Coffins #1',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'URL Slug',
            type: 'slug',
            options: {
                source: 'title', // Auto-generate from the title
                maxLength: 96,
            },
            validation: Rule => Rule.required(), // Make it required
        }),
        defineField({
            name: 'bookNumber',
            title: 'Book Number (optional)',
            description: 'The number in the series, if applicable.',
            type: 'number',
        }),
        defineField({
            name: 'bookNumberLabel',
            title: 'Book Number Label',
            description: 'The text that appears before the number (e.g., Book, Part, Volume). Defaults to "Book".',
            type: 'string',
            // Dropdown with an option for a custom value
            options: {
                list: [
                    { title: 'Book', value: 'Book' },
                    { title: 'Part', value: 'Part' },
                    { title: 'Volume', value: 'Volume' },
                ],
                layout: 'radio' // or 'dropdown'
            },
            // Default value
            initialValue: 'Book'
        }),
        defineField({
            name: 'series',
            title: 'Series',
            type: 'reference',
            to: { type: 'series' }, // This links it to the 'series' type
        }),
        defineField({
            name: 'inheritedGenres',
            title: 'Inherited Genres',
            type: 'string', // The type doesn't matter, it's just for display
            components: {
                field: InheritedGenres, // Tell Sanity to use React component for this field
            },
            hidden: ({ document }) => !document?.series, // Only show this if a series is selected!
        }),
        defineField({
            name: 'genres',
            title: 'Genres',
            description: "Add any book-specific genres here. Main series genres are added automatically, so you don't need to add them again.",
            type: 'array',
            of: [{ type: 'reference', to: { type: 'genre' } }] // Array of genres
        }),
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
            options: {
                hotspot: true, // This lets you crop the image nicely
            },
        }),
        defineField({
            name: 'blurb',
            title: 'Blurb',
            type: 'array',
            of: [{ type: 'block' }], // Creates rich text editor for formatting
        }),
        defineField({
            name: 'retailerButtons',
            title: 'Retailer Links',
            type: 'array',
            of: [{
                type: 'object',
                name: 'retailerLink',
                fields: [
                    { name: 'label', title: 'Label (e.g., Amazon USA)', type: 'string' },
                    { name: 'link', title: 'Link (URL)', type: 'url' }
                ]
            }]
        }),
        defineField({
            name: 'themeColor',
            title: 'Theme Color',
            description: 'The background color for this book\'s section on the series page.',
            type: 'color'
        })
    ],
})