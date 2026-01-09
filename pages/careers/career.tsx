import Head from 'next/head';
import Image from 'next/image';
import type { GetServerSideProps } from 'next';
import { FormEvent, useState, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getLocaleFromContext } from '../../lib/utils/locale';
import { fetchCareerPage, type CareerPageData } from '../../lib/api/careerPage';

interface Props {
  page: CareerPageData;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const locale = getLocaleFromContext(ctx);
  const page = await fetchCareerPage(locale);
  return { props: { page } };
};

export default function CareerV2({ page }: Props) {
  const router = useRouter();

  const defaultSubject = page.subjectOptions[0]?.value || 'job-application';
  const [subject, setSubject] = useState(defaultSubject);

  // если locale сменился и пришёл другой defaultSubject
  useEffect(() => {
    setSubject(defaultSubject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSubject]);

  const requestQuoteUrl = page.requestQuoteRedirectUrl || '/request-a-quote';

  const handleSubjectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'request-quote') {
      router.push(requestQuoteUrl);
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

    alert('Form is ready. Connect backend/CRM to submit.');
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

  const departmentOptions =
    page.departmentOptions.length > 0
      ? page.departmentOptions
      : [
          { value: 'sales', label: 'Sales' },
          { value: 'customer-service', label: 'Customer Service' },
          { value: 'warehouse', label: 'Warehouse' },
          { value: 'accounting', label: 'Accounting' },
          { value: 'marketing', label: 'Marketing' },
        ];

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{page.seoTitle || 'Careers | Eurodib'}</title>
        <meta
          name="description"
          content={
            page.seoDescription ||
            'Apply for a career opportunity at Eurodib. Join a North American leader in professional kitchen equipment and help deliver quality and innovation across Canada and the USA.'
          }
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/CSS/contact-us-v2.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
      </Head>

      {/* Banner */}
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
          src={page.bannerImageUrl || '/image/career.png'}
          alt={page.bannerAlt || 'Careers at Eurodib'}
          fill
          sizes="100vw"
          priority
          style={{ objectFit: 'cover' }}
        />
      </section>

      <div className="edbcu-root">
        <div className="edbcu-head">
          <h1 className="edbcu-head__title">{page.pageTitle || 'Careers'}</h1>

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
              Join a North American leader in professional kitchen equipment. Help us deliver quality,
              innovation, and reliable service to dealers and end-users across Canada &amp; the USA.
            </p>
          )}
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
                  value={subject}
                  onChange={handleSubjectChange}
                  required
                >
                  {subjectOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-department">
                  {page.departmentLabel || 'Department*'}
                </label>
                <select
                  className="edbcu-control edbcu-select"
                  id="edbcu-department"
                  name="department"
                  defaultValue={departmentOptions[0]?.value || 'sales'}
                  required
                >
                  {departmentOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* First / Last / Email / Phone */}
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

              {/* LinkedIn */}
              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-linkedin">
                  Linkedin profile
                </label>
                <input
                  className="edbcu-control"
                  type="url"
                  id="edbcu-linkedin"
                  name="linkedin"
                  placeholder="https://www.linkedin.com/in/…"
                />
              </div>

              {/* Auth to work in Canada */}
              <div className="edbcu-field">
                <span className="edbcu-label">
                  As of today, are you legally authorized to work in Canada?
                </span>
                <div className="edbcu-inline">
                  <label className="edbcu-radio">
                    <input type="radio" name="authorized_ca" value="yes" defaultChecked required />
                    <span>Yes</span>
                  </label>
                  <label className="edbcu-radio">
                    <input type="radio" name="authorized_ca" value="no" required />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {/* Resume upload */}
              <div className="edbcu-field">
                <label className="edbcu-label" htmlFor="edbcu-resume">
                  {page.resumeLabel || 'Join your resume (10 Mb maximum)*'}
                </label>
                <div id="edbcu-drop" className="edbcu-dropzone">
                  <input
                    id="edbcu-resume"
                    name="resume"
                    type="file"
                    accept="application/pdf,.pdf"
                    required
                  />

                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M12 16a1 1 0 0 1-1-1V7.83L8.41 10.4a1 1 0 1 1-1.41-1.42l4-4a1 1 0 0 1 1.41 0l4 4a1 1 0 1 1-1.41 1.42L13 7.83V15a1 1 0 0 1-1 1Zm-6 3a2 2 0 0 1-2-2V14a1 1 0 1 1 2 0v3h12v-3a1 1 0 1 1 2 0v3a2 2 0 0 1-2 2H6Z"
                    />
                  </svg>

                  <div className="edbcu-dropzone__texts">
                    <div className="edbcu-dropzone__main">
                      Drag &amp; drop or <span className="edbcu-browse">browse</span>
                    </div>
                    <div className="edbcu-dropzone__hint">(PDF files only)</div>
                  </div>

                  <div className="edbcu-dropzone__file" aria-live="polite"></div>
                </div>
              </div>

              {/* Legal */}
              <div className="edbcu-field edbcu-legal">
                <label>
                  <input type="checkbox" name="consent" required />{' '}
                  {page.consentText ? (
                    <span dangerouslySetInnerHTML={{ __html: page.consentText }} />
                  ) : (
                    <>
                      By submitting this form, you consent to Eurodib collecting, using and storing your personal information in accordance with our{' '}
                      <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">privacy policy</a>{' '}
                      and current legal requirements.
                    </>
                  )}
                </label>
              </div>

              <div className="edbcu-field edbcu-legal">
                <label>
                  <input type="checkbox" name="truthful" required />{' '}
                  {page.truthfulText || 'I declare that the information provided is complete and true.'}
                </label>
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
