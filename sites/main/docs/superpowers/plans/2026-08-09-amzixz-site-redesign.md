# AmziXz Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the cream/teal design of `amzixz.github.io` with a dark-first, type-led design built from the owner's own purple-to-blue brand, add a Ventures page and partner/friends modules, and complete the SEO and performance work — across 7 English and 7 Latvian pages, with no build step.

**Architecture:** A single stylesheet (`assets/style.css`) holds design tokens for both colour modes plus every component. A new `assets/theme.js` persists a manual light/dark choice, mirroring the existing `assets/lang.js` pattern. HTML stays hand-written and duplicated per page — this is deliberate, not an oversight. `assets/fonts.css` is folded into `style.css` to remove a render-blocking round trip.

**Tech Stack:** Static HTML5, CSS custom properties, vanilla ES5-compatible JavaScript, self-hosted woff2 (Space Grotesk variable), GitHub Pages. No framework, no bundler, no package manager.

## Global Constraints

- **No build step.** No npm, no generator, no templating. Hand-edited HTML only.
- **No URL changes.** Every `.html` filename stays as-is. `projects.html` is only *labelled* "Work" in nav.
- **Root-absolute, extensionless links.** `<a href="/about">`, `<link href="/assets/style.css?v=4">`. Never `about.html`, never `./about`.
- **Cache busting:** every `/assets/*` reference carries `?v=4` after this work. All pages must agree.
- **Both colour modes.** Light palette on bare `:root`; dark under `@media (prefers-color-scheme: dark)` guarded as `:root:not([data-theme="light"])`; and again under `:root[data-theme="dark"]`.
- **Contrast rule:** the gradient and raw brand purple are for large type, borders, and accents only — never small body text.
- **Accessibility, non-negotiable:** skip link, `:focus-visible` ring, `aria-current="page"` on active nav, `prefers-reduced-motion` block, status pills carry text labels not just colour.
- **Latvian parity:** every EN page has an LV counterpart with `hreflang` pointing both ways. `latin-ext` woff2 must be retained — it carries Latvian diacritics.
- **Blue Eye Energy:** described as raising capital. **Never print the €81k figure.**
- **Planned ventures** are labelled `PLANNED`. Never implied to be operating.
- **No test framework exists and none is being added.** Verification is HTTP checks, HTML parse checks, consistency greps, and browser inspection.
- **Never `git push`.** The owner has explicitly forbidden it. Commits stay local on branch `redesign-2026`.

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `assets/style.css` | All tokens, base type, every component, both palettes, responsive + reduced-motion | Rewrite |
| `assets/theme.js` | Persist and apply the light/dark choice | Create |
| `assets/lang.js` | Language persistence | Unchanged |
| `assets/menu.js` | Mobile nav | Unchanged |
| `assets/fonts.css` | — | **Delete** (folded into `style.css`) |
| `assets/fonts/fraunces-*.woff2` | — | **Delete** (2 files) |
| `index.html` + `lv/index.html` | Home | Rewrite |
| `ventures.html` + `lv/ventures.html` | Ventures | Create |
| `projects.html` + `lv/projects.html` | Work | Rewrite |
| `about.html` + `lv/about.html` | About | Rewrite |
| `contact.html` + `lv/contact.html` | Contact | Rewrite |
| `uses.html` + `lv/uses.html` | Uses | Restyle |
| `catch-the-baltic.html` + `lv/catch-the-baltic.html` | Event | Rewrite |
| `404.html` | Not found | Restyle |
| `sitemap.xml`, `robots.txt` | SEO | Create |
| `README.md` | Docs | Update |

---

## Task 1: Design tokens, typography, and the theme toggle

**Files:**
- Modify: `assets/style.css` (replace lines 1–128 — the token block, base elements, and container/skip-link)
- Create: `assets/theme.js`
- Modify: `index.html` (head + header only)

**Interfaces:**
- Produces: CSS custom properties `--bg --surface --surface-2 --border --ink --muted --purple --blue --live --gradient --grad-a --grad-b`, spacing `--sp-1..--sp-12`, type steps `--step--1..--step-5`, motion `--ease-out --ease-in-out --dur-press --dur-hover --dur-enter`. Every later task consumes these names.
- Produces: `.theme-toggle` button, `#theme-toggle` id, `data-theme` attribute on `<html>`.

- [ ] **Step 1: Write the token block and inlined @font-face at the top of `assets/style.css`**

Replace everything from line 1 to the end of the `@media (prefers-color-scheme: dark)` block (line 56) with:

