# amzixz.github.io

Personal site for **AmziXz** — a static, dependency-free site served straight from
this repository by GitHub Pages at **<https://amzixz.id.lv>**.

The repository is still named `amzixz.github.io`, but that is only the repo name.
The live host is the custom domain `amzixz.id.lv`, set by the `CNAME` file in this
directory — GitHub Pages reads it and 301s `amzixz.github.io` across. **Do not
delete `CNAME`**; removing it drops the domain and the site reverts to the
`github.io` host. Every canonical URL, `hreflang`, `og:` tag and `sitemap.xml`
entry points at `amzixz.id.lv`; keep new ones consistent, or search engines get a
canonical that redirects away from the page it is on.

## Structure

```
index.html            Home — full-viewport hero, work, ventures, socials, embeds
about.html            About
projects.html         Work (the nav label; the filename stays projects.html)
ventures.html         Ventures — Catch The Baltic, Blue Eye Energy, what's planned
contact.html          Contact details, socials, FAQ
uses.html             Gear and software
catch-the-baltic.html Catch The Baltic — the organisation
404.html              Not-found page
sitemap.xml           All 14 pages with hreflang alternates
robots.txt            Allows everything, points at the sitemap
CNAME                 The custom domain — deleting it drops amzixz.id.lv
lv/                   Latvian versions of every page above except 404
serve.js              Local preview server, Node (mimics Pages URL handling)
serve.py              The same server in Python, for machines without Node
package.json          Local tooling only — never served, no build step
assets/
  style.css           Everything — tokens, both palettes, @font-face, components
  fonts/              woff2 files (latin + latin-ext; latin-ext = Latvian)
  lang.js             Remembers the EN/LV choice across pages
  theme.js            Remembers the light/dark choice
  menu.js             Mobile navigation menu
  reveal.js           Scroll reveals
  logos/              Brand logo drop folder — see its README
  photos/             Photo drop folder — see its README
  logo.png            256px circular badge — header icon and favicon
  logo-512.png        512px — apple-touch-icon
  og-image.png        1200x630 share banner
```

There is no `fonts.css` any more. The `@font-face` rules live in `style.css`
because a second stylesheet has to download and parse before any woff2 request
can even start, costing a full round-trip on every cold load.

There is no build step. Edit the HTML/CSS and push to `main`; Pages redeploys.

## URLs

Pages serves **extensionless** URLs: `/about` resolves to `about.html`
automatically. Every internal link uses that form, root-absolute:

```html
<a href="/about">About</a>          <!-- not about.html, not ./about -->
<link rel="stylesheet" href="/assets/style.css" />
```

Keep new links in that shape, and point `canonical` / `og:url` at the
extensionless URL so search engines index one address per page.

The `.html` files are still the real files on disk — Pages does the mapping, so
nothing needs renaming or moving into directories.

## Local preview

Two interchangeable servers, because not every machine this repo is edited from
has both runtimes. Use whichever you have:

```bash
node serve.js          # http://localhost:8000, or `node serve.js 3000`
npm start              # the same thing

python serve.py        # identical behaviour, if you have Python
```

They must stay behaviourally identical — extensionless URLs, `/dir/` to
`dir/index.html`, and a real 404 status on the fallback page. Change one, change
the other.

**Do not open the files directly.** Under `file://`:

- root-absolute paths like `/assets/style.css` resolve against your `C:` drive,
  so no CSS loads;
- extensionless links have no server to resolve them, so navigation 404s;
- the TikTok and Discord embeds refuse to load, because `file://` pages are
  treated as unique origins with no host.

`serve.py` exists because Python's built-in `http.server` does not resolve
`/about` to `about.html`, so plain `python -m http.server` would 404 on every
link even though the deployed site works.

## Languages

English lives at the root, Latvian under `/lv/`. Pages pair up one-to-one:
`/about` <-> `/lv/about`.

Language persists two ways, deliberately layered:

1. **Structurally.** Every link on an LV page points at another LV page, so once
   you are in Latvian you stay there. Works with JavaScript off, and it is what
   search engines follow.
2. **`assets/lang.js`.** Records the choice when the EN/LV switch is clicked,
   and on a later visit sends you to the version you picked. It reads the
   counterpart URL from the page's own `<link rel="alternate" hreflang>` rather
   than constructing it, so a page without a translation stays put.

**Adding a page:** create both versions, give each the `hreflang` pair pointing
at the other, and set the switch hrefs in the header. Miss the `hreflang` and
the switch still works, but the remembered preference will not follow.

