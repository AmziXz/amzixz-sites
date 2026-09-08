# services.amzixz.id.lv

The AmziXz Services site — a single-page, dependency-free static site served by
GitHub Pages at **<https://services.amzixz.id.lv>**.

It sells two things:

- **Developer Services** — websites and applications built to a brief, quoted per
  project.
- **Our Discord bot** — a bot we build, host and run. We do **not** take on custom
  Discord bot development, and the page says so explicitly. Keep it that way; the
  FAQ answers the question directly so nobody arrives with the wrong expectation.

## Why this is a separate repository

GitHub Pages allows exactly **one custom domain per repository** — the `CNAME`
file holds a single hostname. The main site's repo already spends its `CNAME` on
`amzixz.id.lv`, so the subdomain cannot be served from there and needs a repo of
its own.

That means two DNS records, doing different jobs:

```
amzixz.id.lv           A      185.199.108.153   (and .109 / .110 / .111)
services.amzixz.id.lv  CNAME  amzixz.github.io.
```

The apex uses A records because a CNAME cannot legally sit alongside other
records at a zone apex. The subdomain has no such restriction, so it uses a
CNAME. **Do not delete this repo's `CNAME` file** — it is what claims the
subdomain, and removing it drops it.

## Structure

```
index.html      The whole site. One page, English only.
404.html        Not-found page
CNAME           services.amzixz.id.lv — deleting it drops the subdomain
robots.txt      Allows everything, points at the sitemap
sitemap.xml     One URL
serve.js        Local preview server (mimics Pages URL handling)
assets/
  style.css     Tokens, both palettes, @font-face, components
  theme.js      Light/dark persistence — must stay a synchronous <head> script
  reveal.js     Scroll reveals
  fonts/        Space Grotesk woff2 (latin + latin-ext)
  logo-full.jpg    Brand master. Every icon below is cut from this - regenerate
                   them all if the brand changes.
  logo-mark.png    Header icon and apple-touch-icon (512, monogram only)
  logo-mark-192.png / logo-mark-32.png   Favicons
  og-image.jpg     1200x630 social card
```

No build step. Edit and push to `main`; Pages redeploys.

## Local preview

```bash
node serve.js         # http://localhost:8000, or `node serve.js 8001`
npm start
```

Do not open `index.html` directly — the root-absolute `/assets/...` paths resolve
against your drive root under `file://`, so nothing loads.

Run it on **8001** if the main site is already on 8000; the two are separate sites
and it is useful to have both up at once.

## Shared design, copied not linked

The tokens, `@font-face` rules, fonts, `theme.js` and `reveal.js` are **copies**
of the main site's, not links to it. Cross-origin asset loading between two
domains would add a DNS lookup and a connection to first paint, and would break
this site whenever the other one moved a file.

The cost is that they can drift. If you change a colour token or the theme
script on one site, apply it to both. The token block at the top of
`assets/style.css` is copied verbatim from the main site's — keep it that way so
a diff between the two files is meaningful.

`reveal.js` adds the class `is-revealed` (not `is-visible`). If reveals stop
working after copying CSS from elsewhere, check that class name first.

## Conventions

Same as the main site, and for the same reasons:

- **Design tokens** are CSS custom properties in `:root`. Change colours there.
- **The palette is declared three times** — light on bare `:root`, dark under
  `prefers-color-scheme` guarded with `:not([data-theme="light"])`, and dark
  again under `[data-theme="dark"]`. Drop any one and the toggle stops working
  in one direction.
- **`theme.js` must stay synchronous in `<head>`.** Deferring it means it runs
  after first paint and the wrong palette flashes.
- **Accessibility**: skip link, `:focus-visible` ring, 44px minimum touch
  targets, decorative SVGs `aria-hidden`. Keep them.
- **Motion** uses the shared `--ease-out` / `--dur-*` variables, and everything
  is disabled under `prefers-reduced-motion`. Hover effects are gated behind
  `@media (hover: hover) and (pointer: fine)` so they don't stick on touch.

## Pricing

There are deliberately **no numbers on the page**. Packages show "Custom quote"
and route to Discord or email. A price without a scope is a guess, and the FAQ
explains that to the visitor rather than leaving it unsaid.

If fixed prices are added later, add them to all three packages at once — one
priced tier beside two unpriced ones reads as a mistake.