```css
/* Fonts inlined rather than @import-ed or linked separately: a second
   stylesheet must download and parse before any woff2 request even starts,
   costing a full round-trip on every cold load.

   Space Grotesk is a variable font, so one file covers the 400-700 range.
   latin + latin-ext only; latin-ext carries the Latvian diacritics and must
   not be dropped. OFL licensed. */

@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url('/assets/fonts/space-grotesk-latin-ext.woff2') format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url('/assets/fonts/space-grotesk-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* ---------- Tokens ----------
   Light lives on bare :root. Dark is declared twice on purpose: once for the
   system preference (guarded so an explicit light choice still wins) and once
   for the data-theme attribute, so the toggle overrides in both directions. */

:root {
  color-scheme: light dark;

  --bg: #fafafc;
  --surface: #ffffff;
  --surface-2: #f4f3f8;
  --border: #e5e3ec;
  --ink: #14121a;
  --muted: #5c5670;
  --grad-a: #7c3aed;
  --grad-b: #2563eb;
  --purple: #7c3aed;
  --blue: #2563eb;
  --live: #059669;

  --gradient: linear-gradient(135deg, var(--grad-a), var(--grad-b));
  --glow: radial-gradient(circle, rgba(124, 58, 237, 0.16) 0%, rgba(124, 58, 237, 0) 70%);
  --header-bg: rgba(250, 250, 252, 0.86);
  --plate-light: #ffffff;
  --plate-dark: #14121a;
  --grain-opacity: 0;

  --shadow-lg: 0 24px 60px rgba(20, 18, 26, 0.12);
  --shadow-sm: 0 12px 30px rgba(20, 18, 26, 0.08);
  --shadow-xs: 0 10px 22px rgba(20, 18, 26, 0.05);

  /* 8px base */
  --sp-1: 0.25rem;
  --sp-2: 0.5rem;
  --sp-3: 0.75rem;
  --sp-4: 1rem;
  --sp-5: 1.5rem;
  --sp-6: 2rem;
  --sp-8: 3rem;
  --sp-10: 4rem;
  --sp-12: 6rem;

  --step--1: clamp(0.78rem, 0.76rem + 0.1vw, 0.84rem);
  --step-0: clamp(1rem, 0.97rem + 0.15vw, 1.06rem);
  --step-1: clamp(1.15rem, 1.08rem + 0.35vw, 1.35rem);
  --step-2: clamp(1.45rem, 1.25rem + 0.9vw, 2rem);
  --step-3: clamp(1.9rem, 1.5rem + 1.9vw, 3rem);
  --step-4: clamp(2.6rem, 1.8rem + 3.6vw, 4.5rem);
  --step-5: clamp(3.2rem, 1.6rem + 7vw, 7.5rem);

  --mono: ui-monospace, "Cascadia Mono", "Segoe UI Mono", Consolas, monospace;

  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --dur-press: 120ms;
  --dur-hover: 160ms;
  --dur-enter: 340ms;

  --radius: 16px;
  --radius-lg: 24px;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0b0a0f;
    --surface: #131119;
    --surface-2: #1a1722;
    --border: #262233;
    --ink: #f5f3f7;
    --muted: #9a93ad;
    --grad-a: #8b5cf6;
    --grad-b: #3b82f6;
    --purple: #8b5cf6;
    --blue: #3b82f6;
    --live: #34d399;

    --glow: radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, rgba(139, 92, 246, 0) 70%);
    --header-bg: rgba(11, 10, 15, 0.82);
    --grain-opacity: 0.035;

    --shadow-lg: 0 24px 60px rgba(0, 0, 0, 0.55);
    --shadow-sm: 0 12px 30px rgba(0, 0, 0, 0.45);
    --shadow-xs: 0 10px 22px rgba(0, 0, 0, 0.35);
  }
}

:root[data-theme="dark"] {
  --bg: #0b0a0f;
  --surface: #131119;
  --surface-2: #1a1722;
  --border: #262233;
  --ink: #f5f3f7;
  --muted: #9a93ad;
  --grad-a: #8b5cf6;
  --grad-b: #3b82f6;
  --purple: #8b5cf6;
  --blue: #3b82f6;
  --live: #34d399;

  --glow: radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, rgba(139, 92, 246, 0) 70%);
  --header-bg: rgba(11, 10, 15, 0.82);
  --grain-opacity: 0.035;

  --shadow-lg: 0 24px 60px rgba(0, 0, 0, 0.55);
  --shadow-sm: 0 12px 30px rgba(0, 0, 0, 0.45);
  --shadow-xs: 0 10px 22px rgba(0, 0, 0, 0.35);
}
```

- [ ] **Step 2: Replace the base element styles**

Replace the old `body`, `h1,h2,h3`, and heading rules (formerly lines 58–128) with:

