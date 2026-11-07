import { Resend } from 'resend'
import { getWhatsAppCommunityLink } from '@/lib/community'

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
export const getCEOEmail = () => process.env.CEO_EMAIL?.trim() || ADMIN()

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

async function sendLeadersEmail(to: string, subject: string, content: string) {
  const result = await resend().emails.send({
    from: FROM(),
    to,
    subject,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#202020;line-height:1.65"><header style="background:#202020;padding:26px 30px;text-align:center"><p style="margin:0;color:#efbc2b;font-size:22px;font-weight:700;letter-spacing:5px">KAMP</p><p style="margin:6px 0 0;color:#fff;font-size:12px;letter-spacing:1px">LEADERS PORTAL</p></header><div style="height:3px;background:#efbc2b"></div><main style="padding:30px;background:#fff">${content}</main><footer style="padding:16px;background:#f5f4ef;text-align:center;color:#6b6b6b;font-size:12px">Kolade Adepoju Mentoring Program</footer></div>`,
  })
  if (result.error) throw new Error(`Resend leaders email failed: ${result.error.message}`)
  return result
}

export async function sendLeaderInvite(opts: { to: string; fullName: string; role: string; campus: string; portalUrl: string }) {
  return sendLeadersEmail(opts.to, 'Your KAMP Leaders Portal access', `
    <p style="margin:0 0 8px;color:#8b806d;font-size:11px;font-weight:700;letter-spacing:2px">A NOTE FROM KAMP</p>
    <h1 style="margin:0;color:#202020;font-size:28px;letter-spacing:-1px">Welcome, ${esc(opts.fullName)}.</h1>
    <p style="margin:16px 0;color:#5f5b52">You have been invited to the KAMP Leaders Portal as a <strong>${esc(opts.role)}</strong> for <strong>${esc(opts.campus)}</strong>.</p>
    <p style="margin:0 0 22px;color:#5f5b52">Use the portal to share campus updates, submit reports, and request support from the KAMP leadership team. When you sign in, we’ll email a secure one-time link to this address.</p>
    <p style="margin:0"><a href="${esc(opts.portalUrl)}" style="display:inline-block;padding:13px 21px;border-radius:999px;background:#202020;color:#fff;text-decoration:none;font-weight:700">Open the Leaders Portal</a></p>
  `)
}

export async function sendLeaderLoginLink(opts: { to: string; fullName: string; loginUrl: string }) {
  return sendLeadersEmail(opts.to, 'Your secure KAMP sign-in link', `
    <p style="margin:0 0 8px;color:#8b806d;font-size:11px;font-weight:700;letter-spacing:2px">SECURE SIGN-IN</p>
    <h1 style="margin:0;color:#202020;font-size:28px;letter-spacing:-1px">Hello, ${esc(opts.fullName)}.</h1>
    <p style="margin:16px 0;color:#5f5b52">Use this one-time link to open your KAMP Leaders Portal. It expires in 15 minutes and can only be used once.</p>
    <p style="margin:0"><a href="${esc(opts.loginUrl)}" style="display:inline-block;padding:13px 21px;border-radius:999px;background:#202020;color:#fff;text-decoration:none;font-weight:700">Continue to the portal</a></p>
    <p style="margin:20px 0 0;color:#777;font-size:13px">If you didn’t request this link, you can ignore this message.</p>
  `)
}

export async function sendNewSubmissionNotice(opts: {
  to: string
  submissionType: 'report' | 'request'
  title: string
  leaderName: string
  campus: string
  details: Array<{ label: string; value: string }>
  adminUrl: string
}) {
  const details = opts.details.map(({ label, value }) => `<tr><td style="padding:7px 12px 7px 0;color:#777;font-size:13px;vertical-align:top">${esc(label)}</td><td style="padding:7px 0;color:#202020;font-size:13px">${esc(value)}</td></tr>`).join('')
  return sendLeadersEmail(opts.to, `New KAMP ${opts.submissionType}: ${opts.title}`, `
    <p style="margin:0 0 8px;color:#8b806d;font-size:11px;font-weight:700;letter-spacing:2px">NEW ${opts.submissionType.toUpperCase()}</p>
    <h1 style="margin:0;color:#202020;font-size:26px;letter-spacing:-.7px">${esc(opts.title)}</h1>
    <p style="margin:12px 0 18px;color:#5f5b52">Submitted by ${esc(opts.leaderName)} · ${esc(opts.campus)}</p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #ece9e1;border-bottom:1px solid #ece9e1">${details}</table>
    <p style="margin:22px 0 0"><a href="${esc(opts.adminUrl)}" style="display:inline-block;padding:13px 21px;border-radius:999px;background:#202020;color:#fff;text-decoration:none;font-weight:700">Review in admin</a></p>
  `)
}

