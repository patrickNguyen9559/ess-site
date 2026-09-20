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
    js/site.js         Reveal-on-scroll, sticky header, module tabs,
                       stat counter, FAQ accordion, booking wizard
    assets/            Logos (colour + white)

## Notes

- Fonts load from Google Fonts (Plus Jakarta Sans). Offline, the browser
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
