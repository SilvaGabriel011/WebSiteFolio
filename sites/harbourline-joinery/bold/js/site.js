/* Harbourline Joinery — BOLD variant.
   Classic script, no modules, no network. Components: mobile nav toggle,
   FAQ accordion, fake quote-form submit with inline validation, scroll
   reveal (IntersectionObserver) and count-up stats — both respecting
   prefers-reduced-motion. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      navToggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      mobileNav.hidden = open;
      mobileNav.classList.toggle('open', !open);
    });
    // Close the panel once a destination is chosen.
    mobileNav.addEventListener('click', function (e) {
      if (e.target && e.target.closest('a')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
        mobileNav.hidden = true;
        mobileNav.classList.remove('open');
      }
    });
  }

  /* ---------- FAQ accordion ---------- */
  var faqButtons = document.querySelectorAll('.faq-q');
  Array.prototype.forEach.call(faqButtons, function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      // One open at a time keeps the list scannable.
      Array.prototype.forEach.call(faqButtons, function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          var p = document.getElementById(other.getAttribute('aria-controls'));
          if (p) { p.hidden = true; }
        }
      });
      btn.setAttribute('aria-expanded', String(!expanded));
      if (panel) { panel.hidden = expanded; }
    });
  });

  /* ---------- Quote form: fake submit, no network ---------- */
  var form = document.getElementById('quote-form');
  if (form) {
    var success = document.getElementById('form-success');
    var successMsg = document.getElementById('form-success-msg');

    function setInvalid(input, invalid) {
      var field = input.closest('.field');
      if (field) { field.classList.toggle('invalid', invalid); }
      input.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    }

    function validate() {
      var ok = true;
      var name = form.querySelector('#qf-name');
      var phone = form.querySelector('#qf-phone');
      var email = form.querySelector('#qf-email');

      if (!name.value.trim()) { setInvalid(name, true); ok = false; }
      else { setInvalid(name, false); }

      var phoneDigits = phone.value.replace(/[^0-9+]/g, '');
      if (phoneDigits.length < 8) { setInvalid(phone, true); ok = false; }
      else { setInvalid(phone, false); }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        setInvalid(email, true); ok = false;
      } else { setInvalid(email, false); }

      return ok;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault(); // demo only — nothing leaves the page
      if (!validate()) {
        var firstBad = form.querySelector('.field.invalid input, .field.invalid select, .field.invalid textarea');
        if (firstBad) { firstBad.focus(); }
        return;
      }
      var firstName = form.querySelector('#qf-name').value.trim().split(/\s+/)[0];
      successMsg.textContent = 'Thanks ' + firstName +
        " — we'll be in touch within one business day.";
      success.hidden = false;
      form.querySelector('button[type="submit"]').disabled = true;
      success.focus();
    });

    // Clear the error state as soon as a field is corrected.
    form.addEventListener('input', function (e) {
      var field = e.target.closest('.field');
      if (field && field.classList.contains('invalid')) {
        field.classList.remove('invalid');
        e.target.setAttribute('aria-invalid', 'false');
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    document.documentElement.classList.add('no-reveal');
  } else if (revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(revealEls, function (el) { io.observe(el); });
  }

  /* ---------- Count-up stats (variant component) ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    var fmt = function (n) { return n.toLocaleString('en-AU'); };
    var runCount = function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      if (!target) { return; }
      var duration = 900;
      var start = null;
      var tick = function (ts) {
        if (start === null) { start = ts; }
        var t = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = fmt(Math.round(target * eased));
        if (t < 1) { window.requestAnimationFrame(tick); }
      };
      window.requestAnimationFrame(tick);
    };
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    Array.prototype.forEach.call(counters, function (el) { cio.observe(el); });
  }
})();
