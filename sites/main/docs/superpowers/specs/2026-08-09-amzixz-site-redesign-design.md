# AmziXz site redesign — design

**Date:** 2026-08-09
**Status:** Approved for planning

## Context

`amzixz.github.io` is a static, dependency-free site on GitHub Pages. It is
well built — design tokens, self-hosted fonts, skip links, reduced-motion
handling, and full EN/LV parity across six pages each. It is not a rescue job.

Two things have outgrown it:

1. **The visual identity matches nothing the owner owns.** The site is cream and
   teal. The AmziXz logo is a purple-to-blue gradient. Blue Eye Energy is blue,
   black, and white. Catch The Baltic is pure white. The current palette is the
   odd one out.
2. **The content is out of date.** The site says "Three things. Two of them
   involve cars." There is now a company (Blue Eye Energy), Catch The Baltic is
   an organisation rather than just an event, and there is a pipeline of planned
   ventures. Sponsors, partners, and creator friends need somewhere to live.

## Goals

- **Look more impressive** — a full redesign, dark-first, built from the owner's
  own brand colours.
- **Get found** — sitemap, robots, and structured data, especially for the event.
- **Faster and more solid** — remove a render-blocking round-trip, lazy-load
  third-party embeds, eliminate layout shift.
- **Extensible** — adding a sponsor, partner, creator friend, or new venture must
  mean copying one block, not restructuring a page.

## Non-goals

- **No build step.** The site stays hand-edited HTML served directly by Pages.
  Maintainability through templating was explicitly deprioritised by the owner.
- **No URL changes.** Every `.html` filename stays as-is so no existing link
  breaks.
- **No photography dependency.** The design must look finished with zero photos.
  Image slots exist so photos improve it later without a redesign.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Design direction | Editorial typography (TRIONN/VALERAN) on a structured grid (amp.) | Owner wants professional, mixed-style, extensible. Type-led needs no photography and stays fast. |
| Palette | Purple → blue gradient, dark and light modes | Taken from the owner's own logo; sits with Blue Eye Energy (blue/black/white) and Catch The Baltic (white). |
| Display face | Space Grotesk only — **drop Fraunces** | Removes two woff2 files from every page load. One confident voice. |
| Micro-labels | System monospace stack | Zero bytes. Makes the `[ 01 ]` / `[ EN ] [ LV ]` bracket motif read as deliberate. |
| Colour modes | Both, with a manual toggle | Owner asked for light mode. Toggle mirrors the existing language-switch pattern. |
| Blue Eye Energy funding | State that it is raising; **no figure** | A hard number next to a Buy Me a Coffee button reads as need rather than opportunity, and dates fast. |
| Planned ventures | Shown with honest `PLANNED` status | Listing unlaunched companies as real would misrepresent. Visible ambition with integrity is the stronger pitch. |

## Visual system

### Dark palette (the hero design)

```
--bg          #0B0A0F   near-black, violet cast (pure #000 crushes the gradient)
--surface     #131119
--surface-2   #1A1722
--border      #262233
--ink         #F5F3F7   pure #FFF vibrates on black
--muted       #9A93AD
--purple      #8B5CF6
--blue        #3B82F6
--live        #34D399
--gradient    linear-gradient(135deg, #8B5CF6, #3B82F6)
```

### Light palette

```
--bg          #FAFAFC
--surface     #FFFFFF
--surface-2   #F4F3F8
--border      #E5E3EC
--ink         #14121A
--muted       #5C5670
--purple      #7C3AED   darkened for contrast on light
--blue        #2563EB
--live        #059669
--gradient    linear-gradient(135deg, #7C3AED, #2563EB)
```

### Contrast

Measured contrast ratios against their own backgrounds:

| Pair | Ratio | WCAG AA |
|---|---|---|
| `--muted` #9A93AD on dark #0B0A0F | 6.74:1 | Pass |
| `--muted` #5C5670 on light #FAFAFC | 6.66:1 | Pass |
| `--purple` #8B5CF6 on dark #0B0A0F | 4.66:1 | Pass, but tight |
| `--purple` #7C3AED on light #FAFAFC | 5.46:1 | Pass |

**Hard rule:** the gradient and raw brand purple are used for large type,
borders, glows, and accents — never for small body text. Purple clears AA by a
margin too thin to spend on 14–16px paragraphs. This mirrors how TRIONN uses its
orange: an edge light, not a paragraph colour.

