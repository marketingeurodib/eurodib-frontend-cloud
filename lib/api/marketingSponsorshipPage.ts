// lib/api/marketingSponsorshipPage.ts
import { strapiGet } from './strapiClient';

export interface SelectOption {
  value: string;
  label: string;
}

export interface MarketingSponsorshipPageData {
  seoTitle: string | null;
  seoDescription: string | null;

  bannerImageUrl: string | null;
  bannerAlt: string | null;

  pageTitle: string | null;
  pageSubtitle: string | null;

  requestQuoteRedirectUrl: string | null;
  successUrl: string | null;

  subjectLabel: string | null;
  companyLabel: string | null;
  messageLabel: string | null;
  attachmentLabel: string | null;
  submitButtonText: string | null;
  captchaPlaceholderText: string | null;

  subjectOptions: SelectOption[];
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

export async function fetchMarketingSponsorshipPage(
  locale: string
): Promise<MarketingSponsorshipPageData> {
  // ВАЖНО: В Strapi v5 убираем populate для bannerImage из основного запроса, чтобы избежать ошибки с related
  // bannerImage будет получен из основного запроса без populate (может быть null или ID)
  // subjectOptions - это обычное поле (JSON/массив), не relation/component, поэтому его не нужно populate
  
  // Пробуем несколько вариантов endpoint'ов
  const possibleEndpoints = [
    `/api/marketing-sponsorship-page?locale=${encodeURIComponent(locale)}`,
    `/api/marketing-sponsorships-page?locale=${encodeURIComponent(locale)}`,
    `/api/marketing-sponsorship?locale=${encodeURIComponent(locale)}`,
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
      `[MARKETING-SPONSORSHIP-PAGE] Endpoint not found in Strapi. Tried: ${possibleEndpoints.join(', ')}. ` +
      `Using default values. Please create the content type in Strapi admin panel.`
    );
    return {
      seoTitle: null,
      seoDescription: null,
      bannerImageUrl: null,
      bannerAlt: null,
      pageTitle: null,
      pageSubtitle: null,
      requestQuoteRedirectUrl: null,
      successUrl: null,
      subjectLabel: null,
      companyLabel: null,
      messageLabel: null,
      attachmentLabel: null,
      submitButtonText: null,
      captchaPlaceholderText: null,
      subjectOptions: [],
    };
  }

  const d = jsonData?.data ?? null;

  // Если данные есть, но пустые, тоже возвращаем дефолтные значения
  if (!d) {
    console.warn(`[MARKETING-SPONSORSHIP-PAGE] No data from Strapi for locale ${locale}. Using default values.`);
    return {
      seoTitle: null,
      seoDescription: null,
      bannerImageUrl: null,
      bannerAlt: null,
      pageTitle: null,
      pageSubtitle: null,
      requestQuoteRedirectUrl: null,
      successUrl: null,
      subjectLabel: null,
      companyLabel: null,
      messageLabel: null,
      attachmentLabel: null,
      submitButtonText: null,
      captchaPlaceholderText: null,
      subjectOptions: [],
    };
  }

  const subjectOptions = Array.isArray(d.subjectOptions) ? d.subjectOptions : [];

  return {
    seoTitle: d.seoTitle ?? null,
    seoDescription: d.seoDescription ?? null,

    bannerImageUrl: pickMediaUrl(d.bannerImage),
    bannerAlt: d.bannerAlt ?? null,

    pageTitle: d.pageTitle ?? null,
    pageSubtitle: d.pageSubtitle ?? null,

    requestQuoteRedirectUrl: d.requestQuoteRedirectUrl ?? null,
    successUrl: d.successUrl ?? null,

    subjectLabel: d.subjectLabel ?? null,
    companyLabel: d.companyLabel ?? null,
    messageLabel: d.messageLabel ?? null,
    attachmentLabel: d.attachmentLabel ?? null,
    submitButtonText: d.submitButtonText ?? null,
    captchaPlaceholderText: d.captchaPlaceholderText ?? null,

    subjectOptions: subjectOptions
      .map((o: any) => ({
        value: String(o?.value ?? '').trim(),
        label: String(o?.label ?? '').trim(),
      }))
      .filter((o: any) => o.value && o.label),
  };
}

