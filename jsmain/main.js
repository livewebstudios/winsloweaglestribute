/* main.js — Winslow site JS  |  Live Web Studios  |  2026 */

/* ── Nav scroll opacity ── */
(function () {
  var nav = document.getElementById('mainNav');
  if (!nav) return;
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ── Mobile nav toggle ── */
(function () {
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
    '.epk-stats .fade-in:nth-child(4){transition-delay:.3s}';
  document.head.appendChild(style);

  var TARGETS = [
    '.show-card','.fan-quote','.member-row','.video-card',
    '.section-title','.section-eyebrow','.quotes-title',
    '.epk-stat','.testimonial-card','.dl-card',
    '.about-intro-block','.meet-heading','.memoriam-inner',
    '.epk-lede','.media-intro','.tour-intro',
    '.contact-inner','.cta-inner','.ml-intro',
    '.media-gallery-slot','.media-gallery-head','.media-videos-head'
  ];

  TARGETS.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) { el.classList.add('fade-in'); });
  });

  /* Fallback for old browsers */
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.fade-in').forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  /* Store reference so show renderer can register dynamically added cards */
  window._fadeObserver = obs;

  document.querySelectorAll('.fade-in').forEach(function (el) { obs.observe(el); });
})();


/* ── Show card renderer ──────────────────────────────────────────
   Reads SHOWS from shows.js, renders into .shows-grid containers.
   data-max="3" limits to 3 cards (homepage preview).
──────────────────────────────────────────────────────────────── */
(function () {
  if (typeof SHOWS === 'undefined') return;

  document.querySelectorAll('.shows-grid').forEach(function (grid) {
    var max   = parseInt(grid.getAttribute('data-max'), 10) || Infinity;
    var shows = SHOWS.slice(0, max);

    if (shows.length === 0) {
      grid.innerHTML = '<p class="no-shows">No upcoming shows at this time.<br>Check back soon.</p>';
      return;
    }

    grid.innerHTML = shows.map(function (s) {
      var sold = s.sold ? ' sold-out' : '';
      var btn  = s.sold
        ? '<span class="show-btn sold-btn">Sold Out</span>'
        : '<a class="show-btn" href="' + s.url + '" target="_blank" rel="noopener">' + s.label + '</a>';
      return [
        '<div class="show-card' + sold + '">',
        '  <div class="show-date">' + s.date + '</div>',
        '  <div class="show-venue">' + s.venue + '</div>',
        '  <div class="show-addr">' + s.addr + '<br>' + s.city + '</div>',
        '  <div class="show-time">&#9679; Showtime ' + s.time + '</div>',
        '  ' + btn,
        '</div>'
      ].join('\n');
    }).join('\n');

    /* Tag freshly rendered cards for fade-in */
    grid.querySelectorAll('.show-card').forEach(function (card) {
      card.classList.add('fade-in');
      if (window._fadeObserver) window._fadeObserver.observe(card);
    });
  });
})();


/* ── Lightbox ── */
(function () {
  var lb = document.getElementById('lb');
  if (!lb) return;

  var lbImg = document.getElementById('lbI');
  var lbCap = document.getElementById('lbC');
  var slots  = document.querySelectorAll('.strip-slot, .media-gallery-slot');
  var photos = [];
  var cur    = 0;

  slots.forEach(function (el, i) {
    photos.push({ src: el.querySelector('img').src, cap: el.querySelector('img').alt });
    el.addEventListener('click',   function () { openLb(i); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') openLb(i); });
  });

  function openLb(i) {
    cur = i;
    lbImg.src = photos[i].src;
    lbImg.alt = photos[i].cap;
    lbCap.textContent = photos[i].cap;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  function go(dir)   { cur = (cur + dir + photos.length) % photos.length; openLb(cur); }

  document.getElementById('lbX').addEventListener('click', closeLb);
  document.getElementById('lbP').addEventListener('click', function () { go(-1); });
  document.getElementById('lbN').addEventListener('click', function () { go(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLb();
    if (e.key === 'ArrowLeft')  go(-1);
    if (e.key === 'ArrowRight') go(1);
  });
})();
