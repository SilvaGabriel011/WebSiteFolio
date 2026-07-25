/* Ironbark Cabinetry — BOLD variant behaviour.
   Vanilla, classic script. No network calls, no dependencies. */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav toggle ---------- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function closeNav() {
    if (!header || !toggle) { return; }
    header.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (header && toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (event) {
      var link = event.target.closest ? event.target.closest('a') : null;
      if (link) { closeNav(); }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && header.classList.contains('nav-open')) {
        closeNav();
        toggle.focus();
      }
    });
  }

  /* ---------- Quote form: fake submit ---------- */
  var form = document.getElementById('quote-form');

  function setFieldError(input, errorEl, show) {
    var field = input.closest('.field');
    if (field) { field.classList.toggle('is-invalid', show); }
    if (errorEl) { errorEl.hidden = !show; }
    input.setAttribute('aria-invalid', show ? 'true' : 'false');
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var nameInput = document.getElementById('qf-name');
      var phoneInput = document.getElementById('qf-phone');
      var suburbInput = document.getElementById('qf-suburb');
      var emailInput = document.getElementById('qf-email');
      var success = form.querySelector('.form-success');
      var firstInvalid = null;

      var nameOk = nameInput.value.trim().length > 1;
      setFieldError(nameInput, document.getElementById('qf-name-error'), !nameOk);
      if (!nameOk) { firstInvalid = firstInvalid || nameInput; }

      var phoneDigits = phoneInput.value.replace(/[^0-9+]/g, '');
      var phoneOk = phoneDigits.replace(/\D/g, '').length >= 8;
      setFieldError(phoneInput, document.getElementById('qf-phone-error'), !phoneOk);
      if (!phoneOk) { firstInvalid = firstInvalid || phoneInput; }

      var suburbOk = suburbInput.value.trim().length > 1;
      setFieldError(suburbInput, document.getElementById('qf-suburb-error'), !suburbOk);
      if (!suburbOk) { firstInvalid = firstInvalid || suburbInput; }

      var emailVal = emailInput.value.trim();
      var emailOk = emailVal === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
      setFieldError(emailInput, document.getElementById('qf-email-error'), !emailOk);
      if (!emailOk) { firstInvalid = firstInvalid || emailInput; }

      if (firstInvalid) {
        if (success) { success.hidden = true; }
        firstInvalid.focus();
        return;
      }

      var firstName = nameInput.value.trim().split(/\s+/)[0];
      firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

      if (success) {
        success.textContent = 'Thanks ' + firstName +
          " — we'll be in touch within one business day.";
        success.hidden = false;
      }
      form.reset();
      if (success && typeof success.scrollIntoView === 'function' && !reduceMotion) {
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
      revealEls.forEach(function (el) { observer.observe(el); });
    }
  }

  /* ---------- FAQ accordion: one open at a time ---------- */
  var faqs = Array.prototype.slice.call(document.querySelectorAll('.faq'));
  faqs.forEach(function (faq) {
    faq.addEventListener('toggle', function () {
      if (!faq.open) { return; }
      faqs.forEach(function (other) {
        if (other !== faq && other.open) { other.open = false; }
      });
    });
  });
})();
