# Graph Report - kamp-website  (2026-11-16)

## Corpus Check
- 248 files · ~86,547 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .ico 3, (none) 2, .example 1)

## Summary
- 1112 nodes · 2542 edges · 87 communities (55 shown, 32 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d5aed011`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- rateLimit
- Admin Dashboard Analytics
- migrate-gallery.mjs
- register/route.ts
- readJsonRequest
- Sanity Studio Setup
- leader-validations.ts
- getAdminSession
- About and Contact Content
- Package Development Dependencies
- Gallery Experience
- Homepage Sections
- Application Dependencies
- TypeScript Configuration
- db
- resend-card/route.ts
- quoteEventTableName
- LeaderPortalNav.tsx
- Leadership and Engagement Migrations
- Community Email Campaigns
- Navigation and Footer
- Brand Asset Generation
- sanity.config.ts
- Event Check-in Migrations
- membership/route.ts
- request-code/route.ts
- Events Listing
- MembershipForm.tsx
- check-in/verify/route.ts
- members/page.tsx
- queries.ts
- requireLeader
- Core Database Migrations
- Development Dependencies
- lucide-react
- next-sanity
- (protected)/leaders/page.tsx
- Admin Navigation
- leadership-invites/route.ts
- GalleryMarquee.tsx
- react
- next
- Application Root Layout
- email.ts
- 019_event_member_otp_audit.sql
- Vercel Deployment Config
- (protected)/requests/[id]/page.tsx
- Prettier Configuration
- Member Table Migration
- Database Check Scripts
- Database Type Definitions
- Admin Dashboard Loading
- DonateForm.tsx
- Site Loading Skeletons
- (protected)/leaders/page.tsx
- Rate Limit Migration
- allowBuilds
- verify/page.tsx
- 018_leaders_portal.sql
- PostCSS Configuration
- success/page.tsx
- proxy.ts

## God Nodes (most connected - your core abstractions)
1. `db` - 133 edges
2. `next` - 120 edges
3. `readJsonRequest()` - 60 edges
4. `react` - 51 edges
5. `getAdminSession()` - 48 edges
6. `isSameOriginAdminRequest()` - 40 edges
7. `requestBodyErrorResponse()` - 38 edges
8. `rateLimit()` - 30 edges
9. `getClientIp()` - 29 edges
10. `lucide-react` - 23 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `db`  [EXTRACTED]
  app/api/register/member-code/route.ts → lib/db.ts
- `POST()` --calls--> `sendEventMemberVerificationCode()`  [EXTRACTED]
  app/api/register/member-code/route.ts → lib/email.ts
- `POST()` --calls--> `readJsonRequest()`  [EXTRACTED]
  app/api/register/member-code/route.ts → lib/request-body.ts
- `POST()` --calls--> `requestBodyErrorResponse()`  [EXTRACTED]
  app/api/register/member-code/route.ts → lib/request-body.ts
- `POST()` --calls--> `readJsonRequest()`  [EXTRACTED]
  app/api/register/member-verify/route.ts → lib/request-body.ts

## Import Cycles
- None detected.

## Communities (87 total, 32 thin omitted)

### Community 0 - "rateLimit"
Cohesion: 0.13
Nodes (26): POST(), runtime, verifyPassword(), POST(), POST(), dynamic, POST(), runtime (+18 more)

### Community 1 - "Admin Dashboard Analytics"
Cohesion: 0.08
Nodes (49): AdminDashboardPage(), AnalyticsDirectoryLoading(), AnalyticsPanelLoading(), DashboardAnalytics(), DashboardOverview(), dynamic, EventRegistrationsLoading(), EventRegistrationsOverview() (+41 more)

### Community 2 - "migrate-gallery.mjs"
Cohesion: 0.05
Nodes (40): files, migrate(), KampEvent, kampEvents, emerge2025, featuredPhotos, GALLERY_IMAGE_DIR, KampGalleryAlbum (+32 more)

### Community 3 - "register/route.ts"
Cohesion: 0.07
Nodes (31): POST(), runtime, POST(), runtime, EventSnapshot, EventWebhookPayload, POST(), runtime (+23 more)

### Community 4 - "readJsonRequest"
Cohesion: 0.09
Nodes (32): createSchema, DELETE(), dynamic, eventSlugSchema, POST(), revokeSchema, runtime, dynamic (+24 more)

### Community 5 - "Sanity Studio Setup"
Cohesion: 0.18
Nodes (10): sanity@^5.31.1, sanity, plugins, eventSchema, galleryEventSchema, schemaTypes, memberSchema, programSchema (+2 more)

### Community 6 - "leader-validations.ts"
Cohesion: 0.09
Nodes (24): NewLeaderReportPage(), NewLeaderRequestPage(), LeaderReportForm(), LeaderRequestForm(), LeaderSelect(), onKeyDown(), openAtSelected(), LeaderSelectOption (+16 more)

### Community 7 - "getAdminSession"
Cohesion: 0.14
Nodes (24): GET(), dynamic, lagosDate(), POST(), runtime, DELETE(), PATCH(), dynamic (+16 more)

### Community 8 - "About and Contact Content"
Cohesion: 0.15
Nodes (14): AboutPage(), FounderCard, revalidate, TeamCard, values, ContactPage(), revalidate, ContactForm() (+6 more)

### Community 9 - "Package Development Dependencies"
Cohesion: 0.10
Nodes (27): eslintConfig, devDependencies, eslint@^9, eslint-config-next@16.3.0, prettier@^3.9.6, prettier-plugin-tailwindcss@^0.8.1, tailwindcss@^4, @tailwindcss/postcss@^4 (+19 more)

### Community 10 - "Gallery Experience"
Cohesion: 0.14
Nodes (18): GalleryIntro(), GalleryPage(), revalidate, GalleryAlbum(), GalleryAlbumProps, slots, GalleryAlbums(), GalleryAlbumsProps (+10 more)

### Community 11 - "Homepage Sections"
Cohesion: 0.13
Nodes (18): actions, fallbackStats, HomePage(), partners, revalidate, RegistrationFormProps, GetInvolvedTabs(), tabs (+10 more)

### Community 12 - "Application Dependencies"
Cohesion: 0.09
Nodes (23): dependencies, clsx@^2.1.1, next@16.3.0, next-auth@^4.24.15, qrcode@^1.5.4, react@19.2.8, react-dom@19.2.8, @react-email/components@^1.0.12 (+15 more)

### Community 13 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 14 - "db"
Cohesion: 0.16
Nodes (14): dynamic, GET(), runtime, dynamic, GET(), dynamic, GET(), AdminLeaderReportDetail() (+6 more)

### Community 15 - "resend-card/route.ts"
Cohesion: 0.23
Nodes (15): campaignCounts(), dynamic, POST(), runtime, dynamic, POST(), runtime, dynamic (+7 more)

### Community 16 - "quoteEventTableName"
Cohesion: 0.08
Nodes (28): dynamic, GET(), runtime, dynamic, EventCheckinPage(), AdminEventRegistrationsPage(), dynamic, dynamic (+20 more)

### Community 17 - "LeaderPortalNav.tsx"
Cohesion: 0.48
Nodes (4): LeaderPortalLayout(), LeaderLogoutButton(), LeaderPortalNav(), links

### Community 18 - "Leadership and Engagement Migrations"
Cohesion: 0.17
Nodes (11): leadership_invites_expiry_idx, leadership_invites_pending_email_idx, public.leadership_member_id_counters, public.leadership_registration_invites, member_community_invite_links_member_idx, public.member_community_invite_links, public.member_community_tracking, community_email_campaign_pending_idx (+3 more)

### Community 19 - "Community Email Campaigns"
Cohesion: 0.21
Nodes (11): dynamic, filters, formatDate(), MemberEngagementPage(), safePage(), CommunityEmailCampaign(), prepare(), send() (+3 more)

### Community 20 - "Navigation and Footer"
Cohesion: 0.19
Nodes (9): SiteLayout(), Footer(), links, DropdownName, exploreLinks, involvedLinks, Navbar(), primaryLinks (+1 more)

### Community 21 - "Brand Asset Generation"
Cohesion: 0.18
Nodes (9): BG, chip(), emblem(), flame(), fs, path, sharp, SRC (+1 more)

### Community 22 - "sanity.config.ts"
Cohesion: 0.17
Nodes (10): @sanity/image-url@2, @sanity/vision@^5.31.1, @sanity/image-url, @sanity/vision, apiVersion, dataset, projectId, builder (+2 more)

### Community 23 - "Event Check-in Migrations"
Cohesion: 0.28
Nodes (11): idx_registry_event_id, idx_registry_event_slug, public.event_tables_registry, event_checkin_audit_event_created_idx, event_checkin_login_codes_operator_idx, event_checkin_operators_email_idx, event_checkin_sessions_operator_idx, public.event_checkin_audit (+3 more)

### Community 24 - "membership/route.ts"
Cohesion: 0.09
Nodes (27): dynamic, LeadershipInvitationsPage(), dynamic, GET(), runtime, currentLagosYear(), LeadershipRegistrationError, maxDuration (+19 more)

### Community 25 - "request-code/route.ts"
Cohesion: 0.33
Nodes (7): dynamic, POST(), requestSchema, runtime, codeHash(), createCheckinLoginCode(), verifyCheckinLoginCode()

### Community 26 - "Events Listing"
Cohesion: 0.22
Nodes (10): EventCard(), EventsPage(), formatEventDate(), revalidate, EventCardProps, FeaturedEventsCarousel(), formatEventDate(), PAST_EVENTS_QUERY (+2 more)

### Community 27 - "MembershipForm.tsx"
Cohesion: 0.06
Nodes (39): GET(), normalize(), CommunityJoinPage(), metadata, dynamic, LeadershipInvitationPage(), metadata, benefits (+31 more)

### Community 28 - "check-in/verify/route.ts"
Cohesion: 0.22
Nodes (13): dynamic, POST(), runtime, dynamic, POST(), requestSchema, runtime, CHECKIN_SESSION_COOKIE (+5 more)

### Community 29 - "members/page.tsx"
Cohesion: 0.43
Nodes (4): AdminMembersPage(), dynamic, escapeLike(), MembersSearch()

### Community 30 - "queries.ts"
Cohesion: 0.11
Nodes (21): descriptionComponents, EventDetailPage(), formatDate(), formatTime(), revalidate, executiveRoles, focusAreas, journey (+13 more)

### Community 31 - "requireLeader"
Cohesion: 0.27
Nodes (7): dynamic, LeaderDashboardPage(), dynamic, LeaderReportDetailPage(), dynamic, LeaderRequestDetailPage(), requireLeader()

### Community 32 - "Core Database Migrations"
Cohesion: 0.29
Nodes (8): contact_submissions, donations, events_registrations, idx_donations_email, idx_donations_paystack_ref, idx_registrations_email, idx_registrations_event_id, idx_registrations_event_email_unique

### Community 33 - "Development Dependencies"
Cohesion: 0.20
Nodes (10): scripts, admin:hash-password, build, db:check, db:migrate, dev, lint, migrate:events (+2 more)

### Community 34 - "lucide-react"
Cohesion: 0.20
Nodes (4): pathways, metadata, lucide-react@^1.28.0, lucide-react

### Community 35 - "next-sanity"
Cohesion: 0.40
Nodes (3): dynamic, next-sanity@13, next-sanity

### Community 36 - "(protected)/leaders/page.tsx"
Cohesion: 0.39
Nodes (4): dynamic, LeadersAdminPage(), CreateLeader(), LeaderStatusButton()

### Community 37 - "Admin Navigation"
Cohesion: 0.39
Nodes (4): ProtectedAdminLayout(), AdminNavigation(), items, LogoutButton()

### Community 38 - "leadership-invites/route.ts"
Cohesion: 0.29
Nodes (6): dynamic, InvitationError, invitationSchema, POST(), runtime, zod

### Community 39 - "GalleryMarquee.tsx"
Cohesion: 0.43
Nodes (6): columns, GalleryMarquee(), mobileColumns, MosaicRow(), Row, Tile()

### Community 40 - "react"
Cohesion: 0.26
Nodes (5): dynamic, MemberProfilePage(), DeleteMemberButton(), EditMemberPosition(), ResendCardButton()

### Community 41 - "next"
Cohesion: 0.10
Nodes (9): AdminLoginPage(), CheckinLoginPage(), dynamic, metadata, metadata, CheckinLoginForm(), csp, nextConfig (+1 more)

### Community 42 - "Application Root Layout"
Cohesion: 0.29
Nodes (4): metadata, urbanist, @vercel/analytics@^2.0.1, @vercel/analytics

### Community 43 - "email.ts"
Cohesion: 0.10
Nodes (42): POST(), POST(), runtime, POST(), runtime, POST(), runtime, POST() (+34 more)

### Community 44 - "019_event_member_otp_audit.sql"
Cohesion: 0.83
Nodes (3): event_member_otp_audit_created_idx, event_member_otp_audit_event_created_idx, public.event_member_otp_audit

### Community 45 - "Vercel Deployment Config"
Cohesion: 0.29
Nodes (6): maxDuration, framework, functions, app/api/paystack/webhook/route.ts, regions, $schema

### Community 46 - "(protected)/requests/[id]/page.tsx"
Cohesion: 0.31
Nodes (4): AdminLeaderRequestDetail(), dynamic, ReviewLeaderRequest(), SendRequestAdminNotification()

### Community 47 - "Prettier Configuration"
Cohesion: 0.33
Nodes (5): plugins, printWidth, semi, singleQuote, trailingComma

### Community 49 - "Member Table Migration"
Cohesion: 0.60
Nodes (4): member_number_counters, members, members_status_idx, members_year_joined_idx

### Community 50 - "Database Check Scripts"
Cohesion: 0.50
Nodes (3): postgres@^3.4.9, postgres, db

### Community 51 - "Database Type Definitions"
Cohesion: 0.50
Nodes (3): ContactSubmissionRow, DonationRow, RegistrationRow

### Community 53 - "DonateForm.tsx"
Cohesion: 0.24
Nodes (8): amounts, AmountSelector(), AmountSelectorProps, DonateForm(), DONATION_TYPE, Frequency, PaymentMethod, paymentMethods

### Community 55 - "(protected)/leaders/page.tsx"
Cohesion: 0.23
Nodes (7): dynamic, LeaderReportsAdminPage(), dynamic, LeaderRequestsAdminPage(), statuses, DeleteLeaderPortalDataButton(), Props

### Community 59 - "allowBuilds"
Cohesion: 0.50
Nodes (3): allowBuilds, esbuild, unrs-resolver

### Community 77 - "018_leaders_portal.sql"
Cohesion: 0.32
Nodes (11): idx_login_tokens_expiry, idx_login_tokens_leader, idx_reports_created, idx_reports_leader, idx_requests_created, idx_requests_leader, idx_requests_status, public.leader_login_tokens (+3 more)

## Knowledge Gaps
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `rateLimit`, `Admin Dashboard Analytics`, `migrate-gallery.mjs`, `register/route.ts`, `readJsonRequest`, `leader-validations.ts`, `getAdminSession`, `About and Contact Content`, `Package Development Dependencies`, `Gallery Experience`, `Homepage Sections`, `Application Dependencies`, `db`, `resend-card/route.ts`, `quoteEventTableName`, `LeaderPortalNav.tsx`, `Community Email Campaigns`, `Navigation and Footer`, `membership/route.ts`, `request-code/route.ts`, `Events Listing`, `MembershipForm.tsx`, `check-in/verify/route.ts`, `members/page.tsx`, `queries.ts`, `requireLeader`, `lucide-react`, `(protected)/leaders/page.tsx`, `Admin Navigation`, `leadership-invites/route.ts`, `GalleryMarquee.tsx`, `react`, `Application Root Layout`, `email.ts`, `(protected)/requests/[id]/page.tsx`, `(protected)/leaders/page.tsx`, `verify/page.tsx`, `success/page.tsx`, `proxy.ts`?**
  _High betweenness centrality (0.324) - this node is a cross-community bridge._
- **Should `rateLimit` be split into smaller, more focused modules?**
  _Cohesion score 0.13109243697478992 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Homepage Sections` to `Admin Dashboard Analytics`, `migrate-gallery.mjs`, `register/route.ts`, `leader-validations.ts`, `About and Contact Content`, `Package Development Dependencies`, `Gallery Experience`, `Application Dependencies`, `quoteEventTableName`, `Community Email Campaigns`, `Navigation and Footer`, `membership/route.ts`, `Events Listing`, `MembershipForm.tsx`, `members/page.tsx`, `(protected)/leaders/page.tsx`, `Admin Navigation`, `GalleryMarquee.tsx`, `react`, `next`, `email.ts`, `(protected)/requests/[id]/page.tsx`, `DonateForm.tsx`, `(protected)/leaders/page.tsx`, `verify/page.tsx`, `success/page.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Should `Admin Dashboard Analytics` be split into smaller, more focused modules?**
  _Cohesion score 0.07948568088836938 - nodes in this community are weakly interconnected._
- **Why does `db` connect `db` to `rateLimit`, `Admin Dashboard Analytics`, `migrate-gallery.mjs`, `register/route.ts`, `readJsonRequest`, `getAdminSession`, `resend-card/route.ts`, `quoteEventTableName`, `Community Email Campaigns`, `membership/route.ts`, `request-code/route.ts`, `check-in/verify/route.ts`, `members/page.tsx`, `requireLeader`, `(protected)/leaders/page.tsx`, `leadership-invites/route.ts`, `react`, `next`, `email.ts`, `(protected)/requests/[id]/page.tsx`, `(protected)/leaders/page.tsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Should `migrate-gallery.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.054901960784313725 - nodes in this community are weakly interconnected._
- **Should `register/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0726950354609929 - nodes in this community are weakly interconnected._