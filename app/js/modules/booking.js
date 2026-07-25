/* Book online — the customer-facing flow the marketing sites link to
   (#/book; core/router.js flips <body> into consumer mode and hides all admin
   chrome). Three steps: service → time → details, then a confirmation with
   calendar sync. Bookings land straight in the admin schedule as jobs with
   source "booking". Deep link #/book/<serviceId> pre-selects a service. */
(function () {
  'use strict';

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M8 3v4M16 3v4M3.5 9.5h17"/>' +
    '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/>' +
    '<path d="m9 15 2.2 2.2L15.5 13"/></svg>';
  var ICON_TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.2 2.4 2.4 4.6-5"/></svg>';

  DEMO.nav.push({ section: 'book', label: 'Book online', icon: ICON });

  var SLOTS = ['07:30', '09:00', '10:30', '13:00', '14:30', '16:00'];

  function biz() { return DEMO.businesses[DEMO.store.slug] || {}; }
  function services() { return (biz().terms || {}).bookingServices || []; }

  /* Next 7 bookable days (tomorrow onward, Sundays skipped). */
  function bookableDays() {
    var days = [];
    var offset = 1;
    while (days.length < 7) {
      var iso = DEMO.util.d(offset);
      if (DEMO.util.parse(iso).getDay() !== 0) days.push(iso);
      offset += 1;
    }
    return days;
  }

  /* A slot is taken when an existing job overlaps it — real availability,
     driven by the same data the admin schedule shows. */
  function slotTaken(dayISO, time) {
    var slotStart = DEMO.util.parse(dayISO + 'T' + time).getTime();
    return DEMO.store.get('jobs').some(function (j) {
      if ((j.start || '').slice(0, 10) !== dayISO) return false;
      if (j.status === 'done' || j.status === 'invoiced') return false;
      var start = DEMO.util.parse(j.start).getTime();
      var end = start + (j.durationHrs || 1) * 3600000;
      return slotStart >= start && slotStart < end;
    });
  }

  /* Least-loaded staff member on the chosen day gets the booking. */
  function pickAssignee(dayISO) {
    var staff = (biz().terms || {}).staff || [];
    if (!staff.length) return 'Unassigned';
    var load = {};
    staff.forEach(function (s) { load[s] = 0; });
    DEMO.store.get('jobs').forEach(function (j) {
      if ((j.start || '').slice(0, 10) === dayISO && load[j.assignee] != null) {
        load[j.assignee] += 1;
      }
    });
    return staff.slice().sort(function (a, b) { return load[a] - load[b]; })[0];
  }

  function matchCustomer(name, phone) {
    var digits = String(phone || '').replace(/\D/g, '');
    var lower = String(name || '').trim().toLowerCase();
    return DEMO.store.get('customers').filter(function (c) {
      var cDigits = String(c.phone || '').replace(/\D/g, '');
      return (digits && cDigits && cDigits === digits) ||
        (lower && c.name.toLowerCase() === lower);
    })[0] || null;
  }

  /* ---- Steps ---------------------------------------------------------------- */

  function stepsBar(active) {
    var labels = ['Service', 'Time', 'Details'];
    var bar = DEMO.ui.el('<ol class="book-steps"></ol>');
    labels.forEach(function (label, i) {
      var li = document.createElement('li');
      li.className = 'book-steps__step' + (i === active ? ' is-active' : i < active ? ' is-done' : '');
      li.textContent = label;
      bar.appendChild(li);
    });
    return bar;
  }

  DEMO.routes['book'] = {
    title: 'Book online',
    render: function (el, parts) {
      var ui = DEMO.ui;
      var state = {
        service: null,
        day: null,
        time: null
      };
      var preselect = parts && parts[0];
      if (preselect) {
        services().forEach(function (s) { if (s.id === preselect) state.service = s; });
      }

      var wrap = ui.el('<div class="book"></div>');
      el.appendChild(wrap);

      function heading(title, sub) {
        var head = ui.el('<div class="page-head"><div><h1></h1><p class="muted"></p></div></div>');
        head.querySelector('h1').textContent = title;
        head.querySelector('p').textContent = sub;
        return head;
      }

      function renderService() {
        wrap.innerHTML = '';
        wrap.appendChild(heading('Book with ' + (biz().name || 'us'),
          'Pick a service to get started — takes under a minute, no account needed.'));
        wrap.appendChild(stepsBar(0));

        var grid = ui.el('<div class="grid grid--2"></div>');
        services().forEach(function (s) {
          var card = ui.el('<button type="button" class="card book-service"></button>');
          var name = ui.el('<h2></h2>');
          name.textContent = s.name;
          var meta = ui.el('<p class="muted"></p>');
          meta.textContent = 'About ' + s.durationHrs + ' hr' + (s.durationHrs === 1 ? '' : 's') +
            (s.fromPrice ? ' · from ' + DEMO.fmt.money(s.fromPrice) : ' · free');
          ui.mount(card, name, meta);
          card.addEventListener('click', function () {
            state.service = s;
            renderTime();
          });
          grid.appendChild(card);
        });
        wrap.appendChild(grid);

        var phone = biz().phone;
        if (phone) {
          var help = ui.el('<p class="muted book-help"></p>');
          help.textContent = 'Rather talk it through? Call ' + phone + ' — ' +
            (biz().owner || 'the team') + ' picks up.';
          wrap.appendChild(help);
        }
      }

      function renderTime() {
        wrap.innerHTML = '';
        wrap.appendChild(heading(state.service.name,
          'Choose a day and arrival time. Greyed-out times are already booked.'));
        wrap.appendChild(stepsBar(1));

        var days = bookableDays();
        if (!state.day) state.day = days[0];

        var dayRow = ui.el('<div class="book-days" role="tablist" aria-label="Choose a day"></div>');
        days.forEach(function (iso) {
          var b = ui.el('<button type="button" class="book-day" role="tab"></button>');
          if (iso === state.day) b.classList.add('is-active');
          b.setAttribute('aria-selected', iso === state.day ? 'true' : 'false');
          b.appendChild(ui.el('<span class="book-day__name">' + ui.esc(DEMO.fmt.relDay(iso).split(' ')[0]) + '</span>'));
          var dt = DEMO.util.parse(iso);
          b.appendChild(ui.el('<span class="book-day__date">' + dt.getDate() + '/' + (dt.getMonth() + 1) + '</span>'));
          b.addEventListener('click', function () {
            state.day = iso;
            state.time = null;
            renderTime();
          });
          dayRow.appendChild(b);
        });
        wrap.appendChild(dayRow);

        var slotGrid = ui.el('<div class="book-slots"></div>');
        var anyFree = false;
        SLOTS.forEach(function (t) {
          var taken = slotTaken(state.day, t);
          if (!taken) anyFree = true;
          var b = ui.el('<button type="button" class="book-slot"></button>');
          b.textContent = DEMO.fmt.time(state.day + 'T' + t);
          if (taken) {
            b.disabled = true;
            b.classList.add('is-taken');
          } else {
            b.addEventListener('click', function () {
              state.time = t;
              renderDetails();
            });
          }
          slotGrid.appendChild(b);
        });
        wrap.appendChild(slotGrid);
        if (!anyFree) {
          wrap.appendChild(ui.emptyState('That day is fully booked — try another day.'));
        }

        var back = ui.el('<button type="button" class="btn btn--ghost">&larr; Change service</button>');
        back.addEventListener('click', renderService);
        wrap.appendChild(back);
      }

      function renderDetails() {
        wrap.innerHTML = '';
        wrap.appendChild(heading('Almost done',
          state.service.name + ' — ' + DEMO.fmt.relDay(state.day) + ' at ' +
          DEMO.fmt.time(state.day + 'T' + state.time)));
        wrap.appendChild(stepsBar(2));

        var nameInput = ui.el('<input class="input" type="text" autocomplete="name" placeholder="Full name">');
        var phoneInput = ui.el('<input class="input" type="tel" autocomplete="tel" placeholder="04xx xxx xxx">');
        var suburbInput = ui.el('<input class="input" type="text" placeholder="Suburb">');
        var emailInput = ui.el('<input class="input" type="email" autocomplete="email" placeholder="you@example.com.au">');
        var notesInput = ui.el('<textarea class="input" rows="3" placeholder="Anything we should know before we arrive?"></textarea>');

        var form = ui.el('<div class="card qa-form book-form"></div>');
        ui.mount(form,
          ui.formRow('Your name', nameInput),
          ui.formRow('Mobile', phoneInput),
          ui.formRow('Suburb', suburbInput),
          ui.formRow('Email (for the confirmation)', emailInput),
          ui.formRow('Notes — optional', notesInput));

        var confirmBtn = ui.el('<button type="button" class="btn btn--primary">Confirm booking</button>');
        var back = ui.el('<button type="button" class="btn btn--ghost">&larr; Change time</button>');
        var foot = ui.el('<div class="qa-foot"></div>');
        ui.mount(foot, confirmBtn, back);
        form.appendChild(foot);
        wrap.appendChild(form);

        var privacy = ui.el('<p class="muted book-help">Demo note: nothing is sent anywhere — this booking only lives in your browser.</p>');
        wrap.appendChild(privacy);

        back.addEventListener('click', renderTime);
        confirmBtn.addEventListener('click', function () {
          var name = String(nameInput.value || '').trim();
          var phone = String(phoneInput.value || '').trim();
          if (!name) { ui.toast('Add your name so we know who to ask for', 'warn'); nameInput.focus(); return; }
          if (!phone) { ui.toast('Add a mobile so we can confirm the time', 'warn'); phoneInput.focus(); return; }

          var customer = matchCustomer(name, phone);
          if (!customer) {
            customer = DEMO.store.add('customers', {
              name: name,
              suburb: String(suburbInput.value || '').trim() || '—',
              phone: phone,
              email: String(emailInput.value || '').trim()
            });
          }

          var job = DEMO.store.add('jobs', {
            customerId: customer.id,
            title: state.service.name,
            status: 'scheduled',
            start: state.day + 'T' + state.time,
            durationHrs: state.service.durationHrs || 1,
            assignee: pickAssignee(state.day),
            source: 'booking',
            notes: String(notesInput.value || '').trim()
          });
          renderConfirmed(job, customer);
        });
      }

      function renderConfirmed(job, customer) {
        wrap.innerHTML = '';
        var card = ui.el('<div class="card book-confirm"></div>');
        card.appendChild(ui.el('<div class="qa-success__icon" aria-hidden="true">' + ICON_TICK + '</div>'));
        var h = ui.el('<h1>Booking confirmed</h1>');
        card.appendChild(h);
        var what = ui.el('<p></p>');
        what.textContent = state.service.name + ' — ' + DEMO.fmt.relDay(job.start) +
          ' at ' + DEMO.fmt.time(job.start) + ', with ' + job.assignee + '.';
        card.appendChild(what);
        var ref = ui.el('<p class="muted"></p>');
        ref.textContent = 'Booking reference ' + job.id.toUpperCase() +
          '. We’ll text ' + customer.phone + ' the day before to confirm.';
        card.appendChild(ref);

        card.appendChild(DEMO.cal.linkButtons({
          title: state.service.name + ' — ' + (biz().name || ''),
          start: job.start,
          durationHrs: job.durationHrs,
          location: customer.suburb === '—' ? '' : customer.suburb,
          details: 'Booked online with ' + (biz().name || 'us') + '. Reference ' + job.id.toUpperCase() + '.'
        }));

        var links = ui.el('<div class="qa-foot"></div>');
        if (biz().siteUrl) {
          links.appendChild(ui.el('<a class="btn btn--primary" href="' + ui.esc(biz().siteUrl) + '">Back to website</a>'));
        }
        var another = ui.el('<button type="button" class="btn btn--ghost">Make another booking</button>');
        another.addEventListener('click', function () {
          state.service = null; state.day = null; state.time = null;
          renderService();
        });
        links.appendChild(another);
        card.appendChild(links);
        wrap.appendChild(card);
      }

      if (state.service) renderTime(); else renderService();
    }
  };
})();
