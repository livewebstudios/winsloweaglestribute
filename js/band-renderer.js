/**
 * js/band-renderer.js
 * Reads _content/band.json (Decap file collection).
 * Renders alternating image/text rows into #band-members-container on about.html.
 *
 * Calls window.LWS.observe(el) for IntersectionObserver fade-ins.
 */

(function () {
  'use strict';

  var BAND_DATA = '_content/band.json';

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

  function buildMemberRow(member, index) {
    var row       = document.createElement('div');
    var direction = index % 2 === 0 ? 'row-standard' : 'row-reverse';
    row.className = 'band-member-row fade-in-element ' + direction;

    var inner = '';
    inner += '<div class="member-photo">';
    inner +=   '<img src="' + esc(member.photo) + '" alt="' + esc(member.name) + '" loading="lazy">';
    inner += '</div>';
    inner += '<div class="member-info">';
    inner +=   '<h3 class="member-name">' + esc(member.name) + '</h3>';
    inner +=   '<div class="member-role">' + esc(member.role) + '</div>';
    inner +=   '<p class="member-bio">' + esc(member.bio) + '</p>';
    inner += '</div>';

    row.innerHTML = inner;
    return row;
  }

  function renderBand() {
    var container = document.getElementById('band-members-container');
    if (!container) return;

    fetch(BAND_DATA)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var members = data.members || [];
        container.innerHTML = '';

        members.forEach(function (member, index) {
          var row = buildMemberRow(member, index);
          container.appendChild(row);
          observe(row);
        });
      })
      .catch(function (err) {
        console.warn('[band-renderer] Could not load ' + BAND_DATA + ':', err.message);
      });
  }

  document.addEventListener('DOMContentLoaded', renderBand);

})();
