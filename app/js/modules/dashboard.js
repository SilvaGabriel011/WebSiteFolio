/* Dashboard module — the at-a-glance home screen. First nav item.
   KPI row (jobs today, quotes awaiting response, invoiced this month,
   outstanding receivables, low stock, maintenance due), then today's run
   sheet, low-stock and maintenance shortlists, and a recent-activity feed.
   Read-only: it derives everything from DEMO.store and cross-links to the
   sections that own the data via plain #/... anchors. */
(function () {
  'use strict';

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/>' +
    '<rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/>' +
    '<rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/>' +
    '<rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>';

  DEMO.nav.push({ section: 'dashboard', label: 'Dashboard', icon: ICON });

  function cap(s) {
    s = String(s == null ? '' : s);
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function plural(noun) { return noun + 's'; }

  function terms() {
    var biz = DEMO.businesses[DEMO.store.slug] || {};
    var t = biz.terms || {};
    return {
      jobNoun: t.jobNoun || 'job',
      assetLabel: t.assetLabel || 'Maintenance',
      staff: t.staff || []
    };
  }

  /* Two-line cell: main text + muted detail underneath. */
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

  /* Section wrapper: heading + optional "open section" link + body element. */
  function section(heading, linkLabel, linkHref, bodyEl) {
    var sec = document.createElement('section');
    sec.setAttribute('aria-label', heading);
    var head = DEMO.ui.el('<div class="page-head"><h2></h2></div>');
    head.querySelector('h2').textContent = heading;
    if (linkLabel && linkHref) {
      var a = document.createElement('a');
      a.className = 'btn btn--sm';
      a.href = linkHref;
      a.textContent = linkLabel;
      head.appendChild(a);
    }
    sec.appendChild(head);
    if (bodyEl) sec.appendChild(bodyEl);
    return sec;
  }

  /* ---- Derivations --------------------------------------------------------- */

  function sentQuotes() {
    return DEMO.store.get('quotes').filter(function (q) { return q.status === 'sent'; });
  }

  function openInvoices() {
    return DEMO.store.get('invoices').filter(function (inv) {
      return inv.status === 'sent' || inv.status === 'overdue';
    });
  }

  function receivablesTotal(invoices) {
    var sum = 0;
    invoices.forEach(function (inv) {
      sum += DEMO.store.derive.invoiceTotals(inv).total;
    });
    return Math.round(sum * 100) / 100;
  }

  /* Recent activity: latest-dated movements, invoices and jobs, newest first. */
  function recentActivity() {
    var t = terms();
    var today = DEMO.util.d(0);
    var events = [];

    DEMO.store.get('movements').forEach(function (m) {
      var item = DEMO.store.find('stock', m.stockId);
      var name = item ? item.name : 'stock item';
      var qty = Math.abs(m.delta || 0);
      events.push({
        date: m.date || '',
        line: (m.delta > 0 ? 'Received ' : 'Used ') + qty + ' × ' + name,
        detail: m.reason || '',
        status: m.delta > 0 ? 'received' : null
      });
    });

    DEMO.store.get('invoices').forEach(function (inv) {
      if (!inv.issued) return;
      var total = DEMO.store.derive.invoiceTotals(inv).total;
      events.push({
        date: inv.issued,
        line: 'Invoiced ' + DEMO.store.derive.customerName(inv.customerId) +
          ' — ' + DEMO.fmt.money(total),
        detail: (inv.lines && inv.lines[0] && inv.lines[0].desc) || '',
        status: inv.status
      });
    });

    var verbs = { scheduled: 'Booked', in_progress: 'Started', done: 'Completed', invoiced: 'Completed' };
    DEMO.store.get('jobs').forEach(function (j) {
      var day = (j.start || '').slice(0, 10);
      if (!day || day > today) return;
      events.push({
        date: j.start,
        line: (verbs[j.status] || 'Updated') + ' ' + t.jobNoun + ' for ' +
          DEMO.store.derive.customerName(j.customerId),
        detail: j.title || '',
        status: j.status
      });
    });

    events.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
    return events.slice(0, 8);
  }

  /* ---- Screen pieces ------------------------------------------------------- */

  function kpiRow() {
    var t = terms();
    var fmt = DEMO.fmt;
    var todays = DEMO.store.derive.todaysJobs();
    var quotes = sentQuotes();
    var quotesValue = 0;
    quotes.forEach(function (q) { quotesValue += DEMO.store.derive.quoteTotals(q).total; });
    var open = openInvoices();
    var overdueCount = open.filter(function (i) { return i.status === 'overdue'; }).length;
    var low = DEMO.store.derive.lowStock();
    var maint = DEMO.store.derive.maintenanceDue();
    var maintOverdue = maint.filter(function (e) { return e.overdue; }).length;

    var grid = document.createElement('div');
    grid.className = 'kpi-grid';
    DEMO.ui.mount(grid,
      DEMO.ui.kpi({
        label: cap(plural(t.jobNoun)) + ' today',
        value: todays.length,
        sub: fmt.dayMonth(DEMO.util.d(0)),
        tone: 'brand',
        href: '#/schedule'
      }),
      DEMO.ui.kpi({
        label: 'Quotes awaiting response',
        value: quotes.length,
        sub: quotes.length ? fmt.money(quotesValue) + ' in play' : 'Nothing outstanding',
        tone: 'brand',
        href: '#/sales'
      }),
      DEMO.ui.kpi({
        label: 'Invoiced this month',
        value: fmt.money(DEMO.store.derive.invoicedThisMonth()),
        sub: 'Incl. GST',
        tone: 'ok',
        href: '#/money'
      }),
      DEMO.ui.kpi({
        label: 'Outstanding receivables',
        value: fmt.money(receivablesTotal(open)),
        sub: overdueCount
          ? overdueCount + ' overdue invoice' + (overdueCount === 1 ? '' : 's')
          : open.length + ' unpaid invoice' + (open.length === 1 ? '' : 's'),
        tone: overdueCount ? 'danger' : 'brand',
        href: '#/money'
      }),
      DEMO.ui.kpi({
        label: 'Low stock',
        value: low.length,
        sub: low.length ? 'At or below minimum' : 'All levels healthy',
        tone: low.length ? 'warn' : 'ok',
        href: '#/inventory'
      }),
      DEMO.ui.kpi({
        label: t.assetLabel + ' due',
        value: maint.length,
        sub: maintOverdue
          ? maintOverdue + ' overdue'
          : 'Next 60 days',
        tone: maintOverdue ? 'danger' : (maint.length ? 'warn' : 'ok'),
        href: '#/maintenance'
      }));
    return grid;
  }

  function todaySection() {
    var t = terms();
    var jobs = DEMO.store.derive.todaysJobs();
    var body;
    if (!jobs.length) {
      body = DEMO.ui.emptyState(
        'No ' + plural(t.jobNoun) + ' on today’s run sheet.',
        { label: 'Open the schedule', href: '#/schedule' });
    } else {
      body = DEMO.ui.table({
        columns: [
          { key: 'start', label: 'Time',
            render: function (j) { return DEMO.fmt.time(j.start); } },
          { key: 'customerId', label: 'Customer',
            render: function (j) {
              return twoLine(DEMO.store.derive.customerName(j.customerId), j.title);
            } },
          { key: 'assignee', label: 'Assigned to' },
          { key: 'status', label: 'Status',
            render: function (j) { return DEMO.ui.chip(j.status); } }
        ],
        rows: jobs
      });
    }
    return section('Today’s ' + plural(t.jobNoun), 'Open schedule', '#/schedule', body);
  }

  function lowStockSection() {
    var low = DEMO.store.derive.lowStock()
      .slice()
      .sort(function (a, b) { return (a.qty - a.min) - (b.qty - b.min); })
      .slice(0, 5);
    var body = DEMO.ui.table({
      columns: [
        { key: 'name', label: 'Item',
          render: function (s) { return twoLine(s.name, s.sku); } },
        { key: 'qty', label: 'In stock', align: 'right' },
        { key: 'min', label: 'Min level', align: 'right' },
        { key: 'status', label: 'Status',
          render: function () { return DEMO.ui.chip('low'); } }
      ],
      rows: low,
      empty: 'Stock levels are all above minimum — nothing to reorder.'
    });
    return section('Low stock', 'Open inventory', '#/inventory', body);
  }

  function maintenanceSection() {
    var t = terms();
    var due = DEMO.store.derive.maintenanceDue().slice(0, 5);
    var body = DEMO.ui.table({
      columns: [
        { key: 'name', label: 'Item',
          render: function (e) {
            return twoLine(e.asset.name, DEMO.store.derive.customerName(e.asset.customerId));
          } },
        { key: 'due', label: 'Next due',
          render: function (e) {
            var wrap = document.createElement('div');
            var when = document.createElement('div');
            when.textContent = DEMO.fmt.date(e.due);
            wrap.appendChild(when);
            if (e.overdue) {
              wrap.appendChild(DEMO.ui.chip('overdue'));
            } else {
              var rel = document.createElement('div');
              rel.className = 'muted';
              rel.textContent = e.days === 0 ? 'Due today' : 'In ' + e.days + ' days';
              wrap.appendChild(rel);
            }
            return wrap;
          } }
      ],
      rows: due,
      empty: 'Nothing due in the next 60 days.'
    });
    return section(t.assetLabel, 'View all', '#/maintenance', body);
  }

  function activitySection() {
    var events = recentActivity();
    var body = DEMO.ui.table({
      columns: [
        { key: 'date', label: 'When',
          render: function (e) {
            var span = document.createElement('span');
            span.className = 'muted';
            span.textContent = DEMO.fmt.relDay(e.date);
            return span;
          } },
        { key: 'line', label: 'Activity',
          render: function (e) { return twoLine(e.line, e.detail); } },
        { key: 'status', label: 'Status',
          render: function (e) { return e.status ? DEMO.ui.chip(e.status) : ''; } }
      ],
      rows: events,
      empty: 'No recent activity yet — it will show up here as you work.'
    });
    return section('Recent activity', null, null, body);
  }

  /* ---- Route --------------------------------------------------------------- */

  DEMO.routes['dashboard'] = {
    title: 'Dashboard',
    render: function (el) {
      var biz = DEMO.businesses[DEMO.store.slug] || {};

      var head = DEMO.ui.el('<div class="page-head"><div><h1>Dashboard</h1><p class="muted"></p></div></div>');
      head.querySelector('p').textContent =
        (biz.name || 'Your business') + ' at a glance — ' + DEMO.fmt.dayMonth(DEMO.util.d(0));
      el.appendChild(head);

      el.appendChild(kpiRow());

      var grid = document.createElement('div');
      grid.className = 'grid grid--2';
      DEMO.ui.mount(grid,
        todaySection(),
        lowStockSection(),
        maintenanceSection(),
        activitySection());
      el.appendChild(grid);
    }
  };
})();
