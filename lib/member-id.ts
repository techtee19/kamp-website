export type MembershipCategory = 'student' | 'professional' | 'non_professional'

const CATEGORY_CODES: Record<MembershipCategory, string> = {
  student: 'STU',
  professional: 'PRO',
  non_professional: 'NPR',
}

/** Generate a category-coded member ID using the shared annual sequence. */
export function createMemberId(category: MembershipCategory, year: number, sequence: number): string {
  const code = CATEGORY_CODES[category]
  if (!code || !Number.isInteger(year) || !Number.isInteger(sequence) || sequence < 1 || sequence > 99_999) {
    throw new Error('Invalid member ID components.')
  }
  return `KAMP-${code}-${year}-${String(sequence).padStart(5, '0')}`
}

/** Accept historical IDs as well as the current category-coded format. */
export function isMemberId(value: string): boolean {
  return /^KAMP-(?:(?:MBR|STU|PRO|NPR)-\d{4}-\d{5}|(?:FND|COF)-\d{4}-001|BRD-\d{4}-(?:00[1-9]|01[0-5]))$/.test(value)
}
