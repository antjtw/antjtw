/* =========================================================
   Ant White v2: behaviour
   Shared chrome, motion, and renderers for data.js content.
   No dependencies, no build step.
   ========================================================= */
(function () {
  'use strict';

  var AW = window.AW || {};
  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  root.classList.remove('no-js');

  function el(html) {
    var t = doc.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function store(kind, key, val) {
    try {
      var s = window[kind];
      if (val === undefined) return s.getItem(key);
      s.setItem(key, val);
    } catch (e) { return null; }
  }

  /* ---------------------------------------------------------
     Chrome: atmosphere, cursor, nav, footer
  --------------------------------------------------------- */
  var NAV = [
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'main-quests.html', label: 'Main quests', key: 'main' },
    { href: 'side-quests.html', label: 'Side quests', key: 'side' },
    { href: 'inventory.html', label: 'Inventory', key: 'inventory' },
    { href: 'character.html', label: 'Character', key: 'character' }
  ];
  var page = doc.body.dataset.page || 'home';

  doc.body.prepend(el(
    '<div class="atmos" aria-hidden="true">' +
      '<div class="atmos__blob atmos__blob--a"></div>' +
      '<div class="atmos__blob atmos__blob--b"></div>' +
      '<div class="atmos__blob atmos__blob--c"></div>' +
      '<div class="atmos__grid"></div>' +
      '<div class="atmos__grain"></div>' +
    '</div>'
  ));

  var navSlot = doc.querySelector('[data-nav]');
  if (navSlot) {
    navSlot.outerHTML =
      '<header class="nav" id="nav">' +
        '<div class="wrap nav__inner">' +
          '<a class="brand" href="index.html" aria-label="Ant White, home"><span class="brand__mark">AW</span>Ant White</a>' +
          '<nav aria-label="Primary"><ul class="nav__links" id="nav-links">' +
            NAV.map(function (n) {
              return '<li><a href="' + n.href + '"' + (n.key === page ? ' aria-current="page"' : '') + '>' + n.label + '</a></li>';
            }).join('') +
          '</ul></nav>' +
          '<a class="btn nav__cta" href="character.html#contact">Start a quest <span class="btn__arrow" aria-hidden="true">→</span></a>' +
          '<button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Menu"><span></span><span></span><span></span></button>' +
        '</div>' +
      '</header>';
  }

  var footSlot = doc.querySelector('[data-footer]');
  if (footSlot) {
    footSlot.outerHTML =
      '<footer class="footer"><div class="wrap footer__inner">' +
        '<span>© Anthony White, until the heat death of the universe</span>' +
        '<ul>' +
          '<li><a href="mailto:anthony@antjtw.com">Email</a></li>' +
          '<li><a href="https://www.linkedin.com/in/ant-white/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>' +
          '<li><a href="../ai-policy.html">AI use policy</a></li>' +
        '</ul>' +
      '</div></footer>';
  }

  var nav = doc.getElementById('nav');
  if (nav) {
    var toggle = nav.querySelector('.nav__toggle');
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 12); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Cursor glow: lerped so it trails like light, not a sticker */
  if (finePointer) {
    var glow = el('<div class="cursor-glow" aria-hidden="true"></div>');
    var dot = el('<div class="cursor-dot" aria-hidden="true"></div>');
    doc.body.append(glow, dot);
    var tx = innerWidth / 2, ty = innerHeight / 3, gx = tx, gy = ty;
    addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
      glow.classList.add('is-on'); dot.classList.add('is-on');
    }, { passive: true });
    doc.addEventListener('pointerleave', function () { glow.classList.remove('is-on'); dot.classList.remove('is-on'); });
    doc.addEventListener('pointerover', function (e) {
      var hot = e.target.closest && e.target.closest('a, button, .glow-card, label');
      glow.classList.toggle('is-hot', !!hot);
      dot.style.scale = hot ? '2.2' : '1';
    });
    (function loop() {
      var k = reduceMotion ? 1 : 0.12;
      gx += (tx - gx) * k; gy += (ty - gy) * k;
      glow.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------------------------------------------------------
     Loader: once per session
  --------------------------------------------------------- */
  var loader = doc.querySelector('.loader');
  if (loader) {
    if (store('sessionStorage', 'aw_booted') || reduceMotion) {
      loader.remove();
    } else {
      var fill = loader.querySelector('.loader__fill');
      var pct = loader.querySelector('.loader__pct');
      var log = loader.querySelector('.loader__log');
      var lines = ['Loading save file', 'Restoring inventory', 'Polishing glows', 'Ready, player two'];
      var p = 0;
      var tick = setInterval(function () {
        p = Math.min(100, p + Math.random() * 18 + 6);
        fill.style.width = p + '%';
        pct.textContent = String(Math.round(p)).padStart(3, '0') + '%';
        log.textContent = lines[Math.min(lines.length - 1, Math.floor(p / 26))];
        if (p >= 100) {
          clearInterval(tick);
          store('sessionStorage', 'aw_booted', '1');
          setTimeout(function () { loader.classList.add('is-done'); setTimeout(function () { loader.remove(); }, 800); }, 280);
        }
      }, 110);
    }
  }

  /* ---------------------------------------------------------
     Hero rotator
  --------------------------------------------------------- */
  var rot = doc.querySelector('[data-rotator]');
  if (rot && AW.roles) {
    rot.innerHTML = AW.roles.map(function (r, i) {
      return '<span class="rotator__word' + (i === 0 ? ' is-in' : '') + '"' + (i ? ' aria-hidden="true"' : '') + '><span class="grad-text">' + esc(r) + '</span></span>';
    }).join('');
    var words = rot.children, idx = 0;
    if (!reduceMotion) {
      setInterval(function () {
        var cur = words[idx];
        idx = (idx + 1) % words.length;
        var nxt = words[idx];
        cur.classList.remove('is-in'); cur.classList.add('is-out'); cur.setAttribute('aria-hidden', 'true');
        nxt.classList.remove('is-out'); nxt.classList.add('is-in'); nxt.removeAttribute('aria-hidden');
        setTimeout(function () { cur.classList.remove('is-out'); }, 900);
      }, 2400);
    }
  }

  /* ---------------------------------------------------------
     Renderers
  --------------------------------------------------------- */
  var STATUS = { active: 'In progress', complete: 'Complete', drafting: 'Drafting' };

  function questCard(q, i) {
    var glyph = q.org.replace(/[^A-Za-z]/g, '').slice(0, 2);
    var ext = q.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return (
      '<a class="quest glow-card reveal" href="' + esc(q.href) + '"' + ext +
        ' data-type="' + q.type + '" data-tilt style="--hue:' + (q.hue || 210) + ';--i:' + (i % 6) + '">' +
        '<div class="quest__art" aria-hidden="true">' +
          (q.img ? '<img src="' + esc(q.img) + '" alt="" loading="lazy">' : '') +
          '<span class="quest__ring"></span>' +
          '<span class="quest__glyph">' + esc(glyph) + '</span>' +
          '<span class="quest__status quest__status--' + q.status + '"><span class="pulse"></span>' + STATUS[q.status] + '</span>' +
        '</div>' +
        '<div class="quest__body">' +
          '<div class="quest__meta"><span class="type' + (q.type === 'side' ? ' type--side' : '') + '">' +
            (q.type === 'side' ? 'Side quest' : 'Main quest') + ' · ' + esc(q.org) + '</span><span>' + esc(q.year) + '</span></div>' +
          '<h3 class="quest__title">' + esc(q.title) + '</h3>' +
          '<p class="quest__loot">' + esc(q.loot) + '</p>' +
          '<div class="quest__tags">' + q.tags.map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('') + '</div>' +
        '</div>' +
        '<span class="quest__go" aria-hidden="true">' + (q.external ? '↗' : '→') + '</span>' +
      '</a>'
    );
  }

  doc.querySelectorAll('[data-quests]').forEach(function (host) {
    var mode = host.dataset.quests; // featured | main | side
    var list = (AW.quests || []).filter(function (q) {
      return mode === 'featured' ? q.featured : q.type === mode;
    });
    if (mode === 'featured') {
      // Interleave main and side so the mix is obvious
      var m = list.filter(function (q) { return q.type === 'main'; });
      var s = list.filter(function (q) { return q.type === 'side'; });
      list = [];
      while (m.length || s.length) { if (m.length) list.push(m.shift()); if (m.length) list.push(m.shift()); if (s.length) list.push(s.shift()); }
    }
    host.innerHTML = list.map(questCard).join('');
  });

  /* Status filter on quest list pages */
  doc.querySelectorAll('[data-filter-for]').forEach(function (tabs) {
    var host = doc.getElementById(tabs.dataset.filterFor);
    tabs.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      tabs.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var f = b.dataset.filter;
      var type = host.dataset.quests;
      host.querySelectorAll('.quest').forEach(function (card, i) {
        var q = (AW.quests || []).filter(function (x) { return x.type === type; })[i];
        card.classList.toggle('is-hidden', f !== 'all' && q.status !== f);
      });
    });
  });

  var invHost = doc.querySelector('[data-inventory]');
  if (invHost && AW.inventory) {
    var ICON = { Writing: '✎', Speaking: '◉', Teaching: '✦', Course: '◈' };
    var limit = parseInt(invHost.dataset.inventory, 10) || AW.inventory.length;
    invHost.innerHTML = AW.inventory.slice(0, limit).map(function (it, i) {
      var tag = it.href ? 'a' : 'div';
      return '<' + tag + (it.href ? ' href="' + esc(it.href) + '"' : '') +
        ' class="slot glow-card reveal' + (it.unlocked ? '' : ' slot--locked') + '" style="--i:' + i + '">' +
        '<div class="slot__kind"><span>' + esc(it.kind) + '</span><span>' + (it.unlocked ? '' : '🔒 Locked') + '</span></div>' +
        '<span class="slot__icon" aria-hidden="true">' + (ICON[it.kind] || '◆') + '</span>' +
        '<h3 class="slot__title">' + esc(it.title) + '</h3>' +
        '<span class="slot__meta">' + esc(it.meta) + '</span>' +
      '</' + tag + '>';
    }).join('');
  }

  var marquee = doc.querySelector('[data-marquee]');
  if (marquee && AW.clients) {
    var items = AW.clients.map(function (c) { return '<span class="marquee__item">' + esc(c) + '</span>'; }).join('');
    marquee.innerHTML = '<div class="marquee__track">' + items + '<span aria-hidden="true" style="display:contents">' + items + '</span></div>';
  }

  var statsHost = doc.querySelector('[data-stats]');
  if (statsHost && AW.stats) {
    statsHost.innerHTML = AW.stats.map(function (s) {
      return '<li class="stat"><span>' + esc(s.name) + '</span>' +
        '<span class="stat__bar"><span class="stat__fill" style="--w:' + s.value + '%"></span></span>' +
        '<span class="stat__val">' + s.value + '</span></li>';
    }).join('');
  }

  var xpHost = doc.querySelector('[data-xp]');
  if (xpHost) {
    var years = new Date().getFullYear() - 2014;
    xpHost.innerHTML =
      '<div class="xp__row"><span>LVL ' + years + ' · Design leader</span><span>' + years + ' yrs XP</span></div>' +
      '<div class="xp__bar"><span class="xp__fill" style="display:block;--w:78%"></span></div>';
  }

  var cvHost = doc.querySelector('[data-cv]');
  if (cvHost && AW.cv) {
    cvHost.innerHTML = AW.cv.map(function (r, i) {
      var yrs = r.from + ' – ' + (r.to ? r.to : 'Now');
      return '<li><details class="tl' + (r.to ? '' : ' tl--current') + '" data-tags="' + esc(r.tags.join('|')) + '"' + (i === 0 ? ' open' : '') + '>' +
        '<summary class="glow-card" style="border-color:transparent;background:transparent">' +
          '<span class="tl__org">' + esc(r.org) + '</span><span class="tl__years">' + yrs + '</span>' +
          '<span class="tl__role">' + esc(r.role) + (r.via ? ' · via ' + esc(r.via) : '') + '</span>' +
        '</summary>' +
        (r.notes.length ? '<ul class="tl__notes">' + r.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' : '') +
      '</details></li>';
    }).join('');

    var cvTabs = doc.querySelector('[data-cv-filter]');
    if (cvTabs) {
      cvTabs.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        cvTabs.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        var f = b.dataset.filter;
        cvHost.querySelectorAll('.tl').forEach(function (d) {
          d.parentElement.style.display = (f === 'all' || d.dataset.tags.split('|').indexOf(f) > -1) ? '' : 'none';
        });
      });
    }
  }

  /* Contact form: no backend yet, so compose an email */
  var form = doc.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var subject = '[' + (d.get('kind') || 'Quest') + '] from ' + (d.get('name') || 'a traveller');
      var body = (d.get('message') || '') + '\n\n' + (d.get('name') || '') + (d.get('email') ? ' · ' + d.get('email') : '');
      window.location.href = 'mailto:anthony@antjtw.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  /* ---------------------------------------------------------
     Pointer spotlight + subtle tilt on glow cards
  --------------------------------------------------------- */
  if (finePointer) {
    doc.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest('.glow-card');
      if (!card) return;
      var r = card.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
      if (!reduceMotion && card.hasAttribute('data-tilt')) {
        var rx = ((y / r.height) - 0.5) * -5, ry = ((x / r.width) - 0.5) * 6;
        card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-4px)';
      }
    }, { passive: true });
    doc.addEventListener('pointerout', function (e) {
      var card = e.target.closest && e.target.closest('[data-tilt]');
      if (card && !card.contains(e.relatedTarget)) card.style.transform = '';
    });
  }

  /* ---------------------------------------------------------
     Reveal on scroll
  --------------------------------------------------------- */
  var revealables = doc.querySelectorAll('.reveal, [data-stats], [data-xp]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (n) { io.observe(n); });
  } else {
    revealables.forEach(function (n) { n.classList.add('is-visible'); });
  }
})();
