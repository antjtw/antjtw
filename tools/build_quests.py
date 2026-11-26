"""Rebuild the case studies (quest pages) in the new design.
Reads the old markup from a git ref so it can be re-run safely, keeps each page's
copy, and writes case-studies/<slug>.html in the new template.
Usage: python3 -I build_quests.py <repo> <git-ref-with-old-pages>"""
import sys, subprocess, re, html
from bs4 import BeautifulSoup, NavigableString, Comment

repo, ref = sys.argv[1], sys.argv[2]

# slug -> data.js quest id, in quest order (main first, then side)
PAGES = [
    ('nhs-apc', 'nhs-apc', 'main', 'health', 212),
    ('westfield-health', 'westfield-health', 'main', 'insurance', 198),
    ('ee-add-mobile', 'ee-add-mobile', 'main', 'telecoms', 228),
    ('govuk-covid', 'govuk-covid', 'main', 'government', 190),
    ('ee-data-plans', 'ee-data-plans', 'main', 'telecoms', 240),
    ('sky-broadband', 'sky-broadband', 'main', 'media', 220),
    ('make-shift-hackathon', 'make-shift', 'main', 'professional services', 205),
    ('sky-corporate-pitch', 'sky-pitch', 'main', 'media', 235),
    ('mtfbwy-rpg', 'mtfbwy', 'side', 'tabletop games', 250),
]

# Additions from the 2025 interview deck (docs/figma-deck-index.md)
ADD_AFTER_HEADING = {
    'westfield-health': ('Where the project landed',
        '<p>Before launch, testing with our pseudo-users showed a <strong>45% reduction in task time</strong> compared with the old manual quoting process.</p>'),
}

# Corrections to the old copy (titles changed since it was written)
TEXT_FIXES = {
    'nhs-apc': [('UCD Lead', 'UCD Cluster Lead')],
}

def git_show(path):
    return subprocess.run(['git', '-C', repo, 'show', f'{ref}:{path}'], capture_output=True, text=True, check=True).stdout

def inner(tag):
    return ''.join(str(c) for c in tag.contents if not isinstance(c, Comment)).strip()

def figure(n, caption, hue):
    arts = ''.join(f'<div class="qfig__art" style="--h:{hue + i * 14}"><span>Screens shared on request</span></div>' for i in range(n))
    cap = f'<figcaption>{caption}</figcaption>' if caption else ''
    return f'<figure class="qfig{" qfig--2up" if n > 1 else ""}" data-reveal><div class="qfig__row">{arts}</div>{cap}</figure>'

def convert(slug, qid, qtype, sector, hue, nxt):
    soup = BeautifulSoup(git_show(f'case-studies/{slug}.html'), 'html.parser')
    page = soup.select_one('.case-page')
    h1 = inner(page.find('h1'))
    title_text = page.find('h1').get_text(' ', strip=True)
    chips = [c.get_text(strip=True) for c in page.select('.case-page__chips .chip')]
    draft = 'In progress' in chips or soup.find(string=re.compile('being written')) is not None

    notice = ''
    for pull in page.select('.case-page__pull'):
        if pull.find_parent(class_='case-page__body') is None:
            notice = inner(pull.find('p'))
    hero = page.select_one('.case-page__hero-img')
    hero_cap = ''
    if hero:
        sib = hero.find_next_sibling()
        if sib is not None and 'case-page__caption' in (sib.get('class') or []):
            hero_cap = inner(sib)

    meta = []
    for d in page.select('.case-page__meta > div'):
        dt, dd = d.find('dt'), d.find('dd')
        val = inner(dd) if dd else ''
        if val:
            meta.append((dt.get_text(strip=True), val))

    # Body: lead-ins become headings; skip headings with no content (draft outlines)
    blocks, pending_cap = [], None
    body = page.select_one('.case-page__body')
    kids = [k for k in body.children if not isinstance(k, (NavigableString, Comment)) or (isinstance(k, NavigableString) and k.strip() and not isinstance(k, Comment))]
    for i, k in enumerate(kids):
        if isinstance(k, NavigableString):
            continue
        cls = k.get('class') or []
        if 'case-page__next' in cls:
            continue
        if 'case-page__lead-in' in cls:
            blocks.append(('h2', inner(k)))
        elif 'case-page__caption' in cls:
            if blocks and blocks[-1][0] == 'fig':
                blocks[-1] = ('fig', blocks[-1][1], inner(k))
        elif 'case-page__image' in cls:
            blocks.append(('fig', 1, ''))
        elif 'case-page__images-2up' in cls:
            blocks.append(('fig', 2, ''))
        elif 'case-page__pull' in cls:
            ps = [inner(p) for p in k.find_all('p') if p.get_text(strip=True)]
            if ps:
                blocks.append(('quote', ''.join(f'<p>{x}</p>' for x in ps)))
        elif k.name == 'p':
            if k.get_text(strip=True):
                blocks.append(('p', inner(k)))
        elif k.name in ('ul', 'ol'):
            blocks.append(('list', str(k)))
    # A draft outline has headings and image slots but no words: treat it as a stub
    if not any(b[0] in ('p', 'quote', 'list') for b in blocks):
        blocks = []
    # drop empty headings (a heading followed by another heading or nothing)
    clean = []
    for j, b in enumerate(blocks):
        if b[0] == 'h2':
            rest = blocks[j + 1:]
            if not rest or rest[0][0] == 'h2':
                continue
        clean.append(b)

    out = []
    for b in clean:
        if b[0] == 'h2':
            out.append(f'<h2 data-reveal>{b[1]}</h2>')
        elif b[0] == 'p':
            out.append(f'<p>{b[1]}</p>')
        elif b[0] == 'quote':
            out.append(f'<blockquote class="qquote" data-reveal>{b[1]}</blockquote>')
        elif b[0] == 'fig':
            out.append(figure(b[1], b[2], hue))
        elif b[0] == 'list':
            out.append(b[1])
    body_html = '\n          '.join(out)
    if slug in ADD_AFTER_HEADING:
        head, extra = ADD_AFTER_HEADING[slug]
        m = re.search(rf'<h2 data-reveal>{re.escape(head)}</h2>\s*<p>.*?</p>', body_html, re.S)
        if m:
            body_html = body_html[:m.end()] + '\n          ' + extra + body_html[m.end():]

    if draft and not clean:
        body_html = (f'<div class="qdraft" data-reveal><span class="eyebrow">Quest log being written</span>'
                     f'<p>{notice or "This write-up is on its way."}</p>'
                     f'<a class="btn" href="../contact.html">Ask me about it <span class="btn__arrow" aria-hidden="true">→</span></a></div>')

    status = 'In progress' if 'In progress' in chips else ('Being written' if draft else 'Complete')
    kind = 'Side quest' if qtype == 'side' else 'Main quest'
    meta_html = ''.join(f'<div><dt>{html.escape(k)}</dt><dd>{v}</dd></div>' for k, v in meta)
    tags = ''.join(f'<span class="qtag">{html.escape(c)}</span>' for c in chips if c not in ('In progress', 'Short read'))
    hero_html = figure(1, hero_cap, hue) if hero is not None else ''
    nslug, ntitle, ntype = nxt
    listing = 'side-quests.html' if qtype == 'side' else 'main-quests.html'

    return TEMPLATE.format(
        title=html.escape(title_text), key=qtype, kind=kind, sector=html.escape(sector), status=status,
        h1=h1, tags=tags, meta=meta_html, hero=hero_html, body=body_html,
        next_href=f'{nslug}.html', next_title=ntitle, next_kind='Side quest' if ntype == 'side' else 'Main quest',
        listing=listing, listing_label='All side quests' if qtype == 'side' else 'All main quests', hue=hue)

