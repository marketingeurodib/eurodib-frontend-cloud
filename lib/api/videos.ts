// lib/api/videos.ts
// API для получения видео из Strapi

import type { VideoItem } from '../types/video';
import { strapiGetCollection, type StrapiQueryParams } from './strapiClient';
import { mockVideos } from '../mock/videos.mock';
import type { SupportedLocale } from '../utils/locale';
import { DEFAULT_LOCALE, localeToStrapiLocale } from '../utils/locale';

export type { VideoItem } from '../types/video';

// Strapi v5 Document-based структура (без attributes)
// При populate=* связанные данные возвращаются напрямую, не в { data: ... }
interface StrapiVideo {
  id: number;
  documentId?: string;
  title: string;
  slug?: string;
  description?: string;
  // В Strapi v5 при populate связанные данные возвращаются напрямую
  brand?: {
    id?: number;
    name?: string;
    slug?: string;
  } | null;
  category?: {
    id?: number;
    name?: string;
    slug?: string;
  } | null;
  sku?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  sizeMb?: number;
  sapItemCode?: string;
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * Маппинг данных из Strapi в VideoItem
 * Strapi v5 использует Document-based структуру (без вложенного attributes)
 * При populate=* связанные данные возвращаются напрямую
 */
function mapStrapiToVideo(strapiVideo: StrapiVideo): VideoItem {
  const result = {
    id: String(strapiVideo.id),
    title: strapiVideo.title || '',
    brand: strapiVideo.brand?.name || '',
    brandSlug: strapiVideo.brand?.slug || '',
    category: strapiVideo.category?.name || '',
    categorySlug: strapiVideo.category?.slug || '',
    sku: strapiVideo.sku || '',
    thumbnailUrl: strapiVideo.thumbnailUrl || '',
    videoUrl: strapiVideo.videoUrl || '#',
    sizeMb: strapiVideo.sizeMb || 0,
    // Заменяем undefined на null для сериализации в getServerSideProps
    ...(strapiVideo.sapItemCode ? { sapItemCode: strapiVideo.sapItemCode } : {}),
  };
  
  // Логируем для отладки (только первые несколько записей)
  if (strapiVideo.id <= 3) {
    console.log(`[VIDEOS MAP] Video ${strapiVideo.id}:`, {
      title: result.title,
      brand: result.brand,
      brandSlug: result.brandSlug,
      category: result.category,
      categorySlug: result.categorySlug,
    });
  }
  
  return result;
}

/**
 * Получить все видео из Strapi
 * @param locale - Локаль (en-US, fr-CA, en-CA). По умолчанию 'en-CA'
 */
export async function fetchVideos(locale: SupportedLocale = DEFAULT_LOCALE): Promise<VideoItem[]> {
  try {
    const params: StrapiQueryParams = {
      populate: '*',
      locale: localeToStrapiLocale(locale),
    };

    const strapiVideos = await strapiGetCollection<StrapiVideo>(
      '/api/videos',
      params,
      {
        next: { revalidate: 3600 }, // Кэш на 1 час
      }
    );

    // Логируем результат запроса
    console.log(`[VIDEOS] Strapi вернул ${strapiVideos?.length || 0} записей для locale ${locale}`);

    // Если данных нет в Strapi - используем fallback с явным логированием
    if (!strapiVideos || strapiVideos.length === 0) {
      console.warn(`[VIDEOS] ⚠️  Нет данных в Strapi для locale ${locale}, используем fallback на моки`);
      return mockVideos;
    }

    console.log(`[VIDEOS] ✅ Данные из Strapi (${strapiVideos.length} записей)`);
    return strapiVideos.map(mapStrapiToVideo);
  } catch (error) {
    console.error('[VIDEOS] ❌ Ошибка при запросе к Strapi:', error);
    console.warn(`[VIDEOS] ⚠️  Используем fallback на моки из-за ошибки`);
    // Возвращаем моки при ошибке, чтобы страница не падала
    return mockVideos;
  }
}

