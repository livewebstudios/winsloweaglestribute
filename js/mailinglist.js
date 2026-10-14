/* mailinglist.js — In-page Mailchimp submit via JSONP  |  Live Web Studios  |  2026 */
(function () {
  var form = document.getElementById('mc-embedded-subscribe-form');
  if (!form) return;

  var errEl = document.getElementById('mce-error-response');
  var okEl = document.getElementById('mce-success-response');
  var btn = document.getElementById('mc-embedded-subscribe');
  var btnLabel = btn.value;

  function clean(msg) {
    // Mailchimp prefixes errors like "0 - " and sometimes includes HTML links.
    // DOMParser builds an inert document: no scripts run, no images load.
    var text = String(msg || '').replace(/^\d+\s*-\s*/, '');
    var doc = new DOMParser().parseFromString(text, 'text/html');
    return (doc.body.textContent || '').trim();
  }

  function show(el, msg) {
    errEl.hidden = true;
    okEl.hidden = true;
    el.textContent = msg;
    el.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var email = form.EMAIL.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      show(errEl, 'Please enter a valid email address.');
      form.EMAIL.focus();
      return;
    }

    var cb = 'mcCb_' + Date.now();
    var url = form.action.replace('/post?', '/post-json?') +
      '&' + new URLSearchParams(new FormData(form)).toString() +
      '&c=' + cb;

    btn.disabled = true;
    btn.value = 'Subscribing…';

    var script = document.createElement('script');

    function done() {
      btn.disabled = false;
      btn.value = btnLabel;
      delete window[cb];
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[cb] = function (data) {
      if (data && data.result === 'success') {
        // Mailchimp's own text distinguishes new vs. already-subscribed
        show(okEl, clean(data.msg) || 'Almost there! Check your inbox to confirm your subscription.');
        form.reset();
      } else {
        show(errEl, clean(data && data.msg) || 'Something went wrong. Please try again.');
      }
      done();
    };

    script.onerror = function () {
      show(errEl, 'Could not reach the mailing list service. Please try again.');
      done();
    };

    script.src = url;
    document.body.appendChild(script);
  });
})();
