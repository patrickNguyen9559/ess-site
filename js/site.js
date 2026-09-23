/* ==========================================================================
   Expert Service Solutions — site behaviour
   Ports the interactive parts of the Claude Design prototypes to vanilla JS.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------ reveal on scroll --- */

  function initReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll('.rv'));
    if (!els.length) return;

    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    els.forEach(function (el, i) {
      el.style.transitionDelay = ((i % 6) * 80) + 'ms';
      io.observe(el);
    });

    // Safety net: if the observer never fires, show everything anyway.
    setTimeout(function () {
      els.forEach(function (el) { el.classList.add('in'); });
    }, 2600);
  }

  /* ----------------------------------------------- stable floating header --- */

  var headerScrollBound = false;

  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;

    // The client's current site carries a tall logo at the top of the page and
    // collapses the whole bar once you start scrolling. `is-small` is the class
    // the sheet sizes both states from; this is what drives it.
    //
    // initHeader runs again on every router content swap, but the <header> is
    // never replaced — only <main> is — so the listener is bound once and the
    // state is simply re-applied on each swap.
    var SHRINK_AT = 28;
    var ticking = false;

    function apply() {
      ticking = false;
      var small = (window.pageYOffset || document.documentElement.scrollTop) > SHRINK_AT;
      header.classList.toggle('is-small', small);
    }

    apply();

    if (!headerScrollBound) {
      headerScrollBound = true;
      window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(apply);
      }, { passive: true });
    }
  }




  /* ----------------------------------------------------- nav scroll spy --- */

  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.main-nav [data-spy]'));
    if (!links.length) return;

    var targets = links.map(function (link) {
      return {
        link: link,
        id: link.getAttribute('data-spy'),
        section: document.getElementById(link.getAttribute('data-spy'))
      };
    }).filter(function (item) { return item.section; });

    if (!targets.length) return;

    function setActive(id) {
      targets.forEach(function (item) {
        var active = item.id === id;
        item.link.classList.toggle('is-active', active);
        if (active) item.link.setAttribute('aria-current', 'location');
        else item.link.removeAttribute('aria-current');
      });
    }

    function update() {
      var header = document.querySelector('[data-header]');
      var headerBottom = header ? header.getBoundingClientRect().bottom : 0;
      // Probe roughly one third into the visible content area. This avoids
      // flipping the menu too early while the previous section still dominates.
      var probe = headerBottom + Math.max(110, (window.innerHeight - headerBottom) * 0.30);
      var active = targets[0].id;

      targets.forEach(function (item) {
        var rect = item.section.getBoundingClientRect();
        if (rect.top <= probe) active = item.id;
      });

      // Near the top of the page, Home always wins.
      if (window.scrollY < 120) active = targets[0].id;
      setActive(active);
    }

    var ticking = false;
    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        update();
        ticking = false;
      });
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    window.addEventListener('hashchange', requestUpdate);
    update();
  }

  /* ------------------------------------------------ mobile navigation --- */

  function initMobileNav() {
    var header = document.querySelector('[data-header]');
    var toggle = document.querySelector('[data-menu-toggle]');
    if (!header || !toggle) return;

    function setOpen(open) {
      header.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    }

    toggle.addEventListener('click', function () {
      setOpen(!header.classList.contains('menu-open'));
    });

    header.addEventListener('click', function (e) {
      if (e.target.closest('a') && window.innerWidth <= 900) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('menu-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (window.innerWidth <= 900 && header.classList.contains('menu-open') && !header.contains(e.target)) {
        setOpen(false);
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setOpen(false);
    });
  }

  /* -------------------------------------------------- module tabs --- */

  /* The nine connected modules of Mobile Office Manager, in the order the
     platform page lists them. Keep this array and the tab buttons on
     mobile-office-manager.html in step — the buttons carry the index. */
  var MODULES = [
    {
      name: 'Sales & CRM',
      benefit: 'Quotes stop going cold because nobody followed up.',
      pain: 'The proposal goes out, the follow-up lands on a sticky note, and the bid is gone to the OEM.',
      bullets: ['Opportunity tracking by building and portfolio', 'Assigned follow-up tasks with owners', 'Quote and proposal generation', 'Won bids convert straight into a contract or project']
    },
    {
      name: 'Contracts',
      benefit: 'The MCP book is a record, not a spreadsheet.',
      pain: 'Coverage, escalators and renewal dates live in three places, so nobody is certain what a customer is actually owed.',
      bullets: ['Contracts built around unit-level equipment', 'Coverage, exclusions and billing cycle on the record', 'Escalation and renewal dates tracked', 'Contract-level profitability, not just revenue']
    },
    {
      name: 'Projects',
      benefit: 'Find out a modernization is losing money while you can still fix it.',
      pain: 'On most modernization jobs the overrun surfaces at close-out, weeks after anything could be done about it.',
      bullets: ['Live job costing against budget', 'Material, labour and other cost tracking', 'Audit trail and timestamps on every change', 'Templates for the installs you repeat']
    },
    {
      name: 'Finance',
      benefit: 'Close the month, not the office.',
      pain: 'Invoices wait on paperwork that is still in a van, and the cash waits with it.',
      bullets: ['Automated recurring billing for maintenance contracts', 'AP and AR accounts', 'Ledger entries and reports', 'Invoice the same day the work is done']
    },
    {
      name: 'Inventory',
      benefit: 'Know what is on the truck before the tech is on site.',
      pain: 'Parts get bought twice, or a second trip happens because the first one was short a controller board.',
      bullets: ['Stock across warehouses, trucks and job sites', 'Full transaction history', 'Purchase orders tied to a project', 'Receive into stock or straight to the job']
    },
    {
      name: 'Equipment',
      benefit: 'Every unit, every visit, in one record.',
      pain: 'Service history lives in a filing cabinet, three inboxes and one long-serving dispatcher.',
      bullets: ['Unit-level records by building and car number', 'Maintenance control programme per unit', 'Category test results and due dates', 'Certificates and sign-offs attached to the unit']
    },
    {
      name: 'Scheduling',
      benefit: 'The inspection calendar stops being a wall chart.',
      pain: 'Category tests and quarterly MCP visits get planned by memory, and the ones that slip are the ones nobody sees.',
      bullets: ['Inspection and MCP calendar by unit', 'Recurring visits generated from the contract', 'Due-soon and overdue surfaced before they bite', 'Crew capacity visible while you plan']
    },
    {
      name: 'Dispatch',
      benefit: 'Send the right tech, not the next name on the list.',
      pain: 'Dispatch from memory and the truck you send is rarely the closest one. Repeat callbacks on the same unit get logged as if they were new.',
      bullets: ['Dispatch on real technician location', 'Two-way messaging between office and field', 'Repeat-callback recognition on the same unit', 'Drag-and-drop tickets on a colour-coded board']
    },
    {
      name: 'Analytics',
      benefit: 'The numbers you actually check, on one screen.',
      pain: 'The answer is in the system somewhere; getting it out takes someone half a day.',
      bullets: ['Custom reports across contracts, units and crews', 'Saved dashboards for the figures you watch', 'Branch and crew performance', 'Bookmarked sites, documents and reports']
    }
  ];

  function initModuleTabs() {
    var tabBar = document.querySelector('[data-module-tabs]');
    if (!tabBar) return;

    var tabs = Array.prototype.slice.call(tabBar.querySelectorAll('[data-module]'));
    var nameEl = document.querySelector('[data-module-name]');
    var benefitEl = document.querySelector('[data-module-benefit]');
    var painEl = document.querySelector('[data-module-pain]');
    var bulletsEl = document.querySelector('[data-module-bullets]');
    var mockEl = document.querySelector('[data-module-mock]');

    function show(index) {
      var m = MODULES[index];
      if (!m) return;

      tabs.forEach(function (tab) {
        tab.setAttribute('aria-selected', String(Number(tab.dataset.module) === index));
      });

      nameEl.textContent = m.name;
      benefitEl.textContent = m.benefit;
      painEl.textContent = m.pain;
      if (mockEl) mockEl.textContent = m.name;

      bulletsEl.textContent = '';
      m.bullets.forEach(function (text) {
        var li = document.createElement('li');
        li.textContent = text;
        bulletsEl.appendChild(li);
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        show(Number(tab.dataset.module));
      });
    });

    // Arrow-key navigation across the tab list.
    tabBar.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var current = tabs.indexOf(document.activeElement);
      if (current === -1) return;
      var next = (current + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].focus();
      show(Number(tabs[next].dataset.module));
      e.preventDefault();
    });
  }

  /* ------------------------------------------------- counting stats --- */

  function initStats() {
    var block = document.querySelector('[data-stats]');
    if (!block) return;

    var nums = Array.prototype.slice.call(block.querySelectorAll('[data-count]'));

    function paint(progress) {
      nums.forEach(function (el) {
        var target = Number(el.dataset.count);
        var prefix = el.dataset.prefix || '';
        var suffix = el.dataset.suffix || '';
        el.textContent = prefix + Math.round(target * progress).toLocaleString('en-US') + suffix;
      });
    }

    var started = false;

    function run() {
      if (started) return;
      started = true;
      var start = performance.now();
      var duration = 1400;
      (function tick(now) {
        var t = Math.min(1, (now - start) / duration);
        paint(1 - Math.pow(1 - t, 3));
        if (t < 1) requestAnimationFrame(tick);
      })(start);
    }

    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      paint(1);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) {
        io.disconnect();
        run();
      }
    }, { threshold: 0.3 });
    io.observe(block);

    setTimeout(function () {
      if (!started) paint(1);
    }, 4000);
  }

  /* --------------------------------------------------------- FAQ --- */

  function initFaq() {
    var list = document.querySelector('[data-faq]');
    if (!list) return;

    var buttons = Array.prototype.slice.call(list.querySelectorAll('.faq-btn'));

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';

        buttons.forEach(function (other) {
          other.setAttribute('aria-expanded', 'false');
          document.getElementById(other.getAttribute('aria-controls'))
            .classList.remove('is-open');
        });

        if (!isOpen) {
          btn.setAttribute('aria-expanded', 'true');
          document.getElementById(btn.getAttribute('aria-controls'))
            .classList.add('is-open');
        }
      });
    });
  }

  /* ---------------------------------------------- demo booking wizard --- */

  function initWizard() {
    var form = document.querySelector('[data-wizard]');
    if (!form) return;

    var formPane = form.querySelector('[data-wizard-form]');
    var confirmPane = form.querySelector('[data-confirm]');
    var steps = Array.prototype.slice.call(form.querySelectorAll('[data-step]'));
    var stepLabel = form.querySelector('[data-step-label]');
    var progress = form.querySelector('[data-progress]');
    var hint = form.querySelector('[data-hint]');
    var backBtn = form.querySelector('[data-back]');
    var nextBtn = form.querySelector('[data-next]');
    var resetBtn = form.querySelector('[data-reset]');
    var summaryEl = form.querySelector('[data-summary]');

    var fleetGroup = form.querySelector('[data-fleet]');
    var stackGroup = form.querySelector('[data-stack]');
    var slotGroup = form.querySelector('[data-slots]');

    var step = 0;
    var slot = null;
    // The booking form went from three steps to one. Everything below reads the
    // step count off the DOM and treats the progress bar, the back button, the
    // hint and the slot picker as optional, so the same handler drives either
    // shape without a second code path.
    var stepCount = steps.length || 1;
    var last = stepCount - 1;

    var HINTS = [
      'We never sell this list.',
      'Rough answers are fine.',
      'Pick a slot to continue.'
    ];

    function canContinue() {
      // A slot only gates the final step when there is a slot picker at all.
      return step < last || !slotGroup || slot !== null;
    }

    function render() {
      steps.forEach(function (el) {
        el.hidden = Number(el.dataset.step) !== step;
      });
      if (stepLabel) stepLabel.textContent = 'Step ' + (step + 1) + ' of ' + stepCount;
      if (progress) progress.style.width = ((step + 1) / stepCount * 100) + '%';
      if (backBtn) backBtn.hidden = step === 0;
      // With one step the button keeps whatever the markup called it.
      if (stepCount > 1) {
        nextBtn.textContent = step === last ? 'Confirm the demo' : 'Continue';
      }
      nextBtn.disabled = !canContinue();
      if (hint) {
        hint.textContent = (step === last && slot)
          ? 'Calendar invite sent on confirm.'
          : (HINTS[step] || '');
      }
    }

    // Single-choice chips (fleet size) and slot buttons.
    function bindSingleChoice(group, selector, onPick) {
      if (!group) return;
      group.addEventListener('click', function (e) {
        var btn = e.target.closest(selector);
        if (!btn || !group.contains(btn)) return;
        group.querySelectorAll(selector).forEach(function (other) {
          other.setAttribute('aria-pressed', String(other === btn));
        });
        onPick(btn);
      });
    }

    bindSingleChoice(fleetGroup, '.chip', function () {});
    bindSingleChoice(slotGroup, '.slot', function (btn) {
      slot = { day: btn.dataset.day, time: btn.dataset.time };
      render();
    });

    // Multi-choice chips (current stack).
    if (stackGroup) {
      stackGroup.addEventListener('click', function (e) {
        var btn = e.target.closest('.chip');
        if (!btn || !stackGroup.contains(btn)) return;
        btn.setAttribute('aria-pressed', btn.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      });
    }

    function pickedValue(group) {
      if (!group) return '';
      var on = group.querySelector('[aria-pressed="true"]');
      return on ? on.dataset.value : '';
    }

    function pickedValues(group) {
      if (!group) return [];
      return Array.prototype.slice
        .call(group.querySelectorAll('[aria-pressed="true"]'))
        .map(function (el) { return el.dataset.value; });
    }

    function buildSummary() {
      var name = form.elements.name.value.trim() || 'Dana Whitfield';
      var company = form.elements.company.value.trim() || 'Southern Elevator';
      var stack = pickedValues(stackGroup);

      var notes = form.elements.notes ? form.elements.notes.value.trim() : '';

      // Only rows that have something to say — the one-step form collects far
      // less than the three-step one did, and blank rows read as broken.
      var rows = [['Who', name + ' · ' + company]];
      if (slot) rows.push(['When', slot.day + ' · ' + slot.time + ' ET']);
      if (pickedValue(fleetGroup)) rows.push(['Portfolio', pickedValue(fleetGroup)]);
      if (stack.length) rows.push(['Running today', stack.join(', ')]);
      if (notes) rows.push(['To cover', notes]);

      summaryEl.textContent = '';
      rows.forEach(function (row) {
        var wrap = document.createElement('div');
        wrap.className = 'summary-row';
        var k = document.createElement('span');
        k.textContent = row[0];
        var v = document.createElement('span');
        v.textContent = row[1];
        wrap.appendChild(k);
        wrap.appendChild(v);
        summaryEl.appendChild(wrap);
      });
    }

    function submit() {
      buildSummary();

      var email = form.elements.email.value.trim();
      form.querySelector('[data-confirm-email]').textContent = email || 'your inbox';
      form.querySelector('[data-confirm-title]').textContent = slot
        ? 'You are booked for ' + slot.day + ', ' + slot.time + ' ET.'
        : 'You are booked.';

      formPane.hidden = true;
      confirmPane.hidden = false;
      confirmPane.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });

      /* TODO(backend): POST the collected fields to the CRM / scheduling
         endpoint here before showing the confirmation. The prototype
         confirms optimistically. */
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!canContinue()) return;
      if (step === last) {
        submit();
      } else {
        step += 1;
        render();
      }
    });

    if (backBtn) {
      backBtn.addEventListener('click', function () {
        step = Math.max(0, step - 1);
        render();
      });
    }

    resetBtn.addEventListener('click', function () {
      step = 0;
      confirmPane.hidden = true;
      formPane.hidden = false;
      render();
      form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });

    render();
  }

  /* --------------------------------------------------- phone formatting --- */

  /* Groups a phone number as it is typed, using the browser's own region.

     National formats are genuinely inconsistent, and a mask applied to the
     wrong country mangles a valid number. So this carries only the formats it
     can state confidently, and any region outside that table is left
     unmasked — the field still accepts the number, it simply is not grouped.
     A value beginning with "+" is never masked either: the caller has said
     what country they are in and it may not be this one.

     `groups` are digit counts; `wrap` puts the first group in brackets. */
  var PHONE_FORMATS = {
    US: { groups: [3, 3, 4], wrap: true, sep: '-', example: '(704) 555-0148' },
    CA: { groups: [3, 3, 4], wrap: true, sep: '-', example: '(604) 555-0148' },
    VN: { groups: [4, 3, 3], sep: ' ', example: '0912 345 678' },
    GB: { groups: [5, 6], sep: ' ', example: '07700 900123' },
    AU: { groups: [4, 3, 3], sep: ' ', example: '0412 345 678' },
    FR: { groups: [2, 2, 2, 2, 2], sep: ' ', example: '06 12 34 56 78' },
    SG: { groups: [4, 4], sep: ' ', example: '8123 4567' },
    IN: { groups: [5, 5], sep: ' ', example: '98765 43210' }
  };

  /* Only for regions the table covers — a timezone map for the whole world
     would be a liability, and the language tag carries the region already in
     almost every case. */
  var ZONE_REGION = {
    'Asia/Ho_Chi_Minh': 'VN',
    'Asia/Saigon': 'VN',
    'Europe/London': 'GB',
    'Europe/Paris': 'FR',
    'Asia/Singapore': 'SG',
    'Asia/Kolkata': 'IN',
    'Asia/Calcutta': 'IN'
  };

  function browserRegion() {
    var tags = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || ''];

    for (var i = 0; i < tags.length; i++) {
      var hit = /[-_]([A-Za-z]{2})(?:[-_]|$)/.exec(tags[i] || '');
      if (hit) {
        var code = hit[1].toUpperCase();
        if (PHONE_FORMATS[code]) return code;
      }
    }

    // A tag like plain "en" carries no region; the timezone may still say.
    try {
      var zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (ZONE_REGION[zone]) return ZONE_REGION[zone];
    } catch (err) { /* Intl unavailable */ }

    return null;
  }

  function initPhoneMask() {
    var fields = document.querySelectorAll('[data-phone-mask]');
    if (!fields.length) return;

    var region = browserRegion();
    var fmt = region ? PHONE_FORMATS[region] : null;

    function format(digits) {
      if (!digits || !fmt) return digits;
      var out = '';
      var at = 0;
      for (var g = 0; g < fmt.groups.length && at < digits.length; g++) {
        var part = digits.slice(at, at + fmt.groups[g]);
        if (g === 0) {
          out += fmt.wrap ? '(' + part : part;
          if (fmt.wrap && part.length === fmt.groups[0]) out += ')';
        } else {
          out += (g === 1 ? (fmt.wrap ? ' ' : fmt.sep) : fmt.sep) + part;
        }
        at += fmt.groups[g];
      }
      return out;
    }

    var maxDigits = fmt
      ? fmt.groups.reduce(function (a, b) { return a + b; }, 0)
      : 0;

    function digitsBefore(value, pos) {
      var n = 0;
      for (var i = 0; i < pos && i < value.length; i++) {
        if (value.charAt(i) >= '0' && value.charAt(i) <= '9') n += 1;
      }
      return n;
    }

    function caretAfter(value, count) {
      if (count <= 0) return 0;
      var seen = 0;
      for (var i = 0; i < value.length; i++) {
        if (value.charAt(i) >= '0' && value.charAt(i) <= '9') {
          seen += 1;
          if (seen === count) return i + 1;
        }
      }
      return value.length;
    }

    Array.prototype.forEach.call(fields, function (el) {
      /* The markup's placeholder is a US example, which is the right no-JS
         fallback for the audience but wrong for anyone else. Show the local
         shape where there is one, and a neutral label where there is not —
         leaving a US number in front of a visitor whose number this code is
         deliberately not formatting would be worse than no example. */
      if (el.placeholder) el.placeholder = fmt ? fmt.example : 'Phone number';

      var lastCount = el.value.replace(/\D/g, '').length;

      el.addEventListener('input', function (e) {
        var raw = el.value;

        // "+" means the caller stated their own country. Leave it be.
        if (raw.charAt(0) === '+' || !fmt) {
          var kept = raw.replace(/[^\d+\s().-]/g, '');
          if (kept !== raw) el.value = kept;
          lastCount = kept.replace(/\D/g, '').length;
          return;
        }

        var caret = typeof el.selectionStart === 'number' ? el.selectionStart : raw.length;
        var before = digitsBefore(raw, caret);
        var digits = raw.replace(/\D/g, '').slice(0, maxDigits);

        /* Backspacing onto a bracket, space or dash removes only that
           character, so the digits are unchanged and the caret would bounce
           straight back. Take the digit in front of it instead. */
        if (e.inputType === 'deleteContentBackward' && digits.length === lastCount && before > 0) {
          digits = digits.slice(0, before - 1) + digits.slice(before);
          before -= 1;
        }

        el.value = format(digits);
        lastCount = digits.length;
        var pos = caretAfter(el.value, before);
        try { el.setSelectionRange(pos, pos); } catch (err) { /* not a text input */ }
      });
    });
  }

  /* ------------------------------------------- coming soon page label --- */

  function initComingSoon() {
    var label = document.querySelector('[data-page-label]');
    if (!label) return;

    var page = new URLSearchParams(window.location.search).get('page');
    if (!page) return;

    label.textContent = page;
    document.title = page + ' — coming soon — Expert Service Solutions';
  }

  /* ----------------------------------------------- legal page contents --- */

  function initLegalToc() {
    var toc = document.querySelector('[data-legal-toc]');
    var content = document.querySelector('.legal-content');
    if (!toc || !content) return;

    toc.textContent = '';  // idempotent: the router may run this again
    Array.prototype.forEach.call(content.querySelectorAll('section[id]'), function (section) {
      var heading = section.querySelector('h2');
      if (!heading) return;
      var a = document.createElement('a');
      a.href = '#' + section.id;
      // A long heading makes a poor rail entry. data-toc-label lets a section
      // keep the client's full wording in the <h2> and a short one in the rail.
      a.textContent = section.getAttribute('data-toc-label')
        || heading.textContent.replace(/^\d+\.\s*/, '');
      toc.appendChild(a);
    });
  }

  /* --------------------------------------------------------------- go --- */

  /* Behaviour that lives inside <main>. js/router.js replaces that element on
     every navigation, so this has to run again each time. Everything it binds
     is scoped to nodes inside the new content, so nothing leaks. */
  function initContent() {
    initReveal();
    initScrollSpy();
    initModuleTabs();
    initStats();
    initFaq();
    initWizard();
    initComingSoon();
    initLegalToc();
    initPhoneMask();
  }

  /* Behaviour attached to the header, body or window. The router keeps those
     mounted, so this runs exactly once per full document load. */
  function initChrome() {
    initHeader();
    initMobileNav();
  }

  function init() {
    initChrome();
    initContent();
  }

  document.addEventListener('ess:contentswap', initContent);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ======================================================= MODERN EDITION === */
