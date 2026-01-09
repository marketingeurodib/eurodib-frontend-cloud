// lib/api/brandsPage.ts

export interface BrandCardItem {
  title: string;
  description: string;
  logoUrl: string | null;
  link: string;
  buttonText: string;
}

export interface BrandsPageData {
  seoTitle: string | null;
  seoDescription: string | null;
  pageTitle: string | null;
  pageSubtitle: string | null;
  bannerImageUrl: string | null;
  brandCards: BrandCardItem[];
}

function pickMediaUrl(media: any): string | null {
  if (!media) return null;

  // Strapi v5 обычно отдаёт media как объект с url напрямую
  const url =
    media.url ||
    media.data?.url ||
    media.data?.attributes?.url ||
    media.attributes?.url ||
    null;

  if (!url) return null;

  const base =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    process.env.STRAPI_URL ||
    'http://localhost:1337';

  return url.startsWith('http') ? url : `${base}${url}`;
}

function normalizeLink(linkRaw: any): string {
  const link = String(linkRaw || '').trim();
  if (!link) return '/';

  // если пользователь ввёл "google.com" — делаем корректно для href
  if (link.startsWith('http://') || link.startsWith('https://')) return link;
  if (link.startsWith('/')) return link;

  // иначе считаем, что это внешний домен без протокола
  return `https://${link}`;
}

