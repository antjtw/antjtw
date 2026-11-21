/* =========================================================
   Ant White v2: content
   One source of truth for quests, inventory, skills and the CV.
   Edit here; every page re-renders from it.
   ========================================================= */

window.AW = window.AW || {};

/* Title-screen epithets, cycled under the name */
AW.titles = ['Design leader', 'AI leader', 'Force multiplier', 'Mentor', 'Systems thinker', 'Game designer'];

/* ---------- Quests ----------
   type:       'main' (work) | 'side' (outside work)
   status:     'active' | 'complete' | 'drafting'
   featured:   shows in the home page quest log
   region:     where the quest takes place (sector)
   objectives: [text, done?] journal entries
   rewards:    the loot (outcomes)
------------------------------------------------------------ */
AW.quests = [
  {
    id: 'nhs-apc', type: 'main', status: 'active', featured: true, level: 12,
    name: 'The Referral Road', short: 'NHS Advice & Guidance',
    title: 'Replacing e-RS: helping the NHS see secondary care patients sooner',
    giver: 'NHS England', region: 'Health', year: '2026', role: 'UCD Lead',
    objectives: [['Take up the mantle of UCD Lead', true], ['Map who holds responsibility for a referral', true], ['Forge agents that write prototype specs', true], ['Ship the new Advice and Guidance platform', false]],
    rewards: ['Patients seen sooner', 'Agentic delivery tooling'],
    tags: ['UX strategy', 'UCD practice', 'AI agents'],
    href: '../case-studies/nhs-apc.html'
  },
  {
    id: 'westfield-health', type: 'main', status: 'complete', featured: true, level: 10,
    name: 'The Silent Brokers', short: 'Westfield Health',
    title: 'A market-first broker quotation tool, built without talking to users',
    giver: 'Westfield Health', region: 'Insurance', year: '2023–25', role: 'Lead UX Designer',
    objectives: [['Design for users you are forbidden to meet', true], ['Build a design system from nothing', true], ['Launch a beta with trusted brokers', true]],
    rewards: ['First to market', 'Practice and system from zero'],
    tags: ['Product design', 'Design system'],
    href: '../case-studies/westfield-health.html'
  },
  {
    id: 'ee-add-mobile', type: 'main', status: 'complete', featured: true, level: 8,
    name: 'The Second Line', short: 'EE Add Mobile',
    title: 'Increasing additional product sales for EE’s digital store',
    giver: 'EE', region: 'Telecoms', year: '2019–22', role: 'Lead Product Designer',
    objectives: [['Find where the journey was failing', true], ['Test every hypothesis before shipping', true], ['Move the channel share needle', true]],
    rewards: ['+31% traffic', '+19% conversion', '+0.7% direct channel share'],
    tags: ['Product design', 'Experimentation'],
    href: '../case-studies/ee-add-mobile.html'
  },
  {
    id: 'govuk-covid', type: 'main', status: 'complete', featured: false, level: 9,
    name: 'The Long Winter', short: 'COVID-19 reporting',
    title: 'Letting Trusts and hospitals report COVID-19 test results',
    giver: 'UKHSA · GOV.UK', region: 'Government', year: '2022', role: 'Senior Interaction Designer',
    objectives: [['Prototype fast, accessibly, in the GOV.UK kit', true], ['Extend the GDS Design System for clinicians', true], ['Contribute the patterns back upstream', true]],
    rewards: ['80% faster reporting across NHS Trusts'],
    tags: ['Interaction design', 'GDS'],
    href: '../case-studies/govuk-covid.html'
  },
  {
    id: 'ee-data-plans', type: 'main', status: 'complete', featured: false, level: 7,
    name: 'The Plan Cards', short: 'EE data plans',
    title: 'Simplifying data plan selection',
    giver: 'EE', region: 'Telecoms', year: '2021', role: 'Senior Product Designer',
    objectives: [['Make plans comparable at a glance', true], ['Surface the buried Smart Benefits', true]],
    rewards: ['29% faster task completion', '8% sales uplift'],
    tags: ['Information design', 'Commercial UX'],
    href: '../case-studies/ee-data-plans.html'
  },
  {
    id: 'sky-broadband', type: 'main', status: 'complete', featured: false, level: 5,
    name: 'The Hub', short: 'Sky Broadband Hub',
    title: 'Helping Sky Broadband customers check their service',
    giver: 'Sky', region: 'Media', year: '2018–19', role: 'UI Designer',
    objectives: [['Make broadband data readable', true], ['Feed patterns into Polaris', true]],
    rewards: ['Modernised Broadband & Talk Hub'],
    tags: ['UI design', 'Design systems'],
    href: '../case-studies/sky-broadband.html'
  },
  {
    id: 'make-shift', type: 'main', status: 'drafting', featured: false, level: 11,
    name: 'Make/Shift', short: 'Make/Shift',
    title: 'A national AI hackathon for designers',
    giver: 'Accenture', region: 'Professional services', year: '2025', role: 'Organiser & designer',
    objectives: [['Gather designers from across the country', true], ['Push what AI can do for the craft', true], ['Write up the chronicle', false]],
    rewards: ['A practice that ships with AI'],
    tags: ['Practice', 'AI upskilling'],
    href: '../case-studies/make-shift-hackathon.html'
  },
  {
    id: 'sky-pitch', type: 'main', status: 'complete', featured: false, level: 4,
    name: 'The Pitch', short: 'Sky corporate pitch',
    title: 'Pushing Sky’s design language to the next level',
    giver: 'Sky', region: 'Media', year: '2019', role: 'UI Designer',
    objectives: [['Push the brand further than it had been', true]],
    rewards: ['A sharper Sky'],
    tags: ['Visual design'],
    href: '../case-studies/sky-corporate-pitch.html'
  },

  /* ---- Side quests ---- */
  {
    id: 'mtfbwy', type: 'side', status: 'active', featured: true, level: 12,
    name: 'A Galaxy of My Own', short: 'MTFBWY RPG',
    title: 'Designing a Star Wars-inspired tabletop RPG from scratch',
    giver: 'Myself', region: 'Tabletop', year: 'Ongoing', role: 'Game & UX designer',
    objectives: [['Write the rules', true], ['Design the character sheets', true], ['Run weekly playtests', true], ['Build the virtual tabletop', false]],
    rewards: ['Closed beta v1.1.1', 'A table of loyal players'],
    tags: ['Game design', 'Systems'],
    href: '../case-studies/mtfbwy-rpg.html'
  },
  {
    id: 'ynepf', type: 'side', status: 'active', featured: true, level: 6,
    name: 'The Iron Federation', short: 'YNE Powerlifting',
    title: 'Transforming a regional powerlifting federation',
    giver: 'YNE Powerlifting Federation', region: 'Sport', year: 'Ongoing', role: 'Co-Chair',
    objectives: [['Take a seat at the table as Co-Chair', true], ['Set the strategy', true], ['Modernise the digital experience', false]],
    rewards: ['A federation fit for the future'],
    tags: ['Transformation', 'Strategy'],
    href: '#'
  },
  {
    id: 'rate-race', type: 'side', status: 'complete', featured: false, level: 2,
    name: 'Rate Race', short: 'Rate Race',
    title: 'A silly IMDb rating game for losing to your friends',
    giver: 'Myself', region: 'Web toys', year: '2025', role: 'Maker',
    objectives: [['Make a game in a weekend', true], ['Beat my friends at it', false]],
    rewards: ['Bragging rights (pending)'],
    tags: ['Game'],
    href: 'https://rate-race.vercel.app', external: true
  }
];

