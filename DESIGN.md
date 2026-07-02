# Design System — Brilliant Tourism Agency

Brand name: **Brilliant**. Wordmark set in Cormorant Garamond, semibold,
used as plain text (no logomark needed for v1).

Single source of truth. Every color, typeface, spacing, and radius value used in
the codebase must trace back to a token defined here. Re-read this file before
starting any new page or component.

## 1. Concept

The brand's real material is the Silk Road: caravan trade routes threading
between cities, the turquoise-and-cobalt majolica tilework of Samarkand,
Bukhara and Khiva, and the literal duality this agency sells — **domestic
Uzbekistan routes vs. international routes radiating outward from it**. The
whole system is built from that, not from generic "travel agency" defaults.

**Signature element — The Route Line.** A hand-drawn-feeling dashed path,
rendered as an animated SVG (`stroke-dashoffset` reveal via Framer Motion's
`pathLength`), in one of two brand colors: turquoise for domestic routes, gold
for international routes. It draws once on load/scroll-into-view, not on a
loop. It appears in exactly four places so it stays a signature, not
wallpaper:
1. **Hero** — draws from an origin marker (Tashkent) to the destination photo medallion.
2. **Home "Two Routes" split section** — one path forks into a turquoise branch (Domestic) and a gold branch (International) from a shared origin node — this *is* the visual explanation of the site's duality.
3. **OfferCard hover** — a short dashed tick animates from a small origin dot to the price tag.
4. **Offer detail "Available Dates" row** — a route-line connector threads between date chips.

Component: `RouteLine` (`src/components/RouteLine/`), props `{ variant: 'domestic' | 'international' | 'fork', d, className }`. Respects `prefers-reduced-motion` by rendering the path fully drawn, no animation.

## 2. Self-critique against generic defaults

| Banned generic pattern | Why this system avoids it |
|---|---|
| Cream background + high-contrast serif + terracotta accent | Light neutral is a warm ivory plaster, not flat cream. Accent pair is gold+turquoise, not a single terracotta/orange. Display serif (Cormorant Garamond) is a refined high-contrast editorial serif used sparingly for headlines only — body copy is sans. |
| Near-black background + single neon/vermilion accent | Dark band base is a deep blue-black ink, not pure near-black. Two accents work together (gold leads, turquoise supports), not one neon pop. Light "plaster" sections are a primary mode, not a dark-only site. |
| Broadsheet layout: hairline rules, zero radius, dense newspaper columns | No hairline dividers — section transitions use an abstracted arch (iwan) silhouette, used only 2–3 times site-wide. Radius is generous (12–28px) everywhere. Destination grids are an asymmetric tessellated "mosaic" layout, not dense text columns. |

## 3. Color tokens

```scss
// Dark surfaces — deep night ink, gold-lit
$color-ink-950: #060f14; // deepest bg, near-black w/ blue undertone
$color-ink-900: #0a1820; // primary dark section bg
$color-ink-800: #11232c; // card/surface on dark sections
$color-ink-700: #1a323d; // elevated dark surface, CTA banner

// Light surfaces — warm ivory plaster, NOT flat cream
$color-plaster-50:  #faf7f0; // light section bg
$color-plaster-100: #f0e9d8; // card surface on light sections

// Brand accents — gold leads (premium), turquoise supports (lake/water)
$color-gold-600: #b8853a;
$color-gold-500: #d4a653; // primary CTA, signature route (international)
$color-gold-300: #f0d9a8; // hover/glow state

$color-turquoise-600: #1f7d76;
$color-turquoise-500: #2ba9a1; // secondary accent, signature route (domestic)
$color-turquoise-300: #8fe0d6; // hover/glow state

// Utility-only accent (discount badges, alerts)
$color-clay-500: #c1623f;

// Text
$color-white:     #ffffff; // headings on dark
$color-mist:      #c3cdd0; // body/secondary text on dark
$color-stone-600: #5c6b70; // body/secondary text on light
```

