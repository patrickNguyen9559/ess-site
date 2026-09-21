#!/usr/bin/env node
/* ==========================================================================
   ESS — layout sync

     node tools/sync-layout.mjs          rewrite every page
     node tools/sync-layout.mjs --check  fail if any page is out of date

   Replaces the <header> and <footer> of every *.html in the site root with
   the generated header (tools/nav-config.mjs) and the shared footer partial
   (tools/partials/footer.html), and makes sure js/router.js is loaded.

   Pages keep their own <main>, <title>, meta and body classes — only the
   shared chrome is rewritten.
   ========================================================================== */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

import { renderHeader } from './render-header.mjs';
import { NAV, UNLISTED, routeIndex } from './nav-config.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');

const FOOTER = readFileSync(join(ROOT, 'tools/partials/footer.html'), 'utf8').trim();
const ROUTER_TAG = '<script src="js/router.js" defer></script>';
const SITE_TAG_RE = /<script\s+src="js\/site\.js"[^>]*><\/script>/i;

const pages = readdirSync(ROOT)
  .filter((f) => f.endsWith('.html'))
  .sort();

const stale = [];
let changed = 0;

for (const page of pages) {
  const path = join(ROOT, page);
  const before = readFileSync(path, 'utf8');
  let after = before;

  // --- header -------------------------------------------------------------
  const header = renderHeader(page);
  if (!/<header\b[\s\S]*?<\/header>/i.test(after)) {
    console.error(`  !  ${page}: no <header> found, skipped`);
    continue;
  }
  after = after.replace(/<header\b[\s\S]*?<\/header>/i, () => header);

  // --- footer -------------------------------------------------------------
  if (!/<footer\b[\s\S]*?<\/footer>/i.test(after)) {
    console.error(`  !  ${page}: no <footer> found, skipped`);
    continue;
  }
  after = after.replace(/<footer\b[\s\S]*?<\/footer>/i, () => FOOTER);

  // --- router script ------------------------------------------------------
  // Loaded after site.js so the router can drive site.js's content hooks.
  if (!after.includes('js/router.js')) {
    if (SITE_TAG_RE.test(after)) {
      after = after.replace(SITE_TAG_RE, (m) => `${m}${ROUTER_TAG}`);
    } else {
      after = after.replace(/<\/body>/i, `${ROUTER_TAG}</body>`);
    }
  }

  // --- main needs a swap target + a focus target --------------------------
  after = after.replace(/<main(?![\w-])([^>]*)>/i, (m, attrs) => {
    let a = attrs;
    if (!/\bdata-page-main\b/.test(a)) a += ' data-page-main';
    if (!/\btabindex=/.test(a)) a += ' tabindex="-1"';
    return `<main${a}>`;
  });

  if (after !== before) {
    changed += 1;
    stale.push(page);
    if (!CHECK) writeFileSync(path, after);
  }
}

// --- reachability report ---------------------------------------------------
const routed = routeIndex();
const unreachable = pages.filter((p) => !routed.has(p) && !UNLISTED.includes(p));

if (CHECK) {
  if (changed) {
    console.error(`✗ ${changed} page(s) out of date: ${stale.join(', ')}`);
    console.error('  run: node tools/sync-layout.mjs');
    process.exit(1);
  }
  console.log(`✓ all ${pages.length} pages match the generated layout`);
} else {
  console.log(`✓ synced ${pages.length} pages (${changed} rewritten)`);
}

console.log(`  nav: ${NAV.map((n) => n.label + (n.children ? `(${n.children.length})` : '')).join(' · ')}`);
console.log(`  routed from header: ${routed.size} pages · unlisted by design: ${UNLISTED.length}`);
if (unreachable.length) {
  console.log(`  ⚠ not reachable from header or footer config: ${unreachable.join(', ')}`);
}
