// lib/api/careerPage.ts
import { strapiGet } from './strapiClient';

export interface SelectOption {
  value: string;
  label: string;
}

export interface CareerPageData {
  seoTitle: string | null;
  seoDescription: string | null;

  bannerImageUrl: string | null;
  bannerAlt: string | null;

  pageTitle: string | null;
  pageSubtitle: string | null;

  requestQuoteRedirectUrl: string | null;

  subjectLabel: string | null;
  departmentLabel: string | null;
  resumeLabel: string | null;
  submitButtonText: string | null;
  captchaPlaceholderText: string | null;

  consentText: string | null;
  truthfulText: string | null;

  subjectOptions: SelectOption[];
  departmentOptions: SelectOption[];
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

export async function fetchCareerPage(locale: string): Promise<CareerPageData> {
  // ВАЖНО: В Strapi v5 убираем populate для bannerImage из основного запроса, чтобы избежать ошибки с related
  // bannerImage будет получен из основного запроса без populate (может быть null или ID)
  // subjectOptions и departmentOptions - это обычные поля (JSON/массивы), не relations/components, поэтому их не нужно populate
  
  // Пробуем несколько вариантов endpoint'ов
  const possibleEndpoints = [
    `/api/career-page?locale=${encodeURIComponent(locale)}`,
    `/api/careers-page?locale=${encodeURIComponent(locale)}`,
    `/api/career?locale=${encodeURIComponent(locale)}`,
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
  // Это позволяет странице работать даже если Content Type еще не создан в Strapi
  if (!jsonData) {
    console.warn(
      `[CAREER-PAGE] Endpoint not found in Strapi. Tried: ${possibleEndpoints.join(', ')}. ` +
      `Using default values. Please create the content type in Strapi admin panel.`
    );
    // Возвращаем дефолтные значения
    return {
      seoTitle: null,
      seoDescription: null,
      bannerImageUrl: null,
      bannerAlt: null,
      pageTitle: null,
      pageSubtitle: null,
      requestQuoteRedirectUrl: null,
      subjectLabel: null,
      departmentLabel: null,
      resumeLabel: null,
      submitButtonText: null,
      captchaPlaceholderText: null,
      consentText: null,
      truthfulText: null,
      subjectOptions: [],
      departmentOptions: [],
    };
  }

  const d = jsonData?.data ?? null;

  // Если данные есть, но пустые, тоже возвращаем дефолтные значения
  if (!d) {
    console.warn(`[CAREER-PAGE] No data from Strapi for locale ${locale}. Using default values.`);
    return {
      seoTitle: null,
      seoDescription: null,
      bannerImageUrl: null,
      bannerAlt: null,
      pageTitle: null,
      pageSubtitle: null,
      requestQuoteRedirectUrl: null,
      subjectLabel: null,
      departmentLabel: null,
      resumeLabel: null,
      submitButtonText: null,
      captchaPlaceholderText: null,
      consentText: null,
      truthfulText: null,
      subjectOptions: [],
      departmentOptions: [],
    };
  }

  const subjectOptions = Array.isArray(d.subjectOptions) ? d.subjectOptions : [];
  const departmentOptions = Array.isArray(d.departmentOptions) ? d.departmentOptions : [];

  return {
    seoTitle: d.seoTitle ?? null,
    seoDescription: d.seoDescription ?? null,

    bannerImageUrl: pickMediaUrl(d.bannerImage),
    bannerAlt: d.bannerAlt ?? null,

    pageTitle: d.pageTitle ?? null,
    pageSubtitle: d.pageSubtitle ?? null,

    requestQuoteRedirectUrl: d.requestQuoteRedirectUrl ?? null,

    subjectLabel: d.subjectLabel ?? null,
    departmentLabel: d.departmentLabel ?? null,
    resumeLabel: d.resumeLabel ?? null,
    submitButtonText: d.submitButtonText ?? null,
    captchaPlaceholderText: d.captchaPlaceholderText ?? null,

    consentText: d.consentText ?? null,
    truthfulText: d.truthfulText ?? null,

    subjectOptions: subjectOptions
      .map((o: any) => ({
        value: String(o?.value ?? '').trim(),
        label: String(o?.label ?? '').trim(),
      }))
      .filter((o: any) => o.value && o.label),

    departmentOptions: departmentOptions
      .map((o: any) => ({
        value: String(o?.value ?? '').trim(),
        label: String(o?.label ?? '').trim(),
      }))
      .filter((o: any) => o.value && o.label),
  };
}

