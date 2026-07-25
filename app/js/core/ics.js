/* DEMO.cal — calendar sync helpers so jobs and bookings can be added to
   Google / Apple / Outlook calendars. Classic script; needs DEMO.util
   (core/format.js) only, so it can load before core/ui.js.

   Event shape (ev):
     {
       title:       string,
       start:       'YYYY-MM-DDTHH:MM'   // LOCAL time, as used by all seed data
       durationHrs: number,              // e.g. 1.5
       details?:    string,
       location?:   string
     }

   API:
     googleUrl(ev)   → https://calendar.google.com/calendar/render?... URL
     icsDataUri(ev)  → data:text/calendar URI of a valid VCALENDAR/VEVENT
     linkButtons(ev) → Element with "Google Calendar" + "Apple / Outlook (.ics)"
*/
(function () {
  'use strict';
  window.DEMO = window.DEMO || {};

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* Local Date → 'YYYYMMDDTHHMMSSZ' (UTC, iCalendar basic format). */
  function utcStamp(dt) {
    return dt.getUTCFullYear() +
      pad(dt.getUTCMonth() + 1) +
      pad(dt.getUTCDate()) + 'T' +
      pad(dt.getUTCHours()) +
      pad(dt.getUTCMinutes()) +
      pad(dt.getUTCSeconds()) + 'Z';
  }

  /* Resolve ev.start (local 'YYYY-MM-DDTHH:MM') + durationHrs into Dates. */
  function span(ev) {
    var start = DEMO.util.parse(ev && ev.start) || new Date();
    var minutes = Math.round(((ev && ev.durationHrs) || 1) * 60);
    var end = new Date(start.getTime() + minutes * 60000);
    return { start: start, end: end };
  }

  /* Escape TEXT values per RFC 5545 §3.3.11. */
  function escText(s) {
    return String(s == null ? '' : s)
      .replace(/\\/g, '\\\\')
      .replace(/\r\n|\r|\n/g, '\\n')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,');
  }

  /* Fold a content line at ~74 chars (continuation lines start with a space). */
  function fold(line) {
    if (line.length <= 74) return line;
    var out = [line.slice(0, 74)];
    var rest = line.slice(74);
    while (rest.length > 73) {
      out.push(' ' + rest.slice(0, 73));
      rest = rest.slice(73);
    }
    if (rest) out.push(' ' + rest);
    return out.join('\r\n');
  }

  function slugify(s) {
    return String(s == null ? '' : s).toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40);
  }

  /**
   * Google Calendar "add event" URL (calendar.google.com/calendar/render).
   * Times are converted from the event's local start to UTC.
   * @param {{title:string, start:string, durationHrs:number, details?:string, location?:string}} ev
   * @returns {string}
   */
  function googleUrl(ev) {
    ev = ev || {};
    var t = span(ev);
    var qs = [
      'action=TEMPLATE',
      'text=' + encodeURIComponent(ev.title || 'Appointment'),
      'dates=' + utcStamp(t.start) + '/' + utcStamp(t.end)
    ];
    if (ev.details) qs.push('details=' + encodeURIComponent(ev.details));
    if (ev.location) qs.push('location=' + encodeURIComponent(ev.location));
    return 'https://calendar.google.com/calendar/render?' + qs.join('&');
  }

  /**
   * A downloadable .ics file as a data: URI — a valid VCALENDAR/VEVENT with
   * CRLF line endings, UTC DTSTART/DTEND derived from the local event time,
   * a UID, DTSTAMP taken from the event date, and RFC 5545-escaped text.
   * Opens in Apple Calendar / Outlook via a download link.
   * @param {{title:string, start:string, durationHrs:number, details?:string, location?:string}} ev
   * @returns {string}
   */
  function icsDataUri(ev) {
    ev = ev || {};
    var t = span(ev);
    var uid = utcStamp(t.start) + '-' + (slugify(ev.title) || 'event') + '@websitefolio.demo';
    var lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//WebSiteFolio Demo//Business App//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:' + uid,
      'DTSTAMP:' + utcStamp(t.start),
      'DTSTART:' + utcStamp(t.start),
      'DTEND:' + utcStamp(t.end),
      'SUMMARY:' + escText(ev.title || 'Appointment')
    ];
    if (ev.details) lines.push('DESCRIPTION:' + escText(ev.details));
    if (ev.location) lines.push('LOCATION:' + escText(ev.location));
    lines.push('END:VEVENT', 'END:VCALENDAR');

    var body = [];
    for (var i = 0; i < lines.length; i++) body.push(fold(lines[i]));
    return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(body.join('\r\n') + '\r\n');
  }

  /**
   * Two ready-made anchor buttons for an event: "Google Calendar" (opens in a
   * new tab) and "Apple / Outlook (.ics)" (downloads the .ics file).
   * @param {{title:string, start:string, durationHrs:number, details?:string, location?:string}} ev
   * @returns {Element} <div class="cal-links"> with both anchors.
   */
  function linkButtons(ev) {
    ev = ev || {};
    var wrap = document.createElement('div');
    wrap.className = 'cal-links';

    var g = document.createElement('a');
    g.className = 'btn btn--sm';
    g.href = googleUrl(ev);
    g.target = '_blank';
    g.rel = 'noopener';
    g.textContent = 'Google Calendar';

    var a = document.createElement('a');
    a.className = 'btn btn--sm';
    a.href = icsDataUri(ev);
    a.setAttribute('download', (slugify(ev.title) || 'event') + '.ics');
    a.textContent = 'Apple / Outlook (.ics)';

    wrap.appendChild(g);
    wrap.appendChild(a);
    return wrap;
  }

  DEMO.cal = {
    googleUrl: googleUrl,
    icsDataUri: icsDataUri,
    linkButtons: linkButtons
  };
})();
