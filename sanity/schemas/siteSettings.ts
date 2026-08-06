import { defineField, defineType } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton — only one document of this type should exist
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'KAMP',
    }),
    defineField({
      name: 'missionStatement',
      title: 'Mission Statement / Hero Tagline',
      type: 'text',
      rows: 2,
    }),
    defineField({ name: 'contactEmail', title: 'Contact Email', type: 'string' }),
    defineField({ name: 'contactPhone', title: 'Contact Phone', type: 'string' }),
    defineField({ name: 'officeAddress', title: 'Office Address', type: 'text', rows: 3 }),
    defineField({ name: 'instagramUrl', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url' }),
    defineField({
      name: 'donationCTA',
      title: 'Donate Button Label',
      type: 'string',
      initialValue: "Support a student's future",
    }),
    defineField({
      name: 'impactStats',
      title: 'Impact Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Value', type: 'string' }, // e.g. "10,000+"
            { name: 'label', title: 'Label', type: 'string' }, // e.g. "Youths Impacted"
          ],
        },
      ],
    }),
  ],
})
