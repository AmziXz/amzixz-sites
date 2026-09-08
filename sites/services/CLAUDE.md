# Working notes for this repo

Read `README.md` first. This file covers only what bites when picking the work up
on another machine.

## Where this sits

Sibling of the main site on the external drive:

```
<drive>:\- Projects\Majaslapas\
  amzixz.github.io\amzixz.github.io\   main site  -> amzixz.id.lv
  services.amzixz.id.lv\               this repo  -> services.amzixz.id.lv
```

The drive records no ownership, so git needs this once per machine:

```bash
git config --global --add safe.directory "F:/- Projects/Majaslapas/services.amzixz.id.lv"
```

Without it every git command fails with "detected dubious ownership".

## Two repos, one brand

This is a **separate repository on purpose**: GitHub Pages allows one custom
domain per repo, and the main repo's `CNAME` is already spent on `amzixz.id.lv`.

Consequences to keep in mind:

- **Never delete `CNAME`.** It claims the subdomain.
- The design tokens, fonts, `theme.js` and `reveal.js` are **copies** of the main
  site's, not shared files. Change one, change the other, or they drift.
- Links between the two sites are absolute (`https://amzixz.id.lv/...`) because
  they are different origins. Root-absolute paths would resolve to the wrong site.

## Running it

Python is not installed on every machine here — use Node:

```bash
node serve.js 8001    # 8001 so it can run beside the main site on 8000
```

If `git` or `node` reports "not recognized" straight after installing it, the
shell has a stale PATH; restart the terminal.

## What this site promises

The copy commits to specific things. Do not soften or contradict them without
being asked:

- Development work is **quoted per project** — no fixed prices anywhere.
- Clients **own the code** and get the source at handover.
- We **do not build custom Discord bots**. We offer our own bot, as is. This is
  stated in the services card and answered again in the FAQ.

## Before you commit

Anything committed here is public and served by Pages. `.claude/` and
`node_modules/` are gitignored; keep it that way.

Assets are referenced with `?v=N`. After changing anything in `/assets`, bump it
in `index.html` **and** `404.html`.
