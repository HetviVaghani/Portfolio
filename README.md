# Hetvi — Artist Portfolio Website

A one-page portfolio for Hetvi's custom art: portrait sketches, acrylics, watercolours, god & goddess paintings and texture art. Warm ink-and-canvas palette with vermilion and saffron accents, a full-screen background video in the hero, and a different gallery style for each medium.

## How to view it
Double-click `index.html` to open it in a browser. No build step or server needed.

## Files
- `index.html` — all page content and structure
- `css/style.css` — colours, fonts, layout, animations and responsive rules
- `js/script.js` — preloader, scroll animations, gallery filters, drag-scroll gallery, mobile menu, lightbox
- `images/` — artwork photos, one folder per category/sub-category
- `videos/hero-painting.mp4` — hero background video

## Replacing the placeholder content
The images and the hero video are **placeholders** so the layout can be previewed. Replace them before the site goes live.

- **Artwork photos** — each sub-category folder (for example `images/portrait-sketches/couple-portraits/`) holds `1.jpg`, `2.jpg` and `3.jpg`. Drop in your own photos with the same names and they appear automatically, with no code changes.
  The current placeholders are public-domain and Creative Commons artworks from Wikimedia Commons. Some of those licences require credit, so don't keep them on the live site.
- **About photo** — `images/about/1.jpg`.
- **Hero video** — replace `videos/hero-painting.mp4` with your own studio clip, keeping the same name. It plays muted and on loop; a landscape (16:9) clip of 10–30 seconds and under ~8 MB works best. The current clip is a free placeholder from Mixkit.
- **Email & phone** — in the Contact section of `index.html` (search for `TODO`). Update both the visible text and the `mailto:` / `tel:` links.

## Colour palette
Defined as CSS variables at the top of `css/style.css`; change them once and the whole site updates.
- `--ink` / `--canvas` — dark ink and warm off-white backgrounds
- `--vermilion` — main accent (buttons, highlights)
- `--saffron` — secondary accent
- `--gold` / `--maroon` — used only in the God & Goddess section
- `--teal` / `--sage` / `--rose` — used only in the Watercolour section

## Portfolio sections
| Section | Sub-categories | Gallery style |
|---|---|---|
| Portrait Sketches | Self, Couple, Pet, Family, Bride & Groom | Pinned sketchbook photos with tape |
| Acrylic Paintings | Self Portraits, Vector Painting, Abstract | Drag-to-scroll row of arched cards |
| Watercolour Paintings | Landscapes, Other Paintings | Soft, morphing blob frames |
| God & Goddess Art | God, Goddess | Temple-arch frames in maroon and gold |
| Texture Art | Living Room, Café & Office, Resin Art | Framed gallery wall with 3D tilt |

Each section has filter buttons for its sub-categories. Clicking any artwork opens it in a full-screen lightbox.

## Hosting it for free
Any static host works; drag and drop the whole folder:
- GitHub Pages (Settings → Pages → deploy from the `main` branch)
- Netlify Drop — netlify.com/drop
- Vercel
