import { z } from 'zod'

// ── Registration ──────────────────────────────────────────────
export const registrationSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required').max(128, 'Invalid event ID'),
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(120, 'Name is too long'),
  email: z.string().trim().max(254, 'Email address is too long').pipe(z.email('Please enter a valid email address')),
  phone: z
    .string()
    .trim()
    .min(10, 'Phone number must be at least 10 digits')
    .max(24, 'Phone number is too long')
    .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
  university: z.string().trim().min(2, 'University name is required').max(160, 'University name is too long'),
  studyLevel: z.enum(['100L', '200L', '300L', '400L', '500L', 'Postgrad', 'Other'], {
    error: () => ({ message: 'Please select a valid study level' }),
  }),
})
export type RegistrationInput = z.infer<typeof registrationSchema>

// ── Donation ──────────────────────────────────────────────────
export const donationSchema = z.object({
  donorName: z.string().trim().min(2, 'Please enter your name').max(120, 'Name is too long'),
  donorEmail: z.string().trim().max(254, 'Email address is too long').pipe(z.email('Please enter a valid email address')),
  amountNgn: z
    .number({ error: 'Amount must be a number' })
    .finite('Amount must be finite')
    .min(100, 'Minimum donation is ₦100')
    .max(21_474_836.47, 'Donation amount is too large')
    .refine((amount) => Number.isSafeInteger(Math.round(amount * 100)), 'Donation amount must use valid naira and kobo precision'),
  donationType: z.enum(['one_time', 'recurring']),
  message: z.string().trim().max(500, 'Message is too long').optional(),
})
export type DonationInput = z.infer<typeof donationSchema>

// ── Contact ───────────────────────────────────────────────────
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120, 'Name is too long'),
  email: z.string().trim().max(254, 'Email address is too long').pipe(z.email('Please enter a valid email address')),
  subject: z.string().trim().min(3, 'Subject is required').max(160, 'Subject is too long').regex(/^[^\r\n]+$/, 'Subject must be one line'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000, 'Message is too long'),
})
export type ContactInput = z.infer<typeof contactSchema>

// ── Membership ────────────────────────────────────────────────
export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
] as const

export const membershipSchema = z.object({
  firstName: z.string().trim().min(2, 'Enter at least 2 characters').max(80, 'Keep this under 80 characters'),
  lastName: z.string().trim().min(2, 'Enter at least 2 characters').max(80, 'Keep this under 80 characters'),
  email: z.string().trim().max(254, 'Email address is too long').pipe(z.email('Enter a valid email address')),
  phone: z.string().trim().min(7, 'Enter a valid phone number').max(24, 'Phone number is too long').regex(/^\+?[0-9][0-9\s().-]*$/, 'Enter a valid phone number'),
  university: z.string().trim().min(2, 'Enter your university').max(160, 'Keep this under 160 characters'),
  gender: z.enum(['Male', 'Female'], { error: () => ({ message: 'Select a gender' }) }),
  stateOfOrigin: z.enum(NIGERIAN_STATES, { error: () => ({ message: 'Select a state' }) }),
  studyLevel: z.enum(['100L', '200L', '300L', '400L', '500L', 'Postgraduate', 'Other'], { error: () => ({ message: 'Select your study level' }) }),
  whyJoin: z.string().trim().min(10, 'Tell us a little more (at least 10 characters)').max(500, 'Keep your answer under 500 characters'),
})
export type MembershipInput = z.infer<typeof membershipSchema>
