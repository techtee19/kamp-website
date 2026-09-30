import { defineField, defineType } from 'sanity'

export const memberSchema = defineType({
  name: 'member',
  title: 'KAMP Member',
  type: 'document',
  fields: [
    defineField({ name: 'memberId', title: 'Member ID', type: 'string', readOnly: true }),
    defineField({ name: 'firstName', title: 'First name', type: 'string', readOnly: true }),
    defineField({ name: 'lastName', title: 'Last name', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', readOnly: true }),
    defineField({ name: 'university', title: 'University', type: 'string', readOnly: true }),
    defineField({ name: 'gender', title: 'Gender', type: 'string', readOnly: true }),
    defineField({ name: 'stateOfOrigin', title: 'State of origin', type: 'string', readOnly: true }),
    defineField({ name: 'studyLevel', title: 'Study level', type: 'string', readOnly: true }),
    defineField({ name: 'whyJoin', title: 'Why they joined', type: 'text', readOnly: true }),
    defineField({ name: 'status', title: 'Status', type: 'string', readOnly: true }),
    defineField({ name: 'yearJoined', title: 'Year joined', type: 'number', readOnly: true }),
    defineField({ name: 'joinedAt', title: 'Joined at', type: 'datetime', readOnly: true }),
  ],
  preview: {
    select: { title: 'memberId', subtitle: 'firstName' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: `Member — ${subtitle ?? ''}` }),
  },
})
