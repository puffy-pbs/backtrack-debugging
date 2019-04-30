import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Custom-Solution',
    icon: 'nb-compose',
    link: '/pages/custom-solution'
  },
  {
    title: 'BACKTRACK SOLUTIONS',
    group: true,
  },
  {
    title: 'Puzzle Games',
    icon: 'nb-star',
    children: [
      {
        title: 'Lexica',
        link: '/pages/puzzle-games/lexica',
      },
      {
        title: 'Groupings',
        link: '/pages/puzzle-games/groupings'
      }
    ],
  }
];
