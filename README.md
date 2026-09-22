# Expert Service Solutions — static site

Implemented from the Claude Design handoff bundle
(`ESS Homepage.dc.html`, `ESS Contact & Demo.dc.html`).

## Run it

Open `index.html` directly in a browser — no build step, no server needed.
Keep the folder structure intact; the CSS, JS and assets are referenced
relatively.

Optional local server (nicer URLs, correct MIME types):

    python3 -m http.server 8000     # then open http://localhost:8000

## Files

    index.html         Homepage
    contact-demo.html  Book a demo (3-step wizard, FAQ, contact channels)
    coming-soon.html   Shared placeholder; takes ?page=<name>
    css/site.css       All styles — tokens, components, keyframes
    js/site.js         Reveal-on-scroll, module tabs, stat counter,
                       FAQ accordion, booking wizard, legal TOC
    js/router.js       Shared header behaviour + content-only navigation
    tools/             Header/footer generator (see below)
    assets/            Logos (colour + white)


## Shared header and footer

The header is **generated**, not hand-edited. One route table drives all
19 pages:

    tools/nav-config.mjs      ← the only file you edit to change the nav
    tools/render-header.mjs   route table -> header markup
    tools/partials/footer.html the shared footer, verbatim
    tools/sync-layout.mjs     stamps both into every *.html

After editing `tools/nav-config.mjs`:

    node tools/sync-layout.mjs          rewrite every page
    node tools/sync-layout.mjs --check  CI guard: fail if a page drifted

`sync-layout` replaces only `<header>` and `<footer>`. Each page keeps its
own `<main>`, `<title>`, meta description and body classes, and gets the
correct `is-active` / `aria-current` for its place in the nav. It also
reports any page that is not reachable from the header or footer.

Node is needed **only** to regenerate the chrome. The site itself still has
no build step — every page is a complete HTML document.

### Nav structure

    Home
    Products ▾    Mobile Office Manager · Mobile Service ·
                  GPS Tracker & Route Builder · Customer Portal
    Industries
    Why ESS ▾     About ESS · Customer stories · Implementation
    Resources ▾   Resources library · Support · Free trial
    Pricing

Dropdown parents are real links, so Products still opens `products.html`.
Panels open on hover and on keyboard focus, Escape dismisses them, and on
screens ≤900px they flatten into an indented list inside the mobile menu
(44px minimum hit target, scrolls when it exceeds the viewport).


## Content-only navigation

`js/router.js` intercepts internal links and swaps **only `<main>`**. The
header and footer DOM nodes are never re-created, so there is no flash, no
CSS re-parse and no re-run of the header on navigation. It also updates the
title, meta description, body class and active nav state, restores scroll
position on Back/Forward, and warms the cache on hover so most clicks are
instant.

This is progressive enhancement, not a SPA rewrite:

- Every page remains a standalone HTML document with the full header baked
  in, so crawlers and no-JS visitors get the same markup.
- `fetch` is blocked on `file://`, so opening `index.html` by double-click
  falls back to ordinary page loads. Everything still works, just without
  the content-only swap.
- Any fetch failure, non-200 or page without a `<main>` falls back to a
  normal browser navigation.

Behaviour that lives inside `<main>` is re-initialised on every swap via the
`ess:contentswap` event — see `initContent()` in `js/site.js`. Anything bound
to the header, body or window is initialised once in `initChrome()`. If you
add a new content behaviour, register it in `initContent()` and make it
idempotent.

## Notes

- Fonts load from Google Fonts (Inter, since v68). Offline, the browser
  falls back to system-ui and the layout still holds.
- The booking form confirms optimistically — see `TODO(backend)` in
  `js/site.js` for where to POST to the CRM / scheduling endpoint.
- Phone numbers differ between the two source mockups
  ((415) 532-1859 on the homepage, (858) 674-4300 on the contact page).
  Both mockups flag phone and address as pending client confirmation.


## QA note
- Header/contact phone normalized to the phone shown on the current ESS website: 1 (888) 596-9481.
- Affiliations use the five image URLs currently served by expertservicesolutions.com. Internet access is required for those five marks when opening this local build.
- Primary/secondary buttons now share a 44px minimum hit target and visible keyboard focus state.

Update v35: replaced remaining old/missing subpage media with a unified illustration system for Pricing, About, Support, Implementation, Customer Stories, and Free Trial.


## v37 — Full-site Editorial Liquid Glass
All pages now use the same ESS editorial + liquid-glass visual system, with the production ESS logo, ESS navy/cyan/orange palette, glass headers/cards/heroes, and refreshed ESS-palette character illustrations on key pages.

Update v38: reduced illustration background clutter, broadened copy beyond elevator-only messaging, refined Why ESS cards, improved legal page spacing, and restored a fully rounded glass footer.

## v39 illustration system
- Added a full `assets/illustrations-series/` library for Home, Products, Office/ERP, Mobile Service, GPS/Dispatch, Customer Portal, Industries, Pricing, Resources, Support, Implementation, Customer Success, Free Trial, Login, About/Why ESS, and Demo booking.
- Illustration branding uses the simple ESS swirl mark + ESS where branding appears.
- Reduced decorative environmental scenery; illustrations focus on people, glass UI cards, dashboards, and workflow context.
- Refined Why ESS card alignment, legal-card padding/margins, and a fully rounded 4-corner glass footer.

Update v40: replaced the white footer/logo-dark-context mark with the simple ESS swirl icon only (no text on the right), based on the provided logo direction.

Update v41: removed blue/orange and decorative color gradients from the site UI. Depth now comes from solid ESS colors, translucent glass, blur, borders, and shadows. Orange remains a focused CTA/accent color.

Layout normalization: v42 — unified page margins/background/header spacing and horizontal overflow fixes.

## v44 layout pass
- Glass hero now wraps content; removed viewport/min-height stretching.
- Trust bar stays inside the hero with proper internal padding.
- Unified section spacing across home and subpages.
- Subpage heroes now wrap content instead of keeping oversized minimum heights.


## v45 layout pass
- Added fixed clearance between floating header and first section.
- Normalized inner padding for large rounded sections/cards.
- Reduced over-stretch feel on CTA strips and kept content away from edges.
- Unified section top rhythm across pages.


## v46 layout pass
- Reduced header-to-first-section spacing so it is more proportional.
- Constrained dark teal CTA cards to an inset centered width.
- Kept CTA button/content inside a safer, more balanced card frame.


