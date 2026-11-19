# Graph Report - kamp-website  (2026-11-19)

## Corpus Check
- 272 files · ~97,119 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .ico 3, (none) 2, .example 1)

## Summary
- 1246 nodes · 2850 edges · 106 communities (69 shown, 37 thin omitted)
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
- admin-analytics.ts
- schemas/index.ts
- readJsonRequest
- getAdminSession
- sanity.ts
- Package Development Dependencies
- sanity.config.ts
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
- [memberId]/page.tsx
- Event Check-in Migrations
- email.ts
- admin-data.ts
- FeaturedEventsCarousel.tsx
- MembershipForm.tsx
- programs/page.tsx
- members/page.tsx
- RegistrationForm.tsx
- getClientIp
- Core Database Migrations
- Development Dependencies
- lucide-react
- next-sanity
- leader-auth.ts
- leadership-invites/route.ts
- sanity.ts
- admin-session.ts
- GenderPanel
- registration.test.mjs
- Application Root Layout
- migrate-gallery.mjs
- member-card.tsx
- Vercel Deployment Config
- check-in/[slug]/page.tsx
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
- MembershipTypeBreakdown.tsx
- invite/page.tsx
- GalleryMarquee.tsx
- membership/support/page.tsx
- (protected)/requests/[id]/page.tsx
- members/support/page.tsx
- db-migrate.ts
- 019_event_member_otp_audit.sql
- load
- check-in/login/page.tsx
- SignupTrendChart.tsx
- (protected)/layout.tsx
- leaders/layout.tsx
- [[...tool]]/layout.tsx
- next.config.ts

## God Nodes (most connected - your core abstractions)
1. `db` - 143 edges
2. `next` - 129 edges
3. `readJsonRequest()` - 62 edges
4. `react` - 55 edges
5. `getAdminSession()` - 54 edges
6. `isSameOriginAdminRequest()` - 42 edges
7. `requestBodyErrorResponse()` - 40 edges
8. `getClientIp()` - 31 edges
9. `rateLimit()` - 26 edges
10. `lucide-react` - 26 edges

## Surprising Connections (you probably didn't know these)
- `AdminMembershipSupport()` --calls--> `getAdminSession()`  [EXTRACTED]
  app/admin/(protected)/members/support/page.tsx → lib/admin-session.ts
- `POST()` --calls--> `isSameOriginAdminRequest()`  [EXTRACTED]
  app/admin/api/members/support/route.ts → lib/admin-request.ts
- `POST()` --calls--> `getAdminSession()`  [EXTRACTED]
  app/admin/api/members/support/route.ts → lib/admin-session.ts
- `POST()` --calls--> `scheduleRegistrationEmail()`  [EXTRACTED]
  app/admin/api/members/support/route.ts → lib/registration-background.ts
- `POST()` --calls--> `db`  [EXTRACTED]
  app/api/membership/support/route.ts → lib/db.ts

## Import Cycles
- None detected.

## Communities (106 total, 37 thin omitted)

### Community 0 - "membership/route.ts"
Cohesion: 0.08
Nodes (37): campaignCounts(), dynamic, POST(), runtime, maxDuration, POST(), runtime, schema (+29 more)

### Community 1 - "Admin Dashboard Analytics"
Cohesion: 0.15
Nodes (28): AdminDashboardPage(), AnalyticsDirectoryLoading(), AnalyticsPanelLoading(), DashboardAnalytics(), DashboardOverview(), dynamic, EventRegistrationsLoading(), EventRegistrationsOverview() (+20 more)

### Community 2 - "migrate-events.mjs"
Cohesion: 0.13
Nodes (15): KampEvent, kampEvents, buildDocument(), client, DRY_RUN, IMAGE_ROOT, main(), MONTHS (+7 more)

### Community 3 - "member-code/route.ts"
Cohesion: 0.06
Nodes (46): limited(), maxDuration, POST(), runtime, schema, POST(), runtime, schema (+38 more)