export async function sendRequestStatusUpdate(opts: { to: string; leaderName: string; title: string; status: string; reviewNote: string | null; portalUrl: string }) {
  return sendLeadersEmail(opts.to, `KAMP request update: ${opts.title}`, `
    <p style="margin:0 0 8px;color:#8b806d;font-size:11px;font-weight:700;letter-spacing:2px">REQUEST UPDATE</p>
    <h1 style="margin:0;color:#202020;font-size:27px;letter-spacing:-.8px">Your request has been updated.</h1>
    <p style="margin:16px 0;color:#5f5b52">Hello ${esc(opts.leaderName)}, <strong>${esc(opts.title)}</strong> is now <strong>${esc(opts.status.replaceAll('_', ' '))}</strong>.</p>
    ${opts.reviewNote ? `<div style="margin:18px 0;padding:16px 18px;border-radius:16px;background:#f5f4ef"><p style="margin:0 0 5px;color:#8b806d;font-size:11px;font-weight:700;letter-spacing:1px">NOTE FROM THE REVIEW TEAM</p><p style="margin:0;color:#202020;white-space:pre-wrap">${esc(opts.reviewNote)}</p></div>` : ''}
    <p style="margin:0"><a href="${esc(opts.portalUrl)}" style="display:inline-block;padding:13px 21px;border-radius:999px;background:#202020;color:#fff;text-decoration:none;font-weight:700">View your request</a></p>
  `)
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
            <p style="margin: 4px 0 0; color: #595959;">👤 ${esc(opts.university)}</p>
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

export async function sendEventMemberVerificationCode(opts: { to: string; firstName: string; code: string }) {
  const result = await resend().emails.send({
    from: FROM(),
    to: opts.to,
    subject: 'Your KAMP event registration verification code',
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#202020;line-height:1.6"><div style="background:#1B2A4A;padding:26px;text-align:center;color:#fff"><h1 style="margin:0;color:#C49A22">KAMP</h1><p style="margin:6px 0 0">Kolade Adepoju Mentoring Program</p></div><div style="padding:28px"><h2 style="color:#1B2A4A">Confirm it’s you, ${esc(opts.firstName)}</h2><p>Use this one-time code to verify your KAMP membership and register for an event:</p><p style="padding:18px;text-align:center;background:#F5F0E8;border-radius:8px;font-size:30px;font-weight:bold;letter-spacing:8px;color:#1B2A4A">${esc(opts.code)}</p><p>This code expires in 10 minutes. If you didn’t request it, you can ignore this email.</p><p>Warmly,<br/><strong>The KAMP Team</strong></p></div></div>`,
  })
  if (result.error) throw new Error(`Resend member verification email failed: ${result.error.message}`)
  return result
}

export async function sendEventCheckinAccessInvitation(opts: { to: string; eventTitle: string; loginUrl: string }) {
  const result = await resend().emails.send({
    from: FROM(),
    to: opts.to,
    subject: `KAMP check-in access: ${opts.eventTitle}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#202020;line-height:1.6"><div style="background:#1B2A4A;padding:26px;text-align:center;color:#fff"><h1 style="margin:0;color:#C49A22">KAMP</h1><p style="margin:6px 0 0">Event registration team</p></div><div style="padding:28px"><h2 style="color:#1B2A4A">You have event check-in access</h2><p>You have been added as a check-in operator for <strong>${esc(opts.eventTitle)}</strong>.</p><p>Use your email address to request a one-time sign-in code. This access is limited to this event’s attendee check-in screen.</p><p style="margin:24px 0"><a href="${esc(opts.loginUrl)}" style="display:inline-block;background:#1B2A4A;color:#fff;padding:13px 22px;border-radius:24px;text-decoration:none;font-weight:bold">Open event check-in</a></p><p>The code expires after 10 minutes. Your check-in session expires after 12 hours. If you were not expecting this access, contact the KAMP event lead.</p></div></div>`,
  })
  if (result.error) throw new Error(`Resend event check-in invitation failed: ${result.error.message}`)
  return result
}

export async function sendEventCheckinLoginCode(opts: { to: string; eventTitle: string; code: string }) {
  const result = await resend().emails.send({
    from: FROM(),
    to: opts.to,
    subject: `Your KAMP check-in sign-in code for ${opts.eventTitle}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#202020;line-height:1.6"><div style="background:#1B2A4A;padding:26px;text-align:center;color:#fff"><h1 style="margin:0;color:#C49A22">KAMP</h1><p style="margin:6px 0 0">Event check-in</p></div><div style="padding:28px"><h2 style="color:#1B2A4A">Your one-time sign-in code</h2><p>Use this code to access event check-in for <strong>${esc(opts.eventTitle)}</strong>:</p><p style="padding:18px;text-align:center;background:#F5F0E8;border-radius:8px;font-size:30px;font-weight:bold;letter-spacing:8px;color:#1B2A4A">${esc(opts.code)}</p><p>This code expires in 10 minutes and can only be used once. If you didn’t request it, you can ignore this email.</p></div></div>`,
  })
  if (result.error) throw new Error(`Resend event check-in code failed: ${result.error.message}`)
  return result
}

export async function sendMembershipWelcome(opts: {
  to: string
  firstName: string
  memberId: string
  cardPDF: Buffer
  communityJoinUrl?: string
}) {
  const whatsappLink = getWhatsAppCommunityLink()
  const joinLink = opts.communityJoinUrl ?? whatsappLink
  const socialLinks = [
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/kolade-adepoju-mentoring-program-kamp/', icon: 'in', background: '#0A66C2' },
    { name: 'Facebook', href: 'https://facebook.com/wearekamp?rpxt=djd1eXZ0c2Q2YzZm', icon: 'f', background: '#1877F2' },
    { name: 'Instagram', href: 'https://instagram.com/wearekamp?rpxt=djd1eXZ0c2Q2YzZm', icon: '◎', background: '#C13584' },
  ]
  const result = await resend().emails.send({
    from: FROM(),
    to: opts.to,
    subject: 'Welcome to the KAMP community',
    attachments: [{ filename: `KAMP-Member-${opts.memberId.replace(/[^A-Z0-9-]/gi, '')}.pdf`, content: opts.cardPDF }],
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#202020;line-height:1.65">
        <div style="background:#1B2A4A;padding:30px;text-align:center;color:white">
          <h1 style="color:#C49A22;margin:0;font-size:30px;letter-spacing:2px">KAMP</h1>
          <p style="margin:8px 0 0">Kolade Adepoju Mentoring Program</p>
        </div>
        <div style="padding:32px 30px">
          <p style="margin:0 0 8px;color:#C49A22;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase">You belong here</p>
          <h2 style="margin:0 0 18px;color:#1B2A4A;font-size:25px">A warm welcome to KAMP, ${esc(opts.firstName)}!</h2>
          <p>We’re truly glad you’ve joined us. By becoming a KAMP member, you’re now part of a community that believes in people, purposeful mentorship, and the potential each of us carries to make a difference.</p>
          <p>We hope KAMP brings you meaningful connections, encouragement, and opportunities to learn, grow, and lead. Wherever you are on your journey, there’s room here for you.</p>
          <div style="background:#F5F0E8;padding:20px;border-radius:10px;margin:24px 0;border-left:4px solid #C49A22">
            <p style="margin:0;color:#595959;font-size:12px;letter-spacing:1px;text-transform:uppercase">Your KAMP member ID</p>
            <p style="margin:6px 0 0;color:#1B2A4A;font-size:22px;font-weight:bold">${esc(opts.memberId)}</p>
          </div>
          <p>Your membership card is attached. Please keep it somewhere safe; your member ID helps us identify your membership whenever you contact the KAMP team.</p>
          <p>Stay connected with fellow members and hear from the community by joining our WhatsApp group:</p>
          <p style="margin:24px 0"><a href="${esc(joinLink)}" style="display:inline-block;background:#1B2A4A;color:white;padding:13px 22px;border-radius:24px;text-decoration:none;font-weight:bold">Join the KAMP WhatsApp community</a></p>
          <div style="margin:30px 0 24px;padding:22px 18px;background:#F5F0E8;border-radius:12px;text-align:center">
            <p style="margin:0 0 16px;color:#1B2A4A;font-size:15px;font-weight:bold">Keep growing with us</p>
            <p style="margin:0 0 18px;color:#595959;font-size:13px">Follow KAMP for community stories, opportunities, and updates.</p>
            <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0"><tr>
              ${socialLinks.map(({ name, href, icon, background }) => `<td align="center" style="padding:0 12px"><a href="${href}" aria-label="Follow KAMP on ${name}" target="_blank" rel="noopener noreferrer" style="display:inline-block;width:42px;height:42px;line-height:42px;border-radius:50%;background:${background};color:#ffffff;text-align:center;text-decoration:none;font-family:Arial,sans-serif;font-size:${name === 'Instagram' ? '27px' : '19px'};font-weight:bold">${icon}</a><br/><a href="${href}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-top:7px;color:#1B2A4A;font-size:12px;text-decoration:none">${name}</a></td>`).join('')}
            </tr></table>
          </div>
          <p>We’re excited to have you with us. Here’s to the people you’ll meet, the ideas you’ll explore, and the impact you’ll make.</p>
          <p style="margin-bottom:0">With warmth,<br/><strong>The KAMP Team</strong></p>
        </div>
        <div style="background:#F5F0E8;padding:16px;text-align:center;font-size:12px;color:#6B6B6B">© KAMP — Kolade Adepoju Mentoring Program</div>
      </div>
    `,
  })
  if (result.error) throw new Error(`Resend membership email failed: ${result.error.message}`)
  return result
}

export async function sendCommunityInvitation(opts: {
  to: string
  firstName: string
  communityJoinUrl: string
}) {
  const result = await resend().emails.send({
    from: FROM(),
    to: opts.to,
    subject: 'You’re invited to join the KAMP WhatsApp community',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#202020;line-height:1.65">
        <div style="background:#1B2A4A;padding:30px;text-align:center;color:white">
          <h1 style="color:#C49A22;margin:0;font-size:30px;letter-spacing:2px">KAMP</h1>
          <p style="margin:8px 0 0">Kolade Adepoju Mentoring Program</p>
        </div>
        <div style="padding:32px 30px">
          <p style="margin:0 0 8px;color:#C49A22;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase">Stay connected</p>
          <h2 style="margin:0 0 18px;color:#1B2A4A;font-size:25px">Hello ${esc(opts.firstName)}, come join us on WhatsApp</h2>
          <p>We’d love to welcome you into the KAMP WhatsApp community, where members can stay connected, hear about opportunities, and keep up with what’s happening across KAMP.</p>
          <p>Use the button below to open the community invitation. We look forward to seeing you there.</p>
          <p style="margin:28px 0"><a href="${esc(opts.communityJoinUrl)}" style="display:inline-block;background:#176B42;color:white;padding:13px 22px;border-radius:24px;text-decoration:none;font-weight:bold">Join the KAMP WhatsApp community</a></p>
          <p style="font-size:13px;color:#595959">If the button doesn’t work, copy this link into your browser:<br/><a href="${esc(opts.communityJoinUrl)}" style="color:#176B42;word-break:break-all">${esc(opts.communityJoinUrl)}</a></p>
          <p style="margin-bottom:0">Warmly,<br/><strong>The KAMP Team</strong></p>
        </div>
        <div style="background:#F5F0E8;padding:16px;text-align:center;font-size:12px;color:#6B6B6B">© KAMP — Kolade Adepoju Mentoring Program</div>
      </div>
    `,
  })
  if (result.error) throw new Error(`Resend WhatsApp community invitation failed: ${result.error.message}`)
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
