"""Build the writing pages (essays) in the site's design.
Usage: python3 tools/build_writing.py <repo>
- writing/on-ai-revisited.html  : Ant's current view on AI (Nov 2026), from his dictated notes
- ai-policy.html                : the original essay, restyled, text unchanged, pointing to the update
The original essay's copy is read from commit d6b0d61 so the text stays exactly as written."""
import sys, subprocess, html
from bs4 import BeautifulSoup

repo = sys.argv[1]

NEW = dict(
    path='writing/on-ai-revisited.html', base='../',
    title='On AI, revisited',
    eyebrow='Writing · Essay · November 2026',
    standfirst='I’m still a sceptic, and it’s still a tool. But it’s a tool that multiplies what people can do, and the best thing it does is take the grind out of work so we can get back to the human bits.',
    body='''
<h2 data-reveal>Still a sceptic</h2>
<p>I still hold my scepticism, and I still ask what all of this means for the planet. And yes, it’s a tool. But it’s a tool that empowers people. It’s a force multiplier, and something you can engage with to craft some genuinely compelling things.</p>

<h2 data-reveal>Vague in, vague out</h2>
<p>If you plug something vague and generic into AI, you’ll get something vague and generic out. That’s the same as everything.</p>
<p>Give it proper context. Build robust skills that it can use. Give it clear instructions about what to output, in what format and in what context. Do that, and you get to a really robust place.</p>

<h2 data-reveal>Taking out the grind</h2>
<p>It’s extremely good at removing monotony. We’ve found that. It’s good at pattern recognition, and it’s good at taking work that is effectively grind and optimising it.</p>
<p>It’s got to the point where I now teach other people how to use AI, right down to using SharePoint agents to dig through folders and find things. There’s so much more to it than a large language model spitting out data. It can help you find things and do things effectively, and put the people back into the human part of work.</p>

<h2 data-reveal>We’ve been acting as computers</h2>
<p>For a long time now, we’ve done jobs that belong to computers. We’ve done them by hand and called it work. We’ve called it meaning.</p>
<blockquote class="qquote" data-reveal><p>We should be focusing on the things that are human to human: empathy, feeling and emotion. The things a computer can never do.</p></blockquote>
<p>Not monotonous tasks that, really, anyone could be taught to do. The tangible things, the soft skills, the work that needs people interacting with people.</p>

<h2 data-reveal>What it can do, and what it can’t</h2>
<p>We can teach a large language model to sift through a transcript, spot themes and turn them into a thematic analysis. That’s not a problem.</p>
<p>What we can’t do is teach it to sit with someone in an interview and build a genuine connection, the kind that beats the uncanny valley in user research. It can’t design with the same emotion as a human. It can replicate the patterns of a design system, but it can’t express itself on a page, or clearly articulate designs that meet a user need. Not yet, anyway. It can’t envision bold and brave new ideas. It repeats patterns it’s seen before.</p>
<p>So let it take away the monotony, and let us use our brains for the things that are truly human. That’s how we drive ourselves forward: by focusing on the work that needs thinking. The cool stuff. The exciting stuff.</p>

<h2 data-reveal>We’ve been here before</h2>
<p>In a way, it’s like design systems. When they came along, there was resistance. People didn’t want every component on a sticker sheet. They wanted to build things by hand.</p>
<p>My answer was no: this removes the painful stuff, the easy stuff, so you can focus on the interesting work. That’s exactly what AI is at present. A multiplier.</p>

<h2 data-reveal>From maker to manager</h2>
<p>It can do incredible things really quickly. It can get a first pass around 85% of the way there. You’re still the stage gate, doing all the checking and approving and making sure you’re happy. In effect, it makes you a manager of your own output.</p>
<p>We’re moving from creating to curating, and to being something like a reviewer working with a team. You review the output of agents, get them working together and producing things. It’s no different from stepping up into management. We can even get to the point of building whole product and design teams of agents, which is incredible.</p>
<p>It’s also good for spotting opportunities and synthesising data in ways we’d never think of, like pulling user needs together into one solid matrix. But only if we teach it how, and give it the same skills we’d give to people.</p>

<h2 data-reveal>Teaching it how we think</h2>
<p>In our own heads, we build models of reason. We can still build those, and hand them to AI for the things we find monotonous.</p>
<p>Some work is highly skilled because it’s creative and complex, and that will always need a human. But is some work “highly skilled” only because we’ve built those patterns into our brains to solve problems? If so, can we not hand some of that off?</p>
<p>That’s where this gets a bit philosophical, and I don’t have a tidy answer yet.</p>

<h2 data-reveal>And yet</h2>
<p>None of this cancels the scepticism. I still don’t know what it all means for the planet, and I don’t think that question should go away. But the tool is here, and it’s at its best when it gives people their time back for the human work.</p>

<p class="essay-note">How this was written: I talked these thoughts through out loud, and used AI to tidy and structure the transcript. The views and the words are mine. My earlier position is in <a href="../ai-policy.html">On AI: a sceptic’s working position</a>.</p>
''',
    more=('ai-policy.html', 'On AI: a sceptic’s working position', 'Earlier in 2026'),
)

