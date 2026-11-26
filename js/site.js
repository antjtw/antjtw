/* =========================================================
   Ant White v2: behaviour
   Shared chrome, the hero rotator and glow orb, quest
   renderers, and motion (GSAP + ScrollTrigger + Lenis, after the
   Big Brain Playlist). Everything still works without them.
   ========================================================= */
(function () {
  'use strict';

  var AW = window.AW || {};
  var doc = document;
  var root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var motion = !!(window.gsap && window.ScrollTrigger) && !reduced;
  if (!motion) root.classList.add('no-motion');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function hash(str) { var h = 0; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0; return Math.abs(h); }

  /* ---------------------------------------------------------
     Password gate
     A soft gate, not real security: the site is static, so a
     determined visitor can get past it. It keeps casual visitors
     out of NDA work. The unlock is stored as 'aw_auth' (session, or
     30 days with "remember me") and covers every page.
     To change the password, put the SHA-256 of the new one below:
       printf '%s' 'new-password' | sha256sum
  --------------------------------------------------------- */
  var PASSWORD_HASH = '25fc1c8583383173ed7d6267b24f98171d5072ca3c86939ff04a7baec4f9ea86';
  if (root.classList.contains('is-locked')) {
    doc.body.insertAdjacentHTML('afterbegin',
      '<div class="gate band--dark" role="dialog" aria-modal="true" aria-labelledby="gate-title">' +
        '<div class="gate__card">' +
          '<div class="gate__brand">Ant White</div>' +
          '<span class="eyebrow">Portfolio</span>' +
          '<h1 id="gate-title">This portfolio is password-protected</h1>' +
          '<p>Some of the work in here is under NDA, so I hand the password out personally. If you have it, type away. If not, ask and I’ll sort you out.</p>' +
          '<form id="gate-form" autocomplete="off" novalidate>' +
            '<div><label for="gate-pw">Password</label><input type="password" id="gate-pw" autocomplete="current-password" required></div>' +
            '<label class="gate__remember"><input type="checkbox" id="gate-remember"> Remember me on this device for 30 days</label>' +
            '<p class="gate__error" id="gate-error" role="alert"></p>' +
            '<div class="gate__actions">' +
              '<button class="btn" type="submit">View the work <span class="btn__arrow" aria-hidden="true">→</span></button>' +
              '<a class="btn btn--ghost" href="mailto:anthony@antjtw.com?subject=Password%20request&body=Hi%20Ant%2C%0A%0AI%27ve%20landed%20on%20your%20portfolio%20and%20it%27s%20locked.%20Could%20I%20have%20the%20password%3F%0A%0A">Request access</a>' +
            '</div>' +
          '</form>' +
        '</div>' +
      '</div>');
    var gate = $('.gate'), pw = $('#gate-pw'), err = $('#gate-error');
    setTimeout(function () { pw.focus(); }, 50);
    pw.addEventListener('input', function () { err.textContent = ''; });
    $('#gate-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var attempt = pw.value.trim();
      if (!attempt) return;
      if (!(window.crypto && crypto.subtle)) { err.textContent = 'This browser can’t check the password. Try another, or request access.'; return; }
      crypto.subtle.digest('SHA-256', new TextEncoder().encode(attempt)).then(function (buf) {
        var hex = Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
        if (hex !== PASSWORD_HASH) {
          err.textContent = 'That’s not the password. Try again, or request access.';
          pw.value = ''; pw.focus();
          gate.classList.remove('is-wrong'); void gate.offsetWidth; gate.classList.add('is-wrong');
          return;
        }
        var saved = true;
        try {
          if ($('#gate-remember').checked) localStorage.setItem('aw_auth', JSON.stringify({ value: 'unlocked', expires: Date.now() + 30 * 864e5 }));
          else sessionStorage.setItem('aw_auth', 'unlocked');
        } catch (x) { saved = false; }
        if (saved) { location.reload(); return; }
        /* Storage blocked: unlock this page view only */
        root.classList.remove('is-locked');
        gate.remove();
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      });
    });
  }

  /* ---------------------------------------------------------
     Pause control (WCAG 2.2.2)
  --------------------------------------------------------- */
  var paused = reduced;
  if (paused) root.classList.add('motion-paused');
  doc.addEventListener('click', function (e) {
    if (!e.target.closest('[data-pause]')) return;
    paused = !paused;
    root.classList.toggle('motion-paused', paused);
    $$('[data-pause]').forEach(function (b) { b.textContent = paused ? 'Play animation' : 'Pause animation'; b.setAttribute('aria-pressed', paused ? 'true' : 'false'); });
  });

  /* ---------------------------------------------------------
     Chrome: nav, footer, cursor, band glows
  --------------------------------------------------------- */
  var NAV = [
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'main-quests.html', label: 'Main quests', key: 'main' },
    { href: 'side-quests.html', label: 'Side quests', key: 'side' },
    { href: 'writing.html', label: 'Writing & speaking', key: 'writing' },
    { href: 'cv.html', label: 'CV', key: 'cv' },
    { href: 'contact.html', label: 'Contact', key: 'contact' }
  ];
  var page = doc.body.dataset.page || 'home';
  /* Pages in sub-folders (case-studies/) set data-base="../" so shared links still resolve */
  var base = doc.body.dataset.base || '';
  function rebase(markup) { return base ? markup.replace(/href="(?!https?:|mailto:|#|\/|\.\.\/)([^"]+)"/g, 'href="' + base + '$1"') : markup; }

  var navSlot = $('[data-nav]');
  if (navSlot) {
    navSlot.outerHTML = rebase(
      '<header class="nav" id="nav"><div class="wrap nav__inner">' +
        '<a class="brand" href="index.html">Ant White</a>' +
        '<nav aria-label="Primary"><ul class="nav__links" id="nav-links">' +
          NAV.map(function (n) { return '<li><a href="' + n.href + '"' + (n.key === page ? ' aria-current="page"' : '') + '>' + n.label + '</a></li>'; }).join('') +
        '</ul></nav>' +
        '<button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Menu"><span></span><span></span><span></span></button>' +
      '</div><div class="nav__line" aria-hidden="true"><i></i></div></header>');
    var nav = $('#nav'), toggle = $('.nav__toggle', nav);
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var footSlot = $('[data-footer]');
  if (footSlot) {
    footSlot.outerHTML = rebase(
      '<footer class="footer"><div class="wrap">' +
        '<div class="footer__grid">' +
          '<div><h2>Connect</h2><ul><li><a href="contact.html">Contact</a></li><li><a href="mailto:anthony@antjtw.com">Email</a></li><li><a href="https://www.linkedin.com/in/ant-white/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li></ul></div>' +
          '<div><h2>MTFBWY RPG</h2><ul><li><a href="https://mtfbwyrpg.notion.site/MTFBWY-RPG-e2086dad2790400f9521b18cd290d560?pvs=74" target="_blank" rel="noopener noreferrer">Rules document</a></li><li><a href="https://www.dropbox.com/scl/fo/smrpjontdi1ailt3sifc6/AMRZWCiEb0KNca52zF565Hw?rlkey=e0vdqkxyhn9a1ygi3d6cv8axc&st=7zokoqy9&dl=0" target="_blank" rel="noopener noreferrer">Resources</a></li></ul></div>' +
          '<div><h2>Other</h2><ul><li><a href="cv.html">Digital CV</a></li><li><a href="https://www.dropbox.com/scl/fo/w5xttt4el73fbboominl1/ABk4T1YDUi1UFG9Na6wEmdE?rlkey=yfwq3czfpr02k86s7jlfpru8g&st=uv745q1f&dl=0" target="_blank" rel="noopener noreferrer">Printable CV</a></li><li><a href="ai-policy.html">AI use policy</a></li></ul></div>' +
        '</div>' +
        '<p class="footer__copy">© Anthony White, until the heat death of the universe</p>' +
      '</div></footer>');
  }

  $$('.band--dark').forEach(function (band) {
    var a = doc.createElement('div');
    a.className = 'aurora';
    a.setAttribute('aria-hidden', 'true');
    a.innerHTML = '<span></span><span></span><span></span><span></span>';
    band.prepend(a);
  });

  if (fine) {
    doc.body.insertAdjacentHTML('beforeend', '<div class="cursor" aria-hidden="true"><i></i></div>');
    var cur = $('.cursor'), mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      var band = e.target.closest && e.target.closest('.band--dark');
      if (band) { var r = band.getBoundingClientRect(); band.style.setProperty('--gx', (mx - r.left) + 'px'); band.style.setProperty('--gy', (my - r.top) + 'px'); }
      var card = e.target.closest && e.target.closest('.glow-card');
      if (card) { var c = card.getBoundingClientRect(); card.style.setProperty('--mx', (mx - c.left) + 'px'); card.style.setProperty('--my', (my - c.top) + 'px'); }
    }, { passive: true });
    (function follow() { cx += (mx - cx) * .22; cy += (my - cy) * .22; cur.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)'; requestAnimationFrame(follow); })();
    doc.addEventListener('pointerover', function (e) { cur.classList.toggle('is-big', !!(e.target.closest && e.target.closest('a, button, summary, label, input, textarea'))); });
  }

  /* ---------------------------------------------------------
     Hero: rotating word
  --------------------------------------------------------- */
  var rot = $('[data-rotator]');
  if (rot && AW.hero) {
    rot.innerHTML = AW.hero.map(function (h, i) { return '<span class="rotator__word' + (i === 0 ? ' is-in' : '') + '"' + (i ? ' aria-hidden="true"' : '') + '><span>' + esc(h.word) + '.</span></span>'; }).join('');
    var idx = 0;
    setInterval(function () {
      if (paused) return;
      var words = rot.children, cur = words[idx];
      cur.classList.remove('is-in'); cur.classList.add('is-out'); cur.setAttribute('aria-hidden', 'true');
      setTimeout(function () { cur.classList.remove('is-out'); }, 800);
      idx = (idx + 1) % AW.hero.length;
      words[idx].classList.add('is-in'); words[idx].removeAttribute('aria-hidden');
    }, 3200);
  }

  /* Orb drifts gently towards the pointer */
  var orb = $('[data-orb]');
  if (orb && fine && !reduced) addEventListener('pointermove', function (e) {
    var r = orb.getBoundingClientRect();
    if (r.bottom < 0) return;
    var dx = (e.clientX - (r.left + r.width / 2)) / innerWidth, dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
    orb.style.setProperty('--ox', (dx * 60).toFixed(1) + 'px');
    orb.style.setProperty('--oy', (dy * 60).toFixed(1) + 'px');
  }, { passive: true });

  /* Split the hero name into letters for the intro */
  $$('[data-split]').forEach(function (el) {
    el.setAttribute('aria-label', el.textContent);
    el.innerHTML = '<span class="split-mask" aria-hidden="true">' + Array.from(el.textContent).map(function (ch) { return '<span class="ch">' + (ch === ' ' ? '&nbsp;' : esc(ch)) + '</span>'; }).join('') + '</span>';
  });

  /* Logo strip */
  var marquee = $('[data-marquee]');
  if (marquee && AW.clients) {
    var items = AW.clients.map(function (c) { return '<span class="marquee__item">' + esc(c) + '</span>'; }).join('');
    marquee.innerHTML = '<div class="marquee__track">' + items + items.replace(/class="marquee__item"/g, 'class="marquee__item" aria-hidden="true"') + '</div>';
  }

  /* Scroll-lit statement */
  var statement = $('[data-statement]');
  if (statement) {
    (function wrap(node) {
      Array.from(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = doc.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(doc.createTextNode(part)); return; }
            var s = doc.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) { wrap(n); }
      });
    })(statement);
    var ws = $$('.w', statement);
    var light = function () {
      var r = statement.getBoundingClientRect();
      var prog = reduced ? 1 : Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height + innerHeight * .35)));
      var n = Math.round(prog * ws.length);
      ws.forEach(function (w, i) { w.classList.toggle('is-lit', i < n); });
    };
    addEventListener('scroll', light, { passive: true });
    light();
  }

  /* ---------------------------------------------------------
     Quests
  --------------------------------------------------------- */
  var STATUS = { active: 'In progress', complete: 'Complete', drafting: 'Being written' };
  function tags(list) { return list.map(function (t) { return '<span class="tag" data-t="' + (hash(t) % 5) + '">' + esc(t) + '</span>'; }).join(''); }
  function art(h, cls) { return '<div class="' + cls + '" aria-hidden="true" style="--c1:hsl(' + h + ',85%,42%);--c2:hsl(' + (h - 25) + ',95%,62%);--c3:hsl(' + (h + 35) + ',80%,62%)"><i></i><i></i><i></i>'; }
  function linkAttrs(q) { return q.href ? ' href="' + esc(q.href) + '"' + (q.external ? ' target="_blank" rel="noopener noreferrer"' : '') : ''; }

  function questCard(q) {
    var tag = q.href ? 'a' : 'div';
    return '<' + tag + ' class="quest glow-card" data-reveal data-status="' + q.status + '"' + linkAttrs(q) + '>' +
      art(q.hue, 'quest__art') + '<span class="quest__status quest__status--' + q.status + '"><span class="pulse"></span>' + STATUS[q.status] + '</span></div>' +
      '<div class="quest__body">' + (q.href ? '<span class="quest__go" aria-hidden="true">' + (q.external ? '↗' : '→') + '</span>' : '') +
        '<span class="quest__sector">' + esc(q.sector) + '</span>' +
        '<h3 class="quest__title">' + esc(q.title) + '</h3>' +
        '<p class="quest__summary">' + esc(q.summary) + '</p>' +
        '<p class="quest__impact">' + esc(q.impact) + '</p>' +
        '<div class="quest__tags">' + tags(q.tags) + '</div>' +
      '</div></' + tag + '>';
  }
  function sideRow(q) {
    var tag = q.href ? 'a' : 'div';
    return '<' + tag + ' class="side glow-card" data-reveal data-status="' + q.status + '"' + linkAttrs(q) + '>' +
      art(q.hue, 'side__art') + '</div>' +
      '<div><span class="side__sector">' + esc(q.sector) + ' · ' + esc(q.year) + '</span><h3 class="side__title">' + esc(q.title) + '</h3><p class="side__summary">' + esc(q.summary) + '</p></div>' +
      '<div class="side__tags">' + tags(q.tags) + '</div></' + tag + '>';
  }

  $$('[data-quests]').forEach(function (host) {
    var spec = host.dataset.quests.split(':'), type = spec[0], featured = spec[1] === 'featured';
    var list = (AW.quests || []).filter(function (q) { return q.type === type && (!featured || q.featured); });
    host.innerHTML = list.map(host.dataset.style === 'rows' ? sideRow : questCard).join('');
  });

  $$('[data-filter-for]').forEach(function (tabs) {
    var host = doc.getElementById(tabs.dataset.filterFor);
    tabs.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', tabs).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $$('[data-status]', host).forEach(function (card) { card.hidden = b.dataset.filter !== 'all' && card.dataset.status !== b.dataset.filter; });
      if (motion) ScrollTrigger.refresh();
    });
  });

  /* Writing & speaking */
  var wHost = $('[data-writing]');
  if (wHost && AW.writing) {
    var limit = parseInt(wHost.dataset.writing, 10) || AW.writing.length;
    wHost.innerHTML = AW.writing.slice(0, limit).map(function (w) {
      var tag = w.href ? 'a' : 'div';
      return '<li data-reveal><' + tag + ' class="wrow' + (w.soon ? ' wrow--soon' : '') + '"' + (w.href ? ' href="' + esc(w.href) + '"' : '') + '>' +
        '<span class="wrow__kind">' + esc(w.kind) + '</span><span class="wrow__title">' + esc(w.title) + '</span>' +
        '<span class="wrow__meta">' + esc(w.meta) + (w.year ? ' · ' + esc(w.year) : '') + '</span><span class="wrow__go" aria-hidden="true">' + (w.href ? '→' : '') + '</span></' + tag + '></li>';
    }).join('');
  }

  /* CV: Accenture holds its client roles; filter works on both levels */
  function cvItem(r, open, child) {
    var yrs = r.from + ' – ' + (r.to || 'Present');
    var kids = r.clients && r.clients.length
      ? '<ol class="tl__clients">' + r.clients.map(function (c) { return cvItem(c, false, true); }).join('') + '</ol>' : '';
    return '<li data-tags="' + esc(r.tags.join('|')) + '"' + (child ? '' : ' data-reveal') + '><details class="tl' + (r.to ? '' : ' tl--current') + (child ? ' tl--client' : '') + '"' + (open ? ' open' : '') + '>' +
      '<summary><span class="tl__org">' + esc(r.org) + '</span><span class="tl__years">' + esc(yrs) + '</span><span class="tl__role">' + esc(r.role) + '</span></summary>' +
      (r.notes.length ? '<ul class="tl__notes">' + r.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' : '') +
      kids + '</details></li>';
  }
  var cvHost = $('[data-cv]');
  if (cvHost && AW.cv) {
    cvHost.innerHTML = AW.cv.map(function (r, i) { return cvItem(r, i === 0, false); }).join('');
    var cvTabs = $('[data-cv-filter]');
    if (cvTabs) cvTabs.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var f = b.dataset.filter;
      $$('button', cvTabs).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $$('li[data-tags]', cvHost).forEach(function (li) { li.hidden = !(f === 'all' || li.dataset.tags.split('|').indexOf(f) > -1); });
      if (f !== 'all') $$('.tl', cvHost).forEach(function (d) { if (d.querySelector('.tl__clients li:not([hidden])')) d.open = true; });
      if (motion) ScrollTrigger.refresh();
    });
  }
  $$('[data-entries]').forEach(function (host) {
    var list = AW[host.dataset.entries] || [];
    host.innerHTML = list.map(function (e) {
      return '<article class="entry" data-reveal><h3 class="entry__org">' + esc(e.org) + '</h3>' +
        (e.detail ? '<p class="entry__detail">' + esc(e.detail) + '</p>' : '') +
        (e.prose ? e.notes.map(function (n) { return '<p class="entry__prose">' + esc(n) + '</p>'; }).join('')
                 : (e.notes.length ? '<ul class="entry__notes">' + e.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' : '')) +
        '</article>';
    }).join('');
  });
  var pills = $('[data-proficiencies]');
  if (pills && AW.proficiencies) pills.innerHTML = AW.proficiencies.map(function (t) { return '<li class="tag" data-t="' + (hash(t) % 5) + '">' + esc(t) + '</li>'; }).join('');

  /* Contact: compose an email (no backend yet) */
  var form = $('#contact-form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var subject = '[' + (d.get('kind') || 'Hello') + '] from ' + (d.get('name') || 'someone');
    var body = (d.get('message') || '') + '\n\n' + (d.get('name') || '') + (d.get('email') ? ' · ' + d.get('email') : '');
    location.href = 'mailto:anthony@antjtw.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });

  /* ---------------------------------------------------------
     Motion
  --------------------------------------------------------- */
  var navLine = $('.nav__line i');
  if (!motion) {
    if (navLine) navLine.style.setProperty('--p', 1);
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis) {
    var lenis = new Lenis({ lerp: .1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  if (navLine) {
    navLine.style.setProperty('--p', 0);
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function (s) { navLine.style.setProperty('--p', s.progress.toFixed(4)); } });
  }

  var tl = gsap.timeline({ delay: .15 });
  if ($('.hero__name .ch')) tl.from('.hero__name .ch', { yPercent: 110, rotate: 6, duration: 1.1, ease: 'expo.out', stagger: .04 });
  if ($('.page-head__title')) tl.from('.page-head__title', { yPercent: 40, opacity: 0, skewY: 3, duration: 1.1, ease: 'expo.out' });
  tl.from('.hero .eyebrow, .hero__line, .hero [data-pause], .hero__lede, .hero__actions, .page-head .eyebrow, .page-head__lede', { opacity: 0, y: 24, duration: 1, ease: 'expo.out', stagger: .07 }, '<.15');
  if (orb) tl.from(orb, { opacity: 0, scale: .6, duration: 1.8, ease: 'expo.out' }, '<');

  $$('.section__title, .cta__title').forEach(function (t) { gsap.from(t, { yPercent: 40, opacity: 0, skewY: 3, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 88%' } }); });
  $$('.section .eyebrow, .section__sub').forEach(function (t) { gsap.from(t, { y: 18, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 92%' } }); });
  ScrollTrigger.batch('[data-reveal]', { start: 'top 92%', onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .08, overwrite: true }); } });
})();
