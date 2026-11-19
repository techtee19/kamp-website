import assert from 'node:assert/strict'
import { createHmac, randomUUID } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { after, before, test } from 'node:test'
import ts from 'typescript'
import { Resend } from 'resend'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const project = process.cwd()
const require = createRequire(import.meta.url)
const { NextRequest, NextResponse } = require('next/server')

function loader(overrides = {}) {
  const cache = new Map()
  function load(path) {
    const filename = resolve(project, path)
    if (Object.hasOwn(overrides, filename)) return overrides[filename]
    if (cache.has(filename)) return cache.get(filename).exports
    const mod = { exports: {} }
    cache.set(filename, mod)
    const source = ts.transpileModule(readFileSync(filename, 'utf8'), {
      fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    }).outputText
    const resolveModule = createRequire(filename)
    new Function('require', 'module', 'exports', source)((name) => {
      if (Object.hasOwn(overrides, name)) return overrides[name]
      if (name.startsWith('@/') || name.startsWith('.')) {
        const base = name.startsWith('@/') ? resolve(project, name.slice(2)) : resolve(dirname(filename), name)
        if (base.endsWith('.json') && existsSync(base)) return { default: resolveModule(base) }
        for (const candidate of [base + '.ts', base + '.tsx']) if (existsSync(candidate)) return load(candidate)
      }
      return resolveModule(name)
    }, mod, mod.exports)
    return mod.exports
  }
  return load
}

const load = loader()
const { classifyEmailFailure, EmailProviderError, retryDelay } = load('lib/email-failure.ts')
const { countdownSeconds, eventSlug } = load('lib/registration-flow.ts')
const { normalizeMemberId } = load('lib/member-id.ts')
const { registrationRequest } = load('lib/registration-request.ts')
const { normalizeWhatsAppNumber } = load('lib/whatsapp-number.ts')
const { canonicalInstitution } = load('lib/institution-names.ts')

test('institution aliases combine known spelling and acronym variants without merging distinct schools', () => {
  for (const value of ['FUNAAB', 'FUUNAB', 'fuunab', 'Federal university of agriculture abeokuta(FUNAAB)', 'Federal University of Agricultural Science Abeokuta']) {
    assert.equal(canonicalInstitution(value).name, 'Federal University of Agriculture, Abeokuta')
  }
  assert.equal(canonicalInstitution('Federal University of Petroleum Resources Effurun Delta State').name, 'Federal University of Petroleum Resources, Effurun')
  assert.equal(canonicalInstitution('Ladoke Akinotola University of Technology').name, 'Ladoke Akintola University of Technology, Ogbomoso')
  assert.equal(canonicalInstitution('College of medicine University of Lagos').name, 'University of Lagos')
  assert.notEqual(canonicalInstitution('Federal College of Education, Abeokuta').key, canonicalInstitution('FUNAAB').key)
  assert.equal(canonicalInstitution('Univer').recognized, false)
  assert.equal(canonicalInstitution('Living Word Academy Secondary Abayi Ugwuala').recognized, false)
  assert.equal(canonicalInstitution('FUAM').recognized, false)
  assert.equal(canonicalInstitution('FUUNAB').recognized, true)
})

test('WhatsApp support numbers normalize Nigerian and international formats', () => {
  for (const input of ['0801 234 5678', '2348012345678', '+234 (801) 234-5678', '+234 08012345678']) {
    assert.equal(normalizeWhatsAppNumber(input), '+2348012345678')
  }
  assert.equal(normalizeWhatsAppNumber('0044 7700 900123'), '+447700900123')
  for (const input of ['', 'hello', '0801abc5678', '+0123456789', '+1234567890123456']) {
    assert.equal(normalizeWhatsAppNumber(input), null)
  }
})

test('copied member IDs normalize Unicode dashes, case and separator whitespace', () => {
  assert.equal(normalizeMemberId(' kamp – stu - 2026 - 00001 '), 'KAMP-STU-2026-00001')
  assert.equal(normalizeMemberId('kamp / 2026 / 00001'), 'KAMP/2026/00001')
})

test('safe registration requests retry a lost response with the same submission key', async () => {
  const originalFetch = globalThis.fetch
  const keys = []
  globalThis.fetch = async (_path, init) => {
    keys.push(init.headers['Idempotency-Key'])
    if (keys.length === 1) throw new TypeError('connection lost after commit')
    return new Response('{}', { status: 201 })
  }
  try {
    const response = await registrationRequest('/api/membership', { method: 'POST', headers: { 'Idempotency-Key': 'same-key' }, body: 'same-body' }, true)
    assert.equal(response.status, 201)
    assert.deepEqual(keys, ['same-key', 'same-key'])
  } finally { globalThis.fetch = originalFetch }
})

test('event handoff accepts a slug and rejects external destinations', () => {
  assert.equal(eventSlug('kamp-hangout-2026'), 'kamp-hangout-2026')
  assert.equal(eventSlug('//example.com'), null)
  assert.equal(eventSlug('../admin'), null)
})