### Community 4 - "admin-analytics.ts"
Cohesion: 0.26
Nodes (10): AdminEventsPage(), dynamic, EventRegistrationCount, getEventRegistrationCount(), getTotalEventRegistrations(), getUniversities(), isMissingTableError(), UniversityCount (+2 more)

### Community 5 - "schemas/index.ts"
Cohesion: 0.18
Nodes (10): sanity@^5.31.1, sanity, plugins, eventSchema, galleryEventSchema, schemaTypes, memberSchema, programSchema (+2 more)

### Community 6 - "readJsonRequest"
Cohesion: 0.11
Nodes (27): dynamic, POST(), runtime, dynamic, POST(), runtime, POST(), bodySchema (+19 more)

### Community 7 - "getAdminSession"
Cohesion: 0.10
Nodes (30): createSchema, DELETE(), dynamic, eventSlugSchema, GET(), POST(), revokeSchema, runtime (+22 more)

### Community 8 - "sanity.ts"
Cohesion: 0.15
Nodes (14): AboutPage(), FounderCard, revalidate, TeamCard, values, ContactPage(), revalidate, ContactForm() (+6 more)

### Community 9 - "Package Development Dependencies"
Cohesion: 0.10
Nodes (27): eslintConfig, devDependencies, eslint@^9, eslint-config-next@16.3.0, prettier@^3.9.6, prettier-plugin-tailwindcss@^0.8.1, tailwindcss@^4, @tailwindcss/postcss@^4 (+19 more)

### Community 10 - "sanity.config.ts"
Cohesion: 0.17
Nodes (10): @sanity/image-url@2, @sanity/vision@^5.31.1, @sanity/image-url, @sanity/vision, apiVersion, dataset, projectId, builder (+2 more)

### Community 11 - "Homepage Sections"
Cohesion: 0.11
Nodes (17): actions, fallbackStats, HomePage(), partners, revalidate, GetInvolvedTabs(), tabs, HeroImageRotator() (+9 more)

### Community 12 - "Application Dependencies"
Cohesion: 0.09
Nodes (23): dependencies, clsx@^2.1.1, lucide-react@^1.28.0, next@16.3.0, next-auth@^4.24.15, postgres@^3.4.9, qrcode@^1.5.4, react@19.2.8 (+15 more)

### Community 13 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 14 - "db"
Cohesion: 0.17
Nodes (13): dynamic, GET(), dynamic, GET(), AdminLeaderReportDetail(), dynamic, csvFile(), db (+5 more)

### Community 15 - "(protected)/events/[slug]/page.tsx"
Cohesion: 0.26
Nodes (8): AdminEventRegistrationsPage(), dynamic, CheckinOperatorManager(), addOperator(), load(), revoke(), Operator, SendReminderButton()

### Community 16 - "check-in/verify/route.ts"
Cohesion: 0.15
Nodes (18): dynamic, POST(), requestSchema, runtime, dynamic, POST(), requestSchema, runtime (+10 more)

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
Cohesion: 0.19
Nodes (7): AdminLoginPage(), dynamic, MemberProfilePage(), DeleteMemberButton(), EditMemberPosition(), ResendCardButton(), react

### Community 23 - "Event Check-in Migrations"
Cohesion: 0.28
Nodes (11): idx_registry_event_id, idx_registry_event_slug, public.event_tables_registry, event_checkin_audit_event_created_idx, event_checkin_login_codes_operator_idx, event_checkin_operators_email_idx, event_checkin_sessions_operator_idx, public.event_checkin_audit (+3 more)

### Community 24 - "email.ts"
Cohesion: 0.08
Nodes (47): GET(), maxDuration, runtime, POST(), runtime, POST(), runtime, EventSnapshot (+39 more)

### Community 25 - "admin-data.ts"
Cohesion: 0.27
Nodes (8): dynamic, GET(), runtime, dynamic, GET(), runtime, buildCsv(), csvCell()

### Community 26 - "FeaturedEventsCarousel.tsx"
Cohesion: 0.38
Nodes (4): EventCardProps, FeaturedEventsCarousel(), formatEventDate(), EventDocument

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

