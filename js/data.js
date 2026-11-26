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
    sector: 'sport', title: 'Yorkshire and North East Powerlifting Federation', org: 'Yorkshire and North East Powerlifting Federation', year: 'Ongoing',
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
  { kind: 'Writing',  title: 'On AI, revisited', meta: 'Essay', year: 'Nov 2026', href: 'writing/on-ai-revisited.html' },
  { kind: 'Writing',  title: 'On AI: a sceptic’s working position', meta: 'Essay', year: 'Early 2026', href: 'ai-policy.html' },
  { kind: 'Speaking', title: 'Agentic prototyping in the NHS', meta: 'Internal talk', year: '2026' },
  { kind: 'Teaching', title: 'Leading and mentoring designers', meta: 'People Lead for two, seven reports, three mentees', year: 'Ongoing' },
  { kind: 'Writing',  title: 'Designing without users', meta: 'Coming soon', year: '', soon: true },
  { kind: 'Course',   title: 'AI for design leaders', meta: 'In the works', year: '', soon: true }
];

/* ---------- CV ----------
   Accenture is a consultancy, so client roles sit inside it (clients[]).
   tags drive the skill filter on the CV page. */
AW.cv = [
  {
    org: 'Accenture Software & Platform Engineering', role: 'Senior Design Consultant', from: 'Jun 2022', to: null,
    tags: ['Leadership', 'AI', 'Product', 'Systems'],
    notes: [
      'National Product Design Discipline Lead: leading the practice community, learning pathways and team up-skilling.',
      'Teaching Lead for Modern Health Practitioners, AI up-skilling for the UK Health accounts.',
      'Lead for outreach with Ahead Partnership.',
      'People Lead for two Accenture designers.',
      'Line manager to seven on-account reports, covering pastoral care and mentoring.'
    ],
    clients: [
      { org: 'NHS England (Referrals and Appointments)', role: 'UCD Cluster Lead', from: 'Jan 2026', to: null, tags: ['Leadership', 'AI'],
        notes: ['Joined as Lead Interaction Designer, moonlighting as a User Researcher, before stepping up to UCD Cluster Lead.', 'Leading user-centred design on the replacement for e-RS Advice and Guidance.', 'Built agentic tooling for spec generation in the GOV.UK Prototype Kit.'] },
      { org: 'AstraZeneca', role: 'Lead UX Designer', from: 'Oct 2025', to: 'Jan 2026', tags: ['AI', 'Leadership'],
        notes: ['Lead UX Designer on an AI pitch.'] },
      { org: 'Westfield Health', role: 'Lead UX Designer', from: 'Mar 2023', to: 'Sep 2025', tags: ['Product', 'Systems'],
        notes: ['One-person UX team within a software migration project.', 'Introduced and cultivated user-led design as a generalist designer.', 'Built the design practice and design system from zero.'] },
      { org: 'Ministry of Defence (Armed Forces Recruitment Programme)', role: 'Senior UX Designer', from: 'Nov 2022', to: 'Jan 2023', tags: ['Product'],
        notes: ['Worked through the discovery and pitch process of a new app.', 'Mentored junior and mid-weight UX designers.'] },
      { org: 'UK Health (NHS Test & Trace Programme)', role: 'Senior Interaction Designer', from: 'Jun 2022', to: 'Nov 2022', tags: ['Product', 'Systems'],
        notes: ['Worked in the Organisation Testing team.', 'Produced end-to-end experiences for the Test & Trace portal on GOV.UK with the wider programme team.', 'Delivered experiences for testing using the GOV.UK Prototype Kit.', 'Worked with and contributed to the GDS Design System.', '80% reduction in average reporting times across NHS Trusts.'] }
    ]
  },
  { org: 'BT Consumer (EE)', role: 'Lead Product Designer', from: 'Nov 2019', to: 'Jun 2022', tags: ['Product', 'Leadership', 'Systems'],
    notes: ['Delivered high-performing, design-led changes that significantly increased customer satisfaction and revenue.', '+31% traffic, +19% conversion and +0.7% direct channel share on Add Mobile; 29% faster task completion on SIM-only plans.', 'Championed user-led design and pushed design culture.', 'Mentored junior and mid-weight designers.', 'Led tool (Figma) and new methodology adoption.', 'Helped create a multi-brand design system (Loop).'] },
  { org: 'Sky', role: 'UI Designer', from: 'May 2018', to: 'Nov 2019', tags: ['Craft', 'Systems'],
    notes: ['Worked across Sky.com’s digital service platforms, My Account and Help.', 'Co-designed with UX designers and writers.', 'Helped establish and contribute to Sky.com’s Polaris design system.'] },
  { org: 'Bolser', role: 'UX/UI Designer', from: 'Jun 2016', to: 'May 2018', tags: ['Craft'],
    notes: ['Worked with a range of clients on both app and web projects.'] },
  { org: 'United by Design', role: 'Junior Graphic Designer', from: 'Jan 2015', to: 'Jun 2016', tags: ['Craft'], notes: [] },
  { org: 'Bloom (Jaywing)', role: 'Junior Creative', from: 'May 2014', to: 'Jan 2015', tags: ['Craft'], notes: [] }
];

AW.education = [
  { org: 'Nielsen Norman Group (NN/g)', detail: 'UX Certification (five courses and exams)',
    notes: ['The Human Mind and Usability', 'Discoveries: Building the Right Thing', 'Storytelling to Present UX Work', 'The One-Person UX Team', 'Becoming a UX Strategist'] },
  { org: 'Leeds Arts University', detail: 'BA (Hons) Graphic Design · Upper Second Class Honours (2:1)', notes: [] },
  { org: 'York College', detail: 'ND3 Graphic Design · Triple Distinction', notes: [] }
];

AW.bonus = [
  { org: 'Mentoring', detail: '',
    notes: ['Outside work, I mentor three design professionals on everything from careers to craft. I’ve guided some since their junior years, helping them build technical skills, design thinking, strategy and soft skills such as stakeholder management. One recently stepped up to Lead Designer.'], prose: true },
  { org: 'MTFBWY RPG', detail: 'TTRPG & UX Designer',
    notes: ['Primary game designer on a new tabletop roleplaying game.', 'Released alpha and beta versions, and iterated based on feedback.', 'Produced rules documentation and collateral, including printable and digital prototypes.'] },
  { org: 'Yorkshire and North East Powerlifting Federation', detail: 'Co-Chair (Strategy & Digital Experience)',
    notes: ['Applied UX experience to improve competition registration.', 'Graphic design: banners, social media and printed collateral.', 'Developed a franchise model to reduce stress on volunteers and increase revenue.'] }
];

/* Like in any good roleplaying game, the tools I'm proficient in */
AW.proficiencies = ['Figma', 'FigJam', 'Sketch', 'Adobe XD', 'GOV.UK Prototype Kit', 'Miro', 'Photoshop', 'Illustrator', 'After Effects'];

AW.clients = ['NHS England', 'AstraZeneca', 'Ministry of Defence', 'GOV.UK', 'UKHSA', 'Accenture', 'EE', 'BT', 'Sky', 'Westfield Health'];
