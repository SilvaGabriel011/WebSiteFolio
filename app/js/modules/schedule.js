/* Schedule module — the run sheet. Today plus the coming week, grouped by
   day, with an "Add job" drawer and a job detail drawer (status progression
   scheduled → in progress → done → invoiced, calendar sync, linked quote and
   invoice). Routes: #/schedule and #/schedule/job/<id>. */
(function () {
  'use strict';

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/>' +
    '<path d="M3.5 10h17M8 3v4M16 3v4"/></svg>';

  DEMO.nav.push({ section: 'schedule', label: 'Schedule', icon: ICON });

  var TIME_SLOTS = ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00',
    '10:30', '11:00', '11:30', '12:00', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00'];

  function terms() {
    var biz = DEMO.businesses[DEMO.store.slug] || {};
    return biz.terms || {};
  }
  function jobNoun() { return terms().jobNoun || 'job'; }
  function cap(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }

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

  function customerOptions() {
    return DEMO.store.get('customers')
      .slice()
      .sort(function (a, b) { return a.name < b.name ? -1 : 1; })
      .map(function (c) { return { value: c.id, label: c.name + ' — ' + c.suburb }; });
  }

  /* ---- Add job drawer ------------------------------------------------------ */

  function openAddJob() {
    var ui = DEMO.ui;
    var staff = terms().staff || ['Unassigned'];
    var customers = customerOptions();
    if (!customers.length) { ui.toast('No customers in this demo dataset yet', 'warn'); return; }

    var custSel = ui.select(customers);
    var titleInput = ui.el('<input class="input" type="text" placeholder="What needs doing?">');
    var dateInput = ui.el('<input class="input" type="date">');
    dateInput.value = DEMO.util.d(1);
    var timeSel = ui.select(TIME_SLOTS, '09:00');
    var durSel = ui.select(
      [{ value: 1, label: '1 hour' }, { value: 1.5, label: '1.5 hours' },
       { value: 2, label: '2 hours' }, { value: 3, label: '3 hours' },
       { value: 4, label: 'Half day (4 hrs)' }, { value: 8, label: 'Full day (8 hrs)' }],
      1.5);
    var staffSel = ui.select(staff);

    var saveBtn = ui.el('<button type="button" class="btn btn--primary">Add to schedule</button>');
    var cancelBtn = ui.el('<button type="button" class="btn btn--ghost">Cancel</button>');
    var foot = ui.el('<div class="qa-foot"></div>');
    ui.mount(foot, saveBtn, cancelBtn);

    var form = ui.el('<div class="qa-form"></div>');
    ui.mount(form,
      ui.formRow('Customer', custSel),
      ui.formRow(cap(jobNoun()), titleInput),
      ui.formRow('Date', dateInput),
      ui.formRow('Time', timeSel),
      ui.formRow('Duration', durSel),
      ui.formRow('Assign to', staffSel),
      foot);

    var dlg = ui.drawer({ title: 'New ' + jobNoun(), body: form });
    cancelBtn.addEventListener('click', dlg.close);
    saveBtn.addEventListener('click', function () {
      var title = String(titleInput.value || '').trim();
      if (!title) { ui.toast('Describe the ' + jobNoun() + ' first', 'warn'); return; }
      if (!dateInput.value) { ui.toast('Pick a date', 'warn'); return; }
      DEMO.store.add('jobs', {
        customerId: custSel.value,
        title: title,
        status: 'scheduled',
        start: dateInput.value + 'T' + timeSel.value,
        durationHrs: parseFloat(durSel.value),
        assignee: staffSel.value,
        source: 'manual',
        notes: ''
      });
      dlg.close();
      ui.toast(cap(jobNoun()) + ' added to the schedule', 'ok');
      DEMO.router.refresh();
    });
  }

  /* ---- Invoice-from-job drawer --------------------------------------------- */

  function invoiceForJob(job) {
    var invoices = DEMO.store.get('invoices');
    for (var i = 0; i < invoices.length; i++) if (invoices[i].jobId === job.id) return invoices[i];
    return null;
  }

  function openCreateInvoice(job, onDone) {
    var ui = DEMO.ui;
    var quote = job.quoteId ? DEMO.store.find('quotes', job.quoteId) : null;
    var lines = quote && quote.lines ? JSON.parse(JSON.stringify(quote.lines))
      : [{ desc: job.title, qty: 1, unit: 'ea', price: 0 }];

    var body = ui.el('<div class="qa-form"></div>');
    var intro = ui.el('<p class="muted"></p>');
    intro.textContent = quote
      ? 'Line items copied from the accepted quote — adjust if anything changed on the day.'
      : 'One line to start — set the price charged for this ' + jobNoun() + '.';
    body.appendChild(intro);

    var priceInputs = [];
    lines.forEach(function (l) {
      var price = ui.moneyInput(l.price || '');
      priceInputs.push({ line: l, input: price });
      var row = ui.el('<div></div>');
      ui.mount(row, ui.formRow(l.qty + ' × ' + l.desc, price));
      body.appendChild(row);
    });

    ui.drawer({
      title: 'Invoice — ' + DEMO.store.derive.customerName(job.customerId),
      body: body,
      actions: [
        { label: 'Cancel', tone: 'ghost' },
        {
          label: 'Create & send invoice', tone: 'primary',
          onClick: function () {
            priceInputs.forEach(function (p) {
              var n = parseFloat(p.input.value);
              p.line.price = isFinite(n) ? n : 0;
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
            var total = DEMO.store.derive.invoiceTotals(inv).total;
            ui.toast('Invoice sent — ' + DEMO.fmt.money(total), 'ok');
            if (onDone) onDone();
            DEMO.router.refresh();
          }
        }
      ]
    });
  }

  /* ---- Job detail drawer ---------------------------------------------------- */

  function openJob(job) {
    var ui = DEMO.ui;
    var customer = DEMO.store.find('customers', job.customerId) || {};
    var inv = invoiceForJob(job);

    var body = ui.el('<div class="qa-form"></div>');

    var when = ui.el('<div></div>');
    ui.mount(when, twoLine(
      DEMO.fmt.relDay(job.start) + ' at ' + DEMO.fmt.time(job.start),
      job.durationHrs + ' hr' + (job.durationHrs === 1 ? '' : 's') + ' · ' + (job.assignee || 'Unassigned')));
    body.appendChild(ui.formRow('When', when));

    var who = ui.el('<div></div>');
    ui.mount(who, twoLine(customer.name || 'Walk-in customer',
      [customer.suburb, customer.phone].filter(Boolean).join(' · ')));
    body.appendChild(ui.formRow('Customer', who));

    var st = ui.el('<div></div>');
    st.appendChild(ui.chip(job.status));
    body.appendChild(ui.formRow('Status', st));

    if (job.notes) {
      var notes = ui.el('<p></p>');
      notes.textContent = job.notes;
      body.appendChild(ui.formRow('Notes', notes));
    }

    if (job.quoteId && DEMO.store.find('quotes', job.quoteId)) {
      var qLink = ui.el('<a class="btn btn--sm" href="#/sales/quote/' + ui.esc(job.quoteId) + '">View quote</a>');
      body.appendChild(ui.formRow('Quote', qLink));
    }
    if (inv) {
      var iLink = ui.el('<a class="btn btn--sm" href="#/money/invoice/' + ui.esc(inv.id) + '">View invoice</a>');
      body.appendChild(ui.formRow('Invoice', iLink));
    }

    body.appendChild(ui.formRow('Calendar', DEMO.cal.linkButtons({
      title: job.title,
      start: job.start,
      durationHrs: job.durationHrs,
      location: customer.suburb || '',
      details: 'For ' + (customer.name || 'customer')
    })));

    var actions = [{ label: 'Close', tone: 'ghost' }];
    if (job.status === 'scheduled') {
      actions.push({
        label: 'Start ' + jobNoun(), tone: 'primary',
        onClick: function () {
          DEMO.store.update('jobs', job.id, { status: 'in_progress' });
          ui.toast(cap(jobNoun()) + ' started', 'ok');
          DEMO.router.refresh();
        }
      });
    } else if (job.status === 'in_progress') {
      actions.push({
        label: 'Mark done', tone: 'primary',
        onClick: function () {
          DEMO.store.update('jobs', job.id, { status: 'done' });
          ui.toast(cap(jobNoun()) + ' marked done', 'ok');
          DEMO.router.refresh();
        }
      });
    } else if (job.status === 'done' && !inv) {
      actions.push({
        label: 'Create invoice', tone: 'primary',
        onClick: function (api) {
          api.close();
          openCreateInvoice(job);
          return false;
        }
      });
    }

    ui.drawer({ title: job.title, body: body, actions: actions });
  }

  /* ---- Screen -------------------------------------------------------------- */

  function jobsTable(jobs) {
    return DEMO.ui.table({
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
      rows: jobs,
      onRow: openJob
    });
  }

  function daySection(iso, jobs) {
    var sec = document.createElement('section');
    sec.setAttribute('aria-label', DEMO.fmt.relDay(iso));
    var head = DEMO.ui.el('<div class="page-head"><h2></h2><span class="muted"></span></div>');
    head.querySelector('h2').textContent = DEMO.fmt.relDay(iso);
    head.querySelector('span').textContent =
      jobs.length + ' ' + jobNoun() + (jobs.length === 1 ? '' : 's');
    sec.appendChild(head);
    sec.appendChild(jobsTable(jobs));
    return sec;
  }

  DEMO.routes['schedule'] = {
    title: 'Schedule',
    render: function (el, parts) {
      /* Deep link #/schedule/job/<id> → open the drawer over the list. */
      var openId = (parts && parts[0] === 'job') ? parts[1] : null;

      var head = DEMO.ui.el('<div class="page-head"><div><h1>Schedule</h1><p class="muted"></p></div></div>');
      head.querySelector('p').textContent = 'The week ahead, day by day — tap a ' + jobNoun() + ' to update it.';
      var addBtn = DEMO.ui.el('<button type="button" class="btn btn--primary">+ New ' + DEMO.ui.esc(jobNoun()) + '</button>');
      addBtn.addEventListener('click', openAddJob);
      head.appendChild(addBtn);
      el.appendChild(head);

      var today = DEMO.util.d(0);
      var horizon = DEMO.util.d(7);
      var week = DEMO.store.derive.jobsBetween(today, horizon);

      if (!week.length) {
        el.appendChild(DEMO.ui.emptyState(
          'Nothing scheduled for the next 7 days.',
          { label: 'Add a ' + jobNoun(), onClick: openAddJob }));
      } else {
        var byDay = {};
        var order = [];
        week.forEach(function (j) {
          var day = (j.start || '').slice(0, 10);
          if (!byDay[day]) { byDay[day] = []; order.push(day); }
          byDay[day].push(j);
        });
        /* Today always leads, even when empty, so the run sheet reads honestly. */
        if (order.indexOf(today) === -1) {
          var empty = document.createElement('section');
          var h = DEMO.ui.el('<div class="page-head"><h2>Today</h2></div>');
          empty.appendChild(h);
          empty.appendChild(DEMO.ui.emptyState('No ' + jobNoun() + 's on today’s run sheet.'));
          el.appendChild(empty);
        }
        order.forEach(function (day) { el.appendChild(daySection(day, byDay[day])); });
      }

      /* Recently finished, for the "did we invoice it?" glance. */
      var past = DEMO.store.derive.jobsBetween(DEMO.util.d(-10), DEMO.util.d(-1))
        .filter(function (j) { return j.status === 'done' && !invoiceForJob(j); });
      if (past.length) {
        var sec = document.createElement('section');
        var h2 = DEMO.ui.el('<div class="page-head"><h2>Done — not yet invoiced</h2></div>');
        sec.appendChild(h2);
        sec.appendChild(jobsTable(past.reverse()));
        el.appendChild(sec);
      }

      if (openId) {
        var job = DEMO.store.find('jobs', openId);
        if (job) openJob(job);
      }
    }
  };
})();