(function () {
  'use strict';
  document.body.classList.add('modern-site', 'page-entering');
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.remove('page-entering'); });
  });

  /* Navigation itself is handled by js/router.js, which swaps <main> in place
     and leaves the header and footer mounted. The old handler here forced a
     full document load on every link, which is exactly what we no longer want. */
})();

// Visual scroll progress
(() => {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  let ticking = false;
  const update = () => {
    const doc = document.documentElement;
    const maxScroll = Math.max(0, doc.scrollHeight - doc.clientHeight);
    const progress = maxScroll ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    bar.style.transform = `scaleX(${progress})`;
    ticking = false;
  };
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', onScroll, { passive: true });
  // A swapped page is a different height, so the bar has to be recalculated.
  document.addEventListener('ess:contentswap', update);
  update();
})();

// Back to top control
(function () {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.setAttribute('title', 'Back to top');
  document.body.appendChild(btn);

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateBackToTop() {
    btn.classList.toggle('is-visible', window.scrollY > Math.max(420, window.innerHeight * 0.55));
  }

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  window.addEventListener('scroll', updateBackToTop, { passive: true });
  window.addEventListener('resize', updateBackToTop, { passive: true });
  document.addEventListener('ess:contentswap', updateBackToTop);
  updateBackToTop();
})();