export async function fetchBrandsPage(locale: string): Promise<BrandsPageData> {
  // ВАЖНО: используем прямой fetch с правильными заголовками для авторизации
  // Strapi для Single Type требует правильного формата запроса с локалью
  
  const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
  
  // ВАЖНО: Для Single Type в Strapi v5 локаль должна быть в query string БЕЗ других параметров, 
  // или параметры должны быть добавлены в правильном порядке
  // Попробуем разные варианты, чтобы понять, какой работает
  const params = new URLSearchParams();
  
  // Для Strapi v5 Single Type с локализацией может потребоваться другой формат
  // Попробуем установить локаль отдельно в начале
  params.set('locale', locale);
  
  // Populate для brandCards с логотипами
  params.set('populate[brandCards][populate][logo][fields][0]', 'url');
  params.set('populate[brandCards][populate][logo][fields][1]', 'alternativeText');
  // Populate для bannerImage
  params.set('populate[bannerImage][fields][0]', 'url');
  params.set('populate[bannerImage][fields][1]', 'alternativeText');
  
  // Также попробуем добавить publicationState для явного указания опубликованных данных
  params.set('publicationState', 'live');

  const queryString = params.toString();
  const endpoint = `/api/brands-page?${queryString}`;
  const fullUrl = `${STRAPI_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Добавляем токен авторизации, если он есть
  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }

  // Логируем запрос для отладки
  if (typeof window === 'undefined') {
    console.log('[BRANDS-PAGE] Request:', {
      locale,
      endpoint,
      fullUrl,
      hasToken: !!STRAPI_TOKEN,
      queryString,
    });
  }

  let jsonData: any;
  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
    headers,
      // Не используем next.revalidate здесь, так как это не Next.js fetch
  });

  if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      // Если 404, возвращаем дефолтные значения
      if (response.status === 404) {
        console.warn(`[BRANDS-PAGE] Endpoint not found for locale ${locale}, returning default values`);
        return {
          seoTitle: null,
          seoDescription: null,
          pageTitle: null,
          pageSubtitle: null,
          bannerImageUrl: null,
          brandCards: [],
        };
      }
      throw new Error(`Strapi API error: ${response.status} ${response.statusText}. Details: ${errorText.slice(0, 300)}`);
    }

    jsonData = await response.json();
  } catch (error: any) {
    // Если это не 404, пробрасываем ошибку дальше
    if (!error?.message?.includes('404')) {
      throw error;
    }
    // Для 404 возвращаем дефолтные значения
    console.warn(`[BRANDS-PAGE] Endpoint not found for locale ${locale}, returning default values`);
    return {
      seoTitle: null,
      seoDescription: null,
      pageTitle: null,
      pageSubtitle: null,
      bannerImageUrl: null,
      brandCards: [],
    };
  }

  // Strapi может возвращать данные в разных форматах:
  // 1. { data: { attributes: {...} } } - Strapi v4
  // 2. { data: {...} } - Strapi v5
  const d = jsonData?.data?.attributes || jsonData?.data || null;

  // Получаем локаль из ответа Strapi (может быть в разных местах)
  const responseLocale = d?.locale || jsonData?.data?.locale || jsonData?.data?.attributes?.locale || null;

  // Логируем ответ для отладки
  if (typeof window === 'undefined') {
    console.log('[BRANDS-PAGE] ========== RESPONSE DEBUG ==========');
    console.log('[BRANDS-PAGE] Requested locale:', locale);
    console.log('[BRANDS-PAGE] Response locale:', responseLocale || 'NOT SET IN RESPONSE');
    console.log('[BRANDS-PAGE] Has data:', !!d);
    console.log('[BRANDS-PAGE] Page title:', d?.pageTitle || 'not set');
    console.log('[BRANDS-PAGE] Page subtitle:', d?.pageSubtitle || 'not set');
    console.log('[BRANDS-PAGE] SEO title:', d?.seoTitle || 'not set');
    console.log('[BRANDS-PAGE] SEO description:', d?.seoDescription || 'not set');
    console.log('[BRANDS-PAGE] Brand cards count:', Array.isArray(d?.brandCards) ? d.brandCards.length : 0);
    console.log('[BRANDS-PAGE] Response structure:', jsonData?.data?.attributes ? 'v4 (with attributes)' : 'v5 (direct)');
    console.log('[BRANDS-PAGE] Raw data keys:', d ? Object.keys(d) : []);
    console.log('[BRANDS-PAGE] Full response data object keys:', jsonData?.data ? Object.keys(jsonData.data) : []);
    console.log('[BRANDS-PAGE] Full response (first 1500 chars):', JSON.stringify(jsonData, null, 2).substring(0, 1500));
    console.log('[BRANDS-PAGE] ====================================');
    
    // КРИТИЧЕСКАЯ ПРОВЕРКА: если локаль в ответе не совпадает с запрошенной
    if (responseLocale && responseLocale !== locale) {
      console.error(`[BRANDS-PAGE] ⚠️  WARNING: Requested locale "${locale}" but got "${responseLocale}"!`);
      console.error('[BRANDS-PAGE] This means Strapi is returning data from a different locale!');
      console.error('[BRANDS-PAGE] Please check Strapi admin panel:');
      console.error('[BRANDS-PAGE] 1. Make sure you have separate entries for each locale');
      console.error('[BRANDS-PAGE] 2. When editing, select the correct locale in the locale selector');
      console.error('[BRANDS-PAGE] 3. Use "Add locale" or "Create new entry" for each locale separately');
    } else if (!responseLocale) {
      console.warn(`[BRANDS-PAGE] ⚠️  WARNING: Response locale is not set!`);
      console.warn('[BRANDS-PAGE] This might mean that Strapi is not properly configured for localization');
      console.warn('[BRANDS-PAGE] OR that the data was saved without locale information');
    } else {
      console.log(`[BRANDS-PAGE] ✅ Locale match: Requested "${locale}" and got "${responseLocale}"`);
    }
  }

  if (!d) {
    throw new Error(`No data from Strapi for Brands Page locale ${locale}`);
  }

  // bannerImage получаем из основного запроса (может быть null, ID или объект)
  // Если это только ID, pickMediaUrl вернёт null, что нормально
  const bannerImageUrl = pickMediaUrl(d.bannerImage);

  const cards = Array.isArray(d.brandCards) ? d.brandCards : [];

  return {
    seoTitle: d.seoTitle ?? null,
    seoDescription: d.seoDescription ?? null,
    pageTitle: d.pageTitle ?? null,
    pageSubtitle: d.pageSubtitle ?? null,
    bannerImageUrl,

    brandCards: cards
      .map((c: any) => ({
        title: String(c?.title ?? '').trim(),
        description: String(c?.description ?? '').trim(),
        logoUrl: pickMediaUrl(c?.logo),
        link: normalizeLink(c?.link),
        buttonText: String(c?.buttonText ?? 'View Products >').trim() || 'View Products >',
      }))
      .filter((c: BrandCardItem) => c.title && c.link),
  };
}