def old_essay():
    src = subprocess.run(['git', '-C', repo, 'show', 'd6b0d61:ai-policy.html'], capture_output=True, text=True, check=True).stdout
    soup = BeautifulSoup(src, 'html.parser')
    body = soup.select_one('.case-page__body')
    out = []
    for el in body.find_all(['p', 'h2', 'h3'], recursive=False):
        inner = el.decode_contents().strip()
        if not el.get_text(strip=True):
            continue
        if el.name in ('h2', 'h3') or 'case-page__lead-in' in (el.get('class') or []):
            out.append(f'<h2 data-reveal>{inner}</h2>')
        else:
            out.append(f'<p>{inner}</p>')
    # The page's own h2 ("How I think about AI") is the title; drop it from the body if repeated
    return soup.select_one('.case-page h1').get_text(strip=True), '\n'.join(out)

old_label, old_body = old_essay()
OLD = dict(
    path='ai-policy.html', base='',
    title='On AI: a sceptic’s working position',
    eyebrow='Writing · Essay · Earlier in 2026',
    standfirst='Where I stood on AI earlier in 2026: a sceptic, not a refusenik.',
    body='<p class="essay-update" data-reveal><strong>My thinking has moved on.</strong> Read <a href="writing/on-ai-revisited.html">On AI, revisited</a> (November 2026) for where I am now.</p>\n' + old_body,
    more=('writing/on-ai-revisited.html', 'On AI, revisited', 'November 2026'),
)

TEMPLATE = '''<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{title_text} · Ant White</title>
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
  <link rel="preload" href="{base}fonts/Copernicus-Bold.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="{base}fonts/Copernicus-Book.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap">
  <link rel="stylesheet" href="{base}css/site.css">
</head>
<body data-page="writing" data-base="{base}">
  <a class="skip" href="#main">Skip to content</a>
  <div data-nav></div>

  <main id="main">
    <header class="band--dark qhead">
      <div class="wrap">
        <a class="qhead__back" href="{base}writing.html">← Writing &amp; speaking</a>
        <span class="eyebrow">{eyebrow}</span>
        <h1 class="qhead__title">{title}</h1>
        <p class="qhead__lede">{standfirst}</p>
      </div>
    </header>

    <article class="band--light qbody">
      <div class="wrap qbody__wrap">
        <div class="qprose">
{body}
        </div>
      </div>
    </article>

    <section class="band--light qnext-wrap">
      <div class="wrap">
        <a class="qnext glow-card" href="{base}{more_href}" data-reveal>
          <span class="eyebrow">More writing · {more_meta}</span>
          <span class="qnext__title">{more_title}</span>
          <span class="qnext__go" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  </main>

  <section class="band--dark band--quiet">
    <div class="wrap cta">
      <span class="eyebrow">Talk to me about it</span>
      <h2 class="cta__title">Want to dig in?</h2>
      <p>Happy to talk AI in delivery, teaching teams to use it well, or where you think I’ve got it wrong.</p>
      <a class="btn" href="{base}contact.html">Get in touch <span class="btn__arrow" aria-hidden="true">→</span></a>
    </div>
    <div data-footer></div>
  </section>

  <script src="{base}vendor/gsap.min.js"></script>
  <script src="{base}vendor/ScrollTrigger.min.js"></script>
  <script src="{base}vendor/lenis.min.js"></script>
  <script src="{base}js/data.js"></script>
  <script src="{base}js/site.js"></script>
</body>
</html>
'''

for e in (NEW, OLD):
    more_href, more_title, more_meta = e['more']
    page = TEMPLATE.format(
        title_text=html.escape(e['title']), desc=html.escape(e['standfirst']), base=e['base'],
        eyebrow=e['eyebrow'], title=e['title'], standfirst=e['standfirst'],
        body=e['body'].replace('../ai-policy.html', e['base'] + 'ai-policy.html') if e['base'] else e['body'],
        more_href=more_href, more_title=more_title, more_meta=more_meta)
    import os
    os.makedirs(os.path.dirname(os.path.join(repo, e['path'])) or repo, exist_ok=True)
    open(os.path.join(repo, e['path']), 'w').write(page)
    print('built', e['path'])
