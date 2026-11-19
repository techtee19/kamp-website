export const MAX_SUPPORT_IMAGES = 3
export const MAX_SUPPORT_IMAGE_BYTES = 2 * 1024 * 1024
export type SupportImage = { filename: string; contentType: 'image/png' | 'image/jpeg'; content: string }

export function supportImageFilename(filename: string, contentType: SupportImage['contentType']) {
  const stem = (filename.split(/[\\/]/).pop() ?? '').replace(/\.[^.]*$/, '')
    .replace(/[^a-zA-Z0-9 _.-]/g, '_').slice(0, 80).trim() || 'screenshot'
  return `${stem}.${contentType === 'image/png' ? 'png' : 'jpg'}`
}
