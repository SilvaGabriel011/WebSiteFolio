/* Harbourline Joinery — premium variant
   Plain classic script, no modules, no network calls. */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Mobile navigation toggle ---------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close the panel once a destination is chosen
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
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

  /* ---- Masthead shadow on scroll ---------------------------------------- */
  var masthead = document.querySelector('.masthead');
  if (masthead) {
    var setShadow = function () {
      masthead.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    setShadow();
    window.addEventListener('scroll', setShadow, { passive: true });
  }

  /* ---- Scroll reveal ------------------------------------------------------ */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (revealEls.length) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-in', 'no-io'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
      revealEls.forEach(function (el, i) {
        // Gentle stagger for siblings revealed in the same pass
        el.style.setProperty('--reveal-delay', (i % 4) * 90 + 'ms');
        io.observe(el);
      });
    }
  }

  /* ---- Testimonial deck (variant-specific component) ----------------------- */
  var deck = document.querySelector('[data-rotator]');
  if (deck) {
    var quotes = Array.prototype.slice.call(deck.querySelectorAll('.quote'));
    if (quotes.length > 1) {
      var current = 0;
      var timer = null;
      var dotsWrap = deck.querySelector('.deck-dots');
      var prevBtn = deck.querySelector('[data-deck-prev]');
      var nextBtn = deck.querySelector('[data-deck-next]');
      var dots = [];

      var show = function (index) {
        current = (index + quotes.length) % quotes.length;
        quotes.forEach(function (q, i) {
          if (i === current) { q.removeAttribute('hidden'); }
          else { q.setAttribute('hidden', ''); }
        });
        dots.forEach(function (d, i) {
          d.setAttribute('aria-current', i === current ? 'true' : 'false');
        });
      };

      var stop = function () {
        if (timer) { window.clearInterval(timer); timer = null; }
      };
      var start = function () {
        if (reducedMotion) { return; }
        stop();
        timer = window.setInterval(function () { show(current + 1); }, 7000);
      };

      quotes.forEach(function (q, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'deck-dot';
        dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1) + ' of ' + quotes.length);
        dot.addEventListener('click', function () { show(i); start(); });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });

      if (prevBtn) { prevBtn.addEventListener('click', function () { show(current - 1); start(); }); }
      if (nextBtn) { nextBtn.addEventListener('click', function () { show(current + 1); start(); }); }

      deck.addEventListener('mouseenter', stop);
      deck.addEventListener('mouseleave', start);
      deck.addEventListener('focusin', stop);
      deck.addEventListener('focusout', start);

      deck.classList.add('is-mounted');
      show(0);
      start();
    }
  }

  /* ---- Enquiry form: fake submit, no network -------------------------------- */
  var form = document.getElementById('quote-form');
  if (form) {
    var success = document.getElementById('form-success');
    var successText = document.getElementById('form-success-text');

    var setError = function (input, message) {
      var field = input.closest('.field');
      if (!field) { return; }
      var note = field.querySelector('.field-error');
      if (message) {
        field.classList.add('has-error');
        input.setAttribute('aria-invalid', 'true');
        if (note) { note.textContent = message; }
      } else {
        field.classList.remove('has-error');
        input.removeAttribute('aria-invalid');
        if (note) { note.textContent = ''; }
      }
    };

    var validators = [
      {
        el: form.elements.name,
        check: function (v) { return v.trim().length >= 2; },
        message: 'Please tell us your name.'
      },
      {
        el: form.elements.phone,
        check: function (v) {
          var digits = v.replace(/[^\d]/g, '');
          return digits.length >= 8 && digits.length <= 12;
        },
        message: 'Please enter a phone number we can reach you on.'
      },
      {
        el: form.elements.email,
        check: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
        message: 'Please enter a valid email address.'
      },
      {
        el: form.elements.service,
        check: function (v) { return v !== ''; },
        message: 'Please choose the kind of work you need.'
      }
    ];

    validators.forEach(function (rule) {
      if (!rule.el) { return; }
      rule.el.addEventListener('input', function () {
        if (rule.check(rule.el.value)) { setError(rule.el, ''); }
      });
      rule.el.addEventListener('change', function () {
        if (rule.check(rule.el.value)) { setError(rule.el, ''); }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault(); // demo site: nothing leaves the page

      var firstBad = null;
      validators.forEach(function (rule) {
        if (!rule.el) { return; }
        if (!rule.check(rule.el.value)) {
          setError(rule.el, rule.message);
          if (!firstBad) { firstBad = rule.el; }
        } else {
          setError(rule.el, '');
        }
      });

      if (firstBad) {
        firstBad.focus();
        return;
      }

      var fullName = form.elements.name.value.trim();
      var firstName = fullName.split(/\s+/)[0];
      firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

      if (successText) {
        successText.textContent = 'Thanks ' + firstName +
          " — we'll be in touch within one business day.";
      }
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.setAttribute('tabindex', '-1');
        success.focus();
      }
    });
  }
})();
