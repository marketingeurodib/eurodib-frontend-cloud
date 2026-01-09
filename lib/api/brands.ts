// lib/api/brands.ts
// API для получения продуктов брендов из Strapi

import { strapiGetCollection, strapiGetOne, type StrapiQueryParams } from './strapiClient';
import type { Product } from '../../data/products';
import { fetchProducts } from '../productsApi';
import type { SupportedLocale } from '../utils/locale';
import { DEFAULT_LOCALE, localeToStrapiLocale } from '../utils/locale';

export interface BrandProduct {
  id: string;
  name: string;
  brand: string;
  sku: string;
  price: number;
  imageUrl: string;
  category?: string;
  description?: string;
}

/**
 * Получить продукты бренда ATMOVAC
 */
export async function fetchAtmovacProducts(): Promise<BrandProduct[]> {
  // TODO: Заменить на запрос к Strapi/SAP
  // const res = await fetch(`${process.env.STRAPI_URL}/api/products?filters[brand][slug][$eq]=atmovac&populate=*`);
  
  // Пока используем локальный API
  try {
    const allProducts = await fetchProducts();
    return allProducts
      .filter((p) => p.brand.toLowerCase() === 'atmovac')
      .map((p) => ({
        id: p.sku,
        name: p.name,
        brand: p.brand,
        sku: p.sku,
        price: p.price || 0,
        imageUrl: p.imageUrl || '/image/CB249_B-Qube-2.png',
        category: p.category,
        description: p.description,
      }));
  } catch (error) {
    console.error('Error fetching Atmovac products:', error);
    // Fallback мок-данные
    return [
      {
        id: 'arctic-12',
        name: 'Chamber Vacuum Machine',
        brand: 'ATMOVAC',
        sku: 'ARCTIC-12',
        price: 4200,
        imageUrl: '/image/CB249_B-Qube-2.png',
        category: 'Vacuum Sealing',
      },
      {
        id: 'chinook-16',
        name: 'Chamber Vacuum Machine',
        brand: 'ATMOVAC',
        sku: 'CHINOOK-16',
        price: 5100,
        imageUrl: '/image/CB249_B-Qube-2.png',
        category: 'Vacuum Sealing',
      },
      {
        id: 'diablo-20',
        name: 'Chamber Vacuum Machine',
        brand: 'ATMOVAC',
        sku: 'DIABLO-20',
        price: 6300,
        imageUrl: '/image/CB249_B-Qube-2.png',
        category: 'Vacuum Sealing',
      },
    ];
  }
}

/**
 * Получить продукты бренда Resolute
 */
