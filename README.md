# Hetvi — Artist Portfolio Website

An editorial, gallery-inspired portfolio for Hetvi's art business: an all-brown palette (cream, tan, espresso, with a single terracotta accent), a light hero built around an abstract "paint pooling" visual and a rotating seal badge, a short studio-philosophy section, and a "fan" carousel for browsing each category's work.

## How to view it
Just double-click `index.html` (or right-click → Open with → your browser). No build step, no server needed.

## Files
- `index.html` — all page content and structure
- `css/style.css` — colours, fonts, layout, animations, carousel styling
- `js/script.js` — mobile menu, tabs, fan-carousels, lightbox, scroll effects

## Colour palette
Defined as CSS variables at the top of `style.css` — change these once and the whole site updates. Deliberately brown-only, no blue:
- `--espresso-900` / `--espresso-950` — deep brown, used for the hero, footer, buttons and active states
- `--tan` / `--tan-deep` — warm highlight used for rules, active states, the rotating seal badge
- `--rust` — the one complementary accent, used sparingly (contact icons, one ring shape)
- `--cream` / `--paper` — warm off-white backgrounds (never pure white)

## Things to update yourself (marked clearly in the code)

1. **Hero visual** — `index.html`, search for `hero-art-svg`. It's currently a placeholder abstract composition (layered circles) built entirely in inline SVG, not a photo. Swap that whole `<svg>` block for a real `<img>` of your work, your process, or your materials whenever you have one — the surrounding frame styling will still apply.
2. **All gallery photos** — every `<img>` inside a `.fan-track` and the About photo currently point to placeholder images from `picsum.photos`. Replace each `src` (and matching `data-full` for the enlarged lightbox view) with photos of your actual artwork.
3. **Instagram handle** — currently linked as `instagram.com/myaestheticside` (guessed spelling of "my aestheticside" without spaces, since Instagram handles can't contain spaces). **Please double-check this is your exact handle** and fix it in 3 places in `index.html`: navbar, contact section, footer.
4. **Email & phone** — currently placeholders (`youremail@example.com`, `+91 00000 00000`) in the Contact section. Update both the visible text and the `mailto:` / `tel:` links.
5. **Bio & hero text** — the paragraphs in the Hero and About sections are starter copy; rewrite them in your own words whenever you like.

## Structure of the Portfolio section
- **Portrait Sketches** — Self, Couple, Pet, Family, Bride & Groom
- **Acrylic Paintings** — Self Portraits, Vector Painting, Abstract Paintings
- **Watercolour Paintings** — Landscapes, Other Paintings
- **God & Goddess Paintings** — God, Goddess *(custom size/colour/decor note included)*
- **Texture Art** — Living Room, Café & Office, Resin Art *(custom demand note included)*

## Adding images — the "fan" carousel
Each category tab (e.g. "Portrait Sketches") shows **one** continuous carousel holding every image in that category — not a separate mini-carousel per sub-pattern. Every card is labelled with its sub-pattern name (bottom caption, always visible) and the card nearest the centre gets an extra pill tag and stands taller, exactly like the fanned/mountain layout you asked for. It sits directly on the page background (no boxed panel behind it); the prev/next arrows are the small cream circular buttons underneath, and the effect recalculates live as you scroll or drag.

To add a photo, find the right `<div class="fan-track" data-track>` for that category in `index.html` and copy one of the existing cards inside it:
```html
<div class="fan-card" tabindex="0">
  <img data-full="FULL_SIZE_IMAGE_URL_OR_PATH" src="THUMBNAIL_IMAGE_URL_OR_PATH" alt="Describe the piece">
  <span class="fan-caption">Sub-pattern name</span>
  <span class="fan-tag">Sub-pattern name</span>
</div>
```
Paste it anywhere inside that track, change the `src`/`data-full`/`alt`/labels, and reload — the fan effect, arrows and lightbox all pick it up automatically with no JS changes needed. Delete a card's whole `<div class="fan-card">…</div>` block to remove a placeholder.

## Optional: a dedicated page per sub-pattern
Right now every sub-pattern lives inline in its category's carousel. If later you'd rather have (say) "Bride & Groom Portraits" open its own full page with a larger gallery, that's a reasonable next step — just say so and it can be built as separate linked pages that reuse the same header/footer/styling.

## Hosting it for free
Once you're happy with it, you can put it online for free with any of these (just drag-and-drop the whole folder):
- Netlify Drop — netlify.com/drop
- Vercel
- GitHub Pages
