/**
 * Типы для интеграции со Strapi
 * Эти типы будут использоваться когда подключим Strapi
 */

// Базовые типы Strapi
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiCollectionResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Типы для Brand из Strapi
export interface StrapiBrand {
  id: number;
  attributes: {
    name: string;
    slug: string;
    description?: string;
    bannerImage?: {
      data: StrapiImage | null;
    };
    seoTitle?: string;
    seoDescription?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  };
}

// Типы для Category из Strapi
export interface StrapiCategory {
  id: number;
  attributes: {
    name: string;
    slug: string;
    description?: string;
    bannerImage?: {
      data: StrapiImage | null;
    };
    seoTitle?: string;
    seoDescription?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  };
}

// Типы для Product из Strapi
export interface StrapiProduct {
  id: number;
  attributes: {
    sku: string;
    name: string;
    brand?: {
      data: StrapiBrand | null;
    };
    category?: {
      data: StrapiCategory | null;
    };
    price: number;
    image?: {
      data: StrapiImage | null;
    };
    shortDescription?: string;
    iceType?: string;
    inStock?: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  };
}

// Типы для изображений Strapi
export interface StrapiImage {
  id: number;
  attributes: {
    name: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: StrapiImageFormat;
      small?: StrapiImageFormat;
      medium?: StrapiImageFormat;
      large?: StrapiImageFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface StrapiImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path?: string;
  url: string;
}

// Конфигурация фильтров из Strapi
export interface StrapiFilterConfig {
  categories?: Array<{
    label: string;
    value: string;
    count: number;
  }>;
  iceTypes?: Array<{
    label: string;
    value: string;
    count: number;
  }>;
  yield?: Array<{
    label: string;
    value: string;
    count: number;
  }>;
  priceRange?: {
    min: number;
    max: number;
  };
  showInStock?: boolean;
}

// Вспомогательные функции для работы со Strapi (будут использоваться позже)
export function getStrapiImageUrl(image: StrapiImage | null | undefined): string | undefined {
  if (!image?.attributes?.url) return undefined;
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || '';
  return image.attributes.url.startsWith('http')
    ? image.attributes.url
    : `${baseUrl}${image.attributes.url}`;
}

export function formatStrapiBrand(brand: StrapiBrand) {
  return {
    id: brand.id,
    name: brand.attributes.name,
    slug: brand.attributes.slug,
    description: brand.attributes.description,
    bannerImage: getStrapiImageUrl(brand.attributes.bannerImage?.data || null),
    seoTitle: brand.attributes.seoTitle || brand.attributes.name,
    seoDescription: brand.attributes.seoDescription || brand.attributes.description,
  };
}

export function formatStrapiCategory(category: StrapiCategory) {
  return {
    id: category.id,
    name: category.attributes.name,
    slug: category.attributes.slug,
    description: category.attributes.description,
    bannerImage: getStrapiImageUrl(category.attributes.bannerImage?.data || null),
    seoTitle: category.attributes.seoTitle || category.attributes.name,
    seoDescription: category.attributes.seoDescription || category.attributes.description,
  };
}
