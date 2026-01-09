// lib/utils/filterConfig.ts
// Утилита для подготовки конфигурации фильтров на основе продуктов

import type { Product } from '../../data/products';
import type { FilterConfig } from '../../components/catalog/ArchiveTemplate';

/**
 * Подготовить конфигурацию фильтров на основе списка продуктов
 */
export function prepareFilterConfig(products: Product[]): FilterConfig {
  // Категории
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter((c): c is string => !!c))
  ).map((cat) => ({
    label: cat,
    value: cat,
    count: products.filter((p) => p.category === cat).length,
  }));

  // Типы льда
  const iceTypes = Array.from(
    new Set(products.map((p) => p.iceType).filter((t): t is string => !!t))
  ).map((type) => ({
    label: type,
    value: type,
    count: products.filter((p) => p.iceType === type).length,
  }));

  // Ценовой диапазон
  const prices = products.map((p) => p.price || 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 1700;

  return {
    categories: categories.length > 0 ? categories : undefined,
    iceTypes: iceTypes.length > 0 ? iceTypes : undefined,
    priceRange: { min: minPrice, max: maxPrice },
    showInStock: true,
  };
}
