/* DEMO.ui — DOM + component helper library for the systems app.
   Classic script; loads after core/format.js + core/store.js and before all
   modules/*.js. Modules build every screen from these helpers so markup and
   class names stay in lockstep with app/css/app.css.

   STABLE API — modules code against these exact signatures:

     el(html)                                  parse one HTML string → Element
     mount(parent, ...els)                     append children → parent
     esc(text)                                 HTML-escape a string
     table({columns, rows, onRow?, empty?})    responsive .tbl → Element
     kpi({label, value, sub?, tone?, href?})   stat card → Element
     chip(status)                              status chip → Element
     modal({title, body, actions?})            centred dialog → {root, close()}
     drawer({title, body, actions?})           right slide-over → {root, close()}
     toast(msg, tone?)                         transient notice → Element
     confirmDialog({title, message, onConfirm}) confirm modal → {root, close()}
     formRow(labelText, inputEl)               label + control row → Element
     select(options, value?, onChange?)        <select class="input"> → Element
     moneyInput(initial?)                      $-prefixed amount field → Element
     emptyState(message, cta?)                 .empty block → Element
*/
(function () {
  'use strict';
  window.DEMO = window.DEMO || {};

  /* Status → chip label/tone. Tones map to CSS: brand | ok | warn | danger | muted. */
  var STATUS = {
    scheduled:   { label: 'Scheduled',   tone: 'brand' },
    in_progress: { label: 'In progress', tone: 'warn' },
    done:        { label: 'Done',        tone: 'ok' },
    invoiced:    { label: 'Invoiced',    tone: 'brand' },
    draft:       { label: 'Draft',       tone: 'muted' },
    sent:        { label: 'Sent',        tone: 'brand' },
    accepted:    { label: 'Accepted',    tone: 'ok' },
    declined:    { label: 'Declined',    tone: 'danger' },
    paid:        { label: 'Paid',        tone: 'ok' },
    overdue:     { label: 'Overdue',     tone: 'danger' },
    received:    { label: 'Received',    tone: 'ok' },
    low:         { label: 'Low stock',   tone: 'warn' }
  };

  var CLOSE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  /**
   * Parse a single-root HTML string into an Element.
   * @param {string} html — markup with exactly one root element.
   * @returns {Element|null} the root element (null if the string had none).
   */
  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = String(html == null ? '' : html).trim();
    return t.content.firstElementChild;
  }

  /**
   * HTML-escape a string for safe interpolation into markup built with el().
   * @param {*} s
   * @returns {string}
   */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /**
   * Append any number of children (Elements, arrays of Elements; null/undefined
   * entries are skipped) to a parent element.
   * @param {Element} parent
   * @param {...(Element|Element[]|null)} els
   * @returns {Element} the parent, for chaining.
   */
  function mount(parent) {
    for (var i = 1; i < arguments.length; i++) {
      var item = arguments[i];
      if (item == null) continue;
      if (Array.isArray(item)) {
        for (var j = 0; j < item.length; j++) if (item[j] != null) parent.appendChild(item[j]);
      } else {
        parent.appendChild(item);
      }
    }
    return parent;
  }

  /* Append a cell/body value: Element, DocumentFragment, array, or text. */
  function appendValue(target, v) {
    if (v == null) return;
    if (Array.isArray(v)) { for (var i = 0; i < v.length; i++) appendValue(target, v[i]); return; }
    if (v.nodeType === 1 || v.nodeType === 11) { target.appendChild(v); return; }
    target.appendChild(document.createTextNode(String(v)));
  }

  /* Append dialog body content: Element / fragment / array / HTML string. */
  function appendBody(target, content) {
    if (content == null) return;
    if (Array.isArray(content)) { for (var i = 0; i < content.length; i++) appendBody(target, content[i]); return; }
    if (typeof content === 'string') {
      var t = document.createElement('template');
      t.innerHTML = content;
      target.appendChild(t.content);
      return;
    }
    target.appendChild(content);
  }

  function alignClass(align) {
    if (align === 'right') return 'is-right';
    if (align === 'centre' || align === 'center') return 'is-centre';
    return '';
  }

  /**
   * Responsive data table (.tbl inside a .tbl-wrap scroll container). Renders
   * as a table ≥640px and stacks into labelled cards below that (via
   * td[data-label] in app.css). Returns an emptyState() element instead when
   * there are no rows.
   * @param {Object}   cfg
   * @param {Array<{key:string, label:string, render?:function(Object):(*|Element), align?:('left'|'right'|'centre')}>} cfg.columns
   *   Column definitions. `render(row)` may return a string, number, Element
   *   or array of those; without it the cell shows `row[key]`.
   * @param {Object[]} cfg.rows    — data objects, one per row.
   * @param {function(Object):void} [cfg.onRow] — row activation handler
   *   (click / Enter / Space); rows become focusable when provided.
   * @param {string}   [cfg.empty] — message when rows is empty.
   * @returns {Element}
   */
  function table(cfg) {
    cfg = cfg || {};
    var rows = cfg.rows || [];
    if (!rows.length) return emptyState(cfg.empty || 'Nothing to show yet.');
    var cols = cfg.columns || [];

    var wrap = document.createElement('div');
    wrap.className = 'tbl-wrap';
    var tbl = document.createElement('table');
    tbl.className = 'tbl';

    var thead = document.createElement('thead');
    var htr = document.createElement('tr');
    cols.forEach(function (c) {
      var th = document.createElement('th');
      th.scope = 'col';
      th.textContent = c.label || '';
      var cls = alignClass(c.align);
      if (cls) th.className = cls;
      htr.appendChild(th);
    });
    thead.appendChild(htr);
    tbl.appendChild(thead);

    var tbody = document.createElement('tbody');
    rows.forEach(function (row) {
      var tr = document.createElement('tr');
      if (cfg.onRow) {
        tr.tabIndex = 0;
        tr.className = 'tbl__row--link';
        tr.addEventListener('click', function () { cfg.onRow(row); });
        tr.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cfg.onRow(row); }
        });
      }
      cols.forEach(function (c) {
        var td = document.createElement('td');
        td.setAttribute('data-label', c.label || '');
        var cls = alignClass(c.align);
        if (cls) td.className = cls;
        appendValue(td, c.render ? c.render(row) : row[c.key]);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);
    wrap.appendChild(tbl);
    return wrap;
  }

  /**
   * KPI stat card. Renders an <a class="kpi"> when href is given, else a <div>.
   * @param {Object} cfg
   * @param {string} cfg.label   — small uppercase caption.
   * @param {*}      cfg.value   — headline figure (string/number/Element).
   * @param {string} [cfg.sub]   — secondary line under the value.
   * @param {('brand'|'ok'|'warn'|'danger')} [cfg.tone] — accent colouring.
   * @param {string} [cfg.href]  — link target (e.g. '#/money/invoices').
   * @returns {Element}
   */
  function kpi(cfg) {
    cfg = cfg || {};
    var node = document.createElement(cfg.href ? 'a' : 'div');
    node.className = 'kpi' + (cfg.tone ? ' kpi--' + cfg.tone : '');
    if (cfg.href) node.href = cfg.href;

    var label = document.createElement('div');
    label.className = 'kpi__label';
    label.textContent = cfg.label || '';
    node.appendChild(label);

    var value = document.createElement('div');
    value.className = 'kpi__value';
    appendValue(value, cfg.value == null ? '—' : cfg.value);
    node.appendChild(value);

    if (cfg.sub != null && cfg.sub !== '') {
      var sub = document.createElement('div');
      sub.className = 'kpi__sub';
      sub.textContent = String(cfg.sub);
      node.appendChild(sub);
    }
    return node;
  }

  /**
   * Status chip. Knows every status in the demo data model — scheduled,
   * in_progress, done, invoiced, draft, sent, accepted, declined, paid,
   * overdue, received, low — and falls back to a neutral chip with a
   * prettified label for anything else.
   * @param {string} status
   * @returns {Element}
   */
  function chip(status) {
    var key = String(status == null ? '' : status);
    var def = STATUS[key];
    var span = document.createElement('span');
    span.className = 'chip chip--' + (def ? key : 'muted');
    span.textContent = def
      ? def.label
      : (key.charAt(0).toUpperCase() + key.slice(1)).replace(/_/g, ' ');
    return span;
  }

  /* ---- Overlays (shared machinery for modal + drawer) -------------------- */

  var overlayStack = [];

  function toneClass(tone) {
    if (tone === 'primary' || tone === 'brand') return ' btn--primary';
    if (tone === 'danger') return ' btn--danger';
    if (tone === 'ghost') return ' btn--ghost';
    return '';
  }

  function openOverlay(kind, cfg) {
    cfg = cfg || {};
    var root = document.createElement('div');
    root.className = 'overlay ' + (kind === 'drawer' ? 'overlay--drawer' : 'overlay--modal');

    var panel = document.createElement('div');
    panel.className = kind;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.tabIndex = -1;

    var titleId = DEMO.util.uid('dlg');
    panel.setAttribute('aria-labelledby', titleId);

    var head = el('<header class="dlg__head"><h2 class="dlg__title" id="' + titleId + '"></h2>' +
      '<button type="button" class="dlg__close" aria-label="Close">' + CLOSE_SVG + '</button></header>');
    head.querySelector('.dlg__title').textContent = cfg.title || '';
    panel.appendChild(head);

    var body = document.createElement('div');
    body.className = 'dlg__body';
    appendBody(body, cfg.body);
    panel.appendChild(body);

    var api = { root: root, body: body, close: close };

    if (cfg.actions && cfg.actions.length) {
      var foot = document.createElement('footer');
      foot.className = 'dlg__foot';
      cfg.actions.forEach(function (a) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn' + toneClass(a.tone);
        b.textContent = a.label || 'OK';
        b.addEventListener('click', function () {
          var result = a.onClick ? a.onClick(api) : undefined;
          if (result !== false) close();
        });
        foot.appendChild(b);
      });
      panel.appendChild(foot);
    }

    var prevFocus = document.activeElement;
    var closed = false;

    function onKeydown(e) {
      if (e.key === 'Escape' && overlayStack[overlayStack.length - 1] === api) {
        e.preventDefault();
        close();
      }
    }

    function close() {
      if (closed) return;
      closed = true;
      document.removeEventListener('keydown', onKeydown);
      var ix = overlayStack.indexOf(api);
      if (ix > -1) overlayStack.splice(ix, 1);
      if (!overlayStack.length) document.body.classList.remove('no-scroll');
      if (root.parentNode) root.parentNode.removeChild(root);
      if (prevFocus && prevFocus.focus && document.contains(prevFocus)) {
        try { prevFocus.focus(); } catch (e) { /* ignore */ }
      }
      if (cfg.onClose) cfg.onClose();
    }

    head.querySelector('.dlg__close').addEventListener('click', close);
    root.addEventListener('click', function (e) { if (e.target === root) close(); });
    document.addEventListener('keydown', onKeydown);

    overlayStack.push(api);
    document.body.classList.add('no-scroll');
    root.appendChild(panel);
    document.body.appendChild(root);
    window.requestAnimationFrame(function () {
      try { panel.focus(); } catch (e) { /* ignore */ }
    });
    return api;
  }

  /**
   * Centred modal dialog with backdrop. Closes on Escape, backdrop click, the
   * × button, or any action button whose onClick does not return false.
   * @param {Object} cfg
   * @param {string} cfg.title
   * @param {(Element|Element[]|string)} cfg.body — Element(s), or an HTML string.
   * @param {Array<{label:string, tone?:('primary'|'danger'|'ghost'), onClick?:function(Object):(boolean|void)}>} [cfg.actions]
   *   Footer buttons, left→right. onClick receives the dialog api ({root,
   *   body, close}); return false to keep the dialog open, anything else
   *   (or no onClick at all) closes it after the handler runs.
   * @param {function():void} [cfg.onClose] — called once, after closing.
   * @returns {{root:Element, body:Element, close:function():void}}
   */
  function modal(cfg) { return openOverlay('modal', cfg); }

  /**
   * Right-hand slide-over panel (full-width on mobile). Identical API and
   * closing behaviour to modal().
   * @param {Object} cfg — see modal().
   * @returns {{root:Element, body:Element, close:function():void}}
   */
  function drawer(cfg) { return openOverlay('drawer', cfg); }

  /**
   * Transient toast notice, bottom-centre, auto-dismisses after ~3.4s
   * (click to dismiss sooner).
   * @param {string} msg
   * @param {('ok'|'warn'|'danger')} [tone]
   * @returns {Element} the toast element.
   */
  function toast(msg, tone) {
    var host = document.getElementById('toasts');
    if (!host) {
      host = document.createElement('div');
      host.id = 'toasts';
      host.className = 'toasts';
      host.setAttribute('aria-live', 'polite');
      document.body.appendChild(host);
    }
    var t = document.createElement('div');
    t.className = 'toast' + (tone ? ' toast--' + tone : '');
    t.textContent = String(msg == null ? '' : msg);
    var timer = setTimeout(dismiss, 3400);
    function dismiss() {
      clearTimeout(timer);
      if (t.parentNode) t.parentNode.removeChild(t);
    }
    t.addEventListener('click', dismiss);
    host.appendChild(t);
    return t;
  }

  /**
   * Confirmation modal: Cancel + a danger-toned confirm button.
   * @param {Object} cfg
   * @param {string} cfg.title
   * @param {string} cfg.message        — plain text (escaped for you).
   * @param {function():void} cfg.onConfirm — runs when confirmed; then closes.
   * @param {string} [cfg.confirmLabel] — confirm button text (default 'Confirm').
   * @returns {{root:Element, body:Element, close:function():void}}
   */
  function confirmDialog(cfg) {
    cfg = cfg || {};
    return modal({
      title: cfg.title || 'Are you sure?',
      body: '<p>' + esc(cfg.message || '') + '</p>',
      actions: [
        { label: 'Cancel' },
        {
          label: cfg.confirmLabel || 'Confirm',
          tone: 'danger',
          onClick: function () { if (cfg.onConfirm) cfg.onConfirm(); }
        }
      ]
    });
  }

  /**
   * Labelled form row (.field). Associates the label with the control via a
   * generated id (looks inside wrappers, so formRow('Amount', moneyInput())
   * works too).
   * @param {string}  labelText
   * @param {Element} inputEl — a control, or an element containing one.
   * @returns {Element}
   */
  function formRow(labelText, inputEl) {
    var row = document.createElement('div');
    row.className = 'field';
    var lab = document.createElement('label');
    lab.className = 'field__label';
    lab.textContent = labelText || '';

    var target = null;
    if (inputEl) {
      if (inputEl.matches && inputEl.matches('input, select, textarea')) target = inputEl;
      else if (inputEl.querySelector) target = inputEl.querySelector('input, select, textarea');
    }
    if (target) {
      if (!target.id) target.id = DEMO.util.uid('f');
      lab.htmlFor = target.id;
    }
    row.appendChild(lab);
    if (inputEl) row.appendChild(inputEl);
    return row;
  }

  /**
   * Styled <select class="input select">.
   * @param {Array<(string|{value:*, label?:string})>} options
   * @param {*} [value] — initially selected value.
   * @param {function(string, HTMLSelectElement):void} [onChange] — called with
   *   the new value on every change.
   * @returns {HTMLSelectElement}
   */
  function select(options, value, onChange) {
    var s = document.createElement('select');
    s.className = 'input select';
    (options || []).forEach(function (o) {
      var opt = document.createElement('option');
      if (o !== null && typeof o === 'object') {
        opt.value = String(o.value);
        opt.textContent = o.label != null ? String(o.label) : String(o.value);
      } else {
        opt.value = String(o);
        opt.textContent = String(o);
      }
      s.appendChild(opt);
    });
    if (value != null) s.value = String(value);
    if (onChange) s.addEventListener('change', function () { onChange(s.value, s); });
    return s;
  }

  /**
   * Dollar-prefixed amount field. Returns the .money-wrap element, which
   * behaves like an input for the common cases:
   *   .value  — get/set the amount string ('82.50'; set normalises to 2 d.p.)
   *   .input  — the underlying <input> (inputmode="decimal")
   *   .focus()— focuses the underlying input
   * Values are normalised to two decimal places on blur.
   * @param {(number|string)} [initial] — starting amount.
   * @returns {Element}
   */
  function moneyInput(initial) {
    var wrap = el('<span class="money-wrap"><span class="money-wrap__symbol" aria-hidden="true">$</span></span>');
    var input = el('<input class="input input--money" type="text" inputmode="decimal" placeholder="0.00" autocomplete="off" spellcheck="false">');

    function toNumber(v) {
      var n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.\-]/g, ''));
      return isFinite(n) ? n : null;
    }
    function setValue(v) {
      var n = toNumber(v);
      input.value = n == null ? '' : n.toFixed(2);
    }

    if (initial != null && initial !== '') setValue(initial);
    input.addEventListener('blur', function () {
      if (input.value.replace(/\s+/g, '') !== '') setValue(input.value);
    });

    wrap.appendChild(input);
    wrap.input = input;
    wrap.focus = function () { input.focus(); };
    Object.defineProperty(wrap, 'value', {
      get: function () { return input.value; },
      set: function (v) { setValue(v); }
    });
    return wrap;
  }

  /**
   * Friendly empty state (.empty).
   * @param {string} message
   * @param {(Element|{label:string, onClick?:function():void, href?:string})} [cta]
   *   Either a ready-made element, or a spec for a primary button (onClick)
   *   / link (href).
   * @returns {Element}
   */
  function emptyState(message, cta) {
    var box = document.createElement('div');
    box.className = 'empty';
    box.appendChild(el('<div class="empty__icon" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">' +
      '<circle cx="12" cy="12" r="9" stroke-dasharray="3.5 3.5"/><path d="M8.5 12h7"/></svg></div>'));
    var msg = document.createElement('p');
    msg.className = 'empty__msg';
    msg.textContent = message || 'Nothing here yet.';
    box.appendChild(msg);

    if (cta) {
      if (cta.nodeType === 1) {
        box.appendChild(cta);
      } else if (typeof cta === 'object') {
        var b;
        if (cta.href) {
          b = document.createElement('a');
          b.href = cta.href;
        } else {
          b = document.createElement('button');
          b.type = 'button';
          if (cta.onClick) b.addEventListener('click', cta.onClick);
        }
        b.className = 'btn btn--primary';
        b.textContent = cta.label || 'Get started';
        box.appendChild(b);
      }
    }
    return box;
  }

  DEMO.ui = {
    el: el,
    esc: esc,
    mount: mount,
    table: table,
    kpi: kpi,
    chip: chip,
    modal: modal,
    drawer: drawer,
    toast: toast,
    confirmDialog: confirmDialog,
    formRow: formRow,
    select: select,
    moneyInput: moneyInput,
    emptyState: emptyState
  };
})();