```css
* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  min-height: 100vh;
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
  font-size: var(--step-0);
  line-height: 1.6;
  color: var(--ink);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  position: relative;
}

/* Grain. Pure decoration, so it is inert to pointers and invisible in light
   mode, where it reads as dirt rather than atmosphere. */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: var(--grain-opacity);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E");
}

h1, h2, h3 {
  font-family: inherit;
  color: var(--ink);
  text-wrap: balance;
  letter-spacing: -0.02em;
  line-height: 1.08;
}

h1 { font-size: var(--step-4); margin: 0 0 var(--sp-4); }
h2 { font-size: var(--step-3); margin: 0 0 var(--sp-4); }
h3 { font-size: var(--step-1); margin: 0 0 var(--sp-2); }

p { text-wrap: pretty; }

main { position: relative; z-index: 1; padding: var(--sp-6) var(--sp-5) var(--sp-12); }

a { color: inherit; }

img { max-width: 100%; }

:focus-visible {
  outline: 2px solid var(--purple);
  outline-offset: 3px;
  border-radius: 6px;
}

.container { max-width: 1180px; margin: 0 auto; }

.muted { color: var(--muted); }

/* The bracket motif. Mono, wide-tracked, tiny — the size contrast against
   display type is the whole design. */
.eyebrow {
  font-family: var(--mono);
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: var(--step--1);
  font-weight: 600;
  color: var(--muted);
  margin: 0 0 var(--sp-3);
}

.index-label {
  font-family: var(--mono);
  font-size: var(--step--1);
  letter-spacing: 0.14em;
  color: var(--purple);
}

.rule { height: 1px; border: 0; background: var(--border); margin: var(--sp-8) 0; }

.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 100;
  background: var(--purple);
  color: #ffffff;
  padding: 0.7rem 1.2rem;
  border-radius: 0 0 12px 0;
  text-decoration: none;
  font-weight: 600;
}

.skip-link:focus { left: 0; }
```

- [ ] **Step 3: Create `assets/theme.js`**

```js
/* Light/dark persistence, mirroring lang.js.
 *
 * Loaded synchronously in <head>, NOT deferred: a deferred script runs after
 * first paint, so the wrong palette would flash before being corrected.
 *
 * First visit follows prefers-color-scheme. Once the toggle is clicked the
 * explicit choice is stored and wins from then on, in both directions. With
 * JavaScript off the button is inert but the system preference still applies,
 * so both palettes stay reachable.
 */
(function () {
  "use strict";

  var KEY = "amzixz:theme";
  var root = document.documentElement;

  function read() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function store(value) {
    try {
      localStorage.setItem(KEY, value);
    } catch (e) {
      /* private mode — the choice simply does not persist */
    }
  }

  var saved = read();
  if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);

  function effective() {
    var attr = root.getAttribute("data-theme");
    if (attr === "dark" || attr === "light") return attr;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function sync(button) {
    var dark = effective() === "dark";
    button.setAttribute("aria-pressed", dark ? "true" : "false");
    button.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.getElementById("theme-toggle");
    if (!button) return;
    sync(button);

    button.addEventListener("click", function () {
      var next = effective() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      store(next);
      sync(button);
    });
  });
})();
```

- [ ] **Step 4: Add the toggle styles to `assets/style.css`**

Append near the `.lang-switch` block:

```css
.theme-toggle {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--ink);
  cursor: pointer;
  transition: transform var(--dur-press) var(--ease-out),
    border-color var(--dur-hover) ease;
}

.theme-toggle:active { transform: scale(0.94); }

/* One glyph, two states: a filled disc for dark, a ringed disc for light. */
.theme-toggle-icon {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid currentColor;
  background: transparent;
  transition: background-color var(--dur-hover) ease, box-shadow var(--dur-hover) ease;
}

.theme-toggle[aria-pressed="true"] .theme-toggle-icon {
  background: currentColor;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25);
}

@media (hover: hover) and (pointer: fine) {
  .theme-toggle:hover { border-color: var(--purple); }
}
```

- [ ] **Step 5: Wire the toggle into `index.html`**

In `<head>`, replace the two stylesheet links and add the preloads and script:

```html
<link rel="preload" href="/assets/fonts/space-grotesk-latin.woff2?v=4" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/assets/fonts/space-grotesk-latin-ext.woff2?v=4" as="font" type="font/woff2" crossorigin />
<script src="/assets/theme.js?v=4"></script>
<script src="/assets/lang.js?v=4"></script>
<script src="/assets/menu.js?v=4" defer></script>
<link rel="stylesheet" href="/assets/style.css?v=4" />
```

Delete the `fonts.css` link. Update both `theme-color` metas:

```html
<meta name="theme-color" content="#fafafc" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#0b0a0f" media="(prefers-color-scheme: dark)" />
```

In the header, insert the toggle immediately after the `.lang-switch` div:

```html
<button class="theme-toggle" type="button" id="theme-toggle"
        aria-pressed="false" aria-label="Switch to dark theme">
  <span class="theme-toggle-icon" aria-hidden="true"></span>
</button>
```

