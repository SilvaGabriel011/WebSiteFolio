/* Sunline Kitchens — premium variant
   Mobile nav, scroll reveal, before/after slider, quote form fake submit.
   Vanilla, classic script, no dependencies. */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- Mobile nav toggle ------------------------------------------------ */
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

  /* ---- Scroll reveal ----------------------------------------------------- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  function revealAll() {
    revealables.forEach(function (el) { el.classList.add('is-revealed'); });
  }

  if (revealables.length) {
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      revealAll();
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
      revealables.forEach(function (el) { observer.observe(el); });
    }
    // If the preference flips mid-visit, show everything at once.
    if (typeof reduceMotion.addEventListener === 'function') {
      reduceMotion.addEventListener('change', function (e) {
        if (e.matches) { revealAll(); }
      });
    }
  }

  /* ---- Before / after slider (variant component) ------------------------- */
  var slider = document.querySelector('[data-ba]');
  if (slider) {
    var topLayer = slider.querySelector('[data-ba-top]');
    var handle = slider.querySelector('[data-ba-handle]');
    var range = slider.querySelector('[data-ba-range]');

    var setSplit = function (value) {
      var v = Math.min(100, Math.max(0, Number(value)));
      topLayer.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
      handle.style.left = v + '%';
      range.setAttribute('aria-valuetext', v + '% renovated view');
    };

    if (topLayer && handle && range) {
      range.addEventListener('input', function () { setSplit(range.value); });
      // Double-click (or double-tap on the knob) recentres the comparison.
      slider.addEventListener('dblclick', function () {
        range.value = 50;
        setSplit(50);
      });
      setSplit(range.value || 50);
    }
  }

  /* ---- Quote form: validate + fake submit -------------------------------- */
  var form = document.getElementById('quote-form');
  if (form) {
    var success = document.getElementById('form-success');
    var successName = document.getElementById('success-name');

    var fields = {
      name: {
        input: form.querySelector('#qf-name'),
        test: function (v) { return v.trim().length >= 2; }
      },
      phone: {
        input: form.querySelector('#qf-phone'),
        test: function (v) {
          var digits = v.replace(/[^\d]/g, '');
          return digits.length >= 8 && digits.length <= 11;
        }
      },
      email: {
        input: form.querySelector('#qf-email'),
        test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }
      }
    };

    function setFieldState(field, ok) {
      var wrapper = field.input.closest('.field');
      wrapper.classList.toggle('has-error', !ok);
      field.input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    }

    Object.keys(fields).forEach(function (key) {
      fields[key].input.addEventListener('input', function () {
        if (fields[key].input.closest('.field').classList.contains('has-error')) {
          setFieldState(fields[key], fields[key].test(fields[key].input.value));
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault(); // demo only — nothing leaves the page
      var firstBad = null;

      Object.keys(fields).forEach(function (key) {
        var ok = fields[key].test(fields[key].input.value);
        setFieldState(fields[key], ok);
        if (!ok && !firstBad) { firstBad = fields[key].input; }
      });

      if (firstBad) {
        firstBad.focus();
        return;
      }

      var firstName = fields.name.input.value.trim().split(/\s+/)[0];
      firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      successName.textContent = firstName;

      form.hidden = true;
      success.classList.add('is-visible');
      success.focus();
    });
  }
})();
