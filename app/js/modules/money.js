/* Money module — invoices and getting paid. KPIs, filterable invoice list,
   invoice detail with GST totals and status actions, plus "Invoice a finished
   job" which pre-fills lines from the job's accepted quote when there is one.
   Routes: #/money and #/money/invoice/<id>. */
(function () {
  'use strict';

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="12" cy="12" r="8.5"/>' +
    '<path d="M14.8 9.2a2.6 2.6 0 0 0-2.3-1.2c-1.4 0-2.5.8-2.5 2s1 1.7 2.5 2c1.6.3 2.7.9 2.7 2.1s-1.2 2-2.7 2a2.8 2.8 0 0 1-2.6-1.3M12 6.5V8m0 8v1.5"/></svg>';

  DEMO.nav.push({ section: 'money', label: 'Money', icon: ICON });

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

  function invTotal(inv) { return DEMO.store.derive.invoiceTotals(inv).total; }

  function sumTotals(invoices) {
    var t = 0;
    invoices.forEach(function (inv) { t += invTotal(inv); });
    return Math.round(t * 100) / 100;
  }

  /* ---- Invoice a finished job ------------------------------------------------- */

  function uninvoicedJobs() {
    var invoices = DEMO.store.get('invoices');
    var invoicedJobIds = {};
    invoices.forEach(function (inv) { if (inv.jobId) invoicedJobIds[inv.jobId] = true; });
    return DEMO.store.get('jobs').filter(function (j) {
      return j.status === 'done' && !invoicedJobIds[j.id];
    });
  }

  function openInvoiceJob() {
    var ui = DEMO.ui;
    var jobs = uninvoicedJobs();
    if (!jobs.length) {
      ui.toast('Every finished ' + jobNoun() + ' is already invoiced', 'ok');
      return;
    }

    var jobSel = ui.select(jobs.map(function (j) {
      return {
        value: j.id,
        label: DEMO.store.derive.customerName(j.customerId) + ' — ' + j.title
      };
    }));

    var linesHost = ui.el('<div></div>');
    var priceInputs = [];

    function linesFor(job) {
      var quote = job.quoteId ? DEMO.store.find('quotes', job.quoteId) : null;
      return quote && quote.lines ? JSON.parse(JSON.stringify(quote.lines))
        : [{ desc: job.title, qty: 1, unit: 'ea', price: 0 }];
    }

    function drawLines() {
      linesHost.innerHTML = '';
      priceInputs = [];
      var job = DEMO.store.find('jobs', jobSel.value);
      if (!job) return;
      var lines = linesFor(job);
      var note = ui.el('<p class="muted"></p>');
      note.textContent = job.quoteId
        ? 'Lines copied from the accepted quote — adjust if the day ran differently.'
        : 'Set the price charged for this ' + jobNoun() + '.';
      linesHost.appendChild(note);
      lines.forEach(function (l) {
        var price = ui.moneyInput(l.price || '');
        priceInputs.push({ line: l, input: price });
        linesHost.appendChild(ui.formRow(l.qty + ' × ' + l.desc, price));
      });
    }

    jobSel.addEventListener('change', drawLines);

    var form = ui.el('<div class="qa-form"></div>');
    ui.mount(form, ui.formRow('Finished ' + jobNoun(), jobSel), linesHost);
    drawLines();

    ui.drawer({
      title: 'Invoice a finished ' + jobNoun(),
      body: form,
      actions: [
        { label: 'Cancel', tone: 'ghost' },
        {
          label: 'Create & send', tone: 'primary',
          onClick: function () {
            var job = DEMO.store.find('jobs', jobSel.value);
            if (!job) return;
            var lines = priceInputs.map(function (p) {
              var n = parseFloat(p.input.value);
              p.line.price = isFinite(n) ? n : 0;
              return p.line;
            });
            var inv = DEMO.store.add('invoices', {
              jobId: job.id,
              customerId: job.customerId,
              status: 'sent',
              issued: DEMO.util.d(0),
              due: DEMO.util.d(14),
              lines: lines
            });
            DEMO.store.update('jobs', job.id, { status: 'invoiced' });
            ui.toast('Invoice sent — ' + DEMO.fmt.money(invTotal(inv)), 'ok');
            DEMO.router.refresh();
          }
        }
      ]
    });
  }

  /* ---- List view --------------------------------------------------------------- */

  function renderList(el, filter) {
    var ui = DEMO.ui;
    var invoices = DEMO.store.get('invoices').slice().sort(function (a, b) {
      return (a.issued || '') < (b.issued || '') ? 1 : -1;
    });
    var open = invoices.filter(function (i) { return i.status === 'sent'; });
    var overdue = invoices.filter(function (i) { return i.status === 'overdue'; });
    var paidThisMonth = invoices.filter(function (i) {
      return i.status === 'paid' && (i.issued || '').slice(0, 7) === DEMO.util.d(0).slice(0, 7);
    });

    var head = ui.el('<div class="page-head"><div><h1>Money</h1><p class="muted"></p></div></div>');
    head.querySelector('p').textContent = 'Invoices out the door and money in the bank.';
    var newBtn = ui.el('<button type="button" class="btn btn--primary">Invoice a finished ' + ui.esc(jobNoun()) + '</button>');
    newBtn.addEventListener('click', openInvoiceJob);
    head.appendChild(newBtn);
    el.appendChild(head);

    var kpis = ui.el('<div class="kpi-grid"></div>');
    ui.mount(kpis,
      ui.kpi({ label: 'Invoiced this month', value: DEMO.fmt.money(DEMO.store.derive.invoicedThisMonth()),
        sub: 'Incl. GST', tone: 'ok' }),
      ui.kpi({ label: 'Awaiting payment', value: DEMO.fmt.money(sumTotals(open)),
        sub: open.length + ' invoice' + (open.length === 1 ? '' : 's') + ' out', tone: 'brand' }),
      ui.kpi({ label: 'Overdue', value: DEMO.fmt.money(sumTotals(overdue)),
        sub: overdue.length ? 'Chase these today' : 'Nothing overdue',
        tone: overdue.length ? 'danger' : 'ok' }),
      ui.kpi({ label: 'Paid this month', value: DEMO.fmt.money(sumTotals(paidThisMonth)),
        sub: paidThisMonth.length + ' invoice' + (paidThisMonth.length === 1 ? '' : 's'), tone: 'ok' }));
    el.appendChild(kpis);

    var toolbar = ui.el('<div class="toolbar"></div>');
    toolbar.appendChild(ui.select(
      [{ value: 'all', label: 'All invoices' }, { value: 'draft', label: 'Drafts' },
       { value: 'sent', label: 'Awaiting payment' }, { value: 'overdue', label: 'Overdue' },
       { value: 'paid', label: 'Paid' }],
      filter || 'all',
      function (v) {
        el.innerHTML = '';
        renderList(el, v);
      }));
    el.appendChild(toolbar);

    var shown = filter && filter !== 'all'
      ? invoices.filter(function (i) { return i.status === filter; })
      : invoices;

    el.appendChild(ui.table({
      columns: [
        { key: 'issued', label: 'Issued',
          render: function (i) { return DEMO.fmt.relDay(i.issued); } },
        { key: 'customerId', label: 'Customer',
          render: function (i) {
            return twoLine(DEMO.store.derive.customerName(i.customerId),
              (i.lines && i.lines[0] && i.lines[0].desc) || '');
          } },
        { key: 'due', label: 'Due',
          render: function (i) {
            if (i.status === 'paid') return '—';
            var days = DEMO.util.daysFromToday(i.due);
            return twoLine(DEMO.fmt.date(i.due),
              days < 0 ? Math.abs(days) + ' days late' : 'in ' + days + ' days');
          } },
        { key: 'total', label: 'Total (incl. GST)', align: 'right',
          render: function (i) { return DEMO.fmt.money(invTotal(i)); } },
        { key: 'status', label: 'Status',
          render: function (i) { return ui.chip(i.status); } }
      ],
      rows: shown,
      onRow: function (i) { DEMO.router.go('money/invoice/' + i.id); },
      empty: 'No invoices here — finish a ' + jobNoun() + ' and invoice it in two taps.'
    }));
  }

  /* ---- Detail view --------------------------------------------------------------- */

  function renderDetail(el, id) {
    var ui = DEMO.ui;
    var inv = DEMO.store.find('invoices', id);
    if (!inv) {
      el.appendChild(ui.emptyState('That invoice is no longer in the demo data.',
        { label: 'Back to money', href: '#/money' }));
      return;
    }
    var customer = DEMO.store.find('customers', inv.customerId) || {};
    var totals = DEMO.store.derive.invoiceTotals(inv);

    var head = ui.el('<div class="page-head"><div><h1></h1><p class="muted"></p></div></div>');
    head.querySelector('h1').textContent = 'Invoice — ' + (customer.name || 'customer');
    head.querySelector('p').textContent = 'Issued ' + DEMO.fmt.date(inv.issued) +
      ' · due ' + DEMO.fmt.date(inv.due) +
      (customer.phone ? ' · ' + customer.phone : '');
    head.appendChild(ui.el('<a class="btn" href="#/money">&larr; All invoices</a>'));
    el.appendChild(head);

    var status = ui.el('<div class="toolbar"></div>');
    status.appendChild(ui.chip(inv.status));
    if (inv.jobId && DEMO.store.find('jobs', inv.jobId)) {
      status.appendChild(ui.el('<a class="btn btn--sm" href="#/schedule/job/' + ui.esc(inv.jobId) + '">View ' + ui.esc(jobNoun()) + '</a>'));
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
      rows: inv.lines || [],
      empty: 'No line items on this invoice.'
    }));

    el.appendChild(ui.el('<div class="card qa-totals">' +
      '<div class="qa-totals__row"><span>Subtotal</span><span>' + ui.esc(DEMO.fmt.money(totals.subtotal)) + '</span></div>' +
      '<div class="qa-totals__row"><span>GST 10%</span><span>' + ui.esc(DEMO.fmt.money(totals.gst)) + '</span></div>' +
      '<div class="qa-totals__row qa-totals__row--total"><span>Total</span><span>' + ui.esc(DEMO.fmt.money(totals.total)) + '</span></div>' +
      '</div>'));

    var actions = ui.el('<div class="toolbar"></div>');
    if (inv.status === 'draft') {
      var sendBtn = ui.el('<button type="button" class="btn btn--primary">Send invoice</button>');
      sendBtn.addEventListener('click', function () {
        DEMO.store.update('invoices', inv.id, { status: 'sent', issued: inv.issued || DEMO.util.d(0) });
        ui.toast('Invoice sent to ' + (customer.name || 'customer'), 'ok');
        DEMO.router.refresh();
      });
      actions.appendChild(sendBtn);
    } else if (inv.status === 'sent' || inv.status === 'overdue') {
      var paidBtn = ui.el('<button type="button" class="btn btn--primary">Record payment</button>');
      paidBtn.addEventListener('click', function () {
        DEMO.store.update('invoices', inv.id, { status: 'paid' });
        ui.toast('Paid — ' + DEMO.fmt.money(totals.total) + ' in the bank', 'ok');
        DEMO.router.refresh();
      });
      actions.appendChild(paidBtn);
    }
    el.appendChild(actions);
  }

  DEMO.routes['money'] = {
    title: 'Money',
    render: function (el, parts) {
      if (parts && parts[0] === 'invoice' && parts[1]) renderDetail(el, parts[1]);
      else renderList(el, 'all');
    }
  };
})();