- [ ] **Step 6: Verify**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/assets/theme.js
curl -s http://localhost:8000/ | grep -c 'fonts.css'          # expect 0
curl -s http://localhost:8000/ | grep -c 'theme-toggle'       # expect 2
python -c "import html.parser,urllib.request;p=html.parser.HTMLParser();p.feed(urllib.request.urlopen('http://localhost:8000/').read().decode());print('parsed ok')"
```

Browser: load `/`, click the toggle, confirm the palette flips and **survives a reload**. Set Windows to light, clear `localStorage`, reload — the site must come up light.

- [ ] **Step 7: Commit**

```bash
git add assets/style.css assets/theme.js index.html
git commit -m "Add dark/light design tokens and a persisted theme toggle"
```

---

## Task 2: Core components

**Files:**
- Modify: `assets/style.css` (header, buttons, cards, socials, footer, embeds, responsive, reduced-motion)

**Interfaces:**
- Consumes: all tokens from Task 1.
- Produces: `.site-header .nav .brand .nav-links .lang-switch .btn .btn.secondary .card .card-link .card-cta .tag .link-list .social-card .stat .footer` restyled under their existing class names.

- [ ] **Step 1: Restyle the header and nav**

Keep every existing selector name so no page markup needs rewriting. Change only the declarations: `--header-bg` background, `--border` hairline, `backdrop-filter: blur(12px)`, and `.nav-links a` hover/current colours moving from `--accent-warm` to `--purple`.

`.nav-right` gains `gap: var(--sp-3)` to fit the new toggle.

- [ ] **Step 2: Replace every `--accent*` reference site-wide**

The old palette used `--accent`, `--accent-strong`, `--accent-warm`, `--bg-ink`, `--surface-alt`, `--page-bg`, `--hero-bg`, `--section-bg`. None exist any more. Map them:

| Old | New |
|---|---|
| `--accent`, `--accent-strong` | `--purple` |
| `--accent-warm` | `--blue` |
| `--bg-ink` | `--ink` |
| `--surface-alt` | `--surface-2` |
| `--page-bg` | `--bg` |
| `--hero-bg`, `--section-bg` | `--surface` |

Verify none survive:

```bash
grep -nE '\-\-(accent|bg-ink|surface-alt|page-bg|hero-bg|section-bg)' assets/style.css
# expect no output
```

- [ ] **Step 3: Restyle buttons**

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  background: var(--gradient);
  color: #ffffff;
  padding: 0.8rem 1.7rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  border: 1px solid transparent;
  box-shadow: 0 14px 30px rgba(124, 58, 237, 0.25);
  transition: transform var(--dur-press) var(--ease-out),
    box-shadow var(--dur-hover) ease, filter var(--dur-hover) ease;
}

.btn:active { transform: scale(0.97); }

.btn.secondary {
  background: var(--surface);
  color: var(--ink);
  border-color: var(--border);
  box-shadow: none;
}

@media (hover: hover) and (pointer: fine) {
  .btn:hover { transform: translateY(-2px); box-shadow: 0 18px 36px rgba(124, 58, 237, 0.32); }
  .btn:hover:active { transform: translateY(-2px) scale(0.97); }
  .btn.secondary:hover { border-color: var(--purple); box-shadow: var(--shadow-xs); }
}
```

- [ ] **Step 4: Restyle `.section`, `.card`, `.link-list`, `.social-card`, `.stat`, `.footer`**

Sections lose the heavy translucent plate and become open space separated by hairlines:

```css
.section {
  border: 0;
  background: none;
  box-shadow: none;
  border-top: 1px solid var(--border);
  border-radius: 0;
  padding: var(--sp-10) 0 0;
  margin-top: var(--sp-10);
}

.section > h2 { margin-top: 0; }
```

Cards keep `--surface`, `--border`, `var(--radius)`, and `--shadow-xs`. Platform `--brand` colours on `.social-card` stay exactly as they are — they are the platforms' own colours, not ours.

- [ ] **Step 5: Verify**

```bash
grep -nE '\-\-(accent|bg-ink|surface-alt|page-bg|hero-bg|section-bg)' assets/style.css   # no output
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/assets/style.css          # 200
```

Browser: every existing page still renders without unstyled or invisible text in **both** themes. Text on `--surface` must stay legible in light mode.

- [ ] **Step 6: Commit**

```bash
git add assets/style.css
git commit -m "Restyle core components onto the new token set"
```

---

## Task 3: Venture, partner, friends, and brand-plate components

**Files:**
- Modify: `assets/style.css` (append a new components section)

**Interfaces:**
- Produces: `.venture-list .venture-card .status-pill .status-pill--live .status-pill--building .status-pill--planned .brand-plate .brand-plate--light .brand-plate--dark .partner-grid .partner-tile .friends-grid .friend-card`. Tasks 4–7 consume these exact names.

- [ ] **Step 1: Write the status pill**

Colour is never the only signal — each pill carries its word.

```css
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-family: var(--mono);
  font-size: var(--step--1);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 600;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--muted);
  white-space: nowrap;
}

.status-pill::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: currentColor;
  flex: 0 0 auto;
}

.status-pill--live { color: var(--live); border-color: color-mix(in srgb, var(--live) 40%, var(--border)); }
.status-pill--building { color: var(--purple); border-color: color-mix(in srgb, var(--purple) 40%, var(--border)); }
.status-pill--planned { color: var(--muted); }
```

- [ ] **Step 2: Write the brand plate**

This exists because the owner's logos are JPEG/PNG. A white-background JPEG dropped on a dark page shows a white box and looks broken; framing every logo in a deliberate plate makes a mixed-quality asset set read as a design decision.

