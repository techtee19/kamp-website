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
  ticketRef: string
  ticketPDF: Buffer | null
}) {
  const result = await resend().emails.send({
    from: FROM(),
    to: opts.to,
    subject: `Your KAMP ticket for ${opts.eventTitle}`,
    attachments: opts.ticketPDF
      ? [{ filename: `KAMP-Ticket-${opts.ticketRef}.pdf`, content: opts.ticketPDF }]
      : [],
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1B2A4A; padding: 32px; text-align: center;">
          <h1 style="color: #C49A22; margin: 0; font-size: 28px;">KAMP</h1>
          <p style="color: #ffffff; margin: 8px 0 0; font-size: 14px;">Kolade Adepoju Mentoring Program</p>
        </div>
        <div style="padding: 32px; background: #ffffff;">
          <h2 style="color: #1B2A4A;">You're confirmed, ${esc(opts.recipientName)}!</h2>
          <p style="color: #595959;">Your registration for <strong>${esc(opts.eventTitle)}</strong> is complete. Your ticket is attached as a PDF.</p>
          <div style="background: #F5F0E8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #C49A22;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1B2A4A;">${esc(opts.eventTitle)}</p>
            <p style="margin: 8px 0 0; color: #595959;">📅 ${esc(opts.eventDate)}</p>
            <p style="margin: 4px 0 0; color: #595959;">📍 ${esc(opts.eventLocation)}</p>
            <p style="margin: 4px 0 0; color: #595959;">🎓 ${esc(opts.university)}</p>
          </div>
          <div style="background: #1A1A1A; padding: 14px 20px; border-radius: 6px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 10px; color: #C49A22; letter-spacing: 2px; text-transform: uppercase;">Ticket Reference</p>
            <p style="margin: 4px 0 0; font-size: 16px; color: #C49A22; font-weight: bold; letter-spacing: 1px;">${esc(opts.ticketRef)}</p>
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

  // Resend reports API-level delivery failures in the result instead of throwing.
  // Surface those failures to the registration route's existing catch handler.
  if (result.error) {
    throw new Error(`Resend registration email failed: ${result.error.message}`)
  }

  console.info(`Registration confirmation email accepted by Resend: ${result.data?.id ?? 'unknown id'}`)

  return result
}

export async function sendMembershipWelcome(opts: {
  to: string
  firstName: string
  memberId: string
  cardPDF: Buffer
}) {
  // Keep the invite in the email even when a deployment has not loaded its env
  // configuration yet. WHATSAPP_COMMUNITY_LINK can override this default.
  const configuredLink = process.env.WHATSAPP_COMMUNITY_LINK?.trim()
  const whatsappLink = configuredLink && /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9_-]+$/.test(configuredLink)
    ? configuredLink
    : 'https://chat.whatsapp.com/I7tSURUiRsW2n0bch1vza8'
  const result = await resend().emails.send({
    from: FROM(),
    to: opts.to,
    subject: 'Welcome to KAMP — your membership ID card',
    attachments: [{ filename: `KAMP-Member-${opts.memberId.replace(/[^A-Z0-9-]/gi, '')}.pdf`, content: opts.cardPDF }],
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#202020"><div style="background:#1B2A4A;padding:28px;text-align:center;color:white"><h1 style="color:#C49A22;margin:0">KAMP</h1><p>Kolade Adepoju Mentoring Program</p></div><div style="padding:30px"><h2>Welcome, ${esc(opts.firstName)}!</h2><p>Your KAMP membership is active. Your member ID is <strong>${esc(opts.memberId)}</strong>.</p><p>Your member ID card is attached to this email. Keep it safe and use this ID when contacting KAMP.</p><p><a href="${esc(whatsappLink)}" style="display:inline-block;background:#1B2A4A;color:white;padding:12px 20px;border-radius:24px;text-decoration:none">Join the KAMP WhatsApp community</a></p><p>We are glad you are here.<br/><strong>The KAMP Team</strong></p></div></div>`,
  })
  if (result.error) throw new Error(`Resend membership email failed: ${result.error.message}`)
  return result
}

export async function sendEventReminder(opts: {
  to: string
  recipientName: string
  eventTitle: string
  eventDate: string
  eventTime: string
  eventLocation: string
  university: string
  ticketRef: string
}) {
  const result = await resend().emails.send({
    from: FROM(),
    to: opts.to,
    subject: `Reminder: ${opts.eventTitle} is coming up`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#202020"><div style="background:#1B2A4A;padding:28px;text-align:center;color:white"><h1 style="color:#C49A22;margin:0">KAMP</h1><p>Kolade Adepoju Mentoring Program</p></div><div style="height:4px;background:#C49A22"></div><div style="padding:30px"><h2 style="color:#1B2A4A">Hello, ${esc(opts.recipientName)}!</h2><p>This is a reminder that <strong>${esc(opts.eventTitle)}</strong> is coming up. We look forward to seeing you there.</p><div style="background:#F5F0E8;padding:20px;border-left:4px solid #C49A22"><p><strong>Date:</strong> ${esc(opts.eventDate)}</p>${opts.eventTime ? `<p><strong>Time:</strong> ${esc(opts.eventTime)}</p>` : ''}<p><strong>Venue:</strong> ${esc(opts.eventLocation)}</p>${opts.university ? `<p><strong>Institution:</strong> ${esc(opts.university)}</p>` : ''}</div><div style="margin-top:20px;padding:16px;background:#1B2A4A;color:#C49A22"><small>YOUR TICKET REFERENCE</small><p style="margin:4px 0;font-weight:bold">${esc(opts.ticketRef)}</p></div><p style="color:#595959">Please bring your ticket reference with you. See you soon,<br/><strong>The KAMP Team</strong></p></div><div style="padding:16px;text-align:center;font-size:12px;color:#6B6B6B">© KAMP — Kolade Adepoju Mentoring Program</div></div>`,
  })
  if (result.error) throw new Error(`Resend reminder email failed: ${result.error.message}`)
  return result
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
          <tr><td style="padding: 8px 0; color: #6B6B6B;"><strong>Email:</strong></td><td><a href="mailto:${esc(encodeURI(opts.senderEmail))}">${esc(opts.senderEmail)}</a></td></tr>
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
