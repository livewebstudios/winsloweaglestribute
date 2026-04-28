(function () {
  var container = document.getElementById('video-grid-container');
  if (!container) return;

  fetch('_content/media.json?v=' + Date.now())
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var videos = data.videos || [];
      if (!videos.length) return;

      videos.forEach(function (v) {
        var article = document.createElement('article');
        article.className = 'video-card';

        var embedSrc = 'https://player.vimeo.com/video/' + v.vimeo_id
          + '?title=0&byline=0&portrait=0&color=c9a84c';

        article.innerHTML =
          '<div class="video-embed">'
          + '<iframe src="' + embedSrc + '" allow="autoplay; fullscreen; picture-in-picture"'
          + ' allowfullscreen title="' + v.title + '"></iframe>'
          + '</div>'
          + '<div class="video-info">'
          + '<span class="video-label">' + v.category + '</span>'
          + '<h2 class="video-title">' + v.title + '</h2>'
          + '</div>';

        container.appendChild(article);

        if (window.LWS && window.LWS.observe) {
          window.LWS.observe(article);
        } else {
          article.classList.add('visible');
        }
      });
    })
    .catch(function (e) { console.error('media-renderer:', e); });
})();
