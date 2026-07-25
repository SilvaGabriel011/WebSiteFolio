/* DEMO.router — hash routing + app chrome (topbar, sidebar nav, mobile tab
   bar, consumer header). Classic script, loaded LAST; the inline boot script
   in index.html calls DEMO.router.start() after DEMO.store.init(slug).

   Routing: '#/section/rest...' → DEMO.routes[section].render(mainEl, parts)
   where parts is the remaining segments array ('#/sales/quote/q3' →
   routes['sales'].render(el, ['quote','q3'])). Default route: '#/dashboard'.
   Unknown section (module not loaded yet) → friendly "loading" empty state,
   so missing module files only mean fewer nav entries — never a crash.

   Special case: section 'book' adds class "consumer" to <body>; app.css then
   hides all admin chrome and shows the minimal consumer header (logo, phone,
   "Back to website" via business.siteUrl).

   API:
     start()      — build chrome, bind hashchange, render current route.
     go(path)     — navigate ('sales/quote/q3', '/sales' or '#/sales').
     refresh()    — re-render the current route (call after data changes).
*/
(function () {
  'use strict';
  window.DEMO = window.DEMO || {};

  var THEME_KEY = 'demo:theme';
  var MAX_TABS = 5; /* mobile tab bar slots, including "More" */

  var view = null;
  var current = { section: 'dashboard', parts: [] };

  /* Icons (inline SVG, currentColor) */
  var ICON_SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M19.4 4.6l-1.8 1.8M6.4 17.6l-1.8 1.8"/></svg>';
  var ICON_MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>';
  var ICON_DOTS = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>';
  var ICON_DOT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7"/></svg>';

  function slug() {
    return (DEMO.store && DEMO.store.slug) ||
      document.documentElement.dataset.business || 'proflow-plumbing';
  }

  function biz() {
    return (DEMO.businesses && DEMO.businesses[slug()]) || {
      name: 'Demo business', trade: '', phone: '', siteUrl: '#', logo: ''
    };
  }

  /* ---- Hash parsing ------------------------------------------------------ */

  function parseHash() {
    var h = location.hash || '#/dashboard';
    var parts = h.replace(/^#\/?/, '').split('/').filter(function (p) { return p !== ''; });
    var section = parts.shift();
    return { section: section || 'dashboard', parts: parts };
  }

  /* ---- Brand lockup ------------------------------------------------------ */

  function brandEl(withTrade, href) {
    var b = biz();
    var node = document.createElement(href ? 'a' : 'span');
    node.className = 'brand';
    if (href) node.href = href;

    var logo = document.createElement('span');
    logo.className = 'brand-logo';
    logo.setAttribute('aria-hidden', 'true');
    logo.innerHTML = b.logo || '';
    node.appendChild(logo);

    var text = document.createElement('span');
    text.className = 'brand-text';
    var name = document.createElement('span');
    name.className = 'brand-name';
    name.textContent = b.name;
    text.appendChild(name);
    if (withTrade && b.trade) {
      var trade = document.createElement('span');
      trade.className = 'brand-trade';
      trade.textContent = b.trade;
      text.appendChild(trade);
    }
    node.appendChild(text);
    return node;
  }

  /* ---- Theme ------------------------------------------------------------- */

  function currentTheme() {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* in-memory only */ }
    syncThemeControls();
  }

  function toggleTheme() {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  }

  function syncThemeControls() {
    var dark = currentTheme() === 'dark';
    var label = dark ? 'Switch to light theme' : 'Switch to dark theme';
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.innerHTML = dark ? ICON_SUN : ICON_MOON;
      btn.setAttribute('aria-label', label);
      btn.title = label;
    }
    var link = document.getElementById('footer-theme');
    if (link) link.textContent = label;
  }

  /* ---- Sidebar footer actions -------------------------------------------- */

  function backupData() {
    var payload = JSON.stringify({
      business: slug(),
      exported: new Date().toISOString(),
      state: DEMO.store.state
    }, null, 2);
    var a = document.createElement('a');
    a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(payload);
    a.download = slug() + '-demo-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    DEMO.ui.toast('Backup downloaded', 'ok');
  }

  function resetData() {
    DEMO.ui.confirmDialog({
      title: 'Reset demo data',
      message: 'This restores the original seeded demo data for ' + biz().name +
        '. Any changes you have made in this demo will be lost.',
      confirmLabel: 'Reset data',
      onConfirm: function () {
        DEMO.store.reset();
        render();
        DEMO.ui.toast('Demo data reset', 'ok');
      }
    });
  }

  /* ---- Navigation (sidebar + mobile tab bar) ------------------------------ */

  function navLink(item, cls, iconCls) {
    var a = document.createElement('a');
    a.className = cls;
    a.href = '#/' + item.section;
    if (item.section === current.section) a.setAttribute('aria-current', 'page');

    var icon = document.createElement('span');
    icon.className = iconCls;
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = item.icon || ICON_DOT;
    a.appendChild(icon);

    var text = document.createElement('span');
    text.textContent = item.label || item.section;
    a.appendChild(text);
    return a;
  }

  function openMoreSheet(overflow) {
    var list = document.createElement('nav');
    list.className = 'sheet-nav';
    list.setAttribute('aria-label', 'More sections');
    overflow.forEach(function (item) {
      list.appendChild(navLink(item, 'nav__link', 'nav__icon'));
    });
    var dlg = DEMO.ui.drawer({ title: 'More', body: list });
    list.addEventListener('click', function (e) {
      var t = e.target;
      while (t && t !== list && t.tagName !== 'A') t = t.parentNode;
      if (t && t.tagName === 'A') dlg.close();
    });
  }

  function renderNav() {
    var items = DEMO.nav || [];

    var sideNav = document.getElementById('sidebar-nav');
    if (sideNav) {
      sideNav.innerHTML = '';
      items.forEach(function (item) {
        sideNav.appendChild(navLink(item, 'nav__link', 'nav__icon'));
      });
    }

    var tabbar = document.getElementById('tabbar');
    if (tabbar) {
      tabbar.innerHTML = '';
      var overflowing = items.length > MAX_TABS;
      var inline = overflowing ? items.slice(0, MAX_TABS - 1) : items;
      var overflow = overflowing ? items.slice(MAX_TABS - 1) : [];

      inline.forEach(function (item) {
        tabbar.appendChild(navLink(item, 'tabbar__item', 'tabbar__icon'));
      });

      if (overflow.length) {
        var active = overflow.some(function (item) { return item.section === current.section; });
        var more = document.createElement('button');
        more.type = 'button';
        more.className = 'tabbar__item' + (active ? ' is-active' : '');
        more.setAttribute('aria-haspopup', 'dialog');
        more.innerHTML = '<span class="tabbar__icon" aria-hidden="true">' + ICON_DOTS + '</span><span>More</span>';
        more.addEventListener('click', function () { openMoreSheet(overflow); });
        tabbar.appendChild(more);
      }
    }
  }

  /* ---- Chrome (built once at start) --------------------------------------- */

  function buildChrome() {
    var topBrand = document.getElementById('topbar-brand');
    if (topBrand) { topBrand.innerHTML = ''; topBrand.appendChild(brandEl(false, null)); }

    var sideBrand = document.getElementById('sidebar-brand');
    if (sideBrand) { sideBrand.innerHTML = ''; sideBrand.appendChild(brandEl(true, '#/dashboard')); }

    /* Business switcher: rewrites ?business= keeping the current hash
       (full page reload re-seeds theme + data for the chosen business). */
    var switcher = document.getElementById('business-switcher');
    if (switcher) {
      switcher.innerHTML = '';
      Object.keys(DEMO.businesses || {}).forEach(function (key) {
        var opt = document.createElement('option');
        opt.value = key;
        opt.textContent = DEMO.businesses[key].name;
        switcher.appendChild(opt);
      });
      switcher.value = slug();
      switcher.addEventListener('change', function () {
        var next = switcher.value;
        if (next === slug()) return;
        location.href = location.pathname + '?business=' + encodeURIComponent(next) + location.hash;
      });
    }

    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    var themeLink = document.getElementById('footer-theme');
    if (themeLink) themeLink.addEventListener('click', toggleTheme);
    syncThemeControls();

    var backupLink = document.getElementById('footer-backup');
    if (backupLink) backupLink.addEventListener('click', backupData);
    var resetLink = document.getElementById('footer-reset');
    if (resetLink) resetLink.addEventListener('click', resetData);

    /* Consumer header (only visible in body.consumer — the #/book flow). */
    var consumer = document.getElementById('consumer-topbar');
    if (consumer) {
      consumer.innerHTML = '';
      consumer.appendChild(brandEl(false, null));
      var b = biz();
      var links = document.createElement('div');
      links.className = 'consumer-topbar__links';
      if (b.phone) {
        var tel = document.createElement('a');
        tel.href = 'tel:' + String(b.phone).replace(/\s+/g, '');
        tel.textContent = b.phone;
        links.appendChild(tel);
      }
      if (b.siteUrl) {
        var back = document.createElement('a');
        back.href = b.siteUrl;
        back.textContent = 'Back to website';
        links.appendChild(back);
      }
      consumer.appendChild(links);
    }
  }

  /* ---- Rendering ----------------------------------------------------------- */

  function render() {
    if (!view) return;
    current = parseHash();

    /* Consumer mode: the public booking flow hides all admin chrome. */
    document.body.classList.toggle('consumer', current.section === 'book');

    var route = DEMO.routes ? DEMO.routes[current.section] : null;
    view.innerHTML = '';
    view.dataset.section = current.section;

    if (route && typeof route.render === 'function') {
      try {
        route.render(view, current.parts);
      } catch (err) {
        console.error('Route "' + current.section + '" failed to render:', err);
        view.innerHTML = '';
        view.appendChild(DEMO.ui.emptyState(
          'Something went wrong loading this screen. Try another section, or reset the demo data from the sidebar.'
        ));
      }
    } else {
      /* Module not loaded (yet) — friendly placeholder, never a crash. */
      view.appendChild(DEMO.ui.emptyState('This screen is loading — check back in a moment.'));
    }

    document.title = (route && route.title ? route.title + ' — ' : '') + biz().name;
    renderNav();
    window.scrollTo(0, 0);
  }

  DEMO.router = {
    /** Build the chrome, bind hashchange and render the current route. */
    start: function () {
      view = document.getElementById('view');
      if (!view) return;
      buildChrome();
      window.addEventListener('hashchange', render);
      render();
    },

    /** Navigate to a route: go('sales/quote/q3'), go('/sales') or go('#/sales'). */
    go: function (path) {
      var p = String(path == null ? '' : path);
      if (p.charAt(0) === '#') p = p.slice(1);
      if (p.charAt(0) !== '/') p = '/' + p;
      location.hash = '#' + p;
    },

    /** Re-render the current route (call after mutating store data). */
    refresh: render
  };
})();
