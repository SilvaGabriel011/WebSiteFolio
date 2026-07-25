/* Demo state store — the contract every module codes against.
   In-memory state seeded from DEMO.seeds[slug], mirrored to localStorage.
   Saved state expires at the start of each new day so relative seed dates
   stay current. All storage access is wrapped: if localStorage is
   unavailable (some file:// contexts), the demo runs in-memory only. */
(function () {
  'use strict';
  window.DEMO = window.DEMO || {};

  /* Registries filled by data/businesses.js and data/data-*.js */
  DEMO.businesses = DEMO.businesses || {};
  DEMO.registerBusiness = function (slug, def) {
    def.slug = slug;
    DEMO.businesses[slug] = def;
  };

  DEMO.seeds = DEMO.seeds || {};
  DEMO.registerData = function (slug, data) { DEMO.seeds[slug] = data; };

  /* Route + nav registries filled by modules/*.js, consumed by core/router.js.
     DEMO.routes[section] = { title, render(el, parts) } — parts is the rest of
     the hash path, e.g. '#/sales/quote/q3' → routes['sales'].render(el, ['quote','q3']).
     DEMO.nav = ordered sidebar entries: { section, label, icon (svg string) }. */
  DEMO.routes = DEMO.routes || {};
  DEMO.nav = DEMO.nav || [];

  var COLLECTIONS = ['customers', 'jobs', 'quotes', 'invoices', 'suppliers',
    'purchaseOrders', 'stock', 'movements', 'assets'];

  function storageKey(slug) { return 'demo:' + slug; }

  function loadSaved(slug) {
    try {
      var raw = localStorage.getItem(storageKey(slug));
      if (!raw) return null;
      var saved = JSON.parse(raw);
      if (!saved || saved.savedOn !== DEMO.util.d(0)) {
        localStorage.removeItem(storageKey(slug));
        return null;
      }
      return saved.state;
    } catch (e) { return null; }
  }

  var store = {
    slug: null,
    state: null,

    init: function (slug) {
      var seed = DEMO.seeds[slug];
      if (!seed) throw new Error('No demo data registered for "' + slug + '"');
      this.slug = slug;
      this.state = loadSaved(slug) || JSON.parse(JSON.stringify(seed));
      var st = this.state;
      COLLECTIONS.forEach(function (c) { if (!st[c]) st[c] = []; });
    },

    persist: function () {
      try {
        localStorage.setItem(storageKey(this.slug),
          JSON.stringify({ savedOn: DEMO.util.d(0), state: this.state }));
      } catch (e) { /* in-memory only */ }
    },

    reset: function () {
      try { localStorage.removeItem(storageKey(this.slug)); } catch (e) {}
      this.init(this.slug);
    },

    get: function (collection) { return this.state[collection] || []; },

    find: function (collection, id) {
      var arr = this.get(collection);
      for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i];
      return null;
    },

    add: function (collection, obj) {
      if (!obj.id) obj.id = DEMO.util.uid(collection.charAt(0));
      this.get(collection).push(obj);
      this.persist();
      return obj;
    },

    update: function (collection, id, patch) {
      var obj = this.find(collection, id);
      if (!obj) return null;
      for (var k in patch) {
        if (Object.prototype.hasOwnProperty.call(patch, k)) obj[k] = patch[k];
      }
      this.persist();
      return obj;
    },

    remove: function (collection, id) {
      var arr = this.get(collection);
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === id) { arr.splice(i, 1); this.persist(); return true; }
      }
      return false;
    }
  };

  function round2(n) { return Math.round(n * 100) / 100; }

  function lineTotals(lines) {
    var subtotal = 0;
    (lines || []).forEach(function (l) { subtotal += (l.qty || 0) * (l.price || 0); });
    subtotal = round2(subtotal);
    var gst = round2(subtotal * 0.10);
    return { subtotal: subtotal, gst: gst, total: round2(subtotal + gst) };
  }

  store.derive = {
    customerName: function (id) {
      var c = store.find('customers', id);
      return c ? c.name : 'Walk-in customer';
    },

    /* Quotes and invoices share the line shape {desc, qty, unit, price}.
       GST 10% on the ex-GST subtotal. */
    totals: lineTotals,
    quoteTotals: function (quote) { return lineTotals(quote && quote.lines); },
    invoiceTotals: function (inv) { return lineTotals(inv && inv.lines); },

    /* PO lines are {stockId, qty, unitCost} — ex-GST value of the order. */
    poTotal: function (po) {
      var t = 0;
      ((po && po.lines) || []).forEach(function (l) { t += (l.qty || 0) * (l.unitCost || 0); });
      return round2(t);
    },

    lowStock: function () {
      return store.get('stock').filter(function (s) { return s.qty <= s.min; });
    },

    todaysJobs: function () {
      var today = DEMO.util.d(0);
      return store.get('jobs')
        .filter(function (j) { return (j.start || '').slice(0, 10) === today; })
        .sort(function (a, b) { return a.start < b.start ? -1 : 1; });
    },

    jobsBetween: function (fromISO, toISO) {
      return store.get('jobs')
        .filter(function (j) {
          var day = (j.start || '').slice(0, 10);
          return day >= fromISO && day <= toISO;
        })
        .sort(function (a, b) { return a.start < b.start ? -1 : 1; });
    },

    assetNextDue: function (asset) {
      return DEMO.util.addMonths(asset.lastService, asset.intervalMonths);
    },

    /* Assets due within `withinDays` (default 60), soonest first.
       Each entry: { asset, due, overdue, days } — days negative when overdue. */
    maintenanceDue: function (withinDays) {
      var horizon = withinDays == null ? 60 : withinDays;
      return store.get('assets')
        .map(function (a) {
          var due = store.derive.assetNextDue(a);
          var days = DEMO.util.daysFromToday(due);
          return { asset: a, due: due, days: days, overdue: days < 0 };
        })
        .filter(function (e) { return e.days <= horizon; })
        .sort(function (a, b) { return a.days - b.days; });
    },

    invoicedThisMonth: function () {
      var month = DEMO.util.d(0).slice(0, 7);
      var sum = 0;
      store.get('invoices').forEach(function (inv) {
        if ((inv.issued || '').slice(0, 7) === month && inv.status !== 'draft') {
          sum += lineTotals(inv.lines).total;
        }
      });
      return round2(sum);
    }
  };

  DEMO.store = store;
})();
