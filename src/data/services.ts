export type Service = {
  id: string;
  no: string;
  title: string;
  blurb: string;
  bullets: string[];
};

/** "What I can build for you" — positioned around Peter's proven strengths. */
export const services: Service[] = [
  {
    id: 'web-apps',
    no: '01',
    title: 'Full-stack web apps',
    blurb:
      'From idea to a deployed product your users can actually reach. Front end, back end, database, and everything in between.',
    bullets: [
      'React + TypeScript interfaces',
      'Laravel or Node.js APIs & auth',
      'PostgreSQL / MySQL data modelling',
    ],
  },
  {
    id: 'business-systems',
    no: '02',
    title: 'Inventory, POS & internal tools',
    blurb:
      'The systems a business actually runs on. Built around your real workflow, not a template, and battle-tested in production.',
    bullets: [
      'Inventory management (RFID, barcode, biometrics)',
      'POS with thermal printing & daily transactions',
      'Admin dashboards & reporting',
    ],
  },
  {
    id: 'deploy',
    no: '03',
    title: 'Deploy, self-host & maintain',
    blurb:
      "I don't just hand off a repo. I ship it and keep it running, so you own your stack instead of renting someone else's.",
    bullets: [
      'Dockerised deploys on your own VPS',
      'Nginx, CI/CD & zero-downtime releases',
      'Self-hosting so your data stays yours',
    ],
  },
];
