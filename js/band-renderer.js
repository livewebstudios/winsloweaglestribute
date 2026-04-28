/**
 * js/band-renderer.js
 * Reads _content/band.json — renders into #band-members-container on about.html
 * Alternates DOM order so CSS nth-child grid works correctly.
 */
(function () {
  'use strict';

  var BAND_DATA = '_content/band.json';

  function observe(el) {
    if (window.LWS && typeof window.LWS.observe === 'function') {
      window.LWS.observe(el);
    } else {
      el.classList.add('visible');
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
    var row = document.createElement('div');
    row.className = 'member-row fade-in-element';

    var photoHtml = '<div class="member-photo">'
      + '<img src="' + esc(member.photo) + '" alt="' + esc(member.name) + '" loading="lazy">'
      + '</div>';

    var bioHtml = '<div class="member-bio">'
      + '<h3 class="member-name">' + esc(member.name) + '</h3>'
      + '<p class="member-role">' + esc(member.role) + '</p>'
      + '<p class="member-text">' + esc(member.bio) + '</p>'
      + '</div>';

    /* Even index (0,2,4): photo first — CSS gives it 300px column
       Odd  index (1,3,5): bio first  — CSS flips to 1fr|300px so photo ends up right */
    row.innerHTML = (index % 2 === 0) ? (photoHtml + bioHtml) : (bioHtml + photoHtml);
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
        members.forEach(function (member, index) {
          var row = buildMemberRow(member, index);
          container.appendChild(row);
          observe(row);
        });
      })
      .catch(function (err) {
        console.warn('[band-renderer]', err.message);
      });
  }

  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('DOMContentLoaded', renderBand);
  }

}());
