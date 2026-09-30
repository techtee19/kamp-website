import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const plugins = [structureTool(), visionTool()]

export default defineConfig([
  {
    name: 'kamp-content',
    title: 'KAMP Content',
    basePath: '/studio',
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    plugins,
    schema: { types: schemaTypes.filter((type) => type.name !== 'member') },
  },
  {
    name: 'kamp-members',
    title: 'KAMP Members (Private)',
    basePath: '/studio/members',
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_MEMBERS_DATASET ?? 'members-private',
    plugins: [structureTool()],
    schema: { types: [schemaTypes.find((type) => type.name === 'member')!] },
  },
])
