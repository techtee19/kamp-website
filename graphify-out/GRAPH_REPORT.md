# Graph Report - kamp-website  (2026-11-07)

## Corpus Check
- 204 files · ~76,517 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .ico 3, (none) 2, .example 1)

## Summary
- 948 nodes · 2057 edges · 92 communities (47 shown, 45 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `47f267e4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- membership/route.ts
- dashboard/page.tsx
- migrate-gallery.mjs
- register/route.ts
- db
- readJsonRequest
- getAdminSession
- schemas/index.ts
- queries.ts
- dependencies
- package.json
- (site)/page.tsx
- compilerOptions
- check-in/[slug]/page.tsx
- verify/route.ts
- public.members
- engagement/page.tsx
- Navbar.tsx
- gallery/page.tsx
- build-icons.js
- sanity.ts
- 017_event_checkin_operators.sql
- next
- leadership.ts
- [memberId]/page.tsx
- lucide-react
- DonateForm.tsx
- 001_init.sql
- scripts
- programs/page.tsx
- admin-session.ts
- (protected)/layout.tsx
- request-code/route.ts
- members/page.tsx
- contact/page.tsx
- GalleryMarquee.tsx
- vercel.json
- CheckinOperatorManager
- eslint.config.mjs
- @sanity/vision
- .prettierrc.json
- remind/route.ts
- app/layout.tsx
- 005_members.sql
- success/page.tsx
- postgres
- README.md
- types/db.ts
- admin/login/page.tsx
- dashboard/loading.tsx
- get-involved/page.tsx
- (site)/loading.tsx
- card-preview/page.tsx
- [[...tool]]/layout.tsx
- 007_security_rate_limits.sql
- next.config.ts
- proxy.ts
- AGENTS.md
- @portabletext/react
- react-dom@19.2.8
- react-icons
- resend
- @sanity/image-url
- tailwind-merge@^3.6.0
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `db` - 92 edges
2. `next` - 85 edges
3. `readJsonRequest()` - 46 edges
4. `react` - 41 edges
5. `requestBodyErrorResponse()` - 38 edges
6. `getAdminSession()` - 32 edges
7. `isSameOriginAdminRequest()` - 28 edges
8. `rateLimit()` - 24 edges
9. `getClientIp()` - 23 edges
10. `lucide-react` - 19 edges

## Surprising Connections (you probably didn't know these)
- `CommunityJoinPage()` --calls--> `WhatsAppJoinAction()`  [EXTRACTED]
  app/(site)/community/join/page.tsx → components/membership/WhatsAppJoinAction.tsx
- `EventDetailPage()` --calls--> `RegistrationForm()`  [EXTRACTED]
  app/(site)/events/[slug]/page.tsx → components/events/RegistrationForm.tsx
- `MembershipPage()` --calls--> `MembershipForm()`  [EXTRACTED]
  app/(site)/membership/page.tsx → components/membership/MembershipForm.tsx
- `HomePage()` --calls--> `GalleryMarquee()`  [EXTRACTED]
  app/(site)/page.tsx → components/sections/GalleryMarquee.tsx
- `DashboardOverview()` --calls--> `db`  [EXTRACTED]
  app/admin/(protected)/dashboard/page.tsx → lib/db.ts

## Import Cycles
- None detected.

## Communities (92 total, 45 thin omitted)

### Community 0 - "react"
Cohesion: 0.05
Nodes (43): GET(), normalize(), CommunityJoinPage(), metadata, dynamic, LeadershipInvitationPage(), metadata, benefits (+35 more)

### Community 1 - "membership/route.ts"
Cohesion: 0.09
Nodes (46): campaignCounts(), dynamic, POST(), runtime, dynamic, POST(), runtime, dynamic (+38 more)

### Community 2 - "dashboard/page.tsx"
Cohesion: 0.09
Nodes (46): AdminDashboardPage(), AnalyticsDirectoryLoading(), AnalyticsPanelLoading(), DashboardAnalytics(), DashboardOverview(), dynamic, EventRegistrationsLoading(), EventRegistrationsOverview() (+38 more)

### Community 3 - "migrate-gallery.mjs"
Cohesion: 0.06
Nodes (38): files, migrate(), KampEvent, kampEvents, emerge2025, featuredPhotos, GALLERY_IMAGE_DIR, KampGalleryAlbum (+30 more)

### Community 4 - "register/route.ts"
Cohesion: 0.07
Nodes (32): POST(), runtime, POST(), runtime, EventSnapshot, EventWebhookPayload, POST(), runtime (+24 more)

### Community 5 - "db"
Cohesion: 0.10
Nodes (29): dynamic, POST(), runtime, dynamic, POST(), runtime, dynamic, GET() (+21 more)

### Community 6 - "readJsonRequest"
Cohesion: 0.14
Nodes (29): POST(), runtime, verifyPassword(), POST(), POST(), POST(), dynamic, POST() (+21 more)

### Community 7 - "getAdminSession"
Cohesion: 0.10
Nodes (30): createSchema, DELETE(), dynamic, eventSlugSchema, GET(), POST(), revokeSchema, runtime (+22 more)

### Community 8 - "schemas/index.ts"
Cohesion: 0.09
Nodes (17): dynamic, sanity@^5.31.1, sanity, apiVersion, dataset, projectId, builder, plugins (+9 more)

### Community 9 - "queries.ts"
Cohesion: 0.13
Nodes (19): AboutPage(), FounderCard, revalidate, TeamCard, values, descriptionComponents, EventDetailPage(), formatDate() (+11 more)

### Community 10 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, @hookform/resolvers@^5.7.1, lucide-react@^1.28.0, next@16.3.0, next-sanity@13, qrcode@^1.5.4, react@19.2.8, @react-email/components@^1.0.12 (+16 more)

### Community 11 - "package.json"
Cohesion: 0.12
Nodes (22): devDependencies, prettier@^3.9.6, prettier-plugin-tailwindcss@^0.8.1, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/qrcode@^1.5.6, @types/react@^19 (+14 more)

### Community 12 - "(site)/page.tsx"
Cohesion: 0.13
Nodes (16): actions, fallbackStats, HomePage(), partners, revalidate, GetInvolvedTabs(), tabs, HeroImageRotator() (+8 more)

### Community 13 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 14 - "check-in/[slug]/page.tsx"
Cohesion: 0.18
Nodes (11): dynamic, OperatorCheckinPage(), CameraTicketScanner(), controlsStop(), start(), CheckinList(), Registrant, CheckinLogoutButton() (+3 more)

### Community 15 - "verify/route.ts"
Cohesion: 0.22
Nodes (13): dynamic, POST(), runtime, dynamic, POST(), requestSchema, runtime, CHECKIN_SESSION_COOKIE (+5 more)

### Community 16 - "public.members"
Cohesion: 0.17
Nodes (11): leadership_invites_expiry_idx, leadership_invites_pending_email_idx, public.leadership_member_id_counters, public.leadership_registration_invites, member_community_invite_links_member_idx, public.member_community_invite_links, public.member_community_tracking, community_email_campaign_pending_idx (+3 more)

### Community 17 - "engagement/page.tsx"
Cohesion: 0.21
Nodes (11): dynamic, filters, formatDate(), MemberEngagementPage(), safePage(), CommunityEmailCampaign(), prepare(), send() (+3 more)

### Community 18 - "Navbar.tsx"
Cohesion: 0.19
Nodes (9): SiteLayout(), Footer(), links, DropdownName, exploreLinks, involvedLinks, Navbar(), primaryLinks (+1 more)

### Community 19 - "gallery/page.tsx"
Cohesion: 0.23
Nodes (11): GalleryIntro(), GalleryPage(), revalidate, GalleryAlbum(), GalleryAlbumProps, slots, GalleryAlbums(), GalleryAlbumsProps (+3 more)

### Community 20 - "build-icons.js"
Cohesion: 0.18
Nodes (9): BG, chip(), emblem(), flame(), fs, path, sharp, SRC (+1 more)

### Community 21 - "sanity.ts"
Cohesion: 0.19
Nodes (9): EventCardProps, GalleryLightboxProps, EventDocument, SanityBlock, SanityGalleryImage, SanityImage, SanityImageAsset, SanityResolvedImage (+1 more)

### Community 22 - "017_event_checkin_operators.sql"
Cohesion: 0.28
Nodes (11): idx_registry_event_id, idx_registry_event_slug, public.event_tables_registry, event_checkin_audit_event_created_idx, event_checkin_login_codes_operator_idx, event_checkin_operators_email_idx, event_checkin_sessions_operator_idx, public.event_checkin_audit (+3 more)

### Community 23 - "next"
Cohesion: 0.21
Nodes (4): CheckinLoginPage(), dynamic, CheckinLoginForm(), next

### Community 24 - "leadership.ts"
Cohesion: 0.26
Nodes (7): dynamic, LeadershipInvitationsPage(), CreatedInvite, CreateLeadershipInvite(), isLeadershipRole(), LEADERSHIP_ROLES, LeadershipRole

### Community 25 - "[memberId]/page.tsx"
Cohesion: 0.26
Nodes (5): dynamic, MemberProfilePage(), DeleteMemberButton(), EditMemberPosition(), ResendCardButton()

### Community 26 - "lucide-react"
Cohesion: 0.29
Nodes (9): EventCard(), EventsPage(), formatEventDate(), revalidate, FeaturedEventsCarousel(), formatEventDate(), lucide-react, PAST_EVENTS_QUERY (+1 more)

### Community 27 - "DonateForm.tsx"
Cohesion: 0.24
Nodes (8): amounts, AmountSelector(), AmountSelectorProps, DonateForm(), DONATION_TYPE, Frequency, PaymentMethod, paymentMethods

### Community 28 - "001_init.sql"
Cohesion: 0.29
Nodes (8): contact_submissions, donations, events_registrations, idx_donations_email, idx_donations_paystack_ref, idx_registrations_email, idx_registrations_event_id, idx_registrations_event_email_unique

### Community 29 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, admin:hash-password, build, db:check, db:migrate, dev, lint, migrate:events (+2 more)

### Community 30 - "programs/page.tsx"
Cohesion: 0.22
Nodes (7): executiveRoles, focusAreas, journey, ProgramCard, revalidate, PROGRAMS_QUERY, ProgramDocument

### Community 31 - "admin-session.ts"
Cohesion: 0.46
Nodes (6): POST(), createAdminSession(), destroyAdminSession(), getSecret(), signValue(), verifyValue()

### Community 32 - "(protected)/layout.tsx"
Cohesion: 0.39
Nodes (4): ProtectedAdminLayout(), AdminNavigation(), items, LogoutButton()

### Community 33 - "request-code/route.ts"
Cohesion: 0.36
Nodes (6): dynamic, requestSchema, runtime, codeHash(), createCheckinLoginCode(), verifyCheckinLoginCode()

### Community 34 - "members/page.tsx"
Cohesion: 0.43
Nodes (4): AdminMembersPage(), dynamic, escapeLike(), MembersSearch()

### Community 35 - "contact/page.tsx"
Cohesion: 0.38
Nodes (5): ContactPage(), revalidate, ContactForm(), SITE_SETTINGS_QUERY, SiteSettings

### Community 36 - "GalleryMarquee.tsx"
Cohesion: 0.43
Nodes (6): columns, GalleryMarquee(), mobileColumns, MosaicRow(), Row, Tile()

### Community 37 - "vercel.json"
Cohesion: 0.29
Nodes (6): maxDuration, framework, functions, app/api/paystack/webhook/route.ts, regions, $schema

### Community 38 - "CheckinOperatorManager"
Cohesion: 0.47
Nodes (5): CheckinOperatorManager(), addOperator(), load(), revoke(), Operator

### Community 39 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.3.0, eslint, eslint-config-next

### Community 40 - "@sanity/vision"
Cohesion: 0.20
Nodes (6): clsx@^2.1.1, next-auth@^4.24.15, @sanity/vision@^5.31.1, clsx, next-auth, @sanity/vision

### Community 41 - ".prettierrc.json"
Cohesion: 0.33
Nodes (5): plugins, printWidth, semi, singleQuote, trailingComma

### Community 42 - "remind/route.ts"
Cohesion: 0.50
Nodes (4): dynamic, lagosDate(), POST(), runtime

### Community 44 - "005_members.sql"
Cohesion: 0.60
Nodes (4): member_number_counters, members, members_status_idx, members_year_joined_idx

### Community 46 - "postgres"
Cohesion: 0.50
Nodes (3): postgres@^3.4.9, postgres, db

### Community 47 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 48 - "types/db.ts"
Cohesion: 0.50
Nodes (3): ContactSubmissionRow, DonationRow, RegistrationRow

## Knowledge Gaps
- **45 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `react`, `membership/route.ts`, `dashboard/page.tsx`, `migrate-gallery.mjs`, `register/route.ts`, `db`, `readJsonRequest`, `getAdminSession`, `queries.ts`, `dependencies`, `package.json`, `(site)/page.tsx`, `check-in/[slug]/page.tsx`, `verify/route.ts`, `engagement/page.tsx`, `Navbar.tsx`, `gallery/page.tsx`, `sanity.ts`, `leadership.ts`, `[memberId]/page.tsx`, `lucide-react`, `programs/page.tsx`, `admin-session.ts`, `(protected)/layout.tsx`, `request-code/route.ts`, `members/page.tsx`, `contact/page.tsx`, `GalleryMarquee.tsx`, `remind/route.ts`, `app/layout.tsx`, `success/page.tsx`, `admin/login/page.tsx`, `get-involved/page.tsx`, `card-preview/page.tsx`, `[[...tool]]/layout.tsx`, `next.config.ts`, `proxy.ts`?**
  _High betweenness centrality (0.307) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `membership/route.ts`, `dashboard/page.tsx`, `migrate-gallery.mjs`, `register/route.ts`, `db`, `dependencies`, `package.json`, `(site)/page.tsx`, `check-in/[slug]/page.tsx`, `engagement/page.tsx`, `Navbar.tsx`, `gallery/page.tsx`, `sanity.ts`, `next`, `leadership.ts`, `[memberId]/page.tsx`, `lucide-react`, `DonateForm.tsx`, `(protected)/layout.tsx`, `members/page.tsx`, `contact/page.tsx`, `GalleryMarquee.tsx`, `CheckinOperatorManager`, `success/page.tsx`, `admin/login/page.tsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Should `membership/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09155844155844156 - nodes in this community are weakly interconnected._
- **Why does `db` connect `db` to `membership/route.ts`, `dashboard/page.tsx`, `members/page.tsx`, `request-code/route.ts`, `register/route.ts`, `readJsonRequest`, `getAdminSession`, `migrate-gallery.mjs`, `remind/route.ts`, `check-in/[slug]/page.tsx`, `verify/route.ts`, `engagement/page.tsx`, `next`, `leadership.ts`, `[memberId]/page.tsx`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0861952861952862 - nodes in this community are weakly interconnected._
- **Should `migrate-gallery.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.05697278911564626 - nodes in this community are weakly interconnected._