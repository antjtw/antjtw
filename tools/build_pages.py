import sys
out = sys.argv[1]

HEAD = '''<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta name="robots" content="noindex">
  <meta name="theme-color" content="#05070D">
  <script>
    /* Lock before first paint unless already unlocked (see the gate in js/site.js) */
    (function () {{
      var ok = false;
      try {{
        ok = sessionStorage.getItem('aw_auth') === 'unlocked';
        if (!ok) {{ var r = JSON.parse(localStorage.getItem('aw_auth') || 'null'); ok = !!(r && r.value === 'unlocked' && r.expires > Date.now()); }}
      }} catch (e) {{}}
      if (!ok) document.documentElement.classList.add('is-locked');
    }})();
  </script>
  <link rel="preload" href="fonts/Copernicus-Bold.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="fonts/Copernicus-Book.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap">
  <link rel="stylesheet" href="css/site.css">
</head>
<body data-page="{key}">
  <a class="skip" href="#main">Skip to content</a>
  <div data-nav></div>

  <main id="main">
{body}
  </main>

  <section class="band--dark band--quiet">
    <div class="wrap cta">
      <span class="eyebrow">{c_label}</span>
      <h2 class="cta__title">{c_title}</h2>
      <p>{c_text}</p>
      <a class="btn" href="contact.html">{c_btn} <span class="btn__arrow" aria-hidden="true">→</span></a>
    </div>
    <div data-footer></div>
  </section>

  <script src="vendor/gsap.min.js"></script>
  <script src="vendor/ScrollTrigger.min.js"></script>
  <script src="vendor/lenis.min.js"></script>
  <script src="js/data.js"></script>
  <script src="js/site.js"></script>
</body>
</html>
'''

def head(eyebrow, title, lede):
    return f'''    <header class="band--dark page-head">
      <div class="wrap">
        <span class="eyebrow">{eyebrow}</span>
        <h1 class="page-head__title">{title}</h1>
        <p class="page-head__lede">{lede}</p>
      </div>
    </header>'''

def filters(target, opts, attr='data-filter-for'):
    b = ''.join(f'<button type="button" data-filter="{v}" aria-pressed="{"true" if i == 0 else "false"}">{l}</button>' for i, (v, l) in enumerate(opts))
    return f'<div class="tabs" {attr}="{target}" role="group" aria-label="Filter">{b}</div>'

ICON_AI = '''<svg class="pillar__icon" viewBox="0 0 72 72" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="36" cy="36" r="8"/><g class="spin-slow"><circle cx="36" cy="36" r="22" stroke-dasharray="4 6"/></g><circle cx="36" cy="14" r="3" fill="currentColor"/><circle cx="55" cy="47" r="3" fill="currentColor"/><circle cx="17" cy="47" r="3" fill="currentColor"/><path class="draw-loop" d="M36 28V17M42 40l10 5M30 40l-10 5"/></svg>'''
ICON_TR = '''<svg class="pillar__icon" viewBox="0 0 72 72" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="10" y="44" width="12" height="18"/><rect x="30" y="30" width="12" height="32"/><rect x="50" y="12" width="12" height="50"/><path class="draw-loop" d="M12 34 L30 20 L44 24 L62 6"/></svg>'''
ICON_GD = '''<svg class="pillar__icon" viewBox="0 0 72 72" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><g class="spin-slow"><path d="M36 8 L62 23 L62 49 L36 64 L10 49 L10 23 Z"/></g><path d="M36 8 L36 36 M10 23 L36 36 L62 23 M36 36 L36 64"/></svg>'''

def pillar(n, icon, title, body, stat, href, link):
    return f'''          <article class="pillar glow-card" data-reveal>
            <span class="pillar__num">{n}</span>
            {icon}
            <h3 class="pillar__title">{title}</h3>
            <p class="pillar__body">{body}</p>
            <div class="pillar__foot"><span class="pillar__stat">{stat}</span><a href="{href}">{link}</a></div>
          </article>'''

