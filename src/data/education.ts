import type { Education } from './types';

export const education: Education[] = [
  {
    id: 'pup',
    institution: 'Polytechnic University of the Philippines',
    credential: 'Bachelor in Computer Engineering',
    start: '2021',
    end: 'Present',
  },
  {
    id: 'odin',
    institution: 'The Odin Project',
    credential: 'Full-Stack JavaScript Path',
    start: 'Ongoing',
    end: '',
    link: 'https://www.theodinproject.com/',
    note: 'Open-source contributor to TheOdinProject/curriculum.',
    contribution: {
      label: 'View merged contributions',
      url: 'https://github.com/TheOdinProject/curriculum/pulls?q=is%3Apr+is%3Amerged+author%3APandesalPanpan',
    },
  },
];
