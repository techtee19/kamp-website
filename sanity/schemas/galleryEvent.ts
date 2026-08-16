import { defineArrayMember, defineField, defineType } from 'sanity'

export const galleryEventSchema = defineType({
  name: 'galleryEvent',
  title: 'Gallery Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Event Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'university',
      title: 'University',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'theme', title: 'Theme', type: 'string' }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'recap', title: 'Recap Text', type: 'text', rows: 4 }),
    defineField({
      name: 'coverImage',
      title: 'Cover / Thumbnail Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photos',
      title: 'Photo Album',
      description: 'Upload multiple photos at once by selecting all files together',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'caption',
              title: 'Caption (optional)',
              type: 'string',
            }),
            defineField({
              name: 'alt',
              title: 'Alt text',
              description: 'Describe the image for accessibility',
              type: 'string',
            }),
          ],
        }),
      ],
      // Grid shows thumbnails instead of a stacked list; reordering is still drag-and-drop.
      options: { layout: 'grid' },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (YouTube / Instagram)',
      type: 'url',
    }),
    defineField({
      name: 'pressLinks',
      title: 'Press Mentions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'outlet', title: 'Publication', type: 'string' },
            { name: 'headline', title: 'Headline', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'university', media: 'coverImage' },
  },
})
