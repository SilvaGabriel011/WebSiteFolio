/* Harbourline Joinery — CLASSIC variant.
   Standalone, classic script (no modules, no dependencies, no network).
   Mobile nav · years-in-business counter · scroll reveal · nav scrollspy ·
   quote form fake submit with inline validation. */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    // Close the panel once a destination is chosen.
    nav.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a') : null;
      if (link && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---------- Years in business (variant component: est. 1987 counter) ---- */
  var yearEls = document.querySelectorAll('[data-years]');
  for (var y = 0; y < yearEls.length; y++) {
    var since = parseInt(yearEls[y].getAttribute('data-years'), 10);
    var now = new Date().getFullYear();
    if (since && now > since) { yearEls[y].textContent = String(now - since); }
  }

  /* ---------- Scroll reveal (respects prefers-reduced-motion) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  function showAll() {
    for (var i = 0; i < revealEls.length; i++) { revealEls[i].classList.add('is-in'); }
  }
  if (reducedMotion || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('is-in');
          revealObserver.unobserve(entries[i].target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    for (var r = 0; r < revealEls.length; r++) { revealObserver.observe(revealEls[r]); }
  }

  /* ---------- Scrollspy: highlight the section in view (index page) ------ */
  var spyLinks = nav ? nav.querySelectorAll('a[href^="#"]') : [];
  if (spyLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    var sections = [];
    for (var s = 0; s < spyLinks.length; s++) {
      var id = spyLinks[s].getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (section) { byId[id] = spyLinks[s]; sections.push(section); }
    }
    if (sections.length) {
      var current = null;
      var spyObserver = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            if (current) { current.removeAttribute('aria-current'); }
            current = byId[entries[i].target.id];
            if (current) { current.setAttribute('aria-current', 'true'); }
          }
        }
      }, { rootMargin: '-40% 0px -55% 0px' });
      for (var t = 0; t < sections.length; t++) { spyObserver.observe(sections[t]); }
    }
  }

  /* ---------- Quote form: fake submit, no network ---------- */
  var form = document.getElementById('quote-form');
  var success = document.getElementById('quote-success');
  if (form && success) {
    var fields = {
      name: document.getElementById('qf-name'),
      phone: document.getElementById('qf-phone'),
      email: document.getElementById('qf-email'),
      service: document.getElementById('qf-service')
    };

    function setError(el, hasError) {
      var wrap = el.closest ? el.closest('.field') : null;
      if (!wrap) { return; }
      wrap.classList.toggle('has-error', hasError);
      el.setAttribute('aria-invalid', hasError ? 'true' : 'false');
      var msg = wrap.querySelector('.field-error');
      if (msg) { el.setAttribute('aria-describedby', hasError ? msg.id : ''); }
    }

    function validate() {
      var ok = true;
      var firstBad = null;

      var name = fields.name.value.trim();
      var badName = name.length < 2;
      setError(fields.name, badName);
      if (badName && !firstBad) { firstBad = fields.name; }
      ok = ok && !badName;

      var phone = fields.phone.value.trim();
      var badPhone = !/^[0-9()+\s-]{8,}$/.test(phone);
      setError(fields.phone, badPhone);
      if (badPhone && !firstBad) { firstBad = fields.phone; }
      ok = ok && !badPhone;

      var email = fields.email.value.trim();
      var badEmail = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      setError(fields.email, badEmail);
      if (badEmail && !firstBad) { firstBad = fields.email; }
      ok = ok && !badEmail;

      var badService = fields.service.value === '';
      setError(fields.service, badService);
      if (badService && !firstBad) { firstBad = fields.service; }
      ok = ok && !badService;

      if (firstBad) { firstBad.focus(); }
      return ok;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) { return; }

      var firstName = fields.name.value.trim().split(/\s+/)[0];
      firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      var title = document.getElementById('quote-success-title');
      if (title) {
        title.textContent = 'Thanks ' + firstName +
          ' — we’ll be in touch within one business day';
      }
      form.hidden = true;
      success.hidden = false;
      success.focus();
    });

    // Clear a field's error as soon as it's corrected.
    var keys = ['name', 'phone', 'email', 'service'];
    for (var k = 0; k < keys.length; k++) {
      (function (el) {
        if (!el) { return; }
        el.addEventListener('input', function () { setError(el, false); });
        el.addEventListener('change', function () { setError(el, false); });
      })(fields[keys[k]]);
    }
  }
})();
