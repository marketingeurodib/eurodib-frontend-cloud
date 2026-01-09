// lib/api/partsServicePage.ts
import { strapiGet } from './strapiClient';

export interface SelectOption {
  value: string;
  label: string;
}

export interface PartsServicePageData {
  seoTitle: string | null;
  seoDescription: string | null;

  bannerImageUrl: string | null;
  bannerAlt: string | null;

  pageTitle: string | null;
  pageSubtitle: string | null;

  tabPartsText: string | null;
  tabServiceText: string | null;

  subjectLabel: string | null;
  captchaPlaceholderText: string | null;
  submitButtonText: string | null;

  requestQuoteRedirectUrl: string | null;

  brandOptions: SelectOption[];
}

function pickMediaUrl(media: any): string | null {
  if (!media) return null;

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

export async function fetchPartsServicePage(locale: string): Promise<PartsServicePageData> {
  // ВАЖНО: В Strapi v5 убираем populate для bannerImage из основного запроса, чтобы избежать ошибки с related
  // bannerImage будет получен из основного запроса без populate (может быть null или ID)
  // brandOptions - это обычное поле (JSON/массив), не relation/component, поэтому его не нужно populate
  
  // Пробуем несколько вариантов endpoint'ов
  const possibleEndpoints = [
    `/api/parts-service-page?locale=${encodeURIComponent(locale)}`,
    `/api/parts-service?locale=${encodeURIComponent(locale)}`,
    `/api/partsservice-page?locale=${encodeURIComponent(locale)}`,
  ];

  let jsonData;
  let lastError: Error | null = null;

  for (const endpoint of possibleEndpoints) {
    try {
      jsonData = await strapiGet(endpoint);
      // Если успешно, выходим из цикла
      break;
    } catch (error: any) {
      lastError = error;
      // Если это не 404, выбрасываем ошибку сразу
      if (!error.message?.includes('404')) {
        throw error;
      }
      // Если 404, пробуем следующий endpoint
      continue;
    }
  }

  // Если все endpoint'ы вернули 404, возвращаем дефолтные значения
  if (!jsonData) {
    console.warn(
      `[PARTS-SERVICE-PAGE] Endpoint not found in Strapi. Tried: ${possibleEndpoints.join(', ')}. ` +
      `Using default values. Please create the content type in Strapi admin panel.`
    );
    return {
      seoTitle: null,
      seoDescription: null,
      bannerImageUrl: null,
      bannerAlt: null,
      pageTitle: null,
      pageSubtitle: null,
      tabPartsText: null,
      tabServiceText: null,
      subjectLabel: null,
      captchaPlaceholderText: null,
      submitButtonText: null,
      requestQuoteRedirectUrl: null,
      brandOptions: [],
    };
  }

  const d = jsonData?.data ?? null;

  // Если данные есть, но пустые, тоже возвращаем дефолтные значения
  if (!d) {
    console.warn(`[PARTS-SERVICE-PAGE] No data from Strapi for locale ${locale}. Using default values.`);
    return {
      seoTitle: null,
      seoDescription: null,
      bannerImageUrl: null,
      bannerAlt: null,
      pageTitle: null,
      pageSubtitle: null,
      tabPartsText: null,
      tabServiceText: null,
      subjectLabel: null,
      captchaPlaceholderText: null,
      submitButtonText: null,
      requestQuoteRedirectUrl: null,
      brandOptions: [],
    };
  }

  const brandOptions = Array.isArray(d.brandOptions) ? d.brandOptions : [];

  return {
    seoTitle: d.seoTitle ?? null,
    seoDescription: d.seoDescription ?? null,

    bannerImageUrl: pickMediaUrl(d.bannerImage),
    bannerAlt: d.bannerAlt ?? null,

    pageTitle: d.pageTitle ?? null,
    pageSubtitle: d.pageSubtitle ?? null,

    tabPartsText: d.tabPartsText ?? null,
    tabServiceText: d.tabServiceText ?? null,

    subjectLabel: d.subjectLabel ?? null,
    captchaPlaceholderText: d.captchaPlaceholderText ?? null,
    submitButtonText: d.submitButtonText ?? null,

    requestQuoteRedirectUrl: d.requestQuoteRedirectUrl ?? null,

    brandOptions: brandOptions
      .map((o: any) => ({
        value: String(o?.value ?? '').trim(),
        label: String(o?.label ?? '').trim(),
      }))
      .filter((o: any) => o.value && o.label),
  };
}

