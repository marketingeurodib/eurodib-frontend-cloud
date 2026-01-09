// lib/api/categories.ts
// API для получения продуктов категорий из Strapi

import { strapiGet, strapiGetCollection, strapiGetOne, type StrapiQueryParams, absoluteMediaUrl } from './strapiClient';
import type { Product } from '../../data/products';
import { fetchProducts } from '../productsApi';
import type { SupportedLocale } from '../utils/locale';
import { DEFAULT_LOCALE, localeToStrapiLocale } from '../utils/locale';

// CategoryProduct совместим с Product
export type CategoryProduct = Product;

/**
 * Получить продукты по slug категории (для динамических страниц)
 */
export async function fetchProductsByCategorySlug(categorySlug: string, locale: SupportedLocale = DEFAULT_LOCALE): Promise<CategoryProduct[]> {
  try {
    // Пытаемся получить из Strapi
    const params: StrapiQueryParams = {
      populate: {
        brand: true,
        category: true,
        image: true,
      },
      filters: {
        category: {
          slug: {
            $eq: categorySlug,
          },
        },
      },
      locale: localeToStrapiLocale(locale),
    };

    // Strapi v5 Document-based структура (без attributes)
    interface StrapiProduct {
      id: number;
      documentId?: string;
      sku: string;
      name: string;
      price?: number;
      shortDescription?: string;
      description?: string;
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
        };
      };
      locale?: string;
    }

    const strapiProducts = await strapiGetCollection<StrapiProduct>(
      '/api/products',
      params,
      {
        next: { revalidate: 60 }, // Кэш на 1 минуту
      }
    );

    // Логируем результат запроса
    console.log(`[CATEGORIES] Strapi вернул ${strapiProducts?.length || 0} продуктов для category slug "${categorySlug}" и locale ${locale}`);

    // Если данных нет в Strapi - используем fallback на старый API с явным логированием
    if (!strapiProducts || strapiProducts.length === 0) {
      console.warn(`[CATEGORIES] ⚠️  Нет продуктов в Strapi для category slug "${categorySlug}", используем fallback на старый API`);
      const allProducts = await fetchProducts(locale);
      return allProducts
        .filter(
          (p) =>
            p.category?.toLowerCase().replace(/\s+/g, '-') === categorySlug ||
            p.category?.toLowerCase() === categorySlug
        )
        .map((p) => ({
          id: p.sku,
          name: p.name,
          brand: p.brand,
          sku: p.sku,
          price: p.price || 0,
          imageUrl: p.imageUrl || '/image/CB249_B-Qube-2.png',
          ...(p.category ? { category: p.category } : {}),
          ...(p.description ? { description: p.description } : {}),
        }));
    }

    console.log(`[CATEGORIES] ✅ Данные из Strapi (${strapiProducts.length} продуктов)`);
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL || '';
    return strapiProducts.map((p): Product => {
      const imageUrl = p.image?.data?.url;
      const fullImageUrl = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`) : '/image/CB249_B-Qube-2.png';
      return {
        sku: p.sku,
        name: p.name,
        brand: p.brand?.data?.name || '',
        price: p.price || 0,
        image: fullImageUrl,
        imageUrl: fullImageUrl,
        ...(p.category?.data?.name !== undefined ? { category: p.category.data.name as any } : {}),
        ...(p.description || p.shortDescription ? { description: p.description || p.shortDescription } : {}),
      };
    });
  } catch (error) {
    console.error(`[CATEGORIES] ❌ Ошибка при запросе к Strapi для category slug "${categorySlug}":`, error);
    console.warn(`[CATEGORIES] ⚠️  Используем fallback на старый API из-за ошибки`);
    // Возвращаем fallback при ошибке, чтобы страница не падала
    try {
      const allProducts = await fetchProducts(locale);
      return allProducts
        .filter(
          (p) =>
            p.category?.toLowerCase().replace(/\s+/g, '-') === categorySlug ||
            p.category?.toLowerCase() === categorySlug
        )
        .map((p): Product => ({
          sku: p.sku,
          name: p.name,
          brand: p.brand,
          price: p.price || 0,
          image: p.imageUrl || p.image || '/image/CB249_B-Qube-2.png',
          imageUrl: p.imageUrl || p.image || '/image/CB249_B-Qube-2.png',
          ...(p.category ? { category: p.category as any } : {}),
          ...(p.description ? { description: p.description } : {}),
        }));
    } catch (fallbackError) {
      console.error('[CATEGORIES] Fallback API также не сработал:', fallbackError);
      return [];
    }
  }
}

/**
 * Получить данные категории по slug (название, описание, баннер и т.д.)
 */
export interface CategoryData {
  name: string;
  slug: string;
  description: string | null;
  bannerImage: string | null;
  bannerAlt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

function pickMediaUrl(media: any): string | null {
  const url =
    media?.url ||
    media?.data?.attributes?.url ||
    media?.attributes?.url ||
    null;

  return absoluteMediaUrl(url);
}

export async function getCategoryDataBySlug(slug: string, locale?: string): Promise<CategoryData | null> {
  const params = new URLSearchParams();
  params.set('filters[slug][$eq]', slug);
  // Используем конкретные поля для bannerImage, чтобы избежать ошибки "Invalid key related"
  params.set('populate[bannerImage][fields][0]', 'url');
  params.set('populate[bannerImage][fields][1]', 'alternativeText');
  
  // Если locale не из списка разрешенных — не передавать locale вообще (Strapi возьмёт default)
  const allowed = new Set(['en-CA', 'fr-CA']);
  if (locale && allowed.has(locale)) {
    params.set('locale', locale);
  }

  const json = await strapiGet(`/api/categories?${params.toString()}`);
  const list = Array.isArray(json?.data) ? json.data : [];

  // Логируем результат для диагностики
  if (typeof window === 'undefined') {
    console.log(`[CATEGORIES] getCategoryDataBySlug slug="${slug}" locale="${locale || 'none'}" result:`, list.length > 0 ? `found (${list.length})` : 'not found (empty array)');
  }

  // Ключевое: если список пустой — возвращаем null (чтобы страница стала 404)
  if (!list.length) return null;

  const item = list[0];
  const a = item?.attributes || item;

  // Извлекаем bannerAlt: сначала из поля категории, затем из alternativeText изображения
  const bannerAlt = a?.bannerAlt ?? a?.bannerImage?.alternativeText ?? null;

  return {
    name: a?.name || '',
    slug: a?.slug || slug,
    description: a?.description ?? null,
    bannerImage: pickMediaUrl(a?.bannerImage),
    bannerAlt,
    seoTitle: a?.seoTitle ?? null,
    seoDescription: a?.seoDescription ?? null,
  };
}

/**
 * Получить продукты по slug подкатегории
 */
export async function fetchProductsBySubcategorySlug(
  categorySlug: string,
  subSlug: string,
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<CategoryProduct[]> {
  try {
    // Пытаемся получить из Strapi
    const params: StrapiQueryParams = {
      populate: {
        brand: true,
        category: true,
        subcategory: true,
        image: true,
      },
      filters: {
        category: {
          slug: {
            $eq: categorySlug,
          },
        },
        subcategory: {
          slug: {
            $eq: subSlug,
          },
        },
      },
      locale: localeToStrapiLocale(locale),
    };

    interface StrapiProduct {
      id: number;
      documentId?: string;
      sku: string;
      name: string;
      price?: number;
      shortDescription?: string;
      description?: string;
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
      subcategory?: {
        data?: {
          id?: number;
          name?: string;
          slug?: string;
        };
      };
      image?: {
        data?: {
          url?: string;
        };
      };
      locale?: string;
    }

    const strapiProducts = await strapiGetCollection<StrapiProduct>(
      '/api/products',
      params,
      {
        next: { revalidate: 60 },
      }
    );

    if (!strapiProducts || strapiProducts.length === 0) {
      console.warn(`[CATEGORIES] ⚠️  Нет продуктов в Strapi для subcategory "${categorySlug}/${subSlug}", используем fallback`);
      return [];
    }

    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL || '';
    return strapiProducts.map((p): Product => {
      const imageUrl = p.image?.data?.url;
      const fullImageUrl = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`) : '/image/CB249_B-Qube-2.png';
      return {
        sku: p.sku,
        name: p.name,
        brand: p.brand?.data?.name || '',
        price: p.price || 0,
        image: fullImageUrl,
        imageUrl: fullImageUrl,
        ...(p.category?.data?.name !== undefined ? { category: p.category.data.name as any } : {}),
        ...(p.description || p.shortDescription ? { description: p.description || p.shortDescription } : {}),
      };
    });
  } catch (error) {
    console.error(`[CATEGORIES] ❌ Ошибка при запросе к Strapi для subcategory "${categorySlug}/${subSlug}":`, error);
    return [];
  }
}

