/* ProFlow Plumbing — premium variant. Standalone, no dependencies, classic script. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var closeNav = function () {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { closeNav(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        toggle.focus();
      }
    });
  }

  /* ---------- Variant component: live "on call now" chip (Penrith time) ---------- */
  var chipTime = document.querySelector('[data-penrith-time]');
  if (chipTime) {
    var fmt;
    try {
      fmt = new Intl.DateTimeFormat('en-AU', {
        hour: 'numeric', minute: '2-digit', hour12: true,
        timeZone: 'Australia/Sydney'
      });
    } catch (err) {
      fmt = new Intl.DateTimeFormat('en-AU', {
        hour: 'numeric', minute: '2-digit', hour12: true
      });
    }
    var tick = function () {
      chipTime.textContent = fmt.format(new Date()).replace(/\s/g, '').toLowerCase();
    };
    tick();
    window.setInterval(tick, 30000);
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Quote form: fake submit, no network ---------- */
  var form = document.getElementById('quote-form');
  var success = document.getElementById('quote-success');
  if (form && success) {
    var setError = function (input, message) {
      var field = input.closest('.field');
      if (!field) { return; }
      var msg = field.querySelector('.error-msg');
      if (message) {
        field.classList.add('has-error');
        if (msg) { msg.textContent = message; }
        input.setAttribute('aria-invalid', 'true');
      } else {
        field.classList.remove('has-error');
        input.removeAttribute('aria-invalid');
      }
    };

    var validators = [
      {
        el: form.elements.name,
        test: function (v) { return v.trim().length >= 2; },
        message: 'Please tell us your name.'
      },
      {
        el: form.elements.phone,
        test: function (v) {
          var digits = v.replace(/[^\d]/g, '');
          return digits.length >= 8 && digits.length <= 11;
        },
        message: 'Please enter a contact number, e.g. 0400 000 000.'
      },
      {
        el: form.elements.suburb,
        test: function (v) { return v.trim().length >= 2; },
        message: 'Which suburb is the job in?'
      },
      {
        el: form.elements.service,
        test: function (v) { return v !== ''; },
        message: 'Please choose the closest match.'
      }
    ];

    validators.forEach(function (rule) {
      if (!rule.el) { return; }
      rule.el.addEventListener('input', function () { setError(rule.el, null); });
      rule.el.addEventListener('change', function () { setError(rule.el, null); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault(); /* demo only — nothing leaves the page */
      var firstInvalid = null;
      validators.forEach(function (rule) {
        if (!rule.el) { return; }
        if (!rule.test(rule.el.value)) {
          setError(rule.el, rule.message);
          if (!firstInvalid) { firstInvalid = rule.el; }
        } else {
          setError(rule.el, null);
        }
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }
      var firstName = form.elements.name.value.trim().split(/\s+/)[0];
      var title = success.querySelector('.success-title');
      if (title) {
        title.textContent = 'Thanks ' + firstName +
          ' — we’ll be in touch within one business day.';
      }
      form.hidden = true;
      success.classList.add('is-shown');
      success.setAttribute('tabindex', '-1');
      success.focus({ preventScroll: false });
    });
  }
})();