## v48 layout pass
- Removed extra top padding under sticky header; first cards now sit closer to header.
- Kept footer logo, description and Talk to us on one aligned vertical stack.
- Compacted Resources first subhero so it fits within one screen more cleanly.
- Added shared rounded corners to News & events cards.

## v50 layout refinement
- Compact wide-screen layout for What ESS optimizes for, What to prepare, and A better trial.
- Reduced footer wordmark size.
- Rebalanced Why ESS, Resources, and Pricing for horizontal desktop composition and fewer vertical text wraps.
- Tablet/mobile retain stacked responsive layouts.

## v52 review updates
- Widened and shortened the first hero sections for Mobile Service, GPS/Route Builder, Customer Portal, Mobile Office Manager, Industries, and Support on desktop.
- Replaced the Industries hero with `assets/illustrations-series/industries-operations.png` and aligned its technician mark with the current ESS branding.
- Restored vertical editorial stacking for Home `Why ESS`, Resources `Guides & field notes`, and the Pricing model heading/description group.


## v53 — shared header, organised routes, content-only navigation
- Replaced 8 divergent per-page headers with one generated header. Home and
  the demo page no longer use `#products` / `#industries` / `#why` anchors;
  every page links to the real page, so routes and active state are
  consistent site-wide.
- Grouped the nav into Products / Why ESS / Resources dropdowns. The four
  product subpages, Implementation, Customer stories, Support and Free trial
  were previously reachable only from body copy or the footer; all 19 pages
  are now reachable from the shared chrome.
- Navigation swaps only `<main>`. The header and footer stay mounted.
- Fixed a pre-existing bug where the mobile menu was see-through: its
  `backdrop-filter` never applied because the ancestor `.header-inner`
  already establishes a backdrop root. The menu and the new dropdown panels
  now carry their own opacity.
- Removed the old click handler in `js/site.js` that forced a full document
  load on every internal link.

Dropped in this pass: the demo page's page-specific `The 30 minutes` and
`FAQ` nav items, which were the reason its header differed. They were the
only per-page nav entries on the site.


## v54 — one layout system

The v50/v52 passes tuned each page with its own `!important` block. That left
278 `!important` declarations across ~20 blocks, and no two pages agreed on a
width or a heading size. Measured at 1440px, the site had **13 different
content widths** — text started at x=24, 39, 100, 124, 130, 160, 164, 229 and
237 — and **four different page-title sizes**.

Those blocks are now reduced to content layout only (how items inside a
section arrange). Width, vertical rhythm and type come from one token block
at the end of `css/site.css`.

- **One column.** Every top-level `<section>` is capped at `--shell` and
  centred. Rounded surfaces pad by the larger `--surface-pad` and bleed
  outward by exactly that difference, so their text lands on the same left
  edge as every other section. The bleed is `max(0px, min(want, (100vw -
  shell)/2))`, so once the viewport is narrower than the column it collapses
  to zero instead of stepping the card's text inward.
  Result: **13 content widths → 3** at 1440px (the column, a 1px rounding
  difference on surfaces, and the deliberate 900px text measure), and 2 on a
  phone.
- **Three h1 tiers**, not four accidental sizes: default, `.subhero.is-compact`
  (about, pricing, products, resources) and `.subhero.is-dense` (the six
  subpage heroes from the v52 review). Same rendered sizes as before — now
  three named choices instead of twenty override blocks.
- **`.h2-sm` works again.** `.option-air .h2` (0,2,0) outranked `.h2-sm`
  (0,1,0), so all nine headings marked as the small tier silently rendered at
  the large size. It is a real tier now, and a heading in a split-section's
  narrow side column takes it automatically.
- **`.section-head` always stacks** eyebrow → heading → description. The v52
  pass stacked `#why`, `#guides` and pricing but missed `#news`, which kept a
  170px label column while the section directly above it did not.
- Three section headings that were bare `<h2>` now carry `.h2`.

See `ASSETS.md` for the image spec — the site still ships 55 MB of assets, of
which 38.8 MB is unreferenced and every hero is a ~1.3 MB PNG in a 486px slot.


## v55–v57 — surface separation, contrast, stat row

**Surfaces.** The trust bar's white panel began exactly where the hero card
ended, so two white surfaces merged with a seam instead of a gap. Surfaces
that follow another block now get `--surface-gap`. The logo marquee scrolls a
2635px track through a 1192px window, so words were sliced mid-letter at both
edges; it now fades out instead.

**Contrast.** Audited every text node on all 19 pages against WCAG AA,
resolving the effective background by walking ancestors and averaging
gradient stops — a solid-colour scan misses `.resource-band`, which is a
gradient. 22 failures found, now 0.

- Worst case: the `#chain` heading at **1.22:1**, ESS navy-deep on ESS navy.
  Introduced in v54 by adding `.h2` to a previously unclassed `<h2>`, which
  picked up `.ess-glass-site .h2 { color: var(--ess-navy-deep) }`.
- All seven dark surfaces now invert as a group. The orange `.btn` inside
  them is excluded — it is a light surface of its own, and was the only
  light-background child in any dark card.
- On light surfaces the brand orange reached only 3.08:1 as text. It is kept
  for fills, rules, dots and icons; where the orange *is* the text or sits
  behind it, it darkens to `--accent-ink` (5.02:1 on white). The header CTA
  keeps the brighter orange — it sits on navy, where it already passes.

**Stat row.** The customer-story figures were four equal `1fr` columns while
`.stat-n` is `white-space: nowrap`. "4,000+" needs 110px of ink and "53" needs
35px, so wide figures crossed the next column's divider (+10px at 1440, +45px
at 900) while narrow ones wasted 60px. Tracks are content-driven now, each
cell shrinks only to its own min-content, and the dividers are real borders
rather than pseudo-elements a sibling could paint over.


## v58–v59 — controls, store badges, responsive pass

- **Filled buttons keep the bright brand orange.** The AA-darkened version
  read as muddy, so `.btn-primary` / `.btn-header` / `.btn-next` are back to
  `#f47b25 → #e65e0c`. White on that is 3.09:1, under the 4.5:1 AA threshold —
  a deliberate brand call, and the only remaining contrast exception on the
  site. Orange used *as text* stays darkened, where it costs nothing visually.
- **Disabled buttons are grey again.** The `!important` on the gradient had
  been overriding the disabled background, leaving it orange at 58% opacity —
  which just looked like a paler button. That mattered more once the wizard
  hint copy was removed, since the disabled state is now the only cue that a
  slot still has to be picked.
