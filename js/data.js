/* =========================================================
   Ant White v2: content
   One source of truth for quests, writing and the CV.
   Edit here; every page re-renders from it.
   ========================================================= */

window.AW = window.AW || {};

/* Hero: "I lead design through ___." */
AW.hero = [{ word: 'AI' }, { word: 'multiplication' }, { word: 'transformation' }, { word: 'systems' }, { word: 'play' }];

/* ---------- Quests ----------
   type:     'main' (work) | 'side' (outside work)
   status:   'active' | 'complete' | 'drafting'
   featured: shows on the home page
   sector:   small label above the title
   hue:      tints the card's gradient (keep within the blues)
------------------------------------------------------------ */
AW.quests = [
  {
    id: 'nhs-apc', type: 'main', status: 'active', featured: true, hue: 212,
    sector: 'health', title: 'NHS Advice & Guidance', org: 'NHS England', year: '2026',
    summary: 'Replacing e-RS: helping the NHS see secondary care patients sooner.',
    impact: 'Leading UCD on the move to a new Advice and Guidance platform.',
    tags: ['UX strategy', 'UCD practice', 'AI agents'],
    href: 'case-studies/nhs-apc.html'
  },
  {
    id: 'westfield-health', type: 'main', status: 'complete', featured: true, hue: 198,
    sector: 'insurance', title: 'Westfield Health', org: 'Westfield Health', year: '2023–25',
    summary: 'A market-first broker quotation tool, built without talking to users.',
    impact: 'First to market. Design practice and design system from zero.',
    tags: ['Product design', 'Design system'],
    href: 'case-studies/westfield-health.html'
  },
  {
    id: 'ee-add-mobile', type: 'main', status: 'complete', featured: true, hue: 228,
    sector: 'telecoms', title: 'EE Add Mobile', org: 'EE', year: '2019–22',
    summary: 'Increasing additional product sales for EE’s digital store.',
    impact: '+31% traffic · +19% conversion · +0.7% direct channel share',
    tags: ['Product design', 'Experimentation'],
    href: 'case-studies/ee-add-mobile.html'
  },
  {
    id: 'govuk-covid', type: 'main', status: 'complete', featured: true, hue: 190,
    sector: 'government', title: 'COVID-19 reporting', org: 'UKHSA · GOV.UK', year: '2022',
    summary: 'Letting NHS Trusts and hospitals report COVID-19 test results.',
    impact: '80% faster average reporting across NHS Trusts.',
    tags: ['Interaction design', 'GDS'],
    href: 'case-studies/govuk-covid.html'
  },
  {
    id: 'ee-data-plans', type: 'main', status: 'complete', featured: true, hue: 240,
    sector: 'telecoms', title: 'EE data plans', org: 'EE', year: '2021',
    summary: 'Simplifying data plan selection.',
    impact: '29% faster task completion · 8% sales uplift.',
    tags: ['Information design', 'Commercial UX'],
    href: 'case-studies/ee-data-plans.html'
  },
  {
    id: 'sky-broadband', type: 'main', status: 'complete', featured: true, hue: 220,
    sector: 'media', title: 'Sky Broadband Hub', org: 'Sky', year: '2018–19',
    summary: 'Helping Sky Broadband customers check their service.',
    impact: 'Modernised the Broadband & Talk Hub. Patterns fed into Polaris.',
    tags: ['UI design', 'Design systems'],
    href: 'case-studies/sky-broadband.html'
  },
  {
    id: 'make-shift', type: 'main', status: 'drafting', featured: false, hue: 205,
    sector: 'professional services', title: 'Make/Shift', org: 'Accenture', year: '2025',
    summary: 'A national AI hackathon for designers.',
    impact: 'An internal event for AI upskilling and envelope-pushing.',
    tags: ['Practice', 'AI upskilling'],
    href: 'case-studies/make-shift-hackathon.html'
  },
  {
    id: 'sky-pitch', type: 'main', status: 'complete', featured: false, hue: 235,
    sector: 'media', title: 'Sky corporate pitch', org: 'Sky', year: '2019',
    summary: 'Pushing Sky’s design language to the next level.',
    impact: 'A sharper, bolder Sky.',
    tags: ['Visual design'],
    href: 'case-studies/sky-corporate-pitch.html'
  },

  /* ---- Side quests ---- */
  {
    id: 'mtfbwy', type: 'side', status: 'active', featured: true, hue: 250,
    sector: 'tabletop games', title: 'MTFBWY RPG', org: 'Personal', year: 'Ongoing',
    summary: 'Designing a Star Wars-inspired tabletop RPG from scratch.',
    impact: 'Rules, character sheets, GM tools and a virtual tabletop. Closed beta v1.1.1.',
    tags: ['Game design', 'Systems'],
    href: 'case-studies/mtfbwy-rpg.html'
  },
  {
    id: 'ynepf', type: 'side', status: 'active', featured: true, hue: 195,
    sector: 'sport', title: 'YNE Powerlifting', org: 'YNE Powerlifting Federation', year: 'Ongoing',
    summary: 'Transforming a regional, volunteer-run powerlifting federation.',
    impact: 'Co-Chair, leading strategy and the digital experience.',
    tags: ['Transformation', 'Strategy'],
    href: ''
  },
  {
    id: 'rate-race', type: 'side', status: 'complete', featured: true, hue: 238,
    sector: 'web toys', title: 'Rate Race', org: 'Personal', year: '2025',
    summary: 'A silly IMDb rating game for losing to your friends.',
    impact: 'Guess the rating. Lose to your friends. Play it now.',
    tags: ['Game'],
    href: 'https://rate-race.vercel.app', external: true
  }
];

