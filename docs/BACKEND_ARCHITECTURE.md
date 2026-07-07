# Brilliant Tourism — Backend Architecture Plan

Status: **planning document only** — no backend code exists yet. This is the
structure to build against when that work starts; it is not a scaffold to
run.

## 1. Why this shape

The frontend (`src/data/*.json` + `src/data/*.js` loaders) already defines a
de facto schema: countries, cities, categories, offers, visa countries,
reviews, all with `{en, ru, uz}` translated fields. The backend's job is to
become the source of truth for that same shape — via a real database and
real endpoints — plus everything the static JSON never had to model:
accounts, bookings, payments, visa applications, and the B2B side implied by
the navbar's Client/Business `ModeSwitcher`.

Two customer types share one catalog:
- **B2C (client mode)** — an individual browsing tours/visas, booking for
  themselves or their family, leaving reviews.
- **B2B (business mode)** — a travel agency / corporate account booking on
  behalf of many travelers, at negotiated rates, needing invoicing and
  multi-seat management.

Both hit the same read APIs (catalog, search, filters) but diverge on
write APIs (booking, pricing, invoicing) — see §5.

## 2. Recommended stack

| Concern | Choice | Why |
|---|---|---|
| Runtime | Python 3.12 | per project decision |
| Framework | FastAPI | async-native, typed request/response models via Pydantic (mirrors the `{en,ru,uz}` jsonb shapes cleanly), and its auto-generated OpenAPI schema doubles as living API docs for §5 |
| Database | **Supabase** (managed Postgres 15) | per project decision — gets you Postgres, Auth, Storage, and Realtime as one managed platform instead of assembling each separately |
| DB access | SQLAlchemy 2.0 (async, via `asyncpg`) for the FastAPI app; **Supabase CLI** for schema migrations (plain SQL in `supabase/migrations/`) | Supabase's own migration workflow is SQL-first — keep the schema source of truth there, and have SQLAlchemy models mirror it for typed queries in FastAPI. Row Level Security (see §7) lives in the same SQL migrations |
| Auth | **Supabase Auth (GoTrue)** | issues the JWTs, handles email/password + refresh tokens out of the box; FastAPI just verifies the JWT on each request instead of owning the auth flow itself |
| Object storage | **Supabase Storage** | replaces `imageKey`/`imageUrl` placeholders with real uploaded photos behind Supabase's CDN; bucket-level policies mirror the RLS model already used for tables |
| Cache/queue | Redis + Celery | Supabase doesn't do background jobs — Redis as the broker, Celery workers for email sending and PDF invoice generation |
| API style | REST, versioned `/api/v1` | matches how the frontend already consumes data (plain JSON arrays/objects); GraphQL isn't justified yet |
| Payments | Stripe (or a local Uzbek gateway e.g. Payme/Click alongside it) | Stripe for international cards, Payme/Click for domestic UZS offers, given the site already prices domestic tours in UZS |
| Email | Postmark / SES | booking confirmations, visa status updates, business invoices |
| Deployment | FastAPI app on any Python-friendly host (Fly.io, Railway, a plain VM) + Supabase's managed Postgres/Auth/Storage; Docker Compose locally for the API + Redis (Supabase itself runs via `supabase start` locally, or against the hosted project) | Supabase already removes the DB/auth/storage ops burden — the only thing you deploy yourself is the FastAPI app and the Celery worker |

## 3. High-level architecture

```
┌─────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
│  React SPA       │◄────►│  API (FastAPI)        │◄────►│ Supabase              │
│  (this repo)      │ REST │  /api/v1/*            │      │ ├─ Postgres (schema,  │
└─────────────────┘      │                        │      │ │   RLS policies)     │
                          │  ┌──────────────────┐  │      │ ├─ Auth (GoTrue —     │
                          │  │ auth (JWT verify) │  │      │ │   issues JWTs)      │
                          │  │ catalog router    │  │      │ └─ Storage (photos)  │
                          │  │ bookings router   │  │      └──────────────────────┘
                          │  │ visas router      │  │
                          │  │ business router   │  │      ┌─────────────┐
                          │  │ reviews router    │  │◄────►│ Redis        │
                          │  │ admin router      │  │      │ (Celery      │
                          │  └──────────────────┘  │      │  broker)     │
                          └──────────────────────┘      └─────────────┘
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │ External: Stripe,     │
                          │ Payme/Click, Postmark │
                          └──────────────────────┘
```