HOME = '''    <section class="band--dark hero">
      <div class="wrap hero__grid">
        <div>
          <span class="eyebrow">Design leader · North</span>
          <h1 class="hero__name" data-split>Ant White</h1>
          <p class="hero__line">I lead design through <span class="rotator" data-rotator aria-live="polite"><span class="rotator__word is-in"><span>AI.</span></span></span></p>
          <button class="text-link" type="button" data-pause aria-pressed="false">Pause animation</button>
          <p class="hero__lede">I lead user-centred design for NHS England, build design practices in serious industries, and use <span class="hl">AI transformation</span> to make whole teams faster without making them thinner.</p>
          <div class="hero__actions">
            <a class="btn" href="main-quests.html">See the main quests <span class="btn__arrow" aria-hidden="true">→</span></a>
            <a class="btn btn--ghost" href="contact.html">Email Ant</a>
          </div>
        </div>
        <div class="orb" data-orb aria-hidden="true">
          <span class="orb__blob orb__blob--a"></span>
          <span class="orb__blob orb__blob--b"></span>
          <span class="orb__blob orb__blob--c"></span>
          <span class="orb__core"></span>
          <span class="orb__ring"></span>
        </div>
      </div>
    </section>

    <section class="band--light logos" aria-label="Organisations I have worked with">
      <div class="marquee" data-marquee></div>
      <div class="wrap logos__foot"><button class="text-link" type="button" data-pause aria-pressed="false">Pause animation</button></div>
    </section>

    <section class="band--light section">
      <div class="wrap">
        <p class="statement" data-statement>Twelve years making design work in places where it has to be right: the <em>NHS</em>, government, defence, pharma and the big UK telcos. These days the job is less about making the thing and more about building <em>the team that makes the thing</em>, and teaching it to work alongside AI.</p>
      </div>
    </section>

    <section class="band--light section section--tight" aria-labelledby="main-title">
      <div class="wrap">
        <div class="section__head">
          <div><span class="eyebrow">Work</span><h2 class="section__title" id="main-title">Main quests</h2></div>
          <a class="btn btn--ghost" href="main-quests.html">All main quests <span class="btn__arrow" aria-hidden="true">→</span></a>
        </div>
        <div class="quest-grid" data-quests="main:featured"></div>
      </div>
    </section>

    <section class="band--light section section--tight" aria-labelledby="side-title">
      <div class="wrap">
        <div class="section__head">
          <div><span class="eyebrow">Outside work</span><h2 class="section__title" id="side-title">Side quests</h2></div>
          <a class="btn btn--ghost" href="side-quests.html">All side quests <span class="btn__arrow" aria-hidden="true">→</span></a>
        </div>
        <div class="side-list" data-quests="side:featured" data-style="rows"></div>
      </div>
    </section>

    <section class="band--dark band--quiet section" aria-labelledby="practice-title">
      <div class="wrap">
        <div class="section__head">
          <div><span class="eyebrow">Methods &amp; practice</span><h2 class="section__title" id="practice-title">How I work</h2></div>
          <p class="section__sub">Where AI earns its place, how practices get built, and why a tabletop game keeps me sharp.</p>
        </div>
        <div class="pillars">
''' + pillar('01 · AI', ICON_AI, 'AI, done properly', 'Agentic tooling that speeds delivery without replacing judgement: spec-writing agents for the GOV.UK Prototype Kit, research synthesis, rapid proofs of concept.', 'Agents in delivery', 'ai-policy.html', 'How I think about AI') + '\n' + pillar('02 · Transformation', ICON_TR, 'Transformation', 'Design practices and systems built where there were none, research without user access, and a volunteer federation taken from spreadsheets to strategy.', 'Built from zero', 'main-quests.html', 'Main quests') + '\n' + pillar('03 · Game design', ICON_GD, 'Game design', 'MTFBWY is my systems-thinking gym: designing rules, the interfaces to the rules, and how players learn them from the interfaces.', 'Weekly playtests', 'side-quests.html', 'Side quests') + '''
        </div>
      </div>
    </section>

    <section class="band--light section" aria-labelledby="writing-title">
      <div class="wrap">
        <div class="section__head">
          <div><span class="eyebrow">Writing · Speaking · Teaching</span><h2 class="section__title" id="writing-title">Writing &amp; speaking</h2></div>
          <a class="btn btn--ghost" href="writing.html">Everything <span class="btn__arrow" aria-hidden="true">→</span></a>
        </div>
        <ul class="wlist" data-writing="3"></ul>
      </div>
    </section>'''

