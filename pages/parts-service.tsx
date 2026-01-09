import Head from 'next/head';
import Image from 'next/image';
import type { GetServerSideProps } from 'next';
import type { ChangeEvent, FormEvent } from 'react';
import { useMemo, useState } from 'react';

import { getLocaleFromContext } from '../lib/utils/locale';
import { fetchPartsServicePage, type PartsServicePageData } from '../lib/api/partsServicePage';

interface Props {
  page: PartsServicePageData;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const locale = getLocaleFromContext(ctx);
  const page = await fetchPartsServicePage(locale);
  return { props: { page } };
};

type Mode = 'parts' | 'service';

export default function PartsService({ page }: Props) {
  const requestQuoteUrl = page.requestQuoteRedirectUrl || '/request-a-quote';

  const [mode, setMode] = useState<Mode>('parts');

  // service: same as above
  const [sameName, setSameName] = useState(false);
  const [samePhone, setSamePhone] = useState(false);

  // service inputs we need to mirror
  const [firstS, setFirstS] = useState('');
  const [lastS, setLastS] = useState('');
  const [phoneS, setPhoneS] = useState('');
  const [onsiteName, setOnsiteName] = useState('');
  const [onsitePhone, setOnsitePhone] = useState('');

  // filenames
  const [partsImageName, setPartsImageName] = useState('');
  const [proofName, setProofName] = useState('');

  const subjectValue = mode === 'parts' ? 'parts-request' : 'service-request';

  const brandsFallback = useMemo(
    () => [
      { value: 'Atmovac', label: 'Atmovac' },
      { value: 'Eurodib', label: 'Eurodib' },
      { value: 'Lamber', label: 'Lamber' },
      { value: 'Dito Sama', label: 'Dito Sama' },
      { value: 'Unox', label: 'Unox' },
      { value: 'Gemm', label: 'Gemm' },
      { value: 'Krampouz', label: 'Krampouz' },
    ],
    []
  );

  const brandOptions = page.brandOptions.length ? page.brandOptions : brandsFallback;

  const computedOnsiteName = useMemo(() => {
    const v = `${firstS} ${lastS}`.trim();
    return v;
  }, [firstS, lastS]);

  // keep onsite values in sync when "same" is enabled
  const onToggleSameName = (checked: boolean) => {
    setSameName(checked);
    if (checked) {
      setOnsiteName(computedOnsiteName);
    } else {
      setOnsiteName('');
    }
  };

  const onToggleSamePhone = (checked: boolean) => {
    setSamePhone(checked);
    if (checked) {
      setOnsitePhone(phoneS);
    } else {
      setOnsitePhone('');
    }
  };

  const handleSubjectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'request-quote') {
      window.location.href = requestQuoteUrl;
      return;
    }

    // если вдруг добавишь другие значения — можно маппить сюда
    if (value === 'parts-request') setMode('parts');
    if (value === 'service-request') setMode('service');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
          return;
        }

    // Сейчас можно оставить как есть (или подключить /api/parts-service как у тебя).
    // Важно: теперь это контролируемая submit-логика, без addEventListener.
    try {
      const formData = new FormData(form);

          const res = await fetch('/api/parts-service', {
            method: 'POST',
            body: formData,
          });

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

          alert('Thank you! Your request has been submitted.');
      form.reset();

      // сброс UI
      setMode('parts');
      setSameName(false);
      setSamePhone(false);
      setFirstS('');
      setLastS('');
      setPhoneS('');
      setOnsiteName('');
      setOnsitePhone('');
      setPartsImageName('');
      setProofName('');
    } catch (err) {
      console.error('Error submitting Parts & Service form', err);
          alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/CSS/main.css" />
        <link rel="stylesheet" href="/CSS/contact-us-v2.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
        <title>{page.seoTitle || 'Parts & Service | Eurodib'}</title>
        <meta
          name="description"
          content={
            page.seoDescription ||
            'Request parts or service for your Eurodib equipment. Submit your request with equipment details, contact information and required documentation.'
          }
        />
      </Head>

        <section
          className="brema-banner"
        style={{ position: 'relative', width: '100%', height: '240px', margin: '0 auto', overflow: 'hidden' }}
      >
        {page.bannerImageUrl ? (
          <Image
            src={page.bannerImageUrl}
            alt={page.bannerAlt || 'Parts & Service banner'}
            fill
            sizes="100vw"
            priority
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <img
            src="/image/parts.png"
            alt="Parts & Service banner"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        </section>

        <div className="edbcu-root">
          <div className="edbcu-head">
          <h1 className="edbcu-head__title">{page.pageTitle || 'Parts & Service'}</h1>
            <p className="edbcu-head__subtitle">
            {page.pageSubtitle || (
              <>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              <br />
              Nullam eu orci a diam facilisis vulputate. Suspendisse maximus fusce.
              </>
            )}
            </p>
          </div>

          <section className="edbcu-section--grey">
            <div className="edbcu-container">
              <div className="edbcu-toggle" role="tablist" aria-label="Request type">
                <button
                  type="button"
                className={`edbcu-toggle__btn ${mode === 'parts' ? 'is-active' : ''}`}
                aria-selected={mode === 'parts'}
                onClick={() => setMode('parts')}
              >
                {page.tabPartsText || 'Parts request'}
                </button>
                <button
                  type="button"
                className={`edbcu-toggle__btn ${mode === 'service' ? 'is-active' : ''}`}
                aria-selected={mode === 'service'}
                onClick={() => setMode('service')}
              >
                {page.tabServiceText || 'Service request'}
                </button>
              </div>

              <form
                id="edbcu-form"
                className="edbcu-form"
                action="#"
                method="post"
                noValidate
                encType="multipart/form-data"
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
                    required
                  value={subjectValue}
                  onChange={handleSubjectChange}
                  >
                    <option value="parts-request">Parts request</option>
                    <option value="service-request">Service request</option>

                  {/* если решишь добавить */}
                  {/* <option value="request-quote">Request a quote</option> */}
                </select>
              </div>

              {/* PARTS */}
              <fieldset id="edbcu-pane-parts" className={`edbcu-group ${mode !== 'parts' ? 'is-hidden' : ''}`} disabled={mode !== 'parts'}>
                <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-brand-p">Brand*</label>
                  <select className="edbcu-control edbcu-select" id="edbcu-brand-p" name="brand_parts" required>
                    {brandOptions.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>

                  <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-serial-p">Serial number*</label>
                  <input className="edbcu-control" type="text" id="edbcu-serial-p" name="serial_parts" required />
                  </div>

                  <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-model-p">Model*</label>
                  <input className="edbcu-control" type="text" id="edbcu-model-p" name="model_parts" required />
                  </div>

                  <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-company-p">Company name*</label>
                  <input className="edbcu-control" type="text" id="edbcu-company-p" name="company_parts" required />
                  </div>

                  <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-first-p">First name*</label>
                  <input className="edbcu-control" type="text" id="edbcu-first-p" name="first_name_parts" required />
                  </div>

                  <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-last-p">Last name*</label>
                  <input className="edbcu-control" type="text" id="edbcu-last-p" name="last_name_parts" required />
                  </div>

                  <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-email-p">Email*</label>
                  <input className="edbcu-control" type="email" id="edbcu-email-p" name="email_parts" required />
                  </div>

                  <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-phone-p">Phone*</label>
                  <input className="edbcu-control" type="tel" id="edbcu-phone-p" name="phone_parts" required />
                  </div>

                  <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-desc-part">Description of the part required*</label>
                  <textarea className="edbcu-control edbcu-textarea" id="edbcu-desc-part" name="desc_part" required />
                  </div>

                  <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-attach-img">Join an image*</label>
                    <div className="edbcu-dropzone">
                      <input
                        id="edbcu-attach-img"
                        name="image_parts"
                        type="file"
                        accept="image/*"
                        required
                      onChange={(e) => setPartsImageName(e.target.files?.[0]?.name || '')}
                    />
                    <div className="edbcu-dropzone__file" aria-live="polite">
                      {partsImageName}
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* SERVICE */}
              <fieldset id="edbcu-pane-service" className={`edbcu-group ${mode !== 'service' ? 'is-hidden' : ''}`} disabled={mode !== 'service'}>
                  <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-brand-s">Brand*</label>
                  <select className="edbcu-control edbcu-select" id="edbcu-brand-s" name="brand_service" required>
                    {brandOptions.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                    </select>
                  </div>

                  <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-serial-s">Serial number*</label>
                  <input className="edbcu-control" type="text" id="edbcu-serial-s" name="serial_service" required />
                  </div>

                  <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-model-s">Model*</label>
                  <input className="edbcu-control" type="text" id="edbcu-model-s" name="model_service" required />
                  </div>

                  <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-company-s">Company name*</label>
                  <input className="edbcu-control" type="text" id="edbcu-company-s" name="company_service" required />
                  </div>

                  <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-address-s">Address*</label>
                  <input className="edbcu-control" type="text" id="edbcu-address-s" name="address_service" required />
                  </div>

                  <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-first-s">First name*</label>
                    <input
                      className="edbcu-control"
                      type="text"
                      id="edbcu-first-s"
                      name="first_name_service"
                      required
                    value={firstS}
                    onChange={(e) => {
                      setFirstS(e.target.value);
                      if (sameName) setOnsiteName(`${e.target.value} ${lastS}`.trim());
                    }}
                    />
                  </div>

                  <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-last-s">Last name*</label>
                    <input
                      className="edbcu-control"
                      type="text"
                      id="edbcu-last-s"
                      name="last_name_service"
                      required
                    value={lastS}
                    onChange={(e) => {
                      setLastS(e.target.value);
                      if (sameName) setOnsiteName(`${firstS} ${e.target.value}`.trim());
                    }}
                    />
                  </div>

                  <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-email-s">Email*</label>
                  <input className="edbcu-control" type="email" id="edbcu-email-s" name="email_service" required />
                  </div>

                  <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-phone-s">Phone*</label>
                    <input
                      className="edbcu-control"
                      type="tel"
                      id="edbcu-phone-s"
                      name="phone_service"
                      required
                    value={phoneS}
                    onChange={(e) => {
                      setPhoneS(e.target.value);
                      if (samePhone) setOnsitePhone(e.target.value);
                    }}
                    />
                  </div>

                  <div className="edbcu-field">
                    <span className="edbcu-label">Onsite contact name*</span>
                    <label className="edbcu-inline">
                    <input
                      className="edbcu-check"
                      type="checkbox"
                      checked={sameName}
                      onChange={(e) => onToggleSameName(e.target.checked)}
                    />
                      <span>Same as above</span>
                    </label>
                    <input
                      className="edbcu-control"
                      type="text"
                      id="edbcu-onsite-name"
                      name="onsite_name"
                      required
                    value={sameName ? computedOnsiteName : onsiteName}
                    disabled={sameName}
                    onChange={(e) => setOnsiteName(e.target.value)}
                    />
                  </div>

                  <div className="edbcu-field">
                    <span className="edbcu-label">Onsite contact phone*</span>
                    <label className="edbcu-inline">
                    <input
                      className="edbcu-check"
                      type="checkbox"
                      checked={samePhone}
                      onChange={(e) => onToggleSamePhone(e.target.checked)}
                    />
                      <span>Same as above</span>
                    </label>
                    <input
                      className="edbcu-control"
                      type="tel"
                      id="edbcu-onsite-phone"
                      name="onsite_phone"
                      required
                    value={samePhone ? phoneS : onsitePhone}
                    disabled={samePhone}
                    onChange={(e) => setOnsitePhone(e.target.value)}
                    />
                  </div>

                  <div className="edbcu-field">
                  <label className="edbcu-label" htmlFor="edbcu-desc-problem">Description of the problem*</label>
                  <textarea className="edbcu-control edbcu-textarea" id="edbcu-desc-problem" name="desc_problem" required />
                  </div>

                  <div className="edbcu-field">
                    <div className="edbcu-note">
                      Providing your proof of purchase is a requirement of warranty fulfillment.*
                    </div>
                    <div className="edbcu-dropzone">
                      <input
                        id="edbcu-proof"
                        name="proof_service"
                        type="file"
                        accept="application/pdf,image/*"
                        required
                      onChange={(e) => setProofName(e.target.files?.[0]?.name || '')}
                    />
                    <div className="edbcu-dropzone__file" aria-live="polite">
                      {proofName}
                    </div>
                  </div>
                </div>
              </fieldset>

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
