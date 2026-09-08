# Working notes for this repo

Read `README.md` first — it documents the site itself (structure, theme, i18n,
conventions). This file covers only the things that bite when picking the work up
on a different machine.

## The repo is not where you think it is

The git repository is the **inner** folder:

```
<drive>:\- Projects\Majaslapas\amzixz.github.io\amzixz.github.io\   <- repo root
                                              ^ outer folder, not a repo
```

Opening the outer folder gives you a working directory that reports "not a git
repository". `cd` into the inner one.

## This repo lives on an external drive

Work moves between computers on the drive, so the drive letter changes and the
filesystem does not record ownership. Git refuses to touch it until you tell it
the directory is trusted — **once per machine**:

```bash
git config --global --add safe.directory "F:/- Projects/Majaslapas/amzixz.github.io/amzixz.github.io"
```

Without this every git command fails with "detected dubious ownership".

Two consequences worth remembering:

- **Push before switching machines.** History has diverged here once already:
  a redesign was committed locally, never pushed, and then re-uploaded through the
  GitHub web UI as a single "Add files via upload" commit. Same files, two
  histories. The local branch `redesign-2026` is kept as the archive of the real
  authored history; `main` is the live branch.
- Line endings differ between the two histories, so `git diff` against
  `redesign-2026` looks enormous. It isn't — use
  `git diff --ignore-cr-at-eol --ignore-all-space` to see the real changes.

## The live domain is not the repo name

The repo is called `amzixz.github.io`; the site is served at
**<https://amzixz.id.lv>**, set by the `CNAME` file at the repo root.

- **Never delete `CNAME`.** It has been deleted and recreated several times
  already; each time the custom domain drops.
- Every canonical URL, `hreflang`, `og:url`, `og:image`, the JSON-LD `url`, and
  all of `sitemap.xml` and `robots.txt` must use `amzixz.id.lv`. A canonical
  pointing at `amzixz.github.io` redirects away from the page it is on.
- `https://github.com/AmziXz` links are the **profile** and stay as they are.
  Never blanket-replace "github.io" without checking which of the two you have.

## Running it locally

Python is not installed on every machine here, so there are two equivalent
servers. Prefer Node:

```bash
node serve.js          # http://localhost:8000
npm start              # same
python serve.py        # only if you have Python
```

Do not open the HTML files directly — under `file://` the root-absolute
`/assets/...` paths resolve against the drive root, so no CSS loads, and the
embeds refuse to run. `serve.js` and `serve.py` must behave identically;
if you change one, change the other.

**On a fresh machine**, if `git` or `node` reports "not recognized" right after
installing them, the shell has a stale PATH — restart the terminal or VS Code.
They are on the machine PATH already.

## Before you commit

- Anything committed here is **public and served by Pages**. `.claude/` and
  `node_modules/` are gitignored for that reason; keep it that way.
- After changing anything in `/assets`, bump the `?v=N` cache-buster in **every**
  page — see the README's Cache busting section for the one-liner and the check.
  Currently `?v=6`.
- `package.json` is local tooling only (`"private": true`). The site itself has
  no build step and ships no dependencies; keep it that way.