test('countdown rounds up, survives restoring the deadline, and stops at zero', () => {
  assert.equal(countdownSeconds(65_000, 5001), 60)
  assert.equal(countdownSeconds(65_000, 64_999), 1)
  assert.equal(countdownSeconds(65_000, 65_100), 0)
})

test('provider quota and request throttling are separate and respect retry hints', () => {
  assert.equal(classifyEmailFailure(new EmailProviderError('daily_quota_exceeded', 429)).category, 'quota')
  assert.equal(classifyEmailFailure(new EmailProviderError('rate_limit_exceeded', 429)).category, 'rate_limit')
  assert.equal(retryDelay('quota', 1, '7200', 'daily_quota_exceeded', 0, 0), 7_200_000)
  assert.equal(retryDelay('quota', 1, null, 'monthly_quota_exceeded', 0, 0), null)
})

test('transient retries back off and stop, permanent and uncertain conflicts hold for review', () => {
  assert.equal(retryDelay('temporary', 3, null, 'transport_error', 0, 0), 240_000)
  assert.equal(retryDelay('temporary', 5, null, 'transport_error', 0, 0), null)
  for (const code of ['invalid_recipient_address', 'invalid_api_key', 'invalid_idempotent_request']) {
    const failure = classifyEmailFailure(new EmailProviderError(code, 400))
    assert.equal(retryDelay(failure.category, 1, null, code, 0), null)
  }
})

const runtime = process.env.REGISTRATION_PGLITE_PATH
let postgres
let app
let issue
let verify
let work
let apiEmail
let admin = false
const tasks = []
const codes = new Map()
const outbound = []
const welcomeRecipients = []
const notifySecret = 'whsec_' + Buffer.from('isolated-test-signature-key-00000000').toString('base64')
const eventId = 'test-event'
const ip = '192.0.2.1'
const memberId = (index) => 'KAMP-STU-2026-' + String(index).padStart(5, '0')

function request(body, clientIp = ip) {
  return new NextRequest('https://wearekamp.org/api/test', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-vercel-forwarded-for': clientIp },
    body: JSON.stringify(body),
  })
}
async function send(index, clientIp) {
  const response = await issue(request({ eventId, memberId: memberId(index) }, clientIp))
  return { status: response.status, ...await response.json() }
}
async function check(challengeId, code, clientIp, previousChallengeId) {
  const response = await verify(request({ eventId, challengeId, previousChallengeId, code }, clientIp))
  return { status: response.status, ...await response.json() }
}
const wrong = (code) => code === '111111' ? '222222' : '111111'
const releaseCooldown = () => postgres.exec("UPDATE security_rate_limits SET window_started_at = NOW() - INTERVAL '61 seconds' WHERE window_ms = 60000")
async function flush() { while (tasks.length) await tasks.shift()() }

before(async () => {
  if (!runtime) return
  const { PGlite } = await import(pathToFileURL(resolve(runtime)).href)
  postgres = new PGlite()
  function tag(connection) {
    const sql = async (strings, ...values) => {
      const statement = strings.reduce((all, piece, index) => all + (index ? '$' + index : '') + piece, '')
      return (await connection.query(statement, values)).rows
    }
    sql.json = JSON.stringify
    sql.unsafe = async (statement, values = []) => (await connection.query(statement, values)).rows
    return sql
  }
  const db = tag(postgres)
  db.begin = (fn) => postgres.transaction((tx) => fn(tag(tx)))
  process.env.DATABASE_URL = 'isolated-test-secret'
  process.env.VERCEL = '1'
  process.env.RESEND_WEBHOOK_SECRET = notifySecret
  process.env.EMAIL_FROM = 'test@example.test'
  for (const name of ['004_event_tables_registry', '005_members', '007_security_rate_limits', '009_member_passport_photo', '010_member_type_and_date_of_birth',
    '011_member_kamp_position', '013_member_engagement_tracking', '015_event_member_registration', '019_event_member_otp_audit', '020_registration_reliability', '021_registration_resume', '022_membership_support_recovery', '023_whatsapp_support', '024_institution_name_history']) {
    await postgres.exec(readFileSync(resolve(project, 'migrations', name + '.sql'), 'utf8'))
  }
  for (let i = 1; i <= 24; i++) {
    await db`INSERT INTO members (member_id, first_name, last_name, email, phone, university, gender, state_of_origin, study_level, why_join, year_joined)
      VALUES (${memberId(i)}, 'Test', 'Member', ${i + '@example.test'}, '0800000000', 'University', 'Male', 'Lagos', '100L', 'Test membership', 2026)`
  }

  const realResend = new Resend('local-signature-test')
  const emails = {
    sendEventMemberVerificationCode: async ({ to, code }) => {
      if (apiEmail) throw apiEmail
      codes.set(to, code)
      return { data: { id: randomUUID() } }
    },
    sendMembershipWelcome: async (email, options) => {
      outbound.push(options.idempotencyKey)
      welcomeRecipients.push(email.to)
      if (apiEmail) throw apiEmail
      return { data: { id: randomUUID() } }
    },
    sendRegistrationConfirmation: async (_, options) => {
      outbound.push(options.idempotencyKey)
      if (apiEmail) throw apiEmail
      return { data: { id: randomUUID() } }
    },
    resend: () => realResend,
  }
  app = loader({
    'next/server': { NextResponse, after: (fn) => tasks.push(fn) },
    'next/navigation': {
      redirect: () => { throw new Error('Admin sign-in required') },
      useRouter: () => ({ refresh() {} }),
    },
    'next/link': { default: ({ children, ...props }) => createElement('a', props, children) },
    '@/lib/db': { db },
    '@/lib/registration-background': { scheduleRegistrationEmail: (id) => tasks.push(() => app('lib/registration-email.ts').tryRegistrationEmail(id)) },
    '@/lib/email': emails,
    '@/lib/email-failure': { classifyEmailFailure, EmailProviderError, retryDelay, deliveryStatus: load('lib/email-failure.ts').deliveryStatus },
    '@/sanity/lib/client': { freshClient: { fetch: async () => ({
      status: 'upcoming', slug: { current: eventId }, title: 'Test event', date: '2026-12-15T10:00:00Z', location: 'Campus', university: 'University',
    }) } },
    '@/lib/member-card': { generateMemberCardPDF: async () => Buffer.from('test-pdf') },
    '@/lib/ticket': { generateTicketPDF: async () => Buffer.from('test-ticket'), generateTicketRef: () => 'KAMP-TEST-TICKET' },
    '@/lib/ticket-reference': { generateTicketRef: () => 'KAMP-TEST-TICKET' },
    '@/lib/admin-session': { getAdminSession: async () => admin },
    '@/lib/admin-request': { isSameOriginAdminRequest: () => true },
  })
  issue = app('app/api/register/member-code/route.ts').POST
  verify = app('app/api/register/member-verify/route.ts').POST
  work = app('lib/registration-email.ts').processRegistrationEmail
})

