/**
 * js/testimonials-renderer.js — v2
 * Reads _content/testimonials.json (Decap file collection — no GitHub Action needed).
 * Renders on booking.html → #testimonials-container
 * Renders on index.html  → #homepage-testimonial-container (featured only)
 */

(function () {
  'use strict';

  var TESTIMONIALS_DATA = '_content/testimonials.json';

  function observe(el) {
    if (window.LWS && typeof window.LWS.observe === 'function') {
      window.LWS.observe(el);
    } else {
      el.classList.add('is-visible');
    }
  }

  function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function buildCard(t) {
    var card = document.createElement('div');
    card.className = 'testimonial-card fade-in-element';
    var html = '';
    html += '<blockquote class="testimonial-quote"><p>&#8220;' + esc(t.quote) + '&#8221;</p></blockquote>';
    html += '<div class="testimonial-attribution">';
    html +=   '<span class="testimonial-name">' + esc(t.name) + '</span>';
    if (t.title) html += '<span class="testimonial-title">' + esc(t.title) + '</span>';
    html += '</div>';
    card.innerHTML = html;
    return card;
  }

  function renderTestimonials() {
    var fullEl     = document.getElementById('testimonials-container');
    var featuredEl = document.getElementById('homepage-testimonial-container');
    if (!fullEl && !featuredEl) return;

    fetch(TESTIMONIALS_DATA)
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(data) {
        var all = data.testimonials || [];

        if (fullEl) {
          fullEl.innerHTML = '';
          all.forEach(function(t) {
            var card = buildCard(t);
            fullEl.appendChild(card);
            observe(card);
          });
        }

        if (featuredEl) {
          var featured = all.filter(function(t) { return t.featured; });
          var source   = featured.length ? featured : all.slice(0, 1);
          featuredEl.innerHTML = '';
          source.forEach(function(t) {
            var card = buildCard(t);
            featuredEl.appendChild(card);
            observe(card);
          });
        }
      })
      .catch(function(err) {
        console.warn('[testimonials-renderer]', err.message);
      });
  }

  document.addEventListener('DOMContentLoaded', renderTestimonials);

})();
