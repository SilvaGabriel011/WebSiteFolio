/* Ironbark Cabinetry — CLASSIC variant behaviour.
   Standalone: no shared code, no modules, no network calls. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Flag JS availability so .reveal styles only hide content when JS runs */
  document.documentElement.classList.add('js');

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function closeNav() {
    if (!toggle || !nav) { return; }
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) { closeNav(); }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        toggle.focus();
      }
    });
  }

  /* ---------- Scroll reveal (respects prefers-reduced-motion) ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

      revealEls.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  /* ---------- Variant component: scroll-spy nav highlight ---------- */
  var spyLinks = Array.prototype.slice.call(
    document.querySelectorAll('.site-nav a[href^="#"]')
  );

  if (spyLinks.length && 'IntersectionObserver' in window) {
    var sectionsById = {};
    spyLinks.forEach(function (link) {
      var section = document.getElementById(link.getAttribute('href').slice(1));
      if (section) { sectionsById[section.id] = link; }
    });

    var setCurrent = function (id) {
      spyLinks.forEach(function (link) { link.classList.remove('is-current'); });
      if (id && sectionsById[id]) { sectionsById[id].classList.add('is-current'); }
    };

    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { setCurrent(entry.target.id); }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });

    Object.keys(sectionsById).forEach(function (id) {
      spyObserver.observe(document.getElementById(id));
    });
  }

  /* ---------- Quote form: fake submit, no network ---------- */
  var form = document.getElementById('quote-form');
  var success = document.getElementById('quote-success');

  function setFieldError(input, hasError, message) {
    var field = input.closest('.field');
    if (!field) { return; }
    field.classList.toggle('has-error', hasError);
    var error = field.querySelector('.field-error');
    if (error && message) { error.textContent = message; }
    input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }

  if (form && success) {
    form.setAttribute('novalidate', 'novalidate');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var nameInput = document.getElementById('qf-name');
      var phoneInput = document.getElementById('qf-phone');
      var emailInput = document.getElementById('qf-email');
      var messageInput = document.getElementById('qf-message');
      var firstInvalid = null;

      var nameValue = nameInput.value.trim();
      var nameOk = nameValue.length >= 2;
      setFieldError(nameInput, !nameOk, 'Please tell us your name.');
      if (!nameOk) { firstInvalid = firstInvalid || nameInput; }

      var phoneDigits = phoneInput.value.replace(/[^0-9+]/g, '');
      var phoneOk = phoneDigits.length >= 8;
      setFieldError(phoneInput, !phoneOk,
        'Please enter a phone number we can reach you on.');
      if (!phoneOk) { firstInvalid = firstInvalid || phoneInput; }

      var emailValue = emailInput.value.trim();
      var emailOk = emailValue === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
      setFieldError(emailInput, !emailOk,
        "That email doesn't look right — please check it.");
      if (!emailOk) { firstInvalid = firstInvalid || emailInput; }

      var messageOk = messageInput.value.trim().length >= 10;
      setFieldError(messageInput, !messageOk,
        'A sentence or two about the project helps us call you back prepared.');
      if (!messageOk) { firstInvalid = firstInvalid || messageInput; }

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      var firstName = nameValue.split(/\s+/)[0];
      firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

      document.getElementById('quote-success-copy').textContent =
        'Thanks ' + firstName + " — we'll be in touch within one business day.";

      form.classList.add('is-done');
      success.classList.add('is-visible');
      success.focus();
    });

    /* Clear a field's error as soon as the visitor edits it */
    form.addEventListener('input', function (event) {
      var field = event.target.closest('.field');
      if (field) { field.classList.remove('has-error'); }
    });
  }
})();