export async function fetchResoluteProducts(): Promise<BrandProduct[]> {
  // TODO: Заменить на запрос к Strapi/SAP
  
  try {
    const allProducts = await fetchProducts();
    return allProducts
      .filter((p) => p.brand.toLowerCase() === 'resolute')
      .map((p) => ({
        id: p.sku,
        name: p.name,
        brand: p.brand,
        sku: p.sku,
        price: p.price || 0,
        imageUrl: p.imageUrl || '/image/CB249_B-Qube-2.png',
        category: p.category,
        description: p.description,
      }));
  } catch (error) {
    console.error('Error fetching Resolute products:', error);
    // Fallback мок-данные
    return [
      {
        id: 'rwd-100',
        name: 'Water & Ice Dispenser',
        brand: 'Resolute',
        sku: 'RWD-100',
        price: 2000,
        imageUrl: '/image/CB249_B-Qube-2.png',
        category: 'Ice Machines',
      },
      {
        id: 'rwd-200',
        name: 'Water & Ice Dispenser',
        brand: 'Resolute',
        sku: 'RWD-200',
        price: 2100,
        imageUrl: '/image/CB249_B-Qube-2.png',
        category: 'Ice Machines',
      },
      {
        id: 'rim-300',
        name: 'Ice Maker',
        brand: 'Resolute',
        sku: 'RIM-300',
        price: 2200,
        imageUrl: '/image/CB249_B-Qube-2.png',
        category: 'Ice Machines',
      },
      {
        id: 'rim-400',
        name: 'Ice Maker',
        brand: 'Resolute',
        sku: 'RIM-400',
        price: 2300,
        imageUrl: '/image/CB249_B-Qube-2.png',
        category: 'Ice Machines',
      },
      {
        id: 'rwd-500',
        name: 'Water & Ice Dispenser',
        brand: 'Resolute',
        sku: 'RWD-500',
        price: 2400,
        imageUrl: '/image/CB249_B-Qube-2.png',
        category: 'Ice Machines',
      },
      {
        id: 'racc-01',
        name: 'Accessory Kit',
        brand: 'Resolute',
        sku: 'RACC-01',
        price: 300,
        imageUrl: '/image/CB249_B-Qube-2.png',
        category: 'Accessories',
      },
      {
        id: 'racc-02',
        name: 'Accessory Kit',
        brand: 'Resolute',
        sku: 'RACC-02',
        price: 350,
        imageUrl: '/image/CB249_B-Qube-2.png',
        category: 'Accessories',
      },
      {
        id: 'rwd-600',
        name: 'Water & Ice Dispenser',
        brand: 'Resolute',
        sku: 'RWD-600',
        price: 2500,
        imageUrl: '/image/CB249_B-Qube-2.png',
        category: 'Ice Machines',
      },
      {
        id: 'rwd-700',
        name: 'Water & Ice Dispenser',
        brand: 'Resolute',
        sku: 'RWD-700',
        price: 2600,
        imageUrl: '/image/CB249_B-Qube-2.png',
        category: 'Ice Machines',
      },
    ];
  }
}

/**
 * Получить продукты бренда Eurodib
 */
export async function fetchEurodibProducts(): Promise<BrandProduct[]> {
  // TODO: Заменить на запрос к Strapi/SAP
  
  try {
    const allProducts = await fetchProducts();
    return allProducts
      .filter((p) => p.brand.toLowerCase() === 'eurodib')
      .map((p) => ({
        id: p.sku,
        name: p.name,
        brand: p.brand,
        sku: p.sku,
        price: p.price || 0,
        imageUrl: p.imageUrl || '/image/CB249_B-Qube-2.png',
        category: p.category,
        description: p.description,
      }));
  } catch (error) {
    console.error('Error fetching Eurodib products:', error);
    return [];
  }
}

/**
 * Получить продукты по slug бренда (для динамических страниц)
 */
