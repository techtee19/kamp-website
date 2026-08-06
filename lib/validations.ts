import { z } from 'zod'

// ── Registration ──────────────────────────────────────────────
export const registrationSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  eventTitle: z.string().min(1, 'Event title is required'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
  university: z.string().min(2, 'University name is required'),
  studyLevel: z.enum(['100L', '200L', '300L', '400L', '500L', 'Postgrad', 'Other'], {
    error: () => ({ message: 'Please select a valid study level' }),
  }),
})
export type RegistrationInput = z.infer<typeof registrationSchema>

// ── Donation ──────────────────────────────────────────────────
export const donationSchema = z.object({
  donorName: z.string().min(2, 'Please enter your name'),
  donorEmail: z.email('Please enter a valid email address'),
  amountNgn: z
    .number({ error: 'Amount must be a number' })
    .min(100, 'Minimum donation is ₦100'),
  donationType: z.enum(['one_time', 'recurring']),
  message: z.string().max(500).optional(),
})
export type DonationInput = z.infer<typeof donationSchema>

// ── Contact ───────────────────────────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})
export type ContactInput = z.infer<typeof contactSchema>
