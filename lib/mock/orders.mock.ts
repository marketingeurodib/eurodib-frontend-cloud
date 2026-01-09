// lib/mock/orders.mock.ts
// Мок-данные для заказов (временно, до подключения SAP/Strapi)

import type { Order } from '../types/order';

export const mockOrders: Order[] = [
  {
    id: 'o1',
    orderNumber: 'SO-100123',
    placedOn: 'November 18, 2025',
    items: [
      {
        id: 'o1i1',
        sku: 'CB249A BHC AWS',
        name: 'B-QUBE Ice Machine',
        brand: 'BREMA',
        qty: 2,
        imageUrl: '/image/CB249_B-Qube-2.png',
        sapOrderLineId: '10',
      },
      {
        id: 'o1i2',
        sku: '10016',
        name: 'Ice Scoop',
        brand: 'BREMA',
        qty: 3,
        imageUrl: 'https://via.placeholder.com/60',
        sapOrderLineId: '20',
      },
      {
        id: 'o1i3',
        sku: 'ICECLEAN01',
        name: 'Ice Machine cleaner',
        brand: 'BREMA',
        qty: 10,
        imageUrl: 'https://via.placeholder.com/60',
        sapOrderLineId: '30',
      },
    ],
  },
  {
    id: 'o2',
    orderNumber: 'SO-100045',
    placedOn: 'July 9, 2025',
    items: [
      {
        id: 'o2i1',
        sku: 'CB249A BHC AWS',
        name: 'B-QUBE Ice Machine',
        brand: 'BREMA',
        qty: 1,
        imageUrl: 'https://via.placeholder.com/60',
        sapOrderLineId: '10',
      },
    ],
  },
];
