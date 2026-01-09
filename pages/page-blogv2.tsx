import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import type { GetServerSideProps } from 'next';
import { fetchBlogPosts, type BlogListItem } from '../lib/api/blog';

interface ArchiveBlogV2Props {
  posts: BlogListItem[];
}

export const getServerSideProps: GetServerSideProps<ArchiveBlogV2Props> = async () => {
  const posts = await fetchBlogPosts();

  return {
    props: {
      posts,
    },
  };
};

export default function ArchiveBlogV2({ posts }: ArchiveBlogV2Props) {
  const pageTitle = 'News & Stories | Eurodib';
  const pageDescription =
    'Browse all Eurodib news, recipes, stories and product updates from professional kitchens across North America.';

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/CSS/main.css" />
        <link rel="stylesheet" href="/CSS/page-blogv2.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>

      <>
        {/* Верхний баннер архивной страницы (можно будет сделать динамический фон) */}
        <section className="about-hero"></section>

        {/* Архив всех блогов */}
        <section className="other-news">
          <div className="container">
            <h2 className="section-title">News &amp; stories</h2>

            <div className="other-news__grid">
              {posts.map((post) => (
                <article className="news-card" key={post.id}>
                  <div className="news-card__image-wrapper">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
                <div className="news-card__body">
                    <span className="category">{post.category}</span>
                    <h3 className="title">{post.title}</h3>
                    <p className="excerpt">{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="btn">
                      Read More
                    </Link>
                </div>
              </article>
              ))}
            </div>
          </div>
        </section>
      </>

    </>
  );
}
