# Graph Report - kamp-website  (2026-11-07)

## Corpus Check
- 242 files · ~83,869 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .ico 3, (none) 2, .example 1)

## Summary
- 1083 nodes · 2461 edges · 91 communities (57 shown, 34 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `10573eb5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- email.ts
- Admin Dashboard Analytics
- migrate-events.mjs
- register/route.ts
- requestBodyErrorResponse
- Sanity Studio Setup
- email.ts
- readJsonRequest
- About and Contact Content
- Package Development Dependencies
- Gallery Experience
- Homepage Sections
- Application Dependencies
- TypeScript Configuration
- db
- (site)/events/[slug]/page.tsx
- check-in/verify/route.ts
- checkin/page.tsx
- Leadership and Engagement Migrations
- Community Email Campaigns
- Navigation and Footer
- Brand Asset Generation
- sanity.config.ts
- Event Check-in Migrations
- Leadership Invitations
- [memberId]/page.tsx
- Events Listing
- validations.ts
- programs/page.tsx
- members/page.tsx
- Donation Form
- leader-validations.ts
- Core Database Migrations
- Development Dependencies
- lucide-react
- GalleryMarquee.tsx
- (protected)/requests/[id]/page.tsx
- Admin Navigation
- migrate-gallery.mjs
- success/page.tsx
- leaders/layout.tsx
- Check-in Login Screen
- Application Root Layout
- member-card.tsx
- admin-session.ts
- Vercel Deployment Config
- quoteEventTableName
- Prettier Configuration
- Sanity Studio Page
- Member Table Migration
- Database Check Scripts
- Database Type Definitions
- Admin Dashboard Loading
- (protected)/events/[slug]/page.tsx
- Site Loading Skeletons
- (protected)/leaders/page.tsx
- gallery-data.ts
- Rate Limit Migration
- remind/route.ts
- allowBuilds
- verify/page.tsx
- 018_leaders_portal.sql
- PostCSS Configuration
- EventListing.tsx
- db-migrate.ts
- @sanity/client
- next

## God Nodes (most connected - your core abstractions)
1. `db` - 127 edges
2. `next` - 117 edges
3. `readJsonRequest()` - 60 edges
4. `react` - 48 edges
5. `getAdminSession()` - 42 edges
6. `requestBodyErrorResponse()` - 38 edges
7. `isSameOriginAdminRequest()` - 34 edges
8. `rateLimit()` - 30 edges
9. `getClientIp()` - 29 edges
10. `lucide-react` - 21 edges

## Surprising Connections (you probably didn't know these)
- `EventCardProps` --references--> `EventDocument`  [EXTRACTED]
  components/events/EventCard.tsx → types/sanity.ts
- `campaignCounts()` --calls--> `db`  [EXTRACTED]
  app/admin/api/members/community-campaign/route.ts → lib/db.ts
- `POST()` --calls--> `isSameOriginAdminRequest()`  [EXTRACTED]
  app/admin/api/members/community-campaign/route.ts → lib/admin-request.ts
- `POST()` --calls--> `getAdminSession()`  [EXTRACTED]
  app/admin/api/members/community-campaign/route.ts → lib/admin-session.ts
- `POST()` --calls--> `db`  [EXTRACTED]
  app/admin/api/members/community-campaign/route.ts → lib/db.ts

## Import Cycles
- None detected.

## Communities (91 total, 34 thin omitted)

### Community 0 - "email.ts"
Cohesion: 0.05
Nodes (79): POST(), runtime, verifyPassword(), campaignCounts(), dynamic, POST(), runtime, dynamic (+71 more)

### Community 1 - "Admin Dashboard Analytics"
Cohesion: 0.08
Nodes (49): AdminDashboardPage(), AnalyticsDirectoryLoading(), AnalyticsPanelLoading(), DashboardAnalytics(), DashboardOverview(), dynamic, EventRegistrationsLoading(), EventRegistrationsOverview() (+41 more)

### Community 2 - "migrate-events.mjs"
Cohesion: 0.17
Nodes (13): buildDocument(), client, DRY_RUN, IMAGE_ROOT, main(), MONTHS, pad(), projectId (+5 more)

### Community 3 - "register/route.ts"
Cohesion: 0.07
Nodes (31): POST(), runtime, POST(), runtime, EventSnapshot, EventWebhookPayload, POST(), runtime (+23 more)

### Community 4 - "requestBodyErrorResponse"
Cohesion: 0.14
Nodes (21): bodySchema, dynamic, PATCH(), runtime, DELETE(), dynamic, runtime, dynamic (+13 more)

### Community 5 - "Sanity Studio Setup"
Cohesion: 0.18
Nodes (10): sanity@^5.31.1, sanity, plugins, eventSchema, galleryEventSchema, schemaTypes, memberSchema, programSchema (+2 more)

### Community 6 - "email.ts"
Cohesion: 0.09
Nodes (28): POST(), POST(), runtime, POST(), runtime, LeaderLoginPage(), LeadersIndexPage(), dynamic (+20 more)

### Community 7 - "readJsonRequest"
Cohesion: 0.16
Nodes (17): createSchema, DELETE(), dynamic, eventSlugSchema, GET(), POST(), revokeSchema, runtime (+9 more)

### Community 8 - "About and Contact Content"
Cohesion: 0.14
Nodes (17): AboutPage(), FounderCard, revalidate, TeamCard, values, ContactPage(), revalidate, ContactForm() (+9 more)

### Community 9 - "Package Development Dependencies"
Cohesion: 0.10
Nodes (27): eslintConfig, devDependencies, eslint@^9, eslint-config-next@16.3.0, prettier@^3.9.6, prettier-plugin-tailwindcss@^0.8.1, tailwindcss@^4, @tailwindcss/postcss@^4 (+19 more)

### Community 10 - "Gallery Experience"
Cohesion: 0.13
Nodes (19): GalleryIntro(), GalleryPage(), revalidate, GalleryAlbum(), GalleryAlbumProps, slots, GalleryAlbums(), GalleryAlbumsProps (+11 more)

### Community 11 - "Homepage Sections"
Cohesion: 0.13
Nodes (17): actions, fallbackStats, HomePage(), partners, revalidate, Operator, GetInvolvedTabs(), tabs (+9 more)

### Community 12 - "Application Dependencies"
Cohesion: 0.09
Nodes (23): dependencies, clsx@^2.1.1, next@16.3.0, next-auth@^4.24.15, qrcode@^1.5.4, react@19.2.8, react-dom@19.2.8, @react-email/components@^1.0.12 (+15 more)

### Community 13 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 14 - "db"
Cohesion: 0.14
Nodes (16): dynamic, GET(), dynamic, GET(), AdminLeaderReportDetail(), dynamic, dynamic, LeaderReportsAdminPage() (+8 more)

### Community 15 - "(site)/events/[slug]/page.tsx"
Cohesion: 0.20
Nodes (11): descriptionComponents, EventDetailPage(), formatDate(), formatTime(), revalidate, RegistrationForm(), RegistrationFormProps, studyLevels (+3 more)

### Community 16 - "check-in/verify/route.ts"
Cohesion: 0.18
Nodes (16): dynamic, POST(), runtime, dynamic, POST(), requestSchema, runtime, CHECKIN_SESSION_COOKIE (+8 more)

### Community 17 - "checkin/page.tsx"
Cohesion: 0.22
Nodes (9): dynamic, EventCheckinPage(), CameraTicketScanner(), controlsStop(), start(), CheckinList(), Registrant, @zxing/browser@^0.2.1 (+1 more)

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

### Community 24 - "Leadership Invitations"
Cohesion: 0.33
Nodes (5): dynamic, InvitationError, invitationSchema, POST(), runtime

### Community 25 - "[memberId]/page.tsx"
Cohesion: 0.26
Nodes (5): dynamic, MemberProfilePage(), DeleteMemberButton(), EditMemberPosition(), ResendCardButton()

### Community 26 - "Events Listing"
Cohesion: 0.21
Nodes (10): EventCard(), EventsPage(), formatEventDate(), revalidate, EventCardProps, FeaturedEventsCarousel(), formatEventDate(), freshClient (+2 more)

### Community 27 - "validations.ts"
Cohesion: 0.05
Nodes (39): GET(), normalize(), CommunityJoinPage(), metadata, dynamic, LeadershipInvitationPage(), metadata, benefits (+31 more)

### Community 28 - "programs/page.tsx"
Cohesion: 0.18
Nodes (9): executiveRoles, focusAreas, journey, ProgramCard, revalidate, @portabletext/react@^8.0.0, @portabletext/react, PROGRAMS_QUERY (+1 more)

### Community 29 - "members/page.tsx"
Cohesion: 0.43
Nodes (4): AdminMembersPage(), dynamic, escapeLike(), MembersSearch()

### Community 30 - "Donation Form"
Cohesion: 0.24
Nodes (8): amounts, AmountSelector(), AmountSelectorProps, DonateForm(), DONATION_TYPE, Frequency, PaymentMethod, paymentMethods

### Community 31 - "leader-validations.ts"
Cohesion: 0.10
Nodes (20): NewLeaderReportPage(), NewLeaderRequestPage(), LeaderReportForm(), LeaderRequestForm(), email, leaderCreateSchema, leaderLoginRequestSchema, LeaderReportInput (+12 more)

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

### Community 38 - "migrate-gallery.mjs"
Cohesion: 0.20
Nodes (14): absolutePathFor(), assertFilesExist(), buildDocument(), client, DRY_RUN, fetchExistingAssets(), IMAGE_ROOT, main() (+6 more)

### Community 41 - "Check-in Login Screen"
Cohesion: 0.38
Nodes (3): CheckinLoginPage(), dynamic, CheckinLoginForm()

### Community 42 - "Application Root Layout"
Cohesion: 0.29
Nodes (4): metadata, urbanist, @vercel/analytics@^2.0.1, @vercel/analytics

### Community 43 - "member-card.tsx"
Cohesion: 0.19
Nodes (10): dynamic, GET(), runtime, CARD, generateMemberCardPDF(), MemberCard(), MemberCardData, styles (+2 more)

### Community 44 - "admin-session.ts"
Cohesion: 0.46
Nodes (6): POST(), createAdminSession(), destroyAdminSession(), getSecret(), signValue(), verifyValue()

### Community 45 - "Vercel Deployment Config"
Cohesion: 0.29
Nodes (6): maxDuration, framework, functions, app/api/paystack/webhook/route.ts, regions, $schema

### Community 46 - "quoteEventTableName"
Cohesion: 0.12
Nodes (21): dynamic, POST(), runtime, dynamic, POST(), runtime, dynamic, GET() (+13 more)

### Community 47 - "Prettier Configuration"
Cohesion: 0.33
Nodes (5): plugins, printWidth, semi, singleQuote, trailingComma

### Community 48 - "Sanity Studio Page"
Cohesion: 0.40
Nodes (3): dynamic, next-sanity@13, next-sanity

### Community 49 - "Member Table Migration"
Cohesion: 0.60
Nodes (4): member_number_counters, members, members_status_idx, members_year_joined_idx

### Community 50 - "Database Check Scripts"
Cohesion: 0.50
Nodes (3): postgres@^3.4.9, postgres, db

### Community 51 - "Database Type Definitions"
Cohesion: 0.50
Nodes (3): ContactSubmissionRow, DonationRow, RegistrationRow

### Community 53 - "(protected)/events/[slug]/page.tsx"
Cohesion: 0.31
Nodes (7): AdminEventRegistrationsPage(), dynamic, CheckinOperatorManager(), addOperator(), load(), revoke(), SendReminderButton()

### Community 55 - "(protected)/leaders/page.tsx"
Cohesion: 0.39
Nodes (4): dynamic, LeadersAdminPage(), CreateLeader(), LeaderStatusButton()

### Community 56 - "gallery-data.ts"
Cohesion: 0.25
Nodes (7): emerge2025, featuredPhotos, GALLERY_IMAGE_DIR, KampGalleryAlbum, kampGalleryAlbums, KampGalleryPhoto, remainingFiles

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
Cohesion: 0.13
Nodes (6): AdminLoginPage(), metadata, csp, nextConfig, config, next

## Knowledge Gaps
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `email.ts`, `Admin Dashboard Analytics`, `register/route.ts`, `requestBodyErrorResponse`, `email.ts`, `readJsonRequest`, `About and Contact Content`, `Package Development Dependencies`, `Gallery Experience`, `Homepage Sections`, `Application Dependencies`, `db`, `(site)/events/[slug]/page.tsx`, `check-in/verify/route.ts`, `checkin/page.tsx`, `Community Email Campaigns`, `Navigation and Footer`, `Leadership Invitations`, `[memberId]/page.tsx`, `Events Listing`, `validations.ts`, `programs/page.tsx`, `members/page.tsx`, `leader-validations.ts`, `lucide-react`, `GalleryMarquee.tsx`, `(protected)/requests/[id]/page.tsx`, `Admin Navigation`, `success/page.tsx`, `leaders/layout.tsx`, `Check-in Login Screen`, `Application Root Layout`, `admin-session.ts`, `quoteEventTableName`, `(protected)/events/[slug]/page.tsx`, `(protected)/leaders/page.tsx`, `remind/route.ts`, `verify/page.tsx`, `EventListing.tsx`?**
  _High betweenness centrality (0.346) - this node is a cross-community bridge._
- **Should `email.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Why does `db` connect `db` to `email.ts`, `Admin Dashboard Analytics`, `register/route.ts`, `requestBodyErrorResponse`, `email.ts`, `readJsonRequest`, `check-in/verify/route.ts`, `checkin/page.tsx`, `Community Email Campaigns`, `Leadership Invitations`, `[memberId]/page.tsx`, `members/page.tsx`, `(protected)/requests/[id]/page.tsx`, `Check-in Login Screen`, `quoteEventTableName`, `(protected)/events/[slug]/page.tsx`, `(protected)/leaders/page.tsx`, `remind/route.ts`, `db-migrate.ts`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Should `Admin Dashboard Analytics` be split into smaller, more focused modules?**
  _Cohesion score 0.07948568088836938 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Homepage Sections` to `email.ts`, `Admin Dashboard Analytics`, `register/route.ts`, `email.ts`, `About and Contact Content`, `Package Development Dependencies`, `Gallery Experience`, `Application Dependencies`, `(site)/events/[slug]/page.tsx`, `checkin/page.tsx`, `Community Email Campaigns`, `Navigation and Footer`, `[memberId]/page.tsx`, `Events Listing`, `validations.ts`, `members/page.tsx`, `Donation Form`, `leader-validations.ts`, `GalleryMarquee.tsx`, `(protected)/requests/[id]/page.tsx`, `Admin Navigation`, `success/page.tsx`, `Check-in Login Screen`, `member-card.tsx`, `quoteEventTableName`, `(protected)/events/[slug]/page.tsx`, `(protected)/leaders/page.tsx`, `verify/page.tsx`, `EventListing.tsx`, `next`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Should `register/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07493061979648474 - nodes in this community are weakly interconnected._
- **Should `requestBodyErrorResponse` be split into smaller, more focused modules?**
  _Cohesion score 0.14245014245014245 - nodes in this community are weakly interconnected._