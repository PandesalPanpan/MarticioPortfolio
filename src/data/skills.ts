export type SkillGroup = {
  id: string;
  label: string;
  items: string[];
};

/** Sourced from the resume (Expertise/Programming) + portfolio stack strengths. */
export const skills: SkillGroup[] = [
  {
    id: 'languages',
    label: 'Languages',
    items: ['TypeScript', 'JavaScript (ES6+)', 'PHP', 'Dart', 'SQL', 'HTML', 'CSS'],
  },
  {
    id: 'frameworks',
    label: 'Frameworks & Libraries',
    items: ['React', 'Laravel', 'Node.js / Express', 'Flutter', 'Filament'],
  },
  {
    id: 'infra',
    label: 'Infra & Tooling',
    items: ['Docker', 'VPS', 'Git & GitHub', 'Nginx', 'CI/CD'],
  },
  {
    id: 'data',
    label: 'Data',
    items: ['PostgreSQL', 'Supabase', 'Prisma', 'IndexedDB'],
  },
];
