// lib/mock/videos.mock.ts
// Мок-данные для видео (временно, до подключения Strapi)

import type { VideoItem } from '../types/video';

export const mockVideos: VideoItem[] = [
  {
    id: '1',
    title: 'Dito Sama Prep4You slicer / cutter / mixer',
    brand: 'Dito Sama',
    brandSlug: 'dito sama',
    category: 'Food Prep',
    categorySlug: 'food prep',
    sku: 'PREP4YOU-VIDEO',
    thumbnailUrl: 'https://via.placeholder.com/420x250',
    videoUrl: '#', // сюда подставишь ссылку из SAP/Strapi
    sizeMb: 1.8,
    sapItemCode: 'DS-PREP4YOU',
  },
  {
    id: '2',
    title: 'Lamber dishwasher',
    brand: 'Lamber',
    brandSlug: 'lamber',
    category: 'Dishwashing',
    categorySlug: 'dishwashing',
    sku: 'LAMBER-DW-VIDEO',
    thumbnailUrl: 'https://via.placeholder.com/420x250',
    videoUrl: '#',
    sizeMb: 2.1,
    sapItemCode: 'LMB-DW-01',
  },
  {
    id: '3',
    title: 'Louis Tellier Bron mandoline',
    brand: 'Louis Tellier',
    brandSlug: 'louis tellier',
    category: 'Food Prep',
    categorySlug: 'food prep',
    sku: 'LT-MANDOLINE-VIDEO',
    thumbnailUrl: 'https://via.placeholder.com/420x250',
    videoUrl: '#',
    sizeMb: 1.4,
    sapItemCode: 'LT-MAND-01',
  },
];
