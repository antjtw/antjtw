/* =========================================================
   Ant White v2: "Modern quest" behaviour
   Motion engine after the Big Brain Playlist (GSAP, ScrollTrigger,
   Lenis), dressed as a game: title screen, compass, quest journal,
   skill constellations, inventory and achievements.
   Works without the libraries too; everything just appears.
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
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var motion = hasGsap && !reduced;
  if (!motion) root.classList.add('no-motion');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function session(key, val) {
    try { if (val === undefined) return sessionStorage.getItem(key); sessionStorage.setItem(key, val); } catch (e) { return null; }
  }
  function roman(n) {
    var m = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']], r = '';
    m.forEach(function (p) { while (n >= p[0]) { r += p[1]; n -= p[0]; } });
    return r;
  }
  var LEVEL = new Date().getFullYear() - 2014;

  /* ---------------------------------------------------------
     Chrome
  --------------------------------------------------------- */
  var NAV = [
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'main-quests.html', label: 'Main quests', key: 'main' },
    { href: 'side-quests.html', label: 'Side quests', key: 'side' },
    { href: 'inventory.html', label: 'Inventory', key: 'inventory' },
    { href: 'character.html', label: 'Character', key: 'character' }
  ];
  var page = doc.body.dataset.page || 'home';

  doc.body.insertAdjacentHTML('afterbegin',
    '<div class="ambient" aria-hidden="true"><div class="blob blob--a"></div><div class="blob blob--b"></div><div class="blob blob--c"></div><div class="spot"></div><canvas class="motes"></canvas><div class="vignette"></div></div>' +
    '<div class="grain" aria-hidden="true"></div>' +
    '<div class="cursor" aria-hidden="true"><i></i><b></b></div>');

  var navSlot = $('[data-nav]');
  if (navSlot) {
    navSlot.outerHTML =
      '<div class="compass-scrim" aria-hidden="true"></div><header class="compass"><div class="compass__bar">' +
        '<a class="compass__brand" href="index.html" aria-label="Ant White, home"><span>AW</span></a>' +
        '<nav class="compass__links" aria-label="Primary">' +
          NAV.map(function (n) { return '<a href="' + n.href + '"' + (n.key === page ? ' aria-current="page"' : '') + '>' + n.label + '</a>'; }).join('') +
        '</nav>' +
        '<span class="compass__ticks" aria-hidden="true"></span>' +
        '<div class="compass__progress" aria-hidden="true"><i></i></div>' +
      '</div></header>';
  }

  var footSlot = $('[data-footer]');
  if (footSlot) {
    footSlot.outerHTML =
      '<footer class="foot">' +
        '<p class="foot__big" aria-hidden="true">To be continued…</p>' +
        '<div class="foot__row caps">' +
          '<span>© Anthony White · Save 01 · LV ' + LEVEL + '</span>' +
          '<ul><li><a href="mailto:anthony@antjtw.com">Email</a></li><li><a href="https://www.linkedin.com/in/ant-white/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li><li><a href="../ai-policy.html">AI policy</a></li></ul>' +
        '</div>' +
      '</footer>';
  }

  /* ---------------------------------------------------------
     Hero runes (generated SVG): rings, ticks, a compass rose
  --------------------------------------------------------- */
  var runeHost = $('[data-runes]');
  if (runeHost) {
    var c = 400, ticks = '', glyphs = '', dots = '';
    for (var i = 0; i < 120; i++) {
      var a = i / 120 * Math.PI * 2, long = i % 10 === 0;
      var r1 = 388, r2 = long ? 366 : 378;
      ticks += '<line x1="' + (c + Math.cos(a) * r1).toFixed(1) + '" y1="' + (c + Math.sin(a) * r1).toFixed(1) + '" x2="' + (c + Math.cos(a) * r2).toFixed(1) + '" y2="' + (c + Math.sin(a) * r2).toFixed(1) + '" stroke="currentColor" stroke-width="' + (long ? 1.4 : .7) + '"/>';
    }
    for (var g = 0; g < 24; g++) {
      var ga = g / 24 * Math.PI * 2, gx = c + Math.cos(ga) * 318, gy = c + Math.sin(ga) * 318, deg = ga * 180 / Math.PI + 90;
      var shape = ['M-5 -6 L5 -6 M0 -6 L0 6', 'M-5 6 L0 -6 L5 6', 'M-5 0 L5 0 M-3 -5 L3 5', 'M0 -6 L5 0 L0 6 L-5 0 Z', 'M-5 -6 L-5 6 L5 6', 'M-4 -6 L4 6 M4 -6 L-4 6'][g % 6];
      glyphs += '<path d="' + shape + '" transform="translate(' + gx.toFixed(1) + ' ' + gy.toFixed(1) + ') rotate(' + deg.toFixed(1) + ')" stroke="currentColor" stroke-width="1.3" fill="none"/>';
    }
    for (var d = 0; d < 8; d++) {
      var da = d / 8 * Math.PI * 2;
      dots += '<rect x="-4" y="-4" width="8" height="8" transform="translate(' + (c + Math.cos(da) * 262).toFixed(1) + ' ' + (c + Math.sin(da) * 262).toFixed(1) + ') rotate(45)" fill="currentColor"/>';
    }
    var rose = '';
    for (var p = 0; p < 8; p++) {
      var pa = p / 8 * Math.PI * 2 - Math.PI / 2, len = p % 2 ? 120 : 200, w = p % 2 ? 10 : 16;
      var tip = [c + Math.cos(pa) * len, c + Math.sin(pa) * len];
      var l = [c + Math.cos(pa - Math.PI / 2) * w, c + Math.sin(pa - Math.PI / 2) * w];
      var rr = [c + Math.cos(pa + Math.PI / 2) * w, c + Math.sin(pa + Math.PI / 2) * w];
      rose += '<path d="M' + l.join(' ') + ' L' + tip.join(' ') + ' L' + rr.join(' ') + '" fill="none" stroke="currentColor" stroke-width="1" opacity="' + (p % 2 ? .5 : .8) + '"/>';
    }
    runeHost.innerHTML =
      '<svg viewBox="0 0 800 800">' +
        '<g class="r-spin"><circle cx="400" cy="400" r="392" fill="none" stroke="currentColor" stroke-width=".8"/>' + ticks + '</g>' +
        '<g class="r-spin-r"><circle cx="400" cy="400" r="340" fill="none" stroke="currentColor" stroke-width=".6" stroke-dasharray="2 8"/>' + glyphs + '<circle cx="400" cy="400" r="296" fill="none" stroke="currentColor" stroke-width=".8"/></g>' +
        '<g class="r-spin-f">' + dots + '<circle cx="400" cy="400" r="262" fill="none" stroke="currentColor" stroke-width=".5" stroke-dasharray="40 14"/></g>' +
        '<g opacity=".32">' + rose + '<circle cx="400" cy="400" r="70" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="400" cy="400" r="6" fill="currentColor"/></g>' +
      '</svg>';
  }

  /* ---------------------------------------------------------
     Split text + epithet rotator
  --------------------------------------------------------- */
  $$('[data-split]').forEach(function (el) {
    var chars = Array.from(el.textContent);
    el.setAttribute('aria-label', el.textContent);
    el.innerHTML = '<span class="split-mask" aria-hidden="true">' + chars.map(function (ch) { return '<span class="ch">' + (ch === ' ' ? '&nbsp;' : esc(ch)) + '</span>'; }).join('') + '</span>';
  });

  var epi = $('[data-epithet]');
  if (epi && AW.titles) {
    epi.innerHTML = AW.titles.map(function (t, i) { return '<span class="' + (i === 0 ? 'is-in' : '') + '"' + (i ? ' aria-hidden="true"' : '') + '>' + esc(t) + '</span>'; }).join('');
    var ei = 0;
    if (!reduced) setInterval(function () {
      var w = epi.children, cur = w[ei];
      cur.classList.remove('is-in'); cur.classList.add('is-out'); cur.setAttribute('aria-hidden', 'true');
      setTimeout(function () { cur.classList.remove('is-out'); }, 900);
      ei = (ei + 1) % w.length;
      w[ei].classList.add('is-in'); w[ei].removeAttribute('aria-hidden');
    }, 2600);
  }

  /* ---------------------------------------------------------
     Realms banner
  --------------------------------------------------------- */
  $$('[data-realms]').forEach(function (el) {
    var words = el.dataset.realms === 'ghost'
      ? ['Main quests', 'side quests', 'Inventory', 'character', 'Skill trees', 'lore']
      : (AW.clients || []);
    var row = words.map(function (w) { return '<span>' + esc(w) + '</span><b>◆</b>'; }).join('');
    el.innerHTML = '<div class="realms__track">' + row + row + row + row + '</div>';
  });

  /* ---------------------------------------------------------
     Quest journal
  --------------------------------------------------------- */
  var STATUS = { active: 'In progress', complete: 'Complete', drafting: 'Being written' };

  function questDetail(q) {
    var ext = q.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    var link = q.href && q.href !== '#'
      ? '<a class="btn btn--primary" href="' + esc(q.href) + '"' + ext + '>' + (q.external ? 'Play it' : 'Track quest') + '</a>'
      : '<span class="caps qdetail__tags">Journal entry coming soon</span>';
    return '' +
      '<div class="qdetail__top caps"><span class="on">' + (q.type === 'side' ? 'Side quest' : 'Main quest') + ' · ' + STATUS[q.status] + '</span><span>LV ' + q.level + '</span></div>' +
      '<h3 class="qdetail__name">' + esc(q.name) + '</h3>' +
      '<p class="qdetail__sub">' + esc(q.short) + ', for ' + esc(q.giver) + '</p>' +
      '<p class="qdetail__desc">' + esc(q.title) + '. ' + esc(q.role) + ', ' + esc(q.year) + '.</p>' +
      '<h4>Objectives</h4>' +
      '<ul class="objectives">' + q.objectives.map(function (o) { return '<li class="' + (o[1] ? 'done' : '') + '"><span>' + esc(o[0]) + (o[1] ? '<span class="sr-only"> (done)</span>' : '') + '</span></li>'; }).join('') + '</ul>' +
      '<h4>Rewards</h4>' +
      '<div class="rewards">' + q.rewards.map(function (r) { return '<span class="reward">' + esc(r) + '</span>'; }).join('') + '</div>' +
      '<div class="qdetail__foot"><span class="caps qdetail__tags">' + q.tags.map(esc).join(' · ') + '</span>' + link + '</div>';
  }

  $$('[data-qlog]').forEach(function (host, hi) {
    var mode = host.dataset.qlog;
    var all = (AW.quests || []).filter(function (q) { return mode === 'featured' ? q.featured : q.type === mode; });
    var filter = 'all';
    var listId = 'ql-list-' + hi, detailId = 'ql-detail-' + hi;
    host.innerHTML =
      '<div class="frame" data-reveal>' +
        (mode === 'featured'
          ? '<div class="qlog__tabs" role="group" aria-label="Filter quests"><button type="button" data-f="all" aria-selected="true">All</button><button type="button" data-f="main" aria-selected="false">Main</button><button type="button" data-f="side" aria-selected="false">Side</button></div>'
          : '') +
        '<ul class="qlog__list" id="' + listId + '" role="tablist" aria-orientation="vertical" aria-label="Quests"></ul>' +
      '</div>' +
      '<article class="qdetail frame frame--glow" id="' + detailId + '" role="tabpanel" aria-live="polite" data-reveal></article>';
    var list = $('ul', host), detail = $('article', host);

    function shown() { return all.filter(function (q) { return filter === 'all' || q.type === filter; }); }
    function select(id, focus) {
      var q = all.filter(function (x) { return x.id === id; })[0];
      if (!q) return;
      $$('.qlog__item', list).forEach(function (b) {
        var on = b.dataset.id === id;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
        if (on && focus) b.focus();
      });
      detail.innerHTML = questDetail(q);
      if (motion) gsap.fromTo(detail.children, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .6, ease: 'expo.out', stagger: .04, overwrite: true });
    }
    function render() {
      var qs = shown();
      list.innerHTML = qs.map(function (q) {
        return '<li role="presentation"><button type="button" class="qlog__item" role="tab" aria-controls="' + detailId + '" data-id="' + q.id + '" aria-selected="false" tabindex="-1">' +
          '<span class="qlog__mark qlog__mark--' + q.status + '" aria-hidden="true"></span>' +
          '<span class="qlog__name">' + esc(q.name) + '</span>' +
          '<span class="qlog__lv">LV ' + q.level + '</span>' +
          '<span class="qlog__meta caps"><span class="qlog__type' + (q.type === 'side' ? ' qlog__type--side' : '') + '">' + (q.type === 'side' ? 'Side' : 'Main') + '</span> · ' + esc(q.region) + ' · ' + esc(q.year) + '</span>' +
        '</button></li>';
      }).join('');
      if (qs[0]) select(qs[0].id);
    }
    list.addEventListener('click', function (e) { var b = e.target.closest('.qlog__item'); if (b) select(b.dataset.id); });
    list.addEventListener('keydown', function (e) {
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].indexOf(e.key) < 0) return;
      e.preventDefault();
      var items = $$('.qlog__item', list), i = items.indexOf(doc.activeElement);
      var n = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      select(items[n].dataset.id, true);
    });
    var tabs = $('.qlog__tabs', host);
    if (tabs) tabs.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      filter = b.dataset.f;
      $$('button', tabs).forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
      render();
    });
    render();
  });

  /* ---------------------------------------------------------
     Skill constellations
  --------------------------------------------------------- */
  var skillHost = $('[data-skills]');
  if (skillHost && AW.skills) {
    skillHost.innerHTML = AW.skills.map(function (s, si) {
      var edges = s.links.map(function (l) {
        var a = s.nodes[l[0]], b = s.nodes[l[1]];
        return '<line class="edge" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>';
      }).join('');
      var nodes = s.nodes.map(function (n, ni) {
        return '<circle class="node' + (ni < s.nodes.length - 1 ? ' lit' : '') + '" cx="' + n[0] + '" cy="' + n[1] + '" r="2.6" tabindex="0" role="button" aria-label="' + esc(s.perks[ni]) + '" data-perk="' + esc(s.perks[ni]) + '"/>';
      }).join('');
      return '<article class="skill frame" data-tilt data-reveal style="--i:' + si + '">' +
        '<div class="skill__sky"><svg viewBox="-4 -4 108 108" aria-hidden="false">' + edges + nodes + '</svg><span class="skill__perk caps" aria-live="polite">' + esc(s.perks[s.perks.length - 1]) + ' · next perk</span></div>' +
        '<span class="caps" style="color:var(--rune)">Skill tree 0' + (si + 1) + '</span>' +
        '<h3 class="skill__name">' + esc(s.name) + '</h3>' +
        '<p class="skill__sub">' + esc(s.sub) + '</p>' +
        '<p class="skill__body">' + esc(s.body) + '</p>' +
        '<div class="skill__foot caps"><span>' + (s.nodes.length - 1) + ' / ' + s.nodes.length + ' perks</span><a href="' + esc(s.link.href) + '">' + esc(s.link.text) + ' →</a></div>' +
      '</article>';
    }).join('');
    $$('.skill', skillHost).forEach(function (card) {
      var cap = $('.skill__perk', card), def = cap.textContent;
      $$('.node', card).forEach(function (n) {
        var show = function () { cap.textContent = n.dataset.perk + (n.classList.contains('lit') ? ' · unlocked' : ' · next perk'); };
        n.addEventListener('mouseenter', show); n.addEventListener('focus', show);
        n.addEventListener('mouseleave', function () { cap.textContent = def; });
        n.addEventListener('blur', function () { cap.textContent = def; });
      });
    });
  }

  /* ---------------------------------------------------------
     Inventory
  --------------------------------------------------------- */
  var ICONS = {
    tome: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/><path d="M10 8h5"/>',
    horn: '<path d="M4 10v4h3l8 5V5L7 10z"/><path d="M18 9a4 4 0 0 1 0 6"/>',
    staff: '<path d="M6 21 17 10"/><circle cx="18" cy="6" r="3"/><path d="M18 1v2M23 6h-2M14 3l1 1"/>',
    scroll: '<path d="M7 4h11v13a3 3 0 0 1-3 3H6a2 2 0 0 1-2-2v-1h11"/><path d="M7 4a2 2 0 0 0-2 2v2h2"/><path d="M10 9h5M10 12h5"/>',
    grimoire: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M12 8l2 3-2 3-2-3z"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'
  };
  function svgIcon(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[k] + '</svg>'; }
  var RARITY = { common: 'Common', rare: 'Rare', epic: 'Epic', legendary: 'Legendary' };

  var invHost = $('[data-inventory]');
  if (invHost && AW.inventory) {
    invHost.innerHTML =
      '<div class="inv__grid frame" role="tablist" aria-label="Inventory" data-reveal>' +
        AW.inventory.map(function (it, i) {
          return '<button type="button" role="tab" class="slot slot--' + (it.unlocked ? it.rarity : 'locked') + '" data-i="' + i + '" aria-selected="false" aria-controls="inv-detail" aria-label="' + esc(it.unlocked ? it.title : 'Locked ' + it.type.toLowerCase()) + '">' +
            svgIcon(it.unlocked ? it.icon : 'lock') + '<small>' + esc(it.unlocked ? it.type : '???') + '</small></button>';
        }).join('') +
      '</div>' +
      '<article class="idetail frame frame--glow" id="inv-detail" role="tabpanel" aria-live="polite" data-reveal></article>';
    var idet = $('#inv-detail');
    var pick = function (i) {
      var it = AW.inventory[i];
      $$('.slot', invHost).forEach(function (s) { s.setAttribute('aria-selected', s.dataset.i == i ? 'true' : 'false'); });
      var col = it.unlocked ? 'var(--' + it.rarity + ')' : 'var(--ink-3)';
      idet.style.setProperty('--r', col);
      idet.innerHTML = it.unlocked
        ? '<span class="caps idetail__rarity">' + RARITY[it.rarity] + ' ' + esc(it.kind) + '</span>' +
          '<h3 class="idetail__name">' + esc(it.title) + '</h3>' +
          '<p class="idetail__type">' + esc(it.type) + ' · ' + esc(it.meta) + '</p>' +
          '<p class="idetail__desc">' + esc(it.desc || '') + '</p>' +
          (it.href ? '<a class="btn btn--primary" href="' + esc(it.href) + '">Read it</a>' : '<a class="btn" href="character.html#raven">Ask about it</a>')
        : '<span class="caps idetail__rarity">Undiscovered ' + esc(it.type.toLowerCase()) + '</span>' +
          '<h3 class="idetail__name">???</h3>' +
          '<p class="idetail__type">' + esc(it.meta) + '</p>' +
          '<p class="idetail__desc">Rumoured to be ' + esc(it.title.toLowerCase()) + '. Not yet found. Check back, adventurer.</p>' +
          '<a class="btn" href="character.html#raven">Request early access</a>';
      if (motion) gsap.fromTo(idet.children, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .5, ease: 'expo.out', stagger: .04, overwrite: true });
    };
    invHost.addEventListener('click', function (e) { var s = e.target.closest('.slot'); if (s) pick(+s.dataset.i); });
    pick(0);
  }

  /* ---------------------------------------------------------
     Character sheet + chronicle
  --------------------------------------------------------- */
  var sigil = $('[data-sigil]');
  if (sigil) {
    sigil.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 150 150" aria-hidden="true" fill="none" stroke="currentColor">' +
      '<circle cx="75" cy="75" r="72" stroke-width=".8"/><circle cx="75" cy="75" r="62" stroke-width=".6" stroke-dasharray="2 6" class="spin" style="transform-origin:75px 75px;animation:spin 30s linear infinite"/>' +
      '<rect x="31" y="31" width="88" height="88" transform="rotate(45 75 75)" stroke-width="1"/><rect x="38" y="38" width="74" height="74" stroke-width=".6" opacity=".5"/></svg>');
  }
  var xp = $('[data-xp]');
  if (xp) xp.innerHTML = '<div class="xp__row caps"><span>Level ' + LEVEL + '</span><span>78% to LV ' + (LEVEL + 1) + '</span></div><div class="xp__bar"><i style="--w:78%"></i></div>';
  var attrs = $('[data-attrs]');
  if (attrs && AW.stats) {
    attrs.innerHTML = AW.stats.map(function (s) {
      return '<li class="attr"><abbr class="caps" title="' + esc(s.name) + '">' + esc(s.abbr) + '</abbr><span class="attr__bar" aria-hidden="true"><i style="--w:' + s.value + '%"></i></span><b data-count="' + s.value + '">' + s.value + '</b><span class="sr-only">' + esc(s.name) + '</span></li>';
    }).join('');
  }
  var chron = $('[data-chronicle]');
  if (chron && AW.cv) {
    var total = AW.cv.length;
    chron.innerHTML = AW.cv.map(function (r, i) {
      var yrs = r.from === r.to ? String(r.from) : r.from + '–' + (r.to || 'now');
      return '<li class="chapter' + (r.to ? '' : ' chapter--now') + '" data-tags="' + esc(r.tags.join('|')) + '" data-reveal>' +
        '<div class="chapter__num"><b>' + roman(total - i) + '</b><small class="caps">' + yrs + '</small></div>' +
        '<details' + (i === 0 ? ' open' : '') + '><summary><span class="chapter__org">' + esc(r.org) + '</span><span class="chapter__role">' + esc(r.role) + (r.via ? ', via ' + esc(r.via) : '') + '</span></summary>' +
        (r.notes.length ? '<ul>' + r.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' : '') + '</details></li>';
    }).join('');
    var cf = $('[data-chronicle-filter]');
    if (cf) cf.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', cf).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $$('.chapter', chron).forEach(function (li) { li.hidden = !(b.dataset.f === 'all' || li.dataset.tags.split('|').indexOf(b.dataset.f) > -1); });
      if (motion) ScrollTrigger.refresh();
    });
  }

  var raven = $('#raven-form');
  if (raven) raven.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(raven);
    var subject = '[' + (d.get('kind') || 'Quest') + '] from ' + (d.get('name') || 'a traveller');
    var body = (d.get('message') || '') + '\n\n' + (d.get('name') || '') + (d.get('email') ? ' · ' + d.get('email') : '');
    location.href = 'mailto:anthony@antjtw.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });

  /* ---------------------------------------------------------
     Achievement toast (once per session)
  --------------------------------------------------------- */
  function achievement(title) {
    var key = 'aw_ach_' + title;
    if (session(key)) return;
    session(key, '1');
    var t = doc.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.innerHTML = '<span class="toast__ico" aria-hidden="true"><span>✦</span></span><span class="caps">Achievement unlocked</span><p>' + esc(title) + '</p>';
    doc.body.append(t);
    requestAnimationFrame(function () { t.classList.add('is-on'); });
    setTimeout(function () { t.classList.remove('is-on'); setTimeout(function () { t.remove(); }, 800); }, 4200);
  }
  var achieved = false;
  addEventListener('scroll', function () {
    if (achieved || scrollY < innerHeight * .6) return;
    achieved = true;
    achievement(page === 'home' ? 'Ventured past the title screen' : 'Explored a new region');
  }, { passive: true });

  /* ---------------------------------------------------------
     Motes: drifting blue sparks (canvas)
  --------------------------------------------------------- */
  var cv = $('.motes');
  if (cv && !reduced) {
    var ctx = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2), W, H, motes = [];
    var size = function () { W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr; };
    size(); addEventListener('resize', size);
    for (var m = 0; m < 70; m++) motes.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + .4, s: Math.random() * .00035 + .0001, p: Math.random() * 6.28 });
    (function tick(t) {
      ctx.clearRect(0, 0, W, H);
      motes.forEach(function (o) {
        o.y -= o.s; if (o.y < -.02) { o.y = 1.02; o.x = Math.random(); }
        var a = .25 + .55 * (0.5 + 0.5 * Math.sin(t / 900 + o.p));
        var x = (o.x + Math.sin(t / 4000 + o.p) * .01) * W, y = o.y * H;
        ctx.beginPath(); ctx.arc(x, y, o.r * dpr, 0, 6.283);
        ctx.fillStyle = 'rgba(120,210,255,' + a.toFixed(2) + ')';
        ctx.shadowColor = 'rgba(69,200,255,.9)'; ctx.shadowBlur = 8 * dpr;
        ctx.fill();
      });
      requestAnimationFrame(tick);
    })(0);
  }

  /* ---------------------------------------------------------
     Cursor + spotlight
  --------------------------------------------------------- */
  if (fine) {
    var cur = $('.cursor'), mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; root.style.setProperty('--mx', mx + 'px'); root.style.setProperty('--my', my + 'px'); }, { passive: true });
    (function follow() { cx += (mx - cx) * .2; cy += (my - cy) * .2; cur.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)'; requestAnimationFrame(follow); })();
    doc.addEventListener('pointerover', function (e) { cur.classList.toggle('is-big', !!(e.target.closest && e.target.closest('a, button, summary, label, .node, input, textarea'))); });
  }

  /* ---------------------------------------------------------
     Loader: count up to your level, then lift the curtain
  --------------------------------------------------------- */
  var loader = $('.loader');
  var intro = null;
  function liftCurtain() {
    if (!loader) { if (intro) intro.play(); return; }
    var done = function () { loader.remove(); doc.body.classList.remove('is-loading'); if (motion) ScrollTrigger.refresh(); };
    if (!motion) return done();
    gsap.to(loader, { yPercent: -100, duration: 1.1, ease: 'expo.inOut', onComplete: done });
    if (intro) gsap.delayedCall(.45, function () { intro.play(); });
  }

  /* ---------------------------------------------------------
     Motion (GSAP + ScrollTrigger + Lenis)
  --------------------------------------------------------- */
  function initMotion() {
    gsap.registerPlugin(ScrollTrigger);
    var lenis = null;
    if (window.Lenis) {
      lenis = new Lenis({ lerp: .1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    gsap.to('.compass__progress i', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });

    if ($('.hero')) {
      intro = gsap.timeline({ paused: true });
      intro.from('.hero__runes', { scale: .7, opacity: 0, rotate: -40, duration: 2, ease: 'expo.out' })
        .from('.hero__name .ch', { yPercent: 115, rotate: 8, duration: 1.2, ease: 'expo.out', stagger: .045 }, '<.1')
        .from('.hero__pre', { opacity: 0, letterSpacing: '.6em', duration: 1.4, ease: 'expo.out' }, '<.1')
        .from('.hero__epithet, .hero .ornament, .hero__lede', { opacity: 0, y: 24, duration: 1, ease: 'expo.out', stagger: .08 }, '<.3')
        .from('.menu li', { opacity: 0, x: -20, duration: .9, ease: 'expo.out', stagger: .07 }, '<.2')
        .from('.hero__scroll', { opacity: 0, duration: 1 }, '<.4');
      gsap.to('.hero__runes', { yPercent: 25, rotate: 25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__inner', { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
    gsap.to('.blob--a', { yPercent: 60, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
    gsap.to('.blob--b', { yPercent: -40, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });

    $$('.banner__title').forEach(function (t) { gsap.from(t, { yPercent: 40, opacity: 0, skewY: 3, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 88%' } }); });
    $$('.banner__label, .banner__kicker').forEach(function (t) { gsap.from(t, { y: 18, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 92%' } }); });
    $$('.banner__label').forEach(function (t) { gsap.from(t, { letterSpacing: '.5em', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 92%' } }); });
    ScrollTrigger.batch('[data-reveal]', { start: 'top 92%', onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .08, overwrite: true }); } });

    $$('.skill__sky').forEach(function (sky) {
      var edges = $$('.edge', sky), nodes = $$('.node', sky);
      edges.forEach(function (e) { var l = Math.hypot(e.x2.baseVal.value - e.x1.baseVal.value, e.y2.baseVal.value - e.y1.baseVal.value); e.style.strokeDasharray = l; e.style.strokeDashoffset = l; });
      var tl = gsap.timeline({ scrollTrigger: { trigger: sky, start: 'top 85%' } });
      tl.from(nodes, { scale: 0, transformOrigin: 'center', duration: .6, ease: 'back.out(3)', stagger: .07 })
        .to(edges, { strokeDashoffset: 0, duration: .8, ease: 'power2.out', stagger: .06 }, '<.2');
    });

    $$('.xp__bar i, .attr__bar i').forEach(function (b) { gsap.from(b, { scaleX: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: b, start: 'top 92%' } }); });
    $$('[data-count]').forEach(function (el) {
      var v = +el.dataset.count, o = { n: 0 };
      ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: function () { gsap.to(o, { n: v, duration: 1.8, ease: 'expo.out', onUpdate: function () { el.textContent = Math.round(o.n); } }); } });
    });
    var foot = $('.foot__big');
    if (foot) gsap.from(foot, { yPercent: 60, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    /* Velocity-reactive banners */
    $$('.realms__track').forEach(function (tr) {
      var rev = !!tr.closest('.realms--ghost'), x = 0, half = tr.scrollWidth / 2;
      gsap.ticker.add(function () {
        var v = lenis ? Math.abs(lenis.velocity) : 0;
        x -= (0.55 + Math.min(v, 60) * .15) * (rev ? -1 : 1);
        if (x <= -half) x += half; if (x > 0) x -= half;
        tr.style.transform = 'translate3d(' + x + 'px,0,0)';
      });
      addEventListener('resize', function () { half = tr.scrollWidth / 2; });
    });

    /* Tilt */
    if (fine) $$('[data-tilt]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        el.style.transform = 'rotateY(' + (px * 8) + 'deg) rotateX(' + (-py * 8) + 'deg)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  if (motion) initMotion();

  if (loader) {
    if (!motion || session('aw_booted')) {
      loader.remove();
      if (intro) intro.play();
    } else {
      doc.body.classList.add('is-loading');
      var num = $('[data-lvl]'), bar = $('.loader__bar i'), o = { n: 1 };
      Promise.all([
        doc.fonts ? doc.fonts.ready : Promise.resolve(),
        new Promise(function (res) { gsap.to(o, { n: LEVEL, duration: 1.6, ease: 'expo.inOut', onUpdate: function () { num.textContent = Math.round(o.n); bar.style.width = (o.n / LEVEL * 100) + '%'; }, onComplete: res }); })
      ]).then(function () { session('aw_booted', '1'); liftCurtain(); });
    }
  } else if (intro) {
    intro.play();
  }
})();
