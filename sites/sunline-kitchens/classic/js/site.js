/* Sunline Kitchens — CLASSIC variant
   Mobile nav toggle, quote-form fake submit, polite scroll-reveal,
   stat count-up band (variant-specific component).
   Vanilla, classic script tag, no dependencies, works over file://. */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- Mobile nav toggle ---------------------------------------------- */
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.getElementById('site-nav');

  function closeNav() {
    if (!toggle || !nav) { return; }
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { closeNav(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeNav(); }
    });
  }

  /* ---- Quote form: intercept, validate, fake success ------------------- */
  var form = document.getElementById('quote-form');

  function setError(field, hasError) {
    var wrap = field.closest('.field');
    if (!wrap) { return; }
    wrap.classList.toggle('has-error', hasError);
    field.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.querySelector('#q-name');
      var phone = form.querySelector('#q-phone');
      var email = form.querySelector('#q-email');
      var firstInvalid = null;

      var checks = [
        [name, name.value.trim().length >= 2],
        [phone, /^[0-9 ()+-]{8,}$/.test(phone.value.trim())],
        [email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())]
      ];
      checks.forEach(function (pair) {
        var ok = pair[1];
        setError(pair[0], !ok);
        if (!ok && !firstInvalid) { firstInvalid = pair[0]; }
      });

      if (firstInvalid) { firstInvalid.focus(); return; }

      var firstName = name.value.trim().split(/\s+/)[0];
      firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

      var success = document.getElementById('form-success');
      var msg = document.getElementById('form-success-msg');
      if (msg) {
        msg.textContent = 'Thanks ' + firstName + " — we'll be in touch within one business day.";
      }
      form.hidden = true;
      if (success) {
        success.classList.add('is-visible');
        success.focus();
      }
    });

    /* Clear a field's error state as soon as it is edited. */
    form.addEventListener('input', function (e) {
      var wrap = e.target.closest('.field');
      if (wrap) { wrap.classList.remove('has-error'); }
    });
  }

  /* ---- Scroll reveal (IntersectionObserver, motion-safe) --------------- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  function revealAll() {
    revealables.forEach(function (el) { el.classList.add('is-revealed'); });
  }

  if (!revealables.length) {
    /* nothing to do */
  } else if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---- Stat count-up band (variant-specific component) ----------------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));

  function renderStat(el, value) {
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    el.textContent = value.toFixed(decimals) + (el.getAttribute('data-suffix') || '');
  }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) { return; }
    if (reduceMotion.matches || !window.requestAnimationFrame) {
      renderStat(el, target);
      return;
    }
    var duration = 1100;
    var start = null;
    function tick(ts) {
      if (start === null) { start = ts; }
      var t = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3); /* ease-out cubic */
      renderStat(el, target * eased);
      if (t < 1) { window.requestAnimationFrame(tick); }
    }
    window.requestAnimationFrame(tick);
  }

  if (counters.length) {
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) { renderStat(el, parseFloat(el.getAttribute('data-count')) || 0); });
    } else {
      var statIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            statIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { statIo.observe(el); });
    }
  }

  /* ---- Footer year ------------------------------------------------------ */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }
})();
