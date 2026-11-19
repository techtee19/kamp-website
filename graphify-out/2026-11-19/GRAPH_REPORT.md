# Graph Report - kamp-website  (2026-11-19)

## Corpus Check
- 269 files · ~96,114 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .ico 3, (none) 2, .example 1)

## Summary
- 1239 nodes · 2835 edges · 105 communities (70 shown, 35 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dc5b0c98`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- membership/route.ts
- Admin Dashboard Analytics
- migrate-events.mjs
- member-code/route.ts
- community-status/route.ts
- schemas/index.ts
- requestBodyErrorResponse
- getAdminSession
- sanity.ts
- Package Development Dependencies
- sanity.config.ts
- Homepage Sections
- Application Dependencies
- TypeScript Configuration
- db
- (protected)/events/[slug]/page.tsx
- checkin-access.ts
- leader-validations.ts
- Leadership and Engagement Migrations
- Community Email Campaigns
- Navigation and Footer
- Brand Asset Generation
- [memberId]/page.tsx
- Event Check-in Migrations
- email.ts
- card-preview/page.tsx
- Events Listing
- MembershipForm.tsx
- programs/page.tsx
- members/page.tsx
- RegistrationForm.tsx
- readJsonRequest
- Core Database Migrations
- Development Dependencies
- next
- next-sanity
- requireLeader
- leadership-invites/route.ts
- sanity.ts
- admin-session.ts
- CameraTicketScanner
- registration.test.mjs
- Application Root Layout
- migrate-gallery.mjs
- member-card.tsx
- Vercel Deployment Config
- quoteEventTableName
- Prettier Configuration
- InstitutionCombobox.tsx
- Member Table Migration
- success/page.tsx
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
- queries.ts
- proxy.ts
- invite/page.tsx
- GalleryMarquee.tsx
- membership/support/page.tsx
- (protected)/requests/[id]/page.tsx
- members/support/page.tsx
- db-migrate.ts
- 019_event_member_otp_audit.sql
- load
- check-in/login/page.tsx
- LeaderPortalNav.tsx
- (protected)/layout.tsx
- contact/page.tsx
- remind/route.ts
- postgres

## God Nodes (most connected - your core abstractions)
1. `db` - 143 edges
2. `next` - 128 edges
3. `readJsonRequest()` - 62 edges
4. `getAdminSession()` - 54 edges
5. `react` - 54 edges
6. `isSameOriginAdminRequest()` - 42 edges
7. `requestBodyErrorResponse()` - 40 edges
8. `getClientIp()` - 31 edges
9. `rateLimit()` - 26 edges
10. `lucide-react` - 25 edges

## Surprising Connections (you probably didn't know these)
- `AdminMembershipSupport()` --calls--> `getAdminSession()`  [EXTRACTED]
  app/admin/(protected)/members/support/page.tsx → lib/admin-session.ts
- `POST()` --calls--> `queueSupportWelcome()`  [EXTRACTED]
  app/admin/api/members/support/route.ts → lib/membership-support-recovery.ts
- `resend()` --indirect_call--> `memberId()`  [INFERRED]
  components/admin/ResendCardButton.tsx → scripts/tests/registration.test.mjs
- `EventCardProps` --references--> `EventDocument`  [EXTRACTED]
  components/events/EventCard.tsx → types/sanity.ts
- `campaignCounts()` --calls--> `db`  [EXTRACTED]
  app/admin/api/members/community-campaign/route.ts → lib/db.ts

## Import Cycles
- None detected.

## Communities (105 total, 35 thin omitted)

### Community 0 - "membership/route.ts"
Cohesion: 0.12
Nodes (26): campaignCounts(), dynamic, POST(), runtime, dynamic, LeadershipInvitationsPage(), currentLagosYear(), LeadershipRegistrationError (+18 more)

### Community 1 - "Admin Dashboard Analytics"
Cohesion: 0.08
Nodes (49): AdminDashboardPage(), AnalyticsDirectoryLoading(), AnalyticsPanelLoading(), DashboardAnalytics(), DashboardOverview(), dynamic, EventRegistrationsLoading(), EventRegistrationsOverview() (+41 more)

### Community 2 - "migrate-events.mjs"
Cohesion: 0.13
Nodes (15): KampEvent, kampEvents, buildDocument(), client, DRY_RUN, IMAGE_ROOT, main(), MONTHS (+7 more)

### Community 3 - "member-code/route.ts"
Cohesion: 0.06
Nodes (46): limited(), maxDuration, POST(), runtime, schema, POST(), runtime, schema (+38 more)

### Community 4 - "community-status/route.ts"
Cohesion: 0.16
Nodes (13): DELETE(), dynamic, runtime, dynamic, PATCH(), positionSchema, runtime, maxDuration (+5 more)

### Community 5 - "schemas/index.ts"
Cohesion: 0.18
Nodes (10): sanity@^5.31.1, sanity, plugins, eventSchema, galleryEventSchema, schemaTypes, memberSchema, programSchema (+2 more)

### Community 6 - "requestBodyErrorResponse"
Cohesion: 0.19
Nodes (12): dynamic, POST(), runtime, dynamic, POST(), runtime, bodySchema, dynamic (+4 more)

### Community 7 - "getAdminSession"
Cohesion: 0.13
Nodes (23): createSchema, DELETE(), dynamic, eventSlugSchema, GET(), POST(), revokeSchema, runtime (+15 more)

### Community 8 - "sanity.ts"
Cohesion: 0.16
Nodes (13): AboutPage(), FounderCard, revalidate, TeamCard, values, urlFor(), SanityBlock, SanityImage (+5 more)

### Community 9 - "Package Development Dependencies"
Cohesion: 0.10
Nodes (27): eslintConfig, devDependencies, eslint@^9, eslint-config-next@16.3.0, prettier@^3.9.6, prettier-plugin-tailwindcss@^0.8.1, tailwindcss@^4, @tailwindcss/postcss@^4 (+19 more)

### Community 10 - "sanity.config.ts"
Cohesion: 0.17
Nodes (10): @sanity/image-url@2, @sanity/vision@^5.31.1, @sanity/image-url, @sanity/vision, apiVersion, dataset, projectId, builder (+2 more)

### Community 11 - "Homepage Sections"
Cohesion: 0.10
Nodes (18): AdminLoginPage(), actions, fallbackStats, HomePage(), partners, revalidate, Operator, GetInvolvedTabs() (+10 more)

### Community 12 - "Application Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, clsx@^2.1.1, lucide-react@^1.28.0, next@16.3.0, next-auth@^4.24.15, qrcode@^1.5.4, react@19.2.8, @react-email/components@^1.0.12 (+14 more)

### Community 13 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 14 - "db"
Cohesion: 0.18
Nodes (13): dynamic, GET(), dynamic, GET(), DELETE(), PATCH(), AdminLeaderReportDetail(), dynamic (+5 more)

### Community 15 - "(protected)/events/[slug]/page.tsx"
Cohesion: 0.31
Nodes (7): AdminEventRegistrationsPage(), dynamic, CheckinOperatorManager(), addOperator(), load(), revoke(), SendReminderButton()

### Community 16 - "checkin-access.ts"
Cohesion: 0.31
Nodes (8): dynamic, POST(), runtime, CHECKIN_SESSION_COOKIE, CHECKIN_SESSION_SECONDS, checkinSessionCookieOptions(), EventCheckinActor, hashCheckinSession()

### Community 17 - "leader-validations.ts"
Cohesion: 0.09
Nodes (24): NewLeaderReportPage(), NewLeaderRequestPage(), LeaderReportForm(), LeaderRequestForm(), LeaderSelect(), onKeyDown(), openAtSelected(), LeaderSelectOption (+16 more)

### Community 18 - "Leadership and Engagement Migrations"
Cohesion: 0.10
Nodes (21): leadership_invites_expiry_idx, leadership_invites_pending_email_idx, public.leadership_member_id_counters, public.leadership_registration_invites, member_community_invite_links_member_idx, public.member_community_invite_links, public.member_community_tracking, community_email_campaign_pending_idx (+13 more)

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
Cohesion: 0.09
Nodes (43): GET(), maxDuration, runtime, POST(), runtime, POST(), runtime, EventSnapshot (+35 more)

### Community 26 - "Events Listing"
Cohesion: 0.20
Nodes (11): EventCard(), EventsPage(), formatEventDate(), revalidate, EventCardProps, FeaturedEventsCarousel(), formatEventDate(), lucide-react (+3 more)

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
Cohesion: 0.23
Nodes (13): Failure, Member, RegistrationForm(), confirmRegistration(), editId(), post(), requestCode(), save() (+5 more)

### Community 31 - "readJsonRequest"
Cohesion: 0.06
Nodes (61): POST(), runtime, verifyPassword(), dynamic, POST(), requestSchema, runtime, dynamic (+53 more)

### Community 32 - "Core Database Migrations"
Cohesion: 0.29
Nodes (8): contact_submissions, donations, events_registrations, idx_donations_email, idx_donations_paystack_ref, idx_registrations_email, idx_registrations_event_id, idx_registrations_event_email_unique

### Community 33 - "Development Dependencies"
Cohesion: 0.18
Nodes (11): scripts, admin:hash-password, build, db:check, db:migrate, dev, lint, migrate:events (+3 more)

### Community 34 - "next"
Cohesion: 0.12
Nodes (6): metadata, pathways, metadata, csp, nextConfig, next

### Community 35 - "next-sanity"
Cohesion: 0.40
Nodes (3): dynamic, next-sanity@13, next-sanity

### Community 36 - "requireLeader"
Cohesion: 0.27
Nodes (7): dynamic, LeaderDashboardPage(), dynamic, LeaderReportDetailPage(), dynamic, LeaderRequestDetailPage(), requireLeader()

### Community 37 - "leadership-invites/route.ts"
Cohesion: 0.33
Nodes (5): dynamic, InvitationError, invitationSchema, POST(), runtime

### Community 38 - "sanity.ts"
Cohesion: 0.18
Nodes (13): GalleryIntro(), GalleryPage(), revalidate, GalleryAlbum(), GalleryAlbumProps, slots, GalleryAlbums(), GalleryAlbumsProps (+5 more)

### Community 39 - "admin-session.ts"
Cohesion: 0.46
Nodes (6): POST(), createAdminSession(), destroyAdminSession(), getSecret(), signValue(), verifyValue()

### Community 40 - "CameraTicketScanner"
Cohesion: 0.40
Nodes (5): CameraTicketScanner(), controlsStop(), start(), @zxing/browser@^0.2.1, @zxing/browser

### Community 41 - "registration.test.mjs"
Cohesion: 0.08
Nodes (18): resend(), check(), { classifyEmailFailure, EmailProviderError, retryDelay }, codes, { countdownSeconds, eventSlug }, load, memberId(), { NextRequest, NextResponse } (+10 more)

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
Cohesion: 0.13
Nodes (18): dynamic, GET(), runtime, dynamic, GET(), runtime, dynamic, EventCheckinPage() (+10 more)

### Community 47 - "Prettier Configuration"
Cohesion: 0.33
Nodes (5): plugins, printWidth, semi, singleQuote, trailingComma

### Community 48 - "InstitutionCombobox.tsx"
Cohesion: 0.21
Nodes (8): GET(), normalize(), InstitutionCombobox(), InstitutionComboboxProps, TYPE_STYLES, INSTITUTION_NAMES, NIGERIAN_INSTITUTIONS, NigerianInstitution

### Community 49 - "Member Table Migration"
Cohesion: 0.60
Nodes (4): member_number_counters, members, members_status_idx, members_year_joined_idx

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

### Community 88 - "queries.ts"
Cohesion: 0.16
Nodes (14): descriptionComponents, EventDetailPage(), formatDate(), formatTime(), revalidate, client, freshClient, publicEventCache (+6 more)

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

### Community 94 - "members/support/page.tsx"
Cohesion: 0.23
Nodes (8): AdminMembershipSupport(), deliveryLabels, dynamic, nextStep(), SupportWelcomeAction(), findMembershipSupportRequests(), SupportMember, SupportRequest

### Community 96 - "019_event_member_otp_audit.sql"
Cohesion: 0.83
Nodes (3): event_member_otp_audit_created_idx, event_member_otp_audit_event_created_idx, public.event_member_otp_audit

### Community 98 - "check-in/login/page.tsx"
Cohesion: 0.38
Nodes (3): CheckinLoginPage(), dynamic, CheckinLoginForm()

### Community 99 - "LeaderPortalNav.tsx"
Cohesion: 0.48
Nodes (4): LeaderPortalLayout(), LeaderLogoutButton(), LeaderPortalNav(), links

### Community 100 - "(protected)/layout.tsx"
Cohesion: 0.39
Nodes (4): ProtectedAdminLayout(), AdminNavigation(), items, LogoutButton()

### Community 101 - "contact/page.tsx"
Cohesion: 0.47
Nodes (4): ContactPage(), revalidate, ContactForm(), SITE_SETTINGS_QUERY

### Community 102 - "remind/route.ts"
Cohesion: 0.50
Nodes (4): dynamic, lagosDate(), POST(), runtime

### Community 103 - "postgres"
Cohesion: 0.50
Nodes (3): postgres@^3.4.9, postgres, db

## Knowledge Gaps
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `membership/route.ts`, `Admin Dashboard Analytics`, `migrate-events.mjs`, `member-code/route.ts`, `community-status/route.ts`, `requestBodyErrorResponse`, `getAdminSession`, `sanity.ts`, `Package Development Dependencies`, `Homepage Sections`, `Application Dependencies`, `db`, `(protected)/events/[slug]/page.tsx`, `checkin-access.ts`, `leader-validations.ts`, `Community Email Campaigns`, `Navigation and Footer`, `[memberId]/page.tsx`, `email.ts`, `card-preview/page.tsx`, `Events Listing`, `MembershipForm.tsx`, `programs/page.tsx`, `members/page.tsx`, `RegistrationForm.tsx`, `readJsonRequest`, `requireLeader`, `leadership-invites/route.ts`, `sanity.ts`, `admin-session.ts`, `registration.test.mjs`, `Application Root Layout`, `quoteEventTableName`, `InstitutionCombobox.tsx`, `success/page.tsx`, `(protected)/leaders/page.tsx`, `WhatsAppJoinAction.tsx`, `MembershipForm`, `verify/page.tsx`, `queries.ts`, `proxy.ts`, `invite/page.tsx`, `GalleryMarquee.tsx`, `(protected)/requests/[id]/page.tsx`, `members/support/page.tsx`, `check-in/login/page.tsx`, `LeaderPortalNav.tsx`, `(protected)/layout.tsx`, `contact/page.tsx`, `remind/route.ts`?**
  _High betweenness centrality (0.357) - this node is a cross-community bridge._
- **Should `membership/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11561561561561562 - nodes in this community are weakly interconnected._
- **Why does `db` connect `db` to `membership/route.ts`, `Admin Dashboard Analytics`, `member-code/route.ts`, `community-status/route.ts`, `requestBodyErrorResponse`, `getAdminSession`, `(protected)/events/[slug]/page.tsx`, `checkin-access.ts`, `Community Email Campaigns`, `[memberId]/page.tsx`, `email.ts`, `members/page.tsx`, `readJsonRequest`, `requireLeader`, `leadership-invites/route.ts`, `quoteEventTableName`, `(protected)/leaders/page.tsx`, `(protected)/requests/[id]/page.tsx`, `members/support/page.tsx`, `db-migrate.ts`, `check-in/login/page.tsx`, `remind/route.ts`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Should `Admin Dashboard Analytics` be split into smaller, more focused modules?**
  _Cohesion score 0.07948568088836938 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Homepage Sections` to `membership/route.ts`, `Admin Dashboard Analytics`, `migrate-events.mjs`, `member-code/route.ts`, `Package Development Dependencies`, `Application Dependencies`, `(protected)/events/[slug]/page.tsx`, `leader-validations.ts`, `Community Email Campaigns`, `Navigation and Footer`, `[memberId]/page.tsx`, `Events Listing`, `MembershipForm.tsx`, `members/page.tsx`, `RegistrationForm.tsx`, `readJsonRequest`, `sanity.ts`, `CameraTicketScanner`, `registration.test.mjs`, `member-card.tsx`, `quoteEventTableName`, `InstitutionCombobox.tsx`, `success/page.tsx`, `DonateForm.tsx`, `(protected)/leaders/page.tsx`, `WhatsAppJoinAction.tsx`, `verify/page.tsx`, `invite/page.tsx`, `GalleryMarquee.tsx`, `membership/support/page.tsx`, `(protected)/requests/[id]/page.tsx`, `members/support/page.tsx`, `check-in/login/page.tsx`, `(protected)/layout.tsx`, `contact/page.tsx`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Should `migrate-events.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.12857142857142856 - nodes in this community are weakly interconnected._
- **Should `member-code/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06394230769230769 - nodes in this community are weakly interconnected._