after(async () => { if (postgres) { await flush(); await postgres.close() } })
const dbTest = (name, fn) => test(name, { skip: runtime ? false : 'set REGISTRATION_PGLITE_PATH to the isolated embedded PostgreSQL runtime' }, fn)

dbTest('campus members share one IP while each challenge has its own allowance and single-use proof', async () => {
  const cases = []
  for (let i = 1; i <= 13; i++) cases.push([i, await send(i)])
  const [index, first] = cases[0]
  const firstCode = codes.get(index + '@example.test')
  const failures = await Promise.all(Array.from({ length: 7 }, () => check(first.challengeId, wrong(firstCode))))
  assert.equal(failures.every((item) => item.status === 400), true)
  const row = await postgres.query('SELECT attempts FROM event_member_verifications WHERE challenge_id = $1', [first.challengeId])
  assert.equal(row.rows[0].attempts, 5)
  assert.equal((await check(first.challengeId, firstCode)).status, 400)
  for (const [i, data] of cases.slice(1)) {
    assert.equal(data.status, 200)
    const passed = await check(data.challengeId, codes.get(i + '@example.test'))
    assert.equal(passed.status, 200)
    assert.notEqual(passed.challengeId, data.challengeId)
  }
  // A lost verification reply can recover the same proof, never a second proof.
  const retried = await check(cases[1][1].challengeId, codes.get('2@example.test'))
  assert.equal(retried.status, 200)
  const repeated = await check(cases[1][1].challengeId, codes.get('2@example.test'))
  assert.equal(retried.challengeId, repeated.challengeId)
})

dbTest('direct and concurrent resend calls enforce cooldown and replace the earlier code exactly once', async () => {
  const first = await send(14)
  const old = codes.get('14@example.test')
  const rejected = await send(14)
  assert.equal(rejected.status, 429)
  assert.ok(rejected.retryAfter > 0 && rejected.retryAfter <= 60)
  await releaseCooldown()
  const calls = await Promise.all([send(14), send(14), send(14)])
  assert.deepEqual(calls.map((item) => item.status).sort(), [200, 429, 429])
  assert.equal((await check(first.challengeId, old)).status, 400)
  const latest = calls.find((item) => item.success)
  assert.equal((await check(latest.challengeId, codes.get('14@example.test'))).status, 200)
})

dbTest('provider rejection preserves the previous challenge and hides account lookup results', async () => {
  const previous = await send(15)
  await releaseCooldown()
  apiEmail = new EmailProviderError('daily_quota_exceeded', 429)
  const failed = await send(15)
  const unknown = await send(99)
  apiEmail = null
  assert.equal(failed.status, unknown.status)
  assert.deepEqual(Object.keys(failed).sort(), Object.keys(unknown).sort())
  assert.equal((await check(failed.challengeId, codes.get('15@example.test'), undefined, previous.challengeId)).status, 200)
  await flush()
  const log = await postgres.query("SELECT provider_error_code FROM event_member_otp_audit WHERE outcome = 'email_rejected'")
  assert.equal(log.rows.at(-1).provider_error_code, 'daily_quota_exceeded')
})

