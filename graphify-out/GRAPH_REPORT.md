# Graph Report - kamp-website  (2026-11-17)

## Corpus Check
- 261 files · ~92,151 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .ico 3, (none) 2, .example 1)

## Summary
- 1208 nodes · 2749 edges · 104 communities (71 shown, 33 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `493952b4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- membership/route.ts
- Admin Dashboard Analytics
- migrate-events.mjs
- member-code/route.ts
- readJsonRequest
- Sanity Studio Setup
- leader-auth.ts
- getAdminSession
- About and Contact Content
- Package Development Dependencies
- register/route.ts
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
- check-in/verify/route.ts
- Event Check-in Migrations
- email.ts
- resend-card/route.ts
- Events Listing
- MembershipForm.tsx
- programs/page.tsx
- members/page.tsx
- RegistrationForm.tsx
- getClientIp
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
- lucide-react
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
- (site)/events/[slug]/page.tsx
- contact/page.tsx
- invite/page.tsx
- GalleryMarquee.tsx
- membership/support/page.tsx
- (protected)/requests/[id]/page.tsx
- EventListing.tsx
- db-migrate.ts
- 019_event_member_otp_audit.sql
- reports/export/route.ts
- check-in/login/page.tsx
- LeaderPortalNav.tsx
- (site)/page.tsx
- eslint.config.mjs
- remind/route.ts
- (auth)/login/page.tsx

## God Nodes (most connected - your core abstractions)
1. `db` - 143 edges
2. `next` - 126 edges
3. `readJsonRequest()` - 62 edges
4. `getAdminSession()` - 54 edges
5. `react` - 52 edges
6. `isSameOriginAdminRequest()` - 42 edges
7. `requestBodyErrorResponse()` - 40 edges
8. `getClientIp()` - 31 edges
9. `rateLimit()` - 26 edges
10. `lucide-react` - 23 edges

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

## Communities (104 total, 33 thin omitted)

### Community 0 - "membership/route.ts"
Cohesion: 0.11
Nodes (26): campaignCounts(), dynamic, POST(), runtime, dynamic, LeadershipInvitationsPage(), currentLagosYear(), LeadershipRegistrationError (+18 more)

### Community 1 - "Admin Dashboard Analytics"
Cohesion: 0.08
Nodes (51): AdminDashboardPage(), AnalyticsDirectoryLoading(), AnalyticsPanelLoading(), DashboardAnalytics(), DashboardOverview(), dynamic, EventRegistrationsLoading(), EventRegistrationsOverview() (+43 more)

### Community 2 - "migrate-events.mjs"
Cohesion: 0.14
Nodes (15): @sanity/client@7.26.2, @sanity/client, buildDocument(), client, DRY_RUN, IMAGE_ROOT, main(), MONTHS (+7 more)

### Community 3 - "member-code/route.ts"
Cohesion: 0.13
Nodes (24): limited(), maxDuration, POST(), runtime, schema, POST(), runtime, schema (+16 more)

### Community 4 - "readJsonRequest"
Cohesion: 0.11
Nodes (24): POST(), dynamic, InvitationError, invitationSchema, POST(), runtime, bodySchema, dynamic (+16 more)

### Community 5 - "Sanity Studio Setup"
Cohesion: 0.08
Nodes (21): dynamic, sanity@^5.31.1, @sanity/image-url@2, @sanity/vision@^5.31.1, sanity, @sanity/image-url, @sanity/vision, apiVersion (+13 more)

### Community 6 - "leader-auth.ts"
Cohesion: 0.16
Nodes (19): POST(), POST(), runtime, POST(), runtime, POST(), runtime, POST() (+11 more)

### Community 7 - "getAdminSession"
Cohesion: 0.14
Nodes (22): createSchema, DELETE(), dynamic, eventSlugSchema, GET(), revokeSchema, runtime, DELETE() (+14 more)

### Community 8 - "About and Contact Content"
Cohesion: 0.19
Nodes (12): AboutPage(), FounderCard, revalidate, TeamCard, values, builder, EVENT_BY_ID_QUERY, FOUNDER_QUERY (+4 more)

### Community 9 - "Package Development Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, prettier@^3.9.6, prettier-plugin-tailwindcss@^0.8.1, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/qrcode@^1.5.6, @types/react@^19 (+14 more)

### Community 10 - "register/route.ts"
Cohesion: 0.13
Nodes (20): maxDuration, POST(), runtime, schema, dynamic, GET(), runtime, assertSafeTableName() (+12 more)

### Community 11 - "Homepage Sections"
Cohesion: 0.12
Nodes (13): AdminLoginPage(), HomePage(), GetInvolvedTabs(), tabs, HeroImageRotator(), heroImages, QuickStory(), words (+5 more)

### Community 12 - "Application Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, clsx@^2.1.1, next@16.3.0, next-auth@^4.24.15, next-sanity@13, postgres@^3.4.9, qrcode@^1.5.4, react@19.2.8 (+14 more)

### Community 13 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 14 - "db"
Cohesion: 0.15
Nodes (15): AdminLeaderReportDetail(), dynamic, dynamic, LeaderDashboardPage(), dynamic, LeaderReportDetailPage(), dynamic, LeaderRequestDetailPage() (+7 more)

### Community 15 - "(protected)/events/[slug]/page.tsx"
Cohesion: 0.26
Nodes (8): AdminEventRegistrationsPage(), dynamic, CheckinOperatorManager(), addOperator(), load(), revoke(), Operator, SendReminderButton()

### Community 16 - "checkin-access.ts"
Cohesion: 0.19
Nodes (12): dynamic, POST(), runtime, dynamic, OperatorCheckinPage(), CheckinLogoutButton(), CHECKIN_SESSION_COOKIE, CHECKIN_SESSION_SECONDS (+4 more)

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

### Community 22 - "check-in/verify/route.ts"
Cohesion: 0.20
Nodes (12): dynamic, POST(), requestSchema, runtime, dynamic, POST(), requestSchema, runtime (+4 more)

### Community 23 - "Event Check-in Migrations"
Cohesion: 0.28
Nodes (11): idx_registry_event_id, idx_registry_event_slug, public.event_tables_registry, event_checkin_audit_event_created_idx, event_checkin_login_codes_operator_idx, event_checkin_operators_email_idx, event_checkin_sessions_operator_idx, public.event_checkin_audit (+3 more)

### Community 24 - "email.ts"
Cohesion: 0.09
Nodes (41): GET(), maxDuration, runtime, POST(), runtime, POST(), runtime, ADMIN() (+33 more)

### Community 25 - "resend-card/route.ts"
Cohesion: 0.27
Nodes (8): DELETE(), dynamic, runtime, maxDuration, POST(), runtime, isMemberId(), tryRegistrationEmail()

### Community 26 - "Events Listing"
Cohesion: 0.21
Nodes (10): EventCard(), EventsPage(), formatEventDate(), revalidate, EventCardProps, FeaturedEventsCarousel(), formatEventDate(), PAST_EVENTS_QUERY (+2 more)

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
Cohesion: 0.26
Nodes (9): Failure, Member, RegistrationForm(), editId(), requestCode(), save(), submit(), Session (+1 more)

### Community 31 - "getClientIp"
Cohesion: 0.20
Nodes (15): POST(), runtime, verifyPassword(), dynamic, POST(), runtime, POST(), POST() (+7 more)

### Community 32 - "Core Database Migrations"
Cohesion: 0.29
Nodes (8): contact_submissions, donations, events_registrations, idx_donations_email, idx_donations_paystack_ref, idx_registrations_email, idx_registrations_event_id, idx_registrations_event_email_unique

### Community 33 - "Development Dependencies"
Cohesion: 0.18
Nodes (11): scripts, admin:hash-password, build, db:check, db:migrate, dev, lint, migrate:events (+3 more)

### Community 34 - "next"
Cohesion: 0.10
Nodes (11): dynamic, MemberProfilePage(), metadata, metadata, DeleteMemberButton(), EditMemberPosition(), ResendCardButton(), csp (+3 more)

### Community 35 - "client.ts"
Cohesion: 0.32
Nodes (6): EventSnapshot, EventWebhookPayload, POST(), runtime, next-sanity, publicEventsTag

### Community 37 - "Admin Navigation"
Cohesion: 0.39
Nodes (4): ProtectedAdminLayout(), AdminNavigation(), items, LogoutButton()

### Community 38 - "sanity.ts"
Cohesion: 0.14
Nodes (18): GalleryIntro(), GalleryPage(), revalidate, GalleryAlbum(), GalleryAlbumProps, slots, GalleryAlbums(), GalleryAlbumsProps (+10 more)

### Community 39 - "admin-session.ts"
Cohesion: 0.29
Nodes (8): POST(), AdminMembershipSupport(), dynamic, createAdminSession(), destroyAdminSession(), getSecret(), signValue(), verifyValue()

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
Cohesion: 0.16
Nodes (16): dynamic, POST(), runtime, dynamic, POST(), runtime, dynamic, GET() (+8 more)

### Community 47 - "Prettier Configuration"
Cohesion: 0.33
Nodes (5): plugins, printWidth, semi, singleQuote, trailingComma

### Community 48 - "InstitutionCombobox.tsx"
Cohesion: 0.21
Nodes (8): GET(), normalize(), InstitutionCombobox(), InstitutionComboboxProps, TYPE_STYLES, INSTITUTION_NAMES, NIGERIAN_INSTITUTIONS, NigerianInstitution

### Community 49 - "Member Table Migration"
Cohesion: 0.60
Nodes (4): member_number_counters, members, members_status_idx, members_year_joined_idx

### Community 50 - "lucide-react"
Cohesion: 0.20
Nodes (4): pathways, metadata, lucide-react@^1.28.0, lucide-react

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

### Community 88 - "(site)/events/[slug]/page.tsx"
Cohesion: 0.24
Nodes (8): descriptionComponents, EventDetailPage(), formatDate(), formatTime(), revalidate, publicEventCache, EVENT_BY_SLUG_QUERY, EVENT_SLUGS_QUERY

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
Cohesion: 0.31
Nodes (4): AdminLeaderRequestDetail(), dynamic, ReviewLeaderRequest(), SendRequestAdminNotification()

### Community 96 - "019_event_member_otp_audit.sql"
Cohesion: 0.83
Nodes (3): event_member_otp_audit_created_idx, event_member_otp_audit_event_created_idx, public.event_member_otp_audit

### Community 97 - "reports/export/route.ts"
Cohesion: 0.39
Nodes (5): dynamic, GET(), dynamic, GET(), csvFile()

### Community 98 - "check-in/login/page.tsx"
Cohesion: 0.38
Nodes (3): CheckinLoginPage(), dynamic, CheckinLoginForm()

### Community 99 - "LeaderPortalNav.tsx"
Cohesion: 0.48
Nodes (4): LeaderPortalLayout(), LeaderLogoutButton(), LeaderPortalNav(), links

### Community 100 - "(site)/page.tsx"
Cohesion: 0.29
Nodes (6): actions, fallbackStats, partners, revalidate, freshClient, FEATURED_EVENT_QUERY

### Community 101 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.3.0, eslint, eslint-config-next

### Community 102 - "remind/route.ts"
Cohesion: 0.50
Nodes (4): dynamic, lagosDate(), POST(), runtime

## Knowledge Gaps
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `membership/route.ts`, `Admin Dashboard Analytics`, `member-code/route.ts`, `readJsonRequest`, `leader-auth.ts`, `getAdminSession`, `About and Contact Content`, `Package Development Dependencies`, `register/route.ts`, `Homepage Sections`, `Application Dependencies`, `db`, `(protected)/events/[slug]/page.tsx`, `checkin-access.ts`, `leader-validations.ts`, `Community Email Campaigns`, `Navigation and Footer`, `check-in/verify/route.ts`, `email.ts`, `resend-card/route.ts`, `Events Listing`, `MembershipForm.tsx`, `programs/page.tsx`, `members/page.tsx`, `RegistrationForm.tsx`, `getClientIp`, `client.ts`, `success/page.tsx`, `Admin Navigation`, `sanity.ts`, `admin-session.ts`, `react`, `registration.test.mjs`, `Application Root Layout`, `quoteEventTableName`, `InstitutionCombobox.tsx`, `lucide-react`, `(protected)/leaders/page.tsx`, `WhatsAppJoinAction.tsx`, `MembershipForm`, `verify/page.tsx`, `(site)/events/[slug]/page.tsx`, `contact/page.tsx`, `invite/page.tsx`, `GalleryMarquee.tsx`, `(protected)/requests/[id]/page.tsx`, `EventListing.tsx`, `reports/export/route.ts`, `check-in/login/page.tsx`, `LeaderPortalNav.tsx`, `(site)/page.tsx`, `remind/route.ts`, `(auth)/login/page.tsx`?**
  _High betweenness centrality (0.353) - this node is a cross-community bridge._
- **Should `membership/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10793650793650794 - nodes in this community are weakly interconnected._
- **Why does `db` connect `db` to `membership/route.ts`, `Admin Dashboard Analytics`, `member-code/route.ts`, `readJsonRequest`, `leader-auth.ts`, `getAdminSession`, `register/route.ts`, `(protected)/events/[slug]/page.tsx`, `checkin-access.ts`, `Community Email Campaigns`, `check-in/verify/route.ts`, `email.ts`, `resend-card/route.ts`, `members/page.tsx`, `getClientIp`, `next`, `admin-session.ts`, `react`, `quoteEventTableName`, `(protected)/leaders/page.tsx`, `(protected)/requests/[id]/page.tsx`, `db-migrate.ts`, `reports/export/route.ts`, `check-in/login/page.tsx`, `remind/route.ts`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Should `Admin Dashboard Analytics` be split into smaller, more focused modules?**
  _Cohesion score 0.07595628415300547 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Homepage Sections` to `membership/route.ts`, `Admin Dashboard Analytics`, `Package Development Dependencies`, `register/route.ts`, `Application Dependencies`, `(protected)/events/[slug]/page.tsx`, `checkin-access.ts`, `leader-validations.ts`, `Community Email Campaigns`, `Navigation and Footer`, `Events Listing`, `MembershipForm.tsx`, `members/page.tsx`, `RegistrationForm.tsx`, `next`, `success/page.tsx`, `Admin Navigation`, `sanity.ts`, `react`, `member-card.tsx`, `InstitutionCombobox.tsx`, `DonateForm.tsx`, `(protected)/leaders/page.tsx`, `WhatsAppJoinAction.tsx`, `verify/page.tsx`, `contact/page.tsx`, `invite/page.tsx`, `GalleryMarquee.tsx`, `membership/support/page.tsx`, `(protected)/requests/[id]/page.tsx`, `EventListing.tsx`, `check-in/login/page.tsx`, `(auth)/login/page.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Should `migrate-events.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.1437908496732026 - nodes in this community are weakly interconnected._
- **Should `member-code/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12903225806451613 - nodes in this community are weakly interconnected._