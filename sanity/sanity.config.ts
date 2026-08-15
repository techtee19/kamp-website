import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'kamp-studio',
  title: 'KAMP Studio',
  // Required because the Studio is mounted at /studio rather than the domain
  // root. Without it the router treats `studio` as the tool name and renders
  // "Tool not found: studio" instead of the desk.
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [
    structureTool(),
    visionTool(), // GROQ query explorer — useful during dev
  ],
  schema: {
    types: schemaTypes,
  },
})