- **Wizard footer** puts Back and Continue on one row; the hint line is gone.
- **Mobile menu toggle** is a 44px circle.
- **Google Play mark was malformed** — its four sub-paths chained relative
  `m` commands after `Z`, producing a notched triangle with a detached tip.
  Replaced with the correct mark. It existed in three places: the shared
  footer partial plus in-page copies on `index.html` and `mobile-service.html`
  that `sync-layout` does not touch.
- **Footer store badges** sit side by side, stacking only below 380px.

### Responsive audit — 19 pages x 10 viewports (320 → 1680px)

No horizontal scroll and no clipped text anywhere. Two real issues found:

- **Legal table of contents** was one `nowrap` row up to 2087px wide inside
  `overflow-x:auto` with the scrollbar hidden, so nine of the twelve sections
  sat off-screen with nothing to indicate they existed. It wraps now.
- **Touch targets** below WCAG 2.5.8's 24px on `.arrow-link` (19px), `.tab`
  (32px), `.channel-value` (22px) and the story link (19px) — all raised to
  44px under 900px. One link is left alone: "Contact support." is inline in a
  sentence, which 2.5.8 exempts, and enlarging it would break the line rhythm.


## v60–v63 — photographic heroes, feathered edges, navigation feedback

- **All 15 heroes replaced** with the new WebP set in `assets/heroes/`, wired
  with `srcset` + `sizes` so phones fetch the 700px variant. Referenced assets
  went from ~19 MB to 1.41 MB; the largest single download on any page is now
  83 KB. `width`/`height` are set, so the hero no longer shifts the text.
  `about`, `mobile-office-manager` and `products` had been sharing one
  illustration and now each have their own.
- **Fit.** `contain` letterboxed the photo inside its box, so the corner radius
  clipped the element and the photo's own corners stayed square. Switched to
  `cover`, which needed the box locked to 4:3 first — it was capped by
  `max-height`, giving a 1.77 box against a 1.33 image at 700px, which would
  have cropped a third of the frame. The caps are widths now: 0% crop at every
  breakpoint.
- **Feathered edges.** Two crossed gradient masks dissolve the photo into the
  page rather than ending on a hard rectangle. The subpage media card dropped
  its white fill, border and shadow at the same time, since fading a photo
  into an opaque card just moves the hard edge outwards.
- **Removed the five floating feature cards** over the home hero.
- **Navigation feedback.** A spinning ESS mark (`ess-logo-2026-white.svg` on a
  navy chip) covers the gap between click and swapped content, with a 180ms
  show-delay so prefetched navigations — the common case — never flash it.
  Verified: peak opacity 0 on a prefetched navigation. `<main>` carries
  `aria-busy` while loading, and the new content eases in over 320ms.
- **Fixed a long-standing dead animation.** The enter transition added
  `page-entering` to `<body>` and removed it two frames later, which cancelled
  the animation before it rendered — it had never actually been visible. It is
  now scoped to the swapped `<main>` and cleared on `animationend`.

See `ASSETS.md` for what is left: 47 unused files (57 MB) from the old
illustration sets, and the still-missing social image and favicon.


## v64–v66 — features page

New `features.html`, modelled on servicetitan.com/features: a product hero, a
three-product switcher, then stacked capability bands of heading + subtitle +
card grid. Reachable from Products → **All features** (carrying a "New" badge,
which `tools/nav-config.mjs` now supports via a `badge` field).

**Where the content came from.** Next Level is not on the public site — it is
the new-generation UI of Mobile Office Manager, and it lives in a separate
repo (`nextlevel/MOMAPI`) as 24 `nl_*` design docs plus a side-menu spec and
discovery notes. Those were mined for capabilities, each cited back to the
file that proves it. 163 candidates came out; the 124 marked *shipped* are
what this page draws on. Mobile Service 6.0 and Customer Portal content was
extracted the same way from the existing site.

The adversarial verification pass over those claims **did not complete** — it
hit the session rate limit after the extraction phase. The cards were written
from single-source extractions and reviewed by hand, not double-checked by a
second agent. Worth a read-through before this page goes live.

**Real logo, not a placeholder.** The Next Level prototype referenced a live
URL, so `assets/products/next-level.svg` is the actual mark. A white variant
sits beside it because the wordmark is `#102b5c` and disappears on the navy
footer and CTA strips.

**Fixed along the way**
- `index.html` product pill said "iOS + Android 2.0" while every App Store
  link on the site points at `mobile-service-6-0`. Now 6.0.
- One Mobile Service card credited the app with opening the ticket against the
  right unit; that is a dispatch action, so the card now names dispatch.
- The product hero sat outside the content column (1240px at x=152 against
  1192px at x=176) and its copy started 64px down against ~139px on every
  other hero, crowding the floating header. Both now match.
- The nav dropdown was 98.4% white, which let a dark hero headline read
  through it. Opaque now.



## v67–v78 — rebuilt on the client `index.html`

The client supplied a new `index.html` as the direction for the whole site.
Every page's content now follows it, and the visual system was replaced with
its palette, type and controls. Three decisions were confirmed with the client
before the work started, and they explain most of what changed:

1. **The palette follows the upload completely** — type, buttons, accents.
2. **Four new industry pages** were created, because the upload links to them.
3. **The upload's figures win** where they contradict the old site's.

### Colour, type and controls

Orange is gone. It was the action colour in every earlier layer; the upload has
no orange at all, so `--ess-orange` and the ~110 hard-coded warm values were
swept to the upload's blues. The only warm ink left is the amber used for an
"in progress" status chip, which the upload keeps too.

    --navy-950 #07142A   --blue-600 #1E8FC9   --slate-900 #0A1422
    --navy-900 #0B1B30   --blue-500 #2DA5DA   --slate-700 #324356
    --navy-800 #122944   --blue-400 #4FB8E6   --slate-500 #6B7B8C

Type leads with Inter. Buttons are flat pills: `--blue-500`, hover
`--blue-600`, 15px/600, one box for every variant (no vertical padding, one
`min-height`, flex centring) — four earlier layers had been setting button
padding independently, so a filled button and an outline button in the same row
could differ in height.

**The one contrast exception.** White on `#2DA5DA` is 2.80:1, under AA. A
gradient was tried and rejected: the upload's button is flat and the client
asked for it flat. This replaces the orange exception v56 documented; every
other pair on the site clears AA, including blue used *as* text, which darkens
to `--accent-ink` `#187AA9` (4.78:1 on white).

### Layout