All remaining pairs must be verified during implementation, not assumed.

### Typography

- **Space Grotesk** for display and body, already self-hosted (latin +
  latin-ext; latin-ext carries Latvian diacritics and must be kept).
- **System mono** (`ui-monospace, "Cascadia Mono", Consolas, monospace`) for
  eyebrows, section indices, status pills, and the bracket motif.
- Display headings set large with tight leading (~1.05) and slight negative
  tracking. Body stays at the current 1.6 line-height.
- `text-wrap: balance` on headings and `pretty` on paragraphs — already present,
  retained.

### Signature details

Hairline rules; bracket-wrapped labels (`[ EN ] [ LV ]`, `[ CONTACT ]`);
`[ 01 ] [ 02 ] [ 03 ]` section indices; meta cards anchored to corners rather
than centred; a low-opacity grain overlay; the gradient used as a rim-light on
card edges and section boundaries.

Grain and glow are reduced in light mode, where they read as dirt rather than
atmosphere.

### Motion

Retain the existing token set (`--ease-out`, `--ease-in-out`, `--dur-press`,
`--dur-hover`, `--dur-enter`) and the existing rules: UI transitions under
~300ms, hover effects gated behind
`@media (hover: hover) and (pointer: fine)`, and a `prefers-reduced-motion`
block that removes movement while keeping opacity and colour.

## Theme and language switching

A theme toggle sits beside the language switch in the header.

- **First visit:** follow `prefers-color-scheme`. An explicit OS-level light
  preference is never overridden.
- **After a click:** the choice is persisted and wins on every later visit.
- **Implementation:** `assets/theme.js`, mirroring `assets/lang.js`. Loaded
  synchronously in `<head>` — deferred would let the wrong theme paint first and
  flash.
- **Mechanism:** a `data-theme` attribute on `<html>`. CSS defines the light
  palette on bare `:root`, redefines it under
  `@media (prefers-color-scheme: dark)` guarded as `:root:not([data-theme="light"])`,
  and again under `:root[data-theme="dark"]` so the toggle wins in both
  directions.
- **Without JavaScript:** the toggle is inert but the system preference still
  applies, so both palettes remain reachable.
- The two `theme-color` meta tags stay and are updated to the new palettes.

## Information architecture

Header nav: **Work · Ventures · About · Contact**, plus the language switch and
theme toggle.

| Page | File | Change |
|---|---|---|
| Home | `index.html` | Rebuilt: hero, what I do, ventures strip, partners & friends, socials, latest |
| Work | `projects.html` | Presented as "Work". Filename unchanged. Content channels. |
| Ventures | `ventures.html` | **New.** Blue Eye Energy, Catch The Baltic, planned ventures |
| Catch The Baltic | `catch-the-baltic.html` | Restyled, kept as the full event page |
| About | `about.html` | Restyled, content rewritten |
| Contact | `contact.html` | Restyled |
| Uses | `uses.html` | Restyled |
| Not found | `404.html` | Restyled |

`ventures.html` needs an `lv/ventures.html` counterpart with the `hreflang` pair
in both directions, per the existing convention. It is added to both the header
and footer nav on every page.

## Components

### New

**`venture-card`** — brand plate, name, one-line description, status pill, link.
Status values are `LIVE`, `BUILDING`, `PLANNED`, reusing the existing
`card-status` dot pattern.

```
[ LIVE ]      Catch The Baltic   organisation and events, Riga
[ BUILDING ]  Blue Eye Energy    energy drink, co-owner
[ PLANNED ]   Tuning parts shop
[ PLANNED ]   Reengineered classic parts
[ PLANNED ]   Logistics and sourcing
```

**`partner-grid`** — logo tiles for sponsors and partners. Replaces the current
plain text `partner-list` on the event page once logo files exist; the text list
remains the fallback for partners with no logo.

**`friends-grid`** — creator friends: avatar, handle, platform, link.

All three extend by copying one block and changing its contents.

### Brand plates

The owner's logo assets are JPEG and PNG only. A white-background JPEG placed on
a dark page shows a white box, which looks broken.

`.brand-plate` resolves this:

- `.brand-plate--light` — rounded white tile, for logos that carry a light
  background or are dark-on-transparent. Catch The Baltic's pure-white mark also
  sits well here.
