import Head from 'next/head';
import Link from 'next/link';

export default function Custom500() {
  return (
    <>
      <Head>
        <title>Something went wrong | Eurodib</title>
        <meta
          name="description"
          content="We encountered an error processing your request. Please try again or contact us if the problem persists."
        />
        <link rel="stylesheet" href="/CSS/main.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
      </Head>

      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '64px', fontWeight: 700, color: '#dc2626', marginBottom: '16px' }}>500</h1>
          <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '16px', color: '#1f2937' }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '32px', lineHeight: '1.6' }}>
            We encountered an error processing your request. Our team has been notified and is working to fix the issue.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                backgroundColor: '#286AB8',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '16px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1e4d8c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#286AB8';
              }}
            >
              Go back home
            </Link>
            <Link
              href="/contact-v2"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                backgroundColor: 'transparent',
                color: '#286AB8',
                textDecoration: 'none',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '16px',
                border: '2px solid #286AB8',
                transition: 'background-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#286AB8';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#286AB8';
              }}
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

