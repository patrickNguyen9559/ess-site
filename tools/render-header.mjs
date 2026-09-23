/* ==========================================================================
   ESS — header renderer

   Turns tools/nav-config.mjs into the one header markup every page shares.
   Pure string building: no DOM, no dependencies.
   ========================================================================== */

import { BRAND, NAV, ACTIONS } from './nav-config.mjs';

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Stable id fragment for a nav group, e.g. "Why ESS" -> "why-ess". */
const slug = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const CARET =
  '<svg class="nav-caret" viewBox="0 0 10 6" aria-hidden="true" focusable="false">' +
  '<path d="M1 1.2 5 4.8 9 1.2" fill="none" stroke="currentColor" stroke-width="1.6" ' +
  'stroke-linecap="round" stroke-linejoin="round"/></svg>';

/**
 * @param {string} current  Filename of the page being rendered, e.g. "about.html".
 * @returns {string} the full <header>…</header> markup.
 *
 * `.header-actions` sits OUTSIDE `.header-menu-content` on purpose. The
 * collapsible panel animates with opacity, and an element cannot escape an
 * ancestor's opacity, so anything that has to stay visible in the bar while
 * the menu is shut — the Book a demo CTA on a phone — cannot live inside it.
 * On desktop `.header-menu-content` is `display: contents`, so the nav and the
 * actions are flex children of `.header-inner` either way and the row is
 * unchanged.
 *
 * `.header-panel-actions` carries Log in and the phone inside the panel for
 * phones, where the bar only has room for the CTA. It is display:none above
 * 900px and the bar's copies are display:none below it, so exactly one of each
 * link is ever in the accessibility tree.
 */
export function renderHeader(current) {
  const nav = NAV.map((item) => renderItem(item, current)).join('\n      ');

  return `<header class="site-header" data-header>
  <div class="wrap header-inner">
    <a href="${esc(BRAND.href)}" class="logo"><img src="${esc(BRAND.logo)}" alt="${esc(
      BRAND.alt,
    )}" width="${BRAND.width}" height="${BRAND.height}"></a>
    <div class="header-menu-content">
      <nav class="main-nav" aria-label="Main">
      ${nav}
      </nav>
      <div class="header-panel-actions">
        <a class="header-login" href="${esc(ACTIONS.login.href)}"${
          current === ACTIONS.login.href ? ' aria-current="page"' : ''
        }>${esc(ACTIONS.login.label)}</a>
        <a class="header-phone" href="${esc(ACTIONS.phone.href)}">${esc(ACTIONS.phone.label)}</a>
      </div>
    </div>
    <div class="header-actions">
      <a class="header-phone" href="${esc(ACTIONS.phone.href)}">${esc(ACTIONS.phone.label)}</a>
      <a class="header-login" href="${esc(ACTIONS.login.href)}"${
        current === ACTIONS.login.href ? ' aria-current="page"' : ''
      }>${esc(ACTIONS.login.label)}</a>
      <a class="btn-header" href="${esc(ACTIONS.cta.href)}"${
        current === ACTIONS.cta.href ? ' aria-current="page"' : ''
      }>${esc(ACTIONS.cta.label)}</a>
    </div>
    <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" data-menu-toggle><span></span><span></span><span></span></button>
  </div>
</header>`;
}

function renderItem(item, current) {
  const kids = item.children || [];
  const self = item.href === current;

  if (!kids.length) {
    return (
      `<a class="nav-link${self ? ' is-active' : ''}" href="${esc(item.href)}"` +
      `${self ? ' aria-current="page"' : ''}>${esc(item.label)}</a>`
    );
  }

  // Active when the parent page itself, or any page inside the group, is open.
  const within = self || kids.some((k) => k.href === current);
  // The parent announces the current page whenever it is the one open. It used
  // to defer to a child that pointed at the same page, but the panel no longer
  // marks anything while the group's own page is open, so deferring would leave
  // the nav with no aria-current at all.
  const owns = self;
  const id = `nav-panel-${slug(item.label)}`;
  const labelId = `nav-label-${slug(item.label)}`;

  // A `standout` child is the way out of the panel, not one of its entries. It
  // is lifted into the panel's head row and sits at the right edge, opposite
  // the blurb, so the list below reads as one plain column.
  const exit = kids.find((k) => k.standout);
  const listed = kids.filter((k) => !k.standout);

  const subs = listed
    .map((k) => {
      // When the group's own landing page is open, the parent already carries
      // the state. Marking entries inside the panel as well reads as "all of
      // this is selected", which is what a panel full of anchors into the
      // current page looks like. So the panel just lists.
      const on = !self && k.href === current;
      const flag = on ? ' is-active' : '';
      return (
        `<a class="nav-sub${flag}" href="${esc(k.href)}"` +
        `${on ? ' aria-current="page"' : ''}>` +
        `<span class="nav-sub-label">${esc(k.label)}` +
        (k.badge ? `<span class="nav-sub-badge">${esc(k.badge)}</span>` : '') +
        `</span>` +
        (k.desc ? `<span class="nav-sub-desc">${esc(k.desc)}</span>` : '') +
        `</a>`
      );
    })
    .join('\n            ');

  // The client asked for one vertical column, so the two-column `wide` variant
  // is no longer used. Kept out of the markup rather than out of the sheet, so
  // the rule stays available if a panel ever needs it back.
  const wide = '';

  return `<div class="nav-group" data-nav-group>
        <a class="nav-link nav-parent${within ? ' is-active' : ''}" href="${esc(item.href)}"
           id="${labelId}" aria-expanded="false" aria-controls="${id}"${
             owns ? ' aria-current="page"' : ''
           }>${esc(item.label)}${CARET}</a>
        <div class="nav-panel${wide}" id="${id}" role="group" aria-labelledby="${labelId}">
          ${
            item.blurb || exit
              ? `<div class="nav-panel-head">` +
                (item.blurb ? `<p class="nav-panel-blurb">${esc(item.blurb)}</p>` : '<span></span>') +
                (exit
                  ? `<a class="nav-panel-exit" href="${esc(exit.href)}">${esc(exit.label)}` +
                    `<span aria-hidden="true">\u2192</span></a>`
                  : '') +
                `</div>\n          `
              : ''
          }<div class="nav-panel-list">
            ${subs}
          </div>
        </div>
      </div>`;
}
