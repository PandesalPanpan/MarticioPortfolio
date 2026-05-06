import type { Experience } from './types';

export const experience: Experience[] = [
  {
    id: 'caret',
    company: 'Caret Solutions Inc.',
    role: 'Full-Stack Developer',
    start: '2026',
    end: 'Present',
    bullets: [
      'Collaborated within a development team to build and deploy a robust Inventory Management System.',
      'Developed an IMS integrating frontend interfaces with a secure backend to manage complex stock workflows.',
    ],
  },
  {
    id: 'metacore',
    company: 'Meta Core Systems Inc.',
    role: 'Mobile Developer Intern',
    start: 'Mar 2024',
    end: 'Aug 2024',
    bullets: [
      'Built a Flutter POS system managing 1,000+ items and 300–500 daily transactions.',
      'Integrated Bluetooth thermal printing, reducing checkout time by 30%.',
    ],
  },
  {
    id: 'ntek',
    company: 'NTEK Systems Inc.',
    role: 'PHP Developer Intern',
    start: 'Aug 2023',
    end: 'Oct 2023',
    bullets: [
      'Developed a reporting system for real-time monitoring of 500+ daily transactions.',
      'Implemented PayMaya API for secure digital payment testing and integration.',
    ],
  },
];
