// lib/api/catalogues.ts
// API для получения каталогов из Strapi

import type { CatalogEntry } from '../types/catalogue';
import { strapiGetCollection, type StrapiQueryParams } from './strapiClient';
import { mockCatalogues } from '../mock/catalogues.mock';
import type { SupportedLocale } from '../utils/locale';
import { DEFAULT_LOCALE, localeToStrapiLocale } from '../utils/locale';

export type { CatalogEntry } from '../types/catalogue';

// Strapi v5 Document-based структура (без attributes)
interface StrapiCatalogue {
  id: number;
  documentId?: string;
  brandSlug?: string;
  brandName?: string;
  year?: string;
  thumbUrl?: string;
  fileUrl?: string;
  brand?: { data?: { id?: number; name?: string; slug?: string } };
  thumbnail?: { data?: { url?: string } };
  file?: { data?: { url?: string } };
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * Маппинг данных из Strapi в CatalogEntry
 * Strapi v5 использует Document-based структуру (без вложенного attributes)
 */
function mapStrapiToCatalogue(strapiCatalogue: StrapiCatalogue): CatalogEntry {
  const brand = strapiCatalogue.brand?.data;
  
  return {
    id: String(strapiCatalogue.id),
    brandSlug: strapiCatalogue.brandSlug || brand?.slug || '',
    brandName: strapiCatalogue.brandName || brand?.name || '',
    year: strapiCatalogue.year || '',
    thumbUrl: strapiCatalogue.thumbUrl || 
              strapiCatalogue.thumbnail?.data?.url || 
              'https://via.placeholder.com/90x90',
    fileUrl: strapiCatalogue.fileUrl || 
             strapiCatalogue.file?.data?.url || 
             '#',
  };
}

/**
 * Получить все каталоги из Strapi
 * @param locale - Локаль (en-US, fr-CA, en-CA). По умолчанию 'en-CA'
 */
export async function fetchCatalogues(locale: SupportedLocale = DEFAULT_LOCALE): Promise<CatalogEntry[]> {
  try {
    const params: StrapiQueryParams = {
      populate: '*',
      locale: localeToStrapiLocale(locale),
    };

    const strapiCatalogues = await strapiGetCollection<StrapiCatalogue>(
      '/api/catalogues',
      params,
      {
        next: { revalidate: 3600 }, // Кэш на 1 час
      }
    );

    // Логируем результат запроса
    console.log(`[CATALOGUES] Strapi вернул ${strapiCatalogues?.length || 0} записей для locale ${locale}`);

    // Если данных нет в Strapi - используем fallback с явным логированием
    if (!strapiCatalogues || strapiCatalogues.length === 0) {
      console.warn(`[CATALOGUES] ⚠️  Нет данных в Strapi для locale ${locale}, используем fallback на моки`);
      return mockCatalogues;
    }

    console.log(`[CATALOGUES] ✅ Данные из Strapi (${strapiCatalogues.length} записей)`);
    return strapiCatalogues.map(mapStrapiToCatalogue);
  } catch (error) {
    console.error('[CATALOGUES] ❌ Ошибка при запросе к Strapi:', error);
    console.warn(`[CATALOGUES] ⚠️  Используем fallback на моки из-за ошибки`);
    // Возвращаем моки при ошибке, чтобы страница не падала
    return mockCatalogues;
  }
}

