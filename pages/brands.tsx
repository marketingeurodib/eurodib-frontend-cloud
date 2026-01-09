import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';
import Breadcrumbs from '../components/Breadcrumbs';
import { getLocaleFromContext } from '../lib/utils/locale';
import { fetchBrandsPage, type BrandsPageData } from '../lib/api/brandsPage';
import { getTranslations, getCurrentLocale } from '../lib/utils/translations';

interface Props {
  page: BrandsPageData;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const locale = getLocaleFromContext(ctx);
  const page = await fetchBrandsPage(locale);

  // Диагностика на сервере (можно удалить позже)
  console.log('[BRANDS PAGE] SSR', {
    locale,
    bannerImageUrl: page.bannerImageUrl,
    brandCardsCount: page.brandCards.length,
    firstCardLogo: page.brandCards[0]?.logoUrl || null,
  });

  return { props: { page } };
};

export default function Brands({ page }: Props) {
  const router = useRouter();
  const [locale, setLocale] = useState<'en-CA' | 'fr-CA' | 'en-US'>('en-CA');
  const t = getTranslations(locale) || getTranslations('en-CA');

  // Определяем локаль
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateLocale = () => {
        const currentLocale = getCurrentLocale();
        setLocale(currentLocale);
      };
      
      updateLocale();

      window.addEventListener('storage', updateLocale);
      window.addEventListener('focus', updateLocale);
      
      // Обновляем локаль при изменении URL (query параметр locale)
      const handleRouteChange = () => {
        updateLocale();
      };
      router.events.on('routeChangeComplete', handleRouteChange);

      return () => {
        window.removeEventListener('storage', updateLocale);
        window.removeEventListener('focus', updateLocale);
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }
  }, [router]);
  
  // Также обновляем локаль при изменении query параметра
  useEffect(() => {
    if (router.query.locale) {
      const currentLocale = getCurrentLocale();
      setLocale(currentLocale);
    }
  }, [router.query.locale]);
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{page.seoTitle || t?.brands?.defaultSeoTitle || 'Our Brands | Eurodib'}</title>
        <meta
          name="description"
          content={
            page.seoDescription ||
            t?.brands?.defaultSeoDescription ||
            "Discover Eurodib's premium brand portfolio: Atmovac, Brema, Cofrimell, Dito Sama, Eurodib, Gemm, Krampouz, and more professional kitchen equipment brands."
          }
        />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/CSS/brands.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
      </Head>

      <Breadcrumbs
        items={[
          { label: t?.brands?.home || 'Home', href: '/' },
          { label: t?.brands?.categories || 'Categories' },
          { label: t?.brands?.ourBrands || 'Our Brands' },
        ]}
      />

      {/* Banner */}
      <section className="brema-banner" style={{ position: 'relative', width: '100%', height: '240px', margin: '0 auto', overflow: 'hidden' }}>
        <Image
          src={page.bannerImageUrl || '/image/Top banner.png'}
          alt={t?.brands?.bannerAlt || 'Our brands banner'}
          fill
          sizes="100vw"
          priority
          style={{ objectFit: 'cover' }}
        />
      </section>

      {/* Brands */}
      <section className="brands-section" aria-labelledby="brands-section-title">
        <div className="brands-section__header">
          <h2 id="brands-section-title" className="brands-section__title">
            {page.pageTitle || t?.brands?.defaultTitle || 'Our Brands'}
          </h2>
          {page.pageSubtitle && <p className="brands-section__subtitle">{page.pageSubtitle}</p>}
        </div>

        <div className="brands-section__grid">
          {page.brandCards.map((b, idx) => {
            const isExternal = b.link.startsWith('http://') || b.link.startsWith('https://');

            const cta = isExternal ? (
              <a className="brands-card__link" href={b.link} target="_blank" rel="noreferrer">
                {b.buttonText}
              </a>
            ) : (
              <Link href={b.link} className="brands-card__link">
                {b.buttonText}
              </Link>
            );

            return (
              <div className="brands-card" key={`${b.link}-${idx}`}>
                <div className="brands-card__logo">
                  {b.logoUrl ? (
                    <img src={b.logoUrl} alt={b.title} />
                  ) : (
                    // fallback, чтобы карточка не была "пустой"
                    <div style={{ opacity: 0.6, fontWeight: 700 }}>{b.title}</div>
                  )}
                </div>

                <p className="brands-card__text">{b.description}</p>

                {cta}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