CV = head('CV', 'Design leader', 'A decade and more across health, government, defence, pharma and telecoms, from junior creative to leading user-centred design at NHS England.') + '''

    <section class="band--light section">
      <div class="wrap cvgrid">
        <aside class="cvside">
          <div class="prose" data-reveal>
            <span class="eyebrow">Summary</span>
            <p style="margin-top:12px">I’m a design leader at Accenture. Somewhere along the way I worked out that the job isn’t making the thing, it’s making the team that makes the thing.</p>
            <p>I’ve built design practices and systems from nothing, run research when we weren’t allowed to talk to users, and shipped experiments that moved commercial numbers. Today I’m pointing that at AI: agentic tooling and up-skilling that take the grind off designers so they can think harder.</p>
          </div>
          <nav class="cvnav" aria-label="CV sections">
            <a href="#experience">Experience</a><a href="#education">Education</a><a href="#bonus">Bonus experience</a><a href="#proficiencies">Proficiencies</a>
          </nav>
          <a class="btn btn--ghost" href="https://www.dropbox.com/scl/fo/w5xttt4el73fbboominl1/ABk4T1YDUi1UFG9Na6wEmdE?rlkey=yfwq3czfpr02k86s7jlfpru8g&amp;st=uv745q1f&amp;dl=0" target="_blank" rel="noopener noreferrer">Printable CV ↗</a>
        </aside>
        <div class="cvmain">
          <section id="experience" class="cvsec">
            <div class="section__head" style="margin-bottom:8px">
              <h2 class="cvsec__title">Experience</h2>
              ''' + filters('cv', [('all', 'All'), ('Leadership', 'Leadership'), ('AI', 'AI'), ('Product', 'Product'), ('Systems', 'Systems'), ('Craft', 'Craft')], 'data-cv-filter') + '''
            </div>
            <ol class="timeline" data-cv></ol>
          </section>
          <section id="education" class="cvsec"><h2 class="cvsec__title">Education</h2><div class="entries" data-entries="education"></div></section>
          <section id="bonus" class="cvsec"><h2 class="cvsec__title">Bonus experience</h2><div class="entries" data-entries="bonus"></div></section>
          <section id="proficiencies" class="cvsec">
            <h2 class="cvsec__title">Proficiencies</h2>
            <p class="cvsec__intro">Like in any good roleplaying game, I’m proficient in (can efficiently use) the following tools.</p>
            <ul class="pills" data-proficiencies></ul>
          </section>
        </div>
      </div>
    </section>'''

