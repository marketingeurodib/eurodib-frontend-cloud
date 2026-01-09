import Head from 'next/head';
import type { CSSProperties } from 'react';

export default function MailDone() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Message sent | Eurodib</title>
        <meta
          name="description"
          content="Your request has been successfully sent. Our Eurodib team will contact you shortly."
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/CSS/contact-us-v2.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
      </Head>

      <>
        {/* Banner */}
        <section
          className="brema-banner"
          style={
            {
              position: 'relative',
              width: '100%',
              height: '240px',
              overflow: 'hidden',
            } as CSSProperties
          }
        >
          <img
            src="/image/mail-done.png"
            alt="Success Banner"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </section>

        <div className="edbcu-root">
          <div className="edbcu-head" style={{ paddingBottom: '120px' }}>
            <h1 className="edbcu-head__title" style={{ fontSize: '32px' }}>
              Your request has been sent!
            </h1>

            <p
              className="edbcu-head__subtitle"
              style={{ fontSize: '24px', marginTop: '20px' }}
            >
              Our team will contact you as soon as possible.
            </p>

            <button
              className="edbcu-btn"
              type="button"
              style={{
                marginTop: '25px',
                backgroundColor: '#009CFF',
                fontSize: '18px',
                padding: '14px 40px',
              }}
              onClick={() => (window.location.href = '/')}
            >
              Go to homepage
            </button>
          </div>
        </div>
      </>

    </>
  );
}
