# Graph Report - kamp-website  (2026-11-19)

## Corpus Check
- 283 files · ~102,385 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .ico 3, (none) 2, .example 1)

## Summary
- 1296 nodes · 2982 edges · 105 communities (71 shown, 34 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `65fbe467`
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
- leadership-invites/route.ts
- queries.ts
- Package Development Dependencies
- member-code/route.ts
- Homepage Sections
- Application Dependencies
- TypeScript Configuration
- ticket.tsx
- contact/page.tsx
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
- reports/route.ts
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
- leader-validations.ts
- Site Loading Skeletons
- (protected)/leaders/page.tsx
- WhatsAppJoinAction.tsx
- Rate Limit Migration
- MembershipForm
- allowBuilds
- verify/page.tsx
- 018_leaders_portal.sql
- PostCSS Configuration
- (protected)/layout.tsx
- LeaderPortalNav.tsx
- checkin/page.tsx
- invite/page.tsx
- GalleryMarquee.tsx
- membership/support/page.tsx
- (protected)/requests/[id]/page.tsx
- lucide-react
- db-migrate.ts
- 019_event_member_otp_audit.sql
- load
- next
- getClientIp
- remind/route.ts
- eslint.config.mjs
- success/page.tsx

## God Nodes (most connected - your core abstractions)
1. `db` - 148 edges
2. `next` - 131 edges
3. `readJsonRequest()` - 64 edges
4. `getAdminSession()` - 58 edges
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
- `GET()` --calls--> `getAdminSession()`  [EXTRACTED]
  app/admin/api/members/support/reply/images/[id]/route.ts → lib/admin-session.ts
- `POST()` --calls--> `queueSupportReply()`  [EXTRACTED]
  app/admin/api/members/support/reply/route.ts → lib/membership-support-reply.ts
- `POST()` --calls--> `scheduleRegistrationEmail()`  [EXTRACTED]
  app/admin/api/members/support/reply/route.ts → lib/registration-background.ts

## Import Cycles
- None detected.

## Communities (105 total, 34 thin omitted)

### Community 0 - "membership/route.ts"
Cohesion: 0.08
Nodes (38): campaignCounts(), dynamic, POST(), runtime, maxDuration, POST(), runtime, schema (+30 more)

### Community 1 - "(protected)/dashboard/page.tsx"
Cohesion: 0.06
Nodes (58): AdminDashboardPage(), AnalyticsDirectoryLoading(), AnalyticsPanelLoading(), DashboardAnalytics(), DashboardOverview(), dynamic, EventRegistrationsLoading(), EventRegistrationsOverview() (+50 more)

### Community 2 - "migrate-events.mjs"
Cohesion: 0.13
Nodes (15): KampEvent, kampEvents, buildDocument(), client, DRY_RUN, IMAGE_ROOT, main(), MONTHS (+7 more)

### Community 3 - "register/route.ts"
Cohesion: 0.24
Nodes (12): maxDuration, POST(), runtime, schema, assertSafeTableName(), createEventRegistrationTable(), DuplicateRegistrationError, EventFullError (+4 more)

### Community 4 - "db"
Cohesion: 0.11
Nodes (21): dynamic, GET(), runtime, dynamic, GET(), runtime, maxDuration, POST() (+13 more)

### Community 5 - "schemas/index.ts"
Cohesion: 0.08
Nodes (21): dynamic, sanity@^5.31.1, @sanity/image-url@2, @sanity/vision@^5.31.1, sanity, @sanity/image-url, @sanity/vision, apiVersion (+13 more)

### Community 6 - "readJsonRequest"
Cohesion: 0.10
Nodes (41): createSchema, DELETE(), dynamic, eventSlugSchema, GET(), POST(), revokeSchema, runtime (+33 more)

### Community 7 - "leadership-invites/route.ts"
Cohesion: 0.33
Nodes (4): dynamic, InvitationError, invitationSchema, runtime

### Community 8 - "queries.ts"
Cohesion: 0.13
Nodes (17): AboutPage(), FounderCard, revalidate, TeamCard, values, descriptionComponents, EventDetailPage(), formatDate() (+9 more)

### Community 9 - "Package Development Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, prettier@^3.9.6, prettier-plugin-tailwindcss@^0.8.1, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/qrcode@^1.5.6, @types/react@^19 (+14 more)

### Community 10 - "member-code/route.ts"
Cohesion: 0.15
Nodes (24): limited(), maxDuration, POST(), runtime, schema, POST(), runtime, schema (+16 more)

### Community 11 - "Homepage Sections"
Cohesion: 0.12
Nodes (16): actions, fallbackStats, HomePage(), partners, revalidate, GetInvolvedTabs(), tabs, HeroImageRotator() (+8 more)

### Community 12 - "Application Dependencies"
Cohesion: 0.09
Nodes (23): dependencies, clsx@^2.1.1, next@16.3.0, next-auth@^4.24.15, next-sanity@13, qrcode@^1.5.4, react@19.2.8, @react-email/components@^1.0.12 (+15 more)

### Community 13 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 14 - "ticket.tsx"
Cohesion: 0.23
Nodes (8): dynamic, GET(), runtime, generateTicketPDF(), PREVIEW_TICKET_REF, styles, TicketData, TicketDocument()

### Community 15 - "contact/page.tsx"
Cohesion: 0.38
Nodes (5): ContactPage(), revalidate, ContactForm(), SITE_SETTINGS_QUERY, SiteSettings

### Community 16 - "check-in/verify/route.ts"
Cohesion: 0.14
Nodes (20): dynamic, POST(), runtime, dynamic, POST(), requestSchema, runtime, dynamic (+12 more)

### Community 17 - "leader-validations.ts"
Cohesion: 0.16
Nodes (14): NewLeaderReportPage(), NewLeaderRequestPage(), LeaderReportForm(), LeaderRequestForm(), LeaderSelect(), onKeyDown(), openAtSelected(), LeaderSelectOption (+6 more)

### Community 18 - "Leadership and Engagement Migrations"
Cohesion: 0.07
Nodes (25): leadership_invites_expiry_idx, leadership_invites_pending_email_idx, public.leadership_member_id_counters, public.leadership_registration_invites, member_community_invite_links_member_idx, public.member_community_invite_links, public.member_community_tracking, community_email_campaign_pending_idx (+17 more)

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
Nodes (41): POST(), GET(), maxDuration, runtime, POST(), runtime, POST(), runtime (+33 more)

### Community 25 - "(protected)/events/[slug]/page.tsx"
Cohesion: 0.18
Nodes (10): AdminLoginPage(), AdminEventRegistrationsPage(), dynamic, CheckinOperatorManager(), addOperator(), load(), revoke(), Operator (+2 more)

### Community 26 - "(site)/events/page.tsx"
Cohesion: 0.19
Nodes (11): EventCard(), EventsPage(), formatEventDate(), revalidate, EventCardProps, FeaturedEventsCarousel(), formatEventDate(), publicEventCache (+3 more)

### Community 27 - "MembershipForm.tsx"
Cohesion: 0.17
Nodes (14): membershipFieldLabels, studyLevels, ContactInput, contactSchema, DonationInput, KAMP_POSITIONS, kampMemberRegistrationSchema, MembershipInput (+6 more)

### Community 28 - "programs/page.tsx"
Cohesion: 0.17
Nodes (10): executiveRoles, focusAreas, journey, ProgramCard, revalidate, @portabletext/react@^8.0.0, @portabletext/react, client (+2 more)

### Community 29 - "members/page.tsx"
Cohesion: 0.38
Nodes (4): AdminMembersPage(), dynamic, escapeLike(), MembersSearch()

### Community 30 - "RegistrationForm.tsx"
Cohesion: 0.24
Nodes (12): Failure, Member, RegistrationForm(), confirmRegistration(), editId(), post(), requestCode(), save() (+4 more)

### Community 31 - "reports/route.ts"
Cohesion: 0.23
Nodes (11): POST(), POST(), runtime, POST(), runtime, getAdminNotificationEmails(), sendNewSubmissionNotices(), destroyLeaderSession() (+3 more)

### Community 32 - "Core Database Migrations"
Cohesion: 0.29
Nodes (8): contact_submissions, donations, events_registrations, idx_donations_email, idx_donations_paystack_ref, idx_registrations_email, idx_registrations_event_id, idx_registrations_event_email_unique

### Community 33 - "Development Dependencies"
Cohesion: 0.18
Nodes (11): scripts, admin:hash-password, build, db:check, db:migrate, dev, lint, migrate:events (+3 more)

### Community 34 - "donate/route.ts"
Cohesion: 0.25
Nodes (7): POST(), generateReference(), initializeTransaction(), InitTransactionParams, InitTransactionResponse, VerifyTransactionResponse, donationSchema

### Community 35 - "client.ts"
Cohesion: 0.32
Nodes (6): EventSnapshot, EventWebhookPayload, runtime, next-sanity, freshClient, publicEventsTag

### Community 36 - "leader-auth.ts"
Cohesion: 0.25
Nodes (10): POST(), runtime, POST(), runtime, createLeaderSession(), generateToken(), getSecret(), hashToken() (+2 more)

### Community 37 - "requireLeader"
Cohesion: 0.27
Nodes (7): dynamic, LeaderDashboardPage(), dynamic, LeaderReportDetailPage(), dynamic, LeaderRequestDetailPage(), requireLeader()

### Community 38 - "sanity.ts"
Cohesion: 0.14
Nodes (18): GalleryIntro(), GalleryPage(), revalidate, GalleryAlbum(), GalleryAlbumProps, slots, GalleryAlbums(), GalleryAlbumsProps (+10 more)

### Community 39 - "admin-session.ts"
Cohesion: 0.22
Nodes (11): POST(), dynamic, GET(), dynamic, GET(), createAdminSession(), destroyAdminSession(), getSecret() (+3 more)

### Community 40 - "(auth)/login/page.tsx"
Cohesion: 0.33
Nodes (5): LeaderLoginPage(), LeadersIndexPage(), PortalLoginForm(), getLeader(), safeEqual()

### Community 41 - "registration.test.mjs"
Cohesion: 0.07
Nodes (21): resend(), { canonicalInstitution }, check(), { classifyEmailFailure, EmailProviderError, retryDelay }, codes, { countdownSeconds, eventSlug }, load, memberId() (+13 more)

### Community 42 - "Application Root Layout"
Cohesion: 0.29
Nodes (4): metadata, urbanist, @vercel/analytics@^2.0.1, @vercel/analytics

### Community 43 - "migrate-gallery.mjs"
Cohesion: 0.12
Nodes (21): emerge2025, featuredPhotos, GALLERY_IMAGE_DIR, KampGalleryAlbum, kampGalleryAlbums, KampGalleryPhoto, remainingFiles, absolutePathFor() (+13 more)

### Community 44 - "member-card.tsx"
Cohesion: 0.19
Nodes (10): dynamic, GET(), runtime, CARD, generateMemberCardPDF(), MemberCard(), MemberCardData, styles (+2 more)

### Community 45 - "Vercel Deployment Config"
Cohesion: 0.25
Nodes (7): maxDuration, crons, framework, functions, app/api/paystack/webhook/route.ts, regions, $schema

### Community 46 - "quoteEventTableName"
Cohesion: 0.14
Nodes (18): dynamic, POST(), runtime, dynamic, POST(), runtime, dynamic, GET() (+10 more)

### Community 47 - "Prettier Configuration"
Cohesion: 0.33
Nodes (5): plugins, printWidth, semi, singleQuote, trailingComma

### Community 48 - "InstitutionCombobox.tsx"
Cohesion: 0.21
Nodes (8): GET(), normalize(), InstitutionCombobox(), InstitutionComboboxProps, TYPE_STYLES, INSTITUTION_NAMES, NIGERIAN_INSTITUTIONS, NigerianInstitution

### Community 49 - "Member Table Migration"
Cohesion: 0.60
Nodes (4): member_number_counters, members, members_status_idx, members_year_joined_idx

### Community 50 - "postgres"
Cohesion: 0.50
Nodes (3): postgres@^3.4.9, postgres, db

### Community 51 - "Database Type Definitions"
Cohesion: 0.50
Nodes (3): ContactSubmissionRow, DonationRow, RegistrationRow

### Community 53 - "leader-validations.ts"
Cohesion: 0.22
Nodes (7): email, leaderCreateSchema, leaderStatusSchema, optionalDate, optionalLongText, requestReviewSchema, safeOptionalUrl

### Community 55 - "(protected)/leaders/page.tsx"
Cohesion: 0.13
Nodes (13): dynamic, LeadersAdminPage(), dynamic, LeaderReportsAdminPage(), dynamic, LeaderRequestsAdminPage(), statuses, CreateLeader() (+5 more)

### Community 56 - "WhatsAppJoinAction.tsx"
Cohesion: 0.36
Nodes (6): CommunityJoinPage(), metadata, getHashToken(), getServerHashToken(), subscribeToHashChange(), WhatsAppJoinAction()

### Community 58 - "MembershipForm"
Cohesion: 0.28
Nodes (7): benefits, MembershipPage(), metadata, inputClass(), MembershipForm(), submit(), eventSlug()

### Community 59 - "allowBuilds"
Cohesion: 0.50
Nodes (3): allowBuilds, esbuild, unrs-resolver

### Community 77 - "018_leaders_portal.sql"
Cohesion: 0.32
Nodes (11): idx_login_tokens_expiry, idx_login_tokens_leader, idx_reports_created, idx_reports_leader, idx_requests_created, idx_requests_leader, idx_requests_status, public.leader_login_tokens (+3 more)

### Community 87 - "(protected)/layout.tsx"
Cohesion: 0.39
Nodes (4): ProtectedAdminLayout(), AdminNavigation(), items, LogoutButton()

### Community 88 - "LeaderPortalNav.tsx"
Cohesion: 0.48
Nodes (4): LeaderPortalLayout(), LeaderLogoutButton(), LeaderPortalNav(), links

### Community 89 - "checkin/page.tsx"
Cohesion: 0.22
Nodes (9): dynamic, EventCheckinPage(), CameraTicketScanner(), controlsStop(), start(), CheckinList(), Registrant, @zxing/browser@^0.2.1 (+1 more)

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
Cohesion: 0.06
Nodes (36): AdminMembershipSupport(), deliveryLabels, dynamic, nextStep(), pathways, metadata, dateLabel(), states (+28 more)

### Community 96 - "019_event_member_otp_audit.sql"
Cohesion: 0.83
Nodes (3): event_member_otp_audit_created_idx, event_member_otp_audit_event_created_idx, public.event_member_otp_audit

### Community 98 - "next"
Cohesion: 0.10
Nodes (9): CheckinLoginPage(), dynamic, metadata, metadata, CheckinLoginForm(), csp, nextConfig, config (+1 more)

### Community 99 - "getClientIp"
Cohesion: 0.20
Nodes (9): POST(), runtime, verifyPassword(), POST(), schema, getClientIp(), rateLimit(), rateLimitStatus() (+1 more)

### Community 100 - "remind/route.ts"
Cohesion: 0.50
Nodes (4): dynamic, lagosDate(), POST(), runtime

### Community 101 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.3.0, eslint, eslint-config-next

## Knowledge Gaps
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `membership/route.ts`, `(protected)/dashboard/page.tsx`, `migrate-events.mjs`, `register/route.ts`, `db`, `readJsonRequest`, `leadership-invites/route.ts`, `queries.ts`, `Package Development Dependencies`, `member-code/route.ts`, `Homepage Sections`, `Application Dependencies`, `ticket.tsx`, `contact/page.tsx`, `check-in/verify/route.ts`, `leader-validations.ts`, `Community Email Campaigns`, `Navigation and Footer`, `[memberId]/page.tsx`, `email.ts`, `(protected)/events/[slug]/page.tsx`, `(site)/events/page.tsx`, `MembershipForm.tsx`, `programs/page.tsx`, `members/page.tsx`, `RegistrationForm.tsx`, `reports/route.ts`, `donate/route.ts`, `client.ts`, `leader-auth.ts`, `requireLeader`, `sanity.ts`, `admin-session.ts`, `(auth)/login/page.tsx`, `registration.test.mjs`, `Application Root Layout`, `quoteEventTableName`, `InstitutionCombobox.tsx`, `(protected)/leaders/page.tsx`, `WhatsAppJoinAction.tsx`, `MembershipForm`, `verify/page.tsx`, `(protected)/layout.tsx`, `LeaderPortalNav.tsx`, `checkin/page.tsx`, `invite/page.tsx`, `GalleryMarquee.tsx`, `(protected)/requests/[id]/page.tsx`, `lucide-react`, `getClientIp`, `remind/route.ts`, `success/page.tsx`?**
  _High betweenness centrality (0.365) - this node is a cross-community bridge._
- **Should `membership/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08144796380090498 - nodes in this community are weakly interconnected._
- **Why does `db` connect `db` to `membership/route.ts`, `(protected)/dashboard/page.tsx`, `register/route.ts`, `readJsonRequest`, `leadership-invites/route.ts`, `member-code/route.ts`, `check-in/verify/route.ts`, `Community Email Campaigns`, `[memberId]/page.tsx`, `email.ts`, `(protected)/events/[slug]/page.tsx`, `members/page.tsx`, `reports/route.ts`, `donate/route.ts`, `leader-auth.ts`, `requireLeader`, `admin-session.ts`, `(auth)/login/page.tsx`, `quoteEventTableName`, `(protected)/leaders/page.tsx`, `checkin/page.tsx`, `(protected)/requests/[id]/page.tsx`, `lucide-react`, `db-migrate.ts`, `next`, `getClientIp`, `remind/route.ts`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Should `(protected)/dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05955734406438632 - nodes in this community are weakly interconnected._
- **Why does `react` connect `(protected)/events/[slug]/page.tsx` to `membership/route.ts`, `(protected)/dashboard/page.tsx`, `migrate-events.mjs`, `Package Development Dependencies`, `Homepage Sections`, `Application Dependencies`, `ticket.tsx`, `contact/page.tsx`, `leader-validations.ts`, `Community Email Campaigns`, `Navigation and Footer`, `[memberId]/page.tsx`, `(site)/events/page.tsx`, `MembershipForm.tsx`, `members/page.tsx`, `RegistrationForm.tsx`, `sanity.ts`, `(auth)/login/page.tsx`, `registration.test.mjs`, `member-card.tsx`, `quoteEventTableName`, `InstitutionCombobox.tsx`, `(protected)/leaders/page.tsx`, `WhatsAppJoinAction.tsx`, `verify/page.tsx`, `(protected)/layout.tsx`, `checkin/page.tsx`, `invite/page.tsx`, `GalleryMarquee.tsx`, `membership/support/page.tsx`, `(protected)/requests/[id]/page.tsx`, `lucide-react`, `next`, `success/page.tsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Should `migrate-events.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.12857142857142856 - nodes in this community are weakly interconnected._
- **Should `db` be split into smaller, more focused modules?**
  _Cohesion score 0.11083743842364532 - nodes in this community are weakly interconnected._