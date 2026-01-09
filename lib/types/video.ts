// lib/types/video.ts
// Типы для видео

export interface VideoItem {
  id: string;
  title: string;
  brand: string;
  brandSlug: string;     // для data-brand
  category: string;
  categorySlug: string;  // для data-cat
  sku: string;
  thumbnailUrl: string;
  videoUrl: string;      // ссылка на видео (из SAP/Strapi)
  sizeMb: number;
  sapItemCode?: string;  // привязка к товару SAP
}