### Community 31 - "getClientIp"
Cohesion: 0.15
Nodes (21): POST(), POST(), POST(), POST(), schema, POST(), runtime, POST() (+13 more)

### Community 32 - "Core Database Migrations"
Cohesion: 0.29
Nodes (8): contact_submissions, donations, events_registrations, idx_donations_email, idx_donations_paystack_ref, idx_registrations_email, idx_registrations_event_id, idx_registrations_event_email_unique

### Community 33 - "Development Dependencies"
Cohesion: 0.18
Nodes (11): scripts, admin:hash-password, build, db:check, db:migrate, dev, lint, migrate:events (+3 more)

### Community 34 - "lucide-react"
Cohesion: 0.22
Nodes (3): pathways, metadata, lucide-react

### Community 35 - "next-sanity"
Cohesion: 0.40
Nodes (3): dynamic, next-sanity@13, next-sanity

### Community 36 - "leader-auth.ts"
Cohesion: 0.11
Nodes (21): POST(), LeaderLoginPage(), LeadersIndexPage(), dynamic, LeaderDashboardPage(), LeaderPortalLayout(), dynamic, LeaderReportDetailPage() (+13 more)

### Community 37 - "leadership-invites/route.ts"
Cohesion: 0.18
Nodes (8): dynamic, InvitationError, invitationSchema, runtime, dynamic, runtime, tokenSchema, zod

### Community 38 - "sanity.ts"
Cohesion: 0.15
Nodes (17): GalleryIntro(), GalleryPage(), revalidate, GalleryAlbum(), GalleryAlbumProps, slots, GalleryAlbums(), GalleryAlbumsProps (+9 more)

### Community 39 - "admin-session.ts"
Cohesion: 0.30
Nodes (9): POST(), runtime, verifyPassword(), POST(), createAdminSession(), destroyAdminSession(), getSecret(), signValue() (+1 more)

### Community 40 - "GenderPanel"
Cohesion: 0.33
Nodes (5): GenderPanel(), colors, GenderBreakdown(), GenderCount, getGenderBreakdown()

### Community 41 - "registration.test.mjs"
Cohesion: 0.08
Nodes (19): resend(), check(), { classifyEmailFailure, EmailProviderError, retryDelay }, codes, { countdownSeconds, eventSlug }, load, memberId(), { NextRequest, NextResponse } (+11 more)

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

### Community 46 - "check-in/[slug]/page.tsx"
Cohesion: 0.16
Nodes (12): dynamic, EventCheckinPage(), dynamic, OperatorCheckinPage(), CameraTicketScanner(), controlsStop(), start(), CheckinList() (+4 more)

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
Nodes (17): EventCard(), EventsPage(), formatEventDate(), revalidate, descriptionComponents, EventDetailPage(), formatDate(), formatTime() (+9 more)

### Community 89 - "MembershipTypeBreakdown.tsx"
Cohesion: 0.33
Nodes (4): barColors, colors, StudyLevelBreakdown(), CategoryCount

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
Cohesion: 0.19
Nodes (9): AdminMembershipSupport(), deliveryLabels, dynamic, nextStep(), SupportWelcomeAction(), SupportWhatsAppNumber(), findMembershipSupportRequests(), SupportMember (+1 more)

### Community 96 - "019_event_member_otp_audit.sql"
Cohesion: 0.83
Nodes (3): event_member_otp_audit_created_idx, event_member_otp_audit_event_created_idx, public.event_member_otp_audit

### Community 98 - "check-in/login/page.tsx"
Cohesion: 0.38
Nodes (3): CheckinLoginPage(), dynamic, CheckinLoginForm()

### Community 99 - "SignupTrendChart.tsx"
Cohesion: 0.40
Nodes (4): EmptyChart(), SignupTrendChart(), SignupMonth, recharts

### Community 100 - "(protected)/layout.tsx"
Cohesion: 0.39
Nodes (4): ProtectedAdminLayout(), AdminNavigation(), items, LogoutButton()

