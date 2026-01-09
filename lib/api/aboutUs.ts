// lib/api/aboutUs.ts
// API для получения данных страницы About Us из Strapi

import { strapiGetOne, type StrapiQueryParams } from './strapiClient';
import type { SupportedLocale } from '../utils/locale';
import { DEFAULT_LOCALE, localeToStrapiLocale } from '../utils/locale';

export interface AboutUsTextBlock {
  title: string;
  text: string;
}

export interface AboutUsStatItem {
  value: string;
  label: string;
}

export interface AboutUsPage {
  seoTitle: string | null;
  seoDescription: string | null;
  heroTitle: string | null;
  ourStorySubtitle: string | null;
  ourStoryTitle: string | null;
  ourStoryText: string | null;
  historyTitle: string | null;
  historyText: string | null;
  innovationItems: AboutUsTextBlock[];
  stats: AboutUsStatItem[];
  presenceBlocks: AboutUsTextBlock[];
  presenceImageUrl: string | null;
  locale: string | null;
}

/**
 * Извлечь URL медиа из Strapi v5 ответа
 * Поддерживает различные форматы: прямой url, data.url, data.attributes.url
 */
function pickMediaUrl(media: any): string | null {
  if (!media) return null;

  const url =
    media?.url ||
    media?.data?.url ||
    media?.data?.attributes?.url ||
    null;

  if (!url) return null;

  // Если URL уже полный (начинается с http), возвращаем как есть
  if (url.startsWith('http')) return url;

  // Иначе добавляем базовый URL Strapi
  const base = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  return `${base}${url}`;
}

// Strapi v5 Document-based структура (без attributes)
interface StrapiAboutUs {
  id: number;
  documentId?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  heroTitle?: string | null;
  ourStorySubtitle?: string | null;
  ourStoryTitle?: string | null;
  ourStoryText?: string | null;
  historyTitle?: string | null;
  historyText?: string | null;
  innovationItems?: Array<{ title?: string; text?: string }> | null;
  stats?: Array<{ value?: string; label?: string }> | null;
  presenceBlocks?: Array<{ title?: string; text?: string }> | null;
  presenceImage?: any; // Медиа может быть в разных форматах
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * Получить данные страницы About Us из Strapi
 * @param locale - Локаль (en-US, fr-CA, en-CA). По умолчанию 'en-CA'
 */
export async function fetchAboutUs(locale: SupportedLocale = DEFAULT_LOCALE): Promise<AboutUsPage> {
  try {
    // Важно: populate нужен, чтобы компоненты и медиа пришли корректно
    const params: StrapiQueryParams = {
      locale: localeToStrapiLocale(locale),
      populate: '*',
    };

    const strapiData = await strapiGetOne<StrapiAboutUs>(
      '/api/about-us',
      params,
      {
        next: { revalidate: 3600 }, // Кэш на 1 час
      }
    );

    // Логируем результат запроса
    console.log(`[ABOUT-US] Strapi вернул ${strapiData ? '1' : '0'} запись для locale ${locale}`);

    if (!strapiData) {
      throw new Error(`No data from Strapi for About Us locale ${locale}`);
    }

    console.log(`[ABOUT-US] ✅ Данные из Strapi для locale ${locale}`);

    return {
      seoTitle: strapiData.seoTitle ?? null,
      seoDescription: strapiData.seoDescription ?? null,
      heroTitle: strapiData.heroTitle ?? null,
      ourStorySubtitle: strapiData.ourStorySubtitle ?? null,
      ourStoryTitle: strapiData.ourStoryTitle ?? null,
      ourStoryText: strapiData.ourStoryText ?? null,
      historyTitle: strapiData.historyTitle ?? null,
      historyText: strapiData.historyText ?? null,
      innovationItems: Array.isArray(strapiData.innovationItems)
        ? strapiData.innovationItems.map((x: any) => ({
            title: x?.title ?? '',
            text: x?.text ?? '',
          }))
        : [],
      stats: Array.isArray(strapiData.stats)
        ? strapiData.stats.map((x: any) => ({
            value: x?.value ?? '',
            label: x?.label ?? '',
          }))
        : [],
      presenceBlocks: Array.isArray(strapiData.presenceBlocks)
        ? strapiData.presenceBlocks.map((x: any) => ({
            title: x?.title ?? '',
            text: x?.text ?? '',
          }))
        : [],
      presenceImageUrl: pickMediaUrl(strapiData.presenceImage),
      locale: strapiData.locale ?? null,
    };
  } catch (error: any) {
    console.error('[ABOUT-US] ❌ Ошибка при запросе к Strapi:', error);
    
    // Если это сетьевая ошибка или 404, возвращаем дефолтные значения вместо пробрасывания ошибки
    if (error?.message?.includes('Network error') || error?.message?.includes('404') || error?.message?.includes('fetch failed')) {
      console.warn('[ABOUT-US] ⚠️  Network error or 404, returning default values');
      return {
        seoTitle: null,
        seoDescription: null,
        heroTitle: null,
        ourStorySubtitle: null,
        ourStoryTitle: null,
        ourStoryText: null,
        historyTitle: null,
        historyText: null,
        innovationItems: [],
        stats: [],
        presenceBlocks: [],
        presenceImageUrl: null,
        locale: locale,
      };
    }
    
    // Для других ошибок пробрасываем дальше
    throw error;
  }
}
