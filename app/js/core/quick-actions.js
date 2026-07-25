/* Quick actions — "New quote" and "Book maintenance", reachable from anywhere:
   a pinned panel in the desktop sidebar (#quick-actions), a floating + button
   on mobile (opens the same two actions in a sheet), and keyboard shortcuts
   N / M. Both actions open a slide-over drawer ON TOP of the current screen —
   no navigation, no lost context.

   Classic script. Load after core/ui.js and core/ics.js (uses DEMO.ui and
   DEMO.cal at click time, DEMO.store only after boot has seeded it). */
(function () {
  'use strict';
  window.DEMO = window.DEMO || {};

  var ICON_QUOTE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>';
  var ICON_SPANNER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4.5 4.5 0 0 0-6 5.6L3 17.6V21h3.4l5.7-5.7a4.5 4.5 0 0 0 5.6-6l-3 3-2.8-.7-.7-2.8z"/></svg>';
  var ICON_PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
  var ICON_TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.2 2.4 2.4 4.6-5"/></svg>';

  function biz() {
    return (DEMO.businesses && DEMO.store && DEMO.businesses[DEMO.store.slug]) || {};
  }
  function terms() { return biz().terms || {}; }

  function customerOptions() {
    return DEMO.store.get('customers')
      .slice()
      .sort(function (a, b) { return a.name < b.name ? -1 : 1; })
      .map(function (c) { return { value: c.id, label: c.name + ' — ' + c.suburb }; });
  }

  function refresh() {
    if (DEMO.router && DEMO.router.refresh) DEMO.router.refresh();
  }

  /* ---- Action 1: New quote ------------------------------------------------ */

  function openNewQuote() {
    var ui = DEMO.ui;
    var priceList = terms().priceList || [];
    var customers = customerOptions();
    if (!customers.length) { ui.toast('No customers in this demo dataset yet', 'warn'); return; }

    var custSel = ui.select(customers);

    var linesBox = ui.el('<div class="qa-lines"></div>');
    var lines = []; /* [{row, itemSel, descInput, qtyInput, priceInput, unit}] */

    var totalsEl = ui.el(
      '<div class="qa-totals">' +
      '<div class="qa-totals__row"><span>Subtotal</span><span data-t="sub">$0.00</span></div>' +
      '<div class="qa-totals__row"><span>GST 10%</span><span data-t="gst">$0.00</span></div>' +
      '<div class="qa-totals__row qa-totals__row--total"><span>Total</span><span data-t="tot">$0.00</span></div>' +
      '</div>');

    function readLines() {
      var out = [];
      lines.forEach(function (l) {
        if (!l.row.parentNode) return;
        var desc;
        if (l.itemSel.value === '__custom') {
          desc = l.descInput.input ? l.descInput.input.value : l.descInput.value;
          desc = String(desc || '').trim();
        } else {
          desc = (priceList[+l.itemSel.value] || {}).desc || '';
        }
        var qty = parseFloat(l.qtyInput.value);
        var price = parseFloat(l.priceInput.value);
        if (desc && isFinite(qty) && qty > 0 && isFinite(price) && price >= 0) {
          out.push({ desc: desc, qty: qty, unit: l.unit(), price: price });
        }
      });
      return out;
    }

    function recompute() {
      var t = DEMO.store.derive.totals(readLines());
      totalsEl.querySelector('[data-t="sub"]').textContent = DEMO.fmt.money(t.subtotal);
      totalsEl.querySelector('[data-t="gst"]').textContent = DEMO.fmt.money(t.gst);
      totalsEl.querySelector('[data-t="tot"]').textContent = DEMO.fmt.money(t.total);
    }

    function addLine() {
      var row = ui.el('<div class="qa-line"></div>');
      var opts = priceList.map(function (p, i) {
        return { value: i, label: p.desc + ' — ' + DEMO.fmt.money(p.price) + '/' + p.unit };
      });
      opts.push({ value: '__custom', label: 'Custom item…' });

      var itemSel = ui.select(opts, priceList.length ? 0 : '__custom');
      var descInput = ui.el('<input class="input qa-line__desc" type="text" placeholder="Describe the item or service" style="display:none">');
      var qtyInput = ui.el('<input class="input" type="number" min="0.5" step="0.5" value="1" aria-label="Quantity">');
      var priceInput = ui.moneyInput(priceList.length ? priceList[0].price : '');
      var removeBtn = ui.el('<button type="button" class="qa-line__remove" aria-label="Remove line">&times;</button>');

      var line = {
        row: row, itemSel: itemSel, descInput: descInput,
        qtyInput: qtyInput, priceInput: priceInput,
        unit: function () {
          return itemSel.value === '__custom' ? 'ea' : ((priceList[+itemSel.value] || {}).unit || 'ea');
        }
      };

      itemSel.addEventListener('change', function () {
        var custom = itemSel.value === '__custom';
        descInput.style.display = custom ? '' : 'none';
        if (!custom) priceInput.value = (priceList[+itemSel.value] || {}).price;
        recompute();
      });
      removeBtn.addEventListener('click', function () {
        row.parentNode.removeChild(row);
        recompute();
      });

      ui.mount(row, itemSel, qtyInput, priceInput, removeBtn, descInput);
      linesBox.appendChild(row);
      lines.push(line);
      recompute();
    }

    var addBtn = ui.el('<button type="button" class="btn btn--ghost qa-add-line">+ Add item</button>');
    addBtn.addEventListener('click', addLine);

    var saveDraftBtn = ui.el('<button type="button" class="btn">Save draft</button>');
    var saveSendBtn = ui.el('<button type="button" class="btn btn--primary">Save &amp; send</button>');
    var foot = ui.el('<div class="qa-foot"></div>');
    ui.mount(foot, saveSendBtn, saveDraftBtn);

    var form = ui.el('<div class="qa-form"></div>');
    ui.mount(form,
      ui.formRow('Customer', custSel),
      ui.formRow('Line items', ui.mount(ui.el('<div></div>'), linesBox, addBtn)),
      totalsEl,
      foot,
      ui.el('<p class="qa-hint">Saved quotes appear straight away under Sales — GST is worked out for you.</p>')
    );
    linesBox.addEventListener('input', recompute);

    var dlg = ui.drawer({ title: 'New quote', body: form });

    function save(status) {
      var quoteLines = readLines();
      if (!quoteLines.length) { ui.toast('Add at least one line item', 'warn'); return; }
      var q = DEMO.store.add('quotes', {
        customerId: custSel.value,
        status: status,
        date: DEMO.util.d(0),
        notes: 'Created via quick actions',
        lines: quoteLines
      });
      dlg.close();
      ui.toast('Quote ' + (status === 'sent' ? 'sent to' : 'saved for') + ' ' +
        DEMO.store.derive.customerName(q.customerId), 'ok');
      refresh();
    }

    saveDraftBtn.addEventListener('click', function () { save('draft'); });
    saveSendBtn.addEventListener('click', function () { save('sent'); });
    addLine();
  }

  /* ---- Action 2: Book maintenance ----------------------------------------- */

  var TIME_SLOTS = ['07:30', '09:00', '10:30', '13:00', '14:30', '16:00'];

  function openMaintenance() {
    var ui = DEMO.ui;
    var due = DEMO.store.derive.maintenanceDue(9999); /* every asset, soonest first */
    var staff = terms().staff || [];
    var assetLabel = terms().assetLabel || 'Maintenance';

    var form = ui.el('<div class="qa-form"></div>');
    var titleInput = null, custSel = null, assetSel = null;

    var dateInput = ui.el('<input class="input" type="date">');
    var timeSel = ui.select(TIME_SLOTS, '09:00');
    var durSel = ui.select(
      [{ value: 1, label: '1 hour' }, { value: 1.5, label: '1.5 hours' },
       { value: 2, label: '2 hours' }, { value: 3, label: '3 hours' }],
      1.5);
    var staffSel = ui.select(staff.length ? staff : ['Unassigned']);

    function entryFor(assetId) {
      for (var i = 0; i < due.length; i++) if (due[i].asset.id === assetId) return due[i];
      return null;
    }

    function defaultDate(entry) {
      /* Overdue or due today → book tomorrow; otherwise book on the due date. */
      return (entry && entry.days > 0) ? entry.due.slice(0, 10) : DEMO.util.d(1);
    }

    if (due.length) {
      assetSel = ui.select(due.map(function (e) {
        var when = e.overdue ? 'overdue' : 'due ' + DEMO.fmt.relDay(e.due).toLowerCase();
        return {
          value: e.asset.id,
          label: e.asset.name + ' — ' + DEMO.store.derive.customerName(e.asset.customerId) + ' (' + when + ')'
        };
      }));
      dateInput.value = defaultDate(due[0]);
      assetSel.addEventListener('change', function () {
        dateInput.value = defaultDate(entryFor(assetSel.value));
      });
      ui.mount(form, ui.formRow(assetLabel, assetSel));
    } else {
      /* No assets seeded — book a one-off maintenance visit instead. */
      custSel = ui.select(customerOptions());
      titleInput = ui.el('<input class="input" type="text" placeholder="e.g. Annual service visit">');
      dateInput.value = DEMO.util.d(1);
      ui.mount(form, ui.formRow('Customer', custSel), ui.formRow('What needs servicing?', titleInput));
    }

    var bookBtn = ui.el('<button type="button" class="btn btn--primary">Book service</button>');
    var cancelBtn = ui.el('<button type="button" class="btn btn--ghost">Cancel</button>');
    var foot = ui.el('<div class="qa-foot"></div>');
    ui.mount(foot, bookBtn, cancelBtn);

    ui.mount(form,
      ui.formRow('Date', dateInput),
      ui.formRow('Time', timeSel),
      ui.formRow('Duration', durSel),
      ui.formRow('Assign to', staffSel),
      foot);

    var dlg = ui.drawer({ title: 'Book maintenance', body: form });
    cancelBtn.addEventListener('click', dlg.close);

    bookBtn.addEventListener('click', function () {
      var customerId, title;
      if (assetSel) {
        var entry = entryFor(assetSel.value);
        if (!entry) return;
        customerId = entry.asset.customerId;
        title = entry.asset.name + ' — service';
      } else {
        customerId = custSel.value;
        title = String((titleInput.value || '')).trim() || 'Maintenance visit';
      }
      if (!dateInput.value) { ui.toast('Pick a date', 'warn'); return; }

      var customer = DEMO.store.find('customers', customerId) || {};
      var job = DEMO.store.add('jobs', {
        customerId: customerId,
        title: title,
        status: 'scheduled',
        start: dateInput.value + 'T' + timeSel.value,
        durationHrs: parseFloat(durSel.value),
        assignee: staffSel.value,
        source: 'maintenance',
        notes: 'Booked via quick actions'
      });
      refresh();

      /* Success state in the same drawer: confirmation + calendar sync. */
      var success = ui.el(
        '<div class="qa-success">' +
        '<div class="qa-success__icon" aria-hidden="true">' + ICON_TICK + '</div>' +
        '<h3>Service booked</h3>' +
        '<p>' + ui.esc(title) + '</p>' +
        '<p>' + ui.esc(DEMO.fmt.relDay(job.start) + ' at ' + DEMO.fmt.time(job.start) +
          ' · ' + job.assignee) + '</p>' +
        '</div>');
      var cal = ui.el('<div class="qa-cal"></div>');
      cal.appendChild(DEMO.cal.linkButtons({
        title: title,
        start: job.start,
        durationHrs: job.durationHrs,
        location: customer.suburb || '',
        details: 'Maintenance booking for ' + (customer.name || 'customer')
      }));
      success.appendChild(cal);

      var viewBtn = ui.el('<a class="btn btn--primary" href="#/schedule">View schedule</a>');
      var doneBtn = ui.el('<button type="button" class="btn btn--ghost">Done</button>');
      viewBtn.addEventListener('click', function () { dlg.close(); });
      doneBtn.addEventListener('click', dlg.close);
      var sFoot = ui.el('<div class="qa-foot"></div>');
      ui.mount(sFoot, viewBtn, doneBtn);
      success.appendChild(sFoot);

      form.innerHTML = '';
      form.appendChild(success);
    });
  }

  /* ---- Entry points: sidebar panel, mobile FAB, keyboard ------------------- */

  function actionButton(extraClass, icon, label, key, onClick) {
    var b = DEMO.ui.el(
      '<button type="button" class="qa-btn' + (extraClass ? ' ' + extraClass : '') + '">' +
      '<span class="qa-btn__icon" aria-hidden="true">' + icon + '</span>' +
      '<span>' + label + '</span>' +
      (key ? '<kbd aria-label="Shortcut ' + key + '">' + key + '</kbd>' : '') +
      '</button>');
    b.addEventListener('click', onClick);
    return b;
  }

  function buildSidebarPanel() {
    var host = document.getElementById('quick-actions');
    if (!host) return;
    host.innerHTML = '';
    var panel = DEMO.ui.el('<div class="qa-panel"><p class="qa-panel__label">Quick actions</p></div>');
    panel.appendChild(actionButton('qa-btn--primary', ICON_QUOTE, 'New quote', 'N', openNewQuote));
    panel.appendChild(actionButton('', ICON_SPANNER, 'Book maintenance', 'M', openMaintenance));
    host.appendChild(panel);
  }

  function buildFab() {
    var fab = DEMO.ui.el(
      '<button type="button" class="qa-fab" aria-label="Quick actions: new quote or book maintenance">' +
      ICON_PLUS + '</button>');
    fab.addEventListener('click', function () {
      var sheet = DEMO.ui.el('<div class="qa-sheet"></div>');
      var dlg = DEMO.ui.drawer({ title: 'Quick actions', body: sheet });
      sheet.appendChild(actionButton('qa-btn--primary', ICON_QUOTE, 'New quote', null, function () {
        dlg.close(); openNewQuote();
      }));
      sheet.appendChild(actionButton('', ICON_SPANNER, 'Book maintenance', null, function () {
        dlg.close(); openMaintenance();
      }));
    });
    document.body.appendChild(fab);
  }

  function isTypingTarget(t) {
    if (!t) return false;
    var tag = (t.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || t.isContentEditable;
  }

  function bindHotkeys() {
    document.addEventListener('keydown', function (e) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      var k = (e.key || '').toLowerCase();
      if (k !== 'n' && k !== 'm') return;
      if (isTypingTarget(e.target)) return;
      if (document.querySelector('.overlay')) return; /* something is already open */
      if (document.body.classList.contains('consumer')) return; /* not in the public booking flow */
      e.preventDefault();
      if (k === 'n') openNewQuote(); else openMaintenance();
    });
  }

  /* Modules reuse the same drawers ("New quote" on Sales, etc.). */
  DEMO.quickActions = { newQuote: openNewQuote, bookMaintenance: openMaintenance };

  function init() {
    if (!DEMO.ui) return; /* ui kit missing — fail quietly, demo still works */
    buildSidebarPanel();
    buildFab();
    bindHotkeys();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
