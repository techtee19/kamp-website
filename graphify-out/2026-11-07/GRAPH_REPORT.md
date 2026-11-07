# Graph Report - kamp-website  (2026-11-07)

## Corpus Check
- 243 files · ~84,735 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .ico 3, (none) 2, .example 1)

## Summary
- 1089 nodes · 2476 edges · 86 communities (56 shown, 30 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bc2fe9ec`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- email.ts
- Admin Dashboard Analytics
- migrate-gallery.mjs
- register/route.ts
- requestBodyErrorResponse
- Sanity Studio Setup
- email.ts
- getAdminSession
- About and Contact Content
- Package Development Dependencies
- Gallery Experience
- Homepage Sections
- Application Dependencies
- TypeScript Configuration
- db
- (site)/events/[slug]/page.tsx
- check-in/verify/route.ts
- readJsonRequest
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
- sanity.ts
- member-verify/route.ts
- react
- Check-in Login Screen
- Application Root Layout
- requests/page.tsx
- Vercel Deployment Config
- checkin-access.ts
- Prettier Configuration
- Sanity Studio Page
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
1. `db` - 127 edges
2. `next` - 117 edges
3. `readJsonRequest()` - 60 edges
4. `react` - 49 edges
5. `getAdminSession()` - 42 edges
6. `requestBodyErrorResponse()` - 38 edges
7. `isSameOriginAdminRequest()` - 34 edges
8. `rateLimit()` - 30 edges
9. `getClientIp()` - 29 edges
10. `lucide-react` - 22 edges

## Surprising Connections (you probably didn't know these)
- `LeaderRequestsAdminPage()` --calls--> `db`  [EXTRACTED]
  app/admin/(protected)/requests/page.tsx → lib/db.ts
- `LeaderDashboardPage()` --calls--> `db`  [EXTRACTED]
  app/leaders/(portal)/dashboard/page.tsx → lib/db.ts
- `EventCardProps` --references--> `EventDocument`  [EXTRACTED]
  components/events/EventCard.tsx → types/sanity.ts
- `createAdminSession()` --calls--> `POST()`  [EXTRACTED]
  lib/admin-session.ts → app/admin/api/login/route.ts
- `campaignCounts()` --calls--> `db`  [EXTRACTED]
  app/admin/api/members/community-campaign/route.ts → lib/db.ts

## Import Cycles
- None detected.

## Communities (86 total, 30 thin omitted)

### Community 0 - "email.ts"
Cohesion: 0.07
Nodes (58): campaignCounts(), dynamic, POST(), runtime, dynamic, POST(), runtime, dynamic (+50 more)

### Community 1 - "Admin Dashboard Analytics"
Cohesion: 0.08
Nodes (49): AdminDashboardPage(), AnalyticsDirectoryLoading(), AnalyticsPanelLoading(), DashboardAnalytics(), DashboardOverview(), dynamic, EventRegistrationsLoading(), EventRegistrationsOverview() (+41 more)

### Community 2 - "migrate-gallery.mjs"
Cohesion: 0.05
Nodes (40): files, migrate(), KampEvent, kampEvents, emerge2025, featuredPhotos, GALLERY_IMAGE_DIR, KampGalleryAlbum (+32 more)

### Community 3 - "register/route.ts"
Cohesion: 0.07
Nodes (31): POST(), runtime, POST(), runtime, EventSnapshot, EventWebhookPayload, POST(), runtime (+23 more)

### Community 4 - "requestBodyErrorResponse"
Cohesion: 0.11
Nodes (20): PATCH(), dynamic, POST(), runtime, bodySchema, dynamic, PATCH(), runtime (+12 more)

### Community 5 - "Sanity Studio Setup"
Cohesion: 0.18
Nodes (10): sanity@^5.31.1, sanity, plugins, eventSchema, galleryEventSchema, schemaTypes, memberSchema, programSchema (+2 more)

### Community 6 - "email.ts"
Cohesion: 0.09
Nodes (28): POST(), POST(), runtime, POST(), runtime, LeaderLoginPage(), LeadersIndexPage(), dynamic (+20 more)

### Community 7 - "getAdminSession"
Cohesion: 0.14
Nodes (20): createSchema, DELETE(), dynamic, eventSlugSchema, GET(), POST(), revokeSchema, runtime (+12 more)

### Community 8 - "About and Contact Content"
Cohesion: 0.14
Nodes (18): AboutPage(), FounderCard, revalidate, TeamCard, values, ContactPage(), revalidate, ContactForm() (+10 more)

### Community 9 - "Package Development Dependencies"
Cohesion: 0.10
Nodes (27): eslintConfig, devDependencies, eslint@^9, eslint-config-next@16.3.0, prettier@^3.9.6, prettier-plugin-tailwindcss@^0.8.1, tailwindcss@^4, @tailwindcss/postcss@^4 (+19 more)

### Community 10 - "Gallery Experience"
Cohesion: 0.18
Nodes (13): GalleryIntro(), GalleryPage(), revalidate, GalleryAlbum(), GalleryAlbumProps, slots, GalleryAlbums(), GalleryAlbumsProps (+5 more)

### Community 11 - "Homepage Sections"
Cohesion: 0.13
Nodes (16): actions, fallbackStats, HomePage(), partners, revalidate, GetInvolvedTabs(), tabs, HeroImageRotator() (+8 more)

### Community 12 - "Application Dependencies"
Cohesion: 0.09
Nodes (23): dependencies, clsx@^2.1.1, next@16.3.0, next-auth@^4.24.15, qrcode@^1.5.4, react@19.2.8, react-dom@19.2.8, @react-email/components@^1.0.12 (+15 more)

### Community 13 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 14 - "db"
Cohesion: 0.15
Nodes (15): dynamic, GET(), runtime, AdminLeaderReportDetail(), dynamic, dynamic, LeaderReportsAdminPage(), dynamic (+7 more)

### Community 15 - "(site)/events/[slug]/page.tsx"
Cohesion: 0.28
Nodes (7): descriptionComponents, EventDetailPage(), formatDate(), formatTime(), revalidate, EVENT_BY_SLUG_QUERY, EVENT_SLUGS_QUERY

### Community 16 - "check-in/verify/route.ts"
Cohesion: 0.23
Nodes (9): dynamic, requestSchema, runtime, dynamic, requestSchema, runtime, codeHash(), createCheckinLoginCode() (+1 more)

### Community 17 - "readJsonRequest"
Cohesion: 0.17
Nodes (27): POST(), runtime, verifyPassword(), POST(), POST(), POST(), POST(), dynamic (+19 more)

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
Cohesion: 0.31
Nodes (8): EventCard(), EventsPage(), formatEventDate(), revalidate, FeaturedEventsCarousel(), formatEventDate(), PAST_EVENTS_QUERY, UPCOMING_EVENTS_QUERY

### Community 27 - "validations.ts"
Cohesion: 0.05
Nodes (43): GET(), normalize(), CommunityJoinPage(), metadata, dynamic, LeadershipInvitationPage(), metadata, benefits (+35 more)

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
Cohesion: 0.09
Nodes (24): NewLeaderReportPage(), NewLeaderRequestPage(), LeaderReportForm(), LeaderRequestForm(), LeaderSelect(), onKeyDown(), openAtSelected(), LeaderSelectOption (+16 more)

### Community 32 - "Core Database Migrations"
Cohesion: 0.29
Nodes (8): contact_submissions, donations, events_registrations, idx_donations_email, idx_donations_paystack_ref, idx_registrations_email, idx_registrations_event_id, idx_registrations_event_email_unique

### Community 33 - "Development Dependencies"
Cohesion: 0.20
Nodes (10): scripts, admin:hash-password, build, db:check, db:migrate, dev, lint, migrate:events (+2 more)

### Community 34 - "lucide-react"
Cohesion: 0.16
Nodes (6): DonationReference(), DonateSuccessPage(), pathways, metadata, lucide-react@^1.28.0, lucide-react

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
Cohesion: 0.24
Nodes (7): EventCardProps, EventDocument, SanityBlock, SanityImage, SanityImageAsset, SanityResolvedImage, SanitySlug

### Community 39 - "member-verify/route.ts"
Cohesion: 0.36
Nodes (6): requestSchema, runtime, codeHash(), createMemberVerificationCode(), verifyMemberVerificationCode(), zod

### Community 40 - "react"
Cohesion: 0.33
Nodes (3): AdminLoginPage(), Operator, react

### Community 41 - "Check-in Login Screen"
Cohesion: 0.38
Nodes (3): CheckinLoginPage(), dynamic, CheckinLoginForm()

### Community 42 - "Application Root Layout"
Cohesion: 0.29
Nodes (4): metadata, urbanist, @vercel/analytics@^2.0.1, @vercel/analytics

### Community 43 - "requests/page.tsx"
Cohesion: 0.50
Nodes (3): dynamic, LeaderRequestsAdminPage(), statuses

### Community 45 - "Vercel Deployment Config"
Cohesion: 0.29
Nodes (6): maxDuration, framework, functions, app/api/paystack/webhook/route.ts, regions, $schema

### Community 46 - "checkin-access.ts"
Cohesion: 0.06
Nodes (43): dynamic, POST(), runtime, dynamic, POST(), runtime, dynamic, GET() (+35 more)

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

### Community 55 - "(protected)/leaders/page.tsx"
Cohesion: 0.39
Nodes (4): dynamic, LeadersAdminPage(), CreateLeader(), LeaderStatusButton()

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
Nodes (6): metadata, metadata, csp, nextConfig, config, next

## Knowledge Gaps
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `email.ts`, `Admin Dashboard Analytics`, `migrate-gallery.mjs`, `register/route.ts`, `requestBodyErrorResponse`, `email.ts`, `getAdminSession`, `About and Contact Content`, `Package Development Dependencies`, `Gallery Experience`, `Homepage Sections`, `Application Dependencies`, `db`, `(site)/events/[slug]/page.tsx`, `check-in/verify/route.ts`, `readJsonRequest`, `Community Email Campaigns`, `Navigation and Footer`, `Leadership Invitations`, `[memberId]/page.tsx`, `Events Listing`, `validations.ts`, `programs/page.tsx`, `members/page.tsx`, `leader-validations.ts`, `lucide-react`, `GalleryMarquee.tsx`, `(protected)/requests/[id]/page.tsx`, `Admin Navigation`, `sanity.ts`, `member-verify/route.ts`, `react`, `Check-in Login Screen`, `Application Root Layout`, `requests/page.tsx`, `checkin-access.ts`, `(protected)/leaders/page.tsx`, `remind/route.ts`, `verify/page.tsx`?**
  _High betweenness centrality (0.359) - this node is a cross-community bridge._
- **Should `email.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06582952815829528 - nodes in this community are weakly interconnected._
- **Why does `db` connect `db` to `email.ts`, `Admin Dashboard Analytics`, `migrate-gallery.mjs`, `register/route.ts`, `requestBodyErrorResponse`, `email.ts`, `getAdminSession`, `check-in/verify/route.ts`, `readJsonRequest`, `Community Email Campaigns`, `Leadership Invitations`, `[memberId]/page.tsx`, `members/page.tsx`, `(protected)/requests/[id]/page.tsx`, `member-verify/route.ts`, `Check-in Login Screen`, `requests/page.tsx`, `checkin-access.ts`, `(protected)/leaders/page.tsx`, `remind/route.ts`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Should `Admin Dashboard Analytics` be split into smaller, more focused modules?**
  _Cohesion score 0.07948568088836938 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `email.ts`, `Admin Dashboard Analytics`, `migrate-gallery.mjs`, `register/route.ts`, `email.ts`, `About and Contact Content`, `Package Development Dependencies`, `Gallery Experience`, `Homepage Sections`, `Application Dependencies`, `Community Email Campaigns`, `Navigation and Footer`, `[memberId]/page.tsx`, `Events Listing`, `validations.ts`, `members/page.tsx`, `Donation Form`, `leader-validations.ts`, `lucide-react`, `GalleryMarquee.tsx`, `(protected)/requests/[id]/page.tsx`, `Admin Navigation`, `Check-in Login Screen`, `checkin-access.ts`, `(protected)/leaders/page.tsx`, `verify/page.tsx`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Should `migrate-gallery.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.054901960784313725 - nodes in this community are weakly interconnected._
- **Should `register/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07493061979648474 - nodes in this community are weakly interconnected._