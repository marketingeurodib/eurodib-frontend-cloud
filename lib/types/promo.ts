// lib/types/promo.ts
// Типы для промо-материалов

export interface PromoItem {
  id: string;
  title: string;
  dateFrom: string;   // ISO или human-readable, как удобнее
  dateTo: string;
  thumbUrl: string;   // превью (обложка промо)
  fileUrl: string;    // ссылка на сам промо-флаер (PDF/JPG) из Strapi
  sizeMb?: number;
  strapiId?: number;
}
