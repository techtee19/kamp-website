// Starting budgets absorb a few hundred users on campus Wi-Fi while account
// and challenge limits independently protect individual verification codes.
export const minute = 60_000
export const resendSeconds = 60
export const challengeAttempts = 5
export const accountVerificationAttempts = 15
export const accountVerificationWindow = 30 * minute
export const accountSendLimit = 5
export const accountSendWindow = 60 * minute

export function networkLimit(key: string, fallback: number) {
  const value = Number(process.env[key])
  return Number.isSafeInteger(value) && value > 0 ? value : fallback
}
