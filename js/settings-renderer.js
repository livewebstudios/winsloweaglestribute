/**
 * js/settings-renderer.js
 * Reads _content/settings.json (Decap file collection).
 * Populates any element with a data-setting attribute across all pages.
 *
 * Usage in HTML:
 *   <a data-setting="booking-email" href="#">Email</a>
 *   <span data-setting="phone"></span>
 *   <a data-setting="facebook" href="#">Facebook</a>
 *   <span data-setting="booking-contact"></span>
 *
 * Supported setting keys:
 *   booking-email, phone, booking-contact, facebook, instagram, youtube
 */

(function () {
  'use strict';

  var SETTINGS_DATA = '_content/settings.json';

  function populate(selector, value, isLink, scheme) {
    var elements = document.querySelectorAll('[data-setting="' + selector + '"]');
    elements.forEach(function (el) {
      if (!value) return;
      el.textContent = value;
      if (isLink && el.tagName === 'A') {
        el.href = scheme ? scheme + value.replace(/\D/g, '') : value;
      }
    });
  }

  function applySettings() {
    fetch(SETTINGS_DATA)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (s) {
        populate('booking-email',   s.booking_email,   true,  'mailto:');
        populate('phone',           s.phone,           true,  'tel:');
        populate('booking-contact', s.booking_contact, false, null);

        // Social links — only show if populated
        var socials = {
          'facebook':  s.facebook,
          'instagram': s.instagram,
          'youtube':   s.youtube
        };
        Object.keys(socials).forEach(function (key) {
          var url = socials[key];
          if (!url) return;
          document.querySelectorAll('[data-setting="' + key + '"]').forEach(function (el) {
            if (el.tagName === 'A') el.href = url;
            el.removeAttribute('hidden');
            el.style.display = '';
          });
        });
      })
      .catch(function (err) {
        console.warn('[settings-renderer] Could not load ' + SETTINGS_DATA + ':', err.message);
      });
  }

  document.addEventListener('DOMContentLoaded', applySettings);

})();
