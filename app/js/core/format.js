/* Shared date + formatting helpers. Classic script — attaches to window.DEMO.
   Loaded first: everything else may assume DEMO.util and DEMO.fmt exist. */
(function () {
  'use strict';
  window.DEMO = window.DEMO || {};

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* d(offsetDays[, 'HH:MM']) → ISO date relative to today, local time.
     d(0) → today 'YYYY-MM-DD'; d(-3) → 3 days ago; d(2, '09:30') → 'YYYY-MM-DDT09:30'.
     All seed data uses this so demos never look stale. */
  function d(offsetDays, time) {
    var now = new Date();
    var dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (offsetDays || 0));
    var iso = dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate());
    return time ? iso + 'T' + time : iso;
  }

  /* Parse 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:MM' as LOCAL time (new Date(iso) would
     read a bare date as UTC and shift the day in AU timezones). */
  function parse(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(iso || '');
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0));
  }

  function toISO(dt, withTime) {
    var iso = dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate());
    return withTime ? iso + 'T' + pad(dt.getHours()) + ':' + pad(dt.getMinutes()) : iso;
  }

  function addDays(iso, days) {
    var dt = parse(iso);
    dt.setDate(dt.getDate() + days);
    return toISO(dt, /T/.test(iso));
  }

  function addMonths(iso, months) {
    var dt = parse(iso);
    dt.setMonth(dt.getMonth() + months);
    return toISO(dt, /T/.test(iso));
  }

  /* Whole days from today to iso: negative = past, 0 = today, positive = future. */
  function daysFromToday(iso) {
    var a = parse(d(0)), b = parse((iso || '').slice(0, 10));
    return Math.round((b - a) / 86400000);
  }

  var uidCounter = 0;
  function uid(prefix) {
    uidCounter += 1;
    return (prefix || 'x') + Date.now().toString(36) + uidCounter;
  }

  DEMO.util = {
    d: d, parse: parse, toISO: toISO, pad: pad,
    addDays: addDays, addMonths: addMonths, daysFromToday: daysFromToday,
    uid: uid
  };

  var money = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' });
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  DEMO.fmt = {
    money: function (n) { return money.format(n || 0); },

    /* dd/mm/yyyy */
    date: function (iso) {
      var dt = parse(iso);
      return dt ? pad(dt.getDate()) + '/' + pad(dt.getMonth() + 1) + '/' + dt.getFullYear() : '';
    },

    /* 'Mon 21 Jul' */
    dayMonth: function (iso) {
      var dt = parse(iso);
      return dt ? DAYS[dt.getDay()] + ' ' + dt.getDate() + ' ' + MONTHS[dt.getMonth()] : '';
    },

    /* '8:00 am' */
    time: function (iso) {
      var dt = parse(iso);
      if (!dt) return '';
      var h = dt.getHours(), m = dt.getMinutes();
      var ampm = h >= 12 ? 'pm' : 'am';
      var h12 = h % 12 === 0 ? 12 : h % 12;
      return h12 + ':' + pad(m) + ' ' + ampm;
    },

    /* 'Today' | 'Tomorrow' | 'Yesterday' | 'Mon 21 Jul' */
    relDay: function (iso) {
      var diff = daysFromToday(iso);
      if (diff === 0) return 'Today';
      if (diff === 1) return 'Tomorrow';
      if (diff === -1) return 'Yesterday';
      return DEMO.fmt.dayMonth(iso);
    }
  };
})();
