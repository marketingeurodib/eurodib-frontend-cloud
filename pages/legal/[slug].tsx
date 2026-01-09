import Head from 'next/head';
import Script from 'next/script';
import type { GetServerSideProps } from 'next';
import { fetchLegalPageBySlug, type LegalPage } from '../../lib/api/legalPage';
import { getLocaleFromContext } from '../../lib/utils/locale';
import Breadcrumbs from '../../components/Breadcrumbs';

interface Props {
  page: LegalPage;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const locale = getLocaleFromContext(ctx);
  const slug = String(ctx.params?.slug || '');

  const page = await fetchLegalPageBySlug(locale, slug);

  if (!page) {
    return { notFound: true };
  }

  return { props: { page } };
};

export default function LegalPageTemplate({ page }: Props) {
  const title = page.seoTitle || page.title || 'Legal';
  const description =
    page.seoDescription || "Read Eurodib's legal information and policies.";

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/CSS/main.css" />
        <link rel="stylesheet" href="/CSS/rules.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: page.title },
        ]}
      />

      <div className="background-rules"></div>

      <div className="description-page-rules">
        <h1>{page.title}</h1>
        <p>{page.intro}</p>
      </div>

      <div className="rules-info">
        <div dangerouslySetInnerHTML={{ __html: page.contentHtml }} />
      </div>

      <Script src="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js" strategy="afterInteractive" />
      <Script src="/JS/main.js" strategy="afterInteractive" />
    </>
  );
}

