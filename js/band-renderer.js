/**
 * js/band-renderer.js
 * Reads _content/band.json and renders band members into #band-members-container.
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

  function buildMemberRow(member) {
    var row = document.createElement('div');
    row.className = 'member-row fade-in-element';

    row.innerHTML =
      '<div class="member-photo">' +
        '<img src="' + esc(member.photo) + '" alt="' + esc(member.name) + '" loading="lazy">' +
      '</div>' +
      '<div class="member-bio">' +
        '<h3 class="member-name">' + esc(member.name) + '</h3>' +
        '<p class="member-role">' + esc(member.role) + '</p>' +
        '<p class="member-text">' + esc(member.bio) + '</p>' +
      '</div>';

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
        var members = (data && data.members) || [];
        container.innerHTML = '';

        members.forEach(function (member) {
          var row = buildMemberRow(member);
          container.appendChild(row);
          observe(row);
        });
      })
      .catch(function (err) {
        console.warn('[band-renderer] Could not load ' + BAND_DATA + ':', err.message);
      });
  }

  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('DOMContentLoaded', renderBand);
  }

})();
