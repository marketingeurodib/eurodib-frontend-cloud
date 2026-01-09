// lib/api/promos.ts
// API для получения промо-материалов из Strapi

import type { PromoItem } from '../types/promo';
import { strapiGetCollection, type StrapiQueryParams } from './strapiClient';
import { mockPromos } from '../mock/promos.mock';
import type { SupportedLocale } from '../utils/locale';
import { DEFAULT_LOCALE, localeToStrapiLocale } from '../utils/locale';

export type { PromoItem } from '../types/promo';

// Strapi v5 Document-based структура (без attributes)
interface StrapiPromo {
  id: number;
  documentId?: string;
  title?: string;
  dateFrom?: string;
  dateTo?: string;
  thumbUrl?: string;
  fileUrl?: string;
  sizeMb?: number;
  thumbnail?: { data?: { url?: string } };
  file?: { data?: { url?: string } };
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * Маппинг данных из Strapi в PromoItem
 * Strapi v5 использует Document-based структуру (без вложенного attributes)
 */
function mapStrapiToPromo(strapiPromo: StrapiPromo): PromoItem {
  return {
    id: String(strapiPromo.id),
    title: strapiPromo.title || '',
    dateFrom: strapiPromo.dateFrom || '',
    dateTo: strapiPromo.dateTo || '',
    thumbUrl: strapiPromo.thumbUrl || 
              strapiPromo.thumbnail?.data?.url || 
              'https://via.placeholder.com/90x90',
    fileUrl: strapiPromo.fileUrl || 
             strapiPromo.file?.data?.url || 
             '#',
    // Заменяем undefined на null или не включаем поле для сериализации
    ...(strapiPromo.sizeMb !== undefined ? { sizeMb: strapiPromo.sizeMb } : {}),
    ...(strapiPromo.id ? { strapiId: strapiPromo.id } : {}),
  };
}

/**
 * Получить все промо-материалы из Strapi
 * @param locale - Локаль (en-US, fr-CA, en-CA). По умолчанию 'en-CA'
 */
export async function fetchPromos(locale: SupportedLocale = DEFAULT_LOCALE): Promise<PromoItem[]> {
  try {
    const params: StrapiQueryParams = {
      populate: '*',
      locale: localeToStrapiLocale(locale),
    };

    const strapiPromos = await strapiGetCollection<StrapiPromo>(
      '/api/promos',
      params,
      {
        next: { revalidate: 3600 }, // Кэш на 1 час
      }
    );

    // Логируем результат запроса
    console.log(`[PROMOS] Strapi вернул ${strapiPromos?.length || 0} записей для locale ${locale}`);

    // Если данных нет в Strapi - используем fallback с явным логированием
    if (!strapiPromos || strapiPromos.length === 0) {
      console.warn(`[PROMOS] ⚠️  Нет данных в Strapi для locale ${locale}, используем fallback на моки`);
      return mockPromos;
    }

    console.log(`[PROMOS] ✅ Данные из Strapi (${strapiPromos.length} записей)`);
    return strapiPromos.map(mapStrapiToPromo);
  } catch (error) {
    console.error('[PROMOS] ❌ Ошибка при запросе к Strapi:', error);
    console.warn(`[PROMOS] ⚠️  Используем fallback на моки из-за ошибки`);
    // Возвращаем моки при ошибке, чтобы страница не падала
    return mockPromos;
  }
}