dbTest('cumulative guessing limit survives resends, expiry is enforced, network limiter stays on', async () => {
  for (let round = 0; round < 3; round++) {
    await releaseCooldown()
    const challenge = await send(16)
    for (let i = 0; i < 5; i++) assert.equal((await check(challenge.challengeId, wrong(codes.get('16@example.test')))).status, 400)
  }
  await releaseCooldown()
  const blocked = await send(16)
  assert.equal((await check(blocked.challengeId, codes.get('16@example.test'))).status, 400)
  const expired = await send(17)
  await postgres.query("UPDATE event_member_verifications SET expires_at = NOW() - INTERVAL '1 second' WHERE challenge_id = $1", [expired.challengeId])
  assert.equal((await check(expired.challengeId, codes.get('17@example.test'))).status, 400)
  process.env.EVENT_OTP_VERIFY_IP_LIMIT = '2'
  const publicIp = '192.0.2.2'
  for (let i = 0; i < 2; i++) assert.equal((await check(randomUUID(), '000000', publicIp)).status, 400)
  assert.equal((await check(randomUUID(), '000000', publicIp)).status, 429)
  delete process.env.EVENT_OTP_VERIFY_IP_LIMIT
})

dbTest('event confirmation requires a fresh proof and commits the ticket job before sending', async () => {
  await postgres.exec(`
    CREATE TABLE public.reg_test_event_000000000000 (
      event_id TEXT, event_title TEXT, full_name TEXT, email TEXT UNIQUE, phone TEXT, attendee_type TEXT,
      university TEXT, study_level TEXT, occupation TEXT, organization TEXT, member_id TEXT UNIQUE, status TEXT, ticket_ref TEXT
    );
    INSERT INTO event_tables_registry (event_id, event_slug, event_title, table_name)
    VALUES ('test-event', 'test-event', 'Test event', 'reg_test_event_000000000000');
  `)
  const register = app('app/api/register/route.ts').POST
  assert.equal((await register(request({ eventId, email: 'guest@example.test' }))).status, 400)
  const challenge = await send(18)
  const passed = await check(challenge.challengeId, codes.get('18@example.test'))
  const retryVerification = await check(challenge.challengeId, codes.get('18@example.test'))
  assert.equal(retryVerification.challengeId, passed.challengeId)
  assert.equal((await register(request({ eventId, memberChallengeId: challenge.challengeId }))).status, 400)
  const [confirmed, concurrent] = await Promise.all([
    register(request({ eventId, memberChallengeId: passed.challengeId })),
    register(request({ eventId, memberChallengeId: passed.challengeId })),
  ])
  assert.ok([200, 201].includes(concurrent.status))
  assert.equal((await concurrent.json()).ticketRef, 'KAMP-TEST-TICKET')
  assert.equal(confirmed.status, 201)
  assert.equal((await confirmed.json()).ticketRef, 'KAMP-TEST-TICKET')
  assert.ok(confirmed.headers.has('server-timing'))
  assert.equal((await register(request({ eventId, memberChallengeId: passed.challengeId }))).status, 200)
  assert.equal((await check(challenge.challengeId, codes.get('18@example.test'))).status, 400)
  await releaseCooldown()
  const anotherCode = await send(18)
  const reverified = await check(anotherCode.challengeId, codes.get('18@example.test'))
  const existingTicket = await register(request({ eventId, memberChallengeId: reverified.challengeId }))
  assert.equal(existingTicket.status, 201)
  assert.equal((await existingTicket.json()).ticketRef, 'KAMP-TEST-TICKET')
  const { rows } = await postgres.query("SELECT id, status FROM registration_email_jobs WHERE kind = 'ticket'")
  assert.equal(rows[0].status, 'pending')
  assert.equal(rows.length, 1)
  await flush()
  const finished = await postgres.query('SELECT status FROM registration_email_jobs WHERE id = $1', [rows[0].id])
  assert.equal(finished.rows[0].status, 'accepted')
})

dbTest('concurrent correct-code retries return one proof and keep the original expiry', async () => {
  const issued = await send(19)
  const [first, retry] = await Promise.all([
    check(issued.challengeId, codes.get('19@example.test')),
    check(issued.challengeId, codes.get('19@example.test')),
  ])
  assert.equal(first.status, 200)
  assert.equal(retry.status, 200)
  assert.equal(first.challengeId, retry.challengeId)
  assert.equal(first.expiresAt, retry.expiresAt)
  await postgres.query("UPDATE event_member_verifications SET expires_at = NOW() - INTERVAL '1 second' WHERE challenge_id = $1", [first.challengeId])
  assert.equal((await check(issued.challengeId, codes.get('19@example.test'))).status, 400)
})

