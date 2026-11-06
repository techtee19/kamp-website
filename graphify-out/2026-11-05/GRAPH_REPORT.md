# Graph Report - kamp-website  (2026-11-05)

## Corpus Check
- 339 files · ~76,656 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .ico 3, (none) 2, .example 1)

## Summary
- 886 nodes · 1988 edges · 69 communities (38 shown, 31 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5e458aeb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Event Check-in APIs
- Admin Event Screens
- Admin Data and Analytics APIs
- Dashboard Analytics
- Sanity Content and Migrations
- Sanity Event Webhooks
- Sanity Studio Configuration
- Gallery Pages and Albums
- Formatting Dependencies
- Homepage Sections
- Application Dependencies
- TypeScript Configuration
- Event Registration Flow
- Leadership Invitations
- Request Validation Schemas
- About and Contact Pages
- Member Engagement Campaigns
- Site Navigation and Footer
- Donations and Membership Routes
- Events Listing and Cards
- Brand Asset Tooling
- Institution Search
- Donation Form
- Project Scripts
- WhatsApp Community Join
- Membership Registration Form
- Programs
- Admin Access Shell
- Member Administration
- Root Layout and Metadata
- Leadership Invite Registration
- Gallery Marquee
- Vercel Configuration
- Sanity Studio Layout
- Lint Configuration
- Prettier Configuration
- Project Tooling
- Database Row Types
- Dashboard Loading State
- Page Loading Skeletons
- Request Proxy
- Package Tooling
- Package Tooling
- Package Tooling
- Package Tooling
- Package Tooling
- Package Tooling
- Package Tooling
- Package Tooling
- Package Tooling
- Package Tooling
- PostCSS Configuration

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
- `EventCardProps` --references--> `EventDocument`  [EXTRACTED]
  components/events/EventCard.tsx → types/sanity.ts
- `POST()` --calls--> `getSiteOrigin()`  [EXTRACTED]
  app/admin/api/events/checkin/operators/route.ts → lib/community.ts
- `POST()` --calls--> `sendEventCheckinAccessInvitation()`  [EXTRACTED]
  app/admin/api/events/checkin/operators/route.ts → lib/email.ts
- `POST()` --calls--> `quoteEventTableName()`  [EXTRACTED]
  app/admin/api/events/checkin/route.ts → lib/admin-data.ts
- `POST()` --calls--> `quoteEventTableName()`  [EXTRACTED]
  app/admin/api/events/checkin/scan/route.ts → lib/admin-data.ts

## Import Cycles
- None detected.

## Communities (69 total, 31 thin omitted)

### Community 0 - "Event Check-in APIs"
Cohesion: 0.05
Nodes (97): createSchema, DELETE(), dynamic, eventSlugSchema, GET(), POST(), revokeSchema, runtime (+89 more)

### Community 1 - "Admin Event Screens"
Cohesion: 0.06
Nodes (35): dynamic, GET(), runtime, AdminLoginPage(), dynamic, EventCheckinPage(), AdminEventRegistrationsPage(), dynamic (+27 more)

### Community 2 - "Admin Data and Analytics APIs"
Cohesion: 0.09
Nodes (48): campaignCounts(), dynamic, POST(), runtime, dynamic, POST(), runtime, dynamic (+40 more)

### Community 3 - "Dashboard Analytics"
Cohesion: 0.08
Nodes (49): AdminDashboardPage(), AnalyticsDirectoryLoading(), AnalyticsPanelLoading(), DashboardAnalytics(), DashboardOverview(), dynamic, EventRegistrationsLoading(), EventRegistrationsOverview() (+41 more)

### Community 4 - "Sanity Content and Migrations"
Cohesion: 0.06
Nodes (38): files, migrate(), KampEvent, kampEvents, emerge2025, featuredPhotos, GALLERY_IMAGE_DIR, KampGalleryAlbum (+30 more)

### Community 5 - "Sanity Event Webhooks"
Cohesion: 0.07
Nodes (31): POST(), runtime, POST(), runtime, EventSnapshot, EventWebhookPayload, POST(), runtime (+23 more)

### Community 6 - "Sanity Studio Configuration"
Cohesion: 0.09
Nodes (17): dynamic, sanity@^5.31.1, sanity, apiVersion, dataset, projectId, builder, plugins (+9 more)

### Community 7 - "Gallery Pages and Albums"
Cohesion: 0.14
Nodes (18): GalleryIntro(), GalleryPage(), revalidate, GalleryAlbum(), GalleryAlbumProps, slots, GalleryAlbums(), GalleryAlbumsProps (+10 more)

### Community 8 - "Formatting Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, prettier@^3.9.6, prettier-plugin-tailwindcss@^0.8.1, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/qrcode@^1.5.6, @types/react@^19 (+14 more)

### Community 9 - "Homepage Sections"
Cohesion: 0.13
Nodes (16): actions, fallbackStats, HomePage(), partners, revalidate, GetInvolvedTabs(), tabs, HeroImageRotator() (+8 more)

### Community 10 - "Application Dependencies"
Cohesion: 0.10
Nodes (21): dependencies, clsx@^2.1.1, next@16.3.0, next-auth@^4.24.15, react@19.2.8, react-dom@19.2.8, @react-email/components@^1.0.12, react-icons@^5.7.0 (+13 more)

### Community 11 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 12 - "Event Registration Flow"
Cohesion: 0.16
Nodes (14): descriptionComponents, EventDetailPage(), formatDate(), formatTime(), revalidate, RegistrationForm(), RegistrationFormProps, studyLevels (+6 more)

### Community 13 - "Leadership Invitations"
Cohesion: 0.16
Nodes (11): dynamic, InvitationError, invitationSchema, runtime, dynamic, LeadershipInvitationsPage(), CreatedInvite, CreateLeadershipInvite() (+3 more)

### Community 14 - "Request Validation Schemas"
Cohesion: 0.14
Nodes (16): membershipFieldLabels, studyLevels, ContactInput, contactSchema, DonationInput, donationSchema, guestRegistrationSchema, KAMP_POSITIONS (+8 more)

### Community 15 - "About and Contact Pages"
Cohesion: 0.15
Nodes (14): AboutPage(), FounderCard, revalidate, TeamCard, values, ContactPage(), revalidate, ContactForm() (+6 more)

### Community 16 - "Member Engagement Campaigns"
Cohesion: 0.21
Nodes (11): dynamic, filters, formatDate(), MemberEngagementPage(), safePage(), CommunityEmailCampaign(), prepare(), send() (+3 more)

### Community 17 - "Site Navigation and Footer"
Cohesion: 0.19
Nodes (9): SiteLayout(), Footer(), links, DropdownName, exploreLinks, involvedLinks, Navbar(), primaryLinks (+1 more)

### Community 18 - "Donations and Membership Routes"
Cohesion: 0.16
Nodes (6): DonationReference(), DonateSuccessPage(), pathways, metadata, lucide-react@^1.28.0, lucide-react

### Community 19 - "Events Listing and Cards"
Cohesion: 0.22
Nodes (10): EventCard(), EventsPage(), formatEventDate(), revalidate, EventCardProps, FeaturedEventsCarousel(), formatEventDate(), PAST_EVENTS_QUERY (+2 more)

### Community 20 - "Brand Asset Tooling"
Cohesion: 0.18
Nodes (9): BG, chip(), emblem(), flame(), fs, path, sharp, SRC (+1 more)

### Community 21 - "Institution Search"
Cohesion: 0.24
Nodes (7): GET(), normalize(), InstitutionComboboxProps, TYPE_STYLES, INSTITUTION_NAMES, NIGERIAN_INSTITUTIONS, NigerianInstitution

### Community 22 - "Donation Form"
Cohesion: 0.24
Nodes (8): amounts, AmountSelector(), AmountSelectorProps, DonateForm(), DONATION_TYPE, Frequency, PaymentMethod, paymentMethods

### Community 23 - "Project Scripts"
Cohesion: 0.20
Nodes (10): scripts, admin:hash-password, build, db:check, db:migrate, dev, lint, migrate:events (+2 more)

### Community 24 - "WhatsApp Community Join"
Cohesion: 0.36
Nodes (6): CommunityJoinPage(), metadata, getHashToken(), getServerHashToken(), subscribeToHashChange(), WhatsAppJoinAction()

### Community 25 - "Membership Registration Form"
Cohesion: 0.25
Nodes (6): benefits, MembershipPage(), metadata, inputClass(), MembershipForm(), InstitutionCombobox()

### Community 26 - "Programs"
Cohesion: 0.22
Nodes (7): executiveRoles, focusAreas, journey, ProgramCard, revalidate, PROGRAMS_QUERY, ProgramDocument

### Community 27 - "Admin Access Shell"
Cohesion: 0.39
Nodes (4): ProtectedAdminLayout(), AdminNavigation(), items, LogoutButton()

### Community 28 - "Member Administration"
Cohesion: 0.43
Nodes (4): AdminMembersPage(), dynamic, escapeLike(), MembersSearch()

### Community 29 - "Root Layout and Metadata"
Cohesion: 0.29
Nodes (4): metadata, urbanist, @vercel/analytics@^2.0.1, @vercel/analytics

### Community 30 - "Leadership Invite Registration"
Cohesion: 0.38
Nodes (5): dynamic, LeadershipInvitationPage(), metadata, Invitation, LeadershipInviteRegistration()

### Community 31 - "Gallery Marquee"
Cohesion: 0.43
Nodes (6): columns, GalleryMarquee(), mobileColumns, MosaicRow(), Row, Tile()

### Community 32 - "Vercel Configuration"
Cohesion: 0.29
Nodes (6): maxDuration, framework, functions, app/api/paystack/webhook/route.ts, regions, $schema

### Community 33 - "Sanity Studio Layout"
Cohesion: 0.27
Nodes (3): metadata, csp, nextConfig

### Community 34 - "Lint Configuration"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.3.0, eslint, eslint-config-next

### Community 35 - "Prettier Configuration"
Cohesion: 0.33
Nodes (5): plugins, printWidth, semi, singleQuote, trailingComma

### Community 36 - "Project Tooling"
Cohesion: 0.50
Nodes (3): postgres@^3.4.9, postgres, db

### Community 37 - "Database Row Types"
Cohesion: 0.50
Nodes (3): ContactSubmissionRow, DonationRow, RegistrationRow

## Knowledge Gaps
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Event Check-in APIs` to `Admin Event Screens`, `Admin Data and Analytics APIs`, `Dashboard Analytics`, `Sanity Content and Migrations`, `Sanity Event Webhooks`, `Gallery Pages and Albums`, `Formatting Dependencies`, `Homepage Sections`, `Application Dependencies`, `Event Registration Flow`, `Leadership Invitations`, `About and Contact Pages`, `Member Engagement Campaigns`, `Site Navigation and Footer`, `Donations and Membership Routes`, `Events Listing and Cards`, `Institution Search`, `WhatsApp Community Join`, `Membership Registration Form`, `Programs`, `Admin Access Shell`, `Member Administration`, `Root Layout and Metadata`, `Leadership Invite Registration`, `Gallery Marquee`, `Sanity Studio Layout`, `Request Proxy`?**
  _High betweenness centrality (0.351) - this node is a cross-community bridge._
- **Should `Event Check-in APIs` be split into smaller, more focused modules?**
  _Cohesion score 0.05175909361955874 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Admin Event Screens` to `Admin Data and Analytics APIs`, `Dashboard Analytics`, `Sanity Content and Migrations`, `Sanity Event Webhooks`, `Gallery Pages and Albums`, `Formatting Dependencies`, `Homepage Sections`, `Application Dependencies`, `Event Registration Flow`, `Leadership Invitations`, `Request Validation Schemas`, `About and Contact Pages`, `Member Engagement Campaigns`, `Site Navigation and Footer`, `Donations and Membership Routes`, `Events Listing and Cards`, `Institution Search`, `Donation Form`, `WhatsApp Community Join`, `Admin Access Shell`, `Member Administration`, `Leadership Invite Registration`, `Gallery Marquee`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Should `Admin Event Screens` be split into smaller, more focused modules?**
  _Cohesion score 0.05573770491803279 - nodes in this community are weakly interconnected._
- **Why does `db` connect `Event Check-in APIs` to `Admin Event Screens`, `Admin Data and Analytics APIs`, `Dashboard Analytics`, `Sanity Content and Migrations`, `Sanity Event Webhooks`, `Leadership Invitations`, `Member Engagement Campaigns`, `Member Administration`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Should `Admin Data and Analytics APIs` be split into smaller, more focused modules?**
  _Cohesion score 0.0853302162478083 - nodes in this community are weakly interconnected._
- **Should `Dashboard Analytics` be split into smaller, more focused modules?**
  _Cohesion score 0.07948568088836938 - nodes in this community are weakly interconnected._