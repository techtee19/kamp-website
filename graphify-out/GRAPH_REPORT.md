# Graph Report - kamp-website  (2026-11-17)

## Corpus Check
- 259 files · ~91,362 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .ico 3, (none) 2, .example 1)

## Summary
- 1198 nodes · 2726 edges · 98 communities (64 shown, 34 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `34827a08`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- membership/route.ts
- Admin Dashboard Analytics
- migrate-events.mjs
- member-code/route.ts
- community-status/route.ts
- Sanity Studio Setup
- leader-auth.ts
- getAdminSession
- About and Contact Content
- Package Development Dependencies
- gallery/page.tsx
- Homepage Sections
- Application Dependencies
- TypeScript Configuration
- db
- (protected)/events/[slug]/page.tsx
- check-in/verify/route.ts
- leader-validations.ts
- Leadership and Engagement Migrations
- Community Email Campaigns
- Navigation and Footer
- Brand Asset Generation
- sanity.config.ts
- Event Check-in Migrations
- email.ts
- [memberId]/page.tsx
- Events Listing
- MembershipForm.tsx
- programs/page.tsx
- members/page.tsx
- RegistrationForm.tsx
- readJsonRequest
- Core Database Migrations
- Development Dependencies
- next
- client.ts
- success/page.tsx
- Admin Navigation
- sanity.ts
- admin-session.ts
- react
- registration.test.mjs
- Application Root Layout
- migrate-gallery.mjs
- member-card.tsx
- Vercel Deployment Config
- quoteEventTableName
- Prettier Configuration
- InstitutionCombobox.tsx
- Member Table Migration
- Database Check Scripts
- Database Type Definitions
- Admin Dashboard Loading
- DonateForm.tsx
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
- leadership-invites/route.ts
- contact/page.tsx
- invite/page.tsx
- GalleryMarquee.tsx
- membership/support/page.tsx
- (protected)/requests/[id]/page.tsx
- EventListing.tsx
- db-migrate.ts
- 019_event_member_otp_audit.sql
- next.config.ts

## God Nodes (most connected - your core abstractions)
1. `db` - 141 edges
2. `next` - 125 edges
3. `readJsonRequest()` - 62 edges
4. `getAdminSession()` - 52 edges
5. `react` - 51 edges
6. `requestBodyErrorResponse()` - 40 edges
7. `isSameOriginAdminRequest()` - 40 edges
8. `getClientIp()` - 31 edges
9. `rateLimit()` - 26 edges
10. `lucide-react` - 23 edges

## Surprising Connections (you probably didn't know these)
- `EventDetailPage()` --calls--> `RegistrationForm()`  [EXTRACTED]
  app/(site)/events/[slug]/page.tsx → components/events/RegistrationForm.tsx
- `MembershipPage()` --calls--> `MembershipForm()`  [EXTRACTED]
  app/(site)/membership/page.tsx → components/membership/MembershipForm.tsx
- `HomePage()` --calls--> `GalleryMarquee()`  [EXTRACTED]
  app/(site)/page.tsx → components/sections/GalleryMarquee.tsx
- `HomePage()` --calls--> `GetInvolvedTabs()`  [EXTRACTED]
  app/(site)/page.tsx → components/sections/GetInvolvedTabs.tsx
- `HomePage()` --calls--> `QuickStory()`  [EXTRACTED]
  app/(site)/page.tsx → components/sections/QuickStory.tsx

## Import Cycles
- None detected.

## Communities (98 total, 34 thin omitted)

### Community 0 - "membership/route.ts"
Cohesion: 0.10
Nodes (30): campaignCounts(), dynamic, POST(), runtime, dynamic, LeadershipInvitationsPage(), dynamic, POST() (+22 more)

### Community 1 - "Admin Dashboard Analytics"
Cohesion: 0.08
Nodes (50): AdminDashboardPage(), AnalyticsDirectoryLoading(), AnalyticsPanelLoading(), DashboardAnalytics(), DashboardOverview(), dynamic, EventRegistrationsLoading(), EventRegistrationsOverview() (+42 more)

### Community 2 - "migrate-events.mjs"
Cohesion: 0.14
Nodes (15): @sanity/client@7.26.2, @sanity/client, buildDocument(), client, DRY_RUN, IMAGE_ROOT, main(), MONTHS (+7 more)

### Community 3 - "member-code/route.ts"
Cohesion: 0.07
Nodes (43): limited(), maxDuration, POST(), runtime, schema, POST(), runtime, schema (+35 more)

### Community 4 - "community-status/route.ts"
Cohesion: 0.13
Nodes (17): bodySchema, dynamic, runtime, DELETE(), dynamic, runtime, dynamic, PATCH() (+9 more)

### Community 5 - "Sanity Studio Setup"
Cohesion: 0.15
Nodes (11): dynamic, sanity@^5.31.1, sanity, plugins, eventSchema, galleryEventSchema, schemaTypes, memberSchema (+3 more)

### Community 6 - "leader-auth.ts"
Cohesion: 0.09
Nodes (30): POST(), POST(), runtime, POST(), runtime, POST(), runtime, LeaderLoginPage() (+22 more)

### Community 7 - "getAdminSession"
Cohesion: 0.15
Nodes (21): createSchema, DELETE(), dynamic, eventSlugSchema, GET(), POST(), revokeSchema, runtime (+13 more)

### Community 8 - "About and Contact Content"
Cohesion: 0.13
Nodes (18): AboutPage(), FounderCard, revalidate, TeamCard, values, descriptionComponents, EventDetailPage(), formatDate() (+10 more)

### Community 9 - "Package Development Dependencies"
Cohesion: 0.10
Nodes (27): eslintConfig, devDependencies, eslint@^9, eslint-config-next@16.3.0, prettier@^3.9.6, prettier-plugin-tailwindcss@^0.8.1, tailwindcss@^4, @tailwindcss/postcss@^4 (+19 more)

### Community 10 - "gallery/page.tsx"
Cohesion: 0.38
Nodes (6): GalleryIntro(), GalleryPage(), revalidate, GalleryAlbums(), client, GALLERY_EVENTS_QUERY

### Community 11 - "Homepage Sections"
Cohesion: 0.12
Nodes (16): actions, fallbackStats, HomePage(), partners, revalidate, GetInvolvedTabs(), tabs, HeroImageRotator() (+8 more)

### Community 12 - "Application Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, clsx@^2.1.1, next@16.3.0, next-auth@^4.24.15, next-sanity@13, qrcode@^1.5.4, react@19.2.8, @react-email/components@^1.0.12 (+14 more)

### Community 13 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 14 - "db"
Cohesion: 0.15
Nodes (16): dynamic, GET(), dynamic, GET(), AdminMembershipSupport(), dynamic, AdminLeaderReportDetail(), dynamic (+8 more)

### Community 15 - "(protected)/events/[slug]/page.tsx"
Cohesion: 0.26
Nodes (8): AdminEventRegistrationsPage(), dynamic, CheckinOperatorManager(), addOperator(), load(), revoke(), Operator, SendReminderButton()

### Community 16 - "check-in/verify/route.ts"
Cohesion: 0.18
Nodes (16): dynamic, POST(), runtime, dynamic, POST(), requestSchema, runtime, CHECKIN_SESSION_COOKIE (+8 more)

### Community 17 - "leader-validations.ts"
Cohesion: 0.09
Nodes (24): NewLeaderReportPage(), NewLeaderRequestPage(), LeaderReportForm(), LeaderRequestForm(), LeaderSelect(), onKeyDown(), openAtSelected(), LeaderSelectOption (+16 more)

### Community 18 - "Leadership and Engagement Migrations"
Cohesion: 0.11
Nodes (19): leadership_invites_expiry_idx, leadership_invites_pending_email_idx, public.leadership_member_id_counters, public.leadership_registration_invites, member_community_invite_links_member_idx, public.member_community_invite_links, public.member_community_tracking, community_email_campaign_pending_idx (+11 more)

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

### Community 24 - "email.ts"
Cohesion: 0.09
Nodes (39): GET(), maxDuration, runtime, POST(), runtime, POST(), runtime, POST() (+31 more)

### Community 25 - "[memberId]/page.tsx"
Cohesion: 0.15
Nodes (8): AdminLoginPage(), dynamic, MemberProfilePage(), DeleteMemberButton(), EditMemberPosition(), ResendCardButton(), CheckinLogoutButton(), react

### Community 26 - "Events Listing"
Cohesion: 0.16
Nodes (14): EventCard(), EventsPage(), formatEventDate(), revalidate, EventCardProps, FeaturedEventsCarousel(), formatEventDate(), lucide-react@^1.28.0 (+6 more)

### Community 27 - "MembershipForm.tsx"
Cohesion: 0.14
Nodes (16): membershipFieldLabels, studyLevels, ContactInput, contactSchema, DonationInput, donationSchema, guestRegistrationSchema, KAMP_POSITIONS (+8 more)

### Community 28 - "programs/page.tsx"
Cohesion: 0.18
Nodes (9): executiveRoles, focusAreas, journey, ProgramCard, revalidate, @portabletext/react@^8.0.0, @portabletext/react, PROGRAMS_QUERY (+1 more)

### Community 29 - "members/page.tsx"
Cohesion: 0.38
Nodes (4): AdminMembersPage(), dynamic, escapeLike(), MembersSearch()

### Community 30 - "RegistrationForm.tsx"
Cohesion: 0.26
Nodes (9): Failure, Member, RegistrationForm(), editId(), requestCode(), save(), submit(), Session (+1 more)

### Community 31 - "readJsonRequest"
Cohesion: 0.15
Nodes (26): POST(), runtime, verifyPassword(), dynamic, POST(), requestSchema, runtime, POST() (+18 more)

### Community 32 - "Core Database Migrations"
Cohesion: 0.29
Nodes (8): contact_submissions, donations, events_registrations, idx_donations_email, idx_donations_paystack_ref, idx_registrations_email, idx_registrations_event_id, idx_registrations_event_email_unique

### Community 33 - "Development Dependencies"
Cohesion: 0.18
Nodes (11): scripts, admin:hash-password, build, db:check, db:migrate, dev, lint, migrate:events (+3 more)

### Community 34 - "next"
Cohesion: 0.08
Nodes (9): CheckinLoginPage(), dynamic, metadata, pathways, metadata, metadata, CheckinLoginForm(), config (+1 more)

### Community 35 - "client.ts"
Cohesion: 0.38
Nodes (5): EventSnapshot, EventWebhookPayload, runtime, next-sanity, publicEventsTag

### Community 37 - "Admin Navigation"
Cohesion: 0.39
Nodes (4): ProtectedAdminLayout(), AdminNavigation(), items, LogoutButton()

### Community 38 - "sanity.ts"
Cohesion: 0.18
Nodes (13): GalleryAlbum(), GalleryAlbumProps, slots, GalleryAlbumsProps, GalleryLightbox(), GalleryLightboxProps, GalleryEventDocument, SanityBlock (+5 more)

### Community 39 - "admin-session.ts"
Cohesion: 0.46
Nodes (6): POST(), createAdminSession(), destroyAdminSession(), getSecret(), signValue(), verifyValue()

### Community 40 - "react"
Cohesion: 0.22
Nodes (9): dynamic, EventCheckinPage(), CameraTicketScanner(), controlsStop(), start(), CheckinList(), Registrant, @zxing/browser@^0.2.1 (+1 more)

### Community 41 - "registration.test.mjs"
Cohesion: 0.09
Nodes (16): resend(), check(), { classifyEmailFailure, EmailProviderError, retryDelay }, codes, { countdownSeconds, eventSlug }, load, loader(), load() (+8 more)

### Community 42 - "Application Root Layout"
Cohesion: 0.29
Nodes (4): metadata, urbanist, @vercel/analytics@^2.0.1, @vercel/analytics

### Community 43 - "migrate-gallery.mjs"
Cohesion: 0.20
Nodes (14): absolutePathFor(), assertFilesExist(), buildDocument(), client, DRY_RUN, fetchExistingAssets(), IMAGE_ROOT, main() (+6 more)

### Community 44 - "member-card.tsx"
Cohesion: 0.19
Nodes (10): dynamic, GET(), runtime, CARD, generateMemberCardPDF(), MemberCard(), MemberCardData, styles (+2 more)

### Community 45 - "Vercel Deployment Config"
Cohesion: 0.25
Nodes (7): maxDuration, crons, framework, functions, app/api/paystack/webhook/route.ts, regions, $schema

### Community 46 - "quoteEventTableName"
Cohesion: 0.13
Nodes (20): dynamic, POST(), runtime, dynamic, POST(), runtime, dynamic, lagosDate() (+12 more)

### Community 47 - "Prettier Configuration"
Cohesion: 0.33
Nodes (5): plugins, printWidth, semi, singleQuote, trailingComma

### Community 48 - "InstitutionCombobox.tsx"
Cohesion: 0.21
Nodes (8): GET(), normalize(), InstitutionCombobox(), InstitutionComboboxProps, TYPE_STYLES, INSTITUTION_NAMES, NIGERIAN_INSTITUTIONS, NigerianInstitution

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

### Community 87 - "gallery-data.ts"
Cohesion: 0.25
Nodes (7): emerge2025, featuredPhotos, GALLERY_IMAGE_DIR, KampGalleryAlbum, kampGalleryAlbums, KampGalleryPhoto, remainingFiles

### Community 88 - "leadership-invites/route.ts"
Cohesion: 0.33
Nodes (5): dynamic, InvitationError, invitationSchema, POST(), runtime

### Community 89 - "contact/page.tsx"
Cohesion: 0.38
Nodes (5): ContactPage(), revalidate, ContactForm(), SITE_SETTINGS_QUERY, SiteSettings

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
Cohesion: 0.47
Nodes (3): AdminLeaderRequestDetail(), dynamic, ReviewLeaderRequest()

## Knowledge Gaps
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `membership/route.ts`, `Admin Dashboard Analytics`, `member-code/route.ts`, `community-status/route.ts`, `leader-auth.ts`, `getAdminSession`, `About and Contact Content`, `Package Development Dependencies`, `gallery/page.tsx`, `Homepage Sections`, `Application Dependencies`, `db`, `(protected)/events/[slug]/page.tsx`, `check-in/verify/route.ts`, `leader-validations.ts`, `Community Email Campaigns`, `Navigation and Footer`, `email.ts`, `[memberId]/page.tsx`, `Events Listing`, `MembershipForm.tsx`, `programs/page.tsx`, `members/page.tsx`, `RegistrationForm.tsx`, `readJsonRequest`, `client.ts`, `success/page.tsx`, `Admin Navigation`, `sanity.ts`, `admin-session.ts`, `react`, `registration.test.mjs`, `Application Root Layout`, `quoteEventTableName`, `InstitutionCombobox.tsx`, `(protected)/leaders/page.tsx`, `WhatsAppJoinAction.tsx`, `MembershipForm`, `verify/page.tsx`, `leadership-invites/route.ts`, `contact/page.tsx`, `invite/page.tsx`, `GalleryMarquee.tsx`, `(protected)/requests/[id]/page.tsx`, `EventListing.tsx`, `next.config.ts`?**
  _High betweenness centrality (0.340) - this node is a cross-community bridge._
- **Should `membership/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `db` connect `db` to `membership/route.ts`, `Admin Dashboard Analytics`, `member-code/route.ts`, `community-status/route.ts`, `leader-auth.ts`, `getAdminSession`, `(protected)/events/[slug]/page.tsx`, `check-in/verify/route.ts`, `Community Email Campaigns`, `email.ts`, `[memberId]/page.tsx`, `members/page.tsx`, `readJsonRequest`, `next`, `react`, `quoteEventTableName`, `(protected)/leaders/page.tsx`, `leadership-invites/route.ts`, `(protected)/requests/[id]/page.tsx`, `db-migrate.ts`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Should `Admin Dashboard Analytics` be split into smaller, more focused modules?**
  _Cohesion score 0.07796610169491526 - nodes in this community are weakly interconnected._
- **Why does `react` connect `[memberId]/page.tsx` to `membership/route.ts`, `Admin Dashboard Analytics`, `member-code/route.ts`, `leader-auth.ts`, `Package Development Dependencies`, `Homepage Sections`, `Application Dependencies`, `(protected)/events/[slug]/page.tsx`, `leader-validations.ts`, `Community Email Campaigns`, `Navigation and Footer`, `Events Listing`, `MembershipForm.tsx`, `members/page.tsx`, `RegistrationForm.tsx`, `next`, `success/page.tsx`, `Admin Navigation`, `sanity.ts`, `react`, `member-card.tsx`, `InstitutionCombobox.tsx`, `DonateForm.tsx`, `(protected)/leaders/page.tsx`, `WhatsAppJoinAction.tsx`, `verify/page.tsx`, `contact/page.tsx`, `invite/page.tsx`, `GalleryMarquee.tsx`, `membership/support/page.tsx`, `(protected)/requests/[id]/page.tsx`, `EventListing.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `migrate-events.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.1437908496732026 - nodes in this community are weakly interconnected._
- **Should `member-code/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06949152542372881 - nodes in this community are weakly interconnected._