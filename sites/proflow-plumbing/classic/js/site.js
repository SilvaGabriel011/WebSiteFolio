/* ProFlow Plumbing — CLASSIC variant. Standalone, classic script (no modules).
   Components: mobile nav toggle · sticky header shadow · scroll-reveal ·
   quote-form fake submit with inline validation · rates-card expander
   (the variant-specific component for this site). */
(function () {
  'use strict';

  // Flag JS availability so CSS may hide .reveal elements pre-animation.
  document.documentElement.classList.add('js');

  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close the dropdown once a destination is chosen.
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll reveal (respects prefers-reduced-motion) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    // Show everything immediately — no animation.
    Array.prototype.forEach.call(revealEls, function (el) {
      el.classList.add('revealed');
    });
  } else if (revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    Array.prototype.forEach.call(revealEls, function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Rates card expander (variant-specific component) ---------- */
  var ratesTable = document.getElementById('rates-table');
  var ratesToggle = document.getElementById('rates-toggle');
  if (ratesTable && ratesToggle) {
    ratesToggle.addEventListener('click', function () {
      var collapsed = ratesTable.classList.toggle('rates-collapsed');
      ratesToggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      ratesToggle.textContent = collapsed
        ? 'Show the full rates card'
        : 'Show fewer rates';
    });
  }

  /* ---------- Quote form: validate + fake submit (no network) ---------- */
  var form = document.getElementById('quote-form');
  if (form) {
    var success = document.getElementById('form-success');

    var setInvalid = function (fieldId, invalid) {
      var field = document.getElementById(fieldId);
      if (!field) { return; }
      field.classList.toggle('invalid', invalid);
      var control = field.querySelector('input, select, textarea');
      var err = field.querySelector('.error-msg');
      if (control && err) {
        control.setAttribute('aria-invalid', invalid ? 'true' : 'false');
        if (invalid) {
          control.setAttribute('aria-describedby', err.id);
        } else {
          control.removeAttribute('aria-describedby');
        }
      }
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameInput = document.getElementById('q-name');
      var phoneInput = document.getElementById('q-phone');
      var messageInput = document.getElementById('q-message');

      var name = nameInput ? nameInput.value.trim() : '';
      var phone = phoneInput ? phoneInput.value.trim() : '';
      var message = messageInput ? messageInput.value.trim() : '';

      // Accept AU-style numbers: digits, spaces, brackets, +, hyphens; 8+ digits.
      var phoneOk = /^[0-9 ()+-]{8,}$/.test(phone) &&
        phone.replace(/\D/g, '').length >= 8;

      var nameBad = name.length < 2;
      var phoneBad = !phoneOk;
      var messageBad = message.length < 5;

      setInvalid('field-name', nameBad);
      setInvalid('field-phone', phoneBad);
      setInvalid('field-message', messageBad);

      if (nameBad || phoneBad || messageBad) {
        var firstBad = form.querySelector('.field.invalid input, .field.invalid textarea');
        if (firstBad) { firstBad.focus(); }
        if (success) {
          success.classList.remove('visible');
          success.innerHTML = '';
        }
        return;
      }

      // Fake success — no network request, per the demo brief.
      var firstName = name.split(/\s+/)[0];
      firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

      if (success) {
        var heading = document.createElement('b');
        heading.textContent = 'Thanks ' + firstName +
          ' — we’ll be in touch within one business day';
        var body = document.createElement('p');
        body.textContent = 'If it turns urgent in the meantime, call 0400 776 121 ' +
          'any time — a plumber will answer.';
        success.innerHTML = '';
        success.appendChild(heading);
        success.appendChild(body);
        success.classList.add('visible');
      }

      form.reset();
      if (success && typeof success.scrollIntoView === 'function') {
        success.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: 'nearest'
        });
      }
    });
  }
})();
