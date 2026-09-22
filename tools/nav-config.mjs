/* ==========================================================================
   ESS — site route table (SINGLE SOURCE OF TRUTH)

   Edit this file to change the header. Nothing else.
   Then run:  node tools/sync-layout.mjs
   which stamps the generated header + shared footer into every *.html page.

   `href` values are the real page files. Keep them relative — the site is
   served from the folder root and is also openable over file://.
   ========================================================================== */

export const BRAND = {
  href: 'index.html',
  logo: 'assets/ess-logo-2026.svg',
  alt: 'Expert Service Solutions',
  width: 155,
  height: 78,
};

/* Top-level nav. `children` renders a dropdown panel on desktop and an
   indented group inside the mobile menu. A parent is still a real link. */
export const NAV = [
  {
    label: 'Home',
    href: 'index.html',
  },
  {
    label: 'Platform',
    href: 'products.html',
    blurb: 'Office, field, routing and customer self-service.',
    children: [
      {
        label: 'How the platform works',
        href: 'features.html',
        desc: 'A tour of every screen.',
      },
      {
        label: 'Mobile Office Manager',
        href: 'mobile-office-manager.html',
        desc: 'The back-office ERP.',
      },
      {
        label: 'Mobile Service',
        href: 'mobile-service.html',
        desc: 'The field app, offline included.',
      },
      {
        label: 'GPS Tracker & Route Builder',
        href: 'gps-route-builder.html',
        desc: 'Live locations, shorter routes.',
      },
      {
        label: 'Customer Portal',
        href: 'customer-portal.html',
        desc: 'Self-service for your customers.',
      },
    ],
  },
  {
    label: 'Features',
    href: 'all-features.html',
    blurb: 'Nineteen capabilities, on one database.',
    children: [
      {
        label: 'Multi Branch and Sites',
        href: 'all-features.html#multi-branch',
        desc: 'Many branches, one database.',
      },
      {
        label: 'Cora AI Assistant',
        href: 'all-features.html#cora-ai',
        badge: 'New',
        desc: 'The assistant built into ESS.',
      },
      {
        label: 'Mobile Service FMS',
        href: 'all-features.html#mobile-service',
        desc: 'Capture the job at the unit.',
      },
      {
        label: 'Dispatch and Scheduling',
        href: 'all-features.html#dispatch',
        desc: 'One board for the day.',
      },
      {
        label: 'GPS Tracking',
        href: 'all-features.html#gps-tracking',
        desc: 'Dispatch on real positions.',
      },
      {
        label: 'View all features',
        href: 'all-features.html',
        standout: true,
        desc: 'All nineteen, in one list.',
      },
    ],
  },
  {
    label: 'Industries',
    href: 'industries.html',
    blurb: 'Built for elevator, and the trades beside it.',
    children: [
      {
        label: 'Elevator',
        href: 'industry-elevator.html',
        badge: 'Primary',
        desc: 'MCP, tests, callbacks, mods.',
      },
      {
        label: 'Escalator & moving walks',
        href: 'industry-escalator.html',
        desc: 'Same units, same cadence.',
      },
      {
        label: 'Overhead door & dock',
        href: 'industry-overhead-door.html',
        desc: 'Commercial door and dock.',
      },
      {
        label: 'Fire & life safety',
        href: 'industry-fire-life-safety.html',
        desc: 'Inspection-driven contracts.',
      },
      {
        label: 'All industries',
        href: 'industries.html',
        desc: 'Every trade ESS serves.',
      },
    ],
  },
  {
    label: 'Why ESS',
    href: 'about.html',
    blurb: 'Who we are and how you go live.',
    children: [
      {
        label: 'About ESS',
        href: 'about.html',
        desc: '15+ years in elevator.',
      },
      {
        label: 'Customer stories',
        href: 'customer-stories.html',
        desc: 'What changed for real teams.',
      },
      {
        label: 'Implementation',
        href: 'implementation.html',
        desc: 'Data, training, go-live.',
      },
    ],
  },
  {
    label: 'Pricing',
    href: 'pricing.html',
  },
];

/* Right-hand header actions. */
export const ACTIONS = {
  phone: { label: '1 (888) 596-9481', href: 'tel:+18885969481' },
  login: { label: 'Log in', href: 'login.html' },
  cta: { label: 'Book a demo', href: 'contact-demo.html' },
};

/* Pages that exist but are intentionally not in the nav. Listed so
   sync-layout.mjs can report genuinely unreachable pages instead of
   flagging these every run. */
export const UNLISTED = [
  'contact-demo.html', // reached via the header CTA
  'login.html', // reached via the header Log in action
  'coming-soon.html', // placeholder target
  'privacy-policy.html', // footer
  'terms-of-use.html', // footer
  'resources.html', // footer, Company column
  'support.html', // footer, Company column
  'free-trial.html', // reached from the "Start a free trial" CTA on 13 pages
];

/* ---- derived helpers, shared by the generator and the browser router ---- */

/** Every page a nav entry points at, mapped to its top-level label. */
export function routeIndex() {
  const index = new Map();
  for (const item of NAV) {
    index.set(item.href, item.label);
    for (const child of item.children || []) {
      if (!index.has(child.href)) index.set(child.href, item.label);
    }
  }
  return index;
}
