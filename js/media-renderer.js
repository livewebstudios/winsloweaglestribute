/**
 * js/media-renderer.js — v2
 * Reads _content/media.json (Decap file collection — no GitHub Action needed).
 * Renders on media.html → #video-grid-container
 */

(function () {
  'use strict';

  var MEDIA_DATA = '_content/media.json';

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

  function renderVideos() {
    var container = document.getElementById('video-grid-container');
    if (!container) return;

    fetch(MEDIA_DATA)
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(data) {
        var videos = data.videos || [];
        videos
          .sort(function(a, b) { return (a.order || 99) - (b.order || 99); })
          .forEach(function(video) {
            var card = document.createElement('div');
            card.className = 'video-card fade-in-element';
            var html = '';
            html += '<div class="video-embed-wrapper">';
            html +=   '<iframe src="https://www.youtube.com/embed/' + esc(video.youtube_id) + '"';
            html +=     ' title="' + esc(video.title) + '" frameborder="0"';
            html +=     ' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"';
            html +=     ' allowfullscreen loading="lazy"></iframe>';
            html += '</div>';
            html += '<div class="video-title">' + esc(video.title) + '</div>';
            if (video.description) html += '<div class="video-description">' + esc(video.description) + '</div>';
            card.innerHTML = html;
            container.appendChild(card);
            observe(card);
          });
      })
      .catch(function(err) {
        console.warn('[media-renderer]', err.message);
      });
  }

  document.addEventListener('DOMContentLoaded', renderVideos);

})();