Note the shift from the original all-custom design: Supabase owns
persistence, identity, and file storage; FastAPI owns business logic
(pricing resolution, booking rules, B2B scoping beyond what RLS expresses,
third-party integrations). Auth in particular is *not* something FastAPI
implements — it verifies tokens Supabase already issued.

## 4. Domain model

Field names mirror the frontend's existing JSON so the migration in §8 is a
near 1:1 mapping, not a redesign.

### 4.1 Catalog (read-mostly, same shape as `src/data/*.json`)

**Country**
`id, slug, iso, name (jsonb: en/ru/uz), region, description (jsonb), visaRequirement (enum: visa-free|eVisa|visa-required), bestSeason (jsonb), heroImageId → Media`

**City**
`id, slug, countryId → Country, name (jsonb), heroImageId → Media`

**Category** (domestic tourism categories)
`id, slug, name (jsonb), description (jsonb), heroImageId → Media`

**Offer** (a tour/package)
`id, slug, type (enum: domestic|international), countryId → Country (nullable), cityId → City (nullable), categoryId → Category (nullable), title (jsonb), description (jsonb), tags (string[]), durationDays, durationNights, basePrice, currency, travelLevel (enum: easy|moderate|adventure), isSpecialOffer, discountPercent, groupSizeMin, groupSizeMax, minAge, ratingCached, reviewCountCached, status (enum: draft|published|archived)`

**OfferImage**
`id, offerId → Offer, mediaId → Media, sortOrder`

**OfferPackage** (economy/standard/premium tiers — mirrors `buildPackages()`)
`id, offerId → Offer, tier (enum: economy|standard|premium), priceModifier (decimal), hotelCategory, transferType, supportLevel, extras (jsonb string[]), hasConcierge`

**OfferIncludedService**
`id, offerId → Offer, serviceKey (references a translated label set, same as `SERVICES` map in offers.js), sortOrder`

**OfferDeparture** (replaces the generated `buildDates()` — becomes real, book-able inventory)
`id, offerId → Offer, departureDate, status (enum: available|limited|soldout), capacityTotal, capacityBooked`

**VisaCountry**
`id, slug, iso, name (jsonb), region, visaTypeKey (enum: schengen|evisa|visaOnArrival|embassyVisa|sponsoredVisa), processingDaysMin, processingDaysMax, priceFrom, requirementKeys (string[])`

**VisaExtraService** (apostille, translation, etc.)
`id, key, priceFrom, icon`

**Media**
`id, storageKey, url, altText (jsonb), width, height` — this is the real backing store for what `imageKey`/`imageUrl` fake today.

### 4.2 Identity & accounts

Supabase Auth already owns `auth.users` (email, hashed password, email
verification, refresh tokens) — don't duplicate that. Extend it with a
`public.profiles` table keyed 1:1 on `auth.users.id`:

**Profile** (extends `auth.users`)
`userId → auth.users.id (PK/FK), phone, firstName, lastName, preferredLanguage (en|ru|uz), accountType (enum: individual|business_member), role (enum: client|business_admin|business_agent|staff|admin), businessAccountId → BusinessAccount (nullable), createdAt, lastLoginAt`

**BusinessAccount** (the B2B tenant — a partner agency or corporate client)
`id, companyName, legalName, taxId, billingAddress, country, tier (enum: standard|preferred|enterprise), commissionRatePercent, creditLimit, paymentTerms (enum: prepaid|net15|net30), status (enum: pending|active|suspended)`
- `businessAccount.tier` drives negotiated pricing (§4.4) and payment terms — this is the whole reason B2B can't just reuse the B2C booking flow unmodified.

**BusinessAgent** (a Profile with role=business_agent belongs to exactly one BusinessAccount; modeled via the `businessAccountId` FK above rather than a separate table)

### 4.3 Bookings & applications

**Booking**
`id, bookingRef (human-readable, e.g. BRL-2026-00123), offerId → Offer, packageTier, departureId → OfferDeparture, bookedByUserId → auth.users.id, businessAccountId → BusinessAccount (nullable — null for B2C), travelerCount, totalPrice, currency, status (enum: pending_payment|confirmed|cancelled|completed), source (enum: web_client|web_business|admin), createdAt`

**BookingTraveler** (per-seat detail — needed for both B2C families and B2B group bookings)
`id, bookingId → Booking, fullName, dateOfBirth, passportNumber, nationality`

**Payment**
`id, bookingId → Booking (nullable — visa applications pay too), provider (enum: stripe|payme|click|invoice), providerRef, amount, currency, status (enum: pending|succeeded|failed|refunded)`

