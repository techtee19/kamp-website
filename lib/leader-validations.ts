import { z } from 'zod'

const email = z.string().trim().max(254).pipe(z.email('Enter a valid email address'))
const shortText = (label: string) => z.string().trim().min(1, `${label} is required`).max(200, `${label} must be 200 characters or fewer`)
const optionalLongText = z.string().trim().max(5000).optional().or(z.literal(''))
const optionalDate = z.iso.date().optional().or(z.literal(''))
const safeOptionalUrl = z.union([z.literal(''), z.string().trim().max(2000).url().refine((value) => ['http:', 'https:'].includes(new URL(value).protocol), 'Use an http or https link.')]).optional()

export const leaderLoginRequestSchema = z.object({ email })

export const leaderCreateSchema = z.object({
  fullName: shortText('Name'),
  email,
  phone: z.string().trim().max(24).optional().or(z.literal('')),
  role: z.enum(['campus_leader', 'executive']),
  campus: shortText('Campus'),
})

export const leaderStatusSchema = z.object({ status: z.enum(['active', 'inactive']) })

export const leaderReportSchema = z.object({
  reportType: z.enum(['monthly', 'event', 'other']),
  title: shortText('Title'),
  reportDate: z.iso.date(),
  eventsHeld: z.number().int().min(0).max(10000).optional(),
  attendance: z.number().int().min(0).max(1000000).optional(),
  summary: z.string().trim().min(1, 'Summary is required').max(5000),
  achievements: optionalLongText,
  challenges: optionalLongText,
  nextSteps: optionalLongText,
  links: safeOptionalUrl,
})

export const leaderRequestSchema = z.object({
  requestType: z.enum(['funding', 'materials', 'approval', 'support', 'other']),
  title: shortText('Title'),
  description: z.string().trim().min(1, 'Description is required').max(5000),
  eventName: z.string().trim().max(200).optional().or(z.literal('')),
  eventDate: optionalDate,
  amountRequested: z.number().finite().positive('Enter an amount greater than zero').max(999999999999.99).optional(),
  budgetBreakdown: optionalLongText,
  neededBy: optionalDate,
  links: safeOptionalUrl,
}).superRefine((data, context) => {
  if (data.requestType === 'funding') {
    if (!data.amountRequested) context.addIssue({ code: 'custom', path: ['amountRequested'], message: 'Enter the amount requested' })
    if (!data.budgetBreakdown) context.addIssue({ code: 'custom', path: ['budgetBreakdown'], message: 'Add a budget breakdown' })
  }
})

export const requestReviewSchema = z.object({
  status: z.enum(['submitted', 'under_review', 'more_info_needed', 'approved', 'declined']),
  reviewNote: z.string().trim().max(5000).optional().or(z.literal('')),
}).superRefine((data, context) => {
  if (['more_info_needed', 'declined'].includes(data.status) && !data.reviewNote) {
    context.addIssue({ code: 'custom', path: ['reviewNote'], message: 'Add a note for this decision' })
  }
})

export type LeaderReportInput = z.infer<typeof leaderReportSchema>
export type LeaderRequestInput = z.infer<typeof leaderRequestSchema>
