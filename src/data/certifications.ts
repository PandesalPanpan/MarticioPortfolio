import type { Certification } from './types';

export const certifications: Certification[] = [
  {
    id: 'cs50',
    title: 'CS50x: Introduction to Computer Science',
    issuer: 'Harvard University',
    date: '2025',
    pdf: '/cs50certificate.pdf',
    verifyUrl: 'https://cs50.harvard.edu/certificates/fd50e363-693b-4669-a6d5-3dbd4e46c552',
  },
  {
    id: 'tesda',
    title: 'National Certificate II: Computer Systems Servicing',
    issuer: 'TESDA (Philippines)',
    date: 'Feb 2024',
    pdf: '/NC_marticio.pdf',
  },
];
