# Graph Report - kamp-website  (2026-11-16)

## Corpus Check
- 245 files · ~85,786 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .ico 3, (none) 2, .example 1)

## Summary
- 1099 nodes · 2509 edges · 97 communities (58 shown, 39 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d1897e2a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- request-body.ts
- Admin Dashboard Analytics
- migrate-events.mjs
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
- db
- migrate-gallery.mjs
- check-in/verify/route.ts
- leader-auth.ts
- Leadership and Engagement Migrations
- Community Email Campaigns
- Navigation and Footer
- Brand Asset Generation
- sanity.config.ts
- Event Check-in Migrations
- member-card.tsx
- readJsonRequest
- Events Listing
- MembershipForm.tsx
- programs/page.tsx
- members/page.tsx
- (site)/events/[slug]/page.tsx
- request-code/route.ts
- Core Database Migrations
- Development Dependencies
- get-involved/page.tsx
- next-sanity
- donate/route.ts
- Admin Navigation
- validations.ts
- leadership-invites/route.ts
- react
- next
- Application Root Layout
- email.ts
- WhatsAppJoinAction
- Vercel Deployment Config
- (protected)/requests/[id]/page.tsx
- Prettier Configuration
- admin-session.ts
- Member Table Migration
- Database Check Scripts
- Database Type Definitions
- Admin Dashboard Loading
- DonateForm.tsx
- Site Loading Skeletons
- (protected)/leaders/page.tsx
- nigerian-institutions.ts
- Rate Limit Migration
- gallery-data.ts
- allowBuilds
- verify/page.tsx
- 018_leaders_portal.sql
- PostCSS Configuration
- invite/page.tsx
- EventListing.tsx
- db-migrate.ts
- leaders/layout.tsx
- card-preview/page.tsx
- [[...tool]]/layout.tsx
- success/page.tsx
- next.config.ts
- proxy.ts
- @sanity/client

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
- `POST()` --calls--> `db`  [EXTRACTED]
  app/leaders/api/reports/route.ts → lib/db.ts
- `POST()` --calls--> `getLeader()`  [EXTRACTED]
  app/leaders/api/reports/route.ts → lib/leader-auth.ts
- `POST()` --calls--> `readJsonRequest()`  [EXTRACTED]
  app/leaders/api/reports/route.ts → lib/request-body.ts
- `POST()` --calls--> `db`  [EXTRACTED]
  app/leaders/api/requests/route.ts → lib/db.ts
- `POST()` --calls--> `getLeader()`  [EXTRACTED]
  app/leaders/api/requests/route.ts → lib/leader-auth.ts

## Import Cycles
- None detected.

## Communities (97 total, 39 thin omitted)

### Community 0 - "request-body.ts"
Cohesion: 0.22
Nodes (8): POST(), runtime, verifyWebhookSignature(), InvalidRequestBodyError, parseJsonBytes(), readRequestBytes(), RequestBodyTooLargeError, UnsupportedRequestMediaTypeError

### Community 1 - "Admin Dashboard Analytics"
Cohesion: 0.09
Nodes (45): AdminDashboardPage(), AnalyticsDirectoryLoading(), AnalyticsPanelLoading(), DashboardAnalytics(), DashboardOverview(), dynamic, EventRegistrationsLoading(), EventRegistrationsOverview() (+37 more)

### Community 2 - "migrate-events.mjs"
Cohesion: 0.17
Nodes (13): buildDocument(), client, DRY_RUN, IMAGE_ROOT, main(), MONTHS, pad(), projectId (+5 more)

### Community 3 - "register/route.ts"
Cohesion: 0.12
Nodes (22): POST(), runtime, EventSnapshot, EventWebhookPayload, POST(), runtime, dynamic, GET() (+14 more)

### Community 4 - "community-status/route.ts"
Cohesion: 0.14
Nodes (14): bodySchema, dynamic, PATCH(), runtime, DELETE(), dynamic, runtime, dynamic (+6 more)

### Community 5 - "Sanity Studio Setup"
Cohesion: 0.18
Nodes (10): sanity@^5.31.1, sanity, plugins, eventSchema, galleryEventSchema, schemaTypes, memberSchema, programSchema (+2 more)

### Community 6 - "leader-validations.ts"
Cohesion: 0.09
Nodes (24): NewLeaderReportPage(), NewLeaderRequestPage(), LeaderReportForm(), LeaderRequestForm(), LeaderSelect(), onKeyDown(), openAtSelected(), LeaderSelectOption (+16 more)

### Community 7 - "getAdminSession"
Cohesion: 0.15
Nodes (23): createSchema, DELETE(), dynamic, eventSlugSchema, GET(), POST(), revokeSchema, runtime (+15 more)

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
Cohesion: 0.11
Nodes (22): actions, fallbackStats, HomePage(), partners, revalidate, columns, GalleryMarquee(), mobileColumns (+14 more)

### Community 12 - "Application Dependencies"
Cohesion: 0.08
Nodes (25): dependencies, clsx@^2.1.1, next@16.3.0, next-auth@^4.24.15, qrcode@^1.5.4, react@19.2.8, react-dom@19.2.8, @react-email/components@^1.0.12 (+17 more)

### Community 13 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 14 - "db"
Cohesion: 0.14
Nodes (17): dynamic, POST(), runtime, dynamic, GET(), runtime, dynamic, GET() (+9 more)

### Community 15 - "migrate-gallery.mjs"
Cohesion: 0.20
Nodes (14): absolutePathFor(), assertFilesExist(), buildDocument(), client, DRY_RUN, fetchExistingAssets(), IMAGE_ROOT, main() (+6 more)

### Community 16 - "check-in/verify/route.ts"
Cohesion: 0.21
Nodes (14): dynamic, POST(), runtime, dynamic, POST(), requestSchema, runtime, CHECKIN_SESSION_COOKIE (+6 more)

### Community 17 - "leader-auth.ts"
Cohesion: 0.11
Nodes (21): POST(), LeaderLoginPage(), LeadersIndexPage(), dynamic, LeaderDashboardPage(), LeaderPortalLayout(), dynamic, LeaderReportDetailPage() (+13 more)

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

### Community 24 - "member-card.tsx"
Cohesion: 0.19
Nodes (10): dynamic, GET(), runtime, CARD, generateMemberCardPDF(), MemberCard(), MemberCardData, styles (+2 more)

### Community 25 - "readJsonRequest"
Cohesion: 0.18
Nodes (16): dynamic, POST(), runtime, dynamic, POST(), runtime, dynamic, lagosDate() (+8 more)

### Community 26 - "Events Listing"
Cohesion: 0.19
Nodes (12): EventCard(), EventsPage(), formatEventDate(), revalidate, EventCardProps, FeaturedEventsCarousel(), formatEventDate(), lucide-react@^1.28.0 (+4 more)

### Community 27 - "MembershipForm.tsx"
Cohesion: 0.18
Nodes (10): benefits, MembershipPage(), metadata, inputClass(), membershipFieldLabels, MembershipForm(), studyLevels, InstitutionCombobox() (+2 more)

### Community 28 - "programs/page.tsx"
Cohesion: 0.18
Nodes (9): executiveRoles, focusAreas, journey, ProgramCard, revalidate, @portabletext/react@^8.0.0, @portabletext/react, PROGRAMS_QUERY (+1 more)

### Community 29 - "members/page.tsx"
Cohesion: 0.43
Nodes (4): AdminMembersPage(), dynamic, escapeLike(), MembersSearch()

### Community 30 - "(site)/events/[slug]/page.tsx"
Cohesion: 0.18
Nodes (12): descriptionComponents, EventDetailPage(), formatDate(), formatTime(), revalidate, RegistrationForm(), RegistrationFormProps, client (+4 more)

### Community 31 - "request-code/route.ts"
Cohesion: 0.29
Nodes (8): dynamic, POST(), requestSchema, runtime, codeHash(), createCheckinLoginCode(), verifyCheckinLoginCode(), zod

### Community 32 - "Core Database Migrations"
Cohesion: 0.29
Nodes (8): contact_submissions, donations, events_registrations, idx_donations_email, idx_donations_paystack_ref, idx_registrations_email, idx_registrations_event_id, idx_registrations_event_email_unique

### Community 33 - "Development Dependencies"
Cohesion: 0.20
Nodes (10): scripts, admin:hash-password, build, db:check, db:migrate, dev, lint, migrate:events (+2 more)

### Community 35 - "next-sanity"
Cohesion: 0.40
Nodes (3): dynamic, next-sanity@13, next-sanity

### Community 36 - "donate/route.ts"
Cohesion: 0.25
Nodes (7): POST(), generateReference(), initializeTransaction(), InitTransactionParams, InitTransactionResponse, VerifyTransactionResponse, donationSchema

### Community 37 - "Admin Navigation"
Cohesion: 0.39
Nodes (4): ProtectedAdminLayout(), AdminNavigation(), items, LogoutButton()

### Community 38 - "validations.ts"
Cohesion: 0.17
Nodes (12): ContactInput, contactSchema, DonationInput, KAMP_POSITIONS, kampMemberRegistrationSchema, MembershipInput, membershipSchema, NIGERIAN_STATES (+4 more)

### Community 39 - "leadership-invites/route.ts"
Cohesion: 0.33
Nodes (5): dynamic, InvitationError, invitationSchema, POST(), runtime

### Community 40 - "react"
Cohesion: 0.06
Nodes (35): dynamic, GET(), runtime, AdminEventsPage(), dynamic, dynamic, EventCheckinPage(), AdminEventRegistrationsPage() (+27 more)

### Community 41 - "next"
Cohesion: 0.16
Nodes (5): AdminLoginPage(), CheckinLoginPage(), dynamic, CheckinLoginForm(), next

### Community 42 - "Application Root Layout"
Cohesion: 0.29
Nodes (4): metadata, urbanist, @vercel/analytics@^2.0.1, @vercel/analytics

### Community 43 - "email.ts"
Cohesion: 0.05
Nodes (75): dynamic, LeadershipInvitationsPage(), dynamic, POST(), runtime, POST(), dynamic, POST() (+67 more)

### Community 44 - "WhatsAppJoinAction"
Cohesion: 0.36
Nodes (6): CommunityJoinPage(), metadata, getHashToken(), getServerHashToken(), subscribeToHashChange(), WhatsAppJoinAction()

### Community 45 - "Vercel Deployment Config"
Cohesion: 0.29
Nodes (6): maxDuration, framework, functions, app/api/paystack/webhook/route.ts, regions, $schema

### Community 46 - "(protected)/requests/[id]/page.tsx"
Cohesion: 0.47
Nodes (3): AdminLeaderRequestDetail(), dynamic, ReviewLeaderRequest()

### Community 47 - "Prettier Configuration"
Cohesion: 0.33
Nodes (5): plugins, printWidth, semi, singleQuote, trailingComma

### Community 48 - "admin-session.ts"
Cohesion: 0.46
Nodes (6): POST(), createAdminSession(), destroyAdminSession(), getSecret(), signValue(), verifyValue()

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
Cohesion: 0.15
Nodes (11): dynamic, LeadersAdminPage(), dynamic, LeaderReportsAdminPage(), dynamic, LeaderRequestsAdminPage(), statuses, CreateLeader() (+3 more)

### Community 56 - "nigerian-institutions.ts"
Cohesion: 0.32
Nodes (5): GET(), normalize(), INSTITUTION_NAMES, NIGERIAN_INSTITUTIONS, NigerianInstitution

### Community 58 - "gallery-data.ts"
Cohesion: 0.25
Nodes (7): emerge2025, featuredPhotos, GALLERY_IMAGE_DIR, KampGalleryAlbum, kampGalleryAlbums, KampGalleryPhoto, remainingFiles

### Community 59 - "allowBuilds"
Cohesion: 0.50
Nodes (3): allowBuilds, esbuild, unrs-resolver

### Community 77 - "018_leaders_portal.sql"
Cohesion: 0.32
Nodes (11): idx_login_tokens_expiry, idx_login_tokens_leader, idx_reports_created, idx_reports_leader, idx_requests_created, idx_requests_leader, idx_requests_status, public.leader_login_tokens (+3 more)

### Community 87 - "invite/page.tsx"
Cohesion: 0.38
Nodes (5): dynamic, LeadershipInvitationPage(), metadata, Invitation, LeadershipInviteRegistration()

## Knowledge Gaps
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `request-body.ts`, `Admin Dashboard Analytics`, `register/route.ts`, `community-status/route.ts`, `leader-validations.ts`, `getAdminSession`, `About and Contact Content`, `Package Development Dependencies`, `Gallery Experience`, `Homepage Sections`, `Application Dependencies`, `db`, `check-in/verify/route.ts`, `leader-auth.ts`, `Community Email Campaigns`, `Navigation and Footer`, `readJsonRequest`, `Events Listing`, `MembershipForm.tsx`, `programs/page.tsx`, `members/page.tsx`, `(site)/events/[slug]/page.tsx`, `request-code/route.ts`, `get-involved/page.tsx`, `donate/route.ts`, `Admin Navigation`, `leadership-invites/route.ts`, `react`, `Application Root Layout`, `email.ts`, `WhatsAppJoinAction`, `(protected)/requests/[id]/page.tsx`, `admin-session.ts`, `(protected)/leaders/page.tsx`, `nigerian-institutions.ts`, `verify/page.tsx`, `invite/page.tsx`, `EventListing.tsx`, `leaders/layout.tsx`, `card-preview/page.tsx`, `[[...tool]]/layout.tsx`, `success/page.tsx`, `next.config.ts`, `proxy.ts`?**
  _High betweenness centrality (0.353) - this node is a cross-community bridge._
- **Should `Admin Dashboard Analytics` be split into smaller, more focused modules?**
  _Cohesion score 0.08874912648497554 - nodes in this community are weakly interconnected._
- **Why does `db` connect `db` to `request-body.ts`, `Admin Dashboard Analytics`, `register/route.ts`, `community-status/route.ts`, `getAdminSession`, `check-in/verify/route.ts`, `leader-auth.ts`, `Community Email Campaigns`, `readJsonRequest`, `members/page.tsx`, `request-code/route.ts`, `donate/route.ts`, `leadership-invites/route.ts`, `react`, `next`, `email.ts`, `(protected)/requests/[id]/page.tsx`, `(protected)/leaders/page.tsx`, `db-migrate.ts`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Should `register/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11895161290322581 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Admin Dashboard Analytics`, `register/route.ts`, `leader-validations.ts`, `About and Contact Content`, `Package Development Dependencies`, `Gallery Experience`, `Homepage Sections`, `Application Dependencies`, `leader-auth.ts`, `Community Email Campaigns`, `Navigation and Footer`, `member-card.tsx`, `Events Listing`, `MembershipForm.tsx`, `members/page.tsx`, `(site)/events/[slug]/page.tsx`, `Admin Navigation`, `next`, `email.ts`, `WhatsAppJoinAction`, `(protected)/requests/[id]/page.tsx`, `DonateForm.tsx`, `(protected)/leaders/page.tsx`, `verify/page.tsx`, `invite/page.tsx`, `EventListing.tsx`, `success/page.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Should `community-status/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1437908496732026 - nodes in this community are weakly interconnected._
- **Should `leader-validations.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09475806451612903 - nodes in this community are weakly interconnected._