**Invoice** (B2B only — net-terms accounts don't pay per-booking, they get billed)
`id, businessAccountId → BusinessAccount, periodStart, periodEnd, bookingIds (relation table), totalAmount, currency, status (enum: draft|sent|paid|overdue), dueDate, pdfMediaId → Media`

**VisaApplication** (the thing the "Start application" flow in VisaPage/CountryPage submits to)
`id, visaCountryId → VisaCountry, applicantUserId → auth.users.id, applicantName, applicantPhone, status (enum: submitted|documents_requested|in_process|approved|rejected), assignedStaffId → auth.users.id (nullable), notes, createdAt`

**Review**
`id, offerId → Offer, userId → auth.users.id, rating (1-5), comment (jsonb — or single-locale text + a language field, since real reviews arrive in one language, unlike the seeded `{en,ru,uz}` mock data), createdAt, status (enum: pending|published|hidden)`

### 4.4 Pricing — where B2C and B2B actually diverge

**RateOverride** (optional, only populated for negotiated B2B pricing)
`id, businessAccountId → BusinessAccount, offerId → Offer (nullable = applies account-wide), discountPercent OR fixedPrice, validFrom, validTo`

Effective price resolution order at booking time: `RateOverride` (if a
matching one exists for the account) → `BusinessAccount.commissionRatePercent`
applied as a rebate → public `Offer.basePrice` + `OfferPackage.priceModifier`.
This is the one piece of business logic that doesn't exist anywhere in the
current frontend and needs the most product input before implementation.

## 5. API surface

All under `/api/v1`. Auth via `Authorization: Bearer <jwt>` except where
marked public.

### Catalog (public, read-only — powers the existing pages 1:1)
```
GET  /countries                       ?region=
GET  /countries/:slug
GET  /countries/:slug/cities
GET  /cities/:slug
GET  /categories
GET  /categories/:slug
GET  /offers                          ?type=&countrySlug=&categorySlug=&tags=
                                       &priceMin=&priceMax=&durationBucket=
                                       &travelLevel=&season=&sort=&page=
GET  /offers/:slug
GET  /offers/:slug/departures
GET  /offers/:slug/reviews
GET  /visa-countries                  ?region=
GET  /visa-countries/:slug
GET  /visa-extra-services
GET  /search?q=                       (offers + countries combined, backs SearchOverlay)
```
This block is intentionally a near-exact match for `useFilteredOffers`'
filter keys (`countrySlug`, `categorySlug`, `tags`, `priceMin/Max`,
`durationBucket`, `travelLevel`, `season`) so the frontend's existing filter
state can be sent straight through as query params with no remapping.

### Auth
The frontend talks to **Supabase Auth directly** for the plain flows —
there's no reason to proxy something Supabase already does well:
```
supabase.auth.signUp(...)             (individual — accountType=individual, set via a post-signup profiles insert)
supabase.auth.signInWithPassword(...)
supabase.auth.refreshSession(...)
supabase.auth.signOut(...)
```
FastAPI only owns the flows that need work Supabase Auth alone can't do —
creating more than one row atomically:
```
POST /auth/register/business          (creates the auth.users row via the Supabase admin API, then BusinessAccount + first business_admin Profile, in one transaction)
GET  /auth/me                          (JWT → profiles row, incl. role/businessAccountId — the frontend can't get this from Supabase's session alone)
```

### B2C — bookings, visas, reviews (auth required, role=client)
```
POST   /bookings                      { offerSlug, packageTier, departureId, travelers[] }
GET    /bookings                      (own bookings)
GET    /bookings/:ref
POST   /bookings/:ref/cancel
POST   /visa-applications             { visaCountrySlug, applicantName, applicantPhone }
GET    /visa-applications             (own applications + status)
POST   /offers/:slug/reviews          { rating, comment }
```

### B2B — everything above, plus (auth required, role=business_admin|business_agent)
```
GET    /business/account                          (own BusinessAccount + tier/terms)
GET    /business/rates                             (effective negotiated prices)
POST   /business/bookings                          (bulk: multiple travelers/offers in one call)
GET    /business/bookings                          (all bookings under the account, not just the agent's own)
GET    /business/invoices
GET    /business/invoices/:id/pdf
POST   /business/agents                             (business_admin invites another agent)
DELETE /business/agents/:userId
```

### Admin/staff (role=admin|staff)
```
CRUD  /admin/offers, /admin/countries, /admin/cities, /admin/categories
CRUD  /admin/visa-countries
GET   /admin/visa-applications                       ?status=
PATCH /admin/visa-applications/:id                    (advance status, assign staff)
CRUD  /admin/business-accounts                        (approve, set tier/commission)
GET   /admin/bookings                                 (all bookings, ops view)
POST  /admin/media                                    (photo upload → Supabase Storage, returns Media)
```

## 6. Backend repo folder structure (Python/FastAPI + Supabase)

```
brilliant-tourism-api/
├── app/
│   ├── main.py                        (FastAPI() instance, router registration, startup/shutdown)
│   ├── core/
│   │   ├── config.py                   (pydantic-settings — env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY, DATABASE_URL, REDIS_URL, STRIPE_KEY, ...)
│   │   ├── security.py                 (verify Supabase JWT, extract claims)
│   │   ├── deps.py                     (FastAPI dependencies: get_current_user, require_role(), get_business_scope())
│   │   └── db.py                       (async SQLAlchemy engine/session against Supabase's Postgres connection string)
│   ├── models/                         (SQLAlchemy models — one file per domain area, mirroring §4)
│   │   ├── catalog.py                  (Country, City, Category, Offer, OfferPackage, OfferDeparture, Media)
│   │   ├── visas.py                    (VisaCountry, VisaExtraService, VisaApplication)
│   │   ├── accounts.py                 (Profile, BusinessAccount, RateOverride)
│   │   ├── bookings.py                 (Booking, BookingTraveler, Payment, Invoice)
│   │   └── reviews.py
│   ├── schemas/                        (Pydantic request/response models — these ARE the OpenAPI/§5 contract)
│   │   ├── catalog.py
│   │   ├── visas.py
│   │   ├── accounts.py
│   │   ├── bookings.py
│   │   └── reviews.py
│   ├── routers/
│   │   ├── catalog.py                  (countries, cities, categories, offers, search — public)
│   │   ├── visas.py
│   │   ├── reviews.py
│   │   ├── bookings.py
│   │   ├── business.py                 (business/account, /rates, /bookings, /invoices, /agents)
│   │   └── admin.py
│   ├── services/                       (business logic, framework-agnostic where possible)
│   │   ├── pricing.py                  (§4.4 rate resolution — isolated on purpose)
│   │   ├── booking_service.py
│   │   ├── visa_service.py
│   │   ├── media_service.py             (Supabase Storage upload/signed URLs)
│   │   └── notifications.py             (Celery task producers)
│   ├── integrations/
│   │   ├── supabase_client.py           (supabase-py client for Auth/Storage admin calls)
│   │   ├── stripe_client.py
│   │   └── local_gateway.py              (Payme/Click)
│   └── workers/
│       ├── celery_app.py
│       └── tasks.py                      (email sends, PDF invoice generation)
├── supabase/
│   ├── migrations/                      (SQL migrations — schema AND RLS policies live here, applied via `supabase db push`)
│   └── seed.sql                          (optional raw SQL seed; see §8 for the Python-script alternative)
├── scripts/
│   └── seed_from_frontend_json.py        (reads THIS repo's src/data/*.json — see §8)
├── tests/
│   ├── unit/
│   └── integration/
├── docker-compose.yml                    (api + redis + celery worker; Supabase itself is either the hosted project or `supabase start` locally)
├── .env.example
├── pyproject.toml
└── alembic.ini                           (only if you choose Alembic over raw Supabase SQL migrations — pick one, not both)
```

## 7. Auth & authorization model

- **Supabase Auth issues the tokens.** The frontend signs up/logs in
  against Supabase directly (via `supabase-js`, or through a thin FastAPI
  proxy endpoint if you'd rather the SPA never hold the Supabase anon key
  directly) and gets back a JWT. FastAPI never issues or refreshes tokens
  itself — `app/core/security.py` only verifies the JWT's signature
  against Supabase's JWKS and reads its claims.
- Roles: `client`, `business_admin`, `business_agent`, `staff`, `admin`,
  stored on `public.profiles.role` (not in the JWT itself, since Supabase's
  default claims don't know about this app's roles) — `deps.get_current_user`
  reads the JWT for `sub` (the user id), then loads the matching `profiles`
  row for role/businessAccountId.
- **Two enforcement layers, on purpose:**
  1. *Postgres Row Level Security policies* (in `supabase/migrations/`) —
     e.g. a `bookings` policy that only allows `select` where
     `business_account_id = auth.jwt_business_account_id()` or
     `booked_by_user_id = auth.uid()`. This is the backstop: even a bug in
     FastAPI's own checks can't leak another business account's bookings,
     because Postgres itself refuses the row.
  2. *FastAPI dependencies* (`require_role()`, `get_business_scope()`) —
     the ergonomic layer that returns clean 403s with a useful message
     before a query is even run, rather than relying solely on RLS silently
     returning zero rows.
- Same auth system serves both B2C and B2B — they're differentiated by
  `profiles.role` and `profiles.business_account_id`, not a separate login
  flow.

## 8. Migration path from the current static JSON

The existing `src/data/*.json` files become the seed data, not throwaway
mocks. Schema first, then data:

1. Write the schema as SQL migrations under `supabase/migrations/`
   (`supabase migration new create_catalog_tables`, etc.) covering every
   entity in §4, plus the RLS policies from §7 in the same migration files
   — Supabase treats schema and security policy as one applied unit, not
   two separate concerns.
2. `scripts/seed_from_frontend_json.py` reads `countries.json`,
   `visaCountries.json`, `categories.json`, `cities.json`,
   `visaExtraServices.json` from **this** repo (either via a relative path
   if the two repos are checked out side by side, or a copied snapshot) and
   inserts them via `supabase-py` (or a direct `asyncpg` connection) into
   Country/VisaCountry/Category/City/VisaExtraService. The `imageKey`/
   `imageUrl` fields are the script's cue to either upload the already-bundled
   photo to a Supabase Storage bucket and record the resulting `Media` row,
   or store the picsum placeholder URL directly in `Media.url` until real
   photography replaces it.
3. `offers.js`'s exported array (not the `.json` — this file still computes
   `packages`/`dates` via `buildPackages()`/`buildDates()`) becomes the seed
   source for Offer + OfferPackage + OfferDeparture: run it once with Node
   (or port the two helper functions to Python — they're a dozen lines
   each) to get the plain resolved objects, then insert those. The
   generation logic itself doesn't need a runtime home in the new backend,
   only the seed script needs it, once.
