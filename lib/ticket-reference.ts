import { randomBytes } from 'node:crypto'

export function generateTicketRef(): string {
  const year = String(new Date().getFullYear()).slice(-2)
  const random = randomBytes(10).toString('hex').toUpperCase()
  return `KAMP-${year}-${random}`
}