## Knowledge Gaps
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `getAdminSession` to `membership/route.ts`, `Admin Dashboard Analytics`, `migrate-events.mjs`, `member-code/route.ts`, `admin-analytics.ts`, `readJsonRequest`, `sanity.ts`, `Package Development Dependencies`, `Homepage Sections`, `Application Dependencies`, `db`, `(protected)/events/[slug]/page.tsx`, `check-in/verify/route.ts`, `leader-validations.ts`, `Community Email Campaigns`, `Navigation and Footer`, `[memberId]/page.tsx`, `email.ts`, `admin-data.ts`, `FeaturedEventsCarousel.tsx`, `MembershipForm.tsx`, `programs/page.tsx`, `members/page.tsx`, `RegistrationForm.tsx`, `getClientIp`, `lucide-react`, `leader-auth.ts`, `leadership-invites/route.ts`, `sanity.ts`, `admin-session.ts`, `registration.test.mjs`, `Application Root Layout`, `check-in/[slug]/page.tsx`, `InstitutionCombobox.tsx`, `success/page.tsx`, `(protected)/leaders/page.tsx`, `WhatsAppJoinAction.tsx`, `MembershipForm`, `verify/page.tsx`, `queries.ts`, `invite/page.tsx`, `GalleryMarquee.tsx`, `(protected)/requests/[id]/page.tsx`, `members/support/page.tsx`, `check-in/login/page.tsx`, `(protected)/layout.tsx`, `leaders/layout.tsx`, `[[...tool]]/layout.tsx`, `next.config.ts`?**
  _High betweenness centrality (0.321) - this node is a cross-community bridge._
- **Should `membership/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Why does `db` connect `db` to `membership/route.ts`, `Admin Dashboard Analytics`, `member-code/route.ts`, `admin-analytics.ts`, `readJsonRequest`, `getAdminSession`, `(protected)/events/[slug]/page.tsx`, `check-in/verify/route.ts`, `Community Email Campaigns`, `[memberId]/page.tsx`, `email.ts`, `admin-data.ts`, `members/page.tsx`, `getClientIp`, `leader-auth.ts`, `leadership-invites/route.ts`, `GenderPanel`, `check-in/[slug]/page.tsx`, `(protected)/leaders/page.tsx`, `(protected)/requests/[id]/page.tsx`, `members/support/page.tsx`, `db-migrate.ts`, `check-in/login/page.tsx`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Should `Admin Dashboard Analytics` be split into smaller, more focused modules?**
  _Cohesion score 0.14942528735632185 - nodes in this community are weakly interconnected._
- **Why does `react` connect `[memberId]/page.tsx` to `membership/route.ts`, `Admin Dashboard Analytics`, `migrate-events.mjs`, `member-code/route.ts`, `sanity.ts`, `Package Development Dependencies`, `Homepage Sections`, `Application Dependencies`, `(protected)/events/[slug]/page.tsx`, `leader-validations.ts`, `Community Email Campaigns`, `Navigation and Footer`, `FeaturedEventsCarousel.tsx`, `MembershipForm.tsx`, `members/page.tsx`, `RegistrationForm.tsx`, `leader-auth.ts`, `sanity.ts`, `registration.test.mjs`, `member-card.tsx`, `check-in/[slug]/page.tsx`, `InstitutionCombobox.tsx`, `success/page.tsx`, `DonateForm.tsx`, `(protected)/leaders/page.tsx`, `WhatsAppJoinAction.tsx`, `verify/page.tsx`, `invite/page.tsx`, `GalleryMarquee.tsx`, `membership/support/page.tsx`, `(protected)/requests/[id]/page.tsx`, `members/support/page.tsx`, `check-in/login/page.tsx`, `(protected)/layout.tsx`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Should `migrate-events.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.12857142857142856 - nodes in this community are weakly interconnected._
- **Should `member-code/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06394230769230769 - nodes in this community are weakly interconnected._