New components, built in ESS tokens rather than by importing the mockup's
sheet: `.op-card` (the hero's live route board), `.outcome-band`, `.trade-grid`,
`.story-panel`, `.persona-grid`, `.voice-grid`, `.tick-list`, `.brand-line`.

Section heads centre over a 760px measure, bands run 80px apart, radii collapse
to the upload's two (22px for a surface, 14px for anything small), and cards are
opaque white with a hairline instead of translucent glass. Onward links under a
band ("See every feature", "Read the customer stories") centre under the heading
they belong to, and the CTA band is one centred navy column.

### Content

`index.html` follows the upload band for band: hero → logo strip → about →
three products → outcomes → industries → customer story → personas →
testimonials → CTA. The hero headline is the client's own — *Your back office.
Your field team. Your customers. One system.* — over the upload's eyebrow.

The *We Solve, You Succeed!* tag line was added, then withdrawn at the client's
request; it appears nowhere on the site now. Every CTA band across the site
carries the same eyebrow, **Book time with us**, since they all carry the same
heading and body — the one exception is `pricing.html`, whose CTA has its own
copy.

Every other page was rewritten to the same content system by one agent and
reviewed by a second. Pages the upload says nothing about — pricing, resources,
support, implementation, free trial, login, the legal pages — keep their
content and only take the new palette.

**Figures.** The only numbers allowed anywhere are now 50% (payroll prep at
Elevator One), 15+ years, 100s of field teams and 9 modules. The old site's
"since 2003", "4,000+ elevators", "1,200+ customers", "53 technicians",
"~70 years", "seven modules" and "twelve industries" are retired — a deliberate
call, since several were more impressive than what replaced them. Mobile Office
Manager is nine modules now (sales, contracts, projects, finance, inventory,
equipment, scheduling, dispatch, analytics), in `js/site.js` and on its page.

### Chrome

Products → **Platform**. Industries became a dropdown carrying the four new
`industry-*.html` pages. The footer is the upload's: a brand block with the
affiliation badges, then Platform / Industries / Company at four links each,
over a flat `--navy-950` panel. Its app-store badges moved out, since the
upload's footer has none.

### Checks

`node tools/sync-layout.mjs --check` passes on all 24 pages. A QA script
(retired figures, dead links, classes with no rule in the sheet, chrome damage,
inline colour, tag balance) reports 0 problems across all 24. Renders were
verified in Chrome at 1440px.

**Not done:** the independent review pass over the 15 rewritten pages was cut
short by rate limits twice. The deterministic checks above all pass, but the
copy on those pages has had one writing pass and one mechanical audit, not a
second editorial read.


## v79–v81 — the client's revisions

Three rounds of client feedback after the rebuild, two of which reverse
earlier decisions in this same pass.

**The orange is back.** v68 and v76 retired it because the upload had none;
the client asked for it again — *"I like the orange with the ESS blue."* So
orange carries action and accent (filled buttons, eyebrows, kickers, arrow
links, list markers, dots) and the blue carries structure (navy headings, blue
links, bars, icons, the headline accent, the big figures). Because the v56
discipline routes every accent-as-text through `--accent-ink` and every brand
fill through `--ess-orange`, setting those two tokens back re-coloured most of
the site in one move.

The contrast ledger reverts with it: `--accent-ink` `#B4530A` is 5.02:1 on
white, so orange used as text passes AA, and white on the filled `#ef6c17` is
3.08:1 — the long-standing brand exception, and once again the only one.

**No floating card.** The client marked the hero's rounded edge and asked for
the flat shell their own design has. The page is white, the heroes and the
footer run the full viewport width with square corners and a straight
`border-bottom`, and their content stays on the shell column. Cards and panels
keep the upload's 22px radius and buttons stay pills — the ask was straight
lines *between sections*, not square cards.

Two rules had to be worked around. `main` carried the whole
`--header-clearance` as padding, which would have stopped the hero's background
short of the top; the clearance sits on the first band's inner padding now.
And v54 zeroes a `.wrap` that is a direct child of a section, so that a
self-padding section cannot inset its content twice — with the bands no longer
padding themselves, their `.wrap` has to carry the column again, at a
specificity that clears that rule.

**"Smart Connections" → "We Solve, You Succeed!"** The platform name is
replaced by the tag line everywhere. Six sentences used the old name as a noun
("Smart Connections for elevator service contractors…"), so those were rewritten
rather than swapped, and the trademark line now reads *Mobile Office Manager™ ·
Mobile Service™ · We Solve, You Succeed!™*.

**Also in this round.** The CTA button row had been capped at 920px by a v46
rule that targets every direct child of a CTA strip, so centring the row inside
that box left it short of the strip's real centre. Every CTA band now carries
the same eyebrow, *Book time with us*, since they all carry the same heading
and body; `pricing.html` keeps its own, because its CTA copy differs.


## v82 — full-width sticky header

The header was a floating pill inset by `--page-edge`. The client's own design
has it flush to the top, the full width of the viewport, with one hairline
under it — and still sticky. So `.site-header` is `position: sticky; top: 0`
with a `border-bottom`, and `.header-inner` is a 68px row on the shell column
with no radius, border, shadow or blur of its own. Scrolling now gives the bar
a shadow instead of shrinking it.

A sticky element still occupies its height in flow, so the bar pushes the
first band down by itself. The `--header-clearance` padding that v81 had put
on the first band is gone; the hero takes ordinary top padding
(`--hero-pad-top`, 44–76px) instead, and `scroll-margin-top` on anchors drops
from the pill's 110px to 84px.

The scroll-progress bar is orange again. It had been caught by the v41 rule
that keeps accents single-colour, which the blue pass rewrote along with
everything else.


## v83–v85 — spacing, and the palette back to main

**The palette is main's again.** The client asked for the ESS blue that was on
`main`, not the upload's brighter one, so `css/site.css` was rebuilt as
main's sheet plus the new layout layers rather than by sweeping values a second
time: the in-place colour edits are gone and every rule main shipped is back
byte-for-byte. The layout layers keep the upload's token *names*, because the
new components reference them, but those names now resolve to ESS values —
`--blue-500` is `#3D9BC7`, `--navy-900` is `#123F55`, `--slate-200` is the
site's `#DCEEF8` hairline. 37 upload-palette literals inside the new layers
were re-pointed the same way, and the two swept hexes in `contact-demo.html`'s
inline SVG were reverted.

One consequence worth knowing: main's home page paints the headline accent
orange, so *One system.* and its underline are orange again rather than blue.
That is main's design, not a side effect — say the word and it goes back to
`--teal-500`.

**One gap per section boundary.** Three separate reports — the CTA sitting on
the footer on Platform, the same on Pricing, and the ESS-U band on Resources
reading further from its neighbours than anything else — turned out to be one
problem measured three ways:

- `.section` pads only its top; `.compact-section` pads top *and* bottom. Two
  compact sections in a row therefore produced 160px where the rest of the site
  had 80. Resources has three in a row.
- A CTA that carries `.callout-strip` on the `<section>` itself is the card and
  the section at once, so the section's 80px landed *inside* the card. Measured
  on `products.html`: 49px of padding at the top, 80px at the bottom, and a 0px
  gap to the footer. A card cannot pad its way to an outer gap, so the padding
  is even now and the rhythm is a margin.
- A band that is nothing but its own heading — the About line on the home page
  — added the head's 44px bottom margin on top of the gap, giving 124px.

Measured at 1440px across eight pages afterwards: every boundary is one
`--section-pad`, and the closing band clears the footer by the same.


## v86 — subpage heroes take the product-hero image treatment

The client pointed at `features.html`'s *"Every capability, across all three
products."* band as the example: the photograph bled across the whole hero and
scrimmed, the copy on the dark side of that scrim, the eyebrow a light chip.
Every other hero was still presenting its photo as a rounded, feathered card in
the right-hand column.

18 heroes now use the example's presentation. It is a presentation change only
— the scrim is the same `rgba(8,32,46)` ramp the product hero already carried,
and each hero keeps its own background declaration underneath; the photo simply
covers it. Done in CSS, so no page markup moved.

Scoped with `:has(.subhero-media img)`, so the four heroes without a photograph
— the contact hero, both legal pages and coming-soon — are untouched and stay
light.

Two things had to be unpicked. `.subhero-media` carries `.rv`, the
reveal-on-scroll hook, which starts it transparent — a background cannot wait
for an observer, so it is forced visible. And the absolutely-positioned media
was resolving against `.subhero-inner`, which an earlier layer positions for
its own decoration, so the photo stopped at the 1240px column instead of
bleeding: the inner row goes `static` for these heroes and the copy keeps its
stacking with `position: relative`.

`about.html` was the one hero with no kicker of its own — the tag line that had
been there was withdrawn earlier — so it gets an *About ESS* eyebrow to match
the rest.

Measured on the scrim: white heading 16.0:1, lede 11.8:1, chip ink on the chip
7.2:1.


## v87 — favicon, and a side inset for CTA sections on small screens

**The tab icon is the round ESS mark.** It had been pointing at
`assets/ess-logo-2026.svg`, the 154.8x78.33 full wordmark, which squashes into
a 16px tab as an unreadable smudge. `assets/favicon.svg` is now a `#123F55`
circle carrying the swirl and the ESS lettering in white, on a square 64
viewBox — built from the production logo's own path data (the three arcs plus
the three letters, lifted out and recoloured), so it is the real mark and not a
redraw. `favicon-32.png`, `favicon-16.png` and `apple-touch-icon.png` (180) are
rendered from it, and all four are declared on all 24 pages.

