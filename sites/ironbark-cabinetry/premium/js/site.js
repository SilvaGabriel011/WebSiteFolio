/* Ironbark Cabinetry — premium variant.
   Classic script, no dependencies, works over file://.
   Nav toggle · scroll reveal · testimonial rotator · quote-form fake submit. */
(function () {
  'use strict';

  /* Signal JS availability so reveal styles only apply when they can be undone. */
  document.documentElement.classList.add('js');

  var reducedMotion = !!(window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---- Footer year ------------------------------------------------------ */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* ---- Mobile nav toggle ------------------------------------------------ */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function closeNav() {
    if (!header) { return; }
    header.classList.remove('nav-open');
    if (toggle) { toggle.setAttribute('aria-expanded', 'false'); }
  }

  if (header && toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      var t = e.target;
      while (t && t !== nav) {
        if (t.tagName === 'A') { closeNav(); break; }
        t = t.parentNode;
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        closeNav();
        toggle.focus();
      }
    });
  }

  /* ---- Scroll reveal ----------------------------------------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  function revealEverything() {
    revealEls.forEach(function (el) { el.classList.add('is-revealed'); });
  }

  if (revealEls.length) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealEverything();
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---- Testimonial rotator (premium-variant component) ------------------- */
  var rotator = document.getElementById('quote-rotator');
  if (rotator) {
    var slides = Array.prototype.slice.call(rotator.querySelectorAll('.quote-slide'));
    var dotsWrap = document.querySelector('.quote-dots');

    if (slides.length > 1 && dotsWrap) {
      rotator.classList.add('is-rotator');
      var current = 0;
      var timer = null;
      var dots = [];

      var show = function (index) {
        current = index;
        slides.forEach(function (slide, i) {
          if (i === index) {
            slide.removeAttribute('hidden');
            slide.classList.add('is-active');
          } else {
            slide.setAttribute('hidden', '');
            slide.classList.remove('is-active');
          }
        });
        dots.forEach(function (dot, i) {
          dot.setAttribute('aria-pressed', i === index ? 'true' : 'false');
        });
      };

      var stop = function () {
        if (timer) { window.clearInterval(timer); timer = null; }
      };
      var start = function () {
        stop();
        if (!reducedMotion) {
          timer = window.setInterval(function () {
            show((current + 1) % slides.length);
          }, 7000);
        }
      };

      slides.forEach(function (_slide, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1) + ' of ' + slides.length);
        dot.setAttribute('aria-pressed', 'false');
        dot.addEventListener('click', function () {
          show(i);
          start(); /* restart the clock after a manual choice */
        });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });

      rotator.addEventListener('mouseenter', stop);
      rotator.addEventListener('mouseleave', start);
      rotator.addEventListener('focusin', stop);
      rotator.addEventListener('focusout', start);

      show(0);
      start();
    }
  }

  /* ---- Quote form — fake submit, no network ------------------------------ */
  var form = document.getElementById('quote-form');
  if (form) {
    var successBox = document.getElementById('form-success');
    var successTitle = document.getElementById('form-success-title');

    var validators = [
      {
        id: 'qf-name',
        errorId: 'qf-name-error',
        valid: function (v) { return v.trim().length >= 2; }
      },
      {
        id: 'qf-email',
        errorId: 'qf-email-error',
        valid: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }
      },
      {
        id: 'qf-phone',
        errorId: 'qf-phone-error',
        valid: function (v) { return v.replace(/\D/g, '').length >= 8; }
      },
      {
        id: 'qf-message',
        errorId: 'qf-message-error',
        valid: function (v) { return v.trim().length >= 10; }
      }
    ];

    var setFieldState = function (rule, isValid) {
      var input = document.getElementById(rule.id);
      if (!input) { return; }
      var wrap = input.closest ? input.closest('.field') : null;
      if (wrap) { wrap.classList.toggle('has-error', !isValid); }
      input.setAttribute('aria-invalid', isValid ? 'false' : 'true');
      if (isValid) {
        input.removeAttribute('aria-describedby');
      } else {
        input.setAttribute('aria-describedby', rule.errorId);
      }
    };

    /* Clear a field's error as soon as it is corrected. */
    validators.forEach(function (rule) {
      var input = document.getElementById(rule.id);
      if (!input) { return; }
      input.addEventListener('input', function () {
        if (rule.valid(input.value)) { setFieldState(rule, true); }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault(); /* demo form — nothing leaves the page */

      var firstInvalid = null;
      validators.forEach(function (rule) {
        var input = document.getElementById(rule.id);
        if (!input) { return; }
        var ok = rule.valid(input.value);
        setFieldState(rule, ok);
        if (!ok && !firstInvalid) { firstInvalid = input; }
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      var nameInput = document.getElementById('qf-name');
      var firstName = nameInput ? nameInput.value.trim().split(/\s+/)[0] : '';
      if (firstName) {
        firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      }

      if (successTitle) {
        successTitle.textContent = 'Thanks ' + firstName +
          ' — we’ll be in touch within one business day';
      }
      form.setAttribute('hidden', '');
      if (successBox) {
        successBox.removeAttribute('hidden');
        successBox.focus();
      }
    });
  }
})();
