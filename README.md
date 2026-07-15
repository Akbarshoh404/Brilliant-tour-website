# Brilliant Tourism

A travel agency website for **Brilliant Tourism**, a Tashkent-based agency
selling two kinds of trips from one catalog: **domestic tours across
Uzbekistan** (Silk Road cities, mountains, deserts) and **international
tours** to a curated set of destinations (UAE, France, Germany, South Korea,
Japan, and more). It also handles **visa services** and has a separate
**B2B partner portal** for travel agencies reselling Brilliant's inventory
under their own brand.

This repo is the frontend only — a static, JSON-driven React site. There is
no backend yet (see [Current state & limitations](#current-state--limitations)).

---

## Table of contents

- [What this site does](#what-this-site-does)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Design system](#design-system)
- [Internationalization](#internationalization)
- [Content & data](#content--data)
- [Current state & limitations](#current-state--limitations)
- [Deployment](#deployment)
- [Conventions](#conventions)

---

## What this site does

Brilliant's business has three customer-facing offers and one partner-facing
one:

1. **Domestic tours** (`/domestic`) — fully live. Browse by category
   (historical, mountain, desert, family, etc.), filter, view a tour's
   detail page, see a booking calendar.
2. **International tours** (`/international`) — **not live for booking
   yet**. The hub page and every country/tour tile is visible and browsable,
   but instead of a checkout flow it funnels visitors to a "Contact us and
   we'll book it by hand" call-to-action. This is a deliberate soft-launch
   state, not a bug — see [Current state](#current-state--limitations).
3. **Visa services** (`/visas`) — same soft-launch treatment as
   international: browsable country/requirement info, but applying routes to
   Contact rather than an online form.
4. **B2B partner portal** (`/business`) — a separate rate-sheet/inventory
   view for agencies reselling Brilliant's routes under their own brand
   (net rates, filters by hotel/board/transport, a lead-capture form).

`/business` is a fully separate page, not a mode toggle in the nav — an
earlier client/business `ModeSwitcher` control existed in the navbar but was
removed (its slot is now the theme toggle); the component file is still in
`src/components/ModeSwitcher/` but currently unused. `docs/BACKEND_ARCHITECTURE.md`
describes the planned B2C/B2B split at the API level regardless of how it's
surfaced in the nav.

## Features

**Browsing & discovery**
- Full-text destination search (⌘K / Ctrl+K), matching tours, cities, and
  countries as you type, with recent/popular search suggestions.
- Filterable, sortable tour grids (price, duration, season, travel style,
  hotel category, and more) with grid/list view toggle.
- A shared animated hero (`DestinationHero`) used across the domestic and
  international hubs — auto-advancing slideshow, manual arrow navigation,
  clickable preview cards.

**Booking & content**
- Tour detail pages with an image gallery/lightbox, package tier comparison
  (Economy/Standard/Premium), an availability calendar, reviews, and related
  tours.
- Visa requirement lookup by country (processing time, required documents,
  service pricing).

**Trust & conversion**
- Contact page with a real (client-side) contact form, direct
  phone/Telegram/Instagram channel cards, and office info.
- SEO: per-page `<title>`/meta descriptions, JSON-LD structured data
  (Organization, Website, Breadcrumb, TouristTrip, FAQ schemas), and an
  auto-generated `sitemap.xml` (see [Deployment](#deployment)).

**Personalization & accessibility**
- **Three languages** — English, Russian, Uzbek — fully translated,
  including all structured data and generated copy.
- **Light/dark theme** — a real theme system (not just `prefers-color-scheme`
  detection): a toggle in the navbar and mobile drawer, persisted to
  `localStorage`, with a no-flash inline script so the correct theme applies
  before first paint.
- Reduced-motion support throughout (every scroll/hover animation has a
  static fallback).
- A custom, theme-aware scrollbar (thin, translucent, macOS/iPadOS-style).

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 19, React Router 7 |
| Build | Vite 8 |
| Styling | Sass (CSS Modules per component) + CSS custom properties for theming |
| Animation | Framer Motion (page transitions, scroll reveals, drawer/dropdown motion), Lenis (smooth scroll), GSAP (parallax effects) |
| i18n | i18next + react-i18next + browser language detection |
| SEO | react-helmet-async for `<head>` management |
| Icons/flags | inline SVG throughout; `flag-icons` for country flags |
| Lint | ESLint (flat config), React Hooks + React Refresh plugins |

There is intentionally no state-management library, CSS-in-JS, or component
library — content is static JSON, styling is CSS Modules, and the little
shared UI state that exists (theme, search overlay open/closed) lives in two
small React Contexts.

## Getting started

```bash
npm install
npm run dev       # starts Vite on http://localhost:5173
```

Other scripts:

```bash
npm run build      # regenerates sitemap.xml, then builds to dist/
npm run preview    # serves the production build locally
npm run lint        # ESLint over the whole repo
npm run sitemap     # regenerate public/sitemap.xml on its own
```

No environment variables are required for local development. `VITE_SITE_URL`
can be set to override the domain used in the generated sitemap (defaults to
`https://brillianttour.uz`).

## Project structure

```
src/
  app/            # App shell: routes.jsx (route table), App.jsx, ScrollToTop, PageLoader
  pages/          # One folder per route — Home, DomesticHub, InternationalHub,
                   CountryPage, CityPage, DomesticCategoryPage, OfferDetail,
                   VisaPage, About, Contact, Business
  components/     # Shared, reusable UI — Navbar, Footer, DestinationHero,
                   OfferCard, FilterDrawer, SearchOverlay, ThemeToggle,
                   LanguageSwitcher, BookingCalendar, RouteLine, etc.
  context/        # ThemeContext, SearchOverlayContext
  data/           # Static content: countries.json, cities.json, offers.js,
                   visaCountries.json, categories.json, reviews.js — the
                   de facto schema a future backend would replace
  i18n/locales/   # en/, ru/, uz/ translation.json files
  styles/         # _variables.scss (design tokens), _mixins.scss,
                   _catalog.scss (shared page-section placeholders), global.scss
  utils/          # structuredData.js (JSON-LD), getLocalizedField, formatPrice, etc.
  hooks/          # useLenis, useDebounce, useFilteredOffers, useScrollDirection, ...
scripts/
  generate-sitemap.mjs   # reads src/data/*.json, writes public/sitemap.xml
docs/
  BACKEND_ARCHITECTURE.md   # planning doc for the backend that doesn't exist yet
DESIGN.md          # an earlier design-token spec — superseded by the
                    # "Design system" section below, kept for history
```

Each page/component owns its own `*.module.scss` file next to the `.jsx` —
there's no global stylesheet for page-specific styling, only the shared
tokens/mixins/placeholders in `src/styles/`.

## Design system

The visual language is a **black-and-white premium look** (Nike-style
restraint) with **one accent color** — an electric gold-lime — used
sparingly for CTAs, badges, and active states, plus a secondary turquoise
used only to distinguish domestic vs. international route lines.

### Color tokens (`src/styles/_variables.scss`)

```scss
// Dark surfaces
$color-ink-950: #080808;  $color-ink-900: #111111;
$color-ink-800: #1c1c1c;  $color-ink-700: #272727;

// Light surfaces
$color-plaster-50: #f5f5f5;  $color-plaster-100: #e0e0e0;

// Brand accent
$color-gold-500: #c6ff34;  // primary CTA / accent
$color-gold-600: #95bf27;  // hover/dark variant
$color-gold-300: #ddff85;  // light accent on dark surfaces

// Secondary — domestic vs. international route distinction only
$color-turquoise-500: #1a93b8;
```

### Dark mode

Dark mode is a **real toggle**, not just a media-query — implemented via CSS
custom properties defined in `global.scss`, switched by a `data-theme`
attribute on `<html>` (see `src/context/ThemeContext.jsx`):

```scss
:root                       { --surface-page: #fff; --text-primary: #111; ... }
:root[data-theme='dark']    { --surface-page: #1c1c1e; --text-primary: #f5f5f7; ... }
```

The dark palette is deliberately **Apple's neutral system-gray scale**
(`#1C1C1E` → `#2C2C2E` → `#3A3A3C`), not a tinted near-black — a tinted dark
color was tried and reverted because it clashed with the gold-lime accent.
Sections that are *intentionally* always-dark regardless of theme (the
footer, stat bands, the international/visa "Coming Soon" panels) use the
literal `$color-ink-*` tokens instead of the theme variables, since they're
correct in both themes already.

### Typography

```scss
$font-monr:    'Unbounded', ...   // headings, big display type — bold, geometric
$font-body:    'Plus Jakarta Sans', sans-serif  // UI + body copy
$font-mono:    'IBM Plex Mono', monospace       // prices, dates, eyebrow labels, badges
$font-display: 'Cormorant Garamond', serif      // used sparingly as an editorial accent
```

`Unbounded` covers Cyrillic + Latin, so it's the workhorse heading font
across all three locales; `Cormorant Garamond`/`Milker`/`Citadel` (the
custom display fonts) are Latin-only and used only where a locale-specific
fallback is acceptable (hero wordmark, a few English-only accents).

### Spacing, radius, breakpoints

```scss
$space-3xs … $space-3xl   // 0.25rem → 9rem, an 11-step scale
$radius-sm: 8px;  $radius-md: 14px;  $radius-lg: 22px;  $radius-pill: 999px;
```

Breakpoints via the `respond()` mixin: `mobile` (≤640px), `below-desktop`
(≤1024px), otherwise desktop. Content max-width is `1320px`.

### Motion

- Page transitions: fade + 12px vertical shift, ~280ms.
- Scroll reveals: Framer Motion `whileInView`, fade + 8–24px stagger.
- Cards: lift + shadow deepen on hover; images scale slightly inside their
  frame.
- Every animation respects `prefers-reduced-motion: reduce` (global CSS
  override collapses all durations to ~0).

### Recurring UI patterns

- **"Coming Soon" badge** — a small gold pill (`%catalogComingSoonTag` /
  `%catalogFullContactTag` in `_catalog.scss`) used anywhere international
  content is shown but not yet bookable.
- **Stamp/dot-grid motif** — a faint dotted graph-paper texture
  (`$grid-line` token) behind the Visas/About/Contact hero sections and the
  Contact page's office card, evoking a passport-stamp/paperwork feel that
  matches those pages' subject matter.
- **Bento grids** — equal-sized glass/dark tiles (About's stats section) for
  numeric callouts, in the Apple marketing-page style.
- **Floating-label form fields** — Contact page's form uses a pure-CSS
  floating label (`:placeholder-shown` + a non-empty `placeholder=" "`), no
  JS state needed.

## Internationalization

Three locales — `en`, `ru`, `uz` — live in `src/i18n/locales/*/translation.json`
with **identical key structure** across all three files. Every user-facing
string, including SEO/structured-data copy, goes through `t()`; there is no
hardcoded English left in components. `react-i18next-browser-languagedetector`
picks the initial language from the browser; `LanguageSwitcher` lets users
override and persists the choice.

When adding a new string, add the key to **all three** locale files in the
same place — nothing enforces this automatically, so a missing key silently
falls back to the key name.

## Content & data

All content — countries, cities, categories, tours/offers, visa country
requirements, reviews, home-page featured destinations — is static JSON/JS
under `src/data/`, each entry shaped with `{ en, ru, uz }` translated fields
where relevant. This is a **deliberate de facto schema**: `docs/BACKEND_ARCHITECTURE.md`
describes the planned FastAPI + Supabase backend that would eventually
replace these files with real API calls, without changing the shape
components already expect.

Nothing here is hooked up to a real submission endpoint yet — the contact
form, business lead form, and visa "apply" flows all just show a client-side
success state (see below).

## Current state & limitations

This is a frontend-only, content-complete site with **no backend and no
payment processing**. Concretely, right now:

- **Domestic tours** are the only fully "live" booking surface, and even
  that is a demo — the "Book Now" button has no real checkout behind it.
- **International tours and visa services are deliberately soft-launched**:
  fully browsable, but every "book"/"apply" action routes to the Contact
  page or a phone/Telegram link instead of a real flow. This was a
  product decision (see conversation history / commit messages), not an
  oversight — don't "fix" it by wiring up fake checkout forms.
- **All forms are client-side only.** Contact, business lead capture, and
  newsletter signup show a success message but don't send anything anywhere.
- **No authentication, no user accounts, no real search backend** — search
  is an in-memory filter over the static JSON.
- **Images** are a mix of real Uzbekistan photography (`src/assets/pics/`)
  and Picsum/pravatar placeholders for international destinations, team
  avatars, and map images where a licensed photo wasn't available.

None of this needs to block frontend work — just don't assume a button
"does" anything beyond what's visibly implemented, and check
`docs/BACKEND_ARCHITECTURE.md` before building anything that looks like it
needs a real API.

## Deployment

`npm run build` runs `scripts/generate-sitemap.mjs` first (via the `prebuild`
hook), which reads `src/data/*.json` directly (not through Vite's module
graph, since it runs under plain Node) and writes `public/sitemap.xml` with
every static and dynamic route — **except** the international/visa
detail routes, which are deliberately excluded while those sections are
soft-launched (see above), so search engines aren't pointed at pages with no
real booking flow behind them.

The build output in `dist/` is a static site — any static host (Vercel,
Netlify, S3+CloudFront, etc.) works with no server-side requirements.

## Conventions

- **No CSS-in-JS, no Tailwind** — every component has a co-located
  `*.module.scss`. Reach for `_variables.scss` tokens and `_mixins.scss`
  helpers before writing a new raw value.
- **Shared page-section CSS lives in `_catalog.scss`** as `%placeholder`
  selectors (`@extend`ed, not mixins) — the catalog-style pages
  (International/Domestic hubs, Country/City pages) all share hero,
  section-inner, and results-grid layout this way instead of duplicating it
  seven times.
- **Comments are rare and intentional** — they explain *why* something
  non-obvious is done a certain way (e.g. "why this uses `~` instead of `+`"),
  not what the code already says.
- **No premature abstraction** — three similar lines beat a speculative
  shared component; components get extracted when a second real use case
  shows up, not before.
