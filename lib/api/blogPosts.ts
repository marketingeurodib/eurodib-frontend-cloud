import { absoluteMediaUrl, strapiGet } from './strapiClient';

export type BlogPostCard = {
  id: number;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  imageAlt: string;
  isFeatured?: boolean;
};

function pickMediaUrl(coverImage: any): string | null {
  // media может быть в разных формах — делаем максимально терпимо
  const url =
    coverImage?.url ||
    coverImage?.data?.attributes?.url ||
    coverImage?.attributes?.url ||
    null;

  return absoluteMediaUrl(url);
}

function toCard(item: any): BlogPostCard | null {
  const id = item?.id;
  const a = item?.attributes || item;

  if (!id || !a) return null;

  const imageUrl = pickMediaUrl(a.coverImage) || 'https://eurodib.com/wp-content/uploads/2024/01/0c7834fbe052db60d8c95ef64a7e4e71fb54530c.jpg';

  return {
    id,
    slug: a.slug || '',
    category: a.category || '',
    title: a.title || '',
    excerpt: a.excerpt || '',
    imageUrl,
    imageAlt: a.coverAlt || a.title || 'Blog cover image',
    isFeatured: !!a.isFeatured,
  };
}

export async function fetchBlogPosts(locale?: string): Promise<BlogPostCard[]> {
  try {
  const params = new URLSearchParams();

  // важно: populate coverImage, но только нужные поля (url, alternativeText)
  // чтобы избежать ошибки с related полями
  params.set('populate[coverImage][fields][0]', 'url');
  params.set('populate[coverImage][fields][1]', 'alternativeText');
  params.set('sort', 'publishedAt:desc');

  if (locale) params.set('locale', locale);

  const json = await strapiGet(`/api/blog-posts?${params.toString()}`);
  const data = Array.isArray(json?.data) ? json.data : [];

  return data.map(toCard).filter(Boolean) as BlogPostCard[];
  } catch (error: any) {
    // Если 404 или другой ошибка, возвращаем пустой массив
    if (error?.message?.includes('404')) {
      console.warn('[BLOG-POSTS] Endpoint not found, returning empty array');
      return [];
    }
    // Для других ошибок логируем и возвращаем пустой массив
    console.error('[BLOG-POSTS] Error fetching blog posts:', error);
    return [];
  }
}

export async function fetchFeaturedBlogPosts(locale?: string): Promise<BlogPostCard[]> {
  try {
  const params = new URLSearchParams();
  // важно: populate coverImage, но только нужные поля (url, alternativeText)
  params.set('populate[coverImage][fields][0]', 'url');
  params.set('populate[coverImage][fields][1]', 'alternativeText');
  params.set('sort', 'publishedAt:desc');
  params.set('filters[isFeatured][$eq]', 'true');

  if (locale) params.set('locale', locale);

  const json = await strapiGet(`/api/blog-posts?${params.toString()}`);
  const data = Array.isArray(json?.data) ? json.data : [];

  return data.map(toCard).filter(Boolean) as BlogPostCard[];
  } catch (error: any) {
    // Если 404 или другой ошибка, возвращаем пустой массив
    if (error?.message?.includes('404')) {
      console.warn('[BLOG-POSTS] Featured posts endpoint not found, returning empty array');
      return [];
    }
    // Для других ошибок логируем и возвращаем пустой массив
    console.error('[BLOG-POSTS] Error fetching featured blog posts:', error);
    return [];
  }
}

