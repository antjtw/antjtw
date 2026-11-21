/* =========================================================
   Ant White v2: content
   One source of truth for quests, inventory and the CV.
   Edit here; every page re-renders from it.
   ========================================================= */

window.AW = window.AW || {};

/* Hero: "I lead design through ___." Each word drives a diagram panel. */
AW.hero = [
  { word: 'AI',             tab: 'Agents',     scene: 'agents',  cap: 'Agents that turn user needs into prototype specs, with a human signing every one off.' },
  { word: 'multiplication', tab: 'Teams',      scene: 'teams',   cap: 'One lead, many better designers. Seven reports, two mentees, and counting.' },
  { word: 'transformation', tab: 'Practice',   scene: 'practice',cap: 'Design practices and systems built from nothing, in places that needed them.' },
  { word: 'systems',        tab: 'Components', scene: 'systems', cap: 'Tokens to components to screens: how the pieces fit, drawn at every level.' },
  { word: 'play',           tab: 'Rules',      scene: 'rules',   cap: 'Rules, then the interfaces to the rules, then how players learn them.' }
];

/* ---------- Quests ----------
   type:     'main' (work) | 'side' (outside work)
   status:   'active' | 'complete' | 'drafting'
   featured: shows on the home page
   href:     detail page (old case studies for now)
   hue:      tints the card glow; keep within the blue family
------------------------------------------------------------ */
AW.quests = [
  {
    id: 'nhs-apc', short: 'NHS Advice & Guidance', sector: 'health', type: 'main', status: 'active', featured: true,
    title: 'Replacing e-RS: helping the NHS see secondary care patients sooner',
    org: 'NHS England', year: '2026', role: 'UCD Lead',
    tags: ['UX strategy', 'UCD practice', 'AI agents'],
    loot: 'Leading UCD on the move to a new Advice and Guidance platform.',
    href: '../case-studies/nhs-apc.html', hue: 210
  },
  {
    id: 'westfield-health', short: 'Westfield Health', sector: 'insurance', type: 'main', status: 'complete', featured: true,
    title: 'A market-first broker quotation tool, built without talking to users',
    org: 'Westfield Health', year: '2023–25', role: 'Lead UX Designer',
    tags: ['Product design', 'Design system', 'Practice from zero'],
    loot: 'First-to-market self-serve platform. Design practice and system from zero.',
    href: '../case-studies/westfield-health.html', hue: 200
  },
  {
    id: 'ee-add-mobile', short: 'EE Add Mobile', sector: 'telecoms', type: 'main', status: 'complete', featured: true,
    title: 'Increasing additional product sales for EE’s digital store',
    org: 'EE', year: '2019–22', role: 'Lead Product Designer',
    tags: ['Product design', 'Experimentation'],
    loot: '+31% traffic · +19% conversion · +0.7% direct channel share',
    href: '../case-studies/ee-add-mobile.html', hue: 225
  },
  {
    id: 'govuk-covid', short: 'COVID-19 reporting', sector: 'government', type: 'main', status: 'complete', featured: false,
    title: 'Letting Trusts and hospitals report COVID-19 test results',
    org: 'GOV.UK · UKHSA', year: '2022', role: 'Senior Interaction Designer',
    tags: ['Interaction design', 'GDS'],
    loot: '80% faster average reporting across NHS Trusts.',
    href: '../case-studies/govuk-covid.html', hue: 195
  },
  {
    id: 'ee-data-plans', short: 'EE data plans', sector: 'telecoms', type: 'main', status: 'complete', featured: false,
    title: 'Simplifying data plan selection',
    org: 'EE', year: '2021', role: 'Senior Product Designer',
    tags: ['Information design', 'Commercial UX'],
    loot: '29% faster task completion · 8% sales uplift.',
    href: '../case-studies/ee-data-plans.html', hue: 215
  },
  {
    id: 'sky-broadband', short: 'Sky Broadband Hub', sector: 'media & broadband', type: 'main', status: 'complete', featured: false,
    title: 'Helping Sky Broadband customers check their service',
    org: 'Sky', year: '2018–19', role: 'UI Designer',
    tags: ['UI design', 'Polaris design system'],
    loot: 'Modernised the Broadband & Talk Hub. Patterns fed into Polaris.',
    href: '../case-studies/sky-broadband.html', hue: 230
  },
  {
    id: 'make-shift', short: 'Make/Shift', sector: 'professional services', type: 'main', status: 'drafting', featured: false,
    title: 'A national AI hackathon for designers',
    org: 'Accenture', year: '2025', role: 'Organiser & designer',
    tags: ['Practice', 'AI upskilling'],
    loot: 'An internal event for AI upskilling and envelope-pushing.',
    href: '../case-studies/make-shift-hackathon.html', hue: 205
  },
  {
    id: 'sky-pitch', short: 'Sky corporate pitch', sector: 'media & broadband', type: 'main', status: 'complete', featured: false,
    title: 'Sky corporate pitch',
    org: 'Sky', year: '2019', role: 'UI Designer',
    tags: ['Visual design'],
    loot: 'Pushing Sky’s design language to the next level.',
    href: '../case-studies/sky-corporate-pitch.html', hue: 220
  },

  /* ---- Side quests ---- */
  {
    id: 'mtfbwy', short: 'MTFBWY RPG', sector: 'tabletop games', type: 'side', status: 'active', featured: true,
    title: 'Designing a Star Wars-inspired tabletop RPG from scratch',
    org: 'Personal', year: 'Ongoing', role: 'Game & UX designer',
    tags: ['Game design', 'Systems', 'Virtual tabletop'],
    loot: 'Rules, character sheets, GM tools and a VTT. Closed beta v1.1.1.',
    href: '../case-studies/mtfbwy-rpg.html', hue: 250
  },
  {
    id: 'ynepf', short: 'YNE Powerlifting', sector: 'sport', type: 'side', status: 'active', featured: true,
    title: 'Transforming a regional powerlifting federation',
    org: 'Yorkshire & North East Powerlifting', year: 'Ongoing', role: 'Co-Chair',
    tags: ['Transformation', 'Strategy', 'Digital'],
    loot: 'Strategy and digital experience for a volunteer-run sport.',
    href: '#', hue: 190
  },
  {
    id: 'rate-race', short: 'Rate Race', sector: 'web toys', type: 'side', status: 'complete', featured: true,
    title: 'A silly IMDb rating game for losing to your friends',
    org: 'Personal', year: '2025', role: 'Maker',
    tags: ['Vibe-coded', 'Game'],
    loot: 'Guess the rating. Lose to your friends. Play it now.',
    href: 'https://rate-race.vercel.app', external: true, hue: 240
  }
];

