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

  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;
    // Keep the floating header visually stable while scrolling.
    header.classList.remove('is-small');
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

  var MODULES = [
    {
      name: 'Scheduling & Dispatching',
      benefit: 'Send the right tech, not the next name on the list.',
      pain: 'Dispatch from memory and the truck you send is rarely the closest one. Repeat calls on the same unit get logged as if they were new.',
      bullets: ['Dispatch on technician location', 'Two-way messaging between office and field', 'Repeat-call recognition on the same unit', 'Drag-and-drop tickets on a colour-coded board']
    },
    {
      name: 'Projects & Contracts',
      benefit: 'Find out a job is losing money while you can still fix it.',
      pain: 'On most modernisation jobs the overrun surfaces at close-out, weeks after anything could be done about it.',
      bullets: ['Live job costing against budget', 'Material, labour and other cost tracking', 'Audit trail and timestamps on every change', 'Templates for work you repeat']
    },
    {
      name: 'Customers',
      benefit: 'Every unit, every visit, in one record.',
      pain: 'Service history lives in a filing cabinet, three inboxes and one long-serving dispatcher.',
      bullets: ['Maintenance history per unit', 'Financial transactions by account', 'Multi-site customers handled properly']
    },
    {
      name: 'Sales & CRM',
      benefit: 'Quotes stop going cold because nobody followed up.',
      pain: 'The proposal goes out, the follow-up lands on a sticky note, and the bid is gone.',
      bullets: ['Opportunity tracking', 'Assigned follow-up tasks', 'Quote and proposal generation', 'Won bids convert straight into projects']
    },
    {
      name: 'Inventory & Purchasing',
      benefit: 'Know what is on the truck before the tech is on site.',
      pain: 'Parts get bought twice, or a second trip happens because the first one was short a controller board.',
      bullets: ['Assets across warehouses and locations', 'Full transaction history', 'Purchase orders tied to a project', 'Receive into stock or straight to the job']
    },
    {
      name: 'Finance',
      benefit: 'Bill on the day the work happened.',
      pain: 'Invoices wait on paperwork that is still in a van, and the cash waits with it.',
      bullets: ['Automated recurring billing cycles', 'AP and AR accounts', 'Ledger entries and reports', 'Invoice generation and collection']
    },
    {
      name: 'Reporting',
      benefit: 'The numbers you actually check, on one screen.',
      pain: 'The answer is in the system somewhere; getting it out takes someone half a day.',
      bullets: ['Custom reports', 'Saved dashboards for the figures you watch', 'Internal news for the team', 'Bookmarked sites, documents and reports']
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

    var HINTS = [
      'We never sell this list.',
      'Rough answers are fine.',
      'Pick a slot to continue.'
    ];

    function canContinue() {
      return step < 2 || slot !== null;
    }

    function render() {
      steps.forEach(function (el) {
        el.hidden = Number(el.dataset.step) !== step;
      });
      stepLabel.textContent = 'Step ' + (step + 1) + ' of 3';
      progress.style.width = ((step + 1) / 3 * 100) + '%';
      backBtn.hidden = step === 0;
      nextBtn.textContent = step === 2 ? 'Confirm the demo' : 'Continue';
      nextBtn.disabled = !canContinue();
      if (hint) {
        hint.textContent = (step === 2 && slot)
          ? 'Calendar invite sent on confirm.'
          : HINTS[step];
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

      var rows = [
        ['Who', name + ' · ' + company],
        ['When', slot ? slot.day + ' · ' + slot.time + ' ET' : 'To be confirmed'],
        ['Portfolio', pickedValue(fleetGroup) || 'Not specified'],
        ['Running today', stack.length ? stack.join(', ') : 'Not specified']
      ];

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
      if (step === 2) {
        submit();
      } else {
        step += 1;
        render();
      }
    });

    backBtn.addEventListener('click', function () {
      step = Math.max(0, step - 1);
      render();
    });

    resetBtn.addEventListener('click', function () {
      step = 0;
      confirmPane.hidden = true;
      formPane.hidden = false;
      render();
      form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });

    render();
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
      a.textContent = heading.textContent.replace(/^\d+\.\s*/, '');
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


