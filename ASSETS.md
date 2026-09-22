# ESS site — image assets

Spec for producing and replacing the site's images. Every size below is
derived from the **actual rendered size measured in Chrome**, not guessed:
the site was loaded at 1440 / 1100 / 700 / 390 px and each `<img>` was
measured. Targets are 2× the largest measured size, so they stay sharp on
retina without shipping anything bigger than that.

---

## Status: the client's new hero photographs (v99)

The client supplied a second, ESS-branded hero set under `assets/heroes/`,
named after the page or section each one is for. Thirteen of the site's
nineteen hero slots now run on it; the other six keep the v63 photographs
because the new set has no counterpart for them.

| | v63 set | new set |
|---|---|---|
| Aspect / size | 4:3, 1000x750 (1200x900 home) | **16:9, 1672x941** |
| `@sm` variant | `name@sm.webp`, 700x525 | **`name-sm.webp`, 960x540** |
| Subject | generic field-service stock | **ESS-branded: ESS logo on screens, vans, mugs, workwear** |
| Per-file weight | 53–101 KB | **102–211 KB** |

The new files are roughly 2x heavier. That buys sharpness the old ones did not
have: v86 bleeds every hero across the full band, so a 1000px-wide source was
being upscaled past 1440px. These are 1672px and land near 1:1.

### Where each new file goes

| file | page(s) | why |
|---|---|---|
| `about-ess.webp` | `about.html` | manager and technician reading the platform on a wall screen |
| `mobile-office-manager.webp` | `mobile-office-manager.html` | dispatch, invoices, contracts, service orders on two office screens |
| `mobile-service.webp` | `mobile-service.html`, `industry-elevator.html` | technician on a tablet at an open controller cabinet |
| `customer-portal.webp` | `customer-portal.html` | property manager on the portal from a building lobby |
| `industries.webp` | `industries.html` + the three non-elevator industry pages | escalator, elevator and overhead door being serviced in one concourse |
| `customer-story-elevator-one.webp` | `customer-stories.html` | the lead story's own subject — Elevator One running time and payroll |
| `built-for-everyone-in-the-building.webp` | `products.html`, `features.html` | four roles on one job, which is what both pages argue |
| `login.webp` | `login.html` | signing in to the workspace from a dispatch office, a technician at work in the next bay |

### Not placed yet

Three files name a slot that has no photograph today. Each one is a design
decision rather than a swap, so none was invented:

| file | named slot | what stands in the way |
|---|---|---|
| `home-hero.webp` | `index.html` hero | the slot holds the client index's `.op-card` dashboard mock |
| `book-a-demo.webp` | `contact-demo.html` hero | `.contact-hero` is deliberately photoless and light (v86, v98) |
| `outcomes-our-customers-actually-feel.webp` | the Outcomes band on `index.html` / `about.html` | the band is a figure grid with no image container |

### Markup in use

```html
<img src="assets/heroes/about-ess.webp"
     srcset="assets/heroes/about-ess-sm.webp  960w,
             assets/heroes/about-ess.webp    1672w"
     sizes="100vw"
     width="1672" height="941" alt="…"
     loading="eager" fetchpriority="high" decoding="async">
```

`sizes` is `100vw` rather than the v63 column width: since v86 every one of
these heroes is a full-bleed band background, not a 486px card in the right
column. `loading="eager" fetchpriority="high"` is now on all of them — four
industry pages still had `loading="lazy"` from when the photo was a side
card, which delays the band's own background.

### Framing

v86 fills the band with `object-fit: cover` at a focal point of `70% 50%`.
On a ~3:1 band that crops about 21% off a 16:9 source, and the people in the
new photographs stand high in the frame — every hard hat and head was being
cut. v99 moves the focal point to `50% 30%` for this set only, keyed on
`[width="1672"]`, so the seven heroes still on 4:3 photographs keep the
framing they have today.

### Retired, still on disk

These nine (plus their `@sm` variants) are no longer referenced by any page:
`hero-home`, `hero-about`, `hero-customer-portal`, `hero-customer-stories`,
`hero-office-erp`, `hero-mobile-service`, `hero-industries`, `hero-products`,
`hero-login`.
They are kept, not deleted, so the swap stays reversible in one edit.

---

## Status: heroes replaced (v63) — superseded above for 12 of 19 slots

All 15 page heroes are now the new WebP set under `assets/heroes/`, wired with
`srcset` so phones download the `@sm` variant. Everything below reflects what
is actually on disk.

| | before | now |
|---|---|---|
| Referenced by the site | 15 files, ~19 MB | **33 files, 1.41 MB** |
| Largest single download | ~1.3 MB PNG | **83 KB** (home hero) |
| Hero bytes for a 15-page crawl @2x | ~19 MB | **864 KB desktop / 491 KB phone** |

Every file matches the spec: 1000x750 for standard pages, 1200x900 for home,
700x525 for the `@sm` variants, all well under the byte budgets.

### Markup in use

