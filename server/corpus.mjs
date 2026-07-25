// The closed evidence corpus for Fit Check.
//
// Every claim the Fit Check feature renders must cite an `id` from this file.
// Anything the model asserts without a valid id is dropped server-side, so a
// hallucinated strength structurally cannot reach the page.
//
// Kept as plain data here (rather than imported from src/data/*.ts) for the
// same reason persona.mjs is: the Netlify function and the Vite dev middleware
// both load it without a build step. `server/corpus.test.ts` cross-checks these
// entries against src/data so the two copies cannot silently drift.

const GH = 'https://github.com/PandesalPanpan';

/**
 * @typedef {object} Evidence
 * @property {string} id      Stable citation key the model must quote.
 * @property {'project'|'role'|'cert'} kind
 * @property {string} label   Short human label rendered next to the claim.
 * @property {string} detail  The actual verifiable fact.
 * @property {string} [href]  Where a visitor can go check it.
 * @property {string} [ref]   Matching id in src/data (guarded by the test).
 */

/** @type {Evidence[]} */
export const EVIDENCE = [
  // --- Projects ------------------------------------------------------------
  {
    id: 'memorizemate.offline',
    kind: 'project',
    ref: 'memorizemate',
    label: 'MemorizeMate',
    detail:
      'Offline-first PWA: IndexedDB persistence and service-worker caching, so the app keeps working with no network.',
    href: 'https://memorizemate.marticio.com',
  },
  {
    id: 'memorizemate.algorithm',
    kind: 'project',
    ref: 'memorizemate',
    label: 'MemorizeMate',
    detail: 'Custom FSRS spaced-repetition scheduling integrated via ts-fsrs.',
    href: `${GH}/MemorizeMate`,
  },
  {
    id: 'memorizemate.testing',
    kind: 'project',
    ref: 'memorizemate',
    label: 'MemorizeMate',
    detail: '38 unit tests plus a Playwright end-to-end suite.',
    href: `${GH}/MemorizeMate`,
  },
  {
    id: 'memorizemate.stack',
    kind: 'project',
    ref: 'memorizemate',
    label: 'MemorizeMate',
    detail: 'React 19 + TypeScript + Vite + Zustand front end, shipped to production.',
    href: 'https://memorizemate.marticio.com',
  },
  {
    id: 'findthenumber.realtime',
    kind: 'project',
    ref: 'findthenumber',
    label: 'FindTheNumber',
    detail:
      'Real-time two-player networking over WebRTC peer-to-peer with a WebSocket relay fallback.',
    href: `${GH}/FindTheNumber`,
  },
  {
    id: 'findthenumber.clock',
    kind: 'project',
    ref: 'findthenumber',
    label: 'FindTheNumber',
    detail: 'NTP-synced clock so both players are timed fairly across machines.',
    href: `${GH}/FindTheNumber`,
  },
  {
    id: 'findthenumber.docker',
    kind: 'project',
    ref: 'findthenumber',
    label: 'FindTheNumber',
    detail: 'Dockerised Node.js signalling server running in production.',
    href: 'https://findthenumber.marticio.com',
  },
  {
    id: 'threaded.fullstack',
    kind: 'project',
    ref: 'threaded',
    label: 'Threaded',
    detail:
      'Laravel + Filament + MySQL back end with a React front end, ported from Livewire and in daily use.',
    href: 'https://threaded.marticio.com',
  },
  {
    id: 'classhub.deployed',
    kind: 'project',
    ref: 'classhub',
    label: 'ClassHub',
    detail:
      'Laravel/PostgreSQL scheduling system deployed and used by the PUP Computer Engineering department.',
    href: `${GH}/classhub`,
  },
  {
    id: 'rfid.hardware',
    kind: 'project',
    ref: 'thesis-rfid-ims',
    label: 'Thesis-RFID-IMS',
    detail: 'Inventory workflows integrating RFID, biometric, and barcode hardware.',
    href: `${GH}/Thesis-RFID-Borrowing-IMS`,
  },
  {
    id: 'binaryspeed.python',
    kind: 'project',
    ref: 'binary-speed',
    label: 'binary-speed',
    detail: 'CS50 final project written in Python.',
    href: `${GH}/binary-speed`,
  },
  {
    id: 'knights.algorithms',
    kind: 'project',
    ref: 'knights-travails',
    label: 'odin-knights-travails',
    detail: 'Breadth-first shortest-path solver written from scratch in JavaScript.',
    href: `${GH}/odin-knights-travails`,
  },

  // --- Roles ---------------------------------------------------------------
  {
    id: 'caret.ims',
    kind: 'role',
    ref: 'caret',
    label: 'Caret Solutions Inc.',
    detail:
      'Full-Stack Developer building and deploying an Inventory Management System, wiring front-end interfaces to a secure backend for complex stock workflows.',
  },
  {
    id: 'caret.team',
    kind: 'role',
    ref: 'caret',
    label: 'Caret Solutions Inc.',
    detail: 'Works inside a professional development team on a production system, 2026 to present.',
  },
  {
    id: 'metacore.pos',
    kind: 'role',
    ref: 'metacore',
    label: 'Meta Core Systems Inc.',
    detail:
      'Flutter POS system managing 1,000+ items and 300 to 500 daily transactions (Mar to Aug 2024).',
  },
  {
    id: 'metacore.hardware',
    kind: 'role',
    ref: 'metacore',
    label: 'Meta Core Systems Inc.',
    detail: 'Bluetooth thermal printing integration that reduced checkout time by 30%.',
  },
  {
    id: 'ntek.reporting',
    kind: 'role',
    ref: 'ntek',
    label: 'NTEK Systems Inc.',
    detail:
      'PHP reporting system monitoring 500+ daily transactions in real time (Aug to Oct 2023).',
  },
  {
    id: 'ntek.payments',
    kind: 'role',
    ref: 'ntek',
    label: 'NTEK Systems Inc.',
    detail: 'PayMaya API integration for secure digital payment testing.',
  },

  // --- Credentials ---------------------------------------------------------
  {
    id: 'cert.cs50',
    kind: 'cert',
    ref: 'cs50',
    label: 'CS50x, Harvard',
    detail: 'Introduction to Computer Science, completed 2025.',
  },
  {
    id: 'cert.tesda',
    kind: 'cert',
    ref: 'tesda',
    label: 'TESDA NC II',
    detail: 'National Certificate II in Computer Systems Servicing (Feb 2024).',
  },
  {
    id: 'education.pup',
    kind: 'cert',
    ref: 'pup',
    label: 'PUP',
    detail:
      'Bachelor in Computer Engineering at the Polytechnic University of the Philippines, 2021 to present.',
  },
];

/** Fast lookup used by the server-side citation filter. */
export const EVIDENCE_BY_ID = new Map(EVIDENCE.map((e) => [e.id, e]));

/** The corpus rendered for the model. Ids are the only citable tokens. */
export const EVIDENCE_PROMPT = EVIDENCE.map(
  (e) => `- ${e.id} | ${e.label} | ${e.detail}`,
).join('\n');

/**
 * Skills Peter lists but which have no dedicated evidence entry. The model may
 * mention these as partial matches only, never as proven strengths.
 */
export const CLAIMED_SKILLS = [
  'TypeScript', 'JavaScript', 'PHP', 'Dart', 'SQL', 'HTML', 'CSS',
  'React', 'Laravel', 'Node.js / Express', 'Flutter', 'Filament',
  'Docker', 'VPS', 'Git & GitHub', 'Nginx', 'CI/CD',
  'PostgreSQL', 'Supabase', 'Prisma', 'IndexedDB', 'MySQL',
];
