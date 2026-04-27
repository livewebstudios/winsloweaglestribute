/**
 * js/tour-renderer.js
 * Reads _tour/index.json (built by GitHub Action from Decap .md files).
 * Renders show cards on:
 *   - tour.html     → #tour-dates-container
 *   - index.html    → #homepage-shows-container [data-max="3"]
 *
 * Calls window.LWS.observe(el) for IntersectionObserver fade-ins.
 * Falls back to adding .is-visible directly if animations.js isn't loaded yet.
 */

(function () {
  'use strict';

  var TOUR_INDEX = '_tour/index.json';

  // ─── Animation hook ────────────────────────────────────────────────────────
  function observe(el) {
    if (window.LWS && typeof window.LWS.observe === 'function') {
      window.LWS.observe(el);
    } else {
      el.classList.add('is-visible');
    }
  }

  // ─── Date helpers ──────────────────────────────────────────────────────────
  function parseDate(dateStr) {
    // Force noon local to avoid UTC-offset day-shift bug
    return new Date(dateStr + 'T12:00:00');
  }

  function formatDate(dateStr) {
    var d = parseDate(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year:    'numeric',
      month:   'long',
      day:     'numeric'
    });
  }

  function isUpcoming(dateStr) {
    var showDate = parseDate(dateStr);
    var today    = new Date();
    today.setHours(0, 0, 0, 0);
    return showDate >= today;
  }

  // ─── Card builder ──────────────────────────────────────────────────────────
  function buildCard(show) {
    var card = document.createElement('div');
    card.className = 'show-card fade-in-element';

    var inner = '';
    inner += '<div class="show-date">' + formatDate(show.date) + '</div>';
    inner += '<div class="show-venue">' + esc(show.venue) + '</div>';
    inner += '<div class="show-location">' + esc(show.location) + '</div>';
    if (show.time)  { inner += '<div class="show-time">' + esc(show.time) + '</div>'; }
    if (show.notes) { inner += '<div class="show-notes">' + esc(show.notes) + '</div>'; }
    if (show.url)   {
      inner += '<a href="' + esc(show.url) + '" class="show-link btn" target="_blank" rel="noopener noreferrer">TICKETS / INFO</a>';
    }

    card.innerHTML = inner;
    return card;
  }

  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function noShowsMsg(msg) {
    var p = document.createElement('p');
    p.className = 'no-shows-message';
    p.textContent = msg || 'No upcoming shows at this time. Check back soon!';
    return p;
  }

  // ─── Data loader ───────────────────────────────────────────────────────────
  function loadShows() {
    return fetch(TOUR_INDEX)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (shows) {
        return shows
          .filter(function (s) { return s.date && isUpcoming(s.date); })
          .sort(function (a, b) { return parseDate(a.date) - parseDate(b.date); });
      })
      .catch(function (err) {
        console.warn('[tour-renderer] Could not load ' + TOUR_INDEX + ':', err.message);
        return [];
      });
  }

  // ─── Tour page renderer ────────────────────────────────────────────────────
  function renderTourPage(shows) {
    var container = document.getElementById('tour-dates-container');
    if (!container) return;

    container.innerHTML = '';

    if (!shows.length) {
      container.appendChild(noShowsMsg());
      return;
    }

    shows.forEach(function (show) {
      var card = buildCard(show);
      container.appendChild(card);
      observe(card);
    });
  }

  // ─── Homepage upcoming shows renderer ──────────────────────────────────────
  function renderHomepageShows(shows) {
    var container = document.getElementById('homepage-shows-container');
    if (!container) return;

    var max = parseInt(container.getAttribute('data-max'), 10) || 3;

    // Homepage optionally limits to featured shows first
    var featured = shows.filter(function (s) { return s.featured; });
    var source   = featured.length ? featured : shows;

    container.innerHTML = '';

    if (!source.length) {
      container.appendChild(noShowsMsg('Stay tuned — shows coming soon!'));
      return;
    }

    source.slice(0, max).forEach(function (show) {
      var card = buildCard(show);
      container.appendChild(card);
      observe(card);
    });
  }

  // ─── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    loadShows().then(function (shows) {
      renderTourPage(shows);
      renderHomepageShows(shows);
    });
  });

})();
