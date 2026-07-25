/* Sunline Kitchens — BOLD variant
   Standalone site behaviour: mobile nav, scroll reveal, before/after slider,
   exclusive FAQ accordion and the fake quote-form submit. No network calls,
   no dependencies; works over file:// . */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav toggle ---------- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  if (header && toggle) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close the menu when a nav link is chosen (one-pager anchors).
    header.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('.site-nav a') : null;
      if (link && header.classList.contains('nav-open')) {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Before / after slider (~40 lines) ---------- */
  var ba = document.getElementById('ba-slider');
  if (ba) {
    var baRange = ba.querySelector('.ba-range');
    var baAfter = ba.querySelector('.ba-after');
    var baHandle = ba.querySelector('.ba-handle');

    var setSplit = function (value) {
      var v = Math.max(0, Math.min(100, value));
      baAfter.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
      baHandle.style.left = v + '%';
    };

    // Keyboard + assistive tech drive the (invisible) range input directly.
    baRange.addEventListener('input', function () {
      setSplit(parseFloat(baRange.value));
    });

    // Pointer drag anywhere on the figure for a chunkier feel on touch.
    var dragging = false;
    var fromEvent = function (e) {
      var rect = ba.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      var v = (x / rect.width) * 100;
      baRange.value = v;
      setSplit(v);
    };
    ba.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) { return; }
      dragging = true;
      fromEvent(e);
    });
    window.addEventListener('pointermove', function (e) {
      if (dragging) { fromEvent(e); }
    });
    window.addEventListener('pointerup', function () { dragging = false; });

    setSplit(parseFloat(baRange.value));
  }

  /* ---------- FAQ accordion: one open at a time ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) { return; }
      faqItems.forEach(function (other) {
        if (other !== item && other.open) { other.open = false; }
      });
    });
  });

  /* ---------- Quote form: fake submit, no network ---------- */
  var form = document.getElementById('quote-form');
  var shell = document.getElementById('quote-form-shell');
  var success = document.getElementById('form-success');
  if (form && shell && success) {
    var fields = [
      {
        id: 'qf-name',
        valid: function (v) { return v.trim().length >= 2; }
      },
      {
        id: 'qf-phone',
        valid: function (v) { return /^[0-9\s()+-]{8,}$/.test(v.trim()); }
      },
      {
        id: 'qf-email',
        valid: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
      }
    ];

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstInvalid = null;

      fields.forEach(function (f) {
        var input = document.getElementById(f.id);
        var wrap = input.closest('.field');
        var ok = f.valid(input.value);
        wrap.classList.toggle('is-invalid', !ok);
        input.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !firstInvalid) { firstInvalid = input; }
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      var name = document.getElementById('qf-name').value.trim();
      var firstName = name.split(/\s+/)[0];
      firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

      // Demo site: nothing is sent anywhere. Show the inline success state.
      var strong = document.createElement('strong');
      strong.textContent = 'Thanks ' + firstName + " — we'll be in touch within one business day";
      var p = document.createElement('p');
      p.textContent = 'Dana or Priya will call your mobile first. If it suits you sooner, ' +
        'you can also book your consult time online right now.';
      success.textContent = '';
      success.appendChild(strong);
      success.appendChild(p);

      shell.classList.add('is-done');
      success.classList.add('is-shown');
      success.focus();
    });

    // Clear the error state as soon as a field is corrected.
    fields.forEach(function (f) {
      var input = document.getElementById(f.id);
      input.addEventListener('input', function () {
        if (f.valid(input.value)) {
          input.closest('.field').classList.remove('is-invalid');
          input.setAttribute('aria-invalid', 'false');
        }
      });
    });
  }
})();