4. `reviews.js`'s `REVIEW_POOL` seeds a handful of Review rows per offer so
   the review UI has something to render before real reviews exist.
5. Once the API is live, the frontend's `src/data/*.js` loader files
   (`countries.js`, `offers.js`, etc.) are replaced with fetch calls to the
   matching endpoint — the rest of each page component (which only ever
   imports the default export of these loaders) needs no change, since the
   resolved shape stays the same.

## 9. Non-functional requirements

- **Rate limiting**: per-IP on `/search` and any FastAPI auth-proxy
  endpoints; per-account on `/business/bookings` (bulk endpoints are the
  likely abuse/mistake vector). Supabase Auth itself already rate-limits
  signup/login at the platform level.
- **Audit log**: every write to `VisaApplication.status`, `Booking.status`,
  and anything under `/admin/*` — ops will ask "who changed this" eventually.
  A Postgres trigger writing to an `audit_log` table (alongside the RLS
  policies in the same migrations) covers this even for writes that
  bypass FastAPI entirely (e.g. an admin editing data directly in the
  Supabase dashboard).
- **i18n**: `preferredLanguage` on `Profile` plus an `Accept-Language`
  fallback for anonymous requests, mirroring the frontend's own `en/ru/uz`
  detection.
- **Observability**: structured JSON logs from FastAPI (`structlog` or
  similar), request-id propagation, and a `/health` endpoint checking
  Postgres + Redis reachability. Supabase's own dashboard already covers
  DB-level metrics/logs, so this only needs to prove the FastAPI layer
  itself is up.

## 10. Suggested build order

1. Supabase schema migrations + RLS policies for the catalog tables, then
   the Python seed script (§8) + a read-only FastAPI catalog router —
   frontend can switch its data loaders over immediately, independent of
   everything else.
2. Wire up Supabase Auth (individual signup/login only) + the `profiles`
   table + FastAPI's JWT verification dependency.
3. Bookings (B2C) + Stripe.
4. Visa applications + admin status workflow.
5. Reviews.
6. Business accounts, agents, rate overrides, bulk booking (+ their RLS
   policies — this is where scoping bugs are most costly, so write the
   policies before the FastAPI routes that assume them).
7. Invoicing + local payment gateway (Payme/Click) + Celery for
   PDF/email generation.
8. Admin CRUD + Supabase Storage media upload, replacing the last static
   assets.

Each step ships something the current frontend can actually start consuming
— catalog first because every page already depends on it, B2B last because
it's the smallest, newest surface (the `ModeSwitcher`) and the most product
decisions (commission rates, credit terms) are still open.
