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
        label: 'All features',
        href: 'features.html',
        badge: 'New',
        desc: 'Every capability across Mobile Office Manager, Mobile Service and the portal.',
      },
      {
        label: 'Mobile Office Manager',
        href: 'mobile-office-manager.html',
        desc: 'Nine connected modules — the back-office ERP for service contractors.',
      },
      {
        label: 'Mobile Service',
        href: 'mobile-service.html',
        desc: 'The field app that connects the office to the unit — offline included.',
      },
      {
        label: 'GPS Tracker & Route Builder',
        href: 'gps-route-builder.html',
        desc: 'Dispatch on real technician locations and cut travel time.',
      },
      {
        label: 'Customer Portal',
        href: 'customer-portal.html',
        desc: 'The self-service portal more RFPs are asking for.',
      },
    ],
  },
  {
    label: 'Industries',
    href: 'industries.html',
    blurb: 'Built for elevator. Trusted by the trades next door.',
    children: [
      {
        label: 'Elevator',
        href: 'industry-elevator.html',
        badge: 'Primary',
        desc: 'MCP, category tests, callbacks, modernization and new install.',
      },
      {
        label: 'Escalator & moving walks',
        href: 'industry-escalator.html',
        desc: 'The same unit-level service model and inspection cadence.',
      },
      {
        label: 'Overhead door & dock',
        href: 'industry-overhead-door.html',
        desc: 'Commercial door service, anchored on Hamburg Overhead Door.',
      },
      {
        label: 'Fire & life safety',
        href: 'industry-fire-life-safety.html',
        desc: 'Inspection-driven, code-bound, multi-year contracts.',
      },
      {
        label: 'All industries',
        href: 'industries.html',
        desc: 'Every trade ESS serves, and the pattern they share.',
      },
    ],
  },
  {
    label: 'Why ESS',
    href: 'about.html',
    blurb: 'How ESS works and what it takes to go live.',
    children: [
      {
        label: 'About ESS',
        href: 'about.html',
        desc: 'Over 15 years building software for service contractors.',
      },
      {
        label: 'Customer stories',
        href: 'customer-stories.html',
        desc: 'What changed for teams already running ESS.',
      },
      {
        label: 'Implementation',
        href: 'implementation.html',
        desc: 'Onboarding, data migration and the path to go-live.',
      },
    ],
  },
  {
    label: 'Resources',
    href: 'resources.html',
    blurb: 'Learn the platform and get help.',
    children: [
      {
        label: 'Resources library',
        href: 'resources.html',
        desc: 'Guides, field notes, ESS-U training and news.',
      },
      {
        label: 'Support',
        href: 'support.html',
        desc: 'Help channels, training and technical support.',
      },
      {
        label: 'Free trial',
        href: 'free-trial.html',
        desc: 'Request an evaluation of the platform.',
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
