# Graph Report - kamp-website  (2026-11-06)

## Corpus Check
- 239 files · ~83,671 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .ico 3, (none) 2, .example 1)

## Summary
- 1075 nodes · 2449 edges · 81 communities (50 shown, 31 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5e458aeb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- membership/route.ts
- Admin Dashboard Analytics
- migrate-gallery.mjs
- event-tables.ts
- remind/route.ts
- Sanity Studio Setup
- email.ts
- readJsonRequest
- About and Contact Content
- Package Development Dependencies
- Gallery Experience
- Homepage Sections
- Application Dependencies
- TypeScript Configuration
- getAdminSession
- db
- Check-in Authentication
- member-code/route.ts
- Leadership and Engagement Migrations
- Community Email Campaigns
- Navigation and Footer
- Brand Asset Generation
- leader-auth.ts
- Event Check-in Migrations
- Leadership Invitations
- react
- Events Listing
- validations.ts
- queries.ts
- getLeader
- Donation Form
- leader-validations.ts
- Core Database Migrations
- Development Dependencies
- lucide-react
- GalleryMarquee.tsx
- verify/page.tsx
- Admin Navigation
- Check-in Login Screen
- Application Root Layout
- Vercel Deployment Config
- Prettier Configuration
- Sanity Studio Page
- Member Table Migration
- Database Check Scripts
- Database Type Definitions
- Admin Dashboard Loading
- ticket.tsx
- Site Loading Skeletons
- Rate Limit Migration
- Request Proxy
- 018_leaders_portal.sql
- PostCSS Configuration
- requireLeader
- LeaderPortalNav.tsx
- next

## God Nodes (most connected - your core abstractions)
1. `db` - 127 edges
2. `next` - 113 edges
3. `readJsonRequest()` - 60 edges
4. `react` - 48 edges
5. `getAdminSession()` - 42 edges
6. `requestBodyErrorResponse()` - 38 edges
7. `isSameOriginAdminRequest()` - 34 edges
8. `rateLimit()` - 30 edges
9. `getClientIp()` - 29 edges
10. `lucide-react` - 21 edges

## Surprising Connections (you probably didn't know these)
- `LeaderRequestsAdminPage()` --calls--> `db`  [EXTRACTED]
  app/admin/(protected)/requests/page.tsx → lib/db.ts
- `PATCH()` --calls--> `db`  [EXTRACTED]
  app/admin/api/leaders/[id]/route.ts → lib/db.ts
- `PATCH()` --calls--> `readJsonRequest()`  [EXTRACTED]
  app/admin/api/leaders/[id]/route.ts → lib/request-body.ts
- `POST()` --calls--> `db`  [EXTRACTED]
  app/admin/api/leaders/route.ts → lib/db.ts
- `POST()` --calls--> `sendLeaderInvite()`  [EXTRACTED]
  app/admin/api/leaders/route.ts → lib/email.ts

## Import Cycles
- None detected.

## Communities (81 total, 31 thin omitted)

### Community 0 - "membership/route.ts"
Cohesion: 0.07
Nodes (42): campaignCounts(), dynamic, POST(), runtime, dynamic, POST(), runtime, dynamic (+34 more)

### Community 1 - "Admin Dashboard Analytics"
Cohesion: 0.08
Nodes (50): AdminDashboardPage(), AnalyticsDirectoryLoading(), AnalyticsPanelLoading(), DashboardAnalytics(), DashboardOverview(), dynamic, EventRegistrationsLoading(), EventRegistrationsOverview() (+42 more)

### Community 2 - "migrate-gallery.mjs"
Cohesion: 0.05
Nodes (40): files, migrate(), KampEvent, kampEvents, emerge2025, featuredPhotos, GALLERY_IMAGE_DIR, KampGalleryAlbum (+32 more)

### Community 3 - "event-tables.ts"
Cohesion: 0.22
Nodes (11): EventSnapshot, EventWebhookPayload, POST(), runtime, assertSafeTableName(), createEventRegistrationTable(), DuplicateRegistrationError, EventFullError (+3 more)

### Community 4 - "remind/route.ts"
Cohesion: 0.14
Nodes (21): dynamic, POST(), runtime, dynamic, POST(), runtime, dynamic, lagosDate() (+13 more)

### Community 5 - "Sanity Studio Setup"
Cohesion: 0.09
Nodes (20): sanity@^5.31.1, @sanity/image-url@2, @sanity/vision@^5.31.1, sanity, @sanity/image-url, @sanity/vision, apiVersion, dataset (+12 more)

### Community 6 - "email.ts"
Cohesion: 0.14
Nodes (27): POST(), runtime, POST(), runtime, ADMIN(), esc(), FROM(), getCEOEmail() (+19 more)

### Community 7 - "readJsonRequest"
Cohesion: 0.12
Nodes (31): POST(), runtime, verifyPassword(), dynamic, POST(), requestSchema, runtime, dynamic (+23 more)

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
Nodes (16): actions, fallbackStats, HomePage(), partners, revalidate, GetInvolvedTabs(), tabs, HeroImageRotator() (+8 more)

### Community 12 - "Application Dependencies"
Cohesion: 0.09
Nodes (23): dependencies, clsx@^2.1.1, next@16.3.0, next-auth@^4.24.15, react@19.2.8, react-dom@19.2.8, @react-email/components@^1.0.12, react-icons@^5.7.0 (+15 more)

### Community 13 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 14 - "getAdminSession"
Cohesion: 0.10
Nodes (32): createSchema, DELETE(), dynamic, eventSlugSchema, GET(), POST(), revokeSchema, runtime (+24 more)

### Community 15 - "db"
Cohesion: 0.18
Nodes (13): dynamic, GET(), dynamic, GET(), AdminLeaderReportDetail(), dynamic, dynamic, LeaderReportsAdminPage() (+5 more)

### Community 16 - "Check-in Authentication"
Cohesion: 0.18
Nodes (16): dynamic, POST(), runtime, dynamic, POST(), requestSchema, runtime, CHECKIN_SESSION_COOKIE (+8 more)

### Community 17 - "member-code/route.ts"
Cohesion: 0.24
Nodes (10): POST(), requestSchema, runtime, requestSchema, runtime, codeHash(), createEventMemberChallenge(), createMemberVerificationCode() (+2 more)

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

### Community 22 - "leader-auth.ts"
Cohesion: 0.24
Nodes (12): POST(), POST(), runtime, POST(), runtime, createLeaderSession(), destroyLeaderSession(), generateToken() (+4 more)

### Community 23 - "Event Check-in Migrations"
Cohesion: 0.28
Nodes (11): idx_registry_event_id, idx_registry_event_slug, public.event_tables_registry, event_checkin_audit_event_created_idx, event_checkin_login_codes_operator_idx, event_checkin_operators_email_idx, event_checkin_sessions_operator_idx, public.event_checkin_audit (+3 more)

### Community 24 - "Leadership Invitations"
Cohesion: 0.33
Nodes (5): dynamic, InvitationError, invitationSchema, POST(), runtime

### Community 25 - "react"
Cohesion: 0.05
Nodes (34): AdminLoginPage(), dynamic, EventCheckinPage(), AdminEventRegistrationsPage(), dynamic, dynamic, LeadersAdminPage(), dynamic (+26 more)

### Community 26 - "Events Listing"
Cohesion: 0.22
Nodes (10): EventCard(), EventsPage(), formatEventDate(), revalidate, EventCardProps, FeaturedEventsCarousel(), formatEventDate(), PAST_EVENTS_QUERY (+2 more)

### Community 27 - "validations.ts"
Cohesion: 0.05
Nodes (43): GET(), normalize(), CommunityJoinPage(), metadata, dynamic, LeadershipInvitationPage(), metadata, benefits (+35 more)

### Community 28 - "queries.ts"
Cohesion: 0.12
Nodes (19): descriptionComponents, EventDetailPage(), formatDate(), formatTime(), revalidate, executiveRoles, focusAreas, journey (+11 more)

### Community 29 - "getLeader"
Cohesion: 0.33
Nodes (5): LeaderLoginPage(), LeadersIndexPage(), PortalLoginForm(), getLeader(), safeEqual()

### Community 30 - "Donation Form"
Cohesion: 0.24
Nodes (8): amounts, AmountSelector(), AmountSelectorProps, DonateForm(), DONATION_TYPE, Frequency, PaymentMethod, paymentMethods

### Community 31 - "leader-validations.ts"
Cohesion: 0.12
Nodes (16): email, leaderCreateSchema, leaderLoginRequestSchema, LeaderReportInput, leaderReportSchema, LeaderRequestInput, leaderRequestSchema, leaderStatusSchema (+8 more)

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

### Community 37 - "Admin Navigation"
Cohesion: 0.39
Nodes (4): ProtectedAdminLayout(), AdminNavigation(), items, LogoutButton()

### Community 41 - "Check-in Login Screen"
Cohesion: 0.38
Nodes (3): CheckinLoginPage(), dynamic, CheckinLoginForm()

### Community 42 - "Application Root Layout"
Cohesion: 0.29
Nodes (4): metadata, urbanist, @vercel/analytics@^2.0.1, @vercel/analytics

### Community 45 - "Vercel Deployment Config"
Cohesion: 0.29
Nodes (6): maxDuration, framework, functions, app/api/paystack/webhook/route.ts, regions, $schema

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

### Community 53 - "ticket.tsx"
Cohesion: 0.16
Nodes (12): dynamic, GET(), runtime, generateTicketPDF(), PREVIEW_TICKET_REF, styles, TicketData, TicketDocument() (+4 more)

### Community 77 - "018_leaders_portal.sql"
Cohesion: 0.32
Nodes (11): idx_login_tokens_expiry, idx_login_tokens_leader, idx_reports_created, idx_reports_leader, idx_requests_created, idx_requests_leader, idx_requests_status, public.leader_login_tokens (+3 more)

### Community 87 - "requireLeader"
Cohesion: 0.27
Nodes (7): dynamic, LeaderDashboardPage(), dynamic, LeaderReportDetailPage(), dynamic, LeaderRequestDetailPage(), requireLeader()

### Community 92 - "LeaderPortalNav.tsx"
Cohesion: 0.48
Nodes (4): LeaderPortalLayout(), LeaderLogoutButton(), LeaderPortalNav(), links

### Community 93 - "next"
Cohesion: 0.10
Nodes (11): AdminLeaderRequestDetail(), dynamic, dynamic, LeaderRequestsAdminPage(), statuses, metadata, metadata, ReviewLeaderRequest() (+3 more)

## Knowledge Gaps
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `membership/route.ts`, `Admin Dashboard Analytics`, `migrate-gallery.mjs`, `event-tables.ts`, `remind/route.ts`, `email.ts`, `readJsonRequest`, `About and Contact Content`, `Package Development Dependencies`, `Gallery Experience`, `Homepage Sections`, `Application Dependencies`, `getAdminSession`, `db`, `Check-in Authentication`, `member-code/route.ts`, `Community Email Campaigns`, `Navigation and Footer`, `leader-auth.ts`, `Leadership Invitations`, `react`, `Events Listing`, `validations.ts`, `queries.ts`, `getLeader`, `lucide-react`, `GalleryMarquee.tsx`, `verify/page.tsx`, `Admin Navigation`, `Check-in Login Screen`, `Application Root Layout`, `ticket.tsx`, `Request Proxy`, `requireLeader`, `LeaderPortalNav.tsx`?**
  _High betweenness centrality (0.306) - this node is a cross-community bridge._
- **Should `membership/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07268170426065163 - nodes in this community are weakly interconnected._
- **Why does `db` connect `db` to `membership/route.ts`, `Admin Dashboard Analytics`, `migrate-gallery.mjs`, `event-tables.ts`, `remind/route.ts`, `email.ts`, `readJsonRequest`, `Check-in Login Screen`, `getAdminSession`, `Check-in Authentication`, `member-code/route.ts`, `getLeader`, `Community Email Campaigns`, `leader-auth.ts`, `requireLeader`, `Leadership Invitations`, `react`, `next`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Should `Admin Dashboard Analytics` be split into smaller, more focused modules?**
  _Cohesion score 0.07796610169491526 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `membership/route.ts`, `Admin Dashboard Analytics`, `migrate-gallery.mjs`, `About and Contact Content`, `Package Development Dependencies`, `Gallery Experience`, `Homepage Sections`, `Application Dependencies`, `Community Email Campaigns`, `Navigation and Footer`, `Events Listing`, `validations.ts`, `getLeader`, `Donation Form`, `leader-validations.ts`, `lucide-react`, `GalleryMarquee.tsx`, `verify/page.tsx`, `Admin Navigation`, `Check-in Login Screen`, `ticket.tsx`, `next`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Should `migrate-gallery.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.054901960784313725 - nodes in this community are weakly interconnected._
- **Should `remind/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13675213675213677 - nodes in this community are weakly interconnected._