The lettering keeps the mark's native proportions. A version with the letters
optically enlarged for small sizes was tried and dropped: at 180px the second S
crowded the ring, and at 16px it bought almost nothing.

**CTA sections needed a side inset below the column.** `.callout-strip` and
`.pricing-cta` sit on the `<section>`, so the dark card and the section are one
box. Above 1240px the section is capped at `--shell` and centred, which leaves
page margin either side of the card; below that the section is 100% wide, so
the card ran edge to edge and the copy sat against the screen. Measured on a
390px viewport afterwards: the card is inset by the 16px gutter on both sides,
with its own 16px padding inside that.


## v88 — mobile header, and a transparent favicon

**The favicon is the mark on a transparent ground.** The navy disc with white
lettering from v87 was dropped at the client's request, so the icon is the ESS
mark in the logo's own colours — arcs in `#54A8CC` / `#60C0E4` / `#9CD8F0`,
lettering in `#3C3C3C`. White lettering is not an option without a dark plate
behind it, so it went back to the logo's grey. `apple-touch-icon.png` keeps an
opaque white plate, since iOS composites a touch icon onto black. The trade-off
to know: on a dark tab bar the lettering recedes and the ring carries the
identification alone.

**The mobile bar keeps the CTA, and the panel drops flush.** Three defects, one
cause each:

- The Book a demo CTA was only reachable inside the open menu. It could not be
  pulled into the bar with CSS: the panel animates with `opacity`, and no
  descendant escapes an ancestor's opacity. So `tools/render-header.mjs` moves
  `.header-actions` out of `.header-menu-content` and the toggle to last.
  Desktop is untouched, because `.header-menu-content` is `display: contents`
  there and the nav and actions are flex children of `.header-inner` either
  way. Log in and the phone move into the panel as `.header-panel-actions`,
  shown only below 900px, so exactly one copy of each link is ever in the
  accessibility tree.
- **The logo vanished and the toggle left the screen.** `.header-actions` still
  carried the full-width grid it had as a stacked block inside the menu — 358px
  on a 390px screen — and `.btn-header` still had the `width: 100%` the base
  sheet gives it below 430px. The logo was the only shrinkable item in the row,
  so it absorbed the overflow down to zero width. Both are content-width in the
  bar now.
- **The toggle jumped when the menu opened.** A `.menu-open` rule gives
  `.header-actions` `order: 4`, which put it after the toggle. The bar's order
  is set explicitly in both states.

Measured at 390px: logo 16–87, CTA 210–320, toggle 330–374, identical open and
shut, and the panel spans 0–390 flush to both edges. Verified at 320, 390 and
768px.


## v89 — one bar height, and hidden scrollbars

**The bar no longer resizes when the menu opens.** It went 69px → 63px,
because a v37-era rule — `.option-air .site-header.menu-open .header-inner`,
specificity (0,4,0) with `!important` — outranked the (0,2,0) rule v82 used to
set the flat bar's height, and it only applies while the menu is open. The bar
is pinned to one height in the shut, open and scrolled states at a specificity
that clears it. Measured: 69px in every state, at 390px and at 1440px.

