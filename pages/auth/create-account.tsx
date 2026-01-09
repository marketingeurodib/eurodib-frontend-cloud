import { useState, useEffect } from 'react';
import Head from 'next/head';
import { FormEvent } from 'react';
import { useRouter } from 'next/router';
import { getTranslations, getCurrentLocale } from '../../lib/utils/translations';

export default function CreateAccount() {
  const router = useRouter();
  const [locale, setLocale] = useState<'en-CA' | 'fr-CA' | 'en-US'>('en-CA');
  const t = getTranslations(locale) || getTranslations('en-CA');

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
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // TODO: здесь подключаешь отправку в Strapi/CRM/почту
    // const formData = new FormData(form);
    // await fetch('/api/create-account', { method: 'POST', body: formData });
    alert('Form is ready. Connect backend/CRM to submit.');
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{t?.createAccount?.pageTitle || 'Create an account | Eurodib'}</title>
        <meta
          name="description"
          content={t?.createAccount?.pageDescription || 'Create a Eurodib dealer account by providing your company information, accounts payable contact and consent to our privacy policy.'}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css"
        />
        <link rel="stylesheet" href="/CSS/sing-in.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
        <style
          dangerouslySetInnerHTML={{
          __html: `
          .eurodib-create-section {
            font-family: "Montserrat", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background-color: #ffffff;
            border-top: 3px solid #007bff;
            border-bottom: 3px solid #007bff;
            padding: 60px 30px 70px;
          }
          .eurodib-create-inner {
            max-width: 1120px;
            margin: 0 auto;
            text-align: center;
          }
          .eurodib-create-title {
            margin: 0 0 10px;
            font-size: 32px;
            font-weight: 700;
            color: #0070c9;
          }
          .eurodib-create-subtitle {
            margin: 0 0 32px;
            font-size: 16px;
            color: #555555;
            line-height: 1.5;
          }
          .eurodib-create-box {
            background-color: #f3f4f6;
            border-radius: 0;
            padding: 30px 40px 40px;
            text-align: left;
          }
          .eurodib-create-box-title {
            text-align: center;
            margin: 0 0 26px;
            font-size: 22px;
            font-weight: 700;
            color: #0070c9;
          }
          .eurodib-create-form {
            font-size: 14px;
          }
          /* Сетка полей */
          .eurodib-create-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px 32px;
            margin-bottom: 26px;
          }
          .eurodib-create-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #222222;
          }
          .eurodib-create-label--full {
            grid-column: 1 / -1;
          }
          .eurodib-create-required {
            color: #ff6b37;
            margin-left: 2px;
          }
          .eurodib-create-input-wrap {
            margin-top: 6px;
            position: relative;
          }
          .eurodib-create-input {
            width: 100%;
            border-radius: 999px;
            border: 2px solid #d5d5d5;
            padding: 15px 22px;
            font-size: 15px;
            outline: none;
            box-sizing: border-box;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
            background-color: #ffffff;
          }
          .eurodib-create-input:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
          }
          /* Accounts payable contact */
          .eurodib-create-contact-block {
            margin-top: 8px;
          }
          .eurodib-create-contact-title {
            font-size: 14px;
            font-weight: 700;
            color: #555555;
            margin: 0 0 10px;
          }
          /* Consents */
          .eurodib-create-consents {
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            font-size: 13px;
          }
          .eurodib-create-consent {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            cursor: pointer;
            position: relative;
            user-select: none;
          }
          .eurodib-create-consent-checkbox {
            position: absolute;
            opacity: 0;
            pointer-events: none;
          }
          .eurodib-create-consent-custom {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid #0b4f9b;
            box-sizing: border-box;
            margin-top: 2px;
            background-color: #ffffff;
            position: relative;
          }
          .eurodib-create-consent-checkbox:checked + .eurodib-create-consent-custom {
            background-color: #0b4f9b;
          }
          .eurodib-create-consent-checkbox:checked + .eurodib-create-consent-custom::after {
            content: "";
            position: absolute;
            inset: 5px;
            border-radius: 50%;
            background-color: #ffffff;
          }
          .eurodib-create-consent-text {
            color: #444444;
            line-height: 1.5;
          }
          .eurodib-create-link {
            color: #0070c9;
            text-decoration: underline;
          }
          /* Убираем белое пятно / focus-outline */
          .eurodib-create-consent-checkbox:focus,
          .eurodib-create-consent-checkbox:focus-visible {
            outline: none !important;
            box-shadow: none !important;
          }
          .eurodib-create-consent-checkbox:focus + .eurodib-create-consent-custom {
            outline: none !important;
            box-shadow: none !important;
          }
          .eurodib-create-consent:focus-within {
            outline: none !important;
            box-shadow: none !important;
          }
          /* reCAPTCHA + кнопка */
          .eurodib-create-bottom {
            margin-top: 26px;
            padding-bottom: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 18px;
          }
          .eurodib-create-recaptcha-placeholder {
            width: 302px;
            height: 76px;
            border-radius: 4px;
            border: 1px solid #d0d0d0;
            background-color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #777777;
          }
          .eurodib-create-send-btn {
            padding: 14px 60px;
            border-radius: 999px;
            border: none;
            background-color: #008cff;
            color: #ffffff;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 8px 18px rgba(0, 140, 255, 0.45);
            transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease;
          }
          .eurodib-create-send-btn:hover {
            background-color: #0073d6;
            box-shadow: 0 10px 22px rgba(0, 115, 214, 0.5);
            transform: translateY(-1px);
          }
          /* Адаптив */
          @media (max-width: 900px) {
            .eurodib-create-section {
              padding: 40px 16px 50px;
            }
            .eurodib-create-box {
              padding: 24px 18px 30px;
            }
            .eurodib-create-grid {
              grid-template-columns: 1fr;
            }
            .eurodib-create-label--full {
              grid-column: auto;
            }
          }
        `,
          }}
        />
      </Head>

      <>
        <section className="eurodib-create-section">
          <div className="eurodib-create-inner">
            {/* Заголовок страницы */}
            <h1 className="eurodib-create-title">{t?.createAccount?.title || 'Create an account'}</h1>
            <p className="eurodib-create-subtitle">
              {t?.createAccount?.subtitle ? (
                t.createAccount.subtitle.split('\n').map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))
              ) : (
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
              )}
            </p>

            {/* Серый блок формы */}
            <div className="eurodib-create-box">
              <h2 className="eurodib-create-box-title">{t?.createAccount?.companyInfo || 'Company information'}</h2>
              <form className="eurodib-create-form" onSubmit={handleSubmit} noValidate>
                {/* Company information */}
                <div className="eurodib-create-grid">
                  <label className="eurodib-create-label" htmlFor="company_name">
                    {t?.createAccount?.companyName || 'Company name'}<span className="eurodib-create-required">*</span>
                    <div className="eurodib-create-input-wrap">
                      <input
                        type="text"
                        id="company_name"
                        name="company_name"
                        className="eurodib-create-input"
                        required
                      />
                    </div>
                  </label>

                  <label className="eurodib-create-label" htmlFor="company_legal_name">
                    {t?.createAccount?.companyLegalName || 'Company legal name'}<span className="eurodib-create-required">*</span>
                    <div className="eurodib-create-input-wrap">
                      <input
                        type="text"
                        id="company_legal_name"
                        name="company_legal_name"
                        className="eurodib-create-input"
                        required
                      />
                    </div>
                  </label>

                  <label className="eurodib-create-label" htmlFor="company_address">
                    {t?.createAccount?.address || 'Address'}<span className="eurodib-create-required">*</span>
                    <div className="eurodib-create-input-wrap">
                      <input
                        type="text"
                        id="company_address"
                        name="company_address"
                        className="eurodib-create-input"
                        required
                      />
                    </div>
                  </label>

                  <label className="eurodib-create-label" htmlFor="company_city">
                    {t?.createAccount?.city || 'City'}<span className="eurodib-create-required">*</span>
                    <div className="eurodib-create-input-wrap">
                      <input
                        type="text"
                        id="company_city"
                        name="company_city"
                        className="eurodib-create-input"
                        required
                      />
                    </div>
                  </label>

                  <label className="eurodib-create-label" htmlFor="company_province">
                    {t?.createAccount?.province || 'Province'}<span className="eurodib-create-required">*</span>
                    <div className="eurodib-create-input-wrap">
                      <input
                        type="text"
                        id="company_province"
                        name="company_province"
                        className="eurodib-create-input"
                        required
                      />
                    </div>
                  </label>

                  <label className="eurodib-create-label" htmlFor="company_country">
                    {t?.createAccount?.country || 'Country'}<span className="eurodib-create-required">*</span>
                    <div className="eurodib-create-input-wrap">
                      <input
                        type="text"
                        id="company_country"
                        name="company_country"
                        className="eurodib-create-input"
                        required
                      />
                    </div>
                  </label>

                  <label className="eurodib-create-label" htmlFor="company_postal_code">
                    {t?.createAccount?.postalCode || 'Postal code'}<span className="eurodib-create-required">*</span>
                    <div className="eurodib-create-input-wrap">
                      <input
                        type="text"
                        id="company_postal_code"
                        name="company_postal_code"
                        className="eurodib-create-input"
                        required
                      />
                    </div>
                  </label>

                  <label className="eurodib-create-label" htmlFor="company_phone">
                    {t.createAccount.phone}<span className="eurodib-create-required">*</span>
                    <div className="eurodib-create-input-wrap">
                      <input
                        type="tel"
                        id="company_phone"
                        name="company_phone"
                        className="eurodib-create-input"
                        required
                      />
                    </div>
                  </label>

                  <label
                    className="eurodib-create-label eurodib-create-label--full"
                    htmlFor="company_in_business_since"
                  >
                    {t?.createAccount?.inBusinessSince || 'In business since'}<span className="eurodib-create-required">*</span>
                    <div className="eurodib-create-input-wrap">
                      <input
                        type="text"
                        id="company_in_business_since"
                        name="company_in_business_since"
                        className="eurodib-create-input"
                        required
                      />
                    </div>
                  </label>
                </div>

                {/* Accounts payable contact */}
                <div className="eurodib-create-contact-block">
                  <div className="eurodib-create-contact-title">
                    {t?.createAccount?.accountsPayableContact || 'Accounts payable contact'}
                  </div>
                  <div className="eurodib-create-grid">
                    <label className="eurodib-create-label" htmlFor="ap_first_name">
                      {t?.createAccount?.firstName || 'First name'}<span className="eurodib-create-required">*</span>
                      <div className="eurodib-create-input-wrap">
                        <input
                          type="text"
                          id="ap_first_name"
                          name="ap_first_name"
                          className="eurodib-create-input"
                          required
                        />
                      </div>
                    </label>

                    <label className="eurodib-create-label" htmlFor="ap_last_name">
                      {t?.createAccount?.lastName || 'Last name'}<span className="eurodib-create-required">*</span>
                      <div className="eurodib-create-input-wrap">
                        <input
                          type="text"
                          id="ap_last_name"
                          name="ap_last_name"
                          className="eurodib-create-input"
                          required
                        />
                      </div>
                    </label>

                    <label className="eurodib-create-label" htmlFor="ap_email">
                      {t?.createAccount?.email || 'Email'}<span className="eurodib-create-required">*</span>
                      <div className="eurodib-create-input-wrap">
                        <input
                          type="email"
                          id="ap_email"
                          name="ap_email"
                          className="eurodib-create-input"
                          required
                        />
                      </div>
                    </label>

                    <label className="eurodib-create-label" htmlFor="ap_invoice_email">
                      {t?.createAccount?.emailForInvoices || 'Email for invoices'}<span className="eurodib-create-required">*</span>
                      <div className="eurodib-create-input-wrap">
                        <input
                          type="email"
                          id="ap_invoice_email"
                          name="ap_invoice_email"
                          className="eurodib-create-input"
                          required
                        />
                      </div>
                    </label>

                    <label className="eurodib-create-label" htmlFor="ap_phone">
                      {t.createAccount.phone}<span className="eurodib-create-required">*</span>
                      <div className="eurodib-create-input-wrap">
                        <input
                          type="tel"
                          id="ap_phone"
                          name="ap_phone"
                          className="eurodib-create-input"
                          required
                        />
                      </div>
                    </label>

                    <label className="eurodib-create-label" htmlFor="ap_preferred_language">
                      {t?.createAccount?.preferredLanguage || 'Preferred language'}<span className="eurodib-create-required">*</span>
                      <div className="eurodib-create-input-wrap">
                        <input
                          type="text"
                          id="ap_preferred_language"
                          name="ap_preferred_language"
                          className="eurodib-create-input"
                          required
                        />
                      </div>
                    </label>
                  </div>
                </div>

                {/* Consents */}
                <div className="eurodib-create-consents">
                  <label className="eurodib-create-consent">
                    <input
                      type="checkbox"
                      className="eurodib-create-consent-checkbox"
                      name="consent_privacy"
                      required
                    />
                    <span className="eurodib-create-consent-custom"></span>
                    <span className="eurodib-create-consent-text">
                      {t?.createAccount?.consentPrivacy || 'By submitting this form, you consent to Eurodib collecting, using and storing your personal information in accordance with our'}{' '}
                      <a href="#" className="eurodib-create-link">
                        {t?.createAccount?.consentPrivacyLink || 'privacy policy'}
                      </a>{' '}
                      {t?.createAccount?.consentPrivacyEnd || 'and current legal requirements.'}
                      <span className="eurodib-create-required">*</span>
                    </span>
                  </label>

                  <label className="eurodib-create-consent">
                    <input
                      type="checkbox"
                      className="eurodib-create-consent-checkbox"
                      name="consent_truth"
                      required
                    />
                    <span className="eurodib-create-consent-custom"></span>
                    <span className="eurodib-create-consent-text">
                      {t?.createAccount?.consentTruth || 'I declare that the information provided is complete and true.'}
                      <span className="eurodib-create-required">*</span>
                    </span>
                  </label>

                  <label className="eurodib-create-consent">
                    <input
                      type="checkbox"
                      className="eurodib-create-consent-checkbox"
                      name="newsletter_optin"
                    />
                    <span className="eurodib-create-consent-custom"></span>
                    <span className="eurodib-create-consent-text">
                      {t?.createAccount?.newsletterOptin || 'I would like to subscribe to the newsletter to stay informed about promotions and the latest news.'}
                    </span>
                  </label>
                </div>

                {/* reCAPTCHA + кнопка */}
                <div className="eurodib-create-bottom">
                  <div className="eurodib-create-recaptcha">
                    {/* Сюда подставится реальный виджет reCAPTCHA плагином/JS */}
                    <div className="eurodib-create-recaptcha-placeholder">
                      {t?.createAccount?.notRobot || 'I\'m not a robot'}
                    </div>
                  </div>
                  <button type="submit" className="eurodib-create-send-btn">
                    {t?.createAccount?.send || 'Send'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </>

    </>
  );
}

