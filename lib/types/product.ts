// lib/types/product.ts
// Типы для продуктов
// Экспортируем из data/products.ts для единообразия

export interface Product {
  sku: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  imageUrl?: string; // альтернативное поле для image
  shortDescription?: string;
  description?: string;
  category?: string;
  iceType?: string;
  inStock?: boolean;
}