```css
.brand-plate {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  flex: 0 0 auto;
  border-radius: 14px;
  border: 1px solid var(--border);
  overflow: hidden;
}

/* For logos that carry a light background, or dark artwork on transparency. */
.brand-plate--light { background: var(--plate-light); }

/* For transparent PNGs with light artwork. */
.brand-plate--dark { background: var(--plate-dark); }

.brand-plate img { width: 78%; height: 78%; object-fit: contain; display: block; }

/* Text fallback until a logo file exists. Ships visible so no page is blocked
   on assets that have not been supplied yet. */
.brand-plate .brand-plate-initials {
  font-family: var(--mono);
  font-weight: 700;
  font-size: var(--step-1);
  background: var(--gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

- [ ] **Step 3: Write the venture card**

```css
.venture-list { display: grid; gap: var(--sp-4); margin-top: var(--sp-6); }

.venture-card {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-4);
  padding: var(--sp-5);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow-xs);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: transform var(--dur-press) var(--ease-out),
    border-color var(--dur-hover) ease, box-shadow var(--dur-hover) ease;
}

/* Gradient rim-light on the leading edge — the TRIONN move, used sparingly. */
.venture-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--gradient);
  opacity: 0.9;
}

.venture-card--planned::before { opacity: 0.28; }

.venture-body { flex: 1 1 auto; min-width: 0; }

.venture-head {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-wrap: wrap;
  margin-bottom: var(--sp-2);
}

.venture-name { font-size: var(--step-1); font-weight: 700; letter-spacing: -0.01em; }

.venture-role {
  font-family: var(--mono);
  font-size: var(--step--1);
  color: var(--muted);
  margin-top: var(--sp-2);
}

@media (hover: hover) and (pointer: fine) {
  a.venture-card:hover {
    transform: translateY(-2px);
    border-color: var(--purple);
    box-shadow: var(--shadow-sm);
  }
}

@media (max-width: 560px) {
  .venture-card { flex-direction: column; }
}
```

- [ ] **Step 4: Write the partner and friends grids**

```css
.partner-grid {
  display: grid;
  gap: var(--sp-3);
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  margin-top: var(--sp-5);
  padding: 0;
  list-style: none;
}

.partner-tile {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  min-height: 76px;
  padding: var(--sp-3);
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  text-align: center;
  font-size: var(--step--1);
  font-weight: 600;
  color: var(--muted);
  text-decoration: none;
  transition: border-color var(--dur-hover) ease, color var(--dur-hover) ease;
}

.partner-tile img { max-height: 40px; width: auto; object-fit: contain; }

@media (hover: hover) and (pointer: fine) {
  .partner-tile:hover { border-color: var(--purple); color: var(--ink); }
}

.friends-grid {
  display: grid;
  gap: var(--sp-4);
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  margin-top: var(--sp-5);
  padding: 0;
  list-style: none;
}

.friend-card {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  text-decoration: none;
  transition: border-color var(--dur-hover) ease, transform var(--dur-press) var(--ease-out);
}

.friend-card .brand-plate { width: 44px; height: 44px; border-radius: 999px; }

.friend-name { font-weight: 600; display: block; }

