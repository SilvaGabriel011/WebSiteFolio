/* Sales module — the quote pipeline. List view with pipeline KPIs and status
   filter; detail view per quote (lines, GST totals, status actions, convert
   to job). Routes: #/sales and #/sales/quote/<id>. "New quote" reuses the
   shared quick-actions drawer when present. */
(function () {
  'use strict';

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/>' +
    '<path d="M14 3v5h5M9 13h6M9 17h4"/></svg>';

  DEMO.nav.push({ section: 'sales', label: 'Sales', icon: ICON });

  function jobNoun() {
    var biz = DEMO.businesses[DEMO.store.slug] || {};
    return (biz.terms || {}).jobNoun || 'job';
  }

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

  function quoteTotal(q) { return DEMO.store.derive.quoteTotals(q).total; }

  function sumTotals(quotes) {
    var t = 0;
    quotes.forEach(function (q) { t += quoteTotal(q); });
    return Math.round(t * 100) / 100;
  }

  function openNewQuote() {
    if (DEMO.quickActions && DEMO.quickActions.newQuote) DEMO.quickActions.newQuote();
    else DEMO.ui.toast('Quick actions are unavailable in this build', 'warn');
  }

  /* ---- List view ------------------------------------------------------------ */

  function renderList(el, filter) {
    var ui = DEMO.ui;
    var quotes = DEMO.store.get('quotes').slice().sort(function (a, b) {
      return a.date < b.date ? 1 : -1;
    });

    var head = ui.el('<div class="page-head"><div><h1>Sales</h1><p class="muted"></p></div></div>');
    head.querySelector('p').textContent =
      'Quotes from first draft to won ' + jobNoun() + ' — GST handled for you.';
    var newBtn = ui.el('<button type="button" class="btn btn--primary">+ New quote</button>');
    newBtn.addEventListener('click', openNewQuote);
    head.appendChild(newBtn);
    el.appendChild(head);

    var sent = quotes.filter(function (q) { return q.status === 'sent'; });
    var accepted = quotes.filter(function (q) { return q.status === 'accepted'; });
    var decided = accepted.length + quotes.filter(function (q) { return q.status === 'declined'; }).length;

    var kpis = ui.el('<div class="kpi-grid"></div>');
    ui.mount(kpis,
      ui.kpi({ label: 'Awaiting response', value: sent.length,
        sub: sent.length ? DEMO.fmt.money(sumTotals(sent)) + ' in play' : 'Nothing outstanding',
        tone: 'brand' }),
      ui.kpi({ label: 'Accepted', value: accepted.length,
        sub: DEMO.fmt.money(sumTotals(accepted)) + ' won', tone: 'ok' }),
      ui.kpi({ label: 'Win rate', value: decided ? Math.round(accepted.length / decided * 100) + '%' : '—',
        sub: decided + ' quote' + (decided === 1 ? '' : 's') + ' decided',
        tone: 'brand' }));
    el.appendChild(kpis);

    var toolbar = ui.el('<div class="toolbar"></div>');
    var filterSel = ui.select(
      [{ value: 'all', label: 'All quotes' }, { value: 'draft', label: 'Drafts' },
       { value: 'sent', label: 'Sent' }, { value: 'accepted', label: 'Accepted' },
       { value: 'declined', label: 'Declined' }],
      filter || 'all',
      function (v) { renderInto(el, v); });
    toolbar.appendChild(filterSel);
    el.appendChild(toolbar);

    var shown = filter && filter !== 'all'
      ? quotes.filter(function (q) { return q.status === filter; })
      : quotes;

    el.appendChild(ui.table({
      columns: [
        { key: 'date', label: 'Date',
          render: function (q) { return DEMO.fmt.relDay(q.date); } },
        { key: 'customerId', label: 'Customer',
          render: function (q) {
            return twoLine(DEMO.store.derive.customerName(q.customerId),
              (q.lines && q.lines[0] && q.lines[0].desc) || '');
          } },
        { key: 'total', label: 'Total (incl. GST)', align: 'right',
          render: function (q) { return DEMO.fmt.money(quoteTotal(q)); } },
        { key: 'status', label: 'Status',
          render: function (q) { return ui.chip(q.status); } }
      ],
      rows: shown,
      onRow: function (q) { DEMO.router.go('sales/quote/' + q.id); },
      empty: 'No quotes here yet — hit “New quote” to raise one.'
    }));
  }

  function renderInto(el, filter) {
    el.innerHTML = '';
    renderList(el, filter);
  }

  /* ---- Detail view ---------------------------------------------------------- */

  function setStatus(q, status, msg) {
    DEMO.store.update('quotes', q.id, { status: status });
    DEMO.ui.toast(msg, 'ok');
    DEMO.router.refresh();
  }

  function convertToJob(q) {
    var ui = DEMO.ui;
    var staff = ((DEMO.businesses[DEMO.store.slug] || {}).terms || {}).staff || ['Unassigned'];
    var dateInput = ui.el('<input class="input" type="date">');
    dateInput.value = DEMO.util.d(2);
    var timeSel = ui.select(['07:30', '08:00', '09:00', '10:30', '13:00', '14:30'], '08:00');
    var staffSel = ui.select(staff);

    var form = ui.el('<div class="qa-form"></div>');
    ui.mount(form,
      ui.formRow('Date', dateInput),
      ui.formRow('Start time', timeSel),
      ui.formRow('Assign to', staffSel));

    ui.drawer({
      title: 'Schedule the ' + jobNoun(),
      body: form,
      actions: [
        { label: 'Cancel', tone: 'ghost' },
        {
          label: 'Add to schedule', tone: 'primary',
          onClick: function () {
            if (!dateInput.value) { ui.toast('Pick a date', 'warn'); return false; }
            DEMO.store.add('jobs', {
              customerId: q.customerId,
              title: (q.lines && q.lines[0] && q.lines[0].desc) || 'Quoted work',
              status: 'scheduled',
              start: dateInput.value + 'T' + timeSel.value,
              durationHrs: 3,
              assignee: staffSel.value,
              source: 'quote',
              quoteId: q.id,
              notes: 'From quote ' + q.id
            });
            ui.toast('Scheduled — see it on the run sheet', 'ok');
            DEMO.router.go('schedule');
          }
        }
      ]
    });
  }

  function jobForQuote(q) {
    return DEMO.store.get('jobs').filter(function (j) { return j.quoteId === q.id; })[0] || null;
  }

  function renderDetail(el, id) {
    var ui = DEMO.ui;
    var q = DEMO.store.find('quotes', id);
    if (!q) {
      el.appendChild(ui.emptyState('That quote is no longer in the demo data.',
        { label: 'Back to sales', href: '#/sales' }));
      return;
    }
    var customer = DEMO.store.find('customers', q.customerId) || {};
    var totals = DEMO.store.derive.quoteTotals(q);

    var head = ui.el('<div class="page-head"><div><h1></h1><p class="muted"></p></div></div>');
    head.querySelector('h1').textContent = 'Quote for ' + (customer.name || 'customer');
    head.querySelector('p').textContent = DEMO.fmt.date(q.date) +
      (customer.suburb ? ' · ' + customer.suburb : '') +
      (customer.phone ? ' · ' + customer.phone : '');
    var backBtn = ui.el('<a class="btn" href="#/sales">&larr; All quotes</a>');
    head.appendChild(backBtn);
    el.appendChild(head);

    var status = ui.el('<div class="toolbar"></div>');
    status.appendChild(ui.chip(q.status));
    var job = jobForQuote(q);
    if (job) {
      status.appendChild(ui.el('<a class="btn btn--sm" href="#/schedule/job/' + ui.esc(job.id) + '">View scheduled ' + ui.esc(jobNoun()) + '</a>'));
    }
    el.appendChild(status);

    el.appendChild(ui.table({
      columns: [
        { key: 'desc', label: 'Item' },
        { key: 'qty', label: 'Qty', align: 'right',
          render: function (l) { return l.qty + ' ' + (l.unit || 'ea'); } },
        { key: 'price', label: 'Unit price', align: 'right',
          render: function (l) { return DEMO.fmt.money(l.price); } },
        { key: 'line', label: 'Line total', align: 'right',
          render: function (l) { return DEMO.fmt.money((l.qty || 0) * (l.price || 0)); } }
      ],
      rows: q.lines || [],
      empty: 'No line items on this quote yet.'
    }));

    var totalsCard = ui.el('<div class="card qa-totals">' +
      '<div class="qa-totals__row"><span>Subtotal</span><span>' + ui.esc(DEMO.fmt.money(totals.subtotal)) + '</span></div>' +
      '<div class="qa-totals__row"><span>GST 10%</span><span>' + ui.esc(DEMO.fmt.money(totals.gst)) + '</span></div>' +
      '<div class="qa-totals__row qa-totals__row--total"><span>Total</span><span>' + ui.esc(DEMO.fmt.money(totals.total)) + '</span></div>' +
      '</div>');
    el.appendChild(totalsCard);

    if (q.notes) {
      var notes = ui.el('<p class="muted"></p>');
      notes.textContent = 'Notes: ' + q.notes;
      el.appendChild(notes);
    }

    var actions = ui.el('<div class="toolbar"></div>');
    function btn(label, tone, onClick) {
      var b = ui.el('<button type="button" class="btn' +
        (tone === 'primary' ? ' btn--primary' : tone === 'danger' ? ' btn--danger' : '') +
        '"></button>');
      b.textContent = label;
      b.addEventListener('click', onClick);
      return b;
    }
    if (q.status === 'draft') {
      actions.appendChild(btn('Mark as sent', 'primary', function () {
        setStatus(q, 'sent', 'Quote sent to ' + (customer.name || 'customer'));
      }));
    } else if (q.status === 'sent') {
      actions.appendChild(btn('Customer accepted', 'primary', function () {
        setStatus(q, 'accepted', 'Accepted — nice one');
      }));
      actions.appendChild(btn('Customer declined', 'danger', function () {
        setStatus(q, 'declined', 'Marked declined');
      }));
    } else if (q.status === 'accepted' && !job) {
      actions.appendChild(btn('Schedule the ' + jobNoun(), 'primary', function () {
        convertToJob(q);
      }));
    }
    el.appendChild(actions);
  }

  /* ---- Route ---------------------------------------------------------------- */

  DEMO.routes['sales'] = {
    title: 'Sales',
    render: function (el, parts) {
      if (parts && parts[0] === 'quote' && parts[1]) renderDetail(el, parts[1]);
      else renderList(el, 'all');
    }
  };
})();
