# Graph Report - kamp-website  (2026-11-07)

## Corpus Check
- 245 files · ~85,417 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .ico 3, (none) 2, .example 1)

## Summary
- 1097 nodes · 2507 edges · 84 communities (55 shown, 29 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b645e87c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- email.ts
- Admin Dashboard Analytics
- migrate-gallery.mjs
- register/route.ts
- community-status/route.ts
- Sanity Studio Setup
- requireLeader
- getAdminSession
- About and Contact Content
- Package Development Dependencies
- Gallery Experience
- Homepage Sections
- Application Dependencies
- TypeScript Configuration
- db
- (protected)/events/[slug]/page.tsx
- check-in/verify/route.ts
- readJsonRequest
- Leadership and Engagement Migrations
- Community Email Campaigns
- Navigation and Footer
- Brand Asset Generation
- sanity.config.ts
- Event Check-in Migrations
- leadership-invites/route.ts
- [memberId]/page.tsx
- Events Listing
- validations.ts
- queries.ts
- members/page.tsx
- checkin/route.ts
- leader-validations.ts
- Core Database Migrations
- Development Dependencies
- lucide-react
- GalleryMarquee.tsx
- (protected)/requests/[id]/page.tsx
- Admin Navigation
- sanity.ts
- admin-session.ts
- react
- Check-in Login Screen
- Application Root Layout
- LeaderPortalNav.tsx
- Vercel Deployment Config
- quoteEventTableName
- Prettier Configuration
- Member Table Migration
- Database Check Scripts
- Database Type Definitions
- Admin Dashboard Loading
- Site Loading Skeletons
- (protected)/leaders/page.tsx
- Rate Limit Migration
- remind/route.ts
- allowBuilds
- verify/page.tsx
- 018_leaders_portal.sql
- PostCSS Configuration
- next

## God Nodes (most connected - your core abstractions)
1. `db` - 130 edges
2. `next` - 119 edges
3. `readJsonRequest()` - 60 edges
4. `react` - 50 edges
5. `getAdminSession()` - 46 edges
6. `requestBodyErrorResponse()` - 38 edges
7. `isSameOriginAdminRequest()` - 38 edges
8. `rateLimit()` - 30 edges
9. `getClientIp()` - 29 edges
10. `lucide-react` - 23 edges

## Surprising Connections (you probably didn't know these)
- `LeadersAdminPage()` --calls--> `LeaderStatusButton()`  [EXTRACTED]
  app/admin/(protected)/leaders/page.tsx → components/admin/LeaderStatusButton.tsx
- `LeadersAdminPage()` --calls--> `db`  [EXTRACTED]
  app/admin/(protected)/leaders/page.tsx → lib/db.ts
- `LeaderReportsAdminPage()` --calls--> `db`  [EXTRACTED]
  app/admin/(protected)/reports/page.tsx → lib/db.ts
- `LeaderRequestsAdminPage()` --calls--> `db`  [EXTRACTED]
  app/admin/(protected)/requests/page.tsx → lib/db.ts
- `PATCH()` --calls--> `db`  [EXTRACTED]
  app/admin/api/leaders/[id]/route.ts → lib/db.ts

## Import Cycles
- None detected.

## Communities (84 total, 29 thin omitted)

### Community 0 - "email.ts"
Cohesion: 0.08
Nodes (52): campaignCounts(), dynamic, POST(), runtime, dynamic, POST(), runtime, dynamic (+44 more)

### Community 1 - "Admin Dashboard Analytics"
Cohesion: 0.08
Nodes (49): AdminDashboardPage(), AnalyticsDirectoryLoading(), AnalyticsPanelLoading(), DashboardAnalytics(), DashboardOverview(), dynamic, EventRegistrationsLoading(), EventRegistrationsOverview() (+41 more)

### Community 2 - "migrate-gallery.mjs"
Cohesion: 0.06
Nodes (38): KampEvent, kampEvents, emerge2025, featuredPhotos, GALLERY_IMAGE_DIR, KampGalleryAlbum, kampGalleryAlbums, KampGalleryPhoto (+30 more)

### Community 3 - "register/route.ts"
Cohesion: 0.09
Nodes (28): POST(), runtime, POST(), runtime, EventSnapshot, EventWebhookPayload, POST(), runtime (+20 more)

### Community 4 - "community-status/route.ts"
Cohesion: 0.14
Nodes (14): bodySchema, dynamic, PATCH(), runtime, DELETE(), dynamic, runtime, dynamic (+6 more)

### Community 5 - "Sanity Studio Setup"
Cohesion: 0.15
Nodes (11): dynamic, sanity@^5.31.1, sanity, plugins, eventSchema, galleryEventSchema, schemaTypes, memberSchema (+3 more)

### Community 6 - "requireLeader"
Cohesion: 0.27
Nodes (7): dynamic, LeaderDashboardPage(), dynamic, LeaderReportDetailPage(), dynamic, LeaderRequestDetailPage(), requireLeader()

### Community 7 - "getAdminSession"
Cohesion: 0.18
Nodes (17): createSchema, dynamic, eventSlugSchema, GET(), POST(), revokeSchema, runtime, DELETE() (+9 more)

### Community 8 - "About and Contact Content"
Cohesion: 0.15
Nodes (14): AboutPage(), FounderCard, revalidate, TeamCard, values, ContactPage(), revalidate, ContactForm() (+6 more)

### Community 9 - "Package Development Dependencies"
Cohesion: 0.10
Nodes (27): eslintConfig, devDependencies, eslint@^9, eslint-config-next@16.3.0, prettier@^3.9.6, prettier-plugin-tailwindcss@^0.8.1, tailwindcss@^4, @tailwindcss/postcss@^4 (+19 more)

### Community 10 - "Gallery Experience"
Cohesion: 0.23
Nodes (11): GalleryIntro(), GalleryPage(), revalidate, GalleryAlbum(), GalleryAlbumProps, slots, GalleryAlbums(), GalleryAlbumsProps (+3 more)

### Community 11 - "Homepage Sections"
Cohesion: 0.13
Nodes (16): actions, fallbackStats, HomePage(), partners, revalidate, GetInvolvedTabs(), tabs, HeroImageRotator() (+8 more)

### Community 12 - "Application Dependencies"
Cohesion: 0.08
Nodes (25): dependencies, clsx@^2.1.1, next@16.3.0, next-auth@^4.24.15, qrcode@^1.5.4, react@19.2.8, react-dom@19.2.8, @react-email/components@^1.0.12 (+17 more)

### Community 13 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 14 - "db"
Cohesion: 0.16
Nodes (13): dynamic, GET(), dynamic, GET(), AdminLeaderReportDetail(), dynamic, csvFile(), db (+5 more)

### Community 15 - "(protected)/events/[slug]/page.tsx"
Cohesion: 0.26
Nodes (8): AdminEventRegistrationsPage(), dynamic, CheckinOperatorManager(), addOperator(), load(), revoke(), Operator, SendReminderButton()

### Community 16 - "check-in/verify/route.ts"
Cohesion: 0.22
Nodes (12): dynamic, POST(), runtime, dynamic, requestSchema, runtime, CHECKIN_SESSION_COOKIE, CHECKIN_SESSION_SECONDS (+4 more)

### Community 17 - "readJsonRequest"
Cohesion: 0.06
Nodes (64): DELETE(), POST(), POST(), runtime, verifyPassword(), dynamic, POST(), requestSchema (+56 more)

### Community 18 - "Leadership and Engagement Migrations"
Cohesion: 0.17
Nodes (11): leadership_invites_expiry_idx, leadership_invites_pending_email_idx, public.leadership_member_id_counters, public.leadership_registration_invites, member_community_invite_links_member_idx, public.member_community_invite_links, public.member_community_tracking, community_email_campaign_pending_idx (+3 more)

### Community 19 - "Community Email Campaigns"
Cohesion: 0.21
Nodes (11): dynamic, filters, formatDate(), MemberEngagementPage(), safePage(), CommunityEmailCampaign(), prepare(), send() (+3 more)

### Community 20 - "Navigation and Footer"
Cohesion: 0.10
Nodes (17): SiteLayout(), amounts, AmountSelector(), AmountSelectorProps, DonateForm(), DONATION_TYPE, Frequency, PaymentMethod (+9 more)

### Community 21 - "Brand Asset Generation"
Cohesion: 0.18
Nodes (9): BG, chip(), emblem(), flame(), fs, path, sharp, SRC (+1 more)

### Community 22 - "sanity.config.ts"
Cohesion: 0.17
Nodes (10): @sanity/image-url@2, @sanity/vision@^5.31.1, @sanity/image-url, @sanity/vision, apiVersion, dataset, projectId, builder (+2 more)

### Community 23 - "Event Check-in Migrations"
Cohesion: 0.28
Nodes (11): idx_registry_event_id, idx_registry_event_slug, public.event_tables_registry, event_checkin_audit_event_created_idx, event_checkin_login_codes_operator_idx, event_checkin_operators_email_idx, event_checkin_sessions_operator_idx, public.event_checkin_audit (+3 more)

### Community 24 - "leadership-invites/route.ts"
Cohesion: 0.16
Nodes (11): dynamic, InvitationError, invitationSchema, runtime, dynamic, LeadershipInvitationsPage(), CreatedInvite, CreateLeadershipInvite() (+3 more)

### Community 25 - "[memberId]/page.tsx"
Cohesion: 0.26
Nodes (5): dynamic, MemberProfilePage(), DeleteMemberButton(), EditMemberPosition(), ResendCardButton()

### Community 26 - "Events Listing"
Cohesion: 0.31
Nodes (8): EventCard(), EventsPage(), formatEventDate(), revalidate, FeaturedEventsCarousel(), formatEventDate(), PAST_EVENTS_QUERY, UPCOMING_EVENTS_QUERY

### Community 27 - "validations.ts"
Cohesion: 0.05
Nodes (43): GET(), normalize(), CommunityJoinPage(), metadata, dynamic, LeadershipInvitationPage(), metadata, benefits (+35 more)

### Community 28 - "queries.ts"
Cohesion: 0.10
Nodes (22): descriptionComponents, EventDetailPage(), formatDate(), formatTime(), revalidate, executiveRoles, focusAreas, journey (+14 more)

### Community 29 - "members/page.tsx"
Cohesion: 0.43
Nodes (4): AdminMembersPage(), dynamic, escapeLike(), MembersSearch()

### Community 30 - "checkin/route.ts"
Cohesion: 0.28
Nodes (7): dynamic, POST(), runtime, dynamic, POST(), runtime, authorizeEventCheckin()

### Community 31 - "leader-validations.ts"
Cohesion: 0.09
Nodes (24): NewLeaderReportPage(), NewLeaderRequestPage(), LeaderReportForm(), LeaderRequestForm(), LeaderSelect(), onKeyDown(), openAtSelected(), LeaderSelectOption (+16 more)

### Community 32 - "Core Database Migrations"
Cohesion: 0.29
Nodes (8): contact_submissions, donations, events_registrations, idx_donations_email, idx_donations_paystack_ref, idx_registrations_email, idx_registrations_event_id, idx_registrations_event_email_unique

### Community 33 - "Development Dependencies"
Cohesion: 0.20
Nodes (10): scripts, admin:hash-password, build, db:check, db:migrate, dev, lint, migrate:events (+2 more)

### Community 34 - "lucide-react"
Cohesion: 0.20
Nodes (4): pathways, metadata, lucide-react@^1.28.0, lucide-react

### Community 35 - "GalleryMarquee.tsx"
Cohesion: 0.43
Nodes (6): columns, GalleryMarquee(), mobileColumns, MosaicRow(), Row, Tile()

### Community 36 - "(protected)/requests/[id]/page.tsx"
Cohesion: 0.47
Nodes (3): AdminLeaderRequestDetail(), dynamic, ReviewLeaderRequest()

### Community 37 - "Admin Navigation"
Cohesion: 0.39
Nodes (4): ProtectedAdminLayout(), AdminNavigation(), items, LogoutButton()

### Community 38 - "sanity.ts"
Cohesion: 0.19
Nodes (9): EventCardProps, GalleryLightboxProps, EventDocument, SanityBlock, SanityGalleryImage, SanityImage, SanityImageAsset, SanityResolvedImage (+1 more)

### Community 39 - "admin-session.ts"
Cohesion: 0.46
Nodes (6): POST(), createAdminSession(), destroyAdminSession(), getSecret(), signValue(), verifyValue()

### Community 40 - "react"
Cohesion: 0.27
Nodes (6): AdminLoginPage(), CameraTicketScanner(), controlsStop(), start(), Registrant, react

### Community 41 - "Check-in Login Screen"
Cohesion: 0.38
Nodes (3): CheckinLoginPage(), dynamic, CheckinLoginForm()

### Community 42 - "Application Root Layout"
Cohesion: 0.29
Nodes (4): metadata, urbanist, @vercel/analytics@^2.0.1, @vercel/analytics

### Community 43 - "LeaderPortalNav.tsx"
Cohesion: 0.48
Nodes (4): LeaderPortalLayout(), LeaderLogoutButton(), LeaderPortalNav(), links

### Community 45 - "Vercel Deployment Config"
Cohesion: 0.29
Nodes (6): maxDuration, framework, functions, app/api/paystack/webhook/route.ts, regions, $schema

### Community 46 - "quoteEventTableName"
Cohesion: 0.14
Nodes (17): dynamic, GET(), runtime, dynamic, GET(), runtime, dynamic, EventCheckinPage() (+9 more)

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

### Community 55 - "(protected)/leaders/page.tsx"
Cohesion: 0.15
Nodes (11): dynamic, LeadersAdminPage(), dynamic, LeaderReportsAdminPage(), dynamic, LeaderRequestsAdminPage(), statuses, CreateLeader() (+3 more)

### Community 58 - "remind/route.ts"
Cohesion: 0.50
Nodes (4): dynamic, lagosDate(), POST(), runtime

### Community 59 - "allowBuilds"
Cohesion: 0.50
Nodes (3): allowBuilds, esbuild, unrs-resolver

### Community 77 - "018_leaders_portal.sql"
Cohesion: 0.32
Nodes (11): idx_login_tokens_expiry, idx_login_tokens_leader, idx_reports_created, idx_reports_leader, idx_requests_created, idx_requests_leader, idx_requests_status, public.leader_login_tokens (+3 more)

### Community 93 - "next"
Cohesion: 0.12
Nodes (8): metadata, DonationReference(), DonateSuccessPage(), metadata, csp, nextConfig, config, next

## Knowledge Gaps
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `email.ts`, `Admin Dashboard Analytics`, `migrate-gallery.mjs`, `register/route.ts`, `community-status/route.ts`, `requireLeader`, `getAdminSession`, `About and Contact Content`, `Package Development Dependencies`, `Gallery Experience`, `Homepage Sections`, `Application Dependencies`, `db`, `(protected)/events/[slug]/page.tsx`, `check-in/verify/route.ts`, `readJsonRequest`, `Community Email Campaigns`, `Navigation and Footer`, `leadership-invites/route.ts`, `[memberId]/page.tsx`, `Events Listing`, `validations.ts`, `queries.ts`, `members/page.tsx`, `checkin/route.ts`, `leader-validations.ts`, `lucide-react`, `GalleryMarquee.tsx`, `(protected)/requests/[id]/page.tsx`, `Admin Navigation`, `sanity.ts`, `admin-session.ts`, `react`, `Check-in Login Screen`, `Application Root Layout`, `LeaderPortalNav.tsx`, `quoteEventTableName`, `(protected)/leaders/page.tsx`, `remind/route.ts`, `verify/page.tsx`?**
  _High betweenness centrality (0.351) - this node is a cross-community bridge._
- **Should `email.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08196721311475409 - nodes in this community are weakly interconnected._
- **Why does `db` connect `db` to `email.ts`, `Admin Dashboard Analytics`, `register/route.ts`, `community-status/route.ts`, `requireLeader`, `getAdminSession`, `(protected)/events/[slug]/page.tsx`, `check-in/verify/route.ts`, `readJsonRequest`, `Community Email Campaigns`, `leadership-invites/route.ts`, `[memberId]/page.tsx`, `members/page.tsx`, `checkin/route.ts`, `(protected)/requests/[id]/page.tsx`, `Check-in Login Screen`, `quoteEventTableName`, `(protected)/leaders/page.tsx`, `remind/route.ts`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Should `Admin Dashboard Analytics` be split into smaller, more focused modules?**
  _Cohesion score 0.07948568088836938 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `email.ts`, `Admin Dashboard Analytics`, `migrate-gallery.mjs`, `register/route.ts`, `About and Contact Content`, `Package Development Dependencies`, `Gallery Experience`, `Homepage Sections`, `Application Dependencies`, `(protected)/events/[slug]/page.tsx`, `readJsonRequest`, `Community Email Campaigns`, `Navigation and Footer`, `leadership-invites/route.ts`, `[memberId]/page.tsx`, `Events Listing`, `validations.ts`, `members/page.tsx`, `leader-validations.ts`, `GalleryMarquee.tsx`, `(protected)/requests/[id]/page.tsx`, `Admin Navigation`, `sanity.ts`, `Check-in Login Screen`, `quoteEventTableName`, `(protected)/leaders/page.tsx`, `verify/page.tsx`, `next`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Should `migrate-gallery.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.060129509713228495 - nodes in this community are weakly interconnected._
- **Should `register/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09024390243902439 - nodes in this community are weakly interconnected._