dbTest('membership commits despite email failure and recovery sends once without creating another member', async () => {
  const register = app('app/api/membership/route.ts').POST
  const form = new FormData()
  form.set('data', JSON.stringify({
    firstName: 'New', lastName: 'Member', email: 'signup@example.test', phone: '08000000001', membershipType: 'professional',
    occupation: 'Engineer', dateOfBirth: '2000-01-01', gender: 'Female', stateOfOrigin: 'Lagos', whyJoin: 'Join the campus community',
  }))
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jBFsAAAAASUVORK5CYII=', 'base64')
  form.set('passportPhoto', new File([png], 'photo.png', { type: 'image/png' }))
  const key = randomUUID()
  const submit = () => register(new NextRequest('https://wearekamp.org/api/membership', {
    method: 'POST', headers: { 'Idempotency-Key': key }, body: form,
  }))
  const [first, retried] = await Promise.all([submit(), submit()])
  assert.equal(first.status, 201)
  const body = await first.json()
  const repeatedBody = await retried.json()
  assert.deepEqual(repeatedBody, body)
  assert.equal((await submit()).status, 201)
  const altered = JSON.parse(form.get('data'))
  form.set('data', JSON.stringify({ ...altered, firstName: 'Different' }))
  assert.equal((await submit()).status, 409)
  apiEmail = new EmailProviderError('invalid_from_address', 400)
  await flush()
  const result = await postgres.query("SELECT id, status, error_category FROM registration_email_jobs WHERE reference = $1", [body.memberId])
  assert.equal(result.rows[0].status, 'failed')
  assert.equal(result.rows[0].error_category, 'configuration')
  const retry = app('app/admin/api/members/resend-card/route.ts').POST
  assert.equal((await retry(request({ memberId: body.memberId }))).status, 401)
  admin = true
  await postgres.query("UPDATE registration_email_jobs SET updated_at = NOW() - INTERVAL '61 seconds' WHERE id = $1", [result.rows[0].id])
  apiEmail = null
  assert.equal((await retry(request({ memberId: body.memberId }))).status, 202)
  const sends = outbound.length
  await Promise.all([work(result.rows[0].id), work(result.rows[0].id)])
  await flush()
  assert.equal(outbound.length - sends, 1)
  const persisted = await postgres.query("SELECT status FROM registration_email_jobs WHERE id = $1", [result.rows[0].id])
  assert.equal(persisted.rows[0].status, 'accepted')
  const members = await postgres.query("SELECT COUNT(*)::int AS count FROM members WHERE email = 'signup@example.test'")
  assert.equal(members.rows[0].count, 1)
})

function signedEvent(id, type, messageId, eventTime, good = true, tags) {
  const payload = JSON.stringify({ type, created_at: eventTime, data: { email_id: messageId, tags } })
  const timestamp = String(Math.floor(Date.now() / 1000))
  const signature = createHmac('sha256', Buffer.from(notifySecret.slice(6), 'base64')).update(id + '.' + timestamp + '.' + payload).digest('base64')
  return new Request('https://wearekamp.org/api/resend/webhook', {
    method: 'POST', body: payload, headers: { 'svix-id': id, 'svix-timestamp': timestamp, 'svix-signature': good ? 'v1,' + signature : 'v1,invalid' },
  })
}

dbTest('signed delivery webhooks reject invalid signatures and protect against duplicate and older updates', async () => {
  const webhook = app('app/api/resend/webhook/route.ts').POST
  const ids = await postgres.query("SELECT id, provider_message_id FROM registration_email_jobs WHERE status = 'accepted' AND kind = 'welcome' LIMIT 1")
  const { id, provider_message_id: providerId } = ids.rows[0]
  const now = Date.now()
  const latest = new Date(now).toISOString()
  const older = new Date(now - 1000).toISOString()
  assert.equal((await webhook(signedEvent('evt_bad', 'email.delivered', providerId, latest, false))).status, 400)
  for (let i = 0; i < 2; i++) assert.equal((await webhook(signedEvent('evt_delivered', 'email.delivered', providerId, latest))).status, 204)
  await webhook(signedEvent('evt_old', 'email.delivery_delayed', providerId, older))
  const final = await postgres.query('SELECT status FROM registration_email_jobs WHERE id = $1', [id])
  assert.equal(final.rows[0].status, 'delivered')
})

dbTest('bounce and suppression are recorded even before the OTP audit row is written', async () => {
  const webhook = app('app/api/resend/webhook/route.ts').POST
  const now = new Date().toISOString()
  const ids = [randomUUID(), randomUUID()]
  for (const [i, type] of ['bounced', 'suppressed'].entries()) {
    const response = await webhook(signedEvent('evt_otp_' + i, 'email.' + type, ids[i], now, true, { kamp_event_otp: 'true' }))
    assert.equal(response.status, 204)
    const { rows } = await postgres.query('SELECT status FROM event_otp_provider_delivery WHERE provider_message_id = $1', [ids[i]])
    assert.equal(rows[0].status, type)
  }
})

dbTest('a lost provider response reuses the same key and a stale uncertain send stops', async () => {
  const { rows } = await postgres.query("INSERT INTO registration_email_jobs (kind, member_id, reference) VALUES ('welcome', $1, $1) RETURNING id", [memberId(20)])
  const { id } = rows[0]
  const offset = outbound.length
  apiEmail = new Error('timeout after send')
  await work(id)
  await postgres.query('UPDATE registration_email_jobs SET next_retry_at = NOW() WHERE id = $1', [id])
  await work(id)
  assert.equal(outbound[offset], outbound[offset + 1])
  await postgres.query("UPDATE registration_email_jobs SET first_send_at = NOW() - INTERVAL '24 hours', next_retry_at = NOW() WHERE id = $1", [id])
  apiEmail = null
  assert.equal(await work(id), false)
  assert.equal(outbound.length, offset + 2)
  const outcome = await postgres.query('SELECT status FROM registration_email_jobs WHERE id = $1', [id])
  assert.equal(outcome.rows[0].status, 'unknown')
})

