/* Purchasing module — suppliers and purchase orders. Receiving a PO updates
   stock levels and writes movement entries, and "Reorder low stock" raises
   draft POs grouped by supplier. Routes: #/purchasing and #/purchasing/po/<id>. */
(function () {
  'use strict';

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M4 7h13l3 5v5h-2.5M4 7v10h2.5M4 7l2-3h9l2 3"/>' +
    '<circle cx="8.5" cy="17.5" r="1.8"/><circle cx="16" cy="17.5" r="1.8"/></svg>';

  DEMO.nav.push({ section: 'purchasing', label: 'Purchasing', icon: ICON });

  function supplierName(id) {
    var s = DEMO.store.find('suppliers', id);
    return s ? s.name : 'Supplier';
  }

  function stockName(id) {
    var s = DEMO.store.find('stock', id);
    return s ? s.name : 'Stock item';
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

  /* ---- Reorder low stock ---------------------------------------------------- */

  function reorderLowStock() {
    var ui = DEMO.ui;
    var low = DEMO.store.derive.lowStock();
    if (!low.length) { ui.toast('Stock levels are healthy — nothing to reorder', 'ok'); return; }

    /* Group needed items by their usual supplier; order back up to 2× minimum. */
    var bySupplier = {};
    low.forEach(function (item) {
      var sid = item.supplierId || 'unknown';
      if (!bySupplier[sid]) bySupplier[sid] = [];
      bySupplier[sid].push({
        stockId: item.id,
        qty: Math.max(item.min * 2 - item.qty, 1),
        unitCost: item.unitCost || 0
      });
    });

    var summary = ui.el('<div class="qa-form"></div>');
    var intro = ui.el('<p class="muted"></p>');
    intro.textContent = low.length + ' item' + (low.length === 1 ? ' is' : 's are') +
      ' at or below minimum. This raises a draft order per supplier, topped up to twice the minimum level.';
    summary.appendChild(intro);
    Object.keys(bySupplier).forEach(function (sid) {
      var lines = bySupplier[sid];
      var value = 0;
      lines.forEach(function (l) { value += l.qty * l.unitCost; });
      var row = ui.el('<div></div>');
      row.appendChild(twoLine(supplierName(sid),
        lines.length + ' line' + (lines.length === 1 ? '' : 's') + ' · ' + DEMO.fmt.money(value)));
      summary.appendChild(row);
    });

    ui.drawer({
      title: 'Reorder low stock',
      body: summary,
      actions: [
        { label: 'Cancel', tone: 'ghost' },
        {
          label: 'Raise draft orders', tone: 'primary',
          onClick: function () {
            var count = 0;
            Object.keys(bySupplier).forEach(function (sid) {
              DEMO.store.add('purchaseOrders', {
                supplierId: sid === 'unknown' ? null : sid,
                status: 'draft',
                date: DEMO.util.d(0),
                lines: bySupplier[sid]
              });
              count += 1;
            });
            ui.toast(count + ' draft order' + (count === 1 ? '' : 's') + ' raised', 'ok');
            DEMO.router.refresh();
          }
        }
      ]
    });
  }

  /* ---- Receive a PO --------------------------------------------------------- */

  function receivePO(po) {
    (po.lines || []).forEach(function (l) {
      var item = DEMO.store.find('stock', l.stockId);
      if (item) DEMO.store.update('stock', item.id, { qty: item.qty + (l.qty || 0) });
      DEMO.store.add('movements', {
        date: DEMO.util.d(0),
        stockId: l.stockId,
        delta: l.qty || 0,
        reason: 'PO ' + po.id + ' received'
      });
    });
    DEMO.store.update('purchaseOrders', po.id, { status: 'received' });
    DEMO.ui.toast('Stock received and levels updated', 'ok');
    DEMO.router.refresh();
  }

  /* ---- List view ------------------------------------------------------------ */

  function renderList(el) {
    var ui = DEMO.ui;
    var pos = DEMO.store.get('purchaseOrders').slice().sort(function (a, b) {
      return a.date < b.date ? 1 : -1;
    });
    var open = pos.filter(function (p) { return p.status !== 'received'; });
    var openValue = 0;
    open.forEach(function (p) { openValue += DEMO.store.derive.poTotal(p); });
    var low = DEMO.store.derive.lowStock();

    var head = ui.el('<div class="page-head"><div><h1>Purchasing</h1><p class="muted"></p></div></div>');
    head.querySelector('p').textContent = 'Purchase orders and the suppliers behind them.';
    var reorderBtn = ui.el('<button type="button" class="btn btn--primary">Reorder low stock</button>');
    reorderBtn.addEventListener('click', reorderLowStock);
    head.appendChild(reorderBtn);
    el.appendChild(head);

    var kpis = ui.el('<div class="kpi-grid"></div>');
    ui.mount(kpis,
      ui.kpi({ label: 'Open orders', value: open.length,
        sub: open.length ? DEMO.fmt.money(openValue) + ' ex GST on the way' : 'Nothing outstanding',
        tone: 'brand' }),
      ui.kpi({ label: 'Low stock items', value: low.length,
        sub: low.length ? 'Ready to reorder in one tap' : 'All levels healthy',
        tone: low.length ? 'warn' : 'ok', href: '#/inventory' }),
      ui.kpi({ label: 'Suppliers', value: DEMO.store.get('suppliers').length,
        sub: 'Trade accounts on file', tone: 'brand' }));
    el.appendChild(kpis);

    var poSec = document.createElement('section');
    poSec.appendChild(ui.el('<div class="page-head"><h2>Purchase orders</h2></div>'));
    poSec.appendChild(ui.table({
      columns: [
        { key: 'date', label: 'Date',
          render: function (p) { return DEMO.fmt.relDay(p.date); } },
        { key: 'supplierId', label: 'Supplier',
          render: function (p) {
            var n = (p.lines || []).length;
            return twoLine(supplierName(p.supplierId), n + ' line' + (n === 1 ? '' : 's'));
          } },
        { key: 'total', label: 'Value (ex GST)', align: 'right',
          render: function (p) { return DEMO.fmt.money(DEMO.store.derive.poTotal(p)); } },
        { key: 'status', label: 'Status',
          render: function (p) { return ui.chip(p.status); } }
      ],
      rows: pos,
      onRow: function (p) { DEMO.router.go('purchasing/po/' + p.id); },
      empty: 'No purchase orders yet — “Reorder low stock” raises them for you.'
    }));
    el.appendChild(poSec);

    var supSec = document.createElement('section');
    supSec.appendChild(ui.el('<div class="page-head"><h2>Suppliers</h2></div>'));
    supSec.appendChild(ui.table({
      columns: [
        { key: 'name', label: 'Supplier',
          render: function (s) { return twoLine(s.name, s.contact); } },
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' },
        { key: 'terms', label: 'Terms' }
      ],
      rows: DEMO.store.get('suppliers'),
      empty: 'No suppliers in this demo dataset.'
    }));
    el.appendChild(supSec);
  }

  /* ---- Detail view ----------------------------------------------------------- */

  function renderDetail(el, id) {
    var ui = DEMO.ui;
    var po = DEMO.store.find('purchaseOrders', id);
    if (!po) {
      el.appendChild(ui.emptyState('That purchase order is no longer in the demo data.',
        { label: 'Back to purchasing', href: '#/purchasing' }));
      return;
    }
    var supplier = DEMO.store.find('suppliers', po.supplierId) || {};

    var head = ui.el('<div class="page-head"><div><h1></h1><p class="muted"></p></div></div>');
    head.querySelector('h1').textContent = 'Order — ' + (supplier.name || 'Supplier');
    head.querySelector('p').textContent = DEMO.fmt.date(po.date) +
      (supplier.contact ? ' · ' + supplier.contact : '') +
      (supplier.terms ? ' · ' + supplier.terms + ' terms' : '');
    head.appendChild(ui.el('<a class="btn" href="#/purchasing">&larr; All orders</a>'));
    el.appendChild(head);

    var status = ui.el('<div class="toolbar"></div>');
    status.appendChild(ui.chip(po.status));
    el.appendChild(status);

    el.appendChild(ui.table({
      columns: [
        { key: 'stockId', label: 'Item',
          render: function (l) {
            var item = DEMO.store.find('stock', l.stockId);
            return twoLine(stockName(l.stockId), item ? item.sku : '');
          } },
        { key: 'qty', label: 'Qty', align: 'right' },
        { key: 'unitCost', label: 'Unit cost', align: 'right',
          render: function (l) { return DEMO.fmt.money(l.unitCost); } },
        { key: 'line', label: 'Line total', align: 'right',
          render: function (l) { return DEMO.fmt.money((l.qty || 0) * (l.unitCost || 0)); } }
      ],
      rows: po.lines || [],
      empty: 'No lines on this order.'
    }));

    var total = ui.el('<div class="card qa-totals">' +
      '<div class="qa-totals__row qa-totals__row--total"><span>Order value (ex GST)</span><span>' +
      ui.esc(DEMO.fmt.money(DEMO.store.derive.poTotal(po))) + '</span></div></div>');
    el.appendChild(total);

    var actions = ui.el('<div class="toolbar"></div>');
    if (po.status === 'draft') {
      var sendBtn = ui.el('<button type="button" class="btn btn--primary">Send to supplier</button>');
      sendBtn.addEventListener('click', function () {
        DEMO.store.update('purchaseOrders', po.id, { status: 'sent' });
        ui.toast('Order sent to ' + (supplier.name || 'supplier'), 'ok');
        DEMO.router.refresh();
      });
      actions.appendChild(sendBtn);
    } else if (po.status === 'sent') {
      var recvBtn = ui.el('<button type="button" class="btn btn--primary">Receive stock</button>');
      recvBtn.addEventListener('click', function () {
        ui.confirmDialog({
          title: 'Receive this order?',
          message: 'Stock levels update straight away and each line is logged as a movement.',
          confirmLabel: 'Receive stock',
          onConfirm: function () { receivePO(po); }
        });
      });
      actions.appendChild(recvBtn);
    }
    el.appendChild(actions);
  }

  DEMO.routes['purchasing'] = {
    title: 'Purchasing',
    render: function (el, parts) {
      if (parts && parts[0] === 'po' && parts[1]) renderDetail(el, parts[1]);
      else renderList(el);
    }
  };
})();
