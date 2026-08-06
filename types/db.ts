export interface RegistrationRow {
  id: number
  event_id: string
  event_title: string
  full_name: string
  email: string
  phone: string
  university: string
  study_level: string
  status: 'confirmed' | 'waitlisted' | 'cancelled'
  created_at: string
}

export interface DonationRow {
  id: number
  paystack_ref: string
  donor_name: string
  donor_email: string
  amount_kobo: number
  amount_ngn: number
  donation_type: 'one_time' | 'recurring'
  status: 'pending' | 'success' | 'failed'
  paystack_status: string | null
  message: string | null
  receipt_sent: boolean
  created_at: string
  paid_at: string | null
}

export interface ContactSubmissionRow {
  id: number
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}
