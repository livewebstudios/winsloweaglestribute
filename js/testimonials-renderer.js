/**
 * js/testimonials-renderer.js
 * Reads _testimonials/index.json.
 *
 * Targets:
 *   booking.html  → #testimonials-container       (all testimonials)
 *   index.html    → #homepage-testimonial-container (featured only, or first)
 *
 * Calls window.LWS.observe(el) for IntersectionObserver fade-ins.
 */

(function () {
  'use strict';

  var TESTIMONIALS_INDEX = '_testimonials/index.json';

  function observe(el) {
    if (window.LWS && typeof window.LWS.observe === 'function') {
      window.LWS.observe(el);
    } else {
      el.classList.add('is-visible');
    }
  }

  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildCard(t) {
    var card = document.createElement('div');
    card.className = 'testimonial-card fade-in-element';

    var inner = '';
    inner += '<blockquote class="testimonial-quote">';
    inner +=   '<p>&#8220;' + esc(t.quote) + '&#8221;</p>';
    inner += '</blockquote>';
    inner += '<div class="testimonial-attribution">';
    inner +=   '<span class="testimonial-name">' + esc(t.name) + '</span>';
    if (t.title) {
      inner += '<span class="testimonial-title">' + esc(t.title) + '</span>';
    }
    inner += '</div>';

    card.innerHTML = inner;
    return card;
  }

  function renderTestimonials() {
    var fullContainer     = document.getElementById('testimonials-container');
    var featuredContainer = document.getElementById('homepage-testimonial-container');

    if (!fullContainer && !featuredContainer) return;

    fetch(TESTIMONIALS_INDEX)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (testimonials) {

        // booking.html — all testimonials
        if (fullContainer) {
          fullContainer.innerHTML = '';
          testimonials.forEach(function (t) {
            var card = buildCard(t);
            fullContainer.appendChild(card);
            observe(card);
          });
        }

        // index.html — featured only, fall back to first item
        if (featuredContainer) {
          var featured = testimonials.filter(function (t) { return t.featured; });
          var source   = featured.length ? featured : testimonials.slice(0, 1);
          featuredContainer.innerHTML = '';
          source.forEach(function (t) {
            var card = buildCard(t);
            featuredContainer.appendChild(card);
            observe(card);
          });
        }

      })
      .catch(function (err) {
        console.warn('[testimonials-renderer] Could not load ' + TESTIMONIALS_INDEX + ':', err.message);
      });
  }

  document.addEventListener('DOMContentLoaded', renderTestimonials);

})();
