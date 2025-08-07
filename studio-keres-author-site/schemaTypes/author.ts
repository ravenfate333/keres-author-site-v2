import { defineField, defineType } from "sanity";

export default defineType({
    name: 'author',
    title: 'Author Page',
    type: 'document',
    fields: [
        defineField({
            name: 'author',
            title: 'Author Name',
            description: 'Your author name or pen name.',
            type: 'string',
        }),
        defineField({
            name: 'image',
            title: 'Author Image',
            type: 'image',
            options: {
                hotspot: true, // Enables cropping
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alt Text',
                    description: 'Short description of the image for screen readers.',
                },
            ],
        }),
        defineField({
            name: 'bio',
            title: 'Biography',
            type: 'array',
            of: [{ type: 'block' }], // Creates rich text editor for formatting
        }),
    ],

})