dbTest('support requests give generic results and correction requires an admin', async () => {
  const submit = app('app/api/membership/support/route.ts').POST
  const registered = await submit(request({ email: '1@example.test', memberId: memberId(1), message: 'I need help getting my welcome email' }))
  const unknown = await submit(request({ email: 'missing@example.test', memberId: memberId(99), message: 'I need help getting my welcome email' }))
  assert.equal(registered.status, 201)
  assert.deepEqual(await registered.json(), await unknown.json())
  const correct = app('app/admin/api/members/support/route.ts').POST
  const { rows } = await postgres.query("SELECT id FROM membership_support_requests WHERE reply_email = '1@example.test'")
  const change = () => new NextRequest('https://wearekamp.org/admin/api/members/support', {
    method: 'POST', body: new URLSearchParams({ action: 'correct_email', id: rows[0].id, memberId: memberId(1), email: 'new@example.test', ownershipVerified: 'on' }),
  })
  admin = false
  assert.equal((await correct(change())).status, 403)
  admin = true
  assert.match((await correct(change())).headers.get('location'), /result=saved/)
  const record = await postgres.query('SELECT action FROM membership_correction_audit WHERE support_id = $1', [rows[0].id])
  assert.equal(record.rows[0].action, 'verified_email_correction')
})

function supportRecoveryRequest(id, index, verified = false) {
  return new NextRequest('https://wearekamp.org/admin/api/members/support', {
    method: 'POST', headers: { accept: 'application/json' },
    body: new URLSearchParams({
      action: 'send_welcome', id, memberId: memberId(index),
      ...(verified ? { ownershipVerified: 'on' } : {}),
    }),
  })
}

dbTest('support automatically finds a member without an ID and audits recovery to the registered email', async () => {
  const { rows } = await postgres.query(`
    INSERT INTO membership_support_requests (reply_email, message)
    VALUES ('21@example.test', 'I do not have my ID') RETURNING id
  `)
  const id = rows[0].id
  const find = app('lib/membership-support-data.ts').findMembershipSupportRequests
  const [request] = await find({ requestId: id })
  assert.equal(request.matches.length, 1)
  assert.equal(request.matches[0].member_id, memberId(21))
  assert.equal(request.matches[0].match_reason, 'Registered email')
  assert.equal(request.matches[0].email_status, null)

  const recover = app('app/admin/api/members/support/route.ts').POST
  admin = false
  assert.equal((await recover(supportRecoveryRequest(id, 21))).status, 403)
  admin = true
  assert.equal((await recover(supportRecoveryRequest(id, 22))).status, 400)
  const beforeSend = welcomeRecipients.length
  const responses = await Promise.all([
    recover(supportRecoveryRequest(id, 21)),
    recover(supportRecoveryRequest(id, 21)),
  ])
  assert.deepEqual(responses.map((response) => response.status), [202, 202])
  const jobs = await postgres.query("SELECT id FROM registration_email_jobs WHERE reference = $1", [memberId(21)])
  assert.equal(jobs.rows.length, 1)
  const audit = await postgres.query("SELECT support_request_id FROM registration_email_attempts WHERE job_id = $1 AND attempt = 0", [jobs.rows[0].id])
  assert.equal(audit.rows[0].support_request_id, id)
  await flush()
  assert.deepEqual(welcomeRecipients.slice(beforeSend), ['21@example.test'])
  const support = await postgres.query('SELECT resolved_at FROM membership_support_requests WHERE id = $1', [id])
  assert.equal(support.rows[0].resolved_at, null)

  await postgres.query("UPDATE registration_email_jobs SET status = 'delivered', updated_at = NOW() - INTERVAL '61 seconds' WHERE id = $1", [jobs.rows[0].id])
  assert.equal((await recover(supportRecoveryRequest(id, 21))).status, 202)
  await flush()
  assert.deepEqual(welcomeRecipients.slice(beforeSend), ['21@example.test', '21@example.test'])
  const [updated] = await find({ requestId: id })
  assert.equal(updated.matches[0].email_status, 'accepted')
})

dbTest('support search finds alternate records and escapes SQL wildcard characters', async () => {
  const { rows } = await postgres.query(`
    INSERT INTO membership_support_requests (reply_email, message)
    VALUES ('unmatched@example.test', 'I do not remember my old email') RETURNING id
  `)
  const find = app('lib/membership-support-data.ts').findMembershipSupportRequests
  const [empty] = await find({ requestId: rows[0].id })
  assert.equal(empty.matches.length, 0)
  const [searched] = await find({ requestId: rows[0].id, query: memberId(22) })
  assert.equal(searched.matches[0].member_id, memberId(22))
  assert.equal(searched.matches[0].match_reason, 'Search result')
  const [escaped] = await find({ requestId: rows[0].id, query: '%_' })
  assert.equal(escaped.matches.length, 0)
})

