import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { GetServerSideProps } from 'next';

import HeroSlider from '../components/HeroSlider';
import ProductsScroller from '../components/ProductsScroller';
import BrandsSliderMobile from '../components/BrandsSliderMobile';
import NewsSlider from '../components/NewsSlider';

import { fetchHomepage, type HomePageData } from '../lib/api/homepage';
import { getLocaleFromContext } from '../lib/utils/locale';

interface HomeProps {
  home: HomePageData;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (ctx) => {
  const locale = getLocaleFromContext(ctx as any);
  const home = await fetchHomepage(locale);
  return { props: { home } };
};

export default function Home({ home }: HomeProps) {
  const pageTitle = home?.seo?.title || 'EURODIB';
  const pageDescription =
    home?.seo?.description ||
    'Professional commercial kitchen equipment distributor - Ice machines, dishwashers, refrigeration, cooking equipment, and more.';

  // Brands split (3 / 6 / 5)
  const brandsSorted = [...(home.brands || [])].sort(
    (a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999)
  );

  const primary = brandsSorted.filter((b) => !!b.isPrimary);
  const nonPrimary = brandsSorted.filter((b) => !b.isPrimary);

  // row1 = 3 карточки: сначала primary, если не хватает — добиваем nonPrimary
  const row1 = [...primary, ...nonPrimary].slice(0, 3);

  // rest = все остальные после первых 3
  const rest = [...primary, ...nonPrimary].slice(3);

  // desktop rows
  const row2 = rest.slice(0, 6);
  const row3 = rest.slice(6, 11);
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/CSS/main.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        
        {/* Structured Data (оставляем твой JSON-LD как есть) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://eurodib.com/#organization',
                  name: 'Eurodib',
                  url: 'https://eurodib.com',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://eurodib.com/wp-content/uploads/2020/08/eurodib_grande@2x.png',
                    width: 600,
                    height: 200,
                  },
                  description: 'Eurodib is a leading distributor of professional commercial kitchen equipment, bringing customers quality and innovation for over 25 years.',
                  foundingDate: '1996',
                  founder: {
                    '@type': 'Person',
                    name: 'Jean-Yves Dumaine',
                  },
                  sameAs: [
                    'https://www.linkedin.com/company/eurodib',
                    'https://www.facebook.com/eurodib',
                    'https://www.instagram.com/eurodib',
                    'https://www.youtube.com/user/eurodib',
                  ],
                  contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'Customer Service',
                    url: 'https://eurodib.com/contact-us',
                  },
                  address: {
                    '@type': 'PostalAddress',
                    addressCountry: 'CA',
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://eurodib.com/#website',
                  url: 'https://eurodib.com',
                  name: 'Eurodib',
                  description: 'Professional commercial kitchen equipment distributor - Ice machines, dishwashers, refrigeration, cooking equipment, and more.',
                  publisher: {
                    '@id': 'https://eurodib.com/#organization',
                  },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: 'https://eurodib.com/archive-page?q={search_term_string}',
                    },
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
      </Head>

      <>
        {/* Hero */}
        <HeroSlider slides={home.heroSlides} />

        <ProductsScroller title={home.essentialsTitle} items={home.essentialsItems} />

        {/* Categories */}
        <section className="category-section">
          <div className="category-section__container">
            <h2 className="category-section__title">{home.categoryTitle || 'Our Categories'}</h2>

            <div className="category-section__grid">
              {(home.categories || []).map((c, idx) => (
                <div
                  key={`${c.linkUrl}-${idx}`}
                  className="category-card"
                  style={{ backgroundImage: `url('${c.imageUrl}')` }}
                >
                  <Link
                    href={c.linkUrl || '/archive-page'}
                    className="category-card__overlay-link"
                    aria-label={c.title ? `Browse ${c.title}` : 'Browse category'}
                  />
              </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brands */}
        <section className="edbbr2-section">
          <div className="edbbr2-wrap">
            <h2 className="edbbr2-title">{home.brandsTitle || 'Our Brands'}</h2>

            <div className="edbbr2-grid edbbr2-grid--3">
              {row1.map((b) => (
                <Link key={b.slug} className="edbbr2-link" href={`/brands/${b.slug}`} aria-label={b.name}>
                  <div
                    className="edbbr2-logo"
                    style={{ '--logo': `url('${b.logoUrl}')` } as CSSProperties}
                  />
              </Link>
              ))}
            </div>

            {/* Mobile slider - скрыт на desktop */}
            <div className="edbbr2-mobile">
              <BrandsSliderMobile brands={rest} />
            </div>

            {/* Desktop rows - скрыты на mobile */}
            <div className="edbbr2-grid edbbr2-grid--6">
              {row2.map((b) => (
                <Link key={b.slug} className="edbbr2-link" href={`/brands/${b.slug}`} aria-label={b.name}>
                  <div
                    className="edbbr2-logo"
                    style={{ '--logo': `url('${b.logoUrl}')` } as CSSProperties}
                  />
              </Link>
              ))}
            </div>

            <div className="edbbr2-grid edbbr2-grid--5">
              {row3.map((b) => (
                <Link key={b.slug} className="edbbr2-link" href={`/brands/${b.slug}`} aria-label={b.name}>
                  <div
                    className="edbbr2-logo"
                    style={{ '--logo': `url('${b.logoUrl}')` } as CSSProperties}
                  />
              </Link>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        {home.about && (
        <section className="about-section-pro">
          <div className="about-container-pro-v3">
            <div className="top-content">
              <div className="image-block">
                <Image
                    src={home.about.imageUrl}
                    alt={home.about.imageAlt}
                  width={600}
                  height={400}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="about-image"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>

              <div className="text-block">
                <div style={{ position: 'relative', width: '200px', height: '60px' }}>
                  <Image
                      src={
                        home.about.logoUrl ||
                        'https://eurodib.com/wp-content/uploads/2020/08/eurodib_grande@2x.png'
                      }
                    alt="Eurodib Logo"
                    fill
                    sizes="200px"
                    className="logo-eurodib"
                    priority
                  />
                </div>

                  <h2 className="experience-title">{home.about.title}</h2>

                  <p className="about-text">{home.about.text}</p>

                <div className="read-more-home">
                    <Link href={home.about.linkUrl || '/about-us'}>
                      {home.about.linkLabel || 'Read more >'}
                    </Link>
                </div>
              </div>
            </div>

            <div className="features-grid-v3">
                {(home.features || []).slice(0, 3).map((f, idx) => (
                  <div className="feature-box" key={`${f.ctaUrl}-${idx}`}>
                <div style={{ position: 'relative', width: '48px', height: '48px' }}>
                      <Image src={f.iconUrl} alt={f.title} fill sizes="48px" />
                </div>
                    <h3>{f.title}</h3>
                    <Link href={f.ctaUrl} className="btn-circle">
                      {f.ctaLabel}
                    </Link>
              </div>
                ))}
            </div>
          </div>
        </section>
        )}

        {/* Blog */}
        <NewsSlider title={home.homeBlogTitle} limit={home.homeBlogLimit} featuredOnly={home.homeBlogFeaturedOnly} />

      </>
    </>
  );
}
