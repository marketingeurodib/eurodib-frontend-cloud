import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent } from 'react';
import { useRouter } from 'next/router';
import Breadcrumbs from '../components/Breadcrumbs';
import { getTranslations, getCurrentLocale } from '../lib/utils/translations';

export default function BecomeADealerV2() {
  const router = useRouter();
  const [locale, setLocale] = useState<'en-CA' | 'fr-CA' | 'en-US'>('en-CA');
  const t = getTranslations(locale) || getTranslations('en-CA');
  const EDBCU_REQUEST_QUOTE_URL = '/request-a-quote'; // при необходимости поменяешь

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

  // Обработчик смены Subject
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'request-quote') {
      router.push(EDBCU_REQUEST_QUOTE_URL);
        }
  };

  // Обработчик сабмита формы
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    const form = e.currentTarget;

    // HTML5-валидация (required и т.п.)
    if (!form.checkValidity()) {
      form.reportValidity();
          return;
        }

    // Заглушка — тут потом будет запрос в CRM / backend / Strapi
        alert('Form is ready. Connect backend/CRM to submit.');
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{t?.becomeDealer?.pageTitle || 'Become a Dealer | Eurodib'}</title>
        <meta
          name="description"
          content={t?.becomeDealer?.pageDescription || 'Join Eurodib\'s dealer network and become a trusted partner. Expand your business with premium commercial kitchen equipment and expert support.'}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/CSS/contact-us-v2.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
      </Head>

      {/* Баннер */}
      <section
        className="brema-banner"
        style={{
          position: 'relative',
          width: '100%',
          height: '240px',
          margin: '0 auto',
          overflow: 'hidden',
        }}
      >
        <Image
          src="/image/become-a-dealerv2.png"
          alt="Become a dealer banner"
          fill
          sizes="100vw"
          priority
          style={{ objectFit: 'cover' }}
        />
      </section>

      <div className="edbcu-root">
        <Breadcrumbs
          items={[
            { label: t?.becomeDealer?.home || 'Home', href: '/' },
            { label: t?.becomeDealer?.breadcrumb || 'Become a dealer' },
          ]}
        />

        {/* Заголовок страницы */}
        <section className="edbcu-head">
          <h1 className="edbcu-head__title">{t?.becomeDealer?.title || 'Become a dealer'}</h1>
          <p className="edbcu-head__subtitle">
            {t?.becomeDealer?.subtitle || 'Join our dealer network across Canada & the USA. Access competitive pricing, dedicated support, marketing assets, and premium kitchen equipment brands.'}
          </p>
        </section>

        {/* Серая зона с формой */}
        <section className="edbcu-section--grey">
          <div className="edbcu-container">
            <form
              id="edbcu-form"
              className="edbcu-form"
              noValidate
              onSubmit={handleSubmit}
            >
              {/* Subject */}
              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-subject">
                  {t?.becomeDealer?.subject || 'Subject'}*
                </label>
                <select
                  className="edbcu-control edbcu-select"
                  id="edbcu-subject"
                  name="subject"
                  defaultValue="become-dealer"
                  required
                  onChange={handleSubjectChange}
                >
                  <option value="contact-us">{t?.becomeDealer?.subjectContactUs || 'Contact us'}</option>
                  <option value="parts-service">{t?.becomeDealer?.subjectPartsService || 'Parts & Service'}</option>
                  <option value="request-quote">{t?.becomeDealer?.subjectRequestQuote || 'Request a quote'}</option>
                  <option value="become-dealer">{t?.becomeDealer?.subjectBecomeDealer || 'Become a dealer'}</option>
                  <option value="job-application">{t?.becomeDealer?.subjectJobApplication || 'Spontaneous job application'}</option>
                  <option value="marketing-sponsorships">{t?.becomeDealer?.subjectMarketing || 'Marketing & Sponsorships'}</option>
                </select>
              </div>

              {/* Company name */}
              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-company">
                  {t?.becomeDealer?.companyName || 'Company name'}*
                </label>
                <input
                  className="edbcu-control"
                  type="text"
                  id="edbcu-company"
                  name="company_name"
                  required
                />
              </div>

              {/* Website */}
              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-website">
                  {t?.becomeDealer?.website || 'Website'}*
                </label>
                <input
                  className="edbcu-control"
                  type="url"
                  id="edbcu-website"
                  name="website"
                  required
                />
              </div>

              {/* Address */}
              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-address">
                  {t?.becomeDealer?.address || 'Address'}*
                </label>
                <input
                  className="edbcu-control"
                  type="text"
                  id="edbcu-address"
                  name="address"
                  required
                />
              </div>

              {/* First name */}
              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-first">
                  {t?.becomeDealer?.firstName || 'First name'}*
                </label>
                <input
                  className="edbcu-control"
                  type="text"
                  id="edbcu-first"
                  name="first_name"
                  required
                />
              </div>

              {/* Last name */}
              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-last">
                  {t?.becomeDealer?.lastName || 'Last name'}*
                </label>
                <input
                  className="edbcu-control"
                  type="text"
                  id="edbcu-last"
                  name="last_name"
                  required
                />
              </div>

              {/* Email */}
              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-email">
                  {t?.becomeDealer?.email || 'Email'}*
                </label>
                <input
                  className="edbcu-control"
                  type="email"
                  id="edbcu-email"
                  name="email"
                  required
                />
              </div>

              {/* Phone */}
              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-phone">
                  {t?.becomeDealer?.phone || 'Phone'}*
                </label>
                <input
                  className="edbcu-control"
                  type="tel"
                  id="edbcu-phone"
                  name="phone"
                  required
                />
              </div>

              {/* Message (optional) */}
              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-message">
                  {t?.becomeDealer?.message || 'Message'}
                </label>
                <textarea
                  className="edbcu-control edbcu-textarea"
                  id="edbcu-message"
                  name="message"
                />
              </div>

              {/* Upload / Dropzone (пока только UI) */}
              <div className="edbcu-dropzone__texts">
                <div className="edbcu-dropzone__main">
                  {t?.becomeDealer?.dragDrop || 'Drag & drop or'}{' '}
                  <a href="#" className="edbcu-browse">
                    {t?.becomeDealer?.browse || 'browse'}
                  </a>
                </div>
                <div className="edbcu-dropzone__hint">{t?.becomeDealer?.pdfOnly || '(PDF files only)'}</div>
              </div>

              {/* reCAPTCHA placeholder */}
              <div className="edbcu-captcha">
                {/* Здесь потом будет реальный виджет reCAPTCHA */}
                {/* <div className="g-recaptcha" data-sitekey="YOUR_SITE_KEY"></div> */}
                <div className="edbcu-captcha__placeholder">{t?.becomeDealer?.recaptcha || 'reCAPTCHA'}</div>
              </div>

              {/* Submit */}
              <div className="edbcu-actions">
                <button className="edbcu-btn" type="submit">
                  {t?.becomeDealer?.send || 'Send'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>


      {/* reCAPTCHA Script можно подключить позже, когда будешь реально интегрировать */}
      {/* <Script src="https://www.google.com/recaptcha/api.js" strategy="afterInteractive" /> */}
    </>
  );
}
