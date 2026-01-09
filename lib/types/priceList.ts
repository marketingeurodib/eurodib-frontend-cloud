// lib/types/priceList.ts
// Типы для прайс-листов

export interface PriceListItem {
  id: string;
  title: string;      // Например: "Price list US October 2025"
  region?: string;    // US / Canada / Quebec и т.п.
  validFrom?: string; // "October 1, 2025"
  validTo?: string;   // "December 31, 2025"
  fileUrl: string;    // URL файла (PDF/XLSX) из Strapi
  sizeMb?: number;
  strapiId?: number;
}