Shadows lean into the palette rather than flat black: `$shadow-gold-glow` and
`$shadow-turquoise-glow` add a soft tinted halo on premium hover states
(primary CTAs, featured cards), layered under the neutral `$shadow-card-hover`
for depth. Dark-section surfaces also have a `$glass-bg`/`$glass-border` pair
for frosted-glass card treatments over photography.

## 4. Typography

```scss
// Cormorant Garamond and Plus Jakarta Sans both ship full Cyrillic coverage
// (verified against Google Fonts) — RU headings/body never silently fall
// back to a generic system font.
$font-display: 'Cormorant Garamond', serif; // headlines only — wght 500/600/700, italic for accents
$font-body:    'Plus Jakarta Sans', sans-serif; // UI + body copy, wght 400-800
$font-mono:    'IBM Plex Mono', monospace; // prices, dates, route codes, tag pills — "itinerary" feel
```

Display scale: `clamp(2.75rem, 6vw, 4.5rem)` hero h1, weight 600, tight tracking (-0.01em). Body: 1rem / 1.65 line-height, weight 400–500. Mono is always small (0.75–0.85rem), used for price tags, duration, date chips, eyebrow labels — never for paragraphs. Cormorant Garamond's italic is used as a quiet accent on key phrases within a headline (not whole headlines), echoing the brand's editorial, hand-set feel.

Russian/Uzbek run longer than English: headline containers use `max-width` in `ch` units sized generously (not tight single-line assumptions), and nav links wrap to a second line on narrow viewports rather than truncating.

## 5. Spacing & radius

```scss
$space-3xs: 0.25rem; $space-2xs: 0.5rem; $space-xs: 0.75rem;
$space-sm: 1rem;     $space-md: 1.5rem;  $space-lg: 2.5rem;
$space-xl: 4rem;     $space-2xl: 6rem;   $space-3xl: 9rem;

$radius-sm: 12px;   // buttons, pills, chips
$radius-md: 20px;   // cards
$radius-lg: 28px;   // hero photo medallion, CTA banner, modals
$radius-pill: 999px;
```

Section vertical padding: `$space-3xl` desktop, `$space-xl` mobile.

## 6. Breakpoints

`respond($breakpoint)` mixin, same contract across the codebase:
mobile `<640px`, tablet `640–1024px`, desktop `>1024px`. Content max-width `1320px`.

## 7. Layout concept

**Every page hero is `min-height: 100vh`** — first impression always fills
the viewport, regardless of page type (catalog hub, detail page, or content
page). Photography is real location photography (`src/assets/pics`) where the
subject is Uzbekistan; international destinations keep curated stock.

**Home hero** — asymmetric, not a full-bleed photo. Headline lower-left, an
arch-topped ("iwan") photo medallion right, RouteLine threading between an
origin marker and the medallion.

**Destination/offer grids** — tessellated "mosaic" bento, varied module
sizes, generous radius on every tile, RouteLine tick on hover, not a uniform
3-up grid.

Dark/light section rhythm: Hero (ink-900/950) → Partners (plaster-50) →
content grids (plaster-50, white/plaster-100 card surfaces) →
storytelling/feature spotlight (ink-900) → CTA banner (ink-700, floating
rounded card on plaster-50) → Footer (ink-950, faint RouteLine along column
dividers).

## 8. Motion & interaction discipline

Boldness budget is spent on RouteLine as the signature, but the v2 pass adds
a consistent premium hover language everywhere else:
- Page transitions: fade + 12px upward shift, ~280ms — restrained on purpose.
- Scroll reveals: Framer Motion `whileInView`, fade+8px stagger, no flourish.
- Cards: lift + scale on hover, neutral shadow deepens, image scales slightly
  inside its frame; primary/featured cards add a soft gold-tinted glow ring.
- Buttons/links: gold underline or fill sweep, never a hard color swap.
- Navbar: transparent over hero → `plaster-50/92%` + blur on scroll, with a
  1px gold-at-15%-opacity bottom border.
- Custom scrollbar: thin gold thumb on ink track (WebKit + Firefox).
- All motion gated behind `prefers-reduced-motion: reduce`.