TEMPLATE = '''<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{title} · Ant White</title>
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
  <link rel="preload" href="../fonts/Copernicus-Bold.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="../fonts/Copernicus-Book.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap">
  <link rel="stylesheet" href="../css/site.css">
</head>
<body data-page="{key}" data-base="../">
  <a class="skip" href="#main">Skip to content</a>
  <div data-nav></div>

  <main id="main">
    <header class="band--dark qhead">
      <div class="wrap">
        <a class="qhead__back" href="../{listing}">← {listing_label}</a>
        <span class="eyebrow">{kind} · {sector} · {status}</span>
        <h1 class="qhead__title">{h1}</h1>
        <div class="qhead__tags">{tags}</div>
        <dl class="qmeta">{meta}</dl>
      </div>
    </header>

    <article class="band--light qbody" style="--hue:{hue}">
      <div class="wrap qbody__wrap">
        {hero}
        <div class="qprose">
          {body}
        </div>
      </div>
    </article>

    <section class="band--light qnext-wrap">
      <div class="wrap">
        <a class="qnext glow-card" href="{next_href}" data-reveal>
          <span class="eyebrow">Next · {next_kind}</span>
          <span class="qnext__title">{next_title}</span>
          <span class="qnext__go" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  </main>

  <section class="band--dark band--quiet">
    <div class="wrap cta">
      <span class="eyebrow">Want the full story?</span>
      <h2 class="cta__title">Ask for the deep cut</h2>
      <p>The NDA bits are best told in person. Happy to walk you through this one.</p>
      <a class="btn" href="../contact.html">Get in touch <span class="btn__arrow" aria-hidden="true">→</span></a>
    </div>
    <div data-footer></div>
  </section>

  <script src="../vendor/gsap.min.js"></script>
  <script src="../vendor/ScrollTrigger.min.js"></script>
  <script src="../vendor/lenis.min.js"></script>
  <script src="../js/data.js"></script>
  <script src="../js/site.js"></script>
</body>
</html>
'''

titles = {}
for slug, *_ in PAGES:
    s = BeautifulSoup(git_show(f'case-studies/{slug}.html'), 'html.parser')
    titles[slug] = s.select_one('.case-page h1').decode_contents().strip()
for i, (slug, qid, qtype, sector, hue) in enumerate(PAGES):
    nslug = PAGES[(i + 1) % len(PAGES)][0]
    nxt = (nslug, titles[nslug], PAGES[(i + 1) % len(PAGES)][2])
    out = convert(slug, qid, qtype, sector, hue, nxt)
    for old, new in TEXT_FIXES.get(slug, []):
        out = out.replace(old, new)
    open(f'{repo}/case-studies/{slug}.html', 'w').write(out)
    print('built', slug)
