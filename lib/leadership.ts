export const LEADERSHIP_ROLES = {
  founder: { code: 'FND', label: 'Founder', maximum: 1 },
  co_founder: { code: 'COF', label: 'Co-Founder', maximum: 1 },
  board_member: { code: 'BRD', label: 'Board Member', maximum: 15 },
} as const

export type LeadershipRole = keyof typeof LEADERSHIP_ROLES

export function isLeadershipRole(value: unknown): value is LeadershipRole {
  return typeof value === 'string' && Object.hasOwn(LEADERSHIP_ROLES, value)
}

export function createLeadershipMemberId(role: LeadershipRole, year: number, sequence: number): string {
  const roleInfo = LEADERSHIP_ROLES[role]
  if (!Number.isInteger(year) || !Number.isInteger(sequence) || sequence < 1 || sequence > roleInfo.maximum) {
    throw new Error('Invalid leadership member ID components.')
  }
  return `KAMP-${roleInfo.code}-${year}-${String(sequence).padStart(3, '0')}`
}

export function isLeadershipInviteToken(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{43}$/.test(value)
}
