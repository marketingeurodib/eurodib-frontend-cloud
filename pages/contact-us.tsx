import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import { ChangeEvent, FormEvent } from 'react';
import { getLocaleFromContext } from '../lib/utils/locale';
import { fetchContactPage, type ContactPageData } from '../lib/api/contactPage';

interface Props {
  page: ContactPageData;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const locale = getLocaleFromContext(ctx);
  const page = await fetchContactPage(locale);
  return { props: { page } };
};

export default function ContactV2({ page }: Props) {
  const requestQuoteUrl = page.requestQuoteRedirectUrl || '/cart';

  const handleSubjectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'request-quote') {
      window.location.href = requestQuoteUrl;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    alert('Form is ready. Connect backend/CRM to submit.');
  };

  const handleDirectionsClick = () => {
    const url =
      page.googleMapsUrl ||
      'https://maps.google.com/?q=120%20de%20la%20Barre%20Street%2C%20Boucherville';
    window.open(url, '_blank');
  };

  const subjectOptions =
    page.subjectOptions.length > 0
      ? page.subjectOptions
      : [
          { value: 'contact-us', label: 'Contact us' },
          { value: 'parts-service', label: 'Parts & Service' },
          { value: 'request-quote', label: 'Request a quote' },
          { value: 'become-dealer', label: 'Become a dealer' },
          { value: 'job-application', label: 'Spontaneous job application' },
          { value: 'marketing-sponsorships', label: 'Marketing & Sponsorships' },
        ];

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{page.seoTitle || 'Contact us | Eurodib'}</title>
        <meta
          name="description"
          content={
            page.seoDescription ||
            'Contact Eurodib for questions about products, services, parts, service, becoming a dealer, or marketing partnerships.'
          }
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/CSS/contact-us-v2.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
      </Head>

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
        <img
          src={page.bannerImageUrl || '/image/contact-us.png'}
          alt={page.bannerAlt || 'Contact Eurodib'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </section>

      <div className="edbcu-root">
        <div className="edbcu-head">
          <h1 className="edbcu-head__title">{page.pageTitle || 'Contact us'}</h1>
          {page.pageSubtitle ? (
            <p className="edbcu-head__subtitle">
              {page.pageSubtitle.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          ) : (
            <p className="edbcu-head__subtitle">
              Would you like more information about our products and services?
              <br />
              Our experts are here to help. Tell us how we can assist you!
            </p>
          )}
        </div>

        {/* Bottom info */}
        <section className="edbcu-info">
          <div className="edbcu-container">
            {page.infoLines.length > 0 ? (
              page.infoLines.map((line, i) => (
                <p className="edbcu-info__line" key={i}>
                  {line}
                </p>
              ))
            ) : (
              <>
                <p className="edbcu-info__line">
                  120 de la Barre Street, Boucherville, Québec J4B 2X7
                </p>
                <p className="edbcu-info__line">Toll-free: 888-956-6867</p>
                <p className="edbcu-info__line">Fax: 877-956-6867</p>
              </>
            )}

            <p className="edbcu-info__muted">
              <strong>{page.hoursTitle || 'Hours'}</strong>
              <br />
              {(page.hoursText || 'Monday to Friday: 8:30 a.m. – 5:00 p.m. EST')
                .split('\n')
                .map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
            </p>

            <button className="edbcu-btn" type="button" onClick={handleDirectionsClick}>
              {page.directionsButtonText || 'Get directions'}
            </button>
          </div>
        </section>

        {/* Form section */}
        <section className="edbcu-section--grey">
          <div className="edbcu-container">
            <form
              id="edbcu-form"
              className="edbcu-form"
              action="#"
              method="post"
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-subject">
                  {page.subjectLabel || 'Subject*'}
                </label>
                <select
                  className="edbcu-control edbcu-select"
                  id="edbcu-subject"
                  name="subject"
                  defaultValue={subjectOptions[0]?.value || 'contact-us'}
                  required
                  onChange={handleSubjectChange}
                >
                  {subjectOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-first">
                  First name*
                </label>
                <input className="edbcu-control" type="text" id="edbcu-first" name="first_name" required />
              </div>

              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-last">
                  Last name*
                </label>
                <input className="edbcu-control" type="text" id="edbcu-last" name="last_name" required />
              </div>

              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-email">
                  E-mail*
                </label>
                <input className="edbcu-control" type="email" id="edbcu-email" name="email" required />
              </div>

              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-phone">
                  Phone*
                </label>
                <input className="edbcu-control" type="tel" id="edbcu-phone" name="phone" required />
              </div>

              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-message">
                  Message*
                </label>
                <textarea className="edbcu-control edbcu-textarea" id="edbcu-message" name="message" required />
              </div>

              <div className="edbcu-captcha">
                <div className="edbcu-captcha__placeholder">
                  {page.captchaPlaceholderText || 'reCAPTCHA'}
                </div>
              </div>

              <div className="edbcu-actions">
                <button className="edbcu-btn" type="submit">
                  {page.submitButtonText || 'Send'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
