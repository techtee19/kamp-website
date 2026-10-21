import { createHash, randomBytes } from 'node:crypto'

export function createCommunityLinkToken(): string {
  return randomBytes(32).toString('base64url')
}

export function hashCommunityLinkToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function isCommunityLinkToken(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{43}$/.test(value)
}

export function getWhatsAppCommunityLink(): string {
  const configuredLink = process.env.WHATSAPP_COMMUNITY_LINK?.trim()
  return configuredLink && /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9_-]+$/.test(configuredLink)
    ? configuredLink
    : 'https://chat.whatsapp.com/I7tSURUiRsW2n0bch1vza8'
}

export function createTrackedCommunityUrl(token: string, origin: string): string {
  const url = new URL('/community/join', origin)
  url.hash = token
  return url.toString()
}

export function getSiteOrigin(requestOrigin: string): string {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (process.env.NODE_ENV === 'development') {
    if (configuredOrigin) {
      try {
        const parsed = new URL(configuredOrigin)
        if ((parsed.protocol === 'https:' || parsed.protocol === 'http:') && !parsed.username && !parsed.password) return parsed.origin
      } catch {
        console.error('NEXT_PUBLIC_SITE_URL is not a valid absolute URL; using the request origin.')
      }
    }
    return new URL(requestOrigin).origin
  }

  // VERCEL_URL is a deployment-specific hostname, so production member emails
  // should always use KAMP's canonical domain instead of a *.vercel.app URL.
  if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
    return 'https://wearekamp.org'
  }

  if (configuredOrigin) {
    try {
      const parsed = new URL(configuredOrigin)
      if ((parsed.protocol === 'https:' || parsed.protocol === 'http:') && !parsed.username && !parsed.password) return parsed.origin
    } catch {
      console.error('NEXT_PUBLIC_SITE_URL is not a valid absolute URL; using the deployment origin.')
    }
  }

  const deploymentHost = process.env.VERCEL_URL?.trim()
  if (deploymentHost && /^[A-Za-z0-9.-]+(?::\d+)?$/.test(deploymentHost)) return `https://${deploymentHost}`
  return 'https://wearekamp.org'
}