dbTest('support recovery blocks bounced, suppressed, uncertain, scheduled and inactive records', async () => {
  const { rows } = await postgres.query(`
    INSERT INTO membership_support_requests (reply_email, message)
    VALUES ('22@example.test', 'My welcome email did not arrive') RETURNING id
  `)
  const id = rows[0].id
  const recover = app('app/admin/api/members/support/route.ts').POST
  await postgres.query("INSERT INTO registration_email_jobs (kind, member_id, reference, status) VALUES ('welcome', $1, $1, 'bounced')", [memberId(22)])
  for (const status of ['bounced', 'suppressed', 'unknown', 'sending']) {
    await postgres.query("UPDATE registration_email_jobs SET status = $1 WHERE reference = $2", [status, memberId(22)])
    assert.equal((await recover(supportRecoveryRequest(id, 22))).status, 409)
  }
  await postgres.query("UPDATE registration_email_jobs SET status = 'failed', error_category = 'invalid_recipient' WHERE reference = $1", [memberId(22)])
  assert.equal((await recover(supportRecoveryRequest(id, 22))).status, 409)
  await postgres.query("UPDATE registration_email_jobs SET status = 'pending', next_retry_at = NOW() + INTERVAL '1 hour' WHERE reference = $1", [memberId(22)])
  assert.equal((await recover(supportRecoveryRequest(id, 22))).status, 409)
  await postgres.query("UPDATE members SET status = 'inactive' WHERE member_id = $1", [memberId(22)])
  assert.equal((await recover(supportRecoveryRequest(id, 22))).status, 409)
  await postgres.query("UPDATE membership_support_requests SET resolved_at = NOW() WHERE id = $1", [id])
  assert.equal((await recover(supportRecoveryRequest(id, 22))).status, 404)
})

dbTest('admin support can recover an exhausted known rejection with a new delivery generation', async () => {
  const { rows } = await postgres.query(`
    INSERT INTO membership_support_requests (reply_email, message)
    VALUES ('23@example.test', 'I still need my member ID email') RETURNING id
  `)
  await postgres.query(`
    INSERT INTO registration_email_jobs (kind, member_id, reference, attempts, error_category)
    VALUES ('welcome', $1, $1, 5, 'rate_limit')
  `, [memberId(23)])
  const recover = app('app/admin/api/members/support/route.ts').POST
  assert.equal((await recover(supportRecoveryRequest(rows[0].id, 23))).status, 202)
  const queued = await postgres.query('SELECT generation, attempts FROM registration_email_jobs WHERE reference = $1', [memberId(23)])
  assert.equal(queued.rows[0].generation, 2)
  assert.equal(queued.rows[0].attempts, 0)
  await flush()
  const finished = await postgres.query('SELECT status FROM registration_email_jobs WHERE reference = $1', [memberId(23)])
  assert.equal(finished.rows[0].status, 'accepted')
})

dbTest('support page shows the matched ID and recovery action behind admin authentication', async () => {
  const page = app('app/admin/(protected)/members/support/page.tsx').default
  admin = false
  await assert.rejects(() => page({ searchParams: Promise.resolve({}) }), /Admin sign-in required/)
  admin = true
  const { rows } = await postgres.query("SELECT id FROM membership_support_requests WHERE reply_email = '21@example.test'")
  const rendered = renderToStaticMarkup(await page({ searchParams: Promise.resolve({ request: rows[0].id }) }))
  assert.ok(rendered.includes(memberId(21)))
  assert.ok(rendered.includes('21@example.test'))
  assert.ok(rendered.includes('Send member ID &amp; welcome email'))
  assert.ok(rendered.includes('/admin/members/' + memberId(21)))
  assert.equal(rendered.includes('Verified member ID'), false)
})

dbTest('WhatsApp support requires a valid number and stores a request without a member ID', async () => {
  const submit = app('app/api/membership/support/route.ts').POST
  const details = { issueType: 'whatsapp', email: 'community-help@example.test' }
  assert.equal((await submit(request(details))).status, 400)
  assert.equal((await submit(request({ ...details, whatsappNumber: 'invalid' }))).status, 400)
  const response = await submit(request({ ...details, whatsappNumber: '0801 234 5678' }))
  assert.equal(response.status, 201)
  assert.match((await response.json()).message, /WhatsApp number/)
  const { rows } = await postgres.query("SELECT id, issue_type, whatsapp_number, member_id_hint, whatsapp_added_at, message FROM membership_support_requests WHERE reply_email = 'community-help@example.test'")
  assert.equal(rows[0].issue_type, 'whatsapp')
  assert.equal(rows[0].whatsapp_number, '+2348012345678')
  assert.equal(rows[0].member_id_hint, null)
  assert.equal(rows[0].whatsapp_added_at, null)
  assert.match(rows[0].message, /add me manually/)
})