- `.brand-plate--dark` — dark tile, for transparent PNGs with light artwork.

Every logo therefore sits inside a deliberate frame, so a mixed-quality asset set
reads as a design decision rather than an accident. Plate variants swap
appropriately between colour modes.

Each logo needs explicit `width` and `height` attributes.

### Retained

`btn`, `card`, `card-link`, `card-cta`, `tag`, `link-list`, `social-card`,
`stat`, `faq`, `steps`, `price-list`, `note`, `uses-list`, `embed-card`, and the
mobile nav — all restyled to the new system, keeping their class names so the
existing markup does not need rewriting wholesale.

## Content changes

- Replace "Three things. Two of them involve cars." wherever it appears — the
  framing is now wrong.
- Reposition as: content creator first, with ventures as a supporting layer.
- **Blue Eye Energy** — energy drink company, co-owned with a friend, currently
  raising. No figure. A discreet "Investment enquiries" line pointing at email.
- **Catch The Baltic** — correct from "a car show I run social media for" to an
  organisation and registered business that runs events. The owner's role is
  social media, the announcement Telegram group, and the organisation groups.
- **Planned ventures** — car tuning shop, tuning parts shop, reengineered
  classic car parts, logistics and sourcing. All marked `PLANNED`.
- Partners, sponsors, and creator friends sections seeded with current partners.
- Existing facts to preserve: event 22 Aug 2026, 14:00–20:00, Spilve Airfield
  Riga; ticket prices; cash only; the three-step expo entry process.

## Performance

- **Inline the `@font-face` rules** into `style.css` and add
  `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the two
  Space Grotesk files. `fonts.css` is currently a separate request that must
  download and parse before any font file starts, costing a full round-trip on
  every cold load. Delete `fonts.css` and the two Fraunces woff2 files.
- `loading="lazy"` on the Discord iframe. It is below the fold on both pages
  that carry it.
- Explicit `width`/`height` on every image.
- Dropping Fraunces removes two font requests per page.
- Light and dark palettes both live in `style.css`; no second stylesheet.
- Bump the `?v=` cache-busting query to `4` across all pages, per the README
  convention. `theme.js` joins the versioned asset list.

Third-party embeds (TikTok `embed.js`, Discord widget, Buy Me a Coffee) are
commonly blocked by shields and ad blockers. The existing designed fallbacks are
kept and restyled.

## SEO

- **`sitemap.xml`** — all 14 pages (7 EN, 7 LV including the new Ventures page,
  excluding 404), each with its `hreflang` alternates.
- **`robots.txt`** — allow all, point at the sitemap.
- **JSON-LD:**
  - `Person` for AmziXz on home and about, with `sameAs` covering every social
    profile.
  - `Event` on `catch-the-baltic.html` — start and end times, `Place` with
    address, and `Offer` entries for each ticket tier. This is what produces an
    event card in Google results.
  - `Organization` for Blue Eye Energy and Catch The Baltic on the ventures page.
- Structured data must be added to both language versions, with `inLanguage` set
  correctly.

## Accessibility

Non-negotiable, all currently present and to be preserved:

- Skip link on every page
- Visible `:focus-visible` ring
- `aria-current="page"` on the active nav item
- `prefers-reduced-motion` handling
- The theme toggle is a real `<button>` with an accessible label and
  `aria-pressed`, keyboard operable
- Status pills do not rely on colour alone — each carries its text label

## Order of work

1. **Design system + English home page.** Both palettes, type scale, theme
   toggle, and the three new components, proven on one page.
   **Review gate — the owner sees this before anything multiplies.**
2. Remaining English pages, including the new Ventures page.
3. Latvian mirror of all pages, with `hreflang` pairs.
4. SEO and performance pass: sitemap, robots, JSON-LD, preloads, cache-bust bump.
5. Update `README.md` — structure, the dropped `fonts.css`, `theme.js`, and the
   new page.

Stopping after step 1 means a wrong call costs one page rather than twenty-four.

## Open items

- Logo files for Blue Eye Energy and Catch The Baltic have not yet been supplied.
  Components ship with placeholder plates and text fallbacks so no page is
  blocked; dropping the files in later requires no layout change.
- Creator friends have not been named yet. The `friends-grid` ships with the
  markup pattern documented and no entries, hidden until populated.