```html
<img src="assets/heroes/hero-support.webp"
     srcset="assets/heroes/hero-support@sm.webp 700w,
             assets/heroes/hero-support.webp   1000w"
     sizes="(max-width: 900px) 88vw, 486px"
     width="1000" height="750" alt="…"
     loading="eager" fetchpriority="high" decoding="async">
```

`width`/`height` are present on all 15, so the hero no longer shifts the text
when it lands.

### Presentation notes

These are photographs, not the transparent-background illustrations they
replaced, which needed two adjustments:

- `object-fit: cover` with the box locked to 4:3. Under the previous
  `contain` the photo was letterboxed inside its box, so the corner radius
  clipped the element and left the photo's own corners square. `cover` alone
  was not enough either — the box was capped by `max-height`, which at 700px
  produced a 1.77 box against a 1.33 image and would have cropped a third of
  the frame. The caps are widths now, so the box stays 4:3 and nothing crops.
- The edges are feathered with two crossed gradient masks so the photo
  dissolves into the page instead of ending on a hard rectangle. The subpage
  media card lost its white fill, border and shadow at the same time —
  fading a photo into an opaque card only moves the hard edge outwards.

---

## Still outstanding

### 47 unused files, 57.33 MB

The old illustration sets are now referenced by nothing:

```
assets/illustrations/          27 files
assets/illustrations-series/   18 files
assets/ess-logo-2026-white.svg is now USED (the route spinner)
assets/ess-logo.png            2 stray files at the root
```

They are committed to git, so deleting them is recoverable. Verify first:

    grep -rn "FILENAME" --include=*.html --include=*.css --include=*.js .

### Not yet created

- `og-default.jpg` 1200x630 — **no page has `og:image`, `og:title` or any
  Twitter card**, so links pasted into Slack, LinkedIn or Teams show a bare
  grey box.
- ~~`favicon.svg`~~ — **done.** The round ESS mark on a transparent ground,
  in the logo's own colours: the three swirl arcs in `#54A8CC` / `#60C0E4` /
  `#9CD8F0` and the ESS lettering in `#3C3C3C`, inset 2px inside a square 64
  viewBox. Built from the production logo's own paths, so it is the real mark
  rather than a redraw. `favicon-32.png` and `favicon-16.png` are rendered from
  it; `apple-touch-icon.png` (180) keeps an opaque white plate, because iOS
  composites a touch icon onto black.
  A navy disc behind the mark with white lettering was built first and then
  dropped at the client's request. The trade-off of the transparent version:
  on a dark tab bar the lettering recedes and the blue ring carries the
  identification on its own.
  The old declaration pointed at the 154.8x78.33 full wordmark, which was
  unreadable squashed into a 16px tab.

---

---

## Reference: the hero set

These are the files that were produced and are now live. Sizes are 1000x750
(`@sm` 700x525) except home, which is 1200x900.

 
| Page | File | What it shows |
|---|---|---|
| `products.html` | `hero-products.webp` | The four products as one connected platform — office, field, routing, portal |
| `mobile-office-manager.html` | `hero-office-erp.webp` | Back-office ERP: dispatch board, contracts, inventory, accounting on desktop |
| `mobile-service.html` | `hero-mobile-service.webp` | Technician on a phone/tablet at the job, working offline |
| `gps-route-builder.html` | `hero-gps-routing.webp` | Dispatcher watching live technician locations on a map, planning a route |
| `customer-portal.html` | `hero-customer-portal.webp` | A customer self-serving — checking service history without phoning the office |
| `industries.html` | `hero-industries.webp` | Several trades (elevator + general field service) sharing one operational system |
| `about.html` | `hero-about.webp` | The ESS team and the platform — company credibility, since 2003 |
| `customer-stories.html` | `hero-customer-stories.webp` | A contractor's outcome — the result of switching, not the software |
| `implementation.html` | `hero-implementation.webp` | Onboarding and rollout: data migration, training, go-live |
| `resources.html` | `hero-resources.webp` | Learning: guides, ESS-U training, knowledge base |
| `support.html` | `hero-support.webp` | Support staff helping a technician — headset, help channels |
| `pricing.html` | `hero-pricing.webp` | Planning and forecasting — scoping modules and users |
| `free-trial.html` | `hero-free-trial.webp` | Starting an evaluation — first steps into the product |
| `login.html` | `hero-login.webp` | Secure sign-in to the workspace |


**Home**

| Page | File | What it shows |
|---|---|---|
| `index.html` | `hero-home.webp` | The whole promise in one frame: office and field on the same record, dispatch → job → invoice |


## Logos

| File | Use |
|---|---|
| `ess-logo-2026.svg` | Header, light backgrounds |
| `ess-logo-2026-white-full.svg` | Footer, on navy |
| `ess-logo-2026-white.svg` | Square swirl — the route-change spinner |
| `ess-logo.png` | Unused, superseded |

## Regenerating

If the heroes are ever re-exported, keep the same filenames and dimensions and
nothing in the HTML needs to change. The `srcset`/`sizes`/`width`/`height`
attributes are already in place on all 15 pages.
