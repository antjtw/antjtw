/* =========================================================
   Ant White v2: behaviour
   Shared chrome, the hero rotator and diagram panel, quest
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

  var navSlot = $('[data-nav]');
  if (navSlot) {
    navSlot.outerHTML =
      '<header class="nav" id="nav"><div class="wrap nav__inner">' +
        '<a class="brand" href="index.html">Ant White</a>' +
        '<nav aria-label="Primary"><ul class="nav__links" id="nav-links">' +
          NAV.map(function (n) { return '<li><a href="' + n.href + '"' + (n.key === page ? ' aria-current="page"' : '') + '>' + n.label + '</a></li>'; }).join('') +
        '</ul></nav>' +
        '<button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Menu"><span></span><span></span><span></span></button>' +
      '</div><div class="nav__line" aria-hidden="true"><i></i></div></header>';
    var nav = $('#nav'), toggle = $('.nav__toggle', nav);
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var footSlot = $('[data-footer]');
  if (footSlot) {
    footSlot.outerHTML =
      '<footer class="footer"><div class="wrap">' +
        '<div class="footer__grid">' +
          '<div><h2>Connect</h2><ul><li><a href="contact.html">Contact</a></li><li><a href="mailto:anthony@antjtw.com">Email</a></li><li><a href="https://www.linkedin.com/in/ant-white/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li></ul></div>' +
          '<div><h2>MTFBWY RPG</h2><ul><li><a href="https://mtfbwyrpg.notion.site/MTFBWY-RPG-e2086dad2790400f9521b18cd290d560?pvs=74" target="_blank" rel="noopener noreferrer">Rules document</a></li><li><a href="https://www.dropbox.com/scl/fo/smrpjontdi1ailt3sifc6/AMRZWCiEb0KNca52zF565Hw?rlkey=e0vdqkxyhn9a1ygi3d6cv8axc&st=7zokoqy9&dl=0" target="_blank" rel="noopener noreferrer">Resources</a></li></ul></div>' +
          '<div><h2>Other</h2><ul><li><a href="cv.html">Digital CV</a></li><li><a href="https://www.dropbox.com/scl/fo/w5xttt4el73fbboominl1/ABk4T1YDUi1UFG9Na6wEmdE?rlkey=yfwq3czfpr02k86s7jlfpru8g&st=uv745q1f&dl=0" target="_blank" rel="noopener noreferrer">Printable CV</a></li><li><a href="../ai-policy.html">AI use policy</a></li></ul></div>' +
        '</div>' +
        '<p class="footer__copy">© Anthony White, until the heat death of the universe</p>' +
      '</div></footer>';
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
     Hero: rotating word + matching diagram panel
  --------------------------------------------------------- */
  function B(x, y, w, h, label, hot, d) {
    return '<g class="pop" style="--d:' + (d || 0) + '"><rect class="box' + (hot ? ' box--hot' : '') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/><text class="lbl" x="' + (x + w / 2) + '" y="' + (y + h / 2) + '">' + label + '</text></g>';
  }
  function L(d, flow) { return '<path class="' + (flow ? 'flow' : 'wire') + '" d="' + d + '"/>'; }
  var SCENES = {
    agents: '<rect class="dash" x="4" y="8" width="312" height="252"/><text class="mono" x="14" y="28">PROTOTYPE KIT</text>' +
      B(24, 56, 110, 50, 'User need', false, 0) + B(186, 56, 110, 50, 'Agent', true, 1) + B(105, 176, 110, 50, 'Spec page', false, 2) +
      L('M134 81 H186', true) + L('M241 106 L180 176', true) + L('M105 201 L60 201 L60 106', false) + '<text class="mono" x="70" y="150">HUMAN REVIEW</text>',
    teams: B(115, 14, 90, 46, 'Lead', true, 0) +
      L('M160 60 L40 170', true) + L('M160 60 L100 170', true) + L('M160 60 L160 170', true) + L('M160 60 L220 170', true) + L('M160 60 L280 170', true) +
      B(10, 170, 60, 40, 'UX', false, 1) + B(70, 170, 60, 40, 'UI', false, 2) + B(130, 170, 60, 40, 'Content', false, 3) + B(190, 170, 60, 40, 'Research', false, 4) + B(250, 170, 60, 40, 'Service', false, 5) +
      '<text class="mono" x="10" y="246">FORCE x 5</text>',
    practice: B(10, 200, 66, 40, 'Ad hoc', false, 0) + B(86, 150, 66, 90, 'Rituals', false, 1) + B(162, 100, 66, 140, 'System', false, 2) + B(238, 30, 72, 210, 'Practice', true, 3) +
      L('M43 190 L119 140 L195 90 L274 20', true) + '<text class="mono" x="10" y="30">FROM ZERO</text>',
    systems: '<text class="mono" x="14" y="22">TOKENS</text><text class="mono" x="118" y="22">COMPONENTS</text><text class="mono" x="232" y="22">SCREENS</text>' +
      B(10, 40, 80, 34, 'Colour', false, 0) + B(10, 90, 80, 34, 'Type', false, 1) + B(10, 140, 80, 34, 'Space', false, 2) +
      B(118, 60, 90, 44, 'Button', true, 3) + B(118, 124, 90, 44, 'Card', false, 4) + B(232, 40, 80, 150, 'Screen', false, 5) +
      L('M90 57 L118 82', true) + L('M90 107 L118 146', true) + L('M90 157 L118 146', false) + L('M208 82 L232 100', true) + L('M208 146 L232 130', true),
    rules: '<g class="pop" style="--d:0"><path class="box box--hot" d="M70 30 L120 58 L120 114 L70 142 L20 114 L20 58 Z"/><text class="lbl" x="70" y="86" style="font-family:JetBrains Mono">20</text></g>' +
      B(190, 50, 110, 46, 'Rule', false, 1) + B(190, 150, 110, 46, 'Interface', false, 2) + B(40, 200, 110, 46, 'Player', false, 3) +
      L('M120 80 L190 73', true) + L('M245 96 L245 150', true) + L('M190 173 L150 210', true) + L('M70 200 L70 142', false) + '<text class="mono" x="14" y="268">WEEKLY PLAYTESTS</text>'
  };

  var rot = $('[data-rotator]'), panel = $('[data-panel]');
  if (rot && AW.hero) {
    rot.innerHTML = AW.hero.map(function (h, i) { return '<span class="rotator__word' + (i === 0 ? ' is-in' : '') + '"' + (i ? ' aria-hidden="true"' : '') + '><span>' + esc(h.word) + '.</span></span>'; }).join('');
    if (panel) {
      $('.panel__stage', panel).innerHTML = AW.hero.map(function (h, i) { return '<div class="panel__scene' + (i === 0 ? ' is-in' : '') + '"><svg viewBox="0 0 320 280" role="img" aria-label="' + esc(h.cap) + '">' + SCENES[h.scene] + '</svg></div>'; }).join('');
      $('.panel__dots', panel).innerHTML = AW.hero.map(function (_, i) { return '<i class="' + (i === 0 ? 'is-on' : '') + '"></i>'; }).join('');
      $('[data-panel-tab]', panel).textContent = AW.hero[0].tab;
      $('.panel__cap', panel).textContent = AW.hero[0].cap;
    }
    var idx = 0;
    setInterval(function () {
      if (paused) return;
      var words = rot.children, cur = words[idx];
      cur.classList.remove('is-in'); cur.classList.add('is-out'); cur.setAttribute('aria-hidden', 'true');
      setTimeout(function () { cur.classList.remove('is-out'); }, 800);
      idx = (idx + 1) % AW.hero.length;
      words[idx].classList.add('is-in'); words[idx].removeAttribute('aria-hidden');
      if (panel) {
        $$('.panel__scene', panel).forEach(function (s, i) { s.classList.toggle('is-in', i === idx); });
        $$('.panel__dots i', panel).forEach(function (d, i) { d.classList.toggle('is-on', i === idx); });
        $('[data-panel-tab]', panel).textContent = AW.hero[idx].tab;
        $('.panel__cap', panel).textContent = AW.hero[idx].cap;
      }
    }, 3200);
  }

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

  /* CV */
  var cvHost = $('[data-cv]');
  if (cvHost && AW.cv) {
    cvHost.innerHTML = AW.cv.map(function (r, i) {
      var yrs = r.from === r.to ? String(r.from) : r.from + ' – ' + (r.to || 'Now');
      return '<li data-tags="' + esc(r.tags.join('|')) + '" data-reveal><details class="tl' + (r.to ? '' : ' tl--current') + '"' + (i === 0 ? ' open' : '') + '>' +
        '<summary><span class="tl__org">' + esc(r.org) + '</span><span class="tl__years">' + yrs + '</span><span class="tl__role">' + esc(r.role) + (r.via ? ', via ' + esc(r.via) : '') + '</span></summary>' +
        (r.notes.length ? '<ul class="tl__notes">' + r.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' : '') + '</details></li>';
    }).join('');
    var cvTabs = $('[data-cv-filter]');
    if (cvTabs) cvTabs.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', cvTabs).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $$(':scope > li', cvHost).forEach(function (li) { li.hidden = !(b.dataset.filter === 'all' || li.dataset.tags.split('|').indexOf(b.dataset.filter) > -1); });
      if (motion) ScrollTrigger.refresh();
    });
  }

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
  if ($('.panel')) tl.from('.panel', { opacity: 0, y: 40, scale: .96, duration: 1.2, ease: 'expo.out' }, '<.1');

  $$('.section__title, .cta__title').forEach(function (t) { gsap.from(t, { yPercent: 40, opacity: 0, skewY: 3, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 88%' } }); });
  $$('.section .eyebrow, .section__sub').forEach(function (t) { gsap.from(t, { y: 18, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 92%' } }); });
  ScrollTrigger.batch('[data-reveal]', { start: 'top 92%', onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .08, overwrite: true }); } });
})();
