/**
 * Утилиты для работы с локалями
 * Поддерживаемые локали: en-US, fr-CA, en-CA
 */

export type SupportedLocale = 'en-US' | 'fr-CA' | 'en-CA';

export const DEFAULT_LOCALE: SupportedLocale = 'en-CA';

/**
 * Получить локаль из контекста Next.js (cookie, query, header)
 * Улучшенная версия с поддержкой Next.js i18n locale
 */
export function getLocaleFromContext(
  ctx: {
    req?: {
      cookies?: Record<string, string>;
      headers?: Record<string, string | string[] | undefined>;
    };
    query?: Record<string, string | string[] | undefined>;
    locale?: string;
  } | any
): SupportedLocale {
  // 0. Проверяем Next.js i18n locale (если настроено)
  const nextLocale = ctx?.locale;
  if (nextLocale && isSupportedLocale(nextLocale)) {
    return nextLocale;
  }

  // 1. Проверяем query параметр ?locale=...
  if (ctx.query?.locale) {
    const locale = String(ctx.query.locale);
    if (isSupportedLocale(locale)) {
      return locale;
    }
  }

  // 2. Проверяем cookie 'locale'
  if (ctx.req?.cookies?.locale) {
    const locale = ctx.req.cookies.locale;
    if (isSupportedLocale(locale)) {
      return locale;
    }
  }

  // 3. Проверяем Accept-Language header
  if (ctx.req?.headers?.['accept-language']) {
    const acceptLanguage = String(ctx.req.headers['accept-language']);
    const locale = parseAcceptLanguage(acceptLanguage);
    if (locale) {
      return locale;
    }
  }

  // 4. Возвращаем дефолтную локаль (en-CA для Strapi)
  return DEFAULT_LOCALE;
}

/**
 * Проверить, является ли строка поддерживаемой локалью
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return locale === 'en-US' || locale === 'fr-CA' || locale === 'en-CA';
}

/**
 * Парсинг Accept-Language header
 * Приоритет: fr-CA > en-CA > en-US
 */
function parseAcceptLanguage(acceptLanguage: string): SupportedLocale | null {
  const languages = acceptLanguage
    .split(',')
    .map((lang) => lang.split(';')[0].trim().toLowerCase());

  // Проверяем французский (Канада)
  if (languages.some((lang) => lang.startsWith('fr'))) {
    return 'fr-CA';
  }

  // Проверяем английский (Канада)
  if (languages.some((lang) => lang.startsWith('en'))) {
    // Если есть явное указание на CA, возвращаем en-CA
    if (languages.some((lang) => lang.includes('ca'))) {
      return 'en-CA';
    }
    // Иначе en-US (но можно и en-CA по умолчанию)
    return 'en-CA';
  }

  return null;
}

/**
 * Конвертировать локаль для Strapi
 * Strapi и фронт должны говорить на одном языке - передаем локаль как есть
 */
export function localeToStrapiLocale(locale: SupportedLocale): string {
  return locale;
}

/**
 * Получить язык из локали (для отображения в UI)
 */
export function getLanguageFromLocale(locale: SupportedLocale): 'en' | 'fr' {
  return locale.startsWith('fr') ? 'fr' : 'en';
}

/**
 * Получить регион из локали
 */
export function getRegionFromLocale(locale: SupportedLocale): 'US' | 'CA' {
  return locale.endsWith('US') ? 'US' : 'CA';
}
