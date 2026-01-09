import { absoluteMediaUrl, strapiGet } from './strapiClient';

export type BlogArchiveFeaturedCard = {
  id: number;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  imageAlt: string;
};

export type BlogArchivePageData = {
  seoTitle: string | null;
  seoDescription: string | null;
  pageH1: string | null;
  latestNewsTitle: string | null;
  seeAllText: string | null;
  readMoreText: string | null;
  postBasePath: string | null;
  archiveBasePath: string | null;
  featuredPosts: BlogArchiveFeaturedCard[];
};

function pickAttributes(json: any) {
  return json?.data?.attributes || json?.data || null; // v4/v5
}

function pickMediaUrl(coverImage: any): string | null {
  const url =
    coverImage?.url ||
    coverImage?.data?.attributes?.url ||
    coverImage?.attributes?.url ||
    null;

  return absoluteMediaUrl(url);
}

export async function fetchBlogArchivePage(locale?: string): Promise<BlogArchivePageData> {
  try {
    const params = new URLSearchParams();
    if (locale) params.set('locale', locale);

    // Попробуем populate=* для всего, чтобы увидеть структуру
    // Если это сработает, потом оптимизируем populate
    params.set('populate', '*');

    const json = await strapiGet(`/api/blog-archive-page?${params.toString()}`);
    const a = pickAttributes(json) || {};

  // Логируем структуру для отладки
  console.log('[BLOG-ARCHIVE-PAGE] Available fields:', Object.keys(a));
  console.log('[BLOG-ARCHIVE-PAGE] featuredPosts structure:', a.featuredPosts);

  const featuredRaw = a.featuredPosts?.data || a.featuredPosts || [];
  const featuredArr = Array.isArray(featuredRaw) ? featuredRaw : [];

  const featuredPosts = featuredArr
    .map((item: any) => {
      const id = item?.id;
      const x = item?.attributes || item;
      if (!id || !x) return null;

      const imageUrl =
        pickMediaUrl(x.coverImage) ||
        'https://eurodib.com/wp-content/uploads/2024/01/0c7834fbe052db60d8c95ef64a7e4e71fb54530c.jpg';

      return {
        id,
        slug: x.slug || '',
        category: x.category || '',
        title: x.title || '',
        excerpt: x.excerpt || '',
        imageUrl,
        imageAlt: x.coverAlt || x.title || 'Blog cover image',
      };
    })
    .filter(Boolean) as BlogArchiveFeaturedCard[];

    return {
      seoTitle: a.seoTitle ?? null,
      seoDescription: a.seoDescription ?? null,
      pageH1: a.pageH1 ?? null,
      latestNewsTitle: a.latestNewsTitle ?? null,
      seeAllText: a.seeAllText ?? null,
      readMoreText: a.readMoreText ?? null,
      postBasePath: a.postBasePath ?? null,
      archiveBasePath: a.archiveBasePath ?? null,
      featuredPosts,
    };
  } catch (error: any) {
    // Если 404 или другой ошибка, возвращаем дефолтные значения
    if (error?.message?.includes('404')) {
      console.warn('[BLOG-ARCHIVE-PAGE] Endpoint not found, returning default values');
      return {
        seoTitle: null,
        seoDescription: null,
        pageH1: null,
        latestNewsTitle: null,
        seeAllText: null,
        readMoreText: null,
        postBasePath: null,
        archiveBasePath: null,
        featuredPosts: [],
      };
    }
    // Для других ошибок логируем и возвращаем дефолтные значения
    console.error('[BLOG-ARCHIVE-PAGE] Error fetching blog archive page:', error);
    return {
      seoTitle: null,
      seoDescription: null,
      pageH1: null,
      latestNewsTitle: null,
      seeAllText: null,
      readMoreText: null,
      postBasePath: null,
      archiveBasePath: null,
      featuredPosts: [],
    };
  }
}