/**
 * Получить данные подкатегории по slug (опционально)
 */
export async function getSubcategoryDataBySlug(
  categorySlug: string,
  subSlug: string,
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<CategoryData | null> {
  try {
    const params: StrapiQueryParams = {
      populate: {
        bannerImage: true,
      },
      filters: {
        category: {
          slug: {
            $eq: categorySlug,
          },
        },
        slug: {
          $eq: subSlug,
        },
      },
      locale: localeToStrapiLocale(locale),
    };

    interface StrapiSubcategory {
      id: number;
      documentId?: string;
      name: string;
      slug: string;
      description?: string;
      bannerImage?: {
        data?: {
          url?: string;
          alternativeText?: string;
        };
      };
      locale?: string;
    }

    const strapiSubcategory = await strapiGetOne<StrapiSubcategory>(
      '/api/subcategories',
      params,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!strapiSubcategory) {
      return null;
    }

    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL || '';
    const bannerUrl = strapiSubcategory.bannerImage?.data?.url;
    
    return {
      name: strapiSubcategory.name,
      slug: strapiSubcategory.slug,
      ...(strapiSubcategory.description !== undefined ? { description: strapiSubcategory.description } : {}),
      ...(bannerUrl ? {
        bannerImage: bannerUrl.startsWith('http') ? bannerUrl : `${baseUrl}${bannerUrl}`,
      } : {}),
      ...(strapiSubcategory.bannerImage?.data?.alternativeText || strapiSubcategory.name ? {
        bannerAlt: strapiSubcategory.bannerImage?.data?.alternativeText || `${strapiSubcategory.name} banner`,
      } : {}),
    };
  } catch (error) {
    console.error(`[CATEGORIES] ❌ Ошибка при запросе к Strapi для subcategory "${categorySlug}/${subSlug}":`, error);
    return null;
  }
}

