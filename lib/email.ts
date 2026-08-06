import { Resend } from 'resend'

// Constructed lazily. `new Resend()` throws when RESEND_API_KEY is unset, and
// at module scope that turns a missing key into a build failure — Next.js
// evaluates every route module while collecting page data. Deferring to first
// send keeps the failure at request time, where it can be caught and logged.
let resendClient: Resend | null = null

function resend(): Resend {
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY!)
  return resendClient
}

const FROM = () => process.env.EMAIL_FROM!
const ADMIN = () => process.env.ADMIN_EMAIL!

// Escape user-supplied values before interpolating them into email HTML.
// Without this, a visitor could inject markup (e.g. a fake <a> link) into the
// admin notification or into their own confirmation email.
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ── Registration confirmation ─────────────────────────────────
export async function sendRegistrationConfirmation(opts: {
  to: string
  recipientName: string
  eventTitle: string
  eventDate: string
  eventLocation: string
  university: string
}) {
  return resend().emails.send({
    from: FROM(),
    to: opts.to,
    subject: `You're registered for ${opts.eventTitle}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1B2A4A; padding: 32px; text-align: center;">
          <h1 style="color: #C49A22; margin: 0; font-size: 28px;">KAMP</h1>
          <p style="color: #ffffff; margin: 8px 0 0; font-size: 14px;">Kolade Adepoju Mentoring Program</p>
        </div>
        <div style="padding: 32px; background: #ffffff;">
          <h2 style="color: #1B2A4A;">You're confirmed, ${esc(opts.recipientName)}!</h2>
          <p style="color: #595959;">You have successfully registered for:</p>
          <div style="background: #F5F0E8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #C49A22;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1B2A4A;">${esc(opts.eventTitle)}</p>
            <p style="margin: 8px 0 0; color: #595959;">📅 ${esc(opts.eventDate)}</p>
            <p style="margin: 4px 0 0; color: #595959;">📍 ${esc(opts.eventLocation)}</p>
            <p style="margin: 4px 0 0; color: #595959;">🎓 ${esc(opts.university)}</p>
          </div>
          <p style="color: #595959;">We look forward to seeing you there. Keep an eye on our Instagram <strong>@wearekamp</strong> for updates and reminders.</p>
          <p style="color: #595959;">See you soon,<br/><strong>The KAMP Team</strong></p>
        </div>
        <div style="background: #F5F0E8; padding: 16px; text-align: center; font-size: 12px; color: #6B6B6B;">
          © KAMP — Kolade Adepoju Mentoring Program
        </div>
      </div>
    `,
  })
}

// ── Donation receipt ──────────────────────────────────────────
export async function sendDonationReceipt(opts: {
  to: string
  donorName: string
  amountNgn: number
  paystackRef: string
  paidAt: string
}) {
  return resend().emails.send({
    from: FROM(),
    to: opts.to,
    subject: `Thank you for supporting KAMP`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1B2A4A; padding: 32px; text-align: center;">
          <h1 style="color: #C49A22; margin: 0; font-size: 28px;">KAMP</h1>
          <p style="color: #ffffff; margin: 8px 0 0; font-size: 14px;">Kolade Adepoju Mentoring Program</p>
        </div>
        <div style="padding: 32px; background: #ffffff;">
          <h2 style="color: #1B2A4A;">Thank you, ${esc(opts.donorName)}!</h2>
          <p style="color: #595959;">Your generous donation has been received. Here are your payment details:</p>
          <div style="background: #F5F0E8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1A6B3A;">
            <p style="margin: 0;"><strong>Amount:</strong> ₦${opts.amountNgn.toLocaleString('en-NG')}</p>
            <p style="margin: 8px 0 0;"><strong>Reference:</strong> ${esc(opts.paystackRef)}</p>
            <p style="margin: 8px 0 0;"><strong>Date:</strong> ${esc(opts.paidAt)}</p>
            <p style="margin: 8px 0 0;"><strong>Status:</strong> ✅ Successful</p>
          </div>
          <p style="color: #595959;">Your support helps KAMP raise transformative leaders across Nigerian university campuses. Every kobo counts.</p>
          <p style="color: #595959;">With gratitude,<br/><strong>The KAMP Team</strong></p>
        </div>
        <div style="background: #F5F0E8; padding: 16px; text-align: center; font-size: 12px; color: #6B6B6B;">
          Please keep this email as your donation receipt.<br/>
          © KAMP — Kolade Adepoju Mentoring Program
        </div>
      </div>
    `,
  })
}

// ── Contact form notification (to admin) ─────────────────────
export async function sendContactNotification(opts: {
  senderName: string
  senderEmail: string
  subject: string
  message: string
}) {
  return resend().emails.send({
    from: FROM(),
    to: ADMIN(),
    replyTo: opts.senderEmail,
    subject: `New contact form submission: ${opts.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1B2A4A;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6B6B6B; width: 100px;"><strong>From:</strong></td><td>${esc(opts.senderName)}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B6B6B;"><strong>Email:</strong></td><td><a href="mailto:${encodeURI(opts.senderEmail)}">${esc(opts.senderEmail)}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #6B6B6B;"><strong>Subject:</strong></td><td>${esc(opts.subject)}</td></tr>
        </table>
        <div style="background: #F5F0E8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; white-space: pre-wrap;">${esc(opts.message)}</p>
        </div>
        <p style="color: #6B6B6B; font-size: 12px;">Received from the KAMP website contact form.</p>
      </div>
    `,
  })
}