**Scrollbars are hidden site-wide**, at the client's request: `scrollbar-width:
none` plus the WebKit pseudo-element on `html`/`body` and on the panels that
scroll inside the page (the mobile menu, the legal table of contents, the
module tabs, the logo row). Scrolling itself is untouched — wheel, touch,
keyboard and anchor jumps all work, and the orange scroll-progress bar at the
top of the page still shows position, which is the reason hiding the native
track is tolerable here. Verified that the document width now equals the window
width at both 390px and 1440px, i.e. no track is reserving space.


## v90 — the tab icon kept showing the old version

The markup was right: all 24 pages pointed at `assets/favicon.svg` and the
files on disk were the current mark. `js/router.js` was not the cause either —
it updates the title and the meta description on a content swap and never
touches the icon links.

It was the browser's favicon cache, which is separate from the ordinary HTTP
cache and far more stubborn. `assets/favicon.svg` had been rewritten twice at
the same URL, so the browser kept serving whichever version it had stored
first.

Each icon href now carries `?v=<first 8 of the file's sha1>`, and
`tools/sync-layout.mjs` maintains it: change an icon, run the tool, and every
page points at a URL the browser has never seen. The stamp is content-derived,
so re-running the tool with unchanged icons is a no-op and `--check` stays
clean.

Two things to expect even so. A tab that is already open may hold the old icon
until it is hard-reloaded, because the stale entry belongs to that tab rather
than to the URL. And over `file://` Chrome's favicon handling is unreliable
regardless of the URL — check the icon over `python3 -m http.server`, not by
double-clicking the file.


## v91 — one dark, orange accents, no stray blue

Driven by a colour audit rather than by reading the sheet: every text and
background colour actually painted on six pages was collected from the browser
and grouped by frequency. That found all three of the things the client asked
for, and two leftovers nobody had reported.

