import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { getLocaleFromContext } from '../lib/utils/locale';
import { fetchOurRepsPage, fetchRepRegions, type OurRepsPage, type RepRegion, type CountryCode } from '../lib/api/reps';
import { getTranslations, getCurrentLocale } from '../lib/utils/translations';

interface Props {
  page: OurRepsPage;
  initialCountry: CountryCode;
  initialRegions: RepRegion[];
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const locale = getLocaleFromContext(ctx as any);

  const page = await fetchOurRepsPage(locale);
  const initialCountry = (page.defaultCountry || 'us') as CountryCode;
  const initialRegions = await fetchRepRegions(initialCountry, locale);

  return {
    props: { page, initialCountry, initialRegions },
  };
};

export default function OurReps({ page, initialCountry, initialRegions }: Props) {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);

  const [country, setCountry] = useState<CountryCode>(initialCountry);
  const [regions, setRegions] = useState<RepRegion[]>(initialRegions);
  const [filteredRegions, setFilteredRegions] = useState<RepRegion[]>(initialRegions);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  // init map once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      if (!mapRef.current) return;

      const centerLat = page.mapCenterLat ?? 45;
      const centerLng = page.mapCenterLng ?? -90;
      const zoom = page.mapDefaultZoom ?? 3;

      const map = L.default.map(mapRef.current).setView([centerLat, centerLng], zoom);
      mapInstanceRef.current = map;

      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      layerGroupRef.current = L.default.layerGroup().addTo(map);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [page.mapCenterLat, page.mapCenterLng, page.mapDefaultZoom]);

  // draw regions whenever regions change
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    import('leaflet').then((L) => {
      const group = layerGroupRef.current;
      group.clearLayers();

      regions.forEach((r) => {
        // polygon first
        if (r.polygonGeoJson) {
          const geo = L.default.geoJSON(r.polygonGeoJson, {
            style: { weight: 2, fillOpacity: 0.12 },
          });
          geo.addTo(group);
          return;
        }

        // fallback: circle around center
        if (typeof r.centerLat === 'number' && typeof r.centerLng === 'number') {
          const radius = (r.radiusKm ?? 50) * 1000;
          L.default.circle([r.centerLat, r.centerLng], { radius, weight: 2, fillOpacity: 0.12 }).addTo(group);
        }
      });
    });
  }, [regions]);

  // load regions on country change (client)
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setIsLoading(true);
      try {
        // простой API route (см. ниже) либо прямо к Strapi (не рекомендую из браузера)
        const res = await fetch(`/api/reps?country=${country}`);
        const data = await res.json();
        if (!cancelled) {
          setRegions(data.regions || []);
          setFilteredRegions(data.regions || []);
        }
      } catch (e) {
        if (!cancelled) {
          setRegions([]);
          setFilteredRegions([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    // не перегружаем при первом рендере (у нас уже есть initialRegions)
    if (country !== initialCountry) run();

    return () => {
      cancelled = true;
    };
  }, [country, initialCountry]);

  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) return setFilteredRegions(regions);

    const filtered = regions.filter((r) => {
      const inLabel = r.label.toLowerCase().includes(q);
      const inCodes = r.codes.some((c) => c.toLowerCase().includes(q));
      const inContact = r.contacts.some(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.company && c.company.toLowerCase().includes(q))
      );
      return inLabel || inCodes || inContact;
    });

    setFilteredRegions(filtered);
  };

  const handleTabClick = (newCountry: CountryCode) => {
    if (newCountry === country) return;
    setCountry(newCountry);
    setQuery('');
  };

  const title = page.seoTitle || 'Our Reps | Eurodib';
  const description =
    page.seoDescription ||
    'Find Eurodib sales representatives near you across the United States and Canada.';

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/CSS/our-reps.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
      </Head>

      <div className="where-background-img"></div>

      <section className="edb-reps" id="edb-reps">
        <div className="edb-reps__container">
          <h2 className="edb-reps__title">{page.title || 'Our reps'}</h2>
          <p className="edb-reps__subtitle">{page.subtitle || 'Connect with Eurodib representatives across the United States & Canada.'}</p>

          <div className="edb-reps__toolbar">
            <div className="edb-reps__tabs" role="tablist" aria-label="Country switch">
              <button className={'edb-reps__tab' + (country === 'ca' ? ' edb-reps__tab--active' : '')} role="tab" aria-selected={country === 'ca'} onClick={() => handleTabClick('ca')}>
                {t?.ourReps?.canada || 'Canada'}
              </button>
              <button className={'edb-reps__tab' + (country === 'us' ? ' edb-reps__tab--active' : '')} role="tab" aria-selected={country === 'us'} onClick={() => handleTabClick('us')}>
                {t?.ourReps?.unitedStates || 'United States'}
              </button>
            </div>

            <div className="edb-reps__search">
              <input
                className="edb-reps__input"
                placeholder={page.searchPlaceholder || t?.ourReps?.searchPlaceholder || 'Enter ZIP (US) or Postal Code (CA), or State/Province'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
              <button className="edb-reps__btn" type="button" onClick={handleSearch}>
                {page.findButtonText || t?.ourReps?.findRep || 'Find a rep'}
              </button>
            </div>
          </div>

          <div className="edb-reps__layout">
            <aside className="edb-reps__panel">
              <h3>{t?.ourReps?.selectedArea || 'Selected area'}</h3>

              {isLoading && <p>{t?.ourReps?.loading || 'Loading representatives…'}</p>}
              {!isLoading && filteredRegions.length === 0 && <p>{t?.ourReps?.noRepsFound || 'No representatives found for this query.'}</p>}

              {!isLoading &&
                filteredRegions.map((region) => (
                  <div key={region.id} className="edb-reps__region">
                    <h4 className="edb-reps__region-title">{region.label}</h4>
                    <p className="edb-reps__region-codes">{region.codes.join(', ')}</p>

                    <ul className="edb-reps__contacts">
                      {region.contacts.map((c, idx) => (
                        <li key={idx} className="edb-reps__contact">
                          <div className="edb-reps__contact-name">{c.name}</div>
                          {c.company && <div className="edb-reps__contact-company">{c.company}</div>}
                          {c.email && (
                            <div className="edb-reps__contact-row">
                              <a href={`mailto:${c.email}`}>{c.email}</a>
                            </div>
                          )}
                          {c.phone && <div className="edb-reps__contact-row">{c.phone}</div>}
                          {c.website && (
                            <div className="edb-reps__contact-row">
                              <a href={c.website} target="_blank" rel="noopener noreferrer">
                                {c.website}
                              </a>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </aside>

            <div className="edb-reps__map" ref={mapRef}></div>
          </div>
        </div>
      </section>
    </>
  );
}
