import type { Project } from '@/lib/types';

export const seedProjects: Project[] = [
  {
    name: 'Fenway Banking',
    type: 'Mobile redesign',
    year: '2025',
    bg: '#E6F1FB',
    accent: '#185FA5',
    shape: 'square',
    tags: ['fintech', 'mobile'],
  },
  {
    name: 'Pulse Analytics',
    type: 'Dashboard system',
    year: '2025',
    bg: '#FAECE7',
    accent: '#D85A30',
    shape: 'parallelogram',
    tags: ['b2b', 'data viz'],
  },
  {
    name: 'Verde wellness',
    type: 'Brand & web',
    year: '2025',
    bg: '#E1F5EE',
    accent: '#1D9E75',
    shape: 'circle',
    tags: ['brand', 'web'],
  },
  {
    name: 'Lumen design system',
    type: 'Internal tooling',
    year: 'ongoing',
    bg: '#EEEDFE',
    accent: '#534AB7',
    shape: 'square',
    tags: ['systems', 'tokens'],
  },
];