**One dark.** The footer was `--navy-950` (#0B3046) while the dark panels were
four different navies — #0B3046 on the outcomes band, #123F55 on the CTA strips
and the story panel, #1A5772 as the CTA gradient's second stop, #0b2a3a on the
product hero — plus #123F55 on the small chips. Every dark surface is the
footer's navy now, including the photo-hero scrims, so the audit reports one
dark background and not five.

**The vivid blues are orange.** #5BBDE4, #3D9BC7 and #9CD8F0 were still
carrying decoration: the footer phone, the industry tags and badges, the quote
mark, the hero pips and the big figures. All orange.

Left blue deliberately, and worth knowing: the op-card's progress bars and its
"Dispatched" chip. That card is a simulated product screen, so those are data
rather than decoration — orange there would read as a warning on every row. The
footer's ink ramp (#9DB3C8 / #7E94AA) also stays, since it is the readable
slate the client's own footer uses, not an accent.

**Stray blue text.** #5C7483, #5F7482, #516B7C and `--glass-navy` (#0D3550)
were blue-tinted greys and near-navies left from earlier passes, on about 55
nodes of body copy. They join the grey ramp and the one navy. `.flow-list` was
also drawing its dividers in a one-off #CEE6F0 instead of the site's hairline.

**One bug found on the way.** The big figures rendered as solid orange blocks
with invisible glyphs. `!important` on a `background` shorthand carries to its
longhands, so it reset `background-clip` to `border-box` and outranked a plain
`background-clip: text`. The clip and the text-fill need `!important` too.

Contrast re-checked on every new pair: nothing below AA-large, and the only
sub-AA value is the documented white-on-orange button.


## v92 — the dark surface is main's footer colour

The client asked for the footer colour from `main`, applied to every section.
The declaration that wins the cascade there is

    .ess-glass-site .site-footer { background: rgba(13,53,76,.94) }

which composites to **#1B4157** over the page ground. That is now
`--surface-dark`, and the footer, the CTA strips, the outcomes band, the story
panel, the industry cards, the product hero and every small navy chip all read
from it — so they are the same colour by construction rather than by four rules
happening to agree.

It is held as a solid rather than as the original translucent value. A
translucent panel shifts with whatever is behind it, and these panels sit on
white, on the tinted hero and over photographs. The photo scrims keep an rgba
ramp of the same colour, because a scrim has to let the picture through.

Contrast re-measured against the new, lighter dark: white 10.8:1, the eyebrow
tint 5.9:1, the footer ink 5.0:1, the badge ink 6.9:1, body copy 7.7:1. The
footer's meta line had been tuned for a darker ground and fell to 3.45:1, so it
lightens to #96ACBF (4.61:1). The dark end of the figure gradient sits at
3.52:1, which is AA-large — it is only ever used at 40px and above.


## v93 — the numbered list is one panel again

`.flow-list` and `.principle-list` are built as a panel whose own background
shows through narrow gaps to draw the dividers between rows. A glass-era rule
had made the rows 80% white and given them an 18px radius, and widened the gap
to 10px — so instead of a hairline, the parent's pale blue showed both in the
gaps *and* straight through the rows, framing every line in blue.

The rows are opaque and square-edged again and the gap is one pixel, so the
component reads as a single white panel with dividers, which is what the markup
describes. It appears on ten pages; the two shapes (`01`-numbered steps and
label/description rows) both come out clean.


## v94 — the header and the menu panel join the scheme

The colour passes had covered the page but not the chrome. An audit of the
header in both states, desktop and with the panel open, found it still on the
old palette:

| | was | now |
|---|---|---|
| `.nav-link`, `.nav-parent`, `.nav-caret` | `#315B6E` / `#31596D` | `--grey-700`, navy when active |
| active / hover highlight | `rgba(91,189,228,.11)` | `rgba(239,108,23,.10)` |
| `.nav-sub-badge` (NEW, PRIMARY) | `#7FD0F0` plate | `#FFEBD9` plate, `#8F3F06` ink |
| `.nav-panel-blurb` | `#6C8494` | `--grey-500` |
| `.header-login` | `#345A6B` | `--navy` |
| `.menu-toggle` | `rgba(238,247,251,.88)` | neutral chip, `--surface-dark` bars |

Contrast on the new pairs: nav ink 11.0:1, active ink on the warm highlight
10.1:1, badge ink on its plate 6.3:1, blurb 5.9:1, sub-description 7.6:1.

The dropdown blurb also lost the tag line. The earlier "Smart Connections →
We Solve, You Succeed!" pass had put it there, where `.nav-panel-blurb`
uppercases it and it appeared on every one of the 24 pages — against the
earlier instruction that the tag line belongs on the home hero. The blurb is
just its description now. It still appears in the footer brand block and the
trademark line, which is where that pass intended it.


## v95–v97 — the accents the earlier passes missed

`.product-pill` was still `#7fd0f0`, which prompted a full sweep instead of
another spot fix. Two audits were run:

1. **An HSL scan of the whole sheet** — every colour literal converted to HSL
   and flagged if hue 178–235°, saturation ≥ .33, lightness .22–.82. It found
   109 vivid-blue declarations, most already overridden by a later layer.
2. **A render audit of all 24 pages** — every element's computed colour,
   background, border, outline and gradient stops collected from the browser
   and matched against the same test, so only what actually paints is reported.

What was still on the old palette, and is not now:

| | was |
|---|---|
| `.product-pill` | `#7fd0f0` plate |
| `.product-switch-card.is-current` | `rgba(59,170,214,.5)` border |
| `.advantage::before` (the Why-ESS rules) | `#62bade` |
| `.nav-panel` left bar, `.nav-sub.is-active` | `rgba(91,189,228,.28/.16)` |
| `.chain-card` borders, `.chain-step` chip | `rgba(156,216,240,…)` |
| `.footer-title` underline | `rgba(156,216,240,.16)` |
| `.trade-card.is-primary` border | `rgba(91,189,228,.22)` |
| focus rings, input focus | `rgba(61,155,199,…)` |
| body links (legal, login, features, demo) | `--teal-600` `#2A7CA3` |
| `.resource-band` | `#164E66` — a dark panel outside the unified set |
| the booking wizard: rail, progress, slot, chip, timeline, badge | `--teal-500` / `--teal-700` |
| `.mock-row` placeholder bars | `#3D9BC7` |

**Still blue, by decision.** The audit will keep reporting these, so they are
listed rather than left to be rediscovered: the pale hero wash
(`rgba(91,189,228,.16)`), which is the page's light ground rather than an
accent; and two simulated product screens — the op-card's progress fills and
the `.mock-chart` bars — where the blue is standing in for data. A chart drawn
entirely in the CTA colour reads as an alert.

Also in this pass: the **"Explore …" link in each product card sits on the
card's bottom edge**, level across the row, instead of wherever its own tick
list happened to end. `.product-card` becomes a flex column so the link can
take `margin-top: auto`, which is how `.feature-page-card` already worked.


## v98 — the booking page keeps its original colours

The client asked for the demo page's own palette back. Rather than re-type the
old values from memory, `contact-demo.html` now carries a `demo-page` body
class and the v97 accent overrides are scoped `:not(.demo-page)` — so the rules
already in the sheet apply again and the page is exactly what it was. The step
badge, the progress rail, the timeline numbers, the slot times, the chips and
the live dot are back in the ESS blue.

The brand CTA is untouched: **Continue** and **Book a demo** were orange before
this pass and still are. So is `STEP 1 OF 3`, which takes its colour from the
v56 eyebrow rule that predates all of this.

Two things on that page are deliberately *not* reverted, because they belong to
the sitewide system rather than to this section: the focus ring on its form
fields, and body links inside its FAQ answers.

Scoping it to a body class rather than editing the v97 block back out means the
rest of the site keeps the orange accents, including `.chip` and `.slot` where
they also appear on `features.html`.


## v99 — the client's new hero photographs

The client added an ESS-branded 16:9 hero set to `assets/heroes/`, each file
named after the page or section it is for. Twelve of the nineteen hero slots
now run on it:

| page | new photograph |
|---|---|
| `about.html` | `about-ess` |
| `mobile-office-manager.html` | `mobile-office-manager` |
| `mobile-service.html`, `industry-elevator.html` | `mobile-service` |
| `customer-portal.html` | `customer-portal` |
| `industries.html`, `industry-escalator.html`, `industry-overhead-door.html`, `industry-fire-life-safety.html` | `industries` |
| `customer-stories.html` | `customer-story-elevator-one` |
| `products.html`, `features.html` | `built-for-everyone-in-the-building` |
| `login.html` | `login` |

Six heroes — free trial, GPS route builder, implementation, pricing, resources
and support — keep the v63 photographs, because the new set has no counterpart
for them. (`login` arrived after the first twelve and is included above.)

Each swap also corrects the markup around it. The source is 1672x941 where the
old one was 1000x750, so `width`/`height` and the `srcset` widths are restated
from the real files; `sizes` becomes `100vw`, because since v86 these are
full-bleed band backgrounds rather than 486px cards in the right-hand column;
and the four industry pages lose `loading="lazy"`, which they still carried
from when the photo was a side card and which delays the band's own background.
Alt text is rewritten to describe the new photograph — the old text said
"illustration" for what were already photographs.

**Framing.** v86 fills the band with `object-fit: cover` at a focal point of
`70% 50%`. On a band near 3:1 that crops roughly 21% off a 16:9 source, and the
people in these photographs stand high in the frame, so every hard hat and head
was being cut. A v99 rule moves the focal point to `50% 30%` and is keyed on
`[width="1672"]` — the new set's intrinsic width — so the seven heroes still on
4:3 photographs keep exactly the framing they have today, and pick the rule up
on their own when they are replaced. The selector has to carry v86's own
specificity: `.ess-glass-site main > .subhero:has(.subhero-media img)
.subhero-media img` is (0,4,3) with `!important`, so a shorter selector loses
even with `!important` of its own.

**Weight.** The new files are 102–211 KB against 53–101 KB, roughly double. It
buys sharpness the old set could not deliver: a 1000px-wide source was being
stretched across a band wider than 1440px.

**Not placed.** Three of the ten name a slot that holds no photograph today,
and each is a design decision rather than a swap, so none was invented:
`home-hero` (the home hero's visual slot holds the client index's `.op-card`
dashboard mock), `book-a-demo` (`.contact-hero` is deliberately photoless and
light — v86 excluded it, v98 restored its own colours), and
`outcomes-our-customers-actually-feel` (the Outcomes band is a figure grid with
no image container).

The eight replaced files are kept on disk rather than deleted, so the swap is
reversible in one edit. `ASSETS.md` carries the full mapping.


## v100 — the header's frosted glass belongs to the bar, not to the column

The header bar read as three vertical strips: a lighter middle with a greyer
band either side of it, the seam landing exactly on the shell edges. It only
showed once the page was scrolled, because at the top of a page there is
nothing behind the header for it to treat differently.

The header markup is a full-width `<header class="site-header">` wrapping a
`<div class="wrap header-inner">`, and `.wrap` caps that child at the 1240px
shell. Two rules that both predate v82 were painting the glass on the child
instead of the bar:

| line | selector | declaration |
|---|---|---|
| 1537 | `.modern-site .site-header` | `backdrop-filter: none !important` |
| 3450 | `.ess-glass-site .site-header .header-inner` | `backdrop-filter: blur(18px) saturate(118%)` |

v82 already asks for the opposite — blur on `.site-header`, none on
`.header-inner` — and loses both ways: L1537 carries `!important`, and L3450 is
(0,3,0) against v82's (0,2,0), so it wins on specificity despite coming first
in the sheet. So the filter was applied to a 1240px column while the bar
spanning the viewport had none. Outside the shell edges the 85%-white bar showed
the scrolled content through unfiltered; inside them it showed it blurred and
saturated.

To be precise about what was wrong: `.header-inner` never carried a background.
L7335 already set it `transparent !important` and beat the pill-era
`rgba(255,255,255,.80)` and `.76` on source order at equal specificity. The seam
was the *filter alone*, acting on a transparent 1240px box over the bar's own
85% white — which is why the middle read lighter and more saturated rather than
a different colour.

v100 puts the filter back on `.site-header` and takes filter and background off
`.header-inner`; the background there is defensive, keeping any future one off
the column. It also covers `.is-small`, whose `!important` rule — L1541,
`.modern-site .site-header.is-small` — has to be matched at (0,3,0) and beaten
on source order. `.menu-open` is listed alongside it for readability only: L1541
names no other state, so the first selector's (0,2,0) already wins there.

Only the full-width element paints, so a vertical seam is no longer
expressible. The sheet already does exactly this one band further down: L6966
puts the logo bar's white and hairlines on `main > .trust` and L6971 strips them
off `.trust-inner`. The header was the one place that had drifted.

**On the flicker this once fixed.** L1537 sits in a block titled "header scroll
stability" that dropped the filter to stop repaint flicker on what was then a
floating pill. Its stabilisers are untouched and still apply to the same
element: `transform: translateZ(0)`, `backface-visibility: hidden`,
`transition: none`.

**Checked for collateral damage.** `transform: translateZ(0)` already made the
header a stacking context *and* a containing block for fixed-position
descendants, so adding `backdrop-filter` changes neither. The four fixed
overlays — `.scroll-progress`, `.back-to-top`, `.page-transition`,
`.route-loader` — are all appended to `document.body` by `js/site.js` and
`js/router.js`, never inside the header, so none of them can be captured by it.
`overflow` on the header resolves to `visible`, so the nav dropdown panels are
not clipped. `top: 0`, `width: 100%`, `margin: 0` and `border-radius: 0` all
still resolve from v82.

**How this was verified.** Headless Chrome does not composite
`backdrop-filter`, so a screenshot can neither show the original seam nor prove
its removal. The diagnosis and the fix were resolved instead by computing the
cascade — every declaration in the sheet that matches the element, ordered by
importance, then specificity, then source order — and confirmed against
`getComputedStyle` in the browser for all three header states. A sweep of every
`.wrap` column on the site (`header-inner`, `footer-grid`, `footer-bottom`,
`subhero-inner`, `trust-inner`, `glass-hero-inner`, `contact-hero-inner`) finds
the header was the only instance of this bug; run against the pre-fix sheet the
same sweep reports it, which is what makes the clean result meaningful.


## v101–v103 — client review: affiliations, and the header logo

Three items from the client's review of the live site.

### Affiliations (v101, v102)

The review crossed out three of the five marks on the live site's Affiliations
row — Elevator Conference of New York, Capterra and TransNational — kept two,
and asked for AEMA (https://aema.com/) to be added. The row is now on the home
page as well, which the client asked for separately.

Two things had to be corrected rather than just edited:

- The rebuild carried no logo row at all. It had turned the affiliation claim
  into text badges in the footer of every page, and two of those badges —
  **NAESA** and **IDA** — appear nowhere in the client's own materials. They
  were invented during the rebuild and are gone from the footer and from
  `about.html`'s copy.
- The organisation's full name is **An Association of Members of the
  Accessibility Equipment Industry**. A web search returned it without
  "Equipment"; the client's own logo file has the full wording, which is what
  the copy now uses.

All three cards carry a real mark, saved under `assets/affiliations/` rather
than hotlinked from the live site's WordPress uploads, which is how the old
markup referenced them. The AEMA logo could not be fetched at all — Cloudflare
answers every path on `aema.com` with 403, favicon included, to curl and to a
headless browser alike, and the Elevator World directory listing does the same
— so the client supplied it directly. Its card is the only one that links out,
since `https://aema.com/` is the one URL they gave.

One name worth recording: the directories list the organisation as the
**Accessibility Equipment Manufacturers Association**, formed 1990. The site's
own title and the logo the client sent both use "An Association of Members of
the Accessibility Equipment Industry", which is what the copy follows, since
that is what their mark prints.

One mark is still unnamed: the red-arc-and-triangle logo the client kept has
no alt text, caption, title or link on the live site, and its WordPress media
record is titled only `logo1a`. It is in the row with neutral alt text pending
a name.

### Header logo (v103)

The client asked for the logo to match their current site and for the bar to
collapse on scroll, but for the bar itself **not** to be as tall as the old
one. The live site renders its logo at 111px (`style="height: 111px"`); the
rebuild resolved to 42px in a bar pinned to 68px, and `initHeader` in
`js/site.js` did nothing but strip `is-small`, so no scroll state existed.

Now: 79px logo in a 100px bar at rest, 42px in a 69px bar once past 28px of
scroll, stepping down to 68/90 below 1100px and 58/84 below 900px.

79px is measured, not guessed. The inline `height: 111px` is not what the live
site renders: screenshotting it at 1440px and taking the ink bounds of the
header region gives an ESS ring of 80x79 and a full lockup of 160x79. The same
measurement against this build gives 79x79 and 156x79 — the 4px of width is the
SVG lockup being fractionally tighter (1.976 against 2.03). The bar stays at
100px against the live site's ~132px, which is the part the client asked not to
copy. The scroll
handler binds once — `initHeader` runs on every router content swap, but the
`<header>` is never replaced, only `<main>` — and re-applies state per swap.

v89 had pinned `.header-inner` to one height across the plain, `.menu-open`
and `.is-small` states, because opening the mobile menu used to resize the
bar. That still holds: the height is now restated per *scroll* state, and
`.menu-open` follows whichever scroll state is current, so the menu still
cannot change it.

**The white logo.** Turning the scroll state on exposed a latent bug the
client spotted immediately: the logo vanished when scrolled. L1264 carries
`filter: brightness(0) invert(1)` on `.modern-site .logo img` *and* on
`.modern-site .site-header.is-small .logo img` — a white-out from when the
scrolled bar was navy (L1255). L1564's `.option-air .logo img { filter: none }`
undid it at (0,2,1), but the `.is-small` arm is (0,4,1) and kept winning. It
had never shown because nothing ever set `is-small`. The missing arm is now
closed.