.friend-platform {
  font-family: var(--mono);
  font-size: var(--step--1);
  color: var(--muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

@media (hover: hover) and (pointer: fine) {
  .friend-card:hover { border-color: var(--purple); transform: translateY(-2px); }
}
```

- [ ] **Step 5: Extend the reduced-motion block**

Add the new hover transforms to the existing `prefers-reduced-motion` rule so movement is removed but colour and opacity are kept:

```css
@media (prefers-reduced-motion: reduce) {
  a.venture-card:hover,
  .friend-card:hover,
  .theme-toggle:active { transform: none; }
}
```

- [ ] **Step 6: Verify**

```bash
grep -c 'status-pill--planned' assets/style.css   # expect >= 1
grep -c 'brand-plate--light' assets/style.css     # expect >= 1
grep -c 'friends-grid' assets/style.css           # expect >= 1
```

- [ ] **Step 7: Commit**

```bash
git add assets/style.css
git commit -m "Add venture, partner, friends, and brand-plate components"
```

---

## Task 4: Rebuild the English home page

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: every component from Tasks 1–3.
- Produces: the canonical header/footer markup that Tasks 5–7 copy verbatim.

- [ ] **Step 1: Rewrite the hero**

Numbered index labels, a display-scale name, corner-anchored meta card. The "three things" line is gone — it is factually wrong now.

```html
<section class="hero container">
  <p class="eyebrow">Content creator · Riga, Latvia</p>
  <h1 class="hero-title">Phone modding,<br />cars, and the<br />things I'm building.</h1>
  <p class="lead">
    I mod phone software on YouTube — custom ROMs, root, debloating. On TikTok I
    make car content and stream live. Off camera I co-own Blue Eye Energy and run
    social media for Catch The Baltic.
  </p>
  <div class="hero-actions">
    <a class="btn" href="/projects">See the work</a>
    <a class="btn secondary" href="/ventures">What I'm building</a>
  </div>
</section>
```

- [ ] **Step 2: Add the ventures strip**

Three entries only — the full list lives on `/ventures`.

```html
<section class="section container">
  <p class="eyebrow"><span class="index-label">[ 02 ]</span> Ventures</p>
  <h2>What I'm building</h2>
  <div class="venture-list">
    <a class="venture-card" href="/catch-the-baltic">
      <span class="brand-plate brand-plate--light">
        <span class="brand-plate-initials">CTB</span>
      </span>
      <span class="venture-body">
        <span class="venture-head">
          <span class="venture-name">Catch The Baltic</span>
          <span class="status-pill status-pill--live">Live</span>
        </span>
        <span class="muted">An organisation running auto and moto events in Riga.</span>
        <span class="venture-role">Social media · Telegram announcements · org groups</span>
      </span>
    </a>
    <div class="venture-card">
      <span class="brand-plate brand-plate--dark">
        <span class="brand-plate-initials">BEE</span>
      </span>
      <span class="venture-body">
        <span class="venture-head">
          <span class="venture-name">Blue Eye Energy</span>
          <span class="status-pill status-pill--building">Building</span>
        </span>
        <span class="muted">An energy drink company I co-own. Currently raising.</span>
        <span class="venture-role">Co-owner</span>
      </span>
    </div>
  </div>
  <a class="card-cta" href="/ventures">All ventures</a>
</section>
```

**Never add the €81k figure to this or any other page.**

- [ ] **Step 3: Add the partners and friends section**

```html
<section class="section container">
  <p class="eyebrow"><span class="index-label">[ 04 ]</span> Partners</p>
  <h2>Partners &amp; friends</h2>
  <p class="muted">Brands and creators I work with. Want to be here? <a href="/contact">Get in touch</a>.</p>
  <ul class="partner-grid">
    <li><span class="partner-tile">Red Bull</span></li>
    <li><span class="partner-tile">ALXFLAME</span></li>
    <li><span class="partner-tile">Location Hunters</span></li>
    <li><span class="partner-tile">MAD Racing</span></li>
    <li><span class="partner-tile">BLAST.LV</span></li>
    <li><span class="partner-tile">StickerShop.net</span></li>
  </ul>
</section>
```

The `friends-grid` markup pattern is documented in `README.md` (Task 9) but **ships with no entries and no empty container** — an empty grid renders as a gap with a heading over it, which reads as broken.

- [ ] **Step 4: Keep the socials, embeds, and support sections**

Retain the existing `.social-grid`, `.embed-card`, TikTok blockquote, Discord iframe, and Buy Me a Coffee block. Add `loading="lazy"` to the Discord iframe. Renumber the eyebrows so indices run `[ 01 ]`–`[ 05 ]` in document order.

- [ ] **Step 5: Add "Ventures" to the header and footer nav**

Header order: Work · Ventures · About · Contact. The `Projects` link keeps `href="/projects"` and is relabelled `Work`.

- [ ] **Step 6: Verify**

```bash
curl -s http://localhost:8000/ | grep -c 'Three things'        # expect 0
curl -s http://localhost:8000/ | grep -c '81k\|81 000\|€81'    # expect 0
curl -s http://localhost:8000/ | grep -c 'venture-card'        # expect >= 2
curl -s http://localhost:8000/ | grep -c 'loading="lazy"'      # expect >= 1
python -c "import html.parser,urllib.request;p=html.parser.HTMLParser();p.feed(urllib.request.urlopen('http://localhost:8000/').read().decode());print('parsed ok')"
```

Browser: check both themes, and at 360px, 760px, and 1280px widths.

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "Rebuild the English home page on the new design"
```

**REVIEW GATE — stop here and show the owner before continuing.** This is the point at which a wrong direction costs one page instead of twenty-four.

---

## Task 5: The Ventures page (English)

**Files:**
- Create: `ventures.html`
- Modify: `index.html`, `projects.html`, `about.html`, `contact.html`, `uses.html`, `catch-the-baltic.html`, `404.html` (nav links only)

- [ ] **Step 1: Create `ventures.html`** by copying `index.html`'s head/header/footer and swapping the meta:

```html
<title>AmziXz · Ventures</title>
<meta name="description" content="The companies AmziXz is building — Catch The Baltic, Blue Eye Energy, and what's planned: car tuning, reengineered classic parts, and logistics." />
<link rel="canonical" href="https://amzixz.github.io/ventures" />
<link rel="alternate" hreflang="en" href="https://amzixz.github.io/ventures" />
<link rel="alternate" hreflang="lv" href="https://amzixz.github.io/lv/ventures" />
<link rel="alternate" hreflang="x-default" href="https://amzixz.github.io/ventures" />
```

- [ ] **Step 2: List all five ventures with honest statuses**

Live: Catch The Baltic. Building: Blue Eye Energy. Planned: car tuning shop, tuning parts shop, reengineered classic car parts, logistics and sourcing. Planned entries use `.venture-card--planned` and are **not** links — they have nowhere to go.

- [ ] **Step 3: Add the investment enquiry line** under Blue Eye Energy:

```html
<p class="note">
  Blue Eye Energy is raising. Investment enquiries:
  <a href="mailto:amzixz@proton.me">amzixz@proton.me</a>.
</p>
```

No figure. Ever.

- [ ] **Step 4: Add "Ventures" to nav on all seven English pages**

- [ ] **Step 5: Verify**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/ventures    # 200
curl -s http://localhost:8000/ventures | grep -c '81k\|€81'                # 0
curl -s http://localhost:8000/ventures | grep -c 'status-pill--planned'    # expect 4
for p in / /projects /about /contact /uses /catch-the-baltic /ventures; do
  echo -n "$p ventures-link: "; curl -s "http://localhost:8000$p" | grep -c 'href="/ventures"'
done
```

- [ ] **Step 6: Commit**

```bash
git add ventures.html index.html projects.html about.html contact.html uses.html catch-the-baltic.html 404.html
git commit -m "Add the Ventures page and link it from every English page"
```

---

## Task 6: Remaining English pages

**Files:** `projects.html`, `about.html`, `contact.html`, `uses.html`, `catch-the-baltic.html`, `404.html`

- [ ] **Step 1** — For each page: replace the `<head>` asset block with Task 1 Step 5's version (preloads, `theme.js`, no `fonts.css`, `?v=4`), and add the theme toggle to the header.
- [ ] **Step 2** — `about.html`: rewrite the body copy. Remove "three things"; add Blue Eye Energy as co-owned and raising; correct Catch The Baltic to an organisation and registered business.
- [ ] **Step 3** — `projects.html`: relabel to "Work". Add a fourth card for Blue Eye Energy with `status-pill--building`.
- [ ] **Step 4** — `contact.html`: update the "What is Catch The Baltic?" FAQ answer to say organisation, not car show. Add an FAQ entry: "Are you open to sponsorships?". Add `loading="lazy"` to the Discord iframe.
- [ ] **Step 5** — `catch-the-baltic.html`: convert `.partner-list` to `.partner-grid` with `.partner-tile`. Correct the owner's role line to include the Telegram announcement group and organisation groups.
- [ ] **Step 6** — `uses.html`, `404.html`: head and header only.
- [ ] **Step 7: Verify**

```bash
for p in /projects /about /contact /uses /catch-the-baltic /nothing; do
  echo -n "$p: "; curl -s "http://localhost:8000$p" | grep -c 'theme-toggle'
done   # every line >= 2

grep -rl 'fonts.css' *.html || echo "fonts.css fully removed"
grep -rl '?v=3' *.html || echo "all bumped to v=4"
grep -rn 'Three things' *.html || echo "stale framing gone"
```

- [ ] **Step 8: Commit**

```bash
git add *.html
git commit -m "Bring the remaining English pages onto the new design"
```

---

## Task 7: Latvian mirror

**Files:** all seven files under `lv/`

- [ ] **Step 1** — Create `lv/ventures.html` mirroring `ventures.html`, translated, with `hreflang` pointing back to `/ventures`. Add the `lv` alternate to `ventures.html`.
- [ ] **Step 2** — Apply Tasks 4–6 to every `lv/` page. **Every link on an LV page points at another LV page** — that structural rule is what keeps a visitor in Latvian with JavaScript off.
- [ ] **Step 3** — Translate the new UI strings: Work → Darbi, Ventures → Uzņēmumi, Live → Aktīvs, Building → Top, Planned → Plānots, "Partners & friends" → "Partneri un draugi", "Switch to dark theme" → "Pārslēgt uz tumšo motīvu".
- [ ] **Step 4: Verify**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/lv/ventures   # 200
# No LV page may link back into the English tree:
for f in lv/*.html; do
  echo -n "$f stray-EN-links: "
  grep -oE 'href="/(projects|about|contact|uses|ventures|catch-the-baltic)"' "$f" | wc -l
done   # every line 0

for f in lv/*.html; do echo -n "$f hreflang-en: "; grep -c 'hreflang="en"' "$f"; done   # every line >= 1
```

- [ ] **Step 5: Commit**

```bash
git add lv/ ventures.html
git commit -m "Mirror the redesign across the Latvian pages"
```

---

## Task 8: SEO and performance

**Files:** Create `sitemap.xml`, `robots.txt`. Modify all 14 pages. Delete `assets/fonts.css`, `assets/fonts/fraunces-latin.woff2`, `assets/fonts/fraunces-latin-ext.woff2`.

- [ ] **Step 1: Create `robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://amzixz.github.io/sitemap.xml
```

- [ ] **Step 2: Create `sitemap.xml`** with all 14 URLs (7 EN, 7 LV; 404 excluded), each carrying its `xhtml:link` alternates:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://amzixz.github.io/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://amzixz.github.io/"/>
    <xhtml:link rel="alternate" hreflang="lv" href="https://amzixz.github.io/lv/"/>
  </url>
  <!-- repeat for: /projects /ventures /about /contact /uses /catch-the-baltic
       and each /lv/ counterpart -->
</urlset>
```

- [ ] **Step 3: Add `Person` JSON-LD** to `index.html` and `about.html` (and LV, with `"inLanguage": "lv"`):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "AmziXz",
  "url": "https://amzixz.github.io/",
  "image": "https://amzixz.github.io/assets/logo-512.png",
  "jobTitle": "Content creator",
  "address": { "@type": "PostalAddress", "addressLocality": "Riga", "addressCountry": "LV" },
  "sameAs": [
    "https://www.youtube.com/@PhoneGuruAmziXz",
    "https://www.youtube.com/@AmziXz",
    "https://www.tiktok.com/@itsamzixz",
    "https://t.me/AmziXz",
    "https://github.com/AmziXz"
  ]
}
</script>
```

- [ ] **Step 4: Add `Event` JSON-LD** to `catch-the-baltic.html` — this is what produces an event card in Google results:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Catch The Baltic",
  "startDate": "2026-08-22T14:00:00+03:00",
  "endDate": "2026-08-22T20:00:00+03:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Spilve Airfield",
    "address": { "@type": "PostalAddress", "addressLocality": "Riga", "addressCountry": "LV" }
  },
  "image": "https://amzixz.github.io/assets/og-image.png",
  "description": "An auto and moto event at Spilve Airfield, Riga.",
  "offers": [
    { "@type": "Offer", "name": "Ages 13 and up", "price": "10", "priceCurrency": "EUR", "availability": "https://schema.org/InStock", "url": "https://amzixz.github.io/catch-the-baltic" },
    { "@type": "Offer", "name": "Club members", "price": "8", "priceCurrency": "EUR", "availability": "https://schema.org/InStock", "url": "https://amzixz.github.io/catch-the-baltic" },
    { "@type": "Offer", "name": "Children up to 12", "price": "0", "priceCurrency": "EUR", "availability": "https://schema.org/InStock", "url": "https://amzixz.github.io/catch-the-baltic" }
  ]
}
</script>
```

- [ ] **Step 5: Add `Organization` JSON-LD** to `ventures.html` for Catch The Baltic and Blue Eye Energy. No funding amounts in structured data either.

- [ ] **Step 6: Delete the dead font assets**

```bash
git rm assets/fonts.css assets/fonts/fraunces-latin.woff2 assets/fonts/fraunces-latin-ext.woff2
```

- [ ] **Step 7: Confirm every `?v=` is 4** across all 14 pages.

- [ ] **Step 8: Verify**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/robots.txt    # 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/sitemap.xml   # 200
python -c "import xml.dom.minidom,urllib.request;xml.dom.minidom.parseString(urllib.request.urlopen('http://localhost:8000/sitemap.xml').read());print('sitemap valid xml')"
python - <<'PY'
import json, re, urllib.request
for path in ["/", "/about", "/catch-the-baltic", "/ventures"]:
    body = urllib.request.urlopen("http://localhost:8000" + path).read().decode()
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', body, re.S):
        json.loads(block)
    print(path, "json-ld ok")
PY
grep -rn '?v=3' . --include=*.html || echo "all assets at v=4"
grep -rn 'Fraunces' . --include=*.css --include=*.html || echo "Fraunces fully removed"
```

