import Head from 'next/head';
import Image from 'next/image';
import type { GetServerSideProps } from 'next';
import type { CSSProperties, ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';

import { getLocaleFromContext } from '../lib/utils/locale';
import {
  fetchMarketingSponsorshipPage,
  type MarketingSponsorshipPageData,
} from '../lib/api/marketingSponsorshipPage';

interface Props {
  page: MarketingSponsorshipPageData;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const locale = getLocaleFromContext(ctx);
  const page = await fetchMarketingSponsorshipPage(locale);
  return { props: { page } };
};

export default function MarketingSponsorship({ page }: Props) {
  const requestQuoteUrl = page.requestQuoteRedirectUrl || '/request-a-quote';
  const successUrl = page.successUrl || '/mail-done';

  const fallbackSubjectOptions = [
    { value: 'contact-us', label: 'Contact us' },
    { value: 'parts-service', label: 'Parts & Service' },
    { value: 'request-quote', label: 'Request a quote' },
    { value: 'become-dealer', label: 'Become a dealer' },
    { value: 'job-application', label: 'Spontaneous job application' },
    { value: 'marketing-sponsorships', label: 'Marketing & Sponsorships' },
  ];

  const subjectOptions =
    page.subjectOptions.length > 0 ? page.subjectOptions : fallbackSubjectOptions;

  const [subject, setSubject] = useState('marketing-sponsorships');

  const handleSubjectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'request-quote') {
      window.location.href = requestQuoteUrl;
      return;
    }
    setSubject(value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // ФОРМУ НЕ ТРОГАЕМ. Потом подключим Dialog Insight.
    // Сейчас — поведение как у тебя: после "успешной" отправки -> success URL
    window.location.href = successUrl;
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{page.seoTitle || 'Marketing & Sponsorship | Eurodib'}</title>
        <meta
          name="description"
          content={
            page.seoDescription ||
            'Submit your marketing and sponsorship requests to Eurodib. Partner with us for events, collaborations, and brand initiatives.'
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
        style={
          {
            position: 'relative',
            width: '100%',
            height: '240px',
            margin: '0 auto',
            overflow: 'hidden',
          } as CSSProperties
        }
      >
        {page.bannerImageUrl ? (
          <Image
            src={page.bannerImageUrl}
            alt={page.bannerAlt || 'Marketing & Sponsorship banner'}
            fill
            sizes="100vw"
            priority
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <img
            src="/image/marketing-sponsorship.png"
            alt="Marketing & Sponsorship banner"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </section>

      <div className="edbcu-root">
        <div className="edbcu-head">
          <h1 className="edbcu-head__title">
            {page.pageTitle || 'Marketing & Sponsorship'}
          </h1>

          <p className="edbcu-head__subtitle">
            {page.pageSubtitle ||
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eu orci a diam facilisis vulputate. Suspendisse maximus fusce.'}
          </p>
        </div>

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
              {/* Subject */}
              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-subject">
                  {page.subjectLabel || 'Subject*'}
                </label>
                <select
                  className="edbcu-control edbcu-select"
                  id="edbcu-subject"
                  name="subject"
                  required
                  value={subject}
                  onChange={handleSubjectChange}
                >
                  {subjectOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company */}
              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-company">
                  {page.companyLabel || 'Company name*'}
                </label>
                <input
                  className="edbcu-control"
                  type="text"
                  id="edbcu-company"
                  name="company_name"
                  required
                />
              </div>

              {/* First / Last */}
              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-first">
                  First name*
                </label>
                <input
                  className="edbcu-control"
                  type="text"
                  id="edbcu-first"
                  name="first_name"
                  required
                />
              </div>

              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-last">
                  Last name*
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
                  E-mail*
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
                  Phone*
                </label>
                <input
                  className="edbcu-control"
                  type="tel"
                  id="edbcu-phone"
                  name="phone"
                  required
                />
              </div>

              {/* Message */}
              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-message">
                  {page.messageLabel || 'Message*'}
                </label>
                <textarea
                  className="edbcu-control edbcu-textarea"
                  id="edbcu-message"
                  name="message"
                  required
                />
              </div>

              {/* Attachment (PDF only) */}
              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-resume">
                  {page.attachmentLabel || 'Join a document (10 Mb maximum)*'}
                </label>

                <div id="edbcu-drop" className="edbcu-dropzone">
                  <input
                    id="edbcu-resume"
                    name="attachment"
                    type="file"
                    accept="application/pdf,.pdf"
                    required
                  />

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M12 16a1 1 0 0 1-1-1V7.83L8.41 10.4a1 1 0 1 1-1.41-1.42l4-4a1 1 0 0 1 1.41 0l4 4a1 1 0 1 1-1.41 1.42L13 7.83V15a1 1 0 0 1-1 1Zm-6 3a2 2 0 0 1-2-2V14a1 1 0 1 1 2 0v3h12v-3a1 1 0 1 1 2 0v3a2 2 0 0 1-2 2H6Z"
                    />
                  </svg>

                  <div className="edbcu-dropzone__texts">
                    <div className="edbcu-dropzone__main">
                      Drag &amp; drop or <a href="#" className="edbcu-browse">browse</a>
                    </div>
                    <div className="edbcu-dropzone__hint">(PDF files only)</div>
                  </div>

                  <div className="edbcu-dropzone__file" aria-live="polite" />
                </div>
              </div>

              {/* Captcha */}
              <div className="edbcu-captcha">
                <div className="edbcu-captcha__placeholder">
                  {page.captchaPlaceholderText || 'reCAPTCHA'}
                </div>
              </div>

              {/* Submit */}
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
