/* main.js — Winslow site JS  |  Live Web Studios  |  2026 */

/* ── Nav scroll opacity ── */
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  var nav = document.getElementById('mainNav');
  if (!nav) return;
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ── Mobile nav toggle ── */
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  var btn = document.getElementById('navToggle');
  var links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  // Close when a link is tapped
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ── Hero parallax scroll ────────────────────────────────────────
   The .hero-bg drifts at 40% of scroll speed, creating depth.
   Throttled with requestAnimationFrame for smooth 60fps.
──────────────────────────────────────────────────────────────── */
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  var heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  var ticking = false;
  function update() {
    heroBg.style.transform = 'translateY(' + (window.scrollY * 0.4) + 'px)';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
})();


/* ── Section fade-in on scroll ───────────────────────────────────
   Elements animate up + fade in when they enter the viewport.
   IntersectionObserver fires each animation once then stops watching.
──────────────────────────────────────────────────────────────── */
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  var style = document.createElement('style');
  style.textContent =
    '.fade-in{opacity:0;transform:translateY(28px);transition:opacity .65s ease,transform .65s ease}' +
    '.fade-in.visible{opacity:1;transform:translateY(0)}' +
    '.shows-grid .fade-in:nth-child(2){transition-delay:.1s}' +
    '.shows-grid .fade-in:nth-child(3){transition-delay:.2s}' +
    '.shows-grid .fade-in:nth-child(4){transition-delay:.1s}' +
    '.shows-grid .fade-in:nth-child(5){transition-delay:.2s}' +
    '.shows-grid .fade-in:nth-child(6){transition-delay:.3s}' +
    '.fan-quotes-grid .fade-in:nth-child(2){transition-delay:.12s}' +
    '.fan-quotes-grid .fade-in:nth-child(3){transition-delay:.24s}' +
    '.fan-quotes-grid .fade-in:nth-child(4){transition-delay:.36s}' +
    '.testimonials-grid .fade-in:nth-child(2){transition-delay:.1s}' +
    '.testimonials-grid .fade-in:nth-child(3){transition-delay:.2s}' +
    '.testimonials-grid .fade-in:nth-child(4){transition-delay:.3s}' +
    '.dl-grid .fade-in:nth-child(2){transition-delay:.1s}' +
    '.dl-grid .fade-in:nth-child(3){transition-delay:.2s}' +
    '.dl-grid .fade-in:nth-child(4){transition-delay:.3s}' +
    '.epk-stats .fade-in:nth-child(2){transition-delay:.1s}' +
    '.epk-stats .fade-in:nth-child(3){transition-delay:.2s}' +
    '.epk-stats .fade-in:nth-child(4){transition-delay:.3s}' +
    '@media (prefers-reduced-motion: reduce){.fade-in,.fade-in.visible{transition:none!important;transform:none!important;opacity:1!important;}}';
  document.head.appendChild(style);

  var TARGETS = [
    '.show-card',
    '.member-row',
    '.video-card',
    '.testimonial-card',
    '.about-intro-block',
    '.meet-heading',
    '.memoriam-inner',
    '.tour-intro',
    '.media-intro',
    '.contact-inner',
    '.fan-quote',
    '.section-title',
    '.section-eyebrow',
    '.quotes-title',
    '.epk-stat',
    '.dl-card',
    '.epk-lede',
    '.cta-inner',
    '.ml-intro',
    '.media-gallery-slot',
    '.media-gallery-head',
    '.media-videos-head'
  ];

  TARGETS.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) { el.classList.add('fade-in'); });
  });

  /* Fallback for old browsers */
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.fade-in').forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  /* Store reference so show renderer can register dynamically added cards */
  window._fadeObserver = observer;
  window.LWS = window.LWS || {};
  window.LWS.observe = function (el) {
    el.classList.add('fade-in');
    if (observer) {
      observer.observe(el);
    } else {
      el.classList.add('visible');
    }
  };

  document.querySelectorAll('.fade-in').forEach(function (el) { observer.observe(el); });
})();


/* ── Lightbox ── */
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  var lb = document.getElementById('lb');
  if (!lb) return;

  var lbImg = document.getElementById('lbI');
  var lbCap = document.getElementById('lbC');
  var cur = 0;

  function getSlots() {
    return Array.prototype.slice.call(
      document.querySelectorAll('.strip-slot, .media-gallery-slot')
    );
  }

  function getPhotos() {
    return getSlots().map(function (el) {
      var img = el.querySelector('img');
      return { src: img ? img.src : '', cap: img ? img.alt : '' };
    });
  }

  function openLb(i) {
    var photos = getPhotos();
    cur = i;
    lbImg.src = photos[i].src;
    lbImg.alt = photos[i].cap;
    lbCap.textContent = photos[i].cap;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        lb.classList.add('open');
      });
    });
  }

  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function go(dir) {
    var photos = getPhotos();
    cur = (cur + dir + photos.length) % photos.length;
    openLb(cur);
  }

  function bindSlot(el) {
    if (el._lbBound) return;
    el._lbBound = true;
    el.addEventListener('click', function () {
      var idx = getSlots().indexOf(el);
      openLb(idx);
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        var idx = getSlots().indexOf(el);
        openLb(idx);
      }
    });
  }

  getSlots().forEach(bindSlot);

  window.LWS = window.LWS || {};
  window.LWS.bindLightboxSlot = bindSlot;

  document.getElementById('lbX').addEventListener('click', closeLb);
  document.getElementById('lbP').addEventListener('click', function () { go(-1); });
  document.getElementById('lbN').addEventListener('click', function () { go(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });
})();
