// lib/api/products.ts
// API для получения продуктов из Strapi

import type { Product } from '../types/product';
import { strapiGetCollection, strapiGetOne, type StrapiQueryParams } from './strapiClient';
import { fetchProducts as fetchProductsFromApi, fetchProductBySku as fetchProductBySkuFromApi } from '../productsApi';
import type { SupportedLocale } from '../utils/locale';
import { DEFAULT_LOCALE, localeToStrapiLocale } from '../utils/locale';

export type { Product } from '../types/product';

// Strapi v5 Document-based структура (без attributes)
interface StrapiProduct {
  id: number;
  documentId?: string;
  sku: string;
  name: string;
  price?: number;
  shortDescription?: string;
  description?: string;
  iceType?: string;
  inStock?: boolean;
  brand?: {
    data?: {
      id?: number;
      name?: string;
      slug?: string;
    };
  };
  category?: {
    data?: {
      id?: number;
      name?: string;
      slug?: string;
    };
  };
  image?: {
    data?: {
      url?: string;
      alternativeText?: string;
    };
  };
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * Маппинг данных из Strapi в Product
 * Strapi v5 использует Document-based структуру (без вложенного attributes)
 */
function mapStrapiToProduct(strapiProduct: StrapiProduct): Product {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || '';
  const imageUrl = strapiProduct.image?.data?.url;
  
  return {
    sku: strapiProduct.sku,
    name: strapiProduct.name,
    brand: strapiProduct.brand?.data?.name || '',
    price: strapiProduct.price || 0,
    image: imageUrl
      ? (imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`)
      : '/image/CB249_B-Qube-2.png',
    imageUrl: imageUrl
      ? (imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`)
      : '/image/CB249_B-Qube-2.png',
    // Заменяем undefined на null или не включаем поле для сериализации
    ...(strapiProduct.shortDescription !== undefined ? { shortDescription: strapiProduct.shortDescription } : {}),
    ...(strapiProduct.description !== undefined ? { description: strapiProduct.description } : {}),
    ...(strapiProduct.category?.data?.name !== undefined ? { category: strapiProduct.category.data.name } : {}),
    ...(strapiProduct.iceType !== undefined ? { iceType: strapiProduct.iceType } : {}),
    ...(strapiProduct.inStock !== undefined ? { inStock: strapiProduct.inStock } : {}),
  };
}

/**
 * Получить все продукты из Strapi
 * @param locale - Локаль (en-US, fr-CA, en-CA). По умолчанию 'en-CA'
 */
export async function fetchProducts(locale: SupportedLocale = DEFAULT_LOCALE): Promise<Product[]> {
  try {
    // Пытаемся получить из Strapi с полным populate для relations
    const params: StrapiQueryParams = {
      populate: {
        brand: true,
        category: true,
        image: true,
      },
      locale: localeToStrapiLocale(locale),
      pagination: {
        pageSize: 100, // Получаем первые 100 продуктов
      },
    };

    const strapiProducts = await strapiGetCollection<StrapiProduct>(
      '/api/products',
      params,
      {
        next: { revalidate: 60 }, // Кэш на 1 минуту
      }
    );

    // Логируем результат запроса
    console.log(`[PRODUCTS] Strapi вернул ${strapiProducts?.length || 0} записей для locale ${locale}`);

    // Если данных нет в Strapi - используем fallback на старый API с явным логированием
    if (!strapiProducts || strapiProducts.length === 0) {
      console.warn(`[PRODUCTS] ⚠️  Нет данных в Strapi для locale ${locale}, используем fallback на старый API`);
      return fetchProductsFromApi();
    }

    console.log(`[PRODUCTS] ✅ Данные из Strapi (${strapiProducts.length} записей)`);
    return strapiProducts.map(mapStrapiToProduct);
  } catch (error) {
    console.error('[PRODUCTS] ❌ Ошибка при запросе к Strapi:', error);
    console.warn(`[PRODUCTS] ⚠️  Используем fallback на старый API из-за ошибки`);
    // Возвращаем fallback при ошибке, чтобы страница не падала
    return fetchProductsFromApi();
  }
}

/**
 * Получить продукт по SKU из Strapi
 * @param sku - SKU продукта
 * @param locale - Локаль (en-US, fr-CA, en-CA). По умолчанию 'en-CA'
 */
export async function fetchProductBySku(sku: string, locale: SupportedLocale = DEFAULT_LOCALE): Promise<Product | null> {
  try {
    // Пытаемся получить из Strapi с полным populate
    const params: StrapiQueryParams = {
      populate: {
        brand: true,
        category: true,
        image: true,
      },
      filters: {
        sku: {
          $eq: sku,
        },
      },
      locale: localeToStrapiLocale(locale),
    };

    const strapiProduct = await strapiGetOne<StrapiProduct>(
      '/api/products',
      params,
      {
        next: { revalidate: 60 }, // Кэш на 1 минуту
      }
    );

    // Логируем результат запроса
    console.log(`[PRODUCTS] Strapi вернул ${strapiProduct ? '1' : '0'} продукт для SKU "${sku}" и locale ${locale}`);

    // Если продукта нет в Strapi - используем fallback на старый API с явным логированием
    if (!strapiProduct) {
      console.warn(`[PRODUCTS] ⚠️  Продукт не найден в Strapi для SKU "${sku}", используем fallback на старый API`);
      return fetchProductBySkuFromApi(sku);
    }

    console.log(`[PRODUCTS] ✅ Данные из Strapi для SKU "${sku}"`);
    return mapStrapiToProduct(strapiProduct);
  } catch (error) {
    console.error(`[PRODUCTS] ❌ Ошибка при запросе к Strapi для SKU "${sku}":`, error);
    console.warn(`[PRODUCTS] ⚠️  Используем fallback на старый API из-за ошибки`);
    // Возвращаем fallback при ошибке, чтобы страница не падала
    return fetchProductBySkuFromApi(sku);
  }
}
