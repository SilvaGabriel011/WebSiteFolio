/* Inventory module — stock on hand, searchable and filterable by category,
   with a per-item drawer (details, stock adjustment, recent movements) and a
   recent-movements feed. Route: #/inventory (deep link #/inventory/item/<id>
   opens the drawer). */
(function () {
  'use strict';

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M12 3 4 7v10l8 4 8-4V7z"/><path d="M4 7l8 4 8-4M12 11v10"/></svg>';

  DEMO.nav.push({ section: 'inventory', label: 'Inventory', icon: ICON });

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

  function stockValue(items) {
    var v = 0;
    items.forEach(function (s) { v += (s.qty || 0) * (s.unitCost || 0); });
    return Math.round(v * 100) / 100;
  }

  function categories() {
    var seen = {};
    var out = [];
    DEMO.store.get('stock').forEach(function (s) {
      var c = s.category || 'Uncategorised';
      if (!seen[c]) { seen[c] = true; out.push(c); }
    });
    return out.sort();
  }

  /* ---- Item drawer ----------------------------------------------------------- */

  function movementsFor(id) {
    return DEMO.store.get('movements')
      .filter(function (m) { return m.stockId === id; })
      .slice()
      .sort(function (a, b) { return a.date < b.date ? 1 : -1; })
      .slice(0, 6);
  }

  function openItem(item) {
    var ui = DEMO.ui;
    var supplier = DEMO.store.find('suppliers', item.supplierId);

    var body = ui.el('<div class="qa-form"></div>');

    var levels = ui.el('<div></div>');
    ui.mount(levels, twoLine(
      item.qty + ' in stock · minimum ' + item.min,
      'Unit cost ' + DEMO.fmt.money(item.unitCost) + ' · on-hand value ' +
        DEMO.fmt.money((item.qty || 0) * (item.unitCost || 0))));
    if (item.qty <= item.min) levels.appendChild(ui.chip('low'));
    body.appendChild(ui.formRow('Levels', levels));

    if (supplier) {
      body.appendChild(ui.formRow('Usual supplier',
        twoLine(supplier.name, supplier.phone)));
    }

    /* Stock adjustment: signed quantity + reason → movement + level update. */
    var deltaInput = ui.el('<input class="input" type="number" step="1" placeholder="e.g. -2 used, 5 received">');
    var reasonInput = ui.el('<input class="input" type="text" placeholder="Why? e.g. Used on job, stocktake">');
    body.appendChild(ui.formRow('Adjust stock by', deltaInput));
    body.appendChild(ui.formRow('Reason', reasonInput));

    var recent = movementsFor(item.id);
    if (recent.length) {
      var list = ui.el('<div></div>');
      recent.forEach(function (m) {
        list.appendChild(twoLine(
          (m.delta > 0 ? '+' : '') + m.delta + ' — ' + (m.reason || 'adjustment'),
          DEMO.fmt.relDay(m.date)));
      });
      body.appendChild(ui.formRow('Recent movements', list));
    }

    ui.drawer({
      title: item.name,
      body: body,
      actions: [
        { label: 'Close', tone: 'ghost' },
        {
          label: 'Save adjustment', tone: 'primary',
          onClick: function () {
            var delta = parseInt(deltaInput.value, 10);
            if (!isFinite(delta) || delta === 0) {
              ui.toast('Enter how many in (positive) or out (negative)', 'warn');
              return false;
            }
            if (item.qty + delta < 0) {
              ui.toast('That would take stock below zero', 'warn');
              return false;
            }
            DEMO.store.update('stock', item.id, { qty: item.qty + delta });
            DEMO.store.add('movements', {
              date: DEMO.util.d(0),
              stockId: item.id,
              delta: delta,
              reason: String(reasonInput.value || '').trim() || 'Manual adjustment'
            });
            ui.toast('Stock updated — ' + item.name, 'ok');
            DEMO.router.refresh();
          }
        }
      ]
    });
  }

  /* ---- Screen ----------------------------------------------------------------- */

  DEMO.routes['inventory'] = {
    title: 'Inventory',
    render: function (el, parts) {
      var ui = DEMO.ui;
      var all = DEMO.store.get('stock');
      var low = DEMO.store.derive.lowStock();

      var head = ui.el('<div class="page-head"><div><h1>Inventory</h1><p class="muted"></p></div></div>');
      head.querySelector('p').textContent =
        'What’s on the shelf and in the van — tap an item to adjust it.';
      el.appendChild(head);

      var kpis = ui.el('<div class="kpi-grid"></div>');
      ui.mount(kpis,
        ui.kpi({ label: 'Stock lines', value: all.length, sub: categories().length + ' categories', tone: 'brand' }),
        ui.kpi({ label: 'On-hand value', value: DEMO.fmt.money(stockValue(all)), sub: 'At cost, ex GST', tone: 'ok' }),
        ui.kpi({ label: 'Low stock', value: low.length,
          sub: low.length ? 'At or below minimum' : 'All levels healthy',
          tone: low.length ? 'warn' : 'ok' }));
      el.appendChild(kpis);

      var state = { search: '', category: 'all' };

      var toolbar = ui.el('<div class="toolbar"></div>');
      var searchInput = ui.el('<input class="input" type="search" placeholder="Search name or SKU…" aria-label="Search stock">');
      var catSel = ui.select(
        [{ value: 'all', label: 'All categories' }].concat(categories().map(function (c) {
          return { value: c, label: c };
        })),
        'all',
        function (v) { state.category = v; redraw(); });
      ui.mount(toolbar, searchInput, catSel);
      el.appendChild(toolbar);

      var tableHost = document.createElement('div');
      el.appendChild(tableHost);

      function filtered() {
        var q = state.search.toLowerCase();
        return all.filter(function (s) {
          if (state.category !== 'all' && (s.category || 'Uncategorised') !== state.category) return false;
          if (!q) return true;
          return s.name.toLowerCase().indexOf(q) > -1 ||
            String(s.sku || '').toLowerCase().indexOf(q) > -1;
        });
      }

      function redraw() {
        tableHost.innerHTML = '';
        tableHost.appendChild(ui.table({
          columns: [
            { key: 'name', label: 'Item',
              render: function (s) { return twoLine(s.name, s.sku + ' · ' + (s.category || '')); } },
            { key: 'qty', label: 'In stock', align: 'right' },
            { key: 'min', label: 'Min', align: 'right' },
            { key: 'unitCost', label: 'Unit cost', align: 'right',
              render: function (s) { return DEMO.fmt.money(s.unitCost); } },
            { key: 'status', label: 'Status',
              render: function (s) { return s.qty <= s.min ? ui.chip('low') : ui.chip('in_stock'); } }
          ],
          rows: filtered(),
          onRow: openItem,
          empty: 'No stock matches that search.'
        }));
      }
      searchInput.addEventListener('input', function () {
        state.search = searchInput.value;
        redraw();
      });
      redraw();

      /* Recent movements across all items. */
      var recent = DEMO.store.get('movements').slice()
        .sort(function (a, b) { return a.date < b.date ? 1 : -1; })
        .slice(0, 8);
      var sec = document.createElement('section');
      sec.appendChild(ui.el('<div class="page-head"><h2>Recent movements</h2></div>'));
      sec.appendChild(ui.table({
        columns: [
          { key: 'date', label: 'When',
            render: function (m) { return DEMO.fmt.relDay(m.date); } },
          { key: 'stockId', label: 'Item',
            render: function (m) {
              var item = DEMO.store.find('stock', m.stockId);
              return item ? item.name : 'Stock item';
            } },
          { key: 'delta', label: 'Change', align: 'right',
            render: function (m) { return (m.delta > 0 ? '+' : '') + m.delta; } },
          { key: 'reason', label: 'Reason' }
        ],
        rows: recent,
        empty: 'No stock movements yet.'
      }));
      el.appendChild(sec);

      /* Deep link #/inventory/item/<id> → open the drawer over the list. */
      if (parts && parts[0] === 'item' && parts[1]) {
        var item = DEMO.store.find('stock', parts[1]);
        if (item) openItem(item);
      }
    }
  };
})();
