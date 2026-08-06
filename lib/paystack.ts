import crypto from 'crypto'

const PAYSTACK_BASE = 'https://api.paystack.co'
const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!

interface InitTransactionParams {
  email: string
  amount: number // in kobo (NGN * 100)
  reference: string
  metadata?: Record<string, unknown>
  callback_url?: string
}

interface InitTransactionResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

interface VerifyTransactionResponse {
  status: boolean
  message: string
  data: {
    status: string // 'success' | 'failed' | 'abandoned'
    reference: string
    amount: number // in kobo
    paid_at: string
    customer: {
      email: string
    }
    metadata?: Record<string, unknown>
  }
}

// Initialise a new Paystack transaction — returns the checkout URL
export async function initializeTransaction(
  params: InitTransactionParams
): Promise<InitTransactionResponse> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(`Paystack init failed: ${error.message}`)
  }

  return res.json()
}

// Verify a transaction by reference — use in webhook handler as a double-check
export async function verifyTransaction(
  reference: string
): Promise<VerifyTransactionResponse> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${SECRET_KEY}`,
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(`Paystack verify failed: ${error.message}`)
  }

  return res.json()
}

// Generate a unique transaction reference
export function generateReference(prefix = 'kamp'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}_${timestamp}_${random}`
}

// Verify Paystack webhook signature
// Returns true if the request is genuinely from Paystack.
// Uses a constant-time comparison so an attacker cannot recover the expected
// digest byte-by-byte by measuring response timing.
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const hash = crypto.createHmac('sha512', SECRET_KEY).update(rawBody).digest('hex')

  // timingSafeEqual throws if the buffers differ in length, so guard first.
  if (hash.length !== signature.length) return false

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature))
}
