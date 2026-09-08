# Photo drop folder

Photos for the homepage. Every slot on the site renders as a designed gradient
panel until you drop a real file in, so nothing ever looks broken or empty
while you gather them.

## Slots the site is already built for

| File | Where it appears | Status |
|---|---|---|
| `work-phone.jpg` | Beside the phone modding block (16:9, shown whole) | in use |
| `work-cars.jpg` | Beside the car content block (4:3, cropped to fill) | in use |
| `ctb-event.jpg` | Full-width band on the Catch The Baltic page | not placed yet |

The full-width band that used to sit under the intro is now a scrolling AmziXz
wordmark. An empty photo frame always reads as a gap, so it was replaced with
content that fills the width on its own. The `.media-band` styles are still in
`style.css` if you later have a wide shot worth giving the full width to.

The two `work-*` slots sit in a normal grid, so a portrait or 4:3 photo works.
The full-width bands crop hard to roughly 3:1 — a portrait photo put there
gets reduced to a thin horizontal slice, so give those a landscape shot.

## What works

- **Landscape**, at least 1600px wide. The full-width bands are cropped to
  roughly 3:1, so keep the subject near the centre.
- **JPEG** for photos — far smaller than PNG for the same quality. Keep each
  file **under 400 KB**; the bands load on first paint and a 4 MB phone photo
  will make the page visibly slow.
- **Darker images work better.** White text sits on top of these, and the
  scrim only darkens so far. A blown-out bright sky will fight the caption.

Resize before uploading — a phone shoots 4000px wide, which is roughly four
times more than needed and ten times the file size.

## Turning a slot on

Add the `--photo` custom property to the band. The CSS handles the crop, the
scrim, and the text contrast:

```html
<!-- before: designed gradient placeholder -->
<section class="media-band">

<!-- after: your photo -->
<section class="media-band" style="--photo: url('/assets/photos/hero-cars.jpg?v=4')">
```

For the inline `.media` slots, replace the placeholder span with an image:

```html
<div class="media">
  <img src="/assets/photos/work-cars.jpg?v=4" alt="Filming a car build"
       width="800" height="600" loading="lazy" />
</div>
```

`alt` text matters — it is what screen readers announce and what shows if the
file ever fails to load. Describe what is in the shot, not "photo".

The `?v=4` is cache busting: without it, anyone who visited before keeps
seeing the old file. Bump it site-wide whenever you replace an image.
