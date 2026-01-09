import { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { getTranslations, getCurrentLocale } from '../../lib/utils/translations';

export default function Forgot() {
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
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css" />
        <link rel="stylesheet" href="/CSS/sing-in.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
        <title>{t?.forgotPassword?.pageTitle || 'Forgot your password | Eurodib'}</title>
      </Head>
      <section className="eurodib-forgot-section">
        <div className="eurodib-forgot-inner">
          <h1 className="eurodib-forgot-title">{t?.forgotPassword?.title || 'Forgot your password'}</h1>
          <p className="eurodib-forgot-subtitle">
            {t?.forgotPassword?.subtitle || 'Please enter your email address below to receive a password reset.'}
          </p>

          <form className="eurodib-forgot-form">
            <label className="eurodib-forgot-label">
              {t?.forgotPassword?.emailLabel || 'Email'}<span className="eurodib-signin-required">*</span>
              <div className="eurodib-signin-input-wrap">
                <input type="email" className="eurodib-signin-input" />
              </div>
            </label>

            <button type="submit" className="eurodib-forgot-button">
              {t?.forgotPassword?.resetButton || 'Reset my password'}
            </button>
          </form>
        </div>
      </section>
      {/* Email Signup Section */}
    </>
  );
}

