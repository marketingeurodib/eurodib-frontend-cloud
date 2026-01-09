// lib/mock/priceLists.mock.ts
// Мок-данные для прайс-листов (временно, до подключения Strapi)

import type { PriceListItem } from '../types/priceList';

export const mockPriceLists: PriceListItem[] = [
  {
    id: '1',
    title: 'Price list US October 2025',
    region: 'US',
    validFrom: 'October 1, 2025',
    validTo: 'October 31, 2025',
    fileUrl: '#', // сюда позже вставишь реальный URL файла из Strapi
    sizeMb: 1.8,
    strapiId: 201,
  },
  {
    id: '2',
    title: 'Price list Canada October 2025',
    region: 'CA',
    validFrom: 'October 1, 2025',
    validTo: 'October 31, 2025',
    fileUrl: '#',
    sizeMb: 2.2,
    strapiId: 202,
  },
];
