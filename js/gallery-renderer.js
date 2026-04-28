(function () {
  var container = document.getElementById('photo-grid-container');
  if (!container) return;

  fetch('_content/gallery.json?v=' + Date.now())
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var photos = data.photos || [];
      if (!photos.length) return;

      photos.forEach(function (p) {
        var wrapper = document.createElement('div');
        wrapper.setAttribute('role', 'listitem');

        var slot = document.createElement('div');
        slot.className = 'media-gallery-slot';
        slot.setAttribute('role', 'button');
        slot.setAttribute('tabindex', '0');
        slot.setAttribute('aria-label', 'View enlarged: ' + p.alt);

        var img = document.createElement('img');
        img.src = p.image;
        img.alt = p.alt;
        img.loading = 'lazy';

        var zoom = document.createElement('span');
        zoom.className = 'media-gallery-zoom';
        zoom.setAttribute('aria-hidden', 'true');
        zoom.innerHTML = '&#x2315;';

        slot.appendChild(img);
        slot.appendChild(zoom);
        wrapper.appendChild(slot);
        container.appendChild(wrapper);

        if (window.LWS && window.LWS.observe) {
          window.LWS.observe(slot);
        } else {
          slot.classList.add('visible');
        }

        if (window.LWS && window.LWS.bindLightboxSlot) {
          window.LWS.bindLightboxSlot(slot);
        }
      });
    })
    .catch(function (e) { console.error('gallery-renderer:', e); });
})();
