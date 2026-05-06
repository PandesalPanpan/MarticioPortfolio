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
    note: 'Active contributor and curriculum learner.',
  },
  {
    id: 'cs50',
    institution: "Harvard's CS50",
    credential: 'Introduction to Computer Science',
    start: '',
    end: 'Completed',
    link: undefined /* TODO: paste certificate URL */,
  },
];
