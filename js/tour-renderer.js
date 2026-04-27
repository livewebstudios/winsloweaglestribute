(function () {
  'use strict';
  var TOUR_DATA = '_content/tour.json?v=' + Date.now();
  function observe(el) {
    if (window.LWS && typeof window.LWS.observe === 'function') {
      window.LWS.observe(el);
    } else { el.classList.add('is-visible'); }
  }
  function parseDate(d) { return new Date(d + 'T12:00:00'); }
  function formatDate(d) {
    return parseDate(d).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
  function isUpcoming(d) {
    var t = new Date(); t.setHours(0,0,0,0);
    return parseDate(d) >= t;
  }
  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function buildCard(show) {
    var card = document.createElement('div');
    card.className = 'show-card fade-in-element';
    var h = '';
    h += '<div class="show-date">' + formatDate(show.date) + '</div>';
    h += '<div class="show-venue">' + esc(show.venue) + '</div>';
    h += '<div class="show-location">' + esc(show.location) + '</div>';
    if (show.time)  h += '<div class="show-time">'  + esc(show.time)  + '</div>';
    if (show.notes) h += '<div class="show-notes">' + esc(show.notes) + '</div>';
    if (show.url)   h += '<a href="' + esc(show.url) + '" class="show-link btn" target="_blank" rel="noopener noreferrer">TICKETS / INFO</a>';
    card.innerHTML = h;
    return card;
  }
  function loadShows() {
    return fetch(TOUR_DATA)
      .then(function(res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
      .then(function(data) {
        return (data.shows || [])
          .filter(function(s) { return s.date && isUpcoming(s.date); })
          .sort(function(a, b) { return parseDate(a.date) - parseDate(b.date); });
      })
      .catch(function(err) { console.warn('[tour-renderer]', err.message); return []; });
  }
  function renderTourPage(shows) {
    var el = document.getElementById('tour-dates-container');
    if (!el) return;
    el.innerHTML = '';
    if (!shows.length) { el.innerHTML = '<p class="no-shows-message">No upcoming shows. Check back soon!</p>'; return; }
    shows.forEach(function(show) { var c = buildCard(show); el.appendChild(c); observe(c); });
  }
  function renderHomepageShows(shows) {
    var el = document.getElementById('homepage-shows-container');
    if (!el) return;
    var max = parseInt(el.getAttribute('data-max'), 10) || 3;
    var src = shows.filter(function(s) { return s.featured; });
    if (!src.length) src = shows;
    el.innerHTML = '';
    if (!src.length) { el.innerHTML = '<p class="no-shows-message">Shows coming soon!</p>'; return; }
    src.slice(0, max).forEach(function(show) { var c = buildCard(show); el.appendChild(c); observe(c); });
  }
  document.addEventListener('DOMContentLoaded', function() {
    loadShows().then(function(shows) { renderTourPage(shows); renderHomepageShows(shows); });
  });
}());
