/* Maintenance module — recurring servicing and compliance programs. The nav
   label adapts per trade (assetLabel: "Compliance & servicing", "Warranty &
   care", …). Each asset shows its service history and due date; booking a
   service creates a scheduled job, logging one resets the clock. Route:
   #/maintenance (deep link #/maintenance/asset/<id> opens the drawer). */
(function () {
  'use strict';

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M14.7 6.3a4.5 4.5 0 0 0-6 5.6L3 17.6V21h3.4l5.7-5.7a4.5 4.5 0 0 0 5.6-6l-3 3-2.8-.7-.7-2.8z"/></svg>';

  function terms() {
    var biz = DEMO.businesses[DEMO.store.slug] || {};
    return biz.terms || {};
  }
  function label() { return terms().assetLabel || 'Maintenance'; }
  function assetNoun() { return terms().assetNoun || 'asset'; }

  /* Nav label resolves at render time via the business; register with the
     generic label and patch it once data is on the page. The nav array is
     re-read on every route change, so mutating the entry is enough. */
  var navEntry = { section: 'maintenance', label: 'Maintenance', icon: ICON };
  DEMO.nav.push(navEntry);

  function twoLine(main, detail) {
    var wrap = document.createElement('div');
    var top = document.createElement('div');
    top.textContent = String(main == null ? '' : main);
    wrap.appendChild(top);
    if (detail) {
      var sub = document.createElement('div');
      sub.className = 'muted';
      sub.textContent = String(detail);
      wrap.appendChild(sub);
    }
    return wrap;
  }

  function entryFor(assetId) {
    var due = DEMO.store.derive.maintenanceDue(99999);
    for (var i = 0; i < due.length; i++) if (due[i].asset.id === assetId) return due[i];
    return null;
  }

  /* ---- Book a service (creates a scheduled job) ------------------------------ */

  function bookService(entry, closePrev) {
    if (closePrev) closePrev();
    var ui = DEMO.ui;
    var asset = entry.asset;
    var staff = terms().staff || ['Unassigned'];

    var dateInput = ui.el('<input class="input" type="date">');
    dateInput.value = entry.days > 0 ? entry.due.slice(0, 10) : DEMO.util.d(1);
    var timeSel = ui.select(['07:30', '09:00', '10:30', '13:00', '14:30'], '09:00');
    var staffSel = ui.select(staff);

    var form = ui.el('<div class="qa-form"></div>');
    ui.mount(form,
      ui.formRow('Date', dateInput),
      ui.formRow('Time', timeSel),
      ui.formRow('Assign to', staffSel));

    ui.drawer({
      title: 'Book service — ' + asset.name,
      body: form,
      actions: [
        { label: 'Cancel', tone: 'ghost' },
        {
          label: 'Book it', tone: 'primary',
          onClick: function () {
            if (!dateInput.value) { ui.toast('Pick a date', 'warn'); return false; }
            DEMO.store.add('jobs', {
              customerId: asset.customerId,
              title: asset.name + ' — service',
              status: 'scheduled',
              start: dateInput.value + 'T' + timeSel.value,
              durationHrs: 1.5,
              assignee: staffSel.value,
              source: 'maintenance',
              notes: 'Scheduled from ' + label().toLowerCase()
            });
            ui.toast('Service booked — see the schedule', 'ok');
            DEMO.router.refresh();
          }
        }
      ]
    });
  }

  /* ---- Log a completed service ------------------------------------------------ */

  function logService(entry, closePrev) {
    if (closePrev) closePrev();
    var ui = DEMO.ui;
    var asset = entry.asset;
    var notesInput = ui.el('<textarea class="input" rows="3" placeholder="What was done? Any parts replaced?"></textarea>');
    var form = ui.el('<div class="qa-form"></div>');
    var intro = ui.el('<p class="muted"></p>');
    intro.textContent = 'Marks the service as done today and pushes the next due date out ' +
      asset.intervalMonths + ' months.';
    ui.mount(form, intro, ui.formRow('Service notes', notesInput));

    ui.drawer({
      title: 'Log service — ' + asset.name,
      body: form,
      actions: [
        { label: 'Cancel', tone: 'ghost' },
        {
          label: 'Log service', tone: 'primary',
          onClick: function () {
            var history = (asset.history || []).slice();
            history.unshift({
              date: DEMO.util.d(0),
              notes: String(notesInput.value || '').trim() || 'Routine service completed.'
            });
            DEMO.store.update('assets', asset.id, {
              lastService: DEMO.util.d(0),
              history: history
            });
            ui.toast('Service logged — next due ' +
              DEMO.fmt.date(DEMO.store.derive.assetNextDue(DEMO.store.find('assets', asset.id))), 'ok');
            DEMO.router.refresh();
          }
        }
      ]
    });
  }

  /* ---- Asset drawer ------------------------------------------------------------ */

  function openAsset(entry) {
    var ui = DEMO.ui;
    var asset = entry.asset;
    var customer = DEMO.store.find('customers', asset.customerId) || {};

    var body = ui.el('<div class="qa-form"></div>');

    body.appendChild(ui.formRow('Customer',
      twoLine(customer.name || '—', [asset.location, customer.phone].filter(Boolean).join(' · '))));

    var dueEl = ui.el('<div></div>');
    var dueLine = twoLine(DEMO.fmt.date(entry.due),
      'Every ' + asset.intervalMonths + ' months · last done ' + DEMO.fmt.date(asset.lastService));
    dueEl.appendChild(dueLine);
    if (entry.overdue) dueEl.appendChild(ui.chip('overdue'));
    else if (entry.days <= 60) dueEl.appendChild(ui.chip('due_soon'));
    body.appendChild(ui.formRow('Next due', dueEl));

    var history = asset.history || [];
    if (history.length) {
      var list = ui.el('<div></div>');
      history.slice(0, 5).forEach(function (h) {
        list.appendChild(twoLine(h.notes, DEMO.fmt.date(h.date)));
      });
      body.appendChild(ui.formRow('Service history', list));
    }

    var dlg = ui.drawer({
      title: asset.name,
      body: body,
      actions: [
        { label: 'Close', tone: 'ghost' },
        {
          label: 'Log service done', onClick: function (api) {
            logService(entry, api.close);
            return false;
          }
        },
        {
          label: 'Book service', tone: 'primary',
          onClick: function (api) {
            bookService(entry, api.close);
            return false;
          }
        }
      ]
    });
    return dlg;
  }

  /* ---- Screen ------------------------------------------------------------------- */

  DEMO.routes['maintenance'] = {
    title: 'Maintenance',
    render: function (el, parts) {
      var ui = DEMO.ui;
      navEntry.label = label();
      this.title = label();

      var everything = DEMO.store.derive.maintenanceDue(99999);
      var overdue = everything.filter(function (e) { return e.overdue; });
      var soon = everything.filter(function (e) { return !e.overdue && e.days <= 60; });

      var head = ui.el('<div class="page-head"><div><h1></h1><p class="muted"></p></div></div>');
      head.querySelector('h1').textContent = label();
      head.querySelector('p').textContent =
        'Recurring servicing that brings customers back — tap an item to book or log a visit.';
      el.appendChild(head);

      var kpis = ui.el('<div class="kpi-grid"></div>');
      ui.mount(kpis,
        ui.kpi({ label: 'Overdue', value: overdue.length,
          sub: overdue.length ? 'Ring these customers first' : 'Nothing slipping',
          tone: overdue.length ? 'danger' : 'ok' }),
        ui.kpi({ label: 'Due in 60 days', value: soon.length,
          sub: 'Book them before they call', tone: soon.length ? 'warn' : 'ok' }),
        ui.kpi({ label: 'Under program', value: everything.length,
          sub: 'Recurring ' + assetNoun() + 's on file', tone: 'brand' }));
      el.appendChild(kpis);

      el.appendChild(ui.table({
        columns: [
          { key: 'name', label: 'Item',
            render: function (e) {
              return twoLine(e.asset.name,
                DEMO.store.derive.customerName(e.asset.customerId) +
                (e.asset.location ? ' · ' + e.asset.location : ''));
            } },
          { key: 'last', label: 'Last service',
            render: function (e) { return DEMO.fmt.date(e.asset.lastService); } },
          { key: 'due', label: 'Next due',
            render: function (e) {
              var wrap = document.createElement('div');
              var when = document.createElement('div');
              when.textContent = DEMO.fmt.date(e.due);
              wrap.appendChild(when);
              var rel = document.createElement('div');
              rel.className = 'muted';
              rel.textContent = e.overdue
                ? Math.abs(e.days) + ' days overdue'
                : e.days === 0 ? 'Due today' : 'In ' + e.days + ' days';
              wrap.appendChild(rel);
              return wrap;
            } },
          { key: 'status', label: 'Status',
            render: function (e) {
              return e.overdue ? DEMO.ui.chip('overdue')
                : e.days <= 60 ? DEMO.ui.chip('due_soon') : DEMO.ui.chip('on_track');
            } }
        ],
        rows: everything,
        onRow: openAsset,
        empty: 'No recurring servicing programs in this demo dataset.'
      }));

      if (parts && parts[0] === 'asset' && parts[1]) {
        var entry = entryFor(parts[1]);
        if (entry) openAsset(entry);
      }
    }
  };
})();
