/* ProFlow Plumbing — BOLD variant. Standalone, no dependencies, no network. */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.getElementById('site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var open = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close the menu after choosing a destination
    siteNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && siteNav.classList.contains('open')) {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* ---------- FAQ accordion ---------- */
  var faqButtons = document.querySelectorAll('.faq-q');
  Array.prototype.forEach.call(faqButtons, function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      item.classList.toggle('open', !expanded);
    });
  });

  /* ---------- Quote form: fake submit, no network ---------- */
  var form = document.getElementById('quote-form');
  if (form) {
    var card = form.closest('.quote-form');

    function setInvalid(fieldEl, invalid) {
      var wrap = fieldEl.closest('.field');
      if (!wrap) { return; }
      wrap.classList.toggle('invalid', invalid);
      fieldEl.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    }

    function validPhone(value) {
      var digits = value.replace(/[^0-9+]/g, '');
      return digits.length >= 8 && digits.length <= 12;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault(); // never hits the network — demo only

      var nameEl = document.getElementById('q-name');
      var phoneEl = document.getElementById('q-phone');
      var serviceEl = document.getElementById('q-service');
      var firstInvalid = null;

      var nameOk = nameEl.value.trim().length >= 2;
      setInvalid(nameEl, !nameOk);
      if (!nameOk) { firstInvalid = firstInvalid || nameEl; }

      var phoneOk = validPhone(phoneEl.value);
      setInvalid(phoneEl, !phoneOk);
      if (!phoneOk) { firstInvalid = firstInvalid || phoneEl; }

      var serviceOk = serviceEl.value !== '';
      setInvalid(serviceEl, !serviceOk);
      if (!serviceOk) { firstInvalid = firstInvalid || serviceEl; }

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      var firstName = nameEl.value.trim().split(/\s+/)[0];
      // Title-case the first name for the thank-you line
      firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

      var headline = document.getElementById('success-headline');
      if (headline) {
        headline.textContent =
          'Thanks ' + firstName + " — we'll be in touch within one business day";
      }
      if (card) {
        card.classList.add('sent');
        var successBox = card.querySelector('.form-success');
        if (successBox) { successBox.focus(); }
      }
    });

    // Clear the error state as soon as the visitor fixes a field
    form.addEventListener('input', function (e) {
      var el = e.target;
      if (el.closest('.field')) { setInvalid(el, false); }
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealEls, function (el) {
      el.classList.add('revealed');
    });
  } else if (revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(revealEls, function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- Floating call button: appears once the hero scrolls away ---------- */
  var fab = document.querySelector('.fab-call');
  var heroRef = document.querySelector('[data-fab-sentinel]');
  if (fab) {
    if (heroRef && 'IntersectionObserver' in window) {
      var fabObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          fab.classList.toggle('is-visible', !entry.isIntersecting);
        });
      }, { threshold: 0.05 });
      fabObserver.observe(heroRef);
    } else {
      fab.classList.add('is-visible');
    }
  }
})();