Also paste `/catch-the-baltic` into Google's Rich Results Test once deployed.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Add sitemap, robots, and structured data; drop Fraunces"
```

---

## Task 9: Update the README

**Files:** Modify `README.md`

- [ ] **Step 1** — Update the structure block: add `ventures.html`, `theme.js`, `sitemap.xml`, `robots.txt`; remove `fonts.css` and the Fraunces files.
- [ ] **Step 2** — Replace the "Design tokens" convention note: tokens now cover both palettes, light on bare `:root`, dark declared twice (media query + `data-theme`).
- [ ] **Step 3** — Add a "Theme" section explaining that `theme.js` must stay a synchronous `<head>` script or the wrong palette flashes.
- [ ] **Step 4** — Document how to add a partner tile, a friend card, and a venture card — copy one block, change three lines.
- [ ] **Step 5** — Bump the cache-busting example from `?v=2` to `?v=4`.
- [ ] **Step 6: Commit**

```bash
git add README.md
git commit -m "Update the README for the redesign"
```

---

## Self-Review

**Spec coverage:** Visual system → Tasks 1–3. Theme/language switching → Task 1. Information architecture → Tasks 4–6. Components → Task 3. Content changes → Tasks 4–6. Performance → Tasks 1, 6, 8. SEO → Task 8. Accessibility → Tasks 1, 3, and every verify step. Order of work → task order, with the spec's phase-1 gate placed at the end of Task 4. No spec section is unimplemented.

**Placeholder scan:** No TBDs. The one deliberate omission — `friends-grid` shipping with no entries — is stated with its reason (an empty grid renders as a broken gap) and its markup is documented in Task 9.

**Type consistency:** Token names are defined once in Task 1 Step 1 and used verbatim afterwards. Component class names are defined in Task 3 and consumed unchanged in Tasks 4–7. Task 2 Step 2 carries a grep that fails loudly if any old `--accent*` token survives.

**Known risk:** `color-mix()` in Task 3 lacks support in browsers older than ~2023. It is used only on `border-color`, where the fallback is the inherited `--border` — a slightly plainer pill, never a broken one.