export async function fetchProductsByBrandSlug(brandSlug: string, locale: SupportedLocale = DEFAULT_LOCALE): Promise<BrandProduct[]> {
  try {
    // Пытаемся получить из Strapi
    const params: StrapiQueryParams = {
      populate: {
        brand: true,
        category: true,
        image: true,
      },
      filters: {
        brand: {
          slug: {
            $eq: brandSlug,
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
    console.log(`[BRANDS] Strapi вернул ${strapiProducts?.length || 0} продуктов для brand slug "${brandSlug}" и locale ${locale}`);

    // Если данных нет в Strapi - используем fallback на старый API с явным логированием
    if (!strapiProducts || strapiProducts.length === 0) {
      console.warn(`[BRANDS] ⚠️  Нет продуктов в Strapi для brand slug "${brandSlug}", используем fallback на старый API`);
      const allProducts = await fetchProducts(locale);
      return allProducts
        .filter(
          (p) =>
            p.brand.toLowerCase() === brandSlug ||
            p.brand.toLowerCase().replace(/\s+/g, '-') === brandSlug
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

    console.log(`[BRANDS] ✅ Данные из Strapi (${strapiProducts.length} продуктов)`);
    return strapiProducts.map((p) => ({
      id: String(p.id),
      name: p.name,
      brand: p.brand?.data?.name || '',
      sku: p.sku,
      price: p.price || 0,
      imageUrl: p.image?.data?.url || '/image/CB249_B-Qube-2.png',
      // Заменяем undefined на null или не включаем поле для сериализации
      ...(p.category?.data?.name !== undefined ? { category: p.category.data.name } : {}),
      ...(p.description || p.shortDescription ? { description: p.description || p.shortDescription } : {}),
    }));
  } catch (error) {
    console.error(`[BRANDS] ❌ Ошибка при запросе к Strapi для brand slug "${brandSlug}":`, error);
    console.warn(`[BRANDS] ⚠️  Используем fallback на старый API из-за ошибки`);
    // Возвращаем fallback при ошибке, чтобы страница не падала
    try {
      const allProducts = await fetchProducts(locale);
      return allProducts
        .filter(
          (p) =>
            p.brand.toLowerCase() === brandSlug ||
            p.brand.toLowerCase().replace(/\s+/g, '-') === brandSlug
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
    } catch (fallbackError) {
      console.error('[BRANDS] Fallback API также не сработал:', fallbackError);
      return [];
    }
  }
}

/**
 * Получить данные бренда по slug (название, описание, баннер и т.д.)
 */
export interface BrandData {
  name: string;
  slug: string;
  description?: string;
  bannerImage?: string;
  bannerAlt?: string;
}

export async function getBrandDataBySlug(brandSlug: string, locale: SupportedLocale = DEFAULT_LOCALE): Promise<BrandData | null> {
  try {
    // Пытаемся получить из Strapi
    const params: StrapiQueryParams = {
      populate: {
        bannerImage: true,
      },
      filters: {
        slug: {
          $eq: brandSlug,
        },
      },
      locale: localeToStrapiLocale(locale),
    };

    // Strapi v5 Document-based структура (без attributes)
    interface StrapiBrand {
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

    const strapiBrand = await strapiGetOne<StrapiBrand>(
      '/api/brands',
      params,
      {
        next: { revalidate: 3600 }, // Кэш на 1 час
      }
    );

    // Логируем результат запроса
    console.log(`[BRANDS] Strapi вернул ${strapiBrand ? '1' : '0'} бренд для slug "${brandSlug}" и locale ${locale}`);

    // Если бренда нет в Strapi - используем fallback с явным логированием
    if (!strapiBrand) {
      console.warn(`[BRANDS] ⚠️  Бренд не найден в Strapi для slug "${brandSlug}", используем fallback из продуктов`);
      const products = await fetchProductsByBrandSlug(brandSlug, locale);
      if (products.length === 0) {
        return null;
      }
      const brandName = products[0]?.brand || brandSlug.toUpperCase();
      return {
        name: brandName,
        slug: brandSlug,
        description: `Browse our selection of ${brandName} products.`,
      };
    }

    console.log(`[BRANDS] ✅ Данные из Strapi для бренда "${strapiBrand.name}"`);
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || '';
    const bannerUrl = strapiBrand.bannerImage?.data?.url;
    
    return {
      name: strapiBrand.name,
      slug: strapiBrand.slug,
      // Заменяем undefined на null или не включаем поле для сериализации
      ...(strapiBrand.description !== undefined ? { description: strapiBrand.description } : {}),
      ...(bannerUrl ? {
        bannerImage: bannerUrl.startsWith('http') ? bannerUrl : `${baseUrl}${bannerUrl}`,
      } : {}),
      ...(strapiBrand.bannerImage?.data?.alternativeText || strapiBrand.name ? {
        bannerAlt: strapiBrand.bannerImage?.data?.alternativeText || `${strapiBrand.name} banner`,
      } : {}),
    };
  } catch (error) {
    console.error(`[BRANDS] ❌ Ошибка при запросе к Strapi для brand slug "${brandSlug}":`, error);
    console.warn(`[BRANDS] ⚠️  Используем fallback из продуктов из-за ошибки`);
    // Возвращаем fallback при ошибке, чтобы страница не падала
    try {
      const products = await fetchProductsByBrandSlug(brandSlug, locale);
      if (products.length === 0) {
        return null;
      }
      const brandName = products[0]?.brand || brandSlug.toUpperCase();
      return {
        name: brandName,
        slug: brandSlug,
        description: `Browse our selection of ${brandName} products.`,
      };
    } catch (fallbackError) {
      console.error('[BRANDS] Fallback также не сработал:', fallbackError);
      return null;
    }
  }
}