CONTACT = head('Contact', 'Get in touch', 'Leadership roles, talks, mentoring, collaborations, or a debate about the prequels. I read everything.') + '''

    <section class="band--light section">
      <div class="wrap two">
        <div class="prose" data-reveal>
          <span class="eyebrow">Direct</span>
          <p style="margin-top:12px"><a href="mailto:anthony@antjtw.com">anthony@antjtw.com</a></p>
          <p><a href="https://www.linkedin.com/in/ant-white/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
          <p>Not job-hunting, always happy to talk.</p>
        </div>
        <form class="form glow-card" id="contact-form" data-reveal>
          <fieldset class="field">
            <legend>What’s it about?</legend>
            <div class="choices">
              <input type="radio" name="kind" id="k1" value="Role" checked><label for="k1">Role</label>
              <input type="radio" name="kind" id="k2" value="Talk"><label for="k2">Talk</label>
              <input type="radio" name="kind" id="k3" value="Mentoring"><label for="k3">Mentoring</label>
              <input type="radio" name="kind" id="k4" value="Collab"><label for="k4">Collab</label>
              <input type="radio" name="kind" id="k5" value="Star Wars"><label for="k5">Star Wars</label>
            </div>
          </fieldset>
          <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" autocomplete="name" required></div>
          <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email"></div>
          <div class="field"><label for="f-msg">Message</label><textarea id="f-msg" name="message" required></textarea></div>
          <button class="btn" type="submit" style="justify-self:start">Send <span class="btn__arrow" aria-hidden="true">→</span></button>
        </form>
      </div>
    </section>'''

def list_page(kind, target, opts):
    return f'''
    <section class="band--light section">
      <div class="wrap">
        <div class="section__head">{filters(target, opts)}</div>
        <div class="{'quest-grid' if kind == 'main' else 'side-list'}" id="{target}" data-quests="{kind}"{'' if kind == 'main' else ' data-style="rows"'}></div>
      </div>
    </section>'''

CTA = dict(c_label='Player two has entered the game', c_title='Got a quest?', c_text='Leadership roles, talks, mentoring, or a long chat about Star Wars.', c_btn='Get in touch')
pages = {
  'index': dict(title='Ant White', key='home', desc='Ant White: design leader, AI leader and force multiplier building design practices in serious industries.', body=HOME, **CTA),
  'main-quests': dict(title='Main quests · Ant White', key='main', desc='Case studies from a decade of design leadership.',
    body=head('Work', 'Main quests', 'Case studies from a decade of design leadership across health, government, defence, pharma and telecoms. Some sit behind NDA, so the detail lives in the room.') + list_page('main', 'main-list', [('all', 'All'), ('active', 'In progress'), ('complete', 'Complete'), ('drafting', 'Being written')]),
    c_label='Want the full story?', c_title='Ask for the deep cut', c_text='The NDA bits are best told in person. Happy to walk you through any of these.', c_btn='Get in touch'),
  'side-quests': dict(title='Side quests · Ant White', key='side', desc='Things Ant builds outside work.',
    body=head('Outside work', 'Side quests', 'A tabletop RPG, a sports federation’s transformation, small games and experiments. Same rigour, more dice.') + list_page('side', 'side-list', [('all', 'All'), ('active', 'In progress'), ('complete', 'Complete')]),
    c_label='Roll for initiative', c_title='Fancy a playtest?', c_text='MTFBWY is always after brave players and sharp-eyed rules lawyers.', c_btn='Get in touch'),
  'writing': dict(title='Writing & speaking · Ant White', key='writing', desc='Writing, speaking and teaching by Ant White.',
    body=head('Writing · Speaking · Teaching', 'Writing &amp; speaking', 'Essays, talks, mentoring and the courses I’m building. More on the way.') + '''

    <section class="band--light section">
      <div class="wrap"><ul class="wlist" data-writing></ul></div>
    </section>''',
    c_label='Speaking', c_title='Need a speaker?', c_text='AI in delivery, building design practices, designing without users. In person or remote.', c_btn='Book a talk'),
  'cv': dict(title='CV · Ant White', key='cv', desc='Ant White’s CV.', body=CV, **CTA),
  'contact': dict(title='Contact · Ant White', key='contact', desc='Get in touch with Ant White.', body=CONTACT,
    c_label='Elsewhere', c_title='Say hello', c_text='Email is quickest. LinkedIn works too.', c_btn='Back to the form'),
}
for name, d in pages.items():
    open(f'{out}/{name}.html', 'w').write(HEAD.format(**d))
print('built', len(pages))
