/**
 * API функции для работы со Strapi
 * Базовый клиент для всех запросов к Strapi
 */

import type {
  StrapiBrand,
  StrapiCategory,
  StrapiProduct,
  StrapiCollectionResponse,
  StrapiResponse,
} from '../types/strapi';

// URL и токен для серверных запросов (getServerSideProps, API routes)
const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

/**
 * Базовая функция для запросов к Strapi API
 */
async function strapiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${STRAPI_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Добавляем токен авторизации, если он есть
  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Получить бренд по slug
 */
export async function getBrandBySlug(slug: string): Promise<StrapiBrand | null> {
  try {
    const data: StrapiCollectionResponse<StrapiBrand> = await strapiFetch(
      `/api/brands?filters[slug][$eq]=${slug}&populate=*`,
      {
        next: { revalidate: 3600 }, // Кэш на 1 час
      }
    );

    if (!data.data || data.data.length === 0) {
      return null;
    }

    return data.data[0];
  } catch (error) {
    console.error('Error fetching brand from Strapi:', error);
    return null;
  }
}

/**
 * Получить все бренды
 */
export async function getAllBrands(): Promise<StrapiBrand[]> {
  try {
    const data: StrapiCollectionResponse<StrapiBrand> = await strapiFetch(
      `/api/brands?populate=*`,
      {
        next: { revalidate: 3600 },
      }
    );
    return data.data || [];
  } catch (error) {
    console.error('Error fetching brands from Strapi:', error);
    return [];
  }
}

/**
 * Получить категорию по slug
 */
export async function getCategoryBySlug(slug: string): Promise<StrapiCategory | null> {
  try {
    const data: StrapiCollectionResponse<StrapiCategory> = await strapiFetch(
      `/api/categories?filters[slug][$eq]=${slug}&populate=*`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!data.data || data.data.length === 0) {
      return null;
    }

    return data.data[0];
  } catch (error) {
    console.error('Error fetching category from Strapi:', error);
    return null;
  }
}

/**
 * Получить все категории
 */
export async function getAllCategories(): Promise<StrapiCategory[]> {
  try {
    const data: StrapiCollectionResponse<StrapiCategory> = await strapiFetch(
      `/api/categories?populate=*`,
      {
        next: { revalidate: 3600 },
      }
    );
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories from Strapi:', error);
    return [];
  }
}

/**
 * Получить продукты по slug бренда
 */
export async function getProductsByBrandSlug(slug: string): Promise<StrapiProduct[]> {
  try {
    const data: StrapiCollectionResponse<StrapiProduct> = await strapiFetch(
      `/api/products?filters[brand][slug][$eq]=${slug}&populate=*`,
      {
        next: { revalidate: 60 }, // Кэш на 1 минуту (чаще обновляем)
      }
    );
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products from Strapi:', error);
    return [];
  }
}

/**
 * Получить продукты по slug категории
 */
export async function getProductsByCategorySlug(slug: string): Promise<StrapiProduct[]> {
  try {
    const data: StrapiCollectionResponse<StrapiProduct> = await strapiFetch(
      `/api/products?filters[category][slug][$eq]=${slug}&populate=*`,
      {
        next: { revalidate: 60 },
      }
    );
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products from Strapi:', error);
    return [];
  }
}

/**
 * Получить продукт по SKU
 */
export async function getProductBySku(sku: string): Promise<StrapiProduct | null> {
  try {
    const data: StrapiCollectionResponse<StrapiProduct> = await strapiFetch(
      `/api/products?filters[sku][$eq]=${sku}&populate=*`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!data.data || data.data.length === 0) {
      return null;
    }

    return data.data[0];
  } catch (error) {
    console.error('Error fetching product from Strapi:', error);
    return null;
  }
}

/**
 * Получить все продукты (с пагинацией)
 */
export async function getAllProducts(page = 1, pageSize = 100): Promise<{
  products: StrapiProduct[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}> {
  try {
    const data: StrapiCollectionResponse<StrapiProduct> = await strapiFetch(
      `/api/products?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
      {
        next: { revalidate: 60 },
      }
    );

    return {
      products: data.data || [],
      pagination: data.meta?.pagination || {
        page,
        pageSize,
        pageCount: 1,
        total: data.data?.length || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching products from Strapi:', error);
    return {
      products: [],
      pagination: {
        page,
        pageSize,
        pageCount: 0,
        total: 0,
      },
    };
  }
}

/**
 * Экспортируем базовую функцию для использования в других API модулях
 */
export { strapiFetch };
