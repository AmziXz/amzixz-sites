# amzixz-sites

Both websites, one repository.

| Folder | Domain | Published to |
|---|---|---|
| `sites/main` | amzixz.id.lv | `AmziXz/amzixz.github.io` |
| `sites/services` | services.amzixz.id.lv | `AmziXz/services.amzixz.id.lv` |

## Why two publishing repos

GitHub Pages serves **exactly one custom domain per repository** — the `CNAME`
file holds a single hostname. So two domains need two Pages repos; there is no
way around it on Pages.

What this repo removes is the *editing* in two places. You work here. The two
repos above are build output: the workflow force-pushes to them, and nothing in
them should ever be edited by hand.

## Layout

```
sites/main/        amzixz.id.lv
sites/services/    services.amzixz.id.lv
shared/            files that belong to both, laid out as a site would be
tools/build.py     assembles out/<name>/
sites.json         domain + target repo for each site
```

`shared/` currently holds only the two Space Grotesk woff2 files. They were
byte-identical in both sites; everything else (`style.css`, `menu.js`,
`theme.js`, `reveal.js`) has genuinely diverged, so nothing else is shared.

It mirrors a site's own layout — `shared/assets/fonts/` — so the build merges it
straight over the top and the stylesheets keep asking for `/assets/fonts/...`
exactly as they always did. Nothing had to be repathed.

## Working on a site

```
py tools/build.py                       # build both into out/
py tools/build.py services              # build one
py -m http.server -d out/services 8080  # preview what will actually ship
```

Preview `out/`, not `sites/` — `out/` is the build, with shared files merged in
and the tooling files stripped.

## Deploying

Push to `main`. The workflow builds each site and force-pushes it to its own
Pages repo.

It needs one repository secret:

- **`PAGES_TOKEN`** — a fine-grained personal access token with
  **Contents: read and write** on both target repos.

The workflow refuses to push if `CNAME` or `index.html` is missing from a
build, or if `CNAME` does not match the domain in `sites.json`. That check
exists because a force-push that drops `CNAME` makes Pages fall back to
`amzixz.github.io` — the custom domain "randomly stops working", with nothing
in the logs to explain it.

## What is not published

`tools/build.py` copies everything from `sites/<name>/` except:

- `CLAUDE.md`, `README.md` — working notes
- `package.json`, `package-lock.json`, `tsconfig.json`, `serve.js`, `serve.py`
- `docs/` — internal plans and specs
- `node_modules/`, `.claude/`, dotfiles, OS noise

`LICENSE` **is** published. All of these except `LICENSE` used to be reachable
on the live site; they no longer are.

To change what ships, edit `EXCLUDE_NAMES` / `EXCLUDE_DIRS` in
`tools/build.py` — one list, both sites.

## DNS

- `amzixz.id.lv` — A records to `185.199.108.153`, `185.199.109.153`,
  `185.199.110.153`, `185.199.111.153`
- `services` — CNAME to `amzixz.github.io.` (project Pages sites are served
  from the user Pages host too)

Turn on **Enforce HTTPS** in each repo's Pages settings once the certificate
has issued.

## The services site used to live at /services/

It was a folder inside the main site, so the same page answered on
`amzixz.id.lv/services/` and on `services.amzixz.id.lv`. That folder is gone
from `sites/main/`; the 32 navigation links across 15 pages now point at
`https://services.amzixz.id.lv/`, and the `/services/` entry was removed from
the main sitemap. It has its own sitemap on its own domain.

## Before the first deploy

There were three copies of the services site (`services.amzixz.id.lv`,
`services-clean`, and `amzixz.github.io/services/`) and they had already
drifted. `sites/services/` was taken from the newest one. Retire the others so
this does not happen again.
