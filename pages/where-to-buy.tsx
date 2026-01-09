import type { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { getLocaleFromContext } from '../lib/utils/locale';
import { fetchWhereToBuyPage, fetchDealers, type WhereToBuyPage, type Dealer } from '../lib/api/dealers';
import { getTranslations, getCurrentLocale } from '../lib/utils/translations';

interface Props {
  page: WhereToBuyPage;
  dealers: Dealer[];
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const locale = getLocaleFromContext(ctx as any);

  const [page, dealers] = await Promise.all([
    fetchWhereToBuyPage(locale),
    fetchDealers(locale),
  ]);

  return { props: { page, dealers } };
};

export default function WhereToBuy({ page, dealers }: Props) {
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).WTB_DEALERS = dealers;
      (window as any).WTB_CONFIG = {
        center: [
          page.mapCenterLat ?? 45.5019,
          page.mapCenterLng ?? -73.5674,
        ],
        zoom: page.mapDefaultZoom ?? 5,
      };
    }
  }, [dealers, page.mapCenterLat, page.mapCenterLng, page.mapDefaultZoom]);

  const title = page.seoTitle || page.title;
  const description = page.seoDescription || 'Find authorized Eurodib dealers and distributors near you.';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/CSS/main.css" />
        <link rel="stylesheet" href="/CSS/where-to-buy.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </Head>

      <>
        <div className="where-background-img"></div>

        <section className="wtb">
          <div className="container">
            <header className="wtb-header">
              <h2 className="wtb-title">{page.title}</h2>
              <p className="wtb-sub">{page.subtitle}</p>

              <div className="wtb-search">
                <input id="wtb-postal" className="wtb-input" placeholder={page.postCodePlaceholder || t?.whereToBuy?.postalCodePlaceholder || 'Your postal code'} />
                <button id="wtb-find" className="wtb-btn" type="button">
                  {page.findButtonText || t?.whereToBuy?.findRetailer || 'Find a retailer'}
                </button>
              </div>
            </header>

            <div className="wtb-grid">
              <div id="wtb-list" className="wtb-list"></div>

              <div className="wtb-mapcard">
                <div id="wtb-map" aria-label="Dealers map"></div>
              </div>
            </div>
          </div>
        </section>
      </>

      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
        strategy="afterInteractive"
        onLoad={() => {
          // Leaflet загружен, загружаем wtb.js
          if (typeof window !== 'undefined' && window.L) {
            const script = document.createElement('script');
            script.src = '/JS/wtb.js';
            script.async = true;
            document.body.appendChild(script);
          }
        }}
      />
      <Script src="/JS/main.js" strategy="afterInteractive" />
    </>
  );
}
