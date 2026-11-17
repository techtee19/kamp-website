This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Registration rollout and recovery

1. Apply migrations with `pnpm db:migrate` against the target database before deploying.
2. Set `CRON_SECRET` to a random secret in Vercel. The deployment starts each queued email after the registration response and uses the cron route to recover unfinished jobs. The checked-in schedule runs once daily for Vercel Hobby. For retries within a few minutes, use a supported more frequent schedule or call `GET /api/cron/registration-email` from an authenticated scheduler with `Authorization: Bearer <CRON_SECRET>`.
3. In Resend, point a webhook at the production domain's `/api/resend/webhook`. Subscribe to `email.sent`, `email.delivered`, `email.delivery_delayed`, `email.bounced`, `email.suppressed`, and `email.failed`. Put its signing secret in Vercel as `RESEND_WEBHOOK_SECRET`. Keep `RESEND_API_KEY` and the verified `EMAIL_FROM` configured.
4. In **Admin → Members**, open a profile to inspect its welcome email and retry eligible sends. For address correction, open **Membership support** and confirm ownership through an independent existing contact or in person, as well as access to the new address. An untracked historical send or an unknown Resend response past its idempotency window needs reconciliation in Resend before reissuing.

The defaults are 300 OTP requests and 600 verifications per public IP per ten minutes, plus 60 membership submissions and 120 event confirmations per IP per minute. Tune the values in `.env.example` against legitimate shared-network traffic and database capacity. The account limit of five code requests per hour, 60-second resend cooldown, five guesses per code, and 15 verification attempts per account per 30 minutes apply independently. On Vercel the limiter uses the trusted forwarding header. Review the `Server-Timing` header on successful event confirmations and monitor 429s during the first busy event.

The OTP audit stores outcomes and provider error codes without OTPs or recipient addresses. To see the delivery state, join `event_member_otp_audit.provider_message_id` to `event_otp_provider_delivery.provider_message_id`. For welcome and ticket jobs, the `accepted` status records API acceptance. The signed webhook supplies subsequent delivery status.

Run `pnpm test:registration` for the pure tests. For the integration tests, install `@electric-sql/pglite` to a temporary directory and set `REGISTRATION_PGLITE_PATH` to its resolved module entry point before running the same command. The suite uses synthetic members, an isolated database, and a mocked email sender.
