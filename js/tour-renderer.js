/**
 * js/tour-renderer.js — v2
 * Reads _content/tour.json (Decap file collection — no GitHub Action needed).
 * Renders on tour.html → #tour-dates-container
 * Renders on index.html → #homepage-shows-container [data-max="3"]
 */

(function () {
  'use strict';

 var TOUR_DATA = '_content/tour.json?v=' + Date.now();

  function observe(el) {
    if (window.LWS && typeof window.LWS.observe === 'function') {
      window.LWS.observe(el);
    } else {
      el.classList.add('is-visible');
    }
  }

  function parseDate(dateStr) {
    return new Date(dateStr + 'T12:00:00');
  }

  function formatDate(dateStr) {
    return parseDate(dateStr).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  function isUpcoming(dateStr) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return parseDate(dateStr) >= today;
  }

  function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function buildCard(show) {
    var card = document.createElement('div');
    card.className = 'show-card fade-in-element';
    var html = '';
    html += '<div class="show-date">'     + formatDate(show.date)   + '</div>';
    html += '<div class="show-venue">'    + esc(show.venue)         + '</div>';
    html += '<div class="show-location">' + esc(show.location)      + '</div>';
    if (show.time)  html += '<div class="show-time">'  + esc(show.time)  + '</div>';
    if (show.notes) html += '<div class="show-notes">' + esc(show.notes) + '</div>';
    if (show.url)   html += '<a href="' + esc(show.url) + '" class="show-link btn" target="_blank" rel="noopener noreferrer">TICKETS / INFO</a>';
    card.innerHTML = html;
    return card;
  }

  function loadShows() {
    return fetch(TOUR_DATA)
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(data) {
        var shows = data.shows || [];
        return shows
          .filter(function(s) { return s.date && isUpcoming(s.date); })
          .sort(function(a, b) { return parseDate(a.date) - parseDate(b.date); });
      })
      .catch(function(err) {
        console.warn('[tour-renderer]', err.message);
        return [];
      });
  }

  function renderTourPage(shows) {
    var el = document.getElementById('tour-dates-container');
    if (!el) return;
    el.innerHTML = '';
    if (!shows.length) {
      el.innerHTML = '<p class="no-shows-message">No upcoming shows at this time. Check back soon!</p>';
      return;
    }
    shows.forEach(function(show) {
      var card = buildCard(show);
      el.appendChild(card);
      observe(card);
    });
  }

  function renderHomepageShows(shows) {
    var el = document.getElementById('homepage-shows-container');
    if (!el) return;
    var max      = parseInt(el.getAttribute('data-max'), 10) || 3;
    var featured = shows.filter(function(s) { return s.featured; });
    var source   = featured.length ? featured : shows;
    el.innerHTML = '';
    if (!source.length) {
      el.innerHTML = '<p class="no-shows-message">Stay tuned — shows coming soon!</p>';
      return;
    }
    source.slice(0, max).forEach(function(show) {
      var card = buildCard(show);
      el.appendChild(card);
      observe(card);
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    loadShows().then(function(shows) {
      renderTourPage(shows);
      renderHomepageShows(shows);
    });
  });

})();
