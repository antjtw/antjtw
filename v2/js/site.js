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

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function store(key, val) {
    try {
      if (val === undefined) return sessionStorage.getItem(key);
      sessionStorage.setItem(key, val);
    } catch (e) { return null; }
  }
  function hash(str) { var h = 0; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0; return Math.abs(h); }

  /* ---------------------------------------------------------
     Pause motion (WCAG 2.2.2): one switch for the whole site
  --------------------------------------------------------- */
  var paused = reduceMotion;
  if (paused) root.classList.add('motion-paused');
  function setPaused(p) {
    paused = p;
    root.classList.toggle('motion-paused', p);
    doc.querySelectorAll('[data-pause]').forEach(function (b) {
      b.textContent = p ? 'Play animation' : 'Pause animation';
      b.setAttribute('aria-pressed', p ? 'true' : 'false');
    });
  }
  doc.addEventListener('click', function (e) {
    if (e.target.closest('[data-pause]')) setPaused(!paused);
  });

  /* ---------------------------------------------------------
     Chrome: nav, footer, dark-band atmosphere
  --------------------------------------------------------- */
  var NAV = [
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'main-quests.html', label: 'Main quests', key: 'main' },
    { href: 'side-quests.html', label: 'Side quests', key: 'side' },
    { href: 'inventory.html', label: 'Inventory', key: 'inventory' },
    { href: 'character.html', label: 'Character', key: 'character' }
  ];
  var page = doc.body.dataset.page || 'home';

  var navSlot = doc.querySelector('[data-nav]');
  if (navSlot) {
    navSlot.outerHTML =
      '<header class="nav" id="nav"><div class="wrap nav__inner">' +
        '<a class="brand" href="index.html">Ant White</a>' +
        '<nav aria-label="Primary"><ul class="nav__links" id="nav-links">' +
          NAV.map(function (n) {
            return '<li><a href="' + n.href + '"' + (n.key === page ? ' aria-current="page"' : '') + '>' + n.label + '</a></li>';
          }).join('') +
        '</ul></nav>' +
        '<button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Menu"><span></span><span></span><span></span></button>' +
      '</div></header>';
    var nav = doc.getElementById('nav');
    var toggle = nav.querySelector('.nav__toggle');
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
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

  doc.querySelectorAll('.band--dark, .sheet').forEach(function (band) {
    var a = doc.createElement('div');
    a.className = 'aurora';
    a.setAttribute('aria-hidden', 'true');
    a.innerHTML = '<span></span><span></span><span></span><span></span>';
    band.prepend(a);
  });

  /* Cursor: a glowing dot everywhere, a soft spotlight inside dark bands */
  if (finePointer) {
    var dot = doc.createElement('div');
    dot.className = 'cursor-dot';
    dot.setAttribute('aria-hidden', 'true');
    doc.body.append(dot);
    addEventListener('pointermove', function (e) {
      dot.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
      dot.classList.add('is-on');
      var band = e.target.closest && e.target.closest('.band--dark, .sheet');
      if (band) {
        var r = band.getBoundingClientRect();
        band.style.setProperty('--gx', (e.clientX - r.left) + 'px');
        band.style.setProperty('--gy', (e.clientY - r.top) + 'px');
      }
      var card = e.target.closest && e.target.closest('.glow-card');
      if (card) {
        var c = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - c.left) + 'px');
        card.style.setProperty('--my', (e.clientY - c.top) + 'px');
      }
    }, { passive: true });
    doc.addEventListener('pointerleave', function () { dot.classList.remove('is-on'); });
    doc.addEventListener('pointerover', function (e) {
      var hot = e.target.closest && e.target.closest('a, button, label, summary');
      dot.style.scale = hot ? '2.4' : '1';
    });
  }

  /* ---------------------------------------------------------
     Loader: once per session
  --------------------------------------------------------- */
  var loader = doc.querySelector('.loader');
  if (loader) {
    if (store('aw_booted') || reduceMotion) {
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
          store('aw_booted', '1');
          setTimeout(function () { loader.classList.add('is-done'); setTimeout(function () { loader.remove(); }, 800); }, 280);
        }
      }, 110);
    }
  }

  /* ---------------------------------------------------------
     Hero: rotating word + matching diagram panel
  --------------------------------------------------------- */
  function B(x, y, w, h, label, hot, d) {
    return '<g class="pop" style="--d:' + (d || 0) + '"><rect class="box' + (hot ? ' box--hot' : '') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/>' +
      '<text class="lbl" x="' + (x + w / 2) + '" y="' + (y + h / 2) + '">' + label + '</text></g>';
  }
  function L(d, flow) { return '<path class="' + (flow ? 'flow' : 'wire') + '" d="' + d + '"/>'; }
  var SCENES = {
    agents:
      '<rect class="dash" x="4" y="8" width="312" height="252"/><text class="mono" x="14" y="28">PROTOTYPE KIT</text>' +
      B(24, 56, 110, 50, 'User need', false, 0) + B(186, 56, 110, 50, 'Agent', true, 1) + B(105, 176, 110, 50, 'Spec page', false, 2) +
      L('M134 81 H186', true) + L('M241 106 L180 176', true) + L('M105 201 L60 201 L60 106', false) +
      '<text class="mono" x="70" y="150">HUMAN REVIEW</text>',
    teams:
      B(115, 14, 90, 46, 'Lead', true, 0) +
      L('M160 60 L40 170', true) + L('M160 60 L100 170', true) + L('M160 60 L160 170', true) + L('M160 60 L220 170', true) + L('M160 60 L280 170', true) +
      B(10, 170, 60, 40, 'UX', false, 1) + B(70, 170, 60, 40, 'UI', false, 2) + B(130, 170, 60, 40, 'Content', false, 3) + B(190, 170, 60, 40, 'Research', false, 4) + B(250, 170, 60, 40, 'Service', false, 5) +
      '<text class="mono" x="10" y="246">FORCE x 5</text>',
    practice:
      B(10, 200, 66, 40, 'Ad hoc', false, 0) + B(86, 150, 66, 90, 'Rituals', false, 1) + B(162, 100, 66, 140, 'System', false, 2) + B(238, 30, 72, 210, 'Practice', true, 3) +
      L('M43 190 L119 140 L195 90 L274 20', true) + '<text class="mono" x="10" y="30">FROM ZERO</text>',
    systems:
      '<text class="mono" x="14" y="22">TOKENS</text><text class="mono" x="118" y="22">COMPONENTS</text><text class="mono" x="232" y="22">SCREENS</text>' +
      B(10, 40, 80, 34, 'Colour', false, 0) + B(10, 90, 80, 34, 'Type', false, 1) + B(10, 140, 80, 34, 'Space', false, 2) +
      B(118, 60, 90, 44, 'Button', true, 3) + B(118, 124, 90, 44, 'Card', false, 4) +
      B(232, 40, 80, 150, 'Screen', false, 5) +
      L('M90 57 L118 82', true) + L('M90 107 L118 146', true) + L('M90 157 L118 146', false) + L('M208 82 L232 100', true) + L('M208 146 L232 130', true),
    rules:
      '<g class="pop" style="--d:0"><path class="box box--hot" d="M70 30 L120 58 L120 114 L70 142 L20 114 L20 58 Z"/><text class="lbl" x="70" y="86" style="font-family:JetBrains Mono">20</text></g>' +
      B(190, 50, 110, 46, 'Rule', false, 1) + B(190, 150, 110, 46, 'Interface', false, 2) + B(40, 200, 110, 46, 'Player', false, 3) +
      L('M120 80 L190 73', true) + L('M245 96 L245 150', true) + L('M190 173 L150 210', true) + L('M70 200 L70 142', false) +
      '<text class="mono" x="14" y="268">WEEKLY PLAYTESTS</text>'
  };

  var heroRot = doc.querySelector('[data-rotator]');
  var panel = doc.querySelector('[data-panel]');
  if (heroRot && AW.hero) {
    heroRot.innerHTML = AW.hero.map(function (h, i) {
      return '<span class="rotator__word' + (i === 0 ? ' is-in' : '') + '"' + (i ? ' aria-hidden="true"' : '') + '><span>' + esc(h.word) + '.</span></span>';
    }).join('');
    if (panel) {
      panel.querySelector('.panel__stage').innerHTML = AW.hero.map(function (h, i) {
        return '<div class="panel__scene' + (i === 0 ? ' is-in' : '') + '"><svg viewBox="0 0 320 280" role="img" aria-label="' + esc(h.cap) + '">' + SCENES[h.scene] + '</svg></div>';
      }).join('');
      panel.querySelector('.panel__dots').innerHTML = AW.hero.map(function (_, i) { return '<i class="' + (i === 0 ? 'is-on' : '') + '"></i>'; }).join('');
    }
    var idx = 0;
    var show = function (n) {
      var words = heroRot.children;
      var cur = words[idx];
      cur.classList.remove('is-in'); cur.classList.add('is-out'); cur.setAttribute('aria-hidden', 'true');
      setTimeout(function () { cur.classList.remove('is-out'); }, 800);
      idx = n;
      words[idx].classList.add('is-in'); words[idx].removeAttribute('aria-hidden');
      if (panel) {
        var scenes = panel.querySelectorAll('.panel__scene');
        scenes.forEach(function (s, i) { s.classList.toggle('is-in', i === idx); });
        panel.querySelectorAll('.panel__dots i').forEach(function (d, i) { d.classList.toggle('is-on', i === idx); });
        panel.querySelector('[data-panel-tab]').textContent = AW.hero[idx].tab;
        panel.querySelector('.panel__cap').textContent = AW.hero[idx].cap;
      }
    };
    if (panel) {
      panel.querySelector('[data-panel-tab]').textContent = AW.hero[0].tab;
      panel.querySelector('.panel__cap').textContent = AW.hero[0].cap;
    }
    setInterval(function () { if (!paused) show((idx + 1) % AW.hero.length); }, 3200);
  }

  /* ---------------------------------------------------------
     Client marquee
  --------------------------------------------------------- */
  var marquee = doc.querySelector('[data-marquee]');
  if (marquee && AW.clients) {
    var items = AW.clients.map(function (c) { return '<span class="marquee__item">' + esc(c) + '</span>'; }).join('');
    marquee.innerHTML = '<div class="marquee__track">' + items + items.replace(/class="marquee__item"/g, 'class="marquee__item" aria-hidden="true"') + '</div>';
  }

  /* ---------------------------------------------------------
     Scroll-lit statement: words light up as you read
  --------------------------------------------------------- */
  var statement = doc.querySelector('[data-statement]');
  if (statement) {
    var wrapWords = function (node) {
      Array.from(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = doc.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(doc.createTextNode(part)); return; }
            var s = doc.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) { wrapWords(n); }
      });
    };
    wrapWords(statement);
    var ws = statement.querySelectorAll('.w');
    var light = function () {
      var r = statement.getBoundingClientRect();
      var vh = innerHeight;
      var prog = reduceMotion ? 1 : Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      var n = Math.round(prog * ws.length);
      ws.forEach(function (w, i) { w.classList.toggle('is-lit', i < n); });
    };
    addEventListener('scroll', light, { passive: true });
    light();
  }

  /* ---------------------------------------------------------
     Renderers
  --------------------------------------------------------- */
  var STATUS = { active: 'In progress', complete: 'Complete', drafting: 'Drafting' };
  function tags(list) {
    return list.map(function (t) { return '<span class="tag" data-t="' + (hash(t) % 5) + '">' + esc(t) + '</span>'; }).join('');
  }
  function questCard(q, i) {
    var h = q.hue || 210;
    var ext = q.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    var art = '--c1:hsl(' + h + ',85%,42%);--c2:hsl(' + (h - 25) + ',95%,62%);--c3:hsl(' + (h + 35) + ',80%,62%)';
    return (
      '<a class="quest glow-card reveal" href="' + esc(q.href) + '"' + ext + ' data-status="' + q.status + '" style="--i:' + (i % 3) + '">' +
        '<div class="quest__art" aria-hidden="true" style="' + art + '">' +
          (q.img ? '<img src="' + esc(q.img) + '" alt="" loading="lazy">' : '<i></i><i></i><i></i>') +
          '<span class="quest__status quest__status--' + q.status + '"><span class="pulse"></span>' + STATUS[q.status] + '</span>' +
        '</div>' +
        '<div class="quest__body">' +
          '<span class="quest__go" aria-hidden="true">' + (q.external ? '↗' : '→') + '</span>' +
          '<span class="quest__kind' + (q.type === 'side' ? ' quest__kind--side' : '') + '">' + (q.type === 'side' ? 'Side quest' : 'Main quest') + ' · ' + esc(q.year) + '</span>' +
          '<span class="quest__sector">' + esc(q.sector || q.org) + '</span>' +
          '<h3 class="quest__title">' + esc(q.short || q.org) + '</h3>' +
          '<p class="quest__loot">' + esc(q.title) + '.</p>' +
          '<p class="quest__metric">' + esc(q.loot) + '</p>' +
          '<div class="quest__tags">' + tags(q.tags) + '</div>' +
        '</div>' +
      '</a>'
    );
  }

  doc.querySelectorAll('[data-quests]').forEach(function (host) {
    var mode = host.dataset.quests;
    var list = (AW.quests || []).filter(function (q) { return mode === 'featured' ? q.featured : q.type === mode; });
    if (mode === 'featured') {
      var m = list.filter(function (q) { return q.type === 'main'; });
      var s = list.filter(function (q) { return q.type === 'side'; });
      list = [];
      while (m.length || s.length) { if (m.length) list.push(m.shift()); if (m.length) list.push(m.shift()); if (s.length) list.push(s.shift()); }
    }
    host.innerHTML = list.map(questCard).join('');
  });

  doc.querySelectorAll('[data-filter-for]').forEach(function (tabsEl) {
    var host = doc.getElementById(tabsEl.dataset.filterFor);
    tabsEl.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      tabsEl.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var f = b.dataset.filter;
      host.querySelectorAll('.quest').forEach(function (card) {
        card.classList.toggle('is-hidden', f !== 'all' && card.dataset.status !== f);
      });
    });
  });

  var invHost = doc.querySelector('[data-inventory]');
  if (invHost && AW.inventory) {
    var ICON = { Writing: '✎', Speaking: '◉', Teaching: '✦', Course: '◈' };
    var limit = parseInt(invHost.dataset.inventory, 10) || AW.inventory.length;
    invHost.innerHTML = AW.inventory.slice(0, limit).map(function (it, i) {
      var tag = it.href ? 'a' : 'div';
      return '<' + tag + (it.href ? ' href="' + esc(it.href) + '"' : '') + ' class="slot glow-card reveal' + (it.unlocked ? '' : ' slot--locked') + '" style="--i:' + i + '">' +
        '<div class="slot__kind"><span>' + esc(it.kind) + '</span><span>' + (it.unlocked ? '' : 'Locked') + '</span></div>' +
        '<span class="slot__icon" aria-hidden="true">' + (it.unlocked ? (ICON[it.kind] || '◆') : '🔒') + '</span>' +
        '<h3 class="slot__title">' + esc(it.title) + '</h3>' +
        '<span class="slot__meta">' + esc(it.meta) + '</span>' +
      '</' + tag + '>';
    }).join('');
  }

  var statsHost = doc.querySelector('[data-stats]');
  if (statsHost && AW.stats) {
    statsHost.innerHTML = AW.stats.map(function (s) {
      return '<li class="stat"><span>' + esc(s.name) + '</span><span class="stat__bar"><span class="stat__fill" style="--w:' + s.value + '%"></span></span><span class="stat__val">' + s.value + '</span></li>';
    }).join('');
  }

  var xpHost = doc.querySelector('[data-xp]');
  if (xpHost) {
    var years = new Date().getFullYear() - 2014;
    xpHost.innerHTML = '<div class="xp__row"><span>LVL ' + years + ' · Design leader</span><span>' + years + ' yrs XP</span></div><div class="xp__bar"><span class="xp__fill" style="--w:78%"></span></div>';
  }

  var cvHost = doc.querySelector('[data-cv]');
  if (cvHost && AW.cv) {
    cvHost.innerHTML = AW.cv.map(function (r, i) {
      var yrs = r.from === r.to ? String(r.from) : r.from + ' – ' + (r.to ? r.to : 'Now');
      return '<li data-tags="' + esc(r.tags.join('|')) + '"><details class="tl' + (r.to ? '' : ' tl--current') + '"' + (i === 0 ? ' open' : '') + '>' +
        '<summary><span class="tl__org">' + esc(r.org) + '</span><span class="tl__years">' + yrs + '</span>' +
        '<span class="tl__role">' + esc(r.role) + (r.via ? ' · via ' + esc(r.via) : '') + '</span></summary>' +
        (r.notes.length ? '<ul class="tl__notes">' + r.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' : '') +
      '</details></li>';
    }).join('');
    var cvTabs = doc.querySelector('[data-cv-filter]');
    if (cvTabs) {
      cvTabs.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        cvTabs.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        var f = b.dataset.filter;
        cvHost.querySelectorAll(':scope > li').forEach(function (li) {
          li.hidden = !(f === 'all' || li.dataset.tags.split('|').indexOf(f) > -1);
        });
      });
    }
  }

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
     Reveal on scroll
  --------------------------------------------------------- */
  var revealables = doc.querySelectorAll('.reveal, [data-stats], [data-xp]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (n) { io.observe(n); });
  } else {
    revealables.forEach(function (n) { n.classList.add('is-visible'); });
  }
})();
