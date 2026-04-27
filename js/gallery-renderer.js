/**
 * js/gallery-renderer.js
 * Reads _content/gallery.json (Decap file collection).
 * Renders photo strip items into #photo-strip on index.html.
 * Hooks into existing lightbox via window.openLightbox(index, photos).
 *
 * Calls window.LWS.observe(el) for IntersectionObserver fade-ins.
 */

(function () {
  'use strict';

  var GALLERY_DATA = '_content/gallery.json';

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

  function renderGallery() {
    var strip = document.getElementById('photo-strip');
    if (!strip) return;

    fetch(GALLERY_DATA)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var photos = data.photos || [];
        if (!photos.length) return;

        strip.innerHTML = '';

        photos.forEach(function (photo, index) {
          var item = document.createElement('div');
          item.className = 'photo-strip-item fade-in-element';
          item.setAttribute('data-index', index);
          item.setAttribute('role', 'button');
          item.setAttribute('tabindex', '0');
          item.setAttribute('aria-label', photo.alt || photo.caption || 'View photo');

          var inner = '';
          inner += '<img src="' + esc(photo.image) + '"';
          inner +=      ' alt="' + esc(photo.alt || photo.caption || 'Band photo') + '"';
          inner +=      ' loading="lazy">';
          if (photo.caption) {
            inner += '<div class="photo-caption">' + esc(photo.caption) + '</div>';
          }
          item.innerHTML = inner;

          // Hook into existing lightbox (whatever function the original site uses)
          function openThis() {
            if (typeof window.openLightbox === 'function') {
              window.openLightbox(index, photos);
            }
          }
          item.addEventListener('click',   openThis);
          item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openThis(); }
          });

          strip.appendChild(item);
          observe(item);
        });
      })
      .catch(function (err) {
        console.warn('[gallery-renderer] Could not load ' + GALLERY_DATA + ':', err.message);
      });
  }

  document.addEventListener('DOMContentLoaded', renderGallery);

})();
