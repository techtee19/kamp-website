import { defineArrayMember, defineField, defineType } from 'sanity'

export const eventSchema = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Event Date & Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'university',
      title: 'Host University',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Venue / Address',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'theme',
      title: 'Event Theme',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          description: 'Describe the image for accessibility',
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'capacity',
      title: 'Max Capacity (leave blank for unlimited)',
      type: 'number',
    }),
    defineField({
      name: 'status',
      title: 'Event Status',
      type: 'string',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'Ongoing', value: 'ongoing' },
          { title: 'Past', value: 'past' },
        ],
        layout: 'radio',
      },
      initialValue: 'upcoming',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'galleryImages',
      title: 'Post-Event Gallery Images',
      description:
        'Select all the photos on your computer, then drag the whole selection onto this field — they upload as one batch. Pasting images works too. Drag a thumbnail to reorder.',
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
    }),
  ],
  orderings: [
    {
      title: 'Event Date, Newest First',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'university', media: 'coverImage' },
  },
})
