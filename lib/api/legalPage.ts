// lib/api/legalPage.ts
import { strapiGet } from './strapiClient';

export type LegalPage = {
  slug: string;
  title: string;
  intro: string;
  contentHtml: string;
  seoTitle: string | null;
  seoDescription: string | null;
  bannerImageUrl: string | null;
  bannerAlt: string | null;
};

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

export async function fetchLegalPageBySlug(locale: string, slug: string): Promise<LegalPage | null> {
  // ВАЖНО: В Strapi v5 убираем populate для bannerImage из основного запроса, чтобы избежать ошибки с related
  // bannerImage будет получен из основного запроса без populate (может быть null или ID)
  const endpoint =
    `/api/legal-pages?locale=${encodeURIComponent(locale)}` +
    `&filters[slug][$eq]=${encodeURIComponent(slug)}`;

  let json;
  try {
    json = await strapiGet(endpoint);
  } catch (error: any) {
    // Если 404, возвращаем null
    if (error.message?.includes('404')) {
      console.warn(`[LEGAL-PAGE] Endpoint not found for slug: ${slug}, locale: ${locale}`);
      return null;
    }
    throw error;
  }

  const arr = json?.data;

  if (!Array.isArray(arr) || !arr[0]) return null;

  const d = arr[0];

  return {
    slug: d.slug ?? slug,
    title: d.title ?? '',
    intro: d.intro ?? '',
    // В Strapi Rich text часто приходит как HTML-строка. Если у тебя Markdown/blocks — скажи, я дам конвертер.
    contentHtml: d.content ?? '',
    seoTitle: d.seoTitle ?? null,
    seoDescription: d.seoDescription ?? null,
    bannerImageUrl: pickMediaUrl(d.bannerImage),
    bannerAlt: d.bannerAlt ?? null,
  };
}

