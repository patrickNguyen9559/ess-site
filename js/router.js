/* ==========================================================================
   Expert Service Solutions — shared chrome + content-only router

   Two jobs:

   1. Header behaviour — dropdown panels, active-route highlighting.
      The header markup itself is generated from tools/nav-config.mjs and
      stamped into every page by tools/sync-layout.mjs, so it is identical
      everywhere and present in the HTML for crawlers and no-JS visitors.

   2. Navigation — clicking an internal link fetches the target page,
      swaps only <main>, and leaves the header and footer mounted. No
      re-parse of the CSS, no re-run of the header, no flash.

   Progressive enhancement: every page is a complete standalone document.
   If fetch is unavailable, blocked (file://), or fails for any reason, the
   link falls through to an ordinary browser navigation.
   ========================================================================== */

(function () {
  'use strict';

  var doc = document;
  var reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------- utils --- */

  /** Last path segment, e.g. "/site/about.html" -> "about.html". "" -> "index.html" */
  function pageOf(pathname) {
    var file = pathname.split('/').pop();
    return file === '' ? 'index.html' : file;
  }

  function samePage(a, b) {
    return pageOf(a) === pageOf(b);
  }

  /* -------------------------------------------------- active route sync --- */

  function syncActive() {
    var current = pageOf(location.pathname);

    function mark(el, on) {
      el.classList.toggle('is-active', on);
      if (on) el.setAttribute('aria-current', 'page');
      else el.removeAttribute('aria-current');
    }

    // Plain links and dropdown children.
    doc.querySelectorAll('.main-nav .nav-link, .main-nav .nav-sub').forEach(function (el) {
      if (el.classList.contains('nav-parent')) return; // handled below
      mark(el, pageOf(new URL(el.href, location.href).pathname) === current);
    });

    // A dropdown parent is active when its own page or any child page is open.
    doc.querySelectorAll('.main-nav [data-nav-group]').forEach(function (group) {
      var parent = group.querySelector('.nav-parent');
      if (!parent) return;
      var own = pageOf(new URL(parent.href, location.href).pathname) === current;
      var child = Array.prototype.some.call(
        group.querySelectorAll('.nav-sub'),
        function (a) {
          return pageOf(new URL(a.href, location.href).pathname) === current;
        },
      );
      parent.classList.toggle('is-active', own || child);
      // If a child links to the same page, let the child announce it.
      if (own && !child) parent.setAttribute('aria-current', 'page');
      else parent.removeAttribute('aria-current');
    });

    // Header actions.
    doc.querySelectorAll('.header-actions a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (/^(tel:|mailto:)/.test(href)) return;
      if (pageOf(new URL(a.href, location.href).pathname) === current) {
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  /* ------------------------------------------------------ nav dropdowns --- */

  function initDropdowns() {
    var groups = Array.prototype.slice.call(doc.querySelectorAll('[data-nav-group]'));
    if (!groups.length) return;

    // Desktop pointer devices open on hover/focus via CSS. These handlers cover
    // touch and keyboard, where hover does not exist.
    var coarse = window.matchMedia && window.matchMedia('(hover: none)');

    var PANEL_GAP = 10; // breathing room between the header pill and the panel

    /* Position a panel before it is revealed.

       Vertically: the panel is a child of the nav item, but it should hang
       below the whole header pill — the pill is taller than the link because
       of .header-inner's padding, so `top: 100%` alone tucks the panel under
       the header's own edge. Measure the real distance instead of hardcoding
       it, since the pill's height differs between breakpoints and themes.

       Horizontally: panels are centred on their trigger, so the rightmost
       ones would run off screen. Nudge them back inside the viewport. */
    function clamp(group) {
      var panel = group.querySelector('.nav-panel');
      if (!panel || window.innerWidth <= 900) return;

      var pill = group.closest('.header-inner') || group.closest('.site-header');
      if (pill) {
        var drop = pill.getBoundingClientRect().bottom -
          group.getBoundingClientRect().bottom + PANEL_GAP;
        panel.style.setProperty('--nav-panel-top', Math.round(Math.max(drop, PANEL_GAP)) + 'px');
      }

      panel.style.setProperty('--nav-panel-shift', '0px');
      var gutter = 12;
      var box = panel.getBoundingClientRect();
      var shift = 0;
      if (box.right > window.innerWidth - gutter) shift = window.innerWidth - gutter - box.right;
      else if (box.left < gutter) shift = gutter - box.left;
      if (shift) panel.style.setProperty('--nav-panel-shift', Math.round(shift) + 'px');
    }

    /* `dismiss` marks the group as explicitly closed. The panel is otherwise
       held open by CSS :focus-within, which would immediately re-show it when
       Escape returns focus to the trigger. The mark is cleared as soon as the
       pointer or focus leaves the group. */
    function close(group, dismiss) {
      group.classList.remove('is-open');
      if (dismiss) group.classList.add('is-dismissed');
      var parent = group.querySelector('.nav-parent');
      if (parent) parent.setAttribute('aria-expanded', 'false');
    }

    function closeAll(except) {
      groups.forEach(function (g) {
        if (g !== except) close(g);
      });
    }

    function open(group) {
      closeAll(group);
      clamp(group);
      group.classList.remove('is-dismissed');
      group.classList.add('is-open');
      var parent = group.querySelector('.nav-parent');
      if (parent) parent.setAttribute('aria-expanded', 'true');
    }

    groups.forEach(function (group) {
      var parent = group.querySelector('.nav-parent');
      if (!parent) return;

      // The panel is laid out even while hidden, so it can be measured before
      // the CSS hover transition reveals it.
      group.addEventListener('pointerenter', function () {
        clamp(group);
      });
      group.addEventListener('pointerleave', function () {
        group.classList.remove('is-dismissed');
      });
      group.addEventListener('focusin', function () {
        clamp(group);
      });

      parent.addEventListener('click', function (e) {
        var stacked = window.innerWidth <= 900;
        // In the stacked mobile menu every child is already visible, so the
        // parent stays a plain link. On a touch screen at desktop width the
        // first tap reveals the panel instead of navigating.
        if (stacked || !(coarse && coarse.matches)) return;
        if (!group.classList.contains('is-open')) {
          e.preventDefault();
          open(group);
        }
      });

      // Keyboard: opening on focus keeps the panel reachable by Tab.
      parent.addEventListener('focus', function () {
        if (group.classList.contains('is-dismissed')) return;
        if (window.innerWidth > 900) open(group);
      });

      group.addEventListener('focusout', function (e) {
        if (group.contains(e.relatedTarget)) return;
        group.classList.remove('is-dismissed');
        close(group);
      });
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var group = doc.querySelector('[data-nav-group].is-open') ||
        (doc.activeElement && doc.activeElement.closest('[data-nav-group]'));
      if (!group) return;
      var parent = group.querySelector('.nav-parent');
      close(group, true);
      if (parent) parent.focus();
    });

    doc.addEventListener('click', function (e) {
      if (!e.target.closest('[data-nav-group]')) closeAll(null);
    });

    window.addEventListener('resize', function () {
      closeAll(null);
      groups.forEach(function (g) {
        var panel = g.querySelector('.nav-panel');
        if (!panel) return;
        panel.style.removeProperty('--nav-panel-shift');
        panel.style.removeProperty('--nav-panel-top');
      });
    });
  }

  /* ------------------------------------------------------------- router --- */

  var SUPPORTED =
    typeof window.fetch === 'function' &&
    typeof window.DOMParser === 'function' &&
    !!(window.history && history.pushState) &&
    location.protocol !== 'file:'; // fetch() is blocked on file://

  var cache = new Map(); // url (no hash) -> Promise<Document>
  var token = 0; // guards against out-of-order responses

  function load(url) {
    if (cache.has(url)) return cache.get(url);
    var p = fetch(url, { credentials: 'same-origin', headers: { 'X-Requested-With': 'router' } })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (html) {
        return new DOMParser().parseFromString(html, 'text/html');
      })
      .catch(function (err) {
        cache.delete(url); // never cache a failure
        throw err;
      });
    cache.set(url, p);
    return p;
  }

  function scrollToHash(hash) {
    if (!hash) return false;
    var target = doc.getElementById(hash.slice(1));
    if (!target) return false;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    return true;
  }

  /** Replace <main>, page metadata and body classes from the fetched document. */
  function apply(nextDoc, hash) {
    var oldMain = doc.querySelector('[data-page-main]') || doc.querySelector('main');
    var newMain = nextDoc.querySelector('[data-page-main]') || nextDoc.querySelector('main');
    if (!oldMain || !newMain) return false;

    // Body classes carry per-page styling (about-page, legal-page, …).
    var bodyClass = nextDoc.body.getAttribute('class') || '';
    doc.body.setAttribute('class', bodyClass);
    doc.body.classList.add('modern-site');

    doc.title = nextDoc.title;

    var nextDesc = nextDoc.querySelector('meta[name="description"]');
    var thisDesc = doc.querySelector('meta[name="description"]');
    if (nextDesc && thisDesc) thisDesc.setAttribute('content', nextDesc.getAttribute('content'));

    newMain.removeAttribute('aria-busy');
    oldMain.replaceWith(newMain);

    // Inline <script> nodes copied by replaceWith are inert; re-create them.
    newMain.querySelectorAll('script').forEach(function (old) {
      var s = doc.createElement('script');
      Array.prototype.forEach.call(old.attributes, function (a) {
        s.setAttribute(a.name, a.value);
      });
      s.textContent = old.textContent;
      old.replaceWith(s);
    });

    syncActive();

    // Let site.js re-bind everything that lives inside the swapped content.
    doc.dispatchEvent(new CustomEvent('ess:contentswap', { detail: { main: newMain } }));

    if (!scrollToHash(hash)) window.scrollTo(0, 0);

    // Move focus into the new content so screen readers and the keyboard
    // land in the right place instead of staying on the old link.
    newMain.focus({ preventScroll: true });

    /* Drive the enter animation from the new <main> and clear it when it
       finishes. The old approach toggled a class on <body> and removed it two
       frames later, which cancelled the animation before it ever rendered. */
    if (!reduceMotion) {
      newMain.classList.add('is-entering');
      newMain.addEventListener('animationend', function () {
        newMain.classList.remove('is-entering');
      }, { once: true });
    }
    return true;
  }

  function fallback(href) {
    window.location.href = href;
  }

  function navigate(href, opts) {
    opts = opts || {};
    var url = new URL(href, location.href);
    var key = url.origin + url.pathname + url.search;
    var mine = ++token;

    // Remember where we were, so Back can restore the scroll position.
    if (opts.push !== false) {
      history.replaceState({ ess: true, y: window.scrollY }, '', location.href);
    }

    doc.body.classList.add('is-navigating');
    var liveMain = doc.querySelector('[data-page-main]');
    if (liveMain) liveMain.setAttribute('aria-busy', 'true');

    load(key)
      .then(function (nextDoc) {
        if (mine !== token) return; // a newer navigation won
        if (opts.push !== false) history.pushState({ ess: true, y: 0 }, '', url.href);
        if (!apply(nextDoc, url.hash)) fallback(url.href);
      })
      .catch(function () {
        if (mine === token) fallback(url.href);
      })
      .finally(function () {
        if (mine === token) doc.body.classList.remove('is-navigating');
      });
  }

  /** Should this click be handled in-page? */
  function routable(link, e) {
    if (!link || e.defaultPrevented) return null;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
    if (link.target && link.target !== '_self') return null;
    if (link.hasAttribute('download') || link.hasAttribute('data-no-router')) return null;

    var raw = link.getAttribute('href');
    if (!raw || raw.charAt(0) === '#' || /^[a-z][a-z0-9+.-]*:/i.test(raw)) {
      // Absolute scheme (tel:, mailto:, http://…) or a pure in-page anchor.
      if (!raw || raw.charAt(0) === '#') return null;
      var abs = new URL(link.href, location.href);
      if (abs.origin !== location.origin) return null;
    }

    var url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return null;
    if (!/\.html?$/i.test(url.pathname) && !url.pathname.endsWith('/')) return null;

    // Same page: let the browser handle the anchor, or scroll to top.
    if (samePage(url.pathname, location.pathname) && url.search === location.search) {
      if (url.hash) return null;
      return { sameTop: true, url: url };
    }
    return { url: url };
  }

  function initRouter() {
    if (!SUPPORTED) return;
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    history.replaceState({ ess: true, y: window.scrollY }, '', location.href);

    doc.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      var hit = routable(link, e);
      if (!hit) return;

      e.preventDefault();

      if (hit.sameTop) {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        return;
      }
      navigate(hit.url.href);
    });

    window.addEventListener('popstate', function (e) {
      if (!e.state || !e.state.ess) return;
      var y = e.state.y || 0;
      var mine = ++token;
      var url = new URL(location.href);
      var key = url.origin + url.pathname + url.search;

      load(key)
        .then(function (nextDoc) {
          if (mine !== token) return;
          if (!apply(nextDoc, url.hash)) {
            window.location.reload();
            return;
          }
          if (!url.hash) window.scrollTo(0, y);
        })
        .catch(function () {
          if (mine === token) window.location.reload();
        });
    });

    // Warm the cache on intent. Cheap, and makes most clicks feel instant.
    var warmed = new Set();
    function warm(e) {
      var link = e.target.closest && e.target.closest('a[href]');
      var hit = routable(link, { button: 0, defaultPrevented: false });
      if (!hit || hit.sameTop) return;
      var key = hit.url.origin + hit.url.pathname + hit.url.search;
      if (warmed.has(key)) return;
      warmed.add(key);
      load(key).catch(function () {
        warmed.delete(key);
      });
    }
    doc.addEventListener('pointerenter', warm, { capture: true, passive: true });
    doc.addEventListener('focusin', warm, { passive: true });
  }

  /* ------------------------------------------------------- route loader --- */

  /* A spinning ESS mark for the gap between click and swapped content. It is
     mounted once and driven purely by body.is-navigating, and its CSS carries
     a show-delay so a cached navigation (the common case, since links are
     prefetched on hover) completes before it would ever become visible. */
  function mountLoader() {
    if (doc.querySelector('.route-loader')) return;
    var el = doc.createElement('div');
    el.className = 'route-loader';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML =
      '<span class="route-loader-mark">' +
      '<img src="assets/ess-logo-2026-white.svg" alt="" width="34" height="34" decoding="async">' +
      '</span>';
    doc.body.appendChild(el);
  }

  /* ----------------------------------------------------------------- go --- */

  function boot() {
    syncActive();
    initDropdowns();
    mountLoader();
    initRouter();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