dbTest('admin sees WhatsApp details and records manual addition after completing it', async () => {
  const { rows } = await postgres.query("SELECT id FROM membership_support_requests WHERE reply_email = 'community-help@example.test'")
  const id = rows[0].id
  const page = app('app/admin/(protected)/members/support/page.tsx').default
  admin = true
  const rendered = renderToStaticMarkup(await page({ searchParams: Promise.resolve({ request: id }) }))
  assert.ok(rendered.includes('+2348012345678'))
  assert.ok(rendered.includes('https://wa.me/2348012345678'))
  assert.ok(rendered.includes('Mark added &amp; resolve'))
  const resolve = app('app/admin/api/members/support/route.ts').POST
  const markAdded = (requestId = id) => new NextRequest('https://wearekamp.org/admin/api/members/support', {
    method: 'POST', body: new URLSearchParams({ action: 'resolve_whatsapp', id: requestId }),
  })
  admin = false
  assert.equal((await resolve(markAdded())).status, 403)
  admin = true
  const ordinary = await postgres.query("SELECT id FROM membership_support_requests WHERE reply_email = '21@example.test'")
  const rejected = await resolve(markAdded(ordinary.rows[0].id))
  assert.match(rejected.headers.get('location'), /result=unavailable/)
  assert.match((await resolve(markAdded())).headers.get('location'), /result=saved/)
  const added = await postgres.query('SELECT whatsapp_added_at, resolved_at FROM membership_support_requests WHERE id = $1', [id])
  assert.ok(added.rows[0].whatsapp_added_at)
  assert.ok(added.rows[0].resolved_at)
})

dbTest('the community support link opens the WhatsApp number field directly', async () => {
  const page = app('app/(site)/membership/support/page.tsx').default
  const rendered = renderToStaticMarkup(await page({ searchParams: Promise.resolve({ issue: 'whatsapp' }) }))
  assert.ok(rendered.includes('name="whatsappNumber"'))
  assert.ok(rendered.includes('Request help joining WhatsApp'))
  assert.ok(rendered.includes('Anything else we should know? (optional)'))
})

dbTest('university counts match their CSV rosters across aliases and unconfirmed names', async () => {
  await postgres.query("UPDATE members SET university = 'FUNAAB' WHERE membership_type = 'professional'")
  const institutions = [
    'Federal University of Agriculture, Abeokuta',
    'Federal university of agriculture Abeokuta FUNAAB',
    'FUNAAB',
    'Federal College of Education, Abeokuta',
    'Univer',
  ]
  for (const [index, university] of institutions.entries()) {
    await postgres.query('UPDATE members SET university = $1 WHERE member_id = $2', [university, memberId(index + 1)])
  }
  const { getUniversityCounts, getUniversityRoster } = app('lib/university-data.ts')
  const groups = await getUniversityCounts()
  const [total] = (await postgres.query("SELECT COUNT(*)::int AS count FROM members WHERE membership_type = 'student' AND university IS NOT NULL AND BTRIM(university) <> ''")).rows
  assert.equal(groups.reduce((sum, group) => sum + group.count, 0), total.count)
  const funaab = groups.find((group) => group.fullName === 'Federal University of Agriculture, Abeokuta')
  assert.equal(funaab.count, 3)
  assert.equal(funaab.needsReview, false)
  assert.equal(groups.find((group) => group.fullName === 'Univer').needsReview, true)
  const seen = new Set()
  for (const group of groups) {
    const roster = await getUniversityRoster(group.fullName)
    assert.equal(roster.length, group.count)
    for (const member of roster) {
      assert.equal(seen.has(member.member_id), false)
      seen.add(member.member_id)
    }
  }
  const aliasRoster = await getUniversityRoster('FUNAAB')
  assert.equal(aliasRoster.length, 3)
  const exportMembers = app('app/admin/api/members/export/route.ts').GET
  admin = false
  const url = 'https://wearekamp.org/admin/api/members/export?university=FUNAAB'
  assert.equal((await exportMembers(new NextRequest(url))).status, 401)
  admin = true
  const response = await exportMembers(new NextRequest(url))
  assert.equal(response.status, 200)
  const csv = await response.text()
  for (const index of [1, 2, 3]) assert.ok(csv.includes(memberId(index)))
  assert.equal(csv.includes(memberId(4)), false)
  assert.equal((await getUniversityRoster('Unknown test school')).length, 0)
})

dbTest('student registration canonicalizes an institution typed without selecting an API result', async () => {
  await postgres.exec('UPDATE member_number_counters SET last_number = 1000')
  const form = new FormData()
  form.set('data', JSON.stringify({
    firstName: 'Campus', lastName: 'Student', email: 'canonical-student@example.test', phone: '08000000002',
    membershipType: 'student', university: 'Federal university of agriculture abeokuta(FUNAAB)',
    studyLevel: '100L', dateOfBirth: '2000-01-01', gender: 'Female', stateOfOrigin: 'Ogun',
    whyJoin: 'I want to join the mentoring community.',
  }))
  const photo = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jBFsAAAAASUVORK5CYII=', 'base64')
  form.set('passportPhoto', new File([photo], 'photo.png', { type: 'image/png' }))
  const register = app('app/api/membership/route.ts').POST
  const response = await register(new NextRequest('https://wearekamp.org/api/membership', { method: 'POST', body: form }))
  assert.equal(response.status, 201)
  const { rows } = await postgres.query("SELECT university FROM members WHERE email = 'canonical-student@example.test'")
  assert.equal(rows[0].university, 'Federal University of Agriculture, Abeokuta')
})
