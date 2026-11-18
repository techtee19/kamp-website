import { after } from 'next/server'

/** Evaluate the PDF and mail worker only after the registration response. */
export function scheduleRegistrationEmail(jobId: string) {
  after(async () => {
    try {
      const { tryRegistrationEmail } = await import('@/lib/registration-email')
      await tryRegistrationEmail(jobId)
    } catch {
      // The transaction already stored the job for the next worker invocation.
      console.error('[registration-email] Could not start worker', { jobId })
    }
  })
}
