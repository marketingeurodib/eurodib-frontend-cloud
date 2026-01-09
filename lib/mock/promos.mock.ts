// lib/mock/promos.mock.ts
// Мок-данные для промо-материалов (временно, до подключения Strapi)

import type { PromoItem } from '../types/promo';

export const mockPromos: PromoItem[] = [
  {
    id: '1',
    title: 'Fall deals',
    dateFrom: 'September 15',
    dateTo: 'October 31',
    thumbUrl: 'https://via.placeholder.com/90x90',
    fileUrl: '#', // сюда пойдёт URL файла из Strapi
    sizeMb: 3.1,
    strapiId: 101,
  },
  {
    id: '2',
    title: 'Cellar-bration!',
    dateFrom: 'November 10',
    dateTo: 'December 19',
    thumbUrl: 'https://via.placeholder.com/90x90',
    fileUrl: '#',
    sizeMb: 2.4,
    strapiId: 102,
  },
];
