import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import type { GetServerSideProps } from 'next';
import { useEffect, useMemo, useState } from 'react';

import { getLocaleFromContext } from '../lib/utils/locale';
import { fetchBlogArchivePage, type BlogArchivePageData } from '../lib/api/blogArchivePage';
import { fetchBlogPosts, fetchFeaturedBlogPosts, type BlogPostCard } from '../lib/api/blogPosts';

interface Props {
  page: BlogArchivePageData;
  featuredPosts: BlogPostCard[];
  latestPosts: BlogPostCard[];
}

// fallback (твои мок-данные) — оставляем на случай пустого Strapi
const BLOG_POSTS_FALLBACK: BlogPostCard[] = [
  {
    id: 1,
    slug: 'a-michelin-star',
    category: 'News',
    title: 'A Michelin Star',
    excerpt: "Quebec's chef puts a milestone",
    imageUrl: 'https://eurodib.com/wp-content/uploads/2024/01/0c7834fbe052db60d8c95ef64a7e4e71fb54530c.jpg',
    imageAlt: 'Smiling chef in a professional kitchen receiving a Michelin star',
    isFeatured: true,
  },
  {
    id: 2,
    slug: 'kitchen-workflow',
    category: 'Guides',
    title: 'Kitchen Workflow',
    excerpt: 'How to speed up your line',
    imageUrl: 'https://eurodib.com/wp-content/uploads/2024/01/0c7834fbe052db60d8c95ef64a7e4e71fb54530c.jpg',
    imageAlt: 'Professional kitchen brigade working efficiently on the line',
    isFeatured: true,
  },
  {
    id: 3,
    slug: 'new-product-line-2025',
    category: 'Announcements',
    title: 'New Product Line',
    excerpt: 'Pro tools for 2025 season',
    imageUrl: 'https://eurodib.com/wp-content/uploads/2024/01/0c7834fbe052db60d8c95ef64a7e4e71fb54530c.jpg',
    imageAlt: 'New generation of professional kitchen equipment by Eurodib',
    isFeatured: true,
  },
  {
    id: 4,
    slug: 'waffle-recipe',
    category: 'Dessert equipment',
    title: 'The best waffle recipe',
    excerpt: "You're in for a treat!",
    imageUrl: 'https://eurodib.com/wp-content/uploads/2024/01/0c7834fbe052db60d8c95ef64a7e4e71fb54530c.jpg',
    imageAlt: 'Golden waffles served on a plate made with professional waffle maker',
  },
  {
    id: 5,
    slug: 'special-visit-1',
    category: 'Food prep',
    title: 'Our reps on a special visit',
    excerpt: 'Great news to come with new products',
    imageUrl: 'https://eurodib.com/wp-content/uploads/2024/01/0c7834fbe052db60d8c95ef64a7e4e71fb54530c.jpg',
    imageAlt: 'Eurodib reps visiting a customer and presenting new equipment',
  },
  {
    id: 6,
    slug: 'special-visit-2',
    category: 'Food prep',
    title: 'Our reps on a special visit',
    excerpt: 'Great news to come with new products',
    imageUrl: 'https://eurodib.com/wp-content/uploads/2024/01/0c7834fbe052db60d8c95ef64a7e4e71fb54530c.jpg',
    imageAlt: 'Eurodib reps visiting a customer and presenting new equipment',
  },
  {
    id: 7,
    slug: 'special-visit-3',
    category: 'Food prep',
    title: 'Our reps on a special visit',
    excerpt: 'Great news to come with new products',
    imageUrl: 'https://eurodib.com/wp-content/uploads/2024/01/0c7834fbe052db60d8c95ef64a7e4e71fb54530c.jpg',
    imageAlt: 'Eurodib reps visiting a customer and presenting new equipment',
  },
  {
    id: 8,
    slug: 'special-visit-4',
    category: 'Food prep',
    title: 'Our reps on a special visit',
    excerpt: 'Great news to come with new products',
    imageUrl: 'https://eurodib.com/wp-content/uploads/2024/01/0c7834fbe052db60d8c95ef64a7e4e71fb54530c.jpg',
    imageAlt: 'Eurodib reps visiting a customer and presenting new equipment',
  },
  {
    id: 9,
    slug: 'special-visit-5',
    category: 'Food prep',
    title: 'Our reps on a special visit',
    excerpt: 'Great news to come with new products',
    imageUrl: 'https://eurodib.com/wp-content/uploads/2024/01/0c7834fbe052db60d8c95ef64a7e4e71fb54530c.jpg',
    imageAlt: 'Eurodib reps visiting a customer and presenting new equipment',
  },
];

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const locale = getLocaleFromContext(ctx);

  let page: BlogArchivePageData;
  let latestFromStrapi: BlogPostCard[] = [];
  let featuredFromStrapi: BlogPostCard[] = [];

  try {
    page = await fetchBlogArchivePage(locale);

    // latest всегда из постов
    latestFromStrapi = await fetchBlogPosts(locale);

    // featured: сначала из page.featuredPosts
    if (page.featuredPosts?.length) {
      // приводим к BlogPostCard формату (минимально)
      featuredFromStrapi = page.featuredPosts.map(p => ({
        id: p.id,
        slug: p.slug,
        category: p.category,
        title: p.title,
        excerpt: p.excerpt,
        imageUrl: p.imageUrl,
        imageAlt: p.imageAlt,
        isFeatured: true,
      }));
    } else {
      featuredFromStrapi = await fetchFeaturedBlogPosts(locale);
    }
  } catch (error: any) {
    console.warn('[ARCHIVE-BLOG-V2] Strapi error:', error?.message || error);
    // Если fetchBlogArchivePage вернул дефолтные значения, page уже будет установлен
    // Если же произошла другая ошибка, используем дефолтные значения
    page = {
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

  const fallbackFeatured = BLOG_POSTS_FALLBACK.filter((p) => p.isFeatured);
  const fallbackLatest = BLOG_POSTS_FALLBACK;

  return {
    props: {
      page,
      featuredPosts: featuredFromStrapi.length ? featuredFromStrapi : fallbackFeatured,
      latestPosts: latestFromStrapi.length ? latestFromStrapi : fallbackLatest,
    },
  };
};

export default function ArchiveBlogV2({ page, featuredPosts, latestPosts }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  // где живут статьи
  // вариант A (как у тебя сейчас): /page-blogv2?slug=...
  // вариант B (рекомендую): /blog/[slug]
  // Временно жестко задаем /blog для красивых URL
  // Позже можно будет использовать page.postBasePath из Strapi
  const postBasePath = '/blog';
  // const postBasePath = page.postBasePath || '/page-blogv2';

  const makePostHref = useMemo(() => {
    // если это /blog — делаем /blog/slug, иначе query-string как сейчас
    const isPretty = postBasePath === '/blog';
    return (slug: string) => (isPretty ? `/blog/${slug}` : `${postBasePath}?slug=${encodeURIComponent(slug)}`);
  }, [postBasePath]);

  useEffect(() => {
    if (featuredPosts.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredPosts.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [featuredPosts.length]);

  const seoTitle = page.seoTitle || 'Blog | Eurodib';
  const seoDescription =
    page.seoDescription ||
    'Stay updated with the latest news, industry insights, and product updates from Eurodib.';

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/CSS/archive-blogv2.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
      </Head>

      {/* DEBUG БЕЙДЖ */}
      <div
        style={{
          position: 'fixed',
          right: 12,
          bottom: 12,
          zIndex: 99999,
          background: '#000',
          color: '#0f0',
          padding: '10px 12px',
          fontSize: 12,
          borderRadius: 8,
          maxWidth: 360,
          lineHeight: 1.35,
        }}
      >
        <div><b>NEWS DEBUG</b></div>
        <div>latestNewsTitle: {page.latestNewsTitle ?? 'NULL'}</div>
        <div>pageH1: {page.pageH1 ?? 'NULL'}</div>
        <div>postBasePath: {page.postBasePath ?? 'NULL'}</div>
        <div>featured: {featuredPosts.length}</div>
        <div>latest: {latestPosts.length}</div>
      </div>

      {/* HERO SLIDER */}
      <section className="hero-slider" aria-label="Featured stories">
        <h1 className="visually-hidden">
          {page.pageH1 || 'Eurodib Blog — latest news & industry stories'}
        </h1>

        <div className="slides" id="slides">
          {featuredPosts.map((post, index) => (
            <article
              key={post.id}
              className={`slide ${index === activeIndex ? 'is-active' : ''}`}
              aria-hidden={index === activeIndex ? 'false' : 'true'}
            >
              <div className="slide__left">
                <p className="eyebrow">{post.category}</p>
                <h2 className="title">{post.title}</h2>
                <p className="subtitle">{post.excerpt}</p>

                <Link className="btn" href={makePostHref(post.slug)} aria-label={`Read more about ${post.title}`}>
                  {page.readMoreText || 'Read More'}
                </Link>
              </div>

              <div className="slide__right">
                <div className="slide__image-wrapper">
                  <Image
                    src={post.imageUrl}
                    alt={post.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="dots" id="dots" role="tablist" aria-label="Slides navigation">
          {featuredPosts.map((post, index) => (
            <button
              key={post.id}
              type="button"
              className={`dot ${index === activeIndex ? 'is-active' : ''}`}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* LATEST NEWS GRID */}
      <section className="latest-news">
        <div className="container">
          <div className="latest-news__header">
            <h2>{page.latestNewsTitle || 'Latest News'}</h2>

            <button className="see-all" type="button">
              {page.seeAllText || 'See all'} <span className="icon">⌃</span>
            </button>
          </div>

          <div className="latest-news__grid">
            {latestPosts.map((post) => (
              <article key={post.id} className="news-card">
                <div className="news-card__image-wrapper">
                  <Image src={post.imageUrl} alt={post.imageAlt} fill sizes="(max-width: 768px) 100vw, 33vw" />
                </div>

                <div className="news-card__body">
                  <span className="category">{post.category}</span>
                  <h3 className="title">{post.title}</h3>
                  <p className="excerpt">{post.excerpt}</p>

                  <Link href={makePostHref(post.slug)} className="btn" aria-label={`Read more about ${post.title}`}>
                    {page.readMoreText || 'Read More'}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ПАГИНАЦИЯ – пока заглушка */}
      <nav className="pagination" aria-label="Blog pagination">
        <ul>
          <li>
            <span className="active" aria-current="page">1</span>
          </li>
          <li><button type="button" disabled>2</button></li>
          <li><button type="button" disabled aria-label="Next page">&rsaquo;</button></li>
        </ul>
      </nav>
    </>
  );
}

