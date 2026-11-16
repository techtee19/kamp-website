# Graph Report - kamp-website  (2026-11-16)

## Corpus Check
- 247 files · ~86,220 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .ico 3, (none) 2, .example 1)

## Summary
- 1106 nodes · 2530 edges · 86 communities (52 shown, 34 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `11208b85`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- email.ts
- Admin Dashboard Analytics
- migrate-gallery.mjs
- register/route.ts
- community-status/route.ts
- Sanity Studio Setup
- leader-validations.ts
- getAdminSession
- About and Contact Content
- Package Development Dependencies
- Gallery Experience
- Homepage Sections
- Application Dependencies
- TypeScript Configuration
- admin-data.ts
- resend-card/route.ts
- check-in/verify/route.ts
- LeaderPortalNav.tsx
- Leadership and Engagement Migrations
- Community Email Campaigns
- Navigation and Footer
- Brand Asset Generation
- sanity.config.ts
- Event Check-in Migrations
- membership/route.ts
- readJsonRequest
- Events Listing
- MembershipForm.tsx
- programs/page.tsx
- members/page.tsx
- (site)/events/[slug]/page.tsx
- (protected)/events/[slug]/page.tsx
- Core Database Migrations
- Development Dependencies
- get-involved/page.tsx
- next-sanity
- (protected)/leaders/page.tsx
- Admin Navigation
- operators/route.ts
- GalleryMarquee.tsx
- react
- next
- Application Root Layout
- email.ts
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
- [[...tool]]/layout.tsx
- success/page.tsx
- proxy.ts

## God Nodes (most connected - your core abstractions)
1. `db` - 132 edges
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
- `AdminLeaderRequestDetail()` --calls--> `db`  [EXTRACTED]
  app/admin/(protected)/requests/[id]/page.tsx → lib/db.ts
- `POST()` --calls--> `isSameOriginAdminRequest()`  [EXTRACTED]
  app/admin/api/requests/[id]/notify/route.ts → lib/admin-request.ts
- `POST()` --calls--> `db`  [EXTRACTED]
  app/admin/api/requests/[id]/notify/route.ts → lib/db.ts
- `POST()` --calls--> `sendNewSubmissionNotices()`  [EXTRACTED]
  app/admin/api/requests/[id]/notify/route.ts → lib/email.ts
- `EventCardProps` --references--> `EventDocument`  [EXTRACTED]
  components/events/EventCard.tsx → types/sanity.ts

## Import Cycles
- None detected.

## Communities (86 total, 34 thin omitted)

### Community 0 - "email.ts"
Cohesion: 0.31
Nodes (19): ADMIN(), esc(), FROM(), getCEOEmail(), resend(), sendCommunityInvitation(), sendContactNotification(), sendDonationReceipt() (+11 more)

### Community 1 - "Admin Dashboard Analytics"
Cohesion: 0.06
Nodes (62): dynamic, GET(), dynamic, GET(), AdminDashboardPage(), AnalyticsDirectoryLoading(), AnalyticsPanelLoading(), DashboardAnalytics() (+54 more)

### Community 2 - "migrate-gallery.mjs"
Cohesion: 0.06
Nodes (36): KampEvent, kampEvents, emerge2025, featuredPhotos, GALLERY_IMAGE_DIR, KampGalleryAlbum, kampGalleryAlbums, KampGalleryPhoto (+28 more)

### Community 3 - "register/route.ts"
Cohesion: 0.09
Nodes (28): POST(), runtime, POST(), runtime, EventSnapshot, EventWebhookPayload, POST(), runtime (+20 more)

### Community 4 - "community-status/route.ts"
Cohesion: 0.10
Nodes (18): bodySchema, dynamic, runtime, DELETE(), dynamic, runtime, dynamic, positionSchema (+10 more)

### Community 5 - "Sanity Studio Setup"
Cohesion: 0.18
Nodes (10): sanity@^5.31.1, sanity, plugins, eventSchema, galleryEventSchema, schemaTypes, memberSchema, programSchema (+2 more)

### Community 6 - "leader-validations.ts"
Cohesion: 0.09
Nodes (24): NewLeaderReportPage(), NewLeaderRequestPage(), LeaderReportForm(), LeaderRequestForm(), LeaderSelect(), onKeyDown(), openAtSelected(), LeaderSelectOption (+16 more)

### Community 7 - "getAdminSession"
Cohesion: 0.15
Nodes (18): DELETE(), PATCH(), dynamic, POST(), runtime, POST(), DELETE(), maxDuration (+10 more)

### Community 8 - "About and Contact Content"
Cohesion: 0.13
Nodes (19): AboutPage(), FounderCard, revalidate, TeamCard, values, ContactPage(), revalidate, ContactForm() (+11 more)

### Community 9 - "Package Development Dependencies"
Cohesion: 0.08
Nodes (24): eslintConfig, devDependencies, eslint@^9, eslint-config-next@16.3.0, prettier@^3.9.6, prettier-plugin-tailwindcss@^0.8.1, tailwindcss@^4, @tailwindcss/postcss@^4 (+16 more)

### Community 10 - "Gallery Experience"
Cohesion: 0.14
Nodes (18): GalleryIntro(), GalleryPage(), revalidate, GalleryAlbum(), GalleryAlbumProps, slots, GalleryAlbums(), GalleryAlbumsProps (+10 more)

### Community 11 - "Homepage Sections"
Cohesion: 0.14
Nodes (15): actions, fallbackStats, HomePage(), partners, revalidate, GetInvolvedTabs(), tabs, HeroImageRotator() (+7 more)

### Community 12 - "Application Dependencies"
Cohesion: 0.08
Nodes (34): dependencies, clsx@^2.1.1, next@16.3.0, next-auth@^4.24.15, @portabletext/react@^8.0.0, qrcode@^1.5.4, react@19.2.8, react-dom@19.2.8 (+26 more)

### Community 13 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 14 - "admin-data.ts"
Cohesion: 0.27
Nodes (8): dynamic, GET(), runtime, dynamic, GET(), runtime, buildCsv(), csvCell()

### Community 15 - "resend-card/route.ts"
Cohesion: 0.33
Nodes (11): campaignCounts(), dynamic, POST(), runtime, dynamic, POST(), runtime, createCommunityLinkToken() (+3 more)

### Community 16 - "check-in/verify/route.ts"
Cohesion: 0.08
Nodes (29): dynamic, EventCheckinPage(), dynamic, POST(), runtime, dynamic, POST(), requestSchema (+21 more)

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
Cohesion: 0.08
Nodes (29): dynamic, InvitationError, invitationSchema, runtime, dynamic, LeadershipInvitationsPage(), dynamic, GET() (+21 more)

### Community 25 - "readJsonRequest"
Cohesion: 0.21
Nodes (21): DELETE(), POST(), dynamic, POST(), runtime, dynamic, POST(), runtime (+13 more)

### Community 26 - "Events Listing"
Cohesion: 0.19
Nodes (12): EventCard(), EventsPage(), formatEventDate(), revalidate, EventCardProps, FeaturedEventsCarousel(), formatEventDate(), lucide-react@^1.28.0 (+4 more)

### Community 27 - "MembershipForm.tsx"
Cohesion: 0.06
Nodes (39): GET(), normalize(), CommunityJoinPage(), metadata, dynamic, LeadershipInvitationPage(), metadata, benefits (+31 more)

### Community 28 - "programs/page.tsx"
Cohesion: 0.22
Nodes (7): executiveRoles, focusAreas, journey, ProgramCard, revalidate, PROGRAMS_QUERY, ProgramDocument

### Community 29 - "members/page.tsx"
Cohesion: 0.43
Nodes (4): AdminMembersPage(), dynamic, escapeLike(), MembersSearch()

### Community 30 - "(site)/events/[slug]/page.tsx"
Cohesion: 0.23
Nodes (9): descriptionComponents, EventDetailPage(), formatDate(), formatTime(), revalidate, RegistrationForm(), RegistrationFormProps, EVENT_BY_SLUG_QUERY (+1 more)

### Community 31 - "(protected)/events/[slug]/page.tsx"
Cohesion: 0.26
Nodes (8): AdminEventRegistrationsPage(), dynamic, CheckinOperatorManager(), addOperator(), load(), revoke(), Operator, SendReminderButton()

### Community 32 - "Core Database Migrations"
Cohesion: 0.29
Nodes (8): contact_submissions, donations, events_registrations, idx_donations_email, idx_donations_paystack_ref, idx_registrations_email, idx_registrations_event_id, idx_registrations_event_email_unique

### Community 33 - "Development Dependencies"
Cohesion: 0.20
Nodes (10): scripts, admin:hash-password, build, db:check, db:migrate, dev, lint, migrate:events (+2 more)

### Community 35 - "next-sanity"
Cohesion: 0.40
Nodes (3): dynamic, next-sanity@13, next-sanity

### Community 36 - "(protected)/leaders/page.tsx"
Cohesion: 0.39
Nodes (4): dynamic, LeadersAdminPage(), CreateLeader(), LeaderStatusButton()

### Community 37 - "Admin Navigation"
Cohesion: 0.39
Nodes (4): ProtectedAdminLayout(), AdminNavigation(), items, LogoutButton()

### Community 38 - "operators/route.ts"
Cohesion: 0.29
Nodes (6): createSchema, dynamic, eventSlugSchema, GET(), revokeSchema, runtime

### Community 39 - "GalleryMarquee.tsx"
Cohesion: 0.43
Nodes (6): columns, GalleryMarquee(), mobileColumns, MosaicRow(), Row, Tile()

### Community 40 - "react"
Cohesion: 0.19
Nodes (7): AdminLoginPage(), dynamic, MemberProfilePage(), DeleteMemberButton(), EditMemberPosition(), ResendCardButton(), react

### Community 41 - "next"
Cohesion: 0.11
Nodes (8): CheckinLoginPage(), dynamic, metadata, metadata, CheckinLoginForm(), csp, nextConfig, next

### Community 43 - "email.ts"
Cohesion: 0.05
Nodes (62): POST(), runtime, verifyPassword(), dynamic, POST(), runtime, POST(), POST() (+54 more)

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
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Admin Dashboard Analytics`, `migrate-gallery.mjs`, `register/route.ts`, `community-status/route.ts`, `leader-validations.ts`, `getAdminSession`, `About and Contact Content`, `Gallery Experience`, `Homepage Sections`, `Application Dependencies`, `admin-data.ts`, `resend-card/route.ts`, `check-in/verify/route.ts`, `LeaderPortalNav.tsx`, `Community Email Campaigns`, `Navigation and Footer`, `membership/route.ts`, `readJsonRequest`, `Events Listing`, `MembershipForm.tsx`, `programs/page.tsx`, `members/page.tsx`, `(site)/events/[slug]/page.tsx`, `(protected)/events/[slug]/page.tsx`, `get-involved/page.tsx`, `(protected)/leaders/page.tsx`, `Admin Navigation`, `operators/route.ts`, `GalleryMarquee.tsx`, `react`, `Application Root Layout`, `email.ts`, `(protected)/requests/[id]/page.tsx`, `(protected)/leaders/page.tsx`, `verify/page.tsx`, `[[...tool]]/layout.tsx`, `success/page.tsx`, `proxy.ts`?**
  _High betweenness centrality (0.327) - this node is a cross-community bridge._
- **Should `Admin Dashboard Analytics` be split into smaller, more focused modules?**
  _Cohesion score 0.05759493670886076 - nodes in this community are weakly interconnected._
- **Why does `db` connect `Admin Dashboard Analytics` to `register/route.ts`, `community-status/route.ts`, `(protected)/leaders/page.tsx`, `operators/route.ts`, `getAdminSession`, `react`, `next`, `email.ts`, `admin-data.ts`, `resend-card/route.ts`, `check-in/verify/route.ts`, `(protected)/requests/[id]/page.tsx`, `Community Email Campaigns`, `(protected)/leaders/page.tsx`, `membership/route.ts`, `readJsonRequest`, `members/page.tsx`, `(protected)/events/[slug]/page.tsx`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Should `migrate-gallery.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.06262626262626263 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Admin Dashboard Analytics`, `migrate-gallery.mjs`, `register/route.ts`, `leader-validations.ts`, `About and Contact Content`, `Gallery Experience`, `Homepage Sections`, `Application Dependencies`, `check-in/verify/route.ts`, `Community Email Campaigns`, `Navigation and Footer`, `membership/route.ts`, `Events Listing`, `MembershipForm.tsx`, `members/page.tsx`, `(site)/events/[slug]/page.tsx`, `(protected)/events/[slug]/page.tsx`, `(protected)/leaders/page.tsx`, `Admin Navigation`, `GalleryMarquee.tsx`, `next`, `email.ts`, `(protected)/requests/[id]/page.tsx`, `DonateForm.tsx`, `(protected)/leaders/page.tsx`, `verify/page.tsx`, `success/page.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Should `register/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09024390243902439 - nodes in this community are weakly interconnected._
- **Should `community-status/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10153846153846154 - nodes in this community are weakly interconnected._