/* ---------- Skill trees (constellations) ----------
   nodes: [x, y] in a 0–100 box; links: index pairs; perks name the nodes */
AW.skills = [
  {
    key: 'ai', name: 'The Artificer', sub: 'AI, done properly',
    body: 'Agentic tooling that speeds delivery without replacing judgement. Sceptical, practical, measured.',
    nodes: [[50, 88], [30, 64], [70, 64], [22, 36], [50, 40], [78, 36], [50, 12]],
    links: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5], [4, 6]],
    perks: ['Prompt craft', 'Research synthesis', 'Rapid prototypes', 'Spec agents', 'Human in the loop', 'Evaluation', 'Agentic delivery'],
    link: { text: 'How I think about AI', href: '../ai-policy.html' }
  },
  {
    key: 'transform', name: 'The Builder', sub: 'Transformation',
    body: 'Design practices built where there were none. Systems from zero, research without access, strategy from spreadsheets.',
    nodes: [[18, 86], [38, 70], [30, 44], [56, 52], [62, 26], [82, 40], [84, 12]],
    links: [[0, 1], [1, 2], [1, 3], [3, 4], [3, 5], [4, 6], [5, 6]],
    perks: ['Discovery', 'Rituals', 'Research ops', 'Design systems', 'Hiring', 'Mentoring', 'Practice lead'],
    link: { text: 'Main quests', href: 'main-quests.html' }
  },
  {
    key: 'game', name: 'The Storyteller', sub: 'Game design',
    body: 'Designing rules, then the interfaces to the rules, then how players learn them from the interfaces.',
    nodes: [[50, 50], [50, 14], [82, 32], [82, 70], [50, 88], [18, 70], [18, 32]],
    links: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 2], [3, 4], [5, 6]],
    perks: ['Systems', 'Rules writing', 'Balance', 'Playtesting', 'Narrative', 'Information design', 'Table craft'],
    link: { text: 'Side quests', href: 'side-quests.html' }
  }
];

