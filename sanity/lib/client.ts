import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

// Keep deployment builds safe when the Sanity environment has not been configured.
export const client = projectId
  ? createClient({
      projectId,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
      apiVersion: '2024-01-01',
      useCdn: process.env.NODE_ENV === 'production',
    })
  : null

// Use the Content Lake API for event reads that must reflect an editor's latest
// publish immediately. The CDN can serve a recently cached event after Next has
// regenerated a page.
export const freshClient = client?.withConfig({ useCdn: false }) ?? null
