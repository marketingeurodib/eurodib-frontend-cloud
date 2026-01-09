// lib/api/priceLists.ts
// API для получения прайс-листов из Strapi

import type { PriceListItem } from '../types/priceList';
import { strapiGetCollection, type StrapiQueryParams } from './strapiClient';
import { mockPriceLists } from '../mock/priceLists.mock';
import type { SupportedLocale } from '../utils/locale';
import { DEFAULT_LOCALE, localeToStrapiLocale } from '../utils/locale';

export type { PriceListItem } from '../types/priceList';

// Strapi v5 Document-based структура (без attributes)
interface StrapiPriceList {
  id: number;
  documentId?: string;
  title?: string;
  region?: string;
  validFrom?: string;
  validTo?: string;
  fileUrl?: string;
  sizeMb?: number;
  file?: { data?: { url?: string } };
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * Маппинг данных из Strapi в PriceListItem
 * Strapi v5 использует Document-based структуру (без вложенного attributes)
 */
function mapStrapiToPriceList(strapiPriceList: StrapiPriceList): PriceListItem {
  return {
    id: String(strapiPriceList.id),
    title: strapiPriceList.title || '',
    // Заменяем undefined на null или не включаем поле для сериализации
    ...(strapiPriceList.region !== undefined ? { region: strapiPriceList.region } : {}),
    ...(strapiPriceList.validFrom !== undefined ? { validFrom: strapiPriceList.validFrom } : {}),
    ...(strapiPriceList.validTo !== undefined ? { validTo: strapiPriceList.validTo } : {}),
    fileUrl: strapiPriceList.fileUrl || 
             strapiPriceList.file?.data?.url || 
             '#',
    ...(strapiPriceList.sizeMb !== undefined ? { sizeMb: strapiPriceList.sizeMb } : {}),
    ...(strapiPriceList.id ? { strapiId: strapiPriceList.id } : {}),
  };
}

/**
 * Получить все прайс-листы из Strapi
 * @param locale - Локаль (en-US, fr-CA, en-CA). По умолчанию 'en-CA'
 */
export async function fetchPriceLists(locale: SupportedLocale = DEFAULT_LOCALE): Promise<PriceListItem[]> {
  try {
    const params: StrapiQueryParams = {
      populate: '*',
      locale: localeToStrapiLocale(locale),
    };

    const strapiPriceLists = await strapiGetCollection<StrapiPriceList>(
      '/api/price-lists',
      params,
      {
        next: { revalidate: 3600 }, // Кэш на 1 час
      }
    );

    // Логируем результат запроса
    console.log(`[PRICE-LISTS] Strapi вернул ${strapiPriceLists?.length || 0} записей для locale ${locale}`);

    // Если данных нет в Strapi - используем fallback с явным логированием
    if (!strapiPriceLists || strapiPriceLists.length === 0) {
      console.warn(`[PRICE-LISTS] ⚠️  Нет данных в Strapi для locale ${locale}, используем fallback на моки`);
      return mockPriceLists;
    }

    console.log(`[PRICE-LISTS] ✅ Данные из Strapi (${strapiPriceLists.length} записей)`);
    return strapiPriceLists.map(mapStrapiToPriceList);
  } catch (error) {
    console.error('[PRICE-LISTS] ❌ Ошибка при запросе к Strapi:', error);
    console.warn(`[PRICE-LISTS] ⚠️  Используем fallback на моки из-за ошибки`);
    // Возвращаем моки при ошибке, чтобы страница не падала
    return mockPriceLists;
  }
}

