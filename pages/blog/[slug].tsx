import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';
import { strapiGet, absoluteMediaUrl } from '../../lib/api/strapiClient';
import { getLocaleFromContext } from '../../lib/utils/locale';

type BlogPostPage = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverUrl: string | null;
  coverAlt: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

function pickAttributes(json: any) {
  return json?.data?.attributes || json?.data || null;
}

function pickMediaUrl(coverImage: any): string | null {
  const url =
    coverImage?.url ||
    coverImage?.data?.attributes?.url ||
    coverImage?.attributes?.url ||
    null;

  return absoluteMediaUrl(url);
}

export const getServerSideProps: GetServerSideProps<{ post: BlogPostPage | null }> = async (ctx) => {
  const locale = getLocaleFromContext(ctx as any);
  const slug = String(ctx.params?.slug || '');

  // Strapi v4/v5 compatible: find by slug
  const params = new URLSearchParams();
  params.set('filters[slug][$eq]', slug);
  if (locale) params.set('locale', locale);
  // populate coverImage, но только нужные поля (url, alternativeText)
  params.set('populate[coverImage][fields][0]', 'url');
  params.set('populate[coverImage][fields][1]', 'alternativeText');
  // если у тебя в статье будут медиа/блоки — добавишь populate тут
  // params.set('populate', 'deep');

  const json = await strapiGet(`/api/blog-posts?${params.toString()}`);
  const item = Array.isArray(json?.data) ? json.data[0] : null;
  const a = item?.attributes || item;

  if (!a) {
    return { notFound: true };
  }

  const post: BlogPostPage = {
    id: item.id,
    title: a.title || '',
    slug: a.slug || slug,
    excerpt: a.excerpt || '',
    content: a.content || '',
    category: a.category || '',
    coverUrl: pickMediaUrl(a.coverImage),
    coverAlt: a.coverAlt || a.title || 'Blog cover image',
    seoTitle: a.seoTitle ?? null,
    seoDescription: a.seoDescription ?? null,
  };

  return { props: { post } };
};

export default function BlogPostSlugPage({ post }: { post: BlogPostPage | null }) {
  if (!post) return null;

  const title = post.seoTitle || post.title || 'Blog Post';
  const desc = post.seoDescription || post.excerpt || 'Eurodib blog post';

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/CSS/main.css" />
        <link rel="stylesheet" href="/CSS/page-blogv2.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
      </Head>

      <section className="about-hero"></section>

      <section className="other-news">
        <div className="container">
          <Link href="/news" className="btn" style={{ display: 'inline-flex', marginBottom: 16 }}>
            ← Back to News
          </Link>

          <h1 className="section-title">{post.title}</h1>
          {post.category ? <p className="category" style={{ marginTop: 8 }}>{post.category}</p> : null}

          {post.coverUrl ? (
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', marginTop: 18 }}>
              <Image src={post.coverUrl} alt={post.coverAlt} fill sizes="100vw" style={{ objectFit: 'cover' }} />
            </div>
          ) : null}

          {post.excerpt ? <p className="excerpt" style={{ marginTop: 18 }}>{post.excerpt}</p> : null}

          <div style={{ marginTop: 18, whiteSpace: 'pre-wrap' }}>
            {post.content}
          </div>
        </div>
      </section>
    </>
  );
}

