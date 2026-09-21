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
 */
export function renderHeader(current) {
  const nav = NAV.map((item) => renderItem(item, current)).join('\n      ');

  return `<header class="site-header" data-header>
  <div class="wrap header-inner">
    <a href="${esc(BRAND.href)}" class="logo"><img src="${esc(BRAND.logo)}" alt="${esc(
      BRAND.alt,
    )}" width="${BRAND.width}" height="${BRAND.height}"></a>
    <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" data-menu-toggle><span></span><span></span><span></span></button>
    <div class="header-menu-content">
      <nav class="main-nav" aria-label="Main">
      ${nav}
      </nav>
      <div class="header-actions">
        <a class="header-phone" href="${esc(ACTIONS.phone.href)}">${esc(ACTIONS.phone.label)}</a>
        <a class="header-login" href="${esc(ACTIONS.login.href)}"${
          current === ACTIONS.login.href ? ' aria-current="page"' : ''
        }>${esc(ACTIONS.login.label)}</a>
        <a class="btn-header" href="${esc(ACTIONS.cta.href)}"${
          current === ACTIONS.cta.href ? ' aria-current="page"' : ''
        }>${esc(ACTIONS.cta.label)}</a>
      </div>
    </div>
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
  // When the parent's own page is also listed as a child, the child announces
  // it — two aria-current="page" in one nav is noise for a screen reader.
  const owns = self && !kids.some((k) => k.href === item.href);
  const id = `nav-panel-${slug(item.label)}`;
  const labelId = `nav-label-${slug(item.label)}`;

  const subs = kids
    .map((k) => {
      const on = k.href === current;
      return (
        `<a class="nav-sub${on ? ' is-active' : ''}" href="${esc(k.href)}"` +
        `${on ? ' aria-current="page"' : ''}>` +
        `<span class="nav-sub-label">${esc(k.label)}` +
        (k.badge ? `<span class="nav-sub-badge">${esc(k.badge)}</span>` : '') +
        `</span>` +
        (k.desc ? `<span class="nav-sub-desc">${esc(k.desc)}</span>` : '') +
        `</a>`
      );
    })
    .join('\n            ');

  // Four or more entries read better as two columns than one tall list.
  const wide = kids.length >= 4 ? ' wide' : '';

  return `<div class="nav-group" data-nav-group>
        <a class="nav-link nav-parent${within ? ' is-active' : ''}" href="${esc(item.href)}"
           id="${labelId}" aria-expanded="false" aria-controls="${id}"${
             owns ? ' aria-current="page"' : ''
           }>${esc(item.label)}${CARET}</a>
        <div class="nav-panel${wide}" id="${id}" role="group" aria-labelledby="${labelId}">
          ${item.blurb ? `<p class="nav-panel-blurb">${esc(item.blurb)}</p>\n          ` : ''}<div class="nav-panel-list">
            ${subs}
          </div>
        </div>
      </div>`;
}
