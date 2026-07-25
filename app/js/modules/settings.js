/* Settings module — business profile, team, standard prices and online-booking
   services, plus the demo-data controls (theme, backup, reset) so they are
   reachable on mobile where the sidebar footer is hidden. Route: #/settings. */
(function () {
  'use strict';

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="12" cy="12" r="3.2"/>' +
    '<path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L14.2 3h-4l-.4 2.5a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2l.4 2.5h4l.4-2.5a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.06-.4.1-.8.1-1.2z"/></svg>';

  DEMO.nav.push({ section: 'settings', label: 'Settings', icon: ICON });

  function biz() { return DEMO.businesses[DEMO.store.slug] || {}; }

  function row(label, value) {
    var wrap = DEMO.ui.el('<div class="settings-row"></div>');
    var l = DEMO.ui.el('<span class="settings-row__label"></span>');
    l.textContent = label;
    wrap.appendChild(l);
    if (value != null && value.nodeType === 1) {
      wrap.appendChild(value);
    } else {
      var v = DEMO.ui.el('<span class="settings-row__value"></span>');
      v.textContent = String(value == null || value === '' ? '—' : value);
      wrap.appendChild(v);
    }
    return wrap;
  }

  function sectionCard(heading, children) {
    var card = DEMO.ui.el('<section class="card settings-card"></section>');
    var h = DEMO.ui.el('<h2></h2>');
    h.textContent = heading;
    card.appendChild(h);
    DEMO.ui.mount(card, children);
    return card;
  }

  DEMO.routes['settings'] = {
    title: 'Settings',
    render: function (el) {
      var ui = DEMO.ui;
      var b = biz();
      var terms = b.terms || {};

      var head = ui.el('<div class="page-head"><div><h1>Settings</h1><p class="muted"></p></div></div>');
      head.querySelector('p').textContent =
        'Business details and standard rates — in the real system these are all editable.';
      el.appendChild(head);

      var grid = ui.el('<div class="grid grid--2"></div>');

      /* Business profile */
      var siteLink = null;
      if (b.siteUrl) {
        siteLink = ui.el('<a class="btn btn--sm"></a>');
        siteLink.href = b.siteUrl;
        siteLink.textContent = 'Open website';
      }
      grid.appendChild(sectionCard('Business profile', [
        row('Trading name', b.name),
        row('Trade', b.trade),
        row('Owner', b.owner),
        row('Based in', b.suburb),
        row('Mobile', b.phone),
        row('Landline', b.landline),
        row('Email', b.email),
        row('ABN', b.abn),
        row('Licence', b.licence),
        siteLink ? row('Website', siteLink) : null
      ]));

      /* Team */
      var staff = terms.staff || [];
      var teamList = ui.el('<div class="settings-chips"></div>');
      staff.forEach(function (name) { teamList.appendChild(ui.chip(name)); });
      grid.appendChild(sectionCard('Team', [
        staff.length ? teamList : ui.el('<p class="muted">No team members listed.</p>'),
        ui.el('<p class="muted">Everyone here can be assigned ' +
          ui.esc((terms.jobNoun || 'job')) + 's on the schedule.</p>')
      ]));

      el.appendChild(grid);

      /* Standard price list */
      var priceSec = document.createElement('section');
      priceSec.appendChild(ui.el('<div class="page-head"><h2>Standard price list</h2></div>'));
      priceSec.appendChild(ui.table({
        columns: [
          { key: 'desc', label: 'Item' },
          { key: 'unit', label: 'Unit' },
          { key: 'price', label: 'Price (ex GST)', align: 'right',
            render: function (p) { return DEMO.fmt.money(p.price); } }
        ],
        rows: terms.priceList || [],
        empty: 'No standard prices set for this business.'
      }));
      el.appendChild(priceSec);

      /* Online booking services */
      var bookSec = document.createElement('section');
      bookSec.appendChild(ui.el('<div class="page-head"><h2>Online booking services</h2>' +
        '<a class="btn btn--sm" href="#/book">Preview booking page</a></div>'));
      bookSec.appendChild(ui.table({
        columns: [
          { key: 'name', label: 'Service' },
          { key: 'durationHrs', label: 'Duration',
            render: function (s) { return s.durationHrs + ' hr' + (s.durationHrs === 1 ? '' : 's'); } },
          { key: 'fromPrice', label: 'From', align: 'right',
            render: function (s) { return s.fromPrice ? DEMO.fmt.money(s.fromPrice) : 'Free'; } }
        ],
        rows: terms.bookingServices || [],
        empty: 'No online-booking services configured.'
      }));
      el.appendChild(bookSec);

      /* Demo data controls */
      var themeBtn = ui.el('<button type="button" class="btn">Switch light / dark theme</button>');
      themeBtn.addEventListener('click', function () {
        var link = document.getElementById('footer-theme');
        if (link) link.click();
      });
      var backupBtn = ui.el('<button type="button" class="btn">Back up demo data</button>');
      backupBtn.addEventListener('click', function () {
        var link = document.getElementById('footer-backup');
        if (link) link.click();
      });
      var resetBtn = ui.el('<button type="button" class="btn btn--danger">Reset demo data</button>');
      resetBtn.addEventListener('click', function () {
        var link = document.getElementById('footer-reset');
        if (link) link.click();
      });
      var controls = ui.el('<div class="toolbar"></div>');
      ui.mount(controls, themeBtn, backupBtn, resetBtn);
      el.appendChild(sectionCard('This demo', [
        ui.el('<p class="muted">Everything runs in your browser — no data leaves this page. ' +
          'Changes are kept until the start of the next day, then the demo re-seeds itself.</p>'),
        controls
      ]));
    }
  };
})();
