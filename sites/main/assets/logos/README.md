# Logo drop folder

Put brand logo files here. The site already has the markup wired for these
**exact filenames** — drop the file in and it appears, no code change needed:

| File | Used for |
|---|---|
| `blue-eye-energy.png` | Blue Eye Energy venture card |
| `catch-the-baltic.png` | Catch The Baltic venture card |

## Requirements

- **PNG with a transparent background** is best. A JPEG has a baked-in white
  box that shows as a white rectangle on the dark theme.
- **Square-ish**, roughly 512×512. It is displayed at 64×64 but a larger source
  stays sharp on high-DPI screens.
- Keep the file under ~100 KB. These load on the homepage.

## Which plate to use

Each logo sits inside a "brand plate" — a rounded tile that stops a logo with
the wrong background from looking broken. Pick the one that matches your file:

- `brand-plate--dark` — near-black tile. Use for **light or white artwork** on
  transparency. Both current logos use this: Blue Eye Energy is blue-and-white,
  and Catch The Baltic is white line-work.
- `brand-plate--light` — white tile. Use for **dark artwork**, or a logo that
  carries its own white background. Nothing uses it right now.

### What was done to the supplied files

`catch-the-baltic.png` arrived as white artwork on a **solid black background
with no transparency**. On a white plate that renders as a black square. The
black was keyed out using the image's own luminance as the alpha channel —
which preserves every antialiased edge, where a hard threshold would leave the
curves and small type visibly jagged. Both logos were also resized 1024/1254 →
512px, since they display at 64px.

## Swapping a placeholder for a real logo

Find the card in `index.html`, `ventures.html`, and their `lv/` twins. Replace
the initials span with an `img`:

```html
<!-- before -->
<span class="brand-plate brand-plate--dark">
  <span class="brand-plate-initials">BEE</span>
</span>

<!-- after -->
<span class="brand-plate brand-plate--dark">
  <img src="/assets/logos/blue-eye-energy.png?v=4" alt="Blue Eye Energy"
       width="64" height="64" />
</span>
```

The `?v=4` matters: without it, anyone who visited before keeps seeing the old
cached version. Bump the number across the site whenever you replace a file.

## Anything else

Other logos (partners, sponsors, creator friends) go here too. Name them in
lowercase with hyphens — `location-hunters.png`, not `Location Hunters.PNG`.
