import Head from 'next/head';
import Image from 'next/image';
import type { GetServerSideProps } from 'next';
import { fetchAboutUs, type AboutUsPage } from '../lib/api/aboutUs';
import { getLocaleFromContext } from '../lib/utils/locale';

interface Props {
  page: AboutUsPage;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const locale = getLocaleFromContext(ctx);
  
  try {
    const page = await fetchAboutUs(locale);
    return { props: { page } };
  } catch (error: any) {
    console.error('[ABOUT-US PAGE] Error in getServerSideProps:', error);
    // Возвращаем дефолтные значения, чтобы страница не упала
    const page: AboutUsPage = {
      seoTitle: null,
      seoDescription: null,
      heroTitle: null,
      ourStorySubtitle: null,
      ourStoryTitle: null,
      ourStoryText: null,
      historyTitle: null,
      historyText: null,
      innovationItems: [],
      stats: [],
      presenceBlocks: [],
      presenceImageUrl: null,
      locale: locale,
    };
    return { props: { page } };
  }
};

export default function AboutUs({ page }: Props) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{page.seoTitle || 'About Us | Eurodib'}</title>
        <meta
          name="description"
          content={page.seoDescription || 'Learn about Eurodib: 30+ years of expertise in commercial kitchen equipment. Leading distributor of professional appliances across North America.'}
        />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/CSS/about-us.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
      </Head>

      <section className="about-hero">
        <h1 className="visually-hidden">{page.heroTitle || 'About Eurodib'}</h1>
      </section>
        <section className="our-story">
          <div className="container">
            {page.ourStorySubtitle && (
              <h3 className="story-subtitle">{page.ourStorySubtitle}</h3>
            )}
            {page.ourStoryTitle && (
              <h2 className="story-title">{page.ourStoryTitle}</h2>
            )}
            {page.ourStoryText && (
              <p className="story-text">{page.ourStoryText}</p>
            )}
          </div>
        </section>
        <section className="history">
          <div className="container">
            <div className="history__grid">
              <div className="history__image">
                <Image
                  src="/image/5ff60029786164e3694940691862fd8b0dfe3953.png"
                  alt="Eurodib founders and early team"
                  width={600}
                  height={400}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
              <div className="history__content">
                {page.historyTitle && (
                  <h2>{page.historyTitle}</h2>
                )}
                {page.historyText && (
                  <p>{page.historyText}</p>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="innovation">
          <div className="container">
            {page.innovationItems?.map((item, idx) => (
              <div className="innovation__item" key={idx}>
                {item.title && <h3>{item.title}</h3>}
                {item.text && <p>{item.text}</p>}
              </div>
            ))}
          </div>
        </section>
        <section className="stats">
          <div className="container">
            {page.stats?.map((s, idx) => (
              <div className="stat-item" key={idx}>
                {s.value && <h2>{s.value}</h2>}
                {s.label && <p style={{ whiteSpace: 'pre-line' }}>{s.label}</p>}
              </div>
            ))}
          </div>
        </section>
        <section className="presence">
          <div className="container">
            <div className="presence__grid">
              <div className="presence__content">
                {page.presenceBlocks?.map((b, idx) => (
                  <div key={idx}>
                    {b.title && <h3>{b.title}</h3>}
                    {b.text && <p>{b.text}</p>}
                  </div>
                ))}
              </div>

              <div className="presence__image">
                <Image
                  src={page.presenceImageUrl || '/image/Photo-chef.png'}
                  alt="Professional chef working with Eurodib equipment in a commercial kitchen"
                  width={600}
                  height={400}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Email Signup Section */}
    </>
  );
}