/* ---------- How I work (home, dark band) ---------- */
AW.practice = [
  { key: 'ai', label: 'AI, done properly', stat: 'Agents in delivery',
    body: 'Agentic tooling that speeds delivery without replacing judgement: spec-writing agents for the GOV.UK Prototype Kit, research synthesis, rapid proofs of concept.',
    link: { text: 'How I think about AI', href: 'ai-policy.html' } },
  { key: 'transform', label: 'Transformation', stat: 'Practices built from zero',
    body: 'Design practices and systems built where there were none, research without user access, and a volunteer federation taken from spreadsheets to strategy.',
    link: { text: 'Main quests', href: 'main-quests.html' } },
  { key: 'game', label: 'Game design', stat: 'Weekly playtests',
    body: 'MTFBWY is my systems-thinking gym: designing rules, the interfaces to the rules, and how players learn them from the interfaces.',
    link: { text: 'Side quests', href: 'side-quests.html' } }
];

/* ---------- Writing & speaking ---------- */
AW.writing = [
  { kind: 'Writing',  title: 'On AI: a sceptic’s working position', meta: 'Essay', year: '2026', href: 'ai-policy.html' },
  { kind: 'Speaking', title: 'Agentic prototyping in the NHS', meta: 'Internal talk', year: '2026' },
  { kind: 'Teaching', title: 'Mentoring designers', meta: 'Seven reports, two mentees', year: 'Ongoing' },
  { kind: 'Writing',  title: 'Designing without users', meta: 'Coming soon', year: '', soon: true },
  { kind: 'Course',   title: 'AI for design leaders', meta: 'In the works', year: '', soon: true }
];

/* ---------- CV ---------- */
AW.cv = [
  { org: 'NHS England', role: 'UCD Lead', from: 2026, to: null, tags: ['Leadership', 'AI'],
    notes: ['Leading user-centred design on the replacement for e-RS Advice and Guidance.', 'Built agentic tooling for spec generation in the GOV.UK Prototype Kit.'] },
  { org: 'AstraZeneca', role: 'Lead Designer, AI Transform', via: 'Accenture', from: 2025, to: 2026, tags: ['AI', 'Leadership'],
    notes: ['Design lead on an enterprise AI transformation programme.'] },
  { org: 'Westfield Health', role: 'Lead UX Designer', via: 'Accenture', from: 2023, to: 2025, tags: ['Product', 'Systems'],
    notes: ['One-person UX team on a first-to-market broker platform.', 'Design practice and design system from zero.'] },
  { org: 'Accenture', role: 'Senior Design Consultant', from: 2022, to: null, tags: ['Leadership'],
    notes: ['Line manager to seven designers across seniorities.', 'Practice contribution and AI upskilling (Make/Shift).'] },
  { org: 'Ministry of Defence', role: 'Senior UX Designer', via: 'Accenture', from: 2022, to: 2023, tags: ['Product'],
    notes: ['Discovery and pitch work.'] },
  { org: 'UK Health Security Agency', role: 'Senior Interaction Designer', via: 'Accenture', from: 2022, to: 2022, tags: ['Product', 'Systems'],
    notes: ['80% reduction in average reporting times across NHS Trusts.', 'Extended the GDS Design System for clinical workflows.'] },
  { org: 'BT Consumer (EE)', role: 'Lead Product Designer', from: 2019, to: 2022, tags: ['Product', 'Leadership'],
    notes: ['+31% traffic, +19% conversion, +0.7% direct channel share on Add Mobile.', '29% faster task completion on SIM-only plans.', 'Mentoring, Loop design system, Figma adoption.'] },
  { org: 'Sky', role: 'UI Designer', from: 2018, to: 2019, tags: ['Craft', 'Systems'],
    notes: ['Broadband & Talk Hub redesign.', 'Contributor to the Polaris design system.'] },
  { org: 'Bolser', role: 'UX/UI Designer', from: 2016, to: 2018, tags: ['Craft'], notes: [] },
  { org: 'United by Design', role: 'Junior Graphic Designer', from: 2015, to: 2016, tags: ['Craft'], notes: [] },
  { org: 'Bloom (Jaywing)', role: 'Junior Creative', from: 2014, to: 2015, tags: ['Craft'], notes: [] }
];

AW.clients = ['NHS England', 'AstraZeneca', 'Ministry of Defence', 'GOV.UK', 'UKHSA', 'Accenture', 'EE', 'BT', 'Sky', 'Westfield Health'];