## Cache busting

Everything in `/assets` is referenced with a `?v=N` query string:

```html
<link rel="stylesheet" href="/assets/style.css?v=6" />
```

GitHub Pages serves assets with `Cache-Control: max-age=600`, and browsers hold
images and stylesheets far longer than that. Without the version, editing
`style.css` or replacing `logo.png` leaves returning visitors on the old copy —
new HTML with stale CSS, which breaks the layout rather than just looking dated.

**After changing anything in `/assets`, bump the number in every page** — and
bump *every* reference, not just the one you edited. The number drifted apart
once already (scripts on `?v=4`, the stylesheet on `?v=5`), which leaves
returning visitors running old JavaScript against new CSS. From the repo root:

```bash
node --input-type=module -e "
import {readFile,writeFile,glob} from 'node:fs/promises';
const V=7;
for await (const f of glob(['*.html','lv/*.html']))
  await writeFile(f,(await readFile(f,'utf8')).replace(/\?v=\d+/g,'?v='+V),'utf8');
"
```

Currently at `?v=6`. Bump `V` above to the next number, then check nothing was
missed:

```bash
grep -ho '?v=[0-9]*' *.html lv/*.html | sort -u   # should print one line
```

## Theme

Light and dark are both first-class. The palette is declared three times, and
all three are load-bearing:

1. **Light on bare `:root`** — the base.
2. **Dark under `@media (prefers-color-scheme: dark)`**, guarded as
   `:root:not([data-theme="light"])` — so someone who explicitly chose light
   keeps light even on a dark-mode OS.
3. **Dark again under `:root[data-theme="dark"]`** — so the toggle can override
   a light-mode OS.

Drop any one of those and the toggle stops working in one direction.

`assets/theme.js` **must stay a synchronous `<head>` script.** Deferring it
means it runs after first paint, so the wrong palette flashes before being
corrected.

## Adding things

**A venture card** — copy a `.venture-card` block in `ventures.html`, change the
name, description, role, and the `status-pill` modifier (`--live`,
`--building`, `--planned`). Planned entries are `<div>`, not `<a>`: they have
nowhere to link to.

**A logo** — drop the file in `assets/logos/` and follow that folder's README.
Logos sit inside a `brand-plate` because a white-background JPEG on a dark page
shows as a white box.

**A photo** — drop it in `assets/photos/` and follow that folder's README. Every
slot renders as a designed gradient panel until a real file exists, so a
half-finished page never looks broken.

## Motion

`assets/reveal.js` fades elements marked `data-reveal` up as they scroll in.
Three rules keep it from being annoying, and all three matter:

- The hidden start state is applied by script (`.reveal-ready`), never in the
  HTML. If the script fails to load, nothing is hidden.
- Elements are unobserved once revealed, so nothing re-animates on scroll back.
- Anything already on screen at load reveals immediately.

## Conventions

- **Design tokens** are CSS custom properties in `:root`. Change colours there,
  not inline.
- **`--gutter`** is the single source of truth for the page margin. Full-bleed
  elements cancel it with a negative margin; if the two drift apart the page
  gains a horizontal scrollbar.
- **Contrast**: the gradient and raw brand purple are for large type, borders,
  and accents only — never small body text. Purple clears WCAG AA by too thin a
  margin to spend on 16px paragraphs.
- **Motion** uses the shared `--ease-out` / `--dur-*` variables. UI transitions
  stay under ~300ms; hover effects are gated behind
  `@media (hover: hover) and (pointer: fine)` so they don't stick on touch.
- **Accessibility**: every page has a skip link, a `:focus-visible` ring, and
  `aria-current="page"` on the active nav item. Keep those when adding pages.
- **Header**: below 860px the nav links collapse behind the menu button; the language
  switch and theme toggle stay in the bar. The links are a plain `<ul>` that CSS hides
  at narrow widths, so they still work with JavaScript off.
- **Adding a page**: copy an existing page's `<head>` block and update `<title>`,
  `description`, `canonical`, and the `og:` tags. Add the link to both the header
  nav and the footer nav.

## Notes

- Anything committed here is publicly served. Keep local tooling output out of
  the repo.
- Third-party embeds (TikTok `embed.js`, the Discord widget, Buy Me a Coffee)
  are commonly blocked by Brave Shields and uBlock. That is expected and not a
  bug in the page — test with shields down before investigating.