/* ---------- Practice pillars (home) ---------- */
AW.practice = [
  {
    key: 'ai',
    label: 'AI, done properly',
    body: 'Agentic tooling that speeds delivery without replacing judgement: spec-writing agents for the GOV.UK Prototype Kit, research synthesis, rapid proofs of concept. Sceptical, practical, measured.',
    stat: 'Agents in production', link: { text: 'How I think about AI', href: '../ai-policy.html' }
  },
  {
    key: 'transform',
    label: 'Transformation',
    body: 'Building design practices where there were none. Design systems from zero, research ops without user access, and taking volunteer organisations from spreadsheets to strategy.',
    stat: '3 practices built', link: { text: 'See the main quests', href: 'main-quests.html' }
  },
  {
    key: 'game',
    label: 'Game design',
    body: 'MTFBWY is my systems-thinking gym. Designing rules, then the interfaces to those rules, then how players learn them from the interfaces, all the way down.',
    stat: 'Weekly playtests', link: { text: 'Read the side quest', href: 'side-quests.html' }
  }
];

/* ---------- Inventory: speaking, writing, teaching ---------- */
AW.inventory = [
  { kind: 'Writing',  title: 'On AI: a sceptic’s working position', meta: 'Essay', href: '../ai-policy.html', unlocked: true },
  { kind: 'Speaking', title: 'Agentic prototyping in the NHS',        meta: 'Internal talk', unlocked: true },
  { kind: 'Teaching', title: 'Mentoring: seven reports, two mentees',   meta: 'Ongoing', unlocked: true },
  { kind: 'Writing',  title: 'Designing without users',                 meta: 'Drafting', unlocked: false },
  { kind: 'Course',   title: 'AI for design leaders',                   meta: 'In the forge', unlocked: false },
  { kind: 'Speaking', title: 'Your event here',                         meta: 'Open slot', unlocked: false }
];

/* ---------- CV ---------- */
AW.cv = [
  { org: 'NHS England', role: 'UCD Lead', from: 2026, to: null, tags: ['Leadership', 'AI'],
    notes: ['Leading user-centred design on the replacement for e-RS Advice and Guidance.', 'Built agentic tooling for spec generation in the GOV.UK Prototype Kit.'] },
  { org: 'AstraZeneca', role: 'Lead Designer, AI Transform', via: 'Accenture', from: 2025, to: 2026, tags: ['AI', 'Leadership'],
    notes: ['Design lead on an enterprise AI transformation programme.'] },
  { org: 'Accenture', role: 'Senior Design Consultant', from: 2022, to: null, tags: ['Leadership', 'Practice'],
    notes: ['Line manager to seven designers across seniorities.', 'Practice contribution and AI upskilling (Make/Shift).'] },
  { org: 'Westfield Health', role: 'Lead UX Designer', via: 'Accenture', from: 2023, to: 2025, tags: ['Product', 'Systems'],
    notes: ['One-person UX team on a first-to-market broker platform.', 'Design practice and design system from zero.'] },
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

AW.stats = [
  { name: 'Leadership', value: 92 },
  { name: 'Systems thinking', value: 95 },
  { name: 'Research', value: 86 },
  { name: 'AI & automation', value: 88 },
  { name: 'Visual craft', value: 84 },
  { name: 'Star Wars lore', value: 100 }
];

AW.clients = ['NHS England', 'AstraZeneca', 'Ministry of Defence', 'GOV.UK', 'UKHSA', 'Accenture', 'EE', 'BT', 'Sky', 'Westfield Health'];
