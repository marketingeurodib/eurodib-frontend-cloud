// lib/api/contactPage.ts
import { strapiGet, absoluteMediaUrl } from './strapiClient';

export interface ContactSubjectOption {
  value: string;
  label: string;
}

export interface ContactPageData {
  seoTitle: string | null;
  seoDescription: string | null;

  bannerImageUrl: string | null;
  bannerAlt: string | null;

  pageTitle: string | null;
  pageSubtitle: string | null;

  infoLines: string[];
  hoursTitle: string | null;
  hoursText: string | null;

  directionsButtonText: string | null;
  googleMapsUrl: string | null;

  subjectLabel: string | null;
  submitButtonText: string | null;
  captchaPlaceholderText: string | null;

  subjectOptions: ContactSubjectOption[];

  requestQuoteRedirectUrl: string | null;
}

function pickMediaUrl(media: any): string | null {
  if (!media) return null;

  const url =
    media.url ||
    media.data?.url ||
    media.data?.attributes?.url ||
    media.attributes?.url ||
    null;

  return absoluteMediaUrl(url);
}

export async function fetchContactPage(locale: string): Promise<ContactPageData> {
  // ВАЖНО: В Strapi v5 убираем populate для bannerImage из основного запроса, чтобы избежать ошибки с related
  // bannerImage будет получен из основного запроса без populate (может быть null или ID)
  // infoLines и subjectOptions - это обычные поля (JSON/массивы), не relations/components, поэтому их не нужно populate
  const localeParam = `?locale=${encodeURIComponent(locale)}`;
  
  // Пробуем разные варианты именования эндпоинта
  const endpoints = [
    `/api/contact-page${localeParam}`,
    `/api/contactpage${localeParam}`,
    `/api/contact${localeParam}`,
  ];

  let jsonData: any = null;
  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      jsonData = await strapiGet(endpoint);
      if (jsonData?.data || jsonData?.data?.attributes) {
        break; // Успешно получили данные
      }
    } catch (error: any) {
      lastError = error;
      // Пропускаем ошибки 403/404 - это нормально, если endpoint не существует или нет прав
      if (error?.message?.includes('403') || error?.message?.includes('404')) {
        console.warn(`[CONTACT PAGE] Failed to fetch from ${endpoint}:`, error.message);
      } else {
        console.warn(`[CONTACT PAGE] Failed to fetch from ${endpoint}:`, error.message);
      }
      continue; // Пробуем следующий вариант
    }
  }

  if (!jsonData) {
    // Если все варианты не сработали, возвращаем дефолтные значения
    console.warn('[CONTACT PAGE] All endpoints failed, using defaults');
    return {
      seoTitle: null,
      seoDescription: null,
      bannerImageUrl: null,
      bannerAlt: null,
      pageTitle: 'Contact Us',
      pageSubtitle: null,
      infoLines: [],
      hoursTitle: null,
      hoursText: null,
      directionsButtonText: null,
      googleMapsUrl: null,
      subjectLabel: null,
      submitButtonText: null,
      captchaPlaceholderText: null,
      subjectOptions: [],
      requestQuoteRedirectUrl: null,
    };
  }

  const d = jsonData?.data?.attributes || jsonData?.data || null;

  if (!d) {
    // Если данные пустые, возвращаем дефолтные значения
    console.warn('[CONTACT PAGE] No data in response, using defaults');
    return {
      seoTitle: null,
      seoDescription: null,
      bannerImageUrl: null,
      bannerAlt: null,
      pageTitle: 'Contact Us',
      pageSubtitle: null,
      infoLines: [],
      hoursTitle: null,
      hoursText: null,
      directionsButtonText: null,
      googleMapsUrl: null,
      subjectLabel: null,
      submitButtonText: null,
      captchaPlaceholderText: null,
      subjectOptions: [],
      requestQuoteRedirectUrl: null,
    };
  }

  const infoLines = Array.isArray(d.infoLines) ? d.infoLines : [];
  const subjectOptions = Array.isArray(d.subjectOptions) ? d.subjectOptions : [];

  return {
    seoTitle: d.seoTitle ?? null,
    seoDescription: d.seoDescription ?? null,

    bannerImageUrl: pickMediaUrl(d.bannerImage),
    bannerAlt: d.bannerAlt ?? null,

    pageTitle: d.pageTitle ?? null,
    pageSubtitle: d.pageSubtitle ?? null,

    infoLines: infoLines
      .map((x: any) => String(x?.text ?? x ?? '').trim())
      .filter(Boolean),

    hoursTitle: d.hoursTitle ?? null,
    hoursText: d.hoursText ?? null,

    directionsButtonText: d.directionsButtonText ?? null,
    googleMapsUrl: d.googleMapsUrl ?? null,

    subjectLabel: d.subjectLabel ?? null,
    submitButtonText: d.submitButtonText ?? null,
    captchaPlaceholderText: d.captchaPlaceholderText ?? null,

    subjectOptions: subjectOptions
      .map((o: any) => ({
        value: String(o?.value ?? '').trim(),
        label: String(o?.label ?? '').trim(),
      }))
      .filter((o: any) => o.value && o.label),

    requestQuoteRedirectUrl: d.requestQuoteRedirectUrl ?? null,
  };
}