/* ---------- Inventory ----------
   rarity: common | rare | epic | legendary (locked items show as ???) */
AW.inventory = [
  { kind: 'Tome',   type: 'Writing',  title: 'On AI: a sceptic’s working position', meta: 'Essay', rarity: 'legendary', icon: 'tome', href: '../ai-policy.html', unlocked: true,
    desc: 'Where AI earns its place, and where I refuse to let it replace the thinking.' },
  { kind: 'Horn',   type: 'Speaking', title: 'Agentic prototyping in the NHS', meta: 'Internal talk', rarity: 'epic', icon: 'horn', unlocked: true,
    desc: 'How an agent that writes spec pages changed the way a delivery team works.' },
  { kind: 'Staff',  type: 'Teaching', title: 'Mentoring', meta: 'Seven reports, two mentees', rarity: 'rare', icon: 'staff', unlocked: true,
    desc: 'One former mentee is now a Lead Designer. The staff gets passed on.' },
  { kind: 'Scroll', type: 'Writing',  title: 'Designing without users', meta: 'Drafting', rarity: 'epic', icon: 'scroll', unlocked: false },
  { kind: 'Grimoire', type: 'Course', title: 'AI for design leaders', meta: 'In the forge', rarity: 'legendary', icon: 'grimoire', unlocked: false },
  { kind: 'Horn',   type: 'Speaking', title: 'Your event here', meta: 'Open slot', rarity: 'rare', icon: 'horn', unlocked: false }
];

/* ---------- CV: the chronicle ---------- */
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
  { org: 'Bloom (Jaywing)', role: 'Junior Creative', from: 2014, to: 2015, tags: ['Craft'], notes: ['Where it began.'] }
];

AW.stats = [
  { name: 'Leadership', abbr: 'LDR', value: 92 },
  { name: 'Systems thinking', abbr: 'SYS', value: 95 },
  { name: 'Research', abbr: 'RES', value: 86 },
  { name: 'AI & automation', abbr: 'ART', value: 88 },
  { name: 'Visual craft', abbr: 'CRF', value: 84 },
  { name: 'Star Wars lore', abbr: 'LORE', value: 100 }
];

/* Realms visited (clients) */
AW.clients = ['NHS England', 'AstraZeneca', 'Ministry of Defence', 'GOV.UK', 'UKHSA', 'Accenture', 'EE', 'BT', 'Sky', 'Westfield Health'];
