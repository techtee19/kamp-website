# Graph Report - kamp-website  (2026-11-19)

## Corpus Check
- 280 files · ~100,766 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .ico 3, (none) 2, .example 1)

## Summary
- 1280 nodes · 2944 edges · 104 communities (69 shown, 35 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8bdc8321`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- membership/route.ts
- (protected)/dashboard/page.tsx
- migrate-events.mjs
- register/route.ts
- db
- schemas/index.ts
- readJsonRequest
- getAdminSession
- queries.ts
- Package Development Dependencies
- sanity.config.ts
- Homepage Sections
- Application Dependencies
- TypeScript Configuration
- request-code/route.ts
- (site)/page.tsx
- check-in/verify/route.ts
- leader-validations.ts
- Leadership and Engagement Migrations
- Community Email Campaigns
- Navigation and Footer
- Brand Asset Generation
- [memberId]/page.tsx
- Event Check-in Migrations
- email.ts
- (protected)/events/[slug]/page.tsx
- (site)/events/page.tsx
- MembershipForm.tsx
- programs/page.tsx
- members/page.tsx
- RegistrationForm.tsx
- getClientIp
- Core Database Migrations
- Development Dependencies
- donate/route.ts
- client.ts
- leader-auth.ts
- requireLeader
- sanity.ts
- admin-session.ts
- (auth)/login/page.tsx
- registration.test.mjs
- Application Root Layout
- migrate-gallery.mjs
- member-card.tsx
- Vercel Deployment Config
- quoteEventTableName
- Prettier Configuration
- InstitutionCombobox.tsx
- Member Table Migration
- postgres
- Database Type Definitions
- Admin Dashboard Loading
- check-in/login/page.tsx
- Site Loading Skeletons
- (protected)/leaders/page.tsx
- WhatsAppJoinAction.tsx
- Rate Limit Migration
- MembershipForm
- allowBuilds
- verify/page.tsx
- 018_leaders_portal.sql
- PostCSS Configuration
- gallery-data.ts
- (site)/events/[slug]/page.tsx
- CameraTicketScanner
- invite/page.tsx
- GalleryMarquee.tsx
- membership/support/page.tsx
- (protected)/requests/[id]/page.tsx
- lucide-react
- db-migrate.ts
- 019_event_member_otp_audit.sql
- load
- next
- validate/route.ts
- remind/route.ts
- leaders/api/logout/route.ts

## God Nodes (most connected - your core abstractions)
1. `db` - 146 edges
2. `next` - 131 edges
3. `readJsonRequest()` - 64 edges
4. `getAdminSession()` - 56 edges
5. `react` - 56 edges
6. `isSameOriginAdminRequest()` - 44 edges
7. `requestBodyErrorResponse()` - 42 edges
8. `getClientIp()` - 31 edges
9. `lucide-react` - 27 edges
10. `rateLimit()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `AdminMembershipSupport()` --calls--> `getAdminSession()`  [EXTRACTED]
  app/admin/(protected)/members/support/page.tsx → lib/admin-session.ts
- `AdminMembershipSupport()` --calls--> `getSiteOrigin()`  [EXTRACTED]
  app/admin/(protected)/members/support/page.tsx → lib/community.ts
- `POST()` --calls--> `isSameOriginAdminRequest()`  [EXTRACTED]
  app/admin/api/members/support/reply/route.ts → lib/admin-request.ts
- `POST()` --calls--> `getAdminSession()`  [EXTRACTED]
  app/admin/api/members/support/reply/route.ts → lib/admin-session.ts
- `POST()` --calls--> `queueSupportReply()`  [EXTRACTED]
  app/admin/api/members/support/reply/route.ts → lib/membership-support-reply.ts

## Import Cycles
- None detected.

## Communities (104 total, 35 thin omitted)

### Community 0 - "membership/route.ts"
Cohesion: 0.06
Nodes (57): campaignCounts(), dynamic, POST(), runtime, dynamic, LeadershipInvitationsPage(), currentLagosYear(), LeadershipRegistrationError (+49 more)

### Community 1 - "(protected)/dashboard/page.tsx"
Cohesion: 0.06
Nodes (57): AdminDashboardPage(), AnalyticsDirectoryLoading(), AnalyticsPanelLoading(), DashboardAnalytics(), DashboardOverview(), dynamic, EventRegistrationsLoading(), EventRegistrationsOverview() (+49 more)

### Community 2 - "migrate-events.mjs"
Cohesion: 0.13
Nodes (15): KampEvent, kampEvents, buildDocument(), client, DRY_RUN, IMAGE_ROOT, main(), MONTHS (+7 more)

### Community 3 - "register/route.ts"
Cohesion: 0.13
Nodes (20): maxDuration, POST(), runtime, schema, dynamic, GET(), runtime, assertSafeTableName() (+12 more)

### Community 4 - "db"
Cohesion: 0.12
Nodes (20): dynamic, GET(), runtime, dynamic, GET(), dynamic, GET(), DELETE() (+12 more)

### Community 5 - "schemas/index.ts"
Cohesion: 0.12
Nodes (14): dynamic, @sanity/vision@^5.31.1, sanity, @sanity/vision, plugins, eventSchema, galleryEventSchema, schemaTypes (+6 more)

### Community 6 - "readJsonRequest"
Cohesion: 0.11
Nodes (25): dynamic, POST(), runtime, bodySchema, dynamic, PATCH(), runtime, DELETE() (+17 more)

### Community 7 - "getAdminSession"
Cohesion: 0.11
Nodes (26): createSchema, DELETE(), dynamic, eventSlugSchema, GET(), POST(), revokeSchema, runtime (+18 more)

### Community 8 - "queries.ts"
Cohesion: 0.21
Nodes (11): AboutPage(), FounderCard, revalidate, TeamCard, values, builder, FOUNDER_QUERY, PAST_EVENTS_QUERY (+3 more)

### Community 9 - "Package Development Dependencies"
Cohesion: 0.10
Nodes (27): eslintConfig, devDependencies, eslint@^9, eslint-config-next@16.3.0, prettier@^3.9.6, prettier-plugin-tailwindcss@^0.8.1, tailwindcss@^4, @tailwindcss/postcss@^4 (+19 more)

### Community 10 - "sanity.config.ts"
Cohesion: 0.24
Nodes (6): @sanity/image-url@2, @sanity/image-url, apiVersion, dataset, projectId, builder

### Community 11 - "Homepage Sections"
Cohesion: 0.12
Nodes (13): AdminLoginPage(), HomePage(), GetInvolvedTabs(), tabs, HeroImageRotator(), heroImages, QuickStory(), words (+5 more)

### Community 12 - "Application Dependencies"
Cohesion: 0.09
Nodes (23): dependencies, clsx@^2.1.1, next@16.3.0, next-auth@^4.24.15, next-sanity@13, qrcode@^1.5.4, react@19.2.8, @react-email/components@^1.0.12 (+15 more)

### Community 13 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 14 - "request-code/route.ts"
Cohesion: 0.33
Nodes (7): dynamic, POST(), requestSchema, runtime, codeHash(), createCheckinLoginCode(), verifyCheckinLoginCode()

### Community 15 - "(site)/page.tsx"
Cohesion: 0.17
Nodes (12): ContactPage(), revalidate, actions, fallbackStats, partners, revalidate, ContactForm(), client (+4 more)

### Community 16 - "check-in/verify/route.ts"
Cohesion: 0.21
Nodes (14): dynamic, POST(), runtime, dynamic, POST(), requestSchema, runtime, CHECKIN_SESSION_COOKIE (+6 more)

### Community 17 - "leader-validations.ts"
Cohesion: 0.09
Nodes (24): NewLeaderReportPage(), NewLeaderRequestPage(), LeaderReportForm(), LeaderRequestForm(), LeaderSelect(), onKeyDown(), openAtSelected(), LeaderSelectOption (+16 more)

### Community 18 - "Leadership and Engagement Migrations"
Cohesion: 0.08
Nodes (24): leadership_invites_expiry_idx, leadership_invites_pending_email_idx, public.leadership_member_id_counters, public.leadership_registration_invites, member_community_invite_links_member_idx, public.member_community_invite_links, public.member_community_tracking, community_email_campaign_pending_idx (+16 more)

### Community 19 - "Community Email Campaigns"
Cohesion: 0.21
Nodes (11): dynamic, filters, formatDate(), MemberEngagementPage(), safePage(), CommunityEmailCampaign(), prepare(), send() (+3 more)

### Community 20 - "Navigation and Footer"
Cohesion: 0.19
Nodes (9): SiteLayout(), Footer(), links, DropdownName, exploreLinks, involvedLinks, Navbar(), primaryLinks (+1 more)

### Community 21 - "Brand Asset Generation"
Cohesion: 0.18
Nodes (9): BG, chip(), emblem(), flame(), fs, path, sharp, SRC (+1 more)

### Community 22 - "[memberId]/page.tsx"
Cohesion: 0.25
Nodes (5): dynamic, MemberProfilePage(), DeleteMemberButton(), EditMemberPosition(), ResendCardButton()

### Community 23 - "Event Check-in Migrations"
Cohesion: 0.28
Nodes (11): idx_registry_event_id, idx_registry_event_slug, public.event_tables_registry, event_checkin_audit_event_created_idx, event_checkin_login_codes_operator_idx, event_checkin_operators_email_idx, event_checkin_sessions_operator_idx, public.event_checkin_audit (+3 more)

### Community 24 - "email.ts"
Cohesion: 0.10
Nodes (42): GET(), maxDuration, runtime, POST(), runtime, POST(), runtime, POST() (+34 more)

### Community 25 - "(protected)/events/[slug]/page.tsx"
Cohesion: 0.26
Nodes (8): AdminEventRegistrationsPage(), dynamic, CheckinOperatorManager(), addOperator(), load(), revoke(), Operator, SendReminderButton()

### Community 26 - "(site)/events/page.tsx"
Cohesion: 0.23
Nodes (9): EventCard(), EventsPage(), formatEventDate(), revalidate, EventCardProps, FeaturedEventsCarousel(), formatEventDate(), publicEventCache (+1 more)

### Community 27 - "MembershipForm.tsx"
Cohesion: 0.15
Nodes (15): membershipFieldLabels, studyLevels, ContactInput, contactSchema, DonationInput, donationSchema, KAMP_POSITIONS, kampMemberRegistrationSchema (+7 more)

### Community 28 - "programs/page.tsx"
Cohesion: 0.18
Nodes (9): executiveRoles, focusAreas, journey, ProgramCard, revalidate, @portabletext/react@^8.0.0, @portabletext/react, PROGRAMS_QUERY (+1 more)

### Community 29 - "members/page.tsx"
Cohesion: 0.38
Nodes (4): AdminMembersPage(), dynamic, escapeLike(), MembersSearch()

### Community 30 - "RegistrationForm.tsx"
Cohesion: 0.24
Nodes (12): Failure, Member, RegistrationForm(), confirmRegistration(), editId(), post(), requestCode(), save() (+4 more)

### Community 31 - "getClientIp"
Cohesion: 0.19
Nodes (16): POST(), runtime, verifyPassword(), dynamic, POST(), runtime, POST(), POST() (+8 more)

### Community 32 - "Core Database Migrations"
Cohesion: 0.29
Nodes (8): contact_submissions, donations, events_registrations, idx_donations_email, idx_donations_paystack_ref, idx_registrations_email, idx_registrations_event_id, idx_registrations_event_email_unique

### Community 33 - "Development Dependencies"
Cohesion: 0.18
Nodes (11): scripts, admin:hash-password, build, db:check, db:migrate, dev, lint, migrate:events (+3 more)

### Community 34 - "donate/route.ts"
Cohesion: 0.29
Nodes (6): POST(), generateReference(), initializeTransaction(), InitTransactionParams, InitTransactionResponse, VerifyTransactionResponse

### Community 35 - "client.ts"
Cohesion: 0.38
Nodes (5): EventSnapshot, EventWebhookPayload, runtime, next-sanity, publicEventsTag

### Community 36 - "leader-auth.ts"
Cohesion: 0.23
Nodes (12): POST(), runtime, POST(), runtime, LeadersIndexPage(), createLeaderSession(), generateToken(), getLeader() (+4 more)

### Community 37 - "requireLeader"
Cohesion: 0.27
Nodes (7): dynamic, LeaderDashboardPage(), dynamic, LeaderReportDetailPage(), dynamic, LeaderRequestDetailPage(), requireLeader()

### Community 38 - "sanity.ts"
Cohesion: 0.14
Nodes (18): GalleryIntro(), GalleryPage(), revalidate, GalleryAlbum(), GalleryAlbumProps, slots, GalleryAlbums(), GalleryAlbumsProps (+10 more)

### Community 39 - "admin-session.ts"
Cohesion: 0.46
Nodes (6): POST(), createAdminSession(), destroyAdminSession(), getSecret(), signValue(), verifyValue()

### Community 41 - "registration.test.mjs"
Cohesion: 0.07
Nodes (21): resend(), { canonicalInstitution }, check(), { classifyEmailFailure, EmailProviderError, retryDelay }, codes, { countdownSeconds, eventSlug }, load, memberId() (+13 more)

### Community 42 - "Application Root Layout"
Cohesion: 0.29
Nodes (4): metadata, urbanist, @vercel/analytics@^2.0.1, @vercel/analytics

### Community 43 - "migrate-gallery.mjs"
Cohesion: 0.17
Nodes (16): @sanity/client@7.26.2, @sanity/client, absolutePathFor(), assertFilesExist(), buildDocument(), client, DRY_RUN, fetchExistingAssets() (+8 more)

### Community 44 - "member-card.tsx"
Cohesion: 0.19
Nodes (10): dynamic, GET(), runtime, CARD, generateMemberCardPDF(), MemberCard(), MemberCardData, styles (+2 more)

### Community 45 - "Vercel Deployment Config"
Cohesion: 0.25
Nodes (7): maxDuration, crons, framework, functions, app/api/paystack/webhook/route.ts, regions, $schema

### Community 46 - "quoteEventTableName"
Cohesion: 0.12
Nodes (21): dynamic, POST(), runtime, dynamic, POST(), runtime, dynamic, GET() (+13 more)

### Community 47 - "Prettier Configuration"
Cohesion: 0.33
Nodes (5): plugins, printWidth, semi, singleQuote, trailingComma

### Community 48 - "InstitutionCombobox.tsx"
Cohesion: 0.24
Nodes (7): GET(), normalize(), InstitutionComboboxProps, TYPE_STYLES, INSTITUTION_NAMES, NIGERIAN_INSTITUTIONS, NigerianInstitution

### Community 49 - "Member Table Migration"
Cohesion: 0.60
Nodes (4): member_number_counters, members, members_status_idx, members_year_joined_idx

### Community 50 - "postgres"
Cohesion: 0.50
Nodes (3): postgres@^3.4.9, postgres, db

### Community 51 - "Database Type Definitions"
Cohesion: 0.50
Nodes (3): ContactSubmissionRow, DonationRow, RegistrationRow

### Community 53 - "check-in/login/page.tsx"
Cohesion: 0.38
Nodes (3): CheckinLoginPage(), dynamic, CheckinLoginForm()

### Community 55 - "(protected)/leaders/page.tsx"
Cohesion: 0.13
Nodes (13): dynamic, LeadersAdminPage(), dynamic, LeaderReportsAdminPage(), dynamic, LeaderRequestsAdminPage(), statuses, CreateLeader() (+5 more)

### Community 56 - "WhatsAppJoinAction.tsx"
Cohesion: 0.36
Nodes (6): CommunityJoinPage(), metadata, getHashToken(), getServerHashToken(), subscribeToHashChange(), WhatsAppJoinAction()

### Community 58 - "MembershipForm"
Cohesion: 0.24
Nodes (8): benefits, MembershipPage(), metadata, inputClass(), MembershipForm(), submit(), InstitutionCombobox(), eventSlug()

### Community 59 - "allowBuilds"
Cohesion: 0.50
Nodes (3): allowBuilds, esbuild, unrs-resolver

### Community 77 - "018_leaders_portal.sql"
Cohesion: 0.32
Nodes (11): idx_login_tokens_expiry, idx_login_tokens_leader, idx_reports_created, idx_reports_leader, idx_requests_created, idx_requests_leader, idx_requests_status, public.leader_login_tokens (+3 more)

### Community 87 - "gallery-data.ts"
Cohesion: 0.25
Nodes (7): emerge2025, featuredPhotos, GALLERY_IMAGE_DIR, KampGalleryAlbum, kampGalleryAlbums, KampGalleryPhoto, remainingFiles

### Community 88 - "(site)/events/[slug]/page.tsx"
Cohesion: 0.24
Nodes (8): descriptionComponents, EventDetailPage(), formatDate(), formatTime(), revalidate, freshClient, EVENT_BY_SLUG_QUERY, EVENT_SLUGS_QUERY

### Community 89 - "CameraTicketScanner"
Cohesion: 0.40
Nodes (5): CameraTicketScanner(), controlsStop(), start(), @zxing/browser@^0.2.1, @zxing/browser

### Community 90 - "invite/page.tsx"
Cohesion: 0.38
Nodes (5): dynamic, LeadershipInvitationPage(), metadata, Invitation, LeadershipInviteRegistration()

### Community 91 - "GalleryMarquee.tsx"
Cohesion: 0.43
Nodes (6): columns, GalleryMarquee(), mobileColumns, MosaicRow(), Row, Tile()

### Community 92 - "membership/support/page.tsx"
Cohesion: 0.47
Nodes (3): MembershipSupportPage(), metadata, MembershipSupportForm()

### Community 93 - "(protected)/requests/[id]/page.tsx"
Cohesion: 0.31
Nodes (4): AdminLeaderRequestDetail(), dynamic, ReviewLeaderRequest(), SendRequestAdminNotification()

### Community 94 - "lucide-react"
Cohesion: 0.05
Nodes (31): ProtectedAdminLayout(), AdminMembershipSupport(), deliveryLabels, dynamic, nextStep(), DonationReference(), DonateSuccessPage(), pathways (+23 more)

### Community 96 - "019_event_member_otp_audit.sql"
Cohesion: 0.83
Nodes (3): event_member_otp_audit_created_idx, event_member_otp_audit_event_created_idx, public.event_member_otp_audit

### Community 98 - "next"
Cohesion: 0.11
Nodes (10): metadata, LeaderPortalLayout(), metadata, LeaderLogoutButton(), LeaderPortalNav(), links, csp, nextConfig (+2 more)

### Community 99 - "validate/route.ts"
Cohesion: 0.22
Nodes (4): dynamic, POST(), runtime, tokenSchema

### Community 100 - "remind/route.ts"
Cohesion: 0.50
Nodes (4): dynamic, lagosDate(), POST(), runtime

## Knowledge Gaps
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `membership/route.ts`, `(protected)/dashboard/page.tsx`, `migrate-events.mjs`, `register/route.ts`, `db`, `readJsonRequest`, `getAdminSession`, `queries.ts`, `Package Development Dependencies`, `Homepage Sections`, `Application Dependencies`, `request-code/route.ts`, `(site)/page.tsx`, `check-in/verify/route.ts`, `leader-validations.ts`, `Community Email Campaigns`, `Navigation and Footer`, `[memberId]/page.tsx`, `email.ts`, `(protected)/events/[slug]/page.tsx`, `(site)/events/page.tsx`, `MembershipForm.tsx`, `programs/page.tsx`, `members/page.tsx`, `RegistrationForm.tsx`, `getClientIp`, `donate/route.ts`, `client.ts`, `leader-auth.ts`, `requireLeader`, `sanity.ts`, `admin-session.ts`, `(auth)/login/page.tsx`, `registration.test.mjs`, `Application Root Layout`, `quoteEventTableName`, `InstitutionCombobox.tsx`, `check-in/login/page.tsx`, `(protected)/leaders/page.tsx`, `WhatsAppJoinAction.tsx`, `MembershipForm`, `verify/page.tsx`, `(site)/events/[slug]/page.tsx`, `invite/page.tsx`, `GalleryMarquee.tsx`, `(protected)/requests/[id]/page.tsx`, `lucide-react`, `validate/route.ts`, `remind/route.ts`, `leaders/api/logout/route.ts`?**
  _High betweenness centrality (0.282) - this node is a cross-community bridge._
- **Should `membership/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.058738738738738736 - nodes in this community are weakly interconnected._
- **Why does `db` connect `db` to `membership/route.ts`, `(protected)/dashboard/page.tsx`, `register/route.ts`, `readJsonRequest`, `getAdminSession`, `request-code/route.ts`, `check-in/verify/route.ts`, `Community Email Campaigns`, `[memberId]/page.tsx`, `email.ts`, `(protected)/events/[slug]/page.tsx`, `members/page.tsx`, `getClientIp`, `donate/route.ts`, `leader-auth.ts`, `requireLeader`, `quoteEventTableName`, `check-in/login/page.tsx`, `(protected)/leaders/page.tsx`, `(protected)/requests/[id]/page.tsx`, `lucide-react`, `db-migrate.ts`, `validate/route.ts`, `remind/route.ts`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Should `(protected)/dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06086956521739131 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Homepage Sections` to `membership/route.ts`, `(protected)/dashboard/page.tsx`, `migrate-events.mjs`, `register/route.ts`, `Package Development Dependencies`, `Application Dependencies`, `(site)/page.tsx`, `leader-validations.ts`, `Community Email Campaigns`, `Navigation and Footer`, `[memberId]/page.tsx`, `(protected)/events/[slug]/page.tsx`, `(site)/events/page.tsx`, `MembershipForm.tsx`, `members/page.tsx`, `RegistrationForm.tsx`, `sanity.ts`, `(auth)/login/page.tsx`, `registration.test.mjs`, `member-card.tsx`, `quoteEventTableName`, `InstitutionCombobox.tsx`, `check-in/login/page.tsx`, `(protected)/leaders/page.tsx`, `WhatsAppJoinAction.tsx`, `verify/page.tsx`, `CameraTicketScanner`, `invite/page.tsx`, `GalleryMarquee.tsx`, `membership/support/page.tsx`, `(protected)/requests/[id]/page.tsx`, `lucide-react`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Should `migrate-events.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.12857142857142856 - nodes in this community are weakly interconnected._
- **Should `register/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12873563218390804 - nodes in this community are weakly interconnected._