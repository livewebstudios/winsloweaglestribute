/**
 * js/media-renderer.js
 * Reads _media/index.json and renders YouTube embed cards on media.html.
 * Target container: #video-grid-container
 *
 * Calls window.LWS.observe(el) for IntersectionObserver fade-ins.
 */

(function () {
  'use strict';

  var MEDIA_INDEX = '_media/index.json';

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

  function buildVideoCard(video) {
    var card = document.createElement('div');
    card.className = 'video-card fade-in-element';

    var inner = '';
    inner += '<div class="video-embed-wrapper">';
    inner +=   '<iframe';
    inner +=     ' src="https://www.youtube.com/embed/' + esc(video.youtube_id) + '"';
    inner +=     ' title="' + esc(video.title) + '"';
    inner +=     ' frameborder="0"';
    inner +=     ' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"';
    inner +=     ' allowfullscreen';
    inner +=     ' loading="lazy">';
    inner +=   '</iframe>';
    inner += '</div>';
    inner += '<div class="video-title">' + esc(video.title) + '</div>';
    if (video.description) {
      inner += '<div class="video-description">' + esc(video.description) + '</div>';
    }

    card.innerHTML = inner;
    return card;
  }

  function renderVideos() {
    var container = document.getElementById('video-grid-container');
    if (!container) return;

    fetch(MEDIA_INDEX)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (videos) {
        videos
          .sort(function (a, b) { return (a.order || 99) - (b.order || 99); })
          .forEach(function (video) {
            var card = buildVideoCard(video);
            container.appendChild(card);
            observe(card);
          });
      })
      .catch(function (err) {
        console.warn('[media-renderer] Could not load ' + MEDIA_INDEX + ':', err.message);
      });
  }

  document.addEventListener('DOMContentLoaded', renderVideos);

})();
