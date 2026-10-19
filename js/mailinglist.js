/* mailinglist.js — In-page Mailchimp submit via JSONP  |  Live Web Studios  |  2026
   - All fields required, confirm-email match, permission checkbox
   - Simple image code check (letters/numbers drawn on a canvas)
   - Confirm email and code are never sent to Mailchimp (no name attribute) */
(function () {
  var form = document.getElementById('mc-embedded-subscribe-form');
  if (!form) return;

  var errEl = document.getElementById('mce-error-response');
  var okEl = document.getElementById('mce-success-response');
  var btn = document.getElementById('mc-embedded-subscribe');
  var btnLabel = btn.value;

  var email2 = document.getElementById('ml-EMAIL2');
  var permission = document.getElementById('mce-MMERGE6');
  var codeInput = document.getElementById('ml-CAPTCHA');
  var canvas = document.getElementById('ml-captcha-canvas');
  var refresh = document.getElementById('ml-captcha-refresh');

  /* ---------- Image code ---------- */
  // No 0/O, 1/I/L: too easy to misread
  var CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  var code = '';

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function newCode() {
    code = '';
    for (var i = 0; i < 5; i++) code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));

    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Background noise lines
    for (var n = 0; n < 6; n++) {
      ctx.strokeStyle = 'rgba(201,168,76,' + rand(.15, .35) + ')';
      ctx.lineWidth = rand(1, 2);
      ctx.beginPath();
      ctx.moveTo(rand(0, w), rand(0, h));
      ctx.lineTo(rand(0, w), rand(0, h));
      ctx.stroke();
    }

    // Characters, each slightly rotated and offset
    ctx.font = '700 28px Raleway, Arial, sans-serif';
    ctx.textBaseline = 'middle';
    var step = w / (code.length + 1);
    for (var c = 0; c < code.length; c++) {
      ctx.save();
      ctx.translate(step * (c + 1), h / 2 + rand(-5, 5));
      ctx.rotate(rand(-.35, .35));
      ctx.fillStyle = c % 2 ? '#e8d080' : '#c9a84c';
      ctx.fillText(code.charAt(c), -9, 0);
      ctx.restore();
    }

    // Dots
    for (var d = 0; d < 30; d++) {
      ctx.fillStyle = 'rgba(232,208,128,' + rand(.2, .5) + ')';
      ctx.fillRect(rand(0, w), rand(0, h), 2, 2);
    }

    codeInput.value = '';
  }

  refresh.addEventListener('click', function () {
    newCode();
    codeInput.focus();
  });

  newCode();

  /* ---------- Messages ---------- */
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

  function fail(msg, field) {
    show(errEl, msg);
    if (field) field.focus();
  }

  /* ---------- Submit ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var email = form.EMAIL.value.trim();
    var fname = form.FNAME.value.trim();
    var lname = form.LNAME.value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Please enter a valid email address.', form.EMAIL);
    if (email2.value.trim().toLowerCase() !== email.toLowerCase()) return fail('The email addresses don\'t match.', email2);
    if (!fname) return fail('Please enter your first name.', form.FNAME);
    if (!lname) return fail('Please enter your last name.', form.LNAME);
    if (!permission.checked) return fail('Please check the box to join the email list.', permission);
    if (codeInput.value.trim().toUpperCase() !== code) {
      newCode();
      return fail('That code didn\'t match. Here\'s a new one.', codeInput);
    }

    form.EMAIL.value = email;
    form.FNAME.value = fname;
    form.LNAME.value = lname;

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
      